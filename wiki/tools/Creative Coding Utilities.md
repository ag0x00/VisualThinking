---
title: Creative Coding Utilities (Noise, GUI, Animation, Geometry)
type: tool-overview
status: developing
tags: [tool, ecosystem, utilities, noise, gui, animation, javascript]
address: c-000138
created: 2026-05-17
sources: ["[[Algorithmic Composition]]"]
confidence: high
---

# Creative Coding Utilities

The **cross-cutting utility libraries** that creative-coding work uses regardless of which rendering library is the core. Most generative-art projects pull from multiple categories here. This page surveys the **production-quality options** in each.

Added as part of the addendum to the original Algorithmic Composition + Tools sweep — the per-library tool pages covered rendering / framework / paradigm libraries but didn't address the cross-cutting utility layer.

## Noise libraries

Pseudo-random spatial / temporal functions — the workhorse of natural-feeling generative art.

| Library | What it provides | When to use |
|---|---|---|
| **simplex-noise** | Modern, fast simplex noise (better than Perlin in higher dimensions). 2D/3D/4D. ~3kB. | Default choice for new projects |
| **fast-simplex-noise** | Faster simplex implementation with fewer allocations | High-throughput cases |
| **noisejs** | Classic Perlin + simplex; older but very stable | Legacy compatibility |
| **open-simplex-noise** | OpenSimplex variant; alternative aesthetic | When simplex's directional bias is undesired |
| **worley-noise** | Cellular / Worley noise (Voronoi-derived) | Organic-cellular patterns |
| **glsl-noise** | GLSL implementations for shaders | Shader-side noise (alternative: write WGSL noise yourself for WebGPU) |
| **3d-noise** | Combined 3D noise libraries | Specialized 3D applications |
| Built-in (p5.js) | Perlin noise via `noise()` | When already in p5.js |
| Built-in (Pts.js) | Perlin / simplex via `Noise` | When already in Pts.js |

**Default recommendation**: `simplex-noise` for any standalone use. p5.js's built-in `noise()` is fine when you're in p5.js (slightly slower).

