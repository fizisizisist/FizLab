/* FizLab sim: Forces Come in Pairs — Newton's third law: truck vs car crash, tug on a dynamometer, free-body-diagram builder, apple and Earth. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, M_EARTH = 5.97e24;
  const K_BUMPER = 1e5;     // bumper spring stiffness (N/m)
  const WM = 40;            // length of road shown (m)
  const LT = 7, LC = 3.6;   // truck / car length (m)
  const M_KID = 40;         // mass of each kid (kg)
  const APPLE_H = 4;        // apple drop height (m)
  const MODES = [
    { value: 'truck', label: { en: 'Truck meets car', hr: 'Kamion i auto' } },
    { value: 'dyno', label: { en: 'Tug on a dynamometer', hr: 'Dinamometar' } },
    { value: 'fbd', label: { en: 'Book on a table', hr: 'Knjiga na stolu' } },
    { value: 'apple', label: { en: 'Apple and Earth', hr: 'Jabuka i Zemlja' } }
  ];
  const VARIANTS = [
    { value: 'book', m: 1, label: { en: 'Book on a table', hr: 'Knjiga na stolu' }, name: { en: 'book', hr: 'knjigu' }, holder: { en: 'table', hr: 'stol' } },
    { value: 'lamp', m: 2, label: { en: 'Hanging lamp', hr: 'Viseća lampa' }, name: { en: 'lamp', hr: 'lampu' }, holder: { en: 'rope', hr: 'nit' } },
    { value: 'box', m: 10, label: { en: 'Box pushed at constant speed', hr: 'Kutija gurana stalnom brzinom' }, name: { en: 'box', hr: 'kutiju' }, holder: { en: 'floor', hr: 'pod' } }
  ];
  // candidate forces for the diagram builder (the label of two of them depends on the situation)
  const CANDS = [
    { id: 'weight', short: { en: 'Weight', hr: 'Težina' }, label: { en: 'Weight — Earth pulls the object down', hr: 'Težina — Zemlja privlači tijelo prema dolje' } },
    { id: 'support', short: { en: 'Support force', hr: 'Sila podloge / niti' }, label: {
      book: { en: 'The table pushes the book up (normal force)', hr: 'Stol gura knjigu prema gore (sila podloge)' },
      lamp: { en: 'The rope pulls the lamp up (tension)', hr: 'Nit vuče lampu prema gore (napetost niti)' },
      box: { en: 'The floor pushes the box up (normal force)', hr: 'Pod gura kutiju prema gore (sila podloge)' } } },
    { id: 'hand', short: { en: 'Push of the hand', hr: 'Sila ruke' }, label: { en: 'A hand pushes it forward', hr: 'Ruka ga gura naprijed' } },
    { id: 'friction', short: { en: 'Friction', hr: 'Trenje' }, label: { en: 'Friction from the surface', hr: 'Trenje s podloge' } },
    { id: 'motion', short: { en: '"Force of motion"', hr: '"Sila gibanja"' }, label: { en: '"Force of motion" inside the object', hr: '"Sila gibanja" u tijelu' } },
    { id: 'onsupport', short: { en: 'Push on the support', hr: 'Pritisak na podlogu' }, label: {
      book: { en: 'The book\'s push on the table', hr: 'Sila kojom knjiga pritišće stol' },
      lamp: { en: 'The lamp\'s pull on the rope', hr: 'Sila kojom lampa vuče nit' },
      box: { en: 'The box\'s push on the floor', hr: 'Sila kojom kutija pritišće pod' } } },
    { id: 'air', short: { en: 'Air pressure', hr: 'Tlak zraka' }, label: { en: 'Air pressure on the object', hr: 'Tlak zraka na tijelo' } }
  ];
  const EXPECT = { book: ['weight', 'support'], lamp: ['weight', 'support'], box: ['weight', 'support', 'hand', 'friction'] };
  const candLabel = (c, variant) => c.label.en ? c.label : c.label[variant];
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function sci(v, l) { // 1.64e-24 -> "1,6·10⁻²⁴"
    if (!v) return '0';
    const e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e);
    return K.fmt(m, 1, l) + '·10' + String(e).split('').map(c => SUP[c] || c).join('');
  }

  window.Sims.register({
    id: 'forcepairs',
    title: { en: 'Forces Come in Pairs', hr: 'Sile dolaze u parovima' },
    summary: {
      en: 'Crash a truck into a car, tug on a spring scale, build a force diagram and drop an apple: every force has an equal and opposite partner on the other body.',
      hr: 'Sudari kamion s autom, povuci dinamometar, nacrtaj dijagram sila i pusti jabuku: svaka sila ima jednaku protusilu na drugom tijelu.'
    },
    tasks: [
      { en: 'Crash a 10 000 kg truck into a 500 kg car. Compare the two force meters — then compare the two accelerations.', hr: 'Sudari kamion od 10 000 kg s autom od 500 kg. Usporedi dva mjerača sile — zatim usporedi dva ubrzanja.' },
      { en: 'Dynamometer: both kids pull with 100 N. Does the scale read 0, 100 or 200 N? Now tie one end to the wall.', hr: 'Dinamometar: oba djeteta vuku silom 100 N. Pokazuje li dinamometar 0, 100 ili 200 N? Zatim veži jedan kraj na zid.' },
      { en: 'Book on a table: tick only the forces that act ON the book and press Check. Which pairs are true third-law pairs?', hr: 'Knjiga na stolu: označi samo sile koje djeluju NA knjigu i provjeri. Koji su parovi pravi parovi sile i protusile?' },
      { en: 'Apple and Earth: the two forces are equal. Why does only the apple visibly move?', hr: 'Jabuka i Zemlja: dvije su sile jednake. Zašto se vidljivo giba samo jabuka?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 10, minHeight: 320, maxHeight: 540 });
      const C = K.controls(container, lang);

      const st = {
        mode: 'truck',
        tr: { mT: 5000, mC: 1000, vT0: 5, vC0: 5, xT: 10, xC: 30, vT: 5, vC: -5, F: 0, peakF: 0, t: 0, slow: false, hit: false, done: false, Fscale: 1 },
        dy: { FA: 100, FB: 100, wall: false, x: 0, v: 0, t: 0, gone: false },
        fb: { variant: VARIANTS[0], m: 1, push: 30, picks: {}, checked: false, score: 0 },
        ap: { m: 0.2, y: APPLE_H, v: 0, t: 0, landed: false }
      };

      // ---------- controls ----------
      C.segmented({ label: { en: 'Scene', hr: 'Prizor' }, options: MODES, value: 'truck', onChange: setMode });
      const slMT = C.slider({ label: { en: 'Truck mass', hr: 'Masa kamiona' }, min: 2000, max: 10000, step: 500, value: 5000, unit: 'kg', digits: 0, onChange: v => { st.tr.mT = v; resetTruck(); refresh(); } });
      const slMC = C.slider({ label: { en: 'Car mass', hr: 'Masa auta' }, min: 500, max: 1500, step: 50, value: 1000, unit: 'kg', digits: 0, onChange: v => { st.tr.mC = v; resetTruck(); refresh(); } });
      const slVT = C.slider({ label: { en: 'Truck speed', hr: 'Brzina kamiona' }, min: 2, max: 10, step: 0.5, value: 5, unit: 'm/s', digits: 1, onChange: v => { st.tr.vT0 = v; resetTruck(); refresh(); } });
      const slVC = C.slider({ label: { en: 'Car speed', hr: 'Brzina auta' }, min: 2, max: 10, step: 0.5, value: 5, unit: 'm/s', digits: 1, onChange: v => { st.tr.vC0 = v; resetTruck(); refresh(); } });
      const slFA = C.slider({ label: { en: 'Ana pulls to the left', hr: 'Ana vuče ulijevo' }, min: 0, max: 200, step: 5, value: 100, unit: 'N', digits: 0, onChange: v => { st.dy.FA = v; refresh(); } });
      const slFB = C.slider({ label: { en: 'Bruno pulls to the right', hr: 'Bruno vuče udesno' }, min: 0, max: 200, step: 5, value: 100, unit: 'N', digits: 0, onChange: v => { st.dy.FB = v; refresh(); } });
      const tgWall = C.toggle({ label: { en: 'Tie the left end to a wall', hr: 'Lijevi kraj veži na zid' }, value: false, onChange: v => { st.dy.wall = v; slFA.setDisabled(v); resetDyno(); refresh(); } });
      const selVar = C.select({ label: { en: 'Situation', hr: 'Situacija' }, options: VARIANTS.map(v => ({ value: v.value, label: v.label })), value: 'book',
        onChange: v => { st.fb.variant = VARIANTS.find(x => x.value === v) || VARIANTS[0]; st.fb.m = st.fb.variant.m; slFM.set(st.fb.m); clearPicks(); applyFbdLabels(); showControls(); refresh(); } });
      const slFM = C.slider({ label: { en: 'Mass of the object', hr: 'Masa tijela' }, min: 0.5, max: 10, step: 0.5, value: 1, unit: 'kg', digits: 1, onChange: v => { st.fb.m = v; refresh(); } });
      const slPush = C.slider({ label: { en: 'Push of the hand', hr: 'Sila ruke' }, min: 10, max: 100, step: 5, value: 30, unit: 'N', digits: 0, onChange: v => { st.fb.push = v; refresh(); } });
      const tgs = {};
      CANDS.forEach(c => { tgs[c.id] = C.toggle({ label: candLabel(c, 'book'), value: false, onChange: v => { st.fb.picks[c.id] = v; st.fb.checked = false; refresh(); } }); });
      const btnCheck = C.button({ label: { en: 'Check my diagram', hr: 'Provjeri dijagram' }, variant: 'primary', onClick: checkFbd });
      const slAM = C.slider({ label: { en: 'Apple mass', hr: 'Masa jabuke' }, min: 0.1, max: 0.5, step: 0.05, value: 0.2, unit: 'kg', digits: 2, onChange: v => { st.ap.m = v; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { if (finished()) resetMode(); L.toggle(); updatePlay(); refresh(); } });
      const btnReset = C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { resetMode(); refresh(); } });
      // readouts
      const outFC = C.readout({ label: { en: 'Force on the car', hr: 'Sila na auto' }, unit: 'N', digits: 0 });
      const outFT = C.readout({ label: { en: 'Force on the truck', hr: 'Sila na kamion' }, unit: 'N', digits: 0 });
      const outAC = C.readout({ label: { en: 'Car acceleration', hr: 'Ubrzanje auta' }, unit: 'm/s²', digits: 1 });
      const outAT = C.readout({ label: { en: 'Truck acceleration', hr: 'Ubrzanje kamiona' }, unit: 'm/s²', digits: 1 });
      const outP = C.readout({ label: { en: 'Total momentum', hr: 'Ukupna količina gibanja' }, unit: 'kg·m/s', digits: 0 });
      const outTen = C.readout({ label: { en: 'Scale reading (tension)', hr: 'Dinamometar pokazuje (napetost)' }, unit: 'N', digits: 0 });
      const outAcc = C.readout({ label: { en: 'Acceleration', hr: 'Ubrzanje' }, unit: 'm/s²', digits: 2 });
      const outWall = C.readout({ label: { en: 'Wall pulls back', hr: 'Zid vuče natrag' }, unit: 'N', digits: 0 });
      const outW = C.readout({ label: { en: 'Weight', hr: 'Težina' }, unit: 'N', digits: 2 });
      const outN = C.readout({ label: { en: 'Support force', hr: 'Sila podloge / niti' }, unit: 'N', digits: 2 });
      const outFr = C.readout({ label: { en: 'Friction', hr: 'Trenje' }, unit: 'N', digits: 0 });
      const outPush = C.readout({ label: { en: 'Push', hr: 'Sila ruke' }, unit: 'N', digits: 0 });
      const outF = C.readout({ label: { en: 'Force on each body', hr: 'Sila na svako tijelo' }, unit: 'N', digits: 2 });
      const outAA = C.readout({ label: { en: 'Apple acceleration', hr: 'Ubrzanje jabuke' }, unit: 'm/s²', digits: 2 });
      const outAE = C.readout({ label: { en: 'Earth acceleration', hr: 'Ubrzanje Zemlje' }, unit: 'm/s²' });
      const outDE = C.readout({ label: { en: 'Earth has moved', hr: 'Zemlja se pomaknula' }, unit: 'm' });
      const note = C.note({ text: { en: '', hr: '' } });

      function fieldOf(c) {
        let e = c.el;
        while (e) {
          const cls = String(e.className || '').split(/\s+/);
          if (cls.indexOf('sk-field') >= 0 || cls.indexOf('sk-note') >= 0) return e;
          if (cls.indexOf('sk-controls') >= 0) return c.el;
          e = e.parentNode;
        }
        return c.el;
      }
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };
      function showControls() {
        const m = st.mode, isBox = st.fb.variant.value === 'box';
        [[slMT, 'truck'], [slMC, 'truck'], [slVT, 'truck'], [slVC, 'truck'], [outFC, 'truck'], [outFT, 'truck'], [outAC, 'truck'], [outAT, 'truck'], [outP, 'truck'],
          [slFA, 'dyno'], [slFB, 'dyno'], [tgWall, 'dyno'], [outTen, 'dyno'], [outAcc, 'dyno'], [outWall, 'dyno'],
          [selVar, 'fbd'], [slFM, 'fbd'], [btnCheck, 'fbd'], [outW, 'fbd'], [outN, 'fbd'],
          [slAM, 'apple'], [outF, 'apple'], [outAA, 'apple'], [outAE, 'apple'], [outDE, 'apple']
        ].forEach(([c, mode]) => show(c, mode === m));
        CANDS.forEach(c => show(tgs[c.id], m === 'fbd'));
        show(slPush, m === 'fbd' && isBox); show(outFr, m === 'fbd' && isBox); show(outPush, m === 'fbd' && isBox);
        show(btnPlay, m !== 'fbd');
      }
      // the two situation-dependent toggle labels (re-applied after every relabel)
      function applyFbdLabels() {
        CANDS.forEach(c => { const lab = tgs[c.id].el.querySelector('.sk-label'); if (lab) lab.textContent = K.tr(candLabel(c, st.fb.variant.value), lang); });
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function finished() { return (st.mode === 'truck' && st.tr.done) || (st.mode === 'dyno' && st.dy.gone) || (st.mode === 'apple' && st.ap.landed); }
      function setMode(v) { st.mode = v; L.stop(); updatePlay(); showControls(); refresh(); }
      function refresh() { updateOut(); draw(); }

      // ---------- physics: truck meets car (spring bumper, equal and opposite forces) ----------
      function resetTruck() {
        const T = st.tr;
        T.xT = 10; T.xC = 30; T.vT = T.vT0; T.vC = -T.vC0; T.F = 0; T.peakF = 0; T.t = 0; T.slow = false; T.hit = false; T.done = false;
        const mu = T.mT * T.mC / (T.mT + T.mC);
        T.Fscale = Math.max(1, (T.vT0 + T.vC0) * Math.sqrt(mu * K_BUMPER) * 1.15); // predicted peak force, for arrow scaling
      }
      const gapTruck = () => (st.tr.xC - LC / 2) - (st.tr.xT + LT / 2);
      function stepTruck(dt) {
        const T = st.tr; if (T.done) return;
        T.slow = gapTruck() < 1.5;                      // slow motion around the crash
        const n = 40, h = dt * (T.slow ? 0.12 : 1) / n;
        const mu = T.mT * T.mC / (T.mT + T.mC), b = 0.5 * Math.sqrt(K_BUMPER * mu); // light damping (crumpling)
        for (let i = 0; i < n; i++) {
          const d = -gapTruck();
          const F = d > 0 ? Math.max(0, K_BUMPER * d + b * (T.vT - T.vC)) : 0; // ONE contact force, applied to both
          T.vT -= F / T.mT * h; T.vC += F / T.mC * h;
          T.xT += T.vT * h; T.xC += T.vC * h;
          T.F = F; T.t += h;
          if (F > 0) { T.hit = true; if (F > T.peakF) T.peakF = F; }
        }
        if (T.xC - LC / 2 > WM + 1 || T.xT - LT / 2 > WM + 1 || T.xT + LT / 2 < -1) { T.done = true; L.stop(); updatePlay(); }
      }
      // ---------- physics: tug on a dynamometer ----------
      function resetDyno() { const D = st.dy; D.x = 0; D.v = 0; D.t = 0; D.gone = false; }
      function dynoForces() {
        const D = st.dy;
        if (D.wall) return { a: 0, T: D.FB, wall: D.FB };
        const a = (D.FB - D.FA) / (2 * M_KID);       // both kids move together
        return { a, T: D.FA + M_KID * a, wall: 0 };   // tension = (F_A + F_B)/2 for equal masses
      }
      const pxmDyno = () => K.clamp(cv.w / 12, 30, 60);
      function stepDyno(dt) {
        const D = st.dy; if (D.gone) return;
        const f = dynoForces();
        D.v += f.a * dt; D.x += D.v * dt; D.t += dt;
        if (Math.abs(D.x * pxmDyno()) > cv.w * 0.3) { D.gone = true; L.stop(); updatePlay(); }
      }
      // ---------- free-body diagram ----------
      function fbdForces() {
        const F = st.fb, Wt = F.m * G, isBox = F.variant.value === 'box';
        return { W: Wt, N: Wt, push: isBox ? F.push : 0, fr: isBox ? F.push : 0 };
      }
      function clearPicks() { st.fb.picks = {}; st.fb.checked = false; CANDS.forEach(c => tgs[c.id].set(false)); }
      function checkFbd() {
        const F = st.fb, exp = EXPECT[F.variant.value];
        F.score = CANDS.reduce((s, c) => s + ((!!F.picks[c.id]) === (exp.indexOf(c.id) >= 0) ? 1 : 0), 0);
        F.checked = true; refresh();
      }
      function explain(id) {
        const v = st.fb.variant, f = fbdForces(), isBox = v.value === 'box';
        const nW = l => K.fmt(f.W, 2, l) + ' N', nP = l => K.fmt(f.push, 0, l) + ' N';
        switch (id) {
          case 'weight': return { en: 'Earth pulls the ' + v.name.en + ' down: W = m·g = ' + nW('en') + '.', hr: 'Zemlja privlači ' + v.name.hr + ': G = m·g = ' + nW('hr') + '.' };
          case 'support': return v.value === 'lamp'
            ? { en: 'The rope pulls up with ' + nW('en') + ' (tension) — the lamp does not fall.', hr: 'Nit vuče prema gore silom ' + nW('hr') + ' (napetost niti) — lampa ne pada.' }
            : { en: 'The ' + v.holder.en + ' pushes up with ' + nW('en') + ' — the ' + v.name.en + ' does not sink in.', hr: K.tr(v.holder, 'hr').replace(/^./, c => c.toUpperCase()) + ' gura prema gore silom ' + nW('hr') + ' — tijelo ne propada.' };
          case 'hand': return isBox ? { en: 'The hand pushes forward with ' + nP('en') + '.', hr: 'Ruka gura naprijed silom ' + nP('hr') + '.' } : { en: 'Nobody is pushing it.', hr: 'Nitko ga ne gura.' };
          case 'friction': return isBox
            ? { en: 'Friction pulls back with ' + nP('en') + ' — equal to the push, so the speed stays constant.', hr: 'Trenje vuče natrag silom ' + nP('hr') + ' — jednako guranju, zato je brzina stalna.' }
            : { en: 'Nothing pushes the ' + v.name.en + ' sideways, so there is no friction.', hr: 'Ništa ne gura tijelo bočno, pa nema trenja.' };
          case 'motion': return { en: 'There is no "force of motion". A body keeps moving (or resting) with no force at all — 1st law.', hr: 'Ne postoji "sila gibanja". Tijelo se giba (ili miruje) i bez ikakve sile — 1. Newtonov zakon.' };
          case 'onsupport': return { en: 'A real force — but it acts ON THE ' + v.holder.en.toUpperCase() + ', not on the ' + v.name.en + '. It belongs in the ' + v.holder.en + '\'s diagram.', hr: 'Prava sila — ali djeluje NA ' + v.holder.hr.toUpperCase() + ', a ne na tijelo. Pripada dijagramu drugog tijela.' };
          default: return { en: 'Air presses almost equally from all sides — the net push is negligible.', hr: 'Zrak tlači gotovo jednako sa svih strana — ukupni učinak je zanemariv.' };
        }
      }
      // ---------- apple and Earth ----------
      function resetApple() { const A = st.ap; A.y = APPLE_H; A.v = 0; A.t = 0; A.landed = false; }
      function stepApple(dt) {
        const A = st.ap; if (A.landed) return;
        const h = dt * 0.5; // half speed so the short fall can be watched
        A.v += G * h; A.y -= A.v * h; A.t += h;
        if (A.y <= 0) { A.y = 0; A.landed = true; L.stop(); updatePlay(); }
      }

      function resetMode() {
        L.stop();
        if (st.mode === 'truck') resetTruck(); else if (st.mode === 'dyno') resetDyno(); else if (st.mode === 'apple') resetApple(); else clearPicks();
        updatePlay();
      }
      function step(dt) {
        if (st.mode === 'truck') stepTruck(dt); else if (st.mode === 'dyno') stepDyno(dt); else if (st.mode === 'apple') stepApple(dt);
      }
      function updateOut() {
        if (st.mode === 'truck') {
          const T = st.tr, Fshow = T.F > 0 ? T.F : T.peakF;
          outFC.set(Fshow); outFT.set(Fshow); outAC.set(Fshow / T.mC); outAT.set(Fshow / T.mT); outP.set(T.mT * T.vT + T.mC * T.vC);
          note.set(T.hit
            ? { en: 'Equal forces, very different effects: the smaller mass gets the bigger acceleration (a = F/m). The total momentum stays the same.', hr: 'Jednake sile, vrlo različiti učinci: manja masa dobiva veće ubrzanje (a = F/m). Ukupna količina gibanja ostaje ista.' }
            : { en: 'Press Play. During the crash the truck pushes the car and the car pushes the truck back — with exactly the same force.', hr: 'Pokreni. Za vrijeme sudara kamion gura auto, a auto gura kamion natrag — potpuno jednakom silom.' });
        } else if (st.mode === 'dyno') {
          const D = st.dy, f = dynoForces();
          outTen.set(f.T); outAcc.set(Math.abs(f.a)); outWall.set(D.wall ? f.wall : { en: '–', hr: '–' });
          const te = K.fmt(f.T, 0, 'en'), th = K.fmt(f.T, 0, 'hr');
          note.set(D.wall
            ? { en: 'The scale reads ' + te + ' N and the wall pulls back with exactly ' + te + ' N — otherwise the scale would fly off. A spring shows ONE force: the pull at its ends.', hr: 'Dinamometar pokazuje ' + th + ' N, a zid vuče natrag točno ' + th + ' N — inače bi odletio. Opruga pokazuje JEDNU silu: vlak na svojim krajevima.' }
            : Math.abs(f.a) < 1e-9
              ? { en: 'A stretched spring is pulled from BOTH ends and shows ONE force — the tension: ' + te + ' N, not ' + K.fmt(2 * f.T, 0, 'en') + ' N and not 0 N.', hr: 'Rastegnutu oprugu vuku s OBA kraja, a pokazuje JEDNU silu — napetost: ' + th + ' N, a ne ' + K.fmt(2 * f.T, 0, 'hr') + ' N i ne 0 N.' }
              : { en: 'Unequal pulls: everything accelerates towards the stronger kid, a = (F_B − F_A)/(m_A + m_B). The scale still shows one force, the tension T = ' + te + ' N — between the two pulls.', hr: 'Nejednaki vlakovi: sve ubrzava prema jačem djetetu, a = (F_B − F_A)/(m_A + m_B). Dinamometar i dalje pokazuje jednu silu, napetost T = ' + th + ' N — između dvaju vlakova.' });
        } else if (st.mode === 'fbd') {
          const f = fbdForces(), v = st.fb.variant;
          outW.set(f.W); outN.set(f.N); outFr.set(f.fr); outPush.set(f.push);
          note.set(st.fb.checked
            ? { en: 'Weight and the ' + v.holder.en + '\'s force are NOT a third-law pair: they act on the same body. A pair always acts on two different bodies.', hr: 'Težina i sila ' + (v.value === 'lamp' ? 'niti' : v.value === 'book' ? 'stola' : 'poda') + ' NISU par sile i protusile: djeluju na isto tijelo. Par uvijek djeluje na dva različita tijela.' }
            : { en: 'Tick every force that acts ON the ' + v.name.en + ' — and only those — then press Check.', hr: 'Označi svaku silu koja djeluje NA tijelo — i samo njih — zatim pritisni Provjeri.' });
        } else {
          const A = st.ap, F = A.m * G, aE = F / M_EARTH;
          outF.set(F); outAA.set(G);
          const sE = sci(aE, lang), sD = sci(0.5 * aE * A.t * A.t, lang);
          outAE.set({ en: sE + ' (≈ 0)', hr: sE + ' (≈ 0)' });
          outDE.set(A.t > 0 ? { en: sD + ' (≈ 0)', hr: sD + ' (≈ 0)' } : 0);
          note.set({ en: 'The same force acts on both. The apple: a = F/m = ' + K.fmt(G, 2, 'en') + ' m/s². Earth: a = F/M = ' + sci(aE, 'en') + ' m/s² — practically zero, because Earth\'s mass is enormous (5.97·10²⁴ kg).', hr: 'Ista sila djeluje na oboje. Jabuka: a = F/m = ' + K.fmt(G, 2, 'hr') + ' m/s². Zemlja: a = F/M = ' + sci(aE, 'hr') + ' m/s² — praktički nula, jer je masa Zemlje golema (5,97·10²⁴ kg).' });
        }
      }

      // ---------- drawing helpers ----------
      function pill(ctx, str, x, y, align, font, maxX) {
        ctx.font = font; const tw = ctx.measureText(str).width;
        let tx = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
        tx = K.clamp(tx, 3, (maxX || cv.w) - tw - 3);
        ctx.fillStyle = K.withAlpha(theme.surface, 0.85); K.roundRect(ctx, tx - 4, y - 8, tw + 8, 16, 4); ctx.fill();
        K.text(ctx, str, tx, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function fitFont(ctx, str, maxW, base, bold) {
        for (let px = base; px >= 9; px--) { const f = (bold ? 'bold ' : '') + px + 'px ' + theme.font; ctx.font = f; if (ctx.measureText(str).width <= maxW) return f; }
        return (bold ? 'bold ' : '') + '9px ' + theme.font;
      }
      function wrap(ctx, str, font, maxW, maxLines) {
        ctx.font = font; const lines = []; let cur = '';
        str.split(' ').forEach(wd => { const t = cur ? cur + ' ' + wd : wd; if (!cur || ctx.measureText(t).width <= maxW) cur = t; else { lines.push(cur); cur = wd; } });
        if (cur) lines.push(cur);
        if (maxLines && lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
        return lines;
      }
      function header(ctx, title, hint) {
        K.text(ctx, K.tr(title, lang), 10, 16, { font: fitFont(ctx, K.tr(title, lang), cv.w - 20, 15, true).replace(theme.font, theme.fontDisplay), color: theme.fg, baseline: 'middle' });
        if (hint) K.text(ctx, K.tr(hint, lang), 10, 34, { font: fitFont(ctx, K.tr(hint, lang), cv.w - 20, 12, false), color: theme.muted, baseline: 'middle' });
      }
      function wheel(ctx, x, y, r) { ctx.fillStyle = theme.fg; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = theme.surface; ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, Math.PI * 2); ctx.fill(); }
      function spring(ctx, x1, x2, y, amp, coils, color) {
        ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x1, y);
        const n = coils * 2, dx = (x2 - x1) / (n + 1);
        for (let i = 1; i <= n; i++) ctx.lineTo(x1 + dx * i, y + (i % 2 ? -amp : amp));
        ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
      }
      function kid(ctx, x, gy, handY, color, dir) { // stick figure leaning back and pulling towards `dir`
        ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
        const hx = x - dir * 8, hy = gy - 30, sx = x - dir * 14, sy = gy - 54;
        ctx.beginPath(); ctx.moveTo(x - 9, gy); ctx.lineTo(hx, hy); ctx.lineTo(x + 9, gy); ctx.moveTo(hx, hy); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx, sy - 2); ctx.lineTo(x + dir * 34, handY); ctx.moveTo(sx, sy + 4); ctx.lineTo(x + dir * 34, handY + 4); ctx.stroke();
        ctx.beginPath(); ctx.arc(sx - dir * 3, sy - 12, 9, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // ---------- scene: truck meets car ----------
      function drawTruck(ctx, w, h) {
        const T = st.tr, gy = Math.round(h * 0.72), pxm = w / WM, X = xm => xm * pxm;
        ctx.fillStyle = theme.ground; ctx.fillRect(0, gy, w, h - gy);
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
        const hT = 2.6 * pxm, hC = 1.3 * pxm, truckFront = T.xT + LT / 2;
        // truck (c1): cargo box + cab in front, pointing right
        ctx.fillStyle = theme.c1; ctx.fillRect(X(T.xT - LT / 2), gy - 0.6 * pxm - hT, X(LT - 2) , hT);
        K.roundRect(ctx, X(truckFront - 2), gy - 0.6 * pxm - hT * 0.8, X(2), hT * 0.8, 3 ); ctx.fill();
        ctx.fillStyle = theme.sky; ctx.fillRect(X(truckFront - 1.3), gy - 0.6 * pxm - hT * 0.75, X(1.1), hT * 0.3);
        [T.xT - LT / 2 + 1, T.xT - LT / 2 + 2.3, truckFront - 1].forEach(xm => wheel(ctx, X(xm), gy - 0.5 * pxm, 0.5 * pxm));
        // car (c2), pointing left; the front crumples against the truck
        const carBack = T.xC + LC / 2, carFront = Math.max(T.xC - LC / 2, truckFront), overlap = Math.max(0, truckFront - (T.xC - LC / 2));
        ctx.fillStyle = theme.c2; K.roundRect(ctx, X(carFront), gy - 0.4 * pxm - hC * 0.55, X(carBack - carFront), hC * 0.55, 3); ctx.fill();
        ctx.beginPath(); ctx.moveTo(X(carFront + 0.9), gy - 0.4 * pxm - hC * 0.55); ctx.lineTo(X(carFront + 1.5), gy - 0.4 * pxm - hC); ctx.lineTo(X(carBack - 0.6), gy - 0.4 * pxm - hC); ctx.lineTo(X(carBack - 0.2), gy - 0.4 * pxm - hC * 0.55); ctx.closePath(); ctx.fill();
        if (overlap > 0.02) { ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 4; i++) { const yy = gy - 0.4 * pxm - hC * 0.5 + i * hC * 0.12; ctx.moveTo(X(carFront), yy); ctx.lineTo(X(carFront + 0.5), yy + hC * 0.06); } ctx.stroke(); }
        [carFront + 0.7, carBack - 0.7].forEach(xm => wheel(ctx, X(xm), gy - 0.35 * pxm, 0.35 * pxm));
        // the pair of contact forces: same length, opposite directions, drawn on the two different bodies
        const Fshow = T.F > 0 ? T.F : T.peakF, len = K.clamp(Fshow / T.Fscale, 0, 1.3) * w * 0.22, cx = X(truckFront);
        if (len > 1 && T.F > 0) {
          K.arrow(ctx, cx, gy - 0.4 * pxm - hC * 0.3, cx + len, gy - 0.4 * pxm - hC * 0.3, { color: theme.c4, width: 4, head: 12 });
          K.arrow(ctx, cx, gy - 0.6 * pxm - hT * 0.5, cx - len, gy - 0.6 * pxm - hT * 0.5, { color: theme.c4, width: 4, head: 12 });
        }
        // two force meters at the top
        const my = 44, mh = 54, mw = (w - 30) / 2;
        [[10, { en: 'Force of the CAR on the truck', hr: 'Sila AUTA na kamion' }, -1], [w / 2 + 5, { en: 'Force of the TRUCK on the car', hr: 'Sila KAMIONA na auto' }, 1]].forEach(([mx, lab, dir]) => {
          ctx.fillStyle = theme.surface; K.roundRect(ctx, mx, my, mw, mh, 8); ctx.fill();
          K.text(ctx, K.tr(lab, lang), mx + mw / 2, my + 12, { font: fitFont(ctx, K.tr(lab, lang), mw - 12, 12, false), color: theme.muted, align: 'center', baseline: 'middle' });
          const bar = K.clamp(Fshow / T.Fscale, 0, 1) * (mw - 20);
          ctx.fillStyle = K.withAlpha(theme.c4, 0.2); ctx.fillRect(mx + 10, my + 36, mw - 20, 8);
          ctx.fillStyle = theme.c4; ctx.fillRect(dir > 0 ? mx + 10 : mx + mw - 10 - bar, my + 36, bar, 8);
          const s = (dir > 0 ? '' : '← ') + 'F = ' + K.fmt(Fshow, 0, lang) + ' N' + (dir > 0 ? ' →' : '') + (T.F > 0 || !T.hit ? '' : K.tr({ en: ' (max)', hr: ' (najveća)' }, lang));
          K.text(ctx, s, mx + mw / 2, my + 26, { font: fitFont(ctx, s, mw - 12, 14, true), color: theme.fg, align: 'center', baseline: 'middle' });
        });
        // info boxes: truck bottom-left, car bottom-right
        const ib = h - 8, font = '12px ' + theme.font;
        ctx.fillStyle = theme.c1; ctx.fillRect(10, ib - 30, 10, 10);
        K.text(ctx, K.tr({ en: 'truck ', hr: 'kamion ' }, lang) + K.fmt(T.mT, 0, lang) + ' kg', 24, ib - 25, { font, color: theme.fg, baseline: 'middle' });
        K.text(ctx, 'v = ' + K.fmt(T.vT, 1, lang) + ' m/s   a = ' + K.fmt(Fshow / T.mT, 1, lang) + ' m/s²', 10, ib - 8, { font, color: theme.fg, baseline: 'middle' });
        ctx.fillStyle = theme.c2; ctx.fillRect(w - 20, ib - 30, 10, 10);
        K.text(ctx, K.tr({ en: 'car ', hr: 'auto ' }, lang) + K.fmt(T.mC, 0, lang) + ' kg', w - 24, ib - 25, { font, color: theme.fg, align: 'right', baseline: 'middle' });
        K.text(ctx, 'v = ' + K.fmt(Math.abs(T.vC), 1, lang) + ' m/s ' + (T.vC < 0 ? '←' : '→') + '   a = ' + K.fmt(Fshow / T.mC, 1, lang) + ' m/s²', w - 10, ib - 8, { font, color: theme.fg, align: 'right', baseline: 'middle' });
        const ratio = T.mT / T.mC;
        header(ctx, MODES[0].label, T.slow && !T.done ? { en: 'SLOW MOTION ×8 — watch the two meters', hr: 'USPORENO ×8 — gledaj oba mjerača' }
          : T.hit ? { en: 'Same force on both, but a = F/m: the car\'s acceleration is ' + K.fmt(ratio, 1, 'en') + '× bigger', hr: 'Ista sila na oboje, ali a = F/m: ubrzanje auta je ' + K.fmt(ratio, 1, 'hr') + '× veće' }
            : { en: 'Press Play and watch the crash', hr: 'Pokreni i gledaj sudar' });
      }

      // ---------- scene: dynamometer ----------
      function drawDyno(ctx, w, h) {
        const D = st.dy, f = dynoForces(), gy = Math.round(h * 0.76), pxm = pxmDyno();
        const cx = w / 2 + D.x * pxm, half = K.clamp(w * 0.27, 92, 180), xA = cx - half, xB = cx + half;
        const sx1 = xA + 34, sx2 = xB - 34, sy = gy - 72, pxN = (half - 40) / 200;
        ctx.fillStyle = theme.ground; ctx.fillRect(0, gy, w, h - gy);
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
        if (D.wall) { ctx.fillStyle = K.withAlpha(theme.fg, 0.55); ctx.fillRect(0, 48, sx1 - 6, gy - 48); ctx.fillStyle = theme.fg; ctx.fillRect(sx1 - 8, sy - 4, 8, 8); }
        else kid(ctx, xA, gy, sy, theme.c1, 1);
        kid(ctx, xB, gy, sy, theme.c2, -1);
        // the spring scale: one spring, stretched by the tension
        ctx.fillStyle = theme.surface; ctx.strokeStyle = theme.line; ctx.lineWidth = 1.5; K.roundRect(ctx, sx1, sy - 12, sx2 - sx1, 24, 8); ctx.fill(); ctx.stroke();
        spring(ctx, sx1 + 8, sx1 + 8 + (sx2 - sx1 - 16) * (0.45 + 0.55 * K.clamp(f.T / 200, 0, 1)), sy, 7, 9, theme.fg);
        pill(ctx, 'T = ' + K.fmt(f.T, 0, lang) + ' N', (sx1 + sx2) / 2, sy - 26, 'center', 'bold 15px ' + theme.fontDisplay);
        // forces ON the scale: pulled from both ends with the same tension (c4)
        const lt = f.T * pxN;
        if (lt > 1) {
          K.arrow(ctx, sx1, sy - 22, sx1 - lt, sy - 22, { color: theme.c4, width: 4, head: 11 });
          K.arrow(ctx, sx2, sy - 22, sx2 + lt, sy - 22, { color: theme.c4, width: 4, head: 11 });
          pill(ctx, K.tr(D.wall ? { en: 'wall pulls the scale ', hr: 'zid vuče dinamometar ' } : { en: 'Ana pulls the scale ', hr: 'Ana vuče dinamometar ' }, lang) + K.fmt(f.T, 0, lang) + ' N', sx1 - 4, sy - 38, 'right', '11px ' + theme.font);
          pill(ctx, K.tr({ en: 'Bruno pulls the scale ', hr: 'Bruno vuče dinamometar ' }, lang) + K.fmt(f.T, 0, lang) + ' N', sx2 + 4, sy - 38, 'left', '11px ' + theme.font);
        }
        // forces on the kids from the ground (how hard they dig in), at the feet
        if (!D.wall && D.FA > 0) { K.arrow(ctx, xA, gy - 6, xA - D.FA * pxN, gy - 6, { color: theme.c1, width: 3, head: 9 }); pill(ctx, 'F_A = ' + K.fmt(D.FA, 0, lang) + ' N', xA - 12, gy + 14, 'right', '11px ' + theme.font); }
        if (D.FB > 0) { K.arrow(ctx, xB, gy - 6, xB + D.FB * pxN, gy - 6, { color: theme.c2, width: 3, head: 9 }); pill(ctx, 'F_B = ' + K.fmt(D.FB, 0, lang) + ' N', xB + 12, gy + 14, 'left', '11px ' + theme.font); }
        if (D.wall && lt > 1) { K.arrow(ctx, sx1 - 8, sy - 50, sx1 - 8 + lt, sy - 50, { color: theme.c4, width: 3, head: 9 }); pill(ctx, K.tr({ en: 'scale pulls the wall ', hr: 'dinamometar vuče zid ' }, lang) + K.fmt(f.T, 0, lang) + ' N', sx1 - 8 + lt + 6, sy - 50, 'left', '11px ' + theme.font); }
        // acceleration of the whole system
        if (Math.abs(f.a) > 0.005) {
          const la = K.clamp(f.a * 60, -w * 0.3, w * 0.3);
          K.arrow(ctx, cx, 60, cx + la, 60, { color: theme.c7, width: 3, head: 10 });
          pill(ctx, 'a = ' + K.fmt(Math.abs(f.a), 2, lang) + ' m/s²', cx + la + (la > 0 ? 8 : -8), 60, la > 0 ? 'left' : 'right', 'bold 12px ' + theme.font);
        }
        K.text(ctx, K.tr({ en: 'both kids 40 kg', hr: 'oba djeteta 40 kg' }, lang), w - 10, h - 8, { font: '11px ' + theme.font, color: theme.muted, align: 'right' });
        header(ctx, MODES[1].label, D.gone ? { en: 'Dragged out of the room! Press Reset.', hr: 'Odvučeni iz sobe! Pritisni Vrati.' }
          : Math.abs(f.a) > 0.005 ? { en: 'Unequal pulls — press Play to see who gets dragged', hr: 'Nejednaki vlakovi — pokreni i vidi tko će biti odvučen' }
            : { en: 'What does the scale read when both pull with the same force?', hr: 'Što pokazuje dinamometar kad oboje vuku jednakom silom?' });
      }

      // ---------- scene: free-body diagram builder ----------
      function drawFbd(ctx, w, h) {
        const F = st.fb, f = fbdForces(), v = F.variant.value, exp = EXPECT[v];
        const wide = w >= 640, sw = wide ? Math.round(w * 0.56) : w, sh = wide ? h : Math.round(h * 0.56);
        const cx = Math.round(sw * 0.46), unit = K.clamp(sh * 0.26, 36, 110), L = N => unit * N / f.W; // arrow length per newton (weight = unit)
        const picked = id => F.checked ? exp.indexOf(id) >= 0 : !!F.picks[id];
        let oy, oh = 28, ow = 76, gnd = sh - 28; // object centre / size, Earth strip
        if (v === 'book') {
          oy = Math.round(sh * 0.56); ow = 80; oh = 26;
          ctx.fillStyle = K.withAlpha(theme.fg, 0.35); ctx.fillRect(cx - 120, oy + oh / 2, 240, 10); ctx.fillRect(cx - 100, oy + oh / 2 + 10, 10, gnd - oy - oh / 2 - 10); ctx.fillRect(cx + 90, oy + oh / 2 + 10, 10, gnd - oy - oh / 2 - 10);
          ctx.fillStyle = theme.c6; K.roundRect(ctx, cx - ow / 2, oy - oh / 2, ow, oh, 3); ctx.fill();
          ctx.fillStyle = theme.surface; ctx.fillRect(cx - ow / 2 + 4, oy - oh / 2 + 3, ow - 8, 4);
        } else if (v === 'lamp') {
          oy = Math.round(sh * 0.56); ow = 60; oh = 30;
          ctx.fillStyle = K.withAlpha(theme.fg, 0.35); ctx.fillRect(0, 42, sw, 6);
          ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 48); ctx.lineTo(cx, oy - oh / 2); ctx.stroke();
          ctx.fillStyle = theme.c6; ctx.beginPath(); ctx.moveTo(cx - 14, oy - oh / 2); ctx.lineTo(cx + 14, oy - oh / 2); ctx.lineTo(cx + ow / 2, oy + oh / 2); ctx.lineTo(cx - ow / 2, oy + oh / 2); ctx.closePath(); ctx.fill();
          ctx.fillStyle = theme.c4; ctx.beginPath(); ctx.arc(cx, oy + oh / 2 + 2, 8, 0, Math.PI); ctx.fill();
        } else {
          oy = Math.round(sh * 0.62); ow = 58; oh = 58; gnd = oy + oh / 2;
          ctx.fillStyle = theme.c6; ctx.fillRect(cx - ow / 2, oy - oh / 2, ow, oh);
          ctx.strokeStyle = theme.surface; ctx.lineWidth = 2; ctx.strokeRect(cx - ow / 2 + 4, oy - oh / 2 + 4, ow - 8, oh - 8);
          ctx.fillStyle = theme.fg; K.roundRect(ctx, cx - ow / 2 - 16, oy - 14, 12, 24, 5); ctx.fill();
          ctx.strokeStyle = theme.fg; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - ow / 2 - 20, oy); ctx.lineTo(cx - ow / 2 - 46, oy + 8); ctx.stroke();
          K.arrow(ctx, cx - 20, oy - oh / 2 - 16, cx + 20, oy - oh / 2 - 16, { color: theme.muted, width: 2, head: 7 });
          K.text(ctx, 'v = ' + K.tr({ en: 'const.', hr: 'stalno' }, lang), cx + 26, oy - oh / 2 - 16, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
        }
        ctx.fillStyle = theme.ground; ctx.fillRect(0, gnd, sw, sh - gnd);
        K.text(ctx, K.tr({ en: 'Earth', hr: 'Zemlja' }, lang), 8, sh - 8, { font: '11px ' + theme.font, color: theme.fg });
        const fn = '11px ' + theme.font, nW = K.fmt(f.W, 2, lang) + ' N', nP = K.fmt(f.push, 0, lang) + ' N';
        // forces on the object (the student's picks, or the correct diagram after Check)
        if (picked('weight')) { K.arrow(ctx, cx, oy, cx, oy + L(f.W), { color: theme.c1, width: 3, head: 10 }); pill(ctx, K.tr({ en: 'W = ', hr: 'G = ' }, lang) + nW, cx - 8, oy + L(f.W) - 8, 'right', fn, sw); }
        if (picked('support')) { K.arrow(ctx, cx, oy, cx, oy - L(f.N), { color: theme.c2, width: 3, head: 10 }); pill(ctx, (v === 'lamp' ? 'T = ' : 'N = ') + nW, cx + 8, oy - L(f.N) + 8, 'left', fn, sw); }
        if (picked('hand')) { K.arrow(ctx, cx, oy + 8, cx + L(f.push || f.W * 0.4), oy + 8, { color: theme.c4, width: 3, head: 10 }); pill(ctx, 'F = ' + (f.push ? nP : '?'), cx + L(f.push || f.W * 0.4) + 6, oy + 20, 'left', fn, sw); }
        if (picked('friction')) { K.arrow(ctx, cx, oy + 8, cx - L(f.fr || f.W * 0.4), oy + 8, { color: theme.c3, width: 3, head: 10 }); pill(ctx, K.tr({ en: 'F_fr = ', hr: 'F_tr = ' }, lang) + (f.fr ? nP : '?'), cx - L(f.fr || f.W * 0.4) - 6, oy + 26, 'right', fn, sw); }
        if (picked('motion')) { ctx.save(); ctx.setLineDash([5, 4]); K.arrow(ctx, cx, oy - 8, cx + unit * 0.6, oy - 8, { color: theme.c7, width: 3, head: 10 }); ctx.restore(); pill(ctx, K.tr({ en: '"force of motion"?', hr: '"sila gibanja"?' }, lang), cx + unit * 0.6 + 6, oy - 20, 'left', fn, sw); }
        if (picked('onsupport')) { K.arrow(ctx, cx + 22, oy + oh / 2, cx + 22, oy + oh / 2 + L(f.W) * 0.8, { color: theme.c5, width: 3, head: 10 }); pill(ctx, K.tr({ en: 'push on the ', hr: 'pritisak na ' }, lang) + K.tr(F.variant.holder, lang) + '?', cx + 30, oy + oh / 2 + L(f.W) * 0.8, 'left', fn, sw); }
        if (picked('air')) { [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => K.arrow(ctx, cx + dx * (ow / 2 + 22) + dy * 30, oy + dy * (oh / 2 + 22) + dx * 30, cx + dx * (ow / 2 + 4) + dy * 30, oy + dy * (oh / 2 + 4) + dx * 30, { color: theme.c6, width: 2, head: 6 })); }
        // after Check: the real third-law partners, drawn on the OTHER bodies
        if (F.checked) {
          const ex = cx - unit * 0.9;
          ctx.fillStyle = theme.c1; ctx.beginPath(); ctx.arc(ex, gnd + 6, 4, 0, Math.PI * 2); ctx.fill();
          K.arrow(ctx, ex, gnd + 6, ex, gnd + 6 - L(f.W), { color: theme.c1, width: 3, head: 10 });
          pill(ctx, K.tr({ en: 'the ' + F.variant.name.en + ' pulls Earth ', hr: 'tijelo privlači Zemlju ' }, lang) + nW, ex - 8, gnd - L(f.W) + 10, 'right', fn, sw);
          // the object's pull/push on its holder: on the rope (pointing down, beside the rope) or on the table/floor surface
          const px = v === 'lamp' ? cx + 14 : cx + 34, py = v === 'lamp' ? 64 : oy + oh / 2;
          K.arrow(ctx, px, py, px, py + L(f.N), { color: theme.c2, width: 3, head: 10 });
          pill(ctx, K.tr(v === 'lamp' ? { en: 'lamp pulls the rope ', hr: 'lampa vuče nit ' } : { en: 'presses on the ' + F.variant.holder.en + ' ', hr: 'pritišće ' + F.variant.holder.hr + ' ' }, lang) + nW, px + 8, py + L(f.N) - 8, 'left', fn, sw);
          if (v === 'box') {
            K.arrow(ctx, cx - ow / 2 - 10, oy - 22, cx - ow / 2 - 10 - L(f.push), oy - 22, { color: theme.c4, width: 3, head: 10 });
            pill(ctx, K.tr({ en: 'box pushes the hand ', hr: 'kutija gura ruku ' }, lang) + nP, cx - ow / 2 - 14 - L(f.push), oy - 34, 'right', fn, sw);
            K.arrow(ctx, cx - 10, gnd + 8, cx - 10 + L(f.fr), gnd + 8, { color: theme.c3, width: 3, head: 10 });
            pill(ctx, K.tr({ en: 'box drags the floor ', hr: 'kutija vuče pod ' }, lang) + nP, cx + L(f.fr), gnd + 20, 'left', fn, sw);
          }
        }
        // explanation panel (right when wide, below when narrow)
        const px0 = wide ? sw + 10 : 10, py0 = wide ? 44 : sh + 6, pw = wide ? w - sw - 20 : w - 20, ph = wide ? h - 54 : h - sh - 14;
        ctx.fillStyle = theme.surface; K.roundRect(ctx, px0, py0, pw, ph, 8); ctx.fill();
        const items = [];
        if (!F.checked) {
          const n = CANDS.filter(c => F.picks[c.id]).length;
          items.push({ s: K.tr({ en: 'Which forces act ON the ' + F.variant.name.en + '?', hr: 'Koje sile djeluju NA tijelo?' }, lang), c: theme.fg, b: true });
          items.push({ s: K.tr({ en: 'Tick them below, then press Check.', hr: 'Označi ih dolje, zatim pritisni Provjeri.' }, lang), c: theme.muted });
          items.push({ s: K.tr({ en: 'Ticked: ', hr: 'Označeno: ' }, lang) + K.fmt(n, 0, lang), c: theme.fg });
          CANDS.filter(c => F.picks[c.id]).forEach(c => items.push({ s: '• ' + K.tr(c.short, lang), c: theme.fg }));
        } else {
          items.push({ s: K.tr({ en: 'Result: ', hr: 'Rezultat: ' }, lang) + K.fmt(F.score, 0, lang) + ' / ' + K.fmt(CANDS.length, 0, lang) + (F.score === CANDS.length ? K.tr({ en: ' — perfect!', hr: ' — savršeno!' }, lang) : ''), c: theme.fg, b: true });
          CANDS.forEach(c => {
            const want = exp.indexOf(c.id) >= 0, ok = !!F.picks[c.id] === want;
            items.push({ s: (ok ? '✓ ' : '✗ ') + K.tr(c.short, lang) + (want ? '' : K.tr({ en: ' — not on the diagram', hr: ' — nije u dijagramu' }, lang)), c: ok ? theme.good : theme.bad, b: true });
            items.push({ s: K.tr(explain(c.id), lang), c: theme.muted, x: true });
          });
          items.push({ s: K.tr({ en: 'Third-law pairs (same colour): ' + F.variant.name.en + ' ↔ Earth, ' + F.variant.name.en + ' ↔ ' + F.variant.holder.en + (v === 'box' ? ', box ↔ hand, box ↔ floor (friction)' : ''), hr: 'Parovi sila (ista boja): tijelo ↔ Zemlja, tijelo ↔ ' + F.variant.holder.hr + (v === 'box' ? ', kutija ↔ ruka, kutija ↔ pod (trenje)' : '') }, lang), c: theme.fg, x: true });
        }
        let lines = [];
        const fs = ph < 200 ? 10 : 11, lh = fs + 3;
        items.forEach(it => { const maxL = it.x ? (ph < 200 ? 1 : 2) : 2; wrap(ctx, it.s, (it.b ? 'bold ' : '') + fs + 'px ' + theme.font, pw - 16, maxL).forEach(ln => lines.push({ s: ln, c: it.c, b: it.b })); });
        const maxLines = Math.floor((ph - 12) / lh);
        if (lines.length > maxLines) lines = lines.filter(l => l.b || lines.length <= maxLines).slice(0, maxLines);
        lines.forEach((ln, i) => K.text(ctx, ln.s, px0 + 8, py0 + 8 + i * lh, { font: (ln.b ? 'bold ' : '') + fs + 'px ' + theme.font, color: ln.c, baseline: 'top' }));
        header(ctx, F.variant.label, { en: 'Forces ON the ' + F.variant.name.en + ' (m = ' + K.fmt(F.m, 1, 'en') + ' kg, g = 9.81 m/s²)', hr: 'Sile NA tijelo (m = ' + K.fmt(F.m, 1, 'hr') + ' kg, g = 9,81 m/s²)' });
      }

      // ---------- scene: apple and Earth ----------
      function drawApple(ctx, w, h) {
        const A = st.ap, F = A.m * G, gy = Math.round(h * 0.78), pxm = (gy - 70) / APPLE_H, ax = Math.round(w * 0.42);
        // Earth as a huge arc
        ctx.fillStyle = theme.ground; ctx.beginPath(); ctx.arc(w / 2, gy + w * 1.2, w * 1.2, 0, Math.PI * 2); ctx.fill();
        K.text(ctx, K.tr({ en: 'Earth   M = 5.97·10²⁴ kg', hr: 'Zemlja   M = 5,97·10²⁴ kg' }, lang), w / 2, h - 10, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center' });
        // branch
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.6); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 52); ctx.lineTo(ax + 30, 58); ctx.stroke();
        // apple
        const ay = gy - A.y * pxm - 12, r = 12 + A.m * 10;
        ctx.fillStyle = theme.c8; ctx.beginPath(); ctx.arc(ax, ay, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay - r); ctx.lineTo(ax + 3, ay - r - 7); ctx.stroke();
        ctx.fillStyle = theme.c6; ctx.beginPath(); ctx.ellipse(ax + 8, ay - r - 4, 6, 3, -0.5, 0, Math.PI * 2); ctx.fill();
        // the pair: Earth pulls the apple (down), the apple pulls Earth (up) — same length
        const len = K.clamp(h * 0.2, 50, 120), fn = 'bold 12px ' + theme.font;
        K.arrow(ctx, ax, ay, ax, ay + len, { color: theme.c1, width: 4, head: 12 });
        pill(ctx, K.tr({ en: 'Earth pulls the apple  F = ', hr: 'Zemlja privlači jabuku  F = ' }, lang) + K.fmt(F, 2, lang) + ' N', ax + 10, ay + len - 8, 'left', fn);
        const ex = ax + Math.round(w * 0.22);
        ctx.fillStyle = theme.c1; ctx.beginPath(); ctx.arc(ex, gy + 6, 5, 0, Math.PI * 2); ctx.fill();
        K.arrow(ctx, ex, gy + 6, ex, gy + 6 - len, { color: theme.c1, width: 4, head: 12 });
        pill(ctx, K.tr({ en: 'the apple pulls Earth  F = ', hr: 'jabuka privlači Zemlju  F = ' }, lang) + K.fmt(F, 2, lang) + ' N', ex + 10, gy - len + 10, 'left', fn);
        // readings beside the apple
        pill(ctx, 'm = ' + K.fmt(A.m, 2, lang) + ' kg   v = ' + K.fmt(A.v, 1, lang) + ' m/s   a = ' + K.fmt(G, 2, lang) + ' m/s²', ax - r - 8, ay, 'right', '11px ' + theme.font);
        pill(ctx, 'M = ' + K.fmt(5.97, 2, lang) + '·10²⁴ kg   a = ' + sci(F / M_EARTH, lang) + ' m/s² ≈ 0', ex + 10, gy + 24, 'left', '11px ' + theme.font);
        header(ctx, MODES[3].label, A.landed ? { en: 'Landed. Both forces were equal the whole time — only the accelerations differ.', hr: 'Pala je. Obje sile bile su jednake cijelo vrijeme — razlikuju se samo ubrzanja.' }
          : L.running ? { en: 'slow motion ×2', hr: 'usporeno ×2' } : { en: 'Press Play to drop the apple from ' + K.fmt(APPLE_H, 0, 'en') + ' m', hr: 'Pokreni i pusti jabuku s ' + K.fmt(APPLE_H, 0, 'hr') + ' m' });
      }

      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        if (st.mode === 'truck') drawTruck(ctx, w, h); else if (st.mode === 'dyno') drawDyno(ctx, w, h); else if (st.mode === 'fbd') drawFbd(ctx, w, h); else drawApple(ctx, w, h);
      }
      function reset() {
        L.stop(); resetTruck(); resetDyno(); resetApple(); clearPicks();
        updatePlay(); showControls(); refresh();
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); applyFbdLabels(); refresh(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
