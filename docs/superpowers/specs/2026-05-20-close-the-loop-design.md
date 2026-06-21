# Close the Loop — `improve(generate, params, profile, tuning)` Design

**Date:** 2026-05-20
**Subsystem:** B (toolkit)
**Status:** approved, pre-plan
**Branch:** `toolkit-screensaver` (extends PR #2)

## Goal

Turn the toolkit's evaluation pass into a feedback loop: **generate → score → fix → regenerate**. The composer already produces a ranked list of directional `fixes`; this slice consumes them, nudges the generator's parameters one knob at a time, and regenerates until the composite score reaches a target or no further improvement is available.

## Why this shape

A `RenderPlan` is generator *output*; it cannot be improved in isolation. The thing that can be tuned is the **parameter set** that produced the plan. So the loop operates on params:

```
params → generate(params) → plan → compose(plan, profile) → fixes → nudge a param → regenerate
```

Every operator already emits `fix = { axis, direction, detail }` where `axis` equals the operator's own name and `direction ∈ {increase, decrease, ok}`. Each generator already exposes scalar knobs that move exactly those axes. The missing piece is a declared map from `fix.axis` to "which knob, how far, within what bounds" — the **tuning map**, the mirror image of how a profile binds operators to targets.

## Signature

```ts
export function improve<P>(
  generate: (p: P) => RenderPlan,
  initialParams: P,
  profile: AestheticProfile,
  tuning: TuningMap,
  opts?: ImproveOptions,
): ImproveResult<P>;

export interface ImproveOptions {
  targetComposite?: number; // default 0.85 — stop once composite ≥ this
  maxIterations?: number;   // default 20
}
```

`generate` + `tuning` are a per-generator pair (igp's tuning map only references igp's params). They are passed explicitly rather than bundled, matching the codebase's free-function style. Generic over `P` so the same loop drives both generators.

## Core loop

Greedy, one knob per step, revert-and-stop on non-improvement (chosen over all-at-once to avoid coupled-param overshoot, and over try-next-ranked search to keep the trajectory legible — one explainable knob per step).

```
score = compose(generate(params), profile)
trajectory = []
for iter in 1..maxIterations:
  if score.composite >= targetComposite: break
  fix = first fix in score.fixes that is ACTIONABLE
        (tuning[fix.axis] exists AND nudging its param actually changes it,
         i.e. it is not already pinned at a bound in the requested direction)
  if no actionable fix: break          // converged / out of knobs
  nextParams = applyNudge(params, tuning[fix.axis], fix.direction)
  nextScore  = compose(generate(nextParams), profile)
  if nextScore.composite > score.composite + EPS:
    record step(iter, fix.axis, param, from, to, score.composite, nextScore.composite, nextParams)
    params = nextParams; score = nextScore   // keep
  else:
    break                              // revert (discard nextParams) and stop
return { finalParams: params, finalPlan: generate(params), finalScore: score.composite, trajectory }
```

- `score.fixes` is already rank-ordered by `(1 − score) · weight` (descending), so "first actionable fix" is the worst-weighted axis we have a knob for.
- Skipping a no-binding axis (`symmetry`, `colorChord` in v1) is **not** a search — it means "we have no knob for that axis," so we move to the next-worst that we *can* act on.
- `EPS = 1e-4`.
- Stopping conditions: (a) `composite ≥ targetComposite`; (b) no actionable fix remains; (c) the applied nudge did not improve the composite (revert + stop); (d) `maxIterations` reached.
- The loop is deterministic: same inputs → same trajectory.

## Tuning maps

```ts
export type NudgeKind = "int" | "num";

export interface TuningBinding {
  param: string;   // key into the generator's params object
  kind: NudgeKind;
  step: number;
  min: number;
  max: number;
  invert?: boolean; // true → flip the direction→delta sign (see cuerdaSeca)
}

export type TuningMap = Record<string, TuningBinding>; // keyed by fix.axis
```

### `applyNudge(params, binding, direction)`

Pure. Reads `params[binding.param]` (a number), computes
`delta = (direction === "increase" ? +step : −step) × (invert ? −1 : +1)`,
adds it, rounds when `kind === "int"`, clamps to `[min, max]`, and returns a **new** params object (shallow clone) with the field replaced. If the clamped result equals the current value (param pinned at a bound in the requested direction), the binding is treated as non-actionable for that direction — the loop skips it.

### igp (strapwork) — `src/tuning/igp.ts`

| fix axis | param | kind | step | range | note |
|---|---|---|---|---|---|
| `complexity` | `rings` | int | 1 | 3–9 | band; direction comes from the fix |
| `lineContinuity` | `segmentScale` | num | 0.6 | 0.4–1.0 | floor; **cliff knob** — segments only connect (continuity jumps 0→1) at scale 1.0, so composite is flat across 0.5→0.9. A coarse step (0.6) crosses the discontinuity in one move (any start in range → 1.0); a fine step would yield zero gain and trip the revert-and-stop guard prematurely. Verified by probe 2026-05-20. |

### tiling — `src/tuning/tiling.ts`

| fix axis | param | kind | step | range | note |
|---|---|---|---|---|---|
| `constructionGrammar` | `cellScale` | num | 0.03 | 0.85–1.15 | band |
| `tileComplexity` | `colorCount` | int | 1 | 1–3 | band; max = fillCount = palette.length − 2 = 3 for SAMARKAND_PALETTE. Set to the real ceiling so a pinned nudge is correctly seen as non-actionable (the generator clamps colorCount to fillCount, so a 3→4 nudge would change the param but not the plan — avoid that by bounding at 3) |
| `cuerdaSeca` | `channelJitter` | num | 0.1 | 0.0–1.0 | floor; **`invert: true`** — higher quality ⇐ *less* jitter |

`invert` exists for exactly this case: cuerda-seca's fix says "increase quality," but the knob that achieves it is *decreasing* `channelJitter`, so the binding flips the sign.

### Deferred to v1 (unactionable axes)

- **`symmetry`** — both generators are `p6m` by construction; there is no knob that varies fidelity. A symmetry fix would never fire from these generators anyway (score is always ≈1).
- **`colorChord`** — tuning a palette means rotating hues toward the target arc and shifting lightness spread, i.e. mutating an array of OKLCH triples rather than a scalar. Deferred to keep v1 to scalar knobs.

Fixes on these axes are simply skipped (no binding). **Consequence:** the demo and acceptance tests must start from *param-actionable* degradations (under-dense, broken continuity, gappy/overlapping cells, uneven channels) — not the wrong-chord variant, which v1 cannot repair.

## Output shape

```ts
export interface ImproveStep<P> {
  iter: number;
  fix: string;             // the axis acted on
  param: string;           // the knob turned
  from: number;
  to: number;
  compositeBefore: number;
  compositeAfter: number;
  params: P;               // full snapshot AFTER this step
}

export interface ImproveResult<P> {
  finalParams: P;
  finalPlan: RenderPlan;
  finalScore: number;
  trajectory: ImproveStep<P>[];
}
```

Only **accepted** steps are recorded (the reverted final attempt is not). Each step carries a full `params` snapshot so the gallery can render that step's plan directly with no replay logic.

## Gallery integration

A new **"Improvement"** group in the scorecard gallery. Cards rendered left-to-right:

1. **Start** — `generate(initialParams)` with its composite (below target).
2. **One card per accepted trajectory step** — that step's rendered plan, the fix label and `param: from → to`, and `compositeBefore → compositeAfter`.
3. The final step is the converged result.

This is the "show the loop working" surface — the composite visibly climbs knob-by-knob. The gallery script (`render-gallery.ts`) builds the group by running `improve` from a deliberately under-target start for both media.

## Files

**New:**
- `src/tuning.ts` — `NudgeKind`, `TuningBinding`, `TuningMap`, `applyNudge`.
- `src/tuning/igp.ts` — igp tuning map.
- `src/tuning/tiling.ts` — tiling tuning map.
- `src/improve.ts` — the loop + `ImproveStep`/`ImproveResult`/`ImproveOptions`.
- `src/improve.test.ts` — acceptance + unit tests.

**Modified:**
- `src/scripts/render-gallery.ts` — build the Improvement group for both media. A trajectory step maps directly onto the existing `GalleryEntry` (plan → svg + composite), so **`gallery.ts` is reused unchanged** — no edit to the tested HTML renderer.
- `README.md` — document `improve` + tuning maps.

## Testing

- **`applyNudge` units:** increase/decrease for int and num; clamping at both bounds; `invert: true` flips the sign; pinned-at-bound returns an unchanged value.
- **igp acceptance:** start from `{ rings: 3, segmentScale: 0.5, ... }` (under-dense + broken continuity); assert `finalScore ≥ targetComposite`.
- **tiling acceptance:** start from `{ cellScale: 0.9, channelJitter: 0.6, ... }` (gappy + uneven channels); assert `finalScore ≥ targetComposite`.
- **Trajectory invariants (both media):** `compositeAfter > compositeBefore` for every recorded step (monotonic, strictly improving by > EPS); `finalScore` equals the last step's `compositeAfter` (or the initial score if no step was taken); the trajectory length ≤ `maxIterations`.
- **Convergence guard:** an already-good start (default params) yields an empty trajectory and returns the start unchanged.

## Out of scope (v1)

- Palette/colorChord tuning and any symmetry knob (deferred above).
- All-at-once or search-based optimization (greedy single-knob only).
- A `GeneratorKit` bundle `{ generate, defaultParams, tuning }` — possible later cohesion; v1 passes args explicitly.
- External-image front-end (separate deferred track).
