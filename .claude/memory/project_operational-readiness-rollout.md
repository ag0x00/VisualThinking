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

## Status: not started — execute next session

How to apply: at next session start, read this + [[operational-page-standard]] + [[application-priorities]]. Decide whether to (a) run the triage audit first, or (b) resume the toolkit spec review — or interleave. Both are live; the user picked C for the *rollout method*, not necessarily the *immediate next action*. Confirm which thread to pull first.
