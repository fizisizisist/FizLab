# FizLab — extra content: scientists + topic summaries (read fully before writing)

Two files, both bilingual (English / Croatian; standard school Croatian, decimal comma in Croatian numbers).

## js/content/scientists.js
```js
(function () {
  'use strict';
  window.Content.registerScientists([
    {
      id: 'newton', name: 'Isaac Newton', born: 1643, died: 1727,       // died: null if alive
      country: { en: 'England', hr: 'Engleska' },
      field: { en: 'Motion, gravity and light', hr: 'Gibanje, gravitacija i svjetlost' },
      topics: ['forces', 'gravity', 'light'],                                // FizLab topic ids this person connects to
      known: { en: 'The three laws of motion and the law of gravity.', hr: 'Tri zakona gibanja i zakon gravitacije.' },  // one line
      bio: { en: '70–110 words, kid-friendly, concrete, true.', hr: '70–110 riječi.' },
      fact: { en: 'One surprising, checkable fact.', hr: 'Jedna iznenađujuća, provjerljiva činjenica.' },
      croatia: false                                                         // true for people born in or tied to Croatia
    }
  ]);
})();
```
Valid topic ids: matter, density, motion, forces, gravity, pressure, levers, energy, heat, electricity, magnetism, waves, light, space.

## js/content/summaries.js
```js
(function () {
  'use strict';
  window.Content.registerSummaries({
    forces: {
      bullets: { en: ['4–6 one-sentence takeaways', '...'], hr: ['4–6 rečenica', '...'] },     // same count in both languages
      misconceptions: [                                                                       // 3 per topic
        { myth: { en: 'Heavier objects fall faster.', hr: 'Teža tijela padaju brže.' },
          truth: { en: 'Without air, everything falls with the same acceleration.', hr: 'Bez zraka sva tijela padaju jednakim ubrzanjem.' } }
      ]
    },
    density: { ... }   // one entry for EVERY topic id listed above (14 entries)
  });
})();
```

Test from the project folder: `tools/check_js.sh <file>` and `tools/check_extras.sh js/content/scientists.js js/content/summaries.js`. Fix everything until OK.
