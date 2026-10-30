#!/bin/bash
# Validate js/content/concepts.js
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
      var TOPICS = ["matter","density","motion","forces","gravity","pressure","levers","energy","heat","electricity","magnetism","waves","light","space","science"];
      function bi(o, path, minLen) { if (!o || typeof o !== "object") { problems.push(path + ": missing bilingual object"); return; } ["en","hr"].forEach(function(l){ if (typeof o[l] !== "string" || !o[l].trim()) problems.push(path + "." + l + ": missing"); else if (minLen && o[l].trim().length < minLen) problems.push(path + "." + l + ": too short"); }); }
      var list = window.Content.concepts, ids = {}, counts = {mc:0, rank:0, num:0}, perTopic = {};
      if (list.length < 24) problems.push("only " + list.length + " questions (need >= 24)");
      list.forEach(function(c, i){
        var p = "[" + (c.id || i) + "]";
        if (!c.id || ids[c.id]) problems.push(p + " missing/duplicate id"); ids[c.id] = 1;
        if (TOPICS.indexOf(c.topic) < 0) problems.push(p + " unknown topic " + c.topic); else perTopic[c.topic] = (perTopic[c.topic]||0) + 1;
        if (![1,2,3].includes(c.level)) problems.push(p + " level must be 1..3");
        bi(c.q, p + ".q", 15); bi(c.explain, p + ".explain", 30);
        if (c.type === "mc") { counts.mc++;
          if (!Array.isArray(c.options) || c.options.length < 3 || c.options.length > 4) problems.push(p + " mc needs 3–4 options"); else c.options.forEach(function(o,j){ bi(o, p + ".options[" + j + "]"); });
          if (!(Number.isInteger(c.answer) && c.answer >= 0 && c.answer < (c.options||[]).length)) problems.push(p + ".answer out of range");
          if (c.misconception !== undefined) bi(c.misconception, p + ".misconception", 15);
        } else if (c.type === "rank") { counts.rank++;
          if (!Array.isArray(c.items) || c.items.length < 3 || c.items.length > 5) problems.push(p + " rank needs 3–5 items"); else c.items.forEach(function(o,j){ bi(o, p + ".items[" + j + "]"); });
        } else if (c.type === "num") { counts.num++;
          if (typeof c.answer !== "number" || typeof c.min !== "number" || typeof c.max !== "number" || !(c.min <= c.answer && c.answer <= c.max)) problems.push(p + " num needs answer, min, max with min <= answer <= max");
          if (typeof c.unit !== "string") problems.push(p + " unit must be a string (may be empty)");
        } else problems.push(p + " type must be mc, rank or num");
      });
      if (counts.rank < 4) problems.push("need >= 4 ranking tasks (got " + counts.rank + ")");
      if (counts.num < 4) problems.push("need >= 4 estimation tasks (got " + counts.num + ")");
      if (!problems.length) return "OK (" + list.length + " questions: " + counts.mc + " mc / " + counts.rank + " rank / " + counts.num + " num; topics: " + Object.keys(perTopic).length + ")";
      return "PROBLEMS:\n  - " + problems.join("\n  - ");
    }' "$f" 2>&1)
  case "$res" in OK*) echo "OK       $f  $res";; *) echo "FAIL     $f"; echo "$res"; status=1;; esac
done
exit $status
