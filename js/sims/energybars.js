/* FizLab sim: Energy Bar Charts — compare two instants of a motion with energy bars (kinetic, potential, internal, work) and read the energy balance. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81;
  const ANG = 35 * Math.PI / 180, SIN = Math.sin(ANG), COS = Math.cos(ANG); // slide angle
  const L_PEND = 2, PIVOT_H = 2.6;      // pendulum length, pivot height above the floor (m)
  const BOUNCE_K = 0.8, N_BOUNCE = 10;  // energy kept per bounce, bounces shown
  const MU = 0.3, DIST = 6, V_CRANE = 0.5, HAND_H = 1;
  // p = [min, max, step, default] of the scenario parameter; m = the same for the mass; tscale = playback speed
  const SCEN = [
    { id: 'ball', label: { en: 'Ball thrown straight up', hr: 'Lopta bačena uvis' }, param: 'speed', p: [2, 8, 0.5, 5], m: [0.5, 5, 0.5, 1], tscale: 0.5 },
    { id: 'slide', label: { en: 'Girl on a frictionless slide', hr: 'Djevojčica na toboganu bez trenja' }, param: 'height', p: [1, 4, 0.25, 3], m: [20, 60, 5, 35], tscale: 0.7 },
    { id: 'box', label: { en: 'Box pulled at constant speed', hr: 'Kutija vučena stalnom brzinom' }, param: 'speed', p: [0.5, 2, 0.1, 1], m: [1, 20, 1, 5], tscale: 1 },
    { id: 'pend', label: { en: 'Pendulum', hr: 'Njihalo' }, param: 'height', p: [0.1, 1, 0.05, 0.5], m: [0.5, 5, 0.5, 1], tscale: 1 },
    { id: 'bounce', label: { en: 'Bouncing ball (loses 20 % per bounce)', hr: 'Lopta koja odskakuje (gubi 20 % po odskoku)' }, param: 'height', p: [1, 4, 0.25, 2], m: [0.5, 5, 0.5, 1], tscale: 0.6 },
    { id: 'crane', label: { en: 'Crate lifted by a crane', hr: 'Sanduk koji diže dizalica' }, param: 'height', p: [1, 5, 0.5, 3], m: [50, 500, 10, 200], tscale: 1 },
    { id: 'bag', label: { en: 'Carrying a bag at constant speed', hr: 'Nošenje torbe stalnom brzinom' }, param: 'speed', p: [0.5, 2, 0.1, 1], m: [0.5, 5, 0.5, 2], tscale: 1 }
  ];
  const ZEROS = [
    { value: '0', y: 0, label: { en: 'floor (0 m)', hr: 'pod (0 m)' } },
    { value: '1', y: 1, label: { en: 'table (1 m)', hr: 'stol (1 m)' } },
    { value: '3', y: 3, label: { en: 'ceiling (3 m)', hr: 'strop (3 m)' } }
  ];

  window.Sims.register({
    id: 'energybars',
    title: { en: 'Energy Bar Charts', hr: 'Stupčasti dijagram energije' },
    summary: {
      en: 'Watch a motion and its energy bar chart side by side: kinetic, potential, internal energy and work at the start and now. Energy changes form — it is never used up.',
      hr: 'Prati gibanje i njegov stupčasti dijagram energije: kinetička, potencijalna, unutarnja energija i rad na početku i sada. Energija mijenja oblik — nikad se ne potroši.'
    },
    tasks: [
      { en: 'Throw the ball up at 6 m/s. Pause and scrub to the top: where did the kinetic energy go? Now scrub to the same height on the way down.', hr: 'Baci loptu uvis brzinom 6 m/s. Pauziraj i povuci vrijeme do vrha: kamo je otišla kinetička energija? Zatim povuci do iste visine pri padu.' },
      { en: 'Change the zero level from floor to ceiling. Which bars change and which stay the same? Does the motion change?', hr: 'Promijeni nultu razinu s poda na strop. Koji se stupci mijenjaju, a koji ostaju isti? Mijenja li se gibanje?' },
      { en: 'Box on the floor: compare "box only" with "box + floor". Where does the person\'s work end up?', hr: 'Kutija na podu: usporedi "samo kutija" i "kutija + pod". Gdje završava rad osobe?' },
      { en: 'Bouncing ball: after 3 bounces, how much of the energy is internal? Was any energy destroyed?', hr: 'Lopta koja odskakuje: nakon 3 odskoka, koliko je energije unutarnje? Je li se energija uništila?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 10, minHeight: 340, maxHeight: 560 });
      const C = K.controls(container, lang);
      const st = { sc: SCEN[0], m: 1, p: 5, t: 0, yZero: 0, sys: 'both', axis: { min: 0, max: 10, step: 2 } };

      // ---------- controls ----------
      const selSc = C.select({ label: { en: 'Scenario', hr: 'Situacija' }, options: SCEN.map(s => ({ value: s.id, label: s.label })), value: 'ball',
        onChange: v => { st.sc = SCEN.find(s => s.id === v) || SCEN[0]; applyScenario(); } });
      const slM = C.slider({ label: { en: 'Mass', hr: 'Masa' }, min: 0.5, max: 5, step: 0.5, value: 1, format: (v, l) => K.fmt(v, v >= 10 ? 0 : 1, l) + ' kg', onChange: v => { st.m = v; recompute(); refresh(); } });
      const slV = C.slider({ label: { en: 'Speed', hr: 'Brzina' }, min: 2, max: 8, step: 0.5, value: 5, unit: 'm/s', digits: 1, onChange: v => { st.p = v; st.t = 0; recompute(); refresh(); } });
      const slH = C.slider({ label: { en: 'Height', hr: 'Visina' }, min: 1, max: 4, step: 0.25, value: 3, unit: 'm', digits: 2, onChange: v => { st.p = v; st.t = 0; recompute(); refresh(); } });
      const slT = C.slider({ label: { en: 'Time (scrub when paused)', hr: 'Vrijeme (povlači kad je pauza)' }, min: 0, max: 100, step: 0.5, value: 0, format: (v, l) => K.fmt(v, 0, l) + ' %',
        onChange: v => { L.stop(); st.t = duration() * v / 100; updatePlay(); refresh(); } });
      const segZero = C.segmented({ label: { en: 'Zero level for E_p', hr: 'Nulta razina za E_p' }, options: ZEROS, value: '0',
        onChange: v => { st.yZero = (ZEROS.find(z => z.value === v) || ZEROS[0]).y; recompute(); refresh(); } });
      const segSys = C.segmented({ label: { en: 'System', hr: 'Sustav' }, options: [{ value: 'box', label: { en: 'box only', hr: 'samo kutija' } }, { value: 'both', label: { en: 'box + floor', hr: 'kutija + pod' } }], value: 'both',
        onChange: v => { st.sys = v; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { if (st.t >= duration() - 1e-9) st.t = 0; L.toggle(); updatePlay(); refresh(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outEk = C.readout({ label: { en: 'Kinetic energy E_k', hr: 'Kinetička energija E_k' }, unit: 'J', digits: 1 });
      const outEp = C.readout({ label: { en: 'Potential energy E_p', hr: 'Potencijalna energija E_p' }, unit: 'J', digits: 1 });
      const outEi = C.readout({ label: { en: 'Internal energy E_int', hr: 'Unutarnja energija E_un' }, unit: 'J', digits: 1 });
      const outW = C.readout({ label: { en: 'Work done on the system W', hr: 'Rad na sustavu W' }, unit: 'J', digits: 1 });
      const outTot = C.readout({ label: { en: 'Total energy in the system', hr: 'Ukupna energija u sustavu' }, unit: 'J', digits: 1 });
      const note = C.note({ text: { en: '', hr: '' } });

      function fieldOf(c) {
        let e = c.el;
        while (e) {
          const cls = String(e.className || '').split(/\s+/);
          if (cls.indexOf('sk-field') >= 0) return e;
          if (cls.indexOf('sk-controls') >= 0) return c.el;
          e = e.parentNode;
        }
        return c.el;
      }
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { updateOut(); draw(); }
      function applyScenario() {
        const s = st.sc;
        slM.input.min = s.m[0]; slM.input.max = s.m[1]; slM.input.step = s.m[2]; st.m = s.m[3]; slM.set(st.m);
        const sl = s.param === 'speed' ? slV : slH;
        sl.input.min = s.p[0]; sl.input.max = s.p[1]; sl.input.step = s.p[2]; st.p = s.p[3]; sl.set(st.p);
        show(slV, s.param === 'speed'); show(slH, s.param === 'height'); show(segSys, s.id === 'box');
        st.t = 0; recompute();
        if (!ctx.reducedMotion) L.start(); else L.stop();
        updatePlay(); refresh();
      }

      // ---------- physics (closed form for every scenario) ----------
      function duration() {
        const s = st.sc, p = st.p;
        switch (s.id) {
          case 'ball': return 2 * p / G;
          case 'slide': return Math.sqrt(2 * (p / SIN) / (G * SIN));
          case 'box': return DIST / p;
          case 'pend': return 2 * 2 * Math.PI / Math.sqrt(G / L_PEND);
          case 'bounce': { let T = Math.sqrt(2 * p / G); for (let n = 1; n <= N_BOUNCE; n++) T += 2 * Math.sqrt(2 * p * Math.pow(BOUNCE_K, n) / G); return T + 0.6; }
          case 'crane': return p / V_CRANE;
          default: return DIST / p;
        }
      }
      // state at time t: height y of the object (m), speed v, horizontal position x, internal energy and work so far
      function stateAt(t) {
        const s = st.sc, p = st.p, m = st.m;
        t = K.clamp(t, 0, duration());
        switch (s.id) {
          case 'ball': return { y: HAND_H + p * t - 0.5 * G * t * t, v: p - G * t, x: 0, Eint: 0, W: 0 };
          case 'slide': { const d = 0.5 * G * SIN * t * t; return { y: p - d * SIN, v: G * SIN * t, x: d * COS, Eint: 0, W: 0 }; }
          case 'box': { const F = MU * m * G, x = p * t; return { y: 0, v: p, x, Eint: F * x, W: F * x, F }; }
          case 'pend': {
            const th0 = Math.acos(1 - p / L_PEND), th = th0 * Math.cos(Math.sqrt(G / L_PEND) * t);
            const rise = L_PEND * (1 - Math.cos(th)), KE = Math.max(0, m * G * (p - rise));
            return { y: PIVOT_H - L_PEND + rise, v: Math.sqrt(2 * KE / m), x: 0, Eint: 0, W: 0, th };
          }
          case 'bounce': {
            const E0 = m * G * p, t0 = Math.sqrt(2 * p / G);
            if (t <= t0) return { y: p - 0.5 * G * t * t, v: G * t, x: 0, Eint: 0, W: 0, n: 0 };
            let tau = t - t0, n = 1;
            while (n <= N_BOUNCE) {
              const hn = p * Math.pow(BOUNCE_K, n), Tn = 2 * Math.sqrt(2 * hn / G);
              if (tau <= Tn) { const vn = Math.sqrt(2 * G * hn); return { y: Math.max(0, vn * tau - 0.5 * G * tau * tau), v: Math.abs(vn - G * tau), x: 0, Eint: E0 * (1 - Math.pow(BOUNCE_K, n)), W: 0, n }; }
              tau -= Tn; n++;
            }
            return { y: 0, v: 0, x: 0, Eint: E0, W: 0, n: N_BOUNCE };
          }
          case 'crane': return { y: V_CRANE * t, v: V_CRANE, x: 0, Eint: 0, W: m * G * V_CRANE * t, F: m * G };
          default: return { y: HAND_H, v: p, x: p * t, Eint: 0, W: 0, F: m * G };
        }
      }
      function energies(t) {
        const s = stateAt(t), m = st.m;
        return { s, Ek: 0.5 * m * s.v * s.v, Ep: m * G * (s.y - st.yZero), Eint: s.Eint, W: s.W };
      }
      const outside = () => st.sc.id === 'box' && st.sys === 'box';
      function recompute() { // fixed axis for the whole motion so the bars do not jump
        let lo = 0, hi = 1e-9;
        const e1 = energies(0), T = duration();
        for (let i = 0; i <= 60; i++) {
          const e = energies(T * i / 60);
          hi = Math.max(hi, e1.Ek + e1.Ep + e.W, e.Ek + e.Ep + e.Eint, e.Ek, e.Ep, e.W, e.Eint, e1.Ek, e1.Ep);
          lo = Math.min(lo, e.Ep, e1.Ep, e1.Ek + e1.Ep + e.W, e.Ek + e.Ep + e.Eint);
        }
        st.axis = K.niceScale(lo, hi, 4);
      }
      function step(dt) {
        const T = duration();
        st.t += dt * st.sc.tscale;
        if (st.t >= T) { st.t = T; L.stop(); updatePlay(); }
        slT.set(100 * st.t / T);
      }
      function updateOut() {
        const e = energies(st.t), out = outside();
        outEk.set(e.Ek); outEp.set(e.Ep); outEi.set(e.Eint); outW.set(e.W); outTot.set(e.Ek + e.Ep + (out ? 0 : e.Eint));
        const id = st.sc.id, s = e.s;
        let n;
        if (id === 'ball') {
          n = Math.abs(s.v) < 0.12 * st.p ? { en: 'At the top E_k = 0 — but the energy is not used up: it is all stored as E_p.', hr: 'Na vrhu je E_k = 0 — ali energija nije potrošena: sva je pohranjena kao E_p.' }
            : s.v > 0 ? { en: 'Going up the ball slows down: E_k turns into E_p. Nothing is lost.', hr: 'Pri usponu lopta usporava: E_k prelazi u E_p. Ništa se ne gubi.' }
              : { en: 'Coming down E_p turns back into E_k: at the same height the ball has the same E_k as on the way up.', hr: 'Pri padu E_p prelazi natrag u E_k: na istoj visini lopta ima istu E_k kao pri usponu.' };
        } else if (id === 'slide') n = { en: 'The slide pushes on the girl but does no work — its force is perpendicular to the motion. E_p → E_k, the total stays the same.', hr: 'Tobogan gura djevojčicu, ali ne obavlja rad — sila je okomita na gibanje. E_p → E_k, ukupna energija ostaje ista.' };
        else if (id === 'box') n = out
          ? { en: 'Box alone: the person\'s work does not speed it up (E_k constant) — it "leaves the system" as heat. Friction heats BOTH surfaces, so choose box + floor to see the energy stay inside.', hr: 'Samo kutija: rad osobe je ne ubrzava (E_k stalna) — "izlazi iz sustava" kao toplina. Trenje zagrijava OBJE površine, pa odaberi kutija + pod da energija ostane unutra.' }
          : { en: 'Box + floor: the person\'s work becomes internal energy of both surfaces (they warm up). E_k stays constant — work does not have to mean "faster".', hr: 'Kutija + pod: rad osobe postaje unutarnja energija obiju površina (zagriju se). E_k ostaje stalna — rad ne znači nužno "brže".' };
        else if (id === 'pend') n = { en: 'E_p ⇄ E_k, over and over. Without friction the total stays exactly the same (law of conservation of energy).', hr: 'E_p ⇄ E_k, uvijek iznova. Bez trenja ukupna energija ostaje točno ista (zakon očuvanja energije).' };
        else if (id === 'bounce') n = { en: 'Each bounce turns 20 % of the energy into internal energy (heat) and sound. Energy is not destroyed — it spreads out and becomes hard to use.', hr: 'Svaki odskok pretvara 20 % energije u unutarnju energiju (toplinu) i zvuk. Energija se ne uništava — raspršuje se i postaje teško iskoristiva.' };
        else if (id === 'crane') n = { en: 'The crane\'s work W = F·d = m·g·h becomes gravitational potential energy. E_k stays constant (constant speed).', hr: 'Rad dizalice W = F·d = m·g·h postaje gravitacijska potencijalna energija. E_k ostaje stalna (stalna brzina).' };
        else n = { en: 'No work is done: the hand\'s force is vertical, the motion horizontal (W = F·d·cos 90° = 0). The bars do not change.', hr: 'Rad se ne obavlja: sila ruke je okomita, a gibanje vodoravno (W = F·d·cos 90° = 0). Stupci se ne mijenjaju.' };
        if (st.yZero !== 0) n = { en: n.en + ' The zero level is our choice; only changes of E_p matter.', hr: n.hr + ' Nultu razinu biramo sami; važne su samo promjene E_p.' };
        note.set(n);
      }

      // ---------- drawing helpers ----------
      function fitFont(ctx, str, maxW, base, bold) {
        for (let px = base; px >= 9; px--) { const f = (bold ? 'bold ' : '') + px + 'px ' + theme.font; ctx.font = f; if (ctx.measureText(str).width <= maxW) return f; }
        return (bold ? 'bold ' : '') + '9px ' + theme.font;
      }
      function pill(ctx, str, x, y, align, font, minX, maxX) {
        ctx.font = font; const tw = ctx.measureText(str).width;
        let tx = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
        tx = K.clamp(tx, minX + 3, maxX - tw - 3);
        ctx.fillStyle = K.withAlpha(theme.surface, 0.85); K.roundRect(ctx, tx - 4, y - 8, tw + 8, 16, 4); ctx.fill();
        K.text(ctx, str, tx, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function ball(ctx, x, y, r, color) {
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = K.withAlpha('#ffffff', 0.35); ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.35, 0, Math.PI * 2); ctx.fill();
      }
      function person(ctx, x, gy, color, lean, phase) { // simple stick figure, feet at gy; phase swings the legs
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round';
        const hx = x + lean * 6, hy = gy - 28, sx = x + lean * 12, sy = gy - 50, sw = 8 * Math.sin(phase || 0);
        ctx.beginPath(); ctx.moveTo(x - 7 + sw, gy); ctx.lineTo(hx, hy); ctx.lineTo(x + 7 - sw, gy); ctx.moveTo(hx, hy); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.beginPath(); ctx.arc(sx + lean * 2, sy - 10, 8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        return { sx, sy };
      }
      function heatMarks(ctx, x1, x2, y, color) { // small wavy "warm" marks along the floor
        ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
        for (let x = x1; x < x2 - 10; x += 14) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 3, y - 5, x + 6, y); ctx.quadraticCurveTo(x + 9, y + 5, x + 12, y); ctx.stroke(); }
        ctx.restore();
      }

      // ---------- scene ----------
      function sceneExtent() { // metres to show vertically and horizontally
        const id = st.sc.id, p = st.p;
        let top = 2.2, wide = 0;
        if (id === 'ball') top = HAND_H + p * p / (2 * G) + 0.5;
        else if (id === 'slide') { top = p + 0.8; wide = (p / SIN) * COS + 0.6; }
        else if (id === 'box' || id === 'bag') wide = DIST + 1.6;
        else if (id === 'pend') { top = PIVOT_H + 0.3; wide = 2 * (L_PEND * Math.sin(Math.acos(1 - p / L_PEND)) + 0.4); }
        else if (id === 'bounce') top = p + 0.5;
        else if (id === 'crane') top = p + 1.4;
        return { top: Math.max(top, st.yZero + 0.4), wide };
      }
      function drawScene(ctx, R, e) {
        const s = e.s, id = st.sc.id, gY = R.y + R.h - 24, topY = R.y + 48, ext = sceneExtent();
        let pxm = (gY - topY) / ext.top;
        if (ext.wide > 0) pxm = Math.min(pxm, (R.w - 90) / ext.wide);
        const Y = ym => gY - ym * pxm, X = xm => R.x + 60 + xm * pxm, cx = R.x + Math.round(R.w * 0.55);
        const r = K.clamp(7 + st.m * 0.8, 7, 15), fn = '11px ' + theme.font;
        const lab = (str, x, y, align) => pill(ctx, str, x, y, align, fn, R.x, R.x + R.w);
        ctx.fillStyle = theme.ground; ctx.fillRect(R.x, gY, R.w, R.y + R.h - gY);
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(R.x, gY); ctx.lineTo(R.x + R.w, gY); ctx.stroke();
        // height ruler
        const rx = R.x + 30, stepM = ext.top > 6 ? 2 : ext.top > 3 ? 1 : 0.5;
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, gY); ctx.lineTo(rx, topY); ctx.stroke();
        for (let m = 0; m <= ext.top + 1e-6; m += stepM) {
          const y = Y(m); ctx.beginPath(); ctx.moveTo(rx - 4, y); ctx.lineTo(rx + 4, y); ctx.stroke();
          K.text(ctx, K.fmt(m, stepM < 1 ? 1 : 0, lang), rx - 7, y, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        // the chosen zero level of E_p
        const zy = Y(st.yZero);
        ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = theme.c1; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx + 8, zy); ctx.lineTo(R.x + R.w - 4, zy); ctx.stroke(); ctx.restore();
        K.text(ctx, 'E_p = 0', R.x + R.w - 6, zy - 3, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'bottom' });
        const vArrow = (x, y, dx, dy) => { if (Math.hypot(dx, dy) > 2) K.arrow(ctx, x, y, x + dx, y + dy, { color: theme.fg, width: 2, head: 8 }); };
        if (id === 'ball') {
          ctx.fillStyle = theme.fg; K.roundRect(ctx, cx - r - 30, Y(HAND_H) - 5, 22, 10, 4); ctx.fill();
          ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = theme.line; ctx.beginPath(); ctx.moveTo(rx + 8, Y(s.y)); ctx.lineTo(cx - r - 4, Y(s.y)); ctx.stroke(); ctx.restore();
          ball(ctx, cx, Y(s.y), r, theme.c1);
          vArrow(cx + r + 10, Y(s.y), 0, -s.v * 7);
          lab('h = ' + K.fmt(s.y, 2, lang) + ' m   v = ' + K.fmt(Math.abs(s.v), 1, lang) + ' m/s', cx + r + 20, Y(s.y) - s.v * 7, 'left');
        } else if (id === 'slide') {
          const run = (st.p / SIN) * COS;
          ctx.strokeStyle = K.withAlpha(theme.fg, 0.5); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(0), Y(st.p)); ctx.lineTo(X(run), Y(0)); ctx.stroke();
          ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0), Y(st.p)); ctx.lineTo(X(0), gY); ctx.moveTo(X(run / 2), Y(st.p / 2)); ctx.lineTo(X(run / 2), gY); ctx.stroke();
          const gx = X(s.x), gy = Y(s.y), nx = SIN, ny = -COS; // unit normal pointing up from the slide
          ctx.strokeStyle = theme.c1; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx + nx * 4, gy + ny * 4); ctx.lineTo(gx + nx * 22, gy + ny * 22); ctx.stroke();
          ball(ctx, gx + nx * 30, gy + ny * 30, 8, theme.c1);
          vArrow(gx + 14, gy + 14, COS * s.v * 6, SIN * s.v * 6);
          lab('h = ' + K.fmt(s.y, 2, lang) + ' m   v = ' + K.fmt(s.v, 1, lang) + ' m/s', gx + 20, gy - 24, 'left');
        } else if (id === 'box' || id === 'bag') {
          const F = s.F, lF = K.clamp(F * 0.6, 24, 90);
          if (id === 'box') {
            const bw = K.clamp(26 + st.m * 1.2, 26, 50), bx = X(s.x);
            if (s.x > 0.3) heatMarks(ctx, X(0), bx - bw / 2, gY - 3, theme.c3);
            ctx.fillStyle = theme.c1; ctx.fillRect(bx - bw / 2, gY - bw, bw, bw);
            const P = person(ctx, bx + bw / 2 + 48, gY, theme.fg, -1, st.t * 6);
            ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + bw / 2, gY - bw * 0.6); ctx.lineTo(P.sx - 2, P.sy + 2); ctx.stroke();
            K.arrow(ctx, bx, gY - bw * 0.6, bx + lF, gY - bw * 0.6, { color: theme.c4, width: 3, head: 10 });
            lab('F = ' + K.fmt(F, 1, lang) + ' N', bx + lF + 4, gY - bw * 0.6 - 14, 'left');
            K.arrow(ctx, bx, gY - 5, bx - lF, gY - 5, { color: theme.c3, width: 3, head: 10 });
            lab(K.tr({ en: 'friction ', hr: 'trenje ' }, lang) + K.fmt(F, 1, lang) + ' N', bx - lF - 4, gY - 18, 'right');
            vArrow(bx, gY - bw - 12, s.v * 20, 0);
            lab('v = ' + K.fmt(s.v, 1, lang) + ' m/s   d = ' + K.fmt(s.x, 2, lang) + ' m   W = F·d = ' + K.fmt(s.W, 1, lang) + ' J', bx, gY - bw - 30, 'center');
          } else {
            const px = X(s.x), P = person(ctx, px, gY, theme.fg, 0, st.t * 6), hy = Y(HAND_H);
            ctx.strokeStyle = theme.fg; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P.sx, P.sy); ctx.lineTo(px + 18, hy - 6); ctx.stroke();
            ctx.fillStyle = theme.c1; K.roundRect(ctx, px + 10, hy - 6, 18, 16 + st.m * 2, 3); ctx.fill();
            K.arrow(ctx, px + 19, hy + 2, px + 19, hy + 2 - lF, { color: theme.c4, width: 3, head: 10 });
            lab('F = m·g = ' + K.fmt(F, 1, lang) + ' N ↑', px + 28, hy - lF, 'left');
            vArrow(px + 40, hy + 10, s.v * 20, 0);
            lab('v = ' + K.fmt(s.v, 1, lang) + ' m/s →   W = F·d·cos 90° = 0', px + 40 + s.v * 20 + 6, hy + 10, 'left');
          }
        } else if (id === 'pend') {
          const px = R.x + R.w / 2, py = Y(PIVOT_H), bx = px + L_PEND * Math.sin(s.th) * pxm, by = py + L_PEND * Math.cos(s.th) * pxm;
          ctx.fillStyle = theme.fg; ctx.fillRect(px - 36, py - 6, 72, 6);
          ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = theme.line; ctx.beginPath(); ctx.moveTo(rx + 8, Y(PIVOT_H - L_PEND + st.p)); ctx.lineTo(R.x + R.w - 4, Y(PIVOT_H - L_PEND + st.p)); ctx.stroke(); ctx.restore();
          ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
          ball(ctx, bx, by, r, theme.c1);
          lab('h = ' + K.fmt(s.y, 2, lang) + ' m   v = ' + K.fmt(s.v, 1, lang) + ' m/s', bx, by + r + 14, 'center');
        } else if (id === 'bounce') {
          if (s.n > 0) { heatMarks(ctx, cx - 10 - s.n * 7, cx + 10 + s.n * 7, gY - 3, theme.c3); lab(K.tr({ en: 'bounces: ', hr: 'odskoci: ' }, lang) + K.fmt(s.n, 0, lang), cx, gY + 12, 'center'); }
          ball(ctx, cx, Y(s.y) - r, r, theme.c1);
          lab('h = ' + K.fmt(s.y, 2, lang) + ' m   v = ' + K.fmt(s.v, 1, lang) + ' m/s', cx + r + 12, Y(s.y) - r, 'left');
        } else { // crane
          const tx = R.x + R.w - 36, jy = Y(ext.top - 0.15), cw = K.clamp(26 + st.m * 0.05, 26, 52);
          ctx.strokeStyle = theme.fg; ctx.lineWidth = 5; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(tx, gY); ctx.lineTo(tx, jy); ctx.lineTo(cx - 40, jy); ctx.stroke();
          ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, jy); ctx.lineTo(cx, Y(s.y) - cw); ctx.stroke();
          ctx.fillStyle = theme.c1; ctx.fillRect(cx - cw / 2, Y(s.y) - cw, cw, cw);
          ctx.strokeStyle = theme.surface; ctx.lineWidth = 2; ctx.strokeRect(cx - cw / 2 + 3, Y(s.y) - cw + 3, cw - 6, cw - 6);
          const lF = K.clamp(Math.sqrt(s.F) * 1.2, 30, 90);
          K.arrow(ctx, cx + cw / 2 + 10, Y(s.y) - cw / 2, cx + cw / 2 + 10, Y(s.y) - cw / 2 - lF, { color: theme.c4, width: 3, head: 10 });
          lab('F = m·g = ' + K.fmt(s.F, 0, lang) + ' N', cx + cw / 2 + 18, Y(s.y) - cw / 2 - lF, 'left');
          lab('h = ' + K.fmt(s.y, 2, lang) + ' m   v = ' + K.fmt(s.v, 1, lang) + ' m/s   W = F·h = ' + K.fmt(s.W, 0, lang) + ' J', cx, Y(s.y) + 14, 'center');
        }
        const ttl = K.tr(st.sc.label, lang);
        K.text(ctx, ttl, R.x + 10, R.y + 16, { font: fitFont(ctx, ttl, R.w - 20, 15, true).replace(theme.font, theme.fontDisplay), color: theme.fg, baseline: 'middle' });
        const sub = 't = ' + K.fmt(st.t, 2, lang) + ' s   m = ' + K.fmt(st.m, st.m >= 10 ? 0 : 1, lang) + ' kg   g = ' + K.fmt(G, 2, lang) + ' m/s²';
        K.text(ctx, sub, R.x + 10, R.y + 34, { font: fitFont(ctx, sub, R.w - 20, 12, false), color: theme.muted, baseline: 'middle' });
      }

      // ---------- bar chart: start (t₁) | + W | = now (t) ----------
      function drawChart(ctx, R, e1, e2) {
        const out = outside(), ax = st.axis, small = R.h < 230;
        ctx.fillStyle = theme.surface; K.roundRect(ctx, R.x, R.y, R.w, R.h, 10); ctx.fill();
        const pad = 8, axisW = 44, balH = small ? 26 : 34;
        const plotTop = R.y + pad + 18 + 16 + 14, plotBot = R.y + R.h - pad - 16 - balH, plotH = Math.max(16, plotBot - plotTop);
        const Yv = E => plotBot - (E - ax.min) / ((ax.max - ax.min) || 1) * plotH, y0 = Yv(0);
        const dAx = ax.step >= 1 ? 0 : ax.step >= 0.1 ? 1 : 2, dV = ax.max - ax.min > 200 ? 0 : 1;
        K.text(ctx, K.tr({ en: 'Energy bar chart (J)', hr: 'Stupčasti dijagram energije (J)' }, lang), R.x + R.w / 2, R.y + pad + 8, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
        ctx.strokeStyle = theme.line; ctx.lineWidth = 1;
        for (let v = ax.min; v <= ax.max + 1e-9; v += ax.step) {
          const y = Yv(v); ctx.beginPath(); ctx.moveTo(R.x + axisW, y); ctx.lineTo(R.x + R.w - pad, y); ctx.stroke();
          K.text(ctx, K.fmt(v, dAx, lang), R.x + axisW - 5, y, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(R.x + axisW, y0); ctx.lineTo(R.x + R.w - pad, y0); ctx.stroke();
        const slot = (R.w - axisW - pad * 2) / 7.2, bw = slot * 0.66, bx0 = R.x + axisW + pad;
        const bxOf = i => bx0 + i * slot + (slot - bw) / 2;
        const bars = [
          { i: 0, v: e1.Ek, c: theme.c2, l: 'E_k' }, { i: 1, v: e1.Ep, c: theme.c1, l: 'E_p' }, { i: 2.3, v: e2.W, c: theme.c4, l: 'W' },
          { i: 3.9, v: e2.Ek, c: theme.c2, l: 'E_k' }, { i: 4.9, v: e2.Ep, c: theme.c1, l: 'E_p' }, { i: 5.9, v: e2.Eint, c: theme.c3, l: out ? { en: 'E_out', hr: 'E_van' } : { en: 'E_int', hr: 'E_un' }, hatch: out }
        ];
        const tot1 = e1.Ek + e1.Ep + e2.W, tot2 = e2.Ek + e2.Ep + (out ? 0 : e2.Eint);
        bars.forEach(b => {
          const x = bxOf(b.i), yv = Yv(b.v), top = Math.min(yv, y0), hh = Math.abs(yv - y0);
          const nearTotal = Math.abs(yv - Yv(b.i < 3 ? tot1 : tot2)) < 12 && hh > 16 && b.v > 0; // label inside, under the Σ line
          ctx.fillStyle = b.hatch ? K.withAlpha(b.c, 0.25) : b.c; ctx.fillRect(x, top, bw, hh);
          if (b.hatch && hh > 1) {
            ctx.save(); ctx.beginPath(); ctx.rect(x, top, bw, hh); ctx.clip(); ctx.strokeStyle = b.c; ctx.lineWidth = 2; ctx.beginPath();
            for (let k = -hh; k < bw; k += 8) { ctx.moveTo(x + k, top + hh); ctx.lineTo(x + k + hh, top); }
            ctx.stroke(); ctx.restore();
            ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = b.c; ctx.lineWidth = 1.5; ctx.strokeRect(x, top, bw, hh); ctx.restore();
          }
          if (Math.abs(b.v) < 1e-6) { ctx.fillStyle = b.c; ctx.fillRect(x, y0 - 2, bw, 4); }
          if (nearTotal) K.text(ctx, K.fmt(b.v, dV, lang), x + bw / 2, top + 3, { font: 'bold 10px ' + theme.font, color: b.hatch ? theme.fg : theme.surface, align: 'center', baseline: 'top' });
          else K.text(ctx, K.fmt(b.v, dV, lang), x + bw / 2, b.v >= 0 ? top - 2 : y0 - 2, { font: '10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
          K.text(ctx, K.tr(b.l, lang), x + bw / 2, plotBot + 3, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        });
        // operators between the bars and the group titles
        const op = (i, s) => K.text(ctx, s, bxOf(i) + bw / 2, plotBot + 3, { font: 'bold 12px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        op(0.5, '+'); op(1.65, '+'); op(3.1, '='); op(4.4, '+'); op(5.4, '+');
        const gy = R.y + pad + 18 + 8, gf = fitFont(ctx, K.tr({ en: 'now  t = ' + K.fmt(st.t, 2, 'en') + ' s', hr: 'sada  t = ' + K.fmt(st.t, 2, 'hr') + ' s' }, lang), 3 * slot - 4, 11, true);
        K.text(ctx, K.tr({ en: 'start  t₁ = 0 s', hr: 'početak  t₁ = 0 s' }, lang), bxOf(0.5) + bw / 2, gy, { font: gf, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'work', hr: 'rad' }, lang), bxOf(2.3) + bw / 2, gy, { font: gf, color: theme.muted, align: 'center', baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'now  t = ' + K.fmt(st.t, 2, 'en') + ' s', hr: 'sada  t = ' + K.fmt(st.t, 2, 'hr') + ' s' }, lang), bxOf(4.9) + bw / 2, gy, { font: gf, color: theme.fg, align: 'center', baseline: 'middle' });
        // total lines for the two sides
        [[bxOf(0), bxOf(2.3) + bw, tot1], [bxOf(3.9), bxOf(5.9) + bw, tot2]].forEach(([x1, x2, tot]) => {
          const y = Yv(tot);
          ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
          K.text(ctx, 'Σ ' + K.fmt(tot, dV, lang), x2, y - 3, { font: 'bold 10px ' + theme.font, color: theme.fg, align: 'right', baseline: 'bottom' });
        });
        // the balance written with the current numbers
        const by = R.y + R.h - pad - balH + 2, f = v => K.fmt(v, dV, lang);
        const sym = 'E_k + E_p + W = E_k + E_p + ' + K.tr(out ? { en: 'E_out', hr: 'E_van' } : { en: 'E_int', hr: 'E_un' }, lang) + (out ? K.tr({ en: '  (energy that left the box)', hr: '  (energija koja je izašla iz kutije)' }, lang) : '');
        const num = f(e1.Ek) + ' + ' + f(e1.Ep) + ' + ' + f(e2.W) + ' = ' + f(e2.Ek) + ' + ' + f(e2.Ep) + ' + ' + f(e2.Eint) + ' J';
        K.text(ctx, sym, R.x + R.w / 2, by + 5, { font: fitFont(ctx, sym, R.w - 16, small ? 10 : 11, true), color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(ctx, num, R.x + R.w / 2, by + (small ? 17 : 21), { font: fitFont(ctx, num, R.w - 16, small ? 10 : 12, false), color: theme.fg, align: 'center', baseline: 'middle' });
      }

      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        const wide = w >= 640;
        const scene = wide ? { x: 0, y: 0, w: Math.round(w * 0.47), h } : { x: 0, y: 0, w, h: Math.round(h * 0.5) };
        const chart = wide ? { x: scene.w + 6, y: 6, w: w - scene.w - 12, h: h - 12 } : { x: 6, y: scene.h + 4, w: w - 12, h: h - scene.h - 10 };
        const e1 = energies(0), e2 = energies(st.t);
        drawScene(ctx, scene, e2);
        drawChart(ctx, chart, e1, e2);
      }
      function reset() {
        st.sc = SCEN[0]; selSc.set('ball'); st.yZero = 0; segZero.set('0'); st.sys = 'both'; segSys.set('both');
        applyScenario();
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
