#!/usr/bin/env python3
"""Build dist/artifact.html from index.html for publishing as a Claude artifact.
The artifact host wraps the page in its own <!doctype html><html><head><body> skeleton,
so we strip ours and keep <title>, <meta name="claude:...">, <link>s, body content and scripts.
Also drops <script> tags whose file does not exist (so missing sims/topics don't 404)."""
import os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
head = re.search(r'<head>(.*?)</head>', src, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', src, re.S).group(1)
keep = []
for m in re.finditer(r'<title>.*?</title>|<(?:meta|link)\b[^>]*>', head, re.S):
    tag = m.group(0)
    if tag.startswith('<meta') and ('charset' in tag or 'name="viewport"' in tag):
        continue
    keep.append(tag)
missing = []
def drop_missing(m):
    rel = m.group(1)
    if not os.path.exists(os.path.join(root, rel)):
        missing.append(rel); return ''
    return m.group(0)
body = re.sub(r'<script src="([^"]+)"></script>\n?', drop_missing, body)
out = '\n'.join(keep) + '\n' + body.strip() + '\n'
os.makedirs(os.path.join(root, 'dist'), exist_ok=True)
open(os.path.join(root, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(out)
print('dist/artifact.html written (%d bytes)' % len(out))
if missing: print('dropped missing scripts:', ', '.join(missing))
