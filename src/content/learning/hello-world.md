---
type: "writing"
title: "Hello — this is dummy copy"
description: "Placeholder post proving the markdown pipeline works. Swap this file's content for real writing whenever you're ready."
date: 2026-07-20
tags: []
---

This post is a **placeholder**. It exists so the Continuous Learning page has something to render while the markdown pipeline gets wired up — not because there's real writing here yet.

## How this works

Every entry in this section — project or post — is one `.md` file inside `src/content/learning/`. Add a new file, fill in the front matter, write the body — it shows up on `/learning/` automatically, newest first.

Front matter fields:

- `type` — `"project"` or `"writing"`
- `title` — shows in the list and the detail page
- `description` — the one-line summary in the list
- `date` — controls sort order
- `org` — optional, the company/place a project belongs to
- `draft` — set `true` to hide an entry without deleting it
- `tags` — optional, shown as small labels

## What renders

Standard markdown: headings, `code`, lists, blockquotes.

> A blockquote, for when a line deserves its own weight.

```ts
const isDummy = true;
```

Delete this file (or set `draft: true`) once real writing replaces it.
