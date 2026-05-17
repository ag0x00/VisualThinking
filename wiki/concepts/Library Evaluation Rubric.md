---
title: Library Evaluation Rubric
type: concept
status: developing
tags: [concept, tools, evaluation, rubric, algorithmic-composition]
address: c-000121
created: 2026-05-17
sources: ["[[Algorithmic Composition]]"]
confidence: high
---

# Library Evaluation Rubric

> [!note] Rubric derived from one framing
> The six-axis rubric below was derived from the [[Galanter's Generative Art Framework|Galanter framing]] of generative art. The criteria — purpose-fit, autonomy-control fit, paradigm-fit, ergonomics, ecosystem, LLM-friendliness — are **framing-agnostic in practice** (they would be useful under any framing) but their *weighting* and *what counts as a good score* implicitly carry Galanter assumptions. Alternative framings would re-weight: [[Live Coding and Algorave|live-coding]] would weight performance / DSL design; [[Long-form On-Chain Generative Art|long-form]] would weight determinism / on-chain footprint; [[AI Art and Latent Space|AI-art]] would weight model integration. See [[Framings of Generative Art]].

The **explicit criteria** the wiki uses to evaluate generative-art / creative-coding libraries. Derived from the Algorithmic Composition framework ([[Galanter's Generative Art Framework]], [[Procedural Paradigms]], [[Computational Creativity]], [[The Autonomy-Control Gradient]]), this rubric is the **bridge** between the framework and the tools sweep: each tool page applies these criteria and produces a verdict.

The locked policy ([[Wiki Methodology]]) requires that the **Algorithmic Composition framework precedes the tools sweep** because the rubric — which is the framework's deliverable for the tools sweep — needs theoretical grounding to be principled rather than arbitrary. The Phase 1 revision (this sweep) does *not* re-derive the rubric from scratch — that would require re-doing the tools sweep — but it acknowledges that the rubric is framing-sensitive.

## The rubric

Each library is scored on **six axes** (5-point scale unless noted) plus a final **verdict**.

### 1. Purpose-fit per priority

For each of the four wiki priorities, rate how well the library serves it:

| Priority | What's measured |
|---|---|
| 1. Generative art (static + dynamic) | Native primitives for procedural drawing; effective-complexity tooling; stochastic / iterative paradigm support |
| 2. Branding | Identity-system support; parametric mark generation; reproducibility; vector output |
| 3. Graphic design | Layout primitives; typography; data-binding; print-ready output |
| 4. Music-reactive visualizers | Audio API integration; real-time performance; live-coding affordances |

Scale: 1 (unusable) — 5 (best-in-class).

### 2. Paradigm coverage (from [[Procedural Paradigms]])

Which paradigms the library natively supports:

- **Rule-based / deterministic**: explicit drawing primitives, deterministic state.
- **Stochastic / random-within-rules**: built-in PRNG with seedability; noise functions; stochastic primitives.
- **Iterative / dynamical-systems**: real-time animation loop; shader/compute support; CA/RD primitives.
- **Evolutionary / search-based**: GA support is rare in art libraries; usually you bring your own.
- **Learning-based / neural**: model-inference support; CLIP/diffusion integration if relevant.

Score: how many paradigms covered well + how naturally they combine.

### 3. Autonomy-control fit (from [[The Autonomy-Control Gradient]])

Where on the autonomy-control gradient the library is most fluent. Some libraries are designed for **tight artist control** (Illustrator-like); some for **emergent autonomy** (CA / shader / live-coding tools); the right tool depends on the regime.

Score: 1 = locked to one regime; 5 = supports any point along the gradient.

### 4. Primitive vocabulary

What the library gives you out of the box:

- **2D primitives**: shapes, paths, curves, text.
- **3D primitives**: meshes, cameras, lights, materials.
- **Color**: high-level color spaces (OKLCH, Lab) vs only RGB.
- **Noise / randomness**: Perlin, simplex, Worley, blue noise.
- **Composition primitives**: layouts, grids, golden-section helpers.
- **Pattern primitives**: tile systems, instance arrays, GPU instancing.

Score: how rich and how well-curated the primitive set is.

### 5. Idiomaticity and LLM-codegen friendliness

How **natural** the library is to write in, and how well **LLMs can generate code** for it. This matters because the wiki targets an LLM-driven generation pipeline.

Criteria:
- **API consistency**: predictable naming, parameter conventions.
- **Documentation quality**: comprehensive, current, with examples.
- **Training-data representation**: how much code in the library is in LLM training corpora (heavily-used libraries have huge corpora; obscure ones have little).
- **Type-safety in TS**: explicit types, predictable signatures.
- **Error messages**: actionable when things go wrong.

Score: 1 (LLMs frequently produce broken code) — 5 (LLMs produce working code on first attempt for typical tasks).

### 6. Production-readiness

Operational concerns:

- **Active maintenance**: last commit, release frequency, issue-response time.
- **Production usage**: shipped sites / apps using it.
- **Bundle size** for web deployment.
- **Performance** characteristics (frame-rate at scale).
- **Cross-browser compatibility** (or platform-spec, for native libs).
- **License**: ideally MIT / BSD / Apache; copyleft is friction.

Score: 1 (abandoned / risky) — 5 (industry-standard, multi-year stability).

## The verdict tiers

After scoring, assign a **verdict** that summarizes recommendation:

- **First-class**: use for its primary purpose without hesitation. Strong fit across most rubric axes. Active, well-known, LLM-friendly.
- **Second-class**: useful in specific contexts; know its limitations; consider alternatives for the general case.
- **Skip**: not recommended for new work — abandoned, niche-locked, superseded, or fundamentally less-good than alternatives.

The verdict can also be **first-class for X / second-class for Y** when a library is genuinely good for one purpose and weaker for another.

## How the rubric should be applied (instructions for the tools sweep)

For each library, the wiki page should:

1. **State its purpose** in one line.
2. **Score it on the six axes** (succinctly — bullet list, not essay).
3. **Compare to direct alternatives** where they exist.
4. **Apply the verdict** with rationale.
5. **Note specific use-cases** where it's the right vs wrong choice.
6. **Cross-reference** to the relevant procedural paradigms it supports.

This makes each tool page **structurally comparable** to every other tool page, enabling the final **Tools Map** synthesis page to produce a clean comparative table.

## Critical libraries the sweep must evaluate

Per the wiki's existing language preference (`feedback_language-preference` memory) and priority queue:

| Tool | Primary purpose | Sweep page |
|---|---|---|
| **p5.js** | Creative-coding entry point; 2D canvas | [[p5.js]] |
| **paper.js** | Vector graphics; SVG-style 2D | [[paper.js]] |
| **three.js** | 3D / WebGL / 2026 WebGPU bridge | [[three.js]] |
| **WebGPU (raw)** | Modern compute + render API | [[WebGPU]] |
| **Pts.js** | Geometric composition; algorithmic-design–friendly | [[Pts.js]] |
| **Hydra** | Live-coding visuals; priority-4 native | [[Hydra]] |
| **d3.js** | Data-driven graphics; SVG-first | [[d3.js]] |
| **chroma.js + culori** | Color manipulation; OKLCH-native (culori) | [[The Color Stack]] |
| **Web Audio API + AudioWorklet** | Audio analysis for visualizers | [[Web Audio API and AudioWorklet]] |
| **Anthropic TypeScript SDK** | LLM integration; the wiki's chosen LLM | [[Anthropic TypeScript SDK]] |

Tools intentionally deferred:

- **Pixi.js**: 2D renderer; overlaps paper.js + three.js for our purposes. Worth considering for game-style fast 2D but not central to the wiki's priorities.
- **Two.js, fabric.js, konva.js**: 2D libs in the paper.js space; secondary.
- **OpenCV.js, ml5.js, TensorFlow.js**: vision / ML libraries. Relevant but defer to a future "computer vision" depth-dive.
- **Adobe ecosystem (Illustrator, AfterEffects)**: not a programmable library in the sense the rubric measures. Used as production tool, not as generative substrate.
- **Processing (Java)**: legacy; effectively superseded by p5.js for browser work.
- **openFrameworks (C++)**: native; not in the JS/TS stack the wiki has committed to.

## What this rubric does NOT measure

Some legitimate axes the rubric **doesn't capture**:

- **Aesthetic culture / community**: libraries with strong creative communities (p5.js, Hydra) provide value beyond technical capability.
- **Pedagogical fit**: p5.js shines as a teaching tool; that's not directly measured.
- **Specific-art-historical lineage**: paper.js inherits from Adobe-Illustrator-style vector work; that's contextual rather than rubric-able.
- **Future trajectory**: three.js evolving toward WebGPU; WebGPU itself maturing. Some libraries will improve faster than others.

These should be noted in tool-page **prose** but don't enter the numeric scoring.

## Implementation note (deferred per policy)

Per the `feedback_implementation-in-sweeps` memory, no code is included on the tool pages during this sweep. The implementation-comparison work (writing the same generator across each library to compare ergonomics) happens **after** this sweep, when the rubric verdicts are settled.

## Related pages

[[Algorithmic Composition]] · [[Galanter's Generative Art Framework]] · [[Procedural Paradigms]] · [[The Autonomy-Control Gradient]] · [[Computational Creativity]] · [[Algorithmic Art History]] · [[p5.js]] · [[paper.js]] · [[three.js]] · [[WebGPU]] · [[Pts.js]] · [[Hydra]] · [[d3.js]] · [[The Color Stack]] · [[Web Audio API and AudioWorklet]] · [[Anthropic TypeScript SDK]] · [[Tools Map]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources

- Galanter 2003 "What is generative art?" — 6th GA Conference, Milan.
- McCormack & d'Inverno 2012 (eds.) *Computers and Creativity*. Springer.
- Reas & Fry 2010 *Form+Code in Design, Art, and Architecture*. Princeton Architectural Press.
- The wiki's existing methodology pages: [[Wiki Methodology]], [[Field Map - Visual Thinking Knowledge Domains]].
- The user's locked policy decisions in memory: `feedback_clustered-sweeps`, `feedback_implementation-in-sweeps`, `feedback_algo-comp-before-tools`, `feedback_language-preference`.
