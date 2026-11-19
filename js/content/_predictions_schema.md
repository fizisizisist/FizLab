# FizLab — "Predict first" prompts for simulations (predict–observe–explain) — read fully before writing

Research on interactive lecture demonstrations shows that pupils learn far more from a demonstration or a simulation when they commit to a
prediction first. Each simulation in FizLab therefore opens with a "Predict first / Prvo predvidi" card.

File `js/content/predictions.js` (or `predictions2.js`), one call:

```js
(function () {
  'use strict';
  window.Content.registerPredictions({
    freefall: [                              // key = simulation id
      {
        q: { en: 'A steel ball and a feather are dropped together on the Moon, where there is no air. What happens?', hr: '…' },
        options: [ { en: 'The ball lands first', hr: '…' }, { en: 'They land together', hr: '…' }, { en: 'The feather floats away', hr: '…' } ],   // 3 options (4 allowed)
        answer: 1,
        try: { en: 'Choose "Moon", pick the feather and press Drop.', hr: 'Odaberi "Mjesec", izaberi pero i pritisni Pusti.' },      // exactly what to do in THIS sim to check it
        explain: { en: 'Without air nothing slows the feather, so both fall with the same acceleration.', hr: '…' }                   // 1–3 sentences
      }
    ],
    motion: [ ... ]
  });
})();
```

## Rules
1. The prediction must be checkable in that very simulation with the controls it really has: read the sim's file header (`title`, `summary`, `tasks`)
   and skim its controls before writing. `try` names the real controls (use the sim's own labels in each language).
2. Target a known misconception: at least one wrong option is the answer most kids give.
3. One or two prompts per simulation, easy to read in 15 seconds. Bilingual, same meaning. No emoji, no markdown.

## Test
`tools/check_js.sh js/content/predictions.js` and `tools/check_more.sh js/content/predictions.js` — fix until OK.
