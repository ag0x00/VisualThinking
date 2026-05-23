---
name: feedback_extract-rules-before-generating
description: "Before generating in a craft domain, extract+encode its hard rules (and never model around the operator that checks them); geometry-first skips the learn step"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4298e67e-a7f5-41be-b43f-ad794da3ad6f
---

When building a generator for an established visual craft (IGP/ceramic tilework, etc.), **extract and encode the craft's hard invariants BEFORE generating** — and surface them as measurable operators so the machine catches violations instead of the user.

**Why:** Building girih12 (2026-05-23), I went geometry-first and shipped a prototype that violated two ceramic rules the user had to catch by eye: (1) interstitial triangles left as `role:"background"` = illogical empty "holes" (fired tilework never has gaps); (2) warm accents hash-scattered as random single tiles (color is bound to shape-class; any within-class variation must respect the pattern's symmetry — e.g. symmetric sub-lattice / "every other kite", never singletons). The user's deeper point: "if this were an IGP rule, how would you find out about it? we'll keep hitting 'didn't understand the rules.'"

**How to apply:**
- **Rule already in the wiki → enforce it as an operator, and don't model around it.** "No gaps" was already `constructionGrammar` ("cells partition the region"). I defeated the check by tagging triangles `background` (excluded from coverage). Model every region as a `tile` so the operator can't be dodged.
- **Rule missing from the wiki → the learn step discovers it.** Follow [[feedback_new-project-learning-workflow]]: read wiki → find the gap → targeted autoresearch / reference-image (VLM) analysis of "what authentic work looks like" → encode it back to the concept page. Do this BEFORE writing geometry, not after a user correction.
- **Split law vs taste.** Accent *proportion* (≲5%) = taste → profile; accent *symmetric placement* = law → operator. Law becomes a check; taste becomes a target.
- Candidate core operator surfaced but unbuilt: **color-symmetry-equivariance** (tile colors commute with the symmetry group) — transferable to any rosette/wallpaper pattern, so it belongs in core, not IGP-only. On the todo.

Rules now encoded at `wiki/concepts/Islamic Geometric Patterns and the Polygonal Technique.md` → "Ceramic tilework: hard invariants". See [[project_subsystem-trajectory]].
