---
name: one-click-primary-sources
description: "When surfacing a concept/technique/tool, expose external primary-source URLs directly, not behind a graph-traversal step"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

When a learner is presented with a concept, technique, or tool they may not be familiar with, the original external source (paper, official documentation, repo, spec) must be **one click away** — surfaced directly in the API response, not buried behind a "fetch related Source page first, then read its URL" indirection.

**Why:** The user gave this feedback 2026-05-17 while approving the wiki-MCP design. They explicitly want to be able to reintroduce themselves on specifics without a multi-hop navigation. The two-hop pattern (Concept → cited wiki Source page → external URL) preserves graph-traversal utility, but the flat one-hop pattern is what the artist actually wants at the moment of curiosity.

**How to apply:**

- Every consumer-facing API response that includes a Concept / Technique / Tool should also include a `primarySources` (or equivalent) field with `ExternalSourceRef[]` — external URLs directly.
- Populate `primarySources` from multiple signals merged and deduped (page's inline `## Sources` citations + linked Source-page URL fields + auto-constructed package URLs for tools).
- Keep the graph-traversal pointer (`citedBy: PageRef[]`) for navigation, but surface the flat external-URL view as the primary affordance.
- Cap to a reasonable number (e.g., 10) per response; offer an `getAll*` escape hatch if needed.

This applies to the in-progress wiki MCP server's `Concept`, `Tool`, `Technique` responses. It generalizes to any future API where learners encounter unfamiliar terms.

Related: [[design-for-consumer]] is the broader pattern this belongs to — design for what the user does at each moment, not the data model's shape.
