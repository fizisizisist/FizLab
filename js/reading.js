/* FizLab — reading options (top-bar "Aa" button).
   Three independent switches, saved per browser:
   - dys   : dyslexia-friendly text. Wider letter/word/line spacing, cream background (light theme),
             no italics, no all-caps labels. Values follow the British Dyslexia Association style guide
             (letter gap ~35 % of letter width, word gap >= 3.5x letter gap, line height >= 1.5) and
             WCAG 1.4.12; Zorzi et al. 2012 (PNAS) found extra letter spacing helps dyslexic children.
             No special "dyslexia font": studies of OpenDyslexic / Dyslexie found no benefit beyond spacing.
   - bold  : bold word beginnings ("bionic"-style fixation points), aimed at ADHD readers who lose their
             place. Evidence is weak (Snell 2024, Acta Psychologica: no speed gain), so it is offered as a
             personal-preference option. Croatian digraphs lj / nj / dž are never split, numbers, units
             and formulas are left alone.
   - guide : reading ruler. A band follows the pointer and dims the rest of the page (Adobe CHI 2023
             "shade" ruler: 10-20 wpm faster for readers with dyslexia). Hidden over simulations. */
(function () {
  'use strict';
  const KEY = 'fizlab.reading';
  const html = document.documentElement;
  const state = load();

  function load() {
    try { const v = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; return { dys: !!v.dys, bold: !!v.bold, guide: !!v.guide }; }
    catch (e) { return { dys: false, bold: false, guide: false }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }

  // classes go on <html> right away so the first render already has the right spacing
  function applyClasses() {
    html.classList.toggle('read-dys', state.dys);
    html.classList.toggle('read-bold', state.bold);
    html.classList.toggle('read-guide-on', state.guide);
  }
  applyClasses();

  // ---------- bold word beginnings ----------
  // never touch these (or anything inside them)
  const SKIP = 'script,style,noscript,canvas,svg,math,input,textarea,select,option,code,pre,kbd,samp,' +
    'h1,h2,h3,h4,h5,h6,b,strong,th,[contenteditable],.rb,.no-rb,.formula,.num,.key,.chip,.chips,.tabs,' +
    '.quiz-type,.grade-pill,.score-ring,.stat,' +
    '.sk-field,.sk-readout,.sk-btn,.sk-seg,.sk-big,.sk-row,.sk-table-wrap,.sk-table,.sk-canvas-wrap';   // sim controls and live readouts
  const INLINE = /^(A|ABBR|BDI|CITE|DFN|EM|I|LABEL|MARK|Q|S|SMALL|SPAN|SUB|SUP|U|TIME|VAR)$/;
  const MATHY = /[0-9=+×·÷/^²³√%°≈<>−]/;          // a chunk that looks like a number, unit or formula
  const ENDS_MATHY = /[0-9=+×·÷≈−]$/;              // "10 N" -> leave the unit
  const STARTS_OP = /^[=+×·÷≈−]/;                  // "F = m" -> leave the symbol
  const WORD = /^([^\p{L}]*)(\p{L}+)([\s\S]*)$/u;
  const DIGRAPH = /^(lj|nj|dž)$/i;
  const MIN_WORDS = 4;                             // short labels and buttons stay as they are

  function boldLen(w) {
    const L = w.length;
    let k = L <= 3 ? 1 : L === 4 ? 2 : Math.ceil(L * 0.4);
    if (k < L && DIGRAPH.test(w.slice(k - 1, k + 1))) k++;   // keep lj / nj / dž together
    return Math.min(k, L);
  }

  function wordCount(s) { const m = s.match(/\p{L}{2,}/gu); return m ? m.length : 0; }
  function blockOf(node) {
    let e = node.parentElement;
    while (e && e.parentElement && INLINE.test(e.tagName)) e = e.parentElement;
    return e;
  }

  function boldText(node) {
    const text = node.nodeValue;
    if (!/\p{L}{2}/u.test(text)) return;
    const parts = text.split(/(\s+)/);              // even = word chunk, odd = whitespace
    const frag = document.createDocumentFragment();
    let buf = '', changed = false;
    const flush = () => { if (buf) { frag.appendChild(document.createTextNode(buf)); buf = ''; } };
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i % 2 === 1 || !p) { buf += p; continue; }
      const prev = parts[i - 2] || '', next = parts[i + 2] || '';
      const m = p.match(WORD);
      if (!m || m[2].length < 2 || MATHY.test(p) || ENDS_MATHY.test(prev) || STARTS_OP.test(next)) { buf += p; continue; }
      const k = boldLen(m[2]);
      buf += m[1]; flush();
      const b = document.createElement('b'); b.className = 'rb-b'; b.textContent = m[2].slice(0, k);
      frag.appendChild(b);
      buf = m[2].slice(k) + m[3];
      changed = true;
    }
    flush();
    if (!changed) return;
    const span = document.createElement('span'); span.className = 'rb';
    span.appendChild(frag);
    node.parentNode.replaceChild(span, node);
  }

  function boldTree(root) {
    if (!root || !root.isConnected) return;
    const start = root.nodeType === 3 ? root.parentElement : root;
    if (!start || start.closest(SKIP)) return;
    if (root.nodeType === 3) { const blk = blockOf(root); if (blk && wordCount(blk.textContent) >= MIN_WORDS) boldText(root); return; }
    if (root.nodeType !== 1) return;
    const counts = new Map();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (n.nodeType === 1) return n !== root && n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(tn => {
      const blk = blockOf(tn); if (!blk) return;
      let c = counts.get(blk);
      if (c === undefined) { c = wordCount(blk.textContent); counts.set(blk, c); }
      if (c >= MIN_WORDS) boldText(tn);
    });
  }

  function unboldAll() {
    document.querySelectorAll('span.rb').forEach(s => s.replaceWith(document.createTextNode(s.textContent)));
  }

  let observer = null;
  function mainEl() { return document.getElementById('main'); }
  function startBold() {
    const main = mainEl(); if (!main) return;
    boldTree(main);
    if (observer) return;
    // process new content synchronously (before paint), so pages never flash unformatted
    observer = new MutationObserver(recs => {
      recs.forEach(r => {
        if (r.type === 'characterData') { boldTree(r.target); return; }
        r.addedNodes.forEach(n => { if (!(n.nodeType === 1 && n.classList.contains('rb'))) boldTree(n); });
      });
      observer.takeRecords();                        // drop the records our own wrapping created
    });
    observer.observe(main, { childList: true, subtree: true, characterData: true });
  }
  function stopBold() {
    if (observer) { observer.disconnect(); observer = null; }
    unboldAll();
  }

  // ---------- reading guide ----------
  let guide = null;
  function ensureGuide() {
    if (guide) return guide;
    guide = document.createElement('div');
    guide.className = 'read-guide is-hidden';
    guide.setAttribute('aria-hidden', 'true');
    document.body.appendChild(guide);
    return guide;
  }
  function moveGuide(e) {
    if (!state.guide || !guide) return;
    const t = e.target && e.target.closest ? e.target : null;
    const off = !t || !!t.closest('canvas, .sim-stage, .topbar, .read-panel');
    guide.classList.toggle('is-hidden', off);
    if (!off) guide.style.transform = 'translateY(' + Math.round(e.clientY - guide.offsetHeight / 2) + 'px)';
  }
  document.addEventListener('pointermove', moveGuide, { passive: true });
  document.addEventListener('pointerdown', moveGuide, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { if (guide) guide.classList.add('is-hidden'); });

  // ---------- panel ----------
  function setOpt(key, on) {
    state[key] = !!on; save(); applyClasses();
    if (key === 'bold') { if (state.bold) startBold(); else stopBold(); }
    if (key === 'guide') { ensureGuide(); if (!state.guide) guide.classList.add('is-hidden'); }
    syncUi();
  }
  function syncUi() {
    document.querySelectorAll('#readPanel input[data-read]').forEach(inp => { inp.checked = !!state[inp.dataset.read]; });
    const btn = document.getElementById('readBtn');
    if (btn) btn.classList.toggle('is-on', state.dys || state.bold || state.guide);
  }

  function initUi() {
    const btn = document.getElementById('readBtn'), panel = document.getElementById('readPanel');
    if (!btn || !panel) return;
    // the panel is position:fixed and placed under the button, kept 16px inside the viewport
    // (the top-bar tools sit on the right on wide screens but wrap to the left on narrow ones)
    const place = () => {
      const r = btn.getBoundingClientRect(), w = panel.offsetWidth, vw = document.documentElement.clientWidth;
      panel.style.left = Math.round(Math.max(16, Math.min(r.right - w, vw - 16 - w))) + 'px';
      panel.style.top = Math.round(r.bottom + 8) + 'px';
    };
    const open = show => {
      panel.hidden = !show; btn.setAttribute('aria-expanded', String(show));
      if (show) { place(); const first = panel.querySelector('input'); if (first) first.focus({ preventScroll: true }); }
    };
    window.addEventListener('resize', () => { if (!panel.hidden) place(); });
    btn.addEventListener('click', e => { e.stopPropagation(); open(panel.hidden); });
    panel.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', () => { if (!panel.hidden) open(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); } });
    panel.querySelectorAll('input[data-read]').forEach(inp => inp.addEventListener('change', () => setOpt(inp.dataset.read, inp.checked)));
    syncUi();
  }

  function init() {
    initUi();
    if (state.guide) ensureGuide();
    if (state.bold) startBold();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.FizRead = { state: () => Object.assign({}, state), set: setOpt, boldLen };
})();
