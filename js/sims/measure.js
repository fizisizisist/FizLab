/* FizLab sim: Measure It! — read a ruler to the millimetre, measure many times (mean, deviations, result ± error)
   and tell a precise instrument from an accurate one. */
(function () {
  'use strict';
  const K = window.SimKit;
  const OBJECTS = [
    { id: 'pencil', min: 8, max: 18, hf: 0.5, color: 'c4', label: { en: 'pencil', hr: 'olovka' } },
    { id: 'key', min: 4, max: 8, hf: 0.9, color: 'c2', label: { en: 'key', hr: 'ključ' } },
    { id: 'leaf', min: 4, max: 12, hf: 1.0, color: 'c6', label: { en: 'leaf', hr: 'list' } },
    { id: 'phone', min: 12, max: 17, hf: 1.0, color: 'c1', label: { en: 'phone', hr: 'mobitel' } },
    { id: 'eraser', min: 3, max: 6, hf: 0.9, color: 'c5', label: { en: 'eraser', hr: 'gumica' } },
    { id: 'nail', min: 3, max: 10, hf: 0.45, color: 'muted', label: { en: 'nail', hr: 'čavao' } }
  ];
  const RULER_CM = 20, MAXR = 10, TRUE_C = 10, TOL = 0.1, HALF_DIV = 0.05, PREC_LIM = 0.15, ACC_LIM = 0.25;
  const NEW_LABEL = { ruler: { en: 'New object', hr: 'Novi predmet' }, repeat: { en: 'New object', hr: 'Novi predmet' }, target: { en: 'New instrument', hr: 'Novi instrument' } };
  const HINT_A = { en: 'Where does the object end? Where does it start? Type the length with one decimal (mm) and press Check.', hr: 'Gdje predmet završava? Gdje počinje? Upiši duljinu s jednom decimalom (mm) i pritisni Provjeri.' };
  const HINT_B = { en: 'Press Measure several times. Every reading is a little different — that is normal.', hr: 'Pritisni Izmjeri nekoliko puta. Svako se mjerenje malo razlikuje — to je normalno.' };
  const NUDGE_B = { en: 'One reading looks very different from the others. Is it a gross error? Click it and press Discard selected.', hr: 'Jedno mjerenje jako odskače. Je li to gruba pogreška? Klikni na njega i pritisni Odbaci označeno.' };
  const HINT_C = { en: 'A hidden instrument measures a rod of exactly 10.00 cm. Press Measure 5–10 times, then describe the instrument.', hr: 'Skriveni instrument mjeri štap duljine točno 10,00 cm. Pritisni Izmjeri 5–10 puta, a zatim opiši instrument.' };
  const DISCARD = { en: 'Discard selected', hr: 'Odbaci označeno' }, RESTORE = { en: 'Restore selected', hr: 'Vrati označeno' };
  const DESC = { pa: { en: 'precise and accurate', hr: 'precizan i točan' }, pn: { en: 'precise but not accurate', hr: 'precizan, ali netočan' },
    ia: { en: 'accurate but not precise', hr: 'točan, ali neprecizan' }, in: { en: 'neither precise nor accurate', hr: 'ni precizan ni točan' } };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  function gauss() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const bi = f => ({ en: f('en'), hr: f('hr') });
  const T = (l, en, hr) => (l === 'hr' ? hr : en);
  function stats(vals) {
    const n = vals.length; if (!n) return null;
    const mean = vals.reduce((a, b) => a + b, 0) / n;
    const devs = vals.map(v => Math.abs(v - mean));
    return { n, mean, devs, maxDev: Math.max.apply(null, devs) };
  }
  function wrap(g, str, maxW, font) {
    g.save(); g.font = font;
    const words = String(str).split(' '), lines = []; let cur = '';
    words.forEach(wd => { const t = cur ? cur + ' ' + wd : wd; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; });
    if (cur) lines.push(cur);
    g.restore(); return lines;
  }

  window.Sims.register({
    id: 'measure',
    title: { en: 'Measure It!', hr: 'Izmjeri!' },
    summary: {
      en: 'Read a ruler to the millimetre, measure the same object many times and write the result with its error, and learn the difference between precise and accurate.',
      hr: 'Očitaj ravnalo do milimetra, izmjeri isti predmet više puta i zapiši rezultat s pogreškom te nauči razliku između preciznog i točnog.'
    },
    tasks: [
      { en: 'Read the ruler: with the magnifier on, estimate where the object ends between the mm marks and type the length with one decimal (e.g. 12.3 cm).', hr: 'Očitaj ravnalo: uz uključeno povećalo procijeni gdje predmet završava između milimetarskih crtica i upiši duljinu s jednom decimalom (npr. 12,3 cm).' },
      { en: 'Careful: sometimes the object does not start at 0! Where does it start? Subtract.', hr: 'Pažljivo: predmet katkad ne počinje na 0! Gdje počinje? Oduzmi.' },
      { en: 'Measure many times: press Measure 8 times. Does one reading stand out? Discard it, press Compute and read the result (x̄ ± Δx) cm.', hr: 'Mjeri više puta: pritisni Izmjeri 8 puta. Odskače li neko mjerenje? Odbaci ga, pritisni Izračunaj i pročitaj rezultat (x̄ ± Δx) cm.' },
      { en: 'Precise or accurate? Measure 6 times and describe the hidden instrument. How does a systematic error look on the target?', hr: 'Precizno ili točno? Izmjeri 6 puta i opiši skriveni instrument. Kako sustavna pogreška izgleda na meti?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = {
        mode: 'ruler',
        obj: OBJECTS[0], len: 12.3, x0: 0, mag: true, magCm: 12.3, attempts: 0, solved: false, fbA: null, kindA: null, scoreA: { ok: 0, n: 0 },
        rObj: OBJECTS[1], rLen: 8.2, readings: [], sel: -1, res: null, reveal: false, grossN: 0, fbB: null,
        inst: { bias: 0, sigma: 0.04 }, dots: [], answered: null, fbC: null, scoreC: { ok: 0, n: 0 }
      };
      let layA = null, layB = null, dragging = false;

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: [
        { value: 'ruler', label: { en: 'Read the ruler', hr: 'Očitaj ravnalo' } },
        { value: 'repeat', label: { en: 'Measure many times', hr: 'Mjeri više puta' } },
        { value: 'target', label: { en: 'Precise or accurate?', hr: 'Precizno ili točno?' } }], value: 'ruler', onChange: setMode });
      const togMag = C.toggle({ label: { en: 'Magnifier', hr: 'Povećalo' }, value: true, onChange: v => { st.mag = v; draw(); } });
      // typed length (SimKit has no text input, so build one in the same grid)
      const inpField = document.createElement('div'); inpField.className = 'sk-field';
      const inpLab = document.createElement('label'); inpLab.className = 'sk-label';
      const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'sk-select'; inp.setAttribute('inputmode', 'decimal'); inp.autocomplete = 'off';
      inp.id = 'sk-measure-' + Math.floor(Math.random() * 1e9); inpLab.htmlFor = inp.id;
      inpField.appendChild(inpLab); inpField.appendChild(inp); C.el.appendChild(inpField);
      function relabelInput() { inpLab.textContent = K.tr({ en: 'Length you read', hr: 'Očitana duljina' }, lang) + ' (cm)'; inp.placeholder = K.tr({ en: 'e.g. 12.3', hr: 'npr. 12,3' }, lang); }
      const onKey = e => { if (e.key === 'Enter') { e.preventDefault(); check(); } };
      inp.addEventListener('keydown', onKey);
      const btnCheck = C.button({ label: { en: 'Check', hr: 'Provjeri' }, variant: 'primary', onClick: check });
      const btnMeasure = C.button({ label: { en: 'Measure', hr: 'Izmjeri' }, variant: 'primary', onClick: () => { if (st.mode === 'repeat') measureB(); else if (st.mode === 'target') measureC(); } });
      const btnDiscard = C.button({ label: DISCARD, onClick: discard });
      const btnCompute = C.button({ label: { en: 'Compute', hr: 'Izračunaj' }, onClick: compute });
      const togTrue = C.toggle({ label: { en: 'Show true value', hr: 'Pokaži pravu vrijednost' }, value: false, onChange: v => { st.reveal = v; updateNote(); draw(); } });
      const segVerdict = C.segmented({ label: { en: 'The instrument is…', hr: 'Instrument je…' }, options: [
        { value: 'pa', label: { en: 'precise & accurate', hr: 'precizan i točan' } },
        { value: 'pn', label: { en: 'precise, not accurate', hr: 'precizan, ali netočan' } },
        { value: 'ia', label: { en: 'accurate, not precise', hr: 'točan, ali neprecizan' } },
        { value: 'in', label: { en: 'neither', hr: 'ni jedno ni drugo' } }], value: null, onChange: verdict });
      const btnNew = C.button({ label: NEW_LABEL.ruler, onClick: newRound });
      const outScore = C.readout({ label: { en: 'Score', hr: 'Bodovi' } });
      const outN = C.readout({ label: { en: 'Readings', hr: 'Broj mjerenja' }, digits: 0 });
      const outMean = C.readout({ label: { en: 'Mean x̄', hr: 'Srednja vrijednost x̄' }, unit: 'cm', digits: 2 });
      const outDev = C.readout({ label: { en: 'Max. abs. deviation Δx', hr: 'Maks. apsolutna pogreška Δx' }, unit: 'cm', digits: 2 });
      const outRel = C.readout({ label: { en: 'Relative error', hr: 'Relativna pogreška' }, unit: '%', digits: 1 });
      const note = C.note({ text: HINT_A });

      function show(c, on) { const e = c.el.closest('.sk-field') || c.el; e.style.display = on ? '' : 'none'; }
      function applyVis() {
        const a = st.mode === 'ruler', b = st.mode === 'repeat', c = st.mode === 'target';
        show(togMag, a); inpField.style.display = a ? '' : 'none'; show(btnCheck, a);
        show(btnMeasure, b || c); show(btnDiscard, b); show(btnCompute, b); show(togTrue, b); show(segVerdict, c);
        show(outScore, a || c); show(outN, b || c); show(outMean, b || c); show(outDev, b || c); show(outRel, b || c);
        btnNew.setLabel(NEW_LABEL[st.mode]);
      }
      function setMode(m) { st.mode = m; applyVis(); updateNote(); updateOut(); draw(); }

      // ---------- mode (a): read the ruler ----------
      function newObject() {
        const o = pick(OBJECTS);
        st.obj = o; st.x0 = Math.random() < 0.35 ? 1.0 : 0;
        st.len = Math.round(rnd(o.min, Math.min(o.max, 18.5 - st.x0)) * 10000) / 10000;
        st.magCm = st.x0 + st.len; st.attempts = 0; st.solved = false; st.fbA = null; st.kindA = null; inp.value = '';
      }
      function check() {
        if (st.mode !== 'ruler') return;
        const raw = inp.value.trim().replace(',', '.'), v = parseFloat(raw);
        if (!raw || Number.isNaN(v)) { st.fbA = { en: 'Type the length in cm, e.g. 12.3', hr: 'Upiši duljinu u cm, npr. 12,3' }; st.kindA = 'warn'; }
        else if (st.solved) { st.fbA = { en: 'Done — press New object for the next one.', hr: 'Riješeno — pritisni Novi predmet za sljedeći.' }; st.kindA = null; }
        else {
          const decimals = (raw.split('.')[1] || '').length, end = st.x0 + st.len;
          if (st.attempts === 0) st.scoreA.n++;
          st.attempts++;
          const f = (x, d, l) => K.fmt(x, d, l);
          if (Math.abs(v - st.len) <= TOL + 1e-9) {
            st.solved = true; st.scoreA.ok++; st.kindA = 'good';
            st.fbA = decimals > 1
              ? bi(l => T(l, 'Right value, but too many digits! A ruler with mm marks cannot give ' + raw + ': the smallest division sets the limit, write ' + f(st.len, 1, l) + ' cm.',
                'Vrijednost je dobra, ali previše znamenki! Ravnalo s milimetrima ne može dati ' + raw.replace('.', ',') + ': najmanji podjeljak određuje granicu, piši ' + f(st.len, 1, l) + ' cm.'))
              : bi(l => T(l, 'Correct! ' + f(st.len, 1, l) + ' cm. The smallest division sets the limit: write ' + f(st.len, 1, l) + ' cm, not ' + f(st.len, 4, l) + '.',
                'Točno! ' + f(st.len, 1, l) + ' cm. Najmanji podjeljak određuje granicu: piši ' + f(st.len, 1, l) + ' cm, a ne ' + f(st.len, 4, l) + '.'));
          } else if (st.x0 > 0 && Math.abs(v - end) <= TOL + 1e-9) {
            st.kindA = 'bad';
            st.fbA = bi(l => T(l, 'The "zero" mistake! The object does not start at 0 but at ' + f(st.x0, 1, l) + ' cm. Length = end − start = ' + f(end, 1, l) + ' − ' + f(st.x0, 1, l) + ' cm. Try again.',
              'Pogreška „nule”! Predmet ne počinje na 0 nego na ' + f(st.x0, 1, l) + ' cm. Duljina = kraj − početak = ' + f(end, 1, l) + ' − ' + f(st.x0, 1, l) + ' cm. Pokušaj ponovno.'));
          } else if (st.attempts >= 2) {
            st.solved = true; st.kindA = 'bad';
            st.fbA = bi(l => T(l, 'Not within ±0.1 cm. The length is ' + f(st.len, 1, l) + ' cm (end ' + f(end, 1, l) + ' cm − start ' + f(st.x0, 1, l) + ' cm). Press New object.',
              'Nije unutar ±0,1 cm. Duljina je ' + f(st.len, 1, l) + ' cm (kraj ' + f(end, 1, l) + ' cm − početak ' + f(st.x0, 1, l) + ' cm). Pritisni Novi predmet.'));
          } else {
            st.kindA = 'warn';
            st.fbA = { en: 'Not within ±0.1 cm. Look at the end of the object in the magnifier and estimate between the mm marks. Try again.', hr: 'Nije unutar ±0,1 cm. Pogledaj kraj predmeta u povećalu i procijeni između milimetarskih crtica. Pokušaj ponovno.' };
          }
        }
        updateNote(); updateOut(); draw();
      }

      // ---------- mode (b): measure many times ----------
      function newRepeat() {
        st.rObj = pick(OBJECTS); st.rLen = Math.round(rnd(5, 16) * 10000) / 10000;
        st.readings = []; st.sel = -1; st.res = null; st.grossN = 0; st.fbB = null; st.reveal = false; togTrue.set(false);
        btnDiscard.setLabel(DISCARD);
      }
      function measureB() {
        if (st.readings.length >= MAXR) { st.fbB = { en: 'That is 10 readings — enough. Check for gross errors and press Compute.', hr: 'To je 10 mjerenja — dovoljno. Provjeri ima li grubih pogrešaka i pritisni Izračunaj.' }; updateNote(); return; }
        let v = st.rLen + gauss() * 0.07, gross = false;
        const p = (st.readings.length === 5 && st.grossN === 0) ? 0.5 : 1 / 8;
        if (st.readings.length >= 2 && st.grossN < 2 && Math.random() < p) { v += Math.random() < 0.6 ? 1.7 : -1.2; gross = true; st.grossN++; }
        st.readings.push({ v: Math.round(v * 10) / 10, gross, out: false });
        st.res = null; st.fbB = null; updateNote(); updateOut(); draw();
      }
      function active() { return st.readings.filter(r => !r.out); }
      function outlierIndex() { // a reading more than 0.5 cm from the median of the others
        const act = active(); if (act.length < 3) return -1;
        const sorted = act.map(r => r.v).sort((a, b) => a - b), med = sorted[Math.floor(sorted.length / 2)];
        return st.readings.findIndex(r => !r.out && Math.abs(r.v - med) > 0.5);
      }
      function updateDiscardLabel() { btnDiscard.setLabel(st.sel >= 0 && st.readings[st.sel] && st.readings[st.sel].out ? RESTORE : DISCARD); }
      function discard() {
        if (st.mode !== 'repeat') return;
        if (st.sel < 0 || !st.readings[st.sel]) { st.fbB = { en: 'Click a reading in the table to select it first.', hr: 'Najprije klikni na mjerenje u tablici da ga označiš.' }; updateNote(); return; }
        st.readings[st.sel].out = !st.readings[st.sel].out; st.res = null; st.fbB = null;
        updateDiscardLabel(); updateNote(); updateOut(); draw();
      }
      function compute() {
        if (st.mode !== 'repeat') return;
        const act = active();
        if (act.length < 3) { st.fbB = { en: 'Measure at least 3 times before computing.', hr: 'Izmjeri barem 3 puta prije računanja.' }; updateNote(); return; }
        const s = stats(act.map(r => r.v));
        const floored = s.maxDev < HALF_DIV, dx = Math.max(s.maxDev, HALF_DIV);
        st.res = { n: s.n, mean: s.mean, maxDev: s.maxDev, dx, rel: dx / s.mean * 100, floored, grossIn: act.some(r => r.gross) };
        st.fbB = null; updateNote(); updateOut(); draw();
      }
      function noteB() {
        if (st.fbB) return st.fbB;
        const r = st.res;
        if (!r) return outlierIndex() >= 0 ? NUDGE_B : HINT_B;
        if (r.grossIn && r.maxDev > 0.5) return bi(l => T(l, 'Δx = ' + K.fmt(r.dx, 2, l) + ' cm is huge compared with the scatter of the other readings — a gross error is still included. Discard it and compute again.',
          'Δx = ' + K.fmt(r.dx, 2, l) + ' cm golem je u usporedbi s rasipanjem ostalih mjerenja — gruba pogreška još je uključena. Odbaci je i izračunaj ponovno.'));
        return bi(l => {
          let s = T(l, 'Result: x = (' + K.fmt(r.mean, 2, l) + ' ± ' + K.fmt(r.dx, 2, l) + ') cm, relative error ' + K.fmt(r.rel, 1, l) + ' % — ' + (r.rel <= 10 ? 'good (≤ 10 %).' : 'large (> 10 %), measure more carefully.'),
            'Rezultat: x = (' + K.fmt(r.mean, 2, l) + ' ± ' + K.fmt(r.dx, 2, l) + ') cm, relativna pogreška ' + K.fmt(r.rel, 1, l) + ' % — ' + (r.rel <= 10 ? 'dobro (≤ 10 %).' : 'velika (> 10 %), mjeri pažljivije.'));
          if (r.floored) s += T(l, ' All readings agree, so Δx is half of the smallest division (0.05 cm).', ' Sva se mjerenja slažu, pa je Δx pola najmanjeg podjeljka (0,05 cm).');
          if (st.reveal) { const inside = Math.abs(st.rLen - r.mean) <= r.dx; s += T(l, ' The true value ' + K.fmt(st.rLen, 2, l) + ' cm ' + (inside ? 'is' : 'is not') + ' inside the interval.', ' Prava vrijednost ' + K.fmt(st.rLen, 2, l) + ' cm ' + (inside ? 'je' : 'nije') + ' unutar intervala.'); }
          return s;
        });
      }

      // ---------- mode (c): precise or accurate ----------
      function newInstrument() {
        st.inst = { sigma: Math.random() < 0.5 ? 0.04 : 0.22, bias: Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? -1 : 1) * rnd(0.7, 1.0) };
        st.dots = []; st.answered = null; st.fbC = null; segVerdict.set(null);
      }
      function measureC() {
        if (st.dots.length >= MAXR) { st.fbC = { en: '10 readings — now choose a description.', hr: '10 mjerenja — sada odaberi opis.' }; updateNote(); return; }
        st.dots.push(Math.round((TRUE_C + st.inst.bias + gauss() * st.inst.sigma) * 100) / 100);
        st.fbC = null; updateNote(); updateOut(); draw();
      }
      function verdict(v) {
        if (st.mode !== 'target' || st.answered) { updateNote(); return; }
        if (st.dots.length < 5) { st.fbC = { en: 'Measure at least 5 times first.', hr: 'Najprije izmjeri barem 5 puta.' }; segVerdict.set(null); updateNote(); return; }
        const s = stats(st.dots), precise = s.maxDev <= PREC_LIM, accurate = Math.abs(s.mean - TRUE_C) <= ACC_LIM;
        const key = (precise ? 'p' : 'i') + (accurate ? 'a' : 'n'), ok = key === v;
        st.scoreC.n++; if (ok) st.scoreC.ok++;
        st.answered = { key, ok, precise, accurate };
        st.fbC = bi(l => T(l,
          (ok ? '✓ Right! ' : '✗ Not quite. ') + 'Max deviation ' + K.fmt(s.maxDev, 2, l) + ' cm → ' + (precise ? 'precise (the readings agree)' : 'not precise (the readings scatter)') +
            '. Mean ' + K.fmt(s.mean, 2, l) + ' cm is ' + K.fmt(Math.abs(s.mean - TRUE_C), 2, l) + ' cm from 10.00 cm → ' + (accurate ? 'accurate' : 'not accurate (a systematic error shifts every reading)') + '. So: ' + DESC[key].en + '.',
          (ok ? '✓ Točno! ' : '✗ Nije baš. ') + 'Maks. odstupanje ' + K.fmt(s.maxDev, 2, l) + ' cm → ' + (precise ? 'precizan (mjerenja se slažu)' : 'neprecizan (mjerenja su raspršena)') +
            '. Srednja vrijednost ' + K.fmt(s.mean, 2, l) + ' cm odstupa ' + K.fmt(Math.abs(s.mean - TRUE_C), 2, l) + ' cm od 10,00 cm → ' + (accurate ? 'točan' : 'netočan (sustavna pogreška pomiče sva mjerenja)') + '. Dakle: ' + DESC[key].hr + '.'));
        updateNote(); updateOut(); draw();
      }

      // ---------- shared ----------
      function newRound() {
        if (st.mode === 'ruler') newObject(); else if (st.mode === 'repeat') newRepeat(); else newInstrument();
        updateNote(); updateOut(); draw();
      }
      function updateNote() {
        if (st.mode === 'ruler') note.set(st.fbA || HINT_A);
        else if (st.mode === 'repeat') note.set(noteB());
        else note.set(st.fbC || HINT_C);
      }
      function updateOut() {
        if (st.mode === 'ruler') outScore.set(st.scoreA.ok + ' / ' + st.scoreA.n);
        else if (st.mode === 'repeat') {
          const r = st.res; outN.set(active().length);
          outMean.set(r ? r.mean : null); outDev.set(r ? r.dx : null); outRel.set(r ? r.rel : null);
          outRel.setColor(r ? (r.rel <= 10 ? theme.good : theme.warn) : '');
        } else {
          const s = stats(st.dots); outScore.set(st.scoreC.ok + ' / ' + st.scoreC.n); outN.set(st.dots.length);
          outMean.set(s ? s.mean : null); outDev.set(s && s.n > 1 ? s.maxDev : null); outRel.set(s && s.n > 1 ? s.maxDev / s.mean * 100 : null); outRel.setColor('');
        }
      }
      function reset() {
        newObject(); newRepeat(); newInstrument();
        st.scoreA = { ok: 0, n: 0 }; st.scoreC = { ok: 0, n: 0 };
        st.mag = true; togMag.set(true); st.mode = 'ruler'; segMode.set('ruler');
        applyVis(); relabelInput(); updateNote(); updateOut(); draw();
      }

      // ---------- pointer ----------
      function setLens(px) { if (!layA) return; st.magCm = K.clamp((px - layA.rulerX) / layA.ppc, 0, RULER_CM); draw(); }
      function rowAt(p) {
        if (!layB) return -1;
        if (p.x < layB.tx || p.x > layB.tx + layB.tw || p.y < layB.ty + layB.rowH) return -1;
        const i = Math.floor((p.y - layB.ty - layB.rowH) / layB.rowH);
        return i >= 0 && i < st.readings.length ? i : -1;
      }
      function onDown(ev) {
        const p = cv.pointer(ev);
        if (st.mode === 'ruler') { if (!st.mag) return; dragging = true; ev.preventDefault(); setLens(p.x); }
        else if (st.mode === 'repeat') { const i = rowAt(p); if (i >= 0) { st.sel = st.sel === i ? -1 : i; updateDiscardLabel(); draw(); } }
      }
      function onMove(ev) { if (dragging) setLens(cv.pointer(ev).x); }
      function onUp() { dragging = false; }
      cv.canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      // ---------- drawing ----------
      const colorOf = o => (o.color === 'muted' ? theme.muted : theme[o.color]);
      function drawObject(g, o, xL, xR, yB, hgt) {
        const L = Math.max(2, xR - xL), cy = yB - hgt / 2, col = colorOf(o);
        g.save(); g.fillStyle = col; g.strokeStyle = K.withAlpha(theme.fg, 0.5); g.lineWidth = 1;
        if (o.id === 'pencil') {
          const tip = Math.min(L * 0.12, hgt * 1.6), er = Math.min(L * 0.08, hgt * 0.9);
          g.fillRect(xL + er, yB - hgt, L - er - tip, hgt);
          g.fillStyle = theme.c5; K.roundRect(g, xL, yB - hgt, er, hgt, 2); g.fill();
          g.fillStyle = theme.c2; g.beginPath(); g.moveTo(xR - tip, yB - hgt); g.lineTo(xR, cy); g.lineTo(xR - tip, yB); g.closePath(); g.fill();
          g.fillStyle = theme.fg; g.beginPath(); g.moveTo(xR - tip * 0.3, cy - hgt * 0.15); g.lineTo(xR, cy); g.lineTo(xR - tip * 0.3, cy + hgt * 0.15); g.closePath(); g.fill();
          g.strokeStyle = K.withAlpha(theme.fg, 0.25); g.beginPath(); g.moveTo(xL + er, cy); g.lineTo(xR - tip, cy); g.stroke();
        } else if (o.id === 'key') {
          const r = hgt / 2;
          g.beginPath(); g.arc(xL + r, cy, r, 0, Math.PI * 2); g.fill();
          g.fillStyle = theme.sky; g.beginPath(); g.arc(xL + r, cy, r * 0.35, 0, Math.PI * 2); g.fill();
          g.fillStyle = col; g.fillRect(xL + 2 * r - 1, cy - hgt * 0.17, L - 2 * r + 1, hgt * 0.34);
          for (let i = 0; i < 3; i++) { const tw = hgt * 0.22, tx = xR - (i + 1) * hgt * 0.36; if (tx > xL + 2 * r) g.fillRect(tx, cy + hgt * 0.1, tw, hgt * 0.38); }
        } else if (o.id === 'leaf') {
          g.beginPath(); g.ellipse(xL + L / 2, cy, L / 2, hgt / 2, 0, 0, Math.PI * 2); g.fill();
          g.strokeStyle = K.withAlpha(theme.fg, 0.45); g.beginPath(); g.moveTo(xL, cy); g.lineTo(xR, cy);
          for (let i = 1; i <= 4; i++) { const x = xL + L * i / 5; g.moveTo(x, cy); g.lineTo(x + L * 0.08, cy - hgt * 0.4); g.moveTo(x, cy); g.lineTo(x + L * 0.08, cy + hgt * 0.4); }
          g.stroke();
        } else if (o.id === 'phone') {
          K.roundRect(g, xL, yB - hgt, L, hgt, Math.min(6, hgt * 0.2)); g.fill();
          g.fillStyle = theme.sky; K.roundRect(g, xL + L * 0.06, yB - hgt + hgt * 0.14, L * 0.88, hgt * 0.72, 2); g.fill();
        } else if (o.id === 'eraser') {
          K.roundRect(g, xL, yB - hgt, L, hgt, 3); g.fill();
          g.fillStyle = K.withAlpha(theme.fg, 0.15); g.fillRect(xL + L * 0.55, yB - hgt, L * 0.45, hgt);
        } else { // nail
          const hd = hgt * 0.2;
          g.fillRect(xL, yB - hgt, hd, hgt); g.fillRect(xL + hd, cy - hgt * 0.13, L - hd - hgt * 0.6, hgt * 0.26);
          g.beginPath(); g.moveTo(xR - hgt * 0.6, cy - hgt * 0.13); g.lineTo(xR, cy); g.lineTo(xR - hgt * 0.6, cy + hgt * 0.13); g.closePath(); g.fill();
        }
        g.restore();
      }
      function drawRuler(g, x0, y, ppc, hgt) {
        const left = x0 - 0.4 * ppc, right = x0 + (RULER_CM + 0.4) * ppc, mmPx = ppc / 10;
        g.save();
        g.fillStyle = theme.surface2; g.fillRect(left, y, right - left, hgt);
        g.strokeStyle = theme.muted; g.lineWidth = 1; g.strokeRect(left, y, right - left, hgt);
        g.strokeStyle = theme.fg; g.beginPath();
        for (let mm = 0; mm <= RULER_CM * 10; mm++) {
          const isCm = mm % 10 === 0, isHalf = mm % 5 === 0;
          if (!isCm && !isHalf && mmPx < 2.2) continue;
          const X = x0 + mm * mmPx, len = isCm ? hgt * 0.5 : isHalf ? hgt * 0.34 : hgt * 0.2;
          g.moveTo(X, y); g.lineTo(X, y + len);
        }
        g.stroke();
        for (let cm = 0; cm <= RULER_CM; cm++) K.text(g, String(cm), x0 + cm * ppc, y + hgt - 4, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        g.restore();
      }
      function drawMagnifier(g, x, y, w, h, cCm, ppc, objH) {
        const half = 1.0, z = w / (2 * half), cm2x = c => x + (c - (cCm - half)) * z;
        g.save();
        K.roundRect(g, x, y, w, h, 10); g.fillStyle = theme.surface; g.fill(); g.strokeStyle = theme.accent; g.lineWidth = 2; g.stroke(); g.clip();
        const ry = y + h * 0.55, rh = y + h - ry;
        g.fillStyle = theme.surface2; g.fillRect(x, ry, w, rh);
        g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(x, ry); g.lineTo(x + w, ry); g.stroke();
        drawObject(g, st.obj, cm2x(st.x0), cm2x(st.x0 + st.len), ry - 3, Math.min(objH * z / ppc, h * 0.55 - 8));
        g.strokeStyle = theme.fg; g.lineWidth = 1.2; g.beginPath();
        const mmFrom = Math.max(0, Math.ceil((cCm - half) * 10)), mmTo = Math.min(RULER_CM * 10, Math.floor((cCm + half) * 10));
        for (let mm = mmFrom; mm <= mmTo; mm++) {
          const X = cm2x(mm / 10), isCm = mm % 10 === 0, isHalf = mm % 5 === 0;
          g.moveTo(X, ry); g.lineTo(X, ry + (isCm ? rh * 0.55 : isHalf ? rh * 0.4 : rh * 0.26));
        }
        g.stroke();
        for (let mm = mmFrom; mm <= mmTo; mm += 10) if (mm % 10 === 0) K.text(g, String(mm / 10), cm2x(mm / 10), ry + rh - 3, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        K.text(g, K.fmt(z / ppc, 0, lang) + '×', x + w - 8, y + 6, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'top' });
        g.restore();
      }
      function drawA(g, w, h) {
        const pad = 14, ppc = (w - 2 * pad) / (RULER_CM + 0.8);
        const rulerX = pad + 0.4 * ppc, rulerH = K.clamp(ppc * 1.6, 34, 48), rulerY = h - rulerH - K.clamp(h * 0.2, 56, 70);
        const objH = K.clamp(ppc * 1.2, 14, 44) * st.obj.hf, endCm = st.x0 + st.len, lensPx = rulerX + st.magCm * ppc;
        layA = { rulerX, ppc, rulerY, rulerH };
        K.text(g, K.tr({ en: 'Object: ', hr: 'Predmet: ' }, lang) + K.tr(st.obj.label, lang) + K.tr({ en: ' · ruler in cm, mm marks', hr: ' · ravnalo u cm, milimetarske crtice' }, lang), 12, 14, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(g, K.tr({ en: 'Score', hr: 'Bodovi' }, lang) + ': ' + st.scoreA.ok + ' / ' + st.scoreA.n, w - 12, 14, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        if (st.mag) {
          K.text(g, K.tr({ en: 'Tap the ruler to move the magnifier', hr: 'Dodirni ravnalo da pomakneš povećalo' }, lang), 12, 30, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
          g.fillStyle = K.withAlpha(theme.accent, 0.12); g.fillRect(lensPx - ppc, rulerY - objH - 8, 2 * ppc, rulerH + objH + 8);
        }
        drawRuler(g, rulerX, rulerY, ppc, rulerH);
        drawObject(g, st.obj, rulerX + st.x0 * ppc, rulerX + endCm * ppc, rulerY - 2, objH);
        if (st.mag) {
          const insetW = Math.min(w - 2 * pad, 440), insetTop = 42, insetH = K.clamp(rulerY - objH - 16 - insetTop, 60, 190);
          const ix = K.clamp(lensPx - insetW / 2, pad, w - pad - insetW);
          g.save(); g.strokeStyle = K.withAlpha(theme.accent, 0.6); g.lineWidth = 1.5; g.setLineDash([4, 4]);
          g.beginPath(); g.moveTo(lensPx - ppc, rulerY - objH - 8); g.lineTo(ix, insetTop + insetH); g.moveTo(lensPx + ppc, rulerY - objH - 8); g.lineTo(ix + insetW, insetTop + insetH); g.stroke(); g.restore();
          drawMagnifier(g, ix, insetTop, insetW, insetH, st.magCm, ppc, objH);
        }
        const fy = rulerY + rulerH + 16, lines = wrap(g, K.tr(st.fbA || HINT_A, lang), w - 2 * pad - 16, '12px ' + theme.font);
        if (st.kindA) { g.fillStyle = theme[st.kindA]; g.beginPath(); g.arc(pad + 5, fy, 5, 0, Math.PI * 2); g.fill(); }
        lines.slice(0, 3).forEach((ln, i) => K.text(g, ln, pad + 16, fy + i * 15, { font: '12px ' + theme.font, color: theme.fg, baseline: 'middle' }));
      }
      function drawB(g, w, h) {
        const pad = 10, colW = Math.min(Math.round(w * 0.46), 300), rx = colW + 10, rw = w - rx - pad;
        K.text(g, K.tr({ en: 'Object: ', hr: 'Predmet: ' }, lang) + K.tr(st.rObj.label, lang), pad, 14, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        const oppc = (colW - 2 * pad) / 18;
        drawObject(g, st.rObj, pad, pad + st.rLen * oppc, 54, K.clamp(oppc * 1.3, 10, 26) * st.rObj.hf);
        // table
        const ty = 62, rowH = K.clamp(Math.floor((h - ty - 6) / (MAXR + 1)), 13, 20), tw = colW - pad, fs = rowH < 16 ? 10 : 11;
        layB = { tx: pad, ty, tw, rowH };
        const cx = [pad + tw * 0.08, pad + tw * 0.38, pad + tw * 0.78];
        g.fillStyle = theme.surface2; g.fillRect(pad, ty, tw, rowH);
        const hf = 'bold ' + fs + 'px ' + theme.font, nf = fs + 'px ' + theme.font;
        K.text(g, '#', cx[0], ty + rowH / 2, { font: hf, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(g, 'x (cm)', cx[1], ty + rowH / 2, { font: hf, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(g, '|x − x̄| (cm)', cx[2], ty + rowH / 2, { font: hf, color: theme.fg, align: 'center', baseline: 'middle' });
        st.readings.forEach((r, i) => {
          const y = ty + rowH * (i + 1), mid = y + rowH / 2;
          if (i === st.sel) { g.fillStyle = K.withAlpha(theme.accent, 0.2); g.fillRect(pad, y, tw, rowH); }
          g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(pad, y + rowH); g.lineTo(pad + tw, y + rowH); g.stroke();
          const col = r.out ? theme.muted : theme.fg;
          K.text(g, String(i + 1), cx[0], mid, { font: nf, color: col, align: 'center', baseline: 'middle' });
          K.text(g, K.fmt(r.v, 1, lang), cx[1], mid, { font: nf, color: col, align: 'center', baseline: 'middle' });
          if (r.out) { g.strokeStyle = theme.muted; g.beginPath(); g.moveTo(cx[1] - 16, mid); g.lineTo(cx[1] + 16, mid); g.stroke(); K.text(g, K.tr({ en: 'discarded', hr: 'odbačeno' }, lang), cx[2], mid, { font: nf, color: theme.muted, align: 'center', baseline: 'middle' }); }
          else if (st.res) K.text(g, K.fmt(Math.abs(r.v - st.res.mean), 2, lang), cx[2], mid, { font: nf, color: col, align: 'center', baseline: 'middle' });
        });
        if (!st.readings.length) K.text(g, K.tr({ en: 'no readings yet', hr: 'još nema mjerenja' }, lang), pad + tw / 2, ty + rowH * 2, { font: nf, color: theme.muted, align: 'center', baseline: 'middle' });
        // result panel
        const px = rx, py = 8, pw = rw, ph = h - 16, tf = rw < 230 ? 11 : 13, lh = tf + 7;
        g.fillStyle = theme.surface; K.roundRect(g, px, py, pw, ph, 10); g.fill();
        let y = py + 20; const x = px + 12, bold = 'bold ' + (tf + 1) + 'px ' + theme.fontDisplay, norm = tf + 'px ' + theme.font;
        K.text(g, K.tr({ en: 'Result', hr: 'Rezultat' }, lang), x, y, { font: bold, color: theme.fg, baseline: 'middle' }); y += lh + 2;
        const r = st.res;
        if (!r) {
          wrap(g, K.tr({ en: 'Press Compute to get the mean x̄, the deviations |x − x̄|, the biggest one Δx, the result (x̄ ± Δx) cm and the relative error Δx / x̄.', hr: 'Pritisni Izračunaj za srednju vrijednost x̄, odstupanja |x − x̄|, najveće od njih Δx, rezultat (x̄ ± Δx) cm i relativnu pogrešku Δx / x̄.' }, lang), pw - 24, norm)
            .forEach(ln => { K.text(g, ln, x, y, { font: norm, color: theme.muted, baseline: 'middle' }); y += lh - 2; });
        } else {
          K.text(g, 'x̄ = Σx / n = ' + K.fmt(r.mean, 2, lang) + ' cm  (n = ' + r.n + ')', x, y, { font: norm, color: theme.fg, baseline: 'middle' }); y += lh;
          K.text(g, 'Δx = max |x − x̄| = ' + K.fmt(r.dx, 2, lang) + ' cm' + (r.floored ? ' *' : ''), x, y, { font: norm, color: theme.fg, baseline: 'middle' }); y += lh;
          K.text(g, 'x = (' + K.fmt(r.mean, 2, lang) + ' ± ' + K.fmt(r.dx, 2, lang) + ') cm', x, y, { font: 'bold ' + (tf + 1) + 'px ' + theme.font, color: theme.fg, baseline: 'middle' }); y += lh;
          g.fillStyle = r.rel <= 10 ? theme.good : theme.warn; g.beginPath(); g.arc(x + 5, y, 5, 0, Math.PI * 2); g.fill();
          K.text(g, 'Δx / x̄ = ' + K.fmt(r.rel, 1, lang) + ' %  ' + K.tr(r.rel <= 10 ? { en: '(good ≤ 10 %)', hr: '(dobro ≤ 10 %)' } : { en: '(large)', hr: '(velika)' }, lang), x + 14, y, { font: norm, color: theme.fg, baseline: 'middle' }); y += lh;
          if (r.floored) K.text(g, K.tr({ en: '* half of the smallest division', hr: '* pola najmanjeg podjeljka' }, lang), x, y, { font: (tf - 1) + 'px ' + theme.font, color: theme.muted, baseline: 'middle' });
          // number line with the interval
          const ny = py + ph - 34, nx0 = x + 4, nx1 = px + pw - 16;
          const span = Math.max(r.dx * 2.5, 0.4, st.reveal ? Math.abs(st.rLen - r.mean) + 0.2 : 0), lo = r.mean - span, hi = r.mean + span;
          const X = v => nx0 + (v - lo) / (hi - lo) * (nx1 - nx0);
          g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(nx0, ny); g.lineTo(nx1, ny); g.stroke();
          g.fillStyle = K.withAlpha(theme.accent, 0.35); g.fillRect(X(r.mean - r.dx), ny - 7, Math.max(2, X(r.mean + r.dx) - X(r.mean - r.dx)), 14);
          g.strokeStyle = theme.accent; g.lineWidth = 2; g.beginPath(); g.moveTo(X(r.mean), ny - 10); g.lineTo(X(r.mean), ny + 10); g.stroke();
          K.text(g, K.fmt(r.mean - r.dx, 2, lang), X(r.mean - r.dx), ny + 14, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
          K.text(g, K.fmt(r.mean + r.dx, 2, lang), X(r.mean + r.dx), ny + 14, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
          K.text(g, 'x̄', X(r.mean), ny - 13, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
          if (st.reveal) {
            const tx = X(st.rLen);
            g.fillStyle = theme.c3; g.beginPath(); g.moveTo(tx, ny - 2); g.lineTo(tx - 6, ny - 14); g.lineTo(tx + 6, ny - 14); g.closePath(); g.fill();
            K.text(g, K.tr({ en: 'true ', hr: 'pravo ' }, lang) + K.fmt(st.rLen, 2, lang), tx, ny - 16, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
          }
        }
      }
      function drawC(g, w, h) {
        const wide = w >= 620, areaW = wide ? Math.round(w * 0.56) : w;
        const R = Math.min(areaW / 2 - 26, (h - (wide ? 76 : 122)) / 2), cx = Math.round(areaW / 2), cy = 36 + R, s = R / 1.5;
        K.text(g, K.tr({ en: 'True value: 10.00 cm', hr: 'Prava vrijednost: 10,00 cm' }, lang), cx, 16, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
        // target rings (the bullseye marks the "accurate" zone)
        [[1.5, K.withAlpha(theme.c8, 0.18)], [1.25, theme.surface], [0.75, K.withAlpha(theme.c8, 0.18)], [0.25, K.withAlpha(theme.good, 0.4)]].forEach(([r, col]) => {
          g.fillStyle = col; g.beginPath(); g.arc(cx, cy, r * s, 0, Math.PI * 2); g.fill();
          g.strokeStyle = K.withAlpha(theme.fg, 0.3); g.lineWidth = 1; g.stroke();
        });
        g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.stroke();
        for (let k = -3; k <= 3; k++) {
          const X = cx + k * 0.5 * s; g.beginPath(); g.moveTo(X, cy + R + 2); g.lineTo(X, cy + R + 7); g.stroke();
          K.text(g, K.fmt(TRUE_C + k * 0.5, 1, lang), X, cy + R + 9, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        }
        K.text(g, K.tr({ en: 'reading (cm)', hr: 'očitanje (cm)' }, lang), cx + R, cy + R + 22, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'top' });
        const st_ = stats(st.dots);
        if (st_ && st_.n > 1) {
          g.save(); g.strokeStyle = theme.c2; g.lineWidth = 1.5; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(cx + (st_.mean - TRUE_C) * s, cy - R); g.lineTo(cx + (st_.mean - TRUE_C) * s, cy + R); g.stroke(); g.restore();
          g.strokeStyle = theme.c2; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + (st_.mean - st_.maxDev - TRUE_C) * s, cy + R + 1); g.lineTo(cx + (st_.mean + st_.maxDev - TRUE_C) * s, cy + R + 1); g.stroke();
          K.text(g, 'x̄', cx + (st_.mean - TRUE_C) * s, cy - R - 4, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        }
        const bins = {};
        st.dots.forEach(v => {
          const b = Math.round((v - TRUE_C) / 0.05), k = bins[b] || 0; bins[b] = k + 1;
          g.fillStyle = theme.c1; g.beginPath(); g.arc(cx + (v - TRUE_C) * s, cy - 6 - k * 11, 5, 0, Math.PI * 2); g.fill();
          g.strokeStyle = theme.surface; g.lineWidth = 1.5; g.stroke();
        });
        // numbers
        const lines = [];
        const n = st.dots.length;
        lines.push(K.tr({ en: 'readings: ', hr: 'mjerenja: ' }, lang) + n);
        if (st_) lines.push('x̄ = ' + K.fmt(st_.mean, 2, lang) + ' cm');
        if (st_) lines.push(K.tr({ en: 'x̄ − true = ', hr: 'x̄ − pravo = ' }, lang) + K.fmt(st_.mean - TRUE_C, 2, lang) + ' cm  ' + K.tr({ en: '(systematic error)', hr: '(sustavna pogreška)' }, lang));
        if (st_ && n > 1) lines.push('Δx = ' + K.fmt(st_.maxDev, 2, lang) + ' cm  ' + K.tr({ en: '(random error)', hr: '(slučajna pogreška)' }, lang));
        if (st.answered) {
          lines.push(K.tr({ en: 'precise: ', hr: 'precizan: ' }, lang) + (st.answered.precise ? '✓' : '✗') + '   ' + K.tr({ en: 'accurate: ', hr: 'točan: ' }, lang) + (st.answered.accurate ? '✓' : '✗'));
          lines.push(K.tr(DESC[st.answered.key], lang));
        }
        if (wide) {
          const px = areaW + 8, pw = w - px - 8; let y = 30;
          g.fillStyle = theme.surface; K.roundRect(g, px, 8, pw, h - 16, 10); g.fill();
          K.text(g, K.tr({ en: 'Hidden instrument', hr: 'Skriveni instrument' }, lang), px + 12, y, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' }); y += 24;
          lines.forEach(ln => wrap(g, ln, pw - 24, '12px ' + theme.font).forEach(l2 => { K.text(g, l2, px + 12, y, { font: '12px ' + theme.font, color: theme.fg, baseline: 'middle' }); y += 17; }));
          y += 4;
          wrap(g, K.tr({ en: 'Precise = the readings agree with each other (Δx ≤ 0.15 cm). Accurate = the mean is close to the true value (≤ 0.25 cm).', hr: 'Precizan = mjerenja se međusobno slažu (Δx ≤ 0,15 cm). Točan = srednja vrijednost blizu je prave (≤ 0,25 cm).' }, lang), pw - 24, '11px ' + theme.font)
            .forEach(l2 => { K.text(g, l2, px + 12, y, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' }); y += 14; });
          K.text(g, K.tr({ en: 'Score', hr: 'Bodovi' }, lang) + ': ' + st.scoreC.ok + ' / ' + st.scoreC.n, px + pw - 12, h - 20, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        } else {
          let y = cy + R + 40;
          [lines.slice(0, 2).join('   '), lines.slice(2, 4).join('   ')].concat(lines.slice(4)).forEach(ln => { if (ln) { K.text(g, ln, 10, y, { font: '11px ' + theme.font, color: theme.fg, baseline: 'middle' }); y += 15; } });
          K.text(g, K.tr({ en: 'Score', hr: 'Bodovi' }, lang) + ': ' + st.scoreC.ok + ' / ' + st.scoreC.n, w - 10, 16, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        }
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (st.mode === 'ruler') drawA(g, w, h); else if (st.mode === 'repeat') drawB(g, w, h); else drawC(g, w, h);
      }

      cv.onResize(draw);
      reset();
      return {
        destroy() {
          cv.canvas.removeEventListener('pointerdown', onDown);
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          inp.removeEventListener('keydown', onKey);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); relabelInput(); updateNote(); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
