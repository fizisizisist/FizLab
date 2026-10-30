/* FizLab sim: Design a Fair Test — guided inquiry: hypothesis → plan (change one variable) → prediction → measurement → conclusion,
   for three investigations: pendulum period, buoyant force, acceleration of a cart. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, TRACK = 2.0, NOISE = 0.02, DEP_LIMIT = 10; // % change above which "it depends"
  const LIQUIDS = [
    { id: 'alcohol', rho: 790, label: { en: 'alcohol', hr: 'alkohol' }, tint: t => K.withAlpha(t.water, 0.45) },
    { id: 'oil', rho: 920, label: { en: 'oil', hr: 'ulje' }, tint: t => K.withAlpha(t.c4, 0.55) },
    { id: 'water', rho: 1000, label: { en: 'water', hr: 'voda' }, tint: t => t.water },
    { id: 'sea', rho: 1025, label: { en: 'sea water', hr: 'morska voda' }, tint: t => K.withAlpha(t.c1, 0.5) }
  ];
  // vars: short = plain name (nominative), acc/loc = Croatian accusative/locative for the sentence chain
  const INV = [
    { id: 'pendulum', title: { en: 'What does the pendulum period depend on?', hr: 'O čemu ovisi period njihala?' },
      measured: { sym: 'T', unit: 's', digits: 2, name: { en: 'the period T', hr: 'period T' } },
      vars: [
        { id: 'L', sym: 'L', unit: 'm', digits: 2, short: { en: 'length', hr: 'duljina' }, acc: 'duljinu', loc: 'duljini', def: 1.0, plan: [0.5, 1.0, 1.5, 2.0] },
        { id: 'm', sym: 'm', unit: 'g', digits: 0, short: { en: 'mass of the bob', hr: 'masa kuglice' }, acc: 'masu kuglice', loc: 'masi kuglice', def: 200, plan: [50, 200, 350, 500] },
        { id: 'a', sym: 'θ', unit: '°', digits: 0, short: { en: 'release angle', hr: 'kut otklona' }, acc: 'kut otklona', loc: 'kutu otklona', def: 15, plan: [5, 10, 20, 30] }
      ],
      model: v => 2 * Math.PI * Math.sqrt(v.L / G) * (1 + Math.pow(v.a * Math.PI / 180, 2) / 16),
      explain: {
        L: { en: 'The period depends on the length: a longer pendulum travels a longer path, so one swing takes longer — T grows with √L (4× the length → 2× the period).', hr: 'Period ovisi o duljini: dulje njihalo prelazi dulji put pa jedan njihaj traje dulje — T raste s √L (4 puta dulje njihalo → 2 puta dulji period).' },
        m: { en: 'The period does not depend on the mass: a heavier bob is pulled harder but is also harder to move.', hr: 'Period ne ovisi o masi: teža kuglica jače je privučena, ali ju je i teže pokrenuti.' },
        a: { en: 'For small angles the period hardly depends on the swing size: a bigger swing has a longer path, but the bob also moves faster.', hr: 'Za male kutove period gotovo ne ovisi o veličini zamaha: veći zamah ima dulji put, ali se kuglica i brže giba.' }
      } },
    { id: 'buoy', title: { en: 'What does buoyancy depend on?', hr: 'O čemu ovisi uzgon?' },
      measured: { sym: { en: 'F_b', hr: 'F_u' }, unit: 'N', digits: 2, name: { en: 'the buoyant force', hr: 'uzgon' } },
      vars: [
        { id: 'V', sym: 'V', unit: 'cm³', digits: 0, short: { en: 'volume', hr: 'obujam' }, acc: 'obujam', loc: 'obujmu', def: 500, plan: [250, 500, 750, 1000] },
        { id: 'm', sym: 'm', unit: 'kg', digits: 1, short: { en: 'mass', hr: 'masa' }, acc: 'masu', loc: 'masi', def: 1.0, plan: [0.5, 1.5, 3.0, 5.0] },
        { id: 'liq', sym: 'ρ', unit: 'kg/m³', digits: 0, short: { en: 'liquid', hr: 'tekućina' }, acc: 'tekućinu', loc: 'tekućini', def: 1000, plan: [790, 920, 1000, 1025], cat: LIQUIDS }
      ],
      model: v => v.liq * G * v.V * 1e-6,
      explain: {
        V: { en: 'The buoyant force depends on the volume: it equals the weight of the displaced liquid, and a bigger object pushes more liquid away.', hr: 'Uzgon ovisi o obujmu: jednak je težini istisnute tekućine, a veće tijelo istisne više tekućine.' },
        m: { en: 'The buoyant force does not depend on the mass of the object — only on the volume under the surface and on the liquid. A heavier object sinks, but the liquid pushes it up just as hard.', hr: 'Uzgon ne ovisi o masi tijela — samo o obujmu pod površinom i o tekućini. Teže tijelo tone, ali ga tekućina gura prema gore jednako jako.' },
        liq: { en: 'The buoyant force depends on the liquid: a denser liquid weighs more per litre, so the displaced liquid weighs more — F_b = ρ·g·V.', hr: 'Uzgon ovisi o tekućini: gušća tekućina teža je po litri pa je i istisnuta tekućina teža — F_u = ρ·g·V.' }
      } },
    { id: 'cart', title: { en: 'What does the acceleration of a cart depend on?', hr: 'O čemu ovisi ubrzanje kolica?' },
      measured: { sym: 'a', unit: 'm/s²', digits: 2, name: { en: 'the acceleration', hr: 'ubrzanje' } },
      vars: [
        { id: 'F', sym: 'F', unit: 'N', digits: 0, short: { en: 'pulling force', hr: 'sila' }, acc: 'silu', loc: 'sili', def: 4, plan: [2, 4, 6, 8] },
        { id: 'm', sym: 'm', unit: 'kg', digits: 1, short: { en: 'mass of the cart', hr: 'masa kolica' }, acc: 'masu kolica', loc: 'masi kolica', def: 2, plan: [1, 2, 3, 4] }
      ],
      model: v => v.F / v.m,
      explain: {
        F: { en: 'The acceleration depends on the force: pull twice as hard and the cart speeds up twice as fast — a = F/m (Newton\'s second law).', hr: 'Ubrzanje ovisi o sili: povuci dvostruko jače i kolica dvostruko brže ubrzavaju — a = F/m (drugi Newtonov zakon).' },
        m: { en: 'The acceleration depends on the mass: a heavier cart is harder to speed up — twice the mass, half the acceleration (a = F/m).', hr: 'Ubrzanje ovisi o masi: teža kolica teže je ubrzati — dvostruka masa, upola manje ubrzanje (a = F/m).' }
      } }
  ];
  const STEP_NAMES = [{ en: 'Hypothesis', hr: 'Hipoteza' }, { en: 'Plan', hr: 'Plan' }, { en: 'Predict', hr: 'Predvidi' }, { en: 'Measure', hr: 'Mjeri' }, { en: 'Conclude', hr: 'Zaključi' }];
  const PREDW = { inc: { en: 'increases', hr: 'raste' }, dec: { en: 'decreases', hr: 'pada' }, same: { en: 'stays the same', hr: 'se ne mijenja' } };
  const PREDN = { inc: { en: 'increase', hr: 'rast' }, dec: { en: 'decrease', hr: 'pad' }, same: { en: 'no change', hr: 'bez promjene' } }; // noun form for "your prediction (…)"
  const WARN = { en: 'Change only one thing at a time, otherwise you cannot tell which one mattered.', hr: 'Mijenjaj samo jednu stvar odjednom, inače ne možeš znati što je utjecalo.' };
  const STEP_NOTES = [
    { en: 'Step 1 — Hypothesis: which variable do you think the measured value depends on? You cannot be wrong here — a hypothesis is a guess that we then test.', hr: '1. korak — Hipoteza: o kojoj varijabli misliš da ovisi izmjerena vrijednost? Ovdje ne možeš pogriješiti — hipoteza je pretpostavka koju zatim provjeravamo.' },
    { en: 'Step 2 — Plan: change ONE variable (the independent variable) and keep the others constant (controlled variables). The measured value is the dependent variable.', hr: '2. korak — Plan: mijenjaj JEDNU varijablu (nezavisnu varijablu), a ostale drži stalnima (kontrolirane varijable). Izmjerena vrijednost je zavisna varijabla.' },
    { en: 'Step 3 — Prediction: if your hypothesis is right, what should happen to the measured value when the changed variable gets bigger?', hr: '3. korak — Predviđanje: ako je hipoteza točna, što bi se trebalo dogoditi s izmjerenom vrijednošću kad mijenjana varijabla raste?' },
    { en: 'Step 4 — Measure: run the four trials and watch the table and the graph fill in. Every measurement has a little noise (about ±2 %).', hr: '4. korak — Mjerenje: izvedi četiri mjerenja i prati kako se pune tablica i graf. Svako mjerenje ima malo šuma (oko ±2 %).' }
  ];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const bi = f => ({ en: f('en'), hr: f('hr') });
  const T = (l, en, hr) => (l === 'hr' ? hr : en);
  function wrap(g, str, maxW, font) {
    g.save(); g.font = font;
    const words = String(str).split(' '), lines = []; let cur = '';
    words.forEach(wd => { const t = cur ? cur + ' ' + wd : wd; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; });
    if (cur) lines.push(cur);
    g.restore(); return lines;
  }
  function fmtVal(v, val, l) { return v.cat ? K.tr((v.cat.find(c => c.rho === val) || v.cat[0]).label, l) : K.fmt(val, v.digits, l) + ' ' + v.unit; }

  window.Sims.register({
    id: 'inquiry',
    title: { en: 'Design a Fair Test', hr: 'Osmisli pošten pokus' },
    summary: {
      en: 'Work like a scientist: make a hypothesis, plan a fair test that changes only one variable, predict, measure and conclude — for a pendulum, buoyancy or a pulled cart.',
      hr: 'Radi kao znanstvenik: postavi hipotezu, isplaniraj pošten pokus u kojem mijenjaš samo jednu varijablu, predvidi, izmjeri i zaključi — za njihalo, uzgon ili kolica.'
    },
    tasks: [
      { en: 'Pendulum: many people think a heavier bob swings slower. Make that your hypothesis, change only the mass and see what the data say.', hr: 'Njihalo: mnogi misle da se teža kuglica njiše sporije. Neka to bude tvoja hipoteza, mijenjaj samo masu i pogledaj što kažu podaci.' },
      { en: 'In the Plan step try to switch on two variables at once. Why does the app refuse?', hr: 'U koraku Plan pokušaj uključiti dvije varijable odjednom. Zašto aplikacija to odbija?' },
      { en: 'Buoyancy: does a heavier object get a bigger buoyant force? Test the mass, then test the volume. Compare the graphs.', hr: 'Uzgon: dobiva li teže tijelo veći uzgon? Provjeri masu, a zatim obujam. Usporedi grafove.' },
      { en: 'Cart: predict what happens to the acceleration when the mass doubles, then measure. Was your prediction right?', hr: 'Kolica: predvidi što se događa s ubrzanjem kad se masa udvostruči, a zatim izmjeri. Je li predviđanje bilo točno?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 360, maxHeight: 500 });
      const C = K.controls(container, lang);
      const st = { inv: INV[0], step: 1, hyp: null, indep: null, pred: null, concl: null, trials: [], running: false, ti: 0, tt: 0, result: null, checked: null, warn: null };
      const varById = id => st.inv.vars.find(v => v.id === id) || null;

      // ---------- controls ----------
      const selInv = C.select({ label: { en: 'Investigation', hr: 'Istraživanje' }, options: INV.map(i => ({ value: i.id, label: i.title })), value: 'pendulum',
        onChange: v => { st.inv = INV.find(i => i.id === v) || INV[0]; startOver(); } });
      const segHyp = {}, togs = {};
      INV.forEach(inv => {
        segHyp[inv.id] = C.segmented({ label: { en: 'Hypothesis: it depends on…', hr: 'Hipoteza: ovisi o…' },
          options: inv.vars.map(v => ({ value: v.id, label: { en: v.short.en + ' (' + v.sym + ')', hr: v.short.hr + ' (' + v.sym + ')' } })), value: null,
          onChange: v => { if (inv !== st.inv || st.step !== 1) return; st.hyp = v; st.warn = null; updateNote(); draw(); } });
      });
      INV.forEach(inv => {
        togs[inv.id] = {};
        inv.vars.forEach(v => {
          const t = C.toggle({ label: { en: 'Change: ' + v.short.en, hr: 'Mijenjaj: ' + v.short.hr }, value: false, onChange: on => onToggle(inv, v, on, t) });
          togs[inv.id][v.id] = t;
        });
      });
      const segPred = C.segmented({ label: { en: 'Prediction: the measured value will…', hr: 'Predviđanje: izmjerena vrijednost će…' }, options: [
        { value: 'inc', label: { en: 'increase', hr: 'rasti' } }, { value: 'dec', label: { en: 'decrease', hr: 'padati' } }, { value: 'same', label: { en: 'stay the same', hr: 'ostati ista' } }], value: null,
        onChange: v => { if (st.step !== 3) return; st.pred = v; st.warn = null; updateNote(); draw(); } });
      const btnRun = C.button({ label: { en: 'Run trials', hr: 'Izvedi mjerenja' }, variant: 'primary', onClick: runTrials });
      const btnPause = C.button({ label: { en: 'Pause', hr: 'Pauza' }, onClick: () => { if (!st.running) return; L.toggle(); updatePlay(); } });
      const segConcl = C.segmented({ label: { en: 'Conclusion: the measured value…', hr: 'Zaključak: izmjerena vrijednost…' }, options: [
        { value: 'dep', label: { en: 'depends on it', hr: 'ovisi o njoj' } }, { value: 'nodep', label: { en: 'does not depend on it', hr: 'ne ovisi o njoj' } }], value: null,
        onChange: v => { if (st.step !== 5) return; st.concl = v; st.warn = null; st.checked = null; updateNote(); draw(); } });
      const btnNext = C.button({ label: { en: 'Next step', hr: 'Sljedeći korak' }, variant: 'primary', onClick: next });
      C.button({ label: { en: 'Start over', hr: 'Ispočetka' }, onClick: startOver });
      const outT = [0, 1, 2, 3].map(i => C.readout({ label: { en: 'Trial ' + (i + 1), hr: 'Mjerenje ' + (i + 1) } }));
      const outDep = C.readout({ label: { en: 'Depends?', hr: 'Ovisi?' } });
      const note = C.note({ text: STEP_NOTES[0] });

      function show(c, on) { const e = c.el.closest('.sk-field') || c.el; e.style.display = on ? '' : 'none'; }
      function applyVis() {
        const s = st.step;
        INV.forEach(inv => { show(segHyp[inv.id], s === 1 && inv === st.inv); inv.vars.forEach(v => show(togs[inv.id][v.id], s === 2 && inv === st.inv)); });
        show(segPred, s === 3); show(btnRun, s === 4); show(btnPause, s === 4 && st.running); show(segConcl, s === 5);
        show(btnNext, s === 1 || s === 2 || s === 3 || s === 5);
        btnNext.setLabel(s === 5 ? { en: 'Check', hr: 'Provjeri' } : { en: 'Next step', hr: 'Sljedeći korak' });
      }
      function updatePlay() { btnPause.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Continue', hr: 'Nastavi' }); }

      // ---------- workflow ----------
      function buildPlan() {
        const iv = varById(st.indep);
        st.trials = [0, 1, 2, 3].map(i => {
          const vals = {}; st.inv.vars.forEach(v => { vals[v.id] = iv && v.id === iv.id ? v.plan[i] : v.def; });
          return { vals, y: null, done: false };
        });
      }
      function onToggle(inv, v, on, t) {
        if (inv !== st.inv || st.step !== 2) { t.set(false); return; }
        if (on) {
          if (st.indep && st.indep !== v.id) { t.set(false); st.warn = WARN; note.set(WARN); draw(); return; }
          st.indep = v.id;
        } else if (st.indep === v.id) st.indep = null;
        st.warn = null; buildPlan(); updateNote(); draw();
      }
      function warnNote(obj) { st.warn = obj; note.set(obj); draw(); }
      function next() {
        if (st.step === 1) { if (!st.hyp) return warnNote({ en: 'First pick the variable you think matters.', hr: 'Najprije odaberi varijablu za koju misliš da je važna.' }); st.step = 2; buildPlan(); }
        else if (st.step === 2) { if (!st.indep) return warnNote({ en: 'Choose exactly one variable to change.', hr: 'Odaberi točno jednu varijablu koju ćeš mijenjati.' }); st.step = 3; }
        else if (st.step === 3) { if (!st.pred) return warnNote({ en: 'Pick a prediction first.', hr: 'Najprije odaberi predviđanje.' }); st.step = 4; }
        else if (st.step === 5) {
          if (!st.concl || !st.result) return warnNote({ en: 'Pick a conclusion first.', hr: 'Najprije odaberi zaključak.' });
          const r = st.result, ok = (st.concl === 'dep') === r.dep;
          if (!ok) {
            st.checked = { ok: false };
            return warnNote(bi(l => T(l, '✗ Look at the data again: the measured value changed by ' + K.fmt(r.rel, 1, l) + ' % across the trials. More than 10 % means it depends; less is just noise. Try again.',
              '✗ Pogledaj podatke još jednom: izmjerena vrijednost promijenila se za ' + K.fmt(r.rel, 1, l) + ' % kroz mjerenja. Više od 10 % znači da ovisi; manje je samo šum. Pokušaj ponovno.')));
          }
          st.checked = { ok: true, predOK: st.pred === r.dir, hypOK: st.hyp === st.indep }; st.step = 6;
        } else return;
        st.warn = null; applyVis(); updateNote(); updateOut(); draw();
      }
      function measureTrial(tr) { return st.inv.model(tr.vals) * (1 + rnd(-NOISE, NOISE)); }
      function trialDur(y) { return st.inv.id === 'pendulum' ? y + 0.5 : st.inv.id === 'cart' ? Math.sqrt(2 * TRACK / y) + 0.5 : 1.8; }
      function runTrials() {
        if (st.step !== 4 || st.running) return;
        buildPlan(); st.ti = 0; st.tt = 0; st.running = true; st.warn = null;
        L.start(); applyVis(); updatePlay(); updateNote(); updateOut();
      }
      function step(dt) {
        if (!st.running) return;
        const tr = st.trials[st.ti];
        if (!tr) { finishRun(); return; }
        if (tr.y === null) tr.y = measureTrial(tr);
        st.tt += dt;
        if (st.tt >= trialDur(tr.y)) { tr.done = true; st.ti++; st.tt = 0; updateOut(); if (st.ti >= 4) finishRun(); }
      }
      function finishRun() {
        st.running = false; L.stop();
        const ys = st.trials.map(t => t.y), mean = ys.reduce((a, b) => a + b, 0) / ys.length;
        const rel = (Math.max.apply(null, ys) - Math.min.apply(null, ys)) / mean * 100, d = (ys[3] - ys[0]) / mean;
        st.result = { rel, dep: rel > DEP_LIMIT, dir: d > 0.1 ? 'inc' : d < -0.1 ? 'dec' : 'same' };
        st.step = 5; applyVis(); updateNote(); updateOut(); draw();
      }
      function startOver() {
        L.stop(); st.step = 1; st.hyp = null; st.indep = null; st.pred = null; st.concl = null; st.result = null; st.checked = null; st.warn = null; st.running = false; st.ti = 0; st.tt = 0;
        Object.keys(segHyp).forEach(k => segHyp[k].set(null));
        Object.keys(togs).forEach(k => Object.keys(togs[k]).forEach(j => togs[k][j].set(false)));
        segPred.set(null); segConcl.set(null);
        buildPlan(); applyVis(); updatePlay(); updateNote(); updateOut(); draw();
      }
      function reset() { st.inv = INV[0]; selInv.set('pendulum'); startOver(); }

      function updateNote() {
        if (st.warn) { note.set(st.warn); return; }
        const s = st.step, inv = st.inv, iv = varById(st.indep), hv = varById(st.hyp);
        if (s === 2 && iv && hv && iv !== hv) {
          note.set(bi(l => T(l, 'Your hypothesis is about ' + hv.short.en + '. Testing ' + iv.short.en + ' is a fair test too, but it will not tell you about ' + hv.short.en + '.',
            'Tvoja je hipoteza o ' + hv.loc + '. Provjera varijable „' + iv.short.hr + '” također je pošten pokus, ali ti neće reći ništa o ' + hv.loc + '.')));
        } else if (s <= 4) note.set(STEP_NOTES[s - 1]);
        else if (s === 5) {
          const r = st.result;
          note.set(bi(l => T(l, 'Step 5 — Conclude: the measured value changed by ' + K.fmt(r.rel, 1, l) + ' % across the trials. Rule of thumb: more than 10 % = it depends; less = it does not (just measurement noise).',
            '5. korak — Zaključak: izmjerena vrijednost promijenila se za ' + K.fmt(r.rel, 1, l) + ' % kroz mjerenja. Pravilo: više od 10 % = ovisi; manje = ne ovisi (samo šum mjerenja).')));
        } else {
          const r = st.result, c = st.checked, mn = inv.measured.name;
          note.set(bi(l => {
            let s2 = T(l, '✓ Correct conclusion: ', '✓ Točan zaključak: ') + K.tr(mn, l) + (r.dep ? T(l, ' depends on ', ' ovisi o ') : T(l, ' does not depend on ', ' ne ovisi o ')) + T(l, 'the ' + iv.short.en, iv.loc) +
              T(l, ' (change ', ' (promjena ') + K.fmt(r.rel, 1, l) + ' %). ';
            s2 += T(l, 'Your prediction (', 'Tvoje predviđanje (') + K.tr(PREDN[st.pred], l) + ') ' + (c.predOK ? T(l, 'was right. ', 'bilo je točno. ') : T(l, 'was wrong — the data decide, not the guess. ', 'nije bilo točno — odlučuju podaci, a ne pretpostavka. '));
            if (!c.hypOK && hv) s2 += T(l, 'Note: your hypothesis was about the ' + hv.short.en + ' — to test it, change that variable. ', 'Napomena: hipoteza je bila o ' + hv.loc + ' — da je provjeriš, mijenjaj tu varijablu. ');
            return s2 + K.tr(inv.explain[iv.id], l);
          }));
        }
      }
      function updateOut() {
        const m = st.inv.measured;
        outT.forEach((o, i) => { const tr = st.trials[i]; o.set(tr && tr.done ? K.fmt(tr.y, m.digits, lang) + ' ' + m.unit : null); });
        const r = st.result;
        outDep.set(r ? bi(l => (r.dep ? T(l, 'yes', 'da') : T(l, 'no', 'ne')) + ' (' + K.fmt(r.rel, 1, l) + ' %)') : null);
      }

      // ---------- sentence chain ----------
      function chain(l) {
        const inv = st.inv, m = inv.measured, hv = varById(st.hyp), iv = varById(st.indep), r = st.result, sym = K.tr(m.sym, l);
        const rows = [];
        rows.push({ tag: T(l, 'IF', 'AKO'), on: !!hv, text: hv ? K.tr(m.name, l) + T(l, ' depends on the ' + hv.short.en + '…', ' ovisi o ' + hv.loc + '…') : T(l, '… (choose a hypothesis)', '… (odaberi hipotezu)') });
        if (iv) {
          const others = inv.vars.filter(v => v !== iv), span = ' (' + fmtVal(iv, iv.plan[0], l) + ' → ' + fmtVal(iv, iv.plan[3], l) + ')';
          rows.push({ tag: T(l, 'AND', 'I'), on: true, text: T(l, 'I change only the ' + iv.short.en + span + ' and keep the ' + others.map(v => v.short.en).join(' and the ') + ' constant…',
            'mijenjam samo ' + iv.acc + span + ', a ' + others.map(v => v.acc).join(' i ') + ' držim stalnima…') });
        } else rows.push({ tag: T(l, 'AND', 'I'), on: false, text: T(l, '… (plan a fair test: change one variable)', '… (isplaniraj pošten pokus: mijenjaj jednu varijablu)') });
        rows.push({ tag: T(l, 'THEN', 'ONDA'), on: !!st.pred, text: st.pred ? sym + ' ' + K.tr(PREDW[st.pred], l) + '.' : T(l, '… (predict)', '… (predvidi)') });
        rows.push({ tag: r ? (st.pred === r.dir ? T(l, 'AND', 'I') : T(l, 'BUT', 'ALI')) : T(l, 'RESULT', 'REZULTAT'), on: !!r,
          text: r ? sym + ' = ' + st.trials.map(t => K.fmt(t.y, m.digits, l)).join('; ') + ' ' + m.unit + T(l, ' (change ', ' (promjena ') + K.fmt(r.rel, 1, l) + ' %).' : T(l, '… (measure)', '… (mjeri)') });
        rows.push({ tag: T(l, 'THEREFORE', 'DAKLE'), on: !!st.concl, text: st.concl
          ? sym + (st.concl === 'dep' ? T(l, ' depends on ', ' ovisi o ') : T(l, ' does not depend on ', ' ne ovisi o ')) + (iv ? T(l, 'the ' + iv.short.en, iv.loc) : '…') + (st.checked ? (st.checked.ok ? ' ✓' : ' ✗') : '')
          : T(l, '… (conclude)', '… (zaključi)') });
        return rows;
      }

      // ---------- drawing ----------
      function panel(g, r) { g.fillStyle = theme.surface; K.roundRect(g, r.x, r.y, r.w, r.h, 10); g.fill(); }
      function curTrial() { return st.trials[st.step >= 5 ? 3 : Math.min(st.ti, 3)] || null; }
      function drawApparatus(g, r, narrow) {
        panel(g, r);
        const inv = st.inv, tr = curTrial();
        const vals = tr ? tr.vals : {}, y = tr && tr.y !== null ? tr.y : inv.model(vals);
        const tt = st.step >= 5 ? trialDur(y) : (st.running ? st.tt : 0);
        if (!narrow) wrap(g, K.tr(inv.title, lang), r.w - 24, 'bold 13px ' + theme.fontDisplay).slice(0, 2).forEach((ln, i) => K.text(g, ln, r.x + 12, r.y + 16 + i * 16, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' }));
        if (st.step >= 4 && tr) K.text(g, K.tr({ en: 'Trial ', hr: 'Mjerenje ' }, lang) + (st.trials.indexOf(tr) + 1) + ' / 4', r.x + r.w - 10, r.y + r.h - 10, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'bottom' });
        const a = narrow ? { x: r.x + 10, y: r.y + 8, w: r.w - 20, h: r.h - 16 } : { x: r.x + 10, y: r.y + 44, w: r.w - 20, h: r.h - 54 };
        if (inv.id === 'pendulum') drawPend(g, a, vals, y, tt); else if (inv.id === 'buoy') drawBuoy(g, a, vals, y, tt); else drawCart(g, a, vals, y, tt);
      }
      function labels(g, a, arr) { let ly = a.y + 2; arr.forEach(s => { K.text(g, s, a.x + 2, ly, { font: '11px ' + theme.font, color: theme.fg, baseline: 'top' }); ly += 14; }); }
      function drawPend(g, a, v, Tm, tt) {
        const th0 = v.a * Math.PI / 180, t = Math.min(tt, Tm), th = th0 * Math.cos(2 * Math.PI * t / Tm);
        const px = a.x + a.w * 0.5, py = a.y + 12, pxm = (a.h - 44) / 2.0, Lpx = v.L * pxm, rb = 5 + 8 * Math.sqrt(v.m / 500);
        g.fillStyle = theme.muted; g.fillRect(px - 30, py - 7, 60, 5);
        g.save(); g.strokeStyle = theme.line; g.lineWidth = 1; g.setLineDash([3, 5]); g.beginPath(); g.moveTo(px, py); g.lineTo(px, py + Lpx + rb + 4); g.stroke();
        g.strokeStyle = K.withAlpha(theme.c1, 0.45); g.setLineDash([3, 4]); g.beginPath(); g.arc(px, py, Lpx, Math.PI / 2 - th0, Math.PI / 2 + th0); g.stroke(); g.restore();
        const bx = px + Math.sin(th) * Lpx, by = py + Math.cos(th) * Lpx;
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.moveTo(px, py); g.lineTo(bx, by); g.stroke();
        g.fillStyle = theme.c1; g.beginPath(); g.arc(bx, by, rb, 0, Math.PI * 2); g.fill();
        g.fillStyle = theme.fg; g.beginPath(); g.arc(px, py, 3, 0, Math.PI * 2); g.fill();
        labels(g, a, ['L = ' + K.fmt(v.L, 2, lang) + ' m', 'm = ' + K.fmt(v.m, 0, lang) + ' g', 'θ = ' + K.fmt(v.a, 0, lang) + '°']);
        K.text(g, 't = ' + K.fmt(t, 2, lang) + ' s', a.x + a.w - 2, a.y + 2, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
        if (tt >= Tm && st.step >= 4) K.text(g, 'T = ' + K.fmt(Tm, 2, lang) + ' s', a.x + a.w - 2, a.y + 20, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
        else if (st.running) K.text(g, K.tr({ en: 'one full swing…', hr: 'jedan puni njihaj…' }, lang), a.x + a.w - 2, a.y + 20, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'top' });
      }
      function drawBuoy(g, a, v, Fb, tt) {
        const liq = LIQUIDS.find(l => l.rho === v.liq) || LIQUIDS[2];
        const tw = Math.min(a.w * 0.5, 170), th = a.h * 0.55, tx = a.x + a.w * 0.5 - tw / 2 + 16, tb = a.y + a.h - 2, ttop = tb - th, liqTop = ttop + th * 0.12, cx = tx + tw / 2;
        let s = 14 + 24 * Math.cbrt(v.V / 1000); s = Math.min(s, liqTop - (a.y + 30), tb - liqTop - 10);
        const p = K.clamp(tt / 1.0, 0, 1), top0 = liqTop - s - 6, top1 = liqTop + 8, blockTop = top0 + (top1 - top0) * p;
        const frac = K.clamp((blockTop + s - liqTop) / s, 0, 1);
        g.fillStyle = liq.tint(theme); g.fillRect(tx, liqTop, tw, tb - liqTop);
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx, a.y + 22); g.lineTo(cx, blockTop); g.stroke();
        g.fillStyle = theme.surface2; K.roundRect(g, cx - 36, a.y, 72, 22, 5); g.fill(); g.strokeStyle = theme.muted; g.lineWidth = 1; g.stroke();
        K.text(g, K.fmt(Fb * frac, 2, lang) + ' N', cx, a.y + 11, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        g.fillStyle = theme.c2; g.fillRect(cx - s / 2, blockTop, s, s);
        g.strokeStyle = K.withAlpha(theme.fg, 0.5); g.strokeRect(cx - s / 2, blockTop, s, s);
        const subTop = Math.max(blockTop, liqTop), subBot = Math.min(blockTop + s, tb);
        if (subBot > subTop) { g.fillStyle = K.withAlpha(theme.water, 0.35); g.fillRect(cx - s / 2 - 1, subTop, s + 2, subBot - subTop); }
        g.strokeStyle = theme.muted; g.lineWidth = 2.5; g.beginPath(); g.moveTo(tx, ttop); g.lineTo(tx, tb); g.lineTo(tx + tw, tb); g.lineTo(tx + tw, ttop); g.stroke();
        if (frac > 0.02) {
          const ref = Math.max.apply(null, st.trials.map(t => st.inv.model(t.vals)).concat([Fb])), len = 10 + 46 * (Fb * frac) / ref, ax = cx + s / 2 + 12, ay = blockTop + s / 2;
          K.arrow(g, ax, ay, ax, ay - len, { color: theme.c1, width: 3, head: 8 });
          K.text(g, K.tr(st.inv.measured.sym, lang) + ' = ' + K.fmt(Fb * frac, 2, lang) + ' N', ax + 8, ay - len, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        }
        labels(g, a, ['V = ' + K.fmt(v.V, 0, lang) + ' cm³', 'm = ' + K.fmt(v.m, 1, lang) + ' kg', K.tr(liq.label, lang), 'ρ = ' + K.fmt(liq.rho, 0, lang) + ' kg/m³']);
      }
      function drawCart(g, a, v, acc, tt) {
        const tEnd = Math.sqrt(2 * TRACK / acc), t = Math.min(tt, tEnd), sPos = Math.min(0.5 * acc * t * t, TRACK);
        const cw = 30 + 8 * v.m, ch = 14 + 3 * v.m, wheel = 5, trackY = a.y + a.h - 22, x0 = a.x + 10, x1 = a.x + a.w - 72, pxm = (x1 - x0 - cw) / TRACK;
        g.strokeStyle = theme.muted; g.lineWidth = 3; g.beginPath(); g.moveTo(a.x, trackY); g.lineTo(x1 + 40, trackY); g.stroke();
        g.strokeStyle = theme.fg; g.lineWidth = 1; [x0 + cw, x1].forEach(x => { g.beginPath(); g.moveTo(x, trackY + 2); g.lineTo(x, trackY + 10); g.stroke(); });
        K.text(g, 's = ' + K.fmt(TRACK, 1, lang) + ' m', (x0 + cw + x1) / 2, trackY + 10, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        const cx = x0 + sPos * pxm, cy = trackY - wheel - ch;
        g.fillStyle = theme.c1; K.roundRect(g, cx, cy, cw, ch, 4); g.fill();
        g.fillStyle = theme.fg; [cx + 8, cx + cw - 8].forEach(wx => { g.beginPath(); g.arc(wx, trackY - wheel, wheel, 0, Math.PI * 2); g.fill(); });
        K.text(g, 'm = ' + K.fmt(v.m, 1, lang) + ' kg', cx + cw / 2, cy - 4, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        const fy = cy + ch / 2;
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx + cw, fy); g.lineTo(cx + cw + 10, fy); g.stroke();
        K.arrow(g, cx + cw + 10, fy, cx + cw + 18 + 6 * v.F, fy, { color: theme.c2, width: 3, head: 8 });
        K.text(g, 'F = ' + K.fmt(v.F, 0, lang) + ' N', cx + cw + 12, fy - 8, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'bottom' });
        K.text(g, 't = ' + K.fmt(t, 2, lang) + ' s', a.x + a.w - 2, a.y + 2, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
        if (tt >= tEnd && st.step >= 4) K.text(g, 'a = 2s/t² = ' + K.fmt(acc, 2, lang) + ' m/s²', a.x + a.w - 2, a.y + 20, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
        else if (st.running) K.text(g, K.tr({ en: 'from rest to the mark…', hr: 'iz mirovanja do oznake…' }, lang), a.x + a.w - 2, a.y + 20, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'top' });
      }
      function drawTable(g, r) {
        panel(g, r);
        const inv = st.inv, iv = varById(st.indep), cols = [{ w: 0.08, head: '#', kind: 'idx' }];
        inv.vars.forEach(v => cols.push({ w: 0.62 / inv.vars.length, head: v.cat ? K.tr(v.short, lang) : v.sym + ' (' + v.unit + ')', sub: iv === v ? { en: 'changes', hr: 'mijenja se' } : { en: 'constant', hr: 'stalno' }, kind: iv === v ? 'indep' : 'ctrl', v }));
        cols.push({ w: 0.30, head: K.tr(inv.measured.sym, lang) + ' (' + inv.measured.unit + ')', sub: { en: 'measured', hr: 'mjeri se' }, kind: 'meas' });
        const headH = 28, tw = r.w - 12, ty = r.y + 6, rowH = K.clamp((r.h - headH - 12) / 4, 12, 22), fs = rowH < 15 ? 10 : 11;
        let x = r.x + 6; cols.forEach(c => { c.x = x; c.px = c.w * tw; x += c.px; });
        cols.forEach(c => {
          g.fillStyle = c.kind === 'indep' ? K.withAlpha(theme.c2, 0.3) : c.kind === 'ctrl' ? K.withAlpha(theme.c1, 0.15) : c.kind === 'meas' ? K.withAlpha(theme.c3, 0.25) : theme.surface2;
          g.fillRect(c.x, ty, c.px, headH);
          K.text(g, c.head, c.x + c.px / 2, ty + 9, { font: 'bold ' + fs + 'px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
          if (c.sub && st.step >= 2) K.text(g, K.tr(c.sub, lang), c.x + c.px / 2, ty + 21, { font: (fs - 1) + 'px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        });
        for (let i = 0; i < 4; i++) {
          const tr = st.trials[i], y = ty + headH + i * rowH, mid = y + rowH / 2, isCur = st.running && i === st.ti;
          if (isCur) { g.fillStyle = K.withAlpha(theme.accent, 0.15); g.fillRect(r.x + 6, y, tw, rowH); }
          g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(r.x + 6, y + rowH); g.lineTo(r.x + 6 + tw, y + rowH); g.stroke();
          cols.forEach(c => {
            let s = '';
            if (c.kind === 'idx') s = String(i + 1);
            else if (c.kind === 'meas') s = tr && tr.done ? K.fmt(tr.y, inv.measured.digits, lang) : isCur ? '…' : st.step >= 2 ? '?' : '';
            else if (tr && st.step >= 2) s = c.v.cat ? fmtVal(c.v, tr.vals[c.v.id], lang) : K.fmt(tr.vals[c.v.id], c.v.digits, lang);
            K.text(g, s, c.x + c.px / 2, mid, { font: (c.kind === 'meas' && tr && tr.done ? 'bold ' : '') + fs + 'px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
          });
        }
        if (st.step < 2) K.text(g, K.tr({ en: 'The plan of 4 trials appears here in step 2.', hr: 'Plan 4 mjerenja pojavit će se ovdje u 2. koraku.' }, lang), r.x + r.w / 2, ty + headH + 2 * rowH, { font: fs + 'px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function drawChecklist(g, r, narrow) {
        panel(g, r);
        g.save(); g.beginPath(); g.rect(r.x, r.y, r.w, r.h); g.clip();
        let x = r.x + 12, y = r.y + 18;
        for (let i = 0; i < 5; i++) {
          const done = st.step > i + 1, cur = st.step === i + 1;
          g.fillStyle = done || cur ? K.withAlpha(theme.accent, cur ? 0.5 : 0.25) : theme.surface2; g.beginPath(); g.arc(x + 8, y, 8, 0, Math.PI * 2); g.fill();
          if (cur) { g.strokeStyle = theme.accent; g.lineWidth = 2; g.stroke(); }
          K.text(g, String(i + 1), x + 8, y, { font: 'bold 10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
          x += 22;
        }
        K.text(g, st.step <= 5 ? K.tr(STEP_NAMES[st.step - 1], lang) : K.tr({ en: 'Done!', hr: 'Gotovo!' }, lang), x + 6, y, { font: 'bold 12px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        y += 22;
        const fs = narrow ? 10 : 12, lh = narrow ? 12 : 15, tagW = narrow ? 60 : 78, font = fs + 'px ' + theme.font, maxLines = narrow ? 2 : 3;
        chain(lang).forEach(row => {
          K.text(g, row.tag, r.x + 12, y, { font: 'bold ' + (fs - 1) + 'px ' + theme.font, color: row.on ? theme.accent : theme.muted, baseline: 'top' });
          const lines = wrap(g, row.text, r.w - 24 - tagW, font).slice(0, maxLines);
          lines.forEach((ln, i) => K.text(g, ln, r.x + 12 + tagW, y + i * lh, { font, color: row.on ? theme.fg : theme.muted, baseline: 'top' }));
          y += lines.length * lh + 5;
        });
        g.restore();
      }
      function drawChart(g, r) {
        const inv = st.inv, iv = varById(st.indep);
        if (!iv) { panel(g, r); K.text(g, K.tr({ en: 'Graph: measured value vs. the changed variable', hr: 'Graf: izmjerena vrijednost u ovisnosti o mijenjanoj varijabli' }, lang), r.x + r.w / 2, r.y + r.h / 2, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' }); return; }
        const pts = st.trials.filter(t => t.done).map(t => [t.vals[iv.id], t.y]).sort((p, q) => p[0] - q[0]);
        const yMax = Math.max.apply(null, st.trials.map(t => inv.model(t.vals))) * 1.3;
        const m = K.lineChart(g, { x: r.x, y: r.y, w: r.w, h: r.h, xMin: iv.cat ? 700 : 0, xMax: iv.plan[3], yMin: 0, yMax, lang, theme,
          xLabel: iv.cat ? 'ρ (kg/m³)' : iv.sym + ' (' + iv.unit + ')', yLabel: K.tr(inv.measured.sym, lang) + ' (' + inv.measured.unit + ')',
          series: [{ points: pts, color: theme.c1, label: inv.measured.sym }] });
        pts.forEach(p => { g.fillStyle = theme.c1; g.beginPath(); g.arc(m.sx(p[0]), m.sy(p[1]), 4, 0, Math.PI * 2); g.fill(); });
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (w >= 640) {
          const leftW = Math.round(w * 0.52), splitL = Math.round(h * 0.56), splitR = Math.round(h * 0.52);
          drawApparatus(g, { x: 8, y: 8, w: leftW - 16, h: splitL - 12 }, false);
          drawTable(g, { x: 8, y: splitL, w: leftW - 16, h: h - splitL - 8 });
          drawChecklist(g, { x: leftW, y: 8, w: w - leftW - 8, h: splitR - 12 }, false);
          drawChart(g, { x: leftW, y: splitR, w: w - leftW - 8, h: h - splitR - 8 });
        } else {
          const appH = Math.round(h * 0.36), tabH = 92;
          drawApparatus(g, { x: 8, y: 8, w: w - 16, h: appH }, true);
          drawTable(g, { x: 8, y: appH + 14, w: w - 16, h: tabH });
          drawChecklist(g, { x: 8, y: appH + tabH + 20, w: w - 16, h: h - appH - tabH - 28 }, true);
        }
      }

      const L = K.loop(dt => { step(dt); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateNote(); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
