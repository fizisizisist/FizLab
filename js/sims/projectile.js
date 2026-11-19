/* FizLab sim: Throwing Things — a dropped and a horizontally thrown ball (independent motions, strobe images),
   a cannon with a target (angle, speed, height, planet, air resistance) and three balls that land with the same speed. */
(function () {
  'use strict';
  const K = window.SimKit;
  const TAU = Math.PI * 2;
  const G = 9.81;
  const K_DRAG = 0.008;   // quadratic air drag per unit mass on Earth (1/m): a light ball, terminal speed about 35 m/s
  const DS = 0.02;        // a stored path has one point every DS seconds
  const STROBE = 0.2;     // time between two strobe images (s)
  const PLANETS = [
    { id: 'earth', g: 9.81, air: 1, name: { en: 'Earth', hr: 'Zemlja' }, label: { en: 'Earth (g = 9.81 m/s²)', hr: 'Zemlja (g = 9,81 m/s²)' } },
    { id: 'moon', g: 1.62, air: 0, name: { en: 'Moon', hr: 'Mjesec' }, label: { en: 'Moon (g = 1.62 m/s², no air)', hr: 'Mjesec (g = 1,62 m/s², bez zraka)' } },
    { id: 'mars', g: 3.71, air: 0.016, name: { en: 'Mars', hr: 'Mars' }, label: { en: 'Mars (g = 3.71 m/s², thin air)', hr: 'Mars (g = 3,71 m/s², rijedak zrak)' } }
  ];
  const MODES = [
    { value: 'drop', label: { en: 'Drop and throw', hr: 'Pusti i baci' } },
    { value: 'cannon', label: { en: 'Cannon', hr: 'Kosi hitac' } },
    { value: 'three', label: { en: 'Same speed at the ground?', hr: 'Ista brzina pri tlu?' } }
  ];
  const rmax = (v, g, h0) => v / g * Math.sqrt(v * v + 2 * g * h0);   // longest possible range without air

  // whole flight of one shot: analytic without air, midpoint integration with quadratic drag (k in 1/m)
  function flight(angDeg, v, h0, g, k) {
    const a = angDeg * Math.PI / 180, vx = v * Math.cos(a), vy = v * Math.sin(a), pts = [];
    if (!k) {
      const T = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g, tAp = Math.max(0, vy / g);
      for (let i = 0; i * DS < T; i++) { const t = i * DS; pts.push([vx * t, h0 + vy * t - 0.5 * g * t * t]); }
      pts.push([vx * T, 0]);
      return { pts, T, range: vx * T, hmax: h0 + vy * vy / (2 * g), tAp, xAp: vx * tAp };
    }
    const dt = DS / 10;
    let x = 0, y = h0, cvx = vx, cvy = vy, t = 0, i = 0, hmax = h0, tAp = 0, xAp = 0;
    pts.push([0, h0]);
    while (t < 300) {
      const s1 = Math.hypot(cvx, cvy), mx = cvx - k * s1 * cvx * dt / 2, my = cvy + (-g - k * s1 * cvy) * dt / 2, s2 = Math.hypot(mx, my);
      const nx = x + mx * dt, ny = y + my * dt;
      if (ny <= 0 && my <= 0) { const f = y > 0 ? y / (y - ny) : 0; x += (nx - x) * f; t += dt * f; break; }   // landed inside this step
      cvx -= k * s2 * mx * dt; cvy += (-g - k * s2 * my) * dt; x = nx; y = ny; t += dt; i++;
      if (y > hmax) { hmax = y; tAp = t; xAp = x; }
      if (i % 10 === 0) pts.push([x, y]);
    }
    pts.push([x, 0]);
    return { pts, T: t, range: x, hmax, tAp, xAp };
  }
  function posAt(p, t) { // position on a stored path at time t
    const n = p.pts.length;
    if (t >= p.T || n < 2) return p.pts[n - 1];
    const i = Math.min(n - 2, Math.floor(t / DS)), t0 = i * DS, t1 = i === n - 2 ? p.T : t0 + DS, f = t1 > t0 ? K.clamp((t - t0) / (t1 - t0), 0, 1) : 1;
    return [K.lerp(p.pts[i][0], p.pts[i + 1][0], f), K.lerp(p.pts[i][1], p.pts[i + 1][1], f)];
  }

  window.Sims.register({
    id: 'projectile',
    title: { en: 'Throwing Things', hr: 'Hitci' },
    summary: {
      en: 'Drop one ball and throw another sideways, aim a cannon at a target on Earth, the Moon or Mars, and find out whether a ball thrown up, sideways or down hits the ground fastest.',
      hr: 'Pusti jednu kuglicu, a drugu baci vodoravno, gađaj metu topom na Zemlji, Mjesecu ili Marsu i otkrij pada li na tlo najbrže kuglica bačena uvis, vodoravno ili prema dolje.'
    },
    tasks: [
      { en: 'Drop and throw: before you press Play, predict which ball lands first. Then double the throwing speed. What changes: the time, the distance, or both?', hr: 'Pusti i baci: prije pokretanja predvidi koja kuglica prije padne. Zatim udvostruči brzinu bacanja. Što se mijenja: vrijeme, put ili oboje?' },
      { en: 'Cannon: fire at 30°, 45° and 60° with the same speed. Which shot goes farthest? Which two land at the same spot?', hr: 'Kosi hitac: ispali pod 30°, 45° i 60° istom brzinom. Koji hitac ima najveći domet? Koja dva padnu na isto mjesto?' },
      { en: 'Hit the target. Then switch on air resistance and fire again with the same settings. How does the path change?', hr: 'Pogodi metu. Zatim uključi otpor zraka i ispali ponovno s istim postavkama. Kako se promijeni putanja?' },
      { en: 'Same speed at the ground? Predict which of the three balls lands with the greatest speed, then compare the speeds and the energy bars.', hr: 'Ista brzina pri tlu? Predvidi koja od triju kuglica padne najvećom brzinom, zatim usporedi brzine i stupce energije.' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 300, maxHeight: 500 });
      const C = K.controls(container, lang);

      const st = { mode: 'drop', rate: 0.5, h: 20, v0: 10, t: 0, done: false,                     // drop / three balls
        ang: 30, v: 25, h0: 0, planet: PLANETS[0], air: false, target: 50, tw: 4, shots: [], cur: null, hits: 0, fired: 0, count: 0, drag: false }; // cannon

      // ---------- controls ----------
      const fieldOf = c => { let e = c.el; while (e && e !== C.el) { if (e.classList && (e.classList.contains('sk-field') || e.classList.contains('sk-note'))) return e; e = e.parentNode; } return c.el; };
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };

      C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: MODES, value: 'drop', onChange: v => setMode(v) });
      const slH = C.slider({ label: { en: 'Height h', hr: 'Visina h' }, min: 1, max: 45, step: 1, value: 20, unit: 'm', digits: 0, onChange: v => { st.h = v; restart(); } });
      const slV0 = C.slider({ label: { en: 'Throwing speed v₀', hr: 'Brzina bacanja v₀' }, min: 0, max: 30, step: 1, value: 10, unit: 'm/s', digits: 0, onChange: v => { st.v0 = v; restart(); } });
      const slAng = C.slider({ label: { en: 'Angle', hr: 'Kut' }, min: 0, max: 90, step: 1, value: 30, digits: 0, format: (v, l) => K.fmt(v, 0, l) + '°', onChange: v => { st.ang = v; refresh(); } });
      const slV = C.slider({ label: { en: 'Launch speed v₀', hr: 'Početna brzina v₀' }, min: 5, max: 40, step: 1, value: 25, unit: 'm/s', digits: 0, onChange: v => { st.v = v; refresh(); } });
      const slH0 = C.slider({ label: { en: 'Launch height', hr: 'Početna visina' }, min: 0, max: 20, step: 1, value: 0, unit: 'm', digits: 0, onChange: v => { st.h0 = v; refresh(); } });
      const selPlanet = C.select({ label: { en: 'Planet', hr: 'Planet' }, options: PLANETS.map(p => ({ value: p.id, label: p.label })), value: 'earth',
        onChange: v => { st.planet = PLANETS.filter(p => p.id === v)[0] || PLANETS[0]; tgAir.input.disabled = st.planet.air === 0; clearShots(); placeTarget(0.78); updatePlay(); refresh(); } });
      const tgAir = C.toggle({ label: { en: 'Air resistance', hr: 'Otpor zraka' }, value: false, onChange: v => { st.air = v; refresh(); } });
      const btnTarget = C.button({ label: { en: 'New target', hr: 'Nova meta' }, onClick: () => { if (st.mode !== 'cannon') return; placeTarget(); refresh(); } });
      C.segmented({ label: { en: 'Time speed', hr: 'Brzina vremena' }, options: [{ value: '0.25', label: '0.25×' }, { value: '0.5', label: '0.5×' }, { value: '1', label: '1×' }], value: '0.5', onChange: v => { st.rate = parseFloat(v); } });
      const btnPlay = C.button({ label: { en: 'Drop and throw!', hr: 'Pusti i baci!' }, variant: 'primary', onClick: () => {
        if (st.mode === 'cannon') { if (!st.cur || st.cur.done) { launch(); updatePlay(); refresh(); return; } }
        else if (st.done) { st.t = 0; st.done = false; }
        L.toggle(); updatePlay(); refresh();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const roD = [
        C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 2 }),
        C.readout({ label: { en: 'Height of both balls', hr: 'Visina obiju kuglica' }, unit: 'm', digits: 1 }),
        C.readout({ label: { en: 'Thrown ball: distance x = v₀·t', hr: 'Bačena kuglica: put x = v₀·t' }, unit: 'm', digits: 1 }),
        C.readout({ label: { en: 'Dropped ball: speed', hr: 'Puštena kuglica: brzina' }, unit: 'm/s', digits: 1 }),
        C.readout({ label: { en: 'Thrown ball: speed', hr: 'Bačena kuglica: brzina' }, unit: 'm/s', digits: 1 })
      ];
      const roC = [
        C.readout({ label: { en: 'Range', hr: 'Domet' }, unit: 'm', digits: 1 }),
        C.readout({ label: { en: 'Greatest height', hr: 'Najveća visina' }, unit: 'm', digits: 1 }),
        C.readout({ label: { en: 'Flight time', hr: 'Vrijeme leta' }, unit: 's', digits: 2 }),
        C.readout({ label: { en: 'Hits / shots', hr: 'Pogodaka / hitaca' } })
      ];
      const roT = [
        C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 2 }),
        C.readout({ label: { en: 'Speed: thrown up ↑', hr: 'Brzina: bačena uvis ↑' }, unit: 'm/s', digits: 1 }),
        C.readout({ label: { en: 'Speed: thrown sideways →', hr: 'Brzina: bačena vodoravno →' }, unit: 'm/s', digits: 1 }),
        C.readout({ label: { en: 'Speed: thrown down ↓', hr: 'Brzina: bačena dolje ↓' }, unit: 'm/s', digits: 1 })
      ];
      const note = C.note({ text: { en: '', hr: '' } });
      let noteKey = '';
      function setNote(key, obj) { if (key === noteKey) return; noteKey = key; note.set(obj); }

      function applyMode() {
        const m = st.mode;
        [slH, slV0].forEach(c => show(c, m !== 'cannon'));
        [slAng, slV, slH0, selPlanet, tgAir, btnTarget].concat(roC).forEach(c => show(c, m === 'cannon'));
        roD.forEach(c => show(c, m === 'drop')); roT.forEach(c => show(c, m === 'three'));
      }
      function setMode(v) { L.stop(); st.mode = v; st.t = 0; st.done = false; st.drag = false; applyMode(); updatePlay(); refresh(); }
      function restart() { if (st.mode !== 'cannon') { L.stop(); st.t = 0; st.done = false; } updatePlay(); refresh(); }
      function refresh() { updateOut(); draw(); }
      function updatePlay() {
        let lab;
        if (L.running) lab = { en: 'Pause', hr: 'Pauza' };
        else if (st.mode === 'cannon') lab = st.cur && !st.cur.done ? { en: 'Continue', hr: 'Nastavi' } : { en: 'Fire!', hr: 'Ispali!' };
        else if (st.t > 0 && !st.done) lab = { en: 'Continue', hr: 'Nastavi' };
        else lab = st.mode === 'drop' ? { en: 'Drop and throw!', hr: 'Pusti i baci!' } : { en: 'Throw!', hr: 'Baci!' };
        btnPlay.setLabel(lab);
      }

      // ---------- physics ----------
      const tFall = () => Math.sqrt(2 * st.h / G);                          // dropped or thrown horizontally
      const vLand = () => Math.sqrt(st.v0 * st.v0 + 2 * G * st.h);           // landing speed of any ball thrown with v₀ from h
      const tUp = () => (st.v0 + vLand()) / G, tDown = () => (vLand() - st.v0) / G;
      const dragK = () => (st.air ? st.planet.air * K_DRAG : 0);
      function threeBalls(t) { // the three balls of "Same speed at the ground?" at time t
        const tu = tUp(), th = tFall(), td = tDown(), a = Math.min(t, tu), b = Math.min(t, th), c = Math.min(t, td);
        return [
          { sym: '↑', col: theme.c5, x: 0, y: Math.max(0, st.h + st.v0 * a - 0.5 * G * a * a), vx: 0, vy: st.v0 - G * a, T: tu, landed: t >= tu },
          { sym: '→', col: theme.c6, x: st.v0 * b, y: Math.max(0, st.h - 0.5 * G * b * b), vx: st.v0, vy: -G * b, T: th, landed: t >= th },
          { sym: '↓', col: theme.c7, x: 0, y: Math.max(0, st.h - st.v0 * c - 0.5 * G * c * c), vx: 0, vy: -st.v0 - G * c, T: td, landed: t >= td }
        ];
      }
      function clearShots() { L.stop(); st.shots = []; st.cur = null; }
      function placeTarget(frac) { // a fixed fraction of the longest range, or a random distance
        const R = rmax(st.v, st.planet.g, st.h0), old = st.target;
        st.tw = Math.max(2, Math.round(R * 0.06));
        for (let i = 0; i < 6; i++) {
          st.target = Math.max(2, Math.round((frac !== undefined ? frac : 0.3 + 0.62 * Math.random()) * R));
          if (frac !== undefined || Math.abs(st.target - old) > st.tw) break;
        }
      }
      function launch() {
        if (st.cur) { st.shots.push(st.cur); if (st.shots.length > 8) st.shots.shift(); }
        const g = st.planet.g, k = dragK(), p = flight(st.ang, st.v, st.h0, g, k);
        p.vac = k ? flight(st.ang, st.v, st.h0, g, 0) : null;             // the same shot without air, for comparison
        p.t = 0; p.done = false; p.hit = false; p.ang = st.ang; p.idx = st.count++; p.ff = Math.max(1, p.T / 10);   // long flights are fast-forwarded
        st.cur = p; st.fired++;
        L.start();
      }
      function step(dt) {
        const d = dt * st.rate;
        if (st.mode === 'cannon') {
          const p = st.cur;
          if (!p || p.done) { L.stop(); updatePlay(); return; }
          p.t += d * p.ff;
          if (p.t >= p.T) {
            p.t = p.T; p.done = true;
            if (Math.abs(p.range - st.target) <= st.tw / 2) { p.hit = true; st.hits++; }
            L.stop(); updatePlay();
          }
        } else {
          if (st.done) { L.stop(); updatePlay(); return; }
          const tEnd = st.mode === 'drop' ? tFall() : tUp();
          st.t += d;
          if (st.t >= tEnd) { st.t = tEnd; st.done = true; L.stop(); updatePlay(); }
        }
      }
      function updateOut() {
        if (st.mode === 'drop') {
          const t = st.t, vy = G * t;
          roD[0].set(t); roD[1].set(Math.max(0, st.h - 0.5 * G * t * t)); roD[2].set(st.v0 * t); roD[3].set(vy); roD[4].set(Math.hypot(st.v0, vy));
          setNote('drop', {
            en: 'Horizontal and vertical motion do not affect each other: sideways the thrown ball keeps its speed v₀, downwards both balls fall in exactly the same way. That is why they are always at the same height and land at the same time, t = √(2h/g).',
            hr: 'Vodoravno i okomito gibanje ne utječu jedno na drugo: bačena kuglica vodoravno zadržava brzinu v₀, a prema dolje obje padaju potpuno jednako. Zato su uvijek na istoj visini i padnu istodobno, t = √(2h/g).' });
        } else if (st.mode === 'cannon') {
          const p = st.cur, e = p ? posAt(p, p.t) : null;
          roC[0].set(p ? e[0] : null); roC[1].set(p ? (p.t >= p.tAp ? p.hmax : e[1]) : null); roC[2].set(p ? p.t : null);
          roC[3].set({ en: st.hits + ' / ' + st.fired, hr: st.hits + ' / ' + st.fired });
          if (dragK() > 0) setNote('air', {
            en: 'Air resistance always acts against the motion: the path is shorter, lower and no longer symmetric; the ball comes down more steeply than it went up. The dashed line shows the same shot without air.',
            hr: 'Otpor zraka uvijek djeluje suprotno gibanju: putanja je kraća, niža i više nije simetrična; kuglica pada strmije nego što se penjala. Crtkana crta pokazuje isti hitac bez zraka.' });
          else setNote('vac', {
            en: 'Without air the path is a parabola. On level ground 45° gives the longest range, and two angles that add up to 90° (such as 30° and 60°) land at the same spot. Drag the cannon to aim.',
            hr: 'Bez zraka putanja je parabola. Na ravnom tlu najveći domet daje kut od 45°, a dva kuta koja zajedno daju 90° (npr. 30° i 60°) padaju na isto mjesto. Povuci top da naciljaš.' });
        } else {
          const b = threeBalls(st.t);
          roT[0].set(st.t); b.forEach((q, i) => roT[i + 1].set(Math.hypot(q.vx, q.vy)));
          setNote('three', {
            en: 'The three balls land at different times but with the SAME speed. Each one starts with the same energy ½·m·v² + m·g·h, and energy is conserved, so at the ground all of it is kinetic energy. Only the direction of the velocity differs.',
            hr: 'Tri kuglice padnu u različitim trenucima, ali ISTOM brzinom. Svaka kreće s jednakom energijom ½·m·v² + m·g·h, a energija je očuvana pa je pri tlu sva kinetička. Razlikuje se samo smjer brzine.' });
        }
      }

      // ---------- geometry ----------
      function viewDrop() {
        const w = cv.w, h = cv.h, x0 = K.clamp(w * 0.14, 50, 110), top = 56, bot = 34, gy = h - bot;
        const ppm = Math.min((w - x0 - 76) / Math.max(st.v0 * tFall(), 2), (h - top - bot) / st.h);
        return { w, h, x0, gy, ppm, Y: y => gy - y * ppm };
      }
      function viewCannon() {
        const w = cv.w, h = cv.h, g = st.planet.g, x0 = 44, top = 58, bot = 34, gy = h - bot;
        const xm = Math.max(rmax(st.v, g, st.h0), st.target + st.tw) * 1.06, ym = (st.h0 + st.v * st.v / (2 * g)) * 1.06;
        const ppm = Math.min((w - x0 - 16) / xm, (h - top - bot) / ym);
        return { w, h, x0, gy, ppm, xmax: (w - x0) / ppm, X: x => x0 + x * ppm, Y: y => gy - y * ppm };
      }
      function viewThree() {
        const w = cv.w, h = cv.h, pw = K.clamp(w * 0.36, 132, 300), sw = w - pw - 10;
        const x0 = K.clamp(sw * 0.16, 34, 90), top = 56, bot = 30, gy = h - bot;
        const ppm = Math.min((sw - x0 - 74) / Math.max(st.v0 * tFall(), 1), (h - top - bot) / ((st.h + st.v0 * st.v0 / (2 * G)) * 1.04));
        return { w, h, pw, sw, x0, gy, ppm, Y: y => gy - y * ppm };
      }

      // ---------- pointer: drag the cannon to aim ----------
      function aim(p) {
        const V = viewCannon();
        st.ang = K.clamp(Math.round(Math.atan2(V.Y(st.h0) - p.y, p.x - V.X(0)) * 180 / Math.PI), 0, 90);
        slAng.set(st.ang); refresh();
      }
      function onDown(ev) {
        if (st.mode !== 'cannon') return;
        const V = viewCannon(), p = cv.pointer(ev);
        if (Math.hypot(p.x - V.X(0), p.y - V.Y(st.h0)) > 90) return;
        st.drag = true; ev.preventDefault(); cv.canvas.style.cursor = 'grabbing'; aim(p);
      }
      function onMove(ev) { if (st.drag) aim(cv.pointer(ev)); }
      function onUp() { if (!st.drag) return; st.drag = false; cv.canvas.style.cursor = ''; }
      cv.canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      // ---------- drawing helpers ----------
      const fnt = (px, bold, display) => (bold ? 'bold ' : '') + px + 'px ' + (display ? theme.fontDisplay : theme.font);
      function fit(g, str, maxW, base, bold, display) {
        let px = base; g.font = fnt(px, bold, display);
        while (px > 9 && g.measureText(str).width > maxW) { px--; g.font = fnt(px, bold, display); }
        return fnt(px, bold, display);
      }
      function label(g, txt, x, y, o) { K.text(g, txt, x, y, Object.assign({ font: fnt(11, true), color: theme.fg, baseline: 'middle' }, o || {})); }
      function pill(g, txt, x, y, align, maxX) {
        g.font = fnt(11, true);
        const tw = g.measureText(txt).width;
        const tx = K.clamp(align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x, 4, Math.max(4, (maxX || cv.w) - tw - 4));
        g.fillStyle = K.withAlpha(theme.surface, 0.85); K.roundRect(g, tx - 4, y - 8, tw + 8, 16, 5); g.fill();
        label(g, txt, tx, y);
      }
      function header(g, s1, s2, maxW) { // bold title line + a hint that wraps onto a second line on narrow screens
        K.text(g, s1, 10, 15, { font: fit(g, s1, maxW, 14, true, true), color: theme.fg, baseline: 'middle' });
        if (!s2) return;
        g.font = fnt(12);
        if (g.measureText(s2).width <= maxW) { K.text(g, s2, 10, 34, { font: fnt(12), color: theme.muted, baseline: 'middle' }); return; }
        g.font = fnt(11);
        const words = s2.split(' ');
        let a = '', i = 0;
        while (i < words.length && g.measureText(a ? a + ' ' + words[i] : words[i]).width <= maxW) { a = a ? a + ' ' + words[i] : words[i]; i++; }
        const b = words.slice(i).join(' ');
        K.text(g, a, 10, 31, { font: fnt(11), color: theme.muted, baseline: 'middle' });
        if (b) K.text(g, b, 10, 45, { font: fit(g, b, maxW, 11, false), color: theme.muted, baseline: 'middle' });
      }
      function ground(g, gy) { g.fillStyle = theme.ground; g.fillRect(0, gy, cv.w, cv.h - gy); g.fillStyle = theme.good; g.fillRect(0, gy, cv.w, 4); }
      function ledge(g, V) { // the ledge the balls leave from, with its height
        const top = V.Y(st.h);
        g.fillStyle = theme.ground; g.fillRect(0, top, V.x0, V.gy - top); g.fillStyle = theme.good; g.fillRect(0, top, V.x0, 4);
        const x = V.x0 - 12;
        if (V.gy - top > 30) { K.arrow(g, x, (top + V.gy) / 2, x, top + 6, { color: theme.fg, width: 1.5, head: 6 }); K.arrow(g, x, (top + V.gy) / 2, x, V.gy - 2, { color: theme.fg, width: 1.5, head: 6 }); }
        pill(g, 'h = ' + K.fmt(st.h, 0, lang) + ' m', x - 8, (top + V.gy) / 2, 'right');
      }
      function ball(g, x, y, r, col) {
        g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
        g.fillStyle = K.withAlpha('#ffffff', 0.35); g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.35, 0, TAU); g.fill();
      }
      function ghost(g, x, y, col) { g.fillStyle = K.withAlpha(col, 0.3); g.beginPath(); g.arc(x, y, 7, 0, TAU); g.fill(); g.strokeStyle = K.withAlpha(col, 0.85); g.lineWidth = 1; g.stroke(); }
      function keyRows(g, rows, y0) { // legend in the top right corner; returns its width
        g.font = fnt(11);
        let mw = 0; rows.forEach(r => { mw = Math.max(mw, g.measureText(r.t).width); });
        rows.forEach((r, i) => {
          const y = y0 + i * 15, x = cv.w - 10 - mw;
          if (r.arrow === 'h') K.arrow(g, x - 20, y, x - 5, y, { color: r.c, width: 2.5, head: 6 });
          else if (r.arrow === 'v') K.arrow(g, x - 12, y - 7, x - 12, y + 7, { color: r.c, width: 2.5, head: 6 });
          else { g.fillStyle = r.c; g.beginPath(); g.arc(x - 12, y, 5, 0, TAU); g.fill(); }
          label(g, r.t, x, y, { font: fnt(11) });
        });
        return mw + 34;
      }
      const shotCol = q => theme['c' + (1 + q.idx % 8)];

      // ---------- scene: drop and throw ----------
      function drawDrop(g, V) {
        const w = V.w, t = st.t, tf = tFall(), vy = G * t, R = 8, vs = 2.2;
        const XA = V.x0 + 14, XB0 = V.x0 + 40, yOf = tt => V.Y(Math.max(0, st.h - 0.5 * G * tt * tt)) - R, xOf = tt => XB0 + st.v0 * tt * V.ppm;
        ground(g, V.gy); ledge(g, V);
        // path of the thrown ball so far
        g.strokeStyle = K.withAlpha(theme.c2, 0.6); g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i <= 40; i++) { const tt = t * i / 40; i ? g.lineTo(xOf(tt), yOf(tt)) : g.moveTo(xOf(tt), yOf(tt)); }
        g.stroke();
        // strobe images every 0.2 s: the two balls are always at the same height
        const n = Math.floor(t / STROBE + 1e-9);
        let lastLab = -99;
        for (let k = 0; k <= n; k++) {
          const tk = k * STROBE, y = yOf(tk), xb = xOf(tk);
          g.save(); g.setLineDash([4, 4]); g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(XA, y); g.lineTo(xb, y); g.stroke(); g.restore();
          ghost(g, XA, y, theme.c1); ghost(g, xb, y, theme.c2);
          if (k > 0 && y - lastLab >= 13) { label(g, K.fmt(tk, 1, lang) + ' s', xb + 12, y, { font: fnt(10), color: theme.muted }); lastLab = y; }
        }
        const yb = yOf(t), xb = xOf(t);
        if (!st.done) {                                                    // velocity components: vx stays, vy grows (the same for both)
          if (st.v0 > 0) K.arrow(g, xb, yb, xb + st.v0 * vs, yb, { color: theme.c3, width: 3, head: 8 });
          if (vy > 0.3) { K.arrow(g, xb, yb, xb, yb + vy * vs, { color: theme.c5, width: 3, head: 8 }); K.arrow(g, XA, yb, XA, yb + vy * vs, { color: theme.c5, width: 3, head: 8 }); }
        }
        ball(g, XA, yb, R, theme.c1); ball(g, xb, yb, R, theme.c2);
        if (st.done) {                                                     // landed: distance of the thrown ball and both landing speeds
          if (st.v0 > 0) { const mid = (XB0 + xb) / 2; K.arrow(g, mid, V.gy + 10, XB0, V.gy + 10, { color: theme.fg, width: 1.5, head: 6 }); K.arrow(g, mid, V.gy + 10, xb, V.gy + 10, { color: theme.fg, width: 1.5, head: 6 }); }
          pill(g, 'x = v₀·t = ' + K.fmt(st.v0 * tf, 1, lang) + ' m', (XB0 + xb) / 2, V.gy + 23, 'center');
          pill(g, 'v = ' + K.fmt(Math.hypot(st.v0, vy), 1, lang) + ' m/s', xb + 14, yb - 14, 'left');
          pill(g, 'v = ' + K.fmt(vy, 1, lang) + ' m/s', XA + 2, yb - 30, 'left');
        }
        const wide = w >= 620;                                           // legend: beside the header on wide screens, below it on narrow ones
        const kw = keyRows(g, [
          { c: theme.c1, t: K.tr({ en: 'dropped', hr: 'puštena' }, lang) },
          { c: theme.c2, t: K.tr(wide ? { en: 'thrown sideways', hr: 'bačena vodoravno' } : { en: 'thrown', hr: 'bačena' }, lang) },
          { c: theme.c3, arrow: 'h', t: 'v_x = ' + K.fmt(st.v0, 1, lang) + ' m/s' + (wide ? ' ' + K.tr({ en: '(stays the same)', hr: '(ne mijenja se)' }, lang) : '') },
          { c: theme.c5, arrow: 'v', t: 'v_y = ' + (wide ? 'g·t = ' : '') + K.fmt(vy, 1, lang) + ' m/s' + (wide ? ' ' + K.tr({ en: '(same for both)', hr: '(jednaka za obje)' }, lang) : '') }
        ], wide ? 14 : 50);
        const l2 = st.done ? { en: 'Both land at the same moment: t = √(2h/g) = ' + K.fmt(tf, 2, 'en') + ' s.', hr: 'Obje padnu u istom trenutku: t = √(2h/g) = ' + K.fmt(tf, 2, 'hr') + ' s.' }
          : t > 0 ? { en: 'Look at the dashed lines: both balls are at the same height.', hr: 'Pogledaj crtkane crte: obje su kuglice na istoj visini.' }
            : { en: 'One ball is dropped, the other thrown sideways at the same moment. Which lands first?', hr: 'Jedna se kuglica pusti, a druga u istom trenutku baci vodoravno. Koja prije padne?' };
        header(g, 'h = ' + K.fmt(st.h, 0, lang) + ' m  ·  v₀ = ' + K.fmt(st.v0, 0, lang) + ' m/s  ·  t = ' + K.fmt(t, 2, lang) + ' s', wide ? K.tr(l2, lang) : '', wide ? w - 20 - kw : w - 20);
      }

      // ---------- scene: cannon ----------
      function drawPath(g, V, q, t, cur) {
        const n = q.pts.length, last = t >= q.T ? n - 1 : Math.min(n - 2, Math.floor(t / DS)), e = posAt(q, t);
        g.save(); g.strokeStyle = cur ? shotCol(q) : K.withAlpha(shotCol(q), 0.5); g.lineWidth = cur ? 2.5 : 1.5; g.lineJoin = 'round'; g.beginPath();
        for (let i = 0; i <= last; i++) { const x = V.X(q.pts[i][0]), y = V.Y(q.pts[i][1]); i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.lineTo(V.X(e[0]), V.Y(e[1])); g.stroke(); g.restore();
        return e;
      }
      function drawCannonScene(g, V) {
        const w = V.w, p = st.cur, X0 = V.X(0), Y0 = V.Y(st.h0), a = st.ang * Math.PI / 180, airOn = dragK() > 0;
        ground(g, V.gy);
        const sc = K.niceScale(0, V.xmax, 6);
        for (let m = 0; m <= V.xmax && sc.step > 0; m += sc.step) {      // distance marks on the ground
          g.fillStyle = theme.fg; g.fillRect(V.X(m) - 0.5, V.gy + 4, 1, 5);
          if (m > 0) label(g, K.fmt(m, 0, lang) + ' m', V.X(m), V.gy + 20, { align: 'center', font: fnt(11) });
        }
        if (st.h0 > 0) { g.fillStyle = theme.surface2; g.fillRect(X0 - 30, Y0 + 8, 38, V.gy - Y0 - 8); g.strokeStyle = theme.muted; g.lineWidth = 1; g.strokeRect(X0 - 30, Y0 + 8, 38, V.gy - Y0 - 8); }
        // target
        const tx = V.X(st.target), tpx = Math.max(8, st.tw * V.ppm);
        g.fillStyle = theme.c8; g.fillRect(tx - tpx / 2, V.gy - 4, tpx, 8);
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(tx, V.gy - 4); g.lineTo(tx, V.gy - 34); g.stroke();
        g.fillStyle = theme.c8; g.beginPath(); g.moveTo(tx, V.gy - 34); g.lineTo(tx + 15, V.gy - 28); g.lineTo(tx, V.gy - 22); g.closePath(); g.fill();
        pill(g, K.tr({ en: 'target ', hr: 'meta ' }, lang) + K.fmt(st.target, 0, lang) + ' m', tx, V.gy - 46, 'center');
        // earlier shots stay faintly, labelled with their angle
        st.shots.forEach(q => {
          drawPath(g, V, q, q.T, false);
          g.fillStyle = shotCol(q); g.beginPath(); g.arc(V.X(q.range), V.gy, 3, 0, TAU); g.fill();
          label(g, K.fmt(q.ang, 0, lang) + '°', V.X(q.xAp), V.Y(q.hmax) - 9, { align: 'center', font: fnt(11), color: theme.muted });
        });
        if (p) {
          if (p.vac) {                                                     // the same shot without air
            g.save(); g.setLineDash([5, 5]); g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath();
            p.vac.pts.forEach((q, i) => { i ? g.lineTo(V.X(q[0]), V.Y(q[1])) : g.moveTo(V.X(q[0]), V.Y(q[1])); });
            g.stroke(); g.restore();
            label(g, K.tr({ en: 'without air', hr: 'bez zraka' }, lang), V.X(p.vac.xAp), V.Y(p.vac.hmax) - 9, { align: 'center', font: fnt(11), color: theme.muted });
          }
          const e = drawPath(g, V, p, p.t, true);
          if (p.t >= p.tAp && p.hmax > st.h0 + 0.05) {                     // greatest height
            g.save(); g.setLineDash([3, 4]); g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(V.X(p.xAp), V.Y(p.hmax)); g.lineTo(V.X(p.xAp), V.gy); g.stroke(); g.restore();
            pill(g, K.tr({ en: 'greatest height ', hr: 'najveća visina ' }, lang) + K.fmt(p.hmax, 1, lang) + ' m', V.X(p.xAp), V.Y(p.hmax) - 14, 'center');
          }
          if (p.done && p.range > 0.05) {                                  // range
            const mid = (X0 + V.X(p.range)) / 2;
            K.arrow(g, mid, V.gy - 12, X0 + 12, V.gy - 12, { color: theme.fg, width: 1.5, head: 6 }); K.arrow(g, mid, V.gy - 12, V.X(p.range), V.gy - 12, { color: theme.fg, width: 1.5, head: 6 });
            pill(g, K.tr({ en: 'range ', hr: 'domet ' }, lang) + K.fmt(p.range, 1, lang) + ' m', mid, V.gy - 24, 'center');
          }
          ball(g, V.X(e[0]), V.Y(e[1]), 6, shotCol(p));
        }
        // the cannon, its angle and the aiming line
        g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.arc(X0, Y0, 48, -a, 0); g.stroke();
        g.save(); g.setLineDash([4, 5]); g.beginPath(); g.moveTo(X0, Y0); g.lineTo(X0 + 66, Y0); g.moveTo(X0 + 36 * Math.cos(a), Y0 - 36 * Math.sin(a)); g.lineTo(X0 + 78 * Math.cos(a), Y0 - 78 * Math.sin(a)); g.stroke(); g.restore();
        g.save(); g.translate(X0, Y0); g.rotate(-a); g.fillStyle = theme.fg; K.roundRect(g, -6, -6, 42, 12, 3); g.fill(); g.restore();
        g.fillStyle = theme.muted; g.beginPath(); g.arc(X0, Y0, 9, 0, TAU); g.fill(); g.strokeStyle = theme.fg; g.lineWidth = 2; g.stroke();
        pill(g, K.fmt(st.ang, 0, lang) + '°', X0 + 62 * Math.cos(a / 2), Y0 - 62 * Math.sin(a / 2) - 4, 'left');
        // texts
        const hits = K.tr({ en: 'hits: ', hr: 'pogodaka: ' }, lang) + st.hits + ' / ' + st.fired;
        pill(g, hits, w - 10, 15, 'right');
        if (p && p.ff > 1.05) label(g, K.tr({ en: 'fast-forward ×', hr: 'ubrzano ×' }, lang) + K.fmt(p.ff, 1, lang), w - 10, 34, { align: 'right', font: fnt(11), color: theme.muted });
        g.font = fnt(11, true);
        const kw = g.measureText(hits).width + 24, miss = p ? p.range - st.target : 0;
        const l2 = !p ? { en: 'Drag the cannon or use the sliders, then press Fire. Can you hit the target?', hr: 'Povuci top ili namjesti klizače pa pritisni Ispali. Možeš li pogoditi metu?' }
          : !p.done ? { en: 't = ' + K.fmt(p.t, 2, 'en') + ' s', hr: 't = ' + K.fmt(p.t, 2, 'hr') + ' s' }
            : p.hit ? { en: 'Hit! Range ' + K.fmt(p.range, 1, 'en') + ' m in ' + K.fmt(p.T, 2, 'en') + ' s.', hr: 'Pogodak! Domet ' + K.fmt(p.range, 1, 'hr') + ' m za ' + K.fmt(p.T, 2, 'hr') + ' s.' }
              : { en: 'Missed: ' + K.fmt(Math.abs(miss), 1, 'en') + ' m too ' + (miss > 0 ? 'far' : 'short') + '. Change the angle or the speed.', hr: 'Promašaj: ' + K.fmt(Math.abs(miss), 1, 'hr') + ' m ' + (miss > 0 ? 'predaleko' : 'prekratko') + '. Promijeni kut ili brzinu.' };
        header(g, K.tr(st.planet.name, lang) + '  ·  α = ' + K.fmt(st.ang, 0, lang) + '°  ·  v₀ = ' + K.fmt(st.v, 0, lang) + ' m/s' + (st.h0 > 0 ? '  ·  h₀ = ' + K.fmt(st.h0, 0, lang) + ' m' : '') +
          (airOn ? '  ·  ' + K.tr({ en: 'air resistance', hr: 'otpor zraka' }, lang) : ''), K.tr(l2, lang), w - 20 - kw);
      }

      // ---------- scene: three balls, same speed at the ground ----------
      function drawThree(g, V) {
        const t = st.t, R = 8, b = threeBalls(t), E = 0.5 * st.v0 * st.v0 + G * st.h, X = [V.x0 + 14, V.x0 + 62, V.x0 + 38];
        ground(g, V.gy); ledge(g, V);
        const top = V.Y(st.h + st.v0 * st.v0 / (2 * G)) - R;
        g.save(); g.setLineDash([3, 4]); g.lineWidth = 1.5;                // the three paths
        g.strokeStyle = K.withAlpha(b[0].col, 0.7); g.beginPath(); g.moveTo(X[0], V.Y(st.h) - R); if (b[0].vy <= 0) g.lineTo(X[0], top); g.lineTo(X[0], V.Y(b[0].y) - R); g.stroke();
        g.strokeStyle = K.withAlpha(b[1].col, 0.7); g.beginPath();
        for (let i = 0; i <= 40; i++) { const tt = Math.min(t, b[1].T) * i / 40, x = X[1] + st.v0 * tt * V.ppm, y = V.Y(Math.max(0, st.h - 0.5 * G * tt * tt)) - R; i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke();
        g.strokeStyle = K.withAlpha(b[2].col, 0.7); g.beginPath(); g.moveTo(X[2], V.Y(st.h) - R); g.lineTo(X[2], V.Y(b[2].y) - R); g.stroke();
        g.restore();
        b.forEach((q, i) => {
          const x = X[i] + q.x * V.ppm, y = V.Y(q.y) - R, sp = Math.hypot(q.vx, q.vy);
          if (!q.landed && sp > 0.3) K.arrow(g, x, y, x + q.vx * 1.6, y - q.vy * 1.6, { color: theme.fg, width: 2.5, head: 7 });
          ball(g, x, y, R, q.col);
          if (q.landed && i === 1) pill(g, 'v = ' + K.fmt(sp, 1, lang) + ' m/s', x, y - 18, 'center', V.sw);
        });
        // panel: energy bars and the landing speeds side by side
        const px = V.sw + 4, py = 8, pw = V.w - px - 8, ph = V.h - 16;
        g.fillStyle = K.withAlpha(theme.surface, 0.94); K.roundRect(g, px, py, pw, ph, 10); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1; g.stroke();
        const ttl = K.tr(pw >= 200 ? { en: 'Energy of each ball (m = 1 kg)', hr: 'Energija svake kuglice (m = 1 kg)' } : { en: 'Energy (m = 1 kg)', hr: 'Energija (m = 1 kg)' }, lang);
        K.text(g, ttl, px + pw / 2, py + 14, { font: fit(g, ttl, pw - 14, 12, true), color: theme.fg, align: 'center', baseline: 'middle' });
        [[theme.c2, 'E_k = ½·m·v²'], [theme.c1, 'E_p = m·g·h']].forEach((r, i) => { g.fillStyle = r[0]; g.fillRect(px + 10, py + 27 + i * 15, 9, 9); label(g, r[1], px + 24, py + 32 + i * 15, { font: fnt(11) }); });
        const bt = py + 74, bb = py + ph - 66, bh = Math.max(20, bb - bt), bw = Math.min(34, pw / 3 - 14);
        const es = 'E = ' + K.fmt(E, 0, lang) + ' J';
        g.save(); g.setLineDash([4, 4]); g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(px + 8, bt); g.lineTo(px + pw - 8, bt); g.stroke(); g.restore();
        label(g, es, px + pw - 8, bt - 8, { align: 'right', font: fnt(11) });
        b.forEach((q, i) => {
          const cx = px + pw * (i + 0.5) / 3, sp = Math.hypot(q.vx, q.vy), hp = bh * G * q.y / E, hk = bh * 0.5 * sp * sp / E;
          g.fillStyle = K.withAlpha(theme.fg, 0.07); g.fillRect(cx - bw / 2, bt, bw, bh);
          g.fillStyle = theme.c1; g.fillRect(cx - bw / 2, bb - hp, bw, hp);
          g.fillStyle = theme.c2; g.fillRect(cx - bw / 2, bb - hp - hk, bw, hk);
          g.fillStyle = q.col; g.beginPath(); g.arc(cx - 7, bb + 11, 5, 0, TAU); g.fill(); label(g, q.sym, cx + 2, bb + 11, { font: fnt(13, true) });
          const row = q.sym + '  v = ' + K.fmt(sp, 1, lang) + ' m/s' + (q.landed ? '  ·  t = ' + K.fmt(q.T, 2, lang) + ' s' : '');
          K.text(g, row, px + 10, py + ph - 40 + i * 15, { font: fit(g, row, pw - 18, 11, q.landed), color: theme.fg, baseline: 'middle' });
        });
        const vl = vLand();
        const l2 = st.done ? { en: 'Different times, the same landing speed: v = √(v₀² + 2·g·h) = ' + K.fmt(vl, 1, 'en') + ' m/s.', hr: 'Različita vremena, ista brzina pri tlu: v = √(v₀² + 2·g·h) = ' + K.fmt(vl, 1, 'hr') + ' m/s.' }
          : t > 0 ? { en: 'Watch the bars: potential energy turns into kinetic energy, the total stays the same.', hr: 'Prati stupce: potencijalna energija prelazi u kinetičku, zbroj ostaje isti.' }
            : { en: 'Three identical balls leave with the same speed: up, sideways and down. Which lands fastest?', hr: 'Tri jednake kuglice kreću istom brzinom: uvis, vodoravno i dolje. Koja padne najvećom brzinom?' };
        header(g, 'h = ' + K.fmt(st.h, 0, lang) + ' m  ·  v₀ = ' + K.fmt(st.v0, 0, lang) + ' m/s  ·  t = ' + K.fmt(t, 2, lang) + ' s', V.sw >= 420 ? K.tr(l2, lang) : '', V.sw - 14);
      }

      function draw() {
        const g = cv.ctx;
        g.clearRect(0, 0, cv.w, cv.h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, cv.w, cv.h);
        if (st.mode === 'drop') drawDrop(g, viewDrop()); else if (st.mode === 'cannon') drawCannonScene(g, viewCannon()); else drawThree(g, viewThree());
      }
      function reset() {
        clearShots(); st.t = 0; st.done = false; st.hits = 0; st.fired = 0; st.count = 0; st.drag = false;
        placeTarget(0.78); updatePlay(); refresh();
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      applyMode();
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
