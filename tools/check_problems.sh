#!/bin/bash
# Validate a FizLab practice-problem file: syntax + structure + 40 random instances per template in both languages.
# usage: tools/check_problems.sh js/problems/<topic>.js
status=0
for f in "$@"; do
  if [ ! -f "$f" ]; then echo "MISSING  $f"; status=1; continue; fi
  res=$(osascript -l JavaScript -e '
    ObjC.import("Foundation");
    function read(p){ var s=$.NSString.stringWithContentsOfFileEncodingError(p,$.NSUTF8StringEncoding,null); return ObjC.unwrap(s); }
    function run(argv) {
      var file = argv[0], problems = [];
      var window = {}; var console = { error: function(m){ problems.push("console.error: "+m); }, warn: function(m){ problems.push("console.warn: "+m); }, log: function(){} };
      var dir = file.replace(/js\/problems\/[^\/]+$/, "");
      try {
        (new Function("window","console", read(dir + "js/content/_registry.js")))(window, console);
        (new Function("window","console", read(file)))(window, console);
      } catch (e) { return "SYNTAX/RUNTIME ERROR: " + e.message; }
      var base = file.replace(/^.*\//, "").replace(/\.js$/, "");
      var keys = Object.keys(window.Content.problems);
      if (keys.length !== 1 || keys[0] !== base) return "expected registerProblems(\"" + base + "\", ...) exactly once, got: " + JSON.stringify(keys);
      var list = window.Content.problems[base];
      if (list.length < 6) problems.push("only " + list.length + " templates (need 7–9)");
      var seed = 0x9e3779b9; function rnd(){ seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
      var R = { int: function(a,b){ return a + Math.floor(rnd()*(b-a+1)); }, step: function(a,b,s){ var n = Math.round((b-a)/s); var v = a + s*Math.floor(rnd()*(n+1)); var d = (String(s).split(".")[1]||"").length; return parseFloat(v.toFixed(d)); }, pick: function(arr){ return arr[Math.floor(rnd()*arr.length)]; }, float: function(a,b,d){ return parseFloat((a + rnd()*(b-a)).toFixed(d===undefined?1:d)); } };
      function fmtEn(v, d){ if (typeof v !== "number" || !isFinite(v)) return "NaN"; if (d===undefined){ var r=Math.round(v*100)/100; d = Number.isInteger(r)?0:(Math.abs(r*10-Math.round(r*10))<1e-9?1:2);} return v.toFixed(d); }
      function fmtHr(v, d){ return fmtEn(v, d).replace(".", ","); }
      var ids = {}; var levels = {1:0,2:0,3:0};
      list.forEach(function(t, i){
        var p = "[" + (t.id || i) + "]";
        if (!t.id) problems.push(p + " missing id"); else if (ids[t.id]) problems.push(p + " duplicate id"); ids[t.id] = 1;
        if (![1,2,3].includes(t.level)) problems.push(p + " level must be 1, 2 or 3"); else levels[t.level]++;
        if (typeof t.params !== "function") { problems.push(p + " params must be a function"); return; }
        ["text","steps"].forEach(function(k){ if (!t[k] || typeof t[k].en !== "function" || typeof t[k].hr !== "function") problems.push(p + " " + k + ".en/.hr must be functions"); });
        if (typeof t.answer !== "function") problems.push(p + " answer must be a function");
        if (!(typeof t.unit === "string" || (t.unit && typeof t.unit.en === "string" && typeof t.unit.hr === "string"))) problems.push(p + " unit missing");
        if (!t.hint || typeof t.hint.en !== "string" || typeof t.hint.hr !== "string" || !t.hint.en.trim() || !t.hint.hr.trim()) problems.push(p + " hint.en/.hr missing");
        if (t.tol !== undefined && !(typeof t.tol === "number" && t.tol > 0 && t.tol < 0.5)) problems.push(p + " tol must be a number between 0 and 0.5");
        if (t.abs !== undefined && !(typeof t.abs === "number" && t.abs >= 0)) problems.push(p + " abs must be a number");
        var texts = {}; var answers = [];
        for (var n = 0; n < 40; n++) {
          var par; try { par = t.params(R); } catch (e) { problems.push(p + " params threw: " + e.message); break; }
          if (!par || typeof par !== "object") { problems.push(p + " params must return an object"); break; }
          var ans; try { ans = t.answer(par); } catch (e) { problems.push(p + " answer threw: " + e.message); break; }
          if (typeof ans !== "number" || !isFinite(ans)) { problems.push(p + " answer not a finite number for params " + JSON.stringify(par)); break; }
          if (ans <= 0 && t.abs === undefined) { problems.push(p + " answer " + ans + " is not positive (set abs tolerance if 0 or negative answers are intended) for " + JSON.stringify(par)); break; }
          if (Math.abs(ans) < 0.05 && t.abs === undefined) { problems.push(p + " answer " + ans + " is tiny; convert units or set abs"); break; }
          answers.push(ans);
          var bad = false;
          ["en","hr"].forEach(function(l){
            try {
              var fmt = l === "hr" ? fmtHr : fmtEn; var s = t.text[l](par, fmt); var st = t.steps[l](par, fmt);
              if (typeof s !== "string" || s.length < 20) { problems.push(p + " text." + l + " too short"); bad = true; }
              if (/NaN|undefined|null|\[object/.test(s)) { problems.push(p + " text." + l + " contains NaN/undefined: " + s); bad = true; }
              if (!Array.isArray(st) || st.length < 2) { problems.push(p + " steps." + l + " must be an array of >= 2 lines"); bad = true; }
              else st.forEach(function(line){ if (typeof line !== "string" || /NaN|undefined|null|\[object/.test(line)) { problems.push(p + " steps." + l + " bad line: " + line); bad = true; } });
              if (l === "hr" && /\d\.\d/.test(s)) { problems.push(p + " text.hr has a hard-coded decimal point (use f()): " + s.match(/\d\.\d+/)[0]); bad = true; }
              if (l === "hr" && Array.isArray(st) && st.some(function(line){ return /\d\.\d/.test(line); })) { problems.push(p + " steps.hr has a hard-coded decimal point (use f())"); bad = true; }
              texts[l] = texts[l] || {}; texts[l][s] = 1;
            } catch (e) { problems.push(p + " " + l + " text/steps threw: " + e.message); bad = true; }
          });
          if (bad) break;
        }
        if (texts.en && Object.keys(texts.en).length < 3) problems.push(p + " numbers never vary (only " + Object.keys(texts.en).length + " distinct texts in 40 tries)");
      });
      if (levels[1] < 2 || levels[2] < 2 || levels[3] < 1) problems.push("level mix: need >= 2 level-1, >= 2 level-2, >= 1 level-3 (got " + JSON.stringify(levels) + ")");
      if (!problems.length) return "OK (" + list.length + " templates: " + levels[1] + " L1 / " + levels[2] + " L2 / " + levels[3] + " L3)";
      return "PROBLEMS:\n  - " + problems.join("\n  - ");
    }' "$f" 2>&1)
  case "$res" in OK*) echo "OK       $f  $res";; *) echo "FAIL     $f"; echo "$res"; status=1;; esac
done
exit $status
