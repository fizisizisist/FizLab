/* FizLab — small SVG graph renderer for graph-reading problems. FizGraph.render(spec, lang) -> SVG element.
   spec: { xLabel, yLabel, xMax, yMax, xStep, yStep, lines:[{pts:[[x,y]...], label, dash}], points:[[x,y]...] } */
window.FizGraph = (function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)'];
  function node(tag, attrs, style, text) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    if (style) e.style.cssText = style;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const pick = (o, lang) => (o === null || o === undefined) ? '' : (typeof o === 'string' ? o : (o[lang] !== undefined ? o[lang] : (o.en || '')));
  function tick(v, lang) {
    let s = (Math.round(v * 100) / 100).toString();
    return lang === 'hr' ? s.replace('.', ',') : s;
  }
  function render(spec, lang) {
    const W = 480, H = 310, L = 56, R = 18, T = 26, B = 46;
    const pw = W - L - R, ph = H - T - B;
    const xMax = spec.xMax, yMax = spec.yMax, xStep = spec.xStep, yStep = spec.yStep;
    const sx = x => L + (x / xMax) * pw, sy = y => T + ph - (y / yMax) * ph;
    const svg = node('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', class: 'fz-graph', 'aria-label': pick(spec.yLabel, lang) + ' / ' + pick(spec.xLabel, lang) });
    svg.appendChild(node('rect', { x: L, y: T, width: pw, height: ph }, 'fill: var(--surface);'));
    const nx = Math.round(xMax / xStep), ny = Math.round(yMax / yStep);
    const textStyle = 'fill: var(--muted); font-family: inherit; font-size: 12px; font-variant-numeric: tabular-nums;';
    for (let i = 0; i <= nx; i++) {
      const x = sx(Math.min(xMax, i * xStep));
      svg.appendChild(node('line', { x1: x, y1: T, x2: x, y2: T + ph }, 'stroke: var(--line); stroke-width: 1;'));
      svg.appendChild(node('text', { x, y: T + ph + 16, 'text-anchor': 'middle' }, textStyle, tick(i * xStep, lang)));
    }
    for (let j = 0; j <= ny; j++) {
      const y = sy(Math.min(yMax, j * yStep));
      svg.appendChild(node('line', { x1: L, y1: y, x2: L + pw, y2: y }, 'stroke: var(--line); stroke-width: 1;'));
      svg.appendChild(node('text', { x: L - 8, y: y + 4, 'text-anchor': 'end' }, textStyle, tick(j * yStep, lang)));
    }
    svg.appendChild(node('line', { x1: L, y1: T + ph, x2: L + pw, y2: T + ph }, 'stroke: var(--fg); stroke-width: 2;'));
    svg.appendChild(node('line', { x1: L, y1: T, x2: L, y2: T + ph }, 'stroke: var(--fg); stroke-width: 2;'));
    const labStyle = 'fill: var(--fg); font-family: inherit; font-size: 13px; font-weight: 700;';
    svg.appendChild(node('text', { x: L + pw, y: H - 8, 'text-anchor': 'end' }, labStyle, pick(spec.xLabel, lang)));
    svg.appendChild(node('text', { x: L - 44, y: 14, 'text-anchor': 'start' }, labStyle, pick(spec.yLabel, lang)));
    let legendX = L + 90;
    (spec.lines || []).forEach((ln, i) => {
      const col = COLORS[i % COLORS.length];
      const pts = ln.pts.map(p => sx(p[0]).toFixed(1) + ',' + sy(p[1]).toFixed(1)).join(' ');
      svg.appendChild(node('polyline', { points: pts, fill: 'none' }, `stroke: ${col}; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round;${ln.dash ? ' stroke-dasharray: 7 5;' : ''}`));
      const lab = pick(ln.label, lang);
      if (lab) {
        svg.appendChild(node('rect', { x: legendX, y: 5, width: 14, height: 10, rx: 2 }, `fill: ${col};`));
        const tEl = node('text', { x: legendX + 19, y: 14 }, 'fill: var(--fg); font-family: inherit; font-size: 12px;', lab);
        svg.appendChild(tEl);
        legendX += 30 + lab.length * 7;
      }
    });
    (spec.points || []).forEach(p => svg.appendChild(node('circle', { cx: sx(p[0]), cy: sy(p[1]), r: 4.5 }, 'fill: var(--fg); stroke: var(--surface); stroke-width: 2;')));
    return svg;
  }
  return { render };
})();
