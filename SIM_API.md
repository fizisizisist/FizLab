# FizLab — Simulation module spec (read fully before writing a sim)

FizLab is a bilingual (English / Croatian) physics learning app for ages 11–14 (Croatian 7th–8th grade,
US grades 5–8). Every simulation is ONE self-contained JS file in `js/sims/<id>.js`, vanilla JS + Canvas 2D,
no external libraries, no build step. Files load as classic scripts after `js/sims/_core.js`.

## Registration

```js
(function () {
  'use strict';
  const K = window.SimKit;
  window.Sims.register({
    id: 'freefall',                                  // == filename, lowercase
    title:   { en: 'Free Fall', hr: 'Slobodni pad' },
    summary: { en: 'One sentence about what you can do here.', hr: 'Jedna rečenica o tome što se tu može.' },
    tasks: [                                         // 3–4 "Try this" prompts shown next to the sim
      { en: 'Drop both objects on the Moon. Which lands first?', hr: 'Pusti oba tijela na Mjesecu. Koje prije padne?' }
    ],
    mount(container, ctx) { /* ... */ return handle; }
  });
})();
```

`mount(container, ctx)` builds the UI inside `container` (an empty `<div>`) and returns a **handle**:

```js
{ destroy() , setLang(lang) , setTheme(theme) , reset() }
```
- `destroy()` MUST stop the animation loop, disconnect observers, remove window/document listeners, remove DOM.
- `setLang('en'|'hr')` relabels everything (call `controls.setLang(lang)`, store `lang` for canvas text).
- `setTheme(theme)` receives a fresh theme object (see below) when light/dark changes; store it and redraw.
- `reset()` returns the sim to its initial state.

`ctx = { lang: 'en'|'hr', theme: Theme, reducedMotion: boolean, t: (bilingualObj) => string }`.
If `ctx.reducedMotion` is true, do not auto-start continuous animation; the user presses Play.

## SimKit helpers (window.SimKit) — use them, don't reinvent

| Helper | What it does |
|---|---|
| `K.createCanvas(parent, {aspect:16/9, minHeight:240, maxHeight:520})` | Appends a responsive HiDPI canvas. Returns `{canvas, ctx, w, h, onResize(cb), pointer(ev)→{x,y}, destroy()}`. `w`/`h` are CSS pixels; always draw using them. |
| `K.loop(fn)` | rAF loop, `fn(dt, t)` with `dt` seconds (clamped ≤ 0.05). Returns `{start, stop, toggle, running, time, resetTime, destroy}`. |
| `K.controls(parent, lang)` | Control panel builder (styled grid). Methods below. Has `setLang(lang)` and `destroy()`. |
| `K.theme()` | Reads the current theme from CSS variables (same object the shell passes). |
| `K.fmt(v, digits, lang)` | Number formatting; Croatian uses a decimal comma. ALWAYS use for numbers on canvas and in text. |
| `K.tr(obj, lang)` | Picks `obj[lang]` from a `{en, hr}` object (strings pass through). |
| `K.withAlpha(hex, a)` | `'#2a78d6'` → `'rgba(42,120,214,a)'`. |
| `K.arrow(ctx, x1,y1,x2,y2, {color,width,head})` | Force/velocity arrows. |
| `K.text(ctx, str, x, y, {font,color,align,baseline})` | Canvas text. |
| `K.roundRect(ctx,x,y,w,h,r)` | Path only (then fill/stroke). |
| `K.grid(ctx,x,y,w,h,step,color)` | Faint background grid. |
| `K.lineChart(ctx, {x,y,w,h,xMin,xMax,yMin,yMax,series:[{points:[[x,y],...],color,label}],xLabel,yLabel,theme,lang})` | Small live graph (e.g. distance–time). Draws grid, ticks, 2px lines, end dots, legend for ≥2 series. |
| `K.niceScale(min,max,maxTicks)` | → `{min,max,step,ticks}` rounded axis range (lineChart applies it automatically; pass `nice:false` to keep exact ranges). |
| `K.clamp(v,a,b)`, `K.lerp(a,b,t)` | Math. |

Controls (`const C = K.controls(container, ctx.lang)`), every `label`/`unit`/option label is a `{en, hr}` object:
- `C.slider({label, min, max, step, value, unit, digits, format, onChange})` → `{get(), set(v, fire), setDisabled(bool), el}`
- `C.button({label, icon, variant:'primary'|'' , onClick})` → `{setLabel(obj), setIcon(str), setDisabled, setActive, el}`
- `C.toggle({label, value, onChange})` → `{get(), set(v, fire)}`
- `C.select({label, options:[{value, label}], value, onChange})` → `{get(), set(v, fire)}`
- `C.segmented({label, options:[{value, label}], value, onChange})` → `{get(), set(v, fire)}`  (radio-style buttons)
- `C.readout({label, unit, digits})` → `{set(numberOrBilingualObj), setColor(css)}`  (display-only live value)
- `C.note({text})` → `{set(obj)}`  (one-line hint spanning the row)

