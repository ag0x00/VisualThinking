---
name: operational-readiness-rollout
description: "Decision (2026-05-19): roll out the operational-readiness standard via Option C — a triage map scoring priority concept pages on Perceive/Build/Evaluate, then build-and-fill against the ranked gap registry. Registry seeds a future wiki_assessReadiness MCP capability."
metadata:
  node_type: memory
  type: project
---

## Decision (2026-05-19): Option C — triage map, then build-and-fill

The user chose **Option C** for rolling out the [[operational-page-standard|operational readiness standard]]: one quick triage pass to produce a ranked gap registry, *then* build-and-fill against it (rather than pure audit-first or pure reactive build-and-fill).

**Why C:** gives a map without going fully reactive; the build loop remains the best gap-detector (it found the IGP gap) but now runs against a prioritized registry instead of stumbling on gaps; the registry is the seed of a future `wiki_assessReadiness` MCP capability.

## The triage audit — how to execute (next session)

**Scope:** concept pages only (`wiki/concepts/`), in application-priority order (gen art → branding → graphic design → music-reactive). Not sources/syntheses/tools. Fast-score, don't deep-dive — the deep autoresearch happens later against the registry.

**Per page, score three modes** (present / partial / absent, or 0-2):
- **Perceive** — does it explain the perceptual/cognitive mechanism (*why* the viewer experiences the effect)?
- **Build** — generative rules + parameter ranges + code patterns + library pointers + LLM prompt formulations?
- **Evaluate** — can it assess an artifact (incl. an external image) and propose concrete metric + code/prompt improvements?

**Output: a ranked gap registry.** Suggested location: `wiki/meta/Operational Readiness Registry.md` (meta page → address-exempt) or an Obsidian `.base` (the vault has the bases plugin). Columns: page (address) · domain · priority-rank · Perceive · Build · Evaluate · total · gap-notes · autoresearch-queued?. Sort by (priority-rank asc, total asc) so high-priority + low-readiness pages float to the top.

**Then:** build-and-fill against the registry. Re-deepen the top-ranked gaps via targeted autoresearch (program-style prompt per [[npm-audit-before-design]]; target the *operational* gap specifically, not generic "learn more"). The toolkit-screensaver build continues in parallel and surfaces additional gaps organically.

## Refinement flagged (not yet built)

Make gap-recognition a **machine operation**: a new MCP tool `wiki_assessReadiness(concept)` that scores P/B/E and returns the targeted autoresearch program to close any gap. The triage registry is its seed/training data. Connects the standalone eval pages ([[Multimodal Evaluation Loops]], [[LLM-as-Judge for Visual Quality]], [[Photo Aesthetic Features]]) into per-concept evaluation hooks.

## Parallel thread: toolkit-screensaver (paused)

Independent of this rollout: the toolkit-screensaver work is paused at brainstorming-skill **task #8** (user reviews spec). Spec at `docs/superpowers/specs/2026-05-18-toolkit-screensaver-design.md` (self-reviewed, committed). Branch `toolkit-screensaver`. Next there = user review → task #9 (invoke `superpowers:writing-plans` for the MVP-1 implementation plan). See [[brainstorm-state]].

## Status: triage audit DONE (2026-05-19) — build-and-fill is next

The triage audit ran 2026-05-19 (7 parallel subagents, shared P/B/E rubric, 141 concept pages scored). Output: **`wiki/meta/Operational Readiness Registry.md`** (ranked, sorted by priority-app then total). Headline findings:
- **Evaluate is the systemic gap**: ~112/141 pages score E<2 — they can describe + build but cannot score an external image and propose code/prompt fixes. That "critique an image we didn't make" workflow is the wiki's biggest hole.
- **Branding (priority 2) is the most under-operationalized application**: 9/14 pages Critical/Weak, only 1 Strong.
- **Active-build gap flagged**: [[Islamic Geometric Patterns and the Polygonal Technique]] = 1/2/0 (no Perceive mechanism, no Evaluate metric) — relevant to the toolkit-screensaver thread.
- **15 "fully operational" template pages** (total=6) to copy: Gestalt, Visual Balance, Structural Skeleton, FACS, Visual Entropy, Fractal Dimension, LLM-as-Judge, Tenebrism, etc.
- Dangling dep: pose pages reference a "Pose Extraction Pipeline" page absent from `wiki/concepts/` — verify it's in `wiki/techniques/` or queue it.

How to apply: next action is **build-and-fill** against the registry's Priority fill queue (Tier 1 = gen-art Critical, then Tier 2 = gen-art Weak, then Tier 3 = branding). Each fill closes the *specific* named gap via targeted autoresearch (program-style prompt per [[npm-audit-before-design]]). Re-score rows in place after deepening. The toolkit-screensaver thread ([[brainstorm-state]]) remains live in parallel.
