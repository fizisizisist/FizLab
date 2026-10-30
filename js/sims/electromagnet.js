/* FizLab sim: Electromagnet — a coil around an iron nail lifts paperclips; Ørsted's wire deflects a compass. */
(function () {
  'use strict';
  const K = window.SimKit;
  const N_CLIPS = 20;
  const CORE_OFF = 0.05;      // without the iron core the field is ~20× weaker
  const COPPER = '#c17a3a', IRON = '#8e959e', STEEL = '#aab3bc';
  const DEF = { I: 1.5, turns: 20, closed: true, core: true, rev: false, dir: 'up' };
  function hash(i, j) { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); }
  function wrap(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }

  window.Sims.register({
    id: 'electromagnet',
    title: { en: 'Electromagnet', hr: 'Elektromagnet' },
    summary: {
      en: 'Wind a coil around a nail, switch the current on and lift paperclips. Then see how a current in a straight wire turns a compass needle.',
      hr: 'Namotaj zavojnicu oko čavla, uključi struju i podiži spajalice. Zatim pogledaj kako struja u ravnom vodiču zakreće iglu kompasa.'
    },
    tasks: [
      { en: 'Open the switch. What happens to the paperclips and the compass?', hr: 'Otvori prekidač. Što se dogodi sa spajalicama i kompasom?' },
      { en: 'Set 3 A and 60 turns. How many paperclips can you lift? Now turn off the iron core.', hr: 'Postavi 3 A i 60 namotaja. Koliko spajalica možeš podići? Sada isključi željeznu jezgru.' },
      { en: 'Press "Reverse battery". What happens to the N and S poles and the compass needle?', hr: 'Pritisni "Obrni bateriju". Što se dogodi s polovima N i S i iglom kompasa?' },
      { en: 'In "Wire and compass", change the current direction. Which way does the needle turn?', hr: 'U "Vodič i kompas" promijeni smjer struje. Na koju stranu se zakrene igla?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'coil', I: DEF.I, turns: DEF.turns, closed: DEF.closed, core: DEF.core, rev: DEF.rev, dir: DEF.dir,
        S: 0, lifted: 0, phase: 0, na: 0, nw: 0, oa: 0, ow: 0, clips: [] };
      for (let i = 0; i < N_CLIPS; i++) st.clips.push({ x: 0, y: 0, rot: (hash(i, 11) - 0.5) * 1.2, up: false });
      let geoA = null, geoB = null;

      // ---- controls ----
      const segMode = C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: [
        { value: 'coil', label: { en: 'Coil and nail', hr: 'Zavojnica i čavao' } }, { value: 'wire', label: { en: 'Wire and compass', hr: 'Vodič i kompas' } }],
        value: 'coil', onChange: v => { st.mode = v; applyMode(); refresh(); } });
      const slI = C.slider({ label: { en: 'Current I', hr: 'Struja I' }, min: 0, max: 3, step: 0.1, value: DEF.I, unit: 'A', digits: 1, onChange: v => { st.I = v; refresh(); } });
      const slN = C.slider({ label: { en: 'Number of turns', hr: 'Broj namotaja' }, min: 5, max: 60, step: 1, value: DEF.turns, digits: 0, onChange: v => { st.turns = Math.round(v); refresh(); } });
      const tgSwitch = C.toggle({ label: { en: 'Switch closed', hr: 'Prekidač zatvoren' }, value: DEF.closed, onChange: v => { st.closed = v; refresh(); } });
      const tgCore = C.toggle({ label: { en: 'Iron core (nail)', hr: 'Željezna jezgra (čavao)' }, value: DEF.core, onChange: v => { st.core = v; refresh(); } });
      const btnRev = C.button({ label: { en: 'Reverse battery', hr: 'Obrni bateriju' }, onClick: () => { st.rev = !st.rev; btnRev.setActive(st.rev); refresh(); } });
      const segDir = C.segmented({ label: { en: 'Current direction', hr: 'Smjer struje' }, options: [
        { value: 'up', label: { en: 'up (to the north)', hr: 'gore (prema sjeveru)' } }, { value: 'down', label: { en: 'down (to the south)', hr: 'dolje (prema jugu)' } }],
        value: DEF.dir, onChange: v => { st.dir = v; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outTurns = C.readout({ label: { en: 'Turns', hr: 'Namotaji' }, digits: 0 });
      const outI = C.readout({ label: { en: 'Current', hr: 'Struja' }, unit: 'A', digits: 1 });
      const outS = C.readout({ label: { en: 'Field strength (relative)', hr: 'Jakost polja (relativno)' }, digits: 1 });
      const outClips = C.readout({ label: { en: 'Paperclips lifted', hr: 'Podignute spajalice' }, digits: 0 });
      const outPoles = C.readout({ label: { en: 'Poles of the nail', hr: 'Polovi čavla' } });
      const outDef = C.readout({ label: { en: 'Needle deflection', hr: 'Otklon igle' }, unit: '°', digits: 0 });
      const note = C.note({ text: '' });

      function show(ctl, on) {
        const el = ctl.el;
        const f = (el.classList && el.classList.contains('sk-field')) ? el : ((el.closest && el.closest('.sk-field')) || el);
        f.style.display = on ? '' : 'none';
      }
      function applyMode() {
        const coil = st.mode === 'coil';
        [slN, tgCore, btnRev, outTurns, outS, outClips, outPoles].forEach(x => show(x, coil));
        [segDir, outDef].forEach(x => show(x, !coil));
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }

      // ---- physics ----
      function compute() {
        st.S = st.closed ? st.turns * st.I * (st.core ? 1 : CORE_OFF) : 0;
        st.lifted = Math.min(N_CLIPS, Math.floor(st.S / 10));
        st.clips.forEach((cl, i) => { cl.up = i < st.lifted; });
        // Ørsted: deflection grows with the current and saturates (wire above the compass)
        const d = st.closed ? 80 * (2 / Math.PI) * Math.atan(st.I / 0.7) : 0;
        st.defl = (st.dir === 'up' ? -1 : 1) * d;
      }
      function nIsRight() { return !st.rev; }
      function updateOut() {
        outTurns.set(st.turns); outI.set(st.I); outS.set(st.S); outClips.set(st.lifted); outDef.set(Math.abs(st.defl));
        if (st.S <= 0) outPoles.set({ en: 'no field (switch open or I = 0)', hr: 'nema polja (prekidač otvoren ili I = 0)' });
        else outPoles.set(nIsRight() ? { en: 'N right (tip), S left (head)', hr: 'N desno (vrh), S lijevo (glava)' } : { en: 'N left (head), S right (tip)', hr: 'N lijevo (glava), S desno (vrh)' });
        note.set(st.mode === 'coil'
          ? { en: 'A current in the coil makes the nail a magnet. More turns, more current and an iron core all make it stronger. Reversing the battery swaps the N and S poles. Blue dots = electrons (−), moving from − to +.',
              hr: 'Struja u zavojnici pretvara čavao u magnet. Više namotaja, jača struja i željezna jezgra čine ga jačim. Obrtanjem baterije zamijene se polovi N i S. Plave točke = elektroni (−), gibaju se od − prema +.' }
          : { en: 'An electric current creates a magnetic field (Ørsted, 1820). The wire lies above the compass: current to the north turns the red end of the needle west; reversing the current turns it east.',
              hr: 'Električna struja stvara magnetsko polje (Ørsted, 1820.). Vodič je iznad kompasa: struja prema sjeveru zakreće crveni kraj igle na zapad, a obrnuta struja na istok.' });
      }
      function refresh() { compute(); updateOut(); draw(); }
      function reset() {
        st.I = DEF.I; st.turns = DEF.turns; st.closed = DEF.closed; st.core = DEF.core; st.rev = DEF.rev; st.dir = DEF.dir; st.phase = 0;
        slI.set(DEF.I); slN.set(DEF.turns); tgSwitch.set(DEF.closed); tgCore.set(DEF.core); segDir.set(DEF.dir); btnRev.setActive(false);
        compute();
        st.clips.forEach(cl => { cl.x = -1; });   // forces instant placement in stepA()
        stepA(0.016);
        st.na = compassTarget(layoutA()); st.nw = 0; st.oa = st.defl * Math.PI / 180; st.ow = 0;   // needles start settled
        updateOut(); draw();
      }

      // ---- layout ----
      function layoutA() {
        const w = cv.w, h = cv.h;
        const nx = w * 0.5, ny = h * 0.4, nL = K.clamp(w * 0.46, 190, 340), nT = 14;
        const cL = nL * 0.58, cR = nT / 2 + 7, by = h - 44;
        const clx = nx - cL / 2, crx = nx + cL / 2;
        return { w, h, nx, ny, nL, nT, cL, cR, by, clx, crx, bx: nx - cL * 0.25, xsw: nx + cL * 0.25, tipX: nx + nL / 2, headX: nx - nL / 2,
          comp: { x: K.clamp(w * 0.13, 44, 90), y: h * 0.72, r: K.clamp(w * 0.05, 18, 28) } };
      }
      function layoutB() {
        const w = cv.w, h = cv.h;
        return { w, h, x: w * 0.5, cy: h * 0.53, R: Math.min(h * 0.3, w * 0.2), ySw: h - 44 };
      }
      function electronPathA(g) {
        const pts = [[g.bx - 7, g.by], [g.clx, g.by], [g.clx, g.ny - g.cR], [g.crx, g.ny - g.cR], [g.crx, g.by], [g.bx + 7, g.by]];
        if (st.rev) pts.reverse();
        return pts;
      }
      function pointAt(pts, s) {
        for (let i = 1; i < pts.length; i++) {
          const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], l = Math.hypot(dx, dy);
          if (s <= l || i === pts.length - 1) { const t = l > 0 ? K.clamp(s / l, 0, 1) : 0; return [pts[i - 1][0] + dx * t, pts[i - 1][1] + dy * t]; }
          s -= l;
        }
        return pts[0];
      }
      function pathLen(pts) { let L0 = 0; for (let i = 1; i < pts.length; i++) L0 += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L0; }

      // ---- step ----
      // compass: field of the nail (two poles, N = +, S = −) plus Earth's field pointing up (north); returns the screen angle of B
      function compassTarget(g) {
        const sgn = nIsRight() ? 1 : -1, c = g.comp;
        let bx = 0, by = -1;
        [[g.tipX, g.ny, sgn], [g.headX, g.ny, -sgn]].forEach(p => {
          const dx = c.x - p[0], dy = c.y - p[1], r2 = dx * dx + dy * dy + 100, r = Math.sqrt(r2), f = p[2] * st.S * 3000 / (r2 * r);
          bx += dx * f; by += dy * f;
        });
        return Math.atan2(by, bx);
      }
      function stepA(dt) {
        const g = layoutA(), k = ctx.reducedMotion ? 1 : Math.min(1, 10 * dt);
        st.clips.forEach((cl, i) => {
          let tx, ty;
          if (cl.up) { const col = i % 4, row = Math.floor(i / 4); tx = g.tipX - 10 + col * 7 + (row % 2) * 3; ty = g.ny + 9 + row * 12; }
          else { tx = g.tipX + 4 + (hash(i, 3) - 0.5) * 72; ty = g.h - 20 - hash(i, 7) * 14; }
          if (cl.x < 0) { cl.x = tx; cl.y = ty; }
          cl.x += (tx - cl.x) * k; cl.y += (ty - cl.y) * k;
        });
        const target = compassTarget(g);
        const acc = -60 * wrap(st.na - target) - 8 * st.nw;
        st.nw += acc * dt; st.na += st.nw * dt;
        if (ctx.reducedMotion) { st.na = target; st.nw = 0; }
      }
      function stepB(dt) {
        const target = st.defl * Math.PI / 180;
        const acc = -60 * wrap(st.oa - target) - 8 * st.ow;
        st.ow += acc * dt; st.oa += st.ow * dt;
        if (ctx.reducedMotion) { st.oa = target; st.ow = 0; }
      }

      // ---- drawing helpers ----
      function drawCompass(c, x, y, r, ang, letters) {
        c.save();
        c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 2;
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.strokeStyle = theme.line; c.lineWidth = 1; c.beginPath();
        for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); c.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92); }
        c.stroke();
        const ux = Math.sin(ang), uy = -Math.cos(ang), len = r * 0.72, hw = Math.max(3, r * 0.14);
        c.fillStyle = theme.c8; c.beginPath(); c.moveTo(x + ux * len, y + uy * len); c.lineTo(x - uy * hw, y + ux * hw); c.lineTo(x + uy * hw, y - ux * hw); c.closePath(); c.fill();
        c.fillStyle = theme.c1; c.beginPath(); c.moveTo(x - ux * len, y - uy * len); c.lineTo(x - uy * hw, y + ux * hw); c.lineTo(x + uy * hw, y - ux * hw); c.closePath(); c.fill();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(x, y, 2.5, 0, Math.PI * 2); c.fill();
        c.restore();
        if (letters) {
          const f = 'bold ' + Math.round(K.clamp(r * 0.2, 10, 14)) + 'px ' + theme.font, o = r + 12;
          K.text(c, letters[0], x, y - o, { font: f, color: theme.fg, align: 'center', baseline: 'middle' });
          K.text(c, letters[1], x + o, y, { font: f, color: theme.fg, align: 'center', baseline: 'middle' });
          K.text(c, letters[2], x, y + o, { font: f, color: theme.fg, align: 'center', baseline: 'middle' });
          K.text(c, letters[3], x - o, y, { font: f, color: theme.fg, align: 'center', baseline: 'middle' });
        }
      }
      function drawSwitch(c, x, y, hh, vertical) {
        c.save();
        c.fillStyle = theme.sky;
        if (vertical) c.fillRect(x - 3, y - hh - 1, 6, 2 * hh + 2); else c.fillRect(x - hh - 1, y - 3, 2 * hh + 2, 6);
        c.strokeStyle = theme.fg; c.lineWidth = 3; c.lineCap = 'round';
        const ang = st.closed ? 0 : 0.62;
        c.beginPath();
        if (vertical) { c.moveTo(x, y + hh); c.lineTo(x + 2 * hh * Math.sin(ang), y + hh - 2 * hh * Math.cos(ang)); }
        else { c.moveTo(x - hh, y); c.lineTo(x - hh + 2 * hh * Math.cos(ang), y - 2 * hh * Math.sin(ang)); }
        c.stroke();
        c.fillStyle = theme.fg;
        [[vertical ? x : x - hh, vertical ? y + hh : y], [vertical ? x : x + hh, vertical ? y - hh : y]].forEach(p => { c.beginPath(); c.arc(p[0], p[1], 3.5, 0, Math.PI * 2); c.fill(); });
        c.restore();
        const lab = K.tr(st.closed ? { en: 'closed', hr: 'zatvoren' } : { en: 'open', hr: 'otvoren' }, lang);
        K.text(c, lab, vertical ? x + 16 : x, vertical ? y : y + 16, { font: '11px ' + theme.font, color: theme.muted, align: vertical ? 'left' : 'center', baseline: 'middle' });
      }
      function drawElectrons(c, pts, speedI) {
        if (!st.closed || speedI <= 0) return;
        const len = pathLen(pts), sp = 20, off = ((st.phase % sp) + sp) % sp;
        c.save(); c.fillStyle = theme.c1;
        for (let d = off; d < len; d += sp) { const p = pointAt(pts, d); c.beginPath(); c.arc(p[0], p[1], 3.2, 0, Math.PI * 2); c.fill(); }
        c.restore();
      }
      function drawClip(c, cl) {
        c.save(); c.translate(cl.x, cl.y); c.rotate(cl.up ? 0 : cl.rot);
        c.strokeStyle = STEEL; c.lineWidth = 2; K.roundRect(c, -3.5, -7, 7, 14, 3); c.stroke();
        c.strokeStyle = K.withAlpha(theme.fg, 0.6); c.lineWidth = 0.8; K.roundRect(c, -3.5, -7, 7, 14, 3); c.stroke();
        c.restore();
      }

      function drawA() {
        const c = cv.ctx, g = layoutA(), w = g.w, h = g.h, sat = 1 - Math.exp(-st.S / 40), nRight = nIsRight();
        geoA = g;
        // field lines (nested loops around the coil, arrows from N to S outside)
        if (st.S > 0) {
          c.save(); c.strokeStyle = K.withAlpha(theme.fg, 0.15 + 0.5 * sat); c.lineWidth = 1.5;
          for (let k = 1; k <= 4; k++) {
            const rx = g.cL / 2 + k * g.nL * 0.09, ry = g.cR + k * h * 0.055;
            c.beginPath(); c.ellipse(g.nx, g.ny, rx, ry, 0, 0, Math.PI * 2); c.stroke();
            const d = nRight ? -1 : 1;
            K.arrow(c, g.nx - d * 7, g.ny - ry, g.nx + d * 7, g.ny - ry, { color: K.withAlpha(theme.fg, 0.2 + 0.6 * sat), width: 1.5, head: 7 });
            K.arrow(c, g.nx - d * 7, g.ny + ry, g.nx + d * 7, g.ny + ry, { color: K.withAlpha(theme.fg, 0.2 + 0.6 * sat), width: 1.5, head: 7 });
          }
          c.restore();
        }
        // wires
        const path = electronPathA(g);
        c.save(); c.strokeStyle = COPPER; c.lineWidth = 3; c.lineJoin = 'round'; c.lineCap = 'round';
        c.beginPath(); path.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
        // nail (or empty core)
        c.save();
        if (st.core) {
          c.fillStyle = IRON; c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(g.headX + 5, g.ny - g.nT / 2); c.lineTo(g.tipX - 14, g.ny - g.nT / 2); c.lineTo(g.tipX, g.ny); c.lineTo(g.tipX - 14, g.ny + g.nT / 2); c.lineTo(g.headX + 5, g.ny + g.nT / 2); c.closePath(); c.fill(); c.stroke();
          c.fillRect(g.headX, g.ny - g.nT / 2 - 4, 5, g.nT + 8); c.strokeRect(g.headX, g.ny - g.nT / 2 - 4, 5, g.nT + 8);
        } else {
          c.strokeStyle = K.withAlpha(theme.fg, 0.3); c.lineWidth = 1; c.setLineDash([4, 4]); c.strokeRect(g.headX, g.ny - g.nT / 2, g.nL, g.nT); c.setLineDash([]);
          K.text(c, K.tr({ en: 'no iron core', hr: 'bez željezne jezgre' }, lang), g.tipX + 6, g.ny, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
        }
        c.restore();
        // coil turns
        c.save(); c.strokeStyle = COPPER; c.lineWidth = 1.6;
        const pitch = g.cL / st.turns, rx = Math.max(1.4, Math.min(6, pitch * 0.4));
        for (let t = 0; t < st.turns; t++) { c.beginPath(); c.ellipse(g.clx + (t + 0.5) * pitch, g.ny, rx, g.cR, 0, 0, Math.PI * 2); c.stroke(); }
        c.restore();
        drawElectrons(c, path, st.I);
        // battery (plates vertical) and switch
        c.save(); c.fillStyle = theme.sky; c.fillRect(g.bx - 8, g.by - 12, 16, 24);
        c.strokeStyle = theme.fg; c.lineCap = 'round';
        const plusX = st.rev ? g.bx - 4 : g.bx + 4, minusX = st.rev ? g.bx + 4 : g.bx - 4;
        c.lineWidth = 2.5; c.beginPath(); c.moveTo(plusX, g.by - 14); c.lineTo(plusX, g.by + 14); c.stroke();
        c.lineWidth = 6; c.beginPath(); c.moveTo(minusX, g.by - 7); c.lineTo(minusX, g.by + 7); c.stroke();
        c.restore();
        K.text(c, '+', plusX + (st.rev ? -10 : 10), g.by - 18, { font: 'bold 14px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, '−', minusX + (st.rev ? 10 : -10), g.by - 18, { font: 'bold 14px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        drawSwitch(c, g.xsw, g.by, 16, false);
        // poles
        if (st.S > 0) {
          const nX = nRight ? g.tipX + 18 : g.headX - 18, sX = nRight ? g.headX - 18 : g.tipX + 18;
          [[nX, theme.c8, 'N'], [sX, theme.c1, 'S']].forEach(p => {
            c.fillStyle = p[1]; c.beginPath(); c.arc(p[0], g.ny, 11, 0, Math.PI * 2); c.fill();
            K.text(c, p[2], p[0], g.ny + 1, { font: 'bold 13px ' + theme.fontDisplay, color: '#ffffff', align: 'center', baseline: 'middle' });
          });
        }
        // paperclips: pile first, lifted ones last
        st.clips.forEach(cl => { if (!cl.up) drawClip(c, cl); });
        st.clips.forEach(cl => { if (cl.up) drawClip(c, cl); });
        drawCompass(c, g.comp.x, g.comp.y, g.comp.r, st.na + Math.PI / 2, null);   // screen angle → compass angle (0 = north/up)
        K.text(c, K.tr({ en: 'compass', hr: 'kompas' }, lang), g.comp.x, g.comp.y + g.comp.r + 12, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        // header
        K.text(c, K.tr({ en: 'Electromagnet: ', hr: 'Elektromagnet: ' }, lang) + K.fmt(st.turns, 0, lang) + ' ' + K.tr({ en: 'turns', hr: 'namotaja' }, lang) + ' × ' + K.fmt(st.closed ? st.I : 0, 1, lang) + ' A' +
          (st.core ? '' : ' × ' + K.fmt(CORE_OFF, 2, lang)) + '  →  ' + K.tr({ en: 'strength ', hr: 'jakost ' }, lang) + K.fmt(st.S, 1, lang),
          12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'Paperclips lifted: ', hr: 'Podignute spajalice: ' }, lang) + st.lifted + ' / ' + N_CLIPS + '   (' + K.tr({ en: 'one per 10 units of strength', hr: 'jedna na 10 jedinica jakosti' }, lang) + ')',
          12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }
      function drawB() {
        const c = cv.ctx, g = layoutB(), w = g.w, h = g.h;
        geoB = g;
        const up = st.dir === 'up';
        drawCompass(c, g.x, g.cy, g.R, st.oa, lang === 'hr' ? ['S', 'I', 'J', 'Z'] : ['N', 'E', 'S', 'W']);
        // the wire lies above the compass (drawn on top, slightly transparent)
        c.save(); c.strokeStyle = K.withAlpha(COPPER, 0.85); c.lineWidth = 6; c.lineCap = 'round';
        c.beginPath(); c.moveTo(g.x, 14); c.lineTo(g.x, h - 14); c.stroke(); c.restore();
        const pts = up ? [[g.x, h - 14], [g.x, 14]] : [[g.x, 14], [g.x, h - 14]];   // electrons move opposite to I
        drawElectrons(c, pts, st.I);
        drawSwitch(c, g.x, g.ySw, 14, true);
        // conventional current arrow next to the wire
        if (st.closed && st.I > 0) {
          const ax = g.x + g.R + 40, y0 = up ? g.cy + 40 : g.cy - 40, y1 = up ? g.cy - 40 : g.cy + 40;
          K.arrow(c, ax, y0, ax, y1, { color: theme.c2, width: 3, head: 10 });
          K.text(c, 'I = ' + K.fmt(st.I, 1, lang) + ' A', ax + 10, g.cy, { font: 'bold italic 13px ' + theme.font, color: theme.fg, baseline: 'middle' });
          // field direction at the compass
          const bx = up ? -1 : 1;
          K.arrow(c, g.x - g.R - 30, g.cy, g.x - g.R - 30 + bx * 36, g.cy, { color: theme.c3, width: 3, head: 10 });
          K.text(c, 'B', g.x - g.R - 30 + bx * 18, g.cy - 14, { font: 'bold italic 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        }
        K.text(c, K.tr({ en: 'Wire above the compass. ', hr: 'Vodič iznad kompasa. ' }, lang) + K.tr(st.closed && st.I > 0 ? (up ? { en: 'Current flows up (north).', hr: 'Struja teče gore (sjever).' } : { en: 'Current flows down (south).', hr: 'Struja teče dolje (jug).' }) : { en: 'No current.', hr: 'Nema struje.' }, lang),
          12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'Needle deflection: ', hr: 'Otklon igle: ' }, lang) + K.fmt(Math.abs(st.defl), 0, lang) + '°' + (st.defl ? (st.defl < 0 ? K.tr({ en: ' to the west', hr: ' prema zapadu' }, lang) : K.tr({ en: ' to the east', hr: ' prema istoku' }, lang)) : ''),
          12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        K.text(c, K.tr({ en: 'An electric current creates a magnetic field.', hr: 'Električna struja stvara magnetsko polje.' }, lang), w / 2, h - 8, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function draw() {
        const c = cv.ctx; c.clearRect(0, 0, cv.w, cv.h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, cv.w, cv.h);
        if (st.mode === 'coil') drawA(); else drawB();
      }

      // ---- pointer: click the switch ----
      function nearSwitch(p) {
        if (st.mode === 'coil') return geoA && Math.hypot(p.x - geoA.xsw, p.y - geoA.by) < 28;
        return geoB && Math.hypot(p.x - geoB.x, p.y - geoB.ySw) < 28;
      }
      const onDown = ev => { const p = cv.pointer(ev); if (nearSwitch(p)) { ev.preventDefault(); st.closed = !st.closed; tgSwitch.set(st.closed); refresh(); } };
      const onMove = ev => { cv.canvas.style.cursor = nearSwitch(cv.pointer(ev)) ? 'pointer' : 'default'; };
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);

      const L = K.loop(dt => {
        if (st.closed && st.I > 0) { st.phase += dt * Math.min(300, 80 * st.I); if (st.phase > 20000) st.phase -= 20000; }
        if (st.mode === 'coil') stepA(dt); else stepB(dt);
        draw();
      });
      cv.onResize(() => { st.clips.forEach(cl => { cl.x = -1; }); stepA(0.016); draw(); });
      applyMode();
      reset();
      if (!ctx.reducedMotion) L.start();
      updatePlay();
      return {
        destroy() { L.destroy(); cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
