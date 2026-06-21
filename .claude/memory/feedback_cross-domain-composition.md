---
name: cross-domain-composition
description: "The wiki's value is cross-domain COMPOSITION, not per-page completeness. Medium/domain pages should bind to general aesthetic operators (symmetry, complexity, harmony, tension, balance) with weights+parameters, not carry bespoke self-contained machinery. A page is 'ready' if it IS an operator OR composes from operators via explicit parameterized bindings."
metadata:
  node_type: memory
  type: feedback
---

The power of the wiki is **applying cross-domain aesthetic knowledge across mediums** — using the deep general pages (how symmetry works, what makes complexity elegant, harmony, tension, balance, fluency) to create/evaluate work in any specific medium. NOT a flat lookup where you spot a concept and expect that concept's page to be the whole solution.

**The failure mode the user named (2026-05-19):** "(a) we spot a concept and expect a page on that concept to give us the solution. Instead I want (b) leverage relationships between concepts ... apply cross-domain knowledge of how aesthetics, symmetry, harmony, tension work." Example: the IGP page shouldn't contain its own bespoke "is this pattern good?" metric. What's valued in Timurid geometric art *decomposes* into general operators the wiki already has — effective-complexity (Berlyne), symmetry-group fidelity, fractal/self-similar detail reading, ΔE color-chord, line-continuity — plus medium-specific semantics (iconography pages). The IGP page's job is to *point into* those with the right bindings.

**The model this implies (three layers):**
1. **Operators** — general aesthetic principle pages that ARE operationally complete (P/B/E). These are the reusable cross-medium engines. The operational-readiness audit (2026-05-19) showed these are already the wiki's *strongest* pages (Visual Entropy, Fractal Dimension, Visual Balance, Gestalt, Structural Skeleton, arousal-potential, LLM-as-Judge all scored 6).
2. **Bindings** — medium/domain pages carry an *aesthetic profile*: typed pointers to the operators that matter for this medium, WITH weights + target parameter ranges + what the tradition prizes/penalizes. Bindings must carry the numbers, or they go shallow ("symmetry: yes" is useless).
3. **Composer** — given "create/evaluate X as medium M," resolve M's profile, run the referenced operators, synthesize a verdict + code/prompt fixes. v1 = LLM orchestration over existing MCP `getRelated`/`search` + a profile convention (reachable today, no new infra). v2 = typed `wiki_critique(image, medium)` MCP tool.

**This AMENDS [[operational-page-standard]]:** the bar is NOT "every page carries P/B/E." A page is ready if it EITHER *is* an operator (carries P/B/E) OR correctly *composes* from operators via explicit parameterized bindings. The [[operational-readiness-rollout]] registry's low Evaluate scores on medium pages are re-read as "missing/implicit bindings + no composer," not per-page defects.

**Why:** prevents the recurring trap of ultra-focusing on a single side-objective page (the user explicitly worried this would repeat the screensaver-as-goal mistake — see [[test-artifact-vs-workflow]]). Cross-domain transfer is the whole point; a per-page audit can't see it.

**How to apply:**
- Build-and-fill targets the **binding + composer spine**, not "add an eval hook to each page."
- When a medium page seems to "lack" an eval metric, first ask: which general operators does this decompose into, and does the page bind to them with weights/params? Fix the binding, don't duplicate the operator.
- Prove the model with ONE cross-domain query end-to-end (e.g. critique an IGP image by composing general operators through IGP's profile) before generalizing.
- Keep operators DRY: one symmetry scorer, one complexity measure — referenced everywhere, never re-implemented per medium.

Related: [[operational-page-standard]] (amended by this), [[operational-readiness-rollout]] (the registry to re-read through this lens), [[test-artifact-vs-workflow]], [[design-for-consumer]], [[application-priorities]].
