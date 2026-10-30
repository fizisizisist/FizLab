/* FizLab sim: Balancing Act — torque on a beam (drag weights onto marks) and "Lift the rock" with a movable fulcrum. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, HALF = 2, MARK = 0.25, MAX_TILT = 15 * Math.PI / 180, BEAM_I = 6.7; // beam: 4 m, 5 kg
  const TYPES = [
    { id: 'w1', m: 1, color: 'c1', label: { en: '1 kg', hr: '1 kg' }, w: 20, h: 20 },
    { id: 'w2', m: 2, color: 'c2', label: { en: '2 kg', hr: '2 kg' }, w: 22, h: 22 },
    { id: 'w5', m: 5, color: 'c3', label: { en: '5 kg', hr: '5 kg' }, w: 25, h: 25 },
    { id: 'w10', m: 10, color: 'c4', label: { en: '10 kg', hr: '10 kg' }, w: 28, h: 28 },
    { id: 'child', m: 30, color: 'c5', label: { en: 'child', hr: 'dijete' }, w: 20, h: 42, figure: true },
    { id: 'adult', m: 70, color: 'c6', label: { en: 'adult', hr: 'odrasli' }, w: 24, h: 56, figure: true }
  ];

  window.Sims.register({
    id: 'lever',
    title: { en: 'Balancing Act', hr: 'Ravnoteža na poluzi' },
    summary: {
      en: 'Drag weights onto a 4 m beam and balance the torques, then move the fulcrum to lift a heavy rock with a small push.',
      hr: 'Povuci utege na gredu od 4 m i uravnoteži momente sila, zatim pomakni oslonac i podigni težak kamen malom silom.'
    },
    tasks: [
      { en: 'Put 2 kg at 1 m on the left. Where must 1 kg go on the right to balance it?', hr: 'Stavi 2 kg na 1 m lijevo. Gdje mora stajati 1 kg desno da bude ravnoteža?' },
      { en: 'Balance the adult (70 kg) with the child (30 kg). Unlock the beam to check.', hr: 'Uravnoteži odraslu osobu (70 kg) djetetom (30 kg). Otključaj gredu i provjeri.' },
      { en: 'Lift the rock: set the rock to 1000 N. Move the fulcrum until a push of 200 N is enough.', hr: 'Podigni kamen: postavi kamen na 1000 N. Pomiči oslonac dok 200 N pritiska ne bude dovoljno.' },
      { en: 'Compare: d₂ / d₁ = 3 means the needed force is 3 times smaller than the rock\'s weight. Is that right?', hr: 'Usporedi: d₂ / d₁ = 3 znači da je potrebna sila 3 puta manja od težine kamena. Vrijedi li to?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 300, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'balance', weights: [], theta: 0, omega: 0, locked: true, drag: null,
        s: 1, Frock: 500, push: 0, phi: 0, lifted: false };

      // ---------- controls ----------
      const seg = C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: [
        { value: 'balance', label: { en: 'Balance', hr: 'Ravnoteža' } }, { value: 'rock', label: { en: 'Lift the rock', hr: 'Podigni kamen' } }], value: 'balance', onChange: setMode });
      const tgLock = C.toggle({ label: { en: 'Lock beam (level)', hr: 'Zaključaj gredu (vodoravno)' }, value: true, onChange: v => { st.locked = v; st.omega = 0; refresh(); } });
      const btnClear = C.button({ label: { en: 'Clear weights', hr: 'Makni utege' }, onClick: () => { st.weights.length = 0; st.omega = 0; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, onClick: () => { L.toggle(); updatePlay(); } });
      const slS = C.slider({ label: { en: 'Fulcrum position (from the rock)', hr: 'Položaj oslonca (od kamena)' }, min: 0.2, max: 3.8, step: 0.1, value: 1, unit: 'm', digits: 1, onChange: v => { st.s = v; refresh(); } });
      const slRock = C.slider({ label: { en: 'Rock weight F₁', hr: 'Težina kamena F₁' }, min: 100, max: 2000, step: 10, value: 500, unit: 'N', digits: 0, onChange: v => { st.Frock = v; refresh(); } });
      const slPush = C.slider({ label: { en: 'Your push F₂', hr: 'Tvoj pritisak F₂' }, min: 0, max: 1000, step: 10, value: 0, unit: 'N', digits: 0, onChange: v => { st.push = v; refresh(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: reset });
      const outL = C.readout({ label: { en: 'Left torque', hr: 'Lijevi moment' }, unit: 'N·m', digits: 1 });
      const outR = C.readout({ label: { en: 'Right torque', hr: 'Desni moment' }, unit: 'N·m', digits: 1 });
      const outDiff = C.readout({ label: { en: 'Difference (right − left)', hr: 'Razlika (desno − lijevo)' }, unit: 'N·m', digits: 1 });
      const outNeed = C.readout({ label: { en: 'Force needed', hr: 'Potrebna sila' }, unit: 'N', digits: 0 });
      const outAdv = C.readout({ label: { en: 'Lever advantage d₂ / d₁', hr: 'Prijenos poluge d₂ / d₁' }, unit: '×', digits: 2 });
      const outStatus = C.readout({ label: { en: 'Status', hr: 'Stanje' } });
      const note = C.note({ text: { en: '', hr: '' } });
      function fieldOf(ctrl) { const el = ctrl.el; return el.classList.contains('sk-field') ? el : el.parentElement; }
      const balEls = [tgLock, btnClear, outL, outR, outDiff].map(fieldOf);
      const rockEls = [slS, slRock, slPush, outNeed, outAdv].map(fieldOf);

      // ---------- physics ----------
      function torques() {
        let Lt = 0, Rt = 0, I = BEAM_I;
        st.weights.forEach(wt => { const M = wt.type.m * G * Math.abs(wt.d); I += wt.type.m * wt.d * wt.d; if (wt.d < 0) Lt += M; else if (wt.d > 0) Rt += M; });
        return { L: Lt, R: Rt, diff: Rt - Lt, I };
      }
      function needed() { return st.Frock * st.s / (4 - st.s); }
      function restPhi() { return Math.asin(Math.min(1, fulcrumH() / st.s)); }
      function fulcrumH() { return Math.min(0.3, st.s * Math.sin(50 * Math.PI / 180)); }
      function liftPhi() { return -Math.min(8 * Math.PI / 180, Math.asin(K.clamp((fulcrumH() - 0.03) / (4 - st.s), 0, 1))); }
      function step(dt) {
        if (st.mode === 'balance') {
          const t = torques();
          if (st.locked || Math.abs(t.diff) < 0.01) { st.theta += (0 - st.theta) * Math.min(1, 6 * dt); st.omega = 0; return; }
          const alpha = t.diff / t.I - 1.5 * st.omega;
          st.omega += alpha * dt; st.theta += st.omega * dt;
          if (st.theta > MAX_TILT) { st.theta = MAX_TILT; if (st.omega > 0) st.omega = 0; }
          if (st.theta < -MAX_TILT) { st.theta = -MAX_TILT; if (st.omega < 0) st.omega = 0; }
        } else {
          st.lifted = st.push > 0 && st.push >= needed() - 1e-9;
          const target = st.lifted ? liftPhi() : restPhi();
          st.phi += (target - st.phi) * Math.min(1, 4 * dt);
        }
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { updateOut(); draw(); }
      function setMode(v) {
        st.mode = v; st.drag = null; cv.canvas.style.cursor = 'default';
        balEls.forEach(e => { e.style.display = v === 'balance' ? '' : 'none'; });
        rockEls.forEach(e => { e.style.display = v === 'rock' ? '' : 'none'; });
        if (v === 'rock') { st.lifted = st.push > 0 && st.push >= needed(); st.phi = st.lifted ? liftPhi() : restPhi(); }
        refresh();
      }
      function updateOut() {
        if (st.mode === 'balance') {
          const t = torques();
          outL.set(t.L); outR.set(t.R); outDiff.set(t.diff);
          if (!st.weights.length) { outStatus.set({ en: 'empty beam', hr: 'prazna greda' }); outStatus.setColor(''); }
          else if (Math.abs(t.diff) < 0.01) { outStatus.set({ en: 'balanced', hr: 'u ravnoteži' }); outStatus.setColor(theme.good); }
          else { outStatus.set(t.diff > 0 ? { en: 'tilts right', hr: 'naginje se udesno' } : { en: 'tilts left', hr: 'naginje se ulijevo' }); outStatus.setColor(theme.warn); }
          note.set(st.locked
            ? { en: 'Torque = force × distance from the pivot (M = F · d). The beam balances when the left and right torques are equal. Unlock it to test!', hr: 'Moment sile = sila × udaljenost od oslonca (M = F · d). Greda je u ravnoteži kad su lijevi i desni moment jednaki. Otključaj je i provjeri!' }
            : { en: 'A small weight far from the pivot can balance a big weight close to it: 1 kg at 2 m balances 2 kg at 1 m.', hr: 'Mali uteg daleko od oslonca može uravnotežiti veliki uteg blizu njega: 1 kg na 2 m uravnoteži 2 kg na 1 m.' });
        } else {
          const need = needed();
          outNeed.set(need); outAdv.set((4 - st.s) / st.s);
          const lifted = st.push > 0 && st.push >= need - 1e-9;
          st.lifted = lifted; // keep the canvas status in sync even while paused
          outStatus.set(lifted ? { en: 'the rock lifts!', hr: 'kamen se diže!' } : { en: 'not enough force', hr: 'premala sila' }); outStatus.setColor(lifted ? theme.good : theme.warn);
          note.set({ en: 'F₁ · d₁ = F₂ · d₂. The longer your side of the lever (d₂), the smaller the force you need — but you push through a longer path.',
            hr: 'F₁ · d₁ = F₂ · d₂. Što je tvoja strana poluge (d₂) dulja, to manja sila treba — ali guraš dulji put.' });
        }
      }

      // ---------- balance layout + geometry ----------
      function layoutB() {
        const w = cv.w, h = cv.h, trayH = 78, trayTop = h - trayH;
        const px = w / 2, py = Math.round(trayTop * 0.6);
        const pxm = Math.min(w * 0.46 / HALF, (trayTop - py - 14) / (HALF * Math.sin(MAX_TILT)));
        return { w, h, trayTop, px, py, pxm, beamH: 10 };
      }
      function stackOffsets() {
        const seen = {}, out = [];
        st.weights.forEach(wt => { const k = String(wt.d); out.push(seen[k] || 0); seen[k] = (seen[k] || 0) + wt.type.h; });
        return out;
      }
      function toWorld(Lo, lx, ly) {
        const c = Math.cos(st.theta), s = Math.sin(st.theta);
        return { x: Lo.px + lx * c - ly * s, y: Lo.py + lx * s + ly * c };
      }
      function weightCentre(Lo, i, offs) {
        const wt = st.weights[i];
        return toWorld(Lo, wt.d * Lo.pxm, -Lo.beamH / 2 - offs[i] - wt.type.h / 2);
      }
      function trayPos(Lo, i) { return { x: (i + 0.5) * Lo.w / TYPES.length, y: Lo.trayTop + 44 }; }
      function inRect(p, cx, cy, w, h) { return Math.abs(p.x - cx) <= w / 2 + 5 && Math.abs(p.y - cy) <= h / 2 + 5; }
      function snapFor(p, Lo) {
        const dx = p.x - Lo.px, dy = p.y - Lo.py, c = Math.cos(st.theta), s = Math.sin(st.theta);
        const lx = dx * c + dy * s, ly = -dx * s + dy * c, d = lx / Lo.pxm;
        if (Math.abs(d) > HALF + 0.15 || ly < -130 || ly > 40) return null;
        return K.clamp(Math.round(d / MARK) * MARK, -HALF, HALF);
      }

      // ---------- pointer ----------
      function onDown(ev) {
        if (st.mode !== 'balance') return;
        const p = cv.pointer(ev), Lo = layoutB(), offs = stackOffsets();
        for (let i = st.weights.length - 1; i >= 0; i--) {
          const cpos = weightCentre(Lo, i, offs), t = st.weights[i].type;
          if (inRect(p, cpos.x, cpos.y, t.w, t.h)) { st.drag = { type: t, x: p.x, y: p.y, snap: snapFor(p, Lo) }; st.weights.splice(i, 1); break; }
        }
        if (!st.drag) TYPES.forEach((t, i) => { const tp = trayPos(Lo, i); if (!st.drag && inRect(p, tp.x, tp.y - t.h / 2, t.w, t.h)) st.drag = { type: t, x: p.x, y: p.y, snap: null }; });
        if (!st.drag) return;
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault(); st.omega = 0; refresh();
      }
      function onMove(ev) {
        if (st.mode !== 'balance') return;
        const p = cv.pointer(ev), Lo = layoutB();
        if (st.drag) { st.drag.x = p.x; st.drag.y = p.y; st.drag.snap = snapFor(p, Lo); draw(); return; }
        const offs = stackOffsets();
        let over = st.weights.some((wt, i) => { const c = weightCentre(Lo, i, offs); return inRect(p, c.x, c.y, wt.type.w, wt.type.h); });
        if (!over) over = TYPES.some((t, i) => { const tp = trayPos(Lo, i); return inRect(p, tp.x, tp.y - t.h / 2, t.w, t.h); });
        cv.canvas.style.cursor = over ? 'grab' : 'default';
      }
      function onUp() {
        if (!st.drag) return;
        if (st.drag.snap !== null) st.weights.push({ type: st.drag.type, d: st.drag.snap });
        st.drag = null; cv.canvas.style.cursor = 'default'; refresh();
      }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing ----------
      function drawWeight(c, t, cx, bottom, ghost) {
        const col = theme[t.color];
        c.save(); if (ghost) c.globalAlpha = 0.5;
        if (t.figure) {
          const bodyH = t.h * 0.62, headR = t.w * 0.42;
          c.fillStyle = col; K.roundRect(c, cx - t.w / 2, bottom - bodyH, t.w, bodyH, 5); c.fill();
          c.beginPath(); c.arc(cx, bottom - bodyH - headR - 2, headR, 0, Math.PI * 2); c.fill();
          K.text(c, K.fmt(t.m, 0, lang), cx, bottom - bodyH / 2, { font: 'bold 10px ' + theme.font, color: theme.surface, align: 'center', baseline: 'middle' });
        } else {
          c.fillStyle = col; K.roundRect(c, cx - t.w / 2, bottom - t.h, t.w, t.h, 4); c.fill();
          c.fillStyle = K.withAlpha(theme.fg, 0.35); c.fillRect(cx - 4, bottom - t.h - 3, 8, 3);
          K.text(c, K.fmt(t.m, 0, lang), cx, bottom - t.h / 2, { font: 'bold ' + (t.m >= 10 ? 10 : 11) + 'px ' + theme.font, color: theme.surface, align: 'center', baseline: 'middle' });
        }
        c.restore();
      }
      function drawBalance(c, Lo) {
        const { w, h, trayTop, px, py, pxm, beamH } = Lo;
        c.fillStyle = theme.ground; c.fillRect(0, trayTop - 6, w, h - trayTop + 6);
        c.fillStyle = K.withAlpha(theme.fg, theme.isDark ? 0.12 : 0.06); c.fillRect(0, trayTop, w, h - trayTop);
        K.text(c, K.tr({ en: 'Drag weights onto the beam · drag off to remove', hr: 'Povuci utege na gredu · povuci dolje da ih makneš' }, lang), w / 2, trayTop + 10, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        TYPES.forEach((t, i) => { const tp = trayPos(Lo, i); drawWeight(c, t, tp.x, tp.y, false); K.text(c, K.tr(t.label, lang), tp.x, tp.y + 12, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' }); });
        // fulcrum
        c.fillStyle = theme.muted; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 26, trayTop - 6); c.lineTo(px + 26, trayTop - 6); c.closePath(); c.fill();
        // beam (rotated)
        c.save(); c.translate(px, py); c.rotate(st.theta);
        c.fillStyle = theme.c4; K.roundRect(c, -HALF * pxm - 6, -beamH / 2, 2 * HALF * pxm + 12, beamH, 4); c.fill();
        c.strokeStyle = K.withAlpha(theme.fg, 0.5); c.lineWidth = 1; K.roundRect(c, -HALF * pxm - 6, -beamH / 2, 2 * HALF * pxm + 12, beamH, 4); c.stroke();
        c.strokeStyle = theme.fg; c.lineWidth = 1;
        for (let d = -HALF; d <= HALF + 1e-9; d += MARK) {
          const x = d * pxm, major = Math.abs(d - Math.round(d)) < 1e-9;
          c.beginPath(); c.moveTo(x, beamH / 2); c.lineTo(x, beamH / 2 + (major ? 7 : 4)); c.stroke();
          if (major) K.text(c, d === 0 ? '0' : K.fmt(Math.abs(d), 0, lang) + ' m', x, beamH / 2 + 10, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        }
        const offs = stackOffsets();
        st.weights.forEach((wt, i) => drawWeight(c, wt.type, wt.d * pxm, -beamH / 2 - offs[i], false));
        if (st.drag && st.drag.snap !== null) { const t = st.drag.type, k = String(st.drag.snap), o = st.weights.reduce((a, wt) => a + (String(wt.d) === k ? wt.type.h : 0), 0); drawWeight(c, t, st.drag.snap * pxm, -beamH / 2 - o, true); }
        c.restore();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(px, py, 4, 0, Math.PI * 2); c.fill();
        // force arrows (vertical in the world)
        st.weights.forEach((wt, i) => {
          const cpos = weightCentre(Lo, i, offs), F = wt.type.m * G, len = 10 + 60 * (wt.type.m / 70); // length ∝ weight
          K.arrow(c, cpos.x, cpos.y, cpos.x, cpos.y + len, { color: theme.c8, width: 2.5, head: 8 });
          K.text(c, K.fmt(F, 0, lang) + ' N', cpos.x + 6, cpos.y + len - 2, { font: 'bold 10px ' + theme.font, color: theme.fg, baseline: 'middle' });
        });
        if (st.drag) drawWeight(c, st.drag.type, st.drag.x, st.drag.y + st.drag.type.h / 2, false);
        // formula box
        const t = torques(), bw = Math.min(250, w - 16), small = w < 560;
        c.fillStyle = theme.surface; K.roundRect(c, 8, 8, bw, small ? 66 : 84, 10); c.fill();
        const fN = (small ? 11 : 13) + 'px ' + theme.font, lh = small ? 16 : 20;
        let y = 26;
        K.text(c, K.tr({ en: 'Torque', hr: 'Moment sile' }, lang) + '   M = F · d', 20, y, { font: 'bold ' + (small ? 13 : 15) + 'px ' + theme.fontDisplay, color: theme.fg }); y += lh;
        K.text(c, 'M_L = ' + K.fmt(t.L, 1, lang) + ' N·m    M_R = ' + K.fmt(t.R, 1, lang) + ' N·m', 20, y, { font: fN, color: theme.fg }); y += lh;
        const balanced = st.weights.length && Math.abs(t.diff) < 0.01;
        c.fillStyle = !st.weights.length ? theme.muted : balanced ? theme.good : theme.warn; c.beginPath(); c.arc(25, y - 4, 5, 0, Math.PI * 2); c.fill();
        K.text(c, K.tr(!st.weights.length ? { en: 'place a weight', hr: 'stavi uteg' } : balanced ? { en: 'balanced: M_L = M_R', hr: 'ravnoteža: M_L = M_R' } : t.diff > 0 ? { en: 'M_R is bigger → tilts right', hr: 'M_R je veći → naginje udesno' } : { en: 'M_L is bigger → tilts left', hr: 'M_L je veći → naginje ulijevo' }, lang), 36, y, { font: fN, color: theme.fg });
        if (st.locked) K.text(c, K.tr({ en: 'beam locked', hr: 'greda zaključana' }, lang), w - 10, 16, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
      }
      function drawRock(c) {
        const w = cv.w, h = cv.h, groundY = h - 44;
        const pxm = Math.min(w * 0.88 / 4, (groundY - 70) / 1.7);
        const x0 = (w - 4 * pxm) / 2, fx = x0 + st.s * pxm, fh = fulcrumH() * pxm, fy = groundY - fh;
        const cs = Math.cos(st.phi), sn = Math.sin(st.phi), d1 = st.s, d2 = 4 - st.s;
        const left = { x: fx - d1 * pxm * cs, y: fy + d1 * pxm * sn }, right = { x: fx + d2 * pxm * cs, y: fy - d2 * pxm * sn };
        c.fillStyle = theme.ground; c.fillRect(0, groundY, w, h - groundY);
        c.fillStyle = theme.muted; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx - 14, groundY); c.lineTo(fx + 14, groundY); c.closePath(); c.fill();
        // bar
        c.strokeStyle = theme.c4; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(left.x, left.y); c.lineTo(right.x, right.y); c.stroke();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(fx, fy, 4, 0, Math.PI * 2); c.fill();
        // rock riding on the left end
        const r = 12 + 20 * Math.sqrt(st.Frock / 2000), rx = left.x + 8 * sn, ry = left.y - 5 - r * 0.8 * cs;
        c.fillStyle = theme.muted; c.beginPath();
        for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2, rr = r * (0.8 + 0.2 * ((k * 7) % 3) / 2); c.lineTo(rx + rr * Math.cos(a), ry + rr * 0.8 * Math.sin(a)); }
        c.closePath(); c.fill(); c.strokeStyle = K.withAlpha(theme.fg, 0.5); c.lineWidth = 1.5; c.stroke();
        K.arrow(c, rx, ry, rx, ry + 22 + 40 * st.Frock / 2000, { color: theme.c8, width: 3, head: 9 });
        K.text(c, 'F₁ = ' + K.fmt(st.Frock, 0, lang) + ' N', rx + r + 6, ry + 6, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        // person pushing at the right end
        const need = needed(), pushLen = 10 + 60 * Math.min(1, st.push / 1000);
        const hx = right.x + 2, hy = right.y;
        c.strokeStyle = theme.c1; c.lineWidth = 4; c.lineCap = 'round';
        const footX = Math.min(w - 20, hx + 26), headY = Math.min(hy - 30, groundY - 70);
        c.beginPath(); c.moveTo(footX, groundY); c.lineTo(footX, headY + 14); c.moveTo(footX, headY + 24); c.lineTo(hx, hy - 6); c.stroke();
        c.fillStyle = theme.c1; c.beginPath(); c.arc(footX, headY, 9, 0, Math.PI * 2); c.fill();
        if (st.push > 0) K.arrow(c, hx, hy - pushLen - 10, hx, hy - 6, { color: theme.c2, width: 3, head: 9 });
        K.text(c, 'F₂ = ' + K.fmt(st.push, 0, lang) + ' N', hx - 8, hy - pushLen - 18, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        // dimension lines
        const dy = groundY + 14;
        c.strokeStyle = theme.fg; c.lineWidth = 1; c.beginPath();
        c.moveTo(x0, dy); c.lineTo(fx, dy); c.moveTo(fx, dy); c.lineTo(x0 + 4 * pxm, dy);
        [x0, fx, x0 + 4 * pxm].forEach(x => { c.moveTo(x, dy - 5); c.lineTo(x, dy + 5); }); c.stroke();
        K.text(c, 'd₁ = ' + K.fmt(d1, 1, lang) + ' m', (x0 + fx) / 2, dy + 8, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        K.text(c, 'd₂ = ' + K.fmt(d2, 1, lang) + ' m', (fx + x0 + 4 * pxm) / 2, dy + 8, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        // formula box
        const small = w < 560, bw = Math.min(small ? 250 : 320, w - 16);
        c.fillStyle = theme.surface; K.roundRect(c, 8, 8, bw, small ? 68 : 86, 10); c.fill();
        const fN = (small ? 11 : 13) + 'px ' + theme.font, lh = small ? 16 : 20; let y = 26;
        K.text(c, K.tr({ en: 'Lever', hr: 'Poluga' }, lang) + '   F₁ · d₁ = F₂ · d₂', 20, y, { font: 'bold ' + (small ? 13 : 15) + 'px ' + theme.fontDisplay, color: theme.fg }); y += lh;
        K.text(c, 'F₂ = F₁ · d₁ / d₂ = ' + K.fmt(st.Frock, 0, lang) + ' · ' + K.fmt(d1, 1, lang) + ' / ' + K.fmt(d2, 1, lang) + ' = ' + K.fmt(need, 0, lang) + ' N', 20, y, { font: fN, color: theme.fg }); y += lh;
        c.fillStyle = st.lifted ? theme.good : theme.warn; c.beginPath(); c.arc(25, y - 4, 5, 0, Math.PI * 2); c.fill();
        K.text(c, K.tr(st.lifted ? { en: 'The rock lifts!', hr: 'Kamen se diže!' } : { en: 'Push at least ', hr: 'Pritisni barem ' }, lang) + (st.lifted ? '' : K.fmt(Math.ceil(need / 10) * 10, 0, lang) + ' N'), 36, y, { font: fN, color: theme.fg });
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        if (st.mode === 'balance') drawBalance(c, layoutB()); else drawRock(c);
      }

      // ---------- lifecycle ----------
      function reset() {
        st.weights.length = 0; st.theta = 0; st.omega = 0; st.drag = null;
        st.locked = true; tgLock.set(true);
        st.s = 1; slS.set(1); st.Frock = 500; slRock.set(500); st.push = 0; slPush.set(0); st.lifted = false; st.phi = restPhi();
        seg.set('balance'); setMode('balance');
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      L.start(); updatePlay();
      return {
        destroy() {
          L.destroy(); window.removeEventListener('pointerup', onUp);
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
