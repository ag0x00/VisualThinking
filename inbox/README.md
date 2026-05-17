---
title: Inbox
tags: [meta, inbox]
---

# Inbox

Drop zone for incoming documents that aren't yet wiki pages. Anything in here is **queued for ingestion**, not the archive.

## What goes here
- PDFs, scanned notes, screenshots
- Markdown drafts, transcripts, exported chats
- Anything you'd hand off to `claude-obsidian:wiki-ingest`

URLs do **not** belong here — fetch them directly through Claude (`/wiki-ingest <url>` or by asking).

## Two-stage flow

```
inbox/  ──(ingest)──►  wiki/<branch>/<page>.md   (cross-referenced wiki pages)
              │
              └──────►  wiki/sources/<original>   (canonical archive of the raw source)
```

After ingestion:
1. The source moves from `inbox/` to `wiki/sources/` (preserves the original verbatim).
2. New wiki pages appear in `wiki/concepts/`, `wiki/entities/`, `wiki/tools/`, etc.
3. `wiki/log.md` gets an entry; `wiki/index.md` may be updated; `.raw/.manifest.json` records the source.

## Not for this folder
- Direct wiki pages — write those under `wiki/<branch>/`.
- Generated assets from canvas / banana / Excalidraw — those live alongside the canvas they belong to.
- DragonScale runtime state — that's `.vault-meta/`.
