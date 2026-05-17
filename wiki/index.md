---
title: Visual Thinking Wiki
tags: [index, home]
status: stable
created: 2026-05-15
updated: 2026-05-17
---

# Visual Thinking Wiki

A knowledge base translating intuitive visual beauty into logical, programmable structure — so an LLM (and code) can reason about images.

## The four branches

1. **Art-school fundamentals** — the traditional rules of light, color, composition.
2. **Computational aesthetics** — math that grades or generates beauty (Birkhoff, fractals, entropy).
3. **LLM techniques for visual reasoning** — strict structural criteria, JSON archetypes, multimodal eval loops.
4. **Tools and libraries** — p5.js, Py5, colormath, chroma.js, OpenCV.

## Research syntheses

- [[Research - Tonal Foundations in Classical Painting]] — chiaroscuro / sfumato / tenebrism.
- [[Research - Composition Foundations]] — Gestalt + grids; what's real, what's retrofitted.
- [[Research - Color Systems]] — perceptual color, harmony, contrast.
- [[Research - Aesthetic Measures]] — Birkhoff, entropy, fractal $D$, photo features, deep nets.
- [[Research - LLM Techniques]] — vectorizing concepts, JSON archetypes, eval loops, MLLM-as-judge.
- [[Research - Arnheim Sweep 1]] — perceptual forces, structural skeleton, weight, balance, perceptual concepts, simplicity (Arnheim Ch. 1–2).
- [[Research - Arnheim Sweep 2]] — space, light, color: figure/ground, depth gradients, pyramidal space, illumination as a layer, color syntax (Arnheim Ch. 5–7).
- [[Research - Arnheim Sweep 3]] — movement, tension, expression: stroboscopic motion, phenomenal causality, directed tension, physiognomic perception, symbolic pattern (Arnheim Ch. 8–10).
- [[Field Map - Visual Thinking Knowledge Domains]] — catalog-sweep synthesis (2026-05-17): five-layer wiki stratification, 15-field map, revised sweep-sequence proposal, three cross-cutting research projects.
- [[Research - Affect Foundations Sweep]] — clustered depth-dive (items 1+2+3): Russell circumplex, Plutchik, PAD, constructionism, appraisal, EVT, Goethe-Kandinsky, cross-cultural color, Berlyne, fluency, neuroaesthetics, cross-modal mapping.
- [[Research - L1 Cleanup Sweep]] — clustered depth-dive (items 5+12): the 5 constancies, size/lightness/color illusions, Helmholtz-Gibson-Bayesian, cross-cultural perception, FFA, configural face processing, FACS, uncanny valley, face-recognition universality debate.
- [[Research - Algorithmic Composition and Tools Sweep]] — clustered depth-dive (item 4 + tools): Galanter, Stuttgart-school history, procedural paradigms, L-systems, cellular automata, computational creativity, autonomy-control gradient, library evaluation rubric + 10 evaluated tools.

## Concepts (atomic ideas)

### Light and shadow — tonal foundations
- [[Chiaroscuro]] · [[Sfumato]] · [[Tenebrism]]

### Composition
- [[The Gestalt Principles of Visual Perception]]
- [[Compositional Grids]]
- [[Rule of Thirds]]
- [[Dynamic Symmetry]]
- [[Golden Spiral]]

### Perception (Arnheim's framework)
- [[Perceptual Forces]] *(field-of-forces substrate)*
- [[The Structural Skeleton]] *(invisible armature of a frame)*
- [[Visual Balance]] *(equilibrium of the force field)*
- [[Visual Weight]] *(multifactor scalar contribution)*
- [[Perceptual Concepts]] *(vision as concept formation)*
- [[Simplicity (Arnheim)]] *(Prägnanz — the central law)*

