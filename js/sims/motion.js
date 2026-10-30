/* FizLab sim: Speed and distance — a cyclist races a car on a straight road, constant speed or speeding up, live s–t graph. */
(function () {
  'use strict';
  const K = window.SimKit;
  const ROAD_LEN = 100; // m, length of the drawn road
  const MOVERS = [
    { id: 'bike', name: { en: 'Cyclist', hr: 'Biciklist' }, col: 'c1' },
    { id: 'car', name: { en: 'Car', hr: 'Automobil' }, col: 'c2' }
  ];
  const NICE_T = [2, 4, 6, 8, 10, 15, 20, 30, 40, 60, 80, 100, 150, 200, 300];

  window.Sims.register({
    id: 'motion',
    title: { en: 'Speed and Distance', hr: 'Brzina i put' },
    summary: {
      en: 'Race a cyclist against a car. Set their speeds or accelerations, move the finish line and read the distance–time graph.',
      hr: 'Utrkuj biciklista i automobil. Postavi brzine ili ubrzanja, pomakni cilj i čitaj graf puta i vremena.'
    },
    tasks: [
      { en: 'Set the car to 10 m/s and the cyclist to 5 m/s. How many times longer does the cyclist need to reach 100 m?', hr: 'Postavi automobil na 10 m/s, a biciklista na 5 m/s. Koliko puta dulje biciklist treba do 100 m?' },
      { en: 'Give the cyclist a 40 m head start. What speed does the car need to still win?', hr: 'Daj biciklistu prednost od 40 m. Koju brzinu automobil treba da ipak pobijedi?' },
      { en: 'Switch to "Speeding up". Watch the graph: why is the line curved now?', hr: 'Prebaci na "Ubrzavanje". Pogledaj graf: zašto je crta sada zakrivljena?' },
      { en: 'In "Speeding up" with a = 2 m/s², how far does the car get in 5 s? Check with s = ½·a·t².', hr: 'Pri "Ubrzavanju" s a = 2 m/s², koliki put automobil prijeđe za 5 s? Provjeri formulom s = ½·a·t².' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);

      const st = {
        mode: 'const', v: [5, 10], head: 0, a: [0.5, 1.5], finish: 100,
        t: 0, x: [0, 0], vel: [0, 0], fin: [null, null], pts: [[], []], lastSample: -1
      };

      // ---------- controls ----------
      C.segmented({ label: { en: 'Motion', hr: 'Gibanje' }, options: [
        { value: 'const', label: { en: 'Constant speed', hr: 'Stalna brzina' } },
        { value: 'accel', label: { en: 'Speeding up', hr: 'Ubrzavanje' } }], value: 'const',
        onChange: v => { st.mode = v; applyMode(); restart(); } });
      const slV1 = C.slider({ label: { en: 'Cyclist speed', hr: 'Brzina biciklista' }, min: 0, max: 20, step: 0.5, value: 5, unit: 'm/s', digits: 1, onChange: v => { st.v[0] = v; restart(); } });
      const slV2 = C.slider({ label: { en: 'Car speed', hr: 'Brzina automobila' }, min: 0, max: 20, step: 0.5, value: 10, unit: 'm/s', digits: 1, onChange: v => { st.v[1] = v; restart(); } });
      const slHead = C.slider({ label: { en: 'Cyclist head start', hr: 'Prednost biciklista' }, min: 0, max: 40, step: 1, value: 0, unit: 'm', digits: 0, onChange: v => { st.head = v; restart(); } });
      const slA1 = C.slider({ label: { en: 'Cyclist acceleration', hr: 'Ubrzanje biciklista' }, min: 0, max: 3, step: 0.1, value: 0.5, unit: 'm/s²', digits: 1, onChange: v => { st.a[0] = v; restart(); } });
      const slA2 = C.slider({ label: { en: 'Car acceleration', hr: 'Ubrzanje automobila' }, min: 0, max: 3, step: 0.1, value: 1.5, unit: 'm/s²', digits: 1, onChange: v => { st.a[1] = v; restart(); } });
      C.slider({ label: { en: 'Finish line', hr: 'Cilj' }, min: 20, max: 100, step: 5, value: 100, unit: 'm', digits: 0, onChange: v => { st.finish = v; restart(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => {
        if (allDone()) clearRun();
        L.toggle(); updatePlay();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outT = C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 2 });
      const outS = [
        C.readout({ label: { en: 'Cyclist distance', hr: 'Put biciklista' }, unit: 'm', digits: 1 }),
        C.readout({ label: { en: 'Car distance', hr: 'Put automobila' }, unit: 'm', digits: 1 })
      ];
      const outV = [
        C.readout({ label: { en: 'Cyclist speed', hr: 'Brzina biciklista' }, unit: 'm/s', digits: 1 }),
        C.readout({ label: { en: 'Car speed', hr: 'Brzina automobila' }, unit: 'm/s', digits: 1 })
      ];
      const note = C.note({ text: { en: '', hr: '' } });

      // ---------- state helpers ----------
      function applyMode() {
        const acc = st.mode === 'accel';
        slV1.setDisabled(acc); slV2.setDisabled(acc); slHead.setDisabled(acc);
        slA1.setDisabled(!acc); slA2.setDisabled(!acc);
      }
      function startPos(i) { return (st.mode === 'const' && i === 0) ? st.head : 0; }
      function posAt(i, t) { return st.mode === 'const' ? startPos(i) + st.v[i] * t : 0.5 * st.a[i] * t * t; }
      function velAt(i, t) { return st.mode === 'const' ? st.v[i] : st.a[i] * t; }
      function finishTime(i) { // analytic time to reach the finish line (Infinity = never)
        const x0 = startPos(i);
        if (x0 >= st.finish) return 0;
        if (st.mode === 'const') return st.v[i] > 0 ? (st.finish - x0) / st.v[i] : Infinity;
        return st.a[i] > 0 ? Math.sqrt(2 * st.finish / st.a[i]) : Infinity;
      }
      function allDone() { return MOVERS.every((_, i) => st.fin[i] !== null || finishTime(i) === Infinity); }
      function updatePlay() {
        btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : (st.t > 0 ? { en: 'Continue', hr: 'Nastavi' } : { en: 'Play', hr: 'Pokreni' }));
      }
      function clearRun() {
        st.t = 0; st.lastSample = -1;
        for (let i = 0; i < 2; i++) {
          st.x[i] = startPos(i); st.vel[i] = velAt(i, 0);
          st.fin[i] = st.x[i] >= st.finish ? 0 : null;
          st.pts[i] = [[0, st.x[i]]];
        }
      }
      function restart() { // parameters changed: start the race again, keep running if it was running
        clearRun();
        if (allDone()) L.stop();
        updatePlay(); updateOut(); draw();
      }
      function reset() { L.stop(); clearRun(); updatePlay(); updateOut(); draw(); }

      function step(dt) {
        st.t += dt;
        for (let i = 0; i < 2; i++) {
          if (st.fin[i] !== null) continue;
          const tf = finishTime(i);
          if (st.t >= tf) {
            st.fin[i] = tf; st.x[i] = st.finish; st.vel[i] = velAt(i, tf);
            st.pts[i].push([tf, st.finish]);
          } else { st.x[i] = posAt(i, st.t); st.vel[i] = velAt(i, st.t); }
        }
        if (st.t - st.lastSample >= 0.05) {
          st.lastSample = st.t;
          for (let i = 0; i < 2; i++) if (st.fin[i] === null) st.pts[i].push([st.t, st.x[i]]);
        }
        if (allDone()) { L.stop(); updatePlay(); }
      }
      function updateOut() {
        outT.set(st.t);
        for (let i = 0; i < 2; i++) { outS[i].set(st.x[i]); outV[i].set(st.vel[i]); }
        note.set(st.mode === 'const'
          ? { en: 'Constant speed: equal distances in equal times — the line on the graph is straight. Slope = speed.', hr: 'Stalna brzina: u jednakim vremenima jednaki putovi — crta na grafu je ravna. Nagib = brzina.' }
          : { en: 'Speeding up: the speed grows evenly with time and the distance grows with t² — the graph bends upward.', hr: 'Ubrzavanje: brzina raste jednoliko s vremenom, a put raste s t² — crta na grafu se savija prema gore.' });
      }

      // ---------- drawing ----------
      function drawBike(ctx, x, y, s, color) {
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const rw = 9 * s, hy = y + 8 * s;
        ctx.beginPath(); ctx.arc(x - 11 * s, hy, rw, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + 11 * s, hy, rw, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); // frame
        ctx.moveTo(x - 11 * s, hy); ctx.lineTo(x - 4 * s, y - 8 * s); ctx.lineTo(x + 8 * s, y - 10 * s); ctx.lineTo(x + 11 * s, hy);
        ctx.moveTo(x - 4 * s, y - 8 * s); ctx.lineTo(x, y + 5 * s); ctx.lineTo(x - 11 * s, hy);
        ctx.moveTo(x, y + 5 * s); ctx.lineTo(x + 8 * s, y - 10 * s); ctx.stroke();
        ctx.strokeStyle = theme.fg; ctx.fillStyle = theme.fg; // rider
        ctx.beginPath(); ctx.moveTo(x - 4 * s, y - 10 * s); ctx.lineTo(x + 1 * s, y - 20 * s); ctx.lineTo(x + 8 * s, y - 11 * s); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + 1.5 * s, y - 25 * s, 4.5 * s, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      function drawCar(ctx, x, y, s, color) {
        ctx.save(); ctx.fillStyle = color;
        K.roundRect(ctx, x - 24 * s, y - 6 * s, 48 * s, 16 * s, 4 * s); ctx.fill();
        K.roundRect(ctx, x - 13 * s, y - 18 * s, 27 * s, 14 * s, 4 * s); ctx.fill();
        ctx.fillStyle = theme.sky; // windows
        ctx.fillRect(x - 10 * s, y - 15 * s, 10 * s, 8 * s); ctx.fillRect(x + 2 * s, y - 15 * s, 9 * s, 8 * s);
        [x - 14 * s, x + 14 * s].forEach(wx => {
          ctx.fillStyle = theme.fg; ctx.beginPath(); ctx.arc(wx, y + 10 * s, 6 * s, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = theme.surface; ctx.beginPath(); ctx.arc(wx, y + 10 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();
      }
      function niceT(v) { for (let i = 0; i < NICE_T.length; i++) if (NICE_T[i] >= v) return NICE_T[i]; return Math.ceil(v / 100) * 100; }
      function fitFont(ctx, str, maxW, base) { // shrink text until it fits
        for (let px = base; px >= 10; px--) { ctx.font = px + 'px ' + theme.font; if (ctx.measureText(str).width <= maxW) return px + 'px ' + theme.font; }
        return '10px ' + theme.font;
      }

      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        const showChart = w >= 620;
        const sceneW = showChart ? Math.round(w * 0.58) : w;
        const padL = 22, padR = 30;
        const pxm = (sceneW - padL - padR) / ROAD_LEN;
        const X = m => padL + m * pxm;
        const roadTop = K.clamp(Math.round(h * 0.34), 80, 150);
        const laneH = K.clamp((h - roadTop - 44) / 2, 40, 90);
        const roadBot = roadTop + 2 * laneH;
        const s = K.clamp(laneH / 55, 0.6, 1.25);

        // ground, road, lane line
        ctx.fillStyle = theme.ground; ctx.fillRect(0, roadTop - 6, sceneW, h - roadTop + 6);
        ctx.fillStyle = theme.surface2; ctx.fillRect(0, roadTop, sceneW, roadBot - roadTop);
        ctx.save(); ctx.strokeStyle = theme.surface; ctx.lineWidth = 2; ctx.setLineDash([12, 10]);
        ctx.beginPath(); ctx.moveTo(0, roadTop + laneH); ctx.lineTo(sceneW, roadTop + laneH); ctx.stroke(); ctx.restore();
        // distance scale
        const stepM = sceneW < 480 ? 20 : 10;
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1;
        for (let m = 0; m <= ROAD_LEN; m += stepM) {
          ctx.beginPath(); ctx.moveTo(X(m), roadBot); ctx.lineTo(X(m), roadBot + 6); ctx.stroke();
          K.text(ctx, K.fmt(m, 0, lang) + (m === ROAD_LEN ? ' m' : ''), X(m), roadBot + 9, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        }
        // start line
        ctx.fillStyle = theme.surface; ctx.fillRect(X(0) - 1.5, roadTop, 3, roadBot - roadTop);
        // finish line (checkered)
        const fx = X(st.finish), sq = 6, cols = 2;
        for (let r = 0; r < Math.ceil((roadBot - roadTop) / sq); r++) for (let c = 0; c < cols; c++) {
          ctx.fillStyle = (r + c) % 2 ? theme.fg : theme.surface;
          ctx.fillRect(fx - sq + c * sq, roadTop + r * sq, sq, Math.min(sq, roadBot - roadTop - r * sq));
        }
        K.text(ctx, K.tr({ en: 'FINISH', hr: 'CILJ' }, lang), fx, roadTop - 9, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center' });

        // movers + their labels
        for (let i = 0; i < 2; i++) {
          const col = theme[MOVERS[i].col];
          const laneY = roadTop + laneH * (i + 0.5);
          const mx = X(st.x[i]);
          if (i === 0) drawBike(ctx, mx, laneY + 4, s, col); else drawCar(ctx, mx, laneY + 2, s, col);
          let lab = st.fin[i] !== null
            ? K.tr({ en: 'Finish: ', hr: 'Cilj: ' }, lang) + K.fmt(st.fin[i], 2, lang) + ' s'
            : 's = ' + K.fmt(st.x[i], 1, lang) + ' m   v = ' + K.fmt(st.vel[i], 1, lang) + ' m/s';
          ctx.font = 'bold 11px ' + theme.font;
          const tw = ctx.measureText(lab).width;
          const tx = K.clamp(mx - tw / 2, 4, sceneW - tw - 4);
          const ty = roadTop + laneH * i + 4;
          ctx.fillStyle = K.withAlpha(theme.surface, 0.85); K.roundRect(ctx, tx - 4, ty, tw + 8, 15, 4); ctx.fill();
          K.text(ctx, lab, tx, ty + 7.5, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        }

        // header: time + formula with current numbers
        K.text(ctx, 't = ' + K.fmt(st.t, 2, lang) + ' s', sceneW - 10, 16, { font: 'bold 15px ' + theme.fontDisplay, color: theme.fg, align: 'right', baseline: 'middle' });
        const general = st.mode === 'const' ? 's = v · t' : 'v = a · t        s = ½ · a · t²';
        K.text(ctx, general, 12, 16, { font: 'bold 15px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        const t = st.t;
        for (let i = 0; i < 2; i++) {
          const tt = st.fin[i] !== null ? st.fin[i] : t; // after the finish, show the numbers at the finish moment
          let line;
          if (st.mode === 'const') {
            const x0 = startPos(i);
            line = K.tr(MOVERS[i].name, lang) + ':  s = ' + (x0 > 0 ? K.fmt(x0, 0, lang) + ' m + ' : '') +
              K.fmt(st.v[i], 1, lang) + ' m/s · ' + K.fmt(tt, 2, lang) + ' s = ' + K.fmt(posAt(i, tt), 1, lang) + ' m';
          } else {
            line = K.tr(MOVERS[i].name, lang) + ':  v = ' + K.fmt(st.a[i], 1, lang) + ' · ' + K.fmt(tt, 2, lang) + ' = ' + K.fmt(velAt(i, tt), 1, lang) +
              ' m/s     s = ½ · ' + K.fmt(st.a[i], 1, lang) + ' · ' + K.fmt(tt, 2, lang) + '² = ' + K.fmt(posAt(i, tt), 1, lang) + ' m';
          }
          const ly = 38 + i * 18;
          ctx.fillStyle = theme[MOVERS[i].col]; ctx.fillRect(12, ly - 5, 10, 10);
          const font = fitFont(ctx, line, sceneW - 40, 13);
          K.text(ctx, line, 28, ly, { font, color: theme.fg, baseline: 'middle' });
        }

        // live distance–time chart
        if (showChart) {
          let tEnd = 0;
          for (let i = 0; i < 2; i++) { const tf = finishTime(i); if (tf !== Infinity) tEnd = Math.max(tEnd, tf); }
          if (tEnd === 0) tEnd = 10;
          const xMax = niceT(Math.max(tEnd, st.t) * 1.05);
          const ch = K.lineChart(ctx, { x: sceneW + 8, y: 8, w: w - sceneW - 16, h: h - 16, xMin: 0, xMax, yMin: 0, yMax: ROAD_LEN, lang, theme,
            xLabel: { en: 'time (s)', hr: 'vrijeme (s)' }, yLabel: { en: 'distance (m)', hr: 'put (m)' }, xDigits: xMax <= 6 ? 1 : 0,
            series: [
              { points: st.pts[0], color: theme.c1, label: MOVERS[0].name },
              { points: st.pts[1], color: theme.c2, label: MOVERS[1].name }
            ] });
          // finish line on the chart
          const fy = ch.sy(st.finish);
          ctx.save(); ctx.strokeStyle = theme.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(ch.px, fy); ctx.lineTo(ch.px + ch.pw, fy); ctx.stroke(); ctx.restore();
          K.text(ctx, K.tr({ en: 'finish', hr: 'cilj' }, lang), ch.px + ch.pw - 4, fy - 3, { font: '10px ' + theme.font, color: theme.muted, align: 'right' });
        }
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      applyMode();
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
