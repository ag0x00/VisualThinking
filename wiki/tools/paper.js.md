---
title: paper.js
type: tool
status: developing
tags: [tool, library, vector, 2d, svg, javascript]
address: c-000123
created: 2026-05-17
url: http://paperjs.org/
license: MIT
last_release: 0.12.18 (December 2024)
verdict: first-class-for-vector-second-class-for-other-2d
---

# paper.js

**Vector-graphics-native** creative-coding library by Jürg Lehni and Jonathan Puckey (2011+). Inherits the **Scriptographer** vector-scripting tradition from Adobe Illustrator. Native object model is **paths and shapes**, not pixels — operations like boolean ops, smooth curve fitting, hit-detection, and SVG export work naturally.

**Verdict: first-class for vector-graphics and SVG-output work; second-class for other 2D** (raster-style p5.js work is awkward) and unsuitable for 3D.

## Purpose (one line)

Vector-graphics scripting framework for HTML5 canvas with native path/shape object model, SVG import/export, and Illustrator-inheriting API.

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **4 / 5** | Best-in-class for vector-output generative work; weak for shader-driven dynamic art |
| 2. Branding | **5 / 5** | **Best-in-class.** Parametric logo / identity / brand-mark generation with vector output that scales infinitely |
| 3. Graphic design | **4 / 5** | Strong for printable / scalable graphic work; weak for typography-heavy layouts |
| 4. Music-reactive visualizers | **2 / 5** | Real-time vector work is fine for moderate scenes; not the right tool for shader-driven dense visualizers |

### Paradigm coverage

- ✅ **Rule-based / deterministic**: paths are objects; operations are explicit. Very natural for rule-based vector composition.
- ✅ **Stochastic / random-within-rules**: stock randomness; you provide your own noise function (bring `simplex-noise` or similar).
- ⚠️ **Iterative / dynamical-systems**: works but slower than canvas-pixel approaches for >1k objects. CA/RD in paper.js is impractical at scale.
- ⚠️ **Evolutionary**: no built-in support; bring your own.
- ❌ **Learning-based**: not relevant — paper.js is rendering, not generation. Pair with separate ML library.

### Autonomy-control fit

**Score: 4 / 5** — paper.js spans the **controlled to middle** region well. Direct manipulation (Illustrator-like) is its core; parametric and stochastic-rule generation are well-supported. High-autonomy work (shader / dynamical-systems) is awkward.

### Primitive vocabulary

- ✅ 2D vector primitives: `Path`, `Path.Circle`, `Path.Rectangle`, `CompoundPath`, `Group`, `Layer`.
- ✅ Path operations: boolean ops (union, intersect, subtract, exclude), smoothing, simplification, conversion to/from SVG.
- ✅ Hit-detection: native `hitTest` for interactive vector work.
- ✅ Transforms: matrix-based transforms on groups; nestable.
- ⚠️ 3D primitives: none.
- ⚠️ Color: HSB, HSL, RGB; no OKLCH / Lab. Bring chroma.js / culori.
- ⚠️ Noise: not built-in.
- ✅ Composition primitives: project / layer / group hierarchy is naturally compositional.
- ⚠️ Pattern primitives: object-based instancing is fine for hundreds; falls off for thousands.

### Idiomaticity and LLM-codegen friendliness

**Score: 4 / 5** — good but not best-in-class:

- **Solid documentation** with comprehensive examples.
- **Moderate training-data presence** — less than p5.js / three.js but enough that LLMs produce working code regularly.
- **Object-oriented API** with predictable conventions (paper.Path, paper.Point, etc.).
- **TypeScript definitions** available (`@types/paper`) but moderately stale.
- **Predictable error patterns** — common mistakes are well-known.

The downside: paper.js's API has some **Illustrator-y idioms** (paths-are-mutable, path operations modify in place by default) that LLMs sometimes get subtly wrong.

### Production-readiness

**Score: 4 / 5** — active (commit cadence is slower than p5.js or three.js but maintained), MIT licensed, moderate bundle size (~200kB gzipped). Production-shipped at scale: used in major design tools (the Disco vector-editor lineage; some Adobe internals; Notion-style note apps for inking).

The slower release cadence is the main caveat — bug fixes can take longer than in more-actively-developed alternatives.

## Compared to direct alternatives

| Alternative | When to prefer it |
|---|---|
| **p5.js** | Pixel-canvas work; rapid prototyping; pedagogical context. |
| **Two.js** | Lighter-weight 2D vector lib; smaller API surface; fewer features. |
| **fabric.js** | Editable canvas (drag/drop UI); paper.js is better for *generative* vector work specifically. |
| **konva.js** | Game-style 2D with object hierarchy + animation. Different problem space. |
| **SVG.js** | Direct SVG manipulation; paper.js renders to canvas and can export SVG. SVG.js is leaner if you only need SVG. |
| **d3-shape** | Functional shape generation; integrates with d3 data binding. paper.js is more imperative / drawing-oriented. |

## Use-cases paper.js excels at

- **Parametric brand-mark / logo generation** (priority 2): vector-native output scales to any size; brand systems can produce mark-variations programmatically.
- **Generative line-and-curve art**: paths with smooth-curve operations, fills, strokes.
- **SVG-output workflows**: native `exportSVG()`; pair with plotter or laser-cutter for physical output.
- **Editorial / poster work** (priority 3): scalable for print.
- **Boolean-op-heavy compositions**: union / intersect / subtract are natural and fast.
- **Hand-drawn-feeling generative**: bezier-curve manipulation, smooth interpolation.

## Use-cases paper.js is wrong for

- **3D anything**: use three.js.
- **Shader-driven aesthetic** (Hydra, custom GLSL): not paper.js's paradigm.
- **High-density particle systems**: object model is too heavy.
- **Pixel-manipulation generative work**: use p5.js or raw canvas.
- **Music-reactive real-time visualizers**: too slow for the dense-element regime.

## Connection to the wiki's framework

paper.js is the **vector-graphics specialist** in the wiki's stack. For priority 2 (branding) and priority 3 (graphic design), where vector output and scalability matter, paper.js is the **first-class choice**. The [[Algorithmic Art History|Stuttgart-school stochastic-rule generative art]] heritage — geometric primitives with rule-constrained randomness — translates directly to paper.js idioms.

For pipelines targeting Tyler-Hobbs-style algorithmic-vector art (priority 1 static), paper.js is a strong choice; for dynamic work, supplement with three.js or WebGPU.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[p5.js]] · [[three.js]] · [[Pts.js]] · [[The Color Stack]] · [[Procedural Paradigms]] · [[Algorithmic Art History]] · [[Tools Map]]

## Source

- Project home: http://paperjs.org/
- Repository: https://github.com/paperjs/paper.js
- Reference: http://paperjs.org/reference/
- Lehni & Puckey 2011+ project history; based on Lehni's earlier Scriptographer (Illustrator scripting tool, 2001).
