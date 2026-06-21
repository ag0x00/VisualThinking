---
address: c-000226
title: Research - IGP Library Landscape 2026-05-18
type: source
status: developed
tags: [research, igp, tessellation, library-audit, toolkit-design, samarkand, build-phase]
created: 2026-05-18
updated: 2026-05-18
sweep: build-phase-library-audit
---

# Research - IGP Library Landscape 2026-05-18

**Build-phase library audit** triggered during the [[Wiki Methodology|toolkit-screensaver]] brainstorm (branch `toolkit-screensaver`). Run via 4 parallel research subagents on 2026-05-18 after the user flagged that the brainstorm had drifted into drawing pattern variants without first surveying existing JS/TS libraries — a violation of the `feedback_catalog-stub-cross-check` convention extended to build phases.

> [!warning] Why this research happened
> The artifact (Samarkand-style macOS screensaver) is a *test case* for the wiki+MCP+toolkit workflow; the workflow is the product. This audit surfaces what the wiki and MCP missed (or under-surfaced) and what existing prior art exists before the toolkit invests in custom geometry code. See `feedback_test-artifact-vs-workflow.md`.

## Methodology

Four general-purpose subagents dispatched in parallel:

1. **Alzulejo** evaluation (npm + Svelte) — user-surfaced
2. **Alhambra** evaluation (academic, Girih-based) — user-surfaced
3. **IkarosKappler/girih** evaluation (TS, polygon-circle intersections) — user-surfaced
4. **Broader hunt** — npm/GitHub searches across `islamic geometric pattern`, `girih`, `wallpaper group`, `tessellation`, `hat monotile`, `penrose tiling`, `truchet`, `wang tiles`, plus Craig Kaplan academic ecosystem

Per-library scoring against [[Library Evaluation Rubric]] (c-000219). Output: build vs borrow vs port guidance for the toolkit author.

## Inventory of candidates

### First-class for math borrowing

