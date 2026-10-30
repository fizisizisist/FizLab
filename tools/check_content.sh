#!/bin/bash
# Validate a FizLab topic content file: syntax + structure (both languages, quiz shape, counts).
# usage: tools/check_content.sh js/content/<id>.js
status=0
for f in "$@"; do
  if [ ! -f "$f" ]; then echo "MISSING  $f"; status=1; continue; fi
  res=$(osascript -l JavaScript -e '
    ObjC.import("Foundation");
    function read(p){ var s=$.NSString.stringWithContentsOfFileEncodingError(p,$.NSUTF8StringEncoding,null); return ObjC.unwrap(s); }
    function run(argv) {
      var file = argv[0];
      var problems = [];
      var window = {}; var console = { error: function(m){ problems.push("console.error: "+m); }, warn: function(m){ problems.push("console.warn: "+m); }, log: function(){} };
      var dir = file.replace(/js\/content\/[^\/]+$/, "");
      try {
        (new Function("window","console", read(dir + "js/content/_registry.js")))(window, console);
        (new Function("window","console", read(file)))(window, console);
      } catch (e) { return "SYNTAX/RUNTIME ERROR: " + e.message; }
      var topics = window.Content.topics;
      if (topics.length !== 1) return "expected exactly 1 registered topic, got " + topics.length;
      var t = topics[0];
      var base = file.replace(/^.*\//, "").replace(/\.js$/, "");
      if (t.id !== base) problems.push("id \"" + t.id + "\" != filename \"" + base + "\"");
      function bi(o, path, minLen) {
        if (!o || typeof o !== "object") { problems.push(path + ": missing bilingual object"); return; }
        ["en","hr"].forEach(function(l){
          if (typeof o[l] !== "string" || !o[l].trim()) problems.push(path + "." + l + ": missing text");
          else if (minLen && o[l].trim().length < minLen) problems.push(path + "." + l + ": too short (" + o[l].trim().length + " chars)");
        });
      }
      function biList(o, path, min) {
        if (!o || !Array.isArray(o.en) || !Array.isArray(o.hr)) { problems.push(path + ": needs {en:[...], hr:[...]}"); return; }
        if (o.en.length !== o.hr.length) problems.push(path + ": en has " + o.en.length + " items, hr has " + o.hr.length);
        if (min && o.en.length < min) problems.push(path + ": only " + o.en.length + " items (min " + min + ")");
        o.en.concat(o.hr).forEach(function(s,i){ if (typeof s !== "string" || !s.trim()) problems.push(path + "[" + i + "]: empty"); });
      }
      bi(t.title, "title"); bi(t.intro, "intro", 20);
      if (typeof t.order !== "number") problems.push("order: missing number");
      if (typeof t.gradeLevel !== "number") problems.push("gradeLevel: missing number");
      if (!/^c[1-8]$/.test(t.color||"")) problems.push("color: must be c1..c8");
      if (!Array.isArray(t.sims) || !t.sims.length) problems.push("sims: empty");
      if (!Array.isArray(t.lesson) || t.lesson.length < 4) problems.push("lesson: need >= 4 sections, got " + (t.lesson||[]).length);
      (t.lesson||[]).forEach(function(s,i){ bi(s.h, "lesson["+i+"].h"); biList(s.p, "lesson["+i+"].p", 1);
        if (s.svg !== undefined) { if (typeof s.svg !== "string" || !/^\s*<svg[\s>]/.test(s.svg)) problems.push("lesson["+i+"].svg: not an <svg> string"); else if (/#[0-9a-fA-F]{3,6}\b/.test(s.svg)) problems.push("lesson["+i+"].svg: uses hex colors; use var(--fg), var(--c1)... only"); } });
      if (!Array.isArray(t.keyTerms) || t.keyTerms.length < 6) problems.push("keyTerms: need >= 6, got " + (t.keyTerms||[]).length);
      (t.keyTerms||[]).forEach(function(k,i){ bi(k.term, "keyTerms["+i+"].term"); bi(k.def, "keyTerms["+i+"].def", 15); });
      if (!Array.isArray(t.formulas) || t.formulas.length < 1) problems.push("formulas: need >= 1");
      (t.formulas||[]).forEach(function(k,i){ if (typeof k.expr !== "string" || !k.expr.trim()) problems.push("formulas["+i+"].expr missing"); bi(k.name, "formulas["+i+"].name"); if (k.note !== undefined) bi(k.note, "formulas["+i+"].note"); });
      bi(t.funFact, "funFact", 40);
      if (!t.experiment) problems.push("experiment: missing"); else {
        bi(t.experiment.title, "experiment.title"); biList(t.experiment.materials, "experiment.materials", 2); biList(t.experiment.steps, "experiment.steps", 3); bi(t.experiment.explain, "experiment.explain", 40);
        if (t.experiment.safety !== undefined) bi(t.experiment.safety, "experiment.safety");
      }
      if (!Array.isArray(t.quiz) || t.quiz.length < 8) problems.push("quiz: need >= 8 questions, got " + (t.quiz||[]).length);
      var counts = {mc:0, tf:0, num:0};
      (t.quiz||[]).forEach(function(q,i){
        var p = "quiz["+i+"]";
        if (!/^(mc|tf|num)$/.test(q.type||"")) { problems.push(p + ".type invalid"); return; }
        counts[q.type]++;
        bi(q.q, p + ".q", 10); bi(q.explain, p + ".explain", 15);
        if (q.type === "mc") {
          if (!Array.isArray(q.options) || q.options.length !== 4) problems.push(p + ": mc needs exactly 4 options");
          else q.options.forEach(function(o,j){ bi(o, p + ".options["+j+"]"); });
          if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3)) problems.push(p + ".answer must be 0..3");
        } else if (q.type === "tf") {
          if (typeof q.answer !== "boolean") problems.push(p + ".answer must be true/false");
        } else {
          if (typeof q.answer !== "number") problems.push(p + ".answer must be a number");
          if (q.tolerance !== undefined && typeof q.tolerance !== "number") problems.push(p + ".tolerance must be a number");
        }
      });
      var mcAnswers = (t.quiz||[]).filter(function(q){return q.type==="mc";}).map(function(q){return q.answer;});
      if (mcAnswers.length >= 4 && new Set(mcAnswers).size < 3) problems.push("quiz: vary the correct option index (currently " + JSON.stringify(mcAnswers) + ")");
      if (counts.num < 1) problems.push("quiz: include at least 1 numeric (num) question");
      if (counts.tf < 1) problems.push("quiz: include at least 1 true/false (tf) question");
      if (!problems.length) return "OK (" + t.lesson.length + " sections, " + t.keyTerms.length + " terms, " + t.quiz.length + " questions: " + counts.mc + " mc / " + counts.tf + " tf / " + counts.num + " num)";
      return "PROBLEMS:\n  - " + problems.join("\n  - ");
    }' "$f" 2>&1)
  case "$res" in OK*) echo "OK       $f  $res";; *) echo "FAIL     $f"; echo "$res"; status=1;; esac
done
exit $status
