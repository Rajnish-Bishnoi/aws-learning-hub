# AWS Learning Hub

Folder layout:
- index.html, style.css, app.js  -> the engine (do not touch)
- content/manifest.json          -> sidebar: topics and their lessons
- content/<topic>/<lesson>.json  -> one file per lesson

## Add a new lesson (3 steps, all on GitHub web)
1. Copy content/_template.json to content/compute/ec2.json and fill it.
2. Open content/manifest.json and add under the topic:
   {"id":"ec2","title":"Amazon EC2","file":"compute/ec2.json"}
3. Commit. The site updates in 1-2 minutes.

Tab names are the keys inside "tabs". Use any tabs you want.
Block types: text (default, field p), list, steps, table, code, qa, flow.
Add "w":"full" to make a card full width. Add "c":"blue|green|orange|red|purple" to set colour.
Test locally with: python -m http.server  (then open localhost:8000). Double-click on index.html will not load JSON.
