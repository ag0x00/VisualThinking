# Truchet Periodic Medium — Design

**Date:** 2026-05-21
**Subsystem:** B (toolkit)
**Status:** approved, pre-plan
**Branch:** `toolkit-screensaver` (extends PR #2)

## Goal

Add a **wall-to-wall repeating Truchet tile pattern** as a third medium for the toolkit engine. Unlike the existing generators (concentric rings around a center), a Truchet pattern is a **periodic tessellation on a square lattice** that fills the canvas edge-to-edge. Its purpose is twofold: a new generative-art primitive, and a deliberate **test of whether the operator/composer/improve spine is medium-agnostic**.

## What the test already revealed

The current `symmetry` operator rotates every element about `plan.symmetry.center` by `2π·k/order`. A periodic pattern's invariance is **translation by lattice vectors**, not rotation about a point — so a perfectly periodic tiling can score low on `symmetry`. That is the one piece of geometry-specific coupling in the spine. The fix is to **add** a `periodicity` operator rather than mutate `symmetry`; everything else (`constructionGrammar`, `lineContinuity`, `colorChord`) generalizes unchanged. The composer and `improve()` are untouched. This is the headline outcome: the spine extends by adding one operator.

## Architecture

A Truchet plan is built from identical square cells on a lattice. Each cell carries:
- **one `tile`-role square** (the cell frame, filled with a background-ish glaze) — gives `constructionGrammar` its area and `periodicity` a rotation-independent thing to match;
- **one or two `path`-role polyline arcs** (`role: "line"`) — the quarter-circle Truchet arcs, approximated as polylines, whose rotation is chosen deterministically per cell. These carry the flowing-curve interest and feed `lineContinuity`.

Because `periodicity` matches on the **square cell frames** (not the arcs), a richly-varied pattern (the good kind) still scores ~1.0; the score only drops when the lattice itself is corrupted.

### New generator — `src/generators/truchet.ts`

```ts
export interface TruchetParams {
  bounds: { width: number; height: number };
  gridSize: number;       // cells per side (e.g. 8 → 8×8 = 64 cells)
  cellScale: number;      // 1 = squares tile exactly; <1 gaps, >1 overlap (drives constructionGrammar)
  latticeJitter: number;  // 0 = clean grid; >0 drifts each cell off its lattice point (drives periodicity)
  arcGap: number;         // 0 = arcs meet at edge midpoints; >0 retracts arc endpoints inward (drives lineContinuity)
  arcSteps: number;       // polyline points per quarter arc (e.g. 10) — render/continuity smoothness
  palette: Oklch[];
  rngSeed: number;        // deterministic per-cell rotation choice
}

export function defaultTruchetParams(): TruchetParams;
export function generateTruchet(params?: TruchetParams): RenderPlan;
```

Output `RenderPlan`:
- `bounds` = the canvas.
- `symmetry = { group: "p4", lattice: [[cellW, 0], [0, cellH]], center: [w/2, h/2], order: 4 }`. `lattice` is what `periodicity` reads. (`symmetry` the *operator* is not in this profile, so its center-rotation is never invoked — that is the point.)
- `region` = the full canvas rectangle `[[0,0],[w,0],[w,h],[0,h]]`, so `constructionGrammar` coverage is "cells fill the canvas".
- `elements`: one `background` rect; then per cell, one `tile` square + the arc `path`(s).

Per-cell rotation is `hash(i, j, rngSeed) mod 2` (deterministic — keeps tests stable). Quarter arcs are generated as `arcSteps`-point polylines from one edge midpoint to the adjacent edge midpoint, centered on the shared cell corner; `arcGap > 0` pulls the two endpoints a fraction `arcGap` of the way toward the arc's middle (breaking the join with neighbors). `latticeJitter > 0` offsets each cell's whole geometry (square + arcs) by a deterministic per-cell vector of magnitude up to `latticeJitter · cellW`. `cellScale` scales each square about its own centroid (arcs unaffected — coverage is a square-frame property).

### New operator — `src/operators/periodicity.ts`

```ts
periodicity: Operator<{ minFidelity: number }>
```

- `measure(plan)`: read `plan.symmetry.lattice` (`[v1, v2]`). Collect the centroids of all `tile`-role elements. For each tile centroid `c` and each lattice vector `v` in `{v1, v2}`: if `c + v` is within `bounds`, that is an *in-bounds target*; it **matches** if some tile centroid lies within `eps` of `c + v` (`eps = 1e-3 · diag`). `value = matches ÷ inBoundsTargets` (1.0 if no targets, mirroring `symmetry`'s empty-case convention). Components: `{ matches, targets }`.
- `scoreAgainst(m, { minFidelity })`: **floor**, identical shape to `symmetry`: `score = clamp(value / minFidelity, 0, 1)`, `direction = value < minFidelity ? "increase" : "ok"`, `rule: "floor — higher is better (pattern repeats under lattice translation)"`, `fix.axis: "periodicity"`.

Register in `src/operators/index.ts` as `periodicity`.

### Reused operators (no change)

- **`constructionGrammar`** — coverage of `tile` squares vs `region` (= canvas). Band ≈1.0. Already correct for "fills wall-to-wall".
- **`lineContinuity`** — reads `line`-role arcs' first/last points. Endpoints coincide at shared edge midpoints (clean grid) → high connectedness; `arcGap` retracts them → drops. Floor.
- **`colorChord`** — palette hue arc + lightness spread. Geometry-agnostic.

### Profile — `src/profiles/truchet.ts`

```ts
truchetProfile: AestheticProfile = {
  medium: "truchet",
  operators: [
    { operator: "periodicity",         weight: 0.30, target: { minFidelity: 0.95 } },
    { operator: "constructionGrammar", weight: 0.25, target: { band: [0.95, 1.05], falloff: 0.2 } },
    { operator: "lineContinuity",      weight: 0.25, target: { minContinuity: <calibrate> } },
    { operator: "colorChord",          weight: 0.20, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: { references: [], notes: "Truchet: lattice periodicity + canvas coverage + arc continuity + chord" },
}
```

`lineContinuity`'s `minContinuity` is set by probing a clean default Truchet via `npx tsx -e` (the established calibration pattern), so the default pattern lands just above the floor and the `disconnected-arcs` variant lands clearly below it. `lineContinuity` is a **floor** here (flowing curves are good; "too connected" is not a vice for Truchet).

### Tuning map — `src/tuning/truchet.ts`

```ts
truchetTuning: TuningMap = {
  periodicity:         { param: "latticeJitter", kind: "num", step: <coarse>, min: 0, max: 0.4, invert: true }, // less jitter → more periodic
  constructionGrammar: { param: "cellScale",     kind: "num", step: 0.03,    min: 0.85, max: 1.15 },
  lineContinuity:      { param: "arcGap",         kind: "num", step: <coarse>, min: 0, max: 0.5, invert: true }, // less gap → more continuity
}
```

`latticeJitter` and `arcGap` are inverse-sense knobs (the fix asks to *increase* the axis; the knob must *decrease*) — `invert: true`. Whether either is a **cliff knob** (like `segmentScale` was) will be checked by probe during implementation; the step is set coarse enough to cross any discontinuity in one move. `colorChord` has no knob (palette tuning still deferred). `tileComplexity`/`symmetry` are not in this profile.

### SVG renderer — `src/renderers/svg.ts`

Add a branch: `kind === "path"` → `<polyline points="…" fill="none" stroke="…" stroke-width="…"/>` (open, stroked, unfilled). The existing `segment` (2-point `<line>`) and `polygon` (closed, filled) branches are unchanged. Without this, arcs would render as closed filled polygons.

## Variants — `src/variants.ts`

Add `truchetGood()` and `truchetVariants()` (one deliberate failure per axis), shared by the acceptance test and the gallery:
- **broken-lattice** — `latticeJitter` high → `periodicity` drops.
- **gappy-grid** — `cellScale` < 1 → `constructionGrammar` drops.
- **disconnected-arcs** — `arcGap` > 0 → `lineContinuity` drops.
- **wrong-chord** — off-arc palette (`OFF_ARC`) → `colorChord` drops.

## improve() demo

A third gallery "Improvement" group: start from a jittered, gappy grid (`latticeJitter` high + `cellScale` < 1), run `improve(generateTruchet, start, truchetProfile, truchetTuning, { targetComposite: 0.99 })`, render the climb. The loop should fix `periodicity` (latticeJitter→0) and `constructionGrammar` (cellScale→1). Confirms the loop and tuning generalize to a brand-new medium with zero changes to `improve.ts`/`compose.ts`.

## Files

**New:**
- `src/operators/periodicity.ts` — the operator (+ register in `operators/index.ts`).
- `src/generators/truchet.ts` — generator + params.
- `src/profiles/truchet.ts` — profile.
- `src/tuning/truchet.ts` — tuning map.
- `test/operators/periodicity.test.ts` — operator units.
- `test/generators/truchet.test.ts` — generator structure (cell count, valid plan, lattice set).
- `test/acceptance-truchet.test.ts` — good outranks each variant; improve recovers a degraded start.

**Modified:**
- `src/operators/index.ts` — register `periodicity`.
- `src/renderers/svg.ts` — add the `path`→`<polyline>` branch.
- `src/variants.ts` — `truchetGood` + `truchetVariants`.
- `src/scripts/render-gallery.ts` — add a Truchet scorecard group + a Truchet improvement group.
- `README.md` — document the medium + the periodicity operator + the medium-agnostic finding.

**Untouched (the proof):** `src/compose.ts`, `src/improve.ts`, `src/tuning.ts`, `src/profile.ts`, all other operators.

## Testing

- **periodicity units:** a clean lattice scores 1.0; a jittered lattice scores < 1.0 and the fix is `increase`; an empty/no-lattice plan scores 1.0 (convention); matching ignores arc rotation (two plans with identical frames but different arc rotations score the same).
- **generator units:** `gridSize`² tile squares present; `validateRenderPlan` returns no errors; `symmetry.lattice` and `region` are set; arcs are `kind:"path"`, `role:"line"`.
- **acceptance:** `truchetGood` composite is high (probe-calibrated threshold); `good` outranks each of the four variants; each variant flags its expected axis among `fixes` (`gappy-grid`→constructionGrammar, `disconnected-arcs`→lineContinuity, `wrong-chord`→colorChord). Note `broken-lattice` (`latticeJitter`) degrades **both** `periodicity` and `lineContinuity` — moving whole cells off the lattice also pulls their arcs away from neighbors — so assert periodicity is flagged and is the top fix (it has the higher weight and drops hardest), not that it is the *only* fix. This coupling is benign: in the improve loop, driving `latticeJitter`→0 heals both axes at once.
- **improve acceptance:** from a jittered+gappy start, `improve(...).finalScore ≥ 0.85` and `> startScore`; trajectory touches `periodicity` and `constructionGrammar`; monotonic.
- All thresholds calibrated by `npx tsx -e` probe before the assertions are written.
- **Verification:** `npm test && npm run typecheck` clean; `npm run gallery` produces the Truchet groups (grep the output) and is eyeballed in a browser.

## Out of scope (this slice)

- **Injectable operator registry.** `periodicity` is registered in the existing global `operators/index.ts`. Making `compose` accept a per-project registry is a real future improvement (so projects add bespoke operators without bloating core), but nothing yet consumes the toolkit as an external project — building the seam now would be engineering for a hypothetical. Deferred until a real second consumer needs it. (Boundary principle is recorded in `CLAUDE.md` → Engineering discipline.)
- Mutating or generalizing the `symmetry` operator (we add `periodicity` instead).
- Orientation/rotation-variety scoring (a `tileComplexity`-style band on the rotation distribution) — possible later operator; not needed to prove the medium.
- `colorChord`/palette tuning (still the deferred v1 `improve` gap).
- Non-square Truchet (triangular/hex Truchet), multi-tile sets beyond the 2 arc rotations, animation.
- Wallpaper-group reflections/glides (only translational periodicity here).
