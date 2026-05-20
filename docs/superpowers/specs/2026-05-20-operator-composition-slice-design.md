# Operator-Composition Slice — Design Spec

**Date:** 2026-05-20
**Status:** draft for review
**Supersedes (in part):** `2026-05-18-toolkit-screensaver-design.md` — sharpens the toolkit's definition (toolkit = operator library) and makes evaluation *lead* the render-plan schema instead of generation. The earlier spec's renderer-agnostic render-plan + adapters architecture is retained.

## Purpose

Prove the **operator → profile → composer** spine end-to-end on controlled, self-generated data, deterministically (no CV, no VLM in the loop), and in doing so ship the **first real `toolkit/` modules**. This is the smallest slice that tests the cross-domain-composition model (see `feedback_cross-domain-composition.md`) and the operational-readiness model (see `feedback_operational-page-standard.md`).

### Why this slice
- Evaluating our own generator's structured output (the render-plan) removes the hardest risk — feature extraction from pixels — and gives **higher-information** input than any bitmap eval could (we keep the symmetry group, motif identity, construction hierarchy that a raster throws away).
- It collapses two open questions into one effort: *what is the toolkit?* (answer: the operator library) and *how do we evaluate?* (answer: pure functions over the render-plan).
- It yields a deterministic **generate → score → optimize** loop.

### Non-goals (explicit)
- External-image evaluation. Deferred; later added as an extraction front-end (CV/VLM → render-plan) feeding the *same* operators + profiles. Operators/profiles are reused; only the input adapter is new.
- Animation, WebGPU/Canvas renderers, full Samarkand fidelity (8/12-fold, organic grid-combination, glaze imperfections).
- VLM/human judgment in the inner loop. They move to the **calibration loop** (run rarely, to validate that high score ⇒ looks good).
- Optimization/parameter-search. The compose loop *enables* it; the slice doesn't build it.

## Core principle: operators measure, profiles set targets

An operator is a **pure, target-free measurement** over a render-plan. The **profile** supplies the medium-specific target range and weight. This resolves operator overlap/conflict (a universal "good = X" never gets baked into an operator) and keeps operators DRY and reusable across mediums.

```ts
type Measurement = { value: number; components?: Record<string, number> };
interface Operator {
  name: string;
  measure(plan: RenderPlan): Measurement;
  scoreAgainst(m: Measurement, target: unknown): { score: number; fix: Fix };
}
type Fix = { axis: string; direction: "increase" | "decrease" | "ok"; detail: string };
```

`score ∈ [0,1]`. `scoreAgainst` is where target lives; it returns both a score and a human/LLM-readable fix-direction.

## The render-plan schema — DERIVED FROM the 3 slice operators

