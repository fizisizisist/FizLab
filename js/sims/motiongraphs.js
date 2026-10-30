/* FizLab sim: Motion graphs — a moving man on a straight track with live x–t, v–t and a–t graphs.
   Drag him, set a velocity or an acceleration, or reproduce a target graph. */
(function () {
  'use strict';
  const K = window.SimKit;
  const XMAX = 10;      // track runs from -10 m to +10 m
  const WIN = 10;       // seconds visible on the shared time axis
  const SAMPLE = 0.05;  // s between recorded points
  const PRESETS = [
    { id: 'still', T: 10, label: { en: 'Standing still at +3 m', hr: 'Stoji na +3 m' }, x: () => 3, v: () => 0 },
    { id: 'right2', T: 10, label: { en: 'Moving right at 2 m/s', hr: 'Giba se desno 2 m/s' }, x: t => -10 + 2 * t, v: () => 2 },
    { id: 'left1', T: 10, label: { en: 'Moving left at 1 m/s from +6 m', hr: 'Giba se lijevo 1 m/s od +6 m' }, x: t => 6 - t, v: () => -1 },
    { id: 'accel', T: 6, label: { en: 'Speeding up from rest, 1 m/s²', hr: 'Ubrzava iz mirovanja, 1 m/s²' }, x: t => -9 + 0.5 * t * t, v: t => t },
    { id: 'stop', T: 10, label: { en: 'Moving right, then stopping', hr: 'Giba se desno, pa stane' }, x: t => (t < 4 ? -6 + 2 * t : 2), v: t => (t < 4 ? 2 : 0) }
  ];
  const MODES = [
    { value: 'drag', label: { en: 'Drag', hr: 'Vuci' } },
    { value: 'vel', label: { en: 'Set velocity', hr: 'Zadaj brzinu' } },
    { value: 'accel', label: { en: 'Set acceleration', hr: 'Zadaj akceleraciju' } },
    { value: 'match', label: { en: 'Match the graph', hr: 'Pogodi gibanje' } }
  ];

  window.Sims.register({
    id: 'motiongraphs',
    title: { en: 'Motion Graphs', hr: 'Grafovi gibanja' },
    summary: {
      en: 'Move the man along the track and watch the position, velocity and acceleration graphs draw themselves — then try to reproduce a given graph.',
      hr: 'Pomiči čovjeka po stazi i gledaj kako se crtaju grafovi položaja, brzine i akceleracije — zatim pokušaj ponoviti zadani graf.'
    },
    tasks: [
      { en: 'Drag the man slowly to the right, then quickly to the left. How do the x–t and v–t lines differ?', hr: 'Povuci čovjeka polako desno, pa brzo lijevo. Kako se razlikuju crte x–t i v–t?' },
      { en: '"Set velocity": pick v = −2 m/s. Which way does he move? Which way does the x–t line tilt?', hr: '„Zadaj brzinu”: odaberi v = −2 m/s. Kamo se giba? Na koju stranu je nagnuta crta x–t?' },
      { en: '"Set acceleration": start with v = 3 m/s and a = −1 m/s². Is he speeding up or slowing down? Watch the note.', hr: '„Zadaj akceleraciju”: kreni s v = 3 m/s i a = −1 m/s². Ubrzava li ili usporava? Prati bilješku.' },
      { en: 'Switch on "area under v–t" with v = 2 m/s. After 5 s, compare the area with how far he moved.', hr: 'Uključi „površina ispod v–t” uz v = 2 m/s. Nakon 5 s usporedi površinu s pomakom.' },
      { en: '"Match the graph": can you reproduce "moving right, then stopping" with an error under 0.4 m?', hr: '„Pogodi gibanje”: možeš li ponoviti „giba se desno, pa stane” s greškom manjom od 0,4 m?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 440, maxHeight: 520 });
      const C = K.controls(container, lang);

      const st = {
        mode: 'drag', x0: 0, v0: 2, a0: 0.5, preset: PRESETS[0], showSlope: false, showArea: false,
        t: 0, x: 0, v: 0, a: 0, lastSample: 0, pts: { x: [[0, 0]], v: [[0, 0]], a: [[0, 0]] },
        targetX: [], targetV: [], dragging: false, dragOff: 0, match: { err: 0, n: 0, done: false }
      };

      // ---------- controls ----------
      const fieldOf = c => (c.el.classList.contains('sk-field') || c.el.classList.contains('sk-note')) ? c.el : c.el.parentElement;
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };

      C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: MODES, value: 'drag', onChange: v => { st.mode = v; applyMode(); reset(); } });
      const selPreset = C.select({ label: { en: 'Target graph', hr: 'Zadani graf' }, options: PRESETS.map(p => ({ value: p.id, label: p.label })), value: 'still',
        onChange: v => { st.preset = PRESETS.find(p => p.id === v) || PRESETS[0]; buildTarget(); reset(); } });
      const slX0 = C.slider({ label: { en: 'Starting position', hr: 'Početni položaj' }, min: -8, max: 8, step: 0.5, value: 0, unit: 'm', digits: 1, onChange: v => { st.x0 = v; restart(); } });
      const slV0 = C.slider({ label: { en: 'Starting velocity', hr: 'Početna brzina' }, min: -4, max: 4, step: 0.25, value: 2, unit: 'm/s', digits: 2, onChange: v => { st.v0 = v; restart(); } });
      const slA = C.slider({ label: { en: 'Acceleration', hr: 'Akceleracija' }, min: -2, max: 2, step: 0.1, value: 0.5, unit: 'm/s²', digits: 1, onChange: v => { st.a0 = v; restart(); } });
      C.toggle({ label: { en: 'Show slope Δx/Δt', hr: 'Pokaži nagib Δx/Δt' }, value: false, onChange: v => { st.showSlope = v; draw(); } });
      C.toggle({ label: { en: 'Area under v–t', hr: 'Površina ispod v–t' }, value: false, onChange: v => { st.showArea = v; draw(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => {
        if (st.mode === 'match' && st.match.done) clearRun();
        L.toggle(); updatePlay(); updateOut(); draw();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outT = C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 1 });
      const outX = C.readout({ label: { en: 'Position x', hr: 'Položaj x' }, unit: 'm', digits: 2 });
      const outV = C.readout({ label: { en: 'Velocity v', hr: 'Brzina v' }, unit: 'm/s', digits: 2 });
      const outA = C.readout({ label: { en: 'Acceleration a', hr: 'Akceleracija a' }, unit: 'm/s²', digits: 1 });
      const outErr = C.readout({ label: { en: 'Mean error', hr: 'Srednja greška' }, unit: 'm', digits: 2 });
      const noteMotion = C.note({ text: { en: '', hr: '' } });
      const noteHelp = C.note({ text: { en: '', hr: '' } });

      // ---------- state helpers ----------
      function applyMode() {
        const m = st.mode;
        show(selPreset, m === 'match');
        show(slX0, m === 'vel' || m === 'accel');
        show(slV0, m === 'vel' || m === 'accel');
        show(slA, m === 'accel');
        show(outErr, m === 'match');
      }
      function buildTarget() {
        const p = st.preset; st.targetX = []; st.targetV = [];
        for (let t = 0; t <= p.T + 1e-9; t += 0.1) { st.targetX.push([t, p.x(t)]); st.targetV.push([t, p.v(t)]); }
      }
      function clearRun() {
        st.t = 0; st.lastSample = 0; st.dragging = false;
        if (st.mode === 'vel') { st.x = st.x0; st.v = st.v0; st.a = 0; }
        else if (st.mode === 'accel') { st.x = st.x0; st.v = st.v0; st.a = st.a0; }
        else if (st.mode === 'match') { st.x = st.preset.x(0); st.v = 0; st.a = 0; }
        else { st.x = 0; st.v = 0; st.a = 0; }
        st.pts = { x: [[0, st.x]], v: [[0, st.v]], a: [[0, st.a]] };
        st.match = { err: 0, n: 0, done: false };
      }
      function restart() { clearRun(); updatePlay(); updateOut(); draw(); }
      function reset() { L.stop(); clearRun(); updatePlay(); updateOut(); draw(); }
      function updatePlay() {
        btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' }
          : (st.mode === 'match' && st.match.done) ? { en: 'Play again', hr: 'Ponovi' }
            : st.t > 0 ? { en: 'Continue', hr: 'Nastavi' } : { en: 'Play', hr: 'Pokreni' });
      }
      function timeWindow() { const t1 = Math.max(WIN, st.t); return { t0: t1 - WIN, t1 }; }
      // latest recorded point with time <= tq (or the first point)
      function lookup(pts, tq) {
        let p = pts[0];
        for (let i = pts.length - 1; i >= 0; i--) { if (pts[i][0] <= tq) { p = pts[i]; break; } }
        return p;
      }

      // ---------- physics ----------
      function sample() {
        const t = st.t;
        if (st.mode === 'drag' || st.mode === 'match') {
          // v and a are derived from the recorded positions (finite differences over short baselines)
          const px = lookup(st.pts.x, t - 0.2);
          const dtx = t - px[0];
          const v = dtx > 0.02 ? (st.x - px[1]) / dtx : 0;
          const pv = lookup(st.pts.v, t - 0.3);
          const dtv = t - pv[0];
          const a = dtv > 0.02 ? (v - pv[1]) / dtv : 0;
          st.v = v; st.a = st.a + (K.clamp(a, -15, 15) - st.a) * 0.5;
        }
        st.pts.x.push([t, st.x]); st.pts.v.push([t, st.v]); st.pts.a.push([t, st.a]);
        st.lastSample = t;
        if (st.mode === 'match' && !st.match.done) {
          const T = st.preset.T;
          if (t <= T + 1e-9) { st.match.err += Math.abs(st.x - st.preset.x(t)); st.match.n++; }
          if (t >= T) { st.match.done = true; st.dragging = false; L.stop(); updatePlay(); }
        }
        // drop points that left the time window
        const cut = t - WIN - 0.6;
        while (st.pts.x.length > 2 && st.pts.x[1][0] < cut) { st.pts.x.shift(); st.pts.v.shift(); st.pts.a.shift(); }
      }
      function step(dt) {
        if (dt <= 0) return;
        if (st.mode === 'vel' || st.mode === 'accel') {
          const a = st.mode === 'accel' ? st.a0 : 0;
          const n = 4, h = dt / n;
          for (let i = 0; i < n; i++) {
            st.v += a * h; st.x += st.v * h;
            if (st.x > XMAX) { st.x = XMAX; st.v = -Math.abs(st.v); }   // bounce off the track end
            if (st.x < -XMAX) { st.x = -XMAX; st.v = Math.abs(st.v); }
          }
          st.a = a;
        }
        st.t += dt;
        if (st.t - st.lastSample >= SAMPLE - 1e-9) sample();
      }
      function meanErr() { return st.match.n ? st.match.err / st.match.n : 0; }

      function motionNote() {
        const v = st.v, a = st.a;
        const dir = Math.abs(v) < 0.1 ? { en: 'v ≈ 0: he is at rest', hr: 'v ≈ 0: miruje' }
          : v > 0 ? { en: 'v > 0: moving towards +x (right)', hr: 'v > 0: giba se prema +x (desno)' }
            : { en: 'v < 0: moving towards −x (left)', hr: 'v < 0: giba se prema −x (lijevo)' };
        let acc;
        if (Math.abs(a) < 0.15) acc = { en: 'a ≈ 0 → the velocity stays the same', hr: 'a ≈ 0 → brzina se ne mijenja' };
        else if (Math.abs(v) < 0.1) acc = { en: 'a ≠ 0 while v ≈ 0 → he starts moving in the direction of a', hr: 'a ≠ 0 dok je v ≈ 0 → kreće se u smjeru a' };
        else if ((v > 0) === (a > 0)) acc = { en: 'v and a have the same sign → speeding up', hr: 'v i a istog predznaka → ubrzava' };
        else acc = { en: 'v and a have opposite signs → slowing down', hr: 'v i a suprotnog predznaka → usporava' };
        return { en: dir.en + '.  ' + acc.en + '.', hr: dir.hr + '.  ' + acc.hr + '.' };
      }
      function helpNote() {
        const m = st.mode;
        if (m === 'drag') return { en: 'Drag the man left or right. The graph shows how x changes in time; the man only moves left–right — the graph is not a picture of his path.',
          hr: 'Vuci čovjeka lijevo ili desno. Graf pokazuje kako se x mijenja u vremenu; čovjek se giba samo lijevo-desno — graf nije slika njegova puta.' };
        if (m === 'vel') return { en: 'Constant velocity: the x–t line is straight and its slope Δx/Δt equals v. Negative v means moving towards −x. At the track end he bounces back.',
          hr: 'Stalna brzina: crta x–t je ravna, a njezin nagib Δx/Δt jednak je v. Negativna brzina znači gibanje prema −x. Na kraju staze odbija se natrag.' };
        if (m === 'accel') return { en: 'Acceleration tilts the v–t line. He speeds up only when v and a point the same way; a > 0 with v < 0 means slowing down!',
          hr: 'Akceleracija naginje crtu v–t. Ubrzava samo kad v i a pokazuju u istu stranu; a > 0 uz v < 0 znači da usporava!' };
        const e = meanErr();
        if (st.match.done) {
          return e < 0.4
            ? { en: 'Good match! Mean error ' + K.fmt(e, 2, 'en') + ' m.', hr: 'Dobro pogođeno! Srednja greška ' + K.fmt(e, 2, 'hr') + ' m.' }
            : { en: 'Not yet: mean error ' + K.fmt(e, 2, 'en') + ' m (needs less than 0.4 m). Press "Play again" and try once more.', hr: 'Još ne: srednja greška ' + K.fmt(e, 2, 'hr') + ' m (treba manje od 0,4 m). Pritisni „Ponovi” i probaj opet.' };
        }
        return { en: 'Reproduce the dashed target graph by dragging the man. Time starts when you press Play or grab him.',
          hr: 'Ponovi crtkani zadani graf vukući čovjeka. Vrijeme kreće kad pritisneš Pokreni ili uhvatiš čovjeka.' };
      }
      function updateOut() {
        outT.set(st.t); outX.set(st.x); outV.set(st.v); outA.set(st.a);
        noteMotion.set(motionNote()); noteHelp.set(helpNote());
        if (st.mode === 'match') { const e = meanErr(); outErr.set(e); outErr.setColor(st.match.done ? (e < 0.4 ? theme.good : theme.bad) : ''); }
      }

      // ---------- layout ----------
      function layout() {
        const w = cv.w, h = cv.h, wide = w >= 700, gap = 8;
        let scene, graphs;
        if (wide) {
          const sw = Math.round(w * 0.44);
          scene = { x: gap, y: gap, w: sw - gap, h: h - 2 * gap };
          const gx = sw + gap, gw = w - gx - gap, gh = (h - 4 * gap) / 3;
          graphs = [0, 1, 2].map(i => ({ x: gx, y: gap + i * (gh + gap), w: gw, h: gh }));
        } else {
          const sh = Math.round(h * 0.31);
          scene = { x: gap, y: gap, w: w - 2 * gap, h: sh };
          const gy = sh + 2 * gap, gh = (h - gy - 3 * gap) / 3;
          graphs = [0, 1, 2].map(i => ({ x: gap, y: gy + i * (gh + gap), w: w - 2 * gap, h: gh }));
        }
        const trackX0 = scene.x + 28, trackW = scene.w - 56;
        const trackY = scene.y + scene.h * 0.6;
        const sc = K.clamp(scene.h / 300, 0.55, 1.1);
        return { w, h, wide, scene, graphs, trackX0, trackW, trackY, sc,
          X: m => trackX0 + (m + XMAX) / (2 * XMAX) * trackW,
          M: px => (px - trackX0) / trackW * 2 * XMAX - XMAX };
      }

      // ---------- pointer (drag the man) ----------
      function canDrag() { return st.mode === 'drag' || (st.mode === 'match' && !st.match.done); }
      function manHit(p, Lo) {
        const mx = Lo.X(st.x);
        return Math.abs(p.x - mx) < 34 * Lo.sc + 12 && p.y > Lo.trackY - 100 * Lo.sc && p.y < Lo.trackY + 24;
      }
      function onDown(ev) {
        if (!canDrag()) return;
        const Lo = layout(), p = cv.pointer(ev);
        if (!manHit(p, Lo)) return;
        st.dragging = true; st.dragOff = p.x - Lo.X(st.x);
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault();
        if (!L.running) { L.start(); updatePlay(); }
      }
      function onMove(ev) {
        const Lo = layout(), p = cv.pointer(ev);
        if (st.dragging) { st.x = K.clamp(Lo.M(p.x - st.dragOff), -XMAX, XMAX); }
        else cv.canvas.style.cursor = (canDrag() && manHit(p, Lo)) ? 'grab' : 'default';
      }
      function onUp() { if (!st.dragging) return; st.dragging = false; cv.canvas.style.cursor = 'grab'; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing ----------
      function drawMan(g, x, y, sc, color) {
        g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 3 * sc; g.lineCap = 'round'; g.lineJoin = 'round';
        g.beginPath(); g.arc(x, y - 52 * sc, 7 * sc, 0, Math.PI * 2); g.fill();
        g.beginPath();
        g.moveTo(x, y - 45 * sc); g.lineTo(x, y - 20 * sc);
        g.moveTo(x, y - 20 * sc); g.lineTo(x - 9 * sc, y); g.moveTo(x, y - 20 * sc); g.lineTo(x + 9 * sc, y);
        g.moveTo(x - 12 * sc, y - 28 * sc); g.lineTo(x, y - 40 * sc); g.lineTo(x + 12 * sc, y - 28 * sc);
        g.stroke(); g.restore();
      }
      function labeledArrow(g, x, y, len, color, label, maxLen) {
        len = K.clamp(len, -maxLen, maxLen);
        if (Math.abs(len) >= 3) K.arrow(g, x, y, x + len, y, { color, width: 3, head: 9 });
        const right = len >= 0;
        const lx = Math.abs(len) >= 3 ? x + len + (right ? 7 : -7) : x + 10;
        K.text(g, label, lx, y, { font: 'bold 11px ' + theme.font, color: theme.fg, align: right ? 'left' : 'right', baseline: 'middle' });
      }
      function drawScene(g, Lo) {
        const S = Lo.scene, sc = Lo.sc, ty = Lo.trackY;
        g.save(); g.beginPath(); g.rect(S.x, S.y, S.w, S.h); g.clip();
        g.fillStyle = theme.ground; g.fillRect(S.x, ty, S.w, S.y + S.h - ty);
        // track with metre marks
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(Lo.X(-XMAX), ty); g.lineTo(Lo.X(XMAX), ty); g.stroke();
        const every = Lo.trackW < 330 ? 5 : 2;
        g.lineWidth = 1;
        for (let m = -XMAX; m <= XMAX; m++) {
          const x = Lo.X(m), big = m % every === 0;
          g.beginPath(); g.moveTo(x, ty); g.lineTo(x, ty + (big ? 7 : 4)); g.stroke();
          if (big) K.text(g, (m > 0 ? '+' : '') + K.fmt(m, 0, lang), x, ty + 9, { font: (m === 0 ? 'bold ' : '') + '10px ' + theme.font, color: m === 0 ? theme.fg : theme.muted, align: 'center', baseline: 'top' });
        }
        // origin marker and the positive direction
        g.strokeStyle = theme.muted; g.setLineDash([3, 4]); g.beginPath(); g.moveTo(Lo.X(0), S.y + 28); g.lineTo(Lo.X(0), ty); g.stroke(); g.setLineDash([]);
        K.text(g, K.tr({ en: 'origin', hr: 'ishodište' }, lang), Lo.X(0), ty + 21, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        const ay = ty + 27;
        K.arrow(g, Lo.X(4), ay, Lo.X(8.6), ay, { color: theme.fg, width: 2, head: 8 });
        K.text(g, '+x', Lo.X(9), ay, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        K.text(g, '−x', Lo.X(-9), ay, { font: 'bold 12px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        // the man with his velocity and acceleration arrows
        const mx = Lo.X(st.x), pxm = Lo.trackW / (2 * XMAX);
        drawMan(g, mx, ty, sc, theme.c1);
        K.text(g, 'x = ' + K.fmt(st.x, 1, lang) + ' m', mx, ty - 64 * sc, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        labeledArrow(g, mx, ty - 82 * sc, st.v * pxm, theme.fg, 'v = ' + K.fmt(st.v, 1, lang) + ' m/s', Lo.trackW * 0.45);
        labeledArrow(g, mx, ty - 100 * sc, st.a * pxm * 1.5, theme.c2, 'a = ' + K.fmt(st.a, 1, lang) + ' m/s²', Lo.trackW * 0.45);
        // header
        K.text(g, 't = ' + K.fmt(st.t, 1, lang) + ' s', S.x + 6, S.y + 12, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        if (st.mode === 'match') {
          const T = st.preset.T;
          K.text(g, K.tr(st.preset.label, lang) + '  (' + K.fmt(Math.min(st.t, T), 0, lang) + ' / ' + K.fmt(T, 0, lang) + ' s)', S.x + S.w - 6, S.y + 12, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        g.restore();
      }
      // one of the three stacked graphs; returns the mapping so overlays can be added
      function chart(g, o) {
        const padL = 34, padR = 10, padT = 6, padB = o.timeAxis ? 20 : 6;
        const px = o.x + padL, py = o.y + padT, pw = o.w - padL - padR, ph = o.h - padT - padB;
        const sx = t => px + (t - o.t0) / (o.t1 - o.t0) * pw;
        const sy = v => py + ph - (v - o.yMin) / (o.yMax - o.yMin) * ph;
        const M = { sx, sy, px, py, pw, ph };
        g.save();
        g.fillStyle = theme.surface; K.roundRect(g, o.x, o.y, o.w, o.h, 8); g.fill();
        g.strokeStyle = theme.line; g.lineWidth = 1;
        for (let tt = Math.ceil(o.t0 - 1e-6); tt <= o.t1 + 1e-6; tt += 1) {
          const gx = sx(tt); g.beginPath(); g.moveTo(gx, py); g.lineTo(gx, py + ph); g.stroke();
          if (o.timeAxis && tt % 2 === 0 && gx < px + pw - 22) K.text(g, K.fmt(tt, 0, lang), gx, py + ph + 4, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        }
        const yd = o.yStep >= 1 ? 0 : 1;
        for (let v = o.yMin; v <= o.yMax + 1e-6; v += o.yStep) {
          const gy = sy(v); g.beginPath(); g.moveTo(px, gy); g.lineTo(px + pw, gy); g.stroke();
          K.text(g, K.fmt(v, yd, lang), px - 4, gy, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.moveTo(px, sy(0)); g.lineTo(px + pw, sy(0)); g.stroke();
        if (o.timeAxis) K.text(g, 't (s)', px + pw, py + ph + 4, { font: '10px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
        g.beginPath(); g.rect(px, py, pw, ph); g.clip();
        if (o.before) o.before(M);
        if (o.target && o.target.length > 1) {
          g.strokeStyle = theme.c4; g.lineWidth = 2; g.setLineDash([6, 5]); g.beginPath();
          o.target.forEach((p, i) => { i ? g.lineTo(sx(p[0]), sy(p[1])) : g.moveTo(sx(p[0]), sy(p[1])); });
          g.stroke(); g.setLineDash([]);
        }
        const pts = o.points;
        if (pts.length > 1) {
          g.strokeStyle = o.color; g.lineWidth = 2; g.lineJoin = 'round'; g.beginPath();
          pts.forEach((p, i) => { i ? g.lineTo(sx(p[0]), sy(p[1])) : g.moveTo(sx(p[0]), sy(p[1])); });
          g.stroke();
        }
        if (pts.length) {
          const last = pts[pts.length - 1];
          g.fillStyle = o.color; g.beginPath(); g.arc(sx(last[0]), sy(last[1]), 4, 0, Math.PI * 2); g.fill();
          g.strokeStyle = theme.surface; g.lineWidth = 2; g.stroke();
        }
        if (o.after) o.after(M);
        g.restore();
        K.text(g, o.title, px + 5, py + 2, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'top' });
        return M;
      }
      function drawGraphs(g, Lo) {
        const W = timeWindow();
        const maxAbs = (arr, base) => { let m = base; for (let i = 0; i < arr.length; i++) if (arr[i][0] >= W.t0) m = Math.max(m, Math.abs(arr[i][1])); return m; };
        const vS = K.niceScale(-maxAbs(st.pts.v, 4.5) * 1.05, maxAbs(st.pts.v, 4.5) * 1.05, 4);
        const aS = K.niceScale(-maxAbs(st.pts.a, 2.8) * 1.05, maxAbs(st.pts.a, 2.8) * 1.05, 4);
        const match = st.mode === 'match';
        const G = Lo.graphs, small = G[0].w < 330;
        // x–t with the slope triangle
        chart(g, { x: G[0].x, y: G[0].y, w: G[0].w, h: G[0].h, t0: W.t0, t1: W.t1, yMin: -XMAX, yMax: XMAX, yStep: 5, color: theme.c1,
          title: K.tr(small ? { en: 'x – position (m)', hr: 'x – položaj (m)' } : { en: 'x – position (m): slope = velocity', hr: 'x – položaj (m): nagib = brzina' }, lang),
          points: st.pts.x, target: match ? st.targetX : null,
          after: M => {
            if (!st.showSlope || st.pts.x.length < 2) return;
            const p2 = st.pts.x[st.pts.x.length - 1], p1 = lookup(st.pts.x, p2[0] - 1);
            const dt = p2[0] - p1[0], dx = p2[1] - p1[1];
            if (dt < 0.05) return;
            const x1 = M.sx(p1[0]), y1 = M.sy(p1[1]), x2 = M.sx(p2[0]), y2 = M.sy(p2[1]);
            g.save(); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.setLineDash([4, 3]);
            g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]);
            g.fillStyle = K.withAlpha(theme.c1, 0.15); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y1); g.lineTo(x2, y2); g.closePath(); g.fill();
            const txt = 'Δx/Δt = ' + K.fmt(dx, 1, lang) + ' m / ' + K.fmt(dt, 1, lang) + ' s = ' + K.fmt(dx / dt, 1, lang) + ' m/s';
            g.font = 'bold 11px ' + theme.font;
            const tw = g.measureText(txt).width, tx = K.clamp(x2 - tw / 2, M.px + 4, M.px + M.pw - tw - 4);
            const ty = (y1 + y2) / 2 > M.py + M.ph / 2 ? M.py + 16 : M.py + M.ph - 20;
            g.fillStyle = K.withAlpha(theme.surface, 0.9); K.roundRect(g, tx - 4, ty - 2, tw + 8, 15, 4); g.fill();
            K.text(g, txt, tx, ty + 5.5, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
            K.text(g, 'Δt', (x1 + x2) / 2, y1 + (y2 < y1 ? 3 : -3), { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: y2 < y1 ? 'top' : 'bottom' });
            K.text(g, 'Δx', x2 + 4, (y1 + y2) / 2, { font: '10px ' + theme.font, color: theme.fg, baseline: 'middle' });
            g.restore();
          } });
        // v–t with the area (= displacement)
        let area = 0;
        chart(g, { x: G[1].x, y: G[1].y, w: G[1].w, h: G[1].h, t0: W.t0, t1: W.t1, yMin: vS.min, yMax: vS.max, yStep: vS.step, color: theme.c3,
          title: K.tr(small ? { en: 'v – velocity (m/s)', hr: 'v – brzina (m/s)' } : { en: 'v – velocity (m/s): area = displacement', hr: 'v – brzina (m/s): površina = pomak' }, lang),
          points: st.pts.v, target: match ? st.targetV : null,
          before: M => {
            if (!st.showArea) return;
            const pts = st.pts.v, y0 = M.sy(0);
            for (let i = 0; i < pts.length - 1; i++) {
              const ta = Math.max(pts[i][0], W.t0), tb = pts[i + 1][0];
              if (tb <= ta) continue;
              const v = pts[i][1];
              area += v * (tb - ta);
              g.fillStyle = K.withAlpha(v >= 0 ? theme.c3 : theme.c8, 0.3);
              g.fillRect(M.sx(ta), Math.min(y0, M.sy(v)), M.sx(tb) - M.sx(ta) + 0.5, Math.abs(M.sy(v) - y0));
            }
          },
          after: M => {
            if (!st.showArea) return;
            const txt = K.tr({ en: 'area = Δx = ', hr: 'površina = Δx = ' }, lang) + K.fmt(area, 1, lang) + ' m';
            g.font = 'bold 11px ' + theme.font;
            const tw = g.measureText(txt).width, tx = M.px + M.pw - tw - 8;
            g.fillStyle = K.withAlpha(theme.surface, 0.9); K.roundRect(g, tx - 4, M.py + 2, tw + 8, 15, 4); g.fill();
            K.text(g, txt, tx, M.py + 9.5, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
          } });
        // a–t
        chart(g, { x: G[2].x, y: G[2].y, w: G[2].w, h: G[2].h, t0: W.t0, t1: W.t1, yMin: aS.min, yMax: aS.max, yStep: aS.step, color: theme.c2,
          title: K.tr({ en: 'a – acceleration (m/s²)', hr: 'a – akceleracija (m/s²)' }, lang), points: st.pts.a, timeAxis: true });
      }
      function draw() {
        const g = cv.ctx, Lo = layout();
        g.clearRect(0, 0, Lo.w, Lo.h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, Lo.w, Lo.h);
        drawScene(g, Lo);
        drawGraphs(g, Lo);
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      buildTarget();
      applyMode();
      reset();
      return {
        destroy() {
          L.destroy(); window.removeEventListener('pointerup', onUp);
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          cv.canvas.removeEventListener('pointerup', onUp); cv.canvas.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
