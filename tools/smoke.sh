#!/bin/bash
# Headless-Chrome smoke test for a sim: loads dev-sim.html?sim=<id>&auto=1, runs the automated
# sequence (mount, setLang, setTheme, reset, poke controls, pointer drag, destroy, remount) and
# reports console errors / page errors.  usage: tools/smoke.sh <id> [<id> ...]
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome not found; skipping smoke test"; exit 0; }
PORT=8799
# start a throwaway static server if nothing answers on the port
if ! curl -s -o /dev/null "http://127.0.0.1:$PORT/dev-sim.html"; then
  (cd "$ROOT" && python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &)
  for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null "http://127.0.0.1:$PORT/dev-sim.html" && break; sleep 0.3; done
fi
status=0
TMPD="$(mktemp -d)"
for id in "$@"; do
  out="$TMPD/$id.log"
  "$CHROME" --headless=new --disable-gpu --no-first-run --no-default-browser-check --hide-scrollbars \
    --user-data-dir="$TMPD/profile-$id" --enable-logging=stderr --v=0 --window-size=1100,800 \
    --virtual-time-budget=9000 --dump-dom "http://127.0.0.1:$PORT/dev-sim.html?sim=$id&auto=1" >"$TMPD/$id.dom" 2>"$out"
  errs=$(grep -E 'CONSOLE' "$out" | grep -E -i 'uncaught|error|exception|is not|undefined|NaN' | grep -v -E 'favicon|fonts.g|net::ERR' | sed -E 's/^\[[^]]*\] //' | head -20)
  pre=$(python3 -c "import re,sys,html; d=open(sys.argv[1],encoding='utf-8',errors='replace').read(); m=re.search(r'<pre id=\"err\">(.*?)</pre>', d, re.S); print(html.unescape(m.group(1)).strip() if m else '(no #err element)')" "$TMPD/$id.dom")
  done_ok=$(echo "$pre" | grep -c 'SMOKE DONE')
  fail=$(echo "$pre" | grep -c -E 'STEP FAILED|threw|did not register|Could not load|Error')
  if [ -n "$errs" ] || [ "$fail" != "0" ] || [ "$done_ok" = "0" ]; then
    status=1
    echo "FAIL     $id"
    [ -n "$errs" ] && echo "$errs" | sed 's/^/    console: /'
    echo "$pre" | sed 's/^/    page: /'
  else
    echo "OK       $id   ($(echo "$pre" | grep -c '\[auto\]') auto steps passed)"
  fi
done
rm -rf "$TMPD"
exit $status