**[[tactile-js]]** (Craig Kaplan, https://github.com/isohedral/tactile-js)
- **BSD-3-Clause**, 240 stars, no npm publish (ES6 module via direct import)
- Covers **81 of 93 isohedral tiling types**; edge-shape classes (J/U/S/I), prototile manipulation
- The canonical academic library — same machinery that powers Kaplan's Taprats/Alhambra lineage and the 2024 SIGGRAPH Escher Meshes paper
- Renderer-agnostic; outputs geometry, caller draws
- **Verdict**: port the isohedral classification + edge-shape parameterization into the toolkit. BSD-3 license makes this safe.

**[[Alhambra]]** (Pierre Baillargeon / Craig Kaplan, https://github.com/pierrebai/Alhambra)
- **C++/Qt, GPL-2.0**, 54 stars. Active (last push 2024-12-27)
- Descendant of Kaplan's Taprats (Java applet). Canonical implementation of Hankin–Lee–Kaplan inference + Lu-Steinhardt-style inflation
- Algorithms worth porting (all derivable from Kaplan's Bridges 2000 paper — legally clean since algorithms predate the GPL code):
  - `infer.h` — polygon-in-contact inference with star/girih/intersect/hourglass/rosette/simple strategies
  - `rosette.h` — Lee 1995 rosette construction (`n, q, s`) — directly answers 8-fold-on-p4m / 12-fold-on-p6m
  - `star.h` — classic `[n/d]s` star figure (10/3 star, etc.)
  - `inflation_tiling.h` — substitution/inflation
- Bonus: `.tiling` data files (Penrose, Girih Inflation 10, Girih Crab) — reverse-engineerable to JSON, usable as **visual-regression oracle**
- **Verdict**: niche for direct integration (wrong language, viral license); first-class for math borrowing via the Kaplan papers.

### First-class for aperiodic (Hat/Spectre)

**[[hatviz]]** (Kaplan / Smith / Myers / Goodman-Strauss, https://github.com/isohedral/hatviz)
- **BSD-3-Clause**, 117 stars. p5.js app (not a library)
- Hat + Spectre monotile patches with metatile/supertile visualization
- **Verdict**: port-the-math candidate for [[Aperiodic Tiling and the Hat Monotile]] coverage; not a runtime dependency.

### Second-class npm candidates

**[[wallpaper-groups]]** (eskimoblood, https://www.npmjs.com/package/wallpaper-groups)
- **MIT**, 6 stars. Pure JS, npm-published
- 15 of 17 wallpaper groups (missing `p1`, `p6m`/`p6mm` per their list)
- Returns transformed line arrays — renderer-agnostic
- **Verdict**: pragmatic foundation for the repetition layer; missing the rosette/girih decoration step.

**[[PlotBoilerplate]]** (IkarosKappler, https://github.com/IkarosKappler/plotboilerplate)
- **MIT**, TypeScript, npm `plotboilerplate`, **v1.27.1 March 2026** (actively maintained, 1062 commits)
- Same author as IkarosKappler/girih; explicitly credits Lu & Steinhardt
- Primitives + SVG/Canvas/WebGL renderers + exporters — the author's **living** geometry stack
- **Verdict**: worth a follow-up evaluation as a renderer substrate OR as a math library to depend on. Supersedes IkarosKappler/girih.

### Niche / archival

**[[Alzulejo]]** (jesi-rgb, https://www.npmjs.com/package/alzulejo)
- MIT, ~22 weekly downloads, 0 stars. Svelte 5 + Canvas2D
- Implements **Hankin/Bonner edge-midpoint contact-angle algorithm** at `src/lib/core/geometry/polygon.svelte.ts:160-224` with a clean configurable `contactAngle` knob
- **Most reusable piece**: `src/lib/core/geometry/rosette.svelte.ts` — a `PlanarGraph` class implementing Bonner's "discard underlay, keep line network" transformation (~384 LOC)
- Covers 7 Archimedean-ish tilings (triangle, square, hexagon, octagon-square, rhombitrihexagonal, snub-square, truncated-hexagonal). No 10/3 star, no girih, no decagonal.
- **Verdict**: don't depend on it; lift the two algorithms above, drop the Svelte runes.

**[[IkarosKappler/girih]]** (https://github.com/IkarosKappler/girih)
- **GPL-2.0**, 3 stars, last commit 2018, ES5 pre-package globals
- The 5-tile Lu-Steinhardt set is present (Decagon, Pentagon, IrregularHexagon, Rhombus, BowTie) but **no subdivision/inflation rule implemented** — it's a registry, not a generator
- Polygon-circle in the README is misleading — actually polygon-polygon clipping + circle-circle intersection
- Useful for **reference data**: `TILE_ALIGN` adjacency lookup pattern, decagon parametric constants (`theta=36°`, `0.615`/`0.69` scaling)
- **Verdict**: archival reference. Look at author's [[PlotBoilerplate]] sibling instead.

**TiledPatternMaker** (ChortleMortal, https://github.com/ChortleMortal/TiledPatternMaker)
- **C++/Qt, GPL-2.0**, 23 stars, actively maintained (v4.2 March 2026)
- Port of Kaplan's Taprats to C++. Heavy IGP design IDE
- **Verdict**: study, don't embed. GPL is a hard constraint for commercial brand work.

**TheBeachLab/islamic-geometry** (https://github.com/TheBeachLab/islamic-geometry)
- MIT, 53 stars. Workshop materials in Java/Processing/NodeBox — **not a library**
- **Verdict**: reference value only.

**guinetik/penrose-js** (https://github.com/guinetik/penrose-js)
- MIT, 0 stars, npm-published. P3 rhombus subdivision, Canvas/bitmap
- **Verdict**: niche; useful only if Hat doesn't fit and Penrose P3 is desired.

**ykadosh/truchet.js** (https://github.com/ykadosh/truchet.js)
- npm `truchet.js` v1.2.0, stale (2019)
- Reactive tile-prop diffing for performant rendering — the framework idea more interesting than the Truchet primitives
- **Verdict**: adjacent reference for the rendering pattern.

**geopattern family** (https://github.com/btmills/geopattern)
- ~10y old. SHA1-string → decorative SVG — not symmetry-group aware
- **Verdict**: dead for our use case.

## Recommendation matrix

| Need | Best fit |
|---|---|
| 17 wallpaper-group periodic tiling primitives | [[wallpaper-groups]] for transforms; [[tactile-js]] for prototile math |
| Girih-tile decoration + subdivision (Lu-Steinhardt, Bonner) | None directly — port from [[tactile-js]] + Kaplan papers |
| Isohedral tilings / Escher-style fundamental domains | [[tactile-js]] (definitive) |
| Hat/Spectre aperiodic monotile | Port from [[hatviz]] |
| Penrose P2/P3 | guinetik/penrose-js or port from Lu-Steinhardt paper |
| Local 8-fold and 12-fold rosettes on periodic lattices | Port Lee 1995 rosette from [[Alhambra]] `rosette.h` |
| WebGPU-native rendering | **No library** — toolkit responsibility |
| OKLCH palette / Samarkand chord | **No library** — toolkit responsibility ([[culori]] for color math) |
| Cuerda-seca outline rendering | **No library** — toolkit responsibility |
| Animation on symmetry-group orbits | **No library** — toolkit responsibility |

## Math primitives common across libraries

All five are pure-math, framework-agnostic, standalone-extractable, ~100-500 LOC each:

1. **Wallpaper-group transform sets** — 17 hand-coded affine matrix families. Static data. (`wallpaper-groups`, `tactile-js`)
2. **Polygon edge-midpoint construction / Hankin-style line extension** — rays from polygon-edge midpoints at parameterized angle until intersection. This is the Bonner/Kaplan core. (`Alzulejo`, `Alhambra`, `tactile-js`)
3. **Subdivision recursion with golden-ratio scaling** — Penrose, girih self-similarity, Lu-Steinhardt inflation. (`Alhambra` `inflation_tiling.h`)
4. **Isohedral edge-shape parameterization** (J/U/S/I classifier) — non-trivial; tedious to re-derive. (`tactile-js`)
5. **Prototile clipping / fundamental-domain repetition** — straightforward affine. (All libraries)

## Significant gaps (no library covers)

- **Cuerda-seca line rendering** — the cream channel between glaze cells. Needs path-offset / inset-stroke with double-stroke compositing.
- **Glaze imperfections** — controlled noise on edge offsets, drip simulation, kiln-distortion warps. Procedural-ceramic territory.
- **OKLCH palette generation tuned to Samarkand chord** — [[culori]] handles OKLCH; the *aesthetic selection layer* is missing.
- **Animation timeline on symmetry orbits** — fading-in by rotational orbit position, breathing along group cosets.
- **Bonner's 5 girih tiles as first-class primitives with semantic decoration overlays** — academic papers describe it; no maintained JS implementation exists.
- **Quasi-crystalline self-similar inflation** (Lu-Steinhardt Fig. 3 D/E) — no JS library exposes it.

## Adjacent fields worth considering

- **Truchet tiles** (ykadosh/truchet.js, DRynne/Multiscale-Truchet) — simpler analogue while validating rendering pipeline
- **Wang tiles** (josephg/wangjs, ajlopez/WangTilesJS) — constraint-satisfaction model maps cleanly onto girih-edge matching (Bonner's strapwork constraints are essentially Wang-edge constraints in disguise)
- **paper.js** — boolean operations useful for cuerda-seca path-offset
- **Generative Escher Meshes** (SIGGRAPH 2024, https://arxiv.org/abs/2309.14564) — text-guided differentiable mesh optimization on isohedral fundamental domains. Built on tactile-js.

## Recommendation

**Port the math, depend on nothing.**

Specifically for the toolkit's `wallpaper/` module:
1. Extract [[tactile-js]]'s isohedral classification + edge-shape parameterization (BSD-3) into TS, framework-free
2. Adopt or port [[wallpaper-groups]]'s 17-group transform tables (MIT)
3. Port Hankin/Bonner edge-midpoint line extension from [[Alzulejo]]'s `polygon.svelte.ts` (MIT) — the cleanest implementation, ~64 LOC
4. Port Lee 1995 rosette construction from Kaplan's Bridges 2000 paper (the algorithm, not [[Alhambra]]'s GPL code)
5. Use [[Alhambra]]'s `.tiling` files (reverse-engineered to JSON) as **visual-regression test oracle**

For everything else (cuerda-seca, glaze imperfections, OKLCH palette, animation, WebGPU rendering) — toolkit-original work regardless of library choice.

**Treat [[Alzulejo]]'s `rosette.svelte.ts` PlanarGraph class as a reference for the "discard underlay, keep line network" transformation** — it's ~384 LOC of exactly the operation Bonner's polygonal technique requires.

Defer [[PlotBoilerplate]] evaluation as the next library question — IkarosKappler's actively-maintained MIT TS geometry library could substitute or augment the manual port. Worth one follow-up subagent run.

## Workflow lessons surfaced by this research

1. **`wiki_orient` under-surfaces named-tradition terms.** For an intent containing "Bonner / Islamic geometric / Samarkand", `orient` returned color/composition/perception starting points but missed [[Islamic Geometric Patterns and the Polygonal Technique]] (c-000191) and [[Symmetry-Group Pattern Generator]] (c-000221). Logged to `mcp/tasks/lessons.md`. **Workaround**: pair `orient` with `search` keyword on distinctive terms.

2. **The IGP page was research-synthesis depth, not implementation-depth.** A toolkit author needs concrete algorithms + library recommendations + code patterns. This research augments c-000191 with an Implementation Landscape section. (Convention: post-build-audit, refactor concept pages to include landscape sections.)

3. **The wiki had no IGP tool pages.** Despite [[Islamic Geometric Patterns and the Polygonal Technique]] being a complete concept and [[Symmetry-Group Pattern Generator]] being a technique, no tool pages existed for the libraries that operationalize them. This research creates 3 new tool pages (tactile-js, wallpaper-groups, PlotBoilerplate). Convention extension: every Technique page should link to ≥1 evaluated Tool page.

4. **npm-search audit must happen BEFORE designing**, not just before cataloging. See `feedback_npm-audit-before-design.md`. The 10-minute parallel-subagent audit done in this session would have prevented 3 rounds of wrong-direction brainstorming if done at session start.

## Sources

1. Bonner, Jay. *Islamic Geometric Patterns: Their Historical Development and Traditional Methods of Construction*. Springer Nature 2017. https://link.springer.com/book/10.1007/978-1-4419-0217-7
2. Lu, Peter J. and Steinhardt, Paul J. *Decagonal and Quasi-crystalline Tilings in Medieval Islamic Architecture*. Science 315 (5815): 1106-1110, 2007. https://www.science.org/doi/10.1126/science.1135491
3. Kaplan, Craig S. *Computer Generated Islamic Star Patterns*. Bridges 2000. http://www.cgl.uwaterloo.ca/~csk/washington/tile/papers/kaplan_bridges2000.pdf
4. Kaplan, Craig S. *Islamic Star Patterns in Absolute Geometry*. 2004. https://grail.cs.washington.edu/wp-content/uploads/2015/08/kaplan-2004-isp.pdf
5. Generative Escher Meshes (SIGGRAPH 2024). https://arxiv.org/abs/2309.14564
6. Bridges 2025: Variable-Based Generation of Girih Patterns. http://www.archive.bridgesmathart.org/2025/bridges2025-255.pdf

## Later additions (stashed, unvetted — for the real-generator phase)

- **Michael Fares — "How I made an SVG Islamic Tessellation Coloring App with d3.js and React"** (user-surfaced 2026-05-20). Step-by-step how-to with code for SVG tessellation *generation mechanics* (not aesthetics). Post: https://michael-fares.medium.com/how-i-made-an-svg-islamic-tessellation-coloring-app-with-d3-js-and-react-d0cd2155d3ab · code: https://github.com/Michael-Fares/tiles . **Why stashed:** the current toolkit generator is a deliberately minimal 6-fold vehicle for tuning the *evaluation* feedback loop; richer generation is deferred. Evaluate this (license, d3-dependency fit vs the "depend on nothing" recommendation, polygonal-technique fidelity) when building the production generator. Note: the user signalled the eventual aesthetic target may not be IGP specifically — confirm medium before investing here.

## Related

- [[Islamic Geometric Patterns and the Polygonal Technique]] (c-000191) — augmented with Implementation Landscape section
- [[Symmetry Groups and Tessellation]] (c-000189)
- [[Aperiodic Tiling and the Hat Monotile]] (c-000190)
- [[Symmetry-Group Pattern Generator]] (c-000221) — augmented with Build vs Borrow guidance
- [[Library Evaluation Rubric]] (c-000219)
- [[tactile-js]] · [[wallpaper-groups]] · [[PlotBoilerplate]]
