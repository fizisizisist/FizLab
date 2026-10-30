/* FizLab sim: Static Electricity — rub a balloon on a sweater and stick it to the wall; two charged balloons on strings. */
(function () {
  'use strict';
  const K = window.SimKit;
  const E_MAX = 30;      // electrons transferred by rubbing (drawn one by one)
  const Q_B = 30;        // charge (in e) one button press gives a hanging balloon
  // two-balloon pendulum model (SI): string 1 m, balloon 3 g, radius 11 cm
  const LM = 1.0, MASS = 0.003, G = 9.81, RB = 0.11, DAMP = 1.3;
  const KC = 5.6e-6;     // "Coulomb-like" constant for our e-units (so 30 e vs 30 e opens ~40°)
  const MIN_ANG = 2 * RB / LM;

  window.Sims.register({
    id: 'static',
    title: { en: 'Static Electricity', hr: 'Statički elektricitet' },
    summary: {
      en: 'Rub a balloon on a wool sweater, watch electrons jump over, and stick the balloon to the wall. Then charge two hanging balloons and see them push apart or pull together.',
      hr: 'Protrljaj balon o vunenu vestu, gledaj kako elektroni prelaze i prilijepi balon na zid. Zatim nabij dva viseća balona i gledaj kako se odbijaju ili privlače.'
    },
    tasks: [
      { en: 'Drag the balloon back and forth over the sweater. Count the − signs on the balloon and the + signs on the sweater. Are they equal?', hr: 'Povuci balon amo-tamo preko veste. Prebroji znakove − na balonu i + na vesti. Jesu li jednaki?' },
      { en: 'Move the charged balloon close to the wall and let go. What happens to the charges inside the wall?', hr: 'Približi nabijeni balon zidu i pusti ga. Što se događa s nabojima u zidu?' },
      { en: 'Two balloons: charge both the same way. Then switch B to the opposite charge. Which way do they swing?', hr: 'Dva balona: nabij oba jednako. Zatim prebaci B na suprotan naboj. Na koju stranu zanjišu?' },
      { en: 'Press "Discharge". Why does the balloon fall off the wall?', hr: 'Pritisni "Isprazni". Zašto balon padne sa zida?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = {
        mode: 'balloon',
        bx: 0, by: 0, vx: 0, vy: 0, q: 0, rub: 0, stuck: false, drag: null, pol: 0, dip: [],
        thA: -MIN_ANG / 2, thB: MIN_ANG / 2, wA: 0, wB: 0, qA: 0, qB: 0, opp: false, F: 0, ux: 1, uy: 0
      };
      for (let i = 0; i < 8; i++) st.dip.push({ v: (i + 0.5) / 8, base: (i * 2.399 + 0.7) % (Math.PI * 2), a: 0 });

      // ---- controls ----
      const segMode = C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: [
        { value: 'balloon', label: { en: 'Balloon and sweater', hr: 'Balon i vesta' } }, { value: 'two', label: { en: 'Two balloons', hr: 'Dva balona' } }],
        value: 'balloon', onChange: v => { st.mode = v; applyMode(); updateOut(); draw(); } });
      const btnA = C.button({ label: { en: 'Charge balloon A (−)', hr: 'Nabij balon A (−)' }, onClick: () => { st.qA = st.qA ? 0 : -Q_B; btnA.setActive(!!st.qA); kick(); } });
      const btnB = C.button({ label: { en: 'Charge balloon B', hr: 'Nabij balon B' }, onClick: () => { st.qB = st.qB ? 0 : (st.opp ? Q_B : -Q_B); btnB.setActive(!!st.qB); kick(); } });
      const tgOpp = C.toggle({ label: { en: 'Opposite charge on B (+)', hr: 'Suprotan naboj na B (+)' }, value: false,
        onChange: v => { st.opp = v; if (st.qB) st.qB = v ? Q_B : -Q_B; kick(); } });
      const btnDis = C.button({ label: { en: 'Discharge', hr: 'Isprazni' }, onClick: () => {
        st.q = 0; st.rub = 0; st.stuck = false; st.qA = 0; st.qB = 0; btnA.setActive(false); btnB.setActive(false); updateOut(); draw(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outQ = C.readout({ label: { en: 'Charge on balloon', hr: 'Naboj balona' } });
      const outQS = C.readout({ label: { en: 'Charge on sweater', hr: 'Naboj veste' } });
      const outState = C.readout({ label: { en: 'Balloon state', hr: 'Stanje balona' } });
      const outAng = C.readout({ label: { en: 'Angle between strings', hr: 'Kut između niti' }, unit: '°', digits: 0 });
      const outQA = C.readout({ label: { en: 'Charge A', hr: 'Naboj A' } });
      const outQB = C.readout({ label: { en: 'Charge B', hr: 'Naboj B' } });
      const note = C.note({ text: '' });

      function show(ctl, on) {
        const el = ctl.el;
        const f = (el.classList && el.classList.contains('sk-field')) ? el : ((el.closest && el.closest('.sk-field')) || el);
        f.style.display = on ? '' : 'none';
      }
      function applyMode() {
        const two = st.mode === 'two';
        [btnA, btnB, tgOpp, outAng, outQA, outQB].forEach(x => show(x, two));
        [outQ, outQS, outState].forEach(x => show(x, !two));
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function kick() { updateOut(); if (!L.running && !ctx.reducedMotion) { L.start(); updatePlay(); } draw(); }
      function fmtQ(q) { return q === 0 ? '0 e' : (q < 0 ? '−' : '+') + Math.abs(q) + ' e'; }
      function updateOut() {
        outQ.set(st.q ? '−' + st.q + ' e' : '0 e');
        outQS.set(st.q ? '+' + st.q + ' e' : '0 e');
        outState.set(st.stuck ? { en: 'stuck to the wall', hr: 'prilijepljen na zid' } : (st.q ? { en: 'charged (negative)', hr: 'nabijen (negativno)' } : { en: 'neutral', hr: 'neutralan' }));
        outState.setColor(st.stuck ? theme.good : '');
        outAng.set((st.thB - st.thA) * 180 / Math.PI);
        outQA.set(fmtQ(st.qA)); outQB.set(fmtQ(st.qB));
        note.set(st.mode === 'balloon'
          ? { en: 'Rubbing moves electrons (−) from the wool to the balloon: the balloon becomes negative, the sweater positive. Near the wall the balloon pushes the wall\'s electrons away, so the + side of the wall faces it and attracts it.',
              hr: 'Trljanjem elektroni (−) prelaze s vune na balon: balon postaje negativan, a vesta pozitivna. Uz zid balon odgurne elektrone zida, pa je prema njemu okrenuta + strana zida koja ga privlači.' }
          : { en: 'Like charges repel, unlike charges attract. The force grows when the charges are bigger and the balloons are closer.',
              hr: 'Istoimeni naboji se odbijaju, raznoimeni se privlače. Sila je veća kad su naboji veći i baloni bliže.' });
      }

      // ---- layout ----
      function layoutA() {
        const w = cv.w, h = cv.h;
        const floor = h - 26;
        const y0 = Math.round(h * 0.2);
        const sw = { x: Math.round(w * 0.05), y: y0, w: Math.round(w * 0.3), h: floor - y0 - 8 };
        const wallX = Math.round(w * 0.86);
        const rx = K.clamp(w * 0.055, 22, 40);
        return { w, h, floor, sw, wall: { x: wallX, w: w - wallX }, rx, ry: rx * 1.25 };
      }
      function reset() {
        const g = layoutA();
        st.q = 0; st.rub = 0; st.stuck = false; st.drag = null; st.vx = 0; st.vy = 0; st.pol = 0;
        st.bx = Math.round(g.w * 0.58); st.by = g.floor - g.ry;
        st.dip.forEach(d => { d.a = d.base; });
        st.qA = 0; st.qB = 0; st.opp = false; tgOpp.set(false); btnA.setActive(false); btnB.setActive(false);
        st.thA = -MIN_ANG / 2; st.thB = MIN_ANG / 2; st.wA = 0; st.wB = 0; st.F = 0;
        updateOut(); draw();
      }

      // ---- physics ----
      function stepA(dt) {
        const g = layoutA();
        const gap = g.wall.x - (st.bx + g.rx);
        st.pol = st.q > 0 ? (st.q / E_MAX) * K.clamp(1 - Math.max(0, gap) / 200, 0, 1) : 0;
        st.dip.forEach(d => { const target = d.base + (Math.PI - d.base) * st.pol; d.a += (target - d.a) * Math.min(1, 10 * dt); });
        if (st.drag) return;
        if (st.stuck) { if (st.q === 0) st.stuck = false; else return; }
        if (st.q > 0 && gap < 170) st.vx += 2400 * (st.q / E_MAX) / (1 + Math.pow(Math.max(0, gap) / 45, 2)) * dt;
        else st.vx *= Math.max(0, 1 - 4 * dt);
        st.vy = Math.min(st.vy + 420 * dt, 170);                 // a balloon falls slowly
        st.bx += st.vx * dt; st.by += st.vy * dt;
        if (st.by > g.floor - g.ry) { st.by = g.floor - g.ry; st.vy = 0; st.vx *= 0.8; }
        if (st.bx + g.rx >= g.wall.x) { st.bx = g.wall.x - g.rx; st.vx = 0; if (st.q > 0) { st.stuck = true; st.vy = 0; } }
        if (st.bx - g.rx < 0) { st.bx = g.rx; st.vx = 0; }
      }
      function stepB(dt) {
        const n = 4, hdt = dt / n;
        for (let i = 0; i < n; i++) {
          const xA = LM * Math.sin(st.thA), yA = -LM * Math.cos(st.thA), xB = LM * Math.sin(st.thB), yB = -LM * Math.cos(st.thB);
          const dx = xB - xA, dy = yB - yA; let d = Math.hypot(dx, dy);
          let ux = 1, uy = 0; if (d > 1e-6) { ux = dx / d; uy = dy / d; }
          d = Math.max(d, 2 * RB);
          const F = KC * st.qA * st.qB / (d * d);                  // > 0 : repulsion
          st.F = F; st.ux = ux; st.uy = uy;
          const FtA = -F * (ux * Math.cos(st.thA) + uy * Math.sin(st.thA));
          const FtB = F * (ux * Math.cos(st.thB) + uy * Math.sin(st.thB));
          const aA = (-MASS * G * Math.sin(st.thA) + FtA) / (MASS * LM) - DAMP * st.wA;
          const aB = (-MASS * G * Math.sin(st.thB) + FtB) / (MASS * LM) - DAMP * st.wB;
          st.wA += aA * hdt; st.wB += aB * hdt; st.thA += st.wA * hdt; st.thB += st.wB * hdt;
          if (st.thB - st.thA < MIN_ANG) {                          // balloons touch, cannot pass through each other
            const mid = (st.thA + st.thB) / 2, wm = (st.wA + st.wB) / 2;
            st.thA = mid - MIN_ANG / 2; st.thB = mid + MIN_ANG / 2; st.wA = wm; st.wB = wm;
          }
        }
      }

      // ---- drawing helpers ----
      function drawCharge(c, x, y, sign, r) {
        c.fillStyle = sign > 0 ? theme.c8 : theme.c1;
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
        c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(1.2, r * 0.26); c.lineCap = 'round';
        c.beginPath(); c.moveTo(x - r * 0.5, y); c.lineTo(x + r * 0.5, y);
        if (sign > 0) { c.moveTo(x, y - r * 0.5); c.lineTo(x, y + r * 0.5); }
        c.stroke();
      }
      function spiral(i, n) { const rr = Math.sqrt((i + 0.5) / n) * 0.8, a = i * 2.39996; return [rr * Math.cos(a), rr * Math.sin(a)]; }
      function drawBalloon(c, x, y, rx, ry, color, q, label) {
        c.save();
        c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill();
        c.strokeStyle = K.withAlpha(theme.fg, 0.5); c.lineWidth = 1.5; c.stroke();
        c.fillStyle = K.withAlpha('#ffffff', 0.35); c.beginPath(); c.ellipse(x - rx * 0.35, y - ry * 0.4, rx * 0.22, ry * 0.3, -0.4, 0, Math.PI * 2); c.fill();
        c.fillStyle = color; c.beginPath(); c.moveTo(x - 5, y + ry + 6); c.lineTo(x + 5, y + ry + 6); c.lineTo(x, y + ry - 2); c.closePath(); c.fill();
        const n = Math.min(E_MAX, Math.abs(q));
        for (let i = 0; i < n; i++) { const p = spiral(i, E_MAX); drawCharge(c, x + p[0] * rx, y + p[1] * ry, q > 0 ? 1 : -1, Math.max(4, rx * 0.17)); }
        c.restore();
        if (label) K.text(c, label, x, y - ry - 9, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function drawSweater(c, s) {
        c.save();
        c.fillStyle = theme.c2;
        K.roundRect(c, s.x, s.y + s.h * 0.1, s.w, s.h * 0.9, 10); c.fill();                           // body
        K.roundRect(c, s.x - s.w * 0.12, s.y + s.h * 0.12, s.w * 0.18, s.h * 0.5, 8); c.fill();      // sleeves
        K.roundRect(c, s.x + s.w * 0.94, s.y + s.h * 0.12, s.w * 0.18, s.h * 0.5, 8); c.fill();
        c.beginPath(); c.ellipse(s.x + s.w / 2, s.y + s.h * 0.1, s.w * 0.22, s.h * 0.1, 0, 0, Math.PI * 2); c.fill(); // neck
        c.strokeStyle = K.withAlpha(theme.fg, 0.14); c.lineWidth = 1;                                   // knit texture
        for (let y = s.y + s.h * 0.2; y < s.y + s.h; y += 9) {
          c.beginPath();
          for (let x = s.x + 4; x <= s.x + s.w - 4; x += 6) c.lineTo(x, y + ((x / 6) % 2 ? 2 : -2));
          c.stroke();
        }
        c.restore();
        const cx = s.x + s.w / 2, cy = s.y + s.h * 0.55;
        for (let i = 0; i < st.q; i++) { const p = spiral(i, E_MAX); drawCharge(c, cx + p[0] * s.w * 0.5, cy + p[1] * s.h * 0.42, 1, 5.5); }
      }

      function drawA() {
        const c = cv.ctx, g = layoutA(), w = g.w, h = g.h;
        c.fillStyle = theme.ground; c.fillRect(0, g.floor, w, h - g.floor);
        drawSweater(c, g.sw);
        K.text(c, K.tr({ en: 'Sweater (wool)', hr: 'Vesta (vuna)' }, lang), g.sw.x + g.sw.w / 2, g.sw.y - 12, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        // wall with bricks
        c.fillStyle = theme.surface2; c.fillRect(g.wall.x, 0, g.wall.w, g.floor);
        c.save(); c.strokeStyle = theme.line; c.lineWidth = 1; c.beginPath();
        for (let y = 0; y < g.floor; y += 26) { c.moveTo(g.wall.x, y); c.lineTo(w, y); }
        c.moveTo(g.wall.x + 0.5, 0); c.lineTo(g.wall.x + 0.5, g.floor); c.stroke(); c.restore();
        K.text(c, K.tr({ en: 'Wall', hr: 'Zid' }, lang), g.wall.x + g.wall.w / 2, 14, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        // charge pairs inside the wall rotate so + faces the balloon
        const dx0 = g.wall.x + Math.min(24, g.wall.w / 2), rr = 7;
        st.dip.forEach(d => {
          const cy = 34 + d.v * (g.floor - 64);
          c.strokeStyle = K.withAlpha(theme.fg, 0.35); c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(dx0 - Math.cos(d.a) * rr, cy - Math.sin(d.a) * rr); c.lineTo(dx0 + Math.cos(d.a) * rr, cy + Math.sin(d.a) * rr); c.stroke();
          drawCharge(c, dx0 + Math.cos(d.a) * rr, cy + Math.sin(d.a) * rr, 1, 5);
          drawCharge(c, dx0 - Math.cos(d.a) * rr, cy - Math.sin(d.a) * rr, -1, 5);
        });
        // attraction arrow
        const gap = g.wall.x - (st.bx + g.rx);
        if (st.q > 0 && !st.stuck && gap < 170 && gap > 12) {
          const len = Math.min(gap - 6, 18 + 50 * (st.q / E_MAX) * (1 - gap / 170));
          K.arrow(c, st.bx + g.rx + 3, st.by, st.bx + g.rx + 3 + len, st.by, { color: theme.c2, width: 3, head: 9 });
          K.text(c, 'F', st.bx + g.rx + 6 + len / 2, st.by - 10, { font: 'bold italic 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        }
        drawBalloon(c, st.bx, st.by, g.rx, g.ry, theme.c3, -st.q, K.tr({ en: 'Balloon', hr: 'Balon' }, lang));
        // status line
        const stateTxt = st.stuck ? { en: 'stuck to the wall', hr: 'prilijepljen na zid' } : (st.q ? { en: 'charged', hr: 'nabijen' } : { en: 'neutral', hr: 'neutralan' });
        K.text(c, K.tr({ en: 'Balloon: ', hr: 'Balon: ' }, lang) + fmtQ(-st.q) + '   ' + K.tr({ en: 'Sweater: ', hr: 'Vesta: ' }, lang) + fmtQ(st.q) + '   (' + K.tr(stateTxt, lang) + ')',
          12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr(st.q ? { en: 'Hold the balloon near the wall and let go.', hr: 'Prinesi balon zidu i pusti ga.' } : { en: 'Drag the balloon over the sweater to rub it.', hr: 'Povuci balon preko veste da ga protrljaš.' }, lang),
          12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }
      function drawB() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        const px = w / 2, py = 30;
        const Lpx = Math.min(h - py - 60, w * 0.45), pxm = Lpx / LM;
        const rx = RB * pxm, ry = rx * 1.15;
        const xA = px + Lpx * Math.sin(st.thA), yA = py + Lpx * Math.cos(st.thA);
        const xB = px + Lpx * Math.sin(st.thB), yB = py + Lpx * Math.cos(st.thB);
        // ceiling and strings
        c.save(); c.strokeStyle = theme.fg; c.lineWidth = 3; c.beginPath(); c.moveTo(px - 60, py); c.lineTo(px + 60, py); c.stroke();
        c.lineWidth = 1.5; c.strokeStyle = theme.muted; c.beginPath(); c.moveTo(px, py); c.lineTo(xA, yA - ry); c.moveTo(px, py); c.lineTo(xB, yB - ry); c.stroke();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(px, py, 4, 0, Math.PI * 2); c.fill(); c.restore();
        // angle arc
        const a0 = Math.PI / 2 - st.thB, a1 = Math.PI / 2 - st.thA;
        c.save(); c.strokeStyle = theme.c2; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 44, a0, a1); c.stroke(); c.restore();
        K.text(c, 'α = ' + K.fmt((st.thB - st.thA) * 180 / Math.PI, 0, lang) + '°', px, py + 60, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        // forces
        if (st.qA && st.qB && Math.abs(st.F) > 1e-6) {
          const sat = Math.abs(st.F) / (Math.abs(st.F) + MASS * G * 0.3), len = 16 + 44 * sat, s = st.F > 0 ? -1 : 1;
          K.arrow(c, xA + s * st.ux * (rx + 2), yA + s * st.uy * (rx + 2), xA + s * st.ux * (rx + 2 + len), yA + s * st.uy * (rx + 2 + len), { color: theme.c2, width: 3, head: 9 });
          K.arrow(c, xB - s * st.ux * (rx + 2), yB - s * st.uy * (rx + 2), xB - s * st.ux * (rx + 2 + len), yB - s * st.uy * (rx + 2 + len), { color: theme.c2, width: 3, head: 9 });
          K.text(c, 'F', (xA + xB) / 2, Math.max(yA, yB) + ry + 16, { font: 'bold italic 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        }
        drawBalloon(c, xA, yA, rx, ry, theme.c3, st.qA, null);
        drawBalloon(c, xB, yB, rx, ry, theme.c7, st.qB, null);
        K.text(c, 'A', xA, yA + ry + 14, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, 'B', xB, yB + ry + 14, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        const act = !st.qA || !st.qB ? { en: 'Charge both balloons.', hr: 'Nabij oba balona.' } : (st.F > 0 ? { en: 'Like charges repel.', hr: 'Istoimeni naboji se odbijaju.' } : { en: 'Unlike charges attract.', hr: 'Raznoimeni naboji se privlače.' });
        K.text(c, 'A: ' + fmtQ(st.qA) + '   B: ' + fmtQ(st.qB) + '   ' + K.tr(act, lang), 12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'Like charges repel, unlike charges attract.', hr: 'Istoimeni naboji se odbijaju, raznoimeni privlače.' }, lang), w / 2, h - 10, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function draw() {
        const c = cv.ctx; c.clearRect(0, 0, cv.w, cv.h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, cv.w, cv.h);
        if (st.mode === 'balloon') drawA(); else drawB();
      }

      // ---- pointer: drag the balloon ----
      function hitBalloon(p, g) { const dx = (p.x - st.bx) / g.rx, dy = (p.y - st.by) / g.ry; return dx * dx + dy * dy <= 1.3; }
      const onDown = ev => {
        if (st.mode !== 'balloon') return;
        const p = cv.pointer(ev), g = layoutA();
        if (hitBalloon(p, g)) { ev.preventDefault(); st.drag = { ox: st.bx - p.x, oy: st.by - p.y, lx: p.x, ly: p.y }; st.stuck = false; st.vx = 0; st.vy = 0; updateOut(); if (!L.running) draw(); }
      };
      const onMove = ev => {
        if (st.mode !== 'balloon') return;
        const p = cv.pointer(ev), g = layoutA();
        if (!st.drag) { cv.canvas.style.cursor = hitBalloon(p, g) ? 'grab' : 'default'; return; }
        cv.canvas.style.cursor = 'grabbing';
        const nx = K.clamp(p.x + st.drag.ox, g.rx, g.wall.x - g.rx), ny = K.clamp(p.y + st.drag.oy, g.ry, g.floor - g.ry);
        const moved = Math.hypot(p.x - st.drag.lx, p.y - st.drag.ly);
        st.drag.lx = p.x; st.drag.ly = p.y;
        const s = g.sw;
        const over = nx + g.rx > s.x + 6 && nx - g.rx < s.x + s.w - 6 && ny + g.ry > s.y + 6 && ny - g.ry < s.y + s.h - 6;
        if (over) { st.rub += moved; while (st.rub >= 16 && st.q < E_MAX) { st.q++; st.rub -= 16; } if (st.q >= E_MAX) st.rub = 0; }
        st.bx = nx; st.by = ny;
        updateOut(); if (!L.running) draw();
      };
      const onUp = () => {
        if (!st.drag) return;
        st.drag = null; cv.canvas.style.cursor = 'default';
        const g = layoutA();
        if (st.q > 0 && st.bx + g.rx >= g.wall.x - 2) st.stuck = true;
        updateOut(); if (!L.running) draw();
      };
      cv.canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      const L = K.loop(dt => { if (st.mode === 'balloon') stepA(dt); else stepB(dt); updateOut(); draw(); });
      cv.onResize(() => { const g = layoutA(); st.bx = K.clamp(st.bx, g.rx, g.wall.x - g.rx); st.by = K.clamp(st.by, g.ry, g.floor - g.ry); draw(); });
      applyMode();
      reset();
      if (!ctx.reducedMotion) L.start();
      updatePlay();
      return {
        destroy() {
          L.destroy(); cv.canvas.removeEventListener('pointerdown', onDown);
          window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
