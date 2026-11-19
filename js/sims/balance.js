/* FizLab sim: Centre of mass and stability — (a) find the centre of mass of a cardboard shape with plumb lines,
   (b) tilt a platform until an object topples, (c) a balancing toy on a fingertip. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, TAU = Math.PI * 2, DEG = Math.PI / 180;
  const CARD = '#d2a56d', CARD_EDGE = '#8b5e34', SKIN = '#e2b08c';     // fixed physical colours (cardboard, wood, skin)
  // flat shapes in metres (x right, y down); pin0 = first hanging point
  const SHAPES = [
    { id: 'L', label: { en: 'L-shape', hr: 'Slovo L' }, pin0: [0.04, 0.04], pts: [[0, 0], [0.12, 0], [0.12, 0.24], [0.3, 0.24], [0.3, 0.36], [0, 0.36]] },
    { id: 'boom', label: { en: 'Boomerang', hr: 'Bumerang' }, pin0: [0.05, 0.04], pts: [[0, 0.02], [0.07, 0], [0.18, 0.2], [0.29, 0], [0.36, 0.02], [0.18, 0.33]] },
    { id: 'tri', label: { en: 'Triangle', hr: 'Trokut' }, pin0: [0.11, 0.05], pts: [[0.1, 0], [0.36, 0.3], [0, 0.3]] },
    { id: 'island', label: { en: 'Irregular "island"', hr: 'Nepravilan "otok"' }, pin0: [0.16, 0.04], pts: [[0.05, 0.06], [0.16, 0], [0.27, 0.04], [0.36, 0.13], [0.31, 0.2], [0.34, 0.3], [0.22, 0.34], [0.14, 0.27], [0.04, 0.31], [0, 0.18]] }
  ];
  SHAPES.forEach(sh => {        // exact centroid and radius of gyration of the polygon
    let A = 0, cx = 0, cy = 0, J = 0;
    const p = sh.pts;
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length], cr = a[0] * b[1] - b[0] * a[1];
      A += cr / 2; cx += (a[0] + b[0]) * cr; cy += (a[1] + b[1]) * cr;
      J += cr * (a[0] * a[0] + a[0] * b[0] + b[0] * b[0] + a[1] * a[1] + a[1] * b[1] + b[1] * b[1]) / 12;
    }
    sh.c = [cx / (6 * A), cy / (6 * A)];
    sh.k2 = J / A - sh.c[0] * sh.c[0] - sh.c[1] * sh.c[1];
  });
  function inside(sh, q) {
    let inn = false;
    const p = sh.pts;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      if ((p[i][1] > q[1]) !== (p[j][1] > q[1]) && q[0] < (p[j][0] - p[i][0]) * (q[1] - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) inn = !inn;
    }
    return inn;
  }
  const eqPhi = (sh, pin) => Math.PI / 2 - Math.atan2(sh.c[1] - pin[1], sh.c[0] - pin[0]);   // rotation with the centre of mass below the pin
  // objects for the tilting platform: size in m, cb = height of the empty body's centre of mass (fraction of the height)
  const OBJ = [
    { id: 'box', W: 1, H: 1, cb: 0.5, load: 50, label: { en: 'Box', hr: 'Kutija' } },
    { id: 'bottle', W: 0.1, H: 0.3, cb: 0.45, load: 20, label: { en: 'Tall bottle', hr: 'Visoka boca' } },
    { id: 'bus', W: 2.5, H: 3.2, cb: 0.35, load: 30, label: { en: 'Bus', hr: 'Autobus' } },
    { id: 'racer', W: 2, H: 1, cb: 0.3, load: 20, label: { en: 'Racing car', hr: 'Trkaći automobil' } }
  ];
  const TOY = { m0: 0.02, b: 0.08, ha: 0.05, a: 0.14 };      // toy: body 20 g and 8 cm, arms 14 cm from 5 cm up

  window.Sims.register({
    id: 'balance',
    title: { en: 'Centre of Mass and Stability', hr: 'Težište i stabilnost' },
    summary: {
      en: 'Find the centre of mass of a cardboard shape with a plumb line, tilt a platform until things topple, and build a toy that balances on a fingertip.',
      hr: 'Pronađi težište kartonskog lika pomoću viska, naginji podlogu dok se tijela ne prevrnu i složi igračku koja balansira na vrhu prsta.'
    },
    tasks: [
      { en: 'Hang the L-shape from three different points and draw the plumb line each time. Where do the lines cross?', hr: 'Objesi slovo L u tri različite točke i svaki put povuci visak. Gdje se crte sijeku?' },
      { en: 'Find the centre of mass of the boomerang. Is it inside the cardboard?', hr: 'Pronađi težište bumeranga. Je li ono unutar kartona?' },
      { en: 'Tilt the bus until it topples. Then move the load up to the roof. At which angle does it topple now?', hr: 'Naginji autobus dok se ne prevrne. Zatim podigni teret do krova. Pri kojem se kutu sada prevrće?' },
      { en: 'Balancing toy: find the arm angle at which the toy just starts to return after a push.', hr: 'Igračka: pronađi kut ruku pri kojem se igračka tek počne vraćati nakon guranja.' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 330, maxHeight: 480 });
      const C = K.controls(container, lang);
      const T = o => K.tr(o, lang), N = (v, d) => K.fmt(v, d, lang);
      function defaults() {
        const sh = SHAPES[0];
        return { mode: 'find', shape: 'L', pin: sh.pin0.slice(), phi: eqPhi(sh, sh.pin0), om: 0, lines: [], reveal: false, wait: 0,
          obj: 'box', W: 1, Hh: 1, load: 50, tilt: 0, psi: 0, pom: 0,
          arm: -40, wm: 50, tphi: 0, tom: 0, fell: false, fy: 0, fv: 0, dir: 1, paused: false };
      }
      const st = defaults();
      let drag = null;

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'Activity', hr: 'Aktivnost' }, options: [
        { value: 'find', label: { en: 'Find the centre of mass', hr: 'Pronađi težište' } }, { value: 'topple', label: { en: 'Will it topple?', hr: 'Hoće li se prevrnuti?' } },
        { value: 'tricks', label: { en: 'Balancing tricks', hr: 'Trikovi ravnoteže' } }], value: 'find', onChange: v => { st.mode = v; drag = null; showControls(); refresh(); } });
      const selShape = C.select({ label: { en: 'Cardboard shape', hr: 'Kartonski lik' }, options: SHAPES.map(s => ({ value: s.id, label: s.label })), value: 'L',
        onChange: v => { st.shape = v; const sh = shape(); st.pin = sh.pin0.slice(); st.phi = eqPhi(sh, st.pin); st.om = 0; st.lines = []; refresh(); } });
      const btnLine = C.button({ label: { en: 'Draw plumb line', hr: 'Povuci visak' }, variant: 'primary', onClick: drawLine });
      const btnClear = C.button({ label: { en: 'Erase the lines', hr: 'Obriši crte' }, onClick: () => { st.lines = []; refresh(); } });
      const tgReveal = C.toggle({ label: { en: 'Reveal the true centre of mass', hr: 'Otkrij pravo težište' }, value: false, onChange: v => { st.reveal = v; refresh(); } });
      const selObj = C.select({ label: { en: 'Object', hr: 'Tijelo' }, options: OBJ.map(o => ({ value: o.id, label: o.label })), value: 'box',
        onChange: v => { st.obj = v; const o = obj(); st.W = o.W; st.Hh = o.H; st.load = o.load; slW.set(o.W); slHh.set(o.H); slLoad.set(o.load); upright(); refresh(); } });
      const slTilt = C.slider({ label: { en: 'Tilt of the platform', hr: 'Nagib podloge' }, min: 0, max: 60, step: 0.5, value: 0, format: (v, l) => K.fmt(v, 1, l) + '°', onChange: v => { st.tilt = v; refresh(); } });
      const slW = C.slider({ label: { en: 'Width of the object', hr: 'Širina tijela' }, min: 0.1, max: 3, step: 0.05, value: 1, unit: 'm', digits: 2, onChange: v => { st.W = v; upright(); refresh(); } });
      const slHh = C.slider({ label: { en: 'Height of the object', hr: 'Visina tijela' }, min: 0.1, max: 4, step: 0.05, value: 1, unit: 'm', digits: 2, onChange: v => { st.Hh = v; upright(); refresh(); } });
      const slLoad = C.slider({ label: { en: 'Height of the load inside', hr: 'Visina tereta u tijelu' }, min: 0, max: 100, step: 1, value: 50, unit: '%', digits: 0, onChange: v => { st.load = v; upright(); refresh(); } });
      const slArm = C.slider({ label: { en: 'Arms: down (−) or up (+)', hr: 'Ruke: dolje (−) ili gore (+)' }, min: -80, max: 60, step: 1, value: -40, format: (v, l) => K.fmt(v, 0, l) + '°', onChange: v => { st.arm = v; upright(); refresh(); } });
      const slWm = C.slider({ label: { en: 'Mass of each weight', hr: 'Masa svakog utega' }, min: 0, max: 100, step: 1, value: 50, unit: 'g', digits: 0, onChange: v => { st.wm = v; upright(); refresh(); } });
      const btnPush = C.button({ label: { en: 'Push', hr: 'Gurni' }, variant: 'primary', onClick: () => { if (st.fell) upright(); st.dir = -st.dir; st.tom += 1.6 * st.dir; if (!L.running && !st.paused) { L.start(); updatePlay(); } refresh(); } });
      const btnUp = C.button({ label: { en: 'Set it upright', hr: 'Uspravi' }, onClick: () => { upright(); refresh(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, onClick: () => { L.toggle(); st.paused = !L.running; updatePlay(); refresh(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: reset });
      const outLines = C.readout({ label: { en: 'Plumb lines drawn', hr: 'Povučenih crta viska' }, digits: 0 });
      const outErr = C.readout({ label: { en: 'Your crossing misses the centre by', hr: 'Tvoje sjecište promašuje težište za' }, unit: 'mm', digits: 1 });
      const outSwing = C.readout({ label: { en: 'Shape', hr: 'Lik' } });
      const outCrit = C.readout({ label: { en: 'Tipping angle α', hr: 'Kut prevrtanja α' }, unit: '°', digits: 1 });
      const outYc = C.readout({ label: { en: 'Height of the centre of mass', hr: 'Visina težišta' }, unit: 'm', digits: 2 });
      const outState = C.readout({ label: { en: 'State', hr: 'Stanje' } });
      const outToy = C.readout({ label: { en: 'Centre of mass above (+) / below (−) the support', hr: 'Težište iznad (+) / ispod (−) oslonca' }, unit: 'cm', digits: 1 });
      const outEq = C.readout({ label: { en: 'Equilibrium', hr: 'Ravnoteža' } });
      const note = C.note({ text: { en: '', hr: '' } });

      function fieldOf(ctrl) { const el = ctrl.el; return el.classList.contains('sk-field') ? el : el.parentElement; }
      function show(list, on) { list.forEach(ct => { fieldOf(ct).style.display = on ? '' : 'none'; }); }
      function showControls() {
        const m = st.mode;
        show([selShape, btnLine, btnClear, tgReveal, outLines, outErr, outSwing], m === 'find');
        show([selObj, slTilt, slW, slHh, slLoad, outCrit, outYc, outState], m === 'topple');
        show([slArm, slWm, btnPush, outToy, outEq], m === 'tricks');
        show([btnUp], m !== 'find');
        cv.canvas.style.cursor = 'default';
      }

      // ---------- physics ----------
      function shape() { return SHAPES.find(s => s.id === st.shape) || SHAPES[0]; }
      function obj() { return OBJ.find(o => o.id === st.obj) || OBJ[0]; }
      function swing() {       // angle of the centre of mass away from "straight below the pin"
        const sh = shape(), d = Math.hypot(sh.c[0] - st.pin[0], sh.c[1] - st.pin[1]);
        let th = Math.atan2(sh.c[1] - st.pin[1], sh.c[0] - st.pin[0]) + st.phi - Math.PI / 2;
        th = ((th + Math.PI) % TAU + TAU) % TAU - Math.PI;
        return { sh, d, th, rest: d < 0.004 || (Math.abs(th) < 0.012 && Math.abs(st.om) < 0.03) };
      }
      function cross() {       // mean crossing point of the recorded plumb lines (local coordinates)
        let sx = 0, sy = 0, n = 0;
        for (let i = 0; i < st.lines.length; i++) for (let j = i + 1; j < st.lines.length; j++) {
          const a = st.lines[i], b = st.lines[j], den = a.u[0] * b.u[1] - a.u[1] * b.u[0];
          if (Math.abs(den) < 0.08) continue;
          const t = ((b.p[0] - a.p[0]) * b.u[1] - (b.p[1] - a.p[1]) * b.u[0]) / den;
          sx += a.p[0] + t * a.u[0]; sy += a.p[1] + t * a.u[1]; n++;
        }
        return n ? [sx / n, sy / n] : null;
      }
      function drawLine() {
        if (!swing().rest) { st.wait = 2.5; refresh(); return; }
        const ln = { p: st.pin.slice(), u: [Math.sin(st.phi), Math.cos(st.phi)] };     // world "down" seen from the shape
        const same = st.lines.findIndex(l => Math.hypot(l.p[0] - ln.p[0], l.p[1] - ln.p[1]) < 0.006);
        if (same >= 0) st.lines[same] = ln; else st.lines.push(ln);
        if (st.lines.length > 4) st.lines.shift();
        refresh();
      }
      function top() {
        const yc = st.Hh * (obj().cb + st.load / 100) / 2;      // body and load have equal masses
        return { yc, crit: Math.atan2(st.W / 2, yc), tilt: st.tilt * DEG };
      }
      function toy() {
        const g = st.arm * DEG, m = st.wm / 1000, wx = TOY.a * Math.cos(g), wy = TOY.ha + TOY.a * Math.sin(g), M = TOY.m0 + 2 * m;
        return { m, wx, wy, yc: (TOY.m0 * TOY.b / 2 + 2 * m * wy) / M, k: M * G / (TOY.m0 * TOY.b * TOY.b / 3 + 2 * m * (wx * wx + wy * wy) + 1e-6) };
      }
      function upright() { st.psi = 0; st.pom = 0; st.tphi = 0; st.tom = 0; st.fell = false; st.fy = 0; st.fv = 0; }
      function step(dt) {
        const n = 6, h = dt / n;
        if (st.mode === 'find') {
          const s = swing(), w2 = G * s.d / (s.sh.k2 + s.d * s.d);        // physical pendulum
          for (let i = 0; i < n; i++) { st.om += (-w2 * Math.sin(swing().th) - 1.8 * st.om) * h; st.phi += st.om * h; }
          if (st.wait > 0) st.wait -= dt;
        } else if (st.mode === 'topple') {
          const q = top(), rho = Math.hypot(st.W / 2, q.yc), k2 = (st.W * st.W + st.Hh * st.Hh) / 12;
          for (let i = 0; i < n; i++) {
            if (st.psi <= 0 && q.tilt <= q.crit) { st.psi = 0; st.pom = 0; break; }
            if (st.psi >= Math.PI / 2) { st.psi = Math.PI / 2; st.pom = 0; break; }
            if (st.psi <= 0) st.pom = Math.max(st.pom, 0.12);
            st.pom += G * rho / (k2 + rho * rho) * Math.sin(q.tilt + st.psi - q.crit) * h; st.psi += st.pom * h;
            if (st.psi < 0) { st.psi = 0; st.pom = 0; }
          }
        } else {
          const q = toy();
          if (st.fell) {            // slid off the finger: falls to the table
            if (st.fy < 0.24) { st.fv += G * dt; st.fy = Math.min(0.24, st.fy + st.fv * dt); st.tphi += K.clamp(st.tom, -6, 6) * dt; }
            return;
          }
          if (q.yc > 0 && Math.abs(st.tphi) < 0.02 && Math.abs(st.tom) < 1e-3 && !drag) st.tphi = 0.03 * st.dir;   // nothing stands perfectly upright
          for (let i = 0; i < n; i++) { st.tom += (q.k * q.yc * Math.sin(st.tphi) - 0.9 * st.tom) * h; st.tphi += st.tom * h; }
          if (Math.abs(st.tphi) > 1.35) { st.fell = true; st.fv = 0; st.fy = 0; }
        }
      }
      function settle() {      // used instead of the animation when motion is reduced
        if (st.mode === 'find') { st.phi = eqPhi(shape(), st.pin); st.om = 0; st.wait = 0; }
        else if (st.mode === 'topple') { const q = top(); if (q.tilt > q.crit) st.psi = Math.PI / 2; st.pom = 0; }
        else if (toy().yc > 0 && !st.fell) { st.fell = true; st.fy = 0.24; st.tphi = Math.PI / 2; st.tom = 0; }
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { if (!L.running && !st.paused) settle(); updateOut(); draw(); }
      function toppleState() {
        const q = top();
        if (st.psi >= Math.PI / 2 - 0.01) return { key: 'bad', txt: { en: 'toppled', hr: 'prevrnuto' } };
        if (st.psi > 0.001 || q.tilt > q.crit) return { key: 'bad', txt: { en: 'toppling', hr: 'prevrće se' } };
        if (q.tilt > q.crit - 3 * DEG) return { key: 'warn', txt: { en: 'about to tip', hr: 'na rubu prevrtanja' } };
        return { key: 'good', txt: { en: 'stable', hr: 'stabilno' } };
      }
      function toyState() {
        const yc = toy().yc;
        if (st.fell) return { key: 'bad', txt: { en: 'fell off', hr: 'pala je' } };
        if (Math.abs(yc) < 0.0015) return { key: 'warn', txt: { en: 'neutral', hr: 'indiferentna' } };
        return yc < 0 ? { key: 'good', txt: { en: 'stable', hr: 'stabilna' } } : { key: 'bad', txt: { en: 'unstable', hr: 'labilna' } };
      }
      function updateOut() {
        if (st.mode === 'find') {
          const s = swing(), x = cross(), n = st.lines.length;
          outLines.set(n); outErr.set(x ? Math.hypot(x[0] - s.sh.c[0], x[1] - s.sh.c[1]) * 1000 : null);
          outSwing.set(s.rest ? { en: 'at rest', hr: 'miruje' } : { en: 'swinging', hr: 'njiše se' }); outSwing.setColor(s.rest ? theme.good : theme.warn);
          if (st.wait > 0 && !s.rest) note.set({ en: 'Wait until the shape stops swinging, then draw the plumb line.', hr: 'Pričekaj da se lik prestane njihati pa povuci visak.' });
          else if (n === 0) note.set({ en: 'Click any point of the cardboard to hang it there. At rest the centre of mass is exactly below the pin, so it lies on the plumb line. Draw the line!', hr: 'Klikni bilo koju točku kartona da ga ondje objesiš. Kad miruje, težište je točno ispod pribadače pa leži na visku. Povuci crtu!' });
          else if (n === 1) note.set({ en: 'The centre of mass is somewhere on this line. Hang the shape from another point and draw a second line.', hr: 'Težište je negdje na ovoj crti. Objesi lik u drugoj točki i povuci drugu crtu.' });
          else note.set(st.shape === 'boom'
            ? { en: 'All plumb lines cross in one point: the centre of mass. For the boomerang it lies outside the cardboard, in the empty space between the arms!', hr: 'Sve crte viska sijeku se u jednoj točki: težištu. Kod bumeranga ono leži izvan kartona, u praznom prostoru između krakova!' }
            : { en: 'All plumb lines cross in one point: the centre of mass. A body hung from any point comes to rest with its centre of mass below that point.', hr: 'Sve crte viska sijeku se u jednoj točki: težištu. Tijelo obješeno u bilo kojoj točki umiri se tako da mu je težište ispod te točke.' });
        } else if (st.mode === 'topple') {
          const q = top(), s = toppleState();
          outCrit.set(q.crit / DEG); outYc.set(q.yc); outState.set(s.txt); outState.setColor(theme[s.key]);
          note.set({ en: 'An object stands as long as the vertical line through its centre of mass falls inside its support base. It tips when tan α = (half the width) / (height of the centre of mass). Low and wide is stable: that is why racing cars are flat. (A small stop keeps the object from sliding.)',
            hr: 'Tijelo stoji dok okomica kroz težište pada unutar oslonca (baze). Prevrće se kad je tan α = (pola širine) / (visina težišta). Nisko i široko je stabilno: zato su trkaći automobili plosnati. (Mali graničnik sprečava klizanje tijela.)' });
        } else {
          const q = toy(), s = toyState();
          outToy.set(q.yc * 100); outEq.set(s.txt); outEq.setColor(theme[s.key]);
          note.set(q.yc < 0
            ? { en: 'The centre of mass is below the support point: after a push the toy swings back like a pendulum (stable equilibrium). A tightrope walker\'s drooping pole, the balancing bird and the fork-and-cork trick work the same way.', hr: 'Težište je ispod oslonca: nakon guranja igračka se vraća kao njihalo (stabilna ravnoteža). Tako rade i savijena motka hodača po žici, ptica balansirka i trik s vilicama i plutenim čepom.' }
            : { en: 'The centre of mass is above the support point: the smallest tilt grows and the toy falls (unstable equilibrium). Lower the arms or use heavier weights to bring the centre of mass below the fingertip.', hr: 'Težište je iznad oslonca: i najmanji nagib raste i igračka pada (labilna ravnoteža). Spusti ruke ili stavi teže utege da težište dođe ispod vrha prsta.' });
        }
      }

      // ---------- geometry shared by drawing and pointer ----------
      function findGeom() {
        const w = cv.w, h = cv.h, pxm = Math.min((h - 100) / 0.48, w / 0.95), cs = Math.cos(st.phi), sn = Math.sin(st.phi), S = { x: Math.round(w / 2), y: 72 };
        return { pxm, S,
          toScreen: q => { const dx = q[0] - st.pin[0], dy = q[1] - st.pin[1]; return { x: S.x + (dx * cs - dy * sn) * pxm, y: S.y + (dx * sn + dy * cs) * pxm }; },
          toLocal: p => { const vx = (p.x - S.x) / pxm, vy = (p.y - S.y) / pxm; return [st.pin[0] + vx * cs + vy * sn, st.pin[1] - vx * sn + vy * cs]; } };
      }
      function topGeom() {
        const w = cv.w, h = cv.h, hx = Math.round(w * 0.14), hy = h - 44, Lp = Math.min(w * 0.6, (hy - 56) / 0.87), q = top();
        const so = Math.min(0.3 * Lp / st.W, 0.34 * Lp / st.Hh), Wp = st.W * so, Hp = st.Hh * so, xo = 0.5 * Lp, ct = Math.cos(q.tilt), sn = Math.sin(q.tilt), cp = Math.cos(st.psi), sp = Math.sin(st.psi);
        // object point (x from the middle of the base, y up) -> screen
        const P = (x, y) => { const vx = x + Wp / 2, vy = -y, px = vx * cp + vy * sp + xo - Wp / 2, py = -vx * sp + vy * cp; return { x: hx + px * ct + py * sn, y: hy - px * sn + py * ct }; };
        return { q, hx, hy, Lp, so, Wp, Hp, xo, ct, sn, P, end: { x: hx + Lp * ct, y: hy - Lp * sn } };
      }
      function toyGeom() { const w = cv.w, h = cv.h; return { S: { x: Math.round(w / 2), y: Math.round(h * 0.56) }, pxm: Math.min(h * 0.36 / 0.18, w * 0.4 / 0.15) }; }

      // ---------- pointer ----------
      function onDown(ev) {
        const p = cv.pointer(ev);
        if (st.mode === 'find') {
          const q = findGeom().toLocal(p);
          if (inside(shape(), q)) { st.pin = q; st.om = 0; st.wait = 0; if (!L.running && !st.paused && !ctx.reducedMotion) { L.start(); updatePlay(); } refresh(); }
          return;
        }
        if (st.mode === 'topple') { const g = topGeom(); if (Math.hypot(p.x - g.end.x, p.y - g.end.y) < 34) drag = { kind: 'tilt' }; }
        else { const g = toyGeom(), a = Math.atan2(p.x - g.S.x, g.S.y - p.y); if (Math.hypot(p.x - g.S.x, p.y - g.S.y) < 0.2 * g.pxm) { if (st.fell) upright(); drag = { kind: 'toy', off: a - st.tphi }; } }
        if (!drag) return;
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault();
      }
      function onMove(ev) {
        const p = cv.pointer(ev);
        if (!drag) {
          if (st.mode === 'find') cv.canvas.style.cursor = inside(shape(), findGeom().toLocal(p)) ? 'pointer' : 'default';
          else if (st.mode === 'topple') { const g = topGeom(); cv.canvas.style.cursor = Math.hypot(p.x - g.end.x, p.y - g.end.y) < 34 ? 'grab' : 'default'; }
          else { const g = toyGeom(); cv.canvas.style.cursor = Math.hypot(p.x - g.S.x, p.y - g.S.y) < 0.2 * g.pxm ? 'grab' : 'default'; }
          return;
        }
        if (drag.kind === 'tilt') {
          const g = topGeom();
          st.tilt = Math.round(K.clamp(Math.atan2(g.hy - p.y, Math.max(1, p.x - g.hx)) / DEG, 0, 60) * 2) / 2; slTilt.set(st.tilt);
        } else { const g = toyGeom(); st.tphi = K.clamp(Math.atan2(p.x - g.S.x, g.S.y - p.y) - drag.off, -1.3, 1.3); st.tom = 0; }
        refresh();
      }
      function onUp() { if (drag) { drag = null; cv.canvas.style.cursor = 'default'; } }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing helpers ----------
      function label(c, str, x, y, o) {      // text kept inside the canvas, on a soft background
        o = o || {};
        const font = (o.bold ? 'bold ' : '') + (o.size || 12) + 'px ' + theme.font;
        c.font = font;
        const tw = c.measureText(str).width;
        let tx = o.align === 'right' ? x - tw : o.align === 'center' ? x - tw / 2 : x;
        tx = K.clamp(tx, o.dot ? 24 : 4, Math.max(4, cv.w - tw - 4));
        c.fillStyle = K.withAlpha(theme.surface, 0.82); K.roundRect(c, tx - (o.dot ? 20 : 4), y - 9, tw + (o.dot ? 24 : 8), 18, 5); c.fill();
        if (o.dot) { c.fillStyle = o.dot; c.beginPath(); c.arc(tx - 11, y, 5, 0, TAU); c.fill(); }
        K.text(c, str, tx, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function head(c, lines, maxW) {
        let y = 18;
        lines.forEach((s, i) => {
          let px = i ? 12 : 14, font;
          do { font = (i ? '' : 'bold ') + px + 'px ' + (i ? theme.font : theme.fontDisplay); c.font = font; px--; } while (c.measureText(s).width > maxW && px >= 9);
          K.text(c, s, 10, y, { font, color: theme.fg, baseline: 'middle' }); y += i ? 17 : 19;
        });
      }
      function comMark(c, x, y, r) {          // the usual "centre of mass" symbol
        c.fillStyle = theme.surface; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
        c.fillStyle = theme.fg; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, 0, Math.PI / 2); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, Math.PI, Math.PI * 1.5); c.closePath(); c.fill();
        c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
      }

      // ---------- (a) find the centre of mass ----------
      function drawFind(c, w, h) {
        const g = findGeom(), sh = shape(), S = g.S, cols = [theme.c1, theme.c2, theme.c3, theme.c7];
        // wall board with the pin
        c.fillStyle = theme.muted; c.fillRect(S.x - 60, S.y - 22, 120, 8);
        c.fillStyle = CARD; c.strokeStyle = CARD_EDGE; c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath();
        sh.pts.forEach((q, i) => { const p = g.toScreen(q); if (i) c.lineTo(p.x, p.y); else c.moveTo(p.x, p.y); });
        c.closePath(); c.fill(); c.stroke();
        // recorded plumb lines (they are drawn on the cardboard, so they turn with it)
        st.lines.forEach((ln, i) => {
          const a = g.toScreen([ln.p[0] - 0.03 * ln.u[0], ln.p[1] - 0.03 * ln.u[1]]), b = g.toScreen([ln.p[0] + 0.62 * ln.u[0], ln.p[1] + 0.62 * ln.u[1]]), hp = g.toScreen(ln.p);
          c.strokeStyle = cols[i % 4]; c.lineWidth = 2; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
          c.fillStyle = theme.surface; c.beginPath(); c.arc(hp.x, hp.y, 3.5, 0, TAU); c.fill(); c.stroke();
        });
        const x = cross();
        if (x) { const p = g.toScreen(x); c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.arc(p.x, p.y, 9, 0, TAU); c.stroke(); label(c, T({ en: 'the lines cross here', hr: 'ovdje se crte sijeku' }), p.x + 14, p.y + 16, { size: 11 }); }
        if (st.reveal) { const p = g.toScreen(sh.c); comMark(c, p.x, p.y, 7); label(c, T({ en: 'centre of mass', hr: 'težište' }), p.x + 12, p.y - 14, { size: 11, bold: true }); }
        // plumb line (string with a small weight) hanging from the pin
        const yb = Math.min(h - 26, S.y + 0.5 * g.pxm);
        c.strokeStyle = theme.fg; c.lineWidth = 1.2; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(S.x, S.y); c.lineTo(S.x, yb); c.stroke(); c.setLineDash([]);
        c.fillStyle = theme.fg; c.beginPath(); c.moveTo(S.x - 6, yb); c.lineTo(S.x + 6, yb); c.lineTo(S.x, yb + 13); c.closePath(); c.fill();
        c.fillStyle = theme.c8; c.beginPath(); c.arc(S.x, S.y, 5, 0, TAU); c.fill(); c.strokeStyle = theme.surface; c.lineWidth = 1.5; c.stroke();
        label(c, T({ en: 'pin', hr: 'pribadača' }), S.x + 12, S.y - 12, { size: 10 });
        label(c, T({ en: 'plumb line', hr: 'visak' }), S.x + 12, yb + 4, { size: 10 });
        head(c, [T({ en: 'Find the centre of mass', hr: 'Pronađi težište' }), T({ en: 'Click the cardboard to hang it from that point', hr: 'Klikni karton da ga objesiš u toj točki' })], w - 20);
      }

      // ---------- (b) will it topple? ----------
      function drawObj(c, id, W, H) {         // base centred at (0, 0), body up to y = −H
        if (id === 'bottle') {
          c.fillStyle = K.withAlpha(theme.c3, 0.55); c.strokeStyle = theme.c3; c.lineWidth = 2;
          K.roundRect(c, -W / 2, -H * 0.64, W, H * 0.64, Math.min(6, W / 4)); c.fill(); c.stroke();
          c.beginPath(); c.rect(-W / 6, -H, W / 3, H * 0.36); c.fill(); c.stroke();
        } else if (id === 'bus') {
          c.fillStyle = theme.fg; c.fillRect(-W / 2 + 2, -H * 0.1, W * 0.16, H * 0.1); c.fillRect(W / 2 - 2 - W * 0.16, -H * 0.1, W * 0.16, H * 0.1);
          c.fillStyle = theme.c1; K.roundRect(c, -W / 2, -H, W, H * 0.93, 7); c.fill();
          c.fillStyle = K.withAlpha(theme.surface, 0.8); c.fillRect(-W / 2 + 5, -H * 0.9, W - 10, H * 0.26);
        } else if (id === 'racer') {
          c.fillStyle = theme.fg; c.fillRect(-W / 2, -H * 0.7, W * 0.2, H * 0.7); c.fillRect(W / 2 - W * 0.2, -H * 0.7, W * 0.2, H * 0.7); c.fillRect(-W * 0.36, -H, W * 0.72, H * 0.1);
          c.fillStyle = theme.c8; K.roundRect(c, -W * 0.3, -H * 0.72, W * 0.6, H * 0.6, 5); c.fill();
          c.fillRect(-W * 0.04, -H * 0.92, W * 0.08, H * 0.24);
        } else {
          c.fillStyle = CARD; c.fillRect(-W / 2, -H, W, H); c.strokeStyle = CARD_EDGE; c.lineWidth = 2; c.strokeRect(-W / 2 + 1, -H + 1, W - 2, H - 2);
        }
      }
      function drawTopple(c, w, h) {
        const g = topGeom(), q = g.q, s = toppleState(), P = g.P;
        c.fillStyle = theme.ground; c.fillRect(0, g.hy + 8, w, h - g.hy - 8);
        // strut, platform and hinge
        c.strokeStyle = theme.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(g.end.x - 6, g.end.y + 4); c.lineTo(g.end.x - 6, g.hy + 8); c.stroke();
        c.save(); c.translate(g.hx, g.hy); c.rotate(-q.tilt);
        c.fillStyle = theme.muted; c.fillRect(0, 0, g.Lp, 8);
        c.fillStyle = theme.fg; c.beginPath(); c.moveTo(g.xo - g.Wp / 2 - 11, 0); c.lineTo(g.xo - g.Wp / 2, 0); c.lineTo(g.xo - g.Wp / 2, -8); c.closePath(); c.fill();   // stop: no sliding
        if (st.psi < 0.001) { c.strokeStyle = theme[s.key]; c.lineWidth = 4; c.beginPath(); c.moveTo(g.xo - g.Wp / 2, 2); c.lineTo(g.xo + g.Wp / 2, 2); c.stroke(); }  // support base
        c.translate(g.xo - g.Wp / 2, 0); c.rotate(-st.psi); c.translate(g.Wp / 2, 0);
        drawObj(c, st.obj, g.Wp, g.Hp);
        const yl = K.clamp(st.load / 100 * g.Hp, 5, g.Hp - 5);
        c.fillStyle = theme.c2; K.roundRect(c, -g.Wp * 0.22, -yl - 5, g.Wp * 0.44, 10, 3); c.fill(); c.strokeStyle = theme.surface; c.lineWidth = 1; c.stroke();
        c.restore();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(g.hx, g.hy + 2, 6, 0, TAU); c.fill();
        c.fillStyle = theme.c1; c.beginPath(); c.arc(g.end.x, g.end.y, 7, 0, TAU); c.fill();
        if (q.tilt > 0.03) { c.strokeStyle = theme.fg; c.lineWidth = 1; c.beginPath(); c.arc(g.hx, g.hy, 38, -q.tilt, 0); c.stroke(); }
        label(c, N(st.tilt, 1) + '°', g.hx + 46, g.hy - 8 - 20 * Math.min(1, q.tilt), { size: 11, bold: true });
        // weight from the centre of mass and the vertical line down to the platform
        const cm = P(0, q.yc * g.so), t = (cm.x - g.hx) / g.ct, foot = { x: cm.x, y: g.hy - t * g.sn };
        const tl = g.xo - g.Wp / 2, inBase = st.psi < 0.001 && t >= tl && t <= g.xo + g.Wp / 2;
        c.setLineDash([4, 4]); c.strokeStyle = theme.fg; c.lineWidth = 1.2; c.beginPath(); c.moveTo(cm.x, cm.y); c.lineTo(cm.x, Math.max(foot.y, cm.y)); c.stroke(); c.setLineDash([]);
        K.arrow(c, cm.x, cm.y, cm.x, cm.y + 44, { color: theme.c8, width: 3, head: 9 });
        if (foot.y > cm.y) { c.fillStyle = theme[inBase ? 'good' : 'bad']; c.beginPath(); c.arc(foot.x, foot.y, 5, 0, TAU); c.fill(); c.strokeStyle = theme.surface; c.lineWidth = 1.5; c.stroke(); }
        comMark(c, cm.x, cm.y, 7);
        label(c, 'G', cm.x + 10, cm.y + 34, { size: 11, bold: true });
        label(c, T({ en: 'centre of mass', hr: 'težište' }), cm.x + 12, cm.y - 12, { size: 10 });
        label(c, T(s.txt), w - 12, 62, { align: 'right', dot: theme[s.key], bold: true });
        label(c, T({ en: 'orange block = movable load · drag the blue dot to tilt', hr: 'narančasti blok = pomični teret · povuci plavu točku za nagib' }), 8, h - 12, { size: 10 });
        head(c, [T({ en: 'Will it topple?', hr: 'Hoće li se prevrnuti?' }),
          'tan α = ' + N(st.W / 2, 2) + ' m / ' + N(q.yc, 2) + ' m  →  α = ' + N(q.crit / DEG, 1) + '°   ' + T({ en: 'tilt now', hr: 'nagib sada' }) + ': ' + N(st.tilt, 1) + '°'], w - 20);
      }

      // ---------- (c) balancing toy ----------
      function drawTricks(c, w, h) {
        const g = toyGeom(), q = toy(), S = g.S, pxm = g.pxm, s = toyState();
        // table and finger
        c.fillStyle = theme.ground; c.fillRect(0, h - 16, w, 16);
        c.fillStyle = SKIN; K.roundRect(c, S.x - 12, S.y, 24, h - S.y + 20, 12); c.fill(); c.strokeStyle = CARD_EDGE; c.lineWidth = 1; c.stroke();
        c.setLineDash([5, 4]); c.strokeStyle = K.withAlpha(theme.fg, 0.6); c.lineWidth = 1; c.beginPath(); c.moveTo(S.x - w * 0.42, S.y); c.lineTo(S.x + w * 0.42, S.y); c.stroke(); c.setLineDash([]);
        K.text(c, T({ en: 'level of the support', hr: 'razina oslonca' }), Math.max(8, S.x - w * 0.42), S.y - 8, { font: '10px ' + theme.font, color: theme.muted });
        // toy: body, arms and two weights, turned about the fingertip
        const ox = S.x + (st.fell ? 26 * Math.sign(st.tphi || 1) : 0), oy = S.y + Math.min(st.fy * pxm, h - 22 - S.y);
        const cs = Math.cos(st.tphi), sn = Math.sin(st.tphi), P = (x, y) => ({ x: ox + (x * cs + y * sn) * pxm, y: oy + (x * sn - y * cs) * pxm });   // toy point (x right, y up)
        const top2 = P(0, TOY.b), sh = P(0, TOY.ha), rw = 4 + 10 * Math.cbrt(q.m / 0.1);
        c.strokeStyle = theme.fg; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
        [-1, 1].forEach(sg => { const e = P(sg * q.wx, q.wy); c.moveTo(sh.x, sh.y); c.lineTo(e.x, e.y); });
        c.stroke();
        c.strokeStyle = theme.c1; c.lineWidth = 7; c.beginPath(); c.moveTo(ox, oy); c.lineTo(top2.x, top2.y); c.stroke(); c.lineCap = 'butt';
        const hd = P(0, TOY.b + 0.014); c.fillStyle = theme.c1; c.beginPath(); c.arc(hd.x, hd.y, 9, 0, TAU); c.fill();
        [-1, 1].forEach(sg => { const e = P(sg * q.wx, q.wy); c.fillStyle = theme.c2; c.beginPath(); c.arc(e.x, e.y, rw, 0, TAU); c.fill(); c.strokeStyle = theme.surface; c.lineWidth = 1.5; c.stroke(); });
        const er = P(q.wx, q.wy), cm = P(0, q.yc);
        label(c, N(st.wm, 0) + ' g', er.x + rw + 6, er.y, { size: 10 });
        K.arrow(c, cm.x, cm.y, cm.x, cm.y + 34, { color: theme.c8, width: 3, head: 8 });
        comMark(c, cm.x, cm.y, 7);
        label(c, T({ en: 'centre of mass', hr: 'težište' }), cm.x + 12, cm.y + 26, { size: 10 });
        c.fillStyle = theme.fg; c.beginPath(); c.arc(ox, oy, 3.5, 0, TAU); c.fill();
        const cmTxt = Math.abs(q.yc) < 0.0005 ? T({ en: 'at the level of the support', hr: 'u razini oslonca' })
          : N(Math.abs(q.yc) * 100, 1) + ' cm ' + T(q.yc < 0 ? { en: 'BELOW the support', hr: 'ISPOD oslonca' } : { en: 'ABOVE the support', hr: 'IZNAD oslonca' });
        head(c, [T({ en: 'Balancing toy on a fingertip', hr: 'Igračka na vrhu prsta' }), T({ en: 'Centre of mass: ', hr: 'Težište: ' }) + cmTxt], w - 20);
        label(c, T({ en: 'Equilibrium: ', hr: 'Ravnoteža: ' }) + T(s.txt), w - 12, 62, { align: 'right', dot: theme[s.key], bold: true });
        K.text(c, T({ en: 'Press Push, or drag the toy sideways and let go', hr: 'Pritisni Gurni ili povuci igračku u stranu pa pusti' }), 8, h - 22, { font: '10px ' + theme.font, color: theme.fg });
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        if (st.mode === 'find') drawFind(c, w, h); else if (st.mode === 'topple') drawTopple(c, w, h); else drawTricks(c, w, h);
      }

      // ---------- lifecycle ----------
      function reset() {
        Object.assign(st, defaults()); drag = null;
        segMode.set('find'); selShape.set('L'); tgReveal.set(false); selObj.set('box'); slTilt.set(0); slW.set(1); slHh.set(1); slLoad.set(50); slArm.set(-40); slWm.set(50);
        if (ctx.reducedMotion) L.stop(); else L.start();
        showControls(); updatePlay(); refresh();
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
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
