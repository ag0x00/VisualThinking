---
name: source-fetch-fallback
description: "Two-tier fallback when WebFetch fails on a primary source — try browser/Playwright, else log URL with a gap callout for manual fetch"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

When `WebFetch` fails on a primary-source URL (binary corruption, 403, redirect-loop, paywall), use this fallback ladder before giving up or substituting secondary sources:

1. **Try Firecrawl** if `mcp__firecrawl__firecrawl_scrape` is available — different fetcher, often succeeds where WebFetch fails on PDF endpoints and JS-heavy pages.
2. **Try Playwright** if `mcp__playwright__*` is available — `browser_navigate` + `browser_snapshot` + `browser_take_screenshot` for sites that need a real browser to render.
3. **Log the URL with a `> [!gap]` callout on the page that depends on the source.** Pin the canonical access URL and explicitly mark the relevant claims as **secondary-source confidence** until the primary text is verified. The user has agreed to fetch manually when this happens.

**Why:** User explicitly enabled this fallback 2026-05-17 ("if Fetch fails you can try browser use, or if all else fails, log the URL and I'll fetch them manually"). The motivation is that **substituting secondary sources without flagging it silently degrades wiki claim-confidence** — Phase 1 of Option C surfaced this exact problem with Cramer 2014 and Galanter 2003. Logging the URL with a gap callout is honest; silently relying on secondary summaries is the prior failure mode the methodology fix is correcting.

**How to apply:**

- Source pages that rely on secondary summaries (because primary fetch failed) must carry a `> [!gap]` callout naming the URL, the failure mode, and the canonical landing page for manual fetch.
- The frontmatter of such a source page should mark `confidence: medium` (not `high`) until primary text is verified.
- When the user does fetch and provides the PDF locally, ingest it (Read tool with `pages:` param for large PDFs), rewrite the source page with verbatim quotes, promote `confidence` to `high`, and remove the gap callout.
- The author's own re-statements of their thesis (italicized passages, abstract, conclusion) are the most useful quotes to anchor with — they let downstream wiki pages cite the *author's words*, not a paraphrase.

**Pattern memorialized for Phase 4 methodology lock-in.** Related: [[catalog-stub-cross-check]], [[framing-canonicity]].
