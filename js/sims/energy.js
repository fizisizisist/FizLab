/* FizLab sim: Energy Skate Park — a skater on a smooth track; potential, kinetic and thermal energy bars. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81;          // m/s²
  const TRACK_W = 20;      // track width in metres
  const H_MAX = 8;         // highest track point in metres
  const NPTS = 61;         // polyline points
  const START_X = 2;       // default start position (m from the left)

  // Cosine interpolation between knots -> polyline of NPTS points with arc length.
  function buildTrack(knots) {
    const pts = [];
    for (let i = 0; i < NPTS; i++) {
      const x = TRACK_W * i / (NPTS - 1);
      let j = 0;
      while (j < knots.length - 2 && x > knots[j + 1][0]) j++;
      const x0 = knots[j][0], y0 = knots[j][1], x1 = knots[j + 1][0], y1 = knots[j + 1][1];
      const u = K.clamp((x - x0) / ((x1 - x0) || 1), 0, 1);
      const f = (1 - Math.cos(Math.PI * u)) / 2;
      pts.push({ x, y: y0 + (y1 - y0) * f, s: 0 });
    }
    let s = 0;
    for (let i = 1; i < pts.length; i++) { s += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); pts[i].s = s; }
    return { pts, length: s };
  }
  const TRACKS = [
    { id: 'halfpipe', label: { en: 'Half-pipe', hr: 'U-rampa' }, knots: [[0, 8], [10, 0], [20, 8]] },
    { id: 'hills', label: { en: 'Hill and valley', hr: 'Brijeg i dolina' }, knots: [[0, 8], [5, 1], [10, 5], [15, 1], [20, 8]] },
    { id: 'ramp', label: { en: 'Ramp to flat', hr: 'Rampa i ravnina' }, knots: [[0, 8], [7, 0], [20, 0]] }
  ];
  TRACKS.forEach(t => Object.assign(t, buildTrack(t.knots)));

  // point on the track at arc length s: position (m) and unit tangent (dx/ds, dy/ds)
  function at(track, s) {
    const p = track.pts;
    s = K.clamp(s, 0, track.length);
    let i = 1;
    while (i < p.length - 1 && p[i].s < s) i++;
    const a = p[i - 1], b = p[i], seg = (b.s - a.s) || 1e-9;
    const u = K.clamp((s - a.s) / seg, 0, 1);
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, tx: (b.x - a.x) / seg, ty: (b.y - a.y) / seg };
  }
  // arc length at a given x (the track is a function of x)
  function sAtX(track, x) {
    const p = track.pts;
    x = K.clamp(x, 0, TRACK_W);
    let i = 1;
    while (i < p.length - 1 && p[i].x < x) i++;
    const a = p[i - 1], b = p[i];
    const u = K.clamp((x - a.x) / ((b.x - a.x) || 1e-9), 0, 1);
    return a.s + (b.s - a.s) * u;
  }

  window.Sims.register({
    id: 'energy',
    title: { en: 'Energy Skate Park', hr: 'Energija na rampi' },
    summary: {
      en: 'Drag the skater onto the track and watch potential energy turn into kinetic energy. Add friction and see where the energy goes.',
      hr: 'Povuci skejtera na stazu i gledaj kako se potencijalna energija pretvara u kinetičku. Dodaj trenje i vidi kamo odlazi energija.'
    },
    tasks: [
      { en: 'Place the skater high on the half-pipe with no friction. How high does it get on the other side?', hr: 'Postavi skejtera visoko na U-rampu bez trenja. Koliko visoko stigne na drugoj strani?' },
      { en: 'Read the speed at the lowest point. Check: ½·m·v² should equal the potential energy you started with.', hr: 'Pročitaj brzinu u najnižoj točki. Provjeri: ½·m·v² treba biti jednako početnoj potencijalnoj energiji.' },
      { en: 'Turn friction up. Watch the thermal bar grow — the total stays the same!', hr: 'Pojačaj trenje. Gledaj kako raste stupac unutarnje energije – ukupna ostaje ista!' },
      { en: 'Change the mass. Do the energies change? Does the motion change?', hr: 'Promijeni masu. Mijenjaju li se energije? Mijenja li se gibanje?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);

      const st = { track: TRACKS[0], mu: 0, m: 50, s: 0, u: 0, E: 0, Eth: 0, t: 0,
        resting: false, atEnd: false, dragging: false, showBars: true };

      // ---------- controls ----------
      const segTrack = C.segmented({ label: { en: 'Track', hr: 'Staza' }, options: TRACKS.map(t => ({ value: t.id, label: t.label })), value: 'halfpipe',
        onChange: v => { st.track = TRACKS.find(t => t.id === v) || TRACKS[0]; place(sAtX(st.track, START_X)); } });
      const slMu = C.slider({ label: { en: 'Friction μ', hr: 'Trenje μ' }, min: 0, max: 0.3, step: 0.01, value: 0, digits: 2,
        onChange: v => { st.mu = v; st.resting = false; } });
      const slM = C.slider({ label: { en: 'Mass', hr: 'Masa' }, min: 20, max: 80, step: 5, value: 50, unit: 'kg', digits: 0,
        onChange: v => { const r = v / st.m; st.E *= r; st.Eth *= r; st.m = v; } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const tgBars = C.toggle({ label: { en: 'Show energy bars', hr: 'Prikaži stupce energije' }, value: true, onChange: v => { st.showBars = v; } });
      const outH = C.readout({ label: { en: 'Height', hr: 'Visina' }, unit: 'm', digits: 2 });
      const outV = C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'm/s', digits: 1 });
      const outPE = C.readout({ label: { en: 'Potential energy', hr: 'Potencijalna energija' }, unit: 'J', digits: 0 });
      const outKE = C.readout({ label: { en: 'Kinetic energy', hr: 'Kinetička energija' }, unit: 'J', digits: 0 });
      const outTh = C.readout({ label: { en: 'Thermal energy', hr: 'Unutarnja energija (toplina)' }, unit: 'J', digits: 0 });
      const outE = C.readout({ label: { en: 'Total energy', hr: 'Ukupna energija' }, unit: 'J', digits: 0 });
      const note = C.note({ text: { en: '', hr: '' } });

      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }

      // ---------- physics ----------
      function energies() {
        const P = at(st.track, st.s);
        const PE = st.m * G * P.y;
        const KE = Math.max(0, st.E - PE - st.Eth);
        return { P, PE, KE };
      }
      function place(s) {
        st.s = K.clamp(s, 0, st.track.length); st.u = 0;
        st.E = st.m * G * at(st.track, st.s).y; st.Eth = 0; st.t = 0;
        st.resting = false; st.atEnd = false;
      }
      function reset() {
        st.track = TRACKS[0]; segTrack.set('halfpipe');
        st.mu = 0; slMu.set(0); st.m = 50; slM.set(50);
        st.showBars = true; tgBars.set(true);
        place(sAtX(st.track, START_X));
        if (!ctx.reducedMotion) L.start(); else L.stop();
        updatePlay(); updateOut(); draw();
      }
      function step(dt) {
        if (st.dragging || st.resting || st.atEnd) return;
        const n = 4, h = dt / n;
        for (let k = 0; k < n; k++) {
          const P = at(st.track, st.s);
          // thermal energy cannot exceed what is available at the current position
          st.Eth = Math.min(st.Eth, Math.max(0, st.E - st.m * G * P.y));
          // tangential acceleration from gravity (ty = dy/ds)
          st.u += -G * P.ty * h;
          // friction converts kinetic energy into thermal energy while moving (normal force m·g·cosθ, cosθ = dx/ds)
          if (st.mu > 0 && st.u !== 0) st.Eth += st.mu * st.m * G * P.tx * Math.abs(st.u) * h;
          const sNew = st.s + st.u * h;
          if (sNew <= 0 || sNew >= st.track.length) {
            // open end: stop at the edge; the kinetic energy left is absorbed (bumper) and counted as thermal
            st.s = K.clamp(sNew, 0, st.track.length); st.u = 0; st.atEnd = true;
            st.Eth = Math.max(0, st.E - st.m * G * at(st.track, st.s).y);
            break;
          }
          const yNew = at(st.track, sNew).y;
          const KE = st.E - st.m * G * yNew - st.Eth;
          if (KE < 0) {
            // cannot climb that high -> turning point: stay, gravity turns the skater around next step
            st.u = 0;
            st.Eth = Math.min(st.Eth, Math.max(0, st.E - st.m * G * P.y));
          } else {
            st.s = sNew;
            const sign = st.u < 0 ? -1 : 1;
            st.u = sign * Math.sqrt(2 * KE / st.m);
          }
          // static friction holds the skater on a shallow slope (tanθ < μ) once it is almost still
          if (st.mu > 0 && Math.abs(st.u) < 0.05) {
            const Q = at(st.track, st.s);
            if (Math.abs(Q.ty) < st.mu * Q.tx && st.t > 0.3) {
              st.u = 0; st.resting = true;
              st.Eth = Math.max(0, st.E - st.m * G * Q.y);
              break;
            }
          }
          st.t += h;
        }
      }
      function updateOut() {
        const e = energies();
        outH.set(e.P.y); outV.set(Math.abs(st.u)); outPE.set(e.PE); outKE.set(e.KE); outTh.set(st.Eth); outE.set(st.E);
        note.set(st.mu > 0
          ? { en: 'Friction turns kinetic energy into thermal (internal) energy. The total energy still stays the same!', hr: 'Trenje pretvara kinetičku energiju u unutarnju energiju (toplinu). Ukupna energija i dalje ostaje ista!' }
          : { en: 'Without friction the total energy stays the same: potential energy ⇄ kinetic energy. E = m·g·h + ½·m·v²', hr: 'Bez trenja ukupna energija ostaje ista: potencijalna ⇄ kinetička energija. E = m·g·h + ½·m·v²' });
      }

      // ---------- layout ----------
      function layout() {
        const w = cv.w, h = cv.h, wide = w >= 520;
        const panelW = wide ? K.clamp(Math.round(w * 0.26), 120, 200) : 0;
        const sceneW = w - panelW;
        const padL = 46, padR = 14, topY = 56;
        const groundY = wide ? h - 30 : h - 84;
        const scale = Math.max(1, Math.min((sceneW - padL - padR) / TRACK_W, (groundY - topY) / H_MAX));
        const x0 = padL + ((sceneW - padL - padR) - TRACK_W * scale) / 2;
        return { w, h, wide, panelW, sceneW, groundY, scale, x0, topY };
      }
      const toX = (Ly, xm) => Ly.x0 + xm * Ly.scale;
      const toY = (Ly, ym) => Ly.groundY - ym * Ly.scale;

      // ---------- pointer: click / drag on the track to place the skater ----------
      let onDown, onMove, onUp;
      function placeFromPointer(ev) {
        const p = cv.pointer(ev), Ly = layout();
        const xm = (p.x - Ly.x0) / Ly.scale;
        place(sAtX(st.track, xm));
      }
      onDown = ev => {
        const p = cv.pointer(ev), Ly = layout();
        if (p.x > Ly.sceneW || p.y > Ly.groundY + 20) return;
        st.dragging = true; cv.canvas.style.cursor = 'grabbing';
        placeFromPointer(ev); st.dragging = true;
        if (ev.preventDefault) ev.preventDefault();
        updateOut(); draw();
      };
      onMove = ev => {
        if (st.dragging) { placeFromPointer(ev); st.dragging = true; updateOut(); draw(); return; }
        const p = cv.pointer(ev), Ly = layout();
        cv.canvas.style.cursor = (p.x <= Ly.sceneW && p.y <= Ly.groundY + 20) ? 'grab' : 'default';
      };
      onUp = () => {
        if (!st.dragging) return;
        st.dragging = false; cv.canvas.style.cursor = 'grab';
        if (!ctx.reducedMotion && !L.running) L.start();
        updatePlay(); updateOut(); draw();
      };
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      // ---------- drawing ----------
      function drawSkater(ctx, Ly, e) {
        const P = e.P;
        const X = toX(Ly, P.x), Y = toY(Ly, P.y);
        // screen tangent and upward normal
        let tx = P.tx, ty = -P.ty; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        const nx = ty, ny = -tx;
        const r = K.clamp(Ly.scale * 0.5, 7, 13);
        // wheel / board
        ctx.fillStyle = theme.c1; ctx.beginPath(); ctx.arc(X + nx * r, Y + ny * r, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = K.withAlpha('#ffffff', 0.35); ctx.beginPath(); ctx.arc(X + nx * r - r * 0.3, Y + ny * r - r * 0.3, r * 0.35, 0, Math.PI * 2); ctx.fill();
        // stick figure
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        const bx = X + nx * 2 * r, by = Y + ny * 2 * r, hx = X + nx * 4.2 * r, hy = Y + ny * 4.2 * r;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(hx, hy); ctx.stroke();
        // arms
        ctx.beginPath(); ctx.moveTo(X + nx * 3.4 * r - tx * 1.2 * r, Y + ny * 3.4 * r - ty * 1.2 * r); ctx.lineTo(X + nx * 3.4 * r + tx * 1.2 * r, Y + ny * 3.4 * r + ty * 1.2 * r); ctx.stroke();
        // legs
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(X + nx * 1.9 * r - tx * 0.8 * r, Y + ny * 1.9 * r - ty * 0.8 * r);
        ctx.moveTo(bx, by); ctx.lineTo(X + nx * 1.9 * r + tx * 0.8 * r, Y + ny * 1.9 * r + ty * 0.8 * r); ctx.stroke();
        ctx.fillStyle = theme.fg; ctx.beginPath(); ctx.arc(X + nx * 4.9 * r, Y + ny * 4.9 * r, r * 0.6, 0, Math.PI * 2); ctx.fill();
        // velocity arrow + speed label
        const v = Math.abs(st.u);
        if (v > 0.05 && !st.dragging) {
          const dir = st.u < 0 ? -1 : 1, len = Math.min(70, 8 + v * 4.5);
          const ax = X + nx * 2.6 * r, ay = Y + ny * 2.6 * r;
          K.arrow(ctx, ax, ay, ax + tx * dir * len, ay + ty * dir * len, { color: theme.c2, width: 3, head: 9 });
        }
        K.text(ctx, 'v = ' + K.fmt(v, 1, lang) + ' m/s', X, Y + ny * 6.2 * r - 4, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
      }
      function drawBarsVertical(ctx, Ly, e) {
        const px = Ly.sceneW + 6, pw = Ly.panelW - 12, top = 30, bottom = Ly.h - 34;
        ctx.fillStyle = theme.surface; K.roundRect(ctx, px, 8, pw, Ly.h - 16, 8); ctx.fill();
        K.text(ctx, K.tr({ en: 'Energy (J)', hr: 'Energija (J)' }, lang), px + pw / 2, 14, { font: 'bold 12px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'top' });
        const Emax = st.m * G * H_MAX, hb = bottom - top - 18;
        const bars = [[e.PE, theme.c1, { en: 'Potential', hr: 'Potenc.' }], [e.KE, theme.c2, { en: 'Kinetic', hr: 'Kinet.' }], [st.Eth, theme.c3, { en: 'Thermal', hr: 'Unutar.' }]];
        const gap = 8, bw = (pw - gap * 4) / 3;
        bars.forEach((b, i) => {
          const bx = px + gap + i * (bw + gap), bh = K.clamp(b[0] / Emax, 0, 1) * hb, by = bottom - 18 - bh;
          ctx.fillStyle = K.withAlpha(b[1], 0.15); ctx.fillRect(bx, bottom - 18 - hb, bw, hb);
          ctx.fillStyle = b[1]; ctx.fillRect(bx, by, bw, bh);
          K.text(ctx, K.fmt(b[0], 0, lang), bx + bw / 2, by - 3, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
          K.text(ctx, K.tr(b[2], lang), bx + bw / 2, bottom - 14, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        });
        // total marker
        const ty = bottom - 18 - K.clamp(st.E / Emax, 0, 1) * hb;
        ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px + 4, ty); ctx.lineTo(px + pw - 4, ty); ctx.stroke(); ctx.restore();
        K.text(ctx, K.tr({ en: 'total ', hr: 'ukupno ' }, lang) + K.fmt(st.E, 0, lang) + ' J', px + pw / 2, ty - 4, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
      }
      function drawBarsHorizontal(ctx, Ly, e) {
        const y0 = Ly.groundY + 14, labW = 64, valW = 56, bx = labW + 6, bw = Ly.w - bx - valW - 8, rowH = 20;
        const Emax = st.m * G * H_MAX;
        const bars = [[e.PE, theme.c1, { en: 'Potential', hr: 'Potenc.' }], [e.KE, theme.c2, { en: 'Kinetic', hr: 'Kinet.' }], [st.Eth, theme.c3, { en: 'Thermal', hr: 'Unutar.' }]];
        bars.forEach((b, i) => {
          const y = y0 + i * rowH;
          K.text(ctx, K.tr(b[2], lang), labW, y + 7, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
          ctx.fillStyle = K.withAlpha(b[1], 0.15); ctx.fillRect(bx, y, bw, 14);
          ctx.fillStyle = b[1]; ctx.fillRect(bx, y, K.clamp(b[0] / Emax, 0, 1) * bw, 14);
          K.text(ctx, K.fmt(b[0], 0, lang) + ' J', bx + bw + 6, y + 7, { font: '11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        });
        const tx = bx + K.clamp(st.E / Emax, 0, 1) * bw;
        ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tx, y0 - 4); ctx.lineTo(tx, y0 + 3 * rowH - 4); ctx.stroke(); ctx.restore();
        K.text(ctx, K.tr({ en: 'total', hr: 'ukupno' }, lang), tx, y0 - 5, { font: 'bold 10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
      }
      function draw() {
        const ctx = cv.ctx, Ly = layout(), w = Ly.w, h = Ly.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        const e = energies();
        // ground + track
        const pts = st.track.pts;
        ctx.fillStyle = theme.ground; ctx.beginPath();
        ctx.moveTo(toX(Ly, 0), Ly.groundY + 2);
        pts.forEach(p => ctx.lineTo(toX(Ly, p.x), toY(Ly, p.y)));
        ctx.lineTo(toX(Ly, TRACK_W), Ly.groundY + 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = theme.ground; ctx.fillRect(0, Ly.groundY, Ly.sceneW, h - Ly.groundY);
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath();
        pts.forEach((p, i) => { const X = toX(Ly, p.x), Y = toY(Ly, p.y); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
        ctx.stroke();
        // height ruler
        const rx = Ly.x0 - 14, stepM = Ly.scale < 18 ? 4 : 2;
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, toY(Ly, 0)); ctx.lineTo(rx, toY(Ly, H_MAX)); ctx.stroke();
        for (let m = 0; m <= H_MAX + 0.01; m += stepM) {
          const y = toY(Ly, m);
          ctx.beginPath(); ctx.moveTo(rx - 4, y); ctx.lineTo(rx + 4, y); ctx.stroke();
          K.text(ctx, K.fmt(m, 0, lang) + ' m', rx - 7, y, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        // dotted line showing the start height (total energy level) across the scene
        const hE = st.E / (st.m * G);
        ctx.save(); ctx.setLineDash([3, 5]); ctx.strokeStyle = K.withAlpha(theme.c1, 0.7); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(toX(Ly, 0), toY(Ly, hE)); ctx.lineTo(toX(Ly, TRACK_W), toY(Ly, hE)); ctx.stroke(); ctx.restore();
        K.text(ctx, K.tr({ en: 'start height ', hr: 'početna visina ' }, lang) + K.fmt(hE, 1, lang) + ' m', toX(Ly, TRACK_W) - 2, toY(Ly, hE) - 3, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'bottom' });
        // skater
        drawSkater(ctx, Ly, e);
        // header
        K.text(ctx, K.tr(st.track.label, lang) + '   g = ' + K.fmt(G, 2, lang) + ' m/s²   m = ' + K.fmt(st.m, 0, lang) + ' kg', 12, 14, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        let hint = { en: 'Click or drag on the track to place the skater', hr: 'Klikni ili povuci po stazi da postaviš skejtera' };
        if (st.atEnd) hint = { en: 'Stopped at the end of the track — drag to place again', hr: 'Zaustavio se na kraju staze – povuci da ga opet postaviš' };
        else if (st.resting) hint = { en: 'Friction holds the skater still — drag to place again', hr: 'Trenje drži skejtera na mjestu – povuci da ga opet postaviš' };
        K.text(ctx, K.tr(hint, lang), 12, 33, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        // energy bars
        if (st.showBars) { if (Ly.wide) drawBarsVertical(ctx, Ly, e); else drawBarsHorizontal(ctx, Ly, e); }
        else if (Ly.wide) {
          K.text(ctx, 'E = ' + K.fmt(st.E, 0, lang) + ' J', Ly.sceneW + Ly.panelW / 2, h / 2, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
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
