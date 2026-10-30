/* FizLab sim: Hot Meets Cold — two blocks touch through a bridge and exchange heat until their temperatures are equal. */
(function () {
  'use strict';
  const K = window.SimKit;
  const MATERIALS = [
    { id: 'water', c: 4186, label: { en: 'Water', hr: 'Voda' } },
    { id: 'aluminium', c: 897, label: { en: 'Aluminium', hr: 'Aluminij' } },
    { id: 'iron', c: 449, label: { en: 'Iron', hr: 'Željezo' } },
    { id: 'copper', c: 385, label: { en: 'Copper', hr: 'Bakar' } },
    { id: 'glass', c: 840, label: { en: 'Glass', hr: 'Staklo' } },
    { id: 'wood', c: 1700, label: { en: 'Wood', hr: 'Drvo' } }
  ];
  // bridge conductance k in W/K (heat flow = k · ΔT); values scaled so the differences are visible in minutes of sim time
  const BRIDGES = [
    { id: 'copper', k: 40, label: { en: 'Copper (fast)', hr: 'Bakar (brzo)' } },
    { id: 'iron', k: 10, label: { en: 'Iron', hr: 'Željezo' } },
    { id: 'glass', k: 1.5, label: { en: 'Glass (slow)', hr: 'Staklo (sporo)' } },
    { id: 'wood', k: 0.3, label: { en: 'Wood (very slow)', hr: 'Drvo (vrlo sporo)' } },
    { id: 'styrofoam', k: 0.05, label: { en: 'Styrofoam (almost none)', hr: 'Stiropor (gotovo ništa)' } }
  ];
  const T_MIN = -20, T_MAX = 200;
  const matById = id => MATERIALS.find(m => m.id === id) || MATERIALS[0];
  const bridgeById = id => BRIDGES.find(b => b.id === id) || BRIDGES[0];

  function rgbOf(col) {
    col = (col || '#888').trim();
    if (col.startsWith('rgb')) { const p = col.replace(/rgba?\(([^)]+)\)/, '$1').split(',').map(s => parseFloat(s)); return [p[0] || 0, p[1] || 0, p[2] || 0]; }
    let h = col.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
  }
  function mixColor(a, b, t) {
    const A = rgbOf(a), B = rgbOf(b); t = K.clamp(t, 0, 1);
    return 'rgb(' + Math.round(K.lerp(A[0], B[0], t)) + ',' + Math.round(K.lerp(A[1], B[1], t)) + ',' + Math.round(K.lerp(A[2], B[2], t)) + ')';
  }

  window.Sims.register({
    id: 'heat',
    title: { en: 'Hot Meets Cold', hr: 'Toplo i hladno' },
    summary: {
      en: 'Set the temperature, mass and material of two blocks, press Touch! and watch heat flow from hot to cold until the temperatures are equal.',
      hr: 'Postavi temperaturu, masu i materijal dvaju blokova, pritisni Spoji! i gledaj kako toplina prelazi s toplijeg na hladnije dok se temperature ne izjednače.'
    },
    tasks: [
      { en: 'Touch 1 kg of hot water (90 °C) to 1 kg of cold water (20 °C). Guess the final temperature before you look at the readout.', hr: 'Spoji 1 kg vruće vode (90 °C) s 1 kg hladne vode (20 °C). Pogodi konačnu temperaturu prije nego pogledaš očitanje.' },
      { en: 'Make the right block 5 kg. Why does the final temperature move toward the heavy block?', hr: 'Postavi desni blok na 5 kg. Zašto se konačna temperatura približi težem bloku?' },
      { en: 'Swap water for copper on one side. Copper needs much less heat to warm up (small specific heat capacity).', hr: 'Zamijeni vodu bakrom na jednoj strani. Bakru treba mnogo manje topline da se zagrije (mali specifični toplinski kapacitet).' },
      { en: 'Change the bridge to styrofoam. Does the heat still flow? This is why we insulate houses.', hr: 'Promijeni spojnicu u stiropor. Prelazi li toplina i dalje? Zato izoliramo kuće.' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);
      const DEF = { T1: 90, T2: 20, m1: 1, m2: 1, mat1: 'water', mat2: 'water', bridge: 'copper', speed: 5 };
      const st = { T1: DEF.T1, T2: DEF.T2, m1: DEF.m1, m2: DEF.m2, mat1: DEF.mat1, mat2: DEF.mat2, bridge: DEF.bridge, speed: DEF.speed,
        contact: false, gap: 1, t: 0, Q: 0, Qdot: 0, pts1: [], pts2: [], lastSample: -1, xMax: 60, anim: 0 };

      // deterministic particle layout
      let seed = 20240925;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const particles = [0, 1].map(() => Array.from({ length: 26 }, () => ({ bx: 0.1 + 0.8 * rnd(), by: 0.1 + 0.8 * rnd(), p1: rnd() * 6.283, p2: rnd() * 6.283, f: 0.7 + 0.6 * rnd() })));

      // ---------- controls ----------
      const slT1 = C.slider({ label: { en: 'Left block: temperature', hr: 'Lijevi blok: temperatura' }, min: T_MIN, max: T_MAX, step: 1, value: DEF.T1, unit: '°C', digits: 0, onChange: () => applySettings() });
      const slM1 = C.slider({ label: { en: 'Left block: mass', hr: 'Lijevi blok: masa' }, min: 0.1, max: 5, step: 0.1, value: DEF.m1, unit: 'kg', digits: 1, onChange: () => applySettings() });
      const selMat1 = C.select({ label: { en: 'Left block: material', hr: 'Lijevi blok: materijal' }, options: MATERIALS.map(m => ({ value: m.id, label: m.label })), value: DEF.mat1, onChange: () => applySettings() });
      const slT2 = C.slider({ label: { en: 'Right block: temperature', hr: 'Desni blok: temperatura' }, min: T_MIN, max: T_MAX, step: 1, value: DEF.T2, unit: '°C', digits: 0, onChange: () => applySettings() });
      const slM2 = C.slider({ label: { en: 'Right block: mass', hr: 'Desni blok: masa' }, min: 0.1, max: 5, step: 0.1, value: DEF.m2, unit: 'kg', digits: 1, onChange: () => applySettings() });
      const selMat2 = C.select({ label: { en: 'Right block: material', hr: 'Desni blok: materijal' }, options: MATERIALS.map(m => ({ value: m.id, label: m.label })), value: DEF.mat2, onChange: () => applySettings() });
      const selBridge = C.select({ label: { en: 'Bridge between the blocks', hr: 'Spojnica između blokova' }, options: BRIDGES.map(b => ({ value: b.id, label: b.label })), value: DEF.bridge, onChange: v => { st.bridge = v; } });
      const segSpeed = C.segmented({ label: { en: 'Time speed', hr: 'Brzina vremena' }, options: [{ value: '1', label: '1×' }, { value: '5', label: '5×' }, { value: '20', label: '20×' }], value: String(DEF.speed), onChange: v => { st.speed = parseFloat(v) || 1; } });
      const btnTouch = C.button({ label: { en: 'Touch!', hr: 'Spoji!' }, variant: 'primary', onClick: () => {
        st.contact = !st.contact; updateTouch();
        if (st.contact && !L.running) { L.start(); updatePlay(); }
        draw();
      } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const outT1 = C.readout({ label: { en: 'T₁ (left)', hr: 'T₁ (lijevi)' }, unit: '°C', digits: 1 });
      const outT2 = C.readout({ label: { en: 'T₂ (right)', hr: 'T₂ (desni)' }, unit: '°C', digits: 1 });
      const outTf = C.readout({ label: { en: 'Predicted final', hr: 'Predviđena konačna' }, unit: '°C', digits: 1 });
      const outQ = C.readout({ label: { en: 'Heat transferred', hr: 'Prenesena toplina' }, unit: 'J', digits: 0 });
      const outT = C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 0 });
      const note = C.note({ text: { en: '', hr: '' } });

      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function updateTouch() { btnTouch.setLabel(st.contact ? { en: 'Separate', hr: 'Razdvoji' } : { en: 'Touch!', hr: 'Spoji!' }); }
      const C1 = () => st.m1 * matById(st.mat1).c;   // heat capacity J/K
      const C2 = () => st.m2 * matById(st.mat2).c;
      const Tfinal = () => (C1() * st.T1 + C2() * st.T2) / (C1() + C2());

      // ---------- state ----------
      function applySettings() {
        st.T1 = slT1.get(); st.T2 = slT2.get(); st.m1 = slM1.get(); st.m2 = slM2.get();
        st.mat1 = selMat1.get(); st.mat2 = selMat2.get();
        st.contact = false; st.t = 0; st.Q = 0; st.Qdot = 0; st.pts1 = [[0, st.T1]]; st.pts2 = [[0, st.T2]]; st.lastSample = 0; st.xMax = 60;
        updateTouch(); updateOut(); draw();
      }
      function reset() {
        slT1.set(DEF.T1); slT2.set(DEF.T2); slM1.set(DEF.m1); slM2.set(DEF.m2); selMat1.set(DEF.mat1); selMat2.set(DEF.mat2);
        selBridge.set(DEF.bridge); st.bridge = DEF.bridge; segSpeed.set(String(DEF.speed)); st.speed = DEF.speed;
        st.gap = 1; st.anim = 0;
        applySettings();
        if (!ctx.reducedMotion) L.start(); else L.stop();
        updatePlay(); draw();
      }
      function step(dt) {
        st.anim += dt;
        // blocks slide together / apart (real time)
        const target = st.contact ? 0 : 1;
        st.gap += (target - st.gap) * Math.min(1, dt * 6);
        if (Math.abs(st.gap - target) < 0.02) st.gap = target;
        if (!st.contact || st.gap !== 0) { st.Qdot = 0; return; }
        const dte = dt * st.speed;
        const c1 = C1(), c2 = C2(), k = bridgeById(st.bridge).k;
        // exact solution of  C1·dT1/dt = −k(T1−T2),  C2·dT2/dt = +k(T1−T2)  over one step
        const Teq = (c1 * st.T1 + c2 * st.T2) / (c1 + c2);
        const d = st.T1 - st.T2;
        const dNew = d * Math.exp(-k * (1 / c1 + 1 / c2) * dte);
        const T1n = Teq + dNew * c2 / (c1 + c2), T2n = Teq - dNew * c1 / (c1 + c2);
        st.Q += Math.abs(c1 * (st.T1 - T1n));
        st.Qdot = k * Math.abs(dNew);
        st.T1 = T1n; st.T2 = T2n; st.t += dte;
        // graph samples
        if (st.t > st.xMax * 0.92) st.xMax *= 2;
        if (st.t - st.lastSample >= st.xMax / 240) { st.lastSample = st.t; st.pts1.push([st.t, st.T1]); st.pts2.push([st.t, st.T2]); }
      }
      function updateOut() {
        outT1.set(st.T1); outT2.set(st.T2); outTf.set(Tfinal()); outQ.set(st.Q); outT.set(st.t);
        const equal = st.contact && Math.abs(st.T1 - st.T2) < 0.05;
        outT1.setColor(equal ? theme.good : ''); outT2.setColor(equal ? theme.good : '');
        if (!st.contact) note.set({ en: 'Heat capacity C = m·c tells how much heat (J) a block needs to warm by 1 °C. Left: ' + K.fmt(C1(), 0, 'en') + ' J/°C, right: ' + K.fmt(C2(), 0, 'en') + ' J/°C.',
          hr: 'Toplinski kapacitet C = m·c kaže koliko topline (J) blok treba da se zagrije za 1 °C. Lijevi: ' + K.fmt(C1(), 0, 'hr') + ' J/°C, desni: ' + K.fmt(C2(), 0, 'hr') + ' J/°C.' });
        else if (equal) note.set({ en: 'Thermal equilibrium: both blocks have the same temperature, so heat stops flowing.', hr: 'Toplinska ravnoteža: oba bloka imaju istu temperaturu pa toplina više ne prelazi.' });
        else note.set({ en: 'Heat flows from the hotter block to the colder one. The hotter block gives away exactly the heat the colder one receives.', hr: 'Toplina prelazi s toplijeg bloka na hladniji. Topliji blok preda točno onoliko topline koliko hladniji primi.' });
      }

      // ---------- drawing ----------
      const tempColor = T => mixColor(theme.c1, theme.c8, (T - T_MIN) / (T_MAX - T_MIN));
      function thermometer(ctx, x, yTop, yBot, T, col, side) {
        const tw = 8, r = 7;
        ctx.fillStyle = theme.surface; ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
        K.roundRect(ctx, x - tw / 2, yTop, tw, yBot - yTop, 4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, yBot + r - 1, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const frac = K.clamp((T - T_MIN) / (T_MAX - T_MIN), 0, 1);
        const level = yBot - frac * (yBot - yTop - 4);
        ctx.fillStyle = col; ctx.fillRect(x - 2, level, 4, yBot - level + 2);
        ctx.beginPath(); ctx.arc(x, yBot + r - 1, r - 3, 0, Math.PI * 2); ctx.fill();
        // scale ticks at 0, 100 and 200 °C
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1;
        [0, 100, 200].forEach(tv => {
          const y = yBot - (tv - T_MIN) / (T_MAX - T_MIN) * (yBot - yTop - 4);
          ctx.beginPath(); ctx.moveTo(x + side * tw / 2, y); ctx.lineTo(x + side * (tw / 2 + 4), y); ctx.stroke();
          if (yBot - yTop > 90) K.text(ctx, K.fmt(tv, 0, lang), x + side * (tw / 2 + 6), y, { font: '9px ' + theme.font, color: theme.muted, align: side > 0 ? 'left' : 'right', baseline: 'middle' });
        });
      }
      function drawBlock(ctx, idx, left, top, side, T, m, matId) {
        const col = tempColor(T);
        ctx.fillStyle = col; K.roundRect(ctx, left, top, side, side, 6); ctx.fill();
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.stroke();
        // particles vibrate faster and wider when hotter
        const norm = K.clamp((T - T_MIN) / (T_MAX - T_MIN), 0, 1);
        const A = side * (0.012 + 0.05 * norm), om = 3 + 25 * norm, pr = K.clamp(side / 30, 1.6, 3.2);
        ctx.fillStyle = K.withAlpha(theme.fg, 0.75);
        particles[idx].forEach(p => {
          const x = left + p.bx * side + A * Math.sin(om * p.f * st.anim + p.p1);
          const y = top + p.by * side + A * Math.cos(om * 1.3 * p.f * st.anim + p.p2);
          ctx.beginPath(); ctx.arc(x, y, pr, 0, Math.PI * 2); ctx.fill();
        });
        // labels
        K.text(ctx, K.fmt(T, 1, lang) + ' °C', left + side / 2, top - 8, { font: 'bold 15px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'bottom' });
        K.text(ctx, K.fmt(m, 1, lang) + ' kg ' + K.tr(matById(matId).label, lang).toLowerCase(), left + side / 2, top + side + 6, { font: '12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        K.text(ctx, 'c = ' + K.fmt(matById(matId).c, 0, lang) + ' J/(kg·°C)', left + side / 2, top + side + 21, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
      }
      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        const showChart = w >= 640;
        const sceneW = showChart ? Math.round(w * 0.56) : w;
        const floorY = h - 48;
        ctx.fillStyle = theme.ground; ctx.fillRect(0, floorY, sceneW, h - floorY);
        // block sizes from mass (volume ~ mass)
        const maxSide = Math.min(sceneW * 0.3, (h - 150) * 0.9);
        const side1 = Math.max(30, maxSide * Math.cbrt(st.m1 / 5)), side2 = Math.max(30, maxSide * Math.cbrt(st.m2 / 5));
        const bw = 26, cx = sceneW / 2, sep = st.gap * Math.min(70, sceneW * 0.08);
        const right1 = cx - bw / 2 - sep, left2 = cx + bw / 2 + sep;
        const left1 = right1 - side1, top1 = floorY - side1, top2 = floorY - side2;
        // bridge
        const br = bridgeById(st.bridge), bTop = floorY - Math.min(side1, side2) * 0.55 - 10, bH = 20;
        ctx.fillStyle = theme.surface2; ctx.strokeStyle = theme.muted; ctx.lineWidth = 1.5;
        K.roundRect(ctx, right1, bTop, left2 - right1, bH, 4); ctx.fill(); ctx.stroke();
        if (st.gap > 0.5) {
          K.text(ctx, K.tr({ en: 'bridge: ', hr: 'spojnica: ' }, lang) + K.tr(br.label, lang).toLowerCase(), cx, bTop - 5, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'bottom' });
          K.text(ctx, 'k = ' + K.fmt(br.k, br.k < 1 ? 2 : 0, lang) + ' W/°C', cx, bTop + bH + 4, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        }
        drawBlock(ctx, 0, left1, top1, side1, st.T1, st.m1, st.mat1);
        drawBlock(ctx, 1, left2, top2, side2, st.T2, st.m2, st.mat2);
        // thermometers
        const thTop = Math.min(top1, top2) - 40;
        thermometer(ctx, left1 - 16, Math.max(12, thTop), floorY - 16, st.T1, tempColor(st.T1), -1);
        thermometer(ctx, left2 + side2 + 16, Math.max(12, thTop), floorY - 16, st.T2, tempColor(st.T2), 1);
        // heat flow arrows across the bridge
        if (st.contact && st.gap === 0 && st.Qdot > 0.01) {
          const dir = st.T1 > st.T2 ? 1 : -1;
          const n = 1 + Math.min(3, Math.floor(Math.log10(1 + st.Qdot) ));
          const cy = bTop + bH / 2, len = bw + 22;
          for (let i = 0; i < n; i++) {
            const y = cy + (i - (n - 1) / 2) * 6;
            const x1 = cx - dir * len / 2, x2 = cx + dir * len / 2;
            K.arrow(ctx, x1, y, x2, y, { color: theme.c2, width: 3, head: 8 });
          }
          K.text(ctx, 'Q̇ = ' + K.fmt(st.Qdot, st.Qdot < 10 ? 1 : 0, lang) + ' W', cx, bTop + bH + 4, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
          K.text(ctx, K.tr({ en: 'heat flows hot → cold', hr: 'toplina teče toplo → hladno' }, lang), cx, bTop - 5, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'bottom' });
        } else if (st.contact && st.gap === 0) {
          K.text(ctx, K.tr({ en: 'equal temperatures!', hr: 'jednake temperature!' }, lang), cx, bTop - 5, { font: 'bold 12px ' + theme.font, color: theme.good, align: 'center', baseline: 'bottom' });
        }
        // header
        K.text(ctx, K.tr({ en: 'Predicted final: ', hr: 'Predviđena konačna: ' }, lang) + K.fmt(Tfinal(), 1, lang) + ' °C', 12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(ctx, 'Q = ' + K.fmt(st.Q, 0, lang) + ' J   t = ' + K.fmt(st.t, 0, lang) + ' s', 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        if (!st.contact) {
          K.text(ctx, K.tr({ en: 'Press "Touch!" to bring the blocks together', hr: 'Pritisni „Spoji!“ da spojiš blokove' }, lang), 12, 50, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        } else if (sceneW >= 420) {
          // the heat the hot side gave away: Q = m·c·ΔT (teacher check)
          const hotLeft = st.pts1[0] && st.pts1[0][1] >= (st.pts2[0] ? st.pts2[0][1] : st.T2);
          const m = hotLeft ? st.m1 : st.m2, c = matById(hotLeft ? st.mat1 : st.mat2).c;
          const T0 = hotLeft ? (st.pts1[0] ? st.pts1[0][1] : st.T1) : (st.pts2[0] ? st.pts2[0][1] : st.T2);
          const dT = Math.abs(T0 - (hotLeft ? st.T1 : st.T2));
          K.text(ctx, 'Q = m·c·ΔT = ' + K.fmt(m, 1, lang) + ' kg · ' + K.fmt(c, 0, lang) + ' J/(kg·°C) · ' + K.fmt(dT, 1, lang) + ' °C = ' + K.fmt(m * c * dT, 0, lang) + ' J', 12, 50, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        }
        // temperature–time chart
        if (showChart) {
          const lo = Math.min(st.pts1[0] ? st.pts1[0][1] : st.T1, st.pts2[0] ? st.pts2[0][1] : st.T2, st.T1, st.T2);
          const hi = Math.max(st.pts1[0] ? st.pts1[0][1] : st.T1, st.pts2[0] ? st.pts2[0][1] : st.T2, st.T1, st.T2);
          const yMin = Math.floor((lo - 5) / 10) * 10, yMax = Math.max(yMin + 10, Math.ceil((hi + 5) / 10) * 10);
          const ch = K.lineChart(ctx, { x: sceneW + 8, y: 8, w: w - sceneW - 16, h: h - 16, xMin: 0, xMax: st.xMax, yMin, yMax, lang, theme,
            xLabel: { en: 'time (s)', hr: 'vrijeme (s)' }, yLabel: { en: 'temperature (°C)', hr: 'temperatura (°C)' },
            series: [
              { points: st.pts1, color: theme.c1, label: { en: 'left', hr: 'lijevi' } },
              { points: st.pts2, color: theme.c2, label: { en: 'right', hr: 'desni' } }
            ] });
          const yf = ch.sy(Tfinal());
          ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = theme.muted; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(ch.px, yf); ctx.lineTo(ch.px + ch.pw, yf); ctx.stroke(); ctx.restore();
          K.text(ctx, 'T = ' + K.fmt(Tfinal(), 1, lang) + ' °C', ch.px + ch.pw - 4, yf - 3, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'bottom' });
        }
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
