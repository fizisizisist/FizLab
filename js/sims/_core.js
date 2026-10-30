/* FizLab — SimKit: shared helpers for every simulation module.
   Loaded before any sim file. Exposes window.SimKit and window.Sims. */
(function () {
  'use strict';

  // ---------- registry ----------
  const Sims = { list: [], byId: {} };
  Sims.register = function (def) {
    if (!def || !def.id || typeof def.mount !== 'function') {
      console.error('Sims.register: invalid sim definition', def);
      return;
    }
    if (Sims.byId[def.id]) { console.warn('Sims.register: duplicate id', def.id); }
    Sims.byId[def.id] = def;
    Sims.list.push(def);
  };
  window.Sims = Sims;

  // ---------- theme ----------
  const THEME_KEYS = ['bg', 'surface', 'surface2', 'fg', 'muted', 'line', 'accent', 'accent2',
    'good', 'warn', 'bad', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'sky', 'ground', 'water'];
  function theme() {
    const cs = getComputedStyle(document.documentElement);
    const t = {};
    THEME_KEYS.forEach(k => { t[k] = cs.getPropertyValue('--' + k).trim() || '#888'; });
    t.font = (cs.getPropertyValue('--font-body').trim() || 'system-ui, sans-serif');
    t.fontDisplay = (cs.getPropertyValue('--font-display').trim() || t.font);
    t.isDark = (document.documentElement.getAttribute('data-theme') === 'dark') ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return t;
  }

  // ---------- math / format ----------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  function fmt(v, digits, lang) {
    if (v === null || v === undefined || Number.isNaN(v)) return '–';
    digits = digits === undefined ? 1 : digits;
    let s = Number(v).toFixed(digits);
    if (lang === 'hr') s = s.replace('.', ',');
    return s;
  }
  // bilingual pick: tr({en:'x',hr:'y'}, 'hr') -> 'y'; strings pass through
  function tr(obj, lang) {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string' || typeof obj === 'number') return String(obj);
    return obj[lang] !== undefined ? obj[lang] : (obj.en !== undefined ? obj.en : '');
  }
  function withAlpha(hex, a) {
    hex = (hex || '#888').trim();
    if (hex.startsWith('rgb')) return hex.replace(/rgba?\(([^)]+)\)/, (m, inner) => {
      const p = inner.split(',').slice(0, 3).map(s => s.trim()); return `rgba(${p.join(',')},${a})`;
    });
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // ---------- canvas ----------
  // createCanvas(parent, {aspect, minHeight, maxHeight}) -> {canvas, ctx, w, h, onResize(cb), destroy()}
  function createCanvas(parent, opts) {
    opts = Object.assign({ aspect: 16 / 9, minHeight: 240, maxHeight: 520 }, opts || {});
    const wrap = document.createElement('div');
    wrap.className = 'sk-canvas-wrap';
    const canvas = document.createElement('canvas');
    canvas.className = 'sk-canvas';
    wrap.appendChild(canvas);
    parent.appendChild(wrap);
    const ctx = canvas.getContext('2d');
    const api = { canvas, ctx, w: 0, h: 0, wrap };
    const cbs = [];
    function resize() {
      const cw = Math.max(200, wrap.clientWidth || parent.clientWidth || 600);
      let ch = Math.round(cw / opts.aspect);
      ch = clamp(ch, opts.minHeight, opts.maxHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.style.height = ch + 'px';
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      api.w = cw; api.h = ch;
      cbs.forEach(cb => { try { cb(cw, ch); } catch (e) { console.error(e); } });
    }
    let ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => resize());
      ro.observe(wrap);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();
    api.onResize = cb => { cbs.push(cb); };
    api.resize = resize;
    api.destroy = () => { if (ro) ro.disconnect(); else window.removeEventListener('resize', resize); wrap.remove(); };
    // pointer helpers: returns canvas-space coords in CSS px
    api.pointer = (ev) => {
      const r = canvas.getBoundingClientRect();
      const p = (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]) || ev;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    };
    return api;
  }

  // ---------- animation loop ----------
  // loop(fn) ; fn(dt, t) ; dt in seconds clamped to 0.05
  function loop(fn) {
    let raf = 0, running = false, last = 0, t = 0;
    function frame(now) {
      if (!running) return;
      const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 0;
      last = now; t += dt;
      try { fn(dt, t); } catch (e) { console.error('sim loop error', e); running = false; return; }
      raf = requestAnimationFrame(frame);
    }
    const api = {
      start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); },
      stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
      toggle() { running ? api.stop() : api.start(); },
      get running() { return running; },
      get time() { return t; },
      resetTime() { t = 0; }
    };
    const onVis = () => { if (document.hidden) { last = 0; } };
    document.addEventListener('visibilitychange', onVis);
    api.destroy = () => { api.stop(); document.removeEventListener('visibilitychange', onVis); };
    return api;
  }

  // ---------- controls ----------
  let uid = 0;
  function controls(parent, lang) {
    const el = document.createElement('div');
    el.className = 'sk-controls';
    parent.appendChild(el);
    const items = []; // {relabel(lang)}
    let curLang = lang || 'en';
    const api = { el, items };

    function field(labelObj, inputEl, cls) {
      const f = document.createElement('div');
      f.className = 'sk-field' + (cls ? ' ' + cls : '');
      const lab = document.createElement('label');
      lab.className = 'sk-label';
      const id = 'sk-' + (++uid);
      if (inputEl) { inputEl.id = id; lab.htmlFor = id; }
      lab.textContent = tr(labelObj, curLang);
      f.appendChild(lab);
      if (inputEl) f.appendChild(inputEl);
      el.appendChild(f);
      items.push({ relabel: l => { lab.textContent = tr(labelObj, l); } });
      return { f, lab, id };
    }

    api.slider = function (o) {
      const input = document.createElement('input');
      input.type = 'range';
      input.className = 'sk-slider';
      input.min = o.min; input.max = o.max; input.step = o.step === undefined ? 'any' : o.step;
      input.value = o.value;
      const row = document.createElement('div'); row.className = 'sk-slider-row';
      const val = document.createElement('output'); val.className = 'sk-value';
      row.appendChild(input); row.appendChild(val);
      const { f, lab } = field(o.label, null);
      lab.htmlFor = input.id = 'sk-' + (++uid);
      f.appendChild(row);
      const digits = o.digits === undefined ? (Number(o.step) >= 1 ? 0 : 1) : o.digits;
      function show() {
        const v = parseFloat(input.value);
        val.textContent = o.format ? o.format(v, curLang) : (fmt(v, digits, curLang) + (o.unit ? ' ' + tr(o.unit, curLang) : ''));
      }
      input.addEventListener('input', () => { show(); if (o.onChange) o.onChange(parseFloat(input.value)); });
      show();
      items.push({ relabel: () => show() });
      return {
        el: f, input,
        get: () => parseFloat(input.value),
        set: (v, fire) => { input.value = v; show(); if (fire && o.onChange) o.onChange(parseFloat(input.value)); },
        setDisabled: d => { input.disabled = !!d; f.classList.toggle('is-disabled', !!d); }
      };
    };

    api.button = function (o) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sk-btn' + (o.variant ? ' ' + o.variant : '');
      let labelObj = o.label;
      const render = () => { b.textContent = (o.icon ? o.icon + ' ' : '') + tr(labelObj, curLang); };
      render();
      b.addEventListener('click', e => { if (o.onClick) o.onClick(e); });
      const wrapEl = document.createElement('div'); wrapEl.className = 'sk-field sk-field-btn';
      wrapEl.appendChild(b); el.appendChild(wrapEl);
      items.push({ relabel: () => render() });
      return {
        el: b,
        setLabel: lo => { labelObj = lo; render(); },
        setIcon: ic => { o.icon = ic; render(); },
        setDisabled: d => { b.disabled = !!d; },
        setActive: a => { b.classList.toggle('is-active', !!a); }
      };
    };

    api.toggle = function (o) {
      const input = document.createElement('input');
      input.type = 'checkbox'; input.className = 'sk-check'; input.checked = !!o.value;
      const wrap = document.createElement('span'); wrap.className = 'sk-switch';
      const knob = document.createElement('span'); knob.className = 'sk-switch-knob';
      wrap.appendChild(input); wrap.appendChild(knob);
      const { f, lab } = field(o.label, null, 'sk-field-toggle');
      input.id = 'sk-' + (++uid); lab.htmlFor = input.id;
      f.insertBefore(wrap, lab);
      input.addEventListener('change', () => { if (o.onChange) o.onChange(input.checked); });
      return { el: f, input, get: () => input.checked, set: (v, fire) => { input.checked = !!v; if (fire && o.onChange) o.onChange(input.checked); } };
    };

    api.select = function (o) {
      const sel = document.createElement('select');
      sel.className = 'sk-select';
      const opts = [];
      o.options.forEach(op => {
        const e = document.createElement('option'); e.value = op.value; e.textContent = tr(op.label, curLang);
        sel.appendChild(e); opts.push({ e, label: op.label });
      });
      if (o.value !== undefined) sel.value = o.value;
      field(o.label, sel);
      sel.addEventListener('change', () => { if (o.onChange) o.onChange(sel.value); });
      items.push({ relabel: l => opts.forEach(x => { x.e.textContent = tr(x.label, l); }) });
      return { el: sel, get: () => sel.value, set: (v, fire) => { sel.value = v; if (fire && o.onChange) o.onChange(sel.value); } };
    };

    // segmented buttons (radio)
    api.segmented = function (o) {
      const wrap = document.createElement('div'); wrap.className = 'sk-seg'; wrap.setAttribute('role', 'group');
      let value = o.value;
      const btns = [];
      const render = () => btns.forEach(x => { x.b.textContent = tr(x.op.label, curLang); x.b.classList.toggle('is-active', x.op.value === value); x.b.setAttribute('aria-pressed', x.op.value === value ? 'true' : 'false'); });
      o.options.forEach(op => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'sk-seg-btn';
        b.addEventListener('click', () => { value = op.value; render(); if (o.onChange) o.onChange(value); });
        wrap.appendChild(b); btns.push({ b, op });
      });
      render();
      const { f } = field(o.label, null, 'sk-field-seg'); f.appendChild(wrap);
      items.push({ relabel: () => render() });
      return { el: wrap, get: () => value, set: (v, fire) => { value = v; render(); if (fire && o.onChange) o.onChange(value); } };
    };

    // display-only value
    api.readout = function (o) {
      const out = document.createElement('div'); out.className = 'sk-readout';
      const v = document.createElement('span'); v.className = 'sk-readout-value'; v.textContent = '–';
      const u = document.createElement('span'); u.className = 'sk-readout-unit'; u.textContent = o.unit ? tr(o.unit, curLang) : '';
      out.appendChild(v); out.appendChild(u);
      const { f } = field(o.label, null, 'sk-field-readout'); f.appendChild(out);
      const digits = o.digits === undefined ? 1 : o.digits;
      let lastVal = null;
      const show = () => { if (lastVal === null) { v.textContent = '–'; return; } v.textContent = typeof lastVal === 'number' ? fmt(lastVal, digits, curLang) : tr(lastVal, curLang); u.textContent = o.unit ? tr(o.unit, curLang) : ''; };
      items.push({ relabel: () => show() });
      return { el: f, set: val => { lastVal = val; show(); }, setColor: c => { v.style.color = c || ''; } };
    };

    api.note = function (o) {
      const p = document.createElement('p'); p.className = 'sk-note';
      let text = o.text;
      const render = () => { p.textContent = tr(text, curLang); };
      render(); el.appendChild(p);
      items.push({ relabel: () => render() });
      return { el: p, set: t => { text = t; render(); } };
    };

    api.setLang = function (l) { curLang = l; items.forEach(i => i.relabel(l)); };
    api.destroy = function () { el.remove(); };
    return api;
  }

  // ---------- drawing helpers ----------
  function arrow(ctx, x1, y1, x2, y2, o) {
    o = Object.assign({ color: '#000', width: 3, head: 10 }, o || {});
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    if (len < 0.5) return;
    const ux = dx / len, uy = dy / len;
    const head = Math.min(o.head, len);
    ctx.save();
    ctx.strokeStyle = o.color; ctx.fillStyle = o.color; ctx.lineWidth = o.width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ux * head * 0.6, y2 - uy * head * 0.6); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * head - uy * head * 0.5, y2 - uy * head + ux * head * 0.5);
    ctx.lineTo(x2 - ux * head + uy * head * 0.5, y2 - uy * head - ux * head * 0.5);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function text(ctx, str, x, y, o) {
    o = Object.assign({ font: '14px sans-serif', color: '#000', align: 'left', baseline: 'alphabetic' }, o || {});
    ctx.save();
    ctx.font = o.font; ctx.fillStyle = o.color; ctx.textAlign = o.align; ctx.textBaseline = o.baseline;
    ctx.fillText(str, x, y);
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function grid(ctx, x, y, w, h, step, color) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let gx = x; gx <= x + w + 0.1; gx += step) { ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); }
    for (let gy = y; gy <= y + h + 0.1; gy += step) { ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); }
    ctx.stroke(); ctx.restore();
  }
  // niceScale(min, max, maxTicks) -> {min, max, step, ticks}: expands max to a round number so ticks are clean
  function niceScale(min, max, maxTicks) {
    maxTicks = maxTicks || 5;
    const range = Math.max(1e-9, max - min);
    const rough = range / maxTicks;
    const pow = Math.pow(10, Math.floor(Math.log10(rough)));
    const frac = rough / pow;
    const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10;
    const step = niceFrac * pow;
    const nMin = Math.floor(min / step) * step, nMax = Math.ceil(max / step) * step;
    return { min: nMin, max: nMax === nMin ? nMin + step : nMax, step, ticks: Math.round((nMax - nMin) / step) || 1 };
  }
  // simple line chart: series = [{points:[[x,y],...], color, label}]
  // Axis ranges are expanded to "nice" round numbers unless o.nice === false.
  function lineChart(ctx, o) {
    const t = o.theme || theme();
    const { x, y, w, h } = o;
    const padL = o.padL === undefined ? 44 : o.padL, padB = o.padB === undefined ? 28 : o.padB, padT = 10, padR = 10;
    const px = x + padL, py = y + padT, pw = w - padL - padR, ph = h - padT - padB;
    let xMin = o.xMin || 0, xMax = o.xMax || 10, yMin = o.yMin || 0, yMax = o.yMax || 10;
    let nx = o.xTicks || 5, ny = o.yTicks || 4;
    if (o.nice !== false) {
      const sx0 = niceScale(xMin, xMax, o.xTicks || 5), sy0 = niceScale(yMin, yMax, o.yTicks || 4);
      xMin = sx0.min; xMax = sx0.max; nx = sx0.ticks; yMin = sy0.min; yMax = sy0.max; ny = sy0.ticks;
    }
    const sx = v => px + (v - xMin) / (xMax - xMin || 1) * pw;
    const sy = v => py + ph - (v - yMin) / (yMax - yMin || 1) * ph;
    ctx.save();
    ctx.fillStyle = t.surface; roundRect(ctx, x, y, w, h, 8); ctx.fill();
    // grid + ticks
    ctx.strokeStyle = t.line; ctx.lineWidth = 1;
    ctx.font = '11px ' + t.font; ctx.fillStyle = t.muted;
    const digitsFor = (step) => step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
    const xd = o.xDigits !== undefined ? o.xDigits : digitsFor((xMax - xMin) / nx);
    const yd = o.yDigits !== undefined ? o.yDigits : digitsFor((yMax - yMin) / ny);
    for (let i = 0; i <= nx; i++) {
      const v = xMin + (xMax - xMin) * i / nx, gx = sx(v);
      ctx.beginPath(); ctx.moveTo(gx, py); ctx.lineTo(gx, py + ph); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(fmt(v, xd, o.lang), gx, py + ph + 4);
    }
    for (let i = 0; i <= ny; i++) {
      const v = yMin + (yMax - yMin) * i / ny, gy = sy(v);
      ctx.beginPath(); ctx.moveTo(px, gy); ctx.lineTo(px + pw, gy); ctx.stroke();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(fmt(v, yd, o.lang), px - 6, gy);
    }
    // axes labels
    if (o.xLabel) text(ctx, tr(o.xLabel, o.lang), px + pw, py + ph + 16, { font: '11px ' + t.font, color: t.fg, align: 'right' });
    if (o.yLabel) text(ctx, tr(o.yLabel, o.lang), px + 4, py + 2, { font: '11px ' + t.font, color: t.fg, align: 'left', baseline: 'top' });
    // clip + series
    ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
    (o.series || []).forEach(s => {
      if (!s.points || s.points.length < 2) return;
      ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      ctx.beginPath();
      s.points.forEach((p, i) => { const X = sx(p[0]), Y = sy(p[1]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
      ctx.stroke();
      const last = s.points[s.points.length - 1];
      ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(sx(last[0]), sy(last[1]), 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = t.surface; ctx.lineWidth = 2; ctx.stroke();
    });
    ctx.restore();
    // legend (only for 2+ series)
    if (o.series && o.series.length > 1) {
      let lx = px + 8;
      o.series.forEach(s => {
        ctx.fillStyle = s.color; ctx.fillRect(lx, py + ph - 14, 10, 10);
        const lab = tr(s.label, o.lang);
        text(ctx, lab, lx + 14, py + ph - 9, { font: '11px ' + t.font, color: t.fg, baseline: 'middle' });
        lx += 14 + ctx.measureText(lab).width + 12;
      });
    }
    return { sx, sy, px, py, pw, ph };
  }

  window.SimKit = { theme, clamp, lerp, fmt, tr, withAlpha, createCanvas, loop, controls, arrow, text, roundRect, grid, lineChart, niceScale };
})();
