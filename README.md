# FizLab — Physics you can play with / Fizika s kojom se možeš igrati

A bilingual (English / Croatian) physics learning app for elementary school (Croatian 7th–8th grade,
US grades 5–8): 15 topics, 28 interactive canvas simulations, illustrated lessons with summaries and common
misconceptions, 170+ quiz questions, practice problems with fresh random numbers and step-by-step solutions,
worksheets with answer keys, brain teasers (concept, ranking and estimation tasks), home experiments, a glossary,
a formula sheet, flashcards, a unit converter, a scientists gallery, a daily challenge and progress badges.
Vanilla HTML/CSS/JS — no build step, no dependencies, works offline from any static server.

## Run it locally

```bash
python3 -m http.server 8777
```

Then open <http://localhost:8777/>. (Opening `index.html` directly from disk also works in most browsers.)

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
| `js/sims/_core.js` | SimKit: responsive canvas, animation loop, bilingual control builder, drawing helpers. |
| `js/sims/<sim>.js` | One file per simulation. Spec: `SIM_API.md`. |
| `dev-sim.html` | Harness for developing a single simulation (`?sim=<id>`), with EN/HR and light/dark toggles. |
| `tools/check_js.sh` | Syntax check (uses macOS JavaScriptCore). |
| `tools/check_content.sh` | Validates a topic file (both languages everywhere, quiz shape). |
| `tools/check_problems.sh`, `check_extras.sh`, `check_concepts.sh` | Validate problem templates (40 random instances each), extras and brain teasers. |
| `tools/smoke.sh <id>` | Headless-Chrome smoke test of one simulation. |
| `tools/smoke_app.sh` | Headless-Chrome smoke test of the app routes. |
| `tools/build_artifact.py` | Builds `dist/artifact.html` (page body without the document skeleton) for publishing as a Claude artifact. |

## Adding a topic or a simulation

1. Copy an existing file in `js/content/` or `js/sims/` and follow its spec file.
2. Add a `<script>` tag for it in `index.html` (and the sim id to the topic's `sims` list).
3. Run the checkers in `tools/`.

Progress (lessons read, quiz scores, badges, language) is stored in the browser's localStorage only.
