/* FizLab sim: Friction lab — a wooden block pulled across a table with a spring scale (dynamometer). Static friction
   grows with the pull up to μ_s·F_N, then the block breaks free and slides with the smaller kinetic friction μ_k·F_N.
   Record the steady sliding friction for 1–4 blocks and find μ_k from a best-fit line through the origin. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, MB = 0.5, FMAX = 25, RAMP = 1, TABLE = 2.5, TAU2 = Math.PI * 2;   // g, one block (kg), largest pull (N), "pull slowly" (N/s), table (m)
  const VSTAR = 0.1, KAPPA = 2, TAU = 0.12;      // the hand that keeps the block sliding: speed (m/s), firmness (1/s), lag of the spring (s)
  const MU_ROLL = 0.02, BL = 16, BW = 8, BH = 5;  // rolling friction; block 16 cm × 8 cm × 5 cm (about 0.5 kg of wood)
  const WOOD = '#c9955a', WOOD_EDGE = '#6e4420', WOOD_TABLE = '#a8743f', SKIN = '#e2b08c';   // fixed physical colours
  const SURFACES = [
    { id: 'ice', mus: 0.05, muk: 0.03, label: { en: 'Ice', hr: 'Led' } },
    { id: 'table', mus: 0.25, muk: 0.20, label: { en: 'Smooth table', hr: 'Glatki stol' } },
    { id: 'wood', mus: 0.45, muk: 0.30, label: { en: 'Wood on wood', hr: 'Drvo po drvu' } },
    { id: 'sand', mus: 0.90, muk: 0.70, label: { en: 'Sandpaper', hr: 'Brusni papir' } },
    { id: 'rubber', mus: 1.00, muk: 0.80, label: { en: 'Rubber mat', hr: 'Gumena podloga' } }
  ];
  const FR = { en: 'F_fr', hr: 'F_tr' }, WT = { en: 'W', hr: 'G' };
  const PULL = { en: 'Pull slowly', hr: 'Vuci polako' }, LETGO = { en: 'Let go', hr: 'Pusti dinamometar' };

  window.Sims.register({
    id: 'friction',
    title: { en: 'Friction Lab', hr: 'Laboratorij trenja' },
    summary: {
      en: 'Pull a wooden block with a spring scale across ice, wood, sandpaper or rubber. Watch static friction grow until the block breaks free, then measure the sliding friction.',
      hr: 'Vuci drveni blok dinamometrom po ledu, drvu, brusnom papiru ili gumi. Gledaj kako trenje mirovanja raste dok blok ne krene, a zatim izmjeri trenje klizanja.'
    },
    tasks: [
      { en: 'Press "Pull slowly" on wood on wood. Find the peak on the graph. Why does the reading drop when the block starts to slide?', hr: 'Pritisni "Vuci polako" na podlozi drvo po drvu. Pronađi vrh na grafu. Zašto očitanje padne kad blok počne klizati?' },
      { en: 'Record the friction with 1, 2, 3 and 4 blocks while they slide steadily. Read μ_k from the best-fit line.', hr: 'Zabilježi trenje s 1, 2, 3 i 4 bloka dok jednoliko klize. Očitaj μ_k iz pravca.' },
      { en: 'Stand the block on its side. Does the smaller contact area change the friction?', hr: 'Postavi blok na bok. Mijenja li manja dodirna površina trenje?' },
      { en: 'Put the block on rollers. How many times smaller is the pull that keeps it moving?', hr: 'Stavi blok na valjke. Koliko je puta manja sila kojom ga održavaš u gibanju?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 480, maxHeight: 540 });
      const C = K.controls(container, lang);
      const T = o => K.tr(o, lang), fm = (v, d) => K.fmt(v, d, lang);
      function defaults() {
        return { surf: 'wood', n: 1, side: false, rollers: false, showWN: false, F: 0, Fset: 0, auto: 'off', x: 0, v: 0, t: 0,
          started: false, paused: false, brokeT: -1, endT: 0, peak: null, steadyT: 0, pts: [[0, 0]], lastSample: 0, maxF: 0,
          rec: [], cleared: false, recOk: null, pullOn: null };
      }
      const st = defaults();
      let drag = null;

      // ---------- controls ----------
      const selSurf = C.select({ label: { en: 'Surface', hr: 'Podloga' }, options: SURFACES.map(s => ({ value: s.id, label: s.label })), value: 'wood',
        onChange: v => { st.surf = v; clearRec(); refresh(); } });
      const segN = C.segmented({ label: { en: 'Number of blocks (0.5 kg each)', hr: 'Broj blokova (svaki 0,5 kg)' }, options: [1, 2, 3, 4].map(k => ({ value: k, label: String(k) })), value: 1,
        onChange: v => { st.n = v; refresh(); } });
      const segPos = C.segmented({ label: { en: 'Block position', hr: 'Položaj bloka' }, options: [
        { value: 'flat', label: { en: 'Lying flat', hr: 'Položen' } }, { value: 'side', label: { en: 'Standing on its side', hr: 'Stoji na boku' } }], value: 'flat',
        onChange: v => { st.side = v === 'side'; refresh(); } });
      const tgRoll = C.toggle({ label: { en: 'On rollers (rolling friction)', hr: 'Na valjcima (trenje kotrljanja)' }, value: false, onChange: v => { st.rollers = v; clearRec(); refresh(); } });
      const tgWN = C.toggle({ label: { en: 'Show weight and normal force', hr: 'Prikaži težinu i silu podloge' }, value: false, onChange: v => { st.showWN = v; draw(); } });
      const slF = C.slider({ label: { en: 'Pulling force', hr: 'Sila kojom vučeš' }, min: 0, max: FMAX, step: 0.1, value: 0, unit: 'N', digits: 1,
        onChange: v => { st.auto = 'off'; st.Fset = st.F = v; refresh(); } });
      const btnPull = C.button({ label: PULL, variant: 'primary', onClick: () => {
        if (st.auto !== 'off') { st.auto = 'off'; st.Fset = st.F = 0; slF.set(0); }
        else { st.auto = st.v > 0 ? 'hold' : 'ramp'; st.started = true; if (!L.running) { L.start(); st.paused = false; updatePlay(); } }
        refresh();
      } });
      const btnRec = C.button({ label: { en: 'Record', hr: 'Zabilježi' }, onClick: () => record() });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, onClick: () => { L.toggle(); st.paused = !L.running; updatePlay(); refresh(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outF = C.readout({ label: { en: 'Pull (scale reading)', hr: 'Vučna sila (dinamometar)' }, unit: 'N', digits: 2 });
      const outFr = C.readout({ label: { en: 'Friction force', hr: 'Sila trenja' }, unit: 'N', digits: 2 });
      const outN = C.readout({ label: { en: 'Normal force F_N', hr: 'Pritisna sila F_N' }, unit: 'N', digits: 2 });
      const outV = C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'm/s', digits: 2 });
      const outMu = C.readout({ label: { en: 'Coefficient μ_k (from the fit)', hr: 'Faktor trenja μ_k (iz pravca)' }, digits: 2 });
      const note = C.note({ text: { en: '', hr: '' } });
      const note2 = C.note({ text: { en: '', hr: '' } });
      const note3 = C.note({ text: { en: '', hr: '' } });

      // ---------- physics ----------
      function surf() { return SURFACES.find(s => s.id === st.surf) || SURFACES[2]; }
      function params() {
        const s = surf(), m = st.n * MB, Nf = m * G, mus = st.rollers ? MU_ROLL : s.mus, muk = st.rollers ? MU_ROLL : s.muk;
        return { s, m, Nf, mus, muk, Fs: mus * Nf, Fk: muk * Nf, tol: 0.03 * muk * Nf + 0.01 };   // "steady": reading within about 3 % of the friction
      }
      function info() {          // friction now and the regime (for notes and drawing)
        const q = params();
        if (st.v > 0) { q.fr = q.Fk; q.reg = st.brokeT >= 0 && st.brokeT < 1.4 ? 'max' : st.F < q.Fk - q.tol ? 'slow' : 'slide'; }
        else if (st.F < 0.005) { q.fr = 0; q.reg = 'idle'; }
        else if (st.F <= q.Fs + 1e-9) { q.fr = st.F; q.reg = 'rest'; }
        else { q.fr = q.Fs; q.reg = 'over'; }
        return q;
      }
      const steady = () => st.steadyT >= 0.4;
      function sub(h, q, t) {
        if (st.auto === 'ramp') { if (st.v <= 0) st.F = Math.min(FMAX, st.F + RAMP * h); }
        else if (st.auto === 'hold') {
          if (st.v <= 0) st.auto = 'ramp';                       // it stopped: pull harder again until it breaks free
          else st.F += (K.clamp(q.Fk + q.m * Math.min(KAPPA, 0.3 * q.muk * G / VSTAR) * (VSTAR - st.v), 0, FMAX) - st.F) * (1 - Math.exp(-h / TAU));   // gentler hand on ice and rollers
        } else st.F = st.Fset;
        if (st.v <= 0) {
          st.v = 0;
          if (st.F <= q.Fs + 1e-9) return;                       // at rest: static friction is exactly as big as the pull
          st.brokeT = 0; st.peak = [t, st.F];                     // the pull beat the largest static friction
          if (st.auto === 'ramp') st.auto = 'hold';
        }
        const v0 = st.v;
        st.v += (st.F - q.Fk) / q.m * h;                          // Newton's second law with kinetic friction
        if (st.v <= 0) { st.v = 0; st.brokeT = -1; return; }      // friction stopped it; it never pushes it backwards
        st.x += (v0 + st.v) / 2 * h;
        if (st.x >= TABLE) { st.x = 0; st.v = 0; st.brokeT = -1; st.endT = 2.5; if (st.auto === 'hold') st.auto = 'ramp'; }
      }
      function step(dt) {
        if (!st.started) { if (st.Fset > 0 || st.auto !== 'off') st.started = true; else return; }   // the clock starts with the first pull
        const q = params(), n = 8, h = dt / n;
        for (let i = 0; i < n; i++) sub(h, q, st.t + (i + 1) * h);
        st.t += dt;
        if (st.auto === 'ramp' && st.F >= FMAX) { st.auto = 'off'; st.Fset = FMAX; }
        if (st.auto !== 'off') st.Fset = st.F;
        if (st.brokeT >= 0) st.brokeT += dt;
        if (st.endT > 0) st.endT -= dt;
        st.steadyT = st.v > 0.005 && Math.abs(st.F - q.Fk) < q.tol ? st.steadyT + dt : 0;
        if (st.t - st.lastSample >= 0.05) {
          st.lastSample = st.t; st.pts.push([st.t, st.F]); st.maxF = Math.max(st.maxF, st.F);
          if (st.pts.length > 2400) st.pts.shift();
        }
      }
      function record() {
        if (!steady()) return;
        st.rec.push({ Nf: params().Nf, F: st.F, n: st.n });
        if (st.rec.length > 24) st.rec.shift();
        st.cleared = false; refresh();
      }
      function fit() {           // best-fit line through the origin: F_tr = μ_k · F_N, needs two different stacks
        const ns = {}; st.rec.forEach(p => { ns[p.n] = 1; });
        if (Object.keys(ns).length < 2) return null;
        let a = 0, b = 0; st.rec.forEach(p => { a += p.Nf * p.F; b += p.Nf * p.Nf; });
        return a / b;
      }
      function clearRec() { if (st.rec.length) { st.rec = []; st.cleared = true; } }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { updateOut(); draw(); }

      function updateOut() {
        const q = info(), mu = fit(), k = st.rec.length, f = (v, l) => K.fmt(v, 2, l);
        outF.set(st.F); outFr.set(q.fr); outN.set(q.Nf); outV.set(st.v); outMu.set(mu);
        const ok = steady();
        if (ok !== st.recOk) { st.recOk = ok; btnRec.setDisabled(!ok); }
        const on = st.auto !== 'off';
        if (on !== st.pullOn) { st.pullOn = on; btnPull.setLabel(on ? LETGO : PULL); }
        if (on) slF.set(Math.round(st.F * 10) / 10);
        const maxNote = { en: 'Largest static friction reached: the block starts to ' + (st.rollers ? 'roll' : 'slide') + ' (μ_s · F_N = ' + f(q.Fs, 'en') + ' N).',
          hr: 'Dosegnuto najveće trenje mirovanja: blok ' + (st.rollers ? 'se počinje kotrljati' : 'počinje klizati') + ' (μ_s · F_N = ' + f(q.Fs, 'hr') + ' N).' };
        let t1;
        if (st.endT > 0) t1 = { en: 'End of the table: the block was put back at the start.', hr: 'Kraj stola: blok je vraćen na početak.' };
        else if (q.reg === 'idle') t1 = { en: 'Pull the block: move the "Pulling force" slider, drag the dynamometer to the right, or press "Pull slowly".', hr: 'Vuci blok: pomakni klizač "Sila kojom vučeš", povuci dinamometar udesno ili pritisni "Vuci polako".' };
        else if (q.reg === 'rest') t1 = { en: 'Friction matches your pull, so the block stays at rest. Static friction can grow up to μ_s · F_N = ' + f(q.Fs, 'en') + ' N.',
          hr: 'Trenje je jednako sili kojom vučeš, pa blok miruje. Trenje mirovanja (statičko trenje) može narasti najviše do μ_s · F_N = ' + f(q.Fs, 'hr') + ' N.' };
        else if (q.reg === 'over') t1 = L.running ? maxNote : { en: 'Your pull is bigger than the largest static friction (' + f(q.Fs, 'en') + ' N). Press Play to see the block move.',
          hr: 'Vučeš jače od najvećeg trenja mirovanja (' + f(q.Fs, 'hr') + ' N). Pritisni Pokreni da vidiš kako blok kreće.' };
        else if (q.reg === 'max') t1 = maxNote;
        else if (q.reg === 'slow') t1 = { en: 'Your pull is smaller than the sliding friction, so the block slows down and stops.', hr: 'Vučeš slabije od trenja klizanja, pa blok usporava i staje.' };
        else {
          const tail = ok ? { en: ' Steady speed: the scale now shows the friction. Press Record.', hr: ' Stalna brzina: dinamometar sada pokazuje trenje. Pritisni Zabilježi.' } : { en: '', hr: '' };
          t1 = st.rollers
            ? { en: 'Rolling: rolling friction is tiny, F_fr = ' + f(MU_ROLL, 'en') + ' · F_N = ' + f(q.Fk, 'en') + ' N. That is why wheels make pulling easy.' + tail.en,
              hr: 'Kotrljanje: trenje kotrljanja vrlo je malo, F_tr = ' + f(MU_ROLL, 'hr') + ' · F_N = ' + f(q.Fk, 'hr') + ' N. Zato kotači olakšavaju vuču.' + tail.hr }
            : { en: 'Sliding: friction is smaller than just before it moved. Sliding friction F_fr = μ_k · F_N = ' + f(q.Fk, 'en') + ' N.' + tail.en,
              hr: 'Klizanje: trenje je manje nego neposredno prije pokretanja. Trenje klizanja F_tr = μ_k · F_N = ' + f(q.Fk, 'hr') + ' N.' + tail.hr };
        }
        note.set(t1);
        const A = st.side ? BL * BH : BL * BW;
        note2.set(st.rollers
          ? { en: 'On rollers the block rolls instead of sliding. Rolling friction (μ = 0.02) is much smaller than sliding friction.', hr: 'Na valjcima se blok kotrlja umjesto da kliže. Trenje kotrljanja (μ = 0,02) mnogo je manje od trenja klizanja.' }
          : st.side
            ? { en: 'On its side the contact area is only ' + A + ' cm², but the friction is the same as lying flat. Friction does not depend on the contact area.', hr: 'Na boku je dodirna površina samo ' + A + ' cm², ali trenje je isto kao kad blok leži. Trenje ne ovisi o veličini dodirne površine.' }
            : { en: 'Lying flat the contact area is ' + A + ' cm². Stand the block on its side: the area gets smaller, but the friction stays the same.', hr: 'Kad blok leži, dodirna površina je ' + A + ' cm². Postavi ga na bok: površina se smanji, ali trenje ostaje isto.' });
        if (!k) {
          const how = { en: 'Measure the coefficient of sliding friction μ_k: while the block slides at a steady speed, press Record. Then change the number of blocks and record again.', hr: 'Izmjeri faktor trenja klizanja μ_k: dok blok kliže stalnom brzinom, pritisni Zabilježi. Zatim promijeni broj blokova i ponovno zabilježi.' };
          note3.set(st.cleared ? { en: 'New surface, new measurement: the old points were cleared. ' + how.en, hr: 'Nova podloga, novo mjerenje: stare točke su obrisane. ' + how.hr } : how);
        } else if (mu === null) note3.set({ en: 'Recorded points: ' + k + '. Now change the number of blocks and record again while the block slides steadily.', hr: 'Zabilježenih točaka: ' + k + '. Sada promijeni broj blokova i ponovno zabilježi dok blok jednoliko kliže.' });
        else note3.set({ en: 'Recorded points: ' + k + '. The best-fit line through the origin gives μ_k = F_fr / F_N ≈ ' + f(mu, 'en') + '. Twice the normal force gives twice the friction.',
          hr: 'Zabilježenih točaka: ' + k + '. Pravac kroz ishodište daje μ_k = F_tr / F_N ≈ ' + f(mu, 'hr') + '. Dvostruko veća pritisna sila (sila podloge) daje dvostruko veće trenje.' });
      }

      // ---------- geometry shared by drawing and pointer ----------
      function geom() {
        const w = cv.w, h = cv.h, wide = w >= 640;
        const W = wide ? Math.round(w * 0.58) : w, Hs = wide ? h : Math.round(h * 0.6);
        const tableY = Math.round(Hs - Math.max(56, Hs * 0.28));
        const pxcm = K.clamp(Math.min(W * 0.2 / BL, (tableY - 92) / (4 * BW + 0.3 * BW + 2)), 1.5, 8);   // fits 4 blocks on their side
        const L = BL * pxcm, bx = Math.round(Math.max(W * 0.15, 92)), cx = bx + L / 2;
        const H = (st.side ? BW : BH) * pxcm, D = (st.side ? BH : BW) * pxcm, dx = 0.42 * D, dy = -0.3 * D;
        const rr = st.rollers ? Math.max(3, pxcm) : 0, base = tableY - 2 * rr;
        const hookX = bx + L + dx / 2, hookY = base - H / 2 + dy / 2, hbW = Math.round(K.clamp(W * 0.13, 50, 78));
        const kpx = K.clamp((W - hookX - 70 - hbW) / FMAX, 1.5, 8), s0 = hookX + 10, s1 = s0 + 26 + st.F * kpx;
        return { w, h, wide, W, Hs, tableY, pxcm, L, bx, cx, H, D, dx, dy, rr, base, hookX, hookY, hbW, kpx, s0, s1,
          hx: s1 + hbW + 18, pxN: Math.min(8, (cx - 14) / 20, (W - hookX - 24) / 27) };
      }

      // ---------- pointer: drag the dynamometer to pull ----------
      function hitScale(p, g) { return p.x >= g.s1 - 6 && p.x <= g.hx + 16 && Math.abs(p.y - g.hookY) < 22; }
      function onDown(ev) {
        const p = cv.pointer(ev), g = geom();
        if (!hitScale(p, g)) return;
        drag = { x0: p.x, F0: st.F, kpx: g.kpx };
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault();
      }
      function onMove(ev) {
        const p = cv.pointer(ev);
        if (!drag) { cv.canvas.style.cursor = hitScale(p, geom()) ? 'grab' : 'default'; return; }
        const F = K.clamp(Math.round((drag.F0 + (p.x - drag.x0) / drag.kpx) * 10) / 10, 0, FMAX);
        st.auto = 'off'; st.Fset = st.F = F; slF.set(F); refresh();
      }
      function onUp() { if (drag) { drag = null; cv.canvas.style.cursor = 'default'; } }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing helpers ----------
      function pill(c, str, x, y, align, font, maxX) {    // text with a soft background so it stays readable over arrows
        c.font = font; const tw = c.measureText(str).width;
        let tx = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
        tx = K.clamp(tx, 4, Math.max(4, maxX - tw - 4));
        c.fillStyle = K.withAlpha(theme.surface, 0.82); K.roundRect(c, tx - 4, y - 8, tw + 8, 16, 4); c.fill();
        K.text(c, str, tx, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function fitFont(c, str, maxW, base, bold) {
        for (let px = base; px >= 9; px--) { const f = (bold ? 'bold ' : '') + px + 'px ' + theme.font; c.font = f; if (c.measureText(str).width <= maxW) return f; }
        return (bold ? 'bold ' : '') + '9px ' + theme.font;
      }
      function block(c, x, y, L, H, dx, dy) {              // one wooden block in a slanted 3D view
        c.strokeStyle = WOOD_EDGE; c.lineWidth = 1.5; c.lineJoin = 'round';
        const face = (pts, shade) => {
          c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath();
          c.fillStyle = WOOD; c.fill(); if (shade) { c.fillStyle = shade; c.fill(); } c.stroke();
        };
        face([[x + L, y], [x + L + dx, y + dy], [x + L + dx, y + H + dy], [x + L, y + H]], 'rgba(0,0,0,0.18)');
        face([[x, y], [x + L, y], [x + L + dx, y + dy], [x + dx, y + dy]], 'rgba(255,255,255,0.22)');
        face([[x, y], [x + L, y], [x + L, y + H], [x, y + H]], null);
        c.strokeStyle = K.withAlpha(WOOD_EDGE, 0.45); c.lineWidth = 1; c.beginPath();
        c.moveTo(x + 4, y + H * 0.35); c.quadraticCurveTo(x + L * 0.5, y + H * 0.12, x + L - 4, y + H * 0.4);
        c.moveTo(x + 4, y + H * 0.72); c.quadraticCurveTo(x + L * 0.45, y + H * 0.9, x + L - 4, y + H * 0.66); c.stroke();
      }

      // ---------- scene: table, block, dynamometer, arrows ----------
      function drawScene(c, g) {
        const q = info(), W = g.W, X = cm => g.cx + (cm - st.x * 100) * g.pxcm;
        c.save(); c.beginPath(); c.rect(0, 0, W, g.Hs); c.clip();
        const tx0 = Math.max(0, X(-40)), tx1 = Math.min(W, X(TABLE * 100 + BL / 2 + 6)), ty = g.tableY;
        const k0 = Math.floor(st.x * 100 - g.cx / g.pxcm), k1 = st.x * 100 + (W - g.cx) / g.pxcm;
        if (tx1 > tx0) {
          c.fillStyle = theme.ground; c.fillRect(tx0, ty, tx1 - tx0, g.Hs - ty);
          const band = { ice: theme.water, table: K.withAlpha(theme.surface, 0.9), wood: WOOD_TABLE, sand: K.withAlpha(theme.muted, 0.85), rubber: K.withAlpha(theme.fg, 0.55) };
          c.fillStyle = band[st.surf] || theme.muted; c.fillRect(tx0, ty, tx1 - tx0, 6);
          if (st.surf === 'sand' || st.surf === 'rubber') {     // grains of the sandpaper, ribs of the rubber mat
            c.fillStyle = st.surf === 'sand' ? K.withAlpha(theme.fg, 0.55) : K.withAlpha(theme.surface, 0.45);
            for (let k = k0; k < k1; k++) { const sx = X(k); if (sx < tx0 || sx > tx1) continue; if (st.surf === 'sand') c.fillRect(sx + (((k * 7) % 10 + 10) % 10) / 10 * g.pxcm, ty + 1 + (((k * 3) % 4 + 4) % 4), 1.6, 1.6); else c.fillRect(sx, ty, 1.2, 6); }
          }
          c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(tx0, ty); c.lineTo(tx1, ty); c.stroke();
          c.lineWidth = 1;
          for (let k = Math.max(0, Math.ceil(k0 / 10) * 10); k <= Math.min(k1, TABLE * 100); k += 10) {
            const sx = X(k), major = k % 50 === 0;
            c.beginPath(); c.moveTo(sx, ty + 6); c.lineTo(sx, ty + (major ? 14 : 10)); c.stroke();
            if (major) K.text(c, fm(k / 100, 1) + ' m', sx, ty + 16, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
          }
        }
        // contact area seen from above (to scale)
        if (!st.rollers) {
          const fw = BL * g.pxcm * 0.55, fh = (st.side ? BH : BW) * g.pxcm * 0.55, fx = W - 10 - fw, fy = ty + 30;   // right side: clear of the weight arrow
          if (fy + fh < g.Hs - 2) {
            c.fillStyle = K.withAlpha(theme.c5, 0.35); c.fillRect(fx, fy, fw, fh); c.strokeStyle = theme.c5; c.lineWidth = 2; c.strokeRect(fx, fy, fw, fh);
            pill(c, T({ en: 'contact area A = ', hr: 'dodirna površina A = ' }) + (st.side ? BL * BH : BL * BW) + ' cm²', fx - 8, fy + fh / 2, 'right', '11px ' + theme.font, W);
          }
        } else {
          [0.18, 0.5, 0.82].forEach(k => {
            const rx = g.bx + g.L * k, ry = ty - g.rr, a = st.x * 50;
            c.fillStyle = theme.muted; c.beginPath(); c.arc(rx, ry, g.rr, 0, TAU2); c.fill(); c.strokeStyle = theme.fg; c.lineWidth = 1.2; c.stroke();
            c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx + g.rr * Math.cos(a), ry + g.rr * Math.sin(a)); c.stroke();
          });
        }
        for (let i = 0; i < st.n; i++) block(c, g.bx, g.base - (i + 1) * g.H, g.L, g.H, g.dx, g.dy);
        // dynamometer: hook, spring (longer when the pull is bigger), housing with the reading, hand
        const y = g.hookY;
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.moveTo(g.hookX, y); c.lineTo(g.s0, y); c.stroke();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(g.hookX, y, 2.5, 0, TAU2); c.fill();
        c.lineWidth = 1.5; c.beginPath(); c.moveTo(g.s0, y);
        for (let i = 1; i < 14; i++) c.lineTo(g.s0 + (g.s1 - g.s0) * i / 14, y + (i % 2 ? -6 : 6));
        c.lineTo(g.s1, y); c.stroke();
        c.fillStyle = theme.surface; K.roundRect(c, g.s1, y - 11, g.hbW, 22, 5); c.fill(); c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.stroke();
        K.text(c, fm(st.F, 2) + ' N', g.s1 + g.hbW / 2, y + 0.5, { font: fitFont(c, fm(st.F, 2) + ' N', g.hbW - 6, 12, true), color: theme.fg, align: 'center', baseline: 'middle' });
        if (y - 34 > 70) K.text(c, T({ en: 'dynamometer', hr: 'dinamometar' }), g.s1 + g.hbW / 2, y - 34, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        c.beginPath(); c.moveTo(g.s1 + g.hbW, y); c.lineTo(g.hx - 9, y); c.stroke();
        c.strokeStyle = SKIN; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(g.hx + 4, y + 3); c.lineTo(g.hx + 40, y + 18); c.stroke(); c.lineCap = 'butt';
        c.fillStyle = SKIN; c.beginPath(); c.arc(g.hx, y, 9, 0, TAU2); c.fill(); c.strokeStyle = WOOD_EDGE; c.lineWidth = 1; c.stroke();
        // forces: pull (c1) at the hook, friction (c2) along the table, weight (c3) and normal force (c4)
        const lenF = st.F * g.pxN, ay = y - 20;
        if (lenF > 1) K.arrow(c, g.hookX, ay, g.hookX + lenF, ay, { color: theme.c1, width: 3, head: Math.min(10, lenF) });
        if (st.F > 0.005) pill(c, 'F = ' + fm(st.F, 2) + ' N', g.hookX + lenF + 6, ay, 'left', 'bold 12px ' + theme.font, W);
        const lenR = q.fr * g.pxN;
        if (lenR > 1) K.arrow(c, g.cx, ty - 5, g.cx - lenR, ty - 5, { color: theme.c2, width: 3, head: Math.min(10, lenR) });
        if (q.fr > 0.005) pill(c, T(FR) + ' = ' + fm(q.fr, 2) + ' N', Math.min(g.bx, g.cx - lenR) - 6, ty - 20, 'right', '12px ' + theme.font, W);
        if (st.showWN) {
          const cmY = g.base - st.n * g.H / 2, lv = q.Nf * g.pxN;
          K.arrow(c, g.cx - 9, cmY, g.cx - 9, cmY + lv, { color: theme.c3, width: 3, head: 9 });
          K.arrow(c, g.cx + 9, ty, g.cx + 9, ty - lv, { color: theme.c4, width: 3, head: 9 });
          pill(c, T(WT) + ' = ' + fm(q.Nf, 2) + ' N', g.cx - 16, cmY + lv - 6, 'right', '11px ' + theme.font, W);
          pill(c, 'F_N = ' + fm(q.Nf, 2) + ' N', g.cx + 16, ty - lv + 8, 'left', '11px ' + theme.font, W);
        }
        // header: friction formula with numbers, surface, legend
        const h1 = (q.reg === 'idle' || q.reg === 'rest' || q.reg === 'over')
          ? T(FR) + ' = F = ' + fm(q.fr, 2) + ' N   (' + T({ en: 'at rest, at most μ_s · F_N = ', hr: 'mirovanje, najviše μ_s · F_N = ' }) + fm(q.Fs, 2) + ' N)'
          : T(st.rollers ? { en: 'Rolling: ', hr: 'Kotrljanje: ' } : { en: 'Sliding: ', hr: 'Klizanje: ' }) + T(FR) + (st.rollers ? ' = μ · F_N = ' : ' = μ_k · F_N = ') + fm(q.muk, 2) + ' · ' + fm(q.Nf, 2) + ' N = ' + fm(q.Fk, 2) + ' N';
        const h2 = (st.rollers ? T({ en: 'On rollers', hr: 'Na valjcima' }) + ':  μ = ' + fm(MU_ROLL, 2) : T(q.s.label) + ':  μ_s = ' + fm(q.mus, 2) + ',  μ_k = ' + fm(q.muk, 2)) + '     t = ' + fm(st.t, 1) + ' s';
        K.text(c, h1, 10, 16, { font: fitFont(c, h1, W - 20, 14, true), color: theme.fg, baseline: 'middle' });
        K.text(c, h2, 10, 34, { font: fitFont(c, h2, W - 20, 12, false), color: theme.muted, baseline: 'middle' });
        const legend = [[theme.c1, { en: 'pull', hr: 'vučna sila' }], [theme.c2, { en: 'friction', hr: 'trenje' }]];
        if (st.showWN) legend.push([theme.c3, { en: 'weight', hr: 'težina' }], [theme.c4, { en: 'normal force', hr: 'sila podloge' }]);
        let lx = 10, ly = 50;
        c.font = '11px ' + theme.font;
        legend.forEach(([col, lab]) => {
          const s = T(lab), iw = 18 + c.measureText(s).width + 12;
          if (lx + iw > W - 6) { lx = 10; ly += 14; }
          c.fillStyle = col; c.fillRect(lx, ly - 2, 14, 4);
          K.text(c, s, lx + 18, ly, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
          lx += iw;
        });
        const topY = g.base - st.n * g.H + g.dy;
        pill(c, 'm = ' + fm(st.n * MB, 1) + ' kg    v = ' + fm(st.v, 2) + ' m/s', g.cx + g.dx / 2, Math.max(ly + 18, topY - 14), 'center', 'bold 11px ' + theme.font, W);
        c.restore();
      }

      // ---------- graphs: reading against time, friction against normal force ----------
      function drawCharts(c, g) {
        let a, b;
        if (g.wide) { const x = g.W + 8, cw = g.w - g.W - 16, h1 = Math.round((g.h - 24) * 0.55); a = { x, y: 8, w: cw, h: h1 }; b = { x, y: 16 + h1, w: cw, h: g.h - 24 - h1 }; }
        else { const cw = (g.w - 24) / 2, y = g.Hs + 4, ch = g.h - g.Hs - 10; a = { x: 8, y, w: cw, h: ch }; b = { x: 16 + cw, y, w: cw, h: ch }; }
        const dig = max => { const s = K.niceScale(0, max, 4).step; return s >= 1 ? (s % 1 ? 1 : 0) : (Math.abs(s * 10 - Math.round(s * 10)) < 1e-9 ? 1 : 2); };   // 0.25 must not show as 0.3
        const t0 = st.pts[0][0], xMax = Math.max(t0 + 10, Math.ceil(st.t / 5) * 5), yMax1 = Math.max(0.5, st.maxF * 1.15);
        const r = K.lineChart(c, Object.assign({ xMin: t0, xMax, yMin: 0, yMax: yMax1, yDigits: dig(yMax1), lang, theme,
          xLabel: { en: 'time (s)', hr: 'vrijeme (s)' }, yLabel: { en: 'scale reading (N)', hr: 'dinamometar (N)' },
          series: [{ points: st.pts, color: theme.c1, label: { en: 'reading', hr: 'očitanje' } }] }, a));
        if (st.peak && st.peak[0] >= t0) {
          const px = r.sx(st.peak[0]), py = r.sy(st.peak[1]);
          if (px >= r.px && px <= r.px + r.pw && py >= r.py) {
            c.fillStyle = theme.surface; c.beginPath(); c.arc(px, py, 5, 0, TAU2); c.fill(); c.strokeStyle = theme.fg; c.lineWidth = 2; c.stroke();
            pill(c, T({ en: 'peak', hr: 'vrh' }), px + 8, Math.max(r.py + 22, py - 10), 'left', '10px ' + theme.font, r.px + r.pw);
          }
        }
        const mu = fit(), yMax2 = Math.max(1, st.rec.reduce((m, p) => Math.max(m, p.F), 0) * 1.2);
        const r2 = K.lineChart(c, Object.assign({ xMin: 0, xMax: 20, yMin: 0, yMax: yMax2, yDigits: dig(yMax2), lang, theme,
          xLabel: { en: 'normal force F_N (N)', hr: 'pritisna sila F_N (N)' }, yLabel: { en: 'friction (N)', hr: 'trenje (N)' }, series: [] }, b));
        c.save(); c.beginPath(); c.rect(r2.px, r2.py, r2.pw, r2.ph); c.clip();
        if (mu !== null) {
          c.setLineDash([5, 4]); c.strokeStyle = theme.fg; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(r2.sx(0), r2.sy(0)); c.lineTo(r2.sx(30), r2.sy(30 * mu)); c.stroke(); c.setLineDash([]);
        }
        st.rec.forEach(p => { c.fillStyle = theme.c2; c.beginPath(); c.arc(r2.sx(p.Nf), r2.sy(p.F), 4.5, 0, TAU2); c.fill(); c.strokeStyle = theme.surface; c.lineWidth = 1.5; c.stroke(); });
        c.restore();
        pill(c, mu === null ? 'μ_k = ?' : 'μ_k ≈ ' + fm(mu, 2), r2.px + r2.pw - 4, r2.py + 22, 'right', 'bold 11px ' + theme.font, r2.px + r2.pw);
      }
      function draw() {
        const c = cv.ctx, g = geom();
        c.clearRect(0, 0, g.w, g.h); c.fillStyle = theme.sky; c.fillRect(0, 0, g.w, g.h);
        drawScene(c, g); drawCharts(c, g);
      }

      // ---------- lifecycle ----------
      function reset() {
        L.stop(); Object.assign(st, defaults()); drag = null;
        selSurf.set('wood'); segN.set(1); segPos.set('flat'); tgRoll.set(false); tgWN.set(false); slF.set(0);
        if (!ctx.reducedMotion) L.start();
        updatePlay(); refresh();
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() {
          L.destroy(); window.removeEventListener('pointerup', onUp);
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          cv.canvas.removeEventListener('pointerup', onUp); cv.canvas.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
