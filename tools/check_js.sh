#!/bin/bash
# Syntax-check JS files with macOS JavaScriptCore (no node needed).
# usage: tools/check_js.sh file.js [more.js ...]
status=0
for f in "$@"; do
  if [ ! -f "$f" ]; then echo "MISSING  $f"; status=1; continue; fi
  res=$(osascript -l JavaScript -e '
    ObjC.import("Foundation");
    function run(argv) {
      var s = $.NSString.stringWithContentsOfFileEncodingError(argv[0], $.NSUTF8StringEncoding, null);
      var src = ObjC.unwrap(s);
      if (!src) return "READ ERROR";
      try { new Function(src); return "OK"; } catch (e) { return "SYNTAX ERROR: " + e.message; }
    }' "$f" 2>&1)
  if [ "$res" = "OK" ]; then echo "OK       $f"; else echo "FAIL     $f -> $res"; status=1; fi
done
exit $status
