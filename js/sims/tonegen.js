/* FizLab tool: Tone Generator — Web Audio output only (no microphone): (a) one tone with a picture of its waveform,
   (b) hearing-range sweeps, (c) two tones and their beats, (d) the C major scale. Sound starts only after a click. */
(function () {
  'use strict';
  const K = window.SimKit;
  const V_SOUND = 340, F_MIN = 20, F_MAX = 20000, MAX_GAIN = 0.2;
  const MODES = [
    { value: 'one', label: { en: 'One tone', hr: 'Jedan ton' } },
    { value: 'range', label: { en: 'Hearing range', hr: 'Raspon sluha' } },
    { value: 'beats', label: { en: 'Two tones: beats', hr: 'Dva tona: udari' } },
    { value: 'scale', label: { en: 'Scale', hr: 'Ljestvica' } }
  ];
  const WAVES = [
    { value: 'sine', label: { en: 'sine', hr: 'sinusni' } },
    { value: 'triangle', label: { en: 'triangle', hr: 'trokutasti' } },
    { value: 'square', label: { en: 'square', hr: 'pravokutni' } },
    { value: 'sawtooth', label: { en: 'sawtooth', hr: 'pilasti' } }
  ];
  const LOUD = { sine: 1, triangle: 1, square: 0.45, sawtooth: 0.55 };      // sharp waves sound louder, so they get less gain
  const SWEEPS = { up: { f0: 8000, f1: 20000, dur: 30 }, down: { f0: 200, f1: 20, dur: 25 } };
  const AGES = [{ f: 20000, label: { en: 'child', hr: 'dijete' } }, { f: 16000, label: { en: 'age 30', hr: '30 god.' } }, { f: 12000, label: { en: 'age 60', hr: '60 god.' } }];
  const SCALE = [0, 2, 4, 5, 7, 9, 11, 12].map(s => ({ semi: s - 9, f: 440 * Math.pow(2, (s - 9) / 12) }));   // C4 … C5 with A4 = 440 Hz
  const NAMES = { en: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'], hr: ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'ais', 'h'] };
  const SUP = ['', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷'];
  const PLAY = { en: 'Play', hr: 'Sviraj' }, STOP = { en: 'Stop', hr: 'Zaustavi' }, PLAY_BOTH = { en: 'Play both tones', hr: 'Sviraj oba tona' };
  const NO_AUDIO = { en: 'This browser cannot play sound here (Web Audio is not available). The pictures and numbers still work.', hr: 'Ovaj preglednik ovdje ne može reproducirati zvuk (Web Audio nije dostupan). Crteži i brojevi i dalje rade.' };
  const SAFE = { en: 'Safety: keep the volume low. Never do this test with earphones at high volume: very high tones can harm your hearing even when you can barely hear them.',
    hr: 'Sigurnost: glasnoća neka bude mala. Ovaj pokus nikad ne radi sa slušalicama uz veliku glasnoću: vrlo visoki tonovi mogu oštetiti sluh i kad ih jedva čuješ.' };

  function el(tag, cls, parent) { const e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  const bi = f => ({ en: f('en'), hr: f('hr') });
  const fmtHz = (f, lang) => K.fmt(f, f < 100 && Math.abs(f - Math.round(f)) > 0.04 ? 1 : 0, lang);
  function noteName(n, lang) { // n = semitones from A4; English "A4", Croatian "a¹" (c¹ is middle C)
    const idx = ((n + 9) % 12 + 12) % 12, oct = 4 + Math.floor((n + 9) / 12);
    if (lang !== 'hr') return NAMES.en[idx] + oct;
    const nm = NAMES.hr[idx];
    return oct >= 3 ? nm + (SUP[oct - 3] || '') : nm.charAt(0).toUpperCase() + nm.slice(1) + (oct === 2 ? '' : oct === 1 ? '₁' : '₂');
  }
  function nearest(f) { const n = Math.round(12 * Math.log2(f / 440)); return { n, cents: 1200 * Math.log2(f / (440 * Math.pow(2, n / 12))) }; }
  function wave(type, p) { // one period: phase p = 0…1, value −1…1 (same shapes as the Web Audio oscillator)
    p -= Math.floor(p);
    if (type === 'square') return p < 0.5 ? 1 : -1;
    if (type === 'sawtooth') return 2 * ((p + 0.5) % 1) - 1;
    if (type === 'triangle') return p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4;
    return Math.sin(2 * Math.PI * p);
  }

  window.Sims.register({
    id: 'tonegen',
    title: { en: 'Tone Generator', hr: 'Generator tona' },
    summary: {
      en: 'Play a pure tone of any frequency, find the highest tone you can hear, listen to the beats of two close tones and play a scale.',
      hr: 'Odsviraj čisti ton bilo koje frekvencije, pronađi najviši ton koji čuješ, poslušaj udare dvaju bliskih tonova i odsviraj ljestvicu.'
    },
    tasks: [
      { en: 'Play 440 Hz, then 880 Hz. How do the period and the wavelength change when the frequency doubles?', hr: 'Odsviraj 440 Hz, zatim 880 Hz. Kako se promijene period i valna duljina kad se frekvencija udvostruči?' },
      { en: 'Hearing range: with the volume low, start the sweep up and press the button when the tone disappears. Compare with an adult.', hr: 'Raspon sluha: uz malu glasnoću pokreni rastući ton i pritisni tipku kad ton nestane. Usporedi s odraslom osobom.' },
      { en: 'Beats: set 440 Hz and 444 Hz. Count the beats in 5 seconds. Does it match |f₁ − f₂|?', hr: 'Udari: namjesti 440 Hz i 444 Hz. Izbroji udare u 5 sekundi. Slaže li se to s |f₁ − f₂|?' },
      { en: 'Scale: divide the frequency of C5 by the frequency of C4. What do you get for an octave?', hr: 'Ljestvica: podijeli frekvenciju tona c² s frekvencijom tona c¹. Što dobiješ za oktavu?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme, mode = 'one', dead = false, noteTimer = 0;
      const texts = new Map();                         // element -> {en, hr}; re-applied in setLang
      const T = (e, o) => { texts.set(e, o); e.textContent = K.tr(o, lang); return e; };
      const bigBtn = (parent, label, primary) => {
        const b = el('button', 'sk-btn' + (primary ? ' primary' : ''), parent);
        b.type = 'button'; b.style.minHeight = '50px'; b.style.flex = '1 1 110px'; b.style.whiteSpace = 'normal';
        return T(b, label);
      };
      const st = { f: 440, type: 'sine', vol: 0.5, f1: 440, f2: 444, play: null, sweep: null, upper: null, lower: null, said: null, note: -1 };
      const au = { ac: null, voices: [] };

      // ---------- DOM ----------
      const C0 = K.controls(container, lang);
      C0.segmented({ label: { en: 'Tool', hr: 'Alat' }, options: MODES, value: mode, onChange: setMode });
      C0.slider({ label: { en: 'Volume', hr: 'Glasnoća' }, min: 0, max: 100, step: 1, value: 50, unit: '%', digits: 0, onChange: v => { st.vol = v / 100; retune(); draw(); } });

      const panel = el('div', 'sk-panel', container);
      const disp = el('div', 'sk-big', panel), sub = el('div', '', panel); sub.style.textAlign = 'center';
      const rows = { one: el('div', 'sk-row', panel), range: el('div', 'sk-row', panel), beats: el('div', 'sk-row', panel), scale: el('div', 'sk-row', panel) };
      const bMinus = bigBtn(rows.one, '− 1 Hz'), bPlay = bigBtn(rows.one, PLAY, true), bPlus = bigBtn(rows.one, '+ 1 Hz');
      const bUp = bigBtn(rows.range, { en: 'Start sweep up', hr: 'Pokreni rastući ton' }), bDown = bigBtn(rows.range, { en: 'Start sweep down', hr: 'Pokreni padajući ton' });
      const bCant = bigBtn(rows.range, { en: 'I can\'t hear it any more', hr: 'Više ne čujem' }, true), bStopR = bigBtn(rows.range, STOP);
      const bBeats = bigBtn(rows.beats, PLAY_BOTH, true);
      const noteBtns = SCALE.map((s, i) => {
        const b = bigBtn(rows.scale, bi(l => noteName(s.semi, l))); b.style.flex = '1 1 52px'; b.style.fontSize = '1.1rem';
        b.addEventListener('click', () => playNote(i)); return b;
      });
      const msgSafe = T(el('div', 'sk-msg', panel), SAFE), msgAudio = T(el('div', 'sk-msg', panel), NO_AUDIO);
      msgAudio.hidden = true;
      bMinus.addEventListener('click', () => setF(st.f - 1)); bPlus.addEventListener('click', () => setF(st.f + 1)); bPlay.addEventListener('click', playOne);
      bUp.addEventListener('click', () => startSweep('up')); bDown.addEventListener('click', () => startSweep('down'));
      bCant.addEventListener('click', () => endSweep(false)); bStopR.addEventListener('click', () => { silence(); render(); });
      bBeats.addEventListener('click', playBeats);

      const cv = K.createCanvas(container, { aspect: 2.6, minHeight: 220, maxHeight: 300 });
      const C1 = K.controls(container, lang), C2 = K.controls(container, lang), C3 = K.controls(container, lang), C4 = K.controls(container, lang);
      const sOfF = f => 1000 * Math.log(f / F_MIN) / Math.log(F_MAX / F_MIN), fOfS = s => F_MIN * Math.pow(F_MAX / F_MIN, s / 1000);
      const slF = C1.slider({ label: { en: 'Frequency (logarithmic scale)', hr: 'Frekvencija (logaritamska ljestvica)' }, min: 0, max: 1000, step: 1, value: sOfF(440),
        format: (v, l) => fmtHz(st.f, l) + ' Hz',
        onChange: v => { const f = fOfS(v); st.f = K.clamp(f < 100 ? Math.round(f * 10) / 10 : Math.round(f), F_MIN, F_MAX); slF.set(v); inF.set(fmtHz(st.f, lang)); retune(); render(); } });
      const inF = C1.input({ label: { en: 'Exact frequency', hr: 'Točna frekvencija' }, type: 'number', unit: 'Hz', value: '440', placeholder: '20–20000',
        onChange: () => { const v = inF.getNumber(); if (v !== null && v >= F_MIN && v <= F_MAX) { st.f = v; slF.set(sOfF(v)); retune(); render(); } },
        onEnter: () => { const v = inF.getNumber(); setF(v === null ? st.f : v); } });
      const selWave = C1.select({ label: { en: 'Waveform', hr: 'Oblik vala' }, options: WAVES, value: 'sine', onChange: v => { st.type = LOUD[v] ? v : 'sine'; retune(); render(); } });
      const outNote = C1.readout({ label: { en: 'Nearest note (A4 = 440 Hz)', hr: 'Najbliži ton (a¹ = 440 Hz)' } });
      const outT = C1.readout({ label: { en: 'Period T = 1/f', hr: 'Period T = 1/f' }, unit: 'ms', digits: 2 });
      const outLam = C1.readout({ label: { en: 'Wavelength in air λ = 340 m/s : f', hr: 'Valna duljina u zraku λ = 340 m/s : f' } });
      C1.note({ text: { en: 'Higher frequency = higher pitch, shorter period and shorter wavelength. Louder = bigger amplitude (a taller wave). A sine sounds pure; square and sawtooth waves contain extra higher tones and sound sharper.',
        hr: 'Veća frekvencija = viši ton, kraći period i kraća valna duljina. Glasnije = veća amplituda (viši val). Sinusni ton zvuči čisto; pravokutni i pilasti val sadrže dodatne više tonove pa zvuče oštrije.' } });

      const outUp = C2.readout({ label: { en: 'Your upper limit', hr: 'Tvoja gornja granica' }, unit: 'Hz', digits: 0 });
      const outLow = C2.readout({ label: { en: 'Your lower limit (with this speaker)', hr: 'Tvoja donja granica (s ovim zvučnikom)' }, unit: 'Hz', digits: 0 });
      C2.note({ text: { en: 'Typical upper limits: a child about 20 kHz, a 30-year-old about 16 kHz, a 60-year-old about 12 kHz. Hearing for high tones fades with age.',
        hr: 'Tipične gornje granice: dijete oko 20 kHz, osoba od 30 godina oko 16 kHz, osoba od 60 godina oko 12 kHz. Sluh za visoke tonove s godinama slabi.' } });
      C2.note({ text: { en: 'Small laptop and phone speakers cannot play very low tones (often nothing below 100–200 Hz). The lower limit you find is the limit of the speaker, not of your ear, which hears down to about 20 Hz.',
        hr: 'Mali zvučnici prijenosnog računala i mobitela ne mogu reproducirati vrlo duboke tonove (često ništa ispod 100–200 Hz). Donja granica koju nađeš granica je zvučnika, a ne tvog uha, koje čuje do oko 20 Hz.' } });

      const slF1 = C3.slider({ label: { en: 'Tone 1, f₁', hr: 'Ton 1, f₁' }, min: 200, max: 600, step: 1, value: 440, unit: 'Hz', digits: 0, onChange: v => { st.f1 = v; retune(); render(); } });
      const slF2 = C3.slider({ label: { en: 'Tone 2, f₂', hr: 'Ton 2, f₂' }, min: 200, max: 600, step: 1, value: 444, unit: 'Hz', digits: 0, onChange: v => { st.f2 = v; retune(); render(); } });
      const outBeat = C3.readout({ label: { en: 'Beat frequency |f₁ − f₂|', hr: 'Frekvencija udara |f₁ − f₂|' }, unit: 'Hz', digits: 0 });
      const outBeatT = C3.readout({ label: { en: 'One beat lasts', hr: 'Jedan udar traje' }, unit: 's', digits: 2 });
      C3.note({ text: { en: 'Musicians tune their instruments like this: they play two strings together and turn the peg until the beats slow down and disappear. Then both frequencies are equal.',
        hr: 'Glazbenici ovako ugađaju glazbala: odsviraju dvije žice zajedno i okreću vijak dok udari ne uspore i ne nestanu. Tada su obje frekvencije jednake.' } });

      const outNoteF = C4.readout({ label: { en: 'Frequency of the note', hr: 'Frekvencija tona' }, unit: 'Hz', digits: 1 });
      const outRatio = C4.readout({ label: { en: 'Compared with C4', hr: 'U odnosu na c¹' }, unit: '×', digits: 2 });
      C4.note({ text: { en: 'One octave up = double the frequency: C5 (523 Hz) has twice the frequency of C4 (262 Hz). Play them one after the other: they sound alike, only higher.',
        hr: 'Jedna oktava više = dvostruka frekvencija: c² (523 Hz) ima dvostruko veću frekvenciju od c¹ (262 Hz). Odsviraj ih jedan za drugim: zvuče slično, samo više.' } });

      // ---------- Web Audio (created on the first Play click only) ----------
      function ensureAudio() {
        try {
          if (!au.ac) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) throw new Error('no Web Audio'); au.ac = new AC(); }
          if (au.ac.state === 'suspended' && au.ac.resume) { const p = au.ac.resume(); if (p && p.catch) p.catch(() => {}); }
          return au.ac;
        } catch (e) { au.ac = null; msgAudio.hidden = false; return null; }
      }
      function addVoice(f, type, gain) {
        const ac = ensureAudio(); if (!ac) return null;
        try {
          const osc = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
          osc.type = type; osc.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(Math.min(MAX_GAIN, gain), t + 0.03);
          osc.connect(g); g.connect(ac.destination); osc.start();
          const v = { osc, g }; au.voices.push(v); return v;
        } catch (e) { msgAudio.hidden = false; return null; }
      }
      function silence() { // fade out and release every oscillator, cancel the sweep and the note timer
        clearTimeout(noteTimer); noteTimer = 0;
        au.voices.splice(0).forEach(v => {
          const off = () => { try { v.osc.disconnect(); v.g.disconnect(); } catch (e) { /* already gone */ } };
          try {
            const t = au.ac.currentTime;
            v.g.gain.cancelScheduledValues(t); v.g.gain.setValueAtTime(v.g.gain.value, t); v.g.gain.linearRampToValueAtTime(0, t + 0.04);
            v.osc.onended = off; v.osc.stop(t + 0.06);
          } catch (e) { off(); }
        });
        st.play = null; st.sweep = null; loop.stop();
      }
      const gainOne = () => st.vol * MAX_GAIN * LOUD[st.type];
      function retune() { // follow the sliders while a tone is playing
        const v = au.voices; if (!au.ac || !v.length) return;
        try {
          const t = au.ac.currentTime;
          if (st.play === 'one') { v[0].osc.type = st.type; v[0].osc.frequency.setTargetAtTime(st.f, t, 0.015); v[0].g.gain.setTargetAtTime(gainOne(), t, 0.02); }
          else if (st.play === 'beats' && v.length > 1) { v[0].osc.frequency.setTargetAtTime(st.f1, t, 0.015); v[1].osc.frequency.setTargetAtTime(st.f2, t, 0.015); v.forEach(x => x.g.gain.setTargetAtTime(st.vol * MAX_GAIN / 2, t, 0.02)); }
          else v.forEach(x => x.g.gain.setTargetAtTime(st.vol * MAX_GAIN, t, 0.02));
        } catch (e) { /* the picture still follows */ }
      }
      function playOne() { const was = st.play === 'one'; silence(); if (!was && addVoice(st.f, st.type, gainOne())) st.play = 'one'; render(); }
      function playBeats() {
        const was = st.play === 'beats'; silence();
        if (!was) { const g = st.vol * MAX_GAIN / 2; if (addVoice(st.f1, 'sine', g) && addVoice(st.f2, 'sine', g)) st.play = 'beats'; else silence(); }
        render();
      }
      function playNote(i) {
        silence(); st.note = i;
        if (addVoice(SCALE[i].f, 'sine', st.vol * MAX_GAIN)) { st.play = 'note'; noteTimer = setTimeout(() => { noteTimer = 0; if (dead) return; silence(); render(); }, 600); }
        render();
      }
      function startSweep(dir) {
        silence(); st.said = null;
        const cfg = SWEEPS[dir], v = addVoice(cfg.f0, 'sine', st.vol * MAX_GAIN);
        if (v) {
          try { v.osc.frequency.exponentialRampToValueAtTime(cfg.f1, au.ac.currentTime + cfg.dur); } catch (e) { /* the tone stays at its start */ }
          st.sweep = { dir, cfg, t0: au.ac.currentTime, f: cfg.f0 }; st.play = 'sweep'; loop.start();
        }
        render();
      }
      function endSweep(heardAll) { // the pupil pressed "I can't hear it", or the sweep reached its end while still heard
        const s = st.sweep;
        if (st.play !== 'sweep' || !s) { st.said = 'idle'; render(); return; }
        const rec = { f: heardAll ? s.cfg.f1 : s.f, all: heardAll };
        if (s.dir === 'up') st.upper = rec; else st.lower = rec;
        st.said = s.dir; silence(); render();
      }
      function setF(f) { st.f = K.clamp(Math.round(f * 10) / 10, F_MIN, F_MAX); slF.set(sOfF(st.f)); inF.set(fmtHz(st.f, lang)); retune(); render(); }

      // ---------- text ----------
      function noteText(f, l) {
        const nt = nearest(f), c = Math.round(Math.abs(nt.cents));
        return noteName(nt.n, l) + (c >= 1 ? ' ' + (nt.cents > 0 ? '+' : '−') + c + (l === 'hr' ? ' centi' : ' cent') : '');
      }
      const lamText = (f, l) => { const lam = V_SOUND / f; return lam >= 1 ? K.fmt(lam, 2, l) + ' m' : K.fmt(lam * 100, 1, l) + ' cm'; };
      function rangeText(l) {
        const en = l === 'en', s = st.sweep, lim = st.said === 'up' ? st.upper : st.said === 'down' ? st.lower : null;
        if (s) return s.dir === 'up' ? (en ? 'The tone is rising. Press "I can\'t hear it any more" the moment it disappears.' : 'Ton raste. Pritisni „Više ne čujem” čim nestane.')
          : (en ? 'The tone is falling. Press "I can\'t hear it any more" the moment it disappears.' : 'Ton pada. Pritisni „Više ne čujem” čim nestane.');
        if (st.said === 'idle') return en ? 'Start a sweep first, then press the button when the tone disappears.' : 'Najprije pokreni ton, a zatim pritisni tipku kad ton nestane.';
        if (lim && lim.all) return en ? 'You heard the tone right to the end of the sweep (' + fmtHz(lim.f, l) + ' Hz).' : 'Ton se čuo sve do kraja (' + fmtHz(lim.f, l) + ' Hz).';
        if (lim) return (st.said === 'up' ? (en ? 'Your upper limit is about ' : 'Tvoja gornja granica je oko ') : (en ? 'Your lower limit with this speaker is about ' : 'Tvoja donja granica s ovim zvučnikom je oko ')) + fmtHz(lim.f, l) + ' Hz.';
        return en ? 'Start a sweep and listen. Press "I can\'t hear it any more" the moment the tone disappears.' : 'Pokreni ton i slušaj. Pritisni „Više ne čujem” čim ton nestane.';
      }
      function renderHead() {
        const d = Math.abs(st.f1 - st.f2);
        if (mode === 'one') { disp.textContent = fmtHz(st.f, lang) + ' Hz'; sub.textContent = noteText(st.f, lang) + '  ·  T = ' + K.fmt(1000 / st.f, 2, lang) + ' ms  ·  λ = ' + lamText(st.f, lang); }
        else if (mode === 'range') { disp.textContent = (st.sweep ? K.fmt(st.sweep.f, 0, lang) : '–') + ' Hz'; sub.textContent = rangeText(lang); }
        else if (mode === 'beats') {
          disp.textContent = K.fmt(d, 0, lang) + ' Hz';
          sub.textContent = d > 0 ? K.tr({ en: 'Beat frequency |f₁ − f₂|: the sound swells and fades ', hr: 'Frekvencija udara |f₁ − f₂|: zvuk se pojača i utiša ' }, lang) + K.fmt(d, 0, lang) + K.tr({ en: ' times every second.', hr: ' puta u sekundi.' }, lang)
            : K.tr({ en: 'The two tones are equal: no beats.', hr: 'Tonovi su jednaki: nema udara.' }, lang);
        } else {
          const s = SCALE[st.note];
          disp.textContent = s ? noteName(s.semi, lang) + ' = ' + K.fmt(s.f, 1, lang) + ' Hz' : '♪';
          sub.textContent = s ? K.fmt(s.f / SCALE[0].f, 2, lang) + ' × ' + noteName(SCALE[0].semi, lang) + ' (' + K.fmt(SCALE[0].f, 1, lang) + ' Hz)' : K.tr({ en: 'Press a note.', hr: 'Pritisni ton.' }, lang);
        }
      }
      function render() {
        const d = Math.abs(st.f1 - st.f2), s = SCALE[st.note];
        renderHead();
        T(bPlay, st.play === 'one' ? STOP : PLAY); T(bBeats, st.play === 'beats' ? STOP : PLAY_BOTH);
        bCant.disabled = st.play !== 'sweep';
        noteBtns.forEach((b, i) => b.classList.toggle('is-active', i === st.note && st.play === 'note'));
        outNote.set(noteText(st.f, lang)); outT.set(1000 / st.f); outLam.set(lamText(st.f, lang));
        outUp.set(st.upper ? st.upper.f : null); outLow.set(st.lower ? st.lower.f : null);
        outBeat.set(d); outBeatT.set(d > 0 ? 1 / d : null);
        outNoteF.set(s ? s.f : null); outRatio.set(s ? s.f / SCALE[0].f : null);
        draw();
      }

      // ---------- drawing ----------
      const head = (g, str) => K.text(g, str, 12, 15, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
      function timeAxis(g, x0, x1, y, total, n) { // n + 1 ticks, labels in ms
        const d = total >= 100 ? 0 : total >= 10 ? 1 : total >= 1 ? 2 : 3;
        g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y);
        for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; g.moveTo(x, y); g.lineTo(x, y + 5); }
        g.stroke();
        for (let i = 0; i <= n; i++) K.text(g, K.fmt(total * i / n, d, lang) + (i === n ? ' ms' : ''), x0 + (x1 - x0) * i / n, y + 8,
          { font: '11px ' + theme.font, color: theme.muted, align: i === 0 ? 'left' : i === n ? 'right' : 'center', baseline: 'top' });
      }
      function drawOne(g, w, h) {
        const x0 = 14, x1 = w - 14, yt = 50, yb = h - 26, yc = (yt + yb) / 2, A = (yb - yt) / 2 * st.vol, Tms = 1000 / st.f, xT = x0 + (x1 - x0) / 3;
        head(g, K.tr({ en: 'Three periods: ', hr: 'Tri perioda: ' }, lang) + K.tr(WAVES.find(x => x.value === st.type).label, lang) + K.tr({ en: ' wave, ', hr: ' val, ' }, lang) + fmtHz(st.f, lang) + ' Hz');
        g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, yc); g.lineTo(x1, yc); g.moveTo(xT, yt - 6); g.lineTo(xT, yb); g.stroke();
        g.strokeStyle = theme.c1; g.lineWidth = 2; g.lineJoin = 'round'; g.beginPath();
        for (let i = 0, n = Math.round((x1 - x0) * 2); i <= n; i++) { const y = yc - A * wave(st.type, 3 * i / n); if (i) g.lineTo(x0 + i / 2, y); else g.moveTo(x0, y); }
        g.stroke();
        K.arrow(g, (x0 + xT) / 2, 38, xT - 1, 38, { color: theme.fg, width: 1.5, head: 6 }); K.arrow(g, (x0 + xT) / 2, 38, x0 + 1, 38, { color: theme.fg, width: 1.5, head: 6 });
        K.text(g, 'T = ' + K.fmt(Tms, Tms >= 10 ? 1 : Tms >= 1 ? 2 : 3, lang) + ' ms', xT + 8, 38, { font: '12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        if (st.vol === 0) K.text(g, K.tr({ en: 'volume 0: silence', hr: 'glasnoća 0: tišina' }, lang), x1, yc - 8, { font: '12px ' + theme.font, color: theme.muted, align: 'right' });
        timeAxis(g, x0, x1, yb, 3 * Tms, 3);
      }
      function track(g, w, y, o) { // one frequency band on a logarithmic axis
        const x0 = 20, x1 = w - 20, X = f => x0 + (x1 - x0) * Math.log(K.clamp(f, o.lo, o.hi) / o.lo) / Math.log(o.hi / o.lo);
        K.text(g, o.title, 12, y - (o.ages ? 40 : 20), { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        g.fillStyle = K.withAlpha(theme.c1, 0.25); K.roundRect(g, x0, y, x1 - x0, 14, 7); g.fill();
        o.ticks.forEach((f, i) => {
          const x = X(f); g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + 14); g.lineTo(x, y + 19); g.stroke();
          K.text(g, o.fmt(f) + (i === o.ticks.length - 1 ? o.unit : ''), x, y + 22, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        });
        (o.ages || []).forEach(a => {
          const x = X(a.f); g.fillStyle = theme.muted; g.beginPath(); g.moveTo(x, y - 2); g.lineTo(x - 5, y - 10); g.lineTo(x + 5, y - 10); g.closePath(); g.fill();
          K.text(g, K.tr(a.label, lang), x + (a.f === o.hi ? 6 : 0), y - 13, { font: '11px ' + theme.font, color: theme.fg, align: a.f === o.hi ? 'right' : 'center', baseline: 'bottom' });
        });
        if (o.mark) { g.fillStyle = theme.c3; K.roundRect(g, X(o.mark) - 3, y - 4, 6, 22, 3); g.fill(); }
        if (o.cur) { g.fillStyle = theme.c2; g.beginPath(); g.arc(X(o.cur), y + 7, 9, 0, Math.PI * 2); g.fill(); }
      }
      function drawRange(g, w, h) {
        const s = st.sweep, mine = r => (r ? K.tr({ en: ': your limit ', hr: ': tvoja granica ' }, lang) + fmtHz(r.f, lang) + ' Hz' : '');
        track(g, w, 58, { title: K.tr({ en: 'High tones', hr: 'Visoki tonovi' }, lang) + mine(st.upper), lo: 8000, hi: 20000, ticks: [8000, 10000, 12000, 14000, 16000, 18000, 20000], fmt: f => K.fmt(f / 1000, 0, lang), unit: ' kHz',
          ages: AGES, mark: st.upper && st.upper.f, cur: s && s.dir === 'up' ? s.f : 0 });
        track(g, w, h - 48, { title: K.tr({ en: 'Low tones', hr: 'Duboki tonovi' }, lang) + mine(st.lower), lo: 20, hi: 200, ticks: [20, 30, 50, 70, 100, 150, 200], fmt: f => K.fmt(f, 0, lang), unit: ' Hz',
          mark: st.lower && st.lower.f, cur: s && s.dir === 'down' ? s.f : 0 });
      }
      function drawBeats(g, w, h) {
        const d = Math.abs(st.f1 - st.f2), fc = (st.f1 + st.f2) / 2, win = d > 0 ? Math.min(2 / d, 1) : 0.02;   // two beats, at most 1 s
        const x0 = 14, x1 = w - 14, yt = 34, yb = h - 26, yc = (yt + yb) / 2, A = (yb - yt) / 4 * 0.94 * st.vol, n = Math.round(x1 - x0), dt = win / n;
        head(g, K.tr({ en: 'Sum of both tones', hr: 'Zbroj obaju tonova' }, lang) + ' (' + K.fmt(st.f1, 0, lang) + ' Hz + ' + K.fmt(st.f2, 0, lang) + ' Hz)');
        g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, yc); g.lineTo(x1, yc); g.stroke();
        // per pixel column draw the lowest…highest value, so fast oscillations are not lost between pixels
        const k = Math.ceil(K.clamp(fc * dt * 10, 1, 30));
        g.strokeStyle = theme.c1; g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i < n; i++) {
          let lo = 9, hi = -9;
          for (let j = 0; j <= k; j++) { const t = (i + j / k) * dt, y = Math.sin(2 * Math.PI * st.f1 * t) + Math.sin(2 * Math.PI * st.f2 * t); if (y < lo) lo = y; if (y > hi) hi = y; }
          g.moveTo(x0 + i + 0.5, yc - A * hi - 0.5); g.lineTo(x0 + i + 0.5, yc - A * lo + 0.5);
        }
        g.stroke();
        g.strokeStyle = theme.c2; g.lineWidth = 2; g.setLineDash([6, 4]);
        [1, -1].forEach(sg => { g.beginPath(); for (let i = 0; i <= n; i++) { const y = yc - sg * 2 * A * Math.abs(Math.cos(Math.PI * d * i * dt)); if (i) g.lineTo(x0 + i, y); else g.moveTo(x0, y); } g.stroke(); });
        g.setLineDash([]);
        timeAxis(g, x0, x1, yb, win * 1000, 4);
      }
      function drawScale(g, w, h) {
        const x0 = 14, x1 = w - 14, yt = 44, yb = h - 26, slot = (x1 - x0) / SCALE.length, bw = Math.min(slot * 0.7, 56), top = SCALE[SCALE.length - 1].f;
        head(g, K.tr({ en: 'Frequencies of the scale (Hz)', hr: 'Frekvencije tonova ljestvice (Hz)' }, lang));
        SCALE.forEach((s, i) => {
          const cx = x0 + slot * (i + 0.5), bh = (yb - yt) * s.f / top;
          g.fillStyle = i === st.note ? theme.c2 : theme.c1; K.roundRect(g, cx - bw / 2, yb - bh, bw, bh, 5); g.fill();
          K.text(g, K.fmt(s.f, 0, lang), cx, yb - bh - 4, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
          K.text(g, noteName(s.semi, lang), cx, yb + 5, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        });
        g.save(); g.strokeStyle = theme.muted; g.lineWidth = 1; g.setLineDash([4, 4]); g.beginPath();
        [0.5, 1].forEach(r => { g.moveTo(x0, yb - (yb - yt) * r); g.lineTo(x1, yb - (yb - yt) * r); });
        g.stroke(); g.restore();
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (mode === 'one') drawOne(g, w, h); else if (mode === 'range') drawRange(g, w, h); else if (mode === 'beats') drawBeats(g, w, h); else drawScale(g, w, h);
      }

      // ---------- shared ----------
      const loop = K.loop(() => { // runs only during a sweep; the audio clock tells where the sweep is
        const s = st.sweep; if (!s || !au.ac) return;
        const u = K.clamp((au.ac.currentTime - s.t0) / s.cfg.dur, 0, 1);
        s.f = s.cfg.f0 * Math.pow(s.cfg.f1 / s.cfg.f0, u);
        if (u >= 1) { endSweep(true); return; }
        renderHead(); draw();
      });
      function setMode(m) {
        silence(); mode = m; st.said = null;
        Object.keys(rows).forEach(k => { rows[k].hidden = k !== m; });
        C1.el.hidden = m !== 'one'; C2.el.hidden = msgSafe.hidden = m !== 'range'; C3.el.hidden = m !== 'beats'; C4.el.hidden = m !== 'scale';
        render();
      }
      function reset() { // stop the sound and put the open tool back to its start (the volume is left alone)
        silence(); st.said = null;
        if (mode === 'one') { st.type = 'sine'; selWave.set('sine'); setF(440); }
        else if (mode === 'range') { st.upper = st.lower = null; }
        else if (mode === 'beats') { st.f1 = 440; st.f2 = 444; slF1.set(440); slF2.set(444); }
        else st.note = -1;
        render();
      }
      cv.onResize(draw);
      setMode(mode);

      return {
        destroy() {
          dead = true; silence();
          if (au.ac) { const ac = au.ac; au.ac = null; try { const p = ac.close(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* ignore */ } }
          loop.destroy(); cv.destroy(); [C0, C1, C2, C3, C4].forEach(c => c.destroy()); panel.remove(); texts.clear();
        },
        setLang(l) { lang = l; [C0, C1, C2, C3, C4].forEach(c => c.setLang(l)); texts.forEach((o, e) => { e.textContent = K.tr(o, l); }); inF.set(fmtHz(st.f, l)); render(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
