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
| **cuerdaSeca** | floor (`≥0.85`) | `0.5 × completeness + 0.5 × uniformity` of the cream channels between tiles (tile plans only) | 1.0 → 100% (uniform) · 0.65 → 76% (uneven/missing) |
| **tileComplexity** | band (`0.5–0.85`) | `0.5 × cell-density + 0.5 × colour-variety` of tiles — Berlyne organized-richness (tile plans only) | 0.73 → 100% · 0.39 → 55% (monotone) |

Consequences:
- Percentages are comparable only as *closeness to that axis's own target*, not as like-for-like amounts.
- **complexity** is non-monotonic: a very dense pattern (measured 0.95) scores low because it overshoots the sweet spot — the inverted-U from [Berlyne's arousal-potential](../wiki/concepts/Berlyne's%20Arousal-Potential%20Theory.md).
- **colorChord**'s score blends two sub-scores (hue + lightness); the gallery shows them as separate sub-bars so nothing is hidden.

The `composite` is the weighted mean of the per-axis scores; the `fixes` list ranks the off-target axes and says which direction to move.

## Closing the loop — `improve()`

Evaluation feeds back into generation. `improve(generate, params, profile, tuning)` reads the composer's ranked `fixes` and turns the single worst-weighted *actionable* knob one step, regenerates, and keeps the step only if the composite climbed — stopping on the first non-improvement.

```ts
import { improve } from "./src/improve";
import { generateIgp, defaultIgpParams } from "./src/generators/igp";
import { timuridIgpProfile } from "./src/profiles/timurid-igp";
import { igpTuning } from "./src/tuning/igp";

const start = { ...defaultIgpParams(), rings: 3, segmentScale: 0.5 }; // composite ≈0.71
const r = improve(generateIgp, start, timuridIgpProfile, igpTuning);
// r.finalScore ≈ 0.99 ; r.trajectory lists each accepted knob turn
```

A **tuning map** binds each `fix.axis` to one generator knob: `{ param, kind, step, min, max, invert? }`. `invert` flips the direction→delta sign for inverse-sense knobs (cuerda-seca quality rises as `channelJitter` falls). Axes with no knob (`symmetry`, which is always `p6m`; `colorChord`, deferred) are absent from the map and skipped by the loop. One subtlety: `segmentScale` is a *cliff knob* — line continuity only resolves at scale 1.0 — so it uses a coarse step that crosses the discontinuity in one move.

`improve()` returns `{ finalParams, finalPlan, finalScore, trajectory }`; each trajectory step carries a full params snapshot, so `npm run gallery` renders the climb as an "Improvement" group (start → each accepted step → final, composite rising knob-by-knob).

## Layout

```
src/
  render-plan.ts      # the geometric data type all operators consume (+ optional region for tilings)
  geom.ts             # shared polygon helpers (area, centroid, scale)
  operators/          # symmetry · complexity · color-chord · construction-grammar · line-continuity · cuerda-seca · tile-complexity
  profile.ts          # AestheticProfile type (operator bindings + targets)
  profiles/           # timurid-igp.ts (lines) · timurid-tiling.ts (cells)
  compose.ts          # runs a profile against a plan → composite + fixes
  generators/         # igp.ts (line strapwork) · tiling.ts (filled cells)
  tuning.ts           # TuningBinding/TuningMap + applyNudge (fix.axis → knob)
  tuning/             # igp.ts · tiling.ts (per-generator fix→param maps)
  improve.ts          # greedy generate→score→fix→regenerate loop
  renderers/          # svg.ts (single) · gallery.ts (grouped scorecards)
  variants.ts         # good + deliberate failures (line + tile), shared by test + gallery
test/                 # vitest; acceptance + improve.test.ts prove the spine end-to-end
```
