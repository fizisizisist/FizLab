#!/bin/bash
# Validate js/content/scientists.js and/or js/content/summaries.js
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
      var TOPICS = ["matter","density","motion","forces","gravity","pressure","levers","energy","heat","electricity","magnetism","waves","light","space"];
      function bi(o, path, minLen, maxLen) {
        if (!o || typeof o !== "object") { problems.push(path + ": missing bilingual object"); return; }
        ["en","hr"].forEach(function(l){
          if (typeof o[l] !== "string" || !o[l].trim()) problems.push(path + "." + l + ": missing text");
          else { var n = o[l].trim().split(/\s+/).length; if (minLen && n < minLen) problems.push(path + "." + l + ": too short (" + n + " words)"); if (maxLen && n > maxLen) problems.push(path + "." + l + ": too long (" + n + " words)"); }
        });
      }
      var C = window.Content;
      if (/scientists\.js$/.test(file)) {
        var list = C.scientists;
        if (list.length < 14) problems.push("only " + list.length + " scientists (need >= 14)");
        var ids = {};
        list.forEach(function(s, i){
          var p = "[" + (s.id || i) + "]";
          if (!s.id || ids[s.id]) problems.push(p + " missing/duplicate id"); ids[s.id] = 1;
          if (typeof s.name !== "string" || !s.name) problems.push(p + " name missing");
          if (!Number.isInteger(s.born)) problems.push(p + " born must be a year");
          if (!(s.died === null || Number.isInteger(s.died))) problems.push(p + " died must be a year or null");
          bi(s.country, p + ".country"); bi(s.field, p + ".field"); bi(s.known, p + ".known", 3, 30); bi(s.bio, p + ".bio", 55, 130); bi(s.fact, p + ".fact", 6, 60);
          if (!Array.isArray(s.topics) || !s.topics.length) problems.push(p + " topics empty");
          else s.topics.forEach(function(t){ if (TOPICS.indexOf(t) < 0) problems.push(p + " unknown topic id " + t); });
          if (typeof s.croatia !== "boolean") problems.push(p + " croatia must be true/false");
        });
        if (!list.some(function(s){ return s.croatia; })) problems.push("no Croatian-connected scientists marked croatia: true");
        if (!problems.length) return "OK (" + list.length + " scientists, " + list.filter(function(s){return s.croatia;}).length + " with a Croatian connection)";
      } else {
        var S = C.summaries;
        TOPICS.forEach(function(t){
          var e = S[t]; if (!e) { problems.push("missing summary for topic " + t); return; }
          var b = e.bullets;
          if (!b || !Array.isArray(b.en) || !Array.isArray(b.hr)) problems.push(t + ".bullets must have en/hr arrays");
          else { if (b.en.length !== b.hr.length) problems.push(t + ".bullets: en/hr counts differ"); if (b.en.length < 4 || b.en.length > 6) problems.push(t + ".bullets: need 4–6 (got " + b.en.length + ")"); b.en.concat(b.hr).forEach(function(x, i){ if (typeof x !== "string" || x.trim().split(/\s+/).length < 5) problems.push(t + ".bullets[" + i + "] too short"); }); }
          var m = e.misconceptions;
          if (!Array.isArray(m) || m.length < 2 || m.length > 4) problems.push(t + ".misconceptions: need 2–4");
          else m.forEach(function(x, i){ bi(x.myth, t + ".misconceptions[" + i + "].myth", 3); bi(x.truth, t + ".misconceptions[" + i + "].truth", 5); });
        });
        Object.keys(S).forEach(function(k){ if (TOPICS.indexOf(k) < 0) problems.push("unknown topic id " + k); });
        if (!problems.length) return "OK (summaries for " + Object.keys(S).length + " topics)";
      }
      return "PROBLEMS:\n  - " + problems.join("\n  - ");
    }' "$f" 2>&1)
  case "$res" in OK*) echo "OK       $f  $res";; *) echo "FAIL     $f"; echo "$res"; status=1;; esac
done
exit $status
