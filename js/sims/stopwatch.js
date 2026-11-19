/* FizLab tool: Stopwatch and Reaction Timer — (a) stopwatch with laps and "T = (mean ± largest deviation) s",
   (b) tap timer for a pendulum (period, frequency, g), (c) reaction-time test, (d) metronome.
   Every time is read from performance.now(); the SimKit loop only refreshes the display. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, MAX_LAPS = 30, TRIES = 5, TAP_GAP = 8000, MAX_TAPS = 400;
  const MODES = [
    { value: 'sw', label: { en: 'Stopwatch', hr: 'Štoperica' } },
    { value: 'tap', label: { en: 'Tap timer', hr: 'Mjerač titraja' } },
    { value: 'react', label: { en: 'Reaction time', hr: 'Vrijeme reakcije' } },
    { value: 'metro', label: { en: 'Metronome', hr: 'Metronom' } }
  ];
  const SPEEDS = [
    { value: '15', label: { en: 'bicycle, 15 km/h', hr: 'bicikl, 15 km/h' } },
    { value: '50', label: { en: 'car in town, 50 km/h', hr: 'automobil u gradu, 50 km/h' } },
    { value: '90', label: { en: 'open road, 90 km/h', hr: 'otvorena cesta, 90 km/h' } },
    { value: '130', label: { en: 'motorway, 130 km/h', hr: 'autocesta, 130 km/h' } }
  ];
  const START = { en: 'Start', hr: 'Pokreni' }, STOP = { en: 'Stop', hr: 'Zaustavi' }, CONT = { en: 'Continue', hr: 'Nastavi' };
  const HINT_TAP = {
    en: 'Tap once for every FULL swing (there and back), always at the same point of the swing, and time at least 10 swings. A pause longer than 8 s starts a new count.',
    hr: 'Dodirni jednom za svaki PUNI titraj (tamo i natrag), uvijek u istoj točki titraja, i izmjeri barem 10 titraja. Stanka dulja od 8 s započinje novo brojenje.'
  };
  // reaction panel: red while waiting, green for "go"; the text colour var(--bg) keeps contrast in both themes
  const PAD = {
    idle: { bg: 'var(--surface2)', fg: 'var(--fg)', big: { en: 'Tap to start', hr: 'Dodirni za početak' },
      sub: { en: 'The panel turns red. When it turns green, tap as fast as you can (or press Space).', hr: 'Ploča pocrveni. Kad pozeleni, dodirni što brže možeš (ili pritisni razmaknicu).' } },
    wait: { bg: 'var(--bad)', fg: 'var(--bg)', big: { en: 'wait…', hr: 'čekaj…' }, sub: { en: 'Do not tap yet.', hr: 'Još ne diraj.' } },
    go: { bg: 'var(--good)', fg: 'var(--bg)', big: { en: 'NOW!', hr: 'SAD!' }, sub: { en: 'Tap!', hr: 'Dodirni!' } },
    early: { bg: 'var(--warn-soft)', fg: 'var(--fg)', big: { en: 'too soon', hr: 'prerano' },
      sub: { en: 'This try does not count. Tap to try again.', hr: 'Ovaj se pokušaj ne računa. Dodirni za novi pokušaj.' } }
  };

  function el(tag, cls, parent) { const e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  const bi = f => ({ en: f('en'), hr: f('hr') });
  function stats(v) {
    const n = v.length; if (!n) return null;
    const mean = v.reduce((a, b) => a + b, 0) / n;
    return { n, mean, maxDev: Math.max.apply(null, v.map(x => Math.abs(x - mean))), min: Math.min.apply(null, v) };
  }
  function clock(ms, lang) { // mm:ss.cc (hundredths are cut off, not rounded, like a real stopwatch)
    const cs = Math.floor(Math.max(0, ms) / 10), p = v => (v < 10 ? '0' : '') + v;
    return p(Math.floor(cs / 6000)) + ':' + p(Math.floor(cs / 100) % 60) + (lang === 'hr' ? ',' : '.') + p(cs % 100);
  }

  window.Sims.register({
    id: 'stopwatch',
    title: { en: 'Stopwatch and Reaction Timer', hr: 'Štoperica i mjerač reakcije' },
    summary: {
      en: 'Time anything with laps, find the period of a pendulum by tapping, test your reaction time and keep a steady beat with the metronome.',
      hr: 'Mjeri vrijeme s krugovima, odredi period njihala dodirivanjem, ispitaj svoje vrijeme reakcije i drži ritam metronomom.'
    },
    tasks: [
      { en: 'Hang a weight on a string about 50 cm long. In the tap timer tap once for every full swing, at least 10 times. Type the length and read g.', hr: 'Objesi uteg na konac dug oko 50 cm. U mjeraču titraja dodirni jednom za svaki puni titraj, barem 10 puta. Upiši duljinu i očitaj g.' },
      { en: 'Stopwatch: time 10 swings of the pendulum five times in a row with Lap. How big is the largest deviation from the mean?', hr: 'Štoperica: pet puta zaredom izmjeri 10 titraja njihala tipkom Krug. Koliko je najveće odstupanje od srednje vrijednosti?' },
      { en: 'Measure your reaction time. How far does a car at 50 km/h travel before the driver even touches the brake?', hr: 'Izmjeri svoje vrijeme reakcije. Koliki put prijeđe automobil pri 50 km/h prije nego što vozač uopće dotakne kočnicu?' },
      { en: 'Set the metronome to 60 beats per minute. What is the period? Can you make a pendulum that swings in time with it?', hr: 'Namjesti metronom na 60 udaraca u minuti. Koliki je period? Možeš li napraviti njihalo koje se njiše u istom ritmu?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme, mode = 'sw', dead = false;
      const texts = new Map();                         // element -> {en, hr}; re-applied in setLang
      const T = (e, o) => { texts.set(e, o); e.textContent = K.tr(o, lang); return e; };
      const bigBtn = (parent, label, primary) => {
        const b = el('button', 'sk-btn' + (primary ? ' primary' : ''), parent);
        b.type = 'button'; b.style.minHeight = '52px'; b.style.flex = '1 1 96px'; b.style.fontSize = '1.05rem';
        return T(b, label);
      };
      // react on pointerdown (a click waits until the finger lifts); the click stays as the keyboard fallback
      const fastPress = (b, fn) => {
        let skipUntil = 0;
        b.style.touchAction = 'manipulation';
        b.addEventListener('pointerdown', e => { if (e.button) return; skipUntil = performance.now() + 2500; fn(); });
        b.addEventListener('click', () => { if (performance.now() < skipUntil) { skipUntil = 0; return; } fn(); });
      };

      const sw = { running: false, t0: 0, acc: 0, laps: [], lastTotal: 0 };           // times in ms
      const tp = { taps: [] };
      const rx = { state: 'idle', tGo: 0, since: -1e9, tries: [], timer: 0 };
      const mt = { on: false, bpm: 60, next: 0, last: -1, count: 0, beats: [], timer: 0, ac: null };

      // ---------- DOM ----------
      const C0 = K.controls(container, lang);
      C0.segmented({ label: { en: 'Tool', hr: 'Alat' }, options: MODES, value: mode, onChange: setMode });

      const secA = el('div', 'sk-panel', container);
      const dispA = el('div', 'sk-big', secA), rowA = el('div', 'sk-row', secA);
      const bStart = bigBtn(rowA, START, true), bLap = bigBtn(rowA, { en: 'Lap', hr: 'Krug' }), bZero = bigBtn(rowA, { en: 'Reset', hr: 'Poništi' });
      const wrapA = el('div', 'sk-table-wrap', secA); wrapA.style.maxHeight = '216px'; wrapA.style.overflowY = 'auto';
      const tableA = el('table', 'sk-table', wrapA), headA = el('tr', '', el('thead', '', tableA)), bodyA = el('tbody', '', tableA);
      T(el('th', '', headA), { en: 'Lap', hr: 'Krug' }); T(el('th', '', headA), { en: 'Lap time (s)', hr: 'Vrijeme kruga (s)' }); T(el('th', '', headA), { en: 'Total', hr: 'Ukupno' });
      const resA = el('div', '', secA); resA.style.fontWeight = '800'; resA.style.textAlign = 'center';
      T(el('p', 'sk-note', secA), { en: 'Keyboard: Space = start / stop, L = lap.', hr: 'Tipkovnica: razmaknica = pokreni / zaustavi, L = krug.' });
      fastPress(bStart, swToggle); fastPress(bLap, swLap); bZero.addEventListener('click', () => { swZero(); renderSw(); draw(); });

      const secB = el('div', 'sk-panel', container);
      const bTap = bigBtn(secB, { en: 'Tap on every swing', hr: 'Dodirni pri svakom titraju' }, true);
      Object.assign(bTap.style, { minHeight: '120px', fontSize: '1.35rem', borderRadius: '20px', whiteSpace: 'normal' });
      const dispB = el('div', 'sk-big', secB), resB = el('div', '', secB); resB.style.textAlign = 'center'; resB.style.fontWeight = '800';
      const bTapZero = bigBtn(el('div', 'sk-row', secB), { en: 'Start again', hr: 'Kreni ispočetka' });
      fastPress(bTap, tap); bTapZero.addEventListener('click', () => { tp.taps = []; renderTap(); draw(); });

      const pad = el('button', 'sk-panel', container); pad.type = 'button';
      Object.assign(pad.style, { width: '100%', minHeight: '190px', border: '0', font: 'inherit', cursor: 'pointer', placeItems: 'center', alignContent: 'center', textAlign: 'center', userSelect: 'none', webkitUserSelect: 'none' });
      const padBig = el('div', 'sk-big', pad), padSub = el('div', '', pad);
      fastPress(pad, hit);

      const secD = el('div', 'sk-panel', container);
      const dispD = el('div', 'sk-big', secD), bMetro = bigBtn(el('div', 'sk-row', secD), START, true);
      const msgD = T(el('div', 'sk-msg', secD), { en: 'This browser cannot play sound. The dot still flashes in time.', hr: 'Ovaj preglednik ne može reproducirati zvuk. Točka i dalje bljeska u ritmu.' });
      msgD.hidden = true;
      bMetro.addEventListener('click', mtToggle);

      const cv = K.createCanvas(container, { aspect: 3, minHeight: 170, maxHeight: 230 });
      const CA = K.controls(container, lang), CB = K.controls(container, lang), CC = K.controls(container, lang), CD = K.controls(container, lang);
      const outLaps = CA.readout({ label: { en: 'Laps', hr: 'Broj krugova' }, digits: 0 });
      const outMeanA = CA.readout({ label: { en: 'Mean lap time x̄', hr: 'Srednja vrijednost x̄' }, unit: 's', digits: 2 });
      const outDevA = CA.readout({ label: { en: 'Largest deviation Δ', hr: 'Najveće odstupanje Δ' }, unit: 's', digits: 2 });
      CA.note({ text: { en: 'Time the same thing several times with Lap (for example 10 swings of a pendulum). The mean is your best value; the largest deviation shows how far a single timing can be off.',
        hr: 'Istu pojavu izmjeri više puta tipkom Krug (na primjer 10 titraja njihala). Srednja vrijednost je tvoj najbolji rezultat, a najveće odstupanje pokazuje koliko pojedino mjerenje može pogriješiti.' } });

      const outTaps = CB.readout({ label: { en: 'Taps', hr: 'Broj dodira' }, digits: 0 });
      const outT = CB.readout({ label: { en: 'Period T', hr: 'Period T' }, unit: 's', digits: 2 });
      const outF = CB.readout({ label: { en: 'Frequency f = 1/T', hr: 'Frekvencija f = 1/T' }, unit: 'Hz', digits: 2 });
      const outSpread = CB.readout({ label: { en: 'Spread (largest deviation)', hr: 'Rasipanje (najveće odstupanje)' }, unit: 's', digits: 2 });
      const inLen = CB.input({ label: { en: 'Pendulum length l', hr: 'Duljina njihala l' }, type: 'number', unit: 'cm', placeholder: { en: 'e.g. 50', hr: 'npr. 50' }, onChange: () => { renderTap(); } });
      const outG = CB.readout({ label: 'g = 4π²·l / T²', unit: 'm/s²', digits: 2 });
      const noteB = CB.note({ text: HINT_TAP });

      const outTries = CC.readout({ label: { en: 'Valid tries', hr: 'Valjani pokušaji' } });
      const outLast = CC.readout({ label: { en: 'Last try', hr: 'Zadnji pokušaj' }, unit: 'ms', digits: 0 });
      const outMeanC = CC.readout({ label: { en: 'Mean of 5 tries', hr: 'Srednja vrijednost (5 pokušaja)' }, unit: 'ms', digits: 0 });
      const outBest = CC.readout({ label: { en: 'Best', hr: 'Najbolje' }, unit: 'ms', digits: 0 });
      const outRuler = CC.readout({ label: { en: 'Ruler drop s = ½·g·t²', hr: 'Pad ravnala s = ½·g·t²' }, unit: 'cm', digits: 1 });
      const selSpeed = CC.select({ label: { en: 'Vehicle', hr: 'Vozilo' }, options: SPEEDS, value: '50', onChange: () => { renderRx(); } });
      const outCar = CC.readout({ label: { en: 'Distance during your reaction', hr: 'Put za vrijeme reakcije' }, unit: 'm', digits: 1 });
      CC.button({ label: { en: 'New series', hr: 'Nova serija' }, onClick: () => { rxReset(); renderRx(); draw(); } });
      const noteC = CC.note({ text: '' });

      const slBpm = CD.slider({ label: { en: 'Tempo', hr: 'Tempo' }, min: 30, max: 240, step: 1, value: 60, digits: 0, unit: { en: 'beats/min', hr: 'udaraca/min' },
        onChange: v => { mt.bpm = v; renderMt(); draw(); } });
      const outPer = CD.readout({ label: { en: 'Period T = 60 s : tempo', hr: 'Period T = 60 s : tempo' }, unit: 's', digits: 3 });
      const outFreq = CD.readout({ label: { en: 'Frequency f = 1/T', hr: 'Frekvencija f = 1/T' }, unit: 'Hz', digits: 2 });
      CD.note({ text: { en: 'A metronome keeps a steady period. Use it to pace a walk, to count swings, or to tune a pendulum until it swings exactly in time.',
        hr: 'Metronom drži stalan period. Njime možeš ujednačiti korake, brojiti titraje ili ugoditi njihalo tako da se njiše točno u ritmu.' } });

      // ---------- (a) stopwatch ----------
      const swElapsed = () => sw.acc + (sw.running ? performance.now() - sw.t0 : 0);
      function swToggle() {
        const now = performance.now();
        if (sw.running) { sw.acc += now - sw.t0; sw.running = false; } else { sw.t0 = now; sw.running = true; }
        renderSw(); syncLoop();
      }
      function swLap() { // also works once after Stop, so the last stretch is not lost
        const tot = swElapsed(), lap = tot - sw.lastTotal;
        if (lap <= 0 || sw.laps.length >= MAX_LAPS) return;
        sw.laps.push({ lap, tot }); sw.lastTotal = tot;
        renderSw(); draw(); wrapA.scrollTop = wrapA.scrollHeight;
      }
      function swZero() { sw.running = false; sw.acc = 0; sw.laps = []; sw.lastTotal = 0; syncLoop(); }
      function renderSw() {
        dispA.textContent = clock(swElapsed(), lang);
        T(bStart, sw.running ? STOP : (sw.acc > 0 ? CONT : START));
        bLap.disabled = sw.laps.length >= MAX_LAPS || !(sw.running || swElapsed() > sw.lastTotal);
        bodyA.textContent = '';
        sw.laps.forEach((l, i) => {
          const tr = el('tr', '', bodyA);
          el('td', '', tr).textContent = String(i + 1); el('td', '', tr).textContent = K.fmt(l.lap / 1000, 2, lang); el('td', '', tr).textContent = clock(l.tot, lang);
        });
        if (!sw.laps.length) {
          const td = el('td', '', el('tr', '', bodyA)); td.colSpan = 3; td.style.textAlign = 'center'; td.style.color = 'var(--muted)';
          td.textContent = K.tr({ en: 'No laps yet: press Lap while the stopwatch runs.', hr: 'Još nema krugova: pritisni Krug dok štoperica radi.' }, lang);
        }
        const s = stats(sw.laps.map(l => l.lap / 1000));
        outLaps.set(sw.laps.length); outMeanA.set(s ? s.mean : null); outDevA.set(s && s.n > 1 ? s.maxDev : null);
        resA.textContent = !s ? '' : s.n < 2 ? K.tr({ en: 'One more lap and you get the mean and the deviation.', hr: 'Još jedan krug pa dobivaš srednju vrijednost i odstupanje.' }, lang)
          : 'T = (' + K.fmt(s.mean, 2, lang) + ' ± ' + K.fmt(s.maxDev, 2, lang) + ') s';
      }

      // ---------- (b) tap timer ----------
      const tapIntervals = () => tp.taps.slice(1).map((t, i) => (t - tp.taps[i]) / 1000);
      function tap() {
        const now = performance.now(), n = tp.taps.length;
        if (n && now - tp.taps[n - 1] < 60) return;                  // the same press reported twice
        if (n && now - tp.taps[n - 1] > TAP_GAP) tp.taps = [];
        if (tp.taps.length >= MAX_TAPS) tp.taps.shift();
        tp.taps.push(now); renderTap(); draw();
      }
      function gVerdict(g, n) {
        const pct = (g - G) / G * 100;
        return bi(l => {
          const en = l === 'en';
          let s = 'g = ' + K.fmt(g, 2, l) + ' m/s², ' + K.fmt(Math.abs(pct), 1, l) + ' % ' + (pct >= 0 ? (en ? 'above' : 'iznad') : (en ? 'below' : 'ispod')) + ' 9' + (en ? '.' : ',') + '81 m/s². ';
          if (g > 3 * G) s += en ? 'Much too big: you are probably tapping twice per swing. One full swing is there AND back.' : 'Puno previše: vjerojatno dodiruješ dvaput po titraju. Jedan puni titraj je tamo I natrag.';
          else if (g < G / 3) s += en ? 'Much too small: check the length (in centimetres) and tap once for every full swing.' : 'Puno premalo: provjeri duljinu (u centimetrima) i dodirni jednom za svaki puni titraj.';
          else if (Math.abs(pct) <= 5) s += en ? 'Very good!' : 'Vrlo dobro!';
          else s += en ? 'Measure the length from the hanging point to the middle of the weight and keep the swings small.' : 'Duljinu mjeri od objesišta do sredine utega, a njihalo otkloni samo malo.';
          if (n < 10) s += en ? ' Time at least 10 swings for a reliable value.' : ' Za pouzdanu vrijednost izmjeri barem 10 titraja.';
          return s;
        });
      }
      function renderTap() {
        const s = stats(tapIntervals()), l = inLen.getNumber();
        outTaps.set(tp.taps.length); outT.set(s ? s.mean : null); outF.set(s ? 1 / s.mean : null); outSpread.set(s && s.n > 1 ? s.maxDev : null);
        dispB.textContent = 'T = ' + (s ? K.fmt(s.mean, 2, lang) : '–') + ' s';
        resB.textContent = !s ? K.tr({ en: 'Tap at least twice.', hr: 'Dodirni barem dvaput.' }, lang)
          : 'T = ' + (s.n > 1 ? '(' + K.fmt(s.mean, 2, lang) + ' ± ' + K.fmt(s.maxDev, 2, lang) + ')' : K.fmt(s.mean, 2, lang)) + ' s,  f = ' + K.fmt(1 / s.mean, 2, lang) + ' Hz';
        const g = s && l !== null && l > 0 ? 4 * Math.PI * Math.PI * (l / 100) / (s.mean * s.mean) : null;
        outG.set(g); noteB.set(g === null ? HINT_TAP : gVerdict(g, s.n));
      }

      // ---------- (c) reaction time ----------
      function rxReset() { clearTimeout(rx.timer); rx.timer = 0; rx.state = 'idle'; rx.tries = []; rx.since = -1e9; }
      function rxSet(state) { rx.state = state; rx.since = performance.now(); renderRx(); draw(); }
      function rxArm() {
        clearTimeout(rx.timer); rxSet('wait');
        rx.timer = setTimeout(() => {
          rx.timer = 0; if (dead || rx.state !== 'wait') return;
          rx.state = 'go'; renderRx(); rx.tGo = rx.since = performance.now();
        }, 2000 + Math.random() * 3000);
      }
      function hit() {
        const now = performance.now();
        if (rx.state === 'wait') { clearTimeout(rx.timer); rx.timer = 0; rxSet('early'); return; }
        if (rx.state === 'go') {
          const ms = now - rx.tGo;
          if (ms < 100) { rxSet('early'); return; }                  // nobody reacts that fast: it was a guess
          rx.tries.push(ms); rxSet(rx.tries.length >= TRIES ? 'done' : 'result'); return;
        }
        if (now - rx.since < 300) return;                            // ignore an accidental double tap
        if (rx.state === 'done') rx.tries = [];
        rxArm();
      }
      function renderRx() {
        const n = rx.tries.length, s = stats(rx.tries), done = n >= TRIES, shown = (rx.state === 'result' || rx.state === 'done') && n > 0;
        const p = shown ? PAD.idle : (PAD[rx.state] || PAD.idle);
        pad.style.background = p.bg; pad.style.color = p.fg;
        if (shown) {
          padBig.textContent = K.fmt(rx.tries[n - 1], 0, lang) + ' ms';
          padSub.textContent = done
            ? K.tr({ en: 'Mean of 5 tries: ', hr: 'Srednja vrijednost 5 pokušaja: ' }, lang) + K.fmt(s.mean, 0, lang) + ' ms, ' + K.tr({ en: 'best: ', hr: 'najbolje: ' }, lang) + K.fmt(s.min, 0, lang) + ' ms. ' + K.tr({ en: 'Tap for a new series.', hr: 'Dodirni za novu seriju.' }, lang)
            : K.tr({ en: 'Try ', hr: 'Pokušaj ' }, lang) + n + K.tr({ en: ' of ', hr: ' od ' }, lang) + TRIES + '. ' + K.tr({ en: 'Tap for the next one.', hr: 'Dodirni za sljedeći.' }, lang);
        } else { padBig.textContent = K.tr(p.big, lang); padSub.textContent = K.tr(p.sub, lang); }
        const t = done ? s.mean / 1000 : null, kmh = parseFloat(selSpeed.get()) || 50;
        const drop = t === null ? null : 0.5 * G * t * t * 100, road = t === null ? null : kmh / 3.6 * t;
        outTries.set(n + ' / ' + TRIES); outLast.set(n ? rx.tries[n - 1] : null); outMeanC.set(done ? s.mean : null); outBest.set(done ? s.min : null);
        outRuler.set(drop); outCar.set(road);
        noteC.set(t === null
          ? { en: 'Do 5 valid tries. Then you see how far a falling ruler drops before you catch it, and how far a vehicle travels before the driver even starts to brake.',
            hr: 'Napravi 5 valjanih pokušaja. Tada vidiš koliko ravnalo padne prije nego što ga uhvatiš i koliki put vozilo prijeđe prije nego što vozač uopće počne kočiti.' }
          : bi(l => l === 'en'
            ? 'With a reaction time of ' + K.fmt(t, 2, l) + ' s a falling ruler would drop this far before you catch it: ' + K.fmt(drop, 1, l) + ' cm. At ' + K.fmt(kmh, 0, l) + ' km/h a vehicle travels ' + K.fmt(road, 1, l) + ' m before the driver even starts to brake.'
            : 'Uz vrijeme reakcije ' + K.fmt(t, 2, l) + ' s ravnalo koje pada spustilo bi se ovoliko prije nego što ga uhvatiš: ' + K.fmt(drop, 1, l) + ' cm. Pri ' + K.fmt(kmh, 0, l) + ' km/h vozilo prijeđe ' + K.fmt(road, 1, l) + ' m prije nego što vozač uopće počne kočiti.'));
      }

      // ---------- (d) metronome ----------
      function beep(ac, at) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.15, at + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
        o.connect(g); g.connect(ac.destination); o.start(at); o.stop(at + 0.08);
        o.onended = () => { try { o.disconnect(); g.disconnect(); } catch (e) { /* context already closed */ } };
      }
      function mtSchedule() { // look a little ahead and hand the beeps to the audio clock; the dot uses the same beat times
        const now = performance.now(), per = 60000 / mt.bpm;
        if (mt.next < now - 50) mt.next = now;                       // the tab was asleep: do not replay missed beats
        while (mt.next < now + 120) {
          mt.beats.push(mt.next);
          if (mt.ac) { try { beep(mt.ac, mt.ac.currentTime + Math.max(0, mt.next - now) / 1000); } catch (e) { /* silent beat */ } }
          mt.next += per;
        }
      }
      function mtHalt() {
        if (mt.timer) clearInterval(mt.timer);
        mt.timer = 0; mt.on = false; mt.beats = [];
        if (mt.ac) { const ac = mt.ac; mt.ac = null; try { const p = ac.close(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* ignore */ } }
      }
      function mtToggle() {
        if (mt.on) { mtHalt(); } else {
          mt.on = true; mt.count = 0; mt.last = -1; mt.beats = []; mt.next = performance.now() + 80;
          try {                                                      // the AudioContext is created only here, after a click or key press
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) { mt.ac = new AC(); if (mt.ac.state === 'suspended' && mt.ac.resume) { const p = mt.ac.resume(); if (p && p.catch) p.catch(() => {}); } }
          } catch (e) { mt.ac = null; }
          msgD.hidden = !!mt.ac;
          mtSchedule(); mt.timer = setInterval(mtSchedule, 25);
        }
        renderMt(); syncLoop(); draw();
      }
      function renderMt() {
        dispD.textContent = 'T = ' + K.fmt(60 / mt.bpm, 2, lang) + ' s';
        T(bMetro, mt.on ? STOP : START); outPer.set(60 / mt.bpm); outFreq.set(mt.bpm / 60);
      }

      // ---------- drawing ----------
      function bars(g, w, h, vals, o) {
        K.text(g, K.tr(o.title, lang), 12, 16, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        if (!vals.length) { K.text(g, K.tr(o.empty, lang), w / 2, h / 2 + 6, { font: '13px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' }); return; }
        const s = stats(vals), x0 = 46, x1 = w - 12, y0 = 34, y1 = h - 22;
        const sc = K.niceScale(0, Math.max.apply(null, vals) * 1.05, 4), td = sc.step >= 1 ? 0 : sc.step >= 0.1 ? 1 : 2;
        const Y = v => y1 - v / sc.max * (y1 - y0);
        for (let i = 0; i <= sc.ticks; i++) {
          const v = sc.step * i, y = Y(v);
          g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
          K.text(g, K.fmt(v, td, lang), x0 - 6, y, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        const slot = (x1 - x0) / vals.length, bw = Math.min(44, slot * 0.7);
        vals.forEach((v, i) => {
          const cx = x0 + slot * (i + 0.5), y = Y(v);
          g.fillStyle = theme.c1; K.roundRect(g, cx - bw / 2, y, bw, y1 - y, 4); g.fill();
          if (slot >= 18) K.text(g, String(i + 1), cx, y1 + 4, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        });
        g.save(); g.strokeStyle = theme.c2; g.lineWidth = 2; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(x0, Y(s.mean)); g.lineTo(x1, Y(s.mean)); g.stroke(); g.restore();
        K.text(g, 'x̄ = ' + K.fmt(s.mean, o.digits, lang) + ' ' + o.unit, x1, 16, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
      }
      function drawMetro(g, w, h) {
        const now = performance.now(), per = 60000 / mt.bpm;
        while (mt.beats.length && mt.beats[0] <= now) { mt.last = mt.beats.shift(); mt.count++; }
        const live = mt.on && mt.last >= 0, since = live ? now - mt.last : 1e9, flash = K.clamp(1 - since / 130, 0, 1);
        K.text(g, K.fmt(mt.bpm, 0, lang) + ' ' + K.tr({ en: 'beats per minute', hr: 'udaraca u minuti' }, lang), 12, 16, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        const r = Math.min(h * 0.24, w * 0.13), dx = w * 0.3, dy = h * 0.52;
        g.fillStyle = K.withAlpha(theme.c1, 0.18 + 0.82 * flash); g.beginPath(); g.arc(dx, dy, r * (1 + 0.15 * flash), 0, Math.PI * 2); g.fill();
        g.strokeStyle = theme.c1; g.lineWidth = 2; g.beginPath(); g.arc(dx, dy, r, 0, Math.PI * 2); g.stroke();
        K.text(g, mt.on ? K.tr({ en: 'beat ', hr: 'udarac ' }, lang) + mt.count : K.tr({ en: 'press Start', hr: 'pritisni Pokreni' }, lang), dx, dy + r * 1.15 + 14, { font: '12px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        // swinging arm: it reaches one side exactly on every beat
        const px = w * 0.7, py = h - 20, len = h - 60;
        const ang = live && !ctx.reducedMotion ? 0.45 * Math.cos(Math.PI * Math.min(1, since / per)) * (mt.count % 2 ? 1 : -1) : 0;
        g.save(); g.lineCap = 'round'; g.strokeStyle = theme.muted; g.lineWidth = 3;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.sin(ang) * len, py - Math.cos(ang) * len); g.stroke();
        g.fillStyle = theme.c2; g.beginPath(); g.arc(px + Math.sin(ang) * len * 0.62, py - Math.cos(ang) * len * 0.62, 9, 0, Math.PI * 2); g.fill();
        g.fillStyle = theme.ground; K.roundRect(g, px - 34, py - 3, 68, 10, 4); g.fill(); g.restore();
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (mode === 'sw') bars(g, w, h, sw.laps.map(l => l.lap / 1000), { title: { en: 'Lap times (s)', hr: 'Vremena krugova (s)' }, unit: 's', digits: 2,
          empty: { en: 'Your lap times will appear here as bars.', hr: 'Ovdje će se vremena krugova prikazati kao stupci.' } });
        else if (mode === 'tap') bars(g, w, h, tapIntervals().slice(-30), { title: { en: 'Time between taps (s)', hr: 'Vrijeme između dodira (s)' }, unit: 's', digits: 2,
          empty: { en: 'Each bar will be one swing. Equal bars = steady tapping.', hr: 'Svaki stupac bit će jedan titraj. Jednaki stupci = ujednačeno dodirivanje.' } });
        else if (mode === 'react') bars(g, w, h, rx.tries, { title: { en: 'Reaction times (ms)', hr: 'Vremena reakcije (ms)' }, unit: 'ms', digits: 0,
          empty: { en: 'Your 5 tries will appear here.', hr: 'Ovdje će se prikazati tvojih 5 pokušaja.' } });
        else drawMetro(g, w, h);
      }

      // ---------- shared ----------
      const loop = K.loop(() => {
        if (sw.running) dispA.textContent = clock(swElapsed(), lang);
        if (mt.on && mode === 'metro') draw();
      });
      function syncLoop() { if (sw.running || mt.on) loop.start(); else loop.stop(); }
      function renderAll() { renderSw(); renderTap(); renderRx(); renderMt(); draw(); }
      function setMode(m) {
        if (rx.state === 'wait' || rx.state === 'go') { clearTimeout(rx.timer); rx.timer = 0; rx.state = 'idle'; }
        mtHalt(); syncLoop();                           // the stopwatch itself may keep running in the background
        mode = m;
        secA.hidden = CA.el.hidden = m !== 'sw'; secB.hidden = CB.el.hidden = m !== 'tap';
        pad.hidden = CC.el.hidden = m !== 'react'; secD.hidden = CD.el.hidden = m !== 'metro';
        renderAll();
      }
      function reset() { // only the tool that is open goes back to its start
        if (mode === 'sw') swZero();
        else if (mode === 'tap') { tp.taps = []; inLen.set(''); }
        else if (mode === 'react') rxReset();
        else { mtHalt(); mt.bpm = 60; slBpm.set(60); syncLoop(); }
        renderAll();
      }
      function onKey(e) {
        if (dead || !container.isConnected || e.ctrlKey || e.metaKey || e.altKey) return;
        const t = e.target, tag = t && t.tagName;      // keys typed in inputs, or aimed at a focused button or link, are not ours
        if ((tag === 'INPUT' && t.type !== 'range') || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A' || (t && t.isContentEditable)) return;
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault(); if (e.repeat) return;
          if (mode === 'sw') swToggle(); else if (mode === 'tap') tap(); else if (mode === 'react') hit(); else mtToggle();
        } else if ((e.key === 'l' || e.key === 'L') && mode === 'sw' && !e.repeat) swLap();
      }
      // a button pressed with mouse or finger gives the focus back, so Space keeps meaning "start / stop"
      function onPointerClick(e) { const b = e.detail > 0 && e.target && e.target.closest ? e.target.closest('button') : null; if (b) b.blur(); }
      document.addEventListener('keydown', onKey);
      container.addEventListener('click', onPointerClick);
      cv.onResize(draw);
      setMode(mode);

      return {
        destroy() {
          dead = true;
          document.removeEventListener('keydown', onKey); container.removeEventListener('click', onPointerClick);
          clearTimeout(rx.timer); rx.timer = 0; mtHalt(); sw.running = false;
          loop.destroy(); cv.destroy(); [C0, CA, CB, CC, CD].forEach(c => c.destroy()); [secA, secB, pad, secD].forEach(e => e.remove());
          texts.clear();
        },
        setLang(l) { lang = l; [C0, CA, CB, CC, CD].forEach(c => c.setLang(l)); texts.forEach((o, e) => { e.textContent = K.tr(o, l); }); renderAll(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
