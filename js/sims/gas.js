/* FizLab sim: Gas in a Box — bouncing particles, a piston, a heater and a pump: the gas laws from wall hits, plus Brownian motion. */
(function () {
  'use strict';
  const K = window.SimKit;
  const HM = 1, L0 = 0.64;                         // box height and its length at V = 1 L (model units)
  const V_MIN = 0.3, V_MAX = 2.0, V_STOP = 2.1;    // litres (relative scale)
  const T_MIN = 100, T_MAX = 600, T0 = 300, N0 = 100, N_MAX = 250;
  const SIGMA2 = 1.3 * 1.3 / 300;                  // velocity variance per kelvin: 1.3 units/s in each direction at 300 K
  const P_CAL = L0 * HM / (SIGMA2 * 300);          // wall impulse per second per unit wall length → kPa (100 particles, 300 K, 1 L → 100 kPa)
  const P_LIMIT = 500, P_EXT = 100, P_DIAL = 600, WINDOW = 1, LID = V_MIN * L0;
  const GRAIN_R = 0.075, GRAIN_M = 40, SMALL_R = 0.012, N_BROWN = 150, V_BROWN = 1.6;
  const MODES = [
    { value: 'explore', label: { en: 'Explore', hr: 'Istraži' } },
    { value: 'squeeze', label: { en: 'Squeeze', hr: 'Stisni' } },
    { value: 'heat', label: { en: 'Heat it', hr: 'Zagrij' } },
    { value: 'free', label: { en: 'Free piston', hr: 'Slobodni klip' } },
    { value: 'brown', label: { en: 'Brownian motion', hr: 'Brownovo gibanje' } }
  ];
  const AX_V = { en: 'V (L)', hr: 'V (L)' }, AX_P = { en: 'p (kPa)', hr: 'p (kPa)' }, AX_T = { en: 'T (K)', hr: 'T (K)' };
  const CHARTS = {
    squeeze: { xMax: 2.5, xTicks: 5, yMax: 400, yTicks: 4, xLabel: AX_V, yLabel: AX_P },
    heat: { xMax: 600, xTicks: 6, yMax: 250, yTicks: 5, xLabel: AX_T, yLabel: AX_P },
    free: { xMax: 600, xTicks: 6, yMax: 2.5, yTicks: 5, xLabel: AX_T, yLabel: AX_V }
  };
  const NOTES = {
    explore: { en: 'Pressure comes from particles hitting the walls. More particles, a higher temperature or a smaller volume mean more or harder hits, so the pressure rises: p ∝ N·T/V.',
      hr: 'Tlak nastaje udarcima čestica o stijenke. Više čestica, viša temperatura ili manji obujam znače više ili jačih udaraca pa tlak raste: p ∝ N·T/V.' },
    squeeze: { en: 'Temperature held. Half the volume → double the pressure, because the particles hit the walls twice as often. The product p·V stays the same.',
      hr: 'Temperatura je stalna. Upola manji obujam → dvostruko veći tlak, jer čestice dvostruko češće udaraju o stijenke. Umnožak p·V ostaje isti.' },
    heat: { en: 'Volume held. Hotter particles are faster and hit the walls harder and more often, so the pressure rises. That is why a football in the sun gets hard and why spray cans must never be heated.',
      hr: 'Obujam je stalan. Toplije čestice su brže pa jače i češće udaraju o stijenke i tlak raste. Zato lopta na suncu otvrdne, a limenke sa sprejem ne smiju se zagrijavati.' },
    free: { en: 'Pressure held: the piston moves until the gas pressure balances the weight. Heated gas expands (V ∝ T in kelvin), so hot air is less dense than cold air. That is what lifts a hot-air balloon.',
      hr: 'Tlak je stalan: klip se pomiče dok tlak plina ne uravnoteži uteg. Zagrijani plin se širi (V ∝ T u kelvinima) pa je topli zrak rjeđi od hladnoga. To podiže balon na vrući zrak.' },
    brown: { en: 'Brownian motion: fast particles too small to see bump the pollen grain from all sides, never quite evenly, so it jitters. Hotter → livelier. This jitter was the first visible evidence for atoms.',
      hr: 'Brownovo gibanje: brze čestice, premalene da ih vidimo, udaraju zrnce peludi sa svih strana, nikad posve jednako, pa ono podrhtava. Toplije → življe. To podrhtavanje bilo je prvi vidljivi dokaz da atomi postoje.' },
    popped: { en: 'Too much pressure: the lid popped and the gas is escaping. Press Reset to close the box again.',
      hr: 'Prevelik tlak: poklopac je odletio i plin izlazi. Pritisni Vrati da ponovno zatvoriš posudu.' }
  };
  function rgbOf(col) {
    col = (col || '#888').trim();
    if (col.startsWith('rgb')) { const p = col.replace(/rgba?\(([^)]+)\)/, '$1').split(',').map(s => parseFloat(s)); return [p[0] || 0, p[1] || 0, p[2] || 0]; }
    let h = col.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
  }
  function mixColor(a, b, t) {
    const A = rgbOf(a), B = rgbOf(b); t = K.clamp(t, 0, 1);
    return 'rgb(' + Math.round(K.lerp(A[0], B[0], t)) + ',' + Math.round(K.lerp(A[1], B[1], t)) + ',' + Math.round(K.lerp(A[2], B[2], t)) + ')';
  }

  window.Sims.register({
    id: 'gas',
    title: { en: 'Gas in a Box', hr: 'Plin u posudi' },
    summary: {
      en: 'A box of bouncing particles with a piston, a heater and a pump: see where pressure comes from and how it depends on volume, temperature and the number of particles.',
      hr: 'Posuda s česticama koje se odbijaju, s klipom, grijačem i pumpom: pogledaj odakle dolazi tlak i kako ovisi o obujmu, temperaturi i broju čestica.'
    },
    tasks: [
      { en: 'Explore: pump the gas up from 100 to 200 particles. What happens to the pressure? Then double the temperature in kelvin instead.', hr: 'Istraži: napumpaj plin sa 100 na 200 čestica. Što se dogodi s tlakom? Zatim umjesto toga udvostruči temperaturu u kelvinima.' },
      { en: 'Squeeze: record the pressure at 2 L, 1 L and 0.5 L. What happens to the pressure each time the volume is halved?', hr: 'Stisni: zabilježi tlak pri 2 L, 1 L i 0,5 L. Što se dogodi s tlakom svaki put kad se obujam prepolovi?' },
      { en: 'Heat it: record points from 150 K to 600 K. At what temperature would the line reach zero pressure?', hr: 'Zagrij: zabilježi točke od 150 K do 600 K. Pri kojoj bi temperaturi pravac došao do tlaka nula?' },
      { en: 'Brownian motion: hide the small particles and watch the grain as Robert Brown did in 1827. Then heat the gas. What changes?', hr: 'Brownovo gibanje: sakrij male čestice i promatraj zrnce kao Robert Brown 1827. Zatim zagrij plin. Što se mijenja?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 340, maxHeight: 500 });
      const C = K.controls(container, lang);
      let seed = 11;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
      const st = { mode: 'explore', V: 1, T: T0, Ttarget: T0, parts: [], nIn: N0, grain: null, trace: [], traceT: 0, showSmall: true,
        popped: false, lidAnim: 0, pMeas: 100, buf: [], pts: { squeeze: [], heat: [], free: [] }, pump: 0, flashes: [], time: 0, drag: null, noteKey: '' };

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'Experiment', hr: 'Pokus' }, options: MODES, value: 'explore', onChange: v => setMode(v) });
      const slV = C.slider({ label: { en: 'Volume (move the piston)', hr: 'Obujam (pomakni klip)' }, min: V_MIN, max: V_MAX, step: 0.05, value: 1, unit: 'L', digits: 2,
        onChange: v => { if (canMove()) setV(v); refresh(); } });
      const slT = C.slider({ label: { en: 'Temperature (heater / cooler)', hr: 'Temperatura (grijač / hladilo)' }, min: T_MIN, max: T_MAX, step: 5, value: T0,
        unit: 'K', digits: 0,
        onChange: v => { if (st.mode !== 'squeeze') { st.Ttarget = v; if (!L.running) heatTo(v); } refresh(); } });
      const slN = C.slider({ label: { en: 'Number of particles (pump)', hr: 'Broj čestica (pumpa)' }, min: 20, max: N_MAX, step: 10, value: N0, digits: 0,
        onChange: v => { if (st.mode === 'explore' && !st.popped) { if (v > st.parts.length) st.pump = 1; setN(v, true); } refresh(); } });
      const tgSmall = C.toggle({ label: { en: 'Show the small particles', hr: 'Prikaži male čestice' }, value: true, onChange: v => { st.showSmall = v; refresh(); } });
      const btnRec = C.button({ label: { en: 'Record', hr: 'Zabilježi' }, onClick: () => {
        const pts = st.pts[st.mode];
        if (!pts || st.popped) return;
        pts.push(st.mode === 'squeeze' ? [st.V, st.pMeas] : st.mode === 'heat' ? [st.T, st.pMeas] : [st.T, st.V]);
        if (pts.length > 14) pts.shift();
        refresh();
      } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outP = C.readout({ label: { en: 'Pressure p (measured)', hr: 'Tlak p (izmjeren)' }, unit: 'kPa', digits: 0 });
      const outPi = C.readout({ label: { en: 'Ideal gas: p ∝ N·T/V', hr: 'Idealni plin: p ∝ N·T/V' }, unit: 'kPa', digits: 0 });
      const outV = C.readout({ label: { en: 'Volume V', hr: 'Obujam V' }, unit: 'L', digits: 2 });
      const outT = C.readout({ label: { en: 'Temperature T', hr: 'Temperatura T' } });
      const outN = C.readout({ label: { en: 'Particles N', hr: 'Broj čestica N' }, digits: 0 });
      const note = C.note({ text: NOTES.explore });

      function fieldOf(c) {
        let e = c.el;
        while (e) {
          const cls = String(e.className || '').split(/\s+/);
          if (cls.indexOf('sk-field') >= 0) return e;
          if (cls.indexOf('sk-controls') >= 0) return c.el;
          e = e.parentNode;
        }
        return c.el;
      }
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };
      function showControls() {
        const m = st.mode;
        show(slV, m === 'explore' || m === 'squeeze'); show(slT, m !== 'squeeze'); show(slN, m === 'explore');
        show(tgSmall, m === 'brown'); show(btnRec, !!st.pts[m]);
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }

      // ---------- physics ----------
      const Lx = () => st.V * L0;
      const pIdeal = () => 100 * (st.nIn / 100) * (st.T / 300) / st.V;
      const canMove = () => !st.popped && (st.mode === 'explore' || st.mode === 'squeeze');
      function newParticle(pumped) {
        const s = Math.sqrt(SIGMA2 * st.T), p = { x: rnd() * Lx(), y: rnd() * HM, vx: gauss() * s, vy: gauss() * s, out: false };
        if (pumped) { p.x = 0; p.y = HM * (0.8 + 0.1 * rnd()); p.vx = Math.abs(p.vx); }   // enters through the pump hose
        return p;
      }
      function setN(n, pumped) {
        while (st.parts.length < n) st.parts.push(newParticle(pumped));
        st.parts.length = Math.min(st.parts.length, n);
        st.nIn = st.parts.length;
        // thermostat: rescale so the average kinetic energy matches the temperature exactly (few particles → big random scatter otherwise)
        let sx = 0, sy = 0;
        st.parts.forEach(p => { sx += p.vx * p.vx; sy += p.vy * p.vy; });
        const fx = Math.sqrt(n * SIGMA2 * st.T / (sx || 1)), fy = Math.sqrt(n * SIGMA2 * st.T / (sy || 1));
        st.parts.forEach(p => { p.vx *= fx; p.vy *= fy; });
      }
      function setV(v) {
        st.V = K.clamp(v, V_MIN, V_STOP);
        const lx = Lx();
        st.parts.forEach(p => { if (!p.out && p.x > lx) { p.x = lx; p.vx = -Math.abs(p.vx); } });   // the piston sweeps particles along
      }
      // moves everything by h seconds; returns the momentum handed to the walls (particle mass = 1)
      function move(h, live) {
        const lx = Lx(), P = st.parts, g = st.grain, R = GRAIN_R + SMALL_R;
        let J = 0;
        if (g) {
          g.x += g.vx * h; g.y += g.vy * h;
          if (g.x < GRAIN_R) { g.x = GRAIN_R; g.vx = Math.abs(g.vx); } else if (g.x > lx - GRAIN_R) { g.x = lx - GRAIN_R; g.vx = -Math.abs(g.vx); }
          if (g.y < GRAIN_R) { g.y = GRAIN_R; g.vy = Math.abs(g.vy); } else if (g.y > HM - GRAIN_R) { g.y = HM - GRAIN_R; g.vy = -Math.abs(g.vy); }
        }
        for (let i = 0; i < P.length; i++) {
          const p = P[i];
          let x = p.x + p.vx * h, y = p.y + p.vy * h;
          if (p.out) { p.x = x; p.y = y; continue; }
          for (let k = 0; k < 6 && (x < 0 || x > lx); k++) {
            if (x < 0) x = -x;
            else { x = 2 * lx - x; if (live && st.flashes.length < 40) st.flashes.push({ y: K.clamp(y, 0, HM), a: 1 }); }
            J += 2 * Math.abs(p.vx); p.vx = -p.vx;
          }
          x = K.clamp(x, 0, lx);
          if (y < 0 && st.popped && x < LID) { p.out = true; p.x = x; p.y = y; continue; }   // escapes where the lid was
          for (let k = 0; k < 6 && (y < 0 || y > HM); k++) { y = y < 0 ? -y : 2 * HM - y; J += 2 * Math.abs(p.vy); p.vy = -p.vy; }
          p.x = x; p.y = K.clamp(y, 0, HM);
          if (g) {   // elastic collision of a small particle (mass 1) with the pollen grain (mass GRAIN_M)
            const dx = p.x - g.x, dy = p.y - g.y, d2 = dx * dx + dy * dy;
            if (d2 < R * R && d2 > 1e-12) {
              const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, u = (p.vx - g.vx) * nx + (p.vy - g.vy) * ny;
              if (u < 0) {
                const a = 2 * u * GRAIN_M / (1 + GRAIN_M), b = 2 * u / (1 + GRAIN_M);
                p.vx -= a * nx; p.vy -= a * ny; g.vx += b * nx; g.vy += b * ny;
              }
              p.x = g.x + nx * R; p.y = g.y + ny * R;
            }
          }
        }
        return J;
      }
      // pressure = momentum given to the walls per second per unit of wall, averaged over the last second
      function sample(dt, J) {
        const perim = 2 * (Lx() + HM) - (st.popped ? LID : 0);
        st.buf.push([dt, J / perim]);
        let sd = 0, sj = 0;
        for (let i = st.buf.length - 1; i >= 0; i--) { sd += st.buf[i][0]; sj += st.buf[i][1]; if (sd >= WINDOW) { st.buf.splice(0, i); break; } }
        st.pMeas = sd > 0 ? P_CAL * sj / sd : pIdeal();
      }
      function heatTo(Tn) {   // heater / cooler: particle speeds grow with the square root of the temperature in kelvin
        const f = Math.sqrt(Tn / st.T);
        st.parts.forEach(p => { p.vx *= f; p.vy *= f; });
        if (st.grain) { st.grain.vx *= f; st.grain.vy *= f; }
        st.T = Tn;
      }
      function prewarm() { st.buf = []; for (let i = 0; i < 60; i++) sample(0.02, move(0.02, false)); st.trace = []; st.flashes = []; }
      function step(dt) {
        if (dt <= 0) return;
        st.time += dt; st.pump = Math.max(0, st.pump - dt * 2.5);
        if (st.popped) st.lidAnim += dt;
        st.flashes.forEach(f => { f.a -= dt * 7; });
        st.flashes = st.flashes.filter(f => f.a > 0);
        if (st.T !== st.Ttarget) heatTo(st.T + K.clamp(st.Ttarget - st.T, -150 * dt, 150 * dt));   // the gas follows the slider at 150 K per second
        const n = st.grain ? 4 : 2;
        let J = 0;
        for (let k = 0; k < n; k++) J += move(dt / n, true);
        sample(dt, J);
        if (st.popped) {
          st.parts = st.parts.filter(p => !(p.out && p.y < -1.5));
          st.nIn = st.parts.reduce((s, p) => s + (p.out ? 0 : 1), 0);
        } else if (st.mode !== 'brown' && st.pMeas > P_LIMIT) { st.popped = true; st.lidAnim = 0; st.drag = null; }
        if (st.mode === 'free') setV(st.V + 2 * st.V * (st.pMeas / P_EXT - 1) * dt);   // piston moves until p balances the weight
        if (st.grain) {
          st.traceT += dt;
          if (st.traceT >= 0.04) { st.traceT = 0; st.trace.push([st.grain.x, st.grain.y]); if (st.trace.length > 600) st.trace.shift(); }
        }
      }
      function setMode(m) {
        st.mode = m; st.popped = false; st.lidAnim = 0; st.drag = null; st.pump = 0;
        st.T = st.Ttarget = T0; slT.set(T0); st.V = m === 'brown' ? V_BROWN : 1; slV.set(1); slN.set(N0);
        seed = 11; st.parts = []; setN(m === 'brown' ? N_BROWN : N0, false);
        st.grain = m === 'brown' ? { x: Lx() / 2, y: HM / 2, vx: 0, vy: 0 } : null;
        if (st.grain) st.parts.forEach(p => { while (Math.hypot(p.x - st.grain.x, p.y - st.grain.y) < GRAIN_R + SMALL_R) { p.x = rnd() * Lx(); p.y = rnd() * HM; } });
        prewarm(); showControls(); refresh();
      }
      function refresh() { updateOut(); draw(); }
      function updateOut() {
        outP.set(st.pMeas); outP.setColor(st.popped ? theme.warn : ''); outPi.set(pIdeal()); outV.set(st.V); outN.set(st.nIn);
        const tk = K.fmt(st.T, 0, lang) + ' K = ' + K.fmt(Math.round(st.T - 273.15) + 0, 0, lang) + ' °C';
        outT.set({ en: tk, hr: tk });
        const key = st.popped ? 'popped' : st.mode;
        if (key !== st.noteKey) { st.noteKey = key; note.set(NOTES[key]); }
      }

      // ---------- drawing ----------
      function geom() {
        const w = cv.w, h = cv.h, chart = !!st.pts[st.mode];
        let sw = w, sh = h, gr = null;
        if (chart && w >= 640) { sw = Math.round(w * 0.56); gr = { x: sw + 8, y: 8, w: w - sw - 16, h: h - 16 }; }
        else if (chart) { sh = Math.round(h * 0.56); gr = { x: 8, y: sh + 2, w: w - 16, h: h - sh - 10 }; }
        const small = sw < 460, brown = st.mode === 'brown', colW = small ? 62 : 108, top = 36, bot = 40;
        const padL = brown ? 12 : small ? 42 : 58, rod = brown ? 12 : 34, len = (brown ? V_BROWN : V_STOP) * L0;   // room for the pump / weight and the piston rod
        const s = Math.max(40, Math.min((sw - padL - colW - rod) / len, (sh - top - bot) / HM));
        const bw = len * s, bh = HM * s;
        const x0 = padL + Math.max(0, (sw - padL - colW - rod - bw) / 2);
        const y0 = top + Math.max(0, (sh - top - bot - bh) / 2);
        return { sw, sh, gr, s, x0, y0, bw, bh, px: x0 + Lx() * s, colX: sw - colW, colW };
      }
      function caption() {
        const T = K.fmt(st.T, 0, lang) + ' K', V = K.fmt(st.V, 2, lang) + ' L', held = K.tr({ en: ' (held)', hr: ' (stalno)' }, lang);
        if (st.mode === 'squeeze') return 'T = ' + T + held + ' · V = ' + V;
        if (st.mode === 'heat') return 'V = ' + V + held + ' · T = ' + T;
        if (st.mode === 'free') return 'p = ' + K.fmt(P_EXT, 0, lang) + ' kPa' + held + ' · V = ' + V;
        if (st.mode === 'brown') return K.tr({ en: 'Pollen grain among ', hr: 'Zrnce peludi među ' }, lang) + st.nIn + K.tr({ en: ' particles', hr: ' čestica' }, lang);
        return 'N = ' + st.nIn + ' · T = ' + T + ' · V = ' + V;
      }
      function drawHeater(c, g) {
        const yb = g.y0 + g.bh, dir = Math.sign(st.Ttarget - st.T), hw = g.bw;
        c.fillStyle = dir > 0 ? theme.c8 : dir < 0 ? theme.c1 : theme.surface2; c.strokeStyle = theme.fg; c.lineWidth = 1.5;
        K.roundRect(c, g.x0, yb + 18, hw, 8, 3); c.fill(); c.stroke();
        const n = Math.max(3, Math.round(hw / 34));
        for (let i = 0; i < n && dir !== 0; i++) {
          const fx = g.x0 + hw * (i + 0.5) / n;
          if (dir > 0) {   // flames
            const fh = 11 + 4 * Math.sin(st.time * 9 + i * 1.7);
            c.fillStyle = i % 2 ? theme.c4 : theme.c2;
            c.beginPath(); c.moveTo(fx - 5, yb + 18); c.lineTo(fx, yb + 18 - fh); c.lineTo(fx + 5, yb + 18); c.closePath(); c.fill();
          } else {         // ice cubes
            c.fillStyle = theme.c1; K.roundRect(c, fx - 5, yb + 6, 10, 10, 2); c.fill();
            c.fillStyle = K.withAlpha('#ffffff', 0.55); c.fillRect(fx - 3, yb + 8, 3, 3);
          }
        }
        const lab = dir > 0 ? { en: 'heating…', hr: 'grijanje…' } : dir < 0 ? { en: 'cooling…', hr: 'hlađenje…' } : { en: 'heater / cooler', hr: 'grijač / hladilo' };
        K.text(c, K.tr(lab, lang), g.x0 + hw / 2, yb + 29, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
      }
      function drawPump(c, g) {
        const x = g.x0 - 30, top = g.y0 + g.bh * 0.38, bot = g.y0 + g.bh * 0.86, up = 16 * (1 - Math.abs(2 * st.pump - 1));
        c.strokeStyle = theme.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 6, bot - 4); c.lineTo(g.x0, bot - 4); c.stroke();        // hose
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 6, top); c.lineTo(x + 6, top - 10 - up); c.moveTo(x - 3, top - 10 - up); c.lineTo(x + 15, top - 10 - up); c.stroke();
        c.fillStyle = theme.surface2; K.roundRect(c, x, top, 12, bot - top, 3); c.fill(); c.stroke();
        K.text(c, K.tr({ en: 'pump', hr: 'pumpa' }, lang), x + 6, bot + 5, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
      }
      function drawWeight(c, g, xr, yc) {   // free piston: a rope over a fixed pulley and under a moving pulley carries the weight
        const yr = g.y0 - 13, xf = g.x0 - 12, xm = g.x0 - 24, ym = yr + 26 + (g.bw - Lx() * g.s) / 2;
        c.strokeStyle = theme.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(xr, yc); c.lineTo(xr, yr); c.stroke();
        c.beginPath(); c.moveTo(xm - 12, yr - 2); c.lineTo(xm, yr - 2); c.stroke();
        c.fillStyle = theme.surface2; c.strokeStyle = theme.fg; c.lineWidth = 1.5;
        [[xf, yr + 6], [xm, ym]].forEach(q => { c.beginPath(); c.arc(q[0], q[1], 6, 0, Math.PI * 2); c.fill(); c.stroke(); });
        c.beginPath(); c.moveTo(xr, yr); c.lineTo(xf, yr); c.arc(xf, yr + 6, 6, -Math.PI / 2, Math.PI, true); c.lineTo(xf - 6, ym);
        c.arc(xm, ym, 6, 0, Math.PI, false); c.lineTo(xm - 6, yr); c.moveTo(xm, ym); c.lineTo(xm, ym + 12); c.stroke();
        c.fillStyle = theme.muted; K.roundRect(c, xm - 12, ym + 12, 24, 18, 3); c.fill(); c.stroke();
        K.text(c, K.tr({ en: 'weight', hr: 'uteg' }, lang), xm, ym + 34, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
      }
      function drawGauge(c, x, y, r) {
        const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, ang = p => a0 + (a1 - a0) * K.clamp(p / P_DIAL, 0, 1);
        const pt = (p, rr) => [x + rr * Math.cos(ang(p)), y + rr * Math.sin(ang(p))];
        c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.strokeStyle = theme.warn; c.lineWidth = 4; c.beginPath(); c.arc(x, y, r - 5, ang(P_LIMIT), ang(P_DIAL)); c.stroke();
        c.strokeStyle = theme.muted; c.lineWidth = 1.5; c.beginPath();
        for (let p = 0; p <= P_DIAL; p += 100) { const a = pt(p, r - 9), b = pt(p, r - 2); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
        c.stroke();
        const id = pt(pIdeal(), r - 5);   // the ideal-gas prediction
        c.fillStyle = theme.c2; c.beginPath(); c.arc(id[0], id[1], 3.5, 0, Math.PI * 2); c.fill();
        const nd = pt(st.pMeas, r - 9);
        c.strokeStyle = theme.fg; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(nd[0], nd[1]); c.stroke(); c.lineCap = 'butt';
        c.fillStyle = theme.fg; c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill();
        K.text(c, K.fmt(st.pMeas, 0, lang) + ' kPa', x, y + r + 5, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
      }
      function drawThermo(c, x, top, bottom) {
        const tw = 10, br = 9, by = bottom + br - 2, yOf = T => bottom - (T - T_MIN) / (T_MAX - T_MIN) * (bottom - top);
        c.fillStyle = theme.surface; K.roundRect(c, x - tw / 2, top - 6, tw, bottom - top + 6, tw / 2); c.fill();
        c.beginPath(); c.arc(x, by, br, 0, Math.PI * 2); c.fill();
        c.fillStyle = mixColor(theme.c1, theme.c8, (st.T - T_MIN) / (T_MAX - T_MIN));
        c.fillRect(x - 2, yOf(st.T), 4, bottom - yOf(st.T) + 2); c.beginPath(); c.arc(x, by, br - 3, 0, Math.PI * 2); c.fill();
        c.strokeStyle = theme.muted; c.lineWidth = 1.5; K.roundRect(c, x - tw / 2, top - 6, tw, bottom - top + 6, tw / 2); c.stroke();
        c.beginPath(); c.arc(x, by, br, 0, Math.PI * 2); c.stroke();
        c.lineWidth = 1; c.beginPath();
        for (let T = T_MIN; T <= T_MAX; T += 100) { c.moveTo(x + tw / 2, yOf(T)); c.lineTo(x + tw / 2 + 5, yOf(T)); }
        c.stroke();
        K.text(c, K.fmt(st.T, 0, lang) + ' K', x, by + br + 4, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        K.text(c, K.fmt(Math.round(st.T - 273.15) + 0, 0, lang) + ' °C', x, by + br + 19, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
      }
      function drawChart(c, r) {
        const m = st.mode, cf = CHARTS[m], pts = st.pts[m];
        const ch = K.lineChart(c, { x: r.x, y: r.y, w: r.w, h: r.h, xMin: 0, xMax: cf.xMax, yMin: 0, yMax: cf.yMax, xTicks: cf.xTicks, yTicks: cf.yTicks, nice: false,
          yLabel: cf.yLabel, series: [], theme, lang });
        K.text(c, K.tr(cf.xLabel, lang), ch.px + ch.pw, ch.py + ch.ph + 15, { font: '11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
        // the ideal-gas law for the present gas: p = const/V, p = const·T or V = const·T
        const law = x => m === 'squeeze' ? pIdeal() * st.V / x : m === 'heat' ? pIdeal() * x / st.T : st.nIn * x / (300 * P_EXT);
        c.save(); c.beginPath(); c.rect(ch.px, ch.py, ch.pw, ch.ph); c.clip();
        c.strokeStyle = theme.c2; c.lineWidth = 2; c.setLineDash([6, 5]); c.beginPath();
        for (let i = m === 'squeeze' ? 2 : 0, first = true; i <= 80; i++, first = false) { const x = cf.xMax * i / 80, X = ch.sx(x), Y = ch.sy(law(x)); first ? c.moveTo(X, Y) : c.lineTo(X, Y); }
        c.stroke(); c.setLineDash([]);
        pts.forEach(q => { c.fillStyle = theme.c1; c.strokeStyle = theme.surface; c.lineWidth = 1.5; c.beginPath(); c.arc(ch.sx(q[0]), ch.sy(q[1]), 5, 0, Math.PI * 2); c.fill(); c.stroke(); });
        const cur = m === 'squeeze' ? [st.V, st.pMeas] : m === 'heat' ? [st.T, st.pMeas] : [st.T, st.V];
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.arc(ch.sx(cur[0]), ch.sy(cur[1]), 7, 0, Math.PI * 2); c.stroke();
        c.restore();
        // legend in the empty corner
        const rows = [{ en: 'recorded', hr: 'zabilježeno' }, { en: 'ideal gas', hr: 'idealni plin' }, { en: 'now', hr: 'sada' }];
        const font = '11px ' + theme.font, lx = ch.px + ch.pw - 8;
        let ly = m === 'squeeze' ? ch.py + 12 : ch.py + ch.ph - 12 - 15 * (rows.length - 1);
        rows.forEach((row, i) => {
          const txt = K.tr(row, lang); c.font = font;
          const sx = lx - c.measureText(txt).width - 12;
          K.text(c, txt, lx, ly, { font, color: theme.fg, align: 'right', baseline: 'middle' });
          if (i === 0) { c.fillStyle = theme.c1; c.beginPath(); c.arc(sx, ly, 4.5, 0, Math.PI * 2); c.fill(); }
          else if (i === 1) { c.strokeStyle = theme.c2; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(sx - 9, ly); c.lineTo(sx + 6, ly); c.stroke(); c.setLineDash([]); }
          else { c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.arc(sx, ly, 4.5, 0, Math.PI * 2); c.stroke(); }
          ly += 15;
        });
        if (!pts.length) K.text(c, K.tr({ en: 'Wait for the gauge to settle, then press Record', hr: 'Pričekaj da se manometar smiri pa pritisni Zabilježi' }, lang), ch.px + ch.pw / 2, ch.py + ch.ph / 2,
          { font: (ch.pw < 330 ? '10px ' : '12px ') + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h, g = geom(), m = st.mode, brown = m === 'brown';
        const s = g.s, x0 = g.x0, y0 = g.y0, bw = g.bw, bh = g.bh, px = g.px, lx = Lx(), yc = y0 + bh / 2;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        c.lineCap = 'butt'; c.lineJoin = 'round';
        if (!st.popped) K.text(c, caption(), 10, 13, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        drawHeater(c, g);
        c.fillStyle = K.withAlpha(theme.fg, theme.isDark ? 0.09 : 0.05); c.fillRect(x0, y0, px - x0, bh);
        // particles (Brownian mode uses the true scale so the collisions with the grain look right)
        const r = brown ? Math.max(1.6, SMALL_R * s) : K.clamp(s / 48, 2, 4.2);
        const kx = brown ? s : (lx * s - 2 * r - 5) / lx, ky = brown ? s : (bh - 2 * r) / HM, off = brown ? 0 : r;
        if (!brown || st.showSmall) {
          c.fillStyle = theme.c1; c.beginPath();
          st.parts.forEach(p => { const X = x0 + off + p.x * kx, Y = p.out ? y0 + p.y * s : y0 + off + p.y * ky; c.moveTo(X + r, Y); c.arc(X, Y, r, 0, Math.PI * 2); });
          c.fill();
        }
        if (st.grain) {
          const G = st.grain, gx = x0 + G.x * s, gy = y0 + G.y * s;
          if (st.trace.length > 1) {
            c.strokeStyle = theme.c2; c.lineWidth = 1.5; c.beginPath();
            st.trace.forEach((q, i) => { const X = x0 + q[0] * s, Y = y0 + q[1] * s; i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
            c.lineTo(gx, gy); c.stroke();
          }
          c.fillStyle = theme.c4; c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.arc(gx, gy, GRAIN_R * s, 0, Math.PI * 2); c.fill(); c.stroke();
        }
        // walls, lid, piston
        c.strokeStyle = theme.muted; c.lineWidth = 3;
        if (brown) c.strokeRect(x0, y0, lx * s, bh);
        else {
          c.beginPath(); c.moveTo(x0 + LID * s, y0); c.lineTo(x0 + bw, y0); c.moveTo(x0 + bw, y0 + bh); c.lineTo(x0, y0 + bh); c.lineTo(x0, y0); c.stroke();
          const k = st.popped ? Math.min(1, st.lidAnim * 3) : 0, lw = LID * s;
          c.save(); c.translate(x0 + lw / 2 + 12 * k, y0 - 22 * k); c.rotate(-0.45 * k);
          c.fillStyle = st.popped ? theme.warn : theme.fg; K.roundRect(c, -lw / 2 - 1, -3, lw + 2, 6, 3); c.fill(); c.fillRect(-4, -8, 8, 6);
          c.restore();
          st.flashes.forEach(f => { const fy = y0 + 4 + f.y * (bh - 8); c.strokeStyle = K.withAlpha(theme.fg, 0.7 * f.a); c.lineWidth = 2; c.beginPath(); c.moveTo(px - 8, fy); c.lineTo(px - 14, fy); c.stroke(); });
          c.fillStyle = theme.surface2; c.strokeStyle = theme.fg; c.lineWidth = 2; K.roundRect(c, px - 5, y0 + 2, 10, bh - 4, 3); c.fill(); c.stroke();
          const xr = px + 27;
          c.strokeStyle = theme.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(px + 5, yc); c.lineTo(xr, yc); c.stroke();
          if (m === 'free') drawWeight(c, g, xr, yc);
          else if (m === 'heat') {
            c.fillStyle = theme.fg; c.fillRect(px - 2, y0 - 8, 4, 10); c.fillRect(px - 2, y0 + bh - 2, 4, 10);
            K.text(c, K.tr({ en: 'locked', hr: 'učvršćen' }, lang), px + 9, yc - 12, { font: '10px ' + theme.font, color: theme.muted, baseline: 'middle' });
          } else {
            c.fillStyle = canMove() ? theme.accent : theme.muted; c.beginPath(); c.arc(xr, yc, 8, 0, Math.PI * 2); c.fill();
            if (canMove()) K.text(c, '↔', xr, yc - 17, { font: 'bold 15px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
          }
          if (m === 'explore') drawPump(c, g);
        }
        // instruments: pressure gauge and thermometer
        const ix = g.colX + g.colW / 2, ir = Math.min(g.colW / 2 - 8, 40, g.sh * 0.2), iy = 14 + ir;
        drawGauge(c, ix, iy, ir);
        if (g.colW > 100) {
          c.fillStyle = theme.c2; c.beginPath(); c.arc(ix - 34, iy + ir + 29, 3.5, 0, Math.PI * 2); c.fill();
          K.text(c, K.tr({ en: 'ideal: ', hr: 'idealno: ' }, lang) + K.fmt(pIdeal(), 0, lang), ix - 27, iy + ir + 29, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
        }
        if (g.sh - 52 - (iy + ir + 46) > 28) drawThermo(c, ix, iy + ir + 46, g.sh - 52);
        if (st.popped) {
          const msg = K.tr({ en: 'The lid popped! Press Reset.', hr: 'Poklopac je odletio! Pritisni Vrati.' }, lang), font = 'bold 13px ' + theme.font;
          c.font = font;
          const tw = c.measureText(msg).width + 20, bx = Math.max(4, x0 + bw / 2 - tw / 2);
          c.fillStyle = theme.surface; c.strokeStyle = theme.warn; c.lineWidth = 2; K.roundRect(c, bx, yc - 15, tw, 30, 8); c.fill(); c.stroke();
          K.text(c, msg, bx + tw / 2, yc, { font, color: theme.fg, align: 'center', baseline: 'middle' });
        }
        if (g.gr) drawChart(c, g.gr);
      }

      // ---------- pointer: drag the piston, click the pump ----------
      function hit(pt, g) {
        if (canMove() && pt.y > g.y0 - 6 && pt.y < g.y0 + g.bh + 6 && pt.x > g.px - 16 && pt.x < g.px + 42) return 'piston';
        if (st.mode === 'explore' && !st.popped && pt.x > g.x0 - 46 && pt.x < g.x0 - 4 && pt.y > g.y0 && pt.y < g.y0 + g.bh + 18) return 'pump';
        return '';
      }
      function onDown(ev) {
        const pt = cv.pointer(ev), g = geom(), what = hit(pt, g);
        if (what === 'piston') { st.drag = pt.x - g.px; try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic pointer */ } }
        else if (what === 'pump') slN.set(Math.min(N_MAX, st.parts.length + 10), true);
      }
      function onMove(ev) {
        const pt = cv.pointer(ev), g = geom();
        if (st.drag !== null && canMove()) {
          const v = K.clamp(Math.round((pt.x - st.drag - g.x0) / (g.s * L0) * 100) / 100, V_MIN, V_MAX);
          setV(v); slV.set(v);
          if (!L.running) refresh();
        } else { const what = hit(pt, g); cv.canvas.style.cursor = what === 'piston' ? 'ew-resize' : what === 'pump' ? 'pointer' : ''; }
      }
      function onUp() { st.drag = null; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);

      // ---------- lifecycle ----------
      function reset() {
        st.pts = { squeeze: [], heat: [], free: [] }; st.showSmall = true; tgSmall.set(true); segMode.set('explore'); setMode('explore');
        if (ctx.reducedMotion) L.stop(); else L.start();
        updatePlay();
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() {
          L.destroy();
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          cv.canvas.removeEventListener('pointerup', onUp); cv.canvas.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; refresh(); },
        reset
      };
    }
  });
})();
