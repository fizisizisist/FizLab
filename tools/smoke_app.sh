#!/bin/bash
# Headless-Chrome smoke test of the full app: loads index.html at several routes and reports
# console errors (404s for not-yet-written files are listed separately).
# usage: tools/smoke_app.sh [route ...]   (default: a standard set of routes)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome not found"; exit 0; }
PORT=8799
if ! curl -s -o /dev/null "http://127.0.0.1:$PORT/index.html"; then
  (cd "$ROOT" && python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &)
  for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null "http://127.0.0.1:$PORT/index.html" && break; sleep 0.3; done
fi
ROUTES=("$@"); [ ${#ROUTES[@]} -eq 0 ] && ROUTES=(home forces forces-sim forces-quiz forces-home glossary formulas flashcards progress mix challenge)
TMPD="$(mktemp -d)"; status=0
for r in "${ROUTES[@]}"; do
  "$CHROME" --headless=new --disable-gpu --no-first-run --hide-scrollbars --user-data-dir="$TMPD/p-$r" \
    --enable-logging=stderr --v=0 --window-size=1200,900 --virtual-time-budget=5000 --dump-dom \
    "http://127.0.0.1:$PORT/index.html#$r" >"$TMPD/$r.dom" 2>"$TMPD/$r.log"
  errs=$(grep -E 'CONSOLE' "$TMPD/$r.log" | grep -v -E 'Failed to load resource|favicon|fonts.g' | grep -E -i 'uncaught|error|exception|is not|undefined|NaN' | sed -E 's/^\[[^]]*\] //' | head -12)
  n404=$(grep -c -E 'Failed to load resource' "$TMPD/$r.log")
  main=$(python3 -c "import re,sys; d=open(sys.argv[1],encoding='utf-8',errors='replace').read(); m=re.search(r'<main[^>]*>(.*?)</main>', d, re.S); s=re.sub(r'<[^>]+>',' ',m.group(1)) if m else ''; print(len(s.split()))" "$TMPD/$r.dom")
  if [ -n "$errs" ] || [ "$main" -lt 5 ]; then status=1; echo "FAIL     #$r  (main has $main words, $n404 missing files)"; echo "$errs" | sed 's/^/    /'; else echo "OK       #$r  (main has $main words, $n404 missing files)"; fi
done
rm -rf "$TMPD"; exit $status
