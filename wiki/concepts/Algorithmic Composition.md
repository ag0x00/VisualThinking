---
title: Algorithmic Composition
type: field-overview
status: stable
tags: [field, generative-art, algorithm, algorithmic-composition-sweep]
address: c-000077
created: 2026-05-17
updated: 2026-05-17
priority_rank: 4
depth_dive_complete: true
---

# Algorithmic Composition

**Field overview. Catalog sweep 2026-05-17; depth-dive complete same day as part of [[Research - Algorithmic Composition and Tools Sweep]]. The L4 generation layer of the wiki.**

The history, theory, and practice of using **algorithms** to compose visual works. Older than computer graphics — Sol LeWitt's *Wall Drawings* are algorithmic — but operationalized at scale by the German/American computer-art generation of the 1960s. The field that names the *method* of programmable art.

Distinct from [[Computational Aesthetics]]: algorithmic composition is about **generation** (what should the algorithm output?); computational aesthetics is about **evaluation** (how good is the output?). Generative pipelines need both.

## Canonical figures

- **Frieder Nake** — German computer-artist (1938–). 1965 Stuttgart algorithmic-art exhibition (with Georg Nees, Michael Noll) was the founding moment. *Walk-Through-Raster* and *Hommage à Paul Klee* (1965) are canonical.
- **Manfred Mohr** — German-American algorithmic artist (1938–). 1971 *Une Esthétique Programmée* show at ARC, Paris — first solo computer-art show at a major museum. Hypercube projections as life-long subject.
- **Vera Molnár** — Hungarian-French algorithmic pioneer (1924–2023). "Imaginary machine" (1959–1968, hand-drawn algorithms before computer access). Stochastic variation on geometric rules.
- **Harold Cohen** — *AARON* (1973–2016). Rule-based image-generation program. Made original drawings, eventually with color; toured museums. The first sustained "artist program."
- **Sol LeWitt** — *Wall Drawings* (1968–2007). Conceptual algorithmic art: instructions executed by others. Pre-computer but the *purest* algorithmic-composition examples.
- **Philip Galanter** — *Complexity-Theoretical Aesthetics* (2003) and *What Is Generative Art?* (2003). The contemporary theoretical anchor.
- **Casey Reas & Ben Fry** — co-creators of Processing (2001). Pedagogical / practical anchors for the modern field. *Form+Code* (2010).

## Key concepts (depth-dive will expand)

