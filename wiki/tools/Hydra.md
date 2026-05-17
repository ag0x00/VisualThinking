---
title: Hydra
type: tool
status: developing
tags: [tool, library, live-coding, visualizer, video, javascript]
address: c-000127
created: 2026-05-17
url: https://hydra.ojack.xyz/
license: AGPL-3.0
last_release: continuous (2018+)
verdict: first-class-for-live-coding-visualizers
---

# Hydra

A **live-coded video-synthesis environment** by **Olivia Jack** (2018+). Inspired by **analog video synthesizers** (Sandin Image Processor, Rutt-Etra) and **TidalCycles** (live-coded music). Hydra is the most-widely-used **live-coding visual** tool in the contemporary algorave / generative-visual-performance scene.

**Verdict: first-class for live-coding visualizers and music-reactive performance** (priority 4 native). Niche elsewhere.

## Purpose (one line)

Live-coded video-synthesis environment with composable functional API, real-time GLSL compilation, and audio-reactive primitives — designed for visual performance alongside music.

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **3 / 5** | Excellent for video-style generative art; not designed for static-image export |
| 2. Branding | **1 / 5** | Not the use case |
| 3. Graphic design | **2 / 5** | Possible for poster-style video assets; not its purpose |
| 4. Music-reactive visualizers | **5 / 5** | **The native use case.** Designed for live audio-reactive video performance |

### Paradigm coverage

- ✅ **Rule-based / deterministic**: composable functions; sources + transforms + outputs.
- ✅ **Stochastic / random-within-rules**: `noise()`, `random()` built-in.
- ✅ **Iterative / dynamical-systems**: each frame the GLSL pipeline runs; feedback loops natural (output → input next frame).
- ⚠️ **Evolutionary**: not the paradigm.
- ⚠️ **Learning-based**: not the paradigm.

### Autonomy-control fit

**Score: 3 / 5** — most natural at the **middle-to-autonomous** end. Live-coding's affordances are about **modifying the running system**, not specifying every output. Tight-control work is awkward.

### Primitive vocabulary

- ✅ Source primitives: `osc()` (oscillators), `noise()`, `voronoi()`, `shape()`, `gradient()`, `solid()`, `src(o0)` (feedback from output).
- ✅ Transforms: `.color()`, `.invert()`, `.brightness()`, `.contrast()`, `.kaleid()`, `.modulate()`, `.scale()`, `.rotate()`, etc.
- ✅ Composition operators: `.blend()`, `.add()`, `.mult()`, `.diff()`, `.layer()`.
- ✅ Audio-reactive: built-in `a` audio object exposes FFT bins (`a.fft[0]`, `a.fft[1]`, ...).
- ✅ Multiple outputs: `o0`, `o1`, `o2`, `o3` enables multi-layer compositions and feedback.
- ⚠️ No 3D geometry — Hydra is fragment-shader-only.
- ⚠️ No discrete primitives (drawing rectangles, paths). Hydra is **continuous-field** based.

### Idiomaticity and LLM-codegen friendliness

**Score: 4 / 5** — strong in its niche:

- **Strong documentation** with interactive playground at https://hydra.ojack.xyz/.
- **Functional / chainable API** is concise and elegant.
- **Smaller training-data presence than three.js but substantial** — Hydra has its own community of live-coders publishing examples.
- **API surface is small** (~30 functions) — easy for LLMs to cover comprehensively.
- **Errors are sometimes opaque** (shader compilation failures with cryptic messages) — debugging is the main friction.

### Production-readiness

**Score: 4 / 5** — production-ready for its purpose:

- Active development; weekly to monthly cadence.
- AGPL-3.0 licensed (copyleft — note for commercial use).
- Bundle size small (~150kB) — Hydra is mostly its shader templates.
- Production use: live performances worldwide (algoraves, music festivals, art installations).
- Stable for streaming via OBS or similar.

## Compared to direct alternatives

| Alternative | When to prefer it |
|---|---|
| **TouchDesigner** | Native desktop app; node-based; commercial. More powerful for installation work; not web. |
| **VVVV** | Similar node-based; primarily Windows. |
| **Resolume** | DJ-style VJ software; less coding, more loop-triggering. |
| **Magic** | Web-based but less code-first. |
| **three.js + custom shaders + audio uniforms** | When you need more than fragment-shader composition (3D geometry, complex pipelines). |
| **p5.js with audio reactivity** | When you want the p5.js API rather than Hydra's. |

## Use-cases Hydra excels at

- **Live-coded VJ performance** (the canonical use case).
- **Audio-reactive video synthesis** for music videos, streams, installations.
- **Rapid sketching of shader compositions** without WebGL boilerplate.
- **Teaching shader concepts** — Hydra's functional decomposition is pedagogically excellent.
- **Performance art / algorave**.

## Use-cases Hydra is wrong for

- **Static / archival generative art**: it's a live tool. Export via screen recording rather than image export.
- **3D work**: not the paradigm.
- **Vector graphics / SVG**: not the paradigm.
- **Editorial / brand work** (priorities 2, 3): not the use case.
- **Complex application pipelines**: Hydra is a self-contained playground, not a library to integrate.

## How Hydra fits the wiki's framework

Hydra is the **canonical priority-4 tool** — designed specifically for the use case the wiki cares about. Its functional / chainable API embodies the **iterative / dynamical-systems paradigm** ([[Procedural Paradigms]]) in a particularly fluent form. The feedback-loop capability (`src(o0)` reading the previous frame's output) makes it a video-domain analog to [[Cellular Automata and Reaction-Diffusion]] — feedback transforms applied each frame produce emergent complex patterns.

For the wiki's [[Cross-Modal Emotion Mapping|cross-modal emotion mapping]] work, Hydra is the natural prototype substrate: musical features (FFT bins from `a.fft`) directly modulate visual parameters (scale, rotation, color shift) — a thin, transparent layer between audio and visual that makes the cross-modal connection legible.

## Connection to the autonomy-control gradient

Hydra is **the live-coding paradigm**: the artist's contribution is the **running, evolving rule-set**. The autonomy is in the *time-dimension* — the system runs autonomously between code-modifications, and the modifications are themselves part of the performance. This is the **purest live-coding** sense of generative art, distinct from rule-based / stochastic / iterative paradigms that **pre-specify** their evolution.

For [[Computational Creativity|exploratory creativity]] in real-time, Hydra is unmatched.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[three.js]] · [[WebGPU]] · [[p5.js]] · [[Web Audio API and AudioWorklet]] · [[Procedural Paradigms]] · [[Cellular Automata and Reaction-Diffusion]] · [[Cross-Modal Emotion Mapping]] · [[Tools Map]]

## Source

- Project home: https://hydra.ojack.xyz/
- Repository: https://github.com/hydra-synth/hydra
- Documentation: https://hydra.ojack.xyz/docs/
- Hydra-book: https://github.com/ojack/hydra-book (community-curated examples)
- Olivia Jack, project author. Originally released 2018.
- Algorave community: https://algorave.com/
