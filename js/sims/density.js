/* FizLab sim: Float or sink? — density, weight and buoyant force (Archimedes) in a glass tank. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81;
  // world geometry in metres: tank interior, liquid depth, visible height above the table
  const TANK_W = 0.56, TANK_H = 0.5, LIQ_H = 0.36, WORLD_H = 0.8, START_Y = 0.6;
  const TIME_SCALE = 0.6; // slow motion so the drop is visible
  const MYSTERY_RHO = 850;

  function hexToRgb(hex) {
    let h = String(hex || '#888').trim().replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    if (Number.isNaN(n)) return [136, 136, 136];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')';
  }

  const LIQUIDS = [
    { id: 'water', rho: 1000, label: { en: 'Water', hr: 'Voda' }, tint: t => t.water },
    { id: 'sea', rho: 1025, label: { en: 'Sea water', hr: 'Morska voda' }, tint: t => mix(t.water, t.c1, 0.4) },
    { id: 'oil', rho: 920, label: { en: 'Sunflower oil', hr: 'Suncokretovo ulje' }, tint: t => K.withAlpha(t.c4, 0.55) },
    { id: 'honey', rho: 1420, label: { en: 'Honey', hr: 'Med' }, tint: t => K.withAlpha(t.c2, 0.6) },
    { id: 'alcohol', rho: 790, label: { en: 'Alcohol (ethanol)', hr: 'Alkohol (etanol)' }, tint: t => K.withAlpha(t.water, 0.45) },
    { id: 'mercury', rho: 13600, label: { en: 'Mercury', hr: 'Živa' }, tint: t => K.withAlpha(t.muted, 0.8) }
  ];
  const MATERIALS = [
    { id: 'styrofoam', rho: 50, label: { en: 'Styrofoam', hr: 'Stiropor' }, color: 'c5' },
    { id: 'cork', rho: 240, label: { en: 'Cork', hr: 'Pluto' }, color: 'c2' },
    { id: 'oak', rho: 700, label: { en: 'Oak wood', hr: 'Hrastovo drvo' }, color: 'c6' },
    { id: 'ice', rho: 917, label: { en: 'Ice', hr: 'Led' }, color: 'c1' },
    { id: 'pet', rho: 1380, label: { en: 'PET plastic', hr: 'PET plastika' }, color: 'c3' },
    { id: 'alu', rho: 2700, label: { en: 'Aluminium', hr: 'Aluminij' }, color: 'muted' },
    { id: 'iron', rho: 7870, label: { en: 'Iron', hr: 'Željezo' }, color: 'c8' },
    { id: 'gold', rho: 19300, label: { en: 'Gold', hr: 'Zlato' }, color: 'c4' },
    { id: 'mystery', rho: MYSTERY_RHO, label: { en: 'Mystery object', hr: 'Tajanstveni predmet' }, color: 'c7' }
  ];

  window.Sims.register({
    id: 'density',
    title: { en: 'Float or Sink?', hr: 'Pluta ili tone?' },
    summary: {
      en: 'Drop a cube of any material into water, oil, honey or mercury. Compare its density with the liquid and read the buoyant force.',
      hr: 'Pusti kocku od bilo kojeg materijala u vodu, ulje, med ili živu. Usporedi njezinu gustoću s tekućinom i pročitaj uzgon.'
    },
    tasks: [
      { en: 'Drop the oak cube into water. What part of it is under the surface? Compare with 700 / 1000.', hr: 'Pusti hrastovu kocku u vodu. Koliki je dio pod površinom? Usporedi sa 700 / 1000.' },
      { en: 'Find a liquid in which ice sinks, and one in which iron floats.', hr: 'Pronađi tekućinu u kojoj led tone i tekućinu u kojoj željezo pluta.' },
      { en: 'Change the volume. Does a bigger cube of the same material float deeper?', hr: 'Promijeni obujam. Pluta li veća kocka istog materijala dublje?' },
      { en: 'Mystery object: read its mass and volume, compute ρ = m / V, then press Reveal to check.', hr: 'Tajanstveni predmet: pročitaj masu i obujam, izračunaj ρ = m / V, pa pritisni Otkrij i provjeri.' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 480 });
      const C = K.controls(container, lang);

      const st = { liq: LIQUIDS[0], mat: MATERIALS[2], Vcm3: 1000, V: 0.001, a: 0.1, m: 0.7, rho: 700,
        x: TANK_W / 2, y: START_Y, v: 0, held: true, dragging: false, dragOff: { x: 0, y: 0 }, revealed: false };

      // ---------- controls ----------
      const selLiq = C.select({ label: { en: 'Liquid', hr: 'Tekućina' }, options: LIQUIDS.map(l => ({ value: l.id, label: l.label })), value: 'water',
        onChange: v => { st.liq = LIQUIDS.find(l => l.id === v) || LIQUIDS[0]; refresh(); } });
      const selMat = C.select({ label: { en: 'Material', hr: 'Materijal' }, options: MATERIALS.map(m => ({ value: m.id, label: m.label })), value: 'oak',
        onChange: v => { st.mat = MATERIALS.find(m => m.id === v) || MATERIALS[0]; st.revealed = false; btnReveal.setDisabled(st.mat.id !== 'mystery'); applySize(); refresh(); } });
      const slV = C.slider({ label: { en: 'Volume', hr: 'Obujam' }, min: 100, max: 2000, step: 50, value: 1000,
        format: (v, l) => K.fmt(v, 0, l) + ' cm³ = ' + K.fmt(v / 1000, 2, l) + ' L',
        onChange: v => { st.Vcm3 = v; applySize(); refresh(); } });
      const btnDrop = C.button({ label: { en: 'Drop', hr: 'Pusti' }, variant: 'primary', onClick: drop });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, onClick: () => { L.toggle(); updatePlay(); } });
      const btnReveal = C.button({ label: { en: 'Reveal density', hr: 'Otkrij gustoću' }, onClick: () => { st.revealed = true; updateOut(); draw(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: reset });
      const outRhoObj = C.readout({ label: { en: 'Object density', hr: 'Gustoća tijela' }, unit: 'kg/m³', digits: 0 });
      const outRhoLiq = C.readout({ label: { en: 'Liquid density', hr: 'Gustoća tekućine' }, unit: 'kg/m³', digits: 0 });
      const outM = C.readout({ label: { en: 'Mass', hr: 'Masa' }, unit: 'kg', digits: 3 });
      const outW = C.readout({ label: { en: 'Weight', hr: 'Težina' }, unit: 'N', digits: 2 });
      const outB = C.readout({ label: { en: 'Buoyant force', hr: 'Uzgon' }, unit: 'N', digits: 2 });
      const outFrac = C.readout({ label: { en: 'Under the surface', hr: 'Pod površinom' }, unit: '%', digits: 0 });
      const note = C.note({ text: { en: '', hr: '' } });

      // ---------- physics helpers ----------
      function applySize() {
        st.V = st.Vcm3 * 1e-6;
        st.a = Math.cbrt(st.V);
        st.rho = st.mat.rho;
        st.m = st.rho * st.V;
        st.x = K.clamp(st.x, st.a / 2, TANK_W - st.a / 2);
        st.y = K.clamp(st.y, 0, WORLD_H - st.a);
      }
      function submergedDepth() { return K.clamp(LIQ_H - st.y, 0, st.a); }
      function forces() {
        const d = submergedDepth();
        return { W: st.m * G, B: st.liq.rho * G * st.a * st.a * d, frac: st.a > 0 ? d / st.a : 0 };
      }
      function step(dt) {
        if (st.held) return;
        dt *= TIME_SCALE;
        const n = 10, h = dt / n;
        for (let i = 0; i < n; i++) {
          const d = submergedDepth();
          const B = st.liq.rho * G * st.a * st.a * d;
          let acc = (B - st.m * G) / st.m, gamma = 0;
          if (d > 0) {
            // near-critical damping around the floating equilibrium keeps even styrofoam-in-mercury stable
            const omega = Math.sqrt(st.liq.rho * G / (st.rho * st.a));
            gamma = K.clamp(2.2 * omega, 3, 0.6 / h);
          }
          st.v += (acc - gamma * st.v) * h;
          st.v = K.clamp(st.v, d > 0 ? -0.5 : -4, d > 0 ? 0.5 : 4); // viscous liquid: slow, visible sinking
          st.y += st.v * h;
          if (st.y <= 0) { st.y = 0; if (st.v < 0) st.v = 0; }
          if (st.y >= WORLD_H - st.a) { st.y = WORLD_H - st.a; if (st.v > 0) st.v = 0; }
        }
      }
      function drop() {
        if (!st.held) { st.x = TANK_W / 2; st.y = START_Y; }
        st.held = false; st.dragging = false; st.v = 0;
        if (!L.running) { L.start(); updatePlay(); }
      }
      function refresh() { updateOut(); draw(); }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function hidden() { return st.mat.id === 'mystery' && !st.revealed; }

      function updateOut() {
        const f = forces();
        outRhoObj.set(hidden() ? { en: '?', hr: '?' } : st.rho);
        outRhoLiq.set(st.liq.rho); outM.set(st.m); outW.set(f.W); outB.set(f.B); outFrac.set(f.frac * 100);
        const liqName = { en: K.tr(st.liq.label, 'en').toLowerCase(), hr: K.tr(st.liq.label, 'hr').toLowerCase() };
        if (hidden()) {
          note.set({ en: 'Mystery object: compute ρ = m / V from the readouts, or compare: the part under the surface equals ρ_object / ρ_liquid.',
            hr: 'Tajanstveni predmet: izračunaj ρ = m / V iz vrijednosti, ili usporedi: dio pod površinom jednak je ρ_tijela / ρ_tekućine.' });
        } else if (st.rho < st.liq.rho) {
          const pct = st.rho / st.liq.rho * 100;
          note.set({ en: 'Less dense than ' + liqName.en + ' → it floats. Buoyant force equals the weight, and ' + K.fmt(pct, 0, 'en') + ' % of the cube is under the surface.',
            hr: 'Manje gusto od tekućine (' + liqName.hr + ') → pluta. Uzgon je jednak težini, a ' + K.fmt(pct, 0, 'hr') + ' % kocke je pod površinom.' });
        } else {
          note.set({ en: 'Denser than ' + liqName.en + ' → it sinks. Even fully under the surface the buoyant force is smaller than the weight.',
            hr: 'Gušće od tekućine (' + liqName.hr + ') → tone. Ni potpuno uronjen uzgon nije veći od težine.' });
        }
      }

      // ---------- layout ----------
      function layout() {
        const w = cv.w, h = cv.h;
        const panel = w >= 640;
        const sceneW = panel ? Math.round(w * 0.6) : w;
        const groundY = h - 26, topPad = panel ? 14 : 40;
        const pxm = (groundY - topPad) / WORLD_H;
        const tankW = TANK_W * pxm, tankH = TANK_H * pxm;
        const tankX = Math.round(sceneW / 2 - tankW / 2) - 10;
        return { w, h, panel, sceneW, groundY, pxm, tankX, tankW, tankH, tankTop: groundY - tankH, tankBottom: groundY };
      }
      function cubeRect(Lo) {
        const s = st.a * Lo.pxm, cx = Lo.tankX + st.x * Lo.pxm, bottom = Lo.tankBottom - st.y * Lo.pxm;
        return { x: cx - s / 2, y: bottom - s, s };
      }
      function matColor() { return st.mat.color === 'muted' ? theme.muted : theme[st.mat.color]; }

      // ---------- pointer ----------
      function hit(p, r) { return p.x >= r.x - 8 && p.x <= r.x + r.s + 8 && p.y >= r.y - 8 && p.y <= r.y + r.s + 8; }
      function onDown(ev) {
        const p = cv.pointer(ev), Lo = layout(), r = cubeRect(Lo);
        if (!hit(p, r)) return;
        st.dragging = true; st.held = true; st.v = 0;
        st.dragOff.x = p.x - (r.x + r.s / 2); st.dragOff.y = p.y - (r.y + r.s / 2);
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault(); refresh();
      }
      function onMove(ev) {
        const p = cv.pointer(ev), Lo = layout();
        if (st.dragging) {
          const cx = p.x - st.dragOff.x, cy = p.y - st.dragOff.y;
          st.x = K.clamp((cx - Lo.tankX) / Lo.pxm, st.a / 2, TANK_W - st.a / 2);
          st.y = K.clamp((Lo.tankBottom - cy) / Lo.pxm - st.a / 2, 0, WORLD_H - st.a);
          refresh();
        } else {
          cv.canvas.style.cursor = hit(p, cubeRect(Lo)) ? 'grab' : 'default';
        }
      }
      function onUp() {
        if (!st.dragging) return;
        st.dragging = false; st.held = false; st.v = 0; cv.canvas.style.cursor = 'grab';
        if (!L.running) { L.start(); updatePlay(); }
      }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing ----------
      function draw() {
        const c = cv.ctx, Lo = layout(), w = Lo.w, h = Lo.h;
        c.clearRect(0, 0, w, h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        c.fillStyle = theme.ground; c.fillRect(0, Lo.groundY, Lo.sceneW, h - Lo.groundY);
        const tx = Lo.tankX, tw = Lo.tankW, tTop = Lo.tankTop, tBot = Lo.tankBottom;
        const liqTop = tBot - LIQ_H * Lo.pxm;
        // glass + liquid
        c.fillStyle = K.withAlpha(theme.fg, theme.isDark ? 0.07 : 0.04); c.fillRect(tx, tTop, tw, tBot - tTop);
        c.fillStyle = st.liq.tint(theme); c.fillRect(tx, liqTop, tw, tBot - liqTop);
        c.strokeStyle = K.withAlpha(theme.fg, 0.4); c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(tx, liqTop); c.lineTo(tx + tw, liqTop); c.stroke();
        // cube
        const r = cubeRect(Lo), col = matColor();
        c.fillStyle = col; K.roundRect(c, r.x, r.y, r.s, r.s, 3); c.fill();
        c.fillStyle = K.withAlpha('#ffffff', 0.25); K.roundRect(c, r.x + 3, r.y + 3, r.s - 6, Math.max(2, r.s * 0.3), 2); c.fill();
        // submerged part overlay (liquid in front of the cube)
        const subTop = Math.max(r.y, liqTop), subBot = Math.min(r.y + r.s, tBot);
        if (subBot > subTop) { c.save(); c.globalAlpha = 0.45; c.fillStyle = st.liq.tint(theme); c.fillRect(r.x - 1, subTop, r.s + 2, subBot - subTop); c.restore(); }
        c.strokeStyle = K.withAlpha(theme.fg, 0.5); c.lineWidth = 1; K.roundRect(c, r.x, r.y, r.s, r.s, 3); c.stroke();
        const matLabel = hidden() ? '?' : K.tr(st.mat.label, lang);
        if (r.s >= 44 || hidden()) K.text(c, hidden() ? '?' : matLabel, r.x + r.s / 2, r.y + r.s / 2, { font: 'bold ' + (hidden() ? Math.round(r.s * 0.6) : 11) + 'px ' + theme.fontDisplay, color: theme.surface, align: 'center', baseline: 'middle' });
        // tank walls (over the cube, so it looks inside)
        c.strokeStyle = theme.muted; c.lineWidth = 3; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(tx, tTop); c.lineTo(tx, tBot); c.lineTo(tx + tw, tBot); c.lineTo(tx + tw, tTop); c.stroke();
        // depth ruler
        c.lineWidth = 1; c.strokeStyle = theme.muted;
        for (let m = 0; m <= TANK_H + 0.001; m += 0.1) {
          const y = tBot - m * Lo.pxm;
          c.beginPath(); c.moveTo(tx + tw + 3, y); c.lineTo(tx + tw + 9, y); c.stroke();
          K.text(c, K.fmt(m, 1, lang) + ' m', tx + tw + 12, y, { font: '10px ' + theme.font, color: theme.muted, baseline: 'middle' });
        }
        K.text(c, K.tr(st.liq.label, lang) + ' · ' + K.fmt(st.liq.rho, 0, lang) + ' kg/m³', tx + 6, tBot - 6, { font: '11px ' + theme.font, color: theme.fg });
        // force arrows from the cube centre
        const f = forces(), cx = r.x + r.s / 2, cy = r.y + r.s / 2;
        const maxF = Math.max(f.W, f.B, 1e-6), scale = Math.min(90, Lo.pxm * 0.22) / maxF;
        const lenW = Math.max(14, f.W * scale), lenB = f.B * scale;
        K.arrow(c, cx, cy, cx, cy + lenW, { color: theme.c2, width: 3, head: 9 });
        K.text(c, K.tr({ en: 'W = ', hr: 'G = ' }, lang) + K.fmt(f.W, 2, lang) + ' N', cx + 8, cy + lenW, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        if (f.B > 1e-4) {
          K.arrow(c, cx, cy, cx, cy - Math.max(14, lenB), { color: theme.c1, width: 3, head: 9 });
          K.text(c, K.tr({ en: 'F_b = ', hr: 'F_u = ' }, lang) + K.fmt(f.B, 2, lang) + ' N', cx + 8, cy - Math.max(14, lenB), { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        }
        // title
        if (Lo.panel) {
          K.text(c, matLabel + ' · ' + K.fmt(st.Vcm3, 0, lang) + ' cm³', 12, 14, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
          K.text(c, K.tr(st.held ? { en: 'Drag the cube or press Drop', hr: 'Povuci kocku ili pritisni Pusti' } : { en: 'Drag the cube to move it', hr: 'Povuci kocku da je pomakneš' }, lang), 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
          drawPanel(c, Lo, f);
        } else {
          drawCompact(c, Lo, f);
        }
      }
      function rhoStr() { return hidden() ? '?' : K.fmt(st.rho, 0, lang); }
      function drawPanel(c, Lo, f) {
        const px = Lo.sceneW + 8, py = 8, pw = Lo.w - px - 8, ph = Lo.h - 16;
        c.fillStyle = theme.surface; K.roundRect(c, px, py, pw, ph, 10); c.fill();
        const fontB = 'bold 15px ' + theme.fontDisplay, fontN = '13px ' + theme.font, fontS = '12px ' + theme.font;
        let y = py + 24; const x = px + 14, lh = 20;
        K.text(c, K.tr({ en: 'Density', hr: 'Gustoća' }, lang) + '   ρ = m / V', x, y, { font: fontB, color: theme.fg }); y += lh + 2;
        K.text(c, 'ρ = ' + K.fmt(st.m, 3, lang) + ' kg / ' + K.fmt(st.V, 4, lang) + ' m³', x, y, { font: fontN, color: theme.fg }); y += lh;
        K.text(c, 'ρ = ' + rhoStr() + ' kg/m³', x, y, { font: fontN, color: theme.fg }); y += lh + 6;
        c.strokeStyle = theme.line; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y - 10); c.lineTo(px + pw - 14, y - 10); c.stroke(); y += 6;
        K.text(c, K.tr({ en: 'Buoyant force', hr: 'Uzgon' }, lang), x, y, { font: fontB, color: theme.fg }); y += lh + 2;
        K.text(c, K.tr({ en: 'F_b = ρ_liq · g · V_under', hr: 'F_u = ρ_tek · g · V_uronj' }, lang), x, y, { font: fontN, color: theme.fg }); y += lh;
        const Vsub = st.a * st.a * submergedDepth();
        K.text(c, '= ' + K.fmt(st.liq.rho, 0, lang) + ' · ' + K.fmt(G, 2, lang) + ' · ' + K.fmt(Vsub, 4, lang), x, y, { font: fontN, color: theme.fg }); y += lh;
        K.text(c, '= ' + K.fmt(f.B, 2, lang) + ' N', x, y, { font: fontN, color: theme.fg }); y += lh + 6;
        c.beginPath(); c.moveTo(x, y - 10); c.lineTo(px + pw - 14, y - 10); c.stroke(); y += 6;
        K.text(c, K.tr({ en: 'Weight', hr: 'Težina' }, lang) + '  ' + K.tr({ en: 'W', hr: 'G' }, lang) + ' = m · g = ' + K.fmt(f.W, 2, lang) + ' N', x, y, { font: fontN, color: theme.fg }); y += lh + 4;
        if (!hidden()) {
          const floats = st.rho < st.liq.rho;
          const cmp = floats ? ' < ' : ' > ';
          c.fillStyle = floats ? theme.good : theme.warn; c.beginPath(); c.arc(x + 5, y - 4, 5, 0, Math.PI * 2); c.fill();
          K.text(c, K.fmt(st.rho, 0, lang) + cmp + K.fmt(st.liq.rho, 0, lang) + ' kg/m³ → ' + K.tr(floats ? { en: 'floats', hr: 'pluta' } : { en: 'sinks', hr: 'tone' }, lang), x + 16, y, { font: 'bold 13px ' + theme.font, color: theme.fg }); y += lh;
          if (floats) K.text(c, K.tr({ en: 'under: ρ_obj / ρ_liq = ', hr: 'uronjeno: ρ_tijela / ρ_tek = ' }, lang) + K.fmt(st.rho / st.liq.rho * 100, 0, lang) + ' %', x, y, { font: fontS, color: theme.muted });
        } else {
          K.text(c, K.tr({ en: 'Is it denser than the liquid?', hr: 'Je li gušće od tekućine?' }, lang), x, y, { font: fontS, color: theme.muted });
        }
      }
      function drawCompact(c, Lo, f) {
        const font = '11px ' + theme.font;
        K.text(c, 'ρ = m / V = ' + K.fmt(st.m, 3, lang) + ' kg / ' + K.fmt(st.V, 4, lang) + ' m³ = ' + rhoStr() + ' kg/m³', 8, 12, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'F_b', hr: 'F_u' }, lang) + ' = ρ·g·V_' + K.tr({ en: 'under', hr: 'ur' }, lang) + ' = ' + K.fmt(f.B, 2, lang) + ' N   ' + K.tr({ en: 'W', hr: 'G' }, lang) + ' = ' + K.fmt(f.W, 2, lang) + ' N   ' + K.fmt(f.frac * 100, 0, lang) + ' %', 8, 28, { font, color: theme.fg, baseline: 'middle' });
      }

      // ---------- lifecycle ----------
      function reset() {
        st.liq = LIQUIDS[0]; selLiq.set('water');
        st.mat = MATERIALS[2]; selMat.set('oak');
        st.Vcm3 = 1000; slV.set(1000);
        st.revealed = false; btnReveal.setDisabled(true);
        st.x = TANK_W / 2; st.y = START_Y; st.v = 0; st.held = true; st.dragging = false;
        applySize(); refresh();
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      if (!ctx.reducedMotion) L.start();
      updatePlay();
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
