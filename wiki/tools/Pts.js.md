---
title: Pts.js
type: tool
status: developing
tags: [tool, library, geometric, composition, 2d, javascript]
address: c-000126
created: 2026-05-17
url: https://ptsjs.org/
license: Apache-2.0
last_release: 0.12.x (active in 2026)
verdict: second-class-niche-strong
---

# Pts.js

A **geometric-composition library** (William Ngan / Adobe, 2017+) designed for **points, paths, geometry, and visual algorithms**. Where p5.js is general-purpose and three.js is 3D, Pts.js focuses tightly on **2D geometric thinking** — points + lines + curves + groups + algorithms (Delaunay, Voronoi, convex hulls, geometric flows). Its design language emphasizes **composable transformations on point-sets**.

**Verdict: second-class but strong in its niche** — pick Pts.js for algorithmic-composition work with heavy geometric reasoning; pick paper.js for vector-graphics work; pick p5.js for everything else.

## Purpose (one line)

Geometric-composition library for 2D points, lines, paths, curves, and visual algorithms — emphasizing composable transformations.

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **4 / 5** | Strong for geometry-driven generative work; the API rewards compositional thinking |
| 2. Branding | **3 / 5** | Geometric brand-marks; not vector-output-first like paper.js |
| 3. Graphic design | **3 / 5** | Geometric grids; data-binding fine |
| 4. Music-reactive visualizers | **3 / 5** | Audio-reactive geometric work is natural; performance is moderate |

### Paradigm coverage

- ✅ **Rule-based / deterministic**: point/line/path operations are explicit and composable.
- ✅ **Stochastic / random-within-rules**: stochastic placement is natural; built-in noise.
- ✅ **Iterative / dynamical-systems**: animation loop with `Pts.Space` is well-designed; particle systems and flow-fields integrate well.
- ⚠️ **Evolutionary**: not native.
- ⚠️ **Learning-based**: not native; integrate manually.

### Autonomy-control fit

**Score: 4 / 5** — most natural in the **middle** of the gradient. Geometric compositions with rule-and-randomness work beautifully.

### Primitive vocabulary

- ✅ Geometric primitives: `Pt` (point), `Line`, `Curve`, `Polygon`, `Group` (collections), with rich operations.
- ✅ Geometric algorithms: Delaunay triangulation, Voronoi diagrams, convex hulls, bezier interpolation, geometric distances.
- ✅ Color: built-in `Color` with HSL/RGB; **no OKLCH native**. Bring culori for perceptual color.
- ✅ Noise: built-in Perlin / simplex via `Noise`.
- ✅ Composition primitives: grids, golden-ratio helpers, geometric subdivisions.
- ⚠️ 3D: no real 3D — Pts.js is 2D.
- ⚠️ Shaders: no shader integration.

### Idiomaticity and LLM-codegen friendliness

**Score: 3 / 5** — solid but smaller community:

- **Moderate documentation** with examples; the official tutorials are good but coverage is less than p5.js.
- **Smaller training-data presence** — LLMs occasionally confuse Pts.js with p5.js APIs.
- **TypeScript-first design** — strong typing, good for typed codebases.
- **API has a learning curve** — the functional / chainable style is elegant but unfamiliar.

### Production-readiness

**Score: 3 / 5** — solid but smaller-scale:

- Maintained by William Ngan (Adobe employee, personal-project status).
- Release cadence slower than p5.js / three.js — months between releases.
- Apache-2.0 licensed.
- Bundle size moderate (~100kB gzipped).
- Production-shipped at art-site scale but not at major-app scale.

## Compared to direct alternatives

| Alternative | When to prefer it |
|---|---|
| **p5.js** | Pixel-canvas work; rapid prototyping; pedagogical context. |
| **paper.js** | Vector-graphics with SVG export; brand-marks. |
| **d3-geo / d3-shape** | If you're in a d3.js pipeline; functional shape generation. |
| **two.js** | Lighter-weight 2D vector; smaller API surface. |
| **Custom Canvas / SVG** | When the algorithm is unique and the library overhead isn't worth it. |

## Use-cases Pts.js excels at

- **Geometric algorithmic art** — Voronoi-based compositions, Delaunay-driven layouts, flow-field particle systems.
- **Sketches that need geometric algorithms ready-to-hand** (no need to bring 3 separate libraries).
- **Typed TypeScript codebases** doing geometric work — the typing is first-class.
- **Educational geometric exploration** — the API rewards compositional thinking.

## Use-cases Pts.js is wrong for

- **3D anything**: use three.js.
- **High-performance shader work**: use WebGPU or three.js.
- **Vector-output for print**: use paper.js.
- **Quick prototypes for non-experts**: use p5.js (the entry-barrier is lower).

## Connection to the wiki's framework

Pts.js sits naturally with the **Stuttgart-school geometric-rule-with-randomness paradigm** ([[Algorithmic Art History]]). For artists who think in **points, lines, and geometric algorithms** rather than in pixels or 3D scenes, it's the most-idiomatic library. The Voronoi/Delaunay primitives are particularly useful for [[Movement Rhythm and Repetition|tessellation-based]] generative work.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[p5.js]] · [[paper.js]] · [[three.js]] · [[d3.js]] · [[Procedural Paradigms]] · [[Algorithmic Art History]] · [[Movement Rhythm and Repetition]] · [[Tools Map]]

## Source

- Project home: https://ptsjs.org/
- Repository: https://github.com/williamngan/pts
- Reference: https://ptsjs.org/docs/
- Tutorials: https://ptsjs.org/guide/get-started-0100
- William Ngan, project author. Originally released 2017.