We pick 3 operators first (they cover the user's stated IGP values: symmetry, elegant complexity, the blue chord), then the schema is exactly what they consume — no more.

| Operator | needs from the plan |
|---|---|
| **symmetry** | declared group + lattice/center/order; geometry as transformable primitives (points) |
| **complexity** | line segments with angles; which primitives belong to the same repeated motif |
| **colorChord** | a palette in OKLCH; per-element color references |

Resulting minimal schema:

```ts
interface RenderPlan {
  bounds: { width: number; height: number };
  symmetry: {
    group: string;            // "p6m" | "p4m" | "p3" | local "cn"/"dn" ...
    lattice?: [Vec2, Vec2];   // translation vectors (periodic patterns)
    center?: Vec2;            // rotation center (local rosette)
    order?: number;           // n-fold for a local motif
  };
  palette: Oklch[];           // the chord; Oklch = { l: number; c: number; h: number }
  elements: Element[];
}

type Vec2 = [number, number];

interface Element {
  kind: "segment" | "polygon" | "path";
  points: Vec2[];
  role: "line" | "tile" | "background"; // line = visible art, tile = scaffold (Lu-Steinhardt)
  colorRef?: number;          // index into palette (fills)
  strokeRef?: number;         // index into palette (strokes)
  motifId?: string;           // repeated-unit id (complexity + dedup)
}
```

`role` encodes the locked mental model (lines are the art, tiles are scaffolding); scorers can weight `role: "line"` geometry. **Open question O1:** do the 3 operators reveal a missing field once implemented? That discovery is the point of operator-first design — the schema above is the hypothesis, the implementation is the test.

## The three operators (slice definitions)

### 1. symmetry — continuous group fidelity
`measure`: apply the declared group's operations (rotations/reflections/translations from `symmetry`) to the line/tile geometry; report the fraction of primitives that map onto an existing primitive within tolerance ε. `value ∈ [0,1]` = fidelity.
- Continuous (not boolean) so it later scores intentional imperfection/glaze drift as a tradeoff.
- `scoreAgainst({minFidelity})`: score = clamp(value / minFidelity); fix = "increase" if below.
- **Open question O2:** ε tolerance (float + perspective-free since it's our own geometry) — propose ε = 1e-3 of bounds diagonal.

### 2. complexity — organized richness (Berlyne proxy)
`measure` returns components: `{ angleEntropy, motifCount, elementDensity }`.
- `angleEntropy`: normalized Shannon entropy of the segment-orientation histogram (binned, mod the symmetry order so symmetric copies don't inflate diversity).
- `motifCount`: count of distinct `motifId`s.
- `elementDensity`: line-elements per unit area, normalized.
- `value` = a weighted blend into [0,1] (weights fixed in operator; *target band* in profile).
- `scoreAgainst({band: [lo, hi]})`: score = in-band proximity (peaks inside band, falls off outside — the inverted-U). fix = "increase"/"decrease" toward band.
- This is the **fuzziest** operator and the most likely to need revision. The slice treats it as a proxy to validate, not truth.

### 3. colorChord — OKLCH chord adherence
`measure`: project the `palette` into OKLCH (already there) and report components: `{ hueInRange, chordRelations }` — fraction of palette hues inside the target hue arc, and how well lightness/chroma relations match required pair-relations (Arnheim color-syntax: identity/similarity/contrast). Uses `culori`.
- `scoreAgainst({ hueArc, requiredRelations })`: weighted score; fix names the off-target swatch + suggested OKLCH nudge.

## Profile schema

```ts
interface AestheticProfile {
  medium: string;                 // "timurid-igp"
  operators: ProfileBinding[];
  calibration?: { references: string[]; notes: string };
}
interface ProfileBinding {
  operator: string;               // "symmetry" | "complexity" | "colorChord"
  weight: number;
  target: unknown;                // operator-specific (typed per operator)
}
```

`profiles/timurid-igp.json` (initial, hand-set from the 9 references' qualities):
- symmetry: weight 0.35, `{ minFidelity: 0.98 }`
- complexity: weight 0.35, `{ band: [0.55, 0.78] }` (high but organized)
- colorChord: weight 0.30, `{ hueArc: <turquoise→cobalt>, requiredRelations: [...] }`

## The composer

```ts
function compose(plan: RenderPlan, profile: AestheticProfile): {
  composite: number;                 // weighted mean of per-operator scores
  perOperator: { name: string; score: number; fix: Fix }[];
  fixes: Fix[];                       // non-"ok" fixes, ranked by (1-score)*weight
}
```
Slice aggregation = **weighted mean**. **Interaction limit (crack #2) is accepted here**: the 3 chosen operators are relatively independent, but "organized complexity" (complexity *because* symmetric, not chaotic) is a real interaction this weighted sum can't express. Deferred to a future composite operator `f(complexity, symmetry)`; flagged so the slice can reveal whether the sum mis-ranks.

## Minimal IGP generator (to produce inputs)

`generators/igp.ts`: `generateIgp(params, seed) → RenderPlan`. Just enough to emit valid n-fold geometric line patterns on a periodic lattice (start 6-fold, p6m). Lines as the primary `role: "line"` elements; underlying polygon network as `role: "tile"`. Not the full Samarkand system — only what the acceptance test needs.

## Acceptance test (deterministic, the slice's pass/fail)

`test/compose.test.ts`:
1. Generate a "good" plan with profile-aligned params.
2. Produce **degraded variants** by perturbing the plan:
   - *broken-symmetry*: jitter points beyond ε → `symmetry` score must drop.
   - *over-dense / under-dense*: add/remove motifs → `complexity` leaves band.
   - *wrong-chord*: swap palette to off-arc hues → `colorChord` drops.
3. **Assert:** `composite(good) > composite(degraded)` for each variant, AND the top-ranked `fix` correctly names the broken axis.

This proves the spine: measurement works, targets discriminate, fixes localize.

## Qualitative calibration (the rare loop, not pass/fail)

`renderers/svg.ts`: `RenderPlan → SVG string`. Render the highest-scoring generated plan; eyeball against the 9 Samarkand references via the visual companion. Confirms high score ⇒ "looks Samarkand." If it doesn't, the *profile targets* (not the operators) are mis-set — tune and re-run. The references are the north star + this manual check; they are NOT scored directly (that would need the deferred CV path).

## Module layout

```
toolkit/
  package.json            # TS, vitest, culori; ESM
  tsconfig.json
  src/
    render-plan.ts        # types + constructor/validator
    operators/
      symmetry.ts
      complexity.ts
      color-chord.ts
      index.ts            # operator registry
    profile.ts
    compose.ts
    generators/igp.ts
    renderers/svg.ts
    profiles/timurid-igp.json
  test/
    compose.test.ts       # acceptance test
    operators/*.test.ts
```
TS-first per `feedback_language-preference.md`. Color via `culori` (OKLCH). No other runtime deps for operators. `vitest` per the `mcp/` convention.

## Wiki write-back (after the slice runs)

- IGP page (c-000191): add the `timurid-igp` aesthetic profile + pointers to the operator implementations.
- Operator concept pages (Visual Entropy / Fractal Dimension / Symmetry Groups / OKLCH / Arnheim's Color Syntax): add a pointer to the `toolkit/` operator that implements them.
- Re-score the affected rows in `wiki/meta/Operational Readiness Registry.md` (IGP's Evaluate should rise once it binds + composes).

## Open questions to resolve during implementation
- **O1** render-plan completeness — does any operator need a field not in the schema?
- **O2** symmetry tolerance ε.
- **O3** complexity blend weights + whether `angleEntropy` should be symmetry-quotiented.
- **O4** does the weighted-sum mis-rank any variant in a way that forces the organized-complexity composite operator earlier than planned?

## Decision log (this slice)
- Evaluate self-generated render-plans, not bitmaps (scope reduction, 2026-05-20).
- Operators measure; profiles set targets.
- Toolkit = operator library (pure functions over the render-plan).
- 3 operators chosen to span geometric-invariance / statistical-complexity / color-relational and to match the user's stated IGP values.

## Addendum 2026-05-20: tile medium + construction-grammar

Triggered by the user's observation that cuerda-seca (and grammar) presuppose **filled cells**, not lines: "make sure you're rendering tiles not lines." So before cuerda-seca we added a tile medium and the operator that validates it.

- **Tile generator** (`generators/tiling.ts`): concentric 6-fold rings of trapezoidal glaze cells around a central hexagon (31 cells), blue fills + cream channels. A valid tiling by construction; `cellScale` perturbs it (>1 overlap, <1 gaps) for degradation tests. Emits `role:"tile"` polygons + the `region` it is meant to fill.
- **Render-plan schema** gained `region?: Vec2[]` — the design boundary the cells should cover. Operator-dictated: constructionGrammar needs a *fixed* reference (must not scale with the cells, or gaps/overlaps cancel out). This answers O1: a real operator needed a field the schema lacked.
- **constructionGrammar operator**: `coverage = Σ cell area ÷ region area`; band ≈1.0. <1 → gaps (increase), >1 → overlap (decrease). Honest proxy — cannot catch an overlap exactly cancelled by a gap elsewhere; exact for uniform cell scaling. Cheap (no polygon clipping).
- **`timurid-tiling` profile**: symmetry (0.40) + constructionGrammar (0.35) + colorChord (0.25). `complexity` is line-oriented (measures segments) and is intentionally NOT bound — a tile-complexity operator (cell/colour variety) is future work. This is the composition model working: a different medium binds a different operator set.
- **Gallery** is now grouped (Tilework / Strapwork). Tiling acceptance test (`test/acceptance-tiling.test.ts`) proves good outranks overlapping / gappy / broken-symmetry / wrong-chord, and grammar distinguishes overlap (decrease) from gaps (increase).

**Still next:** cuerda-seca rendering quality (channel consistency between filled cells — now has tiles to evaluate), tile-complexity, and the O4 organized-complexity composite.

## Addendum 2026-05-20b: line-continuity operator

Strapwork's defining property: the eye follows a line *through* crossings (Gestalt good-continuation). Operator over `role:"line"` segments:
- Snap segment endpoints to a 1px grid → nodes with incident unit directions.
- **connectedness** = `1 − danglingEnds / totalEnds` (a dangling end = a degree-1 node: a segment that stops in space).
- **continuation** = at degree-≥2 nodes, for each incident edge the best `−dot` with another incident edge (1 = straight through); averaged.
- `value = 0.5·connectedness + 0.5·continuation`. Floor target `≥0.6` (higher is better).
- Added to `timurid-igp` (weights rebalanced to symmetry 0.30 / complexity 0.25 / lineContinuity 0.25 / colorChord 0.20 — symmetry kept highest so broken-symmetry stays the top fix).
- New generator knob `segmentScale` (<1 retracts each segment toward its midpoint, opening junction gaps) drives a "disconnected lines" degraded variant. Measured: good 0.635 (connected, moderate through-going) → 100%; disconnected 0.0 → 0%; jitter 0.007. Acceptance: good outranks disconnected and the top fix is lineContinuity→increase.

**Still next:** tile-complexity, the O4 organized-complexity composite.

## Addendum 2026-05-20c: cuerda-seca rendering quality

Cuerda seca = the matte "dry cord" line keeping adjacent glazes apart. Quality = the channels are **complete** (every cell has one) and **uniform** (equal width).
- **Schema:** `Element.channel?: number` — the cream channel width per tile. Rendered as the cream stroke (renderer stroke-width = `channel ?? 1.5`); construction-grammar is unaffected (it reads full-cell `points`, not the stroke).
- **Generator:** `channelWidth` (default 5) + `channelJitter` (default 0). Jitter deterministically perturbs per-cell channel — some widen, some shrink toward 0 (glazes touch).
- **cuerdaSeca operator:** `value = 0.5·completeness (channel ≥ 2px) + 0.5·uniformity (1 − coefficient-of-variation)`; floor target `≥0.85`.
- **Profile:** added to `timurid-tiling` (symmetry 0.35 / constructionGrammar 0.25 / cuerdaSeca 0.20 / colorChord 0.20). Variant "uneven channels" (jitter 1.0): cuerdaSeca 0.65 → 76%, top fix cuerdaSeca→increase; good = 100%.

**Still next:** tile-complexity, the O4 organized-complexity composite.
- Render-plan schema derived from operator needs, not designed up front.
