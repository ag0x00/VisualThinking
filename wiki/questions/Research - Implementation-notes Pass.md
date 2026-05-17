---
title: Research - Implementation-notes Pass
type: research
status: complete
tags: [research, sweep, implementation, synthesis, techniques]
address: c-000223
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
covers_items: ["all-revisited"]
---

# Research — Implementation-notes Pass

**Sweep 7 of the locked clustered-sweep sequence. Completed 2026-05-17.** The final locked-sequence item. Translates the reading layer (concept + tool pages from Sweeps 1-6) into the technique layer (`wiki/techniques/`) — runnable patterns, pseudocode, library choices, calibration procedures.

This sweep closes the locked sequence. **The wiki's 15-gap priority queue is now covered at both the reading layer and the implementation layer.**

## Question

What does it look like to operationalize each major handle the wiki has surfaced across 6 sweeps? Which handles are highest-leverage given the user's 4 priorities? What JS/TS recipes implement them?

## Sweep deliverables (12 technique pages + this synthesis)

| Page | Address | Implements | Priority focus |
|---|---|---|---|
| [[OKLCH Pair-Relation Classifier]] | c-000211 | [[Arnheim's Color Syntax]] | 1, 2, 3 |
| [[Contrast Checking Pipeline]] | c-000212 | [[WCAG Contrast Ratios]] | 2, 3 |
| [[Directed Tension Score]] | c-000213 | [[Directed Tension]] | 1, 3 |
| [[Visual Hierarchy and Negative Space Scoring]] | c-000214 | [[Visual Hierarchy and Typography]], [[Negative Space]] | 2, 3 |
| [[Aesthetic Measure Stack]] | c-000215 | [[Birkhoff's Aesthetic Measure]], [[Visual Entropy]], [[Fractal Dimension]], [[Photo Aesthetic Features]] | 1 |
| [[Pose-Emotion Dimension Scorer]] | c-000216 | [[Universal Body Language Dimensions]] | 1, 2 |
| [[Contrapposto Scorer]] | c-000217 | [[Contrapposto and Pose Canons]] | 1, 2 |
| [[Cultural Emblem Detector]] | c-000218 | [[Cultural Variability in Body Language]] | 2 |
| [[Audio-to-Visual Cross-Modal Mapping]] | c-000219 | [[Cross-Modal Emotion Mapping]] | 4 |
| [[Realtime Pose-to-Visualizer Loop]] | c-000220 | [[Pose Extraction Pipeline]] + audio | 4 |
| [[Symmetry-Group Pattern Generator]] | c-000221 | [[Symmetry Groups and Tessellation]], [[Aperiodic Tiling and the Hat Monotile]] | 1, 2 |
| [[Style Transfer Pipeline]] | c-000222 | [[Diffusion-Era Style Transfer]] | 1, 2 |

Coverage by user priority:

| Priority | Pages explicitly serving |
|---|---|
| **1. Generative art (top)** | OKLCH Classifier, Directed Tension, Hierarchy/Negative-Space, Aesthetic Measure Stack, Pose-Emotion, Contrapposto, Symmetry-Group, Style Transfer (8 of 12) |
| **2. Branding** | OKLCH Classifier, Contrast Checking, Hierarchy/Negative-Space, Pose-Emotion, Contrapposto, Cultural Emblem Detector, Symmetry-Group, Style Transfer (8 of 12) |
| **3. Graphic design** | OKLCH Classifier, Contrast Checking, Hierarchy/Negative-Space, Directed Tension (4 of 12) |
| **4. Real-time music-reactive** | Audio-to-Visual Mapping, Realtime Pose-to-Visualizer (2 of 12 — most concentrated subset; specialized) |

Pages serve multiple priorities. Total cross-coverage is even higher than the count suggests.

## Key principles applied across the pass

### 1. JS/TS first (per `feedback_language-preference`)

All 12 techniques are written as TypeScript pseudocode with named library recommendations. Python parity is noted only where:
- A specific library is meaningfully better in Python (`pywavelets` for wavelet decomposition; `pymatgen` for full crystallographic group representations)
- Offline batch processing makes Python ergonomic (large corpus aesthetic-measure runs)

Default stack across pages:
- **culori** for color
- **@mediapipe/tasks-vision** for pose / hand / face landmarks
- **@tensorflow/tfjs** + WebGPU backend for ML inference
- **@xenova/transformers** for ONNX models in browser
- **OpenCV.js** for classical CV operations
- **three.js / react-three-fiber** for 3D rendering
- **meyda** for audio features
- **AudioWorklet** for low-latency audio
- **@anthropic-ai/sdk** for VLM-based evaluation

### 2. Pseudocode over full apps

Per the wiki's content conventions, technique pages document **patterns** not full applications. Each page contains:
- A signature and shape of the function/pipeline
- Implementation of the key algorithm/math in TS
- Library recommendations with weekly-download justification
- Calibration procedure
- Performance budget
- Validation approach + reference cases

A working developer can run the patterns. The wiki does not host the full apps.

### 3. Calibration as a first-class concern

Every measurement-style technique (8 of 12) includes an explicit **calibration** section:
- Labeled corpus size needed
- Validation metric
- Where to persist thresholds (`.vault-meta/` files)
- Cross-cultural calibration where relevant

Conservative seeds + calibration procedure beat opinionated-defaults-as-fact.

### 4. Validation against reference cases

Every scorer includes a "validation" section with named test cases — Polykleitos's *Doryphoros* for contrapposto, Mondrian for low directed tension, Renaissance contrapposto for high, Munch's *The Scream* for fear-dimension, M.C. Escher for p1g symmetry. These are how to tell if the implementation is broken.

### 5. Cross-cultural validity flags

Per `feedback_cross-cultural-validity`, every technique that touches culturally-variable content carries an explicit cross-cultural flag:

- Pose dimensions: universal substrate, cultural label-mapping
- Cultural emblem detector: the cross-cultural-validity tool itself
- Style transfer: heavily WEIRD training data; non-Western style needs LoRA fine-tuning + iconography prompting
- Audio-to-visual mapping: pitch/loudness/tempo universal, major/minor → warm/cool Western-specific
- Symmetry patterns: 17 groups mathematically universal, motif vocabulary culturally distinctive

### 6. Successor-theory awareness

Per `feedback_successor-theory-tracking`, techniques explicitly note when they implement a **superseded** approach for historical reference:

- Style transfer: Gatys 2015 (historical) vs IP-Adapter + ControlNet (2026)
- Birkhoff M = O/C: known to have weak empirical support; use comparative not absolute
- Berlyne inverted-U preference: mixed empirical support flagged in Aesthetic Measure Stack
- Power-pose causal claim: dead; observation-claim survives in body-language dimensions

## Key cross-cutting findings

### Finding 1: The wiki's evaluation primitives compose

A generative-art pipeline can stack the scorers:

```
Generated image
  ├─ Color: OKLCH Pair-Relation Classifier (palette validation)
  ├─ Composition: Directed Tension + Hierarchy/Neg-Space (structural read)
  ├─ Aesthetics: Aesthetic Measure Stack (4 measures composite)
  ├─ Figure (if present): Pose-Emotion Dimensions + Contrapposto Score
  └─ Cultural safety: Cultural Emblem Detector
```

Each component independently calibratable; composite score informs generation iteration. **The wiki has accumulated a meaningful evaluation pipeline.**

### Finding 2: Realtime budget is tight but achievable

For priority 4 (music-reactive visualizers), the 70 ms Michotte threshold ([[Phenomenal Causality]]) is the binding constraint. Implementation budget:

- AudioWorklet feature extraction: ~5-15 ms
- MoveNet Lightning pose extraction (WebGPU): ~5-15 ms
- Pose dimensions + audio mapping: ~1-2 ms
- WebGPU renderer frame: ~5-15 ms
- **Total: ~20-50 ms** — well inside the 70 ms threshold on mid-laptop hardware

[[Realtime Pose-to-Visualizer Loop]] documents the specific stack. Verified by *budget calculation*; field measurement remains an open thread.

### Finding 3: Cloud inference is the right default for diffusion

Style transfer, image generation, and ICAS run in cloud (Replicate / Fal / Together). Browser-side diffusion is feasible for LCM-class models but adds 200-500 MB downloads. The pragmatic default: route diffusion to cloud, run all evaluation locally.

This is the *opposite* of the audio-and-pose loop, which must run locally for latency.

### Finding 4: VLM scoring fills the empirical evaluation gap

Several scorers benefit from VLM-rate as the final arbiter:

- Style preservation (Style Transfer Pipeline)
- Composition quality (Visual Hierarchy)
- Pose-emotion readout validation

In 2026, Claude Opus 4.7 / GPT-5 / Gemini 2.5 are reliable VLM raters for these qualitative judgments. The wiki's evaluation strategy combines **classical metrics** (entropy, fractal D, Datta features) + **VLM rate** for triangulation.

### Finding 5: The "directed tension" research project is unblocked

[[Directed Tension Score]] documents the full 5-generator implementation. Building the scorer + validating on the AVA dataset is now a single short project, not a research question. **Highest-leverage research project from Arnheim Sweep 3 is operationally specified.**

Same applies to:
- [[OKLCH Pair-Relation Classifier]] — top project from Sweep 2
- Pose-emotion + contrapposto scorers — operational from Sweep 6

## Six conventions applied (per `feedback_*`)

| Convention | Application in this sweep |
|---|---|
| **#1 catalog-stub cross-check** | Each technique page maps explicitly to the concept(s) it implements (`implements:` frontmatter). The 12 pages cover all major handles flagged across 6 sweeps; subset not implemented is queued as Open Research. |
| **#2 framing-canonicity** | Explicit flags in [[Style Transfer Pipeline]] (Gatys → IP-Adapter+ControlNet succession), [[Aesthetic Measure Stack]] (Birkhoff/Berlyne mixed empirical support). |
| **#3 npm/GitHub audit** | Each technique cites specific npm packages with weekly-download justification. No major missed packages — the 2026 JS/TS ML ecosystem is mature. |
| **#4 source-fetch fallback** | Not exercised (no fetch failures during this pass). |
| **#5 cross-cultural validity** | Explicit flag on all 5 cross-culturally-variable techniques (pose dimensions, emblems, style transfer, audio-to-visual, symmetry). |
| **#6 successor-theory** | Style transfer succession documented; aesthetic-measure empirical-status caveats documented; power-pose dead-claim flagged. |

## What this sweep does NOT cover

Deliberate scope-narrowing decisions:

- **Light pipeline** ([[Three-Point Lighting and Key-Fill Ratio]], [[PBR Lighting and ACES Tone Mapping]]) — implementation lives in three.js / WebGPU shader code; less "wiki technique" and more "renderer-specific configuration." Documented in the concept pages.
- **PBR material setup** ([[PBR Material Parameters]]) — same: belongs in renderer-specific docs (three.js MeshPhysicalMaterial, KHR_materials extensions).
- **Variable font axis access** — covered briefly in Audio-to-Visual; deeper implementation belongs in CSS / fontkit docs.
- **Specific iconography databases** ([[Western Iconographic Systems]], [[Non-Western Iconographic Systems]], Iconclass) — implementation is database-tagging work, not algorithm work.
- **L-systems and CA generation** — covered in concept pages with formulae; implementation is too domain-specific (many parameterizations) to make one canonical technique page useful.

These are queued as **open research / domain-specific implementation** rather than as core technique pages.

## Open research threads

Carried forward from prior sweeps + new threads from this pass:

### Highest-leverage validation projects
1. **Build the [[Directed Tension Score]] scorer**; validate on AVA dataset against human dynamism ratings (Spearman > 0.6 target).
2. **Build the [[OKLCH Pair-Relation Classifier]]**; validate on labeled palette dataset.
3. **Build the [[Pose-Emotion Dimension Scorer]]**; validate on BEAST stimulus set.
4. **Measure actual 70 ms latency** in [[Realtime Pose-to-Visualizer Loop]] on real hardware.

### Cross-cultural validation projects
5. **Tribhanga pose scorer** for Indian classical figures (from [[Contrapposto Scorer]] open thread).
6. **Non-Western emblem expansion** in [[Cultural Emblem Detector]].
7. **Non-Western style transfer** with custom LoRAs (ukiyo-e, Persian miniature, pre-Columbian).

### Cross-modal projects
8. **Genre-adaptive audio-to-visual mapping** in [[Audio-to-Visual Cross-Modal Mapping]].
9. **Pose-energy × music-energy combiner calibration** across dance corpora.

### Infrastructure projects
10. **Build the evaluation pipeline** that stacks all 5+ scorers for batch generated-image audit.
11. **Build a brand-style LoRA library** indexed by Mark & Pearson archetypes (from [[Style Transfer Pipeline]]).

## Status: locked sweep sequence complete

The 7-sweep locked sequence is now **fully complete**:

| # | Sweep | Status |
|---|---|---|
| 1 | Affect Foundations | ✅ |
| 2 | L1 Cleanup | ✅ |
| 3 | Algorithmic Composition + Tools | ✅ |
| 3.5 | Discovery Methodology Fix (Option C) | ✅ |
| 4 | Practical Design | ✅ |
| 5 | Movement-Rhythm-Style-Symbolism | ✅ |
| 6 | Body Language Depth | ✅ |
| **7** | **Implementation-notes pass** | **✅ Done 2026-05-17** |

**The 15-gap priority queue is fully covered at the reading layer AND the technique layer.** The wiki has moved from "knowledge base" to "operational reference."

Next phase (post-sweep): **build something with it**. Specifically, the 4 priority projects:
1. Generative art system using the evaluation pipeline
2. Brand-system tooling using emblem detection + contrast checking + style transfer
3. Graphic-design layout tools using hierarchy + negative-space scoring
4. Music-reactive visualizer using the realtime pose+audio loop

## Related pages

[[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]] · [[Research - Phase 4 Methodology Lock-in]] · [[Research - Body Language Depth Sweep]] · [[Research - Movement-Rhythm-Style-Symbolism Sweep]] · [[Research - Practical Design Sweep]] · [[Research - Algorithmic Composition and Tools Sweep]] · [[Tools Map]] · [[AI Art Toolkit Map]] · [[Framings of Generative Art]]
