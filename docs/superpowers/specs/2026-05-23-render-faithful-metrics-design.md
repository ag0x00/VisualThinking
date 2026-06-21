# Render-Faithful Metrics — Design

**Date:** 2026-05-23
**Subsystem:** B (toolkit)
**Status:** approved, pre-plan
**Branch:** `toolkit-screensaver` (extends PR #2)

## Goal

Make the toolkit's area/colour operators measure **what the renderer draws**, not the RenderPlan's declared intent — closing the plan→pixels gap that produced three girih12 defects at `groutGap=0.15` (off-canvas overhang inflating coverage; cream stroke not covering the inset gap → dark "bowtie" bleed; cream dominating ~35% of the frame unnoticed). Principle + safeguards recorded in `.claude/memory/feedback_measure-rendered-reality-not-intent.md`.

These are **shared core operators** — the redesign must keep the igp / tiling / truchet profiles and the existing 97 tests green (recalibrating bands by probe where the new measurement shifts a score).

## Architecture — two layers ("both", per user)

The two paths have different jobs, so we keep both:

1. **Runtime (inside `compose`/`improve`): plan-based, render-faithful, deterministic.** Operators read the RenderPlan but model the renderer's transforms (clip-to-frame, occlusion, area-by-colour). A shared `clipToConvexRegion` resolver gives the in-frame area of any element. No raster, no new *runtime* deps — preserves the deterministic-eval founding choice.
2. **Verification (tests/calibration only): a raster oracle.** `measureFromRaster(plan)` rasterises the SVG via `@resvg/resvg-js` (**devDependency**; Rust, no system libs, deterministic output) and measures pixel ground truth. Used to (a) assert each runtime operator agrees with the pixels within tolerance, and (b) power the adversarial tests. Never imported by `compose`/`improve`.

## Component 1 — shared geometry resolver (`src/geom.ts`)

- `clipToConvexRegion(subject: Vec2[], region: Vec2[]): Vec2[]` — Sutherland–Hodgman clip of `subject` against the **convex** `region` (rect for girih12/truchet, regular hexagon for tiling — both convex). Returns the clipped polygon (empty array if fully outside). ~35 lines, no deps, deterministic.
- `effectiveArea(poly: Vec2[], region: Vec2[]): number` = `polyArea(clipToConvexRegion(poly, region))`.

This encodes the *same* clip the SVG viewport performs natively; the raster oracle is what verifies they stay in sync. `svg.ts` needs no change (SVG clips to its viewBox automatically) — the resolver exists so the *operators* see the same in-frame geometry.

## Component 2 — `constructionGrammar` (clip-to-region coverage)

`coverage = Σ effectiveArea(tile, plan.region) / polyArea(plan.region)`.

Off-region overhang stops inflating the sum (girih12's wall-to-wall tiles, counted whole before, now count only their in-frame part). Internal overlap still double-counts (still flags "overlapping cells"); gaps still deflate (still flags "gappy"). Net: girih12 thin-grout coverage returns to ~1.0, so the profile's band returns to the standard `[0.85, 1.05]`. truchet/tiling/igp do not overhang → expect ~no change; re-probe and confirm their acceptance tests pass.

## Component 3 — `colorChord` (area-weighted + balance)

The current operator scores palette **membership** (fraction of the palette array on-arc) + lightness spread — area-blind, so 35%-cream and 2%-cream score identically, and a 3.75%-area accent is penalised as heavily as a dominant colour.

New `measure` computes **per-colour in-frame area share**, accounting for occlusion:
- tile colours: `effectiveArea(tile, region)` summed by `colorRef`;
- background colour: `regionArea − Σ effectiveArea(tiles)` (the visible remainder — models tiles drawn on top of the ground);
- shares normalise to `regionArea`.

New `scoreAgainst` (weights calibrated by probe; starting point):
- `hueOnArcArea` = area share of colours on-arc (low-chroma colours hue-exempt as today) — **area-weighted**, so small off-arc accents barely dent it (fixes the warm-accent under-scoring) while a large off-arc field tanks it.
- `lightnessSpread` — unchanged (palette-range, taste).
- `balance` = a dominance penalty: `1 − max(0, neutralShare − neutralCap) / (1 − neutralCap)`, with `neutralCap ≈ 0.25` (cream is a *channel*, not a field). At groutGap 0.15 cream ≈ 0.35 → penalty; at 0.05 cream ≈ 0.08 → no penalty. Catches the cream-dominance defect.
- `value = 0.45·hueOnArcArea + 0.30·lightnessSpread + 0.25·balance` (exact split set by probe so good ≈ today's ~0.78–0.9 and the defects score low).

Re-probe igp/tiling/truchet colorChord (good + wrong-chord) and adjust if the area-weighting shifts them.

## Component 4 — `cuerdaSeca` + the grout render-model fix

The bowties are a **render-model** defect, not just a metric gap: grout = "inset gap filled by the deep-blue background, partly covered by a cream stroke," so when the gap exceeds the stroke the background bleeds through. Fix the model: **render tiles on a cream ground** (girih12 background `colorRef = CREAM`), so every inter-tile gap reads as cream channel — bowties become impossible at any grout width. (Deep-blue, idx 3, currently shows *only* as the bleed, so at thin grout this is near-invisible; it stays in `SAMARKAND_7` for possible later use.)

`cuerdaSeca` itself keeps its job (channel completeness + uniformity from the `channel` widths) — with the cream ground the failure mode it was blind to no longer exists, and the **raster oracle asserts dark/background-bleed ≈ 0** as ground truth. The "uneven-channels" variant (channelJitter) still degrades uniformity as before.

## Component 5 — raster oracle (`test/util/raster-oracle.ts`)

`measureFromRaster(plan, px = 256): { coverage; areaShareByHex; bleedFraction }`:
- render `renderSvg(plan)` → PNG via `@resvg/resvg-js` → RGBA buffer;
- `coverage` = fraction of region pixels not equal to the background colour;
- `areaShareByHex` = per-colour pixel fraction (the occlusion-true ground truth for colorChord);
- `bleedFraction` = fraction of channel-region pixels that are dark/deep-blue (ground truth for cuerda-seca; ≈0 with cream ground).

Dev-only; lives under `test/`.

## Component 6 — the adversarial test class (the safeguard, executable)

New `test/adversarial.test.ts`: for each redesigned operator, construct **the ugliest plan that maxed the *old* score** and assert the *new* runtime operator now catches it, cross-checked against the raster oracle:
- girih12 `groutGap: 0.15` → `colorChord` now low (cream dominance) **and** raster `areaShareByHex` confirms cream ≈ 0.35;
- a wall-to-wall plan with heavy off-canvas overhang → `constructionGrammar` no longer reads ≫1;
- raster `bleedFraction` ≈ 0 for the cream-ground good plan, and would be >0 for the old deep-blue-ground + wide-grout plan.

This is the dual of our existing "deliberate-failure" variants: not "does the metric catch a bad design" but "can a bad design still fool the metric."

## Recalibration + groutGap

Re-thin girih12 default `groutGap` to ~0.05 (visually correct; re-eyeball). Re-probe all four media; update profile bands/weights only where a new measurement moved a score; keep every existing acceptance test green (adjusting expected thresholds only with a recorded reason).

## Testing

- Unit: `clipToConvexRegion` (inside/outside/straddling), `effectiveArea`.
- Each operator: existing unit tests adjusted for the new measure; good still scores well, each variant still isolates its axis.
- Acceptance (4 media): good outranks variants; top-fix axis unchanged; 97 prior tests green or thresholds updated-with-reason.
- Raster cross-check: each medium's good plan — runtime operator agrees with `measureFromRaster` within tolerance.
- Adversarial class as above.

## Out of scope

- Rasterising inside runtime operators (the oracle is tests-only).
- A VLM perceptual oracle (the *next* rung of "calibrate against perception" — separate todo).
- `colorSymmetry` operator (separate todo).
- Reworking igp/tiling/truchet *generators* (only their profile calibration may shift).

## Rollout

spec → plan → TDD execute. **Hold the unpushed PR #2 commits until this lands** (the shipped girih12 has the defect).
