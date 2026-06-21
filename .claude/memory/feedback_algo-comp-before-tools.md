---
name: algo-comp-before-tools
description: Algorithmic Composition depth-dive (queue item
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

The **Algorithmic Composition depth-dive (queue item #4) precedes the tools sweep** (p5.js, paper.js, Pts.js, three.js, drawingbot, etc.).

**Why:** User confirmed 2026-05-17. Reasoning: tooling sweeps without the algorithmic-composition framework are evaluator-without-criteria — you can describe each library but you can't say *which is the right one for the work the wiki is built to support*. The framework (Galanter / Nake / Mohr / Cohen-AARON / Reas-Fry lineage) gives the criteria; the tools sweep then evaluates libraries against those criteria.

**How to apply:**

- Do NOT spin up a tools sweep before the Algorithmic Composition depth-dive is complete, even if the user mentions specific libraries.
- When the Algorithmic Composition depth-dive runs, derive the **library-evaluation rubric** as part of it (effective complexity, autonomy/control gradient, primitive vocabulary, idiomaticity, LLM-codegen friendliness). Per [[implementation-in-sweeps]], this rubric should be implementable.
- The tools sweep then applies the rubric to each library and produces ranked recommendations + first-class / second-class / skip verdicts.

Per the Field Map's revised sequence ([[clustered-sweeps]]), this places Algorithmic Composition + Tools as the *third* paired sweep, after Affect Foundations and L1 Cleanup.

Related: [[clustered-sweeps]], [[implementation-in-sweeps]], [[application-priorities]], [[language-preference]].
