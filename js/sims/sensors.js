/* FizLab tool: Phone Sensors — the microphone and the motion sensors as measuring instruments:
   (a) sound stopwatch (time between two loud sounds), (b) loudness and pitch, (c) tilt meter, (d) acceleration.
   Every sensor is feature-detected, asked for only after a button press, and released again in reset() and destroy(). */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, V_SOUND = 340, DEAD = 0.1, FFT = 8192, HIST = 5, WINDOW = 10;
  const MODES = [
    { value: 'clap', label: { en: 'Sound stopwatch', hr: 'Zvučna štoperica' } },
    { value: 'pitch', label: { en: 'Loudness and pitch', hr: 'Glasnoća i visina tona' } },
    { value: 'tilt', label: { en: 'Tilt meter', hr: 'Kutomjer nagiba' } },
    { value: 'accel', label: { en: 'Acceleration', hr: 'Akceleracija' } }
  ];
  const NEED = { en: 'This needs a phone or tablet with the sensor and your permission. Open FizLab in your phone\'s browser.', hr: 'Za ovo treba mobitel ili tablet sa senzorom i tvoje dopuštenje. Otvori FizLab u pregledniku na mobitelu.' };
  const NEED_HTTPS = { en: ' Sensors only work on a secure (https) page.', hr: ' Senzori rade samo na sigurnoj (https) stranici.' };
  const MIC_ON = { en: 'Enable microphone', hr: 'Uključi mikrofon' }, MIC_OFF = { en: 'Turn microphone off', hr: 'Isključi mikrofon' };
  const MOT_ON = { en: 'Enable motion sensors', hr: 'Uključi senzore gibanja' }, MOT_OFF = { en: 'Turn sensors off', hr: 'Isključi senzore' };
  const ARM = { en: 'Arm', hr: 'Pripremi' }, CANCEL = { en: 'Cancel', hr: 'Odustani' }, HOLD = { en: 'Hold', hr: 'Zamrzni' }, RESUME = { en: 'Resume', hr: 'Nastavi' };
  const WAIT_PERM = { en: 'Waiting for your permission…', hr: 'Čekam tvoje dopuštenje…' }, WAIT_DATA = { en: 'Waiting for sensor data…', hr: 'Čekam podatke senzora…' };
  const CLAP = {
    off: { en: 'Enable the microphone, then press Arm.', hr: 'Uključi mikrofon, a zatim pritisni Pripremi.' },
    first: { en: 'Enable the microphone first.', hr: 'Najprije uključi mikrofon.' },
    idle: { en: 'Set the threshold just above the room noise, then press Arm.', hr: 'Namjesti prag malo iznad buke u sobi, a zatim pritisni Pripremi.' },
    armed: { en: 'Armed: the first loud sound starts the clock…', hr: 'Spremno: prvi glasan zvuk pokreće mjerenje…' },
    timing: { en: 'Timing… the next loud sound stops the clock.', hr: 'Mjerim… sljedeći glasan zvuk zaustavlja mjerenje.' },
    done: { en: 'Time between the two sounds. Press Arm to measure again.', hr: 'Vrijeme između dva zvuka. Pritisni Pripremi za novo mjerenje.' }
  };
  const NAMES = { en: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'], hr: ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'ais', 'h'] };
  const SUP = ['', '¹', '²', '³', '⁴', '⁵'];

  function el(tag, cls, parent) { const e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  const bi = f => ({ en: f('en'), hr: f('hr') });
  function noteName(f, lang) { // nearest note with A4 = 440 Hz; English "A4", Croatian "a¹"
    const n = Math.round(12 * Math.log2(f / 440)), idx = ((n + 9) % 12 + 12) % 12, oct = 4 + Math.floor((n + 9) / 12);
    if (lang !== 'hr') return NAMES.en[idx] + oct;
    const nm = NAMES.hr[idx];
    return oct >= 3 ? nm + (SUP[oct - 3] || '') : nm.charAt(0).toUpperCase() + nm.slice(1) + (oct === 2 ? '' : oct === 1 ? '₁' : '₂');
  }
  const tiltOf = (b, g) => Math.acos(K.clamp(Math.cos(b * Math.PI / 180) * Math.cos(g * Math.PI / 180), -1, 1)) * 180 / Math.PI;   // angle between the screen and the horizontal

  window.Sims.register({
    id: 'sensors',
    title: { en: 'Phone Sensors', hr: 'Senzori mobitela' },
    summary: {
      en: 'Turn your phone into a measuring instrument: time the gap between two sounds, find the pitch of a whistle, measure the angle of a ramp and watch acceleration live.',
      hr: 'Pretvori mobitel u mjerni instrument: izmjeri vrijeme između dva zvuka, odredi visinu tona zvižduka, izmjeri kut kosine i prati akceleraciju uživo.'
    },
    tasks: [
      { en: 'Sound stopwatch: knock a coin off the table edge with a ruler. The knock starts the clock, the landing stops it. Type the table height and compare your g with 9.81 m/s².', hr: 'Zvučna štoperica: ravnalom izbij kovanicu s ruba stola. Udarac pokreće mjerenje, a pad ga zaustavlja. Upiši visinu stola i usporedi svoj g s 9,81 m/s².' },
      { en: 'Pitch: fill three glasses with different amounts of water and tap each one. Which gives the highest frequency?', hr: 'Visina tona: napuni tri čaše različitim količinama vode i kucni svaku. Koja daje najveću frekvenciju?' },
      { en: 'Tilt meter: build a ramp from a book and a board. Measure its angle, then make it twice as steep.', hr: 'Kutomjer nagiba: napravi kosinu od knjige i daske. Izmjeri joj kut, a zatim je napravi dvostruko strmijom.' },
      { en: 'Acceleration: lay the phone flat on the table. What does it show, and why is it not zero?', hr: 'Akceleracija: položi mobitel na stol. Što pokazuje i zašto to nije nula?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme, mode = 'clap', dead = false, lastDom = 0, lastState = 'idle';
      const texts = new Map();                         // element -> {en, hr}; re-applied in setLang
      const T = (e, o) => { texts.set(e, o); e.textContent = K.tr(o, lang); return e; };
      const bigBtn = (parent, label, primary) => {
        const b = el('button', 'sk-btn' + (primary ? ' primary' : ''), parent);
        b.type = 'button'; b.style.minHeight = '50px'; b.style.flex = '1 1 130px'; b.style.whiteSpace = 'normal';
        return T(b, label);
      };
      const mic = { on: false, pending: false, gen: 0, stream: null, ac: null, src: null, an: null, td: null, fd: null, bytes: null, last: 0, hold: 0, hist: [] };
      const clap = { state: 'idle', thr: 0.2, from: 0, t1: 0, t2: 0, end: 0, ms: null, hint: false };
      const pit = { f: null, db: null };
      const mot = { on: false, got: false, pending: false, gen: 0, timer: 0 };
      const tilt = { b: 0, g: 0, zb: 0, zg: 0 };
      const acc = { held: false, holdT: 0, t: [], m: [], x: [], y: [], z: [], cur: null, lin: null, max: null, min: null, v: null };

      // ---------- DOM ----------
      const C0 = K.controls(container, lang);
      C0.segmented({ label: { en: 'Tool', hr: 'Alat' }, options: MODES, value: mode, onChange: setMode });
      const panel = el('div', 'sk-panel', container);
      const disp = el('div', 'sk-big', panel), sub = el('div', '', panel); sub.style.textAlign = 'center';
      const row = el('div', 'sk-row', panel);
      const bMic = bigBtn(row, MIC_ON, true), bArm = bigBtn(row, ARM), bMotion = bigBtn(row, MOT_ON, true);
      const bZero = bigBtn(row, { en: 'Set zero', hr: 'Postavi nulu' }), bHold = bigBtn(row, HOLD);
      const msg = el('div', 'sk-msg', panel); msg.hidden = true;
      bMic.addEventListener('click', () => { if (mic.on) { stopMic(); render(); syncLoop(); } else startMic().catch(() => {}); });
      bArm.addEventListener('click', arm);
      bMotion.addEventListener('click', () => { if (mot.on) { stopMotion(); render(); syncLoop(); } else startMotion(mode === 'tilt' ? 'tilt' : 'accel').catch(() => {}); });
      bZero.addEventListener('click', () => { tilt.zb = tilt.b; tilt.zg = tilt.g; render(); draw(); });
      bHold.addEventListener('click', () => { acc.held = !acc.held; if (acc.held) acc.holdT = performance.now(); else clearAcc(false); render(); draw(); });

      const cv = K.createCanvas(container, { aspect: 2, minHeight: 240, maxHeight: 360 });
      const C1 = K.controls(container, lang), C2 = K.controls(container, lang), C3 = K.controls(container, lang), C4 = K.controls(container, lang);
      const slThr = C1.slider({ label: { en: 'Threshold (how loud counts)', hr: 'Prag (koliko glasno se računa)' }, min: 2, max: 100, step: 1, value: 20, unit: '%', digits: 0, onChange: v => { clap.thr = v / 100; draw(); } });
      const inH = C1.input({ label: { en: 'Free fall: height h', hr: 'Slobodni pad: visina h' }, type: 'number', unit: 'cm', placeholder: { en: 'e.g. 75', hr: 'npr. 75' }, onChange: () => { renderLive(); } });
      const outG = C1.readout({ label: 'g = 2h : t²', unit: 'm/s²', digits: 2 });
      const outGd = C1.readout({ label: { en: 'Difference from 9.81 m/s²', hr: 'Razlika od 9,81 m/s²' }, unit: '%', digits: 1 });
      const outEcho = C1.readout({ label: { en: 'Echo: distance to the wall, 340 m/s · t : 2', hr: 'Jeka: udaljenost zida, 340 m/s · t : 2' }, unit: 'm', digits: 1 });
      C1.note({ text: { en: 'Free fall: put a coin on the table edge and knock it off sideways with a ruler. The knock starts the clock, the landing stops it (sounds closer than 0.1 s are ignored). Type the height of the table to get g = 2h : t². Or time an echo: clap in front of a big wall at least 17 m away.',
        hr: 'Slobodni pad: stavi kovanicu na rub stola i izbij je ravnalom u stranu. Udarac pokreće mjerenje, a pad na pod ga zaustavlja (zvukovi u razmaku manjem od 0,1 s se zanemaruju). Upiši visinu stola i dobivaš g = 2h : t². Ili izmjeri jeku: pljesni pred velikim zidom udaljenim barem 17 m.' } });
      const outDb = C2.readout({ label: { en: 'Relative loudness (not calibrated)', hr: 'Relativna glasnoća (nije baždareno)' }, unit: 'dB', digits: 0 });
      const outF = C2.readout({ label: { en: 'Strongest frequency', hr: 'Najjača frekvencija' }, unit: 'Hz', digits: 0 });
      const outNote = C2.readout({ label: { en: 'Nearest note', hr: 'Najbliži ton' } });
      C2.note({ text: { en: 'The loudness is relative, not calibrated: use it only to compare sounds measured with the same device. Ideas: whistle, sing a steady note, tap glasses filled with water to different levels, or check a tone from the Tone Generator on another device.',
        hr: 'Glasnoća je relativna, nije baždarena: služi samo za usporedbu zvukova izmjerenih istim uređajem. Ideje: zviždi, otpjevaj jednoličan ton, kucni čaše napunjene vodom do različitih visina ili provjeri ton iz Generatora tona na drugom uređaju.' } });
      const outB = C3.readout({ label: { en: 'Front–back tilt β', hr: 'Nagib naprijed–natrag β' }, unit: '°', digits: 1 });
      const outGm = C3.readout({ label: { en: 'Left–right tilt γ', hr: 'Nagib lijevo–desno γ' }, unit: '°', digits: 1 });
      const outTh = C3.readout({ label: { en: 'Angle of the ramp θ', hr: 'Kut kosine θ' }, unit: '°', digits: 1 });
      C3.note({ text: { en: 'Lay the phone flat on a ramp to read its angle, for example for a rolling-ball experiment. First lay it on the table and press "Set zero".',
        hr: 'Položi mobitel na kosinu i očitaj njezin kut, na primjer za pokus s kuglicom koja se kotrlja. Najprije ga položi na stol i pritisni „Postavi nulu”.' } });
      const outA = C4.readout({ label: { en: 'Acceleration |a| now', hr: 'Akceleracija |a| sada' }, unit: 'm/s²', digits: 2 });
      const outMax = C4.readout({ label: { en: 'Largest |a|', hr: 'Najveća |a|' }, unit: 'm/s²', digits: 2 });
      const outMin = C4.readout({ label: { en: 'Smallest |a|', hr: 'Najmanja |a|' }, unit: 'm/s²', digits: 2 });
      const outLin = C4.readout({ label: { en: 'Without gravity', hr: 'Bez sile teže' }, unit: 'm/s²', digits: 2 });
      C4.note({ text: { en: 'Lying still, the phone shows about 9.8 m/s²: that is gravity (g). Ideas: ride a lift, jump while holding the phone tightly, or swing it gently on a string as a pendulum, carefully and over something soft.',
        hr: 'Dok miruje, mobitel pokazuje oko 9,8 m/s²: to je ubrzanje sile teže (g). Ideje: vozi se dizalom, skoči čvrsto držeći mobitel ili ga lagano zanjiši na uzici kao njihalo, oprezno i iznad nečeg mekog.' } });

      function fail() { // the one friendly message for "no sensor / no permission"
        const insecure = window.isSecureContext === false;
        T(msg, bi(l => K.tr(NEED, l) + (insecure ? K.tr(NEED_HTTPS, l) : ''))); msg.hidden = false;
      }

      // ---------- microphone ----------
      function stopMic() { // stop the tracks, close the AudioContext, forget any permission answer still on its way
        mic.gen++; mic.on = mic.pending = false;
        if (mic.stream) { try { mic.stream.getTracks().forEach(t => { t.onended = null; t.stop(); }); } catch (e) { /* ignore */ } }
        if (mic.src) { try { mic.src.disconnect(); } catch (e) { /* ignore */ } }
        if (mic.ac) { try { const p = mic.ac.close(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* ignore */ } }
        mic.stream = mic.ac = mic.src = mic.an = mic.td = mic.fd = mic.bytes = null; mic.hold = 0; mic.hist = [];
        if (clap.state === 'armed' || clap.state === 'timing') clap.state = 'idle';
        pit.f = pit.db = null;
      }
      async function startMic() {
        if (mic.on || mic.pending) return;
        const AC = window.AudioContext || window.webkitAudioContext, md = navigator.mediaDevices;
        if (window.isSecureContext === false || !md || !md.getUserMedia || !AC) { fail(); return; }
        const my = ++mic.gen; let ac = null, stream = null;
        mic.pending = true; clap.hint = false; msg.hidden = true; render();
        try {
          ac = new AC();                                             // created inside the button press, before the permission question
          if (ac.state === 'suspended' && ac.resume) { const p = ac.resume(); if (p && p.catch) p.catch(() => {}); }
          stream = await md.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
          if (dead || my !== mic.gen) throw new Error('stale');
          const src = ac.createMediaStreamSource(stream), an = ac.createAnalyser();
          an.fftSize = FFT; an.smoothingTimeConstant = 0.6; src.connect(an);
          stream.getTracks().forEach(t => { t.onended = () => { if (mic.stream === stream) { stopMic(); fail(); render(); syncLoop(); } }; });
          Object.assign(mic, { on: true, pending: false, stream, ac, src, an, td: new Float32Array(an.fftSize), fd: new Float32Array(an.frequencyBinCount), bytes: new Uint8Array(an.fftSize), last: ac.currentTime, hold: 0, hist: [] });
        } catch (e) {
          if (stream) { try { stream.getTracks().forEach(t => t.stop()); } catch (e2) { /* ignore */ } }
          if (ac) { try { const p = ac.close(); if (p && p.catch) p.catch(() => {}); } catch (e2) { /* ignore */ } }
          if (dead || my !== mic.gen) return;                        // reset or destroyed while the question was open
          mic.pending = false; fail();
        }
        render(); syncLoop();
      }
      function micFrame() {
        const ac = mic.ac, an = mic.an, td = mic.td, N = td.length, sr = ac.sampleRate, now = ac.currentTime;
        if (an.getFloatTimeDomainData) an.getFloatTimeDomainData(td);
        else { an.getByteTimeDomainData(mic.bytes); for (let i = 0; i < N; i++) td[i] = (mic.bytes[i] - 128) / 128; }
        const fresh = Math.min(N, Math.max(0, Math.round((now - mic.last) * sr)));   // samples that arrived since the last frame
        mic.last = now;
        let peak = 0;
        for (let i = N - fresh; i < N; i++) {
          const a = Math.abs(td[i]); if (a > peak) peak = a;
          if (a < clap.thr || mode !== 'clap') continue;
          // The sample's own time on the audio clock: much finer than one screen frame, which is all performance.now() could give here.
          const t = now - (N - 1 - i) / sr;
          if (clap.state === 'armed' && t >= clap.from) { clap.state = 'timing'; clap.t1 = t; }
          else if (clap.state === 'timing' && t - clap.t1 >= DEAD) { clap.state = 'done'; clap.t2 = t; clap.ms = (t - clap.t1) * 1000; clap.end = now; }
        }
        mic.hold = Math.max(peak, mic.hold * 0.9);
        if (mode === 'clap') {
          if (fresh && clap.state !== 'done') { mic.hist.push(now, peak); while (mic.hist.length && now - mic.hist[0] > HIST) mic.hist.splice(0, 2); }
          return;
        }
        let sum = 0; for (let i = 0; i < N; i++) sum += td[i] * td[i];
        pit.db = Math.max(0, 20 * Math.log10(Math.sqrt(sum / N)) + 100);            // relative scale only: 100 dB = full scale of this microphone
        an.getFloatFrequencyData(mic.fd);
        const fd = mic.fd, hz = sr / an.fftSize, k0 = Math.max(1, Math.ceil(60 / hz)), k1 = Math.min(fd.length - 2, Math.floor(6000 / hz));
        let k = k0; for (let i = k0; i <= k1; i++) if (fd[i] > fd[k]) k = i;
        const a = fd[k - 1], b = fd[k], c = fd[k + 1], den = a - 2 * b + c;          // parabola through the peak bin and its two neighbours
        pit.f = b > -75 && Number.isFinite(a) && Number.isFinite(c) ? (k + (den ? K.clamp(0.5 * (a - c) / den, -0.5, 0.5) : 0)) * hz : null;
      }
      function arm() {
        if (!mic.on) { clap.hint = true; render(); return; }
        if (clap.state === 'armed' || clap.state === 'timing') clap.state = 'idle';
        else { clap.state = 'armed'; clap.ms = null; clap.from = mic.ac.currentTime + 0.4; mic.hist = []; }   // 0.4 s grace: the tap on the button is not the first sound
        render(); draw();
      }

      // ---------- motion sensors ----------
      function onOri(e) { if (typeof e.beta !== 'number' || typeof e.gamma !== 'number') return; mot.got = true; tilt.b = e.beta; tilt.g = e.gamma; }
      function onMot(e) {
        const a = e.accelerationIncludingGravity, l = e.acceleration;
        if (!a || typeof a.x !== 'number' || typeof a.y !== 'number' || typeof a.z !== 'number') return;
        mot.got = true; if (acc.held) return;
        const t = performance.now(), m = Math.hypot(a.x, a.y, a.z);
        acc.cur = m; acc.v = [a.x, a.y, a.z]; acc.lin = l && typeof l.x === 'number' ? Math.hypot(l.x, l.y || 0, l.z || 0) : null;
        acc.max = acc.max === null ? m : Math.max(acc.max, m); acc.min = acc.min === null ? m : Math.min(acc.min, m);
        acc.t.push(t); acc.m.push([0, m]); acc.x.push([0, a.x]); acc.y.push([0, a.y]); acc.z.push([0, a.z]);
        while (acc.t.length > 1 && (t - acc.t[0] > WINDOW * 1000 || acc.t.length > 1500)) { acc.t.shift(); acc.m.shift(); acc.x.shift(); acc.y.shift(); acc.z.shift(); }
      }
      function clearAcc(all) { acc.t = []; acc.m = []; acc.x = []; acc.y = []; acc.z = []; if (all) { acc.held = false; acc.cur = acc.lin = acc.max = acc.min = acc.v = null; } }
      function stopMotion() {
        mot.gen++; mot.on = mot.got = mot.pending = false;
        window.removeEventListener('deviceorientation', onOri); window.removeEventListener('devicemotion', onMot);
        clearTimeout(mot.timer); mot.timer = 0;
      }
      async function startMotion(kind) {
        if (mot.on || mot.pending) return;
        const Ev = kind === 'tilt' ? window.DeviceOrientationEvent : window.DeviceMotionEvent;
        if (window.isSecureContext === false || !Ev) { fail(); return; }
        const my = ++mot.gen; msg.hidden = true;
        if (typeof Ev.requestPermission === 'function') {           // iOS asks the user, and only from inside a button press
          mot.pending = true; render();
          let res = 'denied';
          try { res = await Ev.requestPermission(); } catch (e) { res = 'denied'; }
          if (dead || my !== mot.gen) return;
          mot.pending = false;
          if (res !== 'granted') { fail(); render(); return; }
        }
        mot.on = true; mot.got = false;
        window.addEventListener(kind === 'tilt' ? 'deviceorientation' : 'devicemotion', kind === 'tilt' ? onOri : onMot);
        // a desktop browser knows the event but never sends real numbers: give up after 1.5 s
        mot.timer = setTimeout(() => { mot.timer = 0; if (dead || mot.got) return; stopMotion(); fail(); render(); syncLoop(); }, 1500);
        render(); syncLoop();
      }

      // ---------- text ----------
      function status() {
        if (mode === 'clap' || mode === 'pitch') {
          if (mic.pending) return WAIT_PERM;
          if (!mic.on) return mode === 'clap' ? (clap.hint ? CLAP.first : CLAP.off) : { en: 'Enable the microphone and make a steady sound.', hr: 'Uključi mikrofon i proizvedi jednoličan zvuk.' };
          if (mode === 'clap') return CLAP[clap.state];
          return pit.f ? bi(l => (l === 'en' ? 'Nearest note: ' : 'Najbliži ton: ') + noteName(pit.f, l)) : { en: 'Too quiet to find a pitch: whistle or sing.', hr: 'Pretiho za određivanje tona: zazviždi ili zapjevaj.' };
        }
        if (mot.pending) return WAIT_PERM;
        if (!mot.on) return { en: 'Press "Enable motion sensors".', hr: 'Pritisni „Uključi senzore gibanja”.' };
        if (!mot.got) return WAIT_DATA;
        if (mode === 'tilt') return bi(l => (l === 'en' ? 'Angle of the ramp: θ = ' : 'Kut kosine: θ = ') + K.fmt(tiltOf(tilt.b - tilt.zb, tilt.g - tilt.zg), 1, l) + '°');
        return acc.v ? bi(l => 'x: ' + K.fmt(acc.v[0], 1, l) + '   y: ' + K.fmt(acc.v[1], 1, l) + '   z: ' + K.fmt(acc.v[2], 1, l) + ' m/s²' + (acc.held ? (l === 'en' ? '  (held)' : '  (zamrznuto)') : '')) : WAIT_DATA;
      }
      function renderLive() { // everything that changes while a sensor runs
        const live = mot.on && mot.got, b = tilt.b - tilt.zb, gm = tilt.g - tilt.zg;
        const t = clap.ms !== null ? clap.ms / 1000 : null, hcm = inH.getNumber(), g = t && hcm !== null && hcm > 0 ? 2 * (hcm / 100) / (t * t) : null;
        if (mode === 'clap') disp.textContent = clap.ms !== null ? K.fmt(clap.ms, 0, lang) + ' ms' : clap.state === 'timing' ? '…' : '– ms';
        else if (mode === 'pitch') disp.textContent = (pit.f ? K.fmt(pit.f, 0, lang) : '–') + ' Hz';
        else if (mode === 'tilt') disp.textContent = 'β ' + (live ? K.fmt(b, 1, lang) : '–') + '°   γ ' + (live ? K.fmt(gm, 1, lang) : '–') + '°';
        else disp.textContent = '|a| = ' + (acc.cur !== null ? K.fmt(acc.cur, 2, lang) : '–') + ' m/s²';
        sub.textContent = K.tr(status(), lang);
        outG.set(g); outGd.set(g === null ? null : (g - G) / G * 100); outEcho.set(t ? V_SOUND * t / 2 : null);
        outDb.set(mic.on ? pit.db : null); outF.set(pit.f); outNote.set(pit.f ? noteName(pit.f, lang) : null);
        outB.set(live ? b : null); outGm.set(live ? gm : null); outTh.set(live ? tiltOf(b, gm) : null);
        outA.set(acc.cur); outMax.set(acc.max); outMin.set(acc.min); outLin.set(acc.lin);
      }
      function render() { // buttons + live text
        const micMode = mode === 'clap' || mode === 'pitch', busy = clap.state === 'armed' || clap.state === 'timing';
        bMic.hidden = !micMode; bArm.hidden = mode !== 'clap'; bMotion.hidden = micMode; bZero.hidden = mode !== 'tilt'; bHold.hidden = mode !== 'accel';
        T(bMic, mic.on ? MIC_OFF : MIC_ON); bMic.disabled = mic.pending; T(bArm, busy ? CANCEL : ARM); bArm.classList.toggle('primary', mic.on && !busy);
        T(bMotion, mot.on ? MOT_OFF : MOT_ON); bMotion.disabled = mot.pending; T(bHold, acc.held ? RESUME : HOLD);
        lastState = clap.state; renderLive();
      }

      // ---------- drawing ----------
      const head = (g, str) => K.text(g, str, 12, 15, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
      const hint = (g, x, y, obj) => K.text(g, K.tr(obj, lang), x, y, { font: '13px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      function drawClap(g, w, h) {
        const x0 = 16, x1 = w - 16, by = 46, bh = 20, hy0 = by + bh + 30, hy1 = h - 22, small = '11px ' + theme.font;
        head(g, K.tr({ en: 'Microphone level: ', hr: 'Razina zvuka: ' }, lang) + K.fmt(Math.min(1, mic.hold) * 100, 0, lang) + ' %');
        g.fillStyle = theme.surface; K.roundRect(g, x0, by, x1 - x0, bh, 8); g.fill();
        if (mic.hold > 0.01) { g.fillStyle = mic.hold >= clap.thr ? theme.c2 : theme.c1; K.roundRect(g, x0, by, (x1 - x0) * Math.min(1, mic.hold), bh, 8); g.fill(); }
        const tx = x0 + (x1 - x0) * clap.thr, ty = hy1 - (hy1 - hy0) * clap.thr;
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(tx, by - 5); g.lineTo(tx, by + bh + 5); g.stroke();
        K.text(g, K.tr({ en: 'threshold', hr: 'prag' }, lang), K.clamp(tx, x0 + 26, x1 - 26), by - 8, { font: small, color: theme.fg, align: 'center', baseline: 'bottom' });
        // the last 5 s of the level with the two sounds marked (the picture freezes when the measurement is done)
        g.fillStyle = theme.surface; K.roundRect(g, x0, hy0, x1 - x0, hy1 - hy0, 6); g.fill();
        g.save(); g.strokeStyle = theme.muted; g.lineWidth = 1; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(x0, ty); g.lineTo(x1, ty); g.stroke(); g.restore();
        K.text(g, '−' + HIST + ' s', x0, hy1 + 5, { font: small, color: theme.muted, baseline: 'top' });
        K.text(g, K.tr({ en: 'now', hr: 'sada' }, lang), x1, hy1 + 5, { font: small, color: theme.muted, align: 'right', baseline: 'top' });
        if (!mic.on) { hint(g, w / 2, (hy0 + hy1) / 2, { en: 'The sound level will be drawn here.', hr: 'Ovdje će se crtati razina zvuka.' }); return; }
        const ref = clap.state === 'done' ? clap.end : mic.ac.currentTime, X = t => x1 - (ref - t) / HIST * (x1 - x0);
        g.strokeStyle = theme.c1; g.lineWidth = 2; g.beginPath();
        for (let i = 0; i < mic.hist.length; i += 2) { const x = X(mic.hist[i]); if (x < x0) continue; g.moveTo(x, hy1); g.lineTo(x, hy1 - (hy1 - hy0) * Math.min(1, mic.hist[i + 1])); }
        g.stroke();
        [[clap.t1, clap.state === 'timing' || clap.state === 'done', { en: 'start', hr: 'početak' }], [clap.t2, clap.state === 'done', { en: 'stop', hr: 'kraj' }]].forEach(mk => {
          const x = X(mk[0]); if (!mk[1] || x < x0) return;
          g.strokeStyle = theme.c2; g.lineWidth = 2; g.beginPath(); g.moveTo(x, hy0); g.lineTo(x, hy1); g.stroke();
          K.text(g, K.tr(mk[2], lang), K.clamp(x, x0 + 22, x1 - 22), hy0 - 4, { font: small, color: theme.fg, align: 'center', baseline: 'bottom' });
        });
      }
      function drawPitch(g, w, h) {
        const x0 = 16, x1 = w - 16, wy0 = 30, wy1 = Math.round(h * 0.36), sy0 = wy1 + 12, sy1 = h - 24, small = '11px ' + theme.font, F0 = 60, F1 = 8000;
        const X = f => x0 + (x1 - x0) * Math.log(f / F0) / Math.log(F1 / F0);
        head(g, K.tr({ en: 'Waveform (top) and spectrum (bottom)', hr: 'Valni oblik (gore) i spektar (dolje)' }, lang));
        g.fillStyle = theme.surface; K.roundRect(g, x0, wy0, x1 - x0, wy1 - wy0, 6); g.fill(); K.roundRect(g, x0, sy0, x1 - x0, sy1 - sy0, 6); g.fill();
        [100, 200, 500, 1000, 2000, 5000].forEach(f => {
          const x = X(f); g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(x, sy0); g.lineTo(x, sy1); g.stroke();
          K.text(g, f >= 1000 ? K.fmt(f / 1000, 0, lang) + ' kHz' : K.fmt(f, 0, lang) + ' Hz', x, sy1 + 5, { font: small, color: theme.muted, align: 'center', baseline: 'top' });
        });
        if (!mic.on) { hint(g, w / 2, (sy0 + sy1) / 2, { en: 'The spectrum of the sound will be drawn here.', hr: 'Ovdje će se crtati spektar zvuka.' }); return; }
        const td = mic.td, fd = mic.fd, N = td.length, sr = mic.ac.sampleRate, hz = sr / mic.an.fftSize, n = Math.max(2, Math.min(N >> 1, Math.round(0.02 * sr)));
        // waveform: 20 ms, starting where the signal crosses zero upwards so the picture stands still
        let s = N - 2 * n, peak = 0.02;
        for (let i = N - 2 * n; i < N - n; i++) if (td[i] <= 0 && td[i + 1] > 0) { s = i; break; }
        for (let i = s; i < s + n; i++) peak = Math.max(peak, Math.abs(td[i]));
        const wc = (wy0 + wy1) / 2, wa = (wy1 - wy0) / 2 - 4;
        g.strokeStyle = theme.c1; g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * i / (n - 1), y = wc - wa * td[s + i] / peak; if (i) g.lineTo(x, y); else g.moveTo(x, y); }
        g.stroke();
        K.text(g, '20 ms', x1 - 6, wy0 + 4, { font: small, color: theme.muted, align: 'right', baseline: 'top' });
        // spectrum on a logarithmic frequency axis, from −100 dB (bottom) to −20 dB (top)
        const Y = db => sy1 - (sy1 - sy0) * K.clamp((db + 100) / 80, 0, 1), bin = px => F0 * Math.pow(F1 / F0, px / (x1 - x0)) / hz;
        g.beginPath(); g.moveTo(x0, sy1);
        for (let px = 0; px <= x1 - x0; px += 2) {
          const ka = Math.max(1, Math.floor(bin(px))), kb = Math.min(fd.length - 1, Math.max(ka, Math.floor(bin(px + 2))));
          let m = -200; for (let k = ka; k <= kb; k++) if (fd[k] > m) m = fd[k];
          g.lineTo(x0 + px, Y(m));
        }
        g.lineTo(x1, sy1); g.closePath(); g.fillStyle = K.withAlpha(theme.c3, 0.35); g.fill(); g.strokeStyle = theme.c3; g.lineWidth = 1.5; g.stroke();
        if (pit.f && pit.f >= F0 && pit.f <= F1) {
          const x = X(pit.f);
          g.strokeStyle = theme.c2; g.lineWidth = 2; g.beginPath(); g.moveTo(x, sy0); g.lineTo(x, sy1); g.stroke();
          K.text(g, K.fmt(pit.f, 0, lang) + ' Hz', K.clamp(x, x0 + 30, x1 - 30), sy0 + 5, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        }
      }
      function drawTilt(g, w, h) {
        const live = mot.on && mot.got, b = live ? tilt.b - tilt.zb : 0, gm = live ? tilt.g - tilt.zg : 0, th = tiltOf(b, gm);
        head(g, K.tr({ en: 'Angle of the ramp: θ = ', hr: 'Kut kosine: θ = ' }, lang) + (live ? K.fmt(th, 1, lang) : '–') + '°');
        // side view of the surface the phone lies on
        const x0 = 24, yb = h - 34, L = Math.min(w * 0.5 - 30, h - 92), a = Math.min(th, 90) * Math.PI / 180, ex = x0 + L * Math.cos(a), ey = yb - L * Math.sin(a);
        g.fillStyle = K.withAlpha(theme.ground, 0.55); g.beginPath(); g.moveTo(x0, yb); g.lineTo(ex, ey); g.lineTo(ex, yb); g.closePath(); g.fill();
        g.strokeStyle = theme.muted; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, yb); g.lineTo(x0 + L + 8, yb); g.stroke();
        g.strokeStyle = theme.fg; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, yb); g.lineTo(ex, ey); g.stroke();
        g.save(); g.translate(x0 + L * 0.58 * Math.cos(a), yb - L * 0.58 * Math.sin(a)); g.rotate(-a);
        g.fillStyle = theme.c1; K.roundRect(g, -L * 0.2, -12, L * 0.4, 10, 4); g.fill(); g.restore();
        g.strokeStyle = theme.c2; g.lineWidth = 2; g.beginPath(); g.arc(x0, yb, 34, -a, 0); g.stroke();
        K.text(g, 'θ', x0 + 42, yb - 9, { font: 'bold 13px ' + theme.font, color: theme.fg, baseline: 'middle' });
        // spirit level seen from above: the bubble runs to the higher side
        const cx = w * 0.77, cy = h * 0.52, R = Math.min(h * 0.32, w * 0.19);
        let bx = -gm / 30, bv = -b / 30; const m = Math.hypot(bx, bv); if (m > 0.8) { bx *= 0.8 / m; bv *= 0.8 / m; }
        g.fillStyle = theme.surface; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill(); g.strokeStyle = theme.muted; g.lineWidth = 2; g.stroke();
        g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.stroke();
        g.strokeStyle = theme.muted; g.beginPath(); g.arc(cx, cy, R * 0.24, 0, Math.PI * 2); g.stroke();
        g.fillStyle = live && th < 1 ? theme.good : theme.c3; g.beginPath(); g.arc(cx + bx * R, cy + bv * R, R * 0.19, 0, Math.PI * 2); g.fill();
        K.text(g, K.tr({ en: 'spirit level', hr: 'libela' }, lang), cx, Math.min(h - 10, cy + R + 14), { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function drawAccel(g, w, h) {
        const ref = acc.held ? acc.holdT : performance.now(); let lo = -12, hi = 12;
        for (let i = 0; i < acc.t.length; i++) { // time axis: seconds before "now"; the point arrays are reused, only x is refreshed
          acc.m[i][0] = acc.x[i][0] = acc.y[i][0] = acc.z[i][0] = (acc.t[i] - ref) / 1000;
          lo = Math.min(lo, acc.x[i][1], acc.y[i][1], acc.z[i][1]); hi = Math.max(hi, acc.m[i][1]);
        }
        const sc = K.niceScale(lo, hi, 4);
        K.lineChart(g, { x: 6, y: 6, w: w - 12, h: h - 12, xMin: -WINDOW, xMax: 1e-9, yMin: sc.min, yMax: sc.max, xTicks: 5, yTicks: sc.ticks, nice: false, xDigits: 0, yDigits: 0, lang, theme,
          xLabel: { en: 'time (s), 0 = now', hr: 'vrijeme (s), 0 = sada' }, yLabel: { en: 'acceleration (m/s²)', hr: 'akceleracija (m/s²)' },
          series: [{ points: acc.m, color: theme.c1, label: '|a|' }, { points: acc.x, color: theme.c2, label: 'x' }, { points: acc.y, color: theme.c3, label: 'y' }, { points: acc.z, color: theme.c4, label: 'z' }] });
        if (!acc.t.length) hint(g, w / 2, h * 0.3, { en: 'The acceleration of the phone will be drawn here.', hr: 'Ovdje će se crtati akceleracija mobitela.' });
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (mode === 'clap') drawClap(g, w, h); else if (mode === 'pitch') drawPitch(g, w, h); else if (mode === 'tilt') drawTilt(g, w, h); else drawAccel(g, w, h);
      }

      // ---------- shared ----------
      const loop = K.loop(() => { // runs only while a sensor is on
        if (mic.on) { try { micFrame(); } catch (e) { stopMic(); fail(); render(); } }
        const t = performance.now();
        if (clap.state !== lastState) render(); else if (t - lastDom > 120) { lastDom = t; renderLive(); }
        draw();
      });
      function syncLoop() { if (mic.on || mot.on) loop.start(); else { loop.stop(); draw(); } }
      function setMode(m) {
        stopMotion(); if (m !== 'clap' && m !== 'pitch') stopMic();   // a sensor that the new tool does not use is switched off
        if (clap.state !== 'done') clap.state = 'idle';
        mode = m; clap.hint = false; msg.hidden = true; mic.hist = [];
        C1.el.hidden = m !== 'clap'; C2.el.hidden = m !== 'pitch'; C3.el.hidden = m !== 'tilt'; C4.el.hidden = m !== 'accel';
        render(); syncLoop();
      }
      function reset() { // releases every sensor and puts all readings back to the start
        stopMic(); stopMotion(); clearAcc(true);
        Object.assign(clap, { state: 'idle', thr: 0.2, ms: null, hint: false }); slThr.set(20); inH.set('');
        tilt.b = tilt.g = tilt.zb = tilt.zg = 0; msg.hidden = true;
        render(); syncLoop();
      }
      cv.onResize(draw);
      setMode(mode);

      return {
        destroy() {
          dead = true; stopMic(); stopMotion();
          loop.destroy(); cv.destroy(); [C0, C1, C2, C3, C4].forEach(c => c.destroy()); panel.remove(); texts.clear();
        },
        setLang(l) { lang = l; [C0, C1, C2, C3, C4].forEach(c => c.setLang(l)); texts.forEach((o, e) => { e.textContent = K.tr(o, l); }); render(); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
