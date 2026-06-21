# Variety Engine (Sub-project A) — Design

**Date:** 2026-05-23
**Subsystem:** B (toolkit)
**Status:** approved, pre-plan
**Branch:** `toolkit-screensaver` (extends PR #2)

## Goal

Generate a **new, random-but-tasteful 12-fold mosaic + palette every run**, reproducible from a single integer seed. The toolkit already has the taste engine (operators → `compose`); this adds the missing **variety engine** (seeded sampling of palette + geometry) and lets the score *filter* the randomness so output is varied yet never ugly.

This is **sub-project A**. Sub-project B (generalising the mosaic to other star folds — 8/10/12) and adding the other generators (igp/tiling/truchet) to the mix are deferred to their own cycles. We deliberately do **not** build a generator-selection seam now — adding a generator later means writing its sampler and a small dispatch *then*, which is cheaper than carrying an unused abstraction.

## Decisions (from brainstorming)

- **Randomize:** palette + geometry params (girih12 only for v1).
- **Colour:** palettes **roam across families** — each run picks a hue family; `colorChord`'s `hueArc` is generated to match, so it judges *coherence-within-family + balance*, not "is it blue."
- **Quality:** a **quality-floor guard**, not best-of-N. Sample one; accept if `score ≥ floor`; else resample (a few tries, then accept the best seen). This honours the *measure, don't trust intent* principle ([[feedback_measure-rendered-reality-not-intent]]) without the optimiser behaviour of best-of-N — which would converge outputs toward the profile's favourite region and *reduce* the variety we're after. (No `improve()` in v1.)
- **Generator:** girih12 only this slice — a single `randomGirih12`, no generator-selection seam (YAGNI for one generator).
- **Seeded:** one integer → `mulberry32` → all sampling. Reproducible/shareable.
- **One file:** `src/variety.ts` — rng + chord + sampler + entry. Not a multi-file module (premature for ~120 lines).

## Architecture

A single deterministic file `src/variety.ts`, composing existing pieces (generator, profile, `compose`). The screensaver (subsystem C) will call `generateArt(seed)` per session.

```
seed → mulberry32(rng)
        → sampleGirih12(rng) → { params (incl. generated palette), hueArc }
        → generateGirih12(params)
        → profile' = girih12Profile with colorChord.target.hueArc := hueArc
        → compose(plan, profile') → score
        → accept if score ≥ floor, else resample (≤ maxTries, keep best seen)
   → { plan, score, meta }
```

## Components

All of the following live in **one file, `src/variety.ts`** (one concept — variety — held in one place), plus a demo script and a test file.

### seeded RNG
- `mulberry32(seed: number): () => number` — deterministic PRNG in [0,1).
- helpers: `range(rng, lo, hi)`, `int(rng, lo, hi)`, `pick(rng, arr)`.

### procedural chord
`randomChord(rng): { palette: Oklch[]; hueArc: { lo: number; hi: number } }`
- pick base hue `h0 ∈ [0,360)` and `spread ∈ [22,45]°`;
- **spine** (3 graded chromatic): lightness `~0.40 / ~0.58 / ~0.70` (jittered), hue within `h0 ± spread`, chroma `0.08–0.14`;
- **cream**: `l ≈ 0.95, c ≈ 0.012` (neutral; hue-exempt);
- **accent**: near-complementary hue `h0 + 180 ± 25`, chroma `0.10–0.14`, `l ≈ 0.6–0.8`;
- **gamut-map** every colour into sRGB with culori `clampChroma(..., "rgb")` so it renders true;
- emit in girih12's `SAMARKAND_7` index layout: `[spine0(star), spine1(petalA), spine2(petalB/tri), spine0'(idx3 filler/unused), cream, accent, accent', accent'']` (indices 3/6/7 are filler — the generator only reads 0,1,2,4,5);
- `hueArc = { lo: h0 - spread, hi: h0 + spread }` (colorChord's `hueInArc` already handles wraparound).

Lightness spread (~0.55) clears `minLightnessSpread` (0.45) by construction; the family arc keeps spine on-arc; cream < neutralCap; the accent is off-arc but tiny → harmonious by construction. The floor guard (below) catches the rare bad sample (low spread, over-budget accent) without optimising away variety.

### param sampler
`sampleGirih12(rng): { params: Girih12Params; hueArc }`
- `contactAngle ∈ [55,72]`, `dodecaRadius ∈ [55,90]`, `accentStride ∈ {3,4,5}`, `channelWidth ∈ [3,6]`;
- `groutGap = 0.05` fixed (the render-faithful sweet spot); `latticeJitter = channelJitter = 0` (jitter only ever degrades);
- `palette` + `hueArc` from `randomChord(rng)`;
- `rngSeed` derived from the rng (unused at 0 jitter, kept for completeness).

### the entry function
`generateArt(seed: number, opts?: { floor?: number; maxTries?: number }): { plan: RenderPlan; score: number; meta: ArtMeta }`
- `rng = mulberry32(seed)`; `floor` default ~0.9, `maxTries` default 5;
- each try: `sampleGirih12(rng)` → `generateGirih12(params)` → clone `girih12Profile` overriding the `colorChord` binding's `target.hueArc` with the sampled `hueArc` → `compose`;
- **accept the first sample with `score ≥ floor`**; if none clears in `maxTries`, return the best seen (never fails to produce output). Not best-of-N — a floor guard, so a tasteful sample is returned *as sampled*, preserving variety.
- `meta: { seed, generator: "girih12", params, hueArc, score, tries }` — every output reproducible + inspectable.
- Profile cloning is a shallow copy with one binding's `target` replaced (profiles are plain data; the operator is untouched).

### `src/scripts/random-art.ts` — demo
- `tsx src/scripts/random-art.ts [seed]` → `generateArt(seed)` → write `out/random.svg` + print meta;
- `tsx src/scripts/random-art.ts grid` → render a grid of ~12 seeds to `out/random-grid.html` (reuse the gallery renderer) to eyeball variety. Verified inline via the resvg oracle.

## Testing

- **rng:** `mulberry32(s)` is deterministic; same seed → same stream; different seeds → different streams.
- **palette:** `randomChord` returns 8 colours, all in sRGB gamut (round-trip via culori), lightness spread ≥ 0.45, a neutral cream present, an accent present; `hueArc` brackets the spine hues.
- **sampler:** params land in the declared ranges; the palette validates for girih12.
- **generateArt:** deterministic per seed; returns a plan with `validateRenderPlan(plan) == []`; `score ≥ floor` whenever a try cleared it (assert against the chosen floor); two different seeds produce different plans (params or palette differ); a deliberately-low floor returns on the first try (proves it accepts-as-sampled, not best-of-N).
- Probe the score distribution across ~20 seeds with `npx tsx -e` before fixing `floor` (established pattern): set it so most samples clear it in one try (variety preserved) and only genuine duds resample.

## Out of scope (this slice)

- Other generators in the mix (igp/tiling/truchet samplers) — deferred; no selection seam built now.
- best-of-N optimisation and `improve()` polish — deferred (and best-of-N is anti-variety; revisit only if a floor guard proves insufficient).
- Fold generalisation (8/10/12) — **sub-project B**.
- Animation / transitions / the actual screensaver (subsystem C).
- A perceptual (VLM) check on generated palettes — future, pairs with the raster oracle.

## Rollout

spec → plan → TDD execute on `toolkit-screensaver`; keep the 111 tests green. No new dependencies (culori already present).
