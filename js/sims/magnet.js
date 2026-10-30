/* FizLab sim: Magnets and Compasses — the field of one or two bar magnets (compass needles, field lines, iron filings) and "what sticks to a magnet?". */
(function () {
  'use strict';
  const K = window.SimKit;
  const ITEMS = [
    { id: 'nail', mag: true, shape: 'nail', color: '#8e959e', w: 48, h: 10, name: { en: 'Iron nail', hr: 'Željezni čavao' }, mat: { en: 'iron', hr: 'željezo' } },
    { id: 'clip', mag: true, shape: 'clip', color: '#aab3bc', w: 16, h: 32, name: { en: 'Steel paperclip', hr: 'Čelična spajalica' }, mat: { en: 'steel', hr: 'čelik' } },
    { id: 'copper', mag: false, shape: 'coin', color: '#c07a3c', w: 26, h: 26, name: { en: 'Copper coin', hr: 'Bakreni novčić' }, mat: { en: 'copper', hr: 'bakar' } },
    { id: 'foil', mag: false, shape: 'foil', color: '#cdd5dd', w: 34, h: 26, name: { en: 'Aluminium foil', hr: 'Alu-folija' }, mat: { en: 'aluminium', hr: 'aluminij' } },
    { id: 'ruler', mag: false, shape: 'ruler', colorKey: 'c4', w: 58, h: 12, name: { en: 'Plastic ruler', hr: 'Plastično ravnalo' }, mat: { en: 'plastic', hr: 'plastika' } },
    { id: 'nickel', mag: true, shape: 'coin', color: '#b9bec4', w: 24, h: 24, name: { en: 'Nickel coin', hr: 'Niklov novčić' }, mat: { en: 'nickel (pure)', hr: 'nikal (čisti)' } },
    { id: 'wood', mag: false, shape: 'stick', color: '#a8744a', w: 52, h: 8, name: { en: 'Wooden stick', hr: 'Drveni štapić' }, mat: { en: 'wood', hr: 'drvo' } },
    { id: 'magnet2', mag: true, shape: 'magnet', w: 40, h: 12, name: { en: 'Small magnet', hr: 'Mali magnet' }, mat: { en: 'magnet', hr: 'magnet' } }
  ];
  const ZONE = 70;        // px: a magnetic item this close to the big magnet jumps to it
  const B_REF = 0.004;    // field value that saturates the filings' alpha
  function hash(i, j) { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); }

  window.Sims.register({
    id: 'magnet',
    title: { en: 'Magnets and Compasses', hr: 'Magneti i kompasi' },
    summary: {
      en: 'Drag bar magnets around and watch compass needles, field lines and iron filings follow the field. Then test which objects a magnet attracts.',
      hr: 'Povlači štapićaste magnete i gledaj kako igle kompasa, silnice i željezna strugotina slijede polje. Zatim ispitaj koje predmete magnet privlači.'
    },
    tasks: [
      { en: 'Where do the field lines start and end? Where are the compass needles turned the most?', hr: 'Gdje silnice počinju, a gdje završavaju? Gdje su igle kompasa najviše zakrenute?' },
      { en: 'Add a second magnet and bring N near N. Then press Flip. When do the magnets attract?', hr: 'Dodaj drugi magnet i približi N k N. Zatim pritisni Okreni. Kad se magneti privlače?' },
      { en: 'In "What sticks?" try every item. Which materials are magnetic? What do they have in common?', hr: 'U "Što privlači magnet?" ispitaj svaki predmet. Koji su materijali magnetični? Što im je zajedničko?' },
      { en: 'Is the copper coin attracted? And the aluminium foil? Not every metal is magnetic!', hr: 'Privlači li magnet bakreni novčić? A alu-foliju? Nije svaki metal magnetičan!' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'field', two: false, needles: true, lines: true, filings: false,
        mags: [{ u: 0.5, v: 0.5, a: 0 }, { u: 0.72, v: 0.5, a: 0 }], drag: null, dirty: true,
        cache: { lines: [], filings: [] }, items: [], last: null, dragItem: null };
      ITEMS.forEach(def => st.items.push({ def, x: 0, y: 0, hx: 0, hy: 0, tx: 0, ty: 0, state: 'home', tested: null, escaping: false }));

      // ---- controls ----
      const segMode = C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: [
        { value: 'field', label: { en: 'Field', hr: 'Polje' } }, { value: 'sticks', label: { en: 'What sticks?', hr: 'Što privlači magnet?' } }],
        value: 'field', onChange: v => { st.mode = v; st.dirty = true; applyMode(); if (v === 'sticks') layoutItems(); updateOut(); draw(); } });
      const tgTwo = C.toggle({ label: { en: 'Second magnet', hr: 'Drugi magnet' }, value: false, onChange: v => {
        st.two = v; if (v) { st.mags[0].u = 0.3; st.mags[0].v = 0.5; st.mags[1] = { u: 0.7, v: 0.5, a: 0 }; } else { st.mags[0].u = 0.5; st.mags[0].v = 0.5; }
        btnFlip2.setDisabled(!v); st.dirty = true; updateOut(); draw(); } });
      const tgNeedles = C.toggle({ label: { en: 'Compass needles', hr: 'Igle kompasa' }, value: true, onChange: v => { st.needles = v; draw(); } });
      const tgLines = C.toggle({ label: { en: 'Field lines', hr: 'Silnice polja' }, value: true, onChange: v => { st.lines = v; st.dirty = true; draw(); } });
      const tgFil = C.toggle({ label: { en: 'Iron filings', hr: 'Željezna strugotina' }, value: false, onChange: v => { st.filings = v; st.dirty = true; draw(); } });
      const btnFlip1 = C.button({ label: { en: 'Flip magnet 1', hr: 'Okreni magnet 1' }, onClick: () => { st.mags[0].a += Math.PI; st.dirty = true; updateOut(); draw(); } });
      const btnFlip2 = C.button({ label: { en: 'Flip magnet 2', hr: 'Okreni magnet 2' }, onClick: () => { st.mags[1].a += Math.PI; st.dirty = true; updateOut(); draw(); } });
      btnFlip2.setDisabled(true);
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outPoles = C.readout({ label: { en: 'Facing poles', hr: 'Sučeljeni polovi' } });
      const outForce = C.readout({ label: { en: 'The magnets', hr: 'Magneti se' } });
      const outItem = C.readout({ label: { en: 'Item', hr: 'Predmet' } });
      const outMat = C.readout({ label: { en: 'Material', hr: 'Materijal' } });
      const outMag = C.readout({ label: { en: 'Magnetic?', hr: 'Magnetično?' } });
      const note = C.note({ text: '' });

      function show(ctl, on) {
        const el = ctl.el;
        const f = (el.classList && el.classList.contains('sk-field')) ? el : ((el.closest && el.closest('.sk-field')) || el);
        f.style.display = on ? '' : 'none';
      }
      function applyMode() {
        const f = st.mode === 'field';
        [tgTwo, tgNeedles, tgLines, tgFil, btnFlip1, btnFlip2, outPoles, outForce].forEach(x => show(x, f));
        [outItem, outMat, outMag].forEach(x => show(x, !f));
      }
      function activeMags() { return st.two ? st.mags : [st.mags[0]]; }
      function updateOut() {
        const P = poles(), it = interaction(P);
        if (it) {
          outPoles.set((it.a.s > 0 ? 'N' : 'S') + ' – ' + (it.b.s > 0 ? 'N' : 'S'));
          outForce.set(it.attract ? { en: 'attract', hr: 'privlače' } : { en: 'repel', hr: 'odbijaju' });
          outForce.setColor(it.attract ? theme.good : theme.warn);
        } else { outPoles.set({ en: 'one magnet', hr: 'jedan magnet' }); outForce.set('–'); outForce.setColor(''); }
        if (st.last) {
          outItem.set(st.last.def.name); outMat.set(st.last.def.mat);
          outMag.set(st.last.def.mag ? { en: 'yes – it sticks', hr: 'da – privlači ga' } : { en: 'no – it does not stick', hr: 'ne – ne privlači ga' });
          outMag.setColor(st.last.def.mag ? theme.good : theme.muted);
        } else { outItem.set({ en: 'drag an item to the magnet', hr: 'povuci predmet do magneta' }); outMat.set('–'); outMag.set('–'); outMag.setColor(''); }
        note.set(st.mode === 'field'
          ? { en: 'Field lines run from the N pole to the S pole outside the magnet. A compass needle turns so its red (north) end points along the field. Unlike poles attract, like poles repel.',
              hr: 'Silnice izvan magneta idu od sjevernog (N) do južnog (S) pola. Igla kompasa zakrene se tako da njezin crveni (sjeverni) kraj pokazuje smjer polja. Raznoimeni polovi se privlače, istoimeni odbijaju.' }
          : { en: 'A magnet attracts only a few materials: iron, steel (which is mostly iron), nickel and cobalt. Copper, aluminium, plastic and wood are not magnetic.',
              hr: 'Magnet privlači samo neke materijale: željezo, čelik (uglavnom željezo), nikal i kobalt. Bakar, aluminij, plastika i drvo nisu magnetični.' });
      }
      function reset() {
        st.two = false; tgTwo.set(false); btnFlip2.setDisabled(true);
        st.needles = true; tgNeedles.set(true); st.lines = true; tgLines.set(true); st.filings = false; tgFil.set(false);
        st.mags = [{ u: 0.5, v: 0.5, a: 0 }, { u: 0.72, v: 0.5, a: 0 }]; st.drag = null; st.dirty = true;
        st.items.forEach(it => { it.state = 'home'; it.tested = null; it.escaping = false; }); st.last = null; st.dragItem = null;
        layoutItems(); updateOut(); draw();
      }

      // ---- field model: each magnet = +pole at N, −pole at S ----
      function magGeo(m) {
        const w = cv.w, h = cv.h, L = K.clamp(w * 0.24, 90, 160), W = L * 0.32;
        const x = m.u * w, y = m.v * h, cx = Math.cos(m.a), sx = Math.sin(m.a);
        return { x, y, L, W, cx, sx, N: [x + cx * L * 0.42, y + sx * L * 0.42], S: [x - cx * L * 0.42, y - sx * L * 0.42] };
      }
      function poles() {
        const out = [];
        activeMags().forEach((m, i) => { const g = magGeo(m); out.push({ x: g.N[0], y: g.N[1], s: 1, mag: i }); out.push({ x: g.S[0], y: g.S[1], s: -1, mag: i }); });
        return out;
      }
      function field(P, x, y) {
        let bx = 0, by = 0;
        for (let i = 0; i < P.length; i++) {
          const p = P[i], dx = x - p.x, dy = y - p.y, r2 = dx * dx + dy * dy + 40, inv = p.s / (r2 * Math.sqrt(r2));
          bx += dx * inv; by += dy * inv;
        }
        return [bx * 3000, by * 3000];
      }
      function insideMagnet(x, y, pad) {
        const ms = activeMags();
        for (let i = 0; i < ms.length; i++) {
          const g = magGeo(ms[i]), dx = x - g.x, dy = y - g.y, lx = dx * g.cx + dy * g.sx, ly = -dx * g.sx + dy * g.cx;
          if (Math.abs(lx) < g.L / 2 + pad && Math.abs(ly) < g.W / 2 + pad) return i;
        }
        return -1;
      }
      function traceLines(P) {
        const w = cv.w, h = cv.h, out = [], S = P.filter(p => p.s < 0);
        P.filter(p => p.s > 0).forEach(p => {
          for (let i = 0; i < 12; i++) {
            const ang = (i + 0.5) / 12 * Math.PI * 2;
            let x = p.x + Math.cos(ang) * 10, y = p.y + Math.sin(ang) * 10;
            const pts = [[x, y]];
            for (let s = 0; s < 700; s++) {
              let b = field(P, x, y), m = Math.hypot(b[0], b[1]); if (m < 1e-9) break;
              b = field(P, x + b[0] / m * 2.5, y + b[1] / m * 2.5); m = Math.hypot(b[0], b[1]); if (m < 1e-9) break;   // RK2 (midpoint)
              x += b[0] / m * 5; y += b[1] / m * 5;
              pts.push([x, y]);
              if (x < -30 || x > w + 30 || y < -30 || y > h + 30) break;
              let hit = false;
              for (let k = 0; k < S.length; k++) if (Math.hypot(x - S[k].x, y - S[k].y) < 9) { pts.push([S[k].x, S[k].y]); hit = true; break; }
              if (hit) break;
            }
            if (pts.length > 3) out.push(pts);
          }
        });
        return out;
      }
      function makeFilings(P) {
        const w = cv.w, h = cv.h, sp = 17, out = [];
        for (let i = 0; i * sp < w; i++) for (let j = 0; j * sp < h; j++) {
          const x = i * sp + sp * (0.15 + 0.7 * hash(i, j)), y = j * sp + sp * (0.15 + 0.7 * hash(j + 31, i + 17));
          if (insideMagnet(x, y, 4) >= 0) continue;
          const b = field(P, x, y), m = Math.hypot(b[0], b[1]); if (m < 1e-9) continue;
          out.push([x, y, b[0] / m, b[1] / m, K.clamp(0.15 + m / B_REF, 0, 0.9)]);
        }
        return out;
      }
      function interaction(P) {
        if (!st.two) return null;
        let best = null;
        P.forEach(a => P.forEach(b => { if (a.mag === 0 && b.mag === 1) { const d = Math.hypot(a.x - b.x, a.y - b.y); if (!best || d < best.d) best = { a, b, d }; } }));
        if (best) best.attract = best.a.s !== best.b.s;
        return best;
      }

      // ---- drawing: field mode ----
      function drawMagnet(c, g, label) {
        c.save(); c.translate(g.x, g.y); c.rotate(Math.atan2(g.sx, g.cx));
        c.fillStyle = theme.c1; c.fillRect(-g.L / 2, -g.W / 2, g.L / 2, g.W);
        c.fillStyle = theme.c8; c.fillRect(0, -g.W / 2, g.L / 2, g.W);
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.strokeRect(-g.L / 2, -g.W / 2, g.L, g.W);
        c.restore();
        const f = 'bold ' + Math.round(g.W * 0.55) + 'px ' + theme.fontDisplay;
        K.text(c, 'N', g.x + g.cx * g.L * 0.25, g.y + g.sx * g.L * 0.25, { font: f, color: '#ffffff', align: 'center', baseline: 'middle' });
        K.text(c, 'S', g.x - g.cx * g.L * 0.25, g.y - g.sx * g.L * 0.25, { font: f, color: '#ffffff', align: 'center', baseline: 'middle' });
        if (label) K.text(c, label, g.x, g.y - g.W / 2 - 10, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function drawNeedle(c, x, y, ux, uy, len) {
        c.strokeStyle = theme.c8; c.lineWidth = 2.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + ux * len, y + uy * len); c.stroke();
        c.strokeStyle = theme.c1; c.beginPath(); c.moveTo(x, y); c.lineTo(x - ux * len, y - uy * len); c.stroke();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(x, y, 1.8, 0, Math.PI * 2); c.fill();
      }
      function drawField() {
        const c = cv.ctx, w = cv.w, h = cv.h, P = poles();
        if (st.dirty) { st.cache.lines = st.lines ? traceLines(P) : []; st.cache.filings = st.filings ? makeFilings(P) : []; st.dirty = false; }
        if (st.filings) {
          c.save(); c.lineWidth = 1.5; c.lineCap = 'round';
          st.cache.filings.forEach(f => { c.strokeStyle = K.withAlpha(theme.fg, f[4]); c.beginPath(); c.moveTo(f[0] - f[2] * 4.5, f[1] - f[3] * 4.5); c.lineTo(f[0] + f[2] * 4.5, f[1] + f[3] * 4.5); c.stroke(); });
          c.restore();
        }
        if (st.lines) {
          c.save(); c.strokeStyle = K.withAlpha(theme.fg, 0.5); c.lineWidth = 1.5; c.lineJoin = 'round';
          st.cache.lines.forEach(pts => {
            c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
            const k = Math.floor(pts.length * 0.45);
            if (k > 2 && k < pts.length - 1) K.arrow(c, pts[k - 1][0], pts[k - 1][1], pts[k][0], pts[k][1], { color: K.withAlpha(theme.fg, 0.6), width: 1.5, head: 7 });
          });
          c.restore();
        }
        if (st.needles) {
          const sp = w >= 600 ? 46 : 40;
          c.save();
          for (let x = sp / 2; x < w; x += sp) for (let y = 46 + sp / 2; y < h - 10; y += sp) {
            if (insideMagnet(x, y, 10) >= 0) continue;
            const b = field(P, x, y), m = Math.hypot(b[0], b[1]); if (m < 1e-9) continue;
            drawNeedle(c, x, y, b[0] / m, b[1] / m, 7);
          }
          c.restore();
        }
        activeMags().forEach((m, i) => drawMagnet(c, magGeo(m), st.two ? String(i + 1) : null));
        const it = interaction(P);
        if (it) {
          const a = it.a, b = it.b, d = Math.max(it.d, 1), ux = (b.x - a.x) / d, uy = (b.y - a.y) / d, len = K.clamp(d / 2 - 12, 10, 40), s = it.attract ? 1 : -1;
          K.arrow(c, a.x + ux * 10, a.y + uy * 10, a.x + ux * (10 + s * len), a.y + uy * (10 + s * len), { color: theme.c2, width: 3, head: 9 });
          K.arrow(c, b.x - ux * 10, b.y - uy * 10, b.x - ux * (10 + s * len), b.y - uy * (10 + s * len), { color: theme.c2, width: 3, head: 9 });
          const lab = K.tr(it.attract ? { en: 'attract', hr: 'privlače se' } : { en: 'repel', hr: 'odbijaju se' }, lang);
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 34;
          c.save(); c.font = 'bold 13px ' + theme.font; const tw = c.measureText(lab).width + 16;
          c.fillStyle = theme.surface; K.roundRect(c, mx - tw / 2, my - 11, tw, 22, 11); c.fill(); c.restore();
          K.text(c, lab, mx, my, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        }
        K.text(c, K.tr({ en: 'Drag the magnets. Red = north pole (N), blue = south pole (S).', hr: 'Povlači magnete. Crveno = sjeverni pol (N), plavo = južni pol (S).' }, lang), 12, 14,
          { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'Needles: the red end points along the field, from N to S.', hr: 'Igle: crveni kraj pokazuje smjer polja, od N prema S.' }, lang), 12, 32,
          { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }

      // ---- "what sticks?" mode ----
      function topMag() { const w = cv.w, h = cv.h, L = K.clamp(w * 0.32, 110, 200); return { x: w / 2, y: h * 0.2, L, W: L * 0.26 }; }
      function layoutItems() {
        const w = cv.w, h = cv.h, n = st.items.length, twoRows = w < 640, perRow = twoRows ? Math.ceil(n / 2) : n, slotW = (w - 20) / perRow;
        st.items.forEach((it, i) => {
          const row = twoRows ? Math.floor(i / perRow) : 0, col = i % perRow;
          it.hx = 10 + (col + 0.5) * slotW; it.hy = twoRows ? h * (row === 0 ? 0.58 : 0.84) : h * 0.72;
          if (it.state === 'home' || it.state === 'return') { it.x = it.hx; it.y = it.hy; it.state = 'home'; }
          if (it.state === 'stuck') { const t = stickPos(it); it.x = t[0]; it.y = t[1]; }
        });
      }
      function distToMag(it) { const m = topMag(); const dx = Math.max(0, Math.abs(it.x - m.x) - m.L / 2), dy = Math.max(0, Math.abs(it.y - m.y) - m.W / 2); return Math.hypot(dx, dy); }
      function stickPos(it) { const m = topMag(); return [K.clamp(it.x, m.x - m.L / 2 + 14, m.x + m.L / 2 - 14), m.y + m.W / 2 + it.def.h / 2 + 1]; }
      function stepItems(dt) {
        const k = ctx.reducedMotion ? 1 : Math.min(1, 12 * dt);
        st.items.forEach(it => {
          if (it.state !== 'jump' && it.state !== 'return') return;
          const tx = it.state === 'jump' ? it.tx : it.hx, ty = it.state === 'jump' ? it.ty : it.hy;
          it.x += (tx - it.x) * k; it.y += (ty - it.y) * k;
          if (Math.hypot(tx - it.x, ty - it.y) < 0.8) { it.x = tx; it.y = ty; it.state = it.state === 'jump' ? 'stuck' : 'home'; }
        });
      }
      function drawItem(c, it) {
        const d = it.def, x = it.x, y = it.y, col = d.colorKey ? theme[d.colorKey] : d.color;
        c.save(); c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 1.2; c.fillStyle = col;
        if (d.shape === 'nail') {
          c.beginPath(); c.moveTo(x - d.w / 2 + 4, y - d.h / 2); c.lineTo(x + d.w / 2 - 8, y - d.h / 2); c.lineTo(x + d.w / 2, y); c.lineTo(x + d.w / 2 - 8, y + d.h / 2); c.lineTo(x - d.w / 2 + 4, y + d.h / 2); c.closePath(); c.fill(); c.stroke();
          c.fillRect(x - d.w / 2, y - d.h / 2 - 3, 4, d.h + 6); c.strokeRect(x - d.w / 2, y - d.h / 2 - 3, 4, d.h + 6);
        } else if (d.shape === 'clip') {
          c.strokeStyle = col; c.lineWidth = 2.5;
          K.roundRect(c, x - d.w / 2, y - d.h / 2, d.w, d.h, 7); c.stroke();
          K.roundRect(c, x - d.w / 2 + 4, y - d.h / 2 + 5, d.w - 8, d.h - 7, 4); c.stroke();
        } else if (d.shape === 'coin') {
          c.beginPath(); c.arc(x, y, d.w / 2, 0, Math.PI * 2); c.fill(); c.stroke();
          c.beginPath(); c.arc(x, y, d.w / 2 - 4, 0, Math.PI * 2); c.stroke();
        } else if (d.shape === 'foil') {
          c.beginPath(); c.moveTo(x - 16, y - 8); c.lineTo(x - 6, y - 13); c.lineTo(x + 5, y - 9); c.lineTo(x + 16, y - 11); c.lineTo(x + 13, y + 2); c.lineTo(x + 16, y + 12); c.lineTo(x + 2, y + 9); c.lineTo(x - 9, y + 13); c.lineTo(x - 15, y + 4); c.closePath(); c.fill(); c.stroke();
        } else if (d.shape === 'ruler') {
          c.fillRect(x - d.w / 2, y - d.h / 2, d.w, d.h); c.strokeRect(x - d.w / 2, y - d.h / 2, d.w, d.h);
          c.beginPath(); for (let t = x - d.w / 2 + 5; t < x + d.w / 2; t += 5) { c.moveTo(t, y - d.h / 2); c.lineTo(t, y - d.h / 2 + (Math.round((t - x) / 5) % 2 ? 3 : 5)); } c.stroke();
        } else if (d.shape === 'stick') {
          K.roundRect(c, x - d.w / 2, y - d.h / 2, d.w, d.h, 3); c.fill(); c.stroke();
          c.strokeStyle = K.withAlpha(theme.fg, 0.25); c.beginPath(); c.moveTo(x - d.w / 2 + 6, y); c.lineTo(x + d.w / 2 - 6, y); c.stroke();
        } else {
          c.fillStyle = theme.c8; c.fillRect(x - d.w / 2, y - d.h / 2, d.w / 2, d.h);
          c.fillStyle = theme.c1; c.fillRect(x, y - d.h / 2, d.w / 2, d.h);
          c.strokeRect(x - d.w / 2, y - d.h / 2, d.w, d.h);
          K.text(c, 'N', x - d.w / 4, y, { font: 'bold 9px ' + theme.font, color: '#ffffff', align: 'center', baseline: 'middle' });
          K.text(c, 'S', x + d.w / 4, y, { font: 'bold 9px ' + theme.font, color: '#ffffff', align: 'center', baseline: 'middle' });
        }
        c.restore();
      }
      function drawSticks() {
        const c = cv.ctx, w = cv.w, h = cv.h, m = topMag();
        // the big magnet hangs from the top
        c.save(); c.strokeStyle = theme.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(m.x, 0); c.lineTo(m.x, m.y - m.W / 2); c.stroke(); c.restore();
        c.save(); c.strokeStyle = K.withAlpha(theme.fg, 0.15); c.lineWidth = 1; c.setLineDash([4, 4]);
        K.roundRect(c, m.x - m.L / 2 - ZONE, m.y - m.W / 2 - ZONE, m.L + 2 * ZONE, m.W + 2 * ZONE, ZONE); c.stroke(); c.restore();
        drawMagnet(c, { x: m.x, y: m.y, L: m.L, W: m.W, cx: 1, sx: 0 }, null);
        // labels under the home slots, then the items
        st.items.forEach(it => {
          const lab = K.tr(it.def.name, lang);
          K.text(c, lab, it.hx, it.hy + it.def.h / 2 + 14, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
          if (it.tested !== null) K.text(c, it.def.mag ? '✓' : '✗', it.hx, it.hy + it.def.h / 2 + 28, { font: 'bold 13px ' + theme.font, color: it.def.mag ? theme.good : theme.bad, align: 'center', baseline: 'middle' });
        });
        st.items.forEach(it => { if (it !== st.dragItem) drawItem(c, it); });
        if (st.dragItem) drawItem(c, st.dragItem);
        K.text(c, K.tr({ en: 'Drag each item up to the magnet. What sticks?', hr: 'Povuci svaki predmet do magneta. Što se prilijepi?' }, lang), 12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'Magnetic: iron, steel, nickel, cobalt.', hr: 'Magnetično: željezo, čelik, nikal, kobalt.' }, lang), 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }
      function draw() {
        const c = cv.ctx; c.clearRect(0, 0, cv.w, cv.h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, cv.w, cv.h);
        if (st.mode === 'field') drawField(); else drawSticks();
      }

      // ---- pointer ----
      function itemAt(p) {
        for (let i = st.items.length - 1; i >= 0; i--) { const it = st.items[i]; if (Math.abs(p.x - it.x) <= it.def.w / 2 + 8 && Math.abs(p.y - it.y) <= it.def.h / 2 + 8) return it; }
        return null;
      }
      const onDown = ev => {
        const p = cv.pointer(ev);
        if (st.mode === 'field') {
          const i = insideMagnet(p.x, p.y, 4);
          if (i >= 0) { const g = magGeo(activeMags()[i]); st.drag = { i, ox: g.x - p.x, oy: g.y - p.y }; ev.preventDefault(); }
        } else {
          const it = itemAt(p);
          if (it) { it.escaping = it.state === 'stuck'; it.state = 'drag'; st.dragItem = it; st.drag = { ox: it.x - p.x, oy: it.y - p.y }; st.last = it; updateOut(); ev.preventDefault(); }
        }
        if (!L.running) draw();
      };
      const onMove = ev => {
        const p = cv.pointer(ev), w = cv.w, h = cv.h;
        if (!st.drag) {
          const hit = st.mode === 'field' ? insideMagnet(p.x, p.y, 4) >= 0 : !!itemAt(p);
          cv.canvas.style.cursor = hit ? 'grab' : 'default'; return;
        }
        cv.canvas.style.cursor = 'grabbing';
        if (st.mode === 'field') {
          const m = activeMags()[st.drag.i];
          m.u = K.clamp((p.x + st.drag.ox) / w, 0.08, 0.92); m.v = K.clamp((p.y + st.drag.oy) / h, 0.12, 0.92); st.dirty = true; updateOut();
        } else if (st.dragItem) {
          const it = st.dragItem;
          it.x = K.clamp(p.x + st.drag.ox, 10, w - 10); it.y = K.clamp(p.y + st.drag.oy, 10, h - 10);
          const d = distToMag(it);
          if (it.escaping && d > ZONE * 1.5) it.escaping = false;
          if (it.def.mag && !it.escaping && d < ZONE) { const t = stickPos(it); it.tx = t[0]; it.ty = t[1]; it.state = 'jump'; it.tested = true; st.dragItem = null; st.drag = null; cv.canvas.style.cursor = 'default'; }
          else if (!it.def.mag && d < ZONE) it.tested = true;
          updateOut();
        }
        if (!L.running) { stepItems(1); draw(); }
      };
      const onUp = () => {
        if (!st.drag) return;
        if (st.mode === 'sticks' && st.dragItem) {
          const it = st.dragItem, d = distToMag(it);
          if (d < ZONE) it.tested = true;
          if (it.def.mag && d < ZONE) { const t = stickPos(it); it.tx = t[0]; it.ty = t[1]; it.state = 'jump'; } else it.state = 'return';
          it.escaping = false; st.dragItem = null; updateOut();
        }
        st.drag = null; cv.canvas.style.cursor = 'default';
        if (!L.running) { stepItems(1); draw(); }
      };
      cv.canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      const L = K.loop(dt => { stepItems(dt); draw(); });
      cv.onResize(() => { st.dirty = true; layoutItems(); draw(); });
      applyMode();
      reset();
      if (!ctx.reducedMotion) L.start();
      return {
        destroy() {
          L.destroy(); cv.canvas.removeEventListener('pointerdown', onDown);
          window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
