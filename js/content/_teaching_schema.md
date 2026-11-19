# FizLab — teacher corner data (Za učitelje) — read fully before writing

File `js/content/teaching.js`, one call `window.Content.registerTeaching({ outcomes, topics, methods, resources })`. Bilingual.

```js
(function () {
  'use strict';
  window.Content.registerTeaching({
    outcomes: [                      // Croatian curriculum outcomes for physics, grades 7 and 8 (official wording given in the task brief: copy it exactly)
      { code: 'FIZ OŠ A.7.1.', grade: 7,
        hr: 'Uspoređuje dimenzije, masu i gustoću različitih tijela i tvari.',      // exact official wording
        en: 'Compares the dimensions, mass and density of different bodies and substances.',   // faithful English rendering
        topics: ['matter', 'density'],               // FizLab topic ids that cover it
        sims: ['measure', 'density'] }               // FizLab simulation ids that fit best (2–5)
    ],
    topics: {                        // one entry per FizLab topic id (all 16): the skeleton of an inquiry-based lesson
      forces: {
        opening:  { en: 'An opening problem or mini-demo that makes pupils curious and exposes their ideas (2–3 sentences).', hr: '…' },
        question: { en: 'The research question of the lesson, one sentence.', hr: '…' },
        investigate: { en: 'What pupils do to answer it: which FizLab simulation or hands-on experiment, what they change and measure (2–4 sentences).', hr: '…' },
        keyIdea:  { en: 'The model/idea pupils should construct, in one or two sentences.', hr: '…' },
        talk:     [ { en: 'A discussion question for pairs.', hr: '…' }, { en: 'A second one.', hr: '…' } ],      // 2–3
        exit:     { en: 'An exit-ticket question that shows whether the key idea landed.', hr: '…' },
        watch:    { en: 'What typically goes wrong: the most persistent pupil difficulty and how to respond.', hr: '…' }
      }
    },
    methods: [                       // research-based teaching methods, each as a short practical card
      { id: 'peer-instruction',
        name:   { en: 'Peer Instruction', hr: 'Konceptualna pitanja s karticama' },
        origin: { en: 'Eric Mazur, Harvard University', hr: 'Eric Mazur, Sveučilište Harvard' },
        idea:   { en: 'One sentence on what it is.', hr: '…' },
        steps:  { en: ['3–6 short steps', '…'], hr: ['…'] },
        inApp:  { en: 'Where FizLab supports it (which page/feature).', hr: '…' } }
    ],
    resources: [                     // open resources to explore further (name, who, url given in the task brief; write the note)
      { name: 'phyphox', by: 'RWTH Aachen University', url: 'https://phyphox.org', note: { en: 'One line: what it is good for.', hr: '…' } }
    ]
  });
})();
```

Also write `js/content/summaries2.js`: `window.Content.registerSummaries({ science: {...}, homelab: {...} })` in the format of the existing
`js/content/summaries.js` (5 bullets per language + 3 { myth, truth } misconceptions per topic).

## Test
`tools/check_js.sh <file>` and `tools/check_more.sh js/content/teaching.js js/content/summaries2.js` — fix until OK.
