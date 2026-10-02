# AWS Learning Hub

Personal AWS learning website hosted on GitHub Pages.

## Files

- `index.html` → website structure and rendering logic
- `style.css` → design/theme only
- `topics.js` → **all AWS topic content**

## How to add/edit a topic

Normally you only edit `topics.js`.

Each topic uses the same format:

```js
{
  id: "unique-id",
  number: "10",
  title: "New Topic",
  concept: "...",
  simple: "...",
  company: "...",
  practical: ["...", "..."],
  commands: ["...", "..."],
  steps: ["...", "..."],
  mistakes: ["...", "..."],
  interview: ["...", "..."],
  notes: ["...", "..."]
}
```

After editing, commit the files to GitHub. GitHub Pages will deploy the updated site.

## Important

Do not run `mkfs` on a volume that contains data unless you intentionally want to erase/recreate its filesystem.
