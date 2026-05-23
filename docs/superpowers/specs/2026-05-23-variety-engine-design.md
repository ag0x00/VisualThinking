# Variety Engine (Sub-project A) — Design

**Date:** 2026-05-23
**Subsystem:** B (toolkit)
**Status:** approved, pre-plan
**Branch:** `toolkit-screensaver` (extends PR #2)

## Goal

Generate a **new, random-but-tasteful 12-fold mosaic + palette every run**, reproducible from a single integer seed. The toolkit already has the taste engine (operators → `compose`); this adds the missing **variety engine** (seeded sampling of palette + geometry) and lets the score *filter* the randomness so output is varied yet never ugly.

This is **sub-project A**. Sub-project B (generalising the mosaic to other star folds — 8/10/12) and adding the other generators (igp/tiling/truchet) to the mix are deferred to their own cycles; the art director is structured so adding a generator later is a small extension.

## Decisions (from brainstorming)

- **Randomize:** palette + geometry params (girih12 only for v1).
- **Colour:** palettes **roam across families** — each run picks a hue family; `colorChord`'s `hueArc` is generated to match, so it judges *coherence-within-family + balance*, not "is it blue."
- **Quality:** **score-filtered** — sample N candidates, return the best (no `improve()` in v1).
- **Generator:** girih12 only this slice.
- **Seeded:** one integer → `mulberry32` → all sampling. Reproducible/shareable.

## Architecture

A new `src/variety/` module, deterministic, composing existing pieces (generators, profiles, `compose`). The screensaver (subsystem C) will call `generateArt(seed)` per session.

```
seed → mulberry32(rng)
        → sampleGirih12(rng) → { params (incl. generated palette), hueArc }
        → generate plan
        → profile' = girih12Profile with colorChord.target.hueArc := hueArc
        → compose(plan, profile') → score
   (repeat N times) → return best { plan, score, meta }
```

## Components

### `src/variety/rng.ts` — seeded RNG
- `mulberry32(seed: number): () => number` — deterministic PRNG in [0,1).
- helpers: `range(rng, lo, hi)`, `int(rng, lo, hi)`, `pick(rng, arr)`.

### `src/variety/palette.ts` — procedural chord
`randomChord(rng): { palette: Oklch[]; hueArc: { lo: number; hi: number } }`
- pick base hue `h0 ∈ [0,360)` and `spread ∈ [22,45]°`;
- **spine** (3 graded chromatic): lightness `~0.40 / ~0.58 / ~0.70` (jittered), hue within `h0 ± spread`, chroma `0.08–0.14`;
- **cream**: `l ≈ 0.95, c ≈ 0.012` (neutral; hue-exempt);
- **accent**: near-complementary hue `h0 + 180 ± 25`, chroma `0.10–0.14`, `l ≈ 0.6–0.8`;
- **gamut-map** every colour into sRGB with culori `clampChroma(..., "rgb")` so it renders true;
- emit in girih12's `SAMARKAND_7` index layout: `[spine0(star), spine1(petalA), spine2(petalB/tri), spine0'(idx3 filler/unused), cream, accent, accent', accent'']` (indices 3/6/7 are filler — the generator only reads 0,1,2,4,5);
- `hueArc = { lo: h0 - spread, hi: h0 + spread }` (colorChord's `hueInArc` already handles wraparound).

Lightness spread (~0.55) clears `minLightnessSpread` (0.45) by construction; the family arc keeps spine on-arc; cream < neutralCap; the accent is off-arc but tiny → high `colorChord` by construction (the score still filters out the occasional bad sample — e.g. low spread, over-budget accent).

### `src/variety/samplers.ts` — per-generator param sampler
`sampleGirih12(rng): { params: Girih12Params; hueArc }`
- `contactAngle ∈ [55,72]`, `dodecaRadius ∈ [55,90]`, `accentStride ∈ {3,4,5}`, `channelWidth ∈ [3,6]`;
- `groutGap = 0.05` fixed (the render-faithful sweet spot); `latticeJitter = channelJitter = 0` (jitter only ever degrades);
- `palette` + `hueArc` from `randomChord(rng)`;
- `rngSeed` derived from the rng (unused at 0 jitter, kept for completeness).

### `src/variety/art-director.ts` — the director
`generateArt(seed: number, opts?: { candidates?: number }): { plan: RenderPlan; score: number; meta: ArtMeta }`
- `rng = mulberry32(seed)`; `candidates` default 6;
- per candidate: `sampleGirih12(rng)` → `generateGirih12(params)` → clone `girih12Profile` overriding the `colorChord` binding's `target.hueArc` with the sampled `hueArc` → `compose` → keep the highest composite;
- `meta: { seed, generator: "girih12", params, hueArc, score }` — every output reproducible + inspectable.
- Profile cloning is a shallow copy with one binding's `target` replaced (profiles are plain data; the operator is untouched).

### `src/scripts/random-art.ts` — demo
- `tsx src/scripts/random-art.ts [seed]` → `generateArt(seed)` → write `out/random.svg` + print meta;
- `tsx src/scripts/random-art.ts grid` → render a grid of ~12 seeds to `out/random-grid.html` (reuse the gallery renderer) to eyeball variety. Verified inline via the resvg oracle.

## Testing

- **rng:** `mulberry32(s)` is deterministic; same seed → same stream; different seeds → different streams.
- **palette:** `randomChord` returns 8 colours, all in sRGB gamut (round-trip via culori), lightness spread ≥ 0.45, a neutral cream present, an accent present; `hueArc` brackets the spine hues.
- **samplers:** params land in the declared ranges; the palette validates for girih12.
- **art-director:** `generateArt(seed)` is deterministic per seed; returns a plan with `validateRenderPlan(plan) == []`; `score ≥ 0.85` (it's the best of N against the per-run profile); two different seeds produce different plans (params or palette differ); the returned score equals the max over the candidates (it actually selects the best).
- Probe candidate-score distribution with `npx tsx -e` before fixing the `≥0.85` floor (established pattern).

## Out of scope (this slice)

- Other generators in the mix (igp/tiling/truchet samplers) — deferred; the director has the seam.
- `improve()` polish on the winner — deferred.
- Fold generalisation (8/10/12) — **sub-project B**.
- Animation / transitions / the actual screensaver (subsystem C).
- A perceptual (VLM) check on generated palettes — future, pairs with the raster oracle.

## Rollout

spec → plan → TDD execute on `toolkit-screensaver`; keep the 111 tests green. No new dependencies (culori already present).
