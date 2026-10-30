# FizLab — conceptual questions, ranking tasks and estimation tasks (read fully before writing)

File: `js/content/concepts.js`, one call `window.Content.registerConcepts([...])`. Bilingual everywhere (`{ en, hr }`),
standard school Croatian, decimal comma in Croatian numbers. These are "brain teasers" that target well-known
misconceptions (peer-instruction style), ranking tasks (zadaci rangiranja) and estimation tasks (zadaci procjene).

```js
(function () {
  'use strict';
  window.Content.registerConcepts([
    { id: 'balloon-constant-speed', topic: 'forces', type: 'mc', level: 2,
      q: { en: 'A balloon rises at a constant speed. Gravity Fg and air resistance Fo pull it down, buoyancy Fu pushes it up. Which is true?', hr: '...' },
      options: [ { en: 'Fu < Fg + Fo', hr: 'Fu < Fg + Fo' }, { en: 'Fu = Fg + Fo', hr: '...' }, { en: 'Fu > Fg + Fo', hr: '...' } ],   // 3 or 4 options
      answer: 1,                                            // index of the correct option
      explain: { en: 'Constant speed means balanced forces...', hr: '...' },
      misconception: { en: 'Many think moving up needs a bigger force up, but a net force would change the speed.', hr: '...' } },

    { id: 'rank-pressure-shoes', topic: 'pressure', type: 'rank', level: 2,
      q: { en: 'Rank from the largest pressure on the floor to the smallest.', hr: 'Poredaj od najvećeg tlaka na pod do najmanjeg.' },
      items: [ { en: 'a woman (600 N) on one high heel (1 cm²)', hr: '...' }, { en: '...', hr: '...' }, { en: '...', hr: '...' }, { en: '...', hr: '...' } ],   // 3–5 items IN THE CORRECT ORDER (the app shuffles them)
      explain: { en: 'p = F / A, so ...', hr: '...' } },

    { id: 'estimate-stairs-power', topic: 'energy', type: 'num', level: 3,
      q: { en: 'Estimate the power of a 50 kg pupil who runs up a 3 m staircase in 5 s. (Use g = 10 N/kg.)', hr: '...' },
      answer: 300, min: 250, max: 350, unit: 'W',          // any answer in [min, max] is accepted; explain shows the reasoning
      explain: { en: 'W = m·g·h = 1500 J; P = W / t = 300 W, about the power of a strong light bulb.', hr: '...' } }
  ]);
})();
```

Fields: `id` unique kebab-case; `topic` one of matter, density, motion, forces, gravity, pressure, levers, energy, heat,
electricity, magnetism, waves, light, space, science; `type` mc | rank | num; `level` 1–3; `explain` teaches the physics in
2–3 sentences; `misconception` (mc only, optional but encouraged) names the wrong idea the popular distractor comes from.

Test: `tools/check_js.sh js/content/concepts.js` and `tools/check_concepts.sh js/content/concepts.js` — fix until OK.
