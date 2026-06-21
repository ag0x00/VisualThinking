---
name: catalog-stub-cross-check
description: Depth-dive synthesis pages must cross-check the catalog stubs they cover for scope items that were dropped
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

When a clustered depth-dive runs, the synthesis page **must explicitly cross-check the catalog stubs** the cluster covers and account for every scope item named in those stubs. If the sweep intentionally narrows the stub's scope, the synthesis must say so explicitly with a justification.

**Why:** User caught (2026-05-17) that the original Algorithmic Composition + Tools sweep dropped the p5.js plugin galaxy (p5.brush, p5.sound, p5.play, p5.capture, etc.) and the three.js addon ecosystem (drei, postprocessing, troika-three-text, etc.) — both were explicitly scoped in the [[Algorithmic Composition]] catalog stub. The sweep also missed q5.js (a major WebGPU-powered p5.js sibling) and react-three-fiber (the canonical React paradigm for three.js). User had to flag this and request an addendum sweep.

The root cause: the depth-dive evaluated *what I happened to think of first*, not *everything the catalog stub listed*. Without an explicit cross-check step, items in the stub get dropped silently.

**How to apply:**

- At the **start** of every clustered depth-dive: re-read each catalog stub in the cluster and produce an explicit *coverage list* of what will be evaluated.
- In the **synthesis page**: include a section like "Coverage vs catalog stub" that confirms every named scope item was addressed or explicitly deferred (with justification).
- If a depth-dive narrows the stub's scope (e.g., "we'll cover paradigms but not the plugin ecosystems"), say so plainly at sweep-planning time so the user can object.
- This applies retroactively: if I notice missed scope items mid-sweep, do an in-sweep addendum rather than waiting for user audit.

**Additional rule for library / ecosystem sweeps**: do an **npm-search audit** at depth-dive completion. Search by relevant keywords (e.g., `keywords:three`, `keywords:p5`), scan top-page hits, fill gaps. Purely-from-memory listings reliably miss heavily-used production tools — caught twice by user on 2026-05-17 (p5.js plugin galaxy and the three.js production stack: three-stdlib, camera-controls, detect-gpu, gainmap-js, vasturiano data-viz ecosystem). Memory-only listings are systematically biased toward what was popular *when training data was collected*, not what's actually used in production *now*.

Related: [[clustered-sweeps]], [[depth-first-wiki]]. Also recorded in the Wiki Methodology page as the "catalog-stub cross-check" convention.