For **shaders**: use a stock GLSL/WGSL noise function (Stefan Gustavson's noise functions are widely-used and well-documented). Don't try to call JS noise libraries from shaders.

## GUI / parameter-control panels

For exposing generator parameters to interactive tweaking. Critical for the "tune until it feels right" workflow in [[Procedural Paradigms|stochastic-rule]] and [[Procedural Paradigms|iterative]] work.

| Library | Strengths | Weaknesses |
|---|---|---|
| **TweakPane** | Best-in-class API; rich control types (color, point, range, monitor); plugins. | Slightly more code than dat.gui for simple cases |
| **lil-gui** | Successor to dat.gui; minimal, fast, very small (~10kB). | Fewer features than TweakPane |
| **leva** | r3f-native; React-first; declarative; integrates with state | React-only |
| **guify** | Cross-framework; tagged for p5 and three | Smaller community |
| **dat.gui** (legacy) | Once the canonical choice | Deprecated; use lil-gui instead |
| **TouchDesigner-style node graphs (rete.js)** | For node-graph parameter editing | Heavier lift |

**Default recommendation**:
- **TweakPane** for vanilla JS / TS projects (best API + rich controls).
- **leva** for React projects (best React integration).
- **lil-gui** when bundle size matters most.

All MIT-licensed.

## Animation / tweening libraries

For smooth value transitions over time. Used in transitions, micro-interactions, and animation timelines.

| Library | Strengths | Weaknesses |
|---|---|---|
| **GSAP** | Industry-standard; rich timeline API; ScrollTrigger plugin | Commercial license for some plugins; larger bundle |
| **anime.js** | Free; clean API; ~14kB | Smaller community than GSAP |
| **motion** (formerly motion-one; merged with framer-motion 2024+) | Web-Animations-API-based; vanilla JS + React variants; ~50M weekly npm dl | Large but tree-shakeable; the contemporary default for new animation work |
| **react-spring** | Spring physics; React-native | React-only |
| **framer-motion** | Spring + tween; declarative; React-native | Larger bundle; React-only |
| **theatre.js** | Visual animation editor + JS API | Heavier lift; production-quality |
| **popmotion** | Lightweight, low-level tween primitives | Less feature-rich than GSAP |

**Default recommendation**:
- **motion** (the rebranded motion-one + framer-motion) is now the **dominant default** for both vanilla and React work (50M+ weekly dl confirms this).
- **GSAP** remains first-class for production-grade vanilla timeline work (despite license caveats on some plugins).
- **anime.js** for free / smaller / non-React projects.
- **theatre.js** when complex multi-track animation is the deliverable (overlays on top of motion / GSAP / Three).

## Geometry libraries (beyond what's in rendering libs)

For 2D / 3D geometric operations that aren't in your rendering library.

| Library | Purpose |
|---|---|
| **delaunator** | Fast Delaunay triangulation (used by d3-delaunay internally) |
| **flatten-js** | 2D geometry: points, lines, polygons, boolean operations |
| **polygon-clipping** | Polygon boolean operations (intersect, union, diff) |
| **clipper-lib** | Polygon offsetting + boolean (mature, robust) |
| **earcut** | Polygon triangulation (used by Mapbox and many 3D libs internally) |
| **martinez** | Polygon clipping with arc support |
| **gl-matrix** | Linear algebra for graphics (3D matrix / vector / quaternion) |
| **opentype.js** | Read and write OpenType / TrueType fonts; useful for text-as-path generative work |

**Default recommendations**:
- **delaunator** for Delaunay (use directly or via d3-delaunay).
- **polygon-clipping** for boolean polygon ops.
- **gl-matrix** for linear algebra (or use three.js's `Vector3` etc. when in three.js context).
- **opentype.js** for converting text to paths for generative typography.

## Recording / export

| Library | Purpose |
|---|---|
| **p5.capture** | Video / GIF export from p5.js sketches |
| **ccapture.js** | Generic frame-capture to MP4 / webM / GIF (works with any canvas / three.js) |
| **gif.js** | Client-side GIF encoding |
| **whammy** | Client-side WebM encoding |
| **mediabunny** / **MediaRecorder API** | Native browser screen recording |

**Default recommendation**: **ccapture.js** for general canvas / three.js recording; **p5.capture** when in p5.js.

## SVG manipulation (beyond paper.js / d3-shape)

| Library | Purpose |
|---|---|
| **svg.js** | Direct SVG manipulation (lightweight alternative to d3 for SVG-only work) |
| **snap.svg** | Older SVG library (Adobe-developed; less actively maintained) |
| **two.js** | 2D rendering across SVG / canvas / WebGL with a unified API |
| **flubber** | Smooth SVG path interpolation |

**Default recommendation**: For SVG-only output, use **paper.js** or **d3-shape** (already in the wiki's stack). Reach for these alternatives only when their specific niches apply.

## Audio composition (alongside [[Web Audio API and AudioWorklet]])

For music *generation*, not just analysis:

| Library | Purpose |
|---|---|
| **Tone.js** | DAW-style audio composition; sequencer, instruments, effects |
| **Howler.js** | Audio playback (game-style); not generative |
| **Tonal.js** | Music theory (chord recognition, scale generation) |
| **TidalCycles** (via Strudel.js for the web) | Live-coding music pattern language |
| **Strudel.js** | Web port of TidalCycles patterns |

**Default recommendation**: **Tone.js** for generative-music composition; **Strudel.js** for live-coding-pattern music. Both pair well with [[Hydra]] (TidalCycles-Strudel + Hydra is the canonical algorave stack).

## Color utilities (alongside [[The Color Stack]])

Beyond culori / chroma.js / d3-color:

- **color** — small utility for basic conversion (older, simpler than culori).
- **color-namer** — name a color from RGB / hex.
- **palette.js** — generate palettes algorithmically.
- **leonardo** (Adobe) — accessibility-driven color-palette generator.
- **cool.tools / coolors API** — palette generation services.

For new work, **culori covers what palette.js does** more cleanly. Reach for these only for specific needs.

## A recommended utility stack

For a typical new priority-1 / priority-4 project in 2026:

```
simplex-noise          (noise — also via OKLCH gradients with culori)
TweakPane (or leva)    (parameter UI)
GSAP (or motion-one)   (tween animation)
ccapture.js            (frame recording)
gl-matrix (or built-in via three.js)  (math)
Tone.js                (when generative audio is part of the project)
```

This pairs with whatever rendering stack is appropriate (three.js + r3f for React 3D; q5.js or three.js for vanilla; etc.).

## How this updates the original Tools Map

The original [[Tools Map]] focused on **rendering / framework / paradigm libraries**. This page completes the picture with the **utility layer** that crosses all of them. None of these utilities replace the rendering stack; they augment it.

For projects that need only one or two utilities, prefer to use what's already in your rendering library (p5.js's built-in noise; three.js's built-in math; etc.). For projects that need many utilities, pulling them from this list is the right move.

## Caveats

- **Bundle-size discipline matters more here than for rendering libs** — utilities add up. Tree-shake aggressively.
- **Maintenance varies wildly**. simplex-noise, GSAP, TweakPane are actively maintained; many smaller utilities aren't. Check last-commit date before committing.
- **Some utilities are framework-specific** (leva, react-spring, framer-motion all require React). Pick from the right pool.
- **The list isn't exhaustive** — npm has thousands of creative-coding utilities. This page covers what's *actually used* in production work, with maintenance criteria.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[p5.js]] · [[p5.js Plugin Ecosystem]] · [[three.js]] · [[three.js Addon Ecosystem]] · [[react-three-fiber]] · [[q5.js]] · [[The Color Stack]] · [[Web Audio API and AudioWorklet]] · [[Hydra]] · [[Tools Map]]

## Source

- npm search audits (multiple queries): 2026-05-17.
- simplex-noise: https://github.com/jwagner/simplex-noise.js
- TweakPane: https://tweakpane.github.io/docs/
- lil-gui: https://lil-gui.georgealways.com/
- leva: https://github.com/pmndrs/leva
- GSAP: https://gsap.com/
- motion-one: https://motion.dev/
- ccapture.js: https://github.com/spite/ccapture.js
- Tone.js: https://tonejs.github.io/
- Strudel: https://strudel.tidalcycles.org/
- Theatre.js: https://www.theatrejs.com/
