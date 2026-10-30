/* FizLab — application shell: routing, lessons, simulations, quizzes, glossary, flashcards, progress. */
(function () {
  'use strict';
  const I18N = window.I18N, Content = window.Content, Sims = window.Sims, K = window.SimKit;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const PASS = 70;

  // ---------- storage ----------
  const store = {
    get(k, def) { try { const v = localStorage.getItem('fizlab.' + k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem('fizlab.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    remove(k) { try { localStorage.removeItem('fizlab.' + k); } catch (e) { /* ignore */ } }
  };
  const defaultProgress = () => ({ lessons: {}, sims: {}, quiz: {}, tasks: {}, langs: {}, practice: {}, challenge: { streak: 0, last: null, solved: {} }, badges: {} });
  let progress = Object.assign(defaultProgress(), store.get('progress', {}));
  progress.challenge = Object.assign({ streak: 0, last: null, solved: {} }, progress.challenge || {});
  const saveProgress = () => store.set('progress', progress);

  let lang = store.get('lang', null) || (((navigator.language || '').toLowerCase().startsWith('hr')) ? 'hr' : 'en');
  progress.langs[lang] = true;

  // ---------- i18n ----------
  function t(path) {
    const walk = (root) => path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), root);
    const v = walk(I18N[lang]);
    if (v !== undefined) return v;
    const f = walk(I18N.en);
    return f === undefined ? path : f;
  }
  const tr = obj => K.tr(obj, lang);
  const fmt = (v, d) => K.fmt(v, d, lang);

  // ---------- DOM helpers ----------
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(k => {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else if (k === 'style') e.style.cssText = v;
      else e.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(c => { if (c === null || c === undefined || c === false) return; e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  const svgIcon = (paths, size) => `<svg viewBox="0 0 24 24" width="${size || 24}" height="${size || 24}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const ICONS = {
    matter: '<circle cx="7" cy="8" r="2.5"/><circle cx="15" cy="7" r="2.5"/><circle cx="11" cy="15" r="2.5"/><circle cx="18" cy="16" r="2.5"/>',
    density: '<path d="M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/><rect x="9" y="6" width="6" height="7" rx="1"/>',
    motion: '<path d="M4 12h12"/><path d="M12 7l5 5-5 5"/><path d="M3 7h3M3 17h3"/>',
    forces: '<rect x="10" y="8" width="8" height="8" rx="1"/><path d="M2 12h7"/><path d="M6 9l3 3-3 3"/>',
    gravity: '<circle cx="12" cy="17" r="4"/><circle cx="12" cy="4" r="1.5"/><path d="M12 6v5"/><path d="M10 9l2 2 2-2"/>',
    pressure: '<path d="M4 18h16"/><path d="M8 4v10M12 4v10M16 4v10"/><path d="M6 12l2 2 2-2M10 12l2 2 2-2M14 12l2 2 2-2"/>',
    levers: '<path d="M3 15l18-6"/><path d="M9 20l3-5 3 5z"/><circle cx="5" cy="13" r="2"/>',
    energy: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    heat: '<path d="M10 4a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><circle cx="12" cy="17" r="1.5"/><path d="M12 9v6"/>',
    electricity: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.5 1 .5 1.6V16h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0 0 12 3z"/>',
    magnetism: '<path d="M6 3v9a6 6 0 0 0 12 0V3"/><path d="M6 3h4v6H6zM14 3h4v6h-4z"/>',
    waves: '<path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/>',
    light: '<path d="M4 19L12 4l8 15z"/><path d="M2 10h3M19 10l3-2M19 13l3 2"/>',
    space: '<circle cx="12" cy="12" r="5"/><path d="M3 10c5 6 13 8 18 4"/>',
    _default: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/>'
  };
  const topicIcon = (topic, size) => svgIcon(ICONS[topic.id] || ICONS._default, size);
  const iconBox = (topic, size) => el('span', { class: 'topic-icon', style: `background: var(--${topic.color || 'c1'}); width:${size || 48}px; height:${size || 48}px;`, html: topicIcon(topic, Math.round((size || 48) * 0.58)) });

  let toastTimer = 0;
  function toast(msg) {
    const tEl = $('#toast'); tEl.textContent = msg; tEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => tEl.classList.remove('show'), 2600);
  }

  // ---------- theme ----------
  const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function applyTheme() {
    const pref = store.get('theme', null);
    if (pref) document.documentElement.setAttribute('data-theme', pref); else document.documentElement.removeAttribute('data-theme');
  }
  function isDark() {
    const a = document.documentElement.getAttribute('data-theme');
    return a ? a === 'dark' : !!(mql && mql.matches);
  }
  function toggleTheme() {
    store.set('theme', isDark() ? 'light' : 'dark');
    applyTheme();
    if (current.sim && current.sim.handle) current.sim.handle.setTheme(K.theme());
    if (heroAnim) heroAnim.redraw();
  }
  if (mql) mql.addEventListener('change', () => { if (current.sim && current.sim.handle) current.sim.handle.setTheme(K.theme()); if (heroAnim) heroAnim.redraw(); });
  const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ---------- progress helpers ----------
  const allQuestions = () => Content.topics.flatMap(tp => tp.quiz.map((q, i) => ({ q, topic: tp, i })));
  const allTerms = () => Content.topics.flatMap(tp => tp.keyTerms.map(k => ({ k, topic: tp })));
  const quizBest = id => (progress.quiz[id] && progress.quiz[id].best) || 0;
  const quizPassed = id => quizBest(id) >= PASS;
  const simsTried = topic => topic.sims.filter(s => progress.sims[s]).length;
  const practiceDone = id => !!(window.FizExt && FizExt.templatesFor(id).length && FizExt.solvedIn(id) >= 3);
  function topicPct(topic) {
    const hasPractice = !!(window.FizExt && FizExt.templatesFor(topic.id).length);
    let n = 0; if (progress.lessons[topic.id]) n++; if (simsTried(topic) > 0) n++; if (quizPassed(topic.id)) n++; if (practiceDone(topic.id)) n++;
    return Math.round(n / (hasPractice ? 4 : 3) * 100);
  }
  const BADGES = {
    firstQuiz: () => Object.keys(progress.quiz).length > 0,
    perfect: () => Object.values(progress.quiz).some(q => q.best >= 100),
    reader: () => Object.keys(progress.lessons).length >= 5,
    explorer: () => Object.keys(progress.sims).length >= 10,
    scientist: () => Content.topics.filter(tp => quizPassed(tp.id)).length >= 7,
    bilingual: () => progress.langs.en && progress.langs.hr,
    streak3: () => (progress.challenge.streak || 0) >= 3,
    master: () => Content.topics.length > 0 && Content.topics.every(tp => quizPassed(tp.id)),
    solver: () => !!window.FizExt && FizExt.solvedTotal() >= 25,
    hard: () => !!window.FizExt && FizExt.hardSolved(),
    thinker: () => !!window.FizExt && FizExt.conceptsSolved() >= 20
  };
  function checkBadges() {
    Object.keys(BADGES).forEach(id => {
      if (!progress.badges[id] && BADGES[id]()) {
        progress.badges[id] = Date.now(); saveProgress();
        toast(t('common.badgeEarned') + ' ' + t('badges.' + id + '.t'));
      }
    });
  }

  // ---------- routing ----------
  const current = { route: null, sim: null, keyHandler: null, cleanup: [] };
  function parseHash() {
    const h = (location.hash || '#home').slice(1);
    if (!h || h === 'home') return { view: 'home' };
    if (['glossary', 'formulas', 'flashcards', 'progress', 'mix', 'challenge', 'practice', 'scientists', 'converter', 'concepts'].includes(h)) return { view: h };
    const parts = h.split('-');
    if (Content.byId[parts[0]]) {
      const tab = ['lesson', 'sim', 'quiz', 'practice', 'home'].includes(parts[1]) ? parts[1] : 'lesson';
      return { view: 'topic', topic: parts[0], tab, sim: parts[2] || null };
    }
    return { view: 'notfound' };
  }
  function go(hash) { if (location.hash === '#' + hash) render(); else location.hash = hash; }
  window.addEventListener('hashchange', render);

  function teardown() {
    current.cleanup.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
    current.cleanup = [];
    if (current.keyHandler) { document.removeEventListener('keydown', current.keyHandler); current.keyHandler = null; }
    if (heroAnim) { heroAnim.stop(); heroAnim = null; }
  }
  function unmountSim() {
    if (current.sim && current.sim.handle) { try { current.sim.handle.destroy(); } catch (e) { console.error(e); } }
    current.sim = null;
  }

  function render() {
    const r = parseHash();
    teardown();
    const keepSim = r.view === 'topic' && r.tab === 'sim' && current.sim && current.sim.topic === r.topic && (!r.sim || r.sim === current.sim.id);
    if (!keepSim) unmountSim();
    current.route = r;
    const main = $('#main');
    main.innerHTML = '';
    renderNav(); renderRail();
    switch (r.view) {
      case 'home': renderHome(main); break;
      case 'topic': renderTopic(main, r); break;
      case 'glossary': renderGlossary(main); break;
      case 'formulas': renderFormulas(main); break;
      case 'flashcards': renderFlashcards(main); break;
      case 'progress': renderProgress(main); break;
      case 'mix': renderMix(main); break;
      case 'challenge': renderChallenge(main); break;
      case 'practice': FizExt.renderPracticePage(main); break;
      case 'scientists': FizExt.renderScientists(main); break;
      case 'converter': FizExt.renderConverter(main); break;
      case 'concepts': FizExt.renderConcepts(main); break;
      default: main.appendChild(el('p', { class: 'empty', text: t('common.notFound') }));
    }
    $('#foot').textContent = t('footer');
    document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = t(n.getAttribute('data-i18n')); });
    document.documentElement.lang = lang;
    if (!keepSim) window.scrollTo({ top: 0 });
  }

  // ---------- nav + rail ----------
  function renderNav() {
    const nav = $('#nav'); nav.innerHTML = '';
    const r = current.route || {};
    [['home', 'nav.home'], ['practice', 'nav.practice'], ['glossary', 'nav.glossary'], ['formulas', 'nav.formulas'], ['flashcards', 'nav.flashcards'], ['scientists', 'nav.scientists'], ['progress', 'nav.progress']].forEach(([h, key]) => {
      const active = (r.view === h) || (h === 'home' && (r.view === 'topic' || r.view === 'mix' || r.view === 'challenge' || r.view === 'converter'));
      nav.appendChild(el('a', { href: '#' + h, class: active ? 'is-active' : '', text: t(key) }));
    });
  }
  function renderRail() {
    const rail = $('#rail'); rail.innerHTML = '';
    const r = current.route || {};
    rail.appendChild(el('h2', { text: t('sections.topics') }));
    const ul = el('ul', { class: 'rail-list' });
    Content.topics.forEach(tp => {
      const pct = topicPct(tp);
      ul.appendChild(el('li', null, [el('a', { href: '#' + tp.id, class: r.topic === tp.id ? 'is-active' : '' }, [
        el('span', { class: 'dot', style: `background: var(--${tp.color})` }), tr(tp.title),
        el('span', { class: 'pct num', text: pct ? pct + ' %' : '' })])]));
    });
    rail.appendChild(ul);
    rail.appendChild(el('h2', { text: t('sections.tools') }));
    const ul2 = el('ul', { class: 'rail-list' });
    [['practice', 'quick.practice.t'], ['concepts', 'quick.concepts.t'], ['mix', 'quick.mix.t'], ['challenge', 'quick.challenge.t'], ['glossary', 'quick.glossary.t'], ['formulas', 'quick.formulas.t'], ['flashcards', 'quick.flashcards.t'], ['scientists', 'quick.scientists.t'], ['converter', 'quick.converter.t'], ['progress', 'quick.progress.t']].forEach(([h, key]) => {
      ul2.appendChild(el('li', null, [el('a', { href: '#' + h, class: r.view === h ? 'is-active' : '', text: t(key) })]));
    });
    rail.appendChild(ul2);
  }

  // ---------- home ----------
  let heroAnim = null;
  function startHeroAnim(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf = 0, last = 0, theme = K.theme();
    const balls = [];
    const colors = ['c1', 'c2', 'c3', 'c4', 'c5', 'c7'];
    for (let i = 0; i < 6; i++) balls.push({ x: 40 + i * 70, y: 30 + (i % 3) * 30, vx: (i % 2 ? 1 : -1) * (40 + i * 10), vy: 0, r: 12 + (i % 3) * 4, c: colors[i] });
    const pend = { a: 0.6, va: 0, L: 110 };
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth || 400; h = canvas.clientHeight || 240;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function step(dt) {
      const g = 600;
      balls.forEach(b => {
        b.vy += g * dt; b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.y + b.r > h - 14) { b.y = h - 14 - b.r; b.vy = -Math.abs(b.vy) * 0.82; if (Math.abs(b.vy) < 60) b.vy = -420 - Math.random() * 120; }
        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx); }
      });
      pend.va += -(g / pend.L) * Math.sin(pend.a) * dt * 0.25; pend.a += pend.va * dt;
    }
    function draw() {
      theme = K.theme();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
      K.grid(ctx, 0, 0, w, h, 24, K.withAlpha(theme.fg, 0.05));
      ctx.fillStyle = theme.ground; ctx.fillRect(0, h - 14, w, 14);
      // pendulum
      const px = w - 70, py = 10;
      const bx = px + Math.sin(pend.a) * pend.L, by = py + Math.cos(pend.a) * pend.L;
      ctx.strokeStyle = theme.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
      ctx.fillStyle = theme.c8; ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI * 2); ctx.fill();
      balls.forEach(b => { ctx.fillStyle = theme[b.c]; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); });
      K.text(ctx, 'g = 9,81 m/s²', 12, h - 24, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg });
    }
    function frame(now) {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      step(dt); draw(); raf = requestAnimationFrame(frame);
    }
    resize(); draw();
    const ro = window.ResizeObserver ? new ResizeObserver(() => { resize(); draw(); }) : null;
    if (ro) ro.observe(canvas);
    if (!reducedMotion) raf = requestAnimationFrame(frame);
    return { stop() { cancelAnimationFrame(raf); if (ro) ro.disconnect(); }, redraw: draw };
  }
  let homeFilter = 'all';
  function renderHome(main) {
    const nSims = Sims.list.length, nQ = allQuestions().length, nTerms = allTerms().length;
    const hero = el('section', { class: 'hero' }, [
      el('div', null, [
        el('h1', { html: t('hero.title') }),
        el('p', { class: 'lede', text: t('hero.lede') }),
        el('div', { class: 'hero-actions' }, [
          el('a', { class: 'btn primary', href: '#' + (Content.topics[0] ? Content.topics[0].id : 'home'), text: t('hero.start') }),
          el('a', { class: 'btn', href: '#mix', text: t('hero.mix') }),
          el('a', { class: 'btn warm', href: '#challenge', text: t('hero.challenge') })
        ]),
        el('div', { class: 'stats' }, [
          el('div', { class: 'stat' }, [el('b', { class: 'num', text: String(Content.topics.length) }), el('span', { text: t('stats.topics') })]),
          el('div', { class: 'stat' }, [el('b', { class: 'num', text: String(nSims) }), el('span', { text: t('stats.sims') })]),
          el('div', { class: 'stat' }, [el('b', { class: 'num', text: String(nQ) }), el('span', { text: t('stats.questions') })]),
          el('div', { class: 'stat' }, [el('b', { class: 'num', text: String(FizExt.problemCount() + FizExt.conceptCount()) }), el('span', { text: t('stats.problems') })]),
          el('div', { class: 'stat' }, [el('b', { class: 'num', text: String(nTerms) }), el('span', { text: t('stats.terms') })])
        ])
      ]),
      el('div', { class: 'hero-art' }, [el('canvas', { 'aria-hidden': 'true' })])
    ]);
    main.appendChild(hero);
    heroAnim = startHeroAnim($('canvas', hero));

    const head = el('div', { class: 'section-head' }, [el('h2', { text: t('sections.topics') })]);
    const chips = el('div', { class: 'chips' });
    [['all', 'filter.all'], ['7', 'filter.g7'], ['8', 'filter.g8'], ['0', 'filter.bonus']].forEach(([v, key]) => {
      if (v !== 'all' && !Content.topics.some(tp => String(tp.gradeLevel) === v)) return;
      chips.appendChild(el('button', { type: 'button', class: 'chip' + (homeFilter === v ? ' is-active' : ''), text: t(key), onclick: () => { homeFilter = v; render(); } }));
    });
    head.appendChild(chips);
    main.appendChild(head);
    const grid = el('div', { class: 'topic-grid' });
    Content.topics.filter(tp => homeFilter === 'all' || String(tp.gradeLevel) === homeFilter).forEach(tp => {
      const pct = topicPct(tp);
      grid.appendChild(el('a', { class: 'topic-card', href: '#' + tp.id }, [
        iconBox(tp, 48),
        el('div', null, [el('h3', { text: tr(tp.title) }), el('p', { class: 'tag', text: tr(tp.intro) })]),
        el('div', { class: 'meta' }, [
          el('span', { class: 'grade-pill', text: t('grade.' + tp.gradeLevel) }),
          el('span', { class: 'num', text: tp.sims.length + ' ' + t('common.sims') + ' · ' + tp.quiz.length + ' ' + t('common.questions') }),
          el('span', { class: 'progress-bar' }, [el('i', { style: 'width:' + pct + '%' })])
        ])
      ]));
    });
    main.appendChild(grid);

    main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('sections.tools') })]));
    const qg = el('div', { class: 'quick-grid' });
    ['practice', 'concepts', 'mix', 'challenge', 'glossary', 'formulas', 'flashcards', 'scientists', 'converter', 'progress'].forEach(k => {
      qg.appendChild(el('a', { class: 'quick-card', href: '#' + k }, [el('h3', { text: t('quick.' + k + '.t') }), el('p', { text: t('quick.' + k + '.d') })]));
    });
    main.appendChild(qg);
  }

  // ---------- topic ----------
  function renderTopic(main, r) {
    const topic = Content.byId[r.topic];
    const head = el('div', { class: 'topic-head' }, [
      el('div', { class: 'crumbs' }, [el('a', { href: '#home', text: t('common.allTopics') }), el('span', { text: '›' }), el('span', { text: tr(topic.title) })]),
      el('div', { class: 'topic-title' }, [iconBox(topic, 54), el('h1', { text: tr(topic.title) }), el('span', { class: 'grade-pill', text: t('grade.' + topic.gradeLevel) })]),
      el('p', { class: 'lede', text: tr(topic.intro) })
    ]);
    main.appendChild(head);
    const tabs = el('div', { class: 'tabs', role: 'tablist' });
    const done = { lesson: !!progress.lessons[topic.id], sim: simsTried(topic) > 0, quiz: quizPassed(topic.id), practice: practiceDone(topic.id), home: false };
    const tabList = FizExt.templatesFor(topic.id).length ? ['lesson', 'sim', 'quiz', 'practice', 'home'] : ['lesson', 'sim', 'quiz', 'home'];
    tabList.forEach(tab => {
      tabs.appendChild(el('button', { type: 'button', role: 'tab', class: r.tab === tab ? 'is-active' : '', 'aria-selected': r.tab === tab ? 'true' : 'false',
        onclick: () => go(tab === 'lesson' ? topic.id : topic.id + '-' + tab) }, [t('tabs.' + tab), done[tab] ? el('span', { class: 'done', 'aria-label': 'done' }) : null]));
    });
    main.appendChild(tabs);
    const panel = el('div', { class: 'tab-panel' });
    main.appendChild(panel);
    if (r.tab === 'lesson') renderLesson(panel, topic);
    else if (r.tab === 'sim') renderSimTab(panel, topic, r.sim);
    else if (r.tab === 'quiz') renderTopicQuiz(panel, topic);
    else if (r.tab === 'practice') FizExt.renderPracticeTab(panel, topic);
    else renderExperiment(panel, topic);
  }

  function renderLesson(panel, topic) {
    const wrap = el('div', { class: 'lesson' });
    const prose = el('article', { class: 'prose' });
    const summary = FizExt.renderSummary(topic); if (summary) prose.appendChild(summary);
    topic.lesson.forEach(sec => {
      const s = el('section', null, [el('h3', { text: tr(sec.h) })]);
      (sec.p[lang] || sec.p.en || []).forEach(p => s.appendChild(el('p', { text: p })));
      if (sec.svg) s.appendChild(el('div', { class: 'fig', html: sec.svg }));
      prose.appendChild(s);
    });
    const worked = FizExt.renderWorkedExample(topic); if (worked) prose.appendChild(worked);
    const readBtn = el('button', { type: 'button', class: 'btn ' + (progress.lessons[topic.id] ? '' : 'primary'), text: progress.lessons[topic.id] ? '✓ ' + t('lesson.read') : t('lesson.markRead'),
      onclick: () => { progress.lessons[topic.id] = Date.now(); saveProgress(); checkBadges(); toast(t('common.saved')); render(); } });
    prose.appendChild(el('div', { class: 'hero-actions' }, [readBtn, el('a', { class: 'btn', href: '#' + topic.id + '-sim', text: t('tabs.sim') + ' →' })]));
    wrap.appendChild(prose);

    const aside = el('aside', { class: 'aside' });
    if (topic.formulas.length) {
      const p = el('div', { class: 'panel' }, [el('h4', { text: t('lesson.formulas') })]);
      topic.formulas.forEach(f => p.appendChild(el('div', { class: 'formula-row' }, [el('div', { class: 'formula', text: f.expr }), el('div', { class: 'desc', text: tr(f.name) }), f.note ? el('div', { class: 'units', text: tr(f.note) }) : null])));
      aside.appendChild(p);
    }
    if (topic.keyTerms.length) {
      const p = el('div', { class: 'panel' }, [el('h4', { text: t('lesson.keyTerms') })]);
      const list = el('div', { class: 'terms' });
      topic.keyTerms.forEach(k => list.appendChild(el('div', { class: 'term' }, [
        el('b', { text: tr(k.term) }), el('span', { class: 'alt', text: (lang === 'en' ? 'HR: ' : 'EN: ') + (lang === 'en' ? k.term.hr : k.term.en) }), el('span', { text: tr(k.def) })])));
      p.appendChild(list); aside.appendChild(p);
    }
    if (topic.funFact) aside.appendChild(el('div', { class: 'callout' }, [el('h4', { text: t('lesson.funFact') }), el('p', { text: tr(topic.funFact) })]));
    const myths = FizExt.renderMisconceptions(topic); if (myths) aside.appendChild(myths);
    wrap.appendChild(aside);
    panel.appendChild(wrap);
  }

  function renderSimTab(panel, topic, simId) {
    const ids = topic.sims.filter(id => Sims.byId[id]);
    if (!ids.length) { panel.appendChild(el('p', { class: 'empty', text: t('sim.missing') })); return; }
    simId = ids.includes(simId) ? simId : ids[0];
    const def = Sims.byId[simId];
    const headRow = el('div', { class: 'sim-head' });
    if (ids.length > 1) {
      const seg = el('div', { class: 'sk-seg' });
      ids.forEach(id => seg.appendChild(el('button', { type: 'button', class: 'sk-seg-btn' + (id === simId ? ' is-active' : ''), text: tr(Sims.byId[id].title), onclick: () => go(topic.id + '-sim-' + id) })));
      headRow.appendChild(seg);
    } else headRow.appendChild(el('h3', { text: tr(def.title) }));
    headRow.appendChild(el('p', { class: 'summary', text: tr(def.summary) }));
    panel.appendChild(headRow);

    const wrap = el('div', { class: 'sim-wrap' });
    let stage;
    if (current.sim && current.sim.id === simId && current.sim.stage) {
      stage = current.sim.stage; current.sim.handle.setLang(lang);
    } else {
      unmountSim();
      stage = el('div', { class: 'sim-stage' });
      try {
        const handle = def.mount(stage, { lang, theme: K.theme(), reducedMotion, t: tr });
        current.sim = { id: simId, topic: topic.id, handle, stage };
      } catch (e) {
        console.error('sim mount failed', simId, e);
        stage.appendChild(el('p', { class: 'empty', text: t('sim.missing') }));
        current.sim = { id: simId, topic: topic.id, handle: null, stage };
      }
      if (!progress.sims[simId]) { progress.sims[simId] = Date.now(); saveProgress(); checkBadges(); }
    }
    wrap.appendChild(stage);
    const tasks = el('div', { class: 'panel sim-tasks' }, [el('h4', { text: t('sim.tryThis') })]);
    const ol = el('ol');
    const doneTasks = progress.tasks[simId] || {};
    (def.tasks || []).forEach((task, i) => {
      const cb = el('input', { type: 'checkbox', id: 'task-' + simId + '-' + i });
      cb.checked = !!doneTasks[i];
      const li = el('li', { class: cb.checked ? 'done' : '' }, [cb, el('label', { for: cb.id, text: tr(task) })]);
      cb.addEventListener('change', () => { const d = progress.tasks[simId] || (progress.tasks[simId] = {}); if (cb.checked) d[i] = true; else delete d[i]; saveProgress(); li.classList.toggle('done', cb.checked); });
      ol.appendChild(li);
    });
    tasks.appendChild(ol);
    tasks.appendChild(el('div', { style: 'margin-top:12px', }, [el('a', { class: 'btn sm', href: '#' + topic.id + '-quiz', text: t('tabs.quiz') + ' →' })]));
    wrap.appendChild(tasks);
    panel.appendChild(wrap);
  }

  // ---------- quiz engine ----------
  function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function parseNum(s) { const v = parseFloat(String(s).trim().replace(/\s/g, '').replace(',', '.')); return Number.isFinite(v) ? v : null; }
  function numTolerance(q) { return q.tolerance !== undefined ? q.tolerance : Math.max(0.01, Math.abs(q.answer) * 0.01); }

  // items: [{q, topic}] ; opts: {title, onFinish(score,total), backHref, backLabel, best}
  function runQuiz(panel, items, opts) {
    const total = items.length;
    const state = { idx: 0, score: 0, answered: false, perm: null };
    const top = el('div', { class: 'quiz-top' });
    const card = el('div', { class: 'quiz-card' });
    const root = el('div', { class: 'quiz' }, [top, card]);
    panel.appendChild(root);

    function showQuestion() {
      const item = items[state.idx], q = item.q;
      state.answered = false;
      top.innerHTML = '';
      top.appendChild(el('span', { class: 'quiz-type num', text: `${t('quiz.question')} ${state.idx + 1} ${t('quiz.of')} ${total}` }));
      top.appendChild(el('span', { class: 'progress-bar' }, [el('i', { style: `width:${(state.idx / total) * 100}%` })]));
      top.appendChild(el('span', { class: 'quiz-type num', text: `${t('common.score') || ''}${state.score} / ${state.idx}`.replace(/^undefined/, '') }));
      card.innerHTML = '';
      if (opts.showTopic) card.appendChild(el('div', { class: 'quiz-type', text: t('challenge.from') + ': ' + tr(item.topic.title) }));
      card.appendChild(el('div', { class: 'quiz-type', text: t(q.type === 'mc' ? 'quiz.typeMc' : q.type === 'tf' ? 'quiz.typeTf' : 'quiz.typeNum') }));
      card.appendChild(el('div', { class: 'quiz-q', text: tr(q.q) }));
      const fb = el('div');
      const actions = el('div', { class: 'quiz-actions' });
      const nextBtn = el('button', { type: 'button', class: 'btn primary', text: state.idx + 1 < total ? t('quiz.next') : t('quiz.finish'), onclick: next });
      nextBtn.hidden = true;
      actions.appendChild(nextBtn);

      function feedback(ok, correctText) {
        state.answered = true;
        if (ok) state.score++;
        fb.appendChild(el('div', { class: 'feedback ' + (ok ? 'ok' : 'no') }, [
          el('b', { text: ok ? t('quiz.correct') : t('quiz.wrong') + (correctText ? ' ' + t('quiz.correctAnswer') + ' ' + correctText : '') }),
          el('span', { text: tr(q.explain) })]));
        nextBtn.hidden = false; nextBtn.focus();
        top.querySelectorAll('.quiz-type')[1].textContent = `${state.score} / ${state.idx + 1}`;
      }

      if (q.type === 'mc') {
        state.perm = shuffle(q.options.map((o, i) => i));
        const opts2 = el('div', { class: 'options' });
        const btns = state.perm.map((origIdx, pos) => {
          const b = el('button', { type: 'button', class: 'option' }, [el('span', { class: 'key', text: String(pos + 1) }), el('span', { text: tr(q.options[origIdx]) })]);
          b.addEventListener('click', () => choose(pos));
          opts2.appendChild(b); return b;
        });
        card.appendChild(opts2);
        state.choose = pos => {
          if (state.answered) return;
          const ok = state.perm[pos] === q.answer;
          btns.forEach((b, i) => { b.disabled = true; if (state.perm[i] === q.answer) b.classList.add('correct'); else if (i === pos) b.classList.add('wrong'); });
          feedback(ok, ok ? '' : tr(q.options[q.answer]));
        };
        function choose(pos) { state.choose(pos); }
      } else if (q.type === 'tf') {
        const opts2 = el('div', { class: 'options' });
        const btns = [true, false].map((val, pos) => {
          const b = el('button', { type: 'button', class: 'option' }, [el('span', { class: 'key', text: String(pos + 1) }), el('span', { text: t('quiz.' + val) })]);
          b.addEventListener('click', () => state.choose(pos)); opts2.appendChild(b); return b;
        });
        card.appendChild(opts2);
        state.choose = pos => {
          if (state.answered) return;
          const val = pos === 0, ok = val === q.answer;
          btns.forEach((b, i) => { b.disabled = true; if ((i === 0) === q.answer) b.classList.add('correct'); else if (i === pos) b.classList.add('wrong'); });
          feedback(ok, ok ? '' : t('quiz.' + q.answer));
        };
      } else {
        const input = el('input', { type: 'text', inputmode: 'decimal', id: 'num-answer', placeholder: t('quiz.placeholder'), autocomplete: 'off' });
        const checkBtn = el('button', { type: 'button', class: 'btn primary', text: t('quiz.check') });
        const row = el('div', { class: 'num-answer' }, [input, q.unit ? el('span', { class: 'unit', text: q.unit }) : null, checkBtn]);
        card.appendChild(row);
        state.check = () => {
          if (state.answered) return;
          const v = parseNum(input.value); if (v === null) { input.focus(); return; }
          const ok = Math.abs(v - q.answer) <= numTolerance(q);
          input.disabled = true; checkBtn.disabled = true;
          row.classList.add(ok ? 'ok' : 'no');
          feedback(ok, ok ? '' : fmt(q.answer, Number.isInteger(q.answer) ? 0 : 2) + (q.unit ? ' ' + q.unit : ''));
        };
        checkBtn.addEventListener('click', state.check);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); state.check(); } });
        setTimeout(() => input.focus(), 50);
      }
      card.appendChild(fb);
      card.appendChild(actions);
      card.appendChild(el('p', { class: 'sk-note', text: t('quiz.hint') }));
    }
    function next() {
      state.idx++;
      if (state.idx >= total) finish(); else showQuestion();
      window.scrollTo({ top: Math.max(0, root.getBoundingClientRect().top + window.scrollY - 90), behavior: 'smooth' });
    }
    function finish() {
      const pct = Math.round(state.score / total * 100);
      if (opts.onFinish) opts.onFinish(state.score, total, pct);
      top.innerHTML = ''; card.innerHTML = '';
      const r = 62, c = 2 * Math.PI * r;
      const ring = el('div', { class: 'score-ring', html: `<svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="${r}" fill="none" stroke="var(--surface2)" stroke-width="12"/><circle cx="70" cy="70" r="${r}" fill="none" stroke="${pct >= PASS ? 'var(--good)' : 'var(--warn)'}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c * pct / 100} ${c}"/></svg><div class="label num">${pct} %</div>` });
      const msg = pct === 100 ? 'quiz.perfect' : pct >= 80 ? 'quiz.great' : pct >= 50 ? 'quiz.good' : 'quiz.again';
      card.appendChild(el('div', { class: 'result' }, [
        el('h3', { text: `${t('quiz.yourScore')}: ${state.score} / ${total}` }), ring, el('p', { text: t(msg) }),
        opts.best !== undefined ? el('p', { class: 'num', text: `${t('quiz.best')}: ${Math.max(opts.best, pct)} %` }) : null,
        el('div', { class: 'quiz-actions' }, [
          el('button', { type: 'button', class: 'btn primary', text: t('quiz.retry'), onclick: () => { root.remove(); runQuiz(panel, opts.reshuffle ? opts.reshuffle() : items, opts); } }),
          opts.backHref ? el('a', { class: 'btn', href: opts.backHref, text: opts.backLabel || t('common.back') }) : null
        ])
      ]));
    }
    current.keyHandler = e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
        return;
      }
      if (state.idx >= total) return;
      const q = items[state.idx].q;
      if (!state.answered && q.type !== 'num' && /^[1-4]$/.test(e.key)) { const pos = parseInt(e.key, 10) - 1; if (q.type === 'tf' && pos > 1) return; state.choose(pos); }
      else if (e.key === 'Enter' && state.answered) { e.preventDefault(); next(); }
    };
    document.addEventListener('keydown', current.keyHandler);
    showQuestion();
  }

  function renderTopicQuiz(panel, topic) {
    const best = quizBest(topic.id);
    const intro = el('div', { class: 'quiz-card quiz' }, [
      el('h3', { text: tr(topic.title) + ' — ' + t('tabs.quiz') }),
      el('p', { text: `${topic.quiz.length} ${t('quiz.intro')}` }),
      best ? el('p', { class: 'num', text: `${t('quiz.best')}: ${best} %` + (best >= PASS ? ' ✓ ' + t('quiz.pass') : '') }) : null,
      el('div', { class: 'quiz-actions' }, [el('button', { type: 'button', class: 'btn primary', text: t('quiz.start'), onclick: start })])
    ]);
    if (Content.concepts.some(c => c.topic === topic.id)) intro.appendChild(el('p', { class: 'sk-note' }, [el('a', { href: '#concepts', text: t('concepts.forTopic') + ' →', onclick: () => { FizExt.setConceptTopic(topic.id); } })]));
    panel.appendChild(intro);
    function start() {
      intro.remove();
      const items = topic.quiz.map(q => ({ q, topic }));
      runQuiz(panel, items, {
        best, backHref: '#' + topic.id + '-sim', backLabel: t('quiz.toSim'),
        onFinish: (score, total, pct) => {
          const rec = progress.quiz[topic.id] || { best: 0, attempts: 0 };
          rec.attempts++; rec.best = Math.max(rec.best, pct); rec.last = Date.now();
          progress.quiz[topic.id] = rec; saveProgress(); checkBadges(); renderRail();
        }
      });
    }
  }

  function renderExperiment(panel, topic) {
    const ex = topic.experiment;
    if (!ex) { panel.appendChild(el('p', { class: 'empty', text: '—' })); return; }
    const wrap = el('div', { class: 'experiment' }, [
      el('div', { class: 'wide' }, [el('h3', { text: tr(ex.title) })]),
      el('div', { class: 'panel' }, [el('h4', { text: t('home.materials') }), el('ul', null, (ex.materials[lang] || ex.materials.en).map(m => el('li', { text: m })))]),
      el('div', { class: 'panel' }, [el('h4', { text: t('home.steps') }), el('ol', null, (ex.steps[lang] || ex.steps.en).map(s => el('li', { text: s })))]),
      el('div', { class: 'callout wide' }, [el('h4', { text: t('home.why') }), el('p', { text: tr(ex.explain) })]),
      ex.safety ? el('div', { class: 'safety wide' }, [el('b', { text: t('home.safety') + ': ' }), tr(ex.safety)]) : null
    ]);
    panel.appendChild(wrap);
  }

  // ---------- glossary ----------
  function renderGlossary(main) {
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('glossary.title') }), el('p', { class: 'lede', text: t('glossary.lede') })]));
    const input = el('input', { class: 'search', type: 'search', id: 'glossary-search', placeholder: t('glossary.search') });
    main.appendChild(el('div', { class: 'toolbar' }, [input]));
    const wrap = el('div', { class: 'table-wrap' });
    main.appendChild(wrap);
    const terms = allTerms().sort((a, b) => tr(a.k.term).localeCompare(tr(b.k.term), lang));
    function draw() {
      const qx = input.value.trim().toLowerCase();
      const rows = terms.filter(x => !qx || x.k.term.en.toLowerCase().includes(qx) || x.k.term.hr.toLowerCase().includes(qx) || tr(x.k.def).toLowerCase().includes(qx));
      wrap.innerHTML = '';
      if (!rows.length) { wrap.appendChild(el('p', { class: 'empty', text: t('glossary.none') })); return; }
      const table = el('table', null, [el('thead', null, [el('tr', null, [el('th', { text: t('glossary.term') }), el('th', { text: t('glossary.croatian') }), el('th', { text: t('glossary.definition') }), el('th', { text: t('glossary.topic') })])])]);
      const tb = el('tbody');
      rows.forEach(x => tb.appendChild(el('tr', null, [
        el('td', null, [el('b', { text: lang === 'en' ? x.k.term.en : x.k.term.hr })]),
        el('td', null, [el('span', { class: 'alt', text: lang === 'en' ? x.k.term.hr : x.k.term.en })]),
        el('td', { text: tr(x.k.def) }),
        el('td', null, [el('a', { href: '#' + x.topic.id, text: tr(x.topic.title) })])
      ])));
      table.appendChild(tb); wrap.appendChild(table);
    }
    input.addEventListener('input', draw);
    draw();
  }

  // ---------- formulas ----------
  function renderFormulas(main) {
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('formulas.title') }), el('p', { class: 'lede', text: t('formulas.lede') })]));
    const grid = el('div', { class: 'formula-grid' });
    Content.topics.forEach(tp => tp.formulas.forEach(f => grid.appendChild(el('div', { class: 'formula-card' }, [
      el('a', { class: 'topic', href: '#' + tp.id, text: tr(tp.title) }),
      el('div', { class: 'formula', text: f.expr }),
      el('div', { class: 'desc', text: tr(f.name) }),
      f.note ? el('div', { class: 'units', text: tr(f.note) }) : null
    ]))));
    main.appendChild(grid);
  }

  // ---------- flashcards ----------
  let flashState = { mode: 'mode1', topic: 'all', order: null, idx: 0 };
  function renderFlashcards(main) {
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('flash.title') }), el('p', { class: 'lede', text: t('flash.lede') })]));
    const terms = allTerms();
    const modeSel = el('select', { class: 'sk-select', id: 'flash-mode' });
    ['mode1', 'mode2', 'mode3'].forEach(m => modeSel.appendChild(el('option', { value: m, text: t('flash.' + m) })));
    modeSel.value = flashState.mode;
    const topicSel = el('select', { class: 'sk-select', id: 'flash-topic' });
    topicSel.appendChild(el('option', { value: 'all', text: t('flash.allTopics') }));
    Content.topics.forEach(tp => topicSel.appendChild(el('option', { value: tp.id, text: tr(tp.title) })));
    topicSel.value = flashState.topic;
    const shuffleBtn = el('button', { type: 'button', class: 'btn', text: t('flash.shuffle') });
    main.appendChild(el('div', { class: 'toolbar' }, [modeSel, topicSel, shuffleBtn]));
    const deckWrap = el('div', { class: 'flash' });
    main.appendChild(deckWrap);
    let deck = [];
    function rebuild(reshuffle) {
      deck = terms.filter(x => flashState.topic === 'all' || x.topic.id === flashState.topic);
      if (reshuffle || !flashState.order || flashState.order.length !== deck.length) { flashState.order = shuffle(deck.map((_, i) => i)); flashState.idx = 0; }
      draw();
    }
    function draw() {
      deckWrap.innerHTML = '';
      if (!deck.length) { deckWrap.appendChild(el('p', { class: 'empty', text: '—' })); return; }
      const x = deck[flashState.order[flashState.idx]];
      let front, back, frontLabel, backLabel;
      if (flashState.mode === 'mode1') { front = tr(x.k.term); back = tr(x.k.def); frontLabel = tr(x.topic.title); backLabel = t('glossary.definition'); }
      else if (flashState.mode === 'mode2') { front = x.k.term.en; back = x.k.term.hr; frontLabel = 'English'; backLabel = 'Hrvatski'; }
      else { front = x.k.term.hr; back = x.k.term.en; frontLabel = 'Hrvatski'; backLabel = 'English'; }
      const cardEl = el('button', { type: 'button', class: 'flashcard', 'aria-label': t('flash.flip') }, [el('div', { class: 'flashcard-inner' }, [
        el('div', { class: 'flash-face' }, [el('div', null, [el('small', { text: frontLabel }), front])]),
        el('div', { class: 'flash-face back' }, [el('div', null, [el('small', { text: backLabel }), back])])
      ])]);
      cardEl.addEventListener('click', () => cardEl.classList.toggle('is-flipped'));
      deckWrap.appendChild(cardEl);
      deckWrap.appendChild(el('p', { class: 'sk-note', text: t('flash.flip') }));
      deckWrap.appendChild(el('div', { class: 'quiz-actions' }, [
        el('button', { type: 'button', class: 'btn', text: '← ' + t('flash.prev'), onclick: () => { flashState.idx = (flashState.idx - 1 + deck.length) % deck.length; draw(); } }),
        el('span', { class: 'num', style: 'align-self:center', text: `${t('flash.card')} ${flashState.idx + 1} ${t('flash.ofAll')} ${deck.length}` }),
        el('button', { type: 'button', class: 'btn primary', text: t('flash.next') + ' →', onclick: () => { flashState.idx = (flashState.idx + 1) % deck.length; draw(); } })
      ]));
    }
    modeSel.addEventListener('change', () => { flashState.mode = modeSel.value; draw(); });
    topicSel.addEventListener('change', () => { flashState.topic = topicSel.value; rebuild(true); });
    shuffleBtn.addEventListener('click', () => rebuild(true));
    rebuild(false);
    current.keyHandler = e => {
      if (e.key === 'ArrowRight') { flashState.idx = (flashState.idx + 1) % deck.length; draw(); }
      else if (e.key === 'ArrowLeft') { flashState.idx = (flashState.idx - 1 + deck.length) % deck.length; draw(); }
      else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); const c = $('.flashcard', deckWrap); if (c) c.classList.toggle('is-flipped'); }
    };
    document.addEventListener('keydown', current.keyHandler);
  }

  // ---------- progress ----------
  function renderProgress(main) {
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('progress.title') }), el('p', { class: 'lede', text: t('progress.lede') })]));
    const nL = Object.keys(progress.lessons).length, nQ = Content.topics.filter(tp => quizPassed(tp.id)).length, nS = Object.keys(progress.sims).filter(id => Sims.byId[id]).length;
    main.appendChild(el('div', { class: 'stats', style: 'margin:0 0 22px' }, [
      el('div', { class: 'stat' }, [el('b', { class: 'num', text: `${nL} / ${Content.topics.length}` }), el('span', { text: t('progress.lessons') })]),
      el('div', { class: 'stat' }, [el('b', { class: 'num', text: `${nQ} / ${Content.topics.length}` }), el('span', { text: t('progress.quizzes') })]),
      el('div', { class: 'stat' }, [el('b', { class: 'num', text: `${nS} / ${Sims.list.length}` }), el('span', { text: t('progress.sims') })]),
      el('div', { class: 'stat' }, [el('b', { class: 'num', text: String(FizExt.solvedTotal()) }), el('span', { text: t('progress.problems') })]),
      el('div', { class: 'stat' }, [el('b', { class: 'num', text: `${progress.challenge.streak || 0}` }), el('span', { text: t('progress.streak') })])
    ]));
    main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('progress.badges') })]));
    const bg = el('div', { class: 'badges' });
    const BADGE_GLYPH = { firstQuiz: '✓', perfect: '★', reader: '📖', explorer: '🧭', scientist: '🔬', bilingual: 'EN/HR', streak3: '🔥', master: '🏆', solver: '∑', hard: '💪', thinker: '💡' };
    Object.keys(BADGES).forEach(id => bg.appendChild(el('div', { class: 'badge' + (progress.badges[id] ? '' : ' locked') }, [
      el('span', { class: 'badge-icon', text: BADGE_GLYPH[id] || '•' }), el('div', null, [el('b', { text: t('badges.' + id + '.t') }), el('span', { text: t('badges.' + id + '.d') })])])));
    main.appendChild(bg);
    main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('sections.topics') })]));
    const wrap = el('div', { class: 'table-wrap' });
    const table = el('table', { class: 'progress-table' }, [el('thead', null, [el('tr', null, [el('th', { text: t('progress.topic') }), el('th', { text: t('progress.lesson') }), el('th', { text: t('progress.simulation') }), el('th', { text: t('progress.quiz') }), el('th', { text: t('progress.problemsCol') })])])]);
    const tb = el('tbody');
    Content.topics.forEach(tp => {
      const best = quizBest(tp.id);
      tb.appendChild(el('tr', null, [
        el('td', null, [el('a', { href: '#' + tp.id, text: tr(tp.title) })]),
        el('td', { text: progress.lessons[tp.id] ? '✓' : t('progress.notYet') }),
        el('td', { class: 'num', text: `${simsTried(tp)} / ${tp.sims.filter(s => Sims.byId[s]).length}` }),
        el('td', null, [el('span', { class: 'progress-bar' }, [el('i', { style: `width:${best}%; background: var(--${best >= PASS ? 'good' : 'warn'})` })]), el('span', { class: 'num', text: best ? best + ' %' : t('progress.notYet') })]),
        el('td', { class: 'num', text: FizExt.templatesFor(tp.id).length ? String(FizExt.solvedIn(tp.id)) : '—' })
      ]));
    });
    table.appendChild(tb); wrap.appendChild(table); main.appendChild(wrap);
    let armed = false;
    const resetBtn = el('button', { type: 'button', class: 'btn', style: 'margin-top:22px', text: t('progress.reset'), onclick: () => {
      if (!armed) { armed = true; resetBtn.textContent = t('progress.resetConfirm'); resetBtn.classList.add('warm'); setTimeout(() => { armed = false; resetBtn.textContent = t('progress.reset'); resetBtn.classList.remove('warm'); }, 4000); return; }
      progress = defaultProgress(); progress.langs[lang] = true; saveProgress(); render();
    } });
    main.appendChild(resetBtn);
  }

  // ---------- mixed quiz + daily challenge ----------
  function renderMix(main) {
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('mix.title') }), el('p', { class: 'lede', text: t('mix.lede') })]));
    const pick = () => shuffle(allQuestions()).slice(0, 10);
    runQuiz(main, pick(), { showTopic: true, backHref: '#home', backLabel: t('common.allTopics'), reshuffle: pick, onFinish: () => { if (!progress.quiz._mix) progress.quiz._mix = { best: 0 }; saveProgress(); } });
  }
  function todayKey() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h >>> 0); }
  function renderChallenge(main) {
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('challenge.title') }), el('p', { class: 'lede', text: t('challenge.lede') })]));
    const all = allQuestions();
    if (!all.length) return;
    const key = todayKey();
    const item = all[hashStr('fizlab-' + key) % all.length];
    const streakLine = el('p', { class: 'num', text: `${t('challenge.streak')}: ${progress.challenge.streak || 0} ${t('progress.days')}` });
    main.appendChild(streakLine);
    if (progress.challenge.solved[key]) {
      main.appendChild(el('div', { class: 'quiz-card quiz' }, [el('h3', { text: t('challenge.done') }), el('p', { class: 'quiz-type', text: t('challenge.from') + ': ' + tr(item.topic.title) }), el('p', { text: tr(item.q.q) }), el('div', { class: 'feedback ok' }, [el('span', { text: tr(item.q.explain) })]),
        el('div', { class: 'quiz-actions' }, [el('a', { class: 'btn', href: '#' + item.topic.id, text: tr(item.topic.title) + ' →' }), el('a', { class: 'btn primary', href: '#mix', text: t('mix.title') })])]));
      return;
    }
    runQuiz(main, [item], { showTopic: true, backHref: '#' + item.topic.id, backLabel: tr(item.topic.title),
      onFinish: (score) => {
        if (score === 1) {
          const y = new Date(); y.setDate(y.getDate() - 1);
          const yKey = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
          progress.challenge.streak = (progress.challenge.last === yKey) ? (progress.challenge.streak || 0) + 1 : 1;
          progress.challenge.last = key; progress.challenge.solved[key] = true;
          saveProgress(); checkBadges();
          streakLine.textContent = `${t('challenge.streak')}: ${progress.challenge.streak} ${t('progress.days')}`;
        }
      } });
  }

  // ---------- language ----------
  function setLang(l) {
    if (l === lang) return;
    lang = l; store.set('lang', l); progress.langs[l] = true; saveProgress();
    document.querySelectorAll('.lang-switch button').forEach(b => b.classList.toggle('is-active', b.dataset.lang === l));
    checkBadges();
    render();
  }
  document.querySelectorAll('.lang-switch button').forEach(b => {
    b.classList.toggle('is-active', b.dataset.lang === lang);
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
  $('#themeBtn').addEventListener('click', toggleTheme);
  $('#themeBtn').title = t('common.theme');

  // ---------- boot ----------
  if (!window.FizExt) {
    window.FizExt = { init() {}, renderPracticeTab() {}, renderPracticePage() {}, renderSummary() { return null; }, renderMisconceptions() { return null; }, renderWorkedExample() { return null; }, renderScientists() {}, renderConverter() {}, problemCount: () => 0, solvedTotal: () => 0, solvedIn: () => 0, hardSolved: () => false, templatesFor: () => [] };
  }
  FizExt.init({ el, t, tr, lang: () => lang, progress: () => progress, saveProgress, checkBadges, toast, go, shuffle, iconBox, onLeave: fn => current.cleanup.push(fn) });
  applyTheme();
  render();
  checkBadges();
})();
