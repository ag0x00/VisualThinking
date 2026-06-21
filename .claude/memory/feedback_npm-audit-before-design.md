---
name: npm-audit-before-design
description: "Run npm-search audit BEFORE designing or drawing, not just before cataloging. Extends the catalog-stub-cross-check convention to build phases."
metadata:
  node_type: memory
  type: feedback
---

The [[catalog-stub-cross-check]] convention (npm-search audit at depth-dive completion) extends to **build phases** too. Before designing toolkit APIs, drawing mockups, or writing implementation code, search npm + GitHub for relevant existing libraries.

**Why:** During the toolkit-screensaver brainstorm 2026-05-18, I drew three rounds of SVG mockups for Islamic geometric pattern (IGP) geometry before searching for existing JS/TS IGP libraries. The user — not me — eventually surfaced Alzulejo, Alhambra, IkarosKappler/girih, plus recommended a broader hunt. A 10-minute parallel-subagent npm audit at the **start** of the session would have revealed:

- `tactile-js` (Craig Kaplan, BSD-3, 240 stars) — the canonical academic library to port from
- `wallpaper-groups` (npm, MIT) — pragmatic transform tables
- `PlotBoilerplate` (IkarosKappler, MIT, TS, npm, active 2026) — modern geometry substrate by the same author as the dormant girih repo
- Alhambra's `infer.h` + `rosette.h` + `inflation_tiling.h` (Bridges 2000 paper algorithms, GPL code) — port from paper, not from code

Three hours of wrong-direction brainstorming (rhomb-merges → tile-vocabulary → lines-first) would have collapsed to "here's the library landscape, here's the gap our toolkit fills, let's design the API."

**How to apply:** At the start of any "build X" session where X involves a well-defined domain (IGP, color science, audio analysis, pose estimation, etc.):

1. **Dispatch 3-5 parallel research subagents** at ~10-min wall-clock each:
   - One per named/likely candidate library
   - One for broader npm/GitHub hunt across relevant keywords
2. Each agent returns a structured report against the [[Library Evaluation Rubric]] (c-000219): license, last commit, API surface, math worth borrowing, gaps, verdict
3. **Synthesize into a research synthesis page** in `wiki/questions/Research - <topic> Library Landscape <YYYY-MM-DD>.md`
4. **Augment relevant concept and technique pages** with an "Implementation landscape" section pointing to the new tool pages
5. **Then** decide build vs borrow vs port
6. **Then** start designing or drawing

This is much cheaper than building on wrong assumptions. The cost is ~15-30 minutes of wall-clock + the parallel subagent token spend; the avoided cost is hours of misdirected design.

**Generalization**: this applies to any domain where significant prior art is likely. Symptoms of a session that should have done this:
- Drawing mockups for problems that pre-existing libraries already solve
- Designing APIs that mirror existing libraries' APIs by accident
- The user surfaces libraries we should have found ourselves
- The wiki has concept-depth but no tool-page-depth for the domain

Related: [[catalog-stub-cross-check]] (the parent convention this extends), [[test-artifact-vs-workflow]] (why the artifact-vs-workflow framing matters), [[design-for-consumer]], [[Library Evaluation Rubric]] (c-000219).
