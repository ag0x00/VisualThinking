# @visualthinking/toolkit

Subsystem B of the VisualThinking repo: a library of **operators** (pure functions over a `RenderPlan`) that *generate* and *evaluate* geometric visual work. It operationalizes the wiki's aesthetic concepts so they can be wielded in code.

Design principle: **operators measure (target-free); profiles set targets.** A `compose()` call runs a medium's profile against a plan and returns a composite score plus ranked fixes. See `docs/superpowers/specs/2026-05-20-operator-composition-slice-design.md`.

## Commands

```bash
npm test        # vitest
npm run typecheck
npm run render   # writes out/sample.svg  (single pattern)
npm run gallery  # writes out/gallery.html (good + 4 deliberate failures, scored)
```

## What "score" means

The percentage on each metric is **target-adherence** — *how well the pattern meets what that metric is asking for* (100% = on target, 0% = maximally off). It is **not** a measurement of "how much" of the property is present. Each metric converts its raw measurement to a score with a different rule:

| Metric | Target shape | measured → score | Examples |
|---|---|---|---|
| **symmetry** | floor (`≥0.98`) | `measured ÷ 0.98`, capped at 100% — higher is always better | 1.00 → 100% · 0.49 → 50% · 0.00 → 0% |
| **complexity** | band (`0.55–0.78`, Goldilocks) | 100% inside the band; outside, drops by `distance ÷ 0.25`. **Too much scores low, just like too little.** | 0.77 → 100% · 0.95 → 32% (overshoot) · 0.31 → ~0% (too sparse) |
| **colorChord** | blend | `0.6 × (fraction of palette on the hue arc) + 0.4 × (light-to-dark range present)` | 0% on-arc but full lightness spread → 40% |
| **constructionGrammar** | band (`≈1.0`) | region coverage = `Σ cell area ÷ design-region area`; <1 = gaps, >1 = overlap (tile plans only) | 1.00 → 100% · 1.25 → 0% (overlap) · 0.64 → 0% (gaps) |
| **lineContinuity** | floor (`≥0.6`) | `0.5 × connectedness + 0.5 × through-continuation` of line segments — Gestalt good-continuation (line plans only) | 0.64 → 100% (connected) · 0.0 → 0% (segments dangle) |

Consequences:
- Percentages are comparable only as *closeness to that axis's own target*, not as like-for-like amounts.
- **complexity** is non-monotonic: a very dense pattern (measured 0.95) scores low because it overshoots the sweet spot — the inverted-U from [Berlyne's arousal-potential](../wiki/concepts/Berlyne's%20Arousal-Potential%20Theory.md).
- **colorChord**'s score blends two sub-scores (hue + lightness); the gallery shows them as separate sub-bars so nothing is hidden.

The `composite` is the weighted mean of the per-axis scores; the `fixes` list ranks the off-target axes and says which direction to move.

## Layout

```
src/
  render-plan.ts      # the geometric data type all operators consume (+ optional region for tilings)
  geom.ts             # shared polygon helpers (area, centroid, scale)
  operators/          # symmetry · complexity · color-chord · construction-grammar · line-continuity
  profile.ts          # AestheticProfile type (operator bindings + targets)
  profiles/           # timurid-igp.ts (lines) · timurid-tiling.ts (cells)
  compose.ts          # runs a profile against a plan → composite + fixes
  generators/         # igp.ts (line strapwork) · tiling.ts (filled cells)
  renderers/          # svg.ts (single) · gallery.ts (grouped scorecards)
  variants.ts         # good + deliberate failures (line + tile), shared by test + gallery
test/                 # vitest; acceptance.test.ts proves good outranks failures
```
