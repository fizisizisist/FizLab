/* FizLab sim: Galileo's ramp — a ball rolls down one ramp and up another; without friction it always
   climbs back to the release height, and on a flat track it rolls on forever (inertia). */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81;
  const H0 = 1.15;                       // m, height of the left ramp top
  const ANG = 30 * Math.PI / 180;        // left ramp angle (fixed)
  const L0 = H0 / Math.sin(ANG);         // left ramp length (m)
  const B = 1.0;                         // flat bottom length (m)
  const MASS = 1;                        // kg (only for the energy numbers)
  const MU = 0.025;                      // rolling friction coefficient when friction is on
  const R_BALL = 0.06;                   // m
  const FLAT_LEN = 1e6;                  // "infinite" right track when the angle is 0

  window.Sims.register({
    id: 'galileo',
    title: { en: 'Galileo\'s Ramp', hr: 'Galilejeva kosina' },
    summary: {
      en: 'Release a ball on one ramp and watch it climb the other. Lower the second ramp step by step — what happens when it becomes flat?',
      hr: 'Pusti kuglicu niz jednu kosinu i gledaj kako se penje uz drugu. Spuštaj drugu kosinu korak po korak — što se događa kad postane ravna?'
    },
    tasks: [
      { en: 'Release the ball from 0.8 m with the right ramp at 30°. How high does it climb? Compare with the dashed line.', hr: 'Pusti kuglicu s 0,8 m uz desnu kosinu od 30°. Koliko se visoko popne? Usporedi s crtkanom linijom.' },
      { en: 'Set the right ramp to 10°. Does the ball climb to a different height? Does it travel a longer distance?', hr: 'Postavi desnu kosinu na 10°. Penje li se kuglica do druge visine? Prelazi li dulji put?' },
      { en: 'Set the angle to 0°. Why does the ball never stop? Is any force pushing it?', hr: 'Postavi kut na 0°. Zašto se kuglica nikad ne zaustavi? Gura li je neka sila?' },
      { en: 'Switch friction on. Watch the energy bars: where does the energy go?', hr: 'Uključi trenje. Prati stupce energije: kamo odlazi energija?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);

      // s = arc length along the track, v = speed along it (+ = towards the right ramp), e = mechanical energy per kg
      const st = { h0: 0.6, thetaDeg: 30, friction: false, chart: true, t: 0, s: 0, v: 0, e: 0, rot: 0, stopped: false,
        climb: { active: false, maxY: 0, s: 0 }, history: [], pts: [], lastSample: 0, dragging: false };
      const NICE_T = [10, 15, 20, 30, 40, 60, 80, 100, 150, 200, 300, 400, 600];

      // ---------- controls ----------
      const slH = C.slider({ label: { en: 'Release height', hr: 'Visina puštanja' }, min: 0.2, max: 1, step: 0.05, value: 0.6, unit: 'm', digits: 2, onChange: v => { st.h0 = v; reset(); } });
      C.slider({ label: { en: 'Right ramp angle', hr: 'Kut desne kosine' }, min: 0, max: 45, step: 1, value: 30, unit: '°', digits: 0, onChange: v => { st.thetaDeg = v; reset(); } });
      C.toggle({ label: { en: 'Friction', hr: 'Trenje' }, value: false, onChange: v => { st.friction = v; st.stopped = false; updateOut(); draw(); } });
      C.toggle({ label: { en: 'Height–time graph', hr: 'Graf visina–vrijeme' }, value: true, onChange: v => { st.chart = v; draw(); } });
      const btnPlay = C.button({ label: { en: 'Release!', hr: 'Pusti!' }, variant: 'primary', onClick: () => {
        if (st.stopped) reset();
        L.toggle(); updatePlay();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outV = C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'm/s', digits: 2 });
      const outH = C.readout({ label: { en: 'Height', hr: 'Visina' }, unit: 'm', digits: 2 });
      const outD = C.readout({ label: { en: 'Distance on right ramp', hr: 'Put po desnoj kosini' }, unit: 'm', digits: 2 });
      const outT = C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 1 });
      const note = C.note({ text: { en: '', hr: '' } });

      // ---------- track geometry (arc length s from the left ramp top) ----------
      function theta() { return st.thetaDeg * Math.PI / 180; }
      function L2() { return st.thetaDeg < 0.5 ? FLAT_LEN : 1.3 / Math.sin(theta()); }
      function trackLen() { return L0 + B + L2(); }
      const leftX = -H0 / Math.tan(ANG);
      // point on the track: position (x, y) in metres and the inclination phi in the direction of increasing s
      function segOf(s) {
        if (s < L0) return { phi: -ANG, x: leftX + s * Math.cos(ANG), y: H0 - s * Math.sin(ANG) };
        if (s < L0 + B) return { phi: 0, x: s - L0, y: 0 };
        const u = s - L0 - B, th = theta();
        return { phi: th, x: B + u * Math.cos(th), y: u * Math.sin(th) };
      }
      function startS() { return (H0 - st.h0) / Math.sin(ANG); }

      // ---------- state ----------
      function updatePlay() {
        btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : (st.t > 0 ? { en: 'Continue', hr: 'Nastavi' } : { en: 'Release!', hr: 'Pusti!' }));
      }
      function clearRun() {
        st.t = 0; st.s = startS(); st.v = 0; st.e = G * st.h0; st.rot = 0; st.stopped = false;
        st.climb = { active: false, maxY: 0, s: 0 }; st.history = []; st.pts = [[0, st.h0]]; st.lastSample = 0;
      }
      function reset() { L.stop(); clearRun(); updatePlay(); updateOut(); draw(); }

      // one sub-step along the track: a = -g·sin(slope) plus rolling friction; returns true when at rest.
      // The speed is then re-scaled from the tracked mechanical energy, so without friction the ball
      // returns to exactly the release height however long the track is.
      function substep(h) {
        const P = segOf(st.s);
        const sinP = Math.sin(P.phi), cosP = Math.cos(P.phi);
        const ag = -G * sinP;
        let a = ag;
        if (st.friction) {
          const fmax = MU * G * cosP;
          if (Math.abs(st.v) < 1e-4 && Math.abs(ag) <= fmax) { st.v = 0; return true; }
          const dir = Math.abs(st.v) < 1e-4 ? Math.sign(ag) : Math.sign(st.v);
          a = ag - dir * fmax;
          if ((st.v + a * h) * st.v < 0 && Math.abs(ag) <= fmax) { st.v = 0; return true; }
        }
        st.v += a * h;
        const ds = st.v * h;
        st.s += ds;
        st.rot -= ds / R_BALL;
        if (st.friction) st.e = Math.max(0, st.e - MU * G * cosP * Math.abs(ds));   // work done against friction -> heat
        if (st.s < 0) { st.s = 0; st.v = Math.abs(st.v); }
        const total = trackLen();
        if (st.s > total) { st.s = total; st.v = -Math.abs(st.v); }
        const v2 = 2 * (st.e - G * segOf(st.s).y);
        if (v2 > 1e-8 && Math.abs(st.v) > 1e-6) st.v = Math.sign(st.v) * Math.sqrt(v2);
        return false;
      }
      function step(dt) {
        if (dt <= 0) return;
        const n = 8, h = dt / n;
        let rest = false;
        for (let i = 0; i < n; i++) rest = substep(h);
        st.t += dt;
        // remember the highest point of the current climb up the right ramp
        if (st.s > L0 + B) {
          const P = segOf(st.s);
          if (st.v > 0) { if (!st.climb.active) { st.climb.active = true; st.climb.maxY = 0; } if (P.y >= st.climb.maxY) { st.climb.maxY = P.y; st.climb.s = st.s; } }
          else if (st.climb.active) { st.climb.active = false; st.history.push(st.climb.maxY); if (st.history.length > 6) st.history.shift(); }
        }
        if (st.t - st.lastSample >= 0.05) {
          st.lastSample = st.t; st.pts.push([st.t, segOf(st.s).y]);
          if (st.pts.length > 6000) st.pts.shift();
        }
        if (rest && st.friction) { st.stopped = true; L.stop(); updatePlay(); }
      }
      function updateOut() {
        const P = segOf(st.s);
        outV.set(Math.abs(st.v)); outH.set(P.y); outD.set(Math.max(0, st.s - L0 - B)); outT.set(st.t);
        let txt;
        if (st.friction) txt = { en: 'Friction turns a little of the energy into heat, so the ball stops a bit lower each time. In Galileo\'s ideal experiment there is no friction.',
          hr: 'Trenje pretvara malo energije u toplinu, pa se kuglica svaki put zaustavi malo niže. U Galilejevu idealnom pokusu trenja nema.' };
        else if (st.thetaDeg < 0.5) txt = { en: 'The track is flat: the ball rolls on forever at constant speed. No force is needed to keep it moving: that is inertia (Newton\'s first law).',
          hr: 'Staza je ravna: kuglica se giba stalnom brzinom bez kraja. Za održavanje gibanja nije potrebna sila: to je tromost (prvi Newtonov zakon).' };
        else txt = { en: 'Without friction the ball climbs until it is as high as where it started: the energy is conserved (Ep + Ek stays the same). A shallower ramp only means a longer run.',
          hr: 'Bez trenja kuglica se penje dok ne dosegne visinu s koje je puštena: energija se čuva (Ep + Ek ostaje isto). Blaža kosina znači samo dulji put.' };
        note.set(txt);
      }

      // ---------- camera ----------
      function view() {
        const w = cv.w, h = cv.h, top = 44, bottom = h - 26;
        const showChart = st.chart && w >= 640;
        const sceneW = showChart ? Math.round(w * 0.6) : w;
        const th = theta();
        const rightX = st.thetaDeg < 0.5 ? Infinity : B + L2() * Math.cos(th);
        const trackW = rightX - leftX;
        const availW = sceneW - 50;
        let s = (bottom - top) / 1.45;
        if (trackW * s > availW) s = Math.max(availW / trackW, (bottom - top) / 3.3);
        let off = 0;
        if (trackW * s > availW) {
          const ballSX = (segOf(st.s).x - leftX) * s;
          off = K.clamp(ballSX - availW * 0.55, 0, trackW * s - availW);
        }
        return { w, h, sceneW, showChart, s, top, bottom, rightX, X: xw => 25 + (xw - leftX) * s - off, Y: yw => bottom - yw * s };
      }
      function niceT(v) { for (let i = 0; i < NICE_T.length; i++) if (NICE_T[i] >= v) return NICE_T[i]; return Math.ceil(v / 600) * 600; }
      function ballCenter(V) {
        const P = segOf(st.s), r = R_BALL;
        return { x: V.X(P.x - r * Math.sin(P.phi)), y: V.Y(P.y + r * Math.cos(P.phi)), r: Math.max(6, r * V.s), P };
      }

      // ---------- pointer: drag the ball along the left ramp to set the release height ----------
      function onDown(ev) {
        if (L.running || st.t > 0) return;
        const V = view(), p = cv.pointer(ev), b = ballCenter(V);
        if (Math.hypot(p.x - b.x, p.y - b.y) > b.r + 14) return;
        st.dragging = true;
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault();
      }
      function onMove(ev) {
        const V = view(), p = cv.pointer(ev);
        if (st.dragging) {
          const hNew = Math.round(K.clamp((V.bottom - p.y) / V.s, 0.2, 1) * 20) / 20;
          if (hNew !== st.h0) { st.h0 = hNew; slH.set(hNew); clearRun(); updateOut(); draw(); }
        } else if (!L.running && st.t === 0) {
          const b = ballCenter(V);
          cv.canvas.style.cursor = Math.hypot(p.x - b.x, p.y - b.y) <= b.r + 14 ? 'grab' : 'default';
        } else cv.canvas.style.cursor = 'default';
      }
      function onUp() { if (!st.dragging) return; st.dragging = false; cv.canvas.style.cursor = 'grab'; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing ----------
      function draw() {
        const g = cv.ctx, V = view(), w = V.sceneW, h = V.h;
        g.clearRect(0, 0, V.w, V.h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, V.w, V.h);
        g.save(); g.beginPath(); g.rect(0, 0, w, h); g.clip();
        const th = theta(), flat = st.thetaDeg < 0.5;
        const endX = flat ? w + 60 : V.X(V.rightX), endY = flat ? V.Y(0) : V.Y(L2() * Math.sin(th));
        // ground under the track (with a small plateau at the left ramp top)
        g.fillStyle = theme.ground; g.beginPath();
        g.moveTo(V.X(leftX) - 60, V.Y(H0)); g.lineTo(V.X(leftX), V.Y(H0)); g.lineTo(V.X(0), V.Y(0)); g.lineTo(V.X(B), V.Y(0));
        g.lineTo(endX, endY); g.lineTo(endX, h + 10); g.lineTo(V.X(leftX) - 60, h + 10); g.closePath(); g.fill();
        g.strokeStyle = theme.muted; g.lineWidth = 2.5; g.lineJoin = 'round'; g.beginPath();
        g.moveTo(V.X(leftX) - 60, V.Y(H0)); g.lineTo(V.X(leftX), V.Y(H0)); g.lineTo(V.X(0), V.Y(0)); g.lineTo(V.X(B), V.Y(0)); g.lineTo(endX, endY); g.stroke();
        // ramp angle label
        const fx = V.X(B), fy = V.Y(0);
        if (!flat && st.thetaDeg >= 3) {
          g.strokeStyle = theme.fg; g.lineWidth = 1; g.beginPath(); g.arc(fx, fy, 30, -th, 0); g.stroke();
        }
        K.text(g, 'α = ' + K.fmt(st.thetaDeg, 0, lang) + '°' + (flat ? K.tr({ en: ' (flat)', hr: ' (ravno)' }, lang) : ''), fx + 38, fy - (flat ? 14 : 30 * Math.sin(th / 2) + 2), { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'bottom' });
        // height ruler (left edge)
        g.strokeStyle = theme.fg; g.lineWidth = 1;
        const rx = 14;
        g.beginPath(); g.moveTo(rx, V.Y(0)); g.lineTo(rx, V.Y(1)); g.stroke();
        for (let m = 0; m <= 1.001; m += 0.25) {
          const y = V.Y(m), big = Math.abs(m * 2 - Math.round(m * 2)) < 1e-6;
          g.beginPath(); g.moveTo(rx - (big ? 5 : 3), y); g.lineTo(rx + (big ? 5 : 3), y); g.stroke();
          if (big) K.text(g, K.fmt(m, m === 0 ? 0 : 1, lang) + (m === 1 ? ' m' : ''), rx + 8, y, { font: '10px ' + theme.font, color: theme.fg, baseline: 'middle' });
        }
        // release height: dashed "same height" line
        const hy = V.Y(st.h0);
        g.save(); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.setLineDash([7, 6]);
        g.beginPath(); g.moveTo(V.X(leftX) - 60, hy); g.lineTo(w, hy); g.stroke(); g.restore();
        K.text(g, K.tr({ en: 'same height', hr: 'ista visina' }, lang) + '  h₀ = ' + K.fmt(st.h0, 2, lang) + ' m', V.X(B / 2), hy - 4, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        // ghost at the release point
        const s0 = startS(), P0 = segOf(s0);
        const gx = V.X(P0.x - R_BALL * Math.sin(P0.phi)), gy = V.Y(P0.y + R_BALL * Math.cos(P0.phi)), gr = Math.max(6, R_BALL * V.s);
        g.save(); g.strokeStyle = theme.muted; g.setLineDash([3, 3]); g.lineWidth = 1; g.beginPath(); g.arc(gx, gy, gr, 0, Math.PI * 2); g.stroke(); g.restore();
        // highest point reached on the right ramp
        if (st.climb.maxY > 0.02) {
          const Pm = segOf(st.climb.s), mx = V.X(Pm.x), my = V.Y(Pm.y);
          g.fillStyle = theme.c3; g.beginPath(); g.moveTo(mx, my + 3); g.lineTo(mx - 6, my + 13); g.lineTo(mx + 6, my + 13); g.closePath(); g.fill();
          K.text(g, K.tr({ en: 'reached ', hr: 'dosegnuto ' }, lang) + K.fmt(st.climb.maxY, 2, lang) + ' m', mx, my + 16, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        }
        // the ball
        const b = ballCenter(V);
        g.fillStyle = theme.c3; g.beginPath(); g.arc(b.x, b.y, b.r, 0, Math.PI * 2); g.fill();
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.stroke();
        g.strokeStyle = theme.surface; g.lineWidth = 2; g.beginPath();
        g.moveTo(b.x, b.y); g.lineTo(b.x + Math.cos(st.rot) * b.r * 0.8, b.y - Math.sin(st.rot) * b.r * 0.8); g.stroke();
        // speed arrow along the track
        if (Math.abs(st.v) > 0.03) {
          const len = K.clamp(Math.abs(st.v) * 22, 10, 140), dir = Math.sign(st.v);
          const ux = Math.cos(b.P.phi) * dir, uy = -Math.sin(b.P.phi) * dir;
          const ax = b.x + ux * (b.r + 2), ay = b.y + uy * (b.r + 2);
          K.arrow(g, ax, ay, ax + ux * len, ay + uy * len, { color: theme.fg, width: 3, head: 9 });
          const onFlat = Math.abs(b.P.phi) < 1e-6 && !st.friction;
          K.text(g, 'v = ' + K.fmt(Math.abs(st.v), 1, lang) + ' m/s' + (onFlat ? K.tr({ en: ' (constant)', hr: ' (stalna)' }, lang) : ''), ax + ux * len / 2, ay + uy * len / 2 - 14, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
          if (onFlat && flat && st.s > L0 + B) K.text(g, K.tr({ en: 'no force needed', hr: 'nije potrebna sila' }, lang), b.x, b.y + b.r + 6, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        } else if (st.stopped) {
          K.text(g, K.tr({ en: 'stopped', hr: 'stala' }, lang), b.x, b.y - b.r - 6, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        }
        // header: time and (on a flat track) the growing distance
        K.text(g, 't = ' + K.fmt(st.t, 1, lang) + ' s', 10, 14, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        if (flat && st.s > L0 + B) K.text(g, K.tr({ en: 'distance on the flat: ', hr: 'put po ravnom: ' }, lang) + K.fmt(st.s - L0 - B, 1, lang) + ' m', 10, 32, { font: '12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        // heights reached on the right ramp so far (equal without friction, shrinking with it)
        if (st.history.length) {
          const parts = st.history.map(v => K.fmt(v, 2, lang));
          K.text(g, K.tr({ en: 'climbs: ', hr: 'uspon: ' }, lang) + parts.join(' · ') + ' m', w - 8, h - 8, { font: '11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'bottom' });
        }
        // energy bars
        const E0 = MASS * G * st.h0, pe = MASS * G * b.P.y, ke = 0.5 * MASS * st.v * st.v, heat = Math.max(0, E0 - MASS * st.e);
        const bw = Math.min(120, w * 0.3), bx = w - bw - 58, by = 8;
        K.text(g, K.tr({ en: 'Energy (1 kg ball)', hr: 'Energija (kuglica 1 kg)' }, lang), bx, by + 5, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        const rows = [['Ep', pe, theme.c1], ['Ek', ke, theme.c2]];
        if (st.friction) rows.push([K.tr({ en: 'heat', hr: 'toplina' }, lang), heat, theme.c8]);
        rows.forEach((r, i) => {
          const y = by + 16 + i * 15;
          K.text(g, r[0], bx - 4, y + 5, { font: '11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
          g.fillStyle = K.withAlpha(theme.fg, 0.08); g.fillRect(bx, y, bw, 10);
          g.fillStyle = r[2]; g.fillRect(bx, y, bw * K.clamp(r[1] / (E0 || 1), 0, 1), 10);
          K.text(g, K.fmt(r[1], 1, lang) + ' J', bx + bw + 4, y + 5, { font: '11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        });
        g.restore();
        // height–time graph: every peak reaches h0 without friction, lower and lower with it
        if (V.showChart) {
          const xMax = niceT(Math.max(10, st.t * 1.05));
          const ch = K.lineChart(g, { x: w + 8, y: 8, w: V.w - w - 16, h: h - 16, xMin: 0, xMax, yMin: 0, yMax: 1, nice: false, xTicks: 5, yTicks: 4, xDigits: 0, yDigits: 2, lang, theme,
            xLabel: { en: 'time (s)', hr: 'vrijeme (s)' }, yLabel: { en: 'height (m)', hr: 'visina (m)' },
            series: [{ points: st.pts, color: theme.c3, label: { en: 'height', hr: 'visina' } }] });
          const hy2 = ch.sy(st.h0);
          g.save(); g.strokeStyle = theme.fg; g.lineWidth = 1; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(ch.px, hy2); g.lineTo(ch.px + ch.pw, hy2); g.stroke(); g.restore();
          K.text(g, 'h₀', ch.px + ch.pw - 4, hy2 - 3, { font: '10px ' + theme.font, color: theme.fg, align: 'right' });
        }
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
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
