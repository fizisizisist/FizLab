/* FizLab sim: Free fall — two objects, several planets, optional air resistance, live v–t graph. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G_EARTH = 9.81;
  const PLANETS = [
    { id: 'earth', g: 9.81, air: 1, label: { en: 'Earth', hr: 'Zemlja' } },
    { id: 'moon', g: 1.62, air: 0, label: { en: 'Moon (no air)', hr: 'Mjesec (bez zraka)' } },
    { id: 'mars', g: 3.71, air: 0.02, label: { en: 'Mars (thin air)', hr: 'Mars (rijedak zrak)' } },
    { id: 'jupiter', g: 24.79, air: 1, label: { en: 'Jupiter', hr: 'Jupiter' } }
  ];
  const OBJECTS = [
    { id: 'feather', vt: 1.6, label: { en: 'Feather', hr: 'Pero' } },
    { id: 'paper', vt: 7, label: { en: 'Paper ball', hr: 'Papirnata kuglica' } },
    { id: 'tennis', vt: 22, label: { en: 'Tennis ball', hr: 'Teniska loptica' } },
    { id: 'stone', vt: 60, label: { en: 'Stone', hr: 'Kamen' } }
  ];
  const BALL_VT = 90; // steel ball terminal speed on Earth (m/s)

  window.Sims.register({
    id: 'freefall',
    title: { en: 'Free Fall', hr: 'Slobodni pad' },
    summary: {
      en: 'Drop a steel ball next to another object. Change the planet, switch the air on or off, and watch the speed graph.',
      hr: 'Pusti čeličnu kuglicu uz drugo tijelo. Promijeni planet, uključi ili isključi zrak i prati graf brzine.'
    },
    tasks: [
      { en: 'Drop the ball and the feather on Earth with air ON. Which lands first? Now switch the air OFF and try again.', hr: 'Pusti kuglicu i pero na Zemlji s UKLJUČENIM zrakom. Što prije padne? Zatim ISKLJUČI zrak i ponovi.' },
      { en: 'Go to the Moon. Why do both objects land at the same time?', hr: 'Prebaci se na Mjesec. Zašto oba tijela padnu u istom trenutku?' },
      { en: 'Read the speed after 1 s on Earth and on Jupiter. How many times bigger is it on Jupiter?', hr: 'Pročitaj brzinu nakon 1 s na Zemlji i na Jupiteru. Koliko je puta veća na Jupiteru?' },
      { en: 'Look at the graph: a straight line means the speed grows evenly. When does the feather\'s line become flat?', hr: 'Pogledaj graf: ravna crta znači da brzina raste jednoliko. Kad crta pera postane vodoravna?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);

      const st = { planet: PLANETS[0], obj: OBJECTS[0], h0: 20, air: true, scale: 0.5, t: 0, running: false,
        a: { h: 20, v: 0, landed: null, pts: [] }, b: { h: 20, v: 0, landed: null, pts: [] }, lastSample: -1 };

      const selPlanet = C.select({ label: { en: 'Planet', hr: 'Planet' }, options: PLANETS.map(p => ({ value: p.id, label: p.label })), value: 'earth',
        onChange: v => { st.planet = PLANETS.find(p => p.id === v); airToggle.set(st.planet.air > 0 && st.air); airToggle.input.disabled = st.planet.air === 0; reset(); } });
      const selObj = C.select({ label: { en: 'Second object', hr: 'Drugo tijelo' }, options: OBJECTS.map(o => ({ value: o.id, label: o.label })), value: 'feather',
        onChange: v => { st.obj = OBJECTS.find(o => o.id === v); reset(); } });
      const slH = C.slider({ label: { en: 'Drop height', hr: 'Visina' }, min: 5, max: 60, step: 1, value: 20, unit: 'm', digits: 0, onChange: v => { st.h0 = v; reset(); } });
      const airToggle = C.toggle({ label: { en: 'Air resistance', hr: 'Otpor zraka' }, value: true, onChange: v => { st.air = v; reset(); } });
      const segScale = C.segmented({ label: { en: 'Time speed', hr: 'Brzina vremena' }, options: [
        { value: '0.25', label: '0.25×' }, { value: '0.5', label: '0.5×' }, { value: '1', label: '1×' }], value: '0.5', onChange: v => { st.scale = parseFloat(v); } });
      const btnPlay = C.button({ label: { en: 'Drop!', hr: 'Pusti!' }, variant: 'primary', onClick: () => {
        if (st.a.landed !== null && st.b.landed !== null) { reset(); }
        L.toggle(); updatePlay();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const outT = C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 2 });
      const outVA = C.readout({ label: { en: 'Ball speed', hr: 'Brzina kuglice' }, unit: 'm/s', digits: 1 });
      const outVB = C.readout({ label: { en: 'Object speed', hr: 'Brzina tijela' }, unit: 'm/s', digits: 1 });
      const outHA = C.readout({ label: { en: 'Ball height', hr: 'Visina kuglice' }, unit: 'm', digits: 1 });
      const note = C.note({ text: { en: '', hr: '' } });

      function updatePlay() {
        btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : (st.t > 0 ? { en: 'Continue', hr: 'Nastavi' } : { en: 'Drop!', hr: 'Pusti!' }));
      }
      function dragCoef(vt) { // acceleration coefficient c so that a = g - c v^2 ; terminal speed on Earth = vt
        if (!st.air || st.planet.air === 0) return 0;
        return st.planet.air * G_EARTH / (vt * vt);
      }
      function reset() {
        L.stop(); st.t = 0; st.lastSample = -1;
        [st.a, st.b].forEach(o => { o.h = st.h0; o.v = 0; o.landed = null; o.pts = [[0, 0]]; });
        updatePlay(); updateOut(); draw();
      }
      function step(dt) {
        dt *= st.scale;
        const g = st.planet.g;
        const bodies = [[st.a, BALL_VT], [st.b, st.obj.vt]];
        // sub-steps for stability with strong drag
        const n = 4, h = dt / n;
        for (let i = 0; i < n; i++) {
          bodies.forEach(([o, vt]) => {
            if (o.landed !== null) return;
            const c = dragCoef(vt);
            o.v += (g - c * o.v * o.v) * h;
            o.h -= o.v * h;
            if (o.h <= 0) { o.h = 0; o.landed = st.t + h * (i + 1); }
          });
        }
        st.t += dt;
        if (st.t - st.lastSample >= 0.02) {
          st.lastSample = st.t;
          bodies.forEach(([o]) => { if (o.landed === null || o.pts[o.pts.length - 1][0] < o.landed) o.pts.push([st.t, o.v]); });
        }
        if (st.a.landed !== null && st.b.landed !== null) { L.stop(); updatePlay(); }
      }
      function updateOut() {
        outT.set(st.t); outVA.set(st.a.v); outVB.set(st.b.v); outHA.set(st.a.h);
        const noAir = !st.air || st.planet.air === 0;
        note.set(noAir
          ? { en: 'Without air every object falls with the same acceleration, g = ' + K.fmt(st.planet.g, 2, 'en') + ' m/s².', hr: 'Bez zraka sva tijela padaju istim ubrzanjem, g = ' + K.fmt(st.planet.g, 2, 'hr') + ' m/s².' }
          : { en: 'Air pushes up on a falling object. Light, wide objects reach a steady "terminal" speed quickly.', hr: 'Zrak gura tijelo koje pada prema gore. Lagana i široka tijela brzo dosegnu stalnu "graničnu" brzinu.' });
      }

      function drawFeather(ctx, x, y, color) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.5);
        ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 0, 7, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 22); ctx.stroke();
        ctx.restore();
      }
      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        const showChart = w >= 620;
        const sceneW = showChart ? Math.round(w * 0.56) : w;
        // sky
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        const groundY = h - 34, topY = showChart ? 44 : 72;
        const pxm = (groundY - topY) / st.h0; // px per metre
        // ground
        ctx.fillStyle = theme.ground; ctx.fillRect(0, groundY, sceneW, h - groundY);
        ctx.fillStyle = theme.good; ctx.fillRect(0, groundY, sceneW, 4);
        // ruler
        const rx = 46;
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, topY); ctx.lineTo(rx, groundY); ctx.stroke();
        const stepM = st.h0 > 30 ? 10 : 5;
        for (let m = 0; m <= st.h0 + 0.01; m += stepM) {
          const y = groundY - m * pxm;
          ctx.beginPath(); ctx.moveTo(rx - 5, y); ctx.lineTo(rx + 5, y); ctx.stroke();
          K.text(ctx, K.fmt(m, 0, lang) + ' m', rx - 9, y, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        // header info
        K.text(ctx, K.tr(st.planet.label, lang) + '   g = ' + K.fmt(st.planet.g, 2, lang) + ' m/s²', 12, 14, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        const airOn = st.air && st.planet.air > 0;
        K.text(ctx, K.tr({ en: 'Air: ', hr: 'Zrak: ' }, lang) + K.tr(airOn ? { en: 'on', hr: 'uključen' } : { en: 'off', hr: 'isključen' }, lang), 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        // objects
        const xA = Math.round(sceneW * 0.47), xB = Math.round(sceneW * 0.74);
        const yA = groundY - st.a.h * pxm - 14, yB = groundY - st.b.h * pxm - 14;
        // dotted guide lines from top
        ctx.setLineDash([3, 5]); ctx.strokeStyle = theme.line; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(xA, topY - 14); ctx.lineTo(xA, groundY); ctx.moveTo(xB, topY - 14); ctx.lineTo(xB, groundY); ctx.stroke(); ctx.setLineDash([]);
        // ball
        ctx.fillStyle = theme.c1; ctx.beginPath(); ctx.arc(xA, yA, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = K.withAlpha('#ffffff', 0.35); ctx.beginPath(); ctx.arc(xA - 5, yA - 5, 5, 0, Math.PI * 2); ctx.fill();
        // object B
        if (st.obj.id === 'feather') drawFeather(ctx, xB, yB, theme.c2);
        else if (st.obj.id === 'paper') { ctx.fillStyle = theme.c2; ctx.beginPath(); ctx.arc(xB, yB, 11, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = theme.fg; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(xB, yB, 11, 0.5, 2.2); ctx.stroke(); }
        else if (st.obj.id === 'tennis') { ctx.fillStyle = theme.c4; ctx.beginPath(); ctx.arc(xB, yB, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = theme.surface; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(xB - 8, yB, 10, -0.9, 0.9); ctx.stroke(); }
        else { ctx.fillStyle = theme.c2; K.roundRect(ctx, xB - 13, yB - 10, 26, 22, 7); ctx.fill(); }
        // labels
        const lblFont = 'bold 12px ' + theme.font;
        K.text(ctx, K.tr({ en: 'Steel ball', hr: 'Čelična kuglica' }, lang), xA, topY - 24, { font: lblFont, color: theme.fg, align: 'center' });
        K.text(ctx, K.tr(st.obj.label, lang), xB, topY - 24, { font: lblFont, color: theme.fg, align: 'center' });
        [[st.a, xA, yA], [st.b, xB, yB]].forEach(([o, x, y]) => {
          const s = o.landed !== null ? K.tr({ en: 'landed at ', hr: 'pao u ' }, lang) + K.fmt(o.landed, 2, lang) + ' s' : K.fmt(o.h, 1, lang) + ' m';
          K.text(ctx, s, x + 20, y, { font: '12px ' + theme.font, color: theme.fg, baseline: 'middle' });
          if (o.landed === null && o.v > 0.05) K.arrow(ctx, x, y + 18, x, y + 18 + Math.min(40, o.v * 3), { color: theme.fg, width: 2, head: 7 });
        });
        // chart
        if (showChart) {
          const g = st.planet.g;
          const tFall = Math.sqrt(2 * st.h0 / g);
          const xMax = Math.max(1, Math.ceil(tFall * 1.3 * 2) / 2);
          const yMax = Math.max(2, Math.ceil(Math.sqrt(2 * g * st.h0) * 1.1 / 5) * 5);
          K.lineChart(ctx, { x: sceneW + 8, y: 8, w: w - sceneW - 16, h: h - 16, xMin: 0, xMax, yMin: 0, yMax, lang, theme,
            xLabel: { en: 'time (s)', hr: 'vrijeme (s)' }, yLabel: { en: 'speed (m/s)', hr: 'brzina (m/s)' },
            
            series: [
              { points: st.a.pts, color: theme.c1, label: { en: 'ball', hr: 'kuglica' } },
              { points: st.b.pts, color: theme.c2, label: st.obj.label }
            ] });
        }
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
