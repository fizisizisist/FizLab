/* FizLab — extension pages: hubs, home-experiment library, predict-first cards, practice exams, concept check,
   quick drills and the teacher corner. Loaded after practice.js; app.js calls FizMore.init(api). */
window.FizMore = (function () {
  'use strict';
  const Content = window.Content, Sims = window.Sims;
  let A = null, P = null; // A: app api (el, t, tr, lang, progress, saveProgress, checkBadges, toast, go, shuffle, iconBox, onLeave); P: FizExt.api

  function rec(key, def) { const pr = A.progress(); return pr[key] || (pr[key] = def); }
  function sshuffle(arr, rand) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  const topicIdsWith = pred => Content.topics.filter(pred).map(tp => tp.id);
  const fmtTime = s => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };

  // =====================================================================================
  // Hubs
  // =====================================================================================
  function hubCards(hub) {
    const t = A.t, tr = A.tr;
    const q = k => ({ title: t('quick.' + k + '.t'), desc: t('quick.' + k + '.d'), href: '#' + k });
    const h = (k, href, onclick) => ({ title: t('hub.cards.' + k + '.t'), desc: t('hub.cards.' + k + '.d'), href, onclick });
    const simCard = (topicId, simId) => (Sims.byId[simId] && Content.byId[topicId]) ? { title: tr(Sims.byId[simId].title), desc: tr(Sims.byId[simId].summary), href: '#' + topicId + '-sim-' + simId } : null;
    const kind = k => () => { if (window.FizExt && FizExt.setPracticeKind) FizExt.setPracticeKind(k); };
    if (hub === 'train') return [
      Object.assign(q('practice'), { onclick: kind('all') }),
      h('graphs', '#practice', kind('graph')), h('stories', '#practice', kind('story')),
      q('concepts'), h('drills', '#drills')
    ];
    if (hub === 'tests') return [h('exam', '#exam'), h('check', '#check'), q('mix'), q('challenge')];
    if (hub === 'lab') return [
      h('experiments', '#experiments'),
      Content.byId.homelab ? h('homelab', '#homelab') : null,
      simCard('homelab', 'stopwatch'), simCard('homelab', 'datalab'), simCard('homelab', 'tonegen'), simCard('homelab', 'sensors'),
      simCard('science', 'inquiry'), simCard('science', 'measure')
    ].filter(Boolean);
    if (hub === 'reference') return [q('glossary'), q('formulas'), q('flashcards'), q('scientists'), q('converter')];
    return [];
  }
  function cardGrid(cards) {
    const el = A.el;
    const g = el('div', { class: 'quick-grid' });
    cards.forEach(c => g.appendChild(el('a', { class: 'quick-card', href: c.href, onclick: c.onclick || null }, [el('h3', { text: c.title }), el('p', { text: c.desc })])));
    return g;
  }
  function renderHub(main, hub) {
    const el = A.el, t = A.t;
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('hub.' + hub + '.title') }), el('p', { class: 'lede', text: t('hub.' + hub + '.lede') })]));
    main.appendChild(cardGrid(hubCards(hub)));
  }
  function renderHomeHubs(main) {
    const el = A.el, t = A.t;
    ['train', 'tests', 'lab', 'reference'].forEach(hub => {
      main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('hub.' + hub + '.title') }), el('a', { class: 'chip', href: '#' + hub, text: t('hub.all') + ' →' })]));
      main.appendChild(cardGrid(hubCards(hub).slice(0, 4)));
    });
    main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('hub.more') })]));
    main.appendChild(cardGrid([
      { title: t('hub.teachers.title'), desc: t('hub.teachers.lede'), href: '#teachers' },
      { title: t('quick.progress.t'), desc: t('quick.progress.d'), href: '#progress' }
    ]));
  }

  // =====================================================================================
  // Home experiments library (predict -> do -> observe -> explain)
  // =====================================================================================
  const expState = { topic: 'all', type: 'all', level: 'all' };
  const expDoneCount = () => Object.values(A.progress().experiments || {}).filter(x => x && x.done).length;
  const predictCount = () => Object.keys(A.progress().predict || {}).length;

  function experimentCard(e) {
    const el = A.el, t = A.t, tr = A.tr, lang = A.lang();
    const store = rec('experiments', {});
    const r = () => store[e.id] || (store[e.id] = {});
    const topic = Content.byId[e.topic];
    const card = el('article', { class: 'exp-card' + ((store[e.id] || {}).done ? ' is-done' : '') });
    const doneMark = el('span', { class: 'exp-done', text: (store[e.id] || {}).done ? '✓' : '' });
    const head = el('button', { type: 'button', class: 'exp-head', 'aria-expanded': 'false' }, [
      el('span', { class: 'exp-title' }, [el('b', { text: tr(e.title) }), el('span', { class: 'exp-q', text: tr(e.question) })]),
      el('span', { class: 'exp-meta' }, [
        el('span', { class: 'grade-pill', text: t('exp.type.' + e.type) }),
        topic ? el('span', { class: 'quiz-type', text: tr(topic.title) }) : null,
        el('span', { class: 'level-stars', text: P.stars(e.level) }),
        el('span', { class: 'quiz-type num', text: e.minutes + ' min' }),
        e.outcome ? el('span', { class: 'quiz-type num', text: e.outcome }) : null,
        doneMark
      ])
    ]);
    const body = el('div', { class: 'exp-body' }); body.hidden = true;
    let built = false;
    head.addEventListener('click', () => { body.hidden = !body.hidden; head.setAttribute('aria-expanded', String(!body.hidden)); if (!built) { built = true; build(); } });

    function build() {
      if (e.safety) body.appendChild(el('div', { class: 'safety' }, [el('b', { text: t('home.safety') + ': ' }), tr(e.safety)]));
      body.appendChild(el('div', { class: 'exp-cols' }, [
        el('div', { class: 'panel' }, [el('h4', { text: t('home.materials') }), el('ul', null, (e.materials[lang] || e.materials.en).map(m => el('li', { text: m })))]),
        el('div', { class: 'panel' }, [el('h4', { text: t('home.steps') }), el('ol', null, (e.steps[lang] || e.steps.en).map(s => el('li', { text: s })))])
      ]));
      if (e.measure) body.appendChild(el('div', { class: 'panel' }, [el('h4', { text: t('exp.measure') }), el('p', { text: tr(e.measure) })]));
      const links = el('div', { class: 'hero-actions' });
      if (e.tool && Sims.byId[e.tool] && Content.byId.homelab) links.appendChild(el('a', { class: 'btn sm', href: '#homelab-sim-' + e.tool, text: t('exp.tool') + ': ' + tr(Sims.byId[e.tool].title) }));
      if (e.sim && Sims.byId[e.sim]) { const host = Content.topics.find(tp => tp.sims.includes(e.sim)); if (host) links.appendChild(el('a', { class: 'btn sm', href: '#' + host.id + '-sim-' + e.sim, text: t('exp.sim') + ': ' + tr(Sims.byId[e.sim].title) })); }
      if (links.children.length) body.appendChild(links);

      // predict
      const poe = el('div', { class: 'poe-card' });
      const reveal = el('div', { class: 'exp-reveal' });
      body.appendChild(poe); body.appendChild(reveal);
      function drawPredict() {
        poe.innerHTML = ''; reveal.innerHTML = '';
        const chosen = r().predicted;
        poe.appendChild(el('div', { class: 'quiz-type', text: t('poe.title') }));
        poe.appendChild(el('p', { class: 'poe-q', text: tr(e.predict.q) }));
        const opts = el('div', { class: 'options' });
        e.predict.options.forEach((o, i) => opts.appendChild(el('button', { type: 'button', class: 'option' + (chosen === i ? ' is-picked' : ''), onclick: () => { if (r().revealed) return; r().predicted = i; A.saveProgress(); drawPredict(); } }, [el('span', { class: 'key', text: String.fromCharCode(65 + i) }), el('span', { text: tr(o) })])));
        poe.appendChild(opts);
        if (chosen === undefined) { poe.appendChild(el('p', { class: 'sk-note', text: t('exp.predictHint') })); return; }
        if (!r().revealed) {
          poe.appendChild(el('div', { class: 'quiz-actions', style: 'justify-content:flex-start' }, [el('button', { type: 'button', class: 'btn primary', text: t('exp.reveal'), onclick: () => { r().revealed = true; A.saveProgress(); A.checkBadges(); drawPredict(); } })]));
          return;
        }
        opts.querySelectorAll('.option').forEach((b, i) => { b.disabled = true; if (i === e.predict.answer) b.classList.add('correct'); else if (i === chosen) b.classList.add('wrong'); });
        const ok = chosen === e.predict.answer;
        reveal.appendChild(el('div', { class: 'feedback ' + (ok ? 'ok' : 'no') }, [el('b', { text: ok ? t('exp.matched') : t('exp.surprised') }), el('span', { text: tr(e.observe) })]));
        reveal.appendChild(el('div', { class: 'callout' }, [el('h4', { text: t('home.why') }), el('p', { text: tr(e.explain) })]));
      }
      drawPredict();

      // notes + done
      const notes = el('textarea', { class: 'exp-notes', id: 'exp-notes-' + e.id, rows: '3', placeholder: t('exp.notesPh'), maxlength: '2000' });
      notes.value = r().notes || '';
      let saveTimer = 0;
      notes.addEventListener('input', () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => { r().notes = notes.value; A.saveProgress(); }, 500); });
      const cb = el('input', { type: 'checkbox', id: 'exp-done-' + e.id }); cb.checked = !!r().done;
      cb.addEventListener('change', () => { if (cb.checked) r().done = Date.now(); else delete r().done; A.saveProgress(); A.checkBadges(); card.classList.toggle('is-done', cb.checked); doneMark.textContent = cb.checked ? '✓' : ''; });
      body.appendChild(el('div', { class: 'panel' }, [el('h4', null, [el('label', { for: notes.id, text: t('exp.notes') })]), notes, el('div', { class: 'exp-donerow' }, [cb, el('label', { for: cb.id, text: t('exp.done') })])]));
    }
    card.appendChild(head); card.appendChild(body);
    return card;
  }

  function renderExperiments(main) {
    const el = A.el, t = A.t, tr = A.tr;
    const all = Content.experiments;
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('exp.title') }), el('p', { class: 'lede', text: t('exp.lede') })]));
    if (!all.length) { main.appendChild(el('p', { class: 'empty', text: t('practice.none') })); return; }
    main.appendChild(el('div', { class: 'safety', style: 'margin-bottom:14px' }, [el('b', { text: t('home.safety') + ': ' }), t('exp.rules')]));
    const filters = el('div', { class: 'panel', style: 'margin-bottom:14px; display:grid; gap:10px' });
    const list = el('div', { class: 'exp-list' });
    const count = el('p', { class: 'quiz-type num' });
    function chipRow(label, values, key, labelFn) {
      const row = el('div', { class: 'chips' });
      values.forEach(v => row.appendChild(el('button', { type: 'button', class: 'chip' + (expState[key] === v ? ' is-active' : ''), text: labelFn(v), onclick: () => { expState[key] = v; draw(); } })));
      return [el('h4', { text: label }), row];
    }
    function draw() {
      filters.innerHTML = '';
      const topics = ['all'].concat(Content.topics.map(tp => tp.id).filter(id => all.some(e => e.topic === id)));
      chipRow(t('practice.topics'), topics, 'topic', v => v === 'all' ? t('practice.all') : tr(Content.byId[v].title)).forEach(x => filters.appendChild(x));
      chipRow(t('exp.kind'), ['all', 'observe', 'test', 'apply', 'project'], 'type', v => v === 'all' ? t('practice.all') : t('exp.type.' + v)).forEach(x => filters.appendChild(x));
      chipRow(t('practice.level'), ['all', '1', '2', '3'], 'level', v => v === 'all' ? t('practice.all') : P.stars(+v)).forEach(x => filters.appendChild(x));
      const rows = all.filter(e => (expState.topic === 'all' || e.topic === expState.topic) && (expState.type === 'all' || e.type === expState.type) && (expState.level === 'all' || String(e.level) === expState.level));
      count.textContent = `${rows.length} ${t('exp.count')} · ${t('exp.doneCount')}: ${expDoneCount()} / ${all.length}`;
      list.innerHTML = '';
      if (!rows.length) list.appendChild(el('p', { class: 'empty', text: t('practice.none') }));
      rows.forEach(e => list.appendChild(experimentCard(e)));
    }
    draw();
    main.appendChild(filters); main.appendChild(count); main.appendChild(list);
  }
  function renderTopicExperiments(panel, topic) {
    const el = A.el, t = A.t;
    const rows = Content.experiments.filter(e => e.topic === topic.id);
    if (!rows.length) return;
    panel.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('exp.moreForTopic') }), el('a', { class: 'chip', href: '#experiments', text: t('exp.title') + ' →' })]));
    const list = el('div', { class: 'exp-list' });
    rows.forEach(e => list.appendChild(experimentCard(e)));
    panel.appendChild(list);
  }

  // =====================================================================================
  // Predict-first card for a simulation
  // =====================================================================================
  function renderPredict(simId) {
    const list = Content.predictions[simId];
    if (!list || !list.length) return null;
    const el = A.el, t = A.t, tr = A.tr;
    const store = rec('predict', {});
    let idx = list.findIndex((_, i) => store[simId + ':' + i] === undefined); if (idx < 0) idx = 0;
    let shown = false;
    const box = el('div', { class: 'poe-card poe-sim' });
    function draw() {
      const x = list[idx], key = simId + ':' + idx, chosen = store[key];
      box.innerHTML = '';
      box.appendChild(el('div', { class: 'practice-head' }, [el('span', { class: 'quiz-type', text: t('poe.title') }), list.length > 1 ? el('span', { class: 'quiz-type num', text: `${idx + 1} / ${list.length}` }) : null]));
      box.appendChild(el('p', { class: 'poe-q', text: tr(x.q) }));
      const opts = el('div', { class: 'options poe-options' });
      x.options.forEach((o, i) => opts.appendChild(el('button', { type: 'button', class: 'option' + (chosen === i ? ' is-picked' : ''), onclick: () => { if (shown) return; store[key] = i; A.saveProgress(); A.checkBadges(); draw(); } }, [el('span', { class: 'key', text: String.fromCharCode(65 + i) }), el('span', { text: tr(o) })])));
      box.appendChild(opts);
      if (chosen === undefined) return;
      box.appendChild(el('p', { class: 'poe-try' }, [el('b', { text: t('poe.try') + ' ' }), tr(x.try)]));
      const actions = el('div', { class: 'quiz-actions', style: 'justify-content:flex-start' });
      if (!shown) actions.appendChild(el('button', { type: 'button', class: 'btn sm primary', text: t('poe.show'), onclick: () => { shown = true; draw(); } }));
      else {
        opts.querySelectorAll('.option').forEach((b, i) => { b.disabled = true; if (i === x.answer) b.classList.add('correct'); else if (i === chosen) b.classList.add('wrong'); });
        box.appendChild(el('div', { class: 'feedback ' + (chosen === x.answer ? 'ok' : 'no') }, [el('b', { text: chosen === x.answer ? t('poe.right') : t('poe.wrong') }), el('span', { text: tr(x.explain) })]));
      }
      if (list.length > 1) actions.appendChild(el('button', { type: 'button', class: 'btn sm', text: t('poe.next'), onclick: () => { idx = (idx + 1) % list.length; shown = false; draw(); } }));
      box.appendChild(actions);
    }
    draw();
    return box;
  }

  // =====================================================================================
  // Paper engine (used by the practice exam and the concept check)
  // =====================================================================================
  function quizTol(q) { return q.tolerance !== undefined ? q.tolerance : Math.max(0.01, Math.abs(q.answer) * 0.01); }
  // items: {kind:'quiz', q, topic} | {kind:'concept', c, topic} | {kind:'problem', inst, topic}; opts: {minutes, reveal:'full'|'ask', onSubmit(score,total,pct) -> node|null, again:{label, fn}}
  function runPaper(main, items, opts, rand) {
    const el = A.el, t = A.t, tr = A.tr, lang = A.lang();
    const answers = new Array(items.length).fill(null);
    const root = el('div', { class: 'paper' });
    const summary = el('div', { class: 'paper-summary' });
    const timerEl = el('span', { class: 'paper-timer num' });
    let submitted = false, timerId = 0, armed = false;
    root.appendChild(summary);
    const info = el('div', { class: 'quiz-top' }, [el('span', { class: 'quiz-type num', text: `${items.length} ${t('common.questions')}` }), opts.code ? el('span', { class: 'quiz-type num', text: t('worksheet.code') + ': ' + opts.code }) : null, timerEl]);
    root.appendChild(info);
    const fbs = [];
    items.forEach((it, i) => {
      const block = el('section', { class: 'paper-q' });
      const topic = it.topic;
      block.appendChild(el('div', { class: 'paper-num' }, [el('b', { class: 'num', text: (i + 1) + '.' }), topic ? el('span', { class: 'quiz-type', text: tr(topic.title) }) : null]));
      const fb = el('div', { class: 'paper-fb' }); fb.hidden = true; fbs.push(fb);
      const mkOptions = (labels, onPick) => {
        const opts2 = el('div', { class: 'options' });
        const btns = labels.map((lab, pos) => { const b = el('button', { type: 'button', class: 'option' }, [el('span', { class: 'key', text: String.fromCharCode(65 + pos) }), el('span', { text: lab })]); b.addEventListener('click', () => { if (submitted) return; btns.forEach(x => x.classList.remove('is-picked')); b.classList.add('is-picked'); onPick(pos); }); opts2.appendChild(b); return b; });
        it._btns = btns; return opts2;
      };
      const mkInput = unit => {
        const input = el('input', { type: 'text', inputmode: 'decimal', id: 'paper-a-' + i, placeholder: t('practice.answer'), autocomplete: 'off' });
        input.addEventListener('input', () => { answers[i] = input.value; });
        it._input = input;
        return el('div', { class: 'num-answer' }, [input, unit ? el('span', { class: 'unit', text: unit }) : null]);
      };
      if (it.kind === 'problem') {
        block.appendChild(el('p', { class: 'paper-text', text: P.textOf(it.inst, lang) }));
        const g = P.graphOf(it.inst, lang); if (g) block.appendChild(g);
        block.appendChild(mkInput(P.unitOf(it.inst.tpl, lang)));
      } else {
        const src = it.kind === 'quiz' ? it.q : it.c;
        block.appendChild(el('p', { class: 'paper-text', text: tr(src.q) }));
        if (src.type === 'mc') { it._perm = sshuffle(src.options.map((o, k) => k), rand); block.appendChild(mkOptions(it._perm.map(k => tr(src.options[k])), pos => { answers[i] = it._perm[pos]; })); }
        else if (src.type === 'tf') block.appendChild(mkOptions([t('quiz.true'), t('quiz.false')], pos => { answers[i] = pos === 0; }));
        else block.appendChild(mkInput(src.unit || ''));
      }
      block.appendChild(fb);
      root.appendChild(block);
    });
    const warn = el('p', { class: 'sk-note' });
    const submitBtn = el('button', { type: 'button', class: 'btn primary', text: t('exam.submit') });
    root.appendChild(el('div', { class: 'quiz-actions paper-actions' }, [warn, submitBtn]));
    main.appendChild(root);

    function grade() {
      if (submitted) return; submitted = true; clearInterval(timerId); timerEl.textContent = '';
      let score = 0;
      items.forEach((it, i) => {
        const fb = fbs[i]; let ok = false, correctText = '', explain = null;
        if (it.kind === 'problem') {
          const v = answers[i] === null ? null : P.parseNum(answers[i]);
          ok = v !== null && P.isCorrect(it.inst, v);
          correctText = P.fmtAnswer(it.inst, lang);
          const ol = el('ol'); P.stepsOf(it.inst, lang).forEach(s => ol.appendChild(el('li', { text: s })));
          explain = el('div', { class: 'practice-steps' }, [el('b', { text: t('practice.steps') }), ol]);
        } else {
          const src = it.kind === 'quiz' ? it.q : it.c;
          if (src.type === 'mc') { ok = answers[i] === src.answer; correctText = tr(src.options[src.answer]); it._btns.forEach((b, pos) => { if (it._perm[pos] === src.answer) b.classList.add('correct'); else if (it._perm[pos] === answers[i]) b.classList.add('wrong'); }); }
          else if (src.type === 'tf') { ok = answers[i] === src.answer; correctText = t('quiz.' + src.answer); it._btns.forEach((b, pos) => { if ((pos === 0) === src.answer) b.classList.add('correct'); else if (answers[i] !== null && (pos === 0) === answers[i]) b.classList.add('wrong'); }); }
          else { const v = answers[i] === null ? null : P.parseNum(answers[i]); ok = v !== null && (src.min !== undefined ? (v >= src.min && v <= src.max) : Math.abs(v - src.answer) <= quizTol(src)); correctText = P.makeF(lang)(src.answer) + (src.unit ? ' ' + src.unit : ''); }
          explain = el('span', { text: tr(src.explain) });
        }
        if (it._btns) it._btns.forEach(b => { b.disabled = true; });
        if (it._input) it._input.disabled = true;
        if (ok) score++;
        fb.appendChild(el('div', { class: 'feedback ' + (ok ? 'ok' : 'no') }, [el('b', { text: ok ? t('quiz.correct') : (answers[i] === null || answers[i] === '' ? t('exam.blank') : t('quiz.wrong')) + ' ' + t('quiz.correctAnswer') + ' ' + correctText }), explain]));
        fb.hidden = opts.reveal === 'ask';
      });
      const pct = Math.round(score / items.length * 100);
      submitBtn.hidden = true; warn.textContent = '';
      summary.innerHTML = '';
      const card = el('div', { class: 'quiz-card result paper-result' }, [el('h3', { text: `${t('quiz.yourScore')}: ${score} / ${items.length} (${pct} %)` })]);
      const extra = opts.onSubmit ? opts.onSubmit(score, items.length, pct) : null;
      if (extra) card.appendChild(extra);
      const actions = el('div', { class: 'quiz-actions' });
      if (opts.reveal === 'ask') { const b = el('button', { type: 'button', class: 'btn', text: t('check.showAnswers'), onclick: () => { fbs.forEach(f => { f.hidden = false; }); b.hidden = true; } }); actions.appendChild(b); }
      if (opts.again) actions.appendChild(el('button', { type: 'button', class: 'btn primary', text: opts.again.label, onclick: opts.again.fn }));
      card.appendChild(actions);
      summary.appendChild(card);
      window.scrollTo({ top: Math.max(0, root.getBoundingClientRect().top + window.scrollY - 90), behavior: 'smooth' });
    }
    submitBtn.addEventListener('click', () => {
      const blank = answers.filter(a => a === null || a === '').length;
      if (blank && !armed) { armed = true; warn.textContent = `${blank} ${t('exam.unanswered')}`; submitBtn.textContent = t('exam.submitAnyway'); return; }
      grade();
    });
    if (opts.minutes) {
      const end = performance.now() + opts.minutes * 60000;
      const tick = () => { const left = (end - performance.now()) / 1000; timerEl.textContent = t('exam.timeLeft') + ' ' + fmtTime(left); if (left <= 0) grade(); };
      tick(); timerId = setInterval(tick, 1000);
      A.onLeave(() => clearInterval(timerId));
    }
    return { grade };
  }

  // =====================================================================================
  // Practice exam
  // =====================================================================================
  const examState = { scope: 'all', len: 16, timed: false, code: '' };
  function gradeFor(pct) { return pct >= 90 ? 5 : pct >= 77 ? 4 : pct >= 64 ? 3 : pct >= 50 ? 2 : 1; }
  function examTopics(scope) {
    if (scope === 'all') return Content.topics.filter(tp => tp.gradeLevel === 7 || tp.gradeLevel === 8);
    if (scope === 'g7') return Content.topics.filter(tp => tp.gradeLevel === 7);
    if (scope === 'g8') return Content.topics.filter(tp => tp.gradeLevel === 8);
    return Content.byId[scope] ? [Content.byId[scope]] : [];
  }
  function buildExam(scope, len, code) {
    const rand = P.mulberry32(P.hashStr('exam-' + code + '-' + scope + '-' + len));
    const topics = examTopics(scope), ids = topics.map(tp => tp.id);
    const quizPool = sshuffle(topics.flatMap(tp => tp.quiz.map(q => ({ kind: 'quiz', q, topic: tp }))), rand);
    const tplPool = sshuffle(topics.flatMap(tp => P.templatesFor(tp.id)).filter(x => !P.isStory(x)), rand);
    const conPool = sshuffle(Content.concepts.filter(c => c.type === 'mc' && ids.includes(c.topic)), rand);
    let nProb = Math.min(tplPool.length, Math.round(len * 0.35)), nCon = Math.min(conPool.length, Math.round(len * 0.15));
    const nQuiz = Math.min(quizPool.length, len - nProb - nCon);
    const items = quizPool.slice(0, nQuiz)
      .concat(conPool.slice(0, nCon).map(c => ({ kind: 'concept', c, topic: Content.byId[c.topic] })))
      .concat(tplPool.slice(0, nProb).sort((a, b) => a.level - b.level).map(tpl => ({ kind: 'problem', inst: P.instantiate(tpl, Math.floor(rand() * 4294967296)), topic: Content.byId[tpl.topic] })));
    return { items: items.filter(it => it.kind !== 'problem' || it.inst.p), rand };
  }
  function renderExam(main) {
    const el = A.el, t = A.t, tr = A.tr;
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('exam.title') }), el('p', { class: 'lede', text: t('exam.lede') })]));
    const ex = rec('exams', { taken: 0, best: 0 });
    const setup = el('div', { class: 'panel exam-setup' });
    const scopeSel = el('select', { class: 'sk-select', id: 'exam-scope' });
    [['all', t('exam.scopeAll')], ['g7', t('filter.g7')], ['g8', t('filter.g8')]].concat(Content.topics.filter(tp => tp.quiz.length >= 8).map(tp => [tp.id, tr(tp.title)])).forEach(([v, lab]) => scopeSel.appendChild(el('option', { value: v, text: lab })));
    scopeSel.value = examState.scope;
    const lenSel = el('select', { class: 'sk-select', id: 'exam-len' });
    [[10, 'exam.short'], [16, 'exam.standard'], [24, 'exam.long']].forEach(([n, key]) => lenSel.appendChild(el('option', { value: String(n), text: `${t(key)} (${n})` })));
    lenSel.value = String(examState.len);
    const timed = el('input', { type: 'checkbox', id: 'exam-timed' }); timed.checked = examState.timed;
    const codeIn = el('input', { class: 'search', style: 'flex:0 1 150px', id: 'exam-code', type: 'text', inputmode: 'numeric', placeholder: t('worksheet.code'), value: examState.code });
    const startBtn = el('button', { type: 'button', class: 'btn primary', text: t('exam.start') });
    setup.appendChild(el('div', { class: 'toolbar' }, [el('label', { class: 'sk-label', for: 'exam-scope', text: t('exam.scope') }), scopeSel, el('label', { class: 'sk-label', for: 'exam-len', text: t('exam.length') }), lenSel]));
    setup.appendChild(el('div', { class: 'toolbar' }, [timed, el('label', { for: 'exam-timed', text: t('exam.timed') }), el('label', { class: 'sk-label', for: 'exam-code', text: t('worksheet.code') }), codeIn, startBtn]));
    setup.appendChild(el('p', { class: 'sk-note', text: t('exam.note') }));
    if (ex.taken) setup.appendChild(el('p', { class: 'quiz-type num', text: `${t('exam.taken')}: ${ex.taken} · ${t('quiz.best')}: ${ex.best} % (${t('exam.grade')} ${gradeFor(ex.best)})` }));
    main.appendChild(setup);
    const area = el('div'); main.appendChild(area);
    startBtn.addEventListener('click', () => {
      examState.scope = scopeSel.value; examState.len = parseInt(lenSel.value, 10); examState.timed = timed.checked;
      let code = parseInt(codeIn.value, 10); if (!Number.isFinite(code)) { code = 1000 + Math.floor(Math.random() * 9000); }
      examState.code = String(code); codeIn.value = String(code);
      const built = buildExam(examState.scope, examState.len, code);
      area.innerHTML = '';
      if (built.items.length < 4) { area.appendChild(el('p', { class: 'empty', text: t('practice.none') })); return; }
      setup.hidden = true;
      runPaper(area, built.items, {
        code, reveal: 'full', minutes: examState.timed ? Math.ceil(built.items.length * 1.5) : 0,
        again: { label: t('exam.newExam'), fn: () => { examState.code = ''; A.go('exam'); } },
        onSubmit: (score, total, pct) => {
          const g = gradeFor(pct);
          ex.taken = (ex.taken || 0) + 1; ex.best = Math.max(ex.best || 0, pct); ex.last = { pct, grade: g, date: Date.now(), scope: examState.scope };
          A.saveProgress(); A.checkBadges();
          return el('div', { class: 'exam-grade' }, [el('div', { class: 'grade-big num grade-' + g, text: String(g) }), el('p', { text: `${t('exam.grade')}: ${g} (${t('exam.grades.' + g)})` }), el('p', { class: 'sk-note', text: t('exam.scale') })]);
        }
      }, built.rand);
    });
  }

  // =====================================================================================
  // Concept check (same test before and after; normalised gain)
  // =====================================================================================
  function checkItems() {
    const mc = Content.concepts.filter(c => c.type === 'mc' && Content.byId[c.topic]).slice().sort((a, b) => a.id < b.id ? -1 : 1);
    const out = [];
    for (let round = 0; round < 3 && out.length < 20; round++) {
      Content.topics.forEach(tp => { if (out.length >= 20) return; const mine = mc.filter(c => c.topic === tp.id); if (mine[round]) out.push(mine[round]); });
    }
    return out;
  }
  function renderCheck(main) {
    const el = A.el, t = A.t;
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('check.title') }), el('p', { class: 'lede', text: t('check.lede') })]));
    const ck = rec('check', { attempts: [] });
    const items = checkItems();
    if (items.length < 6) { main.appendChild(el('p', { class: 'empty', text: t('practice.none') })); return; }
    const intro = el('div', { class: 'panel', style: 'margin-bottom:14px; display:grid; gap:8px' });
    function gainNode() {
      if (ck.attempts.length < 1) return el('p', { text: t('check.first') });
      const pre = ck.attempts[0].pct, post = ck.attempts[ck.attempts.length - 1].pct;
      const box = el('div', { class: 'check-gain' }, [el('p', { class: 'num', text: `${t('check.before')}: ${pre} %` + (ck.attempts.length > 1 ? `   →   ${t('check.after')}: ${post} %` : '') })]);
      if (ck.attempts.length > 1) {
        if (pre >= 100) box.appendChild(el('p', { text: t('check.maxed') }));
        else { const g = (post - pre) / (100 - pre); box.appendChild(el('p', null, [el('b', { class: 'num', text: `${t('check.gain')} g = ${P.makeF(A.lang())(g, 2)}` }), ' ', t(g >= 0.7 ? 'check.high' : g >= 0.3 ? 'check.medium' : g >= 0 ? 'check.low' : 'check.negative')])); }
      } else box.appendChild(el('p', { text: t('check.comeBack') }));
      return box;
    }
    intro.appendChild(el('p', { text: t('check.how') }));
    intro.appendChild(gainNode());
    const startBtn = el('button', { type: 'button', class: 'btn primary', text: ck.attempts.length ? t('check.startAfter') : t('check.startBefore') });
    const resetBtn = ck.attempts.length ? el('button', { type: 'button', class: 'btn', text: t('check.reset'), onclick: () => { ck.attempts = []; A.saveProgress(); A.go('check'); } }) : null;
    intro.appendChild(el('div', { class: 'hero-actions' }, [startBtn, resetBtn]));
    main.appendChild(intro);
    const area = el('div'); main.appendChild(area);
    startBtn.addEventListener('click', () => {
      intro.hidden = true; area.innerHTML = '';
      const rand = P.mulberry32(Math.floor(Math.random() * 4294967296));
      runPaper(area, items.map(c => ({ kind: 'concept', c, topic: Content.byId[c.topic] })), {
        reveal: 'ask', again: { label: t('common.back'), fn: () => A.go('check') },
        onSubmit: (score, total, pct) => { ck.attempts.push({ d: Date.now(), pct }); if (ck.attempts.length > 12) ck.attempts.splice(1, 1); A.saveProgress(); A.checkBadges(); const box = gainNode(); box.appendChild(el('p', { class: 'sk-note', text: t('check.dontPeek') })); return box; }
      }, rand);
    });
  }

  // =====================================================================================
  // Quick drills: unit conversions, rearranging formulas, quantities and units
  // =====================================================================================
  const UNIT_TASKS = [
    { from: 'km/h', to: 'm/s', conv: v => v / 3.6, values: [18, 36, 54, 72, 90, 108, 126, 144] },
    { from: 'm/s', to: 'km/h', conv: v => v * 3.6, values: [5, 10, 15, 20, 25, 30, 2.5] },
    { from: 'cm', to: 'm', conv: v => v / 100, values: [250, 75, 1200, 8, 40] },
    { from: 'm', to: 'cm', conv: v => v * 100, values: [1.5, 0.4, 12, 0.07] },
    { from: 'mm', to: 'cm', conv: v => v / 10, values: [35, 120, 8, 250] },
    { from: 'km', to: 'm', conv: v => v * 1000, values: [2.5, 0.8, 12, 0.05] },
    { from: 'm', to: 'km', conv: v => v / 1000, values: [1500, 250, 42000, 800] },
    { from: 'g', to: 'kg', conv: v => v / 1000, values: [250, 1500, 50, 3200] },
    { from: 'kg', to: 'g', conv: v => v * 1000, values: [0.5, 2.4, 0.075, 12] },
    { from: 't', to: 'kg', conv: v => v * 1000, values: [2, 0.5, 3.5, 12] },
    { from: 'mL', to: 'L', conv: v => v / 1000, values: [250, 1500, 75, 330] },
    { from: 'L', to: 'mL', conv: v => v * 1000, values: [0.5, 2, 1.5, 0.33] },
    { from: 'cm³', to: 'mL', conv: v => v, values: [50, 250, 15] },
    { from: 'dm³', to: 'L', conv: v => v, values: [3, 0.5, 12] },
    { from: 'm³', to: 'L', conv: v => v * 1000, values: [1, 0.5, 2.5, 0.02] },
    { from: 'min', to: 's', conv: v => v * 60, values: [2, 5, 1.5, 45] },
    { from: 'h', to: 'min', conv: v => v * 60, values: [2, 0.5, 1.5, 0.25] },
    { from: 'h', to: 's', conv: v => v * 3600, values: [1, 0.5, 2] },
    { from: 'kPa', to: 'Pa', conv: v => v * 1000, values: [2, 101, 0.5] },
    { from: 'Pa', to: 'kPa', conv: v => v / 1000, values: [5000, 250, 101300] },
    { from: 'bar', to: 'kPa', conv: v => v * 100, values: [1, 2.5, 0.5] },
    { from: 'kJ', to: 'J', conv: v => v * 1000, values: [2, 0.5, 4.2] },
    { from: 'J', to: 'kJ', conv: v => v / 1000, values: [1500, 250, 42000] },
    { from: 'kW', to: 'W', conv: v => v * 1000, values: [2, 0.5, 1.2] },
    { from: 'kWh', to: 'kJ', conv: v => v * 3600, values: [1, 0.5, 2] },
    { from: 'g/cm³', to: 'kg/m³', conv: v => v * 1000, values: [1, 2.7, 0.92, 7.8, 13.6] },
    { from: 'kg/m³', to: 'g/cm³', conv: v => v / 1000, values: [1000, 2700, 920, 500, 19300] },
    { from: 'cm²', to: 'm²', conv: v => v / 10000, values: [10000, 500, 25] },
    { from: '°C', to: 'K', conv: v => v + 273, values: [0, 20, 100, -73, 37] }
  ];
  const FORMULAS = [ // [subject, b, c, type] : product a = b · c ; ratio a = b / c
    ['F', 'm', 'a', 'product'], ['G', 'm', 'g', 'product'], ['W', 'F', 's', 'product'], ['s', 'v', 't', 'product'], ['U', 'I', 'R', 'product'], ['P', 'U', 'I', 'product'],
    ['E', 'P', 't', 'product'], ['m', 'ρ', 'V', 'product'], ['F', 'p', 'A', 'product'], ['v', 'λ', 'f', 'product'], ['M', 'F', 'd', 'product'], ['Q', 'I', 't', 'product'],
    ['v', 's', 't', 'ratio'], ['ρ', 'm', 'V', 'ratio'], ['p', 'F', 'A', 'ratio'], ['P', 'W', 't', 'ratio'], ['I', 'U', 'R', 'ratio'], ['a', 'F', 'm', 'ratio'], ['R', 'U', 'I', 'ratio'], ['k', 'F', 'x', 'ratio']
  ];
  const QUANTITIES = [
    { q: { en: 'length', hr: 'duljina' }, sym: 'l', unit: 'm', inst: { en: 'ruler or tape measure', hr: 'ravnalo ili mjerna vrpca' } },
    { q: { en: 'mass', hr: 'masa' }, sym: 'm', unit: 'kg', inst: { en: 'balance (scale)', hr: 'vaga' } },
    { q: { en: 'time', hr: 'vrijeme' }, sym: 't', unit: 's', inst: { en: 'stopwatch', hr: 'štoperica' } },
    { q: { en: 'volume', hr: 'obujam (volumen)' }, sym: 'V', unit: 'm³', inst: { en: 'measuring cylinder', hr: 'menzura' } },
    { q: { en: 'density', hr: 'gustoća' }, sym: 'ρ', unit: 'kg/m³' },
    { q: { en: 'force', hr: 'sila' }, sym: 'F', unit: 'N', inst: { en: 'dynamometer (spring scale)', hr: 'dinamometar' } },
    { q: { en: 'pressure', hr: 'tlak' }, sym: 'p', unit: 'Pa', inst: { en: 'barometer or pressure gauge', hr: 'barometar ili manometar' } },
    { q: { en: 'work', hr: 'rad' }, sym: 'W', unit: 'J' },
    { q: { en: 'power', hr: 'snaga' }, sym: 'P', unit: 'W' },
    { q: { en: 'temperature', hr: 'temperatura' }, sym: 'T', unit: '°C', inst: { en: 'thermometer', hr: 'termometar' } },
    { q: { en: 'speed', hr: 'brzina' }, sym: 'v', unit: 'm/s', inst: { en: 'speedometer', hr: 'brzinomjer' } },
    { q: { en: 'acceleration', hr: 'akceleracija (ubrzanje)' }, sym: 'a', unit: 'm/s²' },
    { q: { en: 'electric current', hr: 'jakost električne struje' }, sym: 'I', unit: 'A', inst: { en: 'ammeter', hr: 'ampermetar' } },
    { q: { en: 'voltage', hr: 'električni napon' }, sym: 'U', unit: 'V', inst: { en: 'voltmeter', hr: 'voltmetar' } },
    { q: { en: 'electrical resistance', hr: 'električni otpor' }, sym: 'R', unit: 'Ω', inst: { en: 'ohmmeter', hr: 'ommetar' } },
    { q: { en: 'electric charge', hr: 'električni naboj' }, sym: 'Q', unit: 'C' },
    { q: { en: 'frequency', hr: 'frekvencija' }, sym: 'f', unit: 'Hz' },
    { q: { en: 'torque (moment of force)', hr: 'moment sile' }, sym: 'M', unit: 'N·m' }
  ];
  const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];
  function distinct(pool, n, avoid) { const out = []; A.shuffle(pool).forEach(x => { if (out.length < n && x !== avoid && !out.includes(x)) out.push(x); }); return out; }
  function mcQuestion(text, correct, wrong, explain) { const options = A.shuffle([correct].concat(wrong)); return { type: 'mc', text, options, answer: options.indexOf(correct), explain: explain || '' }; }
  function unitQuestion() {
    const t = A.t, lang = A.lang(), f = P.makeF(lang);
    const task = pickOne(UNIT_TASKS), v = pickOne(task.values), ans = task.conv(v);
    return { type: 'num', text: `${t('drills.convert')} ${f(v)} ${task.from} ${t('drills.into')} ${task.to}.`, answer: ans, unit: task.to, explain: `${f(v)} ${task.from} = ${f(ans, Math.abs(ans) < 1 ? 4 : undefined)} ${task.to}` };
  }
  function formulaQuestion() {
    const t = A.t;
    const [a, b, c, type] = pickOne(FORMULAS);
    const expr = type === 'product' ? `${a} = ${b} · ${c}` : `${a} = ${b} / ${c}`;
    let target, correct, wrong, how;
    if (type === 'product') { target = pickOne([b, c]); const other = target === b ? c : b; correct = `${target} = ${a} / ${other}`; wrong = [`${target} = ${a} · ${other}`, `${target} = ${other} / ${a}`]; how = t('drills.howDivide').replace('{x}', other); }
    else if (Math.random() < 0.5) { target = b; correct = `${b} = ${a} · ${c}`; wrong = [`${b} = ${a} / ${c}`, `${b} = ${c} / ${a}`]; how = t('drills.howMultiply').replace('{x}', c); }
    else { target = c; correct = `${c} = ${b} / ${a}`; wrong = [`${c} = ${a} / ${b}`, `${c} = ${a} · ${b}`]; how = t('drills.howSwap').replace('{x}', c).replace('{y}', a); }
    return mcQuestion(`${t('drills.from')} ${expr} ${t('drills.express')} ${target}.`, correct, wrong, how);
  }
  function quantityQuestion() {
    const t = A.t, tr = A.tr;
    const item = pickOne(QUANTITIES), kind = pickOne(item.inst ? ['unit', 'unit', 'quantity', 'inst', 'symbol'] : ['unit', 'unit', 'quantity', 'symbol']);
    const line = `${tr(item.q)}: ${item.sym}, ${item.unit}` + (item.inst ? `, ${tr(item.inst)}` : '');
    if (kind === 'unit') return mcQuestion(`${t('drills.unitOf')} ${tr(item.q)}?`, item.unit, distinct(QUANTITIES.map(x => x.unit), 3, item.unit), line);
    if (kind === 'quantity') return mcQuestion(`${t('drills.measuredIn')} ${item.unit}?`, tr(item.q), distinct(QUANTITIES.filter(x => x.unit !== item.unit).map(x => tr(x.q)), 3, tr(item.q)), line);
    if (kind === 'inst') return mcQuestion(`${t('drills.instrumentFor')} ${tr(item.q)}?`, tr(item.inst), distinct(QUANTITIES.filter(x => x.inst && x !== item).map(x => tr(x.inst)), 3, tr(item.inst)), line);
    return mcQuestion(`${t('drills.symbolOf')} ${tr(item.q)}?`, item.sym, distinct(QUANTITIES.map(x => x.sym), 3, item.sym), line);
  }
  const DRILLS = { units: unitQuestion, formulas: formulaQuestion, quantities: quantityQuestion };
  let drillKind = 'units';
  function renderDrills(main) {
    const el = A.el, t = A.t, lang = A.lang();
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('drills.title') }), el('p', { class: 'lede', text: t('drills.lede') })]));
    const store = rec('drills', {});
    const chips = el('div', { class: 'chips' }), area = el('div', { class: 'quiz' });
    main.appendChild(el('div', { class: 'toolbar' }, [chips])); main.appendChild(area);
    let keyHandler = null;
    const N = 10;
    function drawChips() { chips.innerHTML = ''; Object.keys(DRILLS).forEach(k => chips.appendChild(el('button', { type: 'button', class: 'chip' + (drillKind === k ? ' is-active' : ''), text: t('drills.kinds.' + k), onclick: () => { drillKind = k; drawChips(); start(); } }))); }
    function start() {
      let i = 0, score = 0; const t0 = performance.now();
      function finish() {
        if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
        const secs = Math.round((performance.now() - t0) / 1000);
        const r = store[drillKind] || (store[drillKind] = { best: 0, time: null, runs: 0 });
        r.runs++; if (score > r.best || (score === r.best && (r.time === null || secs < r.time))) { r.best = score; r.time = secs; }
        A.saveProgress(); A.checkBadges();
        area.innerHTML = '';
        area.appendChild(el('div', { class: 'quiz-card result' }, [
          el('h3', { text: `${t('quiz.yourScore')}: ${score} / ${N}` }), el('p', { class: 'num', text: `${t('drills.time')}: ${fmtTime(secs)} · ${t('quiz.best')}: ${r.best} / ${N} (${fmtTime(r.time)})` }),
          el('div', { class: 'quiz-actions' }, [el('button', { type: 'button', class: 'btn primary', text: t('quiz.retry'), onclick: start })])
        ]));
      }
      function show() {
        if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
        const q = DRILLS[drillKind]();
        area.innerHTML = '';
        const card = el('div', { class: 'quiz-card' });
        card.appendChild(el('div', { class: 'quiz-top' }, [el('span', { class: 'quiz-type num', text: `${i + 1} / ${N}` }), el('span', { class: 'progress-bar' }, [el('i', { style: `width:${i / N * 100}%` })]), el('span', { class: 'quiz-type num', text: `${score} ✓` })]));
        card.appendChild(el('div', { class: 'quiz-q', text: q.text }));
        const fb = el('div'); let answered = false;
        const nextBtn = el('button', { type: 'button', class: 'btn primary', text: i + 1 < N ? t('quiz.next') : t('quiz.finish'), onclick: () => { i++; if (i >= N) finish(); else show(); } }); nextBtn.hidden = true;
        function done(ok, correctText) { answered = true; if (ok) score++; fb.appendChild(el('div', { class: 'feedback ' + (ok ? 'ok' : 'no') }, [el('b', { text: ok ? t('quiz.correct') : t('quiz.wrong') + ' ' + t('quiz.correctAnswer') + ' ' + correctText }), q.explain ? el('span', { text: q.explain }) : null])); nextBtn.hidden = false; nextBtn.focus(); }
        if (q.type === 'num') {
          const input = el('input', { type: 'text', inputmode: 'decimal', id: 'drill-answer', placeholder: t('practice.answer'), autocomplete: 'off' });
          const checkBtn = el('button', { type: 'button', class: 'btn primary', text: t('practice.check') });
          const check = () => { if (answered) return; const v = P.parseNum(input.value); if (v === null) { input.focus(); return; } input.disabled = true; checkBtn.disabled = true; done(Math.abs(v - q.answer) <= Math.max(1e-9, Math.abs(q.answer) * 0.006), P.makeF(lang)(q.answer, Math.abs(q.answer) < 1 && q.answer !== 0 ? 4 : undefined) + ' ' + q.unit); };
          checkBtn.addEventListener('click', check);
          input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (answered) nextBtn.click(); else check(); } });
          card.appendChild(el('div', { class: 'num-answer' }, [input, el('span', { class: 'unit', text: q.unit }), checkBtn]));
          setTimeout(() => input.focus(), 30);
        } else {
          const opts = el('div', { class: 'options' });
          const btns = q.options.map((o, pos) => { const b = el('button', { type: 'button', class: 'option' }, [el('span', { class: 'key', text: String(pos + 1) }), el('span', { text: o })]); b.addEventListener('click', () => choose(pos)); opts.appendChild(b); return b; });
          const choose = pos => { if (answered) return; btns.forEach((b, k) => { b.disabled = true; if (k === q.answer) b.classList.add('correct'); else if (k === pos) b.classList.add('wrong'); }); done(pos === q.answer, q.options[q.answer]); };
          card.appendChild(opts);
          keyHandler = e => { if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (!answered && /^[1-4]$/.test(e.key) && +e.key <= btns.length) choose(+e.key - 1); else if (e.key === 'Enter' && answered) nextBtn.click(); };
          document.addEventListener('keydown', keyHandler);
        }
        card.appendChild(fb); card.appendChild(el('div', { class: 'quiz-actions' }, [nextBtn]));
        area.appendChild(card);
      }
      show();
    }
    A.onLeave(() => { if (keyHandler) document.removeEventListener('keydown', keyHandler); });
    drawChips(); start();
  }
  const drillsDone = () => Object.keys(A.progress().drills || {}).length;

  // =====================================================================================
  // Teacher corner
  // =====================================================================================
  let teachTopic = null;
  function renderTeachers(main) {
    const el = A.el, t = A.t, tr = A.tr, lang = A.lang();
    const T = Content.teaching;
    main.appendChild(el('div', { class: 'topic-head' }, [el('h1', { text: t('teach.title') }), el('p', { class: 'lede', text: t('teach.lede') })]));
    const simLink = id => { const host = Content.topics.find(tp => tp.sims.includes(id)); return (Sims.byId[id] && host) ? el('a', { class: 'chip', href: '#' + host.id + '-sim-' + id, text: tr(Sims.byId[id].title) }) : null; };
    const topicLink = id => Content.byId[id] ? el('a', { class: 'chip', href: '#' + id, text: tr(Content.byId[id].title) }) : null;

    // class tools
    main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('teach.tools') })]));
    main.appendChild(cardGrid([
      { title: t('worksheet.title'), desc: t('teach.toolWorksheet'), href: '#practice' },
      { title: t('exam.title'), desc: t('teach.toolExam'), href: '#exam' },
      { title: t('check.title'), desc: t('teach.toolCheck'), href: '#check' },
      { title: t('quick.concepts.t'), desc: t('teach.toolConcepts'), href: '#concepts' },
      { title: t('exp.title'), desc: t('teach.toolExperiments'), href: '#experiments' }
    ]));

    // lesson outlines
    const ids = Content.topics.map(tp => tp.id).filter(id => T.topics[id]);
    if (ids.length) {
      main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('teach.outlines') })]));
      main.appendChild(el('p', { class: 'lede', style: 'color:var(--muted); margin-bottom:12px', text: t('teach.outlinesLede') }));
      if (!teachTopic || !ids.includes(teachTopic)) teachTopic = ids[0];
      const sel = el('select', { class: 'sk-select', id: 'teach-topic' });
      ids.forEach(id => sel.appendChild(el('option', { value: id, text: tr(Content.byId[id].title) })));
      sel.value = teachTopic;
      const out = el('div', { class: 'teach-outline' });
      const draw = () => {
        const tp = Content.byId[teachTopic], o = T.topics[teachTopic];
        out.innerHTML = '';
        const part = (label, nodes) => el('div', { class: 'panel teach-part' }, [el('h4', { text: label })].concat(nodes));
        const peer = Content.concepts.filter(c => c.topic === teachTopic && c.type === 'mc').slice(0, 3);
        const exps = Content.experiments.filter(e => e.topic === teachTopic).slice(0, 4);
        const outcomes = T.outcomes.filter(x => x.topics.includes(teachTopic));
        if (outcomes.length) out.appendChild(part(t('teach.outcomes'), [el('ul', null, outcomes.map(x => el('li', null, [el('b', { class: 'num', text: x.code + ' ' }), lang === 'hr' ? x.hr : x.en])))]));
        out.appendChild(part('1 · ' + t('teach.opening'), [el('p', { text: tr(o.opening) }), el('p', null, [el('b', { text: t('teach.question') + ': ' }), tr(o.question)])]));
        out.appendChild(part('2 · ' + t('teach.investigate'), [el('p', { text: tr(o.investigate) }), el('div', { class: 'chips' }, tp.sims.map(simLink).filter(Boolean)), el('p', null, [el('b', { text: t('teach.keyIdea') + ': ' }), tr(o.keyIdea)]), el('p', { class: 'quiz-type', text: t('teach.talk') }), el('ul', null, o.talk.map(x => el('li', { text: tr(x) })))]));
        const peerNodes = peer.length ? [el('p', { class: 'quiz-type', text: t('teach.peer') }), el('ol', null, peer.map(c => el('li', null, [tr(c.q), el('span', { class: 'teach-answer' }, [' — ', el('b', { text: tr(c.options[c.answer]) })])])))] : [];
        out.appendChild(part('3 · ' + t('teach.apply'), peerNodes.concat([el('p', null, [el('b', { text: t('teach.exit') + ': ' }), tr(o.exit)]), el('div', { class: 'hero-actions' }, [P.templatesFor(teachTopic).length ? el('a', { class: 'btn sm', href: '#' + teachTopic + '-practice', text: t('tabs.practice') }) : null, el('a', { class: 'btn sm', href: '#' + teachTopic + '-quiz', text: t('tabs.quiz') })])])));
        if (exps.length) out.appendChild(part(t('teach.homework'), [el('ul', null, exps.map(e => el('li', null, [el('b', { text: tr(e.title) }), ': ', tr(e.question)]))), el('a', { class: 'chip', href: '#' + teachTopic + '-home', text: t('tabs.home') + ' →' })]));
        out.appendChild(el('div', { class: 'callout' }, [el('h4', { text: t('teach.watch') }), el('p', { text: tr(o.watch) })]));
      };
      sel.addEventListener('change', () => { teachTopic = sel.value; draw(); });
      main.appendChild(el('div', { class: 'toolbar' }, [el('label', { class: 'sk-label', for: 'teach-topic', text: t('progress.topic') }), sel]));
      main.appendChild(out); draw();
    }

    // curriculum map
    if (T.outcomes.length) {
      main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('teach.curriculum') })]));
      main.appendChild(el('p', { class: 'lede', style: 'color:var(--muted); margin-bottom:12px', text: t('teach.curriculumLede') }));
      const wrap = el('div', { class: 'table-wrap' });
      const table = el('table', null, [el('thead', null, [el('tr', null, [el('th', { text: t('teach.code') }), el('th', { text: t('teach.outcome') }), el('th', { text: t('sections.topics') }), el('th', { text: t('tabs.sim') })])])]);
      const tb = el('tbody');
      T.outcomes.forEach(o => tb.appendChild(el('tr', null, [
        el('td', { class: 'num' }, [el('b', { text: o.code })]),
        el('td', null, [o.hr, lang === 'en' ? el('div', { class: 'teach-en', text: o.en }) : null]),
        el('td', null, [el('div', { class: 'chips' }, o.topics.map(topicLink).filter(Boolean))]),
        el('td', null, [el('div', { class: 'chips' }, o.sims.map(simLink).filter(Boolean))])
      ])));
      table.appendChild(tb); wrap.appendChild(table); main.appendChild(wrap);
    }

    // methods
    if (T.methods.length) {
      main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('teach.methods') })]));
      const grid = el('div', { class: 'method-grid' });
      T.methods.forEach(m => grid.appendChild(el('details', { class: 'panel method' }, [
        el('summary', null, [el('b', { text: tr(m.name) }), el('span', { class: 'method-origin', text: tr(m.origin) })]),
        el('p', { text: tr(m.idea) }), el('ol', null, (m.steps[lang] || m.steps.en).map(x => el('li', { text: x }))),
        el('p', { class: 'method-inapp' }, [el('b', { text: t('teach.inApp') + ': ' }), tr(m.inApp)])
      ])));
      main.appendChild(grid);
    }

    // resources
    if (T.resources.length) {
      main.appendChild(el('div', { class: 'section-head' }, [el('h2', { text: t('teach.resources') })]));
      const ul = el('ul', { class: 'resource-list' });
      T.resources.forEach(r => ul.appendChild(el('li', null, [el('a', { href: r.url, target: '_blank', rel: 'noopener', text: r.name }), el('span', { class: 'method-origin', text: ' · ' + r.by }), el('div', { text: tr(r.note) })])));
      main.appendChild(ul);
    }
  }

  return {
    init(api) { A = api; P = window.FizExt && window.FizExt.api; },
    renderHub, renderHomeHubs, renderExperiments, renderTopicExperiments, renderPredict, renderExam, renderCheck, renderDrills, renderTeachers,
    expDoneCount, predictCount, drillsDone, gradeFor,
    counts: () => ({ experiments: Content.experiments.length, predictions: Object.values(Content.predictions).reduce((s, l) => s + l.length, 0) })
  };
})();
