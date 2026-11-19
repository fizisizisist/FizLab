/* FizLab sim: Collisions — two carts on a frictionless track (momentum and kinetic energy before and after,
   bounciness from "stick together" to perfectly elastic, optional end walls) and Newton's cradle. */
(function () {
  'use strict';
  const K = window.SimKit;
  const TAU = Math.PI * 2;
  const G = 9.81;
  const TRACK = 14, CW = 1;                 // length of the track and of a cart (m)
  const XA0 = 4, XB0 = 9;                   // where the two cart centres start (m)
  const NB = 5, CL = 0.30, CD = 0.05, CM = 0.1; // cradle: number of balls, string length (m), ball diameter (m), ball mass (kg)
  const PULL = 0.6;                         // how far the balls are pulled back (rad, about 34°)
  const STEEL = '#aab2bd', STEEL_HI = '#f2f4f7', STEEL_LO = '#69727e';   // fixed physical colour: polished steel
  const MODES = [
    { value: 'carts', label: { en: 'Two carts', hr: 'Dvoja kolica' } },
    { value: 'cradle', label: { en: 'Newton\'s cradle', hr: 'Newtonovo njihalo' } }
  ];
  const PRESETS = [
    { value: 'custom', label: { en: 'My own settings', hr: 'Vlastite postavke' } },
    { value: 'swap', m1: 1, m2: 1, v1: 3, v2: 0, e: 1, label: { en: 'Equal masses, elastic', hr: 'Jednake mase, elastičan sudar' } },
    { value: 'heavy', m1: 5, m2: 1, v1: 2, v2: 0, e: 1, label: { en: 'Heavy hits light at rest', hr: 'Teška kolica udaraju u lagana' } },
    { value: 'light', m1: 1, m2: 5, v1: 3, v2: 0, e: 1, label: { en: 'Light hits heavy at rest', hr: 'Lagana kolica udaraju u teška' } },
    { value: 'stick', m1: 2, m2: 3, v1: 3, v2: -2, e: 0, label: { en: 'Head-on, they stick together', hr: 'Čeoni sudar, kolica se slijepe' } },
    { value: 'rear', m1: 1, m2: 2, v1: 4, v2: 1, e: 0.5, label: { en: 'Rear-end collision', hr: 'Nalet straga' } }
  ];
  // signed number with a real minus sign: +3.0 / −2.0 / 0.0
  function sg(v, d, l) { const z = Math.abs(v) < 0.5 * Math.pow(10, -d); return (z ? '' : v > 0 ? '+' : '−') + K.fmt(z ? 0 : Math.abs(v), d, l); }

  window.Sims.register({
    id: 'collisions',
    title: { en: 'Collisions', hr: 'Sudari' },
    summary: {
      en: 'Crash two carts with any masses, speeds and bounciness and compare momentum and kinetic energy before and after. Then pull back the balls of Newton\'s cradle.',
      hr: 'Sudari dvoja kolica bilo kojih masa, brzina i elastičnosti te usporedi količinu gibanja i kinetičku energiju prije i poslije. Zatim podigni kuglice Newtonova njihala.'
    },
    tasks: [
      { en: 'Choose "Equal masses, elastic" and press Play. What happens to the two velocities? Compare the momentum bars before and after.', hr: 'Odaberi „Jednake mase, elastičan sudar” i pokreni. Što se dogodi s brzinama? Usporedi stupce količine gibanja prije i poslije.' },
      { en: 'Set the bounciness to 0 so the carts stick together. Does the total momentum change? Where did the kinetic energy go?', hr: 'Namjesti elastičnost na 0 da se kolica slijepe. Mijenja li se ukupna količina gibanja? Kamo je otišla kinetička energija?' },
      { en: 'Make two carts with different masses that both stop dead when they collide. What must be true of their momenta?', hr: 'Namjesti dvoja kolica različitih masa tako da se u sudaru oboja zaustave. Što mora vrijediti za njihove količine gibanja?' },
      { en: 'Newton\'s cradle: pull back two balls. How many swing out on the other side? Why not one ball going twice as fast?', hr: 'Newtonovo njihalo: podigni dvije kuglice. Koliko ih odskoči na drugoj strani? Zašto ne jedna dvostruko većom brzinom?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 11, minHeight: 430, maxHeight: 540 });
      const C = K.controls(container, lang);

      const st = { mode: 'carts', slow: false,
        m1: 1, m2: 1, v1: 3, v2: 0, e: 1, walls: false, a: { x: XA0, v: 3 }, b: { x: XB0, v: 0 }, t: 0, tEv: 0, rec: null, stuck: false, flash: 0, ended: false, drag: null,   // carts
        n: 1, damp: false, th: [0, 0, 0, 0, 0], om: [0, 0, 0, 0, 0], released: false, cdrag: -1 };   // cradle

      // ---------- controls ----------
      const fieldOf = c => { let e = c.el; while (e && e !== C.el) { if (e.classList && (e.classList.contains('sk-field') || e.classList.contains('sk-note'))) return e; e = e.parentNode; } return c.el; };
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };

      C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: MODES, value: 'carts', onChange: v => setMode(v) });
      const selPreset = C.select({ label: { en: 'Ready-made collisions', hr: 'Gotovi primjeri sudara' }, options: PRESETS.map(p => ({ value: p.value, label: p.label })), value: 'swap',
        onChange: v => { const p = PRESETS.filter(q => q.value === v)[0]; if (p && p.m1) applyPreset(p); } });
      const slM1 = C.slider({ label: { en: 'Mass of cart 1 (m₁)', hr: 'Masa kolica 1 (m₁)' }, min: 0.5, max: 5, step: 0.5, value: 1, unit: 'kg', digits: 1, onChange: v => { st.m1 = v; custom(); } });
      const slM2 = C.slider({ label: { en: 'Mass of cart 2 (m₂)', hr: 'Masa kolica 2 (m₂)' }, min: 0.5, max: 5, step: 0.5, value: 1, unit: 'kg', digits: 1, onChange: v => { st.m2 = v; custom(); } });
      const slV1 = C.slider({ label: { en: 'Velocity of cart 1 (v₁)', hr: 'Brzina kolica 1 (v₁)' }, min: -5, max: 5, step: 0.5, value: 3, digits: 1, format: (v, l) => sg(v, 1, l) + ' m/s', onChange: v => { st.v1 = v; custom(); } });
      const slV2 = C.slider({ label: { en: 'Velocity of cart 2 (v₂)', hr: 'Brzina kolica 2 (v₂)' }, min: -5, max: 5, step: 0.5, value: 0, digits: 1, format: (v, l) => sg(v, 1, l) + ' m/s', onChange: v => { st.v2 = v; custom(); } });
      const slE = C.slider({ label: { en: 'Bounciness (0 = stick, 1 = elastic)', hr: 'Elastičnost (0 = slijepe se, 1 = elastičan)' }, min: 0, max: 1, step: 0.05, value: 1, digits: 2, onChange: v => { st.e = v; custom(); } });
      const tgWalls = C.toggle({ label: { en: 'Walls at the ends', hr: 'Zidovi na krajevima' }, value: false, onChange: v => { st.walls = v; L.stop(); resetCarts(); updatePlay(); refresh(); } });
      const segN = C.segmented({ label: { en: 'Balls to pull back', hr: 'Koliko kuglica podići' }, options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }], value: '1',
        onChange: v => { st.n = parseInt(v, 10); L.stop(); resetCradle(); updatePlay(); refresh(); } });
      const tgDamp = C.toggle({ label: { en: 'Small damping (air, strings)', hr: 'Malo prigušenje (zrak, niti)' }, value: false, onChange: v => { st.damp = v; refresh(); } });
      const tgSlow = C.toggle({ label: { en: 'Slow motion', hr: 'Usporeno' }, value: false, onChange: v => { st.slow = v; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => {
        if (st.mode === 'carts') { if (st.ended) resetCarts(); }
        else if (!st.released) st.released = true;
        L.toggle(); updatePlay(); refresh();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const roK = [
        C.readout({ label: { en: 'Cart 1 after: v₁′', hr: 'Kolica 1 poslije: v₁′' }, unit: 'm/s' }),
        C.readout({ label: { en: 'Cart 2 after: v₂′', hr: 'Kolica 2 poslije: v₂′' }, unit: 'm/s' }),
        C.readout({ label: { en: 'Total momentum now', hr: 'Ukupna količina gibanja sada' }, unit: 'kg·m/s' }),
        C.readout({ label: { en: 'Kinetic energy before', hr: 'Kinetička energija prije' }, unit: 'J', digits: 2 }),
        C.readout({ label: { en: 'Kinetic energy after', hr: 'Kinetička energija poslije' }, unit: 'J', digits: 2 }),
        C.readout({ label: { en: 'Kinetic energy lost', hr: 'Izgubljena kinetička energija' }, unit: '%', digits: 0 })
      ];
      const roN = [
        C.readout({ label: { en: 'Balls up on the left', hr: 'Kuglica podignuto lijevo' }, digits: 0 }),
        C.readout({ label: { en: 'Balls up on the right', hr: 'Kuglica podignuto desno' }, digits: 0 }),
        C.readout({ label: { en: 'Fastest ball', hr: 'Najbrža kuglica' }, unit: 'm/s', digits: 2 }),
        C.readout({ label: { en: 'Total energy E_k + E_p', hr: 'Ukupna energija E_k + E_p' }, unit: 'J', digits: 3 })
      ];
      const note = C.note({ text: { en: '', hr: '' } });
      let noteKey = '';
      function setNote(key, make) { if (key === noteKey) return; noteKey = key; note.set(make()); }

      function applyMode() {
        const m = st.mode;
        [selPreset, slM1, slM2, slV1, slV2, slE, tgWalls].concat(roK).forEach(c => show(c, m === 'carts'));
        [segN, tgDamp].concat(roN).forEach(c => show(c, m === 'cradle'));
      }
      function setMode(v) { L.stop(); st.mode = v; st.drag = null; st.cdrag = -1; applyMode(); updatePlay(); refresh(); }
      function refresh() { updateOut(); draw(); }
      function updatePlay() {
        btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : st.mode === 'cradle' && !st.released ? { en: 'Let go!', hr: 'Pusti!' } : { en: 'Play', hr: 'Pokreni' });
      }

      // ---------- physics: two carts (exact, event by event) ----------
      function resetCarts() {
        st.a.x = XA0; st.b.x = XB0; st.a.v = st.v1; st.b.v = st.v2;
        st.t = 0; st.tEv = 0; st.rec = null; st.stuck = false; st.flash = 0; st.ended = false;
      }
      function custom() { selPreset.set('custom'); L.stop(); resetCarts(); updatePlay(); refresh(); }
      function applyPreset(p) {
        st.m1 = p.m1; st.m2 = p.m2; st.v1 = p.v1; st.v2 = p.v2; st.e = p.e;
        slM1.set(p.m1); slM2.set(p.m2); slV1.set(p.v1); slV2.set(p.v2); slE.set(p.e);
        L.stop(); resetCarts(); updatePlay(); refresh();
      }
      function collide() { // 1-D collision: momentum is conserved, the relative speed is multiplied by the bounciness e
        const A = st.a, B = st.b, u1 = A.v, u2 = B.v, M = st.m1 + st.m2, p = st.m1 * u1 + st.m2 * u2;
        A.v = (p - st.m2 * st.e * (u1 - u2)) / M; B.v = (p + st.m1 * st.e * (u1 - u2)) / M;
        if (st.e === 0 || Math.abs(A.v - B.v) < 1e-9) { A.v = B.v = p / M; st.stuck = true; }
        B.x = A.x + CW;
        st.rec = { u1, u2, w1: A.v, w2: B.v }; st.tEv = st.t; st.flash = 0.4;
      }
      function stepCarts(dt) {
        const A = st.a, B = st.b;
        let rem = dt * (st.slow ? 0.25 : 1), guard = 0;
        st.flash = Math.max(0, st.flash - dt);
        while (rem > 1e-9 && guard++ < 40) {
          let tc = Infinity, ev = '';                                    // time to the next event
          if (A.v - B.v > 1e-9) { tc = Math.max(0, B.x - A.x - CW) / (A.v - B.v); ev = 'hit'; }
          if (st.walls) {
            if (A.v < -1e-9) { const t = Math.max(0, A.x - CW / 2) / -A.v; if (t < tc) { tc = t; ev = 'wa'; } }
            if (B.v > 1e-9) { const t = Math.max(0, TRACK - CW / 2 - B.x) / B.v; if (t < tc) { tc = t; ev = 'wb'; } }
          }
          const use = Math.min(rem, tc);
          A.x += A.v * use; B.x += B.v * use; st.t += use; rem -= use;
          if (tc > use) break;
          if (ev === 'hit') collide();
          else { if (st.stuck || ev === 'wa') A.v = -A.v; if (st.stuck || ev === 'wb') B.v = -B.v; st.tEv = st.t; }   // a wall sends the cart straight back
        }
        const willHit = A.v - B.v > 1e-9, gone = c => c.x < -CW || c.x > TRACK + CW || Math.abs(c.v) < 1e-9;
        if (st.t > 120 || (!st.walls && !willHit && ((gone(A) && gone(B) && st.t - st.tEv > 1.2) || st.t - st.tEv > 6))) { st.ended = true; L.stop(); updatePlay(); }
      }
      function nums() { // momenta and kinetic energies before and after the latest collision
        const r = st.rec, m1 = st.m1, m2 = st.m2, u1 = r ? r.u1 : st.a.v, u2 = r ? r.u2 : st.b.v;
        const o = { after: !!r, u1, u2, pb: [m1 * u1, m2 * u2], kb: [0.5 * m1 * u1 * u1, 0.5 * m2 * u2 * u2] };
        o.kbT = o.kb[0] + o.kb[1];
        if (r) {
          o.pa = [m1 * r.w1, m2 * r.w2]; o.ka = [0.5 * m1 * r.w1 * r.w1, 0.5 * m2 * r.w2 * r.w2];
          o.kaT = o.ka[0] + o.ka[1]; o.lost = Math.max(0, o.kbT - o.kaT); o.pct = o.kbT > 1e-12 ? o.lost / o.kbT * 100 : 0;
        }
        return o;
      }

      // ---------- physics: Newton's cradle (five pendulums + elastic collisions between neighbours) ----------
      function resetCradle() { for (let i = 0; i < NB; i++) { st.th[i] = i < st.n ? -PULL : 0; st.om[i] = 0; } st.released = false; }
      function stepCradle(dt) {
        if (!st.released) { L.stop(); updatePlay(); return; }
        const n = 24, h = dt * (st.slow ? 0.25 : 1) / n, w2 = G / CL, th = st.th, om = st.om;
        for (let s = 0; s < n; s++) {
          for (let i = 0; i < NB; i++) {                                 // each ball is a pendulum (velocity Verlet)
            om[i] -= 0.5 * h * w2 * Math.sin(th[i]); th[i] += h * om[i]; om[i] -= 0.5 * h * w2 * Math.sin(th[i]);
            if (st.damp) om[i] *= 1 - 0.12 * h;
          }
          for (let it = 0, changed = true; changed && it < 12; it++) {   // neighbours that touch and approach swap velocities (equal masses, elastic)
            changed = false;
            for (let i = 0; i < NB - 1; i++) {
              if (th[i] >= th[i + 1] - 1e-9 && om[i] > om[i + 1] + 1e-9) {
                const a = om[i], b = om[i + 1];
                if (Math.abs(a) >= Math.abs(b)) th[i] = th[i + 1]; else th[i + 1] = th[i];   // put the faster ball back at the contact point
                om[i] = b; om[i + 1] = a; changed = true;
              }
            }
          }
        }
      }
      function cradleNums() {
        let left = 0, right = 0, vmax = 0, E = 0;
        for (let i = 0; i < NB; i++) {
          const v = st.om[i] * CL;
          if (st.th[i] < -0.04) left++; else if (st.th[i] > 0.04) right++;
          vmax = Math.max(vmax, Math.abs(v)); E += 0.5 * CM * v * v + CM * G * CL * (1 - Math.cos(st.th[i]));
        }
        return { left, right, vmax, E };
      }

      function updateOut() {
        if (st.mode === 'carts') {
          const N = nums(), pNow = st.m1 * st.a.v + st.m2 * st.b.v, r = st.rec;
          roK[0].set(r ? { en: sg(r.w1, 2, 'en'), hr: sg(r.w1, 2, 'hr') } : null);
          roK[1].set(r ? { en: sg(r.w2, 2, 'en'), hr: sg(r.w2, 2, 'hr') } : null);
          roK[2].set({ en: sg(pNow, 2, 'en'), hr: sg(pNow, 2, 'hr') });
          roK[3].set(N.kbT); roK[4].set(r ? N.kaT : null); roK[5].set(r ? N.pct : null);
          setNote('carts' + (st.walls ? 'w' : ''), () => ({
            en: 'Momentum (p = m·v, with a sign for the direction) is conserved in every collision: the "total" bar stays the same. Kinetic energy is conserved only in a perfectly elastic collision; otherwise part of it becomes heat, sound and dents.' +
              (st.walls ? ' A wall pushes on a cart, so a bounce off a wall does change the carts\' total momentum (the wall and the Earth take the difference).' : ' Drag a cart sideways to set its velocity.'),
            hr: 'Količina gibanja (p = m·v, s predznakom za smjer) očuvana je u svakom sudaru: stupac „ukupno” ostaje isti. Kinetička energija očuvana je samo u savršeno elastičnom sudaru; inače dio prelazi u toplinu, zvuk i deformaciju.' +
              (st.walls ? ' Zid djeluje silom na kolica pa odbijanje od zida mijenja ukupnu količinu gibanja kolica (razliku preuzmu zid i Zemlja).' : ' Povuci kolica u stranu da im namjestiš brzinu.') }));
        } else {
          const q = cradleNums(), n = st.n;
          roN[0].set(q.left); roN[1].set(q.right); roN[2].set(q.vmax); roN[3].set(q.E);
          setNote('cradle' + n, () => n === 1 ? {
            en: 'One ball in, one ball out, at the same speed: only then are BOTH momentum (m·v) and kinetic energy (½·m·v²) the same before and after. Two balls leaving at half the speed would have the same momentum but only half the energy.',
            hr: 'Jedna kuglica udari, jedna odskoči, jednakom brzinom: samo tada su I količina gibanja (m·v) I kinetička energija (½·m·v²) jednake prije i poslije. Dvije kuglice s upola manjom brzinom imale bi istu količinu gibanja, ali samo pola energije.'
          } : {
            en: n + ' balls in, ' + n + ' balls out, at the same speed: only then are BOTH momentum (m·v) and kinetic energy (½·m·v²) the same before and after. One ball leaving ' + n + ' times as fast would have the same momentum but ' + n + ' times the energy.',
            hr: 'Udare ' + n + ' kuglice, odskoče ' + n + ' kuglice, jednakom brzinom: samo tada su I količina gibanja (m·v) I kinetička energija (½·m·v²) jednake prije i poslije. Jedna kuglica ' + n + ' puta veće brzine imala bi istu količinu gibanja, ali ' + n + ' puta veću energiju.'
          });
        }
      }

      // ---------- geometry ----------
      function viewCarts() {
        const w = cv.w, h = cv.h, pad = 14, pxm = (w - 2 * pad) / TRACK;
        return { w, h, pad, pxm, ty: Math.round(K.clamp(h * 0.4, 156, 230)), vs: K.clamp(pxm * 0.42, 8, 30), wide: w >= 600, X: x => pad + x * pxm };
      }
      function cartBox(V, c, m) { // where a cart and its velocity arrow are on the canvas
        const x = V.X(c.x), cw = CW * V.pxm, ch = 16 + 5 * m, top = V.ty - 8 - ch;
        return { x, cw, ch, top, ay: top - 12, tip: x + c.v * V.vs };
      }
      function viewCradle() {
        const w = cv.w, h = cv.h, top = 74;
        const ppm = Math.min((h - top - 74) / (CL + CD / 2), w * 0.9 / (NB * CD + 2 * CL * Math.sin(1.1) + CD));
        const py = top + Math.max(0, (h - top - 74 - (CL + CD / 2) * ppm) / 2);   // centred when the canvas is taller than needed
        return { w, h, py, ppm, r: CD / 2 * ppm, px: i => w / 2 + (i - (NB - 1) / 2) * CD * ppm };
      }
      const ballPos = (V, i) => ({ x: V.px(i) + Math.sin(st.th[i]) * CL * V.ppm, y: V.py + Math.cos(st.th[i]) * CL * V.ppm });

      // ---------- pointer: drag a cart sideways to set its velocity, or pull the cradle balls back ----------
      function setDragV(p) {
        const d = st.drag, v = K.clamp(Math.round((d.v0 + (p.x - d.x0) / d.vs) * 2) / 2, -5, 5);
        if (d.i === 1) { st.v1 = v; slV1.set(v); } else { st.v2 = v; slV2.set(v); }
        selPreset.set('custom'); resetCarts(); refresh();
      }
      function pull(p) {
        const V = viewCradle(), i = st.cdrag, a = K.clamp(Math.atan2(p.x - V.px(i), p.y - V.py), -1.1, 0);
        for (let j = 0; j < NB; j++) { st.th[j] = j <= i ? a : 0; st.om[j] = 0; }
        refresh();
      }
      function onDown(ev) {
        const p = cv.pointer(ev);
        if (st.mode === 'carts') {
          if (st.t > 0) return;                                          // only before the run starts
          const V = viewCarts(), boxes = [cartBox(V, st.a, st.m1), cartBox(V, st.b, st.m2)];
          let hit = 0;
          boxes.forEach((b, i) => { if (!hit && Math.abs(p.x - b.tip) <= 16 && Math.abs(p.y - b.ay) <= 16) hit = i + 1; });
          boxes.forEach((b, i) => { if (!hit && Math.abs(p.x - b.x) <= b.cw / 2 + 6 && p.y >= b.top - 6 && p.y <= V.ty + 8) hit = i + 1; });
          if (!hit) return;
          st.drag = { i: hit, x0: p.x, v0: hit === 1 ? st.v1 : st.v2, vs: V.vs };
        } else {
          const V = viewCradle();
          let best = -1, bd = V.r + 10;
          for (let i = 0; i < 3; i++) { const b = ballPos(V, i), d = Math.hypot(p.x - b.x, p.y - b.y); if (d <= bd) { bd = d; best = i; } }
          if (best < 0) return;
          L.stop(); st.n = best + 1; segN.set(String(st.n)); st.released = false; st.cdrag = best; updatePlay(); pull(p);
        }
        ev.preventDefault(); cv.canvas.style.cursor = 'grabbing';
      }
      function onMove(ev) { if (st.drag) setDragV(cv.pointer(ev)); else if (st.cdrag >= 0) pull(cv.pointer(ev)); }
      function onUp() {
        if (!st.drag && st.cdrag < 0) return;
        cv.canvas.style.cursor = '';
        if (st.cdrag >= 0) { st.cdrag = -1; if (st.th[0] < -0.03) { st.released = true; L.start(); } else resetCradle(); updatePlay(); }
        st.drag = null; refresh();
      }
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
      function card(g, x, y, w, h, title) {
        g.fillStyle = K.withAlpha(theme.surface, 0.94); K.roundRect(g, x, y, w, h, 10); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1; g.stroke();
        K.text(g, title, x + 10, y + 13, { font: fit(g, title, w - 20, 12, true), color: theme.fg, baseline: 'middle' });
      }
      function wheel(g, x, y, r) { g.fillStyle = theme.fg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.fillStyle = theme.surface; g.beginPath(); g.arc(x, y, r * 0.45, 0, TAU); g.fill(); }

      // ---------- scene: two carts ----------
      function momentumPanel(g, x, y, w, h, N) {
        card(g, x, y, w, h, K.tr({ en: 'Momentum p = m·v (kg·m/s)', hr: 'Količina gibanja p = m·v (kg·m/s)' }, lang));
        const names = ['p₁', 'p₂', K.tr({ en: 'total', hr: 'ukupno' }, lang)], cols = [theme.c1, theme.c2, theme.c7];
        const before = [N.pb[0], N.pb[1], N.pb[0] + N.pb[1]], after = N.after ? [N.pa[0], N.pa[1], N.pa[0] + N.pa[1]] : null;
        const labW = 96, valW = 52, bx = x + labW, bw = Math.max(20, w - labW - valW), zero = bx + bw / 2;
        const pmax = Math.max.apply(null, before.concat(after || []).map(Math.abs).concat([0.5]));
        const rh = Math.min(24, (h - 34) / 6.6), y0 = y + 26;
        g.strokeStyle = K.withAlpha(theme.fg, 0.5); g.lineWidth = 1; g.beginPath(); g.moveTo(zero, y0 - 2); g.lineTo(zero, y0 + rh * 6.6); g.stroke();
        [before, after].forEach((vals, gi) => {
          const gy = y0 + gi * rh * 3.6;
          label(g, K.tr(gi ? { en: 'after', hr: 'poslije' } : { en: 'before', hr: 'prije' }, lang), x + 10, gy + rh * 1.5);
          for (let i = 0; i < 3; i++) {
            const yy = gy + i * rh, v = vals ? vals[i] : null;
            label(g, names[i], bx - 6, yy + rh / 2, { align: 'right', font: fnt(11) });
            g.fillStyle = K.withAlpha(theme.fg, 0.06); g.fillRect(bx, yy + 2, bw, rh - 4);
            if (v !== null) { g.fillStyle = cols[i]; g.fillRect(zero, yy + 2, v / pmax * (bw / 2), rh - 4); }
            label(g, v === null ? '?' : sg(v, 2, lang), x + w - 8, yy + rh / 2, { align: 'right', font: fnt(11, i === 2) });
          }
        });
      }
      function energyPanel(g, x, y, w, h, N) {
        card(g, x, y, w, h, K.tr({ en: 'Kinetic energy E_k = ½·m·v² (J)', hr: 'Kinetička energija E_k = ½·m·v² (J)' }, lang));
        const labW = 58, valW = 62, bx = x + labW, bw = Math.max(20, w - labW - valW), rh = Math.min(26, (h - 66) / 2.3), y0 = y + 26, sc = bw / Math.max(N.kbT, 1e-9);
        [[N.kb[0], N.kb[1], 0, N.kbT], N.after ? [N.ka[0], N.ka[1], N.lost, N.kaT] : null].forEach((r, gi) => {
          const yy = y0 + gi * rh * 1.3;
          label(g, K.tr(gi ? { en: 'after', hr: 'poslije' } : { en: 'before', hr: 'prije' }, lang), x + 10, yy + rh / 2);
          g.fillStyle = K.withAlpha(theme.fg, 0.06); g.fillRect(bx, yy + 2, bw, rh - 4);
          if (!r) { label(g, '?', x + w - 8, yy + rh / 2, { align: 'right', font: fnt(11) }); return; }
          let xx = bx;
          [theme.c1, theme.c2, theme.c8].forEach((c, i) => { g.fillStyle = c; g.fillRect(xx, yy + 2, r[i] * sc, rh - 4); xx += r[i] * sc; });
          label(g, K.fmt(r[3], 2, lang) + ' J', x + w - 8, yy + rh / 2, { align: 'right', font: fnt(11, true) });
        });
        const items = [[theme.c1, K.tr({ en: 'cart 1', hr: 'kolica 1' }, lang)], [theme.c2, K.tr({ en: 'cart 2', hr: 'kolica 2' }, lang)],
          [theme.c8, K.tr({ en: 'became heat, sound, dents', hr: 'prešlo u toplinu, zvuk, deformaciju' }, lang) + (N.after ? ': ' + K.fmt(N.lost, 2, lang) + ' J (' + K.fmt(N.pct, 0, lang) + ' %)' : '')]];
        g.font = fnt(11);
        const two = items.reduce((sum, it) => sum + 25 + g.measureText(it[1]).width, 0) > w - 16;   // narrow panel: the third item gets its own line
        let lx = x + 10, ly = y0 + rh * 2.3 + 11;
        items.forEach((it, i) => {
          if (two && i === 2) { lx = x + 10; ly += 14; }
          const f = fit(g, it[1], w - 34, 11, false);
          g.fillStyle = it[0]; g.fillRect(lx, ly - 4, 9, 9); K.text(g, it[1], lx + 13, ly, { font: f, color: theme.fg, baseline: 'middle' });
          lx += 25 + g.measureText(it[1]).width;
        });
      }
      function drawCarts(g, V) {
        const w = V.w, h = V.h, N = nums(), A = st.a, B = st.b;
        g.fillStyle = theme.fg; g.fillRect(0, V.ty, w, 3);                // the track
        if (st.walls) { g.fillStyle = theme.muted; g.fillRect(V.X(0) - 10, V.ty - 64, 10, 64); g.fillRect(V.X(TRACK), V.ty - 64, 10, 64); }
        [[A, st.m1, theme.c1, '1'], [B, st.m2, theme.c2, '2']].forEach(q => {
          const c = q[0], b = cartBox(V, c, q[1]);
          g.fillStyle = q[2]; K.roundRect(g, b.x - b.cw / 2, b.top, b.cw, b.ch, 4); g.fill(); g.strokeStyle = K.withAlpha(theme.fg, 0.6); g.lineWidth = 1; g.stroke();
          wheel(g, b.x - b.cw * 0.28, V.ty - 5, 5); wheel(g, b.x + b.cw * 0.28, V.ty - 5, 5);
          label(g, q[3], b.x, V.ty + 12, { align: 'center' });
          if (Math.abs(b.tip - b.x) > 1) K.arrow(g, b.x, b.ay, b.tip, b.ay, { color: theme.fg, width: 3, head: 9 });
          if (st.t === 0) { g.fillStyle = theme.surface; g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.arc(b.tip, b.ay, 5.5, 0, TAU); g.fill(); g.stroke(); }   // drag handle
        });
        if (st.flash > 0 && st.rec) {                                    // the moment of the collision
          const fx = V.X(A.x + CW / 2), fy = V.ty - 26, rr = 10 + (0.4 - st.flash) * 40;
          g.strokeStyle = K.withAlpha(st.e < 1 ? theme.c8 : theme.fg, st.flash / 0.4); g.lineWidth = 2; g.beginPath();
          for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + 0.3; g.moveTo(fx + Math.cos(a) * rr * 0.5, fy + Math.sin(a) * rr * 0.5); g.lineTo(fx + Math.cos(a) * rr, fy + Math.sin(a) * rr); }
          g.stroke();
        }
        // one line per cart: mass, velocity now, momentum now
        const rows = [[theme.c1, '1', st.m1, A.v], [theme.c2, '2', st.m2, B.v]].map(q => ({ c: q[0], t: K.tr({ en: 'cart ', hr: 'kolica ' }, lang) + q[1] + ':  m = ' + K.fmt(q[2], 1, lang) + ' kg   v = ' + sg(q[3], 2, lang) + ' m/s   p = ' + sg(q[2] * q[3], 2, lang) + ' kg·m/s' }));
        rows.forEach((r, i) => {
          const maxW = V.wide ? w / 2 - 34 : w - 38, f = fit(g, r.t, maxW, 12, false), tw = g.measureText(r.t).width;
          const tx = V.wide && i === 1 ? w - 10 - tw : 24, ty = V.ty + (V.wide ? 30 : 30 + i * 16);
          g.fillStyle = r.c; g.fillRect(tx - 14, ty - 5, 10, 10); K.text(g, r.t, tx, ty, { font: f, color: theme.fg, baseline: 'middle' });
        });
        // bar charts
        const y0 = V.ty + (V.wide ? 46 : 60), ah = h - y0 - 8;
        if (V.wide) { const pw = (w - 30) / 2; momentumPanel(g, 10, y0, pw, Math.min(ah, 220), N); energyPanel(g, 20 + pw, y0, pw, Math.min(ah, 220), N); }
        else { const mh = Math.round(ah * 0.56); momentumPanel(g, 8, y0, w - 16, mh, N); energyPanel(g, 8, y0 + mh + 6, w - 16, ah - mh - 6, N); }
        const kind = st.e >= 1 ? { en: 'perfectly elastic', hr: 'savršeno elastičan' } : st.e <= 0 ? { en: 'perfectly inelastic', hr: 'savršeno neelastičan' } : { en: 'partly inelastic', hr: 'djelomično neelastičan' };
        const l2 = st.rec ? (st.stuck ? { en: 'The carts stick together. Momentum is the same as before; ' + K.fmt(N.pct, 0, 'en') + ' % of the kinetic energy became heat, sound and dents.', hr: 'Kolica su se slijepila. Količina gibanja ista je kao prije; ' + K.fmt(N.pct, 0, 'hr') + ' % kinetičke energije prešlo je u toplinu, zvuk i deformaciju.' }
          : N.lost < 1e-9 ? { en: 'Elastic collision: momentum AND kinetic energy are the same as before.', hr: 'Elastičan sudar: i količina gibanja i kinetička energija iste su kao prije.' }
            : { en: 'Momentum is the same as before; ' + K.fmt(N.pct, 0, 'en') + ' % of the kinetic energy became heat, sound and dents.', hr: 'Količina gibanja ista je kao prije; ' + K.fmt(N.pct, 0, 'hr') + ' % kinetičke energije prešlo je u toplinu, zvuk i deformaciju.' })
          : (A.v - B.v > 1e-9 || st.walls) ? (st.t > 0 ? { en: 'Wait for the collision…', hr: 'Pričekaj sudar…' } : { en: 'Drag a cart sideways (or use the sliders) to set its velocity, then press Play.', hr: 'Povuci kolica u stranu (ili pomakni klizače) da im namjestiš brzinu, zatim pokreni.' })
            : { en: 'These carts will never meet: cart 1 is not catching up with cart 2.', hr: 'Ova se kolica neće sudariti: kolica 1 ne sustižu kolica 2.' };
        header(g, K.tr(MODES[0].label, lang) + '  ·  ' + K.tr({ en: 'bounciness ', hr: 'elastičnost ' }, lang) + K.fmt(st.e, 2, lang) + ' (' + K.tr(kind, lang) + ')  ·  t = ' + K.fmt(st.t, 1, lang) + ' s' + (st.slow ? '  ·  ' + K.tr({ en: 'slow motion', hr: 'usporeno' }, lang) : ''), K.tr(l2, lang), cv.w - 20);
      }

      // ---------- scene: Newton's cradle ----------
      function drawCradle(g, V) {
        const w = V.w, h = V.h, r = V.r, Lp = CL * V.ppm, q = cradleNums();
        const fw = NB * CD * V.ppm + 70, fx = w / 2 - fw / 2, by = V.py + Lp + r + 16, bw = Math.min(w - 20, fw + 2 * Lp * 0.75);
        g.fillStyle = theme.surface2; K.roundRect(g, w / 2 - bw / 2, by, bw, 12, 5); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1; g.stroke();   // base
        g.strokeStyle = K.withAlpha(theme.fg, 0.25); g.lineWidth = 4; g.beginPath(); g.moveTo(fx, by); g.lineTo(fx, V.py - 6); g.moveTo(fx + fw, by); g.lineTo(fx + fw, V.py - 6); g.stroke();
        g.strokeStyle = theme.fg; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(fx, V.py - 6); g.lineTo(fx + fw, V.py - 6); g.stroke(); g.lineCap = 'butt';
        for (let i = 0; i < NB; i++) {
          const b = ballPos(V, i), v = st.om[i] * CL;
          g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.moveTo(V.px(i), V.py - 6); g.lineTo(b.x, b.y); g.stroke();
          const gr = g.createRadialGradient(b.x - r * 0.35, b.y - r * 0.35, r * 0.1, b.x, b.y, r);
          gr.addColorStop(0, STEEL_HI); gr.addColorStop(0.55, STEEL); gr.addColorStop(1, STEEL_LO);
          g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, r, 0, TAU); g.fill(); g.strokeStyle = K.withAlpha(theme.fg, 0.7); g.lineWidth = 1; g.stroke();
          if (Math.abs(v) > 0.05) {                                      // velocity of a moving ball
            const len = v * Math.min(60, V.ppm * 0.09), ay = b.y + r + 9;
            K.arrow(g, b.x, ay, b.x + Math.cos(st.th[i]) * len, ay - Math.sin(st.th[i]) * len, { color: theme.fg, width: 2.5, head: 7 });
          }
        }
        if (!st.released && st.th[0] < -0.03) label(g, K.fmt(-st.th[0] * 180 / Math.PI, 0, lang) + '°', V.px(0) - 16, V.py + 26, { align: 'right', font: fnt(12, true) });
        const l2 = st.released ? { en: 'up on the left: ' + q.left + '   ·   up on the right: ' + q.right, hr: 'podignuto lijevo: ' + q.left + '   ·   podignuto desno: ' + q.right }
          : { en: 'Drag the left balls back, or choose how many to pull back, then let go.', hr: 'Povuci lijeve kuglice unatrag ili odaberi koliko ih podići pa pusti.' };
        header(g, K.tr(MODES[1].label, lang) + '  ·  ' + K.tr({ en: 'balls pulled back: ', hr: 'podignuto kuglica: ' }, lang) + st.n + (st.damp ? '  ·  ' + K.tr({ en: 'with damping', hr: 's prigušenjem' }, lang) : '') + (st.slow ? '  ·  ' + K.tr({ en: 'slow motion', hr: 'usporeno' }, lang) : ''), K.tr(l2, lang), cv.w - 20);
        const info = K.tr({ en: 'five equal steel balls, 0.1 kg each, strings 0.30 m', hr: 'pet jednakih čeličnih kuglica, svaka 0,1 kg, niti 0,30 m' }, lang);
        K.text(g, info, w - 10, h - 12, { font: fit(g, info, w - 20, 11, false), color: theme.muted, align: 'right', baseline: 'middle' });
      }

      function draw() {
        const g = cv.ctx;
        g.clearRect(0, 0, cv.w, cv.h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, cv.w, cv.h);
        if (st.mode === 'carts') drawCarts(g, viewCarts()); else drawCradle(g, viewCradle());
      }
      function step(dt) { if (st.mode === 'carts') stepCarts(dt); else stepCradle(dt); }
      function reset() { L.stop(); st.drag = null; st.cdrag = -1; resetCarts(); resetCradle(); updatePlay(); refresh(); }

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