### Space and depth (Arnheim Ch. V)
- [[Figure and Ground]] *(Rubin's rules + depth-level economy)*
- [[Depth by Overlapping]] *(Helmholtz–Ratoosh; strongest pictorial depth cue)*
- [[Perceptual Gradients]] *(6 independently tunable depth cues)*
- [[Pyramidal Space]] *(our perceptual world is non-Euclidean)*
- [[Aerial Perspective]] *(Leonardo's color/atmospheric gradient)*
- [[Central Perspective]] *(Renaissance unification; one of several systems)*

### Light (Arnheim Ch. VI)
- [[Illumination as a Perceptual Layer]] *(two-layer model of brightness)*
- [[Shading and Volume]] *(Gehrcke-Lau cone; Lambertian rule)*

### Movement (Arnheim Ch. VIII)
- [[Stroboscopic Motion]] *(Wertheimer 1912; phi phenomenon; pictorial phase-stack)*
- [[Frame of Reference for Motion]] *(Duncker 1929 hierarchy of dependence)*
- [[Phenomenal Causality]] *(Michotte 1946 launching; ~70 ms hard threshold)*
- [[Organic vs Mechanical Motion]] *(scale of complexity; biological motion)*

### Tension and dynamics (Arnheim Ch. IX)
- [[Directed Tension]] *(movement without motion; 5 generators of force-direction)*
- [[Dynamics of Obliqueness]] *(tension peaks at 45°; closed-form scoring)*

### Expression (Arnheim Ch. X)
- [[Expression as Configuration of Forces]] *(anti-empathy; isomorphism)*
- [[Physiognomic Perception]] *(expression as the primary content of vision)*
- [[Symbolic Pattern in Composition]] *(the structural skeleton is the symbol)*

### Field overviews + depth-dives

#### Affect Foundations cluster (items 1+2+3) — ✅ depth-dive complete 2026-05-17

- [[Emotion Psychology]] *(priority #1, depth-dive complete)*
  - [[Russell's Affect Circumplex]] · [[Plutchik's Wheel of Emotions]] · [[PAD Emotion Model]] · [[Constructed Emotion Theory]] · [[Appraisal Theories of Emotion]]
- [[Color Psychology]] *(#2, depth-dive complete)*
  - [[Ecological Valence Theory]] · [[Goethe and Kandinsky on Color]] · [[Cross-Cultural Color Variation]]
- [[Empirical Aesthetics]] *(#3, depth-dive complete)*
  - [[Berlyne's Arousal-Potential Theory]] · [[Processing Fluency Theory]] · [[Neuroaesthetics and Individual Variation]]
- Cross-cluster bridge: [[Cross-Modal Emotion Mapping]] *(music ↔ color ↔ form via (V, A) substrate)*

#### L1 Cleanup cluster (items 5 + 12) — ✅ depth-dive complete 2026-05-17

- [[Perceptual Constants]] *(priority #5, depth-dive complete)*
  - [[The Five Visual Constancies]] · [[Size Constancy and Size Illusions]] · [[Lightness and Color Constancy]] · [[Helmholtz Gibson and Bayesian Perception]] · [[Cross-Cultural Perceptual Variation]]
- [[Face Perception]] *(#12, depth-dive complete)*
  - [[The Face-Specific Pathway]] · [[Configural Face Processing]] · [[FACS - Facial Action Coding System]] · [[The Uncanny Valley]] · [[Face Recognition Universality Debate]]

#### Algorithmic Composition + Tools cluster (item 4 + tools) — ✅ depth-dive complete 2026-05-17 (Phase 1 revisions applied)

- [[Algorithmic Composition]] *(priority #4, depth-dive complete)*
  - **Framings Map** (Phase 1, 2026-05-17): [[Framings of Generative Art]] — the synthesis hub positioning Galanter as one framing among nine
  - **Alternative framings** (Phase 1): [[Artificial Life Art]] · [[Practice-led Studio Research]] · [[Procedural Content Generation]] · [[Postdigital Aesthetics]] · [[Live Coding and Algorave]] · [[AI Art and Latent Space]] · [[Long-form On-Chain Generative Art]]
  - **Framework chain (revised Phase 1)**: [[Galanter's Generative Art Framework]] · [[Algorithmic Art History]] · [[Procedural Paradigms]] · [[L-Systems and Grammars]] · [[Cellular Automata and Reaction-Diffusion]] · [[Computational Creativity]] *(elevated)* · [[The Autonomy-Control Gradient]] · [[Library Evaluation Rubric]]
  - Core tools (in `wiki/tools/`): [[p5.js]] · [[paper.js]] · [[three.js]] · [[WebGPU]] · [[Pts.js]] · [[Hydra]] · [[d3.js]] · [[The Color Stack]] · [[Web Audio API and AudioWorklet]] · [[Anthropic TypeScript SDK]]
  - Sibling libraries (addendum): [[q5.js]] · [[react-three-fiber]]
  - Ecosystem surveys (addendum): [[p5.js Plugin Ecosystem]] · [[three.js Addon Ecosystem]] · [[Creative Coding Utilities]]
  - **Phase 2 tools (2026-05-17)**:
    - Standalone: [[Strudel]] · [[Transformers.js]] · [[TensorFlow.js]] · [[ml5.js]] · [[Tone.js]] · [[Meyda]] · [[A-Frame]] · [[WGSL Tooling]]
    - Surveys / maps: [[Live Coding Tools Survey]] · [[PCG Toolkit]] · [[Cloud Inference APIs]] · [[AI Art Toolkit Map]] · [[Postdigital Tools]]
  - Verdicts: [[Tools Map]] (updated Phase 2)
  - Sources added Phase 1: [[Hertzmann - Can Computers Create Art]] · [[Galanter - What is Generative Art]] · [[Cramer - What Is Post-Digital]]
  - Sweep syntheses: [[Research - Generative Art Framings Sweep]] (Phase 1) · [[Research - Generative Art Tools Survey]] (Phase 2) · [[Research - Phase 3 Canonicity Audit]] (Phase 3) · [[Research - Phase 4 Methodology Lock-in]] (Phase 4 — closing)
  - Phase 3 anchor pages now carry audit critique sections: [[Berlyne's Arousal-Potential Theory]] · [[Russell's Affect Circumplex]] · [[Helmholtz Gibson and Bayesian Perception]] · [[Face Recognition Universality Debate]]
  - Phase 4 lock-in lives in [[Wiki Methodology]] (new "Discovery and audit conventions" section).

#### Practical Design cluster (items 6 + 7 + 10 + 13) — ✅ depth-dive complete 2026-05-17

- **Typography (#6, complete)**: [[Visual Hierarchy and Typography]] *(parent)* — sub-pages: [[Swiss Grid System]] · [[Typographic Principles]] · [[Type as Voice]] · [[Variable Fonts and Web Typography]] · [[Multilingual Typography]] · [[Kinetic and Generative Typography]]
- **Negative Space (#7, complete)**: [[Negative Space]] *(parent)* — sub-pages: [[Ma and Yohaku no Bi]] · [[Negative Space Techniques]] · [[Negative Space in Motion]]
- **Light Vocabulary (#10, complete)**: [[Light Vocabulary]] *(parent)* — sub-pages: [[Three-Point Lighting and Key-Fill Ratio]] · [[Light Quality Direction and Motivation]] · [[Cinematic Lighting Traditions]] · [[PBR Lighting and ACES Tone Mapping]]
- **Materials and Texture (#13, complete)**: [[Materials and Texture]] *(parent)* — sub-pages: [[PBR Material Parameters]] · [[Material Perception]] · [[Procedural and Neural Texture Synthesis]] · [[Materiality in Graphic Design]]
- Sweep synthesis: [[Research - Practical Design Sweep]]

#### Movement-Rhythm-Style-Symbolism cluster (items 8 + 9 + 14 + 15) — ✅ depth-dive complete 2026-05-17

- **Time-based Composition (#8, complete)**: [[Time-based Composition]] *(parent)* — sub-pages: [[Eisenstein's Montage Theory]] · [[Murch's Six Editing Rules]] · [[McCloud's Panel Transitions and the Infinite Canvas]] · [[Disney Animation Principles]]
- **Movement, Rhythm, and Repetition (#9, complete)**: [[Movement Rhythm and Repetition]] *(parent)* — sub-pages: [[Symmetry Groups and Tessellation]] · [[Aperiodic Tiling and the Hat Monotile]] · [[Islamic Geometric Patterns and the Polygonal Technique]] · [[Op-Art and Cross-Modal Rhythm]]
- **Style as System (#14, complete)**: [[Style as System]] *(parent)* — sub-pages: [[Wölfflin's Five Axes]] · [[Style as Rule-System]] · [[Diffusion-Era Style Transfer]] · [[Brand Style Guides as Rule-Systems]]
- **Cultural and Symbolic Iconography (#15, complete)**: [[Cultural and Symbolic Iconography]] *(parent)* — sub-pages: [[Panofsky's Three-Level Iconology]] · [[Western Iconographic Systems]] · [[Non-Western Iconographic Systems]] · [[Jungian Archetypes and Brand Archetypes]]
- Sweep synthesis: [[Research - Movement-Rhythm-Style-Symbolism Sweep]]

#### Body Language Depth cluster (item 11) — ✅ depth-dive complete 2026-05-17

- **Body Language and Pose Semantics (#11, complete)**: [[Body Language and Pose Semantics]] *(parent)* — sub-pages: [[Universal Body Language Dimensions]] · [[Birdwhistell's Kinesics]] · [[Mehrabian's 55-38-7 Misinterpretation]] · [[de Gelder's Whole-Body Emotion Perception]] · [[Cultural Variability in Body Language]] · [[Contrapposto and Pose Canons]] · tool: [[Pose Extraction Pipeline]]
- Sweep synthesis: [[Research - Body Language Depth Sweep]]

#### Remaining field stubs (queued for future sweeps)
- [[Algorithmic Composition]] *(#4: complete)*
- [[Perceptual Constants]] *(#5: complete)*
- [[Face Perception]] *(#12: complete)*

### Color
- [[Hue Brightness Saturation]] *(the three perceptual axes — Arnheim Ch. VII)*
- [[The Munsell and CIELAB Color Systems]]
- [[CIEDE2000]]
- [[OKLCH]]
- [[Color Harmony]]
- [[Arnheim's Color Syntax]] *(structural hue-pair classification)*
- [[Complementary Colors]] *(mutual completion principle)*
- [[Warm and Cool Colors]] *(deviation theory)*
- [[WCAG Contrast Ratios]]

### Aesthetic measures
- [[Computational Aesthetics]] *(umbrella)*
- [[Birkhoff's Aesthetic Measure]]
- [[Visual Entropy]]
- [[Fractal Dimension]]
- [[Photo Aesthetic Features]]

### LLM techniques for visual reasoning
- [[Vectorizing Aesthetic Concepts]]
- [[JSON Archetypes for Visual Tasks]]
- [[Multimodal Evaluation Loops]]
- [[LLM-as-Judge for Visual Quality]]

## Techniques

`wiki/techniques/` populated 2026-05-17 by Sweep 7 (Implementation-notes pass). All JS/TS-first per `feedback_language-preference`. Each page implements one or more concept pages with pseudocode, library recommendations, calibration procedure, performance budget, and validation reference cases.

### Color & contrast
- [[OKLCH Pair-Relation Classifier]] *(implements [[Arnheim's Color Syntax]])*
- [[Contrast Checking Pipeline]] *(WCAG 2 + APCA hybrid)*

### Composition scoring
- [[Directed Tension Score]] *(5-generator sum; Arnheim Sweep 3 top project)*
- [[Visual Hierarchy and Negative Space Scoring]]
- [[Aesthetic Measure Stack]] *(Birkhoff + entropy + fractal D + Datta 56)*

### Body language
- [[Pose-Emotion Dimension Scorer]] *(5-axis from MediaPipe 33-landmark)*
- [[Contrapposto Scorer]] *(6-feature from skeleton)*
- [[Cultural Emblem Detector]] *(hand-landmark patterns for high-risk emblems)*

### Real-time / cross-modal
- [[Audio-to-Visual Cross-Modal Mapping]] *(Meyda → Arnheim primitives; 70 ms budget)*
- [[Realtime Pose-to-Visualizer Loop]] *(MoveNet + AudioWorklet + WebGPU integration)*

### Generative
- [[Symmetry-Group Pattern Generator]] *(17 wallpaper groups + Hat monotile + Bonner-IGP)*
- [[Style Transfer Pipeline]] *(IP-Adapter + ControlNet + ICAS)*

### Sweep synthesis
- [[Research - Implementation-notes Pass]] *(c-000223)*

> Seed's "LLM-techniques" branch remains in `wiki/concepts/` (see "LLM techniques for visual reasoning" section).

## Application hubs

- [[Music-reactive Visualizers]] *(priority 4 hub — links concepts + tools + techniques across audio/visual/pose stack)*

## Tools

Surveyed across Sweeps 3, 3.5 (Phase 2), and 6. See [[Tools Map]] for the comparative summary and [[AI Art Toolkit Map]] for the diffusion stack. `wiki/tools/` directory now contains 30 pages. Default color library: [[culori]].

## Sources

### Tonal foundations
- [[The Art Story - Chiaroscuro Tenebrism Sfumato]]
- [[DailyArt - Tenebrism 101]]
- [[ESRF - New light on Leonardo's faces]]
- [[Wikipedia - The Calling of Saint Matthew]]

### Composition
- [[Public Seminar - Dynamic Symmetry]]
- [[Wikipedia - Rule of Thirds]]
- [[PetaPixel - True Photographic History]]

### Color
- [[Wikipedia - Munsell color system]]
- [[Techkon - CIE Delta E 2000 Formula]]
- [[Bottosson - Oklab Color Space]]
- [[W3C WCAG 22 - Contrast Minimum]]

### Aesthetic measures
- [[Douchová - Birkhoff's Aesthetic Measure]]
- [[Rigau Feixas Sbert - Birkhoff Shannon Kolmogorov]]
- [[Spehar Taylor - Universal Aesthetic of Fractals]]
- [[Datta - Studying Aesthetics in Photographic Images]]
- [[NIMA - Neural Image Assessment]]

### LLM techniques
- [[MLLM-as-a-Judge]]
- [[Anthropic - Structured Outputs]]
- [[Visual Prompting Iterative Refinement]]
- [[Self-Refine - Iterative Refinement]]
- [[Mind the Gap - VLM Spatial Reasoning]]

### Primary references (depth-first)
- [[Arnheim - Art and Visual Perception]] *(1954; Ch. I–II, V–X ingested across 3 sweeps; **closed** as primary reference 2026-05-17; Ch. III/IV intentionally skipped)*

### Founding
- [[Wiki Seed]] — founding Gemini conversation; the 4-branch spine of this wiki

## Meta
- [[Wiki Methodology]] — **authoritative**: principles, project priorities, sweep strategy, 15-gap depth-dive queue. Read this before planning sweeps.
- [[log]] — chronological activity
- [[hot]] — currently warm pages / open threads
- [[DragonScale Memory]] — the memory-layer extension powering folds, addresses, and boundary-first autoresearch

## Vault layout

```
VisualThinking/
├── wiki/                  ← all knowledge pages
│   ├── concepts/          ← atomic ideas
│   ├── entities/          ← (empty by design — see CLAUDE.md)
│   ├── sources/           ← canonical archive of ingested material
│   ├── questions/         ← research synthesis pages
│   ├── techniques/        ← (LLM-techniques operationalized into concepts/)
│   ├── tools/             ← software/libraries (next sweep)
│   ├── folds/             ← rollups of wiki/log.md
│   ├── meta/              ← vault-meta pages
│   └── index.md · hot.md · log.md
├── inbox/                 ← drop zone for incoming files
├── .raw/                  ← canonical source archive
├── .vault-meta/           ← DragonScale runtime state
├── scripts/               ← DragonScale scripts (copied)
├── skills/wiki-fold/      ← fold operator skill (copied)
├── _templates/            ← Obsidian templates
└── CLAUDE.md              ← agent guidance
```
