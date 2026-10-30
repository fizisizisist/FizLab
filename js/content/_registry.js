/* FizLab — content registry. Loaded before any js/content/*.js or js/problems/*.js file. */
(function () {
  'use strict';
  const Content = { topics: [], byId: {}, problems: {}, scientists: [], summaries: {}, concepts: [] };
  Content.register = function (t) {
    if (!t || !t.id || !t.title) { console.error('Content.register: invalid topic', t); return; }
    if (Content.byId[t.id]) { console.warn('Content.register: duplicate topic', t.id); return; }
    t.sims = t.sims || []; t.quiz = t.quiz || []; t.keyTerms = t.keyTerms || []; t.formulas = t.formulas || []; t.lesson = t.lesson || [];
    Content.byId[t.id] = t;
    Content.topics.push(t);
    Content.topics.sort((a, b) => (a.order || 0) - (b.order || 0));
  };
  // practice problems: list of templates (see js/problems/_schema.md)
  Content.registerProblems = function (topicId, list) {
    if (!topicId || !Array.isArray(list)) { console.error('registerProblems: bad arguments', topicId); return; }
    Content.problems[topicId] = (Content.problems[topicId] || []).concat(list.map(p => Object.assign({ topic: topicId }, p)));
  };
  Content.registerScientists = function (list) {
    if (!Array.isArray(list)) { console.error('registerScientists: expected a list'); return; }
    Content.scientists = Content.scientists.concat(list);
  };
  Content.registerSummaries = function (obj) {
    if (!obj || typeof obj !== 'object') { console.error('registerSummaries: expected an object'); return; }
    Object.keys(obj).forEach(k => { Content.summaries[k] = obj[k]; });
  };
  // conceptual questions (peer-instruction style), ranking and estimation tasks: see js/content/_concepts_schema.md
  Content.registerConcepts = function (list) {
    if (!Array.isArray(list)) { console.error('registerConcepts: expected a list'); return; }
    Content.concepts = Content.concepts.concat(list);
  };
  window.Content = Content;
})();
