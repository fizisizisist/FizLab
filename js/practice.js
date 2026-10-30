/* FizLab — practice problems (zadaci), worksheets, worked examples, summaries, scientists, unit converter.
   Loaded before app.js; app.js calls FizExt.init(api) and the render functions below. */
window.FizExt = (function () {
  'use strict';
  const K = window.SimKit, Content = window.Content;
  let A = null; // api from app.js: { el, t, tr, lang(), progress(), saveProgress, checkBadges, toast, go, shuffle, iconBox }

  // ---------- random + formatting ----------
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function makeR(rand) {
    return {
      int: (a, b) => a + Math.floor(rand() * (b - a + 1)),
      step: (a, b, s) => { const n = Math.round((b - a) / s); const v = a + s * Math.floor(rand() * (n + 1)); const d = (String(s).split('.')[1] || '').length; return parseFloat(v.toFixed(d)); },
      pick: arr => arr[Math.floor(rand() * arr.length)],
      float: (a, b, d) => parseFloat((a + rand() * (b - a)).toFixed(d === undefined ? 1 : d))
    };
  }
  function autoDigits(v) { const r = Math.round(v * 100) / 100; if (Number.isInteger(r)) return 0; return Math.abs(r * 10 - Math.round(r * 10)) < 1e-9 ? 1 : 2; }
  function groupThousands(str) {
    // '600000000' -> '600 000 000' (thin spaces), keeps the decimal part untouched
    const m = str.match(/^(-?)(\d+)([.,]\d+)?$/);
    if (!m || m[2].length < 5) return str;
    return m[1] + m[2].replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009') + (m[3] || '');
  }
  function makeF(lang) { return (v, d) => { if (typeof v !== 'number' || !Number.isFinite(v)) return '–'; return groupThousands(K.fmt(v, d === undefined ? autoDigits(v) : d, lang)); }; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function instantiate(tpl, seed) {
    const rand = seed === undefined ? Math.random : mulberry32(seed);
    let p = null, ans = NaN;
    for (let tries = 0; tries < 20; tries++) {
      try { p = tpl.params(makeR(rand)); ans = tpl.answer(p); } catch (e) { console.error('problem template failed', tpl.id, e); p = null; }
      if (p && Number.isFinite(ans)) break;
    }
    return { tpl, p, answer: ans };
  }
  const textOf = (inst, lang) => inst.tpl.text[lang] ? inst.tpl.text[lang](inst.p, makeF(lang)) : inst.tpl.text.en(inst.p, makeF('en'));
  const stepsOf = (inst, lang) => inst.tpl.steps[lang] ? inst.tpl.steps[lang](inst.p, makeF(lang)) : inst.tpl.steps.en(inst.p, makeF('en'));
  const unitOf = (tpl, lang) => typeof tpl.unit === 'string' ? tpl.unit : K.tr(tpl.unit, lang);
  function isCorrect(inst, value) {
    const tol = inst.tpl.tol === undefined ? 0.02 : inst.tpl.tol, abs = inst.tpl.abs === undefined ? 0 : inst.tpl.abs;
    return Math.abs(value - inst.answer) <= Math.max(abs, Math.abs(inst.answer) * tol, 1e-9);
  }
  function parseNum(s) { const v = parseFloat(String(s).trim().replace(/\s/g, '').replace(',', '.')); return Number.isFinite(v) ? v : null; }
  const fmtAnswer = (inst, lang) => makeF(lang)(inst.answer) + (unitOf(inst.tpl, lang) ? ' ' + unitOf(inst.tpl, lang) : '');

  // ---------- data helpers ----------
  const templatesFor = topicId => Content.problems[topicId] || [];
  const allTemplates = () => Content.topics.flatMap(tp => templatesFor(tp.id));
  const problemCount = () => allTemplates().length;
  function practiceRec(topicId) { const P = A.progress(); P.practice = P.practice || {}; return P.practice[topicId] || (P.practice[topicId] = { solved: 0, attempts: 0, l1: 0, l2: 0, l3: 0 }); }
  const solvedIn = topicId => (A.progress().practice && A.progress().practice[topicId] && A.progress().practice[topicId].solved) || 0;
  const solvedTotal = () => Object.values(A.progress().practice || {}).reduce((s, r) => s + (r.solved || 0), 0);
  const hardSolved = () => Object.values(A.progress().practice || {}).some(r => (r.l3 || 0) > 0);
  const stars = lvl => '★'.repeat(lvl) + '☆'.repeat(3 - lvl);

  // ---------- practice widget ----------
  // opts: { pool: () => templates[], showTopic, onSolved(tpl) }
  function practiceWidget(container, opts) {
    const el = A.el, t = A.t, lang = A.lang();
    const root = el('div', { class: 'practice' });
    container.appendChild(root);
    let inst = null, attempts = 0, revealed = false, done = false, history = [];
    function pickTemplate() {
      const pool = opts.pool();
      if (!pool.length) return null;
      const recent = history.slice(-Math.min(3, pool.length - 1));
      const fresh = pool.filter(x => !recent.includes(x.topic + '/' + x.id));
      const tpl = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh : pool).length)];
      history.push(tpl.topic + '/' + tpl.id);
      return tpl;
    }
    function newProblem() {
      const tpl = pickTemplate();
      root.innerHTML = '';
      if (!tpl) { root.appendChild(el('p', { class: 'empty', text: t('practice.none') })); return; }
      inst = instantiate(tpl); attempts = 0; revealed = false; done = false;
      const topic = Content.byId[tpl.topic];
      const card = el('div', { class: 'practice-card' });
      const head = el('div', { class: 'practice-head' }, [
        opts.showTopic && topic ? el('a', { class: 'quiz-type', href: '#' + topic.id + '-practice', text: A.tr(topic.title) }) : el('span', { class: 'quiz-type', text: t('practice.title') }),
        el('span', { class: 'level-stars', title: t('practice.l' + tpl.level), text: stars(tpl.level) + ' ' + t('practice.l' + tpl.level) })
      ]);
      card.appendChild(head);
      card.appendChild(el('p', { class: 'practice-text', text: textOf(inst, lang) }));
      const input = el('input', { type: 'text', inputmode: 'decimal', id: 'practice-answer', placeholder: t('practice.answer'), autocomplete: 'off' });
      const unit = unitOf(tpl, lang);
      const checkBtn = el('button', { type: 'button', class: 'btn primary', text: t('practice.check') });
      const row = el('div', { class: 'num-answer' }, [input, unit ? el('span', { class: 'unit', text: unit }) : null, checkBtn]);
      card.appendChild(row);
      const fb = el('div', { class: 'practice-fb' });
      card.appendChild(fb);
      const hintBox = el('div', { class: 'practice-hint' }); hintBox.hidden = true;
      hintBox.appendChild(el('b', { text: t('practice.hint') + ': ' })); hintBox.appendChild(document.createTextNode(A.tr(tpl.hint)));
      card.appendChild(hintBox);
      const sol = el('div', { class: 'practice-steps' }); sol.hidden = true;
      card.appendChild(sol);
      const hintBtn = el('button', { type: 'button', class: 'btn sm', text: t('practice.hint'), onclick: () => { hintBox.hidden = false; hintBtn.disabled = true; } });
      const solBtn = el('button', { type: 'button', class: 'btn sm', text: t('practice.solution'), onclick: () => { showSolution(true); } });
      const nextBtn = el('button', { type: 'button', class: 'btn sm primary', text: t('practice.next'), onclick: newProblem });
      nextBtn.hidden = true;
      card.appendChild(el('div', { class: 'quiz-actions practice-actions' }, [hintBtn, solBtn, nextBtn]));
      root.appendChild(card);
      function showSolution(byUser) {
        if (byUser && !done) { revealed = true; }
        sol.innerHTML = '';
        sol.appendChild(el('b', { text: t('practice.steps') }));
        const ol = el('ol');
        stepsOf(inst, lang).forEach(s => ol.appendChild(el('li', { text: s })));
        sol.appendChild(ol);
        sol.appendChild(el('p', { class: 'practice-answer num', text: t('worksheet.answer') + ': ' + fmtAnswer(inst, lang) }));
        sol.hidden = false; solBtn.disabled = true;
        if (byUser && !done) { done = true; input.disabled = true; checkBtn.disabled = true; nextBtn.hidden = false; fb.innerHTML = ''; fb.appendChild(el('div', { class: 'feedback no' }, [el('span', { text: t('practice.counted') })])); nextBtn.focus(); }
      }
      function check() {
        if (done) return;
        const v = parseNum(input.value);
        if (v === null) { fb.innerHTML = ''; fb.appendChild(el('div', { class: 'feedback no' }, [el('span', { text: t('practice.invalid') })])); input.focus(); return; }
        attempts++;
        const rec = practiceRec(tpl.topic); rec.attempts++;
        fb.innerHTML = '';
        if (isCorrect(inst, v)) {
          done = true; input.disabled = true; checkBtn.disabled = true;
          fb.appendChild(el('div', { class: 'feedback ok' }, [el('b', { text: t('practice.correct') }), el('span', { text: fmtAnswer(inst, lang) })]));
          if (!revealed) { rec.solved++; rec['l' + tpl.level] = (rec['l' + tpl.level] || 0) + 1; }
          A.saveProgress(); A.checkBadges();
          showSolution(false); nextBtn.hidden = false; nextBtn.focus();
          if (opts.onSolved) opts.onSolved(tpl, !revealed);
        } else {
          A.saveProgress();
          fb.appendChild(el('div', { class: 'feedback no' }, [el('b', { text: attempts >= 2 ? t('practice.wrongAgain') : t('practice.wrong') })]));
          if (attempts >= 2) hintBox.hidden = false;
          input.select();
        }
      }
      checkBtn.addEventListener('click', check);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (done) newProblem(); else check(); } });
      setTimeout(() => input.focus(), 30);
    }
    newProblem();
    return { newProblem };
  }

  function levelChips(current, onChange) {
    const el = A.el, t = A.t;
    const chips = el('div', { class: 'chips' });
    [['all', 'practice.all'], ['1', 'practice.l1'], ['2', 'practice.l2'], ['3', 'practice.l3']].forEach(([v, key]) => {
      chips.appendChild(el('button', { type: 'button', class: 'chip' + (current === v ? ' is-active' : ''), text: (v === 'all' ? '' : stars(+v) + ' ') + t(key), onclick: () => onChange(v) }));
    });
    return chips;
  }

  let topicLevel = 'all';
  function renderPracticeTab(panel, topic) {
    const el = A.el, t = A.t;
    const tpls = templatesFor(topic.id);
    if (!tpls.length) { panel.appendChild(el('p', { class: 'empty', text: t('practice.none') })); return; }
    const statsEl = el('span', { class: 'quiz-type num' });
    const updateStats = () => { statsEl.textContent = `${t('practice.solved')}: ${solvedIn(topic.id)}`; };
    updateStats();
    const top = el('div', { class: 'quiz-top' }, [el('p', { class: 'summary', text: t('practice.lede') }), statsEl]);
    panel.appendChild(top);
    let widget = null;
    const chipsHolder = el('div', { class: 'toolbar' });
    const drawChips = () => { chipsHolder.innerHTML = ''; chipsHolder.appendChild(levelChips(topicLevel, v => { topicLevel = v; drawChips(); widget.newProblem(); })); chipsHolder.appendChild(el('button', { type: 'button', class: 'btn sm', text: t('practice.newProblem'), onclick: () => widget.newProblem() })); };
    drawChips();
    panel.appendChild(chipsHolder);
    widget = practiceWidget(panel, { pool: () => tpls.filter(x => topicLevel === 'all' || String(x.level) === topicLevel), onSolved: updateStats });
    panel.appendChild(el('p', { class: 'sk-note', text: t('practice.enterNumber') }));
    panel.appendChild(renderGuide());
    const hasConcepts = Content.concepts.some(c => c.topic === topic.id);
    panel.appendChild(el('div', { class: 'hero-actions' }, [
      hasConcepts ? el('a', { class: 'btn', href: '#concepts', text: t('concepts.title') + ' →', onclick: () => { conceptState.topic = topic.id; conceptState.type = 'all'; } }) : null,
      el('a', { class: 'btn', href: '#practice', text: t('worksheet.title') + ' →' })]));
  }

  // ---------- mixed practice + worksheet page ----------
  const mixState = { topics: null, level: 'all', count: 10, code: null, showAnswers: false };
  function renderPracticePage(main) {
    const el = A.el, t = A.t, lang = A.lang();
    const withProblems = Content.topics.filter(tp => templatesFor(tp.id).length);
    if (!mixState.topics) mixState.topics = withProblems.map(tp => tp.id);
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('practice.mixed') }), el('p', { class: 'lede', text: t('practice.ledeMixed') })]));
    // topic chips
    const topicChips = el('div', { class: 'chips' });
    const drawTopics = () => {
      topicChips.innerHTML = '';
      withProblems.forEach(tp => topicChips.appendChild(el('button', { type: 'button', class: 'chip' + (mixState.topics.includes(tp.id) ? ' is-active' : ''), text: A.tr(tp.title),
        onclick: () => { if (mixState.topics.includes(tp.id)) mixState.topics = mixState.topics.filter(x => x !== tp.id); else mixState.topics.push(tp.id); drawTopics(); if (widget) widget.newProblem(); } })));
      topicChips.appendChild(el('button', { type: 'button', class: 'chip', text: t('practice.all'), onclick: () => { mixState.topics = withProblems.map(tp => tp.id); drawTopics(); if (widget) widget.newProblem(); } }));
    };
    drawTopics();
    main.appendChild(el('div', { class: 'panel', style: 'margin-bottom:14px' }, [el('h4', { text: t('practice.topics') }), topicChips]));
    const chipsHolder = el('div', { class: 'toolbar' });
    let widget = null;
    const drawLevels = () => { chipsHolder.innerHTML = ''; chipsHolder.appendChild(levelChips(mixState.level, v => { mixState.level = v; drawLevels(); widget.newProblem(); })); chipsHolder.appendChild(el('span', { class: 'quiz-type num', text: `${t('practice.solved')}: ${solvedTotal()}` })); };
    drawLevels();
    main.appendChild(chipsHolder);
    const pool = () => allTemplates().filter(x => mixState.topics.includes(x.topic) && (mixState.level === 'all' || String(x.level) === mixState.level));
    widget = practiceWidget(main, { pool, showTopic: true, onSolved: drawLevels });
    main.appendChild(renderGuide());
    if (Content.concepts.length) main.appendChild(el('div', { class: 'hero-actions', style: 'margin-top:10px' }, [el('a', { class: 'btn warm', href: '#concepts', text: t('concepts.title') + ' →', onclick: () => { conceptState.topic = 'all'; } })]));

    // worksheet
    main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('worksheet.title') })]));
    main.appendChild(el('p', { class: 'lede', style: 'color:var(--muted); margin-bottom:12px', text: t('worksheet.lede') }));
    const countSel = el('select', { class: 'sk-select', id: 'ws-count' });
    [5, 10, 15, 20].forEach(n => countSel.appendChild(el('option', { value: String(n), text: String(n) })));
    countSel.value = String(mixState.count);
    const codeInput = el('input', { class: 'search', style: 'flex:0 1 160px', id: 'ws-code', type: 'text', inputmode: 'numeric', placeholder: t('worksheet.code'), value: mixState.code || '' });
    const genBtn = el('button', { type: 'button', class: 'btn primary', text: t('worksheet.generate') });
    const ansBtn = el('button', { type: 'button', class: 'btn', text: t('worksheet.showAnswers') });
    main.appendChild(el('div', { class: 'toolbar' }, [el('label', { class: 'sk-label', for: 'ws-count', text: t('worksheet.count') }), countSel, el('label', { class: 'sk-label', for: 'ws-code', text: t('worksheet.code') }), codeInput, genBtn, ansBtn]));
    const sheet = el('div', { class: 'worksheet' });
    main.appendChild(sheet);
    function generate() {
      const p = pool();
      sheet.innerHTML = '';
      if (!p.length) { sheet.appendChild(el('p', { class: 'empty', text: t('worksheet.pickTopics') })); return; }
      mixState.count = parseInt(countSel.value, 10);
      let code = parseInt(codeInput.value, 10);
      if (!Number.isFinite(code)) { code = 1000 + Math.floor(Math.random() * 9000); codeInput.value = String(code); }
      mixState.code = code;
      const rand = mulberry32(hashStr('ws-' + code + '-' + mixState.topics.join(',') + '-' + mixState.level + '-' + mixState.count));
      const sorted = p.slice().sort((a, b) => a.level - b.level || (a.topic + a.id).localeCompare(b.topic + b.id));
      const ol = el('ol', { class: 'ws-list' });
      for (let i = 0; i < mixState.count; i++) {
        const tpl = sorted[Math.floor(rand() * sorted.length)];
        const inst = instantiate(tpl, Math.floor(rand() * 4294967296));
        const topic = Content.byId[tpl.topic];
        const li = el('li', null, [
          el('div', { class: 'ws-meta' }, [el('span', { class: 'quiz-type', text: topic ? A.tr(topic.title) : tpl.topic }), el('span', { class: 'level-stars', text: stars(tpl.level) })]),
          el('p', { text: textOf(inst, lang) }),
          el('div', { class: 'ws-answer' }, [el('b', { text: t('worksheet.answer') + ': ' }), el('span', { class: 'num', text: fmtAnswer(inst, lang) })])
        ]);
        ol.appendChild(li);
      }
      sheet.appendChild(el('p', { class: 'quiz-type num', text: `${t('worksheet.title')} #${code}` }));
      sheet.appendChild(ol);
      sheet.classList.toggle('show-answers', mixState.showAnswers);
    }
    genBtn.addEventListener('click', () => { generate(); });
    codeInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); generate(); } });
    ansBtn.addEventListener('click', () => { mixState.showAnswers = !mixState.showAnswers; sheet.classList.toggle('show-answers', mixState.showAnswers); ansBtn.textContent = mixState.showAnswers ? t('worksheet.hideAnswers') : t('worksheet.showAnswers'); });
    ansBtn.textContent = mixState.showAnswers ? t('worksheet.hideAnswers') : t('worksheet.showAnswers');
    if (mixState.code) generate();
  }

  // ---------- lesson extras ----------
  function renderSummary(topic) {
    const el = A.el, t = A.t, lang = A.lang();
    const s = Content.summaries[topic.id];
    if (!s || !s.bullets) return null;
    const ul = el('ul', { class: 'summary-list' });
    (s.bullets[lang] || s.bullets.en).forEach(b => ul.appendChild(el('li', { text: b })));
    return el('div', { class: 'panel summary-panel' }, [el('h4', { text: t('practice.summaryTitle') }), ul]);
  }
  function renderMisconceptions(topic) {
    const el = A.el, t = A.t;
    const s = Content.summaries[topic.id];
    if (!s || !s.misconceptions || !s.misconceptions.length) return null;
    const box = el('div', { class: 'panel' }, [el('h4', { text: t('practice.misconceptions') })]);
    s.misconceptions.forEach(m => box.appendChild(el('div', { class: 'myth' }, [
      el('div', { class: 'myth-q' }, [el('b', { text: t('practice.myth') + ': ' }), A.tr(m.myth)]),
      el('div', { class: 'myth-a' }, [el('b', { text: t('practice.truth') + ': ' }), A.tr(m.truth)])
    ])));
    return box;
  }
  function renderWorkedExample(topic) {
    const el = A.el, t = A.t, lang = A.lang();
    const tpls = templatesFor(topic.id);
    if (!tpls.length) return null;
    const tpl = tpls.find(x => x.level === 2) || tpls[0];
    const inst = instantiate(tpl, hashStr('example-' + topic.id + '-' + tpl.id));
    if (!inst.p) return null;
    const ol = el('ol');
    stepsOf(inst, lang).forEach(s => ol.appendChild(el('li', { text: s })));
    return el('section', { class: 'worked' }, [
      el('h3', { text: t('practice.worked') }),
      el('p', { class: 'practice-text', text: textOf(inst, lang) }),
      el('div', { class: 'practice-steps' }, [el('b', { text: t('practice.steps') }), ol, el('p', { class: 'practice-answer num', text: t('worksheet.answer') + ': ' + fmtAnswer(inst, lang) })]),
      el('div', { class: 'hero-actions' }, [el('a', { class: 'btn primary', href: '#' + topic.id + '-practice', text: t('practice.tryMore') })])
    ]);
  }

  // ---------- scientists ----------
  let sciFilter = 'all';
  function renderScientists(main) {
    const el = A.el, t = A.t, lang = A.lang();
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('scientists.title') }), el('p', { class: 'lede', text: t('scientists.lede') })]));
    const chips = el('div', { class: 'chips' });
    const grid = el('div', { class: 'sci-grid' });
    const list = Content.scientists.slice().sort((a, b) => a.born - b.born);
    function draw() {
      chips.innerHTML = '';
      [['all', t('scientists.all')], ['croatia', t('scientists.croatia')]].concat(Content.topics.map(tp => [tp.id, A.tr(tp.title)])).forEach(([v, label]) => {
        if (v !== 'all' && v !== 'croatia' && !list.some(s => s.topics.includes(v))) return;
        chips.appendChild(el('button', { type: 'button', class: 'chip' + (sciFilter === v ? ' is-active' : ''), text: label, onclick: () => { sciFilter = v; draw(); } }));
      });
      grid.innerHTML = '';
      const rows = list.filter(s => sciFilter === 'all' || (sciFilter === 'croatia' ? s.croatia : s.topics.includes(sciFilter)));
      if (!rows.length) { grid.appendChild(el('p', { class: 'empty', text: '—' })); return; }
      const yearStr = y => y < 0 ? `${-y} ${t('scientists.bc')}` : String(y);
      rows.forEach(s => {
        const years = `${yearStr(s.born)} – ${s.died === null ? t('scientists.alive') : yearStr(s.died)}`;
        const body = el('div', { class: 'sci-body' });
        body.hidden = true;
        body.appendChild(el('p', { text: A.tr(s.bio) }));
        body.appendChild(el('div', { class: 'callout' }, [el('h4', { text: t('scientists.fact') }), el('p', { text: A.tr(s.fact) })]));
        const links = el('div', { class: 'chips' });
        s.topics.forEach(id => { const tp = Content.byId[id]; if (tp) links.appendChild(el('a', { class: 'chip', href: '#' + id, text: A.tr(tp.title) })); });
        body.appendChild(el('div', null, [el('span', { class: 'quiz-type', text: t('scientists.topics') + ': ' }), links]));
        const moreBtn = el('button', { type: 'button', class: 'btn sm', text: t('scientists.more'), 'aria-expanded': 'false', onclick: () => { body.hidden = !body.hidden; moreBtn.textContent = body.hidden ? t('scientists.more') : t('scientists.less'); moreBtn.setAttribute('aria-expanded', body.hidden ? 'false' : 'true'); } });
        grid.appendChild(el('article', { class: 'sci-card' + (s.croatia ? ' is-croatia' : '') }, [
          el('div', { class: 'sci-year num', text: yearStr(s.born) }),
          el('div', { class: 'sci-main' }, [
            el('h3', { text: s.name }),
            el('div', { class: 'sci-meta' }, [el('span', { class: 'num', text: years }), el('span', { text: '· ' + A.tr(s.country) }), s.croatia ? el('span', { class: 'grade-pill', text: t('scientists.croatia') }) : null]),
            el('p', { class: 'sci-field', text: A.tr(s.field) }),
            el('p', null, [el('b', { text: t('scientists.known') + ': ' }), A.tr(s.known)]),
            body, moreBtn
          ])
        ]));
      });
    }
    draw();
    main.appendChild(el('div', { class: 'toolbar' }, [chips]));
    main.appendChild(grid);
  }

  // ---------- unit converter ----------
  const UNITS = {
    length: { base: 'm', units: { mm: 0.001, cm: 0.01, dm: 0.1, m: 1, km: 1000 } },
    area: { base: 'm²', units: { 'mm²': 1e-6, 'cm²': 1e-4, 'dm²': 1e-2, 'm²': 1, 'km²': 1e6, ha: 1e4 } },
    volume: { base: 'm³', units: { 'mL (cm³)': 1e-6, 'cL': 1e-5, 'dL': 1e-4, 'L (dm³)': 1e-3, 'hL': 0.1, 'm³': 1 } },
    mass: { base: 'kg', units: { mg: 1e-6, g: 1e-3, dag: 1e-2, kg: 1, t: 1000 } },
    time: { base: 's', units: { ms: 1e-3, s: 1, min: 60, h: 3600, d: 86400 } },
    speed: { base: 'm/s', units: { 'm/s': 1, 'km/h': 1 / 3.6, 'cm/s': 0.01, 'km/s': 1000 } },
    density: { base: 'kg/m³', units: { 'kg/m³': 1, 'g/cm³': 1000, 'g/L': 1, 'kg/L': 1000 } },
    pressure: { base: 'Pa', units: { Pa: 1, hPa: 100, kPa: 1000, MPa: 1e6, bar: 1e5, mbar: 100, atm: 101325, mmHg: 133.322 } },
    energy: { base: 'J', units: { J: 1, kJ: 1000, MJ: 1e6, Wh: 3600, kWh: 3.6e6, cal: 4.184, kcal: 4184 } },
    power: { base: 'W', units: { W: 1, kW: 1000, MW: 1e6, 'hp (KS)': 735.5 } },
    temperature: { base: '°C', units: { '°C': 1, K: 1, '°F': 1 }, special: true }
  };
  function convertTemp(v, from, to) {
    let c = from === '°C' ? v : from === 'K' ? v - 273.15 : (v - 32) * 5 / 9;
    return to === '°C' ? c : to === 'K' ? c + 273.15 : c * 9 / 5 + 32;
  }
  const convState = { cat: 'speed', value: 1, from: null, to: null };
  function renderConverter(main) {
    const el = A.el, t = A.t, lang = A.lang();
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('converter.title') }), el('p', { class: 'lede', text: t('converter.lede') })]));
    const catSel = el('select', { class: 'sk-select', id: 'conv-cat' });
    Object.keys(UNITS).forEach(c => catSel.appendChild(el('option', { value: c, text: t('converter.cats.' + c) })));
    catSel.value = convState.cat;
    const valIn = el('input', { class: 'search', style: 'flex:0 1 180px', type: 'text', inputmode: 'decimal', id: 'conv-value', value: K.fmt(convState.value, autoDigits(convState.value), lang) });
    const fromSel = el('select', { class: 'sk-select', id: 'conv-from' });
    const toSel = el('select', { class: 'sk-select', id: 'conv-to' });
    const result = el('div', { class: 'conv-result num' });
    const tableWrap = el('div', { class: 'table-wrap' });
    function fillUnits() {
      const u = Object.keys(UNITS[convState.cat].units);
      [fromSel, toSel].forEach(sel => { sel.innerHTML = ''; u.forEach(x => sel.appendChild(el('option', { value: x, text: x }))); });
      if (!u.includes(convState.from)) convState.from = u[0];
      if (!u.includes(convState.to)) convState.to = u[Math.min(1, u.length - 1)];
      fromSel.value = convState.from; toSel.value = convState.to;
    }
    function conv(v, from, to) {
      const cat = UNITS[convState.cat];
      if (cat.special) return convertTemp(v, from, to);
      return v * cat.units[from] / cat.units[to];
    }
    function fmtConv(v) {
      if (!Number.isFinite(v)) return '–';
      const a = Math.abs(v);
      let d = a === 0 ? 0 : a >= 1000 ? 0 : a >= 100 ? 1 : a >= 1 ? 2 : a >= 0.01 ? 4 : 6;
      let s = K.fmt(v, d, lang);
      if (d > 0) s = s.replace(/([.,]\d*?)0+$/, '$1').replace(/[.,]$/, '');
      return s;
    }
    function update() {
      const v = parseNum(valIn.value);
      convState.from = fromSel.value; convState.to = toSel.value;
      if (v === null) { result.textContent = '–'; tableWrap.innerHTML = ''; return; }
      convState.value = v;
      result.textContent = `${fmtConv(v)} ${convState.from} = ${fmtConv(conv(v, convState.from, convState.to))} ${convState.to}`;
      tableWrap.innerHTML = '';
      const table = el('table', null, [el('thead', null, [el('tr', null, [el('th', { text: t('converter.table') })])])]);
      const tb = el('tbody');
      Object.keys(UNITS[convState.cat].units).forEach(u => tb.appendChild(el('tr', null, [el('td', { class: 'num', text: `${fmtConv(conv(v, convState.from, u))} ${u}` })])));
      table.appendChild(tb); tableWrap.appendChild(table);
    }
    catSel.addEventListener('change', () => { convState.cat = catSel.value; fillUnits(); update(); });
    [fromSel, toSel].forEach(s => s.addEventListener('change', update));
    valIn.addEventListener('input', update);
    const swap = el('button', { type: 'button', class: 'btn sm', text: '⇄', 'aria-label': 'swap', onclick: () => { const a = fromSel.value; fromSel.value = toSel.value; toSel.value = a; update(); } });
    main.appendChild(el('div', { class: 'panel converter' }, [
      el('div', { class: 'toolbar' }, [el('label', { class: 'sk-label', for: 'conv-cat', text: t('converter.category') }), catSel]),
      el('div', { class: 'toolbar' }, [el('label', { class: 'sk-label', for: 'conv-value', text: t('converter.value') }), valIn, el('label', { class: 'sk-label', for: 'conv-from', text: t('converter.from') }), fromSel, swap, el('label', { class: 'sk-label', for: 'conv-to', text: t('converter.to') }), toSel]),
      result
    ]));
    main.appendChild(tableWrap);
    fillUnits(); update();
  }

  // ---------- problem-solving guide ----------
  function renderGuide() {
    const el = A.el, t = A.t;
    const box = el('details', { class: 'panel guide' }, [el('summary', { text: t('guide.title') })]);
    const ol = el('ol', { class: 'guide-steps' });
    for (let i = 1; i <= 5; i++) ol.appendChild(el('li', null, [el('b', { text: t('guide.s' + i + 't') }), ' ', t('guide.s' + i)]));
    box.appendChild(ol);
    return box;
  }

  // ---------- brain teasers (concept questions, ranking, estimation) ----------
  const conceptState = { topic: 'all', type: 'all' };
  const conceptsSolved = () => (A.progress().concepts && A.progress().concepts.solved) || 0;
  function conceptRec() { const P = A.progress(); return P.concepts || (P.concepts = { solved: 0, attempts: 0, done: {} }); }
  function renderConcepts(main) {
    const el = A.el, t = A.t, lang = A.lang();
    const all = Content.concepts;
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('concepts.title') }), el('p', { class: 'lede', text: t('concepts.lede') })]));
    if (!all.length) { main.appendChild(el('p', { class: 'empty', text: t('practice.none') })); return; }
    const topicChips = el('div', { class: 'chips' }), typeChips = el('div', { class: 'chips' });
    const area = el('div');
    function pool() { return all.filter(c => (conceptState.topic === 'all' || c.topic === conceptState.topic) && (conceptState.type === 'all' || c.type === conceptState.type)); }
    function drawChips() {
      topicChips.innerHTML = ''; typeChips.innerHTML = '';
      const topics = ['all'].concat(Content.topics.map(tp => tp.id).filter(id => all.some(c => c.topic === id)));
      topics.forEach(id => topicChips.appendChild(el('button', { type: 'button', class: 'chip' + (conceptState.topic === id ? ' is-active' : ''), text: id === 'all' ? t('practice.all') : A.tr(Content.byId[id].title), onclick: () => { conceptState.topic = id; drawChips(); start(); } })));
      [['all', 'practice.all'], ['mc', 'concepts.typeMc'], ['rank', 'concepts.typeRank'], ['num', 'concepts.typeNum']].forEach(([v, key]) => typeChips.appendChild(el('button', { type: 'button', class: 'chip' + (conceptState.type === v ? ' is-active' : ''), text: t(key), onclick: () => { conceptState.type = v; drawChips(); start(); } })));
    }
    drawChips();
    main.appendChild(el('div', { class: 'panel', style: 'margin-bottom:14px; display:grid; gap:10px' }, [el('h4', { text: t('practice.topics') }), topicChips, el('h4', { text: t('concepts.kind') }), typeChips]));
    main.appendChild(area);
    let items = [], idx = 0, score = 0, keyHandler = null;
    function start() {
      items = A.shuffle(pool()).slice(0, 10); idx = 0; score = 0;
      if (!items.length) { area.innerHTML = ''; area.appendChild(el('p', { class: 'empty', text: t('practice.none') })); return; }
      show();
    }
    function finish() {
      area.innerHTML = '';
      const pct = Math.round(score / items.length * 100);
      area.appendChild(el('div', { class: 'quiz-card quiz result' }, [
        el('h3', { text: `${t('quiz.yourScore')}: ${score} / ${items.length} (${pct} %)` }),
        el('p', { text: t(pct >= 80 ? 'quiz.great' : pct >= 50 ? 'quiz.good' : 'quiz.again') }),
        el('div', { class: 'quiz-actions' }, [el('button', { type: 'button', class: 'btn primary', text: t('quiz.retry'), onclick: start }), el('a', { class: 'btn', href: '#practice', text: t('practice.title') })])
      ]));
    }
    function show() {
      if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
      area.innerHTML = '';
      const c = items[idx], topic = Content.byId[c.topic];
      const card = el('div', { class: 'quiz-card quiz' });
      card.appendChild(el('div', { class: 'quiz-top' }, [el('span', { class: 'quiz-type num', text: `${t('quiz.question')} ${idx + 1} ${t('quiz.of')} ${items.length}` }), el('span', { class: 'progress-bar' }, [el('i', { style: `width:${idx / items.length * 100}%` })]), el('span', { class: 'quiz-type num', text: `${score} / ${idx}` })]));
      card.appendChild(el('div', { class: 'practice-head' }, [topic ? el('a', { class: 'quiz-type', href: '#' + topic.id, text: A.tr(topic.title) }) : el('span'), el('span', { class: 'quiz-type', text: t('concepts.type' + (c.type === 'mc' ? 'Mc' : c.type === 'rank' ? 'Rank' : 'Num')) + ' · ' + stars(c.level || 1) })]));
      card.appendChild(el('div', { class: 'quiz-q', text: A.tr(c.q) }));
      const fb = el('div'); const nextBtn = el('button', { type: 'button', class: 'btn primary', text: idx + 1 < items.length ? t('quiz.next') : t('quiz.finish'), onclick: () => { idx++; if (idx >= items.length) finish(); else show(); window.scrollTo({ top: Math.max(0, area.getBoundingClientRect().top + window.scrollY - 90), behavior: 'smooth' }); } });
      nextBtn.hidden = true;
      let answered = false;
      function done(ok, extra) {
        answered = true; if (ok) score++;
        const rec = conceptRec(); rec.attempts++; if (ok && !rec.done[c.id]) { rec.done[c.id] = true; rec.solved++; } A.saveProgress(); A.checkBadges();
        fb.innerHTML = '';
        const box = el('div', { class: 'feedback ' + (ok ? 'ok' : 'no') }, [el('b', { text: ok ? t('quiz.correct') : t('quiz.wrong') + (extra ? ' ' + extra : '') }), el('span', { text: A.tr(c.explain) })]);
        if (c.misconception) box.appendChild(el('span', { class: 'myth-q' }, [el('b', { text: t('concepts.misconception') + ': ' }), A.tr(c.misconception)]));
        fb.appendChild(box); nextBtn.hidden = false; nextBtn.focus();
        card.querySelector('.quiz-top .quiz-type:last-child').textContent = `${score} / ${idx + 1}`;
      }
      if (c.type === 'mc') {
        const perm = A.shuffle(c.options.map((o, i) => i));
        const opts = el('div', { class: 'options' });
        const btns = perm.map((orig, pos) => { const b = el('button', { type: 'button', class: 'option' }, [el('span', { class: 'key', text: String(pos + 1) }), el('span', { text: A.tr(c.options[orig]) })]); b.addEventListener('click', () => choose(pos)); opts.appendChild(b); return b; });
        function choose(pos) { if (answered) return; const ok = perm[pos] === c.answer; btns.forEach((b, i) => { b.disabled = true; if (perm[i] === c.answer) b.classList.add('correct'); else if (i === pos) b.classList.add('wrong'); }); done(ok, ok ? '' : t('quiz.correctAnswer') + ' ' + A.tr(c.options[c.answer])); }
        card.appendChild(opts);
        keyHandler = e => { if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (!answered && /^[1-4]$/.test(e.key) && parseInt(e.key, 10) <= btns.length) choose(parseInt(e.key, 10) - 1); else if (e.key === 'Enter' && answered) nextBtn.click(); };
      } else if (c.type === 'rank') {
        const n = c.items.length;
        let order = [];  // indexes into c.items in the order the kid placed them
        const perm = A.shuffle(c.items.map((x, i) => i));
        const pool = el('div', { class: 'rank-pool' }), placed = el('ol', { class: 'rank-placed' });
        card.appendChild(el('p', { class: 'sk-note', text: t('concepts.rankHint') }));
        card.appendChild(placed); card.appendChild(pool);
        const checkBtn = el('button', { type: 'button', class: 'btn primary', text: t('practice.check') }); checkBtn.disabled = true;
        const undoBtn = el('button', { type: 'button', class: 'btn', text: t('concepts.undo') }); undoBtn.disabled = true;
        function draw() {
          pool.innerHTML = ''; placed.innerHTML = '';
          perm.filter(i => !order.includes(i)).forEach(i => pool.appendChild(el('button', { type: 'button', class: 'option', onclick: () => { if (answered) return; order.push(i); draw(); } }, [el('span', { text: A.tr(c.items[i]) })])));
          order.forEach((i, k) => placed.appendChild(el('li', null, [el('span', { class: 'key', text: String(k + 1) }), el('span', { text: A.tr(c.items[i]) })])));
          checkBtn.disabled = order.length !== n || answered; undoBtn.disabled = !order.length || answered;
        }
        undoBtn.addEventListener('click', () => { order.pop(); draw(); });
        checkBtn.addEventListener('click', () => {
          if (answered || order.length !== n) return;
          const ok = order.every((i, k) => i === k);
          placed.querySelectorAll('li').forEach((li, k) => li.classList.add(order[k] === k ? 'correct' : 'wrong'));
          const correctList = el('ol', { class: 'rank-correct' }); c.items.forEach(x => correctList.appendChild(el('li', { text: A.tr(x) })));
          done(ok, '');
          if (!ok) fb.appendChild(el('div', { class: 'practice-steps' }, [el('b', { text: t('concepts.correctOrder') }), correctList]));
        });
        draw();
        card.appendChild(el('div', { class: 'quiz-actions', style: 'justify-content:flex-start' }, [undoBtn, checkBtn]));
        keyHandler = e => { if (e.key === 'Enter' && answered) nextBtn.click(); };
      } else {
        const input = el('input', { type: 'text', inputmode: 'decimal', id: 'concept-answer', placeholder: t('practice.answer'), autocomplete: 'off' });
        const checkBtn = el('button', { type: 'button', class: 'btn primary', text: t('practice.check') });
        card.appendChild(el('p', { class: 'sk-note', text: t('concepts.estimateHint') }));
        card.appendChild(el('div', { class: 'num-answer' }, [input, c.unit ? el('span', { class: 'unit', text: c.unit }) : null, checkBtn]));
        const check = () => { if (answered) return; const v = parseNum(input.value); if (v === null) { input.focus(); return; } const ok = v >= c.min && v <= c.max; input.disabled = true; checkBtn.disabled = true; done(ok, ok ? '' : `${t('concepts.accepted')} ${makeF(lang)(c.min)} – ${makeF(lang)(c.max)} ${c.unit || ''}`); };
        checkBtn.addEventListener('click', check);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (answered) nextBtn.click(); else check(); } });
        setTimeout(() => input.focus(), 30);
      }
      card.appendChild(fb);
      card.appendChild(el('div', { class: 'quiz-actions' }, [nextBtn]));
      area.appendChild(card);
      if (keyHandler) document.addEventListener('keydown', keyHandler);
    }
    A.onLeave(() => { if (keyHandler) document.removeEventListener('keydown', keyHandler); });
    start();
  }
  const conceptCount = () => Content.concepts.length;

  return { init(api) { A = api; }, renderPracticeTab, renderPracticePage, renderSummary, renderMisconceptions, renderWorkedExample, renderScientists, renderConverter, renderConcepts, renderGuide, setConceptTopic(id) { conceptState.topic = id; conceptState.type = 'all'; }, problemCount, solvedTotal, solvedIn, hardSolved, templatesFor, conceptCount, conceptsSolved };
})();
