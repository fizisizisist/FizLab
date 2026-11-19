# FizLab — home experiment library (pokusi kod kuće) — read fully before writing

Files `js/content/experiments1.js`, `experiments2.js`, … each call `window.Content.registerExperiments([...])` once.
Bilingual everywhere (`{ en, hr }`); natural school Croatian; decimal comma in Croatian numbers. Audience: ages 11–14,
working at home with household items, mostly alone. Every experiment follows predict → do → observe → explain.

```js
(function () {
  'use strict';
  window.Content.registerExperiments([
    {
      id: 'cartesian-diver',            // unique kebab-case across ALL experiment files
      topic: 'pressure',                // matter, density, motion, forces, gravity, pressure, levers, energy, heat, electricity, magnetism, waves, light, space, science
      type: 'observe',                  // 'observe' = see a new phenomenon | 'test' = test a hypothesis with a measurement | 'apply' = use what you know to solve/build | 'project' = build a device (takes longer)
      level: 1,                         // 1 easy (10 min, no measuring) … 3 demanding (measuring, graph, building)
      minutes: 15,
      outcome: 'B.7.5',                 // OPTIONAL Croatian curriculum outcome it supports (list in the task brief); omit if none fits
      title:    { en: 'The diver in a bottle', hr: 'Ronilac u boci' },
      question: { en: 'Can you make something sink and float just by squeezing a bottle?', hr: '…' },   // the research question
      materials: { en: ['a 1.5 L plastic bottle with a cap', '…'], hr: ['plastična boca od 1,5 L s čepom', '…'] },   // 2–8 items, same count
      steps:     { en: ['Fill the bottle to the top with water.', '…'], hr: ['…'] },                                // 3–8 steps, same count
      predict: {                        // asked BEFORE the kid does the experiment (3 options, one right)
        q: { en: 'What will the diver do when you squeeze the bottle?', hr: '…' },
        options: [ { en: 'It sinks', hr: 'Potone' }, { en: 'It rises', hr: 'Izroni' }, { en: 'Nothing', hr: 'Ništa' } ],
        answer: 0
      },
      observe: { en: 'What you should see, 1–2 sentences.', hr: '…' },
      explain: { en: 'The physics, 2–4 sentences, plain words, names the key quantity.', hr: '…' },
      measure: { en: 'OPTIONAL (required for type test): what to measure, how many times, what table/graph to make.', hr: '…' },
      safety:  { en: 'OPTIONAL: only when there is a real hazard (hot water, scissors, glass, candle, magnets, batteries).', hr: '…' },
      tool: 'stopwatch',                // OPTIONAL: a FizLab lab tool that helps: 'stopwatch' (stopwatch, lap times, tap timer, reaction test), 'tonegen' (tone generator), 'datalab' (data table, mean ± error, graph with best-fit line), 'sensors' (phone microphone / tilt / acceleration)
      sim: 'density'                    // OPTIONAL: the FizLab simulation where the kid can explore the same idea afterwards (valid ids in the task brief)
    }
  ]);
})();
```

## Rules
1. Safe for a 12-year-old at home: no mains electricity (batteries ≤ 9 V only), no open flame unless truly needed and then with an adult and a
   `safety` note, no boiling water without an adult, no chemicals beyond kitchen items (salt, sugar, vinegar, baking soda, oil, food colouring),
   no strong magnets near phones/cards, no projectiles at people, nothing that needs buying special equipment.
2. Materials a household really has: bottles, glasses, coins, rubber bands, string, ruler, kitchen scale, measuring jug, straws, balloons, paper,
   tape, spoons, ice, candle (with adult), torch or phone light, mirror, comb, aluminium foil, pencils, books, toy car, marbles, paper clips,
   AA battery, wire only when necessary. A phone (stopwatch, torch, camera) is fine.
3. `type: 'test'` experiments must control variables (say what is changed, what is measured, what is kept the same), repeat measurements at least
   three times, and have a `measure` text. `type: 'project'` builds a working device (dynamometer, hydrometer, water clock, barometer, thermometer,
   electroscope, compass, periscope, kaleidoscope, solar oven, electromagnet, lemon battery…), with a test of whether it works in the last step.
4. The prediction must be a real question whose wrong options are what kids commonly expect. The `explain` must say why the common expectation is wrong when relevant.
5. Original wording: these are classic experiments, but write every text yourself. No emoji, no markdown.
6. Facts must be right; if an effect is subtle or often fails, say what can go wrong and how to fix it inside the last step or `observe`.

## Test
`tools/check_js.sh js/content/<file>.js` and `tools/check_more.sh js/content/<file>.js` — fix everything until both print OK.