- **Galanter's definition of generative art** (2003): art "where the artist uses a system, such as a set of natural language rules, a computer program, a machine, or other procedural invention, which is set into motion with some degree of autonomy contributing to or resulting in a completed work of art."
- **Effective Complexity** (Galanter via Gell-Mann): the sweet spot between random and ordered; the same complexity range computational aesthetics finds preferred. Algorithmic composition operates *toward* this complexity range deliberately.
- **Rule-based vs stochastic vs evolutionary vs learning-based.** Four overlapping paradigms:
  - **Rule-based** (Cohen's AARON, LeWitt instructions, L-systems for plants).
  - **Stochastic** (Nake, Molnár random rotations within geometric rules).
  - **Evolutionary** (Karl Sims 1991 evolved 3D creatures; interactive genetic art).
  - **Learning-based** (modern: GAN, diffusion, autoregressive — see [[NIMA - Neural Image Assessment]] for aesthetic-guided sampling).
- **Constraint satisfaction**: most algorithmic compositions are constraint-satisfaction problems. Define the rule set; the work emerges.
- **Autonomy vs control gradient**: from full autonomy (random walk) to full control (deterministic specification). Most interesting work lives somewhere along this gradient.
- **The "Wölfli problem"**: a maximally-autonomous algorithm produces noise; a maximally-controlled one produces a drawing the artist could have made by hand. Algorithmic value is in the *middle* — where the algorithm reveals patterns the artist did not pre-imagine.

## Why this matters for the wiki's four priorities

| Priority | Use |
|---|---|
| 1. Generative art | **Direct.** This is the field. |
| 2. Branding | Algorithmic identity systems (e.g., MIT Media Lab, Casa da Música) where the brand mark is *generated* per use-case from a rule set. |
| 3. Graphic design | Procedural posters; data-driven design (Stefan Sagmeister, Onformative). |
| 4. Music-reactive visualizers | Visualizers ARE algorithmic compositions running on audio input. |

## Connection to existing wiki pages

- [[Computational Aesthetics]] — sister field. Generation × evaluation.
- [[Birkhoff's Aesthetic Measure]] — measure for evaluating algorithmic outputs.
- [[Visual Entropy]], [[Fractal Dimension]] — the complexity targets generators should hit.
- [[The Structural Skeleton]] — Arnheim's framework lets generators *target the skeleton* not just the surface.
- [[Directed Tension]] — directed-tension generators are themselves algorithmic-composition primitives.
- [[Vectorizing Aesthetic Concepts]] / [[JSON Archetypes for Visual Tasks]] — pipeline interfaces between LLM and algorithm.

## What's missing

- The Stuttgart school's actual technical methods (1960s plotter art).
- L-systems and grammars (Lindenmayer 1968) as a generative substrate.
- Cellular automata as composition (Wolfram, *A New Kind of Science*).
- Karl Sims (1991, 1994) evolutionary art.
- Casey Reas / Processing's enabling effect on the 2000s+ generative art generation.
- The contemporary GAN / diffusion era — relationship to classical algorithmic composition (continuous vs combinatorial).
- Genuary, fxhash, Art Blocks — modern practice and the on-chain generative-art platforms.

## Depth-dive complete

Eight framework concept pages + 10 tool evaluations + 2 synthesis pages produced (2026-05-17, see [[Research - Algorithmic Composition and Tools Sweep]]):

### Framework
- **[[Galanter's Generative Art Framework]]** — definition + effective-complexity claim.
- **[[Algorithmic Art History]]** — pre-computer → Stuttgart → AARON → Reas/Fry → contemporary.
- **[[Procedural Paradigms]]** — five paradigms (rule-based, stochastic, iterative, evolutionary, learning-based).
- **[[L-Systems and Grammars]]** — Lindenmayer + shape grammars + Wave Function Collapse.
- **[[Cellular Automata and Reaction-Diffusion]]** — discrete + continuous local-rule systems.
- **[[Computational Creativity]]** — Boden three types; Ritchie criteria.
- **[[The Autonomy-Control Gradient]]** — the central axis; where paradigms sit.
- **[[Library Evaluation Rubric]]** — the bridge to the tools sweep.

### Tools (in `wiki/tools/`)
- **[[p5.js]]** · **[[paper.js]]** · **[[three.js]]** · **[[WebGPU]]** · **[[Pts.js]]** · **[[Hydra]]** · **[[d3.js]]** · **[[The Color Stack]]** · **[[Web Audio API and AudioWorklet]]** · **[[Anthropic TypeScript SDK]]**

### Verdicts
See **[[Tools Map]]** for the comparative table and recommended stacks per priority.

**Key finding from the sweep**: Galanter's effective complexity (generation side) and Berlyne's arousal-potential (evaluation side, from Affect Foundations) are the same construct, two vantages. The wiki now has explicit pages on both ends of its central theoretical pillar. The recommended default stack (CLAUDE.md-aligned): **three.js + WebGPU + culori + Anthropic SDK**, with paper.js for vector, Hydra for live-coded visualizers, d3.js for data-driven design.

## Related pages

[[Computational Aesthetics]] · [[Birkhoff's Aesthetic Measure]] · [[Visual Entropy]] · [[Fractal Dimension]] · [[Directed Tension]] · [[Symbolic Pattern in Composition]] · [[Vectorizing Aesthetic Concepts]] · [[JSON Archetypes for Visual Tasks]] · [[Empirical Aesthetics]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources to consult in depth-dive

- Galanter 2003 "What is generative art? Complexity theory as a context for art theory" — 6th Generative Art Conference, Milan.
- Nees 1969 *Generative Computergraphik* (PhD dissertation).
- Cohen 1995 "The further exploits of AARON, painter" — *Stanford Humanities Review* 4(2).
- LeWitt 1967 "Paragraphs on conceptual art" — *Artforum*.
- Reas & Fry 2010 *Form+Code in Design, Art, and Architecture*.
- Sims 1991 "Artificial evolution for computer graphics" — *Computer Graphics* 25.
- Galanter 2012 "Computational aesthetic evaluation: past and future" — in *Computers and Creativity*.
