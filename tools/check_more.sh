#!/bin/bash
# Validate experiments*.js, predictions*.js, teaching.js, summaries2.js
status=0
for f in "$@"; do
  if [ ! -f "$f" ]; then echo "MISSING  $f"; status=1; continue; fi
  res=$(osascript -l JavaScript -e '
    ObjC.import("Foundation");
    function read(p){ var s=$.NSString.stringWithContentsOfFileEncodingError(p,$.NSUTF8StringEncoding,null); return ObjC.unwrap(s); }
    function run(argv) {
      var file = argv[0], problems = [];
      var window = {}; var console = { error: function(m){ problems.push("console.error: "+m); }, warn: function(m){ problems.push("console.warn: "+m); }, log: function(){} };
      var dir = file.replace(/js\/content\/[^\/]+$/, "");
      try {
        (new Function("window","console", read(dir + "js/content/_registry.js")))(window, console);
        (new Function("window","console", read(file)))(window, console);
      } catch (e) { return "SYNTAX/RUNTIME ERROR: " + e.message; }
      var TOPICS = ["matter","density","motion","forces","gravity","pressure","levers","energy","heat","electricity","magnetism","waves","light","space","science","homelab"];
      var SIMS = ["freefall","motion","motiongraphs","galileo","forces","forcepairs","pendulum","circular","space","density","pressure","lever","states","energy","energybars","heat","heattransfer","spring","circuit","static","magnet","electromagnet","waves","sound","light","color","measure","inquiry","lens","eclipse","ripple","induction","resistance","energychain","gas","expansion","heatingcurve","hydraulics","pulleys","balance","friction","orbits","projectile","collisions","stopwatch","tonegen","datalab","sensors"];
      var TOOLS = ["stopwatch","tonegen","datalab","sensors"];
      var OUTCOMES = ["A.7.1","B.7.2","B.7.3","B.7.4","B.7.5","D.7.6","A.7.7","A.7.8","D.7.9","7.10","7.11","B.8.1","D.8.2","D.8.3","A.8.4","C.8.5","C.8.6","8.7","8.8","8.9","8.10","8.11"];
      function words(s){ return s.trim().split(/\s+/).length; }
      function bi(o, path, minW, maxW) {
        if (!o || typeof o !== "object") { problems.push(path + ": missing bilingual object"); return; }
        ["en","hr"].forEach(function(l){
          if (typeof o[l] !== "string" || !o[l].trim()) problems.push(path + "." + l + ": missing text");
          else { var n = words(o[l]); if (minW && n < minW) problems.push(path + "." + l + ": too short (" + n + " words)"); if (maxW && n > maxW) problems.push(path + "." + l + ": too long (" + n + " words)"); if (/[\u{1F300}-\u{1FAFF}]/u.test(o[l])) problems.push(path + "." + l + ": contains emoji"); }
        });
      }
      function biList(o, path, min, max) {
        if (!o || !Array.isArray(o.en) || !Array.isArray(o.hr)) { problems.push(path + ": needs {en:[...], hr:[...]}"); return; }
        if (o.en.length !== o.hr.length) problems.push(path + ": en has " + o.en.length + " items, hr has " + o.hr.length);
        if (min && o.en.length < min) problems.push(path + ": only " + o.en.length + " items (min " + min + ")");
        if (max && o.en.length > max) problems.push(path + ": " + o.en.length + " items (max " + max + ")");
        o.en.concat(o.hr).forEach(function(s,i){ if (typeof s !== "string" || !s.trim()) problems.push(path + "[" + i + "]: empty"); });
      }
      function mcq(x, path) {
        bi(x.q, path + ".q", 5);
        if (!Array.isArray(x.options) || x.options.length < 3 || x.options.length > 4) problems.push(path + ": needs 3–4 options"); else x.options.forEach(function(o,j){ bi(o, path + ".options[" + j + "]"); });
        if (!(Number.isInteger(x.answer) && x.answer >= 0 && x.answer < (x.options||[]).length)) problems.push(path + ".answer out of range");
      }
      var C = window.Content, base = file.replace(/^.*\//, "").replace(/\.js$/, "");
      if (/^experiments/.test(base)) {
        var list = C.experiments, ids = {}, types = {observe:0,test:0,apply:0,project:0}, answers = [];
        if (list.length < 18) problems.push("only " + list.length + " experiments (need >= 18 per file)");
        list.forEach(function(e, i){
          var p = "[" + (e.id || i) + "]";
          if (!e.id || !/^[a-z0-9-]+$/.test(e.id) || ids[e.id]) problems.push(p + " missing/invalid/duplicate id"); ids[e.id] = 1;
          if (TOPICS.indexOf(e.topic) < 0) problems.push(p + " unknown topic " + e.topic);
          if (types[e.type] === undefined) problems.push(p + " type must be observe|test|apply|project"); else types[e.type]++;
          if (![1,2,3].includes(e.level)) problems.push(p + " level must be 1..3");
          if (!(typeof e.minutes === "number" && e.minutes >= 5 && e.minutes <= 240)) problems.push(p + " minutes must be 5..240");
          if (e.outcome !== undefined && OUTCOMES.indexOf(e.outcome) < 0) problems.push(p + " unknown outcome " + e.outcome + " (allowed: " + OUTCOMES.join(", ") + ")");
          bi(e.title, p + ".title", 1, 12); bi(e.question, p + ".question", 5, 40);
          biList(e.materials, p + ".materials", 2, 9); biList(e.steps, p + ".steps", 3, 8);
          if (!e.predict) problems.push(p + " predict missing"); else { mcq(e.predict, p + ".predict"); answers.push(e.predict.answer); }
          bi(e.observe, p + ".observe", 8, 90); bi(e.explain, p + ".explain", 20, 130);
          if (e.type === "test" && !e.measure) problems.push(p + " type test needs a measure text");
          if (e.measure !== undefined) bi(e.measure, p + ".measure", 8, 90);
          if (e.safety !== undefined) bi(e.safety, p + ".safety", 4, 60);
          if (e.tool !== undefined && TOOLS.indexOf(e.tool) < 0) problems.push(p + " unknown tool " + e.tool);
          if (e.sim !== undefined && SIMS.indexOf(e.sim) < 0) problems.push(p + " unknown sim " + e.sim);
        });
        if (types.test < 4) problems.push("need >= 4 experiments of type test (got " + types.test + ")");
        if (types.project < 3) problems.push("need >= 3 projects (got " + types.project + ")");
        if (answers.length >= 6 && new Set(answers).size < 3) problems.push("vary the correct prediction index");
        if (!problems.length) return "OK (" + list.length + " experiments: " + JSON.stringify(types) + ")";
      } else if (/^predictions/.test(base)) {
        var P = C.predictions, n = 0, ans = [];
        Object.keys(P).forEach(function(sim){
          if (SIMS.indexOf(sim) < 0) problems.push("unknown sim id " + sim);
          if (!Array.isArray(P[sim]) || !P[sim].length || P[sim].length > 3) problems.push(sim + ": needs 1–3 prompts");
          (P[sim]||[]).forEach(function(x, i){ var p = sim + "[" + i + "]"; n++; mcq(x, p); ans.push(x.answer); bi(x.try, p + ".try", 4, 45); bi(x.explain, p + ".explain", 8, 70); });
        });
        if (base === "predictions" && Object.keys(P).length < 18) problems.push("only " + Object.keys(P).length + " sims covered (need >= 18 in predictions.js)");
        if (ans.length >= 6 && new Set(ans).size < 3) problems.push("vary the correct option index");
        if (!problems.length) return "OK (" + n + " prompts for " + Object.keys(P).length + " sims)";
      } else if (base === "teaching") {
        var T = C.teaching;
        if (T.outcomes.length < 20) problems.push("only " + T.outcomes.length + " outcomes (need the full list: 22)");
        T.outcomes.forEach(function(o, i){ var p = "outcomes[" + i + "]";
          if (typeof o.code !== "string" || !/^FIZ OŠ /.test(o.code)) problems.push(p + ".code must start with FIZ OŠ");
          if (![7,8].includes(o.grade)) problems.push(p + ".grade must be 7 or 8");
          if (typeof o.hr !== "string" || words(o.hr) < 3) problems.push(p + ".hr missing"); if (typeof o.en !== "string" || words(o.en) < 3) problems.push(p + ".en missing");
          if (!Array.isArray(o.topics) || !o.topics.length) problems.push(p + ".topics empty"); else o.topics.forEach(function(t){ if (TOPICS.indexOf(t) < 0) problems.push(p + " unknown topic " + t); });
          if (!Array.isArray(o.sims) || !o.sims.length) problems.push(p + ".sims empty"); else o.sims.forEach(function(t){ if (SIMS.indexOf(t) < 0) problems.push(p + " unknown sim " + t); });
        });
        TOPICS.forEach(function(t){ var e = T.topics[t], p = "topics." + t; if (!e) { problems.push(p + " missing"); return; }
          bi(e.opening, p + ".opening", 15, 90); bi(e.question, p + ".question", 5, 40); bi(e.investigate, p + ".investigate", 20, 110); bi(e.keyIdea, p + ".keyIdea", 10, 70); bi(e.exit, p + ".exit", 6, 60); bi(e.watch, p + ".watch", 15, 90);
          if (!Array.isArray(e.talk) || e.talk.length < 2 || e.talk.length > 3) problems.push(p + ".talk needs 2–3 questions"); else e.talk.forEach(function(x, j){ bi(x, p + ".talk[" + j + "]", 5, 50); });
        });
        Object.keys(T.topics).forEach(function(k){ if (TOPICS.indexOf(k) < 0) problems.push("topics: unknown id " + k); });
        if (T.methods.length < 7) problems.push("only " + T.methods.length + " methods (need >= 7)");
        var mids = {};
        T.methods.forEach(function(m, i){ var p = "methods[" + (m.id || i) + "]"; if (!m.id || mids[m.id]) problems.push(p + " missing/duplicate id"); mids[m.id] = 1; bi(m.name, p + ".name"); bi(m.origin, p + ".origin"); bi(m.idea, p + ".idea", 8, 60); biList(m.steps, p + ".steps", 3, 8); bi(m.inApp, p + ".inApp", 6, 60); });
        if (T.resources.length < 6) problems.push("only " + T.resources.length + " resources (need >= 6)");
        T.resources.forEach(function(r, i){ var p = "resources[" + i + "]"; if (typeof r.name !== "string" || !r.name) problems.push(p + ".name missing"); if (typeof r.by !== "string" || !r.by) problems.push(p + ".by missing"); if (typeof r.url !== "string" || !/^https:\/\//.test(r.url)) problems.push(p + ".url must be https"); bi(r.note, p + ".note", 5, 40); });
        if (!problems.length) return "OK (" + T.outcomes.length + " outcomes, " + Object.keys(T.topics).length + " topic outlines, " + T.methods.length + " methods, " + T.resources.length + " resources)";
      } else if (base === "summaries2") {
        var S = C.summaries;
        ["science","homelab"].forEach(function(t){ var e = S[t]; if (!e) { problems.push("missing summary for " + t); return; }
          var b = e.bullets; if (!b || !Array.isArray(b.en) || !Array.isArray(b.hr) || b.en.length !== b.hr.length || b.en.length < 4 || b.en.length > 6) problems.push(t + ".bullets need 4–6 per language, same count");
          var m = e.misconceptions; if (!Array.isArray(m) || m.length < 2 || m.length > 4) problems.push(t + ".misconceptions need 2–4"); else m.forEach(function(x, i){ bi(x.myth, t + ".myth[" + i + "]", 3); bi(x.truth, t + ".truth[" + i + "]", 5); });
        });
        if (!problems.length) return "OK (summaries for " + Object.keys(S).join(", ") + ")";
      } else return "unknown file type: " + base;
      return "PROBLEMS:\n  - " + problems.join("\n  - ");
    }' "$f" 2>&1)
  case "$res" in OK*) echo "OK       $f  $res";; *) echo "FAIL     $f"; echo "$res"; status=1;; esac
done
exit $status
