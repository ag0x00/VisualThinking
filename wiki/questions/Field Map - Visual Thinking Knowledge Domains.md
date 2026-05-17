---
title: "Field Map: Visual Thinking Knowledge Domains"
type: research-synthesis
status: developing
tags: [synthesis, meta, methodology, field-map, catalog]
created: 2026-05-17
address: c-000089
sources: ["[[Wiki Methodology]]"]
confidence: high
---

# Field Map: Visual Thinking Knowledge Domains

A **map of the territory** this wiki is trying to cover, drawn 2026-05-17 after the catalog sweep that created 15 field stubs. Pairs the wiki's existing branches (art-school fundamentals · computational aesthetics · LLM techniques · tools) with the 15-gap depth-dive queue and identifies *exactly* which fields are covered, which are stubbed, and which depth-dives have the highest leverage.

This is the **strategic-catalog output** the methodology required before depth-dives could resume.

## How the catalog sweep happened

User directive 2026-05-17: "*the wiki is the expert system, not code snippets*" + the **strategic-catalog → prioritized depth** revision in [[Wiki Methodology]]. After Arnheim Sweep 3 closed the Arnheim depth-dive, the catalog sweep produced **15 field stubs** corresponding 1-to-1 with the 15-gap priority queue, plus this Field Map.

Each stub contains:
- 2–5 canonical figures
- 3–10 key concepts
- A "why this matters for the four priorities" table
- Connections to existing wiki pages
- A "what's missing" list
- A depth-dive plan
- Source-reading list

The stubs are **scaffolds**, not depth-dives — they tell the depth-dive what to read and what to produce.

## The five layers of the wiki

Reading the catalog stubs together, the wiki's content stratifies into five layers:

```
┌──────────────────────────────────────────────────────────┐
│  L5  Application output: art / brand / design / vis      │  ← user's 4 priorities
├──────────────────────────────────────────────────────────┤
│  L4  Generation systems: algorithms, tools, pipelines    │  ← Algorithmic Composition; tools sweep (next)
├──────────────────────────────────────────────────────────┤
│  L3  Design disciplines: typography, hierarchy, style    │  ← Visual Hierarchy; Negative Space; Style as System
├──────────────────────────────────────────────────────────┤
│  L2  Aesthetic / emotional theory: empirical, cultural   │  ← Emotion; Color Psychology; Empirical Aesthetics
├──────────────────────────────────────────────────────────┤
│  L1  Perception substrate: forces, gestalt, constancies  │  ← Arnheim; Perceptual Constants
└──────────────────────────────────────────────────────────┘
```

Each layer's outputs are inputs to the next. The wiki has been heaviest on L1 (Arnheim) and L4 (tools, algorithms) with relatively thin L2/L3 — which is exactly what the priority queue corrects.

## Where each field belongs

