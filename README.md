# FizLab — Physics you can play with / Fizika s kojom se možeš igrati

A bilingual (English / Croatian) physics learning app for elementary school (Croatian 7th–8th grade,
US grades 5–8), built around interactive, inquiry-based teaching:

- **16 topics** with illustrated lessons, summaries, common misconceptions, worked examples and quizzes
- **48 interactive canvas simulations and lab tools**, each with a "Predict first" card (predict–observe–explain)
- **Practice**: calculation problems with fresh random numbers and step-by-step solutions, graph-reading problems,
  context-rich story problems, brain teasers (concept, ranking, estimation), quick drills, worksheets with answer keys
- **Tests**: practice exams graded 1–5 (reproducible by code for a whole class), a before/after concept check with
  the normalised gain, a mixed quiz and a daily challenge
- **Home lab**: a library of home experiments (observe / fair test / apply / build), a stopwatch with tap timer and
  reaction test, a tone generator, a data table with graph and line fit, and phone-sensor tools (sound stopwatch,
  pitch, tilt, acceleration)
- **Reference**: glossary, formula sheet, flashcards, scientists, unit converter
- **Reading options** (the "Aa" button): dyslexia-friendly text (BDA / WCAG spacing, cream background, no italics),
  bold word beginnings for readers with ADHD (Croatian lj / nj / dž kept whole, formulas and units untouched), and a
  reading ruler that dims everything except the current lines
- **For teachers**: curriculum map (NN 10/2019 outcomes), inquiry lesson outlines per topic, research-based methods

Live site: https://fizisizisist.github.io/FizLab/

Inspiration: PhET (University of Colorado Boulder), phyphox (RWTH Aachen University), the teaching methods collected
on PhysPort (Peer Instruction, Interactive Lecture Demonstrations, ISLE, Tutorials, context-rich problems, ranking
tasks), Exploratorium Science Snacks, and the Croatian physics curriculum. All simulations, texts and questions are
original to this project.

## Run it locally

```bash
python3 -m http.server 8778
```

Then open <http://localhost:8778/>. (Opening `index.html` directly from disk also works in most browsers.)

## Structure

| Path | What it is |
|---|---|
| `index.html` | The app page (full HTML document for local use). |
| `css/app.css` | Theme tokens (light + dark), layout, controls. |
| `js/app.js` | Shell: routing, lessons, sim mounting, quiz engine, glossary, flashcards, progress. |
| `js/i18n.js` | UI strings in English and Croatian. |
| `js/content/<topic>.js` | One file per topic: lesson, key terms, formulas, fun fact, experiment, quiz (both languages). Spec: `js/content/_schema.md`. |
| `js/content/summaries.js`, `scientists.js`, `concepts.js` | Topic summaries + misconceptions, scientist bios, brain teasers. Specs: `_extras_schema.md`, `_concepts_schema.md`. |
| `js/problems/<topic>.js` | Practice-problem templates with random parameters, hints and worked solutions. Spec: `js/problems/_schema.md`. |
| `js/practice.js` | Practice engine, worksheets, brain teasers, worked examples, scientists page, unit converter. |
| `js/more.js` | Hubs, home-experiment library, predict-first cards, practice exam, concept check, drills, teacher corner. |
| `js/graph.js` | SVG graph renderer for graph-reading problems. |
| `js/reading.js` | Reading options: dyslexia-friendly text, bold word beginnings, reading ruler (saved per browser). |
| `js/i18n2.js` | UI strings of the extension (merged into `I18N`). |
| `js/content/experiments*.js`, `predictions*.js`, `teaching.js` | Home experiments, predict-first prompts, teacher data. Specs: `_experiments_schema.md`, `_predictions_schema.md`, `_teaching_schema.md`. |
| `js/sims/_core.js` | SimKit: responsive canvas, animation loop, bilingual control builder, drawing helpers. |
| `js/sims/<sim>.js` | One file per simulation. Spec: `SIM_API.md`. |
| `dev-sim.html` | Harness for developing a single simulation (`?sim=<id>`), with EN/HR and light/dark toggles. |
| `tools/check_js.sh` | Syntax check (uses macOS JavaScriptCore). |
| `tools/check_content.sh` | Validates a topic file (both languages everywhere, quiz shape). |
| `tools/check_problems.sh`, `check_extras.sh`, `check_concepts.sh`, `check_more.sh` | Validate problem templates (40 random instances each), extras, brain teasers, experiments, predictions and teacher data. |
| `tools/smoke.sh <id>` | Headless-Chrome smoke test of one simulation. |
| `tools/smoke_app.sh` | Headless-Chrome smoke test of the app routes. |
| `tools/build_artifact.py` | Builds `dist/artifact.html` (page body without the document skeleton) for publishing as a Claude artifact. |

## Adding a topic or a simulation

1. Copy an existing file in `js/content/` or `js/sims/` and follow its spec file.
2. Add a `<script>` tag for it in `index.html` (and the sim id to the topic's `sims` list).
3. Run the checkers in `tools/`.

Progress (lessons read, quiz scores, badges, language) is stored in the browser's localStorage only.
