---
title: Tools Map — Library Verdicts and Recommendations
type: tool-overview
status: developing
tags: [tool, overview, verdicts, comparison, algorithmic-composition]
address: c-000132
created: 2026-05-17
sources: ["[[Library Evaluation Rubric]]"]
confidence: high
---

# Tools Map — Library Verdicts and Recommendations

> [!important] Phase 2 expansion 2026-05-17
> This page is now post-Phase-2. The original 2026-05-17 sweep (10 core tools, +5 addendum) was supplemented by a [[Research - Generative Art Tools Survey|systematic npm-search + framings-anchored sweep]] adding 13 new tool pages. Major changes: **priority-4 stack updated** (Strudel + Hydra now the recommended live-coding option); **AI-art framing got a full toolchain** (Transformers.js + Cloud APIs + Anthropic SDK); **WebGPU has a proper DX stack** (WGSL Tooling). Old recommendations preserved as second-class where superseded.

A **comparative summary** of the library / web-platform APIs evaluated against the [[Library Evaluation Rubric]] derived from the Algorithmic Composition framework ([[Galanter's Generative Art Framework]], [[Procedural Paradigms]], [[Computational Creativity]], [[The Autonomy-Control Gradient]]) — now also positioned against the wider [[Framings of Generative Art|9-framings map]] post-Phase-1.

This is the **recommendation document** for which tools to pick first for each of the wiki's four priorities.

## The verdict table

### Core libraries (original Tools sweep)

| Tool | 1: Generative Art | 2: Branding | 3: Graphic Design | 4: Music-Reactive | Overall verdict |
|---|---|---|---|---|---|
| **[[p5.js]]** | 4 | 3 | 3 | 3 | First-class pedagogical; second-class production |
| **[[paper.js]]** | 4 | **5** | 4 | 2 | First-class for vector; second-class elsewhere |
| **[[three.js]]** | **5** | 4 | 4 | **5** | **First-class** across the board |
| **[[WebGPU]]** | 4 | 2 | 2 | **5** | First-class for performance / compute |
| **[[Pts.js]]** | 4 | 3 | 3 | 3 | Second-class but strong in geometric niche |
| **[[Hydra]]** | 3 | 1 | 2 | **5** | **First-class for live-coding visualizers** |
| **[[d3.js]]** | 3 | 2 | **5** | 2 | First-class for data-driven graphic design |
| **[[The Color Stack]] (culori)** | **5** | **5** | **5** | **5** | First-class default (infrastructure) |
| **[[Web Audio API and AudioWorklet]]** | 2 | 1 | 1 | **5** | First-class audio infrastructure |
| **[[Anthropic TypeScript SDK]]** | 4 | 4 | 4 | 2 | First-class LLM default |

### Sibling libraries and React variants (addendum 2026-05-17)

| Tool | 1: Generative Art | 2: Branding | 3: Graphic Design | 4: Music-Reactive | Overall verdict |
|---|---|---|---|---|---|
| **[[q5.js]]** | 4 | 3 | 3 | **5** | First-class emerging — WebGPU-powered p5.js sibling; watch closely |
| **[[react-three-fiber]]** | **5** | 4 | 4 | **5** | First-class for React codebases (adds React paradigm to three.js) |

### Ecosystems (addendum survey pages)

| Survey page | What it covers |
|---|---|
| **[[p5.js Plugin Ecosystem]]** | p5.brush, p5.sound, p5.play, p5.capture, p5.tree, @p5-wrapper/react, etc. |
| **[[three.js Addon Ecosystem]]** | drei, postprocessing, troika-three-text, theatre.js, rapier, leva, TSL, pmndrs collective |
| **[[Creative Coding Utilities]]** | Cross-cutting utilities: noise (simplex-noise), GUI (TweakPane, lil-gui, leva), animation (GSAP, motion-one), geometry (delaunator, polygon-clipping, gl-matrix), recording (ccapture.js), audio composition (Tone.js, Strudel), SVG (svg.js, flubber) |

### Phase 2 additions (2026-05-17, post-Framings sweep)

| Tool | 1: Generative Art | 2: Branding | 3: Graphic Design | 4: Music-Reactive | Overall verdict |
|---|---|---|---|---|---|
| **[[Strudel]]** | 3 | 1 | 1 | **5** | **First-class** — major new entrant; 23-package ecosystem; the priority-4 live-coding default for 2026 |
| **[[Tone.js]]** | 3 | 1 | 1 | **5** | First-class audio layer for software-engineering music-reactive apps (Web Audio wrapper) |
| **[[Meyda]]** | 2 | 1 | 1 | **5** | First-class — canonical real-time audio feature extraction |
| **[[Transformers.js]]** | **5** | 4 | 4 | 2 | **First-class** — primary AI-art layer; 1.12M weekly downloads |
| **[[TensorFlow.js]]** | 2 | 2 | 2 | 2 | Second-class — for pose-detection / non-transformer / in-browser-training niches |
| **[[ml5.js]]** | 3 | 2 | 2 | 3 | Second-class — Processing-school ML wrapper |
| **[[A-Frame]]** | 3 | 2 | 2 | 3 | Second-class — WebXR standard; niche but real |
| **[[WGSL Tooling]]** (typegpu + vite-plugin-glsl + wgsl_reflect + shaders) | 4 | 2 | 2 | 4 | **First-class as a build stack** — required for productive raw WebGPU work |

### Phase 2 survey / map pages

| Survey page | What it covers |
|---|---|
| **[[Live Coding Tools Survey]]** | Strudel, Hydra, TidalCycles, Sonic Pi, SuperCollider, Gibber, Orca, Improviz |
| **[[PCG Toolkit]]** | Tracery, Wave Function Collapse, seedable PRNGs (seedrandom, alea, mulberry32), simplex-noise, ROT.js |
| **[[Cloud Inference APIs]]** | Replicate, fal.ai, OpenAI image API, Anthropic vision, HF Inference Endpoints, ComfyUI hosting |
| **[[AI Art Toolkit Map]]** | Synthesis: client-side + cloud + critic-loop pattern for [[AI Art and Latent Space]] framing |
| **[[Postdigital Tools]]** | ASCII (textmode.js, asciify-engine), css-doodle, palette restriction (poline), glitch shaders |

### Position changes from Phase 2 audit

- **Magenta.js** — *deprecated*. Previously implicitly endorsed; flagged as no real updates since 2021-11. Remove from any "current recommendations."
- **Tone.js** — promoted from "covered in Web Audio" to standalone first-class evaluation.
- **Strudel** — added; major new entrant.
- **Transformers.js** — added; reframes AI-art entirely.
- **Priority-4 stack** — see Updated stacks below.

## Recommended stacks by priority

### Priority 1: Generative art (static + dynamic)

**Core stack (UPDATED 2026-05-17 per Phase 2):**
- **[[three.js]]** for rendering (with WebGPU renderer for new work)
- **[[paper.js]]** when vector output is needed for static work
- **[[The Color Stack]]** (culori) for perceptual color
- **[[Transformers.js]]** — client-side AI-art (Phase 2 addition; major reframing for [[AI Art and Latent Space|AI-art framing]])
- **[[Anthropic TypeScript SDK]]** for LLM-as-judge / critic-loop pattern
- **[[Cloud Inference APIs]]** when models are too large for browser

**Add for specialized cases:**
- **[[WebGPU]]** + **[[WGSL Tooling]]** — when compute shaders are essential (large CA, RD, particle systems)
- **[[p5.js]]** / **[[q5.js]]** — for prototyping or pedagogical work
- **[[Pts.js]]** — for heavy geometric-algorithm work (Voronoi, Delaunay-driven compositions)
- **[[PCG Toolkit]]** — Wave Function Collapse, Tracery, seedable PRNGs, simplex noise
- **[[d3.js]]** modules (d3-shape, d3-delaunay, d3-force, d3-contour) — for specific utilities
- **[[Postdigital Tools]]** — when framing fits (glitch, ASCII, palette restriction, lo-fi)
- **[[A-Frame]]** — for WebXR / immersive variants

See [[AI Art Toolkit Map]] for the AI-art framing's specific pipeline patterns.

### Priority 2: Branding

**Core stack:**
- **[[paper.js]]** for vector mark generation and SVG output
- **[[The Color Stack]]** (culori) for perceptual brand-color specification
- **[[Anthropic TypeScript SDK]]** for brand-voice / brand-system generation and consistency-checking
- **[[Cloud Inference APIs]]** for brand-asset variant generation (LoRA-style for brand-style consistency)

**Add for specialized cases:**
- **[[three.js]]** — for 3D brand experiences (product viewers, immersive sites)
- **[[d3.js]]** — for data-driven brand systems (parametric identities)
- **[[Transformers.js]]** — for client-side preview generation
- **[[Postdigital Tools]]** — for anti-clean brand aesthetics (NTS, Bandcamp, indie-label style)

### Priority 3: Graphic design

**Core stack:**
- **[[d3.js]]** for data-driven editorial / interactive work
- **[[paper.js]]** for print-ready vector work
- **[[The Color Stack]]** (culori) for perceptual color systems
- **[[Anthropic TypeScript SDK]]** for copy / art-direction
- **[[Cloud Inference APIs]]** for image / mood-board generation

**Add for specialized cases:**
- **[[three.js]]** — when hero compositions benefit from depth / lighting / 3D
- **[[p5.js]]** — for generative-pattern decoration / backgrounds
- **[[Postdigital Tools]]** — for editorial / zine / glitch aesthetics
- **[[Transformers.js]]** — for client-side rapid asset iteration

### Priority 4: Music-reactive visualizers (UPDATED 2026-05-17 per Phase 2)

**Two recommended stacks:**

**Option A — Live-coding paradigm (Strudel + Hydra)**, the new 2026 default:
- **[[Strudel]]** for pattern-DSL audio (port of TidalCycles, browser-native)
- **[[Hydra]]** for visual shader-composition (via `@strudel/hydra` integration)
- **[[The Color Stack]]** (culori) for any palette work
- Optional: **[[three.js]]** as a layered 3D backdrop

Why: small DSLs → LLM-codegen-friendly; same browser context = sub-frame latency = respects [[Phenomenal Causality|Michotte 70ms threshold]]; aligns with [[Live Coding and Algorave|TOPLAP framing]].

**Option B — Imperative-JS paradigm (Tone.js + three.js + Meyda)**:
- **[[Tone.js]]** for audio synthesis / effects / transport
- **[[Meyda]]** for audio feature extraction (RMS, spectral centroid, MFCC, chroma)
- **[[three.js]]** (with WebGPU renderer) for visualization
- **[[The Color Stack]]** (culori) for perceptual color

Why: standard software-engineering paradigm; broader ecosystem; better for product-like apps (vs performance contexts).

**Add for specialized cases:**
- **[[WGSL Tooling]]** (typegpu + vite-plugin-glsl) — when writing raw WebGPU shaders for compute-heavy or custom visual effects
- **[[WebGPU]]** raw — for very-large FFT-driven or particle-system work
- **[[Anthropic TypeScript SDK]]** — offline only (parameter-space exploration, not real-time)

## The single most-recommended stack (CLAUDE.md default)

For new generative-art work in 2026, the **canonical default**:

```
WebGPU + three.js (with WebGPU renderer)
  + react-three-fiber + drei            (if React)
  + three-stdlib                        (pmndrs-maintained examples/jsm)
  + camera-controls                     (production camera interaction)
  + postprocessing                      (effects)
  + leva                                (parameter controls)
  + detect-gpu                          (adaptive quality)
  + Anthropic TypeScript SDK            (LLM-as-judge / planning)
  + culori                              (OKLCH-native color)
  + Web Audio API                       (when audio-reactive)
  + simplex-noise                       (noise utility)
  + motion (or GSAP)                    (tween animation)
  + ccapture.js                         (frame recording)
```

For HDR-quality environment lighting, add: **@monogrid/gainmap-js** + drei `<Environment>`.

For information-visualization-style 3D work, swap into the **vasturiano stack** (globe.gl, 3d-force-graph) instead of the general-purpose three.js setup.

Augment with:
- **paper.js** for SVG output / vector-first work (priority 2 branding).
- **d3.js modules** for utilities (color scales, geographic, hierarchy).
- **p5.js + p5.brush + p5.capture** for painterly generative art.
- **q5.js** when wanting p5.js ergonomics + WebGPU performance.
- **Hydra** for live-coded music-reactive performance.
- **Tone.js / Strudel** for generative music alongside visualization.
- **rapier3d** for physics simulations.
- **troika-three-text** for high-quality 3D text.

See the ecosystem survey pages — [[p5.js Plugin Ecosystem]], [[three.js Addon Ecosystem]], [[Creative Coding Utilities]] — for the full picture.

## Tools intentionally NOT recommended as defaults

| Tool | Why not |
|---|---|
| **Raw WebGL** | Superseded by WebGPU; use three.js's WebGPU renderer instead |
| **Processing (Java)** | Use p5.js for browser; the Java environment is legacy for this wiki's priorities |
| **Pixi.js** | Overlap with paper.js and three.js for the wiki's purposes; not bad, just not first-class |
| **Two.js** | Lighter than paper.js but covers less; pick paper.js when you need vector and three.js when you need more |
| **fabric.js** | Editor-style canvas; the wiki cares about generation, not editing UI |
| **D3 chart libraries** (Plotly, Chart.js) | Pre-built charts; less flexible than d3 for editorial work |
| **Adobe ecosystem** | Not programmable as libraries; production tools |
| **OpenCV.js, ml5.js, TensorFlow.js** | Deferred to a future "computer vision / ML" depth-dive |
| **LangChain / LlamaIndex** | Useful but adds layers; reach for them when their orchestration benefits outweigh complexity |

These aren't bad libraries — they're just not the **default** picks for the wiki's specific priorities.

## How LLM-codegen friendliness ranks

A practical observation: when generating code with an LLM, some libraries reliably produce working output and others don't. Ranked by codegen reliability (highest first):

1. **[[three.js]]** — massive training data; stable patterns.
2. **[[p5.js]]** — same.
3. **[[d3.js]]** — same.
4. **[[Anthropic TypeScript SDK]]** — strong typing + good documentation.
5. **[[paper.js]]** — good but smaller community.
6. **[[The Color Stack]]** (chroma.js > d3-color > culori, by training-data presence; culori has good docs).
7. **[[Web Audio API and AudioWorklet]]** — established, but some autoplay-policy gotchas.
8. **[[Hydra]]** — small but consistent API surface; LLMs handle it well.
9. **[[Pts.js]]** — smaller community; LLMs sometimes confuse it with p5.js.
10. **[[WebGPU]]** — growing fast; WGSL is newer and trickier.

For **LLM-driven generation pipelines** (per [[Anthropic TypeScript SDK]] section), this ranking matters: code generated against high-rank libraries works on the first try more often.

## Connections to the wiki's framework

This Tools Map is the **deliverable** the Algorithmic Composition + Tools sweep was designed to produce. It applies [[Library Evaluation Rubric]] to a finite set of libraries, produces verdicts, and recommends stacks for each priority.

The verdicts will **inform the future implementation-notes pass** (per `feedback_implementation-in-sweeps` memory). Per the locked policy, no implementation code has been added to the framework or tool pages during the depth-dives; that work happens **after** this sweep, with the verdicts here guiding which library to write examples against.

The Tools Map is **revisable** as the ecosystem evolves. WebGPU adoption is the biggest near-term change; three.js's WebGPU renderer transition is the practical milestone. Hydra, paper.js, d3.js are stable.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[Galanter's Generative Art Framework]] · [[Procedural Paradigms]] · [[The Autonomy-Control Gradient]] · [[p5.js]] · [[paper.js]] · [[three.js]] · [[WebGPU]] · [[Pts.js]] · [[Hydra]] · [[d3.js]] · [[The Color Stack]] · [[Web Audio API and AudioWorklet]] · [[Anthropic TypeScript SDK]] · [[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Source

- The wiki's [[Library Evaluation Rubric]] (this sweep).
- Individual tool pages (this sweep).
- CLAUDE.md's default-stack specification.
- Author judgments based on production experience and the cited tool documentation.
