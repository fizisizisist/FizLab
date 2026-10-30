# FizLab — practice problem templates (zadaci) — read fully before writing a file

Practice problems are **templates with random numbers**: every time a kid presses "New problem" the numbers change,
and the app checks the numeric answer, shows a hint and a step-by-step solution. One file per topic in
`js/problems/<topicId>.js`, calling `window.Content.registerProblems('<topicId>', [ ...templates ])`.
Everything shown to the kid is bilingual (English / Croatian). Croatian uses standard school terms and the
formatter `f` already prints a decimal comma in Croatian, so never hard-code numbers with a comma or a point in
text: ALWAYS put numbers through `f(...)`.

```js
(function () {
  'use strict';
  window.Content.registerProblems('forces', [
    {
      id: 'weight-basic',          // unique inside the topic, kebab-case
      level: 1,                    // 1 = one formula, direct ; 2 = rearranged formula or unit conversion ; 3 = two or more steps
      params: R => ({ m: R.int(2, 60) }),                       // random inputs; see R below
      text: {                                                   // the problem statement; (p, f) => string
        en: (p, f) => `A schoolbag has a mass of ${f(p.m)} kg. What is its weight on Earth? Use g = 10 N/kg.`,
        hr: (p, f) => `Školska torba ima masu ${f(p.m)} kg. Kolika je njezina težina na Zemlji? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10,       // the numeric answer (a number, in the unit below)
      unit: 'N',                   // string (same in both languages) or { en: 'km/h', hr: 'km/h' }
      tol: 0.02,                   // optional relative tolerance (default 0.02 = 2 %); or abs: 0.5 for an absolute one
      hint: { en: 'Weight = mass × g.', hr: 'Težina = masa × g.' },
      steps: {                     // the worked solution, 2–5 short lines, numbers through f()
        en: (p, f) => ['Formula: G = m · g', `G = ${f(p.m)} kg · 10 N/kg`, `G = ${f(p.m * 10)} N`],
        hr: (p, f) => ['Formula: G = m · g', `G = ${f(p.m)} kg · 10 N/kg`, `G = ${f(p.m * 10)} N`]
      }
    }
  ]);
})();
```

## `R` — random helpers available inside `params`
- `R.int(a, b)` integer from a to b inclusive
- `R.step(a, b, step)` a value a, a+step, …, b (e.g. `R.step(0.5, 5, 0.5)`)
- `R.pick([x, y, z])` one element of the list (can be an object: `R.pick([{name:{en:'iron',hr:'željezo'}, rho:7870}, …])`)
- `R.float(a, b, digits)` random decimal with the given number of digits

Use `params` to make the numbers come out clean when the kid computes (prefer values that give whole or
one-decimal results at level 1; e.g. pick `t` first and set `s = v * t`).

## `f(v, digits)` — the number formatter
`f(12)` → "12", `f(2.5)` → "2.5" (EN) / "2,5" (HR), `f(1/3)` → "0.33"; `f(v, 1)` forces one decimal. Use it for
EVERY number in `text`, `steps`, and any name you pick with `R.pick` goes through `p.x.name[lang]`? No — inside
`text`/`steps` you do not know the language, so for bilingual picked names write separate `en:` and `hr:` functions that read
`p.liquid.name.en` and `p.liquid.name.hr`.

## Rules
1. 7–9 templates per topic, ordered easy → hard: about 3 × level 1, 3 × level 2, 2–3 × level 3.
2. Every template needs: `id`, `level`, `params`, `text.en`, `text.hr`, `answer`, `unit`, `hint.en/hr`, `steps.en/hr`.
3. Use the rounded constants the lesson uses: g = 10 N/kg (say so in the text), speed of sound 340 m/s,
   speed of light 300 000 km/s, water density 1000 kg/m³, c(water) = 4200 J/(kg·°C). State every constant the kid needs in the text.
4. The answer must follow from the text; never require a value the text does not give.
5. Steps show the formula, the substitution with units, and the result with unit. Keep lines short.
6. Answers should be positive numbers with a sensible size (avoid results like 0.0003; convert units instead).
   If the natural answer is a small decimal, set `abs` so the check is fair (e.g. `abs: 0.01`).
7. Croatian: "Izračunaj", "Kolika je…", "Koliko iznosi…", units "m/s", "km/h", "N", "J", "W", "Pa", "kPa", "V", "A", "Ω", "°C", "Hz".
8. No emoji, no markdown. Only template literals/strings; no `alert`, no DOM, no globals.

## Testing
From the project folder: `tools/check_js.sh js/problems/<topic>.js` then `tools/check_problems.sh js/problems/<topic>.js`.
The checker generates 40 random instances of every template in both languages and reports any NaN/undefined,
missing field, non-finite answer, or numbers that never vary. Fix everything until it prints OK.
