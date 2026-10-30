# FizLab — topic content file spec (read fully before writing a topic)

FizLab is a bilingual (English / Croatian) physics learning app for ages 11–14 (Croatian 7th–8th grade osnovna škola,
US grades 5–8). Each topic is ONE file `js/content/<id>.js` that calls `window.Content.register({...})`.
Every piece of text is a bilingual object `{ en: '...', hr: '...' }`. The Croatian must be natural, correct school
Croatian (ijekavica, standard terms used in Croatian textbooks: sila, masa, gustoća, tlak, rad, snaga, energija, toplina,
temperatura, napon, struja, otpor, titranje, val, zvuk, svjetlost, lom, odbijanje...). Croatian numbers use a decimal comma
(9,81), English a decimal point (9.81). Both languages must carry the same facts; they do not need to be word-for-word.

Audience voice: friendly, concrete, everyday examples (bike, ball, kitchen, school, sea, snow), short sentences,
no formula without a plain-words explanation. No emoji in text.

```js
(function () {
  'use strict';
  window.Content.register({
    id: 'forces',                 // == filename, lowercase
    order: 40,                    // position in the topic list (given per topic)
    gradeLevel: 7,                // Croatian grade: 7 or 8 (given per topic)
    color: 'c2',                  // card color token c1..c8 (given per topic)
    title:   { en: 'Forces', hr: 'Sile' },
    intro:   { en: 'One sentence that makes a kid curious.', hr: 'Jedna rečenica koja budi znatiželju.' },
    sims: ['forces', 'freefall', 'spring'],   // simulation ids shown in the Simulation tab (given per topic)

    lesson: [                     // 5–6 sections; 2–3 short paragraphs each (40–90 words per paragraph)
      {
        h: { en: 'What is a force?', hr: 'Što je sila?' },
        p: { en: ['paragraph', 'paragraph'], hr: ['odlomak', 'odlomak'] },
        svg: '<svg viewBox="0 0 420 120" ...>...</svg>'      // OPTIONAL simple inline diagram (see rules below)
      }
    ],

    keyTerms: [                   // 8–12 terms; these also feed the app-wide glossary and flashcards
      { term: { en: 'force', hr: 'sila' }, def: { en: 'A push or a pull...', hr: 'Guranje ili vučenje...' } }
    ],

    formulas: [                   // 1–4; expr is shared (use · for multiply, / for divide, ² etc.)
      { expr: 'F = m · g', name: { en: 'weight', hr: 'težina' }, note: { en: 'g ≈ 9.81 N/kg on Earth', hr: 'g ≈ 9,81 N/kg na Zemlji' } }
    ],

    funFact: { en: '...', hr: '...' },     // 1–2 sentences, true and checkable

    experiment: {                 // a safe experiment with household items
      title: { en: 'Build a rubber-band force meter', hr: 'Napravi dinamometar od gumice' },
      materials: { en: ['rubber band', '...'], hr: ['gumica', '...'] },
      steps: { en: ['Step one.', '...'], hr: ['Prvi korak.', '...'] },     // 4–7 steps
      explain: { en: 'Why it works...', hr: 'Zašto to radi...' },
      safety: { en: 'optional warning', hr: 'neobavezno upozorenje' }
    },

    quiz: [                       // 10–12 questions, mixed types, ordered easy → hard
      { type: 'mc', q: {en,hr}, options: [{en,hr}, {en,hr}, {en,hr}, {en,hr}], answer: 1, explain: {en,hr} },   // answer = index 0..3
      { type: 'tf', q: {en,hr}, answer: false, explain: {en,hr} },
      { type: 'num', q: {en,hr}, answer: 30, tolerance: 0.5, unit: 'N', explain: {en,hr} }    // numeric input; unit shown after the box
    ]
  });
})();
```

## Quiz rules
- Mix: about 6–7 `mc`, 2–3 `tf`, 2 `num`. Every question has an `explain` that teaches (not just "correct").
- `mc` has exactly 4 options, one correct, distractors plausible (common misconceptions). Vary the correct index.
- `num` answers must be computable from the question with the numbers given; say which rounded constant to use (g = 10 N/kg) when needed.
- Croatian question and options must mean exactly what the English ones mean.

## Inline SVG diagrams (optional, 1–3 per topic)
- `viewBox="0 0 420 140"` or similar, no fixed width/height attributes; the app sizes it.
- Colors ONLY via CSS variables: `stroke="var(--fg)"`, `fill="var(--c1)"`, `fill="var(--c2)"`, `stroke="var(--muted)"`, `fill="var(--surface2)"`; text `fill="var(--fg)" font-family="inherit" font-size="13"`.
- Text inside the SVG cannot be translated, so either keep it to symbols/numbers (F₁ = 30 N) or omit text.
- Keep it simple: rectangles, circles, lines, arrows (use `<marker>` or a small triangle polygon).

## Testing
Run `tools/check_js.sh js/content/<id>.js` for a syntax check, and
`tools/check_content.sh js/content/<id>.js` to validate the structure (both languages present everywhere,
option counts, answer indexes, question count). Fix every reported problem.
