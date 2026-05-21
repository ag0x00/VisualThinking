# 12-Fold Girih Glazed Mosaic (IGP Art) — Design

**Date:** 2026-05-21
**Subsystem:** B (toolkit)
**Status:** approved, pre-plan
**Branch:** `toolkit-screensaver` (extends PR #2)

## Goal

Generate actual Islamic geometric tile art with the toolkit: a **12-fold star-and-rosette glazed mosaic**, filled and colored like real Samarkand/Timurid tilework, evaluated and improvable by the operator spine we already have. This is the first piece built deliberately *as art* (not just an evaluation-loop vehicle), and the first run through the user's new-project learning workflow ([[new-project-learning-workflow]]): the method below is synthesized from what the wiki + the 2026-05-18 library audit already know — no re-research, no library port.

## What the wiki already gives us (the method)

From `Islamic Geometric Patterns and the Polygonal Technique` (c-000191) + `Symmetry-Group Pattern Generator` (c-000221) + `Research - IGP Library Landscape 2026-05-18`:

- **Construction = Bonner's polygonal technique:** lay a polygon tessellation on a symmetry-group grid, then from each polygon **edge midpoint emit two chords at ±`contactAngle`**; the chords meet to form stars. `contactAngle` is the primary aesthetic parameter (~70–80° acute, 50–60° median, 30–40° obtuse).
- **Build-vs-borrow verdict (already decided):** "port the math, depend on nothing." The geometry is small; the toolkit's value-add is the *aesthetic* layer (cuerda-seca channels, glaze, OKLCH chord). So this is an original, minimal construction — **no tactile-js port, no general 17-group engine**.
- **Palette (recovered from the 05-18 reference-image analysis):** the authentic Samarkand chord is **7 colors in two tiers** — a cool spine (~95% of frame) plus three warm accents at **< 5% of frame**, deployed *only inside rosette/star centers and small cells*, never as ground.

## Geometry

The base tiling is the **3.12.12 (truncated-hexagonal) tiling**: regular **dodecagons on a hexagonal lattice, sharing edges**, with **equilateral triangles** filling the corners where three dodecagons meet. A true edge-to-edge partition, so it is genuinely periodic (the `periodicity` operator applies). Dodecagon centers form the hex lattice; with dodecagon circumradius `R`, adjacent centers are `D = 2·R·cos(π/12)` apart, and the lattice vectors are `[D, 0]` and `[D·cos60°, D·sin60°]`.

Each dodecagon is **decorated** into a 12-pointed star by the polygonal technique. Because a regular dodecagon is fully symmetric, the chord intersections fall at a known radius/angle determined by `contactAngle` — **pure trig, no polygon-boolean ops.** That partitions each dodecagon into:
- a central **12-pointed star** region, and
- **12 petal/kite** regions between the star arms and the dodecagon edges.

The interstitial **triangles** are their own tile regions.

`latticeJitter > 0` displaces each dodecagon-cluster off its lattice point (degrades periodicity); `groutGap > 0` insets every region toward its centroid (dark channels between glazes — the real-tile look; reduces coverage); `channelJitter > 0` perturbs per-region channel widths (degrades cuerda-seca).

## Palette — `SAMARKAND_7` (new constant, does NOT touch the shared one)

**Decision:** the existing `igp`/`tiling` generators derive `bgIdx = palette.length-1`, `creamIdx = length-2`, `fillCount = length-2` from `SAMARKAND_PALETTE`. Growing that array would silently change their indexing and make them use the warm accents as glaze fills. So we add a **dedicated** palette for this generator and leave `SAMARKAND_PALETTE` (5 cool colors) untouched.

`SAMARKAND_7` (OKLCH; accents last, indices documented; values to be eyeball-calibrated against the reference images during implementation):

| idx | name | OKLCH (approx) | role |
|---|---|---|---|
| 0 | cobalt | l0.45 c0.12 h240 | star glaze (dominant) |
| 1 | turquoise | l0.62 c0.11 h200 | petal glaze |
| 2 | light-turquoise | l0.72 c0.09 h190 | triangle glaze / secondary |
| 3 | deep-blue | l0.30 c0.06 h250 | field / ground |
| 4 | cream | l0.95 c0.01 h200 | cuerda-seca channel (neutral; hue-exempt) |
| 5 | saffron | l0.78 c0.13 h80 | **accent (<5%)** — warm, near-complementary |
| 6 | sienna | l0.50 c0.10 h50 | **accent (<5%)** |
| 7 | sage | l0.62 c0.05 h135 | **accent (<5%)** |

**Accent placement:** the three accents are applied *only* to the small inner core of each star and a sparse, deterministic subset of triangles, area-budgeted so total accent coverage stays **< 5%**. The generator exposes `accentBudget` (default 0.05) and skips accenting once the budget is hit.

**Why the accents enrich** (per `Color Harmony` c-000017, `Complementary Colors` c-000061, `Arnheim's Color Syntax` c-000060): unequal proportion (dominant cool field : subordinate cream : tiny warm accent ≈ 60-30-10) reads as *composed* rather than *filled*; the warm accent is near-complementary to the cool ground → maximal chromatic vibrancy at its boundary; and a small high-chroma spot becomes a focal center of visual weight in an otherwise even tessellation. The < 5% budget is what makes it punctuation rather than a competing system.

## Scoring — reuse the spine, one honest caveat

Profile `girih12` binds operators we already have (no new operator):

| operator | weight | target | rewards |
|---|---|---|---|
| `periodicity` | 0.30 | floor ≥0.95 | clean lattice (undrifted) |
| `constructionGrammar` | 0.30 | band **[0.85, 1.05]** | regions fill the canvas; the **grout gap is a feature**, so the band's lower bound is loosened to ~0.85 to *accept* a visible grout (only excessive gapping scores low). This is taste living in the profile, not a change to the operator — the operator still just measures coverage. |
| `cuerdaSeca` | 0.20 | floor ≥0.85 | uniform, complete cream channels |
| `colorChord` | 0.20 | hueArc 180–265, minSpread 0.45 | the cool chord |

**Honest caveat (documented in the spec + README):** the current `colorChord` models a *single* hue arc, so it will **under-score the warm accents** (saffron/sienna/sage are off-arc) — the historically-correct, richer palette scores *lower* on color than a cool-only one would. This is the wrong behavior, and the fix (a proportion-aware chord: dominant family + accents under an area budget) is on the todo (`project_subsystem-trajectory.md` → NEXT). For v1 we accept the modest penalty and keep `colorChord`'s weight at 0.20; **`improve()` cannot "fix" it by removing accents because the palette is not a tuning knob** (only `latticeJitter`/`groutGap`/`channelJitter` are).

## improve() knobs — `girih12` tuning map

```
periodicity         → latticeJitter   (invert, cliff knob: coarse step = max → 0 in one move)
constructionGrammar → groutGap        (invert: more grout = less coverage)
cuerdaSeca          → channelJitter   (invert: less jitter = more uniform)
```

`contactAngle`, `dodecaRadius`, `accentBudget` are aesthetic params we set, **not** tuning knobs (they don't map to a scored axis). A degraded start (lattice jitter + oversized grout) lets the loop demonstrate generate→score→fix→regenerate on this third real medium.

## Components / files

**New:**
- `src/generators/girih12.ts` — `Girih12Params`, `defaultGirih12Params`, `generateGirih12`, and `SAMARKAND_7`.
- `src/profiles/girih12.ts` — `girih12Profile`.
- `src/tuning/girih12.ts` — `girih12Tuning`.
- `test/generators/girih12.test.ts` — structure (valid plan; star+petal+triangle tile counts; lattice + region set; accent coverage < 5%).
- `test/acceptance-girih12.test.ts` — good outranks each variant; `improve` recovers a degraded start.

**Modified:**
- `src/variants.ts` — `girih12Good` + `girih12Variants` (broken-lattice, gappy-grout, uneven-channels, wrong-chord).
- `src/scripts/render-gallery.ts` — a Girih12 scorecard group + a Girih12 improvement group.
- `README.md` — document the piece, `SAMARKAND_7`, and the colorChord caveat.

**Untouched (the proof, again):** `compose.ts`, `improve.ts`, `tuning.ts`, `profile.ts`, all operators, `SAMARKAND_PALETTE`, and the other generators.

## Testing

- **Generator structure:** `validateRenderPlan` returns no errors; tile counts match (per dodecagon: 1 star + 12 petals; plus triangles; plus background); `symmetry.lattice` and `region` set; **total accent-colored area < 5%** of canvas (assert directly from polygon areas).
- **Acceptance:** `girih12Good` composite is high (probe-calibrated threshold, mostly relative: good > each variant); each variant flags its expected axis (`broken-lattice`→periodicity top fix; `gappy-grout`→constructionGrammar; `uneven-channels`→cuerdaSeca; `wrong-chord`→colorChord).
- **improve acceptance:** from a jittered + over-grouted start, `finalScore ≥` (probe-set threshold) and `> startScore`; trajectory touches `periodicity` and `constructionGrammar`; monotonic.
- All thresholds calibrated by `npx tsx -e` probe before assertions are written (the established pattern). Cliff-knob steps (`latticeJitter`) derived from the eps math, no probe.
- **Visual verification:** `npm run gallery` renders the Girih12 groups; open in a browser and confirm it reads as a 12-fold glazed mosaic with cream channels, grout, and sparse warm accents.

## Out of scope (this slice)

- **Proportion-aware `colorChord`** that would actually *reward* the accents — on the todo; v1 accepts the under-score.
- **Closure / broken-line aesthetic** (the eye completing interrupted channels) — on the todo; v1 channels are continuous.
- General Hankin engine for all symmetry groups; tactile-js / wallpaper-groups port; girih quasicrystal inflation.
- Glaze imperfections (per-cell noise, kiln warp), animation, strapwork-overlay ("both layers" v2).
- Growing or refactoring `SAMARKAND_PALETTE`; injectable operator registry.
