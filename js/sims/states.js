/* FizLab sim: States of matter — 150 particles in a closed container; solid lattice, jostling liquid, free-flying gas. */
(function () {
  'use strict';
  const K = window.SimKit;
  const N = 150, R = 0.021, W = 1, H = 0.75, R_GAS = 8.314;
  const SUBSTANCES = [
    { id: 'water', label: { en: 'Water', hr: 'Voda' }, melt: 0, boil: 100, tMin: -50, tMax: 150, t0: 20, M: 0.018, color: 'c1' },
    { id: 'ethanol', label: { en: 'Ethanol (alcohol)', hr: 'Etanol (alkohol)' }, melt: -114, boil: 78, tMin: -160, tMax: 130, t0: 20, M: 0.046, color: 'c3' },
    { id: 'iron', label: { en: 'Iron', hr: 'Željezo' }, melt: 1538, boil: 2862, tMin: 1000, tMax: 3300, t0: 1200, M: 0.056, color: 'c2' },
    { id: 'oxygen', label: { en: 'Oxygen', hr: 'Kisik' }, melt: -219, boil: -183, tMin: -260, tMax: -140, t0: -200, M: 0.032, color: 'c7' }
  ];
  const STATE_LABEL = { solid: { en: 'solid', hr: 'čvrsto' }, liquid: { en: 'liquid', hr: 'tekuće' }, gas: { en: 'gas', hr: 'plinovito' } };

  window.Sims.register({
    id: 'states',
    title: { en: 'States of Matter', hr: 'Agregacijska stanja' },
    summary: {
      en: 'Heat or cool 150 particles and watch them lock into a solid, flow as a liquid or fly apart as a gas.',
      hr: 'Zagrijavaj ili hladi 150 čestica i gledaj kako se slažu u čvrsto tijelo, teku kao tekućina ili razlijeću kao plin.'
    },
    tasks: [
      { en: 'Cool the water below 0 °C. What do the particles do once it freezes?', hr: 'Ohladi vodu ispod 0 °C. Što čestice rade kad se smrzne?' },
      { en: 'Heat it past 100 °C. How does the gas fill the container? Keep heating — do the particles get faster?', hr: 'Zagrij je iznad 100 °C. Kako plin ispunjava posudu? Nastavi grijati — jesu li čestice brže?' },
      { en: 'Switch to oxygen. At what temperature is it a liquid? Compare with iron.', hr: 'Prebaci na kisik. Na kojoj je temperaturi tekućina? Usporedi sa željezom.' },
      { en: 'Read the thermometer: the melting and boiling points are marked. Which substance has the smallest liquid range?', hr: 'Pročitaj termometar: označeni su talište i vrelište. Koja tvar ima najuži raspon tekućeg stanja?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 480 });
      const C = K.controls(container, lang);
      let seed = 7;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const P = []; // particles {x,y,vx,vy,ph1,ph2,lx,ly,fx,fy}
      for (let i = 0; i < N; i++) P.push({ x: 0, y: 0, vx: 0, vy: 0, ph1: 0, ph2: 0, lx: 0, ly: 0, fx: 0, fy: 0 });
      const st = { sub: SUBSTANCES[0], T: 20, phase: 'liquid', heat: 0, freezeT: 2, suppress: false, time: 0 };

      // ---------- controls ----------
      const selSub = C.select({ label: { en: 'Substance', hr: 'Tvar' }, options: SUBSTANCES.map(s => ({ value: s.id, label: s.label })), value: 'water',
        onChange: v => { setSubstance(SUBSTANCES.find(s => s.id === v) || SUBSTANCES[0]); } });
      const slT = C.slider({ label: { en: 'Temperature', hr: 'Temperatura' }, min: -50, max: 150, step: 1, value: 20, unit: '°C', digits: 0,
        onChange: v => { st.T = v; setHeat(0); applyPhase(); refresh(); } });
      // a click toggles heating/cooling; a long press (see bindHold) heats only while held
      function clickToggle(dir) {
        return () => {
          if (st.suppress) { st.suppress = false; return; }
          setHeat(st.heat === dir ? 0 : dir);
        };
      }
      const btnHeat = C.button({ label: { en: 'Heat', hr: 'Zagrijavaj' }, onClick: clickToggle(1) });
      const btnCool = C.button({ label: { en: 'Cool', hr: 'Hladi' }, onClick: clickToggle(-1) });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: reset });
      const outT = C.readout({ label: { en: 'Temperature', hr: 'Temperatura' }, unit: '°C', digits: 0 });
      const outState = C.readout({ label: { en: 'State', hr: 'Agregacijsko stanje' } });
      const outV = C.readout({ label: { en: 'Average particle speed ~ √T', hr: 'Prosječna brzina čestica ~ √T' }, unit: 'm/s', digits: 0 });
      const note = C.note({ text: { en: '', hr: '' } });

      // hold-to-heat: a long press heats while held, a short press toggles (handled by the click)
      const holdHandlers = [];
      function bindHold(btn, dir) {
        let pressT = 0, before = 0;
        const down = () => { before = st.heat; pressT = performance.now(); setHeat(dir); };
        const up = () => {
          if (!pressT) return;
          const long = performance.now() - pressT > 300;
          pressT = 0;
          if (long) { setHeat(0); st.suppress = true; } // the following click must not toggle
          else setHeat(before);                         // short press: let the click toggle
        };
        const ups = ['pointerup', 'pointerleave', 'pointercancel'];
        btn.el.addEventListener('pointerdown', down);
        ups.forEach(e => btn.el.addEventListener(e, up));
        holdHandlers.push(() => {
          btn.el.removeEventListener('pointerdown', down);
          ups.forEach(e => btn.el.removeEventListener(e, up));
        });
      }
      bindHold(btnHeat, 1); bindHold(btnCool, -1);

      // ---------- physics ----------
      function phaseOf(T) { return T < st.sub.melt ? 'solid' : (T < st.sub.boil ? 'liquid' : 'gas'); }
      function kelvin() { return st.T + 273.15; }
      function meanSpeed() { return Math.sqrt(8 * R_GAS * Math.max(1, kelvin()) / (Math.PI * st.sub.M)); }
      function gasSpeed() { return 0.055 * Math.sqrt(Math.max(1, kelvin())); }
      function lattice() {
        const nc = 15, s = 2 * R * 1.05, x0 = (W - (nc - 1) * s - s / 2) / 2, rowH = s * 0.87, slots = [];
        for (let i = 0; i < N; i++) { const row = Math.floor(i / nc), col = i % nc; slots.push({ x: x0 + col * s + (row % 2 ? s / 2 : 0), y: H - R - 0.004 - row * rowH }); }
        return slots;
      }
      function startFreeze() {
        const slots = lattice();
        const order = P.map((p, i) => i).sort((a, b) => (P[b].y - P[a].y) || (P[a].x - P[b].x));
        slots.sort((a, b) => (b.y - a.y) || (a.x - b.x));
        order.forEach((pi, k) => { const p = P[pi]; p.lx = slots[k].x; p.ly = slots[k].y; p.fx = p.x; p.fy = p.y; p.vx = 0; p.vy = 0; });
        st.freezeT = 0;
      }
      function applyPhase() {
        const ph = phaseOf(st.T);
        if (ph === st.phase) return;
        const prev = st.phase; st.phase = ph;
        if (ph === 'solid') startFreeze();
        else if (prev === 'solid') { const v = gasSpeed() * 0.25; P.forEach(p => { const a = rnd() * Math.PI * 2; p.vx = v * Math.cos(a); p.vy = v * Math.sin(a); }); }
      }
      function setHeat(dir) {
        st.heat = dir; btnHeat.setActive(dir > 0); btnCool.setActive(dir < 0);
        if (dir !== 0 && !L.running) { L.start(); updatePlay(); }
      }
      function solidPositions() {
        const s = st.sub, frac = K.clamp((st.T - s.tMin) / (s.melt - s.tMin || 1), 0, 1);
        const amp = R * (0.08 + 0.7 * frac), om = 12 + 14 * frac, t = st.time, k = K.clamp(st.freezeT, 0, 1), e = k * k * (3 - 2 * k);
        P.forEach(p => {
          const tx = p.lx + amp * Math.sin(om * t + p.ph1), ty = p.ly + amp * Math.sin(1.37 * om * t + p.ph2);
          p.x = K.lerp(p.fx, tx, e); p.y = K.lerp(p.fy, ty, e);
        });
      }
      function step(dt) {
        if (st.heat) {
          const s = st.sub, rate = (s.tMax - s.tMin) / 10; // whole range in 10 s
          st.T = K.clamp(st.T + st.heat * rate * dt, s.tMin, s.tMax);
          slT.set(Math.round(st.T));
          if (st.T <= s.tMin || st.T >= s.tMax) setHeat(0);
          applyPhase();
        }
        st.time += dt;
        if (st.phase === 'solid') { st.freezeT += dt; solidPositions(); return; }
        const gas = st.phase === 'gas';
        const vt = gas ? gasSpeed() : gasSpeed() * 0.25;   // target speed ∝ √T (liquid: slower jostling)
        const g = gas ? 0 : 1.5;                           // "gravity" keeps the liquid in the lower part
        P.forEach(p => {
          p.vy += g * dt;
          if (!gas) { // random small turns: Brownian-like jostling in the liquid
            const a = (rnd() - 0.5) * 4 * dt, c = Math.cos(a), s = Math.sin(a), vx = p.vx;
            p.vx = vx * c - p.vy * s; p.vy = vx * s + p.vy * c;
          }
          // thermostat: relax the speed toward the target over ~0.4 s
          const sp = Math.hypot(p.vx, p.vy);
          if (sp < 1e-6) { const a = rnd() * Math.PI * 2; p.vx = vt * Math.cos(a); p.vy = vt * Math.sin(a); }
          else { const f = 1 + (vt / sp - 1) * Math.min(1, 2.5 * dt); p.vx *= f; p.vy *= f; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < R) { p.x = R; p.vx = Math.abs(p.vx); } else if (p.x > W - R) { p.x = W - R; p.vx = -Math.abs(p.vx); }
          if (p.y < R) { p.y = R; p.vy = Math.abs(p.vy); } else if (p.y > H - R) { p.y = H - R; p.vy = -Math.abs(p.vy); }
        });
        // soft collisions: push overlapping pairs apart
        const d0 = 2 * R;
        for (let i = 0; i < N; i++) {
          const a = P[i];
          for (let j = i + 1; j < N; j++) {
            const b = P[j], dx = b.x - a.x, dy = b.y - a.y;
            if (Math.abs(dx) > d0 || Math.abs(dy) > d0) continue;
            const d = Math.hypot(dx, dy);
            if (d >= d0 || d < 1e-9) continue;
            const push = (d0 - d) / d * 0.5, px = dx * push, py = dy * push;
            a.x -= px; a.y -= py; b.x += px; b.y += py;
            if (gas) { const nx = dx / d, ny = dy / d, rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny; if (rel > 0) { a.vx -= rel * nx; a.vy -= rel * ny; b.vx += rel * nx; b.vy += rel * ny; } }
          }
        }
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { updateOut(); draw(); }
      function updateOut() {
        outT.set(st.T); outState.set(STATE_LABEL[st.phase]); outV.set(meanSpeed());
        const s = st.sub;
        if (st.phase === 'solid') note.set({ en: 'Solid: the particles are packed in a fixed pattern and only vibrate in place. Heating makes them vibrate more; at ' + K.fmt(s.melt, 0, 'en') + ' °C the pattern breaks — melting.',
          hr: 'Čvrsto: čestice su složene u čvrst raspored i samo titraju na mjestu. Zagrijavanjem titraju jače; na ' + K.fmt(s.melt, 0, 'hr') + ' °C raspored se raspada — taljenje.' });
        else if (st.phase === 'liquid') note.set({ en: 'Liquid: the particles stay close but slide past each other, so the liquid takes the shape of the container. At ' + K.fmt(s.boil, 0, 'en') + ' °C it boils.',
          hr: 'Tekuće: čestice su blizu, ali klize jedna pokraj druge, pa tekućina poprima oblik posude. Na ' + K.fmt(s.boil, 0, 'hr') + ' °C vrije.' });
        else note.set({ en: 'Gas: the particles fly freely, bounce off the walls and fill the whole container. Hotter → faster (speed grows with √T).',
          hr: 'Plinovito: čestice slobodno lete, odbijaju se od zidova i ispunjavaju cijelu posudu. Toplije → brže (brzina raste sa √T).' });
      }
      function setSubstance(s) {
        st.sub = s; slT.input.min = s.tMin; slT.input.max = s.tMax; st.T = s.t0; slT.set(s.t0); setHeat(0);
        const ph = phaseOf(st.T); st.phase = ph; seedParticles(); refresh();
      }
      function seedParticles() {
        seed = 7; st.time = 0; st.freezeT = 2;
        const slots = lattice();
        P.forEach((p, i) => { p.ph1 = rnd() * Math.PI * 2; p.ph2 = rnd() * Math.PI * 2; p.lx = slots[i].x; p.ly = slots[i].y; });
        if (st.phase === 'gas') P.forEach(p => { p.x = R + rnd() * (W - 2 * R); p.y = R + rnd() * (H - 2 * R); });
        else P.forEach(p => { p.x = p.lx + (st.phase === 'liquid' ? (rnd() - 0.5) * R : 0); p.y = p.ly; });
        P.forEach(p => { p.fx = p.x; p.fy = p.y; });
        const v = st.phase === 'gas' ? gasSpeed() : gasSpeed() * 0.25;
        P.forEach(p => { const a = rnd() * Math.PI * 2; p.vx = v * Math.cos(a); p.vy = v * Math.sin(a); });
        if (st.phase === 'solid') solidPositions();
      }

      // ---------- drawing ----------
      function layout() {
        const w = cv.w, h = cv.h, thermoW = w >= 520 ? 118 : 86, pad = 12, top = 38;
        let cw = w - thermoW - pad * 3, ch = cw * H / W;
        const availH = h - top - pad;
        if (ch > availH) { ch = availH; cw = ch * W / H; }
        return { w, h, cw, ch, cx: pad, cy: h - pad - ch, thermoX: w - thermoW - pad, thermoW, top };
      }
      function draw() {
        const c = cv.ctx, Lo = layout(), w = Lo.w, h = Lo.h;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        // title + one-line hint about what the particles are doing
        const title = K.tr(st.sub.label, lang) + ' · ' + K.tr(STATE_LABEL[st.phase], lang).toUpperCase() + ' · ' + K.fmt(st.T, 0, lang) + ' °C';
        K.text(c, title, 12, 16, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        const hint = K.tr(st.phase === 'solid' ? { en: 'particles vibrate in a fixed pattern', hr: 'čestice titraju u čvrstom rasporedu' }
          : st.phase === 'liquid' ? { en: 'particles slide past each other', hr: 'čestice klize jedna pokraj druge' }
            : { en: 'particles fly freely and bounce off the walls', hr: 'čestice slobodno lete i odbijaju se od zidova' }, lang);
        c.font = '12px ' + theme.font;
        const hintW = c.measureText(hint).width, barX = Lo.cx + Lo.cw - 150;
        if (w < 520 || 12 + hintW < barX - 10) K.text(c, hint, 12, 30, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        // container
        c.fillStyle = K.withAlpha(theme.fg, theme.isDark ? 0.08 : 0.04); K.roundRect(c, Lo.cx, Lo.cy, Lo.cw, Lo.ch, 6); c.fill();
        const sc = Lo.cw / W, pr = Math.max(2, R * sc);
        c.fillStyle = theme[st.sub.color];
        P.forEach(p => { c.beginPath(); c.arc(Lo.cx + p.x * sc, Lo.cy + p.y * sc, pr, 0, Math.PI * 2); c.fill(); });
        c.strokeStyle = theme.muted; c.lineWidth = 3; K.roundRect(c, Lo.cx, Lo.cy, Lo.cw, Lo.ch, 6); c.stroke();
        K.text(c, K.tr({ en: 'closed container', hr: 'zatvorena posuda' }, lang), Lo.cx + Lo.cw - 6, Lo.cy + Lo.ch - 7, { font: '10px ' + theme.font, color: theme.muted, align: 'right' });
        // speed bar
        if (w >= 520) {
          const bx = Lo.cx + Lo.cw - 150, by = 10, bw = 150, frac = K.clamp(meanSpeed() / Math.sqrt(8 * R_GAS * (st.sub.tMax + 273.15) / (Math.PI * st.sub.M)), 0, 1);
          K.text(c, K.tr({ en: 'particle speed', hr: 'brzina čestica' }, lang), bx, 16, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
          c.fillStyle = theme.line; K.roundRect(c, bx, by + 12, bw, 8, 4); c.fill();
          c.fillStyle = theme[st.sub.color]; K.roundRect(c, bx, by + 12, Math.max(6, bw * frac), 8, 4); c.fill();
          K.text(c, K.fmt(meanSpeed(), 0, lang) + ' m/s', bx + bw + 6, by + 16, { font: '11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        }
        drawThermo(c, Lo);
      }
      function drawThermo(c, Lo) {
        const s = st.sub, x = Lo.thermoX + Lo.thermoW * 0.5, top = 56, bottom = Lo.h - 44, tubeW = 14, bulbR = 13;
        const yOf = T => bottom - (T - s.tMin) / (s.tMax - s.tMin) * (bottom - top);
        c.fillStyle = theme.surface; K.roundRect(c, x - tubeW / 2, top - 8, tubeW, bottom - top + 8, tubeW / 2); c.fill();
        c.beginPath(); c.arc(x, bottom + bulbR, bulbR, 0, Math.PI * 2); c.fill();
        c.fillStyle = theme.c8;
        c.fillRect(x - tubeW / 2 + 4, yOf(st.T), tubeW - 8, bottom + bulbR - yOf(st.T));
        c.beginPath(); c.arc(x, bottom + bulbR, bulbR - 3, 0, Math.PI * 2); c.fill();
        c.strokeStyle = theme.muted; c.lineWidth = 1.5; K.roundRect(c, x - tubeW / 2, top - 8, tubeW, bottom - top + 8, tubeW / 2); c.stroke();
        c.beginPath(); c.arc(x, bottom + bulbR, bulbR, 0, Math.PI * 2); c.stroke();
        // scale marks
        const small = Lo.thermoW < 100, fs = (small ? 9 : 10) + 'px ' + theme.font;
        [{ T: s.tMin }, { T: s.tMax }, { T: s.melt, lab: { en: 'melts', hr: 'talište' } }, { T: s.boil, lab: { en: 'boils', hr: 'vrelište' } }].forEach(mk => {
          const y = yOf(mk.T);
          c.strokeStyle = theme.fg; c.lineWidth = mk.lab ? 2 : 1; c.beginPath(); c.moveTo(x + tubeW / 2, y); c.lineTo(x + tubeW / 2 + (mk.lab ? 8 : 5), y); c.stroke();
          K.text(c, K.fmt(mk.T, 0, lang) + ' °C', x + tubeW / 2 + 10, y, { font: fs, color: theme.fg, baseline: 'middle' });
          if (mk.lab) K.text(c, K.tr(mk.lab, lang), x - tubeW / 2 - 4, y, { font: fs, color: theme.muted, align: 'right', baseline: 'middle' });
        });
        // current temperature pointer
        const yT = yOf(st.T);
        c.fillStyle = theme.fg; c.beginPath(); c.moveTo(x - tubeW / 2 - 2, yT); c.lineTo(x - tubeW / 2 - 9, yT - 5); c.lineTo(x - tubeW / 2 - 9, yT + 5); c.closePath(); c.fill();
        K.text(c, K.fmt(st.T, 0, lang) + ' °C', x, top - 22, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
        if (st.heat) K.text(c, K.tr(st.heat > 0 ? { en: 'heating…', hr: 'grijanje…' } : { en: 'cooling…', hr: 'hlađenje…' }, lang), x, Lo.h - 10, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }

      // ---------- lifecycle ----------
      function reset() {
        L.stop(); selSub.set('water'); setSubstance(SUBSTANCES[0]);
        if (!ctx.reducedMotion) L.start();
        updatePlay();
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); holdHandlers.forEach(f => f()); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; refresh(); },
        reset
      };
    }
  });
})();
