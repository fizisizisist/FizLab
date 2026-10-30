/* FizLab sim: Springs and Hooke's Law — hang masses on a spring, watch it stretch and bob, plot force against extension. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81;
  const SPRINGS = [
    { id: 'soft', k: 10, label: { en: 'Soft (k = 10 N/m)', hr: 'Mekana (k = 10 N/m)' } },
    { id: 'medium', k: 25, label: { en: 'Medium (k = 25 N/m)', hr: 'Srednja (k = 25 N/m)' } },
    { id: 'stiff', k: 50, label: { en: 'Stiff (k = 50 N/m)', hr: 'Tvrda (k = 50 N/m)' } }
  ];
  const MASSES = [0.05, 0.1, 0.2, 0.5];          // kg — one of each in the tray
  const MAX_M = MASSES.reduce((s, m) => s + m, 0); // 0.85 kg
  const ZETA = 0.03;                               // damping ratio of the bobbing

  const massH = (m, sc) => Math.round((12 + 20 * Math.cbrt(m / 0.5)) * sc);
  const massW = (m, sc) => Math.round((26 + 30 * Math.cbrt(m / 0.5)) * sc);

  window.Sims.register({
    id: 'spring',
    title: { en: 'Springs and Hooke\'s Law', hr: 'Opruga i Hookeov zakon' },
    summary: {
      en: 'Drag masses onto the hook. The spring stretches in proportion to the force — that is how a dynamometer measures force.',
      hr: 'Povuci utege na kuku. Opruga se produlji razmjerno sili – tako dinamometar mjeri silu.'
    },
    tasks: [
      { en: 'Hang 100 g, then 200 g, then 500 g. Read the extension each time. What happens when the force doubles?', hr: 'Objesi 100 g, zatim 200 g, zatim 500 g. Svaki put pročitaj produljenje. Što se dogodi kad se sila udvostruči?' },
      { en: 'Look at the graph: all the points lie on one straight line through the origin. Its slope is the spring constant k.', hr: 'Pogledaj graf: sve točke leže na jednom pravcu kroz ishodište. Njegov nagib je konstanta opruge k.' },
      { en: 'Switch to the stiff spring with the same masses. Is the extension bigger or smaller? And k?', hr: 'Prebaci na tvrdu oprugu s istim utezima. Je li produljenje veće ili manje? A k?' },
      { en: 'Watch the bobbing. Compare the measured period with T = 2π·√(m/k). Does a heavier mass bob faster or slower?', hr: 'Promatraj titranje. Usporedi izmjereni period s T = 2π·√(m/k). Titra li teži uteg brže ili sporije?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 10, minHeight: 320, maxHeight: 500 });
      const C = K.controls(container, lang);

      const st = { k: 25, hung: [], x: 0, v: 0, slow: false, points: [], lastBottom: -1, period: 0, lastV: 0, tSim: 0, drag: null };
      const hungMass = () => st.hung.reduce((s, i) => s + MASSES[i], 0);

      // ---------- controls ----------
      const selSpring = C.select({ label: { en: 'Spring', hr: 'Opruga' }, options: SPRINGS.map(s => ({ value: s.id, label: s.label })), value: 'medium',
        onChange: v => { st.k = (SPRINGS.find(s => s.id === v) || SPRINGS[1]).k; st.points = []; onMassChange(); } });
      const tgSlow = C.toggle({ label: { en: 'Slow motion', hr: 'Usporeno' }, value: false, onChange: v => { st.slow = v; } });
      C.button({ label: { en: 'Remove last mass', hr: 'Skini zadnji uteg' }, onClick: () => { if (st.hung.length) { st.hung.pop(); onMassChange(); updateOut(); draw(); } } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const outM = C.readout({ label: { en: 'Mass on the hook', hr: 'Masa na kuki' }, unit: 'g', digits: 0 });
      const outF = C.readout({ label: { en: 'Force F = m·g', hr: 'Sila F = m·g' }, unit: 'N', digits: 2 });
      const outX = C.readout({ label: { en: 'Extension x', hr: 'Produljenje x' }, unit: 'cm', digits: 1 });
      const outK = C.readout({ label: { en: 'k from the graph points', hr: 'k iz točaka grafa' }, unit: 'N/m', digits: 1 });
      const outTm = C.readout({ label: { en: 'Period (measured)', hr: 'Period (izmjeren)' }, unit: 's', digits: 2 });
      const outTf = C.readout({ label: { en: 'Period T = 2π·√(m/k)', hr: 'Period T = 2π·√(m/k)' }, unit: 's', digits: 2 });
      C.note({ text: { en: 'A dynamometer measures force by how far a spring stretches: F = k·x (Hooke\'s law). Twice the force → twice the extension.',
        hr: 'Dinamometar mjeri silu po tome koliko se opruga produlji: F = k·x (Hookeov zakon). Dvostruka sila → dvostruko produljenje.' } });

      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function kFit() {
        let sxy = 0, sxx = 0;
        st.points.forEach(p => { const x = p[0] / 100; sxy += p[1] * x; sxx += x * x; });
        return sxx > 0 ? sxy / sxx : null;
      }
      function onMassChange() {
        st.lastBottom = -1; st.period = 0; st.lastV = st.v;
        const m = hungMass();
        if (m > 1e-9 && !st.points.some(p => Math.abs(p[2] - m) < 1e-6)) st.points.push([m * G / st.k * 100, m * G, m]);
      }
      function hangMass(i) { if (st.hung.indexOf(i) >= 0) return; st.hung.push(i); onMassChange(); }
      function removeMass(i) { const j = st.hung.indexOf(i); if (j < 0) return; st.hung.splice(j, 1); onMassChange(); }
      function reset() {
        st.k = 25; selSpring.set('medium'); st.slow = false; tgSlow.set(false);
        st.hung = []; st.x = 0; st.v = 0; st.points = []; st.lastBottom = -1; st.period = 0; st.lastV = 0; st.tSim = 0; st.drag = null;
        if (!ctx.reducedMotion) L.start(); else L.stop();
        updatePlay(); updateOut(); draw();
      }

      // ---------- physics: m·x'' = m·g − k·x − b·x'  (x = extension from the natural length) ----------
      function step(dt) {
        dt *= st.slow ? 0.2 : 1;
        const m = hungMass();
        if (m <= 1e-9) { st.x += (0 - st.x) * Math.min(1, dt * 12); st.v = 0; if (Math.abs(st.x) < 1e-5) st.x = 0; return; }
        const b = 2 * ZETA * Math.sqrt(st.k * m);
        const n = 6, h = dt / n;
        for (let i = 0; i < n; i++) {
          const a = G - (st.k / m) * st.x - (b / m) * st.v;
          st.v += a * h; st.x += st.v * h; st.tSim += h;
          // lowest turning point: velocity (downwards positive) changes sign from + to −
          if (st.lastV > 0 && st.v <= 0) {
            if (st.lastBottom >= 0) st.period = st.tSim - st.lastBottom;
            st.lastBottom = st.tSim;
          }
          st.lastV = st.v;
        }
      }
      function updateOut() {
        const m = hungMass();
        outM.set(m * 1000); outF.set(m * G); outX.set(st.x * 100);
        outK.set(st.points.length ? kFit() : null);
        outTm.set(st.period > 0 && m > 0 ? st.period : null);
        outTf.set(m > 0 ? 2 * Math.PI * Math.sqrt(m / st.k) : null);
      }

      // ---------- layout ----------
      function layout() {
        const w = cv.w, h = cv.h, showChart = w >= 620;
        const sceneW = showChart ? Math.round(w * 0.55) : w;
        const sc = K.clamp(h / 450, 0.55, 1);
        const standX = Math.round(sceneW * 0.42);
        const topY = 30, natLen = Math.round(70 * sc), hookY0 = topY + natLen;
        const trayH = Math.round(54 * sc), trayTop = h - trayH - 6;
        const stackH = MASSES.reduce((s, m) => s + massH(m, sc) + 2, 0) + 10 * sc;
        const room = Math.max(40, trayTop - hookY0 - stackH - 8);
        const pxPerM = room / (MAX_M * G / st.k);
        return { w, h, showChart, sceneW, sc, standX, topY, natLen, hookY0, trayTop, trayH, pxPerM, room };
      }
      const hookY = Ly => Ly.hookY0 + st.x * Ly.pxPerM;
      function massRects(Ly) {
        const rects = [];
        let y = hookY(Ly) + 10 * Ly.sc;
        st.hung.forEach(i => { const m = MASSES[i], mw = massW(m, Ly.sc), mh = massH(m, Ly.sc); rects[i] = { x: Ly.standX - mw / 2, y, w: mw, h: mh, where: 'hook' }; y += mh + 2; });
        const slotW = (Ly.sceneW - 20) / MASSES.length;
        MASSES.forEach((m, i) => {
          if (rects[i] || (st.drag && st.drag.idx === i)) return;
          const mw = massW(m, Ly.sc), mh = massH(m, Ly.sc);
          rects[i] = { x: 10 + slotW * (i + 0.5) - mw / 2, y: Ly.trayTop + Ly.trayH - 6 - mh, w: mw, h: mh, where: 'tray' };
        });
        return rects;
      }
      function hitMass(p, Ly) {
        const rects = massRects(Ly);
        for (let i = MASSES.length - 1; i >= 0; i--) {
          const r = rects[i];
          if (r && p.x >= r.x - 5 && p.x <= r.x + r.w + 5 && p.y >= r.y - 5 && p.y <= r.y + r.h + 5) return { idx: i, rect: r };
        }
        return null;
      }
      const inDropZone = (p, Ly) => Math.abs(p.x - Ly.standX) < 80 * Ly.sc + 20 && p.y > Ly.hookY0 - 40 && p.y < Ly.trayTop - 2;

      // ---------- pointer events ----------
      const onDown = ev => {
        const p = cv.pointer(ev), Ly = layout();
        if (p.x > Ly.sceneW) return;
        const hit = hitMass(p, Ly);
        if (!hit) return;
        st.drag = { idx: hit.idx, from: hit.rect.where, px: p.x, py: p.y, sx: p.x, sy: p.y, moved: false };
        if (hit.rect.where === 'hook') removeMass(hit.idx);
        cv.canvas.style.cursor = 'grabbing';
        if (ev.preventDefault) ev.preventDefault();
        updateOut(); draw();
      };
      const onMove = ev => {
        const p = cv.pointer(ev), Ly = layout();
        if (st.drag) {
          st.drag.px = p.x; st.drag.py = p.y;
          if (Math.hypot(p.x - st.drag.sx, p.y - st.drag.sy) > 6) st.drag.moved = true;
          draw(); return;
        }
        cv.canvas.style.cursor = hitMass(p, Ly) ? 'grab' : 'default';
      };
      const onUp = () => {
        if (!st.drag) return;
        const Ly = layout(), d = st.drag; st.drag = null;
        if (!d.moved) { if (d.from === 'tray') hangMass(d.idx); }           // tap: tray → hook, hook → tray
        else if (inDropZone({ x: d.px, y: d.py }, Ly)) hangMass(d.idx);      // drop near the hook; otherwise it goes back to the tray
        cv.canvas.style.cursor = 'default';
        updateOut(); draw();
      };
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      // ---------- drawing ----------
      function drawMass(ctx, x, y, mw, mh, m) {
        ctx.fillStyle = theme.c2; ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
        K.roundRect(ctx, x, y, mw, mh, 4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + mw / 2, y); ctx.lineTo(x + mw / 2, y - 6); ctx.stroke();   // small loop on top
        K.text(ctx, K.fmt(m * 1000, 0, lang) + ' g', x + mw / 2, y + mh / 2, { font: 'bold ' + Math.max(10, Math.round(11 * (mh / 26))) + 'px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function drawSpring(ctx, x, y0, y1, sc) {
        const amp = 13 * sc, n = 14, lead = 8;
        ctx.strokeStyle = theme.c1; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + lead);
        const span = Math.max(4, y1 - y0 - 2 * lead);
        for (let i = 1; i <= n; i++) ctx.lineTo(x + (i % 2 ? amp : -amp), y0 + lead + span * (i - 0.5) / n);
        ctx.lineTo(x, y1 - lead); ctx.lineTo(x, y1); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y1 + 5 * sc, 5 * sc, -Math.PI / 2, Math.PI * 0.9); ctx.stroke();   // hook
      }
      function drawRuler(ctx, Ly) {
        const rx = Ly.standX + 46 * Ly.sc + 22, y0 = Ly.hookY0, len = Ly.room + 10 * Ly.sc;
        const steps = [1, 2, 5, 10, 20, 50];
        let stepCm = 50;
        for (const s of steps) { if (s / 100 * Ly.pxPerM >= 14) { stepCm = s; break; } }
        const labelEvery = (stepCm / 100 * Ly.pxPerM >= 24) ? 1 : 2;
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(rx, y0 - 4); ctx.lineTo(rx, y0 + len); ctx.stroke();
        const maxCm = len / Ly.pxPerM * 100;
        for (let c = 0, i = 0; c <= maxCm; c += stepCm, i++) {
          const y = y0 + c / 100 * Ly.pxPerM;
          ctx.beginPath(); ctx.moveTo(rx - (i % labelEvery ? 4 : 7), y); ctx.lineTo(rx, y); ctx.stroke();
          if (i % labelEvery === 0) K.text(ctx, K.fmt(c, 0, lang), rx + 5, y, { font: '10px ' + theme.font, color: theme.muted, baseline: 'middle' });
        }
        K.text(ctx, 'cm', rx + 5, y0 - 8, { font: '10px ' + theme.font, color: theme.muted, baseline: 'bottom' });
      }
      function draw() {
        const ctx = cv.ctx, Ly = layout(), w = Ly.w, h = Ly.h, sc = Ly.sc;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        const m = hungMass(), hy = hookY(Ly);
        // stand
        const postX = Ly.standX - Math.round(90 * sc);
        ctx.fillStyle = theme.surface2; ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
        K.roundRect(ctx, postX - 5, Ly.topY - 6, 10, h - Ly.topY, 3); ctx.fill(); ctx.stroke();
        K.roundRect(ctx, postX - 5, Ly.topY - 6, Ly.standX - postX + 14, 10, 3); ctx.fill(); ctx.stroke();
        // tray
        ctx.fillStyle = theme.surface; ctx.strokeStyle = theme.line; ctx.lineWidth = 1.5;
        K.roundRect(ctx, 8, Ly.trayTop, Ly.sceneW - 16, Ly.trayH, 8); ctx.fill(); ctx.stroke();
        K.text(ctx, K.tr({ en: 'Masses — drag or tap to hang them on the hook', hr: 'Utezi – povuci ili dodirni da ih objesiš na kuku' }, lang), Ly.sceneW / 2, Ly.trayTop + 4, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        // natural-length line and equilibrium line
        ctx.save(); ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
        ctx.strokeStyle = theme.muted; ctx.beginPath(); ctx.moveTo(Ly.standX - 50 * sc, Ly.hookY0); ctx.lineTo(Ly.standX + 46 * sc + 22, Ly.hookY0); ctx.stroke();
        if (m > 0) {
          const ye = Ly.hookY0 + m * G / st.k * Ly.pxPerM;
          ctx.strokeStyle = theme.c6; ctx.beginPath(); ctx.moveTo(Ly.standX - 50 * sc, ye); ctx.lineTo(Ly.standX + 46 * sc + 22, ye); ctx.stroke();
          K.text(ctx, K.tr({ en: 'equilibrium ', hr: 'ravnoteža ' }, lang) + K.fmt(m * G / st.k * 100, 1, lang) + ' cm', Ly.standX - 50 * sc - 4, ye, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        ctx.restore();
        K.text(ctx, 'x = 0', Ly.standX - 50 * sc - 4, Ly.hookY0, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        drawRuler(ctx, Ly);
        drawSpring(ctx, Ly.standX, Ly.topY + 4, hy, sc);
        // extension arrow beside the spring
        if (st.x > 0.002) {
          const ax = Ly.standX - 30 * sc;
          K.arrow(ctx, ax, Ly.hookY0, ax, hy, { color: theme.c1, width: 2, head: 7 });
          K.text(ctx, 'x = ' + K.fmt(st.x * 100, 1, lang) + ' cm', ax - 6, (Ly.hookY0 + hy) / 2, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        }
        // masses (tray + hung)
        const rects = massRects(Ly);
        MASSES.forEach((mm, i) => { const r = rects[i]; if (r) drawMass(ctx, r.x, r.y, r.w, r.h, mm); });
        if (st.drag) {
          const mm = MASSES[st.drag.idx], mw = massW(mm, sc), mh = massH(mm, sc);
          ctx.globalAlpha = 0.85; drawMass(ctx, st.drag.px - mw / 2, st.drag.py - mh / 2, mw, mh, mm); ctx.globalAlpha = 1;
          if (inDropZone({ x: st.drag.px, y: st.drag.py }, Ly)) {
            ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = theme.good; ctx.lineWidth = 1.5;
            K.roundRect(ctx, Ly.standX - 80 * sc - 20, Ly.hookY0 - 40, 160 * sc + 40, Ly.trayTop - Ly.hookY0 + 38, 8); ctx.stroke(); ctx.restore();
          }
        }
        // weight arrow on the stack
        if (m > 0 && !st.drag) {
          const last = rects[st.hung[st.hung.length - 1]];
          if (last) {
            const y0 = last.y + last.h + 4, len = K.clamp(14 + m * G * 7, 18, 70);
            if (y0 + len < Ly.trayTop) {
              K.arrow(ctx, Ly.standX, y0, Ly.standX, y0 + len, { color: theme.c2, width: 3, head: 9 });
              K.text(ctx, 'F = m·g = ' + K.fmt(m * G, 2, lang) + ' N', Ly.standX + 10, y0 + len / 2, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
            }
          }
        }
        // header
        K.text(ctx, 'k = ' + K.fmt(st.k, 0, lang) + ' N/m   m = ' + K.fmt(m * 1000, 0, lang) + ' g   F = ' + K.fmt(m * G, 2, lang) + ' N   x = ' + K.fmt(st.x * 100, 1, lang) + ' cm', 12, 12, { font: 'bold 12px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        // force–extension graph
        if (Ly.showChart) {
          const xMaxCm = Math.ceil(MAX_M * G / st.k * 100 / 10) * 10;
          const ch = K.lineChart(ctx, { x: Ly.sceneW + 8, y: 8, w: w - Ly.sceneW - 16, h: h - 16, xMin: 0, xMax: xMaxCm, yMin: 0, yMax: 10, lang, theme,
            xLabel: { en: 'extension x (cm)', hr: 'produljenje x (cm)' }, yLabel: { en: 'force F (N)', hr: 'sila F (N)' },
            series: [{ points: [[0, 0], [xMaxCm, st.k * xMaxCm / 100]], color: theme.c1 }] });
          K.text(ctx, 'F = k·x,  k = ' + K.fmt(st.k, 0, lang) + ' N/m', ch.px + ch.pw - 6, ch.py + 6, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
          // live point slides along the line while the spring bobs
          const lx = K.clamp(st.x * 100, 0, xMaxCm);
          ctx.strokeStyle = theme.c1; ctx.lineWidth = 2; ctx.fillStyle = theme.surface;
          ctx.beginPath(); ctx.arc(ch.sx(lx), ch.sy(st.k * lx / 100), 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          // measured points (equilibrium of each hung mass)
          st.points.forEach(p => {
            const X = ch.sx(Math.min(p[0], xMaxCm)), Y = ch.sy(Math.min(p[1], 10));
            ctx.fillStyle = theme.c2; ctx.beginPath(); ctx.arc(X, Y, 5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = theme.surface; ctx.lineWidth = 2; ctx.stroke();
            K.text(ctx, K.fmt(p[2] * 1000, 0, lang) + ' g', X + 8, Y - 2, { font: '10px ' + theme.font, color: theme.fg, baseline: 'bottom' });
          });
          const kf = kFit();
          if (kf !== null) K.text(ctx, K.tr({ en: 'from the points: k = ', hr: 'iz točaka: k = ' }, lang) + K.fmt(kf, 1, lang) + ' N/m', ch.px + 6, ch.py + 6, { font: '11px ' + theme.font, color: theme.muted, baseline: 'top' });
        }
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() {
          L.destroy();
          cv.canvas.removeEventListener('pointerdown', onDown);
          cv.canvas.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
