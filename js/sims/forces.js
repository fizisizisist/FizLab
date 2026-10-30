/* FizLab sim: Push the crate — applied force, friction, net force and acceleration on different floors; the camera follows the crate. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81;
  const SURFACES = [
    { id: 'ice', mu: 0.05, label: { en: 'Ice (μ = 0.05)', hr: 'Led (μ = 0,05)' }, name: { en: 'ice', hr: 'led' } },
    { id: 'wood', mu: 0.3, label: { en: 'Wood (μ = 0.3)', hr: 'Drvo (μ = 0,3)' }, name: { en: 'wood', hr: 'drvo' } },
    { id: 'carpet', mu: 0.6, label: { en: 'Carpet (μ = 0.6)', hr: 'Tepih (μ = 0,6)' }, name: { en: 'carpet', hr: 'tepih' } },
    { id: 'rubber', mu: 0.9, label: { en: 'Rubber (μ = 0.9)', hr: 'Guma (μ = 0,9)' }, name: { en: 'rubber', hr: 'guma' } },
    { id: 'none', mu: 0, label: { en: 'No friction (μ = 0)', hr: 'Bez trenja (μ = 0)' }, name: { en: 'no friction', hr: 'bez trenja' } }
  ];
  const CRATE = '#c48a4b', CRATE_EDGE = '#6e4420'; // wooden crate (fixed physical colour, readable on both skies)

  window.Sims.register({
    id: 'forces',
    title: { en: 'Push the Crate', hr: 'Guranje sanduka' },
    summary: {
      en: 'Push a crate across ice, wood, carpet or rubber. See the push, the friction and the net force as arrows, and read the acceleration.',
      hr: 'Guraj sanduk po ledu, drvu, tepihu ili gumi. Gledaj silu guranja, trenje i rezultantu kao strelice i čitaj ubrzanje.'
    },
    tasks: [
      { en: 'Push with 40 N on wood. Why doesn\'t the crate move? Find the smallest force that gets it moving.', hr: 'Guraj silom 40 N po drvu. Zašto se sanduk ne miče? Pronađi najmanju silu koja ga pokrene.' },
      { en: 'Get the crate sliding, then set the force to 0 N. Does it stop at once? Try the same on ice.', hr: 'Pokreni sanduk, zatim postavi silu na 0 N. Staje li odmah? Pokušaj isto na ledu.' },
      { en: 'Choose "No friction" and push with 20 N. What happens to the speed when you stop pushing?', hr: 'Odaberi "Bez trenja" i guraj silom 20 N. Što se dogodi s brzinom kad prestaneš gurati?' },
      { en: 'Double the mass with the same force. How does the acceleration change?', hr: 'Udvostruči masu uz istu silu. Kako se promijeni ubrzanje?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 460 });
      const C = K.controls(container, lang);

      const st = { F: 40, m: 20, surf: SURFACES[1], showWN: false, x: 0, v: 0, t: 0, pts: [[0, 0]], lastSample: -1, vMin: 0, vMax: 0 };
      let sceneW = 0; // width of the scene part of the canvas (the v–t chart sits to the right when wide)

      // ---------- controls ----------
      C.slider({ label: { en: 'Push force', hr: 'Sila guranja' }, min: -150, max: 150, step: 5, value: 40,
        format: (v, l) => (v < 0 ? '← ' : '') + K.fmt(Math.abs(v), 0, l) + ' N' + (v > 0 ? ' →' : ''),
        onChange: v => { st.F = v; refresh(); } });
      C.slider({ label: { en: 'Mass of the crate', hr: 'Masa sanduka' }, min: 5, max: 60, step: 1, value: 20, unit: 'kg', digits: 0, onChange: v => { st.m = v; refresh(); } });
      C.select({ label: { en: 'Floor surface', hr: 'Podloga' }, options: SURFACES.map(s => ({ value: s.id, label: s.label })), value: 'wood',
        onChange: v => { st.surf = SURFACES.find(s => s.id === v) || SURFACES[1]; refresh(); } });
      C.toggle({ label: { en: 'Show weight and floor force', hr: 'Prikaži težinu i silu podloge' }, value: false, onChange: v => { st.showWN = v; draw(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); refresh(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outNet = C.readout({ label: { en: 'Net force', hr: 'Rezultanta sila' }, unit: 'N', digits: 1 });
      const outA = C.readout({ label: { en: 'Acceleration', hr: 'Ubrzanje' }, unit: 'm/s²', digits: 2 });
      const outV = C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'm/s', digits: 2 });
      const outFr = C.readout({ label: { en: 'Friction force', hr: 'Sila trenja' }, unit: 'N', digits: 1 });
      const outX = C.readout({ label: { en: 'Distance', hr: 'Put' }, unit: 'm', digits: 1 });
      const note = C.note({ text: { en: '', hr: '' } });

      // ---------- physics ----------
      // Friction: magnitude μ·m·g, opposing motion. At rest it only matches the push (static), up to μ·m·g.
      function forces() {
        const fmax = st.surf.mu * st.m * G;
        let fr, regime;
        if (Math.abs(st.v) < 1e-9) {
          if (Math.abs(st.F) <= fmax + 1e-9) { fr = -st.F; regime = st.F === 0 ? 'idle' : 'static'; }
          else { fr = -Math.sign(st.F) * fmax; regime = 'start'; }
        } else {
          fr = -Math.sign(st.v) * fmax;
          const n = st.F + fr;
          regime = Math.abs(n) < 1e-9 ? 'steady' : (n * st.v > 0 ? 'faster' : 'slower');
        }
        const net = st.F + fr;
        return { fmax, fr, net, acc: net / st.m, regime };
      }
      function step(dt) {
        const n = 4, h = dt / n;
        for (let i = 0; i < n; i++) {
          const f = forces();
          if (f.regime === 'static' || f.regime === 'idle') { st.v = 0; continue; }
          const v0 = st.v;
          st.v += f.acc * h;
          // friction may slow the crate to a stop, but never push it backwards
          if (v0 !== 0 && v0 * st.v < 0 && Math.abs(st.F) <= f.fmax) st.v = 0;
          st.x += st.v * h;
        }
        st.t += dt;
        if (st.t - st.lastSample >= 0.05 && st.pts.length < 6000) { // sample for the speed–time graph
          st.lastSample = st.t; st.pts.push([st.t, st.v]);
          st.vMin = Math.min(st.vMin, st.v); st.vMax = Math.max(st.vMax, st.v);
        }
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function reset() {
        L.stop(); st.x = 0; st.v = 0; st.t = 0; st.pts = [[0, 0]]; st.lastSample = -1; st.vMin = 0; st.vMax = 0;
        updatePlay(); refresh();
      }
      function refresh() { updateOut(); draw(); }

      function updateOut() {
        const f = forces();
        outNet.set(f.net); outA.set(f.acc); outV.set(Math.abs(st.v)); outFr.set(Math.abs(f.fr)); outX.set(st.x);
        const fe = K.fmt(f.fmax, 1, 'en'), fh = K.fmt(f.fmax, 1, 'hr');
        const texts = {
          idle: { en: 'No push yet. Set a force with the slider and press Play.', hr: 'Još nema guranja. Postavi silu klizačem i pokreni.' },
          static: { en: 'Friction balances your push — the crate doesn\'t move. Push harder than μ·m·g = ' + fe + ' N!', hr: 'Trenje poništava tvoje guranje — sanduk se ne miče. Guraj jače od μ·m·g = ' + fh + ' N!' },
          start: L.running
            ? { en: 'Your push is bigger than friction — the crate starts to move.', hr: 'Guranje je veće od trenja — sanduk kreće.' }
            : { en: 'Your push is bigger than friction (' + fe + ' N) — press Play to see the crate move.', hr: 'Guranje je veće od trenja (' + fh + ' N) — pokreni i gledaj kako sanduk kreće.' },
          faster: { en: 'The net force points along the motion — the crate speeds up: a = F_net / m.', hr: 'Rezultanta je u smjeru gibanja — sanduk ubrzava: a = F_rez / m.' },
          slower: { en: 'The net force points against the motion — the crate slows down.', hr: 'Rezultanta je suprotna gibanju — sanduk usporava.' },
          steady: { en: 'The net force is zero — the crate keeps sliding at constant speed (Newton\'s 1st law).', hr: 'Rezultanta je nula — sanduk klizi stalnom brzinom (1. Newtonov zakon).' }
        };
        note.set(texts[f.regime]);
      }

      // ---------- drawing ----------
      function pill(ctx, str, x, y, align, font) { // text with a soft background so it stays readable over arrows
        ctx.font = font; const tw = ctx.measureText(str).width;
        let tx = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
        tx = K.clamp(tx, 3, (sceneW || cv.w) - tw - 3);
        ctx.fillStyle = K.withAlpha(theme.surface, 0.8); K.roundRect(ctx, tx - 4, y - 8, tw + 8, 16, 4); ctx.fill();
        K.text(ctx, str, tx, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function fitFont(ctx, str, maxW, base, bold) {
        for (let px = base; px >= 10; px--) { const f = (bold ? 'bold ' : '') + px + 'px ' + theme.font; ctx.font = f; if (ctx.measureText(str).width <= maxW) return f; }
        return (bold ? 'bold ' : '') + '10px ' + theme.font;
      }
      function hArrow(ctx, x, y, len, color, width) { // horizontal arrow from (x,y) with signed length
        if (Math.abs(len) < 1) return;
        K.arrow(ctx, x, y, x + len, y, { color, width, head: Math.min(12, Math.abs(len)) });
      }

      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        const f = forces();
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        const showChart = w >= 620;
        const W = showChart ? Math.round(w * 0.62) : w; // scene width; the speed–time chart uses the rest
        sceneW = W;
        const groundY = Math.round(h * 0.70);
        const cx = Math.round(W * 0.45);
        const pxm = K.clamp(W / 14, 26, 64); // px per metre
        const toX = wx => cx + (wx - st.x) * pxm;
        const pxN = K.clamp(W / 600, 0.45, 0.9); // px per newton for the horizontal forces
        const side = Math.min(K.clamp((34 + st.m * 0.7) * K.clamp(h / 320, 0.8, 1.3), 30, 110), groundY - Math.round(h * 0.39));
        const crateTop = groundY - side, cy = groundY - side / 2;

        // floor (scrolls with the camera) + distance markers
        ctx.fillStyle = theme.ground; ctx.fillRect(0, groundY, W, h - groundY);
        if (st.surf.id === 'ice') { ctx.fillStyle = theme.water; ctx.fillRect(0, groundY, W, 8); }
        else if (st.surf.id === 'rubber') { ctx.fillStyle = K.withAlpha(theme.fg, 0.55); ctx.fillRect(0, groundY, W, 8); }
        else if (st.surf.id === 'none') { ctx.fillStyle = K.withAlpha(theme.surface, 0.7); ctx.fillRect(0, groundY, W, 8); }
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
        const mStart = Math.floor(st.x - cx / pxm) - 1, mEnd = Math.ceil(st.x + (W - cx) / pxm) + 1;
        const everyLabel = pxm * 5 < 70 ? 10 : 5;
        for (let m = mStart; m <= mEnd; m++) {
          const sx = toX(m), major = m % 5 === 0;
          ctx.strokeStyle = major ? theme.fg : theme.muted; ctx.lineWidth = major ? 1.5 : 1;
          ctx.beginPath(); ctx.moveTo(sx, groundY + 8); ctx.lineTo(sx, groundY + (major ? 18 : 12)); ctx.stroke();
          if (major && m % everyLabel === 0) K.text(ctx, K.fmt(m, 0, lang) + ' m', sx, groundY + 21, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        }
        K.text(ctx, K.tr(st.surf.name, lang) + '   μ = ' + K.fmt(st.surf.mu, 2, lang), W - 10, h - 8, { font: '12px ' + theme.font, color: theme.fg, align: 'right' });
        K.text(ctx, K.tr({ en: '+ → right,  − ← left', hr: '+ → desno,  − ← lijevo' }, lang), 10, h - 8, { font: '11px ' + theme.font, color: theme.muted });

        // crate
        ctx.fillStyle = CRATE; ctx.fillRect(cx - side / 2, crateTop, side, side);
        ctx.strokeStyle = CRATE_EDGE; ctx.lineWidth = 2;
        ctx.strokeRect(cx - side / 2 + 1, crateTop + 1, side - 2, side - 2);
        ctx.beginPath(); ctx.moveTo(cx - side / 2 + 3, crateTop + 3); ctx.lineTo(cx + side / 2 - 3, groundY - 3);
        ctx.moveTo(cx + side / 2 - 3, crateTop + 3); ctx.lineTo(cx - side / 2 + 3, groundY - 3); ctx.stroke();
        pill(ctx, K.fmt(st.m, 0, lang) + ' kg', cx, cy, 'center', 'bold 12px ' + theme.font);
        // the pushing hand (on the side the push comes from)
        if (st.F !== 0) {
          const dir = Math.sign(st.F), hx = cx - dir * (side / 2 + 7), hy = cy - side * 0.18;
          ctx.fillStyle = theme.fg; K.roundRect(ctx, hx - 6, hy - 11, 12, 22, 5); ctx.fill();
          ctx.strokeStyle = theme.fg; ctx.lineWidth = 5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(hx - dir * 6, hy + 2); ctx.lineTo(hx - dir * 30, hy + 10); ctx.stroke();
        }

        // weight and normal force (optional)
        if (st.showWN) {
          const Wn = st.m * G, lw = K.clamp(Wn * pxN * 0.3, 34, h * 0.26);
          K.arrow(ctx, cx - 10, cy, cx - 10, cy + lw, { color: theme.c3, width: 3, head: 10 });
          K.arrow(ctx, cx + 10, groundY, cx + 10, groundY - lw, { color: theme.c4, width: 3, head: 10 });
          pill(ctx, K.tr({ en: 'W = m·g = ', hr: 'G = m·g = ' }, lang) + K.fmt(Wn, 0, lang) + ' N', cx - 18, cy + lw - 6, 'right', '11px ' + theme.font);
          pill(ctx, K.tr({ en: 'floor N = ', hr: 'podloga N = ' }, lang) + K.fmt(Wn, 0, lang) + ' N', cx + 18, groundY - lw + 6, 'left', '11px ' + theme.font);
        }

        // applied force (c1) from the crate centre, friction (c2) along the floor
        const fy = cy - side * 0.18, fry = groundY - 7;
        const lenF = st.F * pxN, lenFr = f.fr * pxN;
        hArrow(ctx, cx, fy, lenF, theme.c1, 3);
        if (Math.abs(st.F) > 0) pill(ctx, 'F = ' + K.fmt(Math.abs(st.F), 0, lang) + ' N', cx + lenF + (lenF > 0 ? 8 : -8), fy, lenF > 0 ? 'left' : 'right', 'bold 12px ' + theme.font);
        hArrow(ctx, cx, fry, lenFr, theme.c2, 3);
        if (Math.abs(f.fr) > 0.05) pill(ctx, K.tr({ en: 'F_fr = ', hr: 'F_tr = ' }, lang) + K.fmt(Math.abs(f.fr), 1, lang) + ' N', cx + lenFr + (lenFr > 0 ? 8 : -8), fry, lenFr > 0 ? 'left' : 'right', '12px ' + theme.font);

        // velocity (fg) and net force (c7, thicker) above the crate
        const vy = crateTop - 16, ny = crateTop - 40;
        const lenV = K.clamp(st.v * 6, -W * 0.4, W * 0.4);
        if (Math.abs(st.v) > 0.01) {
          hArrow(ctx, cx, vy, lenV, theme.fg, 2);
          pill(ctx, 'v = ' + K.fmt(Math.abs(st.v), 2, lang) + ' m/s', cx + lenV + (lenV > 0 ? 8 : -8), vy, lenV > 0 ? 'left' : 'right', '12px ' + theme.font);
        } else {
          pill(ctx, 'v = 0 m/s', cx, vy, 'center', '12px ' + theme.font);
        }
        const lenN = f.net * pxN;
        const netLab = K.tr({ en: 'F_net = ', hr: 'F_rez = ' }, lang) + K.fmt(f.net, 1, lang) + ' N';
        if (Math.abs(f.net) > 0.05) {
          hArrow(ctx, cx, ny, lenN, theme.c7, 5);
          pill(ctx, netLab, cx + lenN + (lenN > 0 ? 8 : -8), ny, lenN > 0 ? 'left' : 'right', 'bold 12px ' + theme.font);
        } else {
          ctx.fillStyle = theme.c7; ctx.beginPath(); ctx.arc(cx, ny, 4, 0, Math.PI * 2); ctx.fill();
          pill(ctx, netLab, cx + 10, ny, 'left', 'bold 12px ' + theme.font);
        }

        // header: formula with current numbers + time
        const l1 = 'a = ' + K.tr({ en: 'F_net', hr: 'F_rez' }, lang) + ' / m = ' + K.fmt(f.net, 1, lang) + ' N / ' + K.fmt(st.m, 0, lang) + ' kg = ' + K.fmt(f.acc, 2, lang) + ' m/s²';
        const l2 = (f.regime === 'static' || f.regime === 'idle')
          ? K.tr({ en: 'Friction (static): F_fr = F = ', hr: 'Trenje (mirovanje): F_tr = F = ' }, lang) + K.fmt(Math.abs(st.F), 0, lang) + ' N' + K.tr({ en: '   (max μ·m·g = ', hr: '   (najviše μ·m·g = ' }, lang) + K.fmt(f.fmax, 1, lang) + ' N)'
          : K.tr({ en: 'Friction: F_fr = μ · m · g = ', hr: 'Trenje: F_tr = μ · m · g = ' }, lang) + K.fmt(st.surf.mu, 2, lang) + ' · ' + K.fmt(st.m, 0, lang) + ' · ' + K.fmt(G, 2, lang) + ' = ' + K.fmt(f.fmax, 1, lang) + ' N';
        const tStr = 't = ' + K.fmt(st.t, 1, lang) + ' s';
        ctx.font = 'bold 14px ' + theme.fontDisplay; const tw = ctx.measureText(tStr).width;
        K.text(ctx, tStr, W - 10, 16, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, align: 'right', baseline: 'middle' });
        K.text(ctx, l1, 10, 16, { font: fitFont(ctx, l1, W - tw - 30, 14, true), color: theme.fg, baseline: 'middle' });
        K.text(ctx, l2, 10, 34, { font: fitFont(ctx, l2, W - 20, 12, false), color: theme.muted, baseline: 'middle' });

        // legend of the arrows (top-left, under the formulas)
        const legend = [[theme.c1, { en: 'push', hr: 'guranje' }], [theme.c2, { en: 'friction', hr: 'trenje' }], [theme.c7, { en: 'net force', hr: 'rezultanta' }], [theme.fg, { en: 'speed', hr: 'brzina' }]];
        let lx = 10;
        legend.forEach(([col, lab]) => {
          ctx.fillStyle = col; ctx.fillRect(lx, 47, 14, 4);
          const s = K.tr(lab, lang); ctx.font = '11px ' + theme.font;
          K.text(ctx, s, lx + 18, 49, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
          lx += 18 + ctx.measureText(s).width + 12;
        });

        // speed–time graph (wide canvases only)
        if (showChart) {
          const xMax = Math.max(10, Math.ceil(st.t / 5) * 5);
          const yMax = Math.max(1, st.vMax * 1.15), yMin = Math.min(0, st.vMin * 1.15);
          K.lineChart(ctx, { x: W + 8, y: 8, w: w - W - 16, h: h - 16, xMin: 0, xMax, yMin, yMax, lang, theme,
            xLabel: { en: 'time (s)', hr: 'vrijeme (s)' }, yLabel: { en: 'speed (m/s)', hr: 'brzina (m/s)' },
            series: [{ points: st.pts, color: theme.c5, label: { en: 'speed', hr: 'brzina' } }] });
        }
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