| Layer | Field stubs (catalog sweep) | Already-substantial wiki pages |
|---|---|---|
| **L1 Perception** | [[Perceptual Constants]] (#5) | [[Perceptual Forces]], [[The Structural Skeleton]], [[Visual Balance]], [[Visual Weight]], [[Simplicity (Arnheim)]], [[Figure and Ground]], [[Depth by Overlapping]], [[Perceptual Gradients]], [[Pyramidal Space]], [[Stroboscopic Motion]], [[Phenomenal Causality]], [[Frame of Reference for Motion]], [[Organic vs Mechanical Motion]], [[Directed Tension]], [[Dynamics of Obliqueness]], [[Physiognomic Perception]], [[Hue Brightness Saturation]], [[Illumination as a Perceptual Layer]], [[Shading and Volume]], [[Aerial Perspective]], [[The Gestalt Principles of Visual Perception]] |
| **L2 Theory** | [[Emotion Psychology]] (#1), [[Color Psychology]] (#2), [[Empirical Aesthetics]] (#3) | [[Birkhoff's Aesthetic Measure]], [[Visual Entropy]], [[Fractal Dimension]], [[Computational Aesthetics]], [[Expression as Configuration of Forces]], [[Symbolic Pattern in Composition]], [[Arnheim's Color Syntax]], [[Complementary Colors]], [[Warm and Cool Colors]], [[Color Harmony]] |
| **L3 Design** | [[Visual Hierarchy and Typography]] (#6), [[Negative Space]] (#7), [[Time-based Composition]] (#8), [[Movement Rhythm and Repetition]] (#9), [[Light Vocabulary]] (#10), [[Body Language and Pose Semantics]] (#11), [[Face Perception]] (#12), [[Materials and Texture]] (#13), [[Style as System]] (#14), [[Cultural and Symbolic Iconography]] (#15) | [[Chiaroscuro]], [[Tenebrism]], [[Sfumato]], [[Central Perspective]], [[Compositional Grids]], [[Rule of Thirds]], [[Dynamic Symmetry]], [[Golden Spiral]] |
| **L4 Generation** | [[Algorithmic Composition]] (#4) | [[Vectorizing Aesthetic Concepts]], [[JSON Archetypes for Visual Tasks]], [[Multimodal Evaluation Loops]], [[LLM-as-Judge for Visual Quality]], [[Photo Aesthetic Features]], [[NIMA - Neural Image Assessment]] |
| **L5 Application** | (the four priorities themselves) | — |

L1 is **dense** (Arnheim closed). L4 is **moderate** (decent coverage of LLM-side; tools branch empty). L2 and L3 are now **scaffolded but thin** — exactly the catalog-sweep deliverable.

## Connection density

Pages with the **highest connection density** (most inbound + outbound wikilinks):

1. [[The Structural Skeleton]] — the perceptual armature; cited everywhere in composition.
2. [[Perceptual Forces]] — the substrate ontology.
3. [[Simplicity (Arnheim)]] — the central law; cited as the "why" for many rules.
4. [[Directed Tension]] — the dynamic-content concept; cited from emotion, music, motion, composition.
5. [[Expression as Configuration of Forces]] — the bridge from perception to emotion/symbol.
6. [[Symbolic Pattern in Composition]] — the bridge from composition to meaning.
7. [[Physiognomic Perception]] — the bridge from perception to high-level evaluation.

These are the **load-bearing pages**. Changes to them propagate to many others. Treat with care.

## What the catalog reveals about the priority queue

Looking at the 15 stubs together, several **surprises**:

### Surprise 1: Arnheim Sweep 3 substantially pre-covers items 8, 9, 11, 14, 15.

The Sweep 3 chapters (Movement, Tension, Expression) directly produce structural substrate for:

- **#8 Time-based composition** — [[Stroboscopic Motion]], [[Phenomenal Causality]] supply the perceptual contract for animation timing.
- **#9 Movement/rhythm** — the four Movement-chapter pages cover the perceptual side; the depth-dive only needs to add the design-discipline catalog (ornament, tessellation, Islamic geometry).
- **#11 Body language** — [[Expression as Configuration of Forces]] supplies the cross-modal vocabulary; depth-dive only needs to add the empirical body-language literature (de Gelder, Birdwhistell).
- **#14 Style as system** — [[Symbolic Pattern in Composition]] and Arnheim's "dominant law of structure" supply the structural account; depth-dive only needs the historical rule-system catalog.
- **#15 Cultural / symbolic iconography** — [[Symbolic Pattern in Composition]] supplies the structural-universal account; depth-dive only needs the cultural-specific dictionaries.

**Implication**: the post-catalog depth-dives for these items can be **lighter and faster** — they're catalog-extensions on top of Arnheim's structural framework, not foundational depth-dives.

### Surprise 2: items 1, 2, 3 form a tight cluster that should depth-dive together.

[[Emotion Psychology]] (#1), [[Color Psychology]] (#2), [[Empirical Aesthetics]] (#3) are deeply interconnected. Russell's affect circumplex (item 1) is the substrate that color-emotion (item 2) maps onto, and Berlyne's arousal-potential (item 3) is the same valence-arousal space. A combined sweep could collapse the three into ~2 sweeps' worth of work with high cross-leverage.

Recommended: **combine items 1–3 into a single "Affect Foundations" depth-dive sweep**, splitting the writing across 2 sessions if needed.

### Surprise 3: item #4 (Algorithmic Composition) is the natural pair to the eventual tools sweep.

[[Algorithmic Composition]] (theory) + tools sweep (p5.js, paper.js, Pts.js, etc.) = the **generation pipeline** the user actually wants for priority 1. Logically these belong together.

Recommended: **after the affect-cluster depth-dive, do Algorithmic Composition + Tools as a paired sweep**.

### Surprise 4: items 5 (Perceptual Constants) and 12 (Face Perception) are the only remaining L1 fields.

The Arnheim sweeps left two perception-substrate gaps: constancies/illusions and the face-specific pathway. Both are short depth-dives, well-documented in their respective literatures, and pre-bounded.

Recommended: **bundle 5 + 12 as a short L1-cleanup sweep**.

### Surprise 5: items 6 (typography), 7 (negative space), 10 (light vocab), 13 (materials) form the **practical-design cluster** — the things working designers know that perception researchers don't write about.

These are the most directly applicable to priorities 2 and 3 (branding, graphic design). They could be a **fast practical sweep** drawing from working-designer literature (Müller-Brockmann, Bringhurst, Tufte, cinematographers' textbooks).

## Revised sweep sequence (proposal)

Based on the catalog, here's a proposed sweep sequence that respects the priority queue but exploits the cross-leverage the catalog revealed:

| Sweep | Topic | Items closed | Estimated depth |
|---|---|---|---|
| **Catalog** | ✅ Done 2026-05-17 | 15 stubs + Field Map | — |
| **Affect Foundations** | Russell circumplex + Plutchik + Goethe + Palmer-Schloss + Berlyne | 1, 2, 3 | Heavy (book reads) |
| **L1 Cleanup** | Constancies + illusions + Face perception (FFA + FACS + uncanny) | 5, 12 | Moderate |
| **Algorithmic Composition + Tools** | Galanter, Cohen AARON, Reas/Fry + p5/paper/Pts/three.js evaluation | 4 + tools sweep | Heavy (practical) |
| **Practical Design** | Müller-Brockmann grids + Tufte + Bringhurst + cinematography + PBR | 6, 7, 10, 13 | Moderate |
| **Movement-Rhythm-Style-Symbolism** | Wallpaper groups + Eisenstein + Wölfflin + Panofsky | 8, 9, 14, 15 | Moderate (Arnheim-leveraged) |
| **Body Language Depth** | de Gelder + Birdwhistell + Mehrabian + computable-pose pipeline | 11 | Light (Arnheim-leveraged) |

That sequence closes the queue in ~6 sweeps instead of 12+ if done one-per-sweep, by exploiting clusters and Arnheim-pre-coverage.

**This is a *proposal*, not a commitment.** The user retains the queue-order; this is what the catalog *suggests*.

## Cross-cutting research projects

Three projects span multiple fields and would yield the highest single-effort leverage:

### 1. The Directed-Tension Score for compositions

5-generator sum: obliqueness + asymmetry + truncation + gradient + convergence. Already specified in [[Directed Tension]] and [[Research - Arnheim Sweep 3]]. Implementing it would:

- Validate Arnheim's framework empirically (against AVA dataset human ratings).
- Provide a composition metric absent from Birkhoff / Datta / NIMA.
- Cross-cut [[Algorithmic Composition]] + [[Empirical Aesthetics]] + [[Visual Hierarchy and Typography]].

### 2. The Cross-Modal Expressive Vocabulary

Map audio features (tempo, attack, roughness, harmonic density) to visual features (motion frequency, edge hardness, color saturation, texture detail) via the shared structural primitives (rising/falling, expansion/contraction, harmony/discord). Directly serves priority 4 (visualizers).

Cross-cuts [[Expression as Configuration of Forces]] + [[Emotion Psychology]] + [[Color Psychology]] + [[Movement Rhythm and Repetition]].

### 3. The Physiognomic-Features Extractor

CV pipeline that extracts perception-relevant features (line energy, color temperature, openness, ascent, contour hardness) to complement Datta's geometric features. Inputs the LLM-as-judge pipeline.

Cross-cuts [[Physiognomic Perception]] + [[Photo Aesthetic Features]] + [[LLM-as-Judge for Visual Quality]] + [[Multimodal Evaluation Loops]].

## Open meta-questions for the user

After the catalog, three methodology questions arise that depend on the user's actual capacity and intent:

1. **Single-field sweeps or clustered sweeps?** The catalog reveals clusters with high cross-leverage (items 1-2-3, 4+tools, 6-7-10-13, 8-9-14-15). Clustered sweeps cover more ground per session but produce less depth per field.
2. **Reading time vs implementation time?** The depth-dives can either be **reading + synthesis** (the wiki pattern so far) or **reading + implementation** (build the directed-tension score / cross-modal mapper / physiognomic extractor *as part of* the depth-dive). The latter takes 2–3× longer but produces working code.
3. **When to start the tools sweep?** Tools (p5.js / paper.js / three.js / WebGPU / chroma.js / OpenCV.js) is a parallel branch from the priority queue. Could be done immediately (in parallel) or held until [[Algorithmic Composition]] depth-dive supplies the framework.

## Related pages

[[Wiki Methodology]] · [[hot]] · [[index]] · [[Research - Arnheim Sweep 1]] · [[Research - Arnheim Sweep 2]] · [[Research - Arnheim Sweep 3]] · [[Emotion Psychology]] · [[Color Psychology]] · [[Empirical Aesthetics]] · [[Algorithmic Composition]] · [[Perceptual Constants]] · [[Visual Hierarchy and Typography]] · [[Negative Space]] · [[Time-based Composition]] · [[Movement Rhythm and Repetition]] · [[Light Vocabulary]] · [[Body Language and Pose Semantics]] · [[Face Perception]] · [[Materials and Texture]] · [[Style as System]] · [[Cultural and Symbolic Iconography]]
