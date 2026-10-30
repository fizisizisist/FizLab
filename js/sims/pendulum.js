/* FizLab sim: Pendulum — drag the bob, change length, mass and gravity; measured period vs. T = 2π·√(L/g). */
(function () {
  'use strict';
  const K = window.SimKit;
  const WORLDS = [
    { id: 'earth', g: 9.81, label: { en: 'Earth (g = 9.81 m/s²)', hr: 'Zemlja (g = 9,81 m/s²)' } },
    { id: 'moon', g: 1.62, label: { en: 'Moon (g = 1.62 m/s²)', hr: 'Mjesec (g = 1,62 m/s²)' } },
    { id: 'mars', g: 3.71, label: { en: 'Mars (g = 3.71 m/s²)', hr: 'Mars (g = 3,71 m/s²)' } },
    { id: 'jupiter', g: 24.79, label: { en: 'Jupiter (g = 24.79 m/s²)', hr: 'Jupiter (g = 24,79 m/s²)' } }
  ];
  const DAMP = 0.25;                 // air-friction coefficient b (1/s) when damping is on
  const TH0 = 20 * Math.PI / 180;    // starting angle
  const DEG = 180 / Math.PI;

  window.Sims.register({
    id: 'pendulum',
    title: { en: 'Pendulum', hr: 'Njihalo' },
    summary: {
      en: 'Drag the bob and let it swing. Change the length, the mass and the planet, and compare the measured period with the formula.',
      hr: 'Povuci kuglicu i pusti je da se njiše. Mijenjaj duljinu, masu i planet te usporedi mjereni period s formulom.'
    },
    tasks: [
      { en: 'Pull the bob to 20° and let go. Then try 60°. Does the period change a lot?', hr: 'Povuci kuglicu na 20° i pusti. Zatim probaj 60°. Mijenja li se period puno?' },
      { en: 'Change the mass from 0.1 kg to 2 kg. What happens to the period?', hr: 'Promijeni masu od 0,1 kg do 2 kg. Što se dogodi s periodom?' },
      { en: 'Make the pendulum 4 times longer (0.5 m → 2 m). How many times longer is the period?', hr: 'Produlji njihalo 4 puta (0,5 m → 2 m). Koliko je puta dulji period?' },
      { en: 'Take the pendulum to the Moon. Is it faster or slower? Check with T = 2π·√(L/g).', hr: 'Odnesi njihalo na Mjesec. Njiše li se brže ili sporije? Provjeri formulom T = 2π·√(L/g).' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 500 });
      const C = K.controls(container, lang);

      function makeP(L) { return { L, th: TH0, om: 0, peak: TH0, arc: 0, lastCross: null, period: null, count: 0, pts: [] }; }
      const P = makeP(1.0), Q = makeP(0.5); // main pendulum and the ghost
      const st = { g: 9.81, m: 0.5, damping: false, second: false, t: 0, drag: null, lastSample: -1 };
      const WINDOW = 8; // seconds shown on the angle–time graph
      let lay = null; // layout of the last frame: {px, py, pxm}

      // ---------- controls ----------
      C.slider({ label: { en: 'Length L', hr: 'Duljina L' }, min: 0.2, max: 3, step: 0.1, value: 1, unit: 'm', digits: 1, onChange: v => { P.L = v; clearMeasure(P); refresh(); } });
      C.slider({ label: { en: 'Mass of the bob', hr: 'Masa kuglice' }, min: 0.1, max: 2, step: 0.1, value: 0.5, unit: 'kg', digits: 1, onChange: v => { st.m = v; refresh(); } });
      C.select({ label: { en: 'Where are we?', hr: 'Gdje smo?' }, options: WORLDS.map(p => ({ value: p.id, label: p.label })), value: 'earth',
        onChange: v => { st.g = (WORLDS.find(p => p.id === v) || WORLDS[0]).g; clearMeasure(P); clearMeasure(Q); refresh(); } });
      C.toggle({ label: { en: 'Air friction', hr: 'Otpor zraka' }, value: false, onChange: v => { st.damping = v; refresh(); } });
      C.toggle({ label: { en: 'Second pendulum (ghost)', hr: 'Drugo njihalo (sjena)' }, value: false, onChange: v => {
        st.second = v; slL2.setDisabled(!v); Q.th = P.th; Q.om = 0; Q.peak = Math.abs(P.th); Q.arc = 0; clearMeasure(Q); refresh(); } });
      const slL2 = C.slider({ label: { en: 'Ghost length', hr: 'Duljina sjene' }, min: 0.2, max: 3, step: 0.1, value: 0.5, unit: 'm', digits: 1, onChange: v => { Q.L = v; clearMeasure(Q); refresh(); } });
      slL2.setDisabled(true);
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outTm = C.readout({ label: { en: 'Period (measured)', hr: 'Period (mjereno)' }, unit: 's', digits: 2 });
      const outTf = C.readout({ label: { en: 'Period (formula)', hr: 'Period (formula)' }, unit: 's', digits: 2 });
      const outAng = C.readout({ label: { en: 'Angle', hr: 'Kut' }, unit: '°', digits: 1 });
      const outV = C.readout({ label: { en: 'Bob speed', hr: 'Brzina kuglice' }, unit: 'm/s', digits: 2 });
      const outN = C.readout({ label: { en: 'Full swings counted', hr: 'Izbrojeni puni njihaji' }, digits: 0 });
      const outTm2 = C.readout({ label: { en: 'Ghost period (measured)', hr: 'Period sjene (mjereno)' }, unit: 's', digits: 2 });
      const outTf2 = C.readout({ label: { en: 'Ghost period (formula)', hr: 'Period sjene (formula)' }, unit: 's', digits: 2 });
      const note = C.note({ text: { en: '', hr: '' } });

      // ---------- physics ----------
      const formulaT = p => 2 * Math.PI * Math.sqrt(p.L / st.g);
      function clearMeasure(p) { p.lastCross = null; p.period = null; p.count = 0; }
      // θ'' = −(g/L)·sin θ − b·θ'  (semi-implicit Euler, called with small sub-steps)
      function integ(p, h, b, tNow) {
        const a = -(st.g / p.L) * Math.sin(p.th) - b * p.om;
        const thPrev = p.th;
        p.om += a * h; p.th += p.om * h;
        p.peak = Math.max(p.peak, Math.abs(p.th));
        if (thPrev < 0 && p.th >= 0) { // upward zero crossing: one full period since the last one
          const tc = tNow + h * (-thPrev / (p.th - thPrev || 1));
          if (p.lastCross !== null) { p.period = tc - p.lastCross; p.count += 1; }
          p.lastCross = tc;
          p.arc = p.peak; p.peak = 0;
        }
      }
      function step(dt) {
        const n = 4, h = dt / n, b = st.damping ? DAMP : 0;
        for (let i = 0; i < n; i++) {
          const tNow = st.t + i * h;
          if (st.drag !== P) integ(P, h, b, tNow);
          if (st.second && st.drag !== Q) integ(Q, h, b, tNow);
        }
        st.t += dt;
        if (st.t - st.lastSample >= 0.03) { // samples for the angle–time graph (one WINDOW page at a time)
          st.lastSample = st.t;
          const t0 = Math.floor(st.t / WINDOW) * WINDOW;
          [P, Q].forEach(p => {
            while (p.pts.length && p.pts[0][0] < t0) p.pts.shift();
            p.pts.push([st.t, p.th * DEG]);
          });
        }
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function reset() {
        L.stop(); st.t = 0; st.drag = null; st.lastSample = -1;
        [P, Q].forEach(p => { p.th = TH0; p.om = 0; p.peak = TH0; p.arc = 0; p.pts = []; clearMeasure(p); });
        if (!ctx.reducedMotion) L.start();
        updatePlay(); refresh();
      }
      function refresh() { updateOut(); draw(); }
      function updateOut() {
        outTm.set(P.period); outTf.set(formulaT(P)); outAng.set(P.th * DEG); outV.set(P.L * Math.abs(P.om)); outN.set(P.count);
        outTm2.set(st.second ? Q.period : null); outTf2.set(st.second ? formulaT(Q) : null);
        const amp = Math.max(P.arc, P.peak) * DEG;
        note.set(st.damping
          ? { en: 'Air friction makes the swing smaller and smaller, but the period stays almost the same.', hr: 'Otpor zraka smanjuje zamah, ali period ostaje gotovo isti.' }
          : amp > 35
            ? { en: 'Big swings take a little longer than the formula says — T = 2π·√(L/g) is exact only for small angles.', hr: 'Veliki zamasi traju malo dulje nego što formula kaže — T = 2π·√(L/g) vrijedi točno samo za male kutove.' }
            : { en: 'The period depends only on the length and on gravity. Change the mass — T does not change!', hr: 'Period ovisi samo o duljini i o gravitaciji. Promijeni masu — T se ne mijenja!' });
      }

      // ---------- pointer (drag the bob) ----------
      const bobR = p => 8 + 7 * Math.sqrt(st.m) * (p === Q ? 0.85 : 1);
      function bobPos(p) { return { x: lay.px + Math.sin(p.th) * p.L * lay.pxm, y: lay.py + Math.cos(p.th) * p.L * lay.pxm }; }
      function hit(pt, p) { const b = bobPos(p); return Math.hypot(pt.x - b.x, pt.y - b.y) <= bobR(p) + 14; }
      function setAngleFrom(pt) {
        const p = st.drag;
        p.th = K.clamp(Math.atan2(pt.x - lay.px, pt.y - lay.py), -Math.PI / 2, Math.PI / 2);
        p.om = 0; p.peak = Math.abs(p.th); p.arc = 0; clearMeasure(p);
      }
      function onDown(ev) {
        if (!lay) return;
        const pt = cv.pointer(ev);
        const target = hit(pt, P) ? P : (st.second && hit(pt, Q)) ? Q : null;
        if (!target) return;
        ev.preventDefault();
        st.drag = target; setAngleFrom(pt);
        cv.canvas.style.cursor = 'grabbing';
        refresh();
      }
      function onMove(ev) {
        if (st.drag) { setAngleFrom(cv.pointer(ev)); if (!L.running) refresh(); return; }
        if (ev.target !== cv.canvas || !lay) return;
        const pt = cv.pointer(ev);
        cv.canvas.style.cursor = (hit(pt, P) || (st.second && hit(pt, Q))) ? 'grab' : 'default';
      }
      function onUp() {
        if (!st.drag) return;
        st.drag = null; cv.canvas.style.cursor = 'grab';
        if (!L.running) { L.start(); updatePlay(); }
      }
      cv.canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      // ---------- drawing ----------
      function drawPendulum(ctx, p, color, ghost) {
        const b = bobPos(p), r = bobR(p), R = p.L * lay.pxm;
        const amp = Math.min(Math.max(p.arc, p.peak), Math.PI / 2 + 0.01);
        // faint arc trace of the swing
        if (amp > 0.01) {
          ctx.save(); ctx.strokeStyle = K.withAlpha(color, 0.45); ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]);
          ctx.beginPath(); ctx.arc(lay.px, lay.py, R, Math.PI / 2 - amp, Math.PI / 2 + amp); ctx.stroke(); ctx.restore();
          if (!ghost) { // amplitude marks at both ends of the swing
            [-1, 1].forEach(s => {
              const ex = lay.px + Math.sin(s * amp) * (R + 14), ey = lay.py + Math.cos(s * amp) * (R + 14);
              K.text(ctx, K.fmt(amp * DEG, 0, lang) + '°', ex, ey, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
            });
          }
        }
        // string
        ctx.save(); ctx.globalAlpha = ghost ? 0.75 : 1;
        ctx.strokeStyle = ghost ? color : theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lay.px, lay.py); ctx.lineTo(b.x, b.y); ctx.stroke();
        // bob
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = K.withAlpha('#ffffff', 0.35); ctx.beginPath(); ctx.arc(b.x - r * 0.3, b.y - r * 0.3, r * 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // velocity arrow (tangent)
        const v = p.L * p.om;
        if (!ghost && Math.abs(v) > 0.03) {
          const len = K.clamp(Math.abs(v) * 22, 10, 90), s = Math.sign(v);
          K.arrow(ctx, b.x, b.y, b.x + s * Math.cos(p.th) * len, b.y - s * Math.sin(p.th) * len, { color: theme.fg, width: 2, head: 8 });
        }
      }
      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        // layout: the longest pendulum (at least 1 m) fits; a 3 m pendulum always fits; angle–time graph on the right when wide
        const showChart = w >= 620;
        const W = showChart ? Math.round(w * 0.6) : w;
        const topY = 62;
        const Lmax = Math.max(P.L, st.second ? Q.L : 0, 1.0);
        const pxm = Math.min((h - topY - 34) / (Lmax * 1.08), (W * 0.44) / Lmax);
        lay = { px: Math.round(W / 2), py: topY, pxm };
        const px = lay.px, py = lay.py;

        // stand (ceiling bracket)
        ctx.fillStyle = theme.muted; ctx.fillRect(px - 60, py - 9, 120, 8);
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1;
        for (let x = px - 56; x < px + 60; x += 8) { ctx.beginPath(); ctx.moveTo(x, py - 9); ctx.lineTo(x - 6, py - 17); ctx.stroke(); }
        // vertical reference line
        ctx.save(); ctx.strokeStyle = theme.line; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + Lmax * pxm + 10); ctx.stroke(); ctx.restore();
        // protractor
        const rp = K.clamp(pxm * 0.4, 30, 70);
        ctx.strokeStyle = theme.line; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(px, py, rp, 0, Math.PI); ctx.stroke();
        for (let d = -90; d <= 90; d += 10) {
          const a = d / DEG, big = d % 30 === 0, r0 = big ? rp - 8 : rp - 4;
          ctx.strokeStyle = big ? theme.muted : theme.line;
          ctx.beginPath(); ctx.moveTo(px + Math.sin(a) * r0, py + Math.cos(a) * r0); ctx.lineTo(px + Math.sin(a) * rp, py + Math.cos(a) * rp); ctx.stroke();
          if (big && d !== 0) K.text(ctx, Math.abs(d) + '°', px + Math.sin(a) * (rp + 11), py + Math.cos(a) * (rp + 11), { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        }
        // angle wedge
        if (Math.abs(P.th) > 0.005) {
          ctx.fillStyle = K.withAlpha(theme.c1, 0.25); ctx.beginPath(); ctx.moveTo(px, py);
          ctx.arc(px, py, rp * 0.7, Math.PI / 2, Math.PI / 2 - P.th, P.th > 0); ctx.closePath(); ctx.fill();
        }
        // pendulums
        if (st.second) drawPendulum(ctx, Q, theme.c2, true);
        drawPendulum(ctx, P, theme.c1, false);
        // pivot
        ctx.fillStyle = theme.fg; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();

        // texts
        const f13 = '13px ' + theme.font, fb = 'bold 13px ' + theme.fontDisplay;
        K.text(ctx, 'L = ' + K.fmt(P.L, 1, lang) + ' m    m = ' + K.fmt(st.m, 1, lang) + ' kg    g = ' + K.fmt(st.g, 2, lang) + ' m/s²', 10, 14, { font: fb, color: theme.fg, baseline: 'middle' });
        K.text(ctx, 'T = 2π·√(L/g) = ' + K.fmt(formulaT(P), 2, lang) + ' s', 10, 32, { font: f13, color: theme.fg, baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'T measured = ', hr: 'T mjereno = ' }, lang) + K.fmt(P.period, 2, lang) + ' s', 10, 49, { font: f13, color: theme.fg, baseline: 'middle' });
        K.text(ctx, 'θ = ' + K.fmt(P.th * DEG, 1, lang) + '°', W - 10, 14, { font: fb, color: theme.fg, align: 'right', baseline: 'middle' });
        K.text(ctx, 'v = ' + K.fmt(P.L * Math.abs(P.om), 2, lang) + ' m/s', W - 10, 32, { font: f13, color: theme.fg, align: 'right', baseline: 'middle' });
        if (!st.second) K.text(ctx, K.tr({ en: 'swings: ', hr: 'njihaji: ' }, lang) + K.fmt(P.count, 0, lang), W - 10, 49, { font: f13, color: theme.fg, align: 'right', baseline: 'middle' });
        if (st.second) {
          const s = K.tr({ en: 'ghost: L = ', hr: 'sjena: L = ' }, lang) + K.fmt(Q.L, 1, lang) + ' m,  T = ' + K.fmt(formulaT(Q), 2, lang) + ' s' +
            (Q.period !== null ? K.tr({ en: ' (measured ', hr: ' (mjereno ' }, lang) + K.fmt(Q.period, 2, lang) + ' s)' : '');
          ctx.fillStyle = theme.c2; ctx.fillRect(W - 10 - 10, 44, 10, 10);
          K.text(ctx, s, W - 26, 49, { font: '12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        }
        // angle–time graph
        if (showChart) {
          const t0 = Math.floor(st.t / WINDOW) * WINDOW;
          let aMax = 10;
          [P, Q].forEach(p => p.pts.forEach(pt => { aMax = Math.max(aMax, Math.abs(pt[1])); }));
          aMax = Math.ceil(aMax / 10) * 10;
          const series = [{ points: P.pts, color: theme.c1, label: { en: 'pendulum', hr: 'njihalo' } }];
          if (st.second) series.push({ points: Q.pts, color: theme.c2, label: { en: 'ghost', hr: 'sjena' } });
          K.lineChart(ctx, { x: W + 8, y: 8, w: w - W - 16, h: h - 16, xMin: t0, xMax: t0 + WINDOW, yMin: -aMax, yMax: aMax, xTicks: 4, yTicks: 4, lang, theme,
            xLabel: { en: 'time (s)', hr: 'vrijeme (s)' }, yLabel: { en: 'angle (°)', hr: 'kut (°)' }, series });
        }
        // scale bar (1 m)
        const bx = 14, by = h - 14;
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + pxm, by); ctx.moveTo(bx, by - 5); ctx.lineTo(bx, by + 5); ctx.moveTo(bx + pxm, by - 5); ctx.lineTo(bx + pxm, by + 5); ctx.stroke();
        K.text(ctx, '1 m', bx + pxm / 2, by - 7, { font: '11px ' + theme.font, color: theme.fg, align: 'center' });
        K.text(ctx, K.tr({ en: 'Drag the bob!', hr: 'Povuci kuglicu!' }, lang), W - 10, h - 10, { font: '12px ' + theme.font, color: theme.muted, align: 'right' });
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() {
          L.destroy();
          cv.canvas.removeEventListener('pointerdown', onDown);
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
