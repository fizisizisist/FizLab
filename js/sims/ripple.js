/* FizLab sim: Ripple tank — top view of water waves computed from the 2-D wave equation on a 140 × 90 grid (leapfrog scheme,
   hidden damped border): one source, two sources (interference), wall with a gap (diffraction), reflection from a slanted wall and
   shallow water (refraction). Below the tank: side view of the water surface along the middle row. */
(function () {
  'use strict';
  const K = window.SimKit;
  const NX = 140, NY = 90;    // visible cells
  const PAD = 26;             // hidden border cells on every side: a damping zone that swallows outgoing waves
  const GX = NX + 2 * PAD, GY = NY + 2 * PAD, GN = GX * GY;
  const DX = 0.5;             // cm per cell: the tank is 70 cm × 45 cm
  const V = 24;               // cm/s: wave speed in the deep water
  const SLOW = 0.6;           // speed factor in the shallow region
  const COUR = 0.6;           // Courant number v·dt/dx (the 2-D leapfrog scheme is stable below 0.707)
  const DT = COUR * DX / V;   // s of simulated time per step (0.0125 s)
  const RATE = 1 / DT;        // steps per second of real time
  const SRC_X = 3;            // column of the straight paddle that makes plane waves (its backward wave dies in the hidden border)
  const BAR_X = 60, PIV_X = 96, BND_X = 64, MID = NY / 2;   // barrier, pivot of the mirror wall, shallow-water boundary, middle row
  const DEG = Math.PI / 180;
  const PLAY = { en: 'Play', hr: 'Pokreni' }, PAUSE = { en: 'Pause', hr: 'Pauza' };
  const NOTES = {
    one: { en: 'Each dip of the source sends out a circular wave. The distance between two neighbouring crests is the wavelength λ. Wave speed v = λ · f, so a higher frequency gives a shorter wavelength: λ = v / f.',
      hr: 'Svaki uron izvora šalje kružni val. Udaljenost dvaju susjednih brjegova je valna duljina λ. Brzina vala v = λ · f, pa veća frekvencija daje kraću valnu duljinu: λ = v / f.' },
    two: { en: 'Interference: where a crest meets a crest the waves add up (strong waves); where a crest meets a trough they cancel and the water stays calm. The calm places form lines (dashed).',
      hr: 'Interferencija: gdje se brijeg sretne s brijegom valovi se zbrajaju (jaki valovi), a gdje se brijeg sretne s dolom poništavaju se i voda miruje. Mirna mjesta čine linije (crtkano).' },
    gap: { en: 'Diffraction: behind the gap the wave spreads into the "shadow" of the wall. The spreading is strongest when the gap is about one wavelength wide; a wide gap lets an almost straight beam through.',
      hr: 'Ogib: iza otvora val se širi i u „sjenu” zida. Širenje je najjače kad je otvor širok otprilike jednu valnu duljinu; kroz širok otvor prolazi gotovo ravan snop.' },
    reflect: { en: 'Reflection: waves bounce off a wall just as light bounces off a mirror: the angle of reflection equals the angle of incidence (both are measured from the normal, the dashed line).',
      hr: 'Odbijanje: valovi se od zida odbijaju kao svjetlost od zrcala: kut odbijanja jednak je upadnom kutu (oba se mjere od okomice, crtkane linije).' },
    shallow: { en: 'Refraction: in shallow water the wave is slower (here 0.6 times). The frequency stays the same, so the wavelength gets shorter and the wavefronts turn towards the normal, just like light entering glass.',
      hr: 'Lom: u plitkoj vodi val je sporiji (ovdje 0,6 puta). Frekvencija ostaje ista, pa je valna duljina kraća, a valne fronte zakreću prema okomici, baš kao svjetlost pri ulasku u staklo.' }
  };

  window.Sims.register({
    id: 'ripple',
    title: { en: 'Ripple Tank', hr: 'Valovi na vodi' },
    summary: {
      en: 'Look at water waves from above: make circular waves, let two sources interfere, send waves through a gap, bounce them off a wall and slow them down in shallow water.',
      hr: 'Promatraj valove na vodi odozgo: stvori kružne valove, pusti da dva izvora interferiraju, pošalji valove kroz otvor, odbij ih od zida i uspori u plitkoj vodi.'
    },
    tasks: [
      { en: 'One source: double the frequency from 2 Hz to 4 Hz. What happens to the wavelength? Check λ = v / f.', hr: 'Jedan izvor: udvostruči frekvenciju s 2 Hz na 4 Hz. Što se događa s valnom duljinom? Provjeri λ = v / f.' },
      { en: 'Two sources: find the lines where the water stays calm. Move the sources apart: do you get more or fewer lines of calm?', hr: 'Dva izvora: nađi linije na kojima voda miruje. Razmakni izvore: ima li linija mira više ili manje?' },
      { en: 'Wall with a gap: compare a gap of 4 cm with a gap of 20 cm. When does the wave spread out most behind the wall?', hr: 'Zid s otvorom: usporedi otvor od 4 cm s otvorom od 20 cm. Kada se val iza zida najviše širi?' },
      { en: 'Shallow water: watch the side view. Where are the crests closer together, and what stays the same on both sides?', hr: 'Plitka voda: promatraj pogled sa strane. Gdje su brjegovi bliže jedan drugome i što ostaje isto s obje strane?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 1.42, minHeight: 300, maxHeight: 560 });
      const C = K.controls(container, lang);
      const st = { mode: 'one', f: 3, amp: 3, sep: 12, nodal: true, gap: 8, ang: 30, slow: false, t: 0, phase: 0, sx: NX / 2, sy: MID, drag: false };
      const T = o => K.tr(o, lang), F = (v, d) => K.fmt(v, d, lang);
      // wave field (mm) at three time levels, per-cell coefficients, off-screen picture
      let cur = new Float32Array(GN), prev = new Float32Array(GN), next = new Float32Array(GN), acc = 0;
      const cA = new Float32Array(GN), cB = new Float32Array(GN), c2 = new Float32Array(GN), edge = new Float32Array(GN), win = new Float32Array(GY);
      const off = document.createElement('canvas'); off.width = NX; off.height = NY;
      const og = off.getContext('2d'), img = og.createImageData(NX, NY), pix = img.data, lut = new Uint8ClampedArray(768);

      // ---------- controls ----------
      C.segmented({ label: { en: 'Mode', hr: 'Način rada' }, options: [
        { value: 'one', label: { en: 'One source', hr: 'Jedan izvor' } }, { value: 'two', label: { en: 'Two sources', hr: 'Dva izvora' } },
        { value: 'gap', label: { en: 'Wall with a gap', hr: 'Zid s otvorom' } }, { value: 'reflect', label: { en: 'Reflection', hr: 'Odbijanje' } },
        { value: 'shallow', label: { en: 'Shallow water', hr: 'Plitka voda' } }], value: 'one', onChange: setMode });
      const slF = C.slider({ label: { en: 'Frequency f', hr: 'Frekvencija f' }, min: 1, max: 6, step: 0.5, value: 3, unit: 'Hz', digits: 1, onChange: v => { st.f = v; refresh(); } });
      const slAmp = C.slider({ label: { en: 'Amplitude', hr: 'Amplituda' }, min: 1, max: 5, step: 0.5, value: 3, unit: 'mm', digits: 1, onChange: v => { st.amp = v; } });
      const slSep = C.slider({ label: { en: 'Distance between the sources', hr: 'Razmak izvora' }, min: 4, max: 30, step: 1, value: 12, unit: 'cm', digits: 0, onChange: v => { st.sep = v; refresh(); } });
      const tgNodal = C.toggle({ label: { en: 'Show the lines of calm', hr: 'Pokaži linije mira' }, value: true, onChange: v => { st.nodal = v; refresh(); } });
      const slGap = C.slider({ label: { en: 'Gap width', hr: 'Širina otvora' }, min: 2, max: 24, step: 1, value: 8, unit: 'cm', digits: 0, onChange: v => { st.gap = v; rebuild(false); refresh(); } });
      const slAng = C.slider({ label: { en: 'Angle of incidence', hr: 'Upadni kut' }, min: 10, max: 55, step: 1, value: 30, unit: '°', digits: 0, onChange: v => { st.ang = v; rebuild(true); refresh(); } });
      const tgSlow = C.toggle({ label: { en: 'Slow motion (4× slower)', hr: 'Usporeno (4× sporije)' }, value: false, onChange: setSlow });
      const btnPlay = C.button({ label: PLAY, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const outF = C.readout({ label: { en: 'Frequency f', hr: 'Frekvencija f' }, unit: 'Hz', digits: 1 });
      const outV = C.readout({ label: { en: 'Wave speed v', hr: 'Brzina vala v' }, unit: 'cm/s', digits: 1 });
      const outL = C.readout({ label: { en: 'Wavelength λ = v / f', hr: 'Valna duljina λ = v / f' }, unit: 'cm', digits: 1 });
      const outL2 = C.readout({ label: { en: 'Wavelength in the shallow water', hr: 'Valna duljina u plitkoj vodi' }, unit: 'cm', digits: 1 });
      const note = C.note({ text: NOTES.one });
      const GROUPS = { one: [], two: [slSep, tgNodal], gap: [slGap], reflect: [slAng], shallow: [slAng, outL2] };

      function fieldOf(c) { const e = c.el; return (e.classList.contains('sk-field') || e.classList.contains('sk-note')) ? e : e.parentElement; }
      function applyMode() { [slSep, tgNodal, slGap, slAng, outL2].forEach(c => { fieldOf(c).style.display = GROUPS[st.mode].indexOf(c) >= 0 ? '' : 'none'; }); }
      function updatePlay() { btnPlay.setLabel(L.running ? PAUSE : PLAY); }
      function updateOut() { outF.set(st.f); outV.set(V); outL.set(V / st.f); outL2.set(SLOW * V / st.f); note.set(NOTES[st.mode]); }
      function refresh() { updateOut(); if (!L.running) draw(); }
      function setMode(v) { st.mode = v; st.drag = false; applyMode(); rebuild(true); warmUp(); refresh(); }
      function setSlow(v) { // a smaller time step: rescale the stored "velocity" (cur − prev) so the motion continues smoothly
        v = !!v; if (v === st.slow) return;
        const k = v ? 0.25 : 4;
        for (let i = 0; i < GN; i++) prev[i] = cur[i] - (cur[i] - prev[i]) * k;
        st.slow = v; rebuild(false);
      }
      function reset() {
        st.f = 3; st.amp = 3; st.sep = 12; st.nodal = true; st.gap = 8; st.ang = 30; st.slow = false; st.sx = NX / 2; st.sy = MID; st.drag = false;
        slF.set(3); slAmp.set(3); slSep.set(12); tgNodal.set(true); slGap.set(8); slAng.set(30); tgSlow.set(false);
        rebuild(true); warmUp(); acc = 0;
        if (!ctx.reducedMotion) L.start();
        updatePlay(); refresh();
      }

      // ---------- geometry of walls and of the shallow region (cell coordinates) ----------
      function wallGeom() { // slanted mirror wall: normal n points back towards the paddle and up, t runs along the wall
        const th = st.ang * DEG, hl = Math.min(38 / Math.cos(th), 50);
        return { th, hl, nx: -Math.cos(th), ny: -Math.sin(th), tx: Math.sin(th), ty: -Math.cos(th) };
      }
      function isWall(x, y) {
        if (st.mode === 'gap') return x >= BAR_X && x <= BAR_X + 2 && Math.abs(y + 0.5 - MID) > st.gap / DX / 2;
        if (st.mode !== 'reflect') return false;
        const W = wallGeom(), rx = x - PIV_X, ry = y - MID, along = K.clamp(rx * W.tx + ry * W.ty, -W.hl, W.hl);
        return Math.hypot(rx - along * W.tx, ry - along * W.ty) <= 1.3;
      }
      function isShallow(x, y) { const th = st.ang * DEG; return st.mode === 'shallow' && (x - BND_X) * Math.cos(th) + (y - MID) * Math.sin(th) > 0; }
      function rebuild(clear) { // per-cell coefficients of  next = cA·(2·cur + c2·laplacian) − cB·prev  (x, y: visible cell, may lie in the border)
        const r = st.slow ? 0.25 : 1, C2 = COUR * COUR * r * r, beam = st.mode !== 'gap';
        for (let gy = 0; gy < GY; gy++) {
          const y = gy - PAD, dy = Math.abs(y + 0.5 - MID);
          win[gy] = !beam ? 1 : dy < 16 ? 1 : dy < 26 ? Math.pow(Math.cos((dy - 16) / 10 * Math.PI / 2), 2) : 0;   // a wide beam with soft ends
          for (let gx = 0; gx < GX; gx++) {
            const x = gx - PAD, i = gy * GX + gx;
            let d = Math.min(gy, GY - 1 - gy);
            if (!beam && x < BAR_X - 1) d = PAD;           // before the barrier the side walls are mirrors, so the wave stays straight
            d = Math.min(d, gx, GX - 1 - gx);
            const s = (0.0006 + (d < PAD ? 0.16 * Math.pow((PAD - d) / PAD, 2) : 0)) * r;
            if (isWall(x, y)) { cA[i] = 0; cB[i] = 0; cur[i] = 0; prev[i] = 0; }
            else { cA[i] = 1 / (1 + s); cB[i] = (1 - s) / (1 + s); }
            c2[i] = isShallow(x, y) ? C2 * SLOW * SLOW : C2;
            const cl = Math.sqrt(c2[i]); edge[i] = d < PAD ? (cl - 1) / (cl + 1) : 2;   // outer rim: lets waves leave, or mirrors them (2)
          }
        }
        if (clear) { cur.fill(0); prev.fill(0); next.fill(0); st.t = 0; st.phase = 0; }
      }

      // ---------- the wave equation: one leapfrog step ----------
      function dip(a, cx, cy, val) { // the dipper pushes a small disc of water up and down
        const x0 = Math.round(cx) + PAD, y0 = Math.round(cy) + PAD;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) a[(y0 + dy) * GX + x0 + dx] = val;
      }
      function rim(u, n, i, j) { // outermost cell i with inner neighbour j: let the wave leave (one-way wave condition) or mirror it
        n[i] = edge[i] > 1 ? n[j] : u[j] + edge[i] * (n[j] - u[i]);
      }
      function stepSim() {
        const u = cur, p = prev, n = next, r = st.slow ? 0.25 : 1, dt = DT * r;
        for (let y = 1; y < GY - 1; y++) {
          let i = y * GX + 1;
          for (let x = 1; x < GX - 1; x++, i++) n[i] = cA[i] * (2 * u[i] + c2[i] * (u[i - 1] + u[i + 1] + u[i - GX] + u[i + GX] - 4 * u[i])) - cB[i] * p[i];
        }
        st.t += dt; st.phase += 2 * Math.PI * st.f * dt;
        const m = st.mode, ramp = Math.min(1, st.t / 0.4);
        if (m === 'one') dip(n, st.sx, st.sy, st.amp * ramp * Math.sin(st.phase));
        else if (m === 'two') { const v = st.amp * ramp * Math.sin(st.phase), o = st.sep / DX / 2; dip(n, NX / 2, MID - o, v); dip(n, NX / 2, MID + o - 1, v); }
        else { // straight paddle: a soft source that lets reflected waves pass through it
          let env = ramp, ph = st.phase;
          if (m === 'reflect') { const len = 3 / st.f, tau = st.t % (len + 2.8); ph = 2 * Math.PI * st.f * tau; env = tau < len ? Math.pow(Math.sin(Math.PI * tau / len), 2) : 0; }   // short wave trains
          const drive = 2 * COUR * r * (0.8 * st.amp) * (2 * Math.PI * st.f * dt) * env * Math.cos(ph);
          if (drive !== 0) for (let y = 1; y < GY - 1; y++) n[y * GX + PAD + SRC_X] += drive * win[y];
        }
        for (let x = 0; x < GX; x++) { rim(u, n, x, x + GX); rim(u, n, GN - GX + x, GN - 2 * GX + x); }
        for (let y = 0; y < GY; y++) { rim(u, n, y * GX, y * GX + 1); rim(u, n, y * GX + GX - 1, y * GX + GX - 2); }
        prev = u; cur = n; next = p;
      }
      function warmUp() { for (let i = 0; i < 110; i++) stepSim(); }   // so that the very first picture already shows waves
      function poke(cx, cy) { // a finger tap: a small bump that spreads as a ring
        const x0 = Math.round(cx), y0 = Math.round(cy);
        for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
          const x = x0 + dx, y = y0 + dy, i = (y + PAD) * GX + x + PAD;
          if (x < 0 || x > NX - 1 || y < 0 || y > NY - 1 || cA[i] === 0) continue;
          const b = 3 * Math.exp(-(dx * dx + dy * dy) / 5); cur[i] += b; prev[i] += b;
        }
      }

      // ---------- picture of the water ----------
      function rgbOf(c) { const m = /\(([^)]+)\)/.exec(K.withAlpha(c, 1)), p = m ? m[1].split(',').map(Number) : []; return [p[0] || 0, p[1] || 0, p[2] || 0]; }
      function buildLut() { // troughs dark, still water in the theme's water colour, crests light
        const mid = rgbOf(theme.water), base = rgbOf(theme.c1), dk = theme.isDark;
        const crest = mid.map(v => v + (255 - v) * (dk ? 0.82 : 0.92)), trough = base.map(v => v * (dk ? 0.22 : 0.55));
        for (let i = 0; i < 256; i++) {
          const t = i / 255, a = t < 0.5 ? trough : mid, b = t < 0.5 ? mid : crest, k = t < 0.5 ? t * 2 : t * 2 - 1;
          for (let c = 0; c < 3; c++) lut[i * 3 + c] = a[c] + (b[c] - a[c]) * k;
        }
      }
      function render() { // the visible window of the grid → colours
        const u = cur;
        for (let y = 0, j = 0; y < NY; y++) {
          let i = (y + PAD) * GX + PAD;
          for (let x = 0; x < NX; x++, i++, j += 4) {
            const v = u[i] * 1.1, k = (((v / (1 + (v < 0 ? -v : v))) * 127 + 128) | 0) * 3;   // soft clip, then look up the colour
            pix[j] = lut[k]; pix[j + 1] = lut[k + 1]; pix[j + 2] = lut[k + 2]; pix[j + 3] = 255;
          }
        }
        og.putImageData(img, 0, 0);
      }
      function layout() {
        const w = cv.w, h = cv.h, sh = K.clamp(h * 0.16, 44, 70), tw = Math.min(w - 16, (h - sh - 40) * NX / NY), th = tw * NY / NX;
        return { w, h, tw, th, tx: Math.round((w - tw) / 2), ty: 8, sy: 8 + th + 22, sh, ppc: tw / (NX * DX) };   // ppc: pixels per cm
      }
      function tag(g, str, x, y, align) { // label on a small card, readable over the waves
        const font = 'bold 11px ' + theme.font;
        g.save(); g.font = font; const tw = g.measureText(str).width + 10, x0 = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
        g.fillStyle = K.withAlpha(theme.surface, 0.88); K.roundRect(g, x0, y - 9, tw, 18, 5); g.fill(); g.restore();
        K.text(g, str, x0 + 5, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function dashed(g, x1, y1, x2, y2) { g.save(); g.setLineDash([6, 5]); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore(); }
      function bracket(g, x1, y1, x2, y2) { // measuring bracket with end ticks (horizontal or vertical)
        const hz = Math.abs(y2 - y1) < 0.5;
        g.save(); g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2);
        if (hz) { g.moveTo(x1, y1 - 5); g.lineTo(x1, y1 + 5); g.moveTo(x2, y2 - 5); g.lineTo(x2, y2 + 5); } else { g.moveTo(x1 - 5, y1); g.lineTo(x1 + 5, y1); g.moveTo(x2 - 5, y2); g.lineTo(x2 + 5, y2); }
        g.stroke(); g.restore();
      }
      function dipper(g, x, y) { g.save(); g.fillStyle = theme.c2; g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, 5.5, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore(); }
      function angleMark(g, cx, cy, r, a0, a1, label) { // small arc between two directions with a letter
        let d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        g.save(); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, cy, r, a0, a0 + d, d < 0); g.stroke(); g.restore();
        K.text(g, label, cx + Math.cos(a0 + d / 2) * (r + 11), cy + Math.sin(a0 + d / 2) * (r + 11), { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function paddle(g, X, Y) {
        g.save(); g.strokeStyle = theme.c2; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath();
        if (st.mode === 'gap') { g.moveTo(X(SRC_X), Y(-2)); g.lineTo(X(SRC_X), Y(NY + 1)); } else { g.moveTo(X(SRC_X), Y(MID - 22)); g.lineTo(X(SRC_X), Y(MID + 21)); }
        g.stroke(); g.restore();
      }
      function overlays(g, Q) { // everything drawn on top of the water, in tank coordinates
        const { tx, ty, tw, th, ppc } = Q, X = c => tx + (c + 0.5) / NX * tw, Y = c => ty + (c + 0.5) / NY * th, cell = tw / NX;
        const lam = V / st.f, m = st.mode, cyp = Y(MID - 0.5), far = tw + th;
        g.save(); g.beginPath(); g.rect(tx, ty, tw, th); g.clip();
        if (m === 'one') {
          const sx = X(st.sx), sy = Y(st.sy), dir = sx + (6 + lam) * ppc > tx + tw - 8 ? -1 : 1, x1 = sx + dir * 6 * ppc, x2 = x1 + dir * lam * ppc, yb = sy - Math.max(16, 3 * ppc) * (sy < ty + 60 ? -1 : 1);
          dipper(g, sx, sy); bracket(g, x1, yb, x2, yb);
          tag(g, 'λ = ' + F(lam, 1) + ' cm', (x1 + x2) / 2, yb + (yb < sy ? -15 : 15), 'center');
        } else if (m === 'two') {
          const cxp = X(NX / 2), o = st.sep / DX / 2, a0 = st.sep / 2;
          if (st.nodal) { // calm lines: path difference = (k + ½)·λ, i.e. hyperbolas with the sources as foci
            let lines = 0;
            g.save(); g.setLineDash([6, 5]); g.strokeStyle = theme.fg; g.lineWidth = 1.6; g.beginPath();
            for (let k = 0; k < 4; k++) {
              const a = (k + 0.5) * lam / 2; if (a >= a0 - 0.05) break;
              lines++;
              const b = Math.sqrt(a0 * a0 - a * a), S = Math.asinh(40 / b);
              for (let sg = -1; sg <= 1; sg += 2) for (let i = 0; i <= 40; i++) {
                const s = -S + 2 * S * i / 40, px = cxp + b * Math.sinh(s) * ppc, py = cyp + sg * a * Math.cosh(s) * ppc;
                if (i) g.lineTo(px, py); else g.moveTo(px, py);
              }
            }
            g.stroke(); g.restore();
            tag(g, T(lines ? { en: 'dashed: lines of calm', hr: 'crtkano: linije mira' } : { en: 'no line of calm: the sources are closer than λ/2', hr: 'nema linije mira: izvori su bliže od λ/2' }), tx + tw - 8, ty + th - 16, 'right');
          }
          dipper(g, X(NX / 2), Y(MID - o)); dipper(g, X(NX / 2), Y(MID + o - 1));
        } else if (m === 'gap') {
          const half = st.gap / DX / 2, x0 = X(BAR_X - 0.5), bw = 3 * cell, y1 = ty + (MID - half) / NY * th, y2 = ty + (MID + half) / NY * th;
          g.fillStyle = theme.fg; g.fillRect(x0, ty, bw, y1 - ty); g.fillRect(x0, y2, bw, ty + th - y2);
          paddle(g, X, Y); bracket(g, x0 - 9, y1, x0 - 9, y2);
          tag(g, T({ en: 'gap ', hr: 'otvor ' }) + F(st.gap, 0) + ' cm = ' + F(st.gap / lam, 1) + ' λ', x0 - 18, cyp, 'right');
        } else if (m === 'reflect') {
          const W = wallGeom(), px = X(PIV_X), py = Y(MID), L1 = W.hl * cell, rx = -Math.cos(2 * W.th), ry = -Math.sin(2 * W.th), len = Math.min(120, tw * 0.2);
          g.save(); g.strokeStyle = theme.fg; g.lineWidth = Math.max(4, 2.6 * cell); g.lineCap = 'round'; g.beginPath(); g.moveTo(px - W.tx * L1, py - W.ty * L1); g.lineTo(px + W.tx * L1, py + W.ty * L1); g.stroke(); g.restore();
          paddle(g, X, Y); dashed(g, px, py, px + W.nx * len * 1.15, py + W.ny * len * 1.15);
          K.arrow(g, px - len * 1.3, py, px - 8, py, { color: theme.fg, width: 3, head: 10 });
          K.arrow(g, px + rx * 8, py + ry * 8, px + rx * len * 1.3, py + ry * len * 1.3, { color: theme.fg, width: 3, head: 10 });
          const an = Math.atan2(W.ny, W.nx);
          angleMark(g, px, py, len * 0.5, an, Math.PI, 'α'); angleMark(g, px, py, len * 0.5, an, Math.atan2(ry, rx), 'β');
          tag(g, 'α = β = ' + F(st.ang, 0) + '°', tx + 8, ty + th - 16, 'left');
        } else {
          const th1 = st.ang * DEG, th2 = Math.asin(SLOW * Math.sin(th1)), nx = Math.cos(th1), ny = Math.sin(th1), bx = X(BND_X - 0.5), by = cyp, len = Math.min(110, tw * 0.18);
          g.fillStyle = K.withAlpha(theme.ground, 0.3); g.beginPath(); g.moveTo(bx + ny * far, by - nx * far); g.lineTo(bx - ny * far, by + nx * far); g.lineTo(bx - ny * far + nx * far, by + nx * far + ny * far); g.lineTo(bx + ny * far + nx * far, by - nx * far + ny * far); g.closePath(); g.fill();
          g.save(); g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(bx + ny * far, by - nx * far); g.lineTo(bx - ny * far, by + nx * far); g.stroke(); g.restore();
          paddle(g, X, Y); dashed(g, bx - nx * len, by - ny * len, bx + nx * len, by + ny * len);
          const rx = Math.cos(th1 - th2), ry = Math.sin(th1 - th2);
          K.arrow(g, bx - len * 1.3, by, bx - 6, by, { color: theme.fg, width: 3, head: 10 });
          K.arrow(g, bx + rx * 6, by + ry * 6, bx + rx * len * 1.3, by + ry * len * 1.3, { color: theme.fg, width: 3, head: 10 });
          angleMark(g, bx, by, len * 0.55, Math.atan2(-ny, -nx), Math.PI, 'α'); angleMark(g, bx, by, len * 0.55, Math.atan2(ny, nx), Math.atan2(ry, rx), 'β');
          tag(g, T({ en: 'deep: ', hr: 'duboko: ' }) + F(V, 1) + ' cm/s, λ = ' + F(lam, 1) + ' cm', tx + 8, ty + th - 16, 'left');
          tag(g, T({ en: 'shallow: ', hr: 'plitko: ' }) + F(V * SLOW, 1) + ' cm/s, λ = ' + F(lam * SLOW, 1) + ' cm', tx + tw - 8, ty + th - (tw < 520 ? 38 : 16), 'right');
          tag(g, 'α = ' + F(st.ang, 0) + '°,  β = ' + F(th2 / DEG, 1) + '°', tx + tw - 8, ty + 16, 'right');
        }
        tag(g, T(m === 'one' ? { en: 'top view · drag the source', hr: 'pogled odozgo · povuci izvor' } : { en: 'top view · tap the water', hr: 'pogled odozgo · dodirni vodu' }), tx + 8, ty + 16, 'left');
        g.restore();
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.strokeRect(tx, ty, tw, th);
        g.fillStyle = theme.fg; g.beginPath(); g.moveTo(tx - 1, cyp); g.lineTo(tx - 7, cyp - 4); g.lineTo(tx - 7, cyp + 4); g.closePath(); g.fill();   // marks of the middle row
        g.beginPath(); g.moveTo(tx + tw + 1, cyp); g.lineTo(tx + tw + 7, cyp - 4); g.lineTo(tx + tw + 7, cyp + 4); g.closePath(); g.fill();
      }
      function strip(g, Q) { // side view: height of the water along the middle row (heights are drawn much enlarged)
        const { tx, tw, sy, sh } = Q, base = sy + sh * 0.46, pmm = sh * 0.36 / 5, lim = sh * 0.42, row = ((MID | 0) + PAD) * GX + PAD, u = cur, m = st.mode;
        K.text(g, T({ en: 'Side view along the middle row; heights enlarged', hr: 'Pogled sa strane po srednjem redu; visine uvećane' }), tx, sy - 10, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
        g.save(); g.fillStyle = theme.surface; g.fillRect(tx, sy, tw, sh); g.beginPath(); g.rect(tx, sy, tw, sh); g.clip();
        for (let pass = 0; pass < 2; pass++) { // filled water, then the surface line
          g.beginPath(); if (!pass) g.moveTo(tx, sy + sh);
          for (let x = 0; x < NX; x++) {
            let d = u[row + x] * pmm; if (d > lim) d = lim; else if (d < -lim) d = -lim;
            const px = tx + (x + 0.5) / NX * tw; if (pass && !x) g.moveTo(px, base - d); else g.lineTo(px, base - d);
          }
          if (!pass) { g.lineTo(tx + tw, sy + sh); g.closePath(); g.fillStyle = K.withAlpha(theme.water, 0.8); g.fill(); } else { g.strokeStyle = theme.c1; g.lineWidth = 2; g.lineJoin = 'round'; g.stroke(); }
        }
        g.fillStyle = theme.ground; g.fillRect(tx, sy + sh - 5, tw, 5);
        if (m === 'shallow') g.fillRect(tx + BND_X / NX * tw, sy + sh * 0.74, tw, sh);                       // the raised floor
        if (m === 'reflect') { g.fillStyle = theme.fg; g.fillRect(tx + (PIV_X + 0.5) / NX * tw - 2, sy + 3, 4, sh); }   // the wall
        g.restore();
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.strokeRect(tx, sy, tw, sh);
      }
      function draw() {
        const g = cv.ctx, Q = layout();
        g.clearRect(0, 0, Q.w, Q.h); g.fillStyle = theme.sky; g.fillRect(0, 0, Q.w, Q.h);
        render(); g.imageSmoothingEnabled = true; g.drawImage(off, 0, 0, NX, NY, Q.tx, Q.ty, Q.tw, Q.th);
        overlays(g, Q); strip(g, Q);
      }

      // ---------- loop: a fixed number of steps per second, whatever the frame rate ----------
      const L = K.loop(dt => {
        acc += dt * RATE;
        let n = 0; while (acc >= 1 && n < 5) { stepSim(); acc -= 1; n++; }
        if (acc > 1) acc = 0;
        draw();
      });

      // ---------- pointer: drag the dipper, or tap the water ----------
      function cellAt(ev) { const p = cv.pointer(ev), Q = layout(); return { x: (p.x - Q.tx) / Q.tw * NX - 0.5, y: (p.y - Q.ty) / Q.th * NY - 0.5 }; }
      function moveSrc(c) { st.sx = K.clamp(Math.round(c.x), 3, NX - 4); st.sy = K.clamp(Math.round(c.y), 3, NY - 4); }
      function onDown(ev) {
        const c = cellAt(ev);
        if (c.x < 0 || c.x > NX - 1 || c.y < 0 || c.y > NY - 1) return;
        ev.preventDefault();
        if (st.mode === 'one') { st.drag = true; try { if (ev.pointerId !== undefined) cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ } moveSrc(c); }
        else poke(c.x, c.y);
        if (!L.running) draw();
      }
      function onMove(ev) { if (!st.drag) return; ev.preventDefault(); moveSrc(cellAt(ev)); if (!L.running) draw(); }
      function onUp() { st.drag = false; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      cv.canvas.style.cursor = 'pointer';

      cv.onResize(draw);
      buildLut(); applyMode(); reset();

      return {
        destroy() {
          L.destroy();
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; buildLut(); draw(); },
        reset
      };
    }
  });
})();
