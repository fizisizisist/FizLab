/* FizLab sim: Pressure — (a) a block pressing on sand, p = F / A; (b) hydrostatic pressure in a tank, p = ρ·g·h. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, P_ATM = 101300;
  const LIQUIDS = [
    { id: 'water', rho: 1000, label: { en: 'Water', hr: 'Voda' }, tint: t => t.water },
    { id: 'sea', rho: 1025, label: { en: 'Sea water', hr: 'Morska voda' }, tint: t => K.withAlpha(t.c1, 0.6) },
    { id: 'oil', rho: 920, label: { en: 'Oil', hr: 'Ulje' }, tint: t => K.withAlpha(t.c4, 0.55) },
    { id: 'mercury', rho: 13600, label: { en: 'Mercury', hr: 'Živa' }, tint: t => K.withAlpha(t.muted, 0.8) }
  ];
  const PRESETS = [
    { label: { en: 'Shoe sole', hr: 'Potplat' }, F: 600, A: 150 },
    { label: { en: 'High heel', hr: 'Štikla' }, F: 600, A: 2 },
    { label: { en: 'Snowshoe', hr: 'Krplje' }, F: 600, A: 400 },
    { label: { en: 'Nail tip', hr: 'Vrh čavla' }, F: 100, A: 1 }
  ];
  const HOLE_FRACS = [0.3, 0.6, 0.9];

  window.Sims.register({
    id: 'pressure',
    title: { en: 'Pressure', hr: 'Tlak' },
    summary: {
      en: 'Press a block into sand with different areas, then dive a pressure sensor into a tank and open holes in its wall.',
      hr: 'Pritisni blok u pijesak različitim površinama, zatim uroni senzor tlaka u spremnik i otvori rupe u zidu.'
    },
    tasks: [
      { en: 'Keep the force at 600 N (an adult). Switch between "High heel" and "Snowshoe". Which sinks deeper and why?', hr: 'Ostavi silu na 600 N (odrasla osoba). Mijenjaj "Štiklu" i "Krplje". Što tone dublje i zašto?' },
      { en: 'Find a force and an area that give exactly 100 000 Pa (100 kPa, about the pressure of the air).', hr: 'Pronađi silu i površinu koje daju točno 100 000 Pa (100 kPa, otprilike tlak zraka).' },
      { en: 'In the liquid: drag the sensor to 1 m depth in water, then switch to mercury. How many times bigger is the pressure?', hr: 'U tekućini: povuci senzor na dubinu 1 m u vodi, pa prebaci na živu. Koliko je puta veći tlak?' },
      { en: 'Open the holes in the wall. Which jet is fastest? Would a wider tank change the pressure?', hr: 'Otvori rupe u zidu. Koji je mlaz najbrži? Bi li širi spremnik promijenio tlak?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'surface', F: 600, A: 50, liq: LIQUIDS[0], H: 2, holes: false, arrows: false,
        sensor: { u: 0.5, d: 1 }, dragging: false, parts: [], emitAcc: [0, 0, 0] };

      // ---------- controls ----------
      const seg = C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: [
        { value: 'surface', label: { en: 'On a surface', hr: 'Na podlogu' } }, { value: 'liquid', label: { en: 'In a liquid', hr: 'U tekućini' } }], value: 'surface', onChange: setMode });
      const slF = C.slider({ label: { en: 'Force (weight)', hr: 'Sila (težina)' }, min: 10, max: 1000, step: 10, value: 600, unit: 'N', digits: 0, onChange: v => { st.F = v; refresh(); } });
      const slA = C.slider({ label: { en: 'Contact area', hr: 'Dodirna površina' }, min: 1, max: 400, step: 1, value: 50,
        format: (v, l) => K.fmt(v, 0, l) + ' cm² = ' + K.fmt(v / 10000, 4, l) + ' m²', onChange: v => { st.A = v; refresh(); } });
      const presetBtns = PRESETS.map(p => C.button({ label: p.label, onClick: () => { st.F = p.F; st.A = p.A; slF.set(p.F); slA.set(p.A); refresh(); } }));
      const selLiq = C.select({ label: { en: 'Liquid', hr: 'Tekućina' }, options: LIQUIDS.map(l => ({ value: l.id, label: l.label })), value: 'water',
        onChange: v => { st.liq = LIQUIDS.find(l => l.id === v) || LIQUIDS[0]; refresh(); } });
      const slH = C.slider({ label: { en: 'Liquid height', hr: 'Visina tekućine' }, min: 0.2, max: 3, step: 0.1, value: 2, unit: 'm', digits: 1,
        onChange: v => { st.H = v; st.sensor.d = Math.min(st.sensor.d, st.H); st.parts.length = 0; refresh(); } });
      const tgHoles = C.toggle({ label: { en: 'Holes in the wall', hr: 'Rupe u zidu' }, value: false, onChange: v => { st.holes = v; st.parts.length = 0; refresh(); } });
      const tgArrows = C.toggle({ label: { en: 'Show pressure arrows', hr: 'Prikaži strelice tlaka' }, value: false, onChange: v => { st.arrows = v; draw(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: reset });
      const outP = C.readout({ label: { en: 'Pressure', hr: 'Tlak' }, unit: 'Pa', digits: 0 });
      const outPk = C.readout({ label: { en: 'Pressure', hr: 'Tlak' }, unit: 'kPa', digits: 2 });
      const outF = C.readout({ label: { en: 'Force', hr: 'Sila' }, unit: 'N', digits: 0 });
      const outA = C.readout({ label: { en: 'Area', hr: 'Površina' }, unit: 'm²', digits: 4 });
      const outD = C.readout({ label: { en: 'Sensor depth', hr: 'Dubina senzora' }, unit: 'm', digits: 2 });
      const outPh = C.readout({ label: { en: 'Liquid pressure ρ·g·h', hr: 'Tlak tekućine ρ·g·h' }, unit: 'Pa', digits: 0 });
      const outPhk = C.readout({ label: { en: 'Liquid pressure', hr: 'Tlak tekućine' }, unit: 'kPa', digits: 2 });
      const outTot = C.readout({ label: { en: 'Total with air (+101.3 kPa)', hr: 'Ukupno sa zrakom (+101,3 kPa)' }, unit: 'kPa', digits: 1 });
      const note = C.note({ text: { en: '', hr: '' } });

      function fieldOf(ctrl) { const el = ctrl.el; return el.classList.contains('sk-field') ? el : el.parentElement; }
      const surfaceEls = [slF, slA].concat(presetBtns, [outP, outPk, outF, outA]).map(fieldOf);
      const liquidEls = [selLiq, slH, tgHoles, tgArrows, btnPlay, outD, outPh, outPhk, outTot].map(fieldOf);

      // ---------- physics ----------
      function pressureSurface() { return st.F / (st.A / 10000); }
      function pressureLiquid(d) { return st.liq.rho * G * d; }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { updateOut(); draw(); }
      function setMode(v) {
        st.mode = v;
        surfaceEls.forEach(e => { e.style.display = v === 'surface' ? '' : 'none'; });
        liquidEls.forEach(e => { e.style.display = v === 'liquid' ? '' : 'none'; });
        if (v === 'liquid' && !ctx.reducedMotion) L.start(); else L.stop();
        cv.canvas.style.cursor = 'default';
        updatePlay(); refresh();
      }
      function updateOut() {
        if (st.mode === 'surface') {
          const p = pressureSurface();
          outP.set(p); outPk.set(p / 1000); outF.set(st.F); outA.set(st.A / 10000);
          if (st.A <= 5) note.set({ en: 'Tiny area: the whole force presses through a few cm² — huge pressure, it sinks in deep. (A real nail tip is only ~0.01 cm², 100× more!)',
            hr: 'Sićušna površina: sva sila tlači kroz nekoliko cm² — golem tlak, duboko tone. (Pravi vrh čavla ima samo ~0,01 cm², 100 puta više!)' });
          else if (st.A >= 200) note.set({ en: 'A big area spreads the same force out → small pressure. That is why snowshoes do not sink into snow.',
            hr: 'Velika površina raspodijeli istu silu → mali tlak. Zato krplje ne tonu u snijeg.' });
          else note.set({ en: 'Pressure = force ÷ area. Make the area smaller and watch the block sink deeper into the sand.',
            hr: 'Tlak = sila ÷ površina. Smanji površinu i gledaj kako blok tone dublje u pijesak.' });
        } else {
          const p = pressureLiquid(st.sensor.d);
          outD.set(st.sensor.d); outPh.set(p); outPhk.set(p / 1000); outTot.set((p + P_ATM) / 1000);
          const extra = st.holes ? { en: ' Deeper hole → bigger pressure → faster jet, v = √(2gh).', hr: ' Dublja rupa → veći tlak → brži mlaz, v = √(2gh).' } : { en: '', hr: '' };
          note.set({ en: 'Pressure in a liquid grows with depth and with the liquid\'s density: p = ρ·g·h. It does not depend on the width of the tank.' + extra.en,
            hr: 'Tlak u tekućini raste s dubinom i s gustoćom tekućine: p = ρ·g·h. Ne ovisi o širini spremnika.' + extra.hr });
        }
      }
      function liquidLayout(w, h) {
        const Hs = Math.max(1, st.H);
        const top = 46, floorY = h - 22;
        const pxm = (floorY - top) / (st.H + Hs);
        const tankW = K.clamp(w * 0.28, 110, 220), tankX = Math.round(w * 0.08);
        return { pxm, tankX, tankW, surfY: top, bottomY: top + st.H * pxm, floorY, Hs };
      }
      function sensorPos(Lo) { return { x: Lo.tankX + st.sensor.u * Lo.tankW, y: Lo.surfY + st.sensor.d * Lo.pxm }; }
      function step(dt) {
        if (st.mode !== 'liquid' || !st.holes) return;
        const Lo = liquidLayout(cv.w, cv.h);
        HOLE_FRACS.forEach((f, i) => {
          const hd = f * st.H, v0 = Math.sqrt(2 * G * hd), yMax = (st.H - hd) + Lo.Hs;
          st.emitAcc[i] += dt * 22;
          while (st.emitAcc[i] >= 1) {
            st.emitAcc[i] -= 1;
            if (st.parts.length < 260) st.parts.push({ i, x: 0, y: 0, vx: v0, vy: (Math.random() - 0.5) * 0.3, yMax });
          }
        });
        for (let k = st.parts.length - 1; k >= 0; k--) {
          const p = st.parts[k];
          p.vy += G * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.y >= p.yMax) st.parts.splice(k, 1);
        }
      }

      // ---------- pointer (sensor drag) ----------
      function onDown(ev) {
        if (st.mode !== 'liquid') return;
        const p = cv.pointer(ev), s = sensorPos(liquidLayout(cv.w, cv.h));
        if (Math.hypot(p.x - s.x, p.y - s.y) > 18) return;
        st.dragging = true; try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault();
      }
      function onMove(ev) {
        if (st.mode !== 'liquid') return;
        const p = cv.pointer(ev), Lo = liquidLayout(cv.w, cv.h);
        if (st.dragging) {
          st.sensor.u = K.clamp((p.x - Lo.tankX) / Lo.tankW, 0.1, 0.9);
          st.sensor.d = K.clamp((p.y - Lo.surfY) / Lo.pxm, 0, st.H);
          refresh();
        } else {
          const s = sensorPos(Lo);
          cv.canvas.style.cursor = Math.hypot(p.x - s.x, p.y - s.y) <= 18 ? 'grab' : 'default';
        }
      }
      function onUp() { if (st.dragging) { st.dragging = false; cv.canvas.style.cursor = 'grab'; } }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing ----------
      function box(c, x, y, w, h) { c.fillStyle = theme.surface; K.roundRect(c, x, y, w, h, 10); c.fill(); }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        if (st.mode === 'surface') drawSurface(c, w, h); else drawLiquid(c, w, h);
      }
      function drawSurface(c, w, h) {
        const p = pressureSurface(), sandTop = Math.round(h * 0.6), maxSink = Math.round(h * 0.2);
        const sink = maxSink * Math.min(1, p / 300000);
        const cx = Math.round(w * 0.33);
        const footW = K.clamp(Math.sqrt(st.A) * 7, 6, Math.min(160, w * 0.4));
        const bodyW = Math.max(Math.min(footW, 120), 80), bodyH = 28 + st.F / 1000 * Math.min(120, h * 0.3);
        // sand with a dip under the foot
        c.fillStyle = theme.ground; c.beginPath();
        c.moveTo(0, sandTop); c.lineTo(cx - footW / 2 - 16, sandTop); c.lineTo(cx - footW / 2 - 3, sandTop + sink);
        c.lineTo(cx + footW / 2 + 3, sandTop + sink); c.lineTo(cx + footW / 2 + 16, sandTop); c.lineTo(w, sandTop); c.lineTo(w, h); c.lineTo(0, h); c.closePath(); c.fill();
        c.fillStyle = K.withAlpha(theme.fg, 0.15);
        for (let i = 0; i < 70; i++) { const gx = (i * 97) % w, gy = sandTop + 8 + ((i * 53) % (h - sandTop - 12)); c.fillRect(gx, gy, 2, 2); }
        K.text(c, K.tr({ en: 'sand', hr: 'pijesak' }, lang), w - 10, h - 8, { font: '11px ' + theme.font, color: theme.fg, align: 'right' });
        // foot plate + body
        const plateTop = sandTop + sink - 10;
        c.fillStyle = theme.c2; c.fillRect(cx - footW / 2, plateTop, footW, 10);
        c.fillStyle = theme.c1; K.roundRect(c, cx - bodyW / 2, plateTop - bodyH, bodyW, bodyH, 6); c.fill();
        c.fillStyle = K.withAlpha('#ffffff', 0.2); K.roundRect(c, cx - bodyW / 2 + 4, plateTop - bodyH + 4, bodyW - 8, Math.max(2, bodyH * 0.25), 3); c.fill();
        // force arrow
        const aLen = 30 + st.F / 1000 * 50, aTop = plateTop - bodyH - aLen - 6;
        K.arrow(c, cx, Math.max(8, aTop), cx, plateTop - bodyH - 4, { color: theme.c2, width: 3, head: 10 });
        K.text(c, 'F = ' + K.fmt(st.F, 0, lang) + ' N', cx + 10, Math.max(8, aTop) + aLen * 0.5, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        // area dimension line
        const dy = plateTop + 24 + Math.max(0, 30 - sink);
        c.strokeStyle = theme.fg; c.lineWidth = 1; c.beginPath();
        c.moveTo(cx - footW / 2, dy); c.lineTo(cx + footW / 2, dy); c.moveTo(cx - footW / 2, dy - 5); c.lineTo(cx - footW / 2, dy + 5); c.moveTo(cx + footW / 2, dy - 5); c.lineTo(cx + footW / 2, dy + 5); c.stroke();
        K.text(c, 'A = ' + K.fmt(st.A, 0, lang) + ' cm²', cx, dy + 8, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        // pressure arrows into the sand
        const n = Math.max(1, Math.min(5, Math.round(footW / 22))), pl = 10 + 36 * Math.min(1, p / 300000);
        for (let i = 0; i < n; i++) {
          const ax = n === 1 ? cx : cx - footW / 2 + 4 + (footW - 8) * i / (n - 1);
          K.arrow(c, ax, plateTop + 10, ax, plateTop + 10 + pl, { color: theme.c8, width: 2, head: 7 });
        }
        // formula box
        const bw = Math.min(290, w - 20), bx = w - bw - 10, by = 10, small = w < 520;
        box(c, bx, by, bw, small ? 86 : 104);
        const fB = 'bold ' + (small ? 14 : 16) + 'px ' + theme.fontDisplay, fN = (small ? 12 : 13) + 'px ' + theme.font, lh = small ? 19 : 23;
        let y = by + 24;
        K.text(c, K.tr({ en: 'Pressure', hr: 'Tlak' }, lang) + '   p = F / A', bx + 14, y, { font: fB, color: theme.fg }); y += lh;
        K.text(c, 'p = ' + K.fmt(st.F, 0, lang) + ' N / ' + K.fmt(st.A / 10000, 4, lang) + ' m²', bx + 14, y, { font: fN, color: theme.fg }); y += lh;
        K.text(c, 'p = ' + K.fmt(p, 0, lang) + ' Pa = ' + K.fmt(p / 1000, p >= 10000 ? 0 : 1, lang) + ' kPa', bx + 14, y, { font: fN, color: theme.fg }); y += lh;
        if (!small) K.text(c, K.tr({ en: '1 Pa = 1 N on 1 m²', hr: '1 Pa = 1 N na 1 m²' }, lang), bx + 14, y, { font: '12px ' + theme.font, color: theme.muted });
        K.text(c, K.tr({ en: 'How deep it sinks shows the pressure', hr: 'Dubina utonuća pokazuje tlak' }, lang), 10, h - 8, { font: '12px ' + theme.font, color: theme.fg });
      }
      function drawLiquid(c, w, h) {
        const Lo = liquidLayout(w, h), tx = Lo.tankX, tw = Lo.tankW, tint = st.liq.tint(theme);
        const wallTop = Lo.surfY - 14, tankRight = tx + tw;
        // floor + stand
        c.fillStyle = theme.ground; c.fillRect(0, Lo.floorY, w, h - Lo.floorY);
        c.fillStyle = K.withAlpha(theme.muted, 0.5); c.fillRect(tx - 4, Lo.bottomY, tw + 8, 6);
        c.fillRect(tx + 4, Lo.bottomY, 6, Lo.floorY - Lo.bottomY); c.fillRect(tankRight - 10, Lo.bottomY, 6, Lo.floorY - Lo.bottomY);
        // liquid + glass
        c.fillStyle = K.withAlpha(theme.fg, theme.isDark ? 0.07 : 0.04); c.fillRect(tx, wallTop, tw, Lo.bottomY - wallTop);
        c.fillStyle = tint; c.fillRect(tx, Lo.surfY, tw, Lo.bottomY - Lo.surfY);
        c.strokeStyle = theme.muted; c.lineWidth = 3; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(tx, wallTop); c.lineTo(tx, Lo.bottomY); c.lineTo(tankRight, Lo.bottomY); c.lineTo(tankRight, wallTop); c.stroke();
        // depth scale on the left
        const stepM = st.H > 1.5 ? 0.5 : (st.H > 0.6 ? 0.25 : 0.1);
        c.lineWidth = 1; c.strokeStyle = theme.muted;
        for (let m = 0; m <= st.H + 1e-6; m += stepM) {
          const y = Lo.surfY + m * Lo.pxm;
          c.beginPath(); c.moveTo(tx - 8, y); c.lineTo(tx - 3, y); c.stroke();
          K.text(c, K.fmt(m, stepM === 0.25 ? 2 : 1, lang) + ' m', tx - 11, y, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        K.text(c, K.tr(st.liq.label, lang) + ' · ρ = ' + K.fmt(st.liq.rho, 0, lang) + ' kg/m³', tx, wallTop - 8, { font: 'bold 12px ' + theme.font, color: theme.fg });
        // pressure arrows on walls and bottom
        if (st.arrows) {
          for (let k = 1; k <= 5; k++) {
            const d = st.H * k / 6, y = Lo.surfY + d * Lo.pxm, len = 8 + 46 * (d / st.H);
            K.arrow(c, tx + 4 + len, y, tx + 4, y, { color: theme.c2, width: 2, head: 7 });
            K.arrow(c, tankRight - 4 - len, y, tankRight - 4, y, { color: theme.c2, width: 2, head: 7 });
          }
          for (let k = 0; k < 3; k++) { const x = tx + tw * (0.25 + 0.25 * k); K.arrow(c, x, Lo.bottomY - 4 - 54, x, Lo.bottomY - 4, { color: theme.c2, width: 2, head: 7 }); }
        }
        // holes and jets
        if (st.holes) {
          HOLE_FRACS.forEach((f, i) => {
            const hd = f * st.H, hy = Lo.surfY + hd * Lo.pxm, v0 = Math.sqrt(2 * G * hd), yMax = (st.H - hd) + Lo.Hs;
            c.fillStyle = theme.sky; c.fillRect(tankRight - 2, hy - 3, 5, 6);
            c.strokeStyle = tint; c.lineWidth = 3; c.beginPath(); c.moveTo(tankRight + 2, hy);
            const xMax = v0 * Math.sqrt(2 * yMax / G);
            for (let s = 0; s <= 24; s++) { const x = xMax * s / 24, y = G * x * x / (2 * v0 * v0); c.lineTo(tankRight + 2 + x * Lo.pxm, hy + y * Lo.pxm); }
            c.stroke();
            K.text(c, 'v = ' + K.fmt(v0, 1, lang) + ' m/s', tankRight + 8, hy - 8, { font: '11px ' + theme.font, color: theme.fg });
            st.parts.forEach(p => { if (p.i !== i) return; c.fillStyle = tint; c.beginPath(); c.arc(tankRight + 2 + p.x * Lo.pxm, hy + p.y * Lo.pxm, 2.5, 0, Math.PI * 2); c.fill(); });
          });
        }
        // sensor + cable
        const s = sensorPos(Lo), p = pressureLiquid(st.sensor.d);
        c.strokeStyle = K.withAlpha(theme.fg, 0.5); c.lineWidth = 1.5; c.beginPath(); c.moveTo(s.x, wallTop - 4); c.lineTo(s.x, s.y); c.stroke();
        c.fillStyle = theme.c1; c.beginPath(); c.arc(s.x, s.y, 10, 0, Math.PI * 2); c.fill();
        c.strokeStyle = theme.surface; c.lineWidth = 2; c.beginPath(); c.arc(s.x, s.y, 5, 0, Math.PI * 2); c.stroke();
        K.text(c, 'h = ' + K.fmt(st.sensor.d, 2, lang) + ' m', s.x + 14, s.y, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        // formula box (top right)
        const small = w < 600, bw = Math.min(small ? 200 : 290, w - tankRight - 16), bx = w - bw - 8, by = 8;
        const fB = 'bold ' + (small ? 13 : 15) + 'px ' + theme.fontDisplay, fN = (small ? 11 : 13) + 'px ' + theme.font, lh = small ? 17 : 21;
        box(c, bx, by, bw, lh * 4 + 18);
        let y = by + 20;
        K.text(c, K.tr({ en: 'Pressure', hr: 'Tlak' }, lang) + '   p = ρ · g · h', bx + 12, y, { font: fB, color: theme.fg }); y += lh;
        K.text(c, '= ' + K.fmt(st.liq.rho, 0, lang) + ' · ' + K.fmt(G, 2, lang) + ' · ' + K.fmt(st.sensor.d, 2, lang), bx + 12, y, { font: fN, color: theme.fg }); y += lh;
        K.text(c, '= ' + K.fmt(p, 0, lang) + ' Pa = ' + K.fmt(p / 1000, 1, lang) + ' kPa', bx + 12, y, { font: fN, color: theme.fg }); y += lh;
        K.text(c, '+ ' + K.fmt(P_ATM / 1000, 1, lang) + ' kPa ' + K.tr({ en: 'air', hr: 'zrak' }, lang) + ' = ' + K.fmt((p + P_ATM) / 1000, 1, lang) + ' kPa', bx + 12, y, { font: fN, color: theme.fg });
        K.text(c, K.tr({ en: 'Drag the sensor', hr: 'Povuci senzor' }, lang) + ' · h = ' + K.fmt(st.sensor.d, 2, lang) + ' m · p = ' + K.fmt(p / 1000, 1, lang) + ' kPa', tx - 8, Lo.floorY + 15, { font: '11px ' + theme.font, color: theme.fg });
      }

      // ---------- lifecycle ----------
      function reset() {
        L.stop();
        st.F = 600; st.A = 50; slF.set(600); slA.set(50);
        st.liq = LIQUIDS[0]; selLiq.set('water'); st.H = 2; slH.set(2);
        st.holes = false; tgHoles.set(false); st.arrows = false; tgArrows.set(false);
        st.sensor.u = 0.5; st.sensor.d = 1; st.parts.length = 0; st.dragging = false;
        seg.set('surface'); setMode('surface');
      }
      const L = K.loop(dt => { step(dt); draw(); });
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