Layout inside `container`: first the canvas (`K.createCanvas`), then the controls (`K.controls`). Nothing else is needed;
the shell draws the title, summary and the "Try this" task list around it.

## Theme object (colors for canvas drawing)

`theme = { bg, surface, surface2, fg, muted, line, accent, accent2, good, warn, bad, c1…c8, sky, ground, water, font, fontDisplay, isDark }`
- Canvas background: the canvas element already has `background: var(--sky)`; you may paint your own scene background with `theme.sky`, `theme.ground`, `theme.water`.
- Text on canvas: `theme.fg` (primary) or `theme.muted` (secondary). Font: `'13px ' + theme.font`, titles `'bold 15px ' + theme.fontDisplay`.
- Objects / series / distinct things: use **c1…c8 in fixed order** (c1 blue, c2 orange, c3 aqua-green, c4 yellow, c5 pink, c6 green, c7 violet, c8 red). Never invent your own hex colors for data-like things; the palette is validated for color-blind readers in both themes. Fixed physical colors (red-hot metal, a yellow Sun, copper wire) are fine as literals, but keep them readable on both `sky` backgrounds.
- Status: `good` / `warn` / `bad` only for states (balanced / careful / overload), never as a 4th series color.
- Grid lines: `theme.line`. Chart/line stroke 2px, arrows 3px. Keep marks thin and text in text colors (never color text with a series color).
- Everything must look right in both light and dark. Re-read colors from the stored `theme` on every frame (store `let theme = ctx.theme`, replace in `setTheme`).

## Behaviour rules

1. **Real physics, SI units, correct magnitudes.** g = 9.81 m/s² on Earth. Show units everywhere (m, s, m/s, N, kg, kg/m³, Pa, J, W, V, A, Ω, Hz, °C).
2. **Direct manipulation when natural**: drag objects with pointer events (`pointerdown/move/up` on the canvas, `canvas.style.cursor`). Use `cv.pointer(ev)` for coordinates. Also work on touch (the canvas has `touch-action: none`).
3. **Always include Play/Pause and Reset** for anything that animates over time. Freeze the state on pause.
4. **Readouts** for the important quantities (via `C.readout`) and, where helpful, draw them on the canvas too.
5. **Labels on canvas are bilingual**: keep `let lang = ctx.lang` and use `K.tr({en,hr}, lang)` for every string drawn; `K.fmt` for numbers.
6. **Resize**: read `cv.w`/`cv.h` every frame (or in `onResize`) and lay out from them; never hardcode a canvas size.
7. **Performance**: clear and redraw only in the loop; no per-frame DOM creation; stop the loop in `destroy()`. Up to ~300 particles is fine.
8. **No external resources**, no `alert/confirm/prompt`, no `console.log` spam, no global variables except via `Sims.register`.
9. **Stable, deterministic start state**: the first frame must already show a meaningful scene (not a blank canvas).
10. **Kid-friendly**: big clear shapes, labelled arrows (e.g. "F = 20 N"), no jargon without the plain word next to it.
11. Short Croatian: use standard school terms — sila (N), masa (kg), brzina (m/s), ubrzanje (m/s²), gustoća (kg/m³), tlak (Pa), rad/energija (J), snaga (W), napon (V), struja (A), otpor (Ω), frekvencija (Hz), valna duljina (m), temperatura (°C), toplina (J).

## File skeleton

```js
(function () {
  'use strict';
  const K = window.SimKit;
  window.Sims.register({
    id: 'myid', title: {en:'',hr:''}, summary: {en:'',hr:''}, tasks: [ ... ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9 });
      const C = K.controls(container, lang);
      const state = { /* ... */ };
      // controls
      const speed = C.slider({ label: {en:'Speed',hr:'Brzina'}, min: 0, max: 10, step: 0.5, value: 3, unit: 'm/s', onChange: v => { state.v = v; } });
      const play = C.button({ label: {en:'Play',hr:'Pokreni'}, variant: 'primary', onClick: () => { L.toggle(); play.setLabel(L.running ? {en:'Pause',hr:'Pauza'} : {en:'Play',hr:'Pokreni'}); } });
      C.button({ label: {en:'Reset',hr:'Vrati'}, onClick: reset });
      const out = C.readout({ label: {en:'Distance',hr:'Put'}, unit: 'm', digits: 1 });
      function reset() { /* ... */ draw(); }
      function step(dt) { /* physics */ }
      function draw() { const ctx = cv.ctx, w = cv.w, h = cv.h; ctx.clearRect(0,0,w,h); /* ... */ }
      const L = K.loop(dt => { step(dt); draw(); out.set(state.x); });
      cv.onResize(draw);
      reset();
      if (!ctx.reducedMotion) { /* optional autoplay for ambient sims */ }
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
```

See `js/sims/freefall.js` for a complete worked example (two falling objects, planets, air resistance, live graph).

## Testing your sim

Open `dev-sim.html?sim=<id>` in a browser (serve the folder with `python3 -m http.server`), or run
`tools/check_js.sh js/sims/<id>.js` for a syntax check (it only checks that the file parses).
Both languages must be verified: the dev page has an EN/HR toggle and a light/dark toggle.
