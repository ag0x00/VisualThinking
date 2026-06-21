---
name: test-artifact-vs-workflow
description: "Test artifacts (screensaver, demo) are not the goal — they are vehicles for surfacing what works/doesn't in the wiki+MCP+toolkit workflow. The workflow is the product."
metadata:
  node_type: memory
  type: feedback
---

When a session is structured as "let's build X" (where X is a concrete artifact like a screensaver, demo, or proof-of-concept), the artifact is rarely the actual goal. It's a test case for the underlying workflow: wiki design → MCP surfacing → toolkit consumption → user experience. **The workflow is the product.**

**Why:** During the toolkit-screensaver brainstorm 2026-05-18, three wrong mental models survived for hours because I treated the screensaver as the primary deliverable. The user redirected mid-session: "the goal of this exercise is NOT to build a screensaver, actually. it's to figure out what works and what doesn't in our wiki+mcp+toolkit approach. notice that we haven't identified anything for the toolkit yet during this session." That reframing instantly clarified what was missing: npm-search audit not done, library landscape uncatalogued, implementation-depth wiki content absent, `wiki_orient` failing on tradition-specific queries.

**How to apply:**

1. When a session is structured as "let's build X", periodically ask: **what does X being built actually validate or invalidate about the workflow underneath?**
2. Audit gaps in the workflow as **first-class deliverables** alongside the artifact:
   - Which MCP queries returned good results? Which missed? (Log misses to `mcp/tasks/lessons.md`.)
   - Which wiki pages were under-deep for the build phase? (Augment them with implementation landscape sections.)
   - Which conventions were under-applied? (`feedback_catalog-stub-cross-check` is famous for being skipped before the build phase, not just during the catalog phase.)
   - Where did the visual companion / iterative drawing catch wrong models?
3. **Real deliverables of a "build X" session include**:
   - Refined wiki content (more depth where it was thin)
   - MCP refinement items (lessons.md)
   - Library landscape insight (new tool pages, new build-vs-borrow guidance)
   - Design-pattern lessons (new feedback memories)
   - The artifact is **one of many outputs**, not the sole output.
4. Don't optimize for the artifact at the expense of the workflow learnings. If the artifact ships but the workflow remains untested, the session has failed even if the artifact is beautiful.

Related: [[design-for-consumer]] (consumer-side workflow design), [[catalog-stub-cross-check]] (npm-search audit convention), [[npm-audit-before-design]] (extension of catalog-stub-cross-check to build phases), [[brainstorm-state]] (current in-flight state).
