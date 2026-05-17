---
title: "Research – Algorithmic Composition + Tools Sweep"
type: research-synthesis
status: developing
tags: [research, synthesis, algorithmic-composition, tools, generative-art]
created: 2026-05-17
address: c-000133
sources: ["[[Algorithmic Composition]]"]
confidence: high
---

# Research – Algorithmic Composition + Tools Sweep

The **third clustered depth-dive sweep**, executing the paired Algorithmic Composition + Tools sequence per the user's locked policy (`feedback_algo-comp-before-tools` in memory): **framework first, then library evaluation rubric, then tool evaluations against the rubric.**

This is the **generation-layer** of the wiki — the L4 layer in the Field Map's five-layer stratification. After two sweeps that densified L1 (perception) and L2 (theory), this sweep closes L4 and produces the recommendation stack the wiki's future implementation work will use.

## What's new from this sweep

**20 new pages** (c-000114 … c-000133):

### Algorithmic Composition framework (8 pages — `wiki/concepts/`)

- **[[Galanter's Generative Art Framework]]** — Galanter 2003 definition + effective-complexity claim (Gell-Mann); the theoretical anchor.
- **[[Algorithmic Art History]]** — pre-computer + Stuttgart-school + AARON + Reas/Fry Processing-era + contemporary. The lineage.
- **[[Procedural Paradigms]]** — five paradigms (rule-based, stochastic, iterative, evolutionary, learning-based); how they combine.
- **[[L-Systems and Grammars]]** — Lindenmayer + shape grammars + Wave Function Collapse; complexity-from-simplicity.
- **[[Cellular Automata and Reaction-Diffusion]]** — discrete + continuous local-rule iterative systems.
- **[[Computational Creativity]]** — Boden's three creativity types; Ritchie's criteria; what AI does well vs poorly.
- **[[The Autonomy-Control Gradient]]** — the central axis; where each paradigm sits.
- **[[Library Evaluation Rubric]]** — the bridge: explicit criteria the tools sweep applies.

### Tools (10 pages — `wiki/tools/`)

- **[[p5.js]]** — pedagogical entry point; first-class for teaching / prototyping; second-class for production.
- **[[paper.js]]** — vector-graphics native; first-class for branding (priority 2).
- **[[three.js]]** — 3D / WebGPU dominant; **first-class across the board**; the wiki's primary rendering stack.
- **[[WebGPU]]** — modern GPU API; first-class for compute-heavy / music-reactive work.
- **[[Pts.js]]** — geometric-composition specialist; second-class but strong in niche.
- **[[Hydra]]** — live-coding visuals; first-class for music-reactive performance (priority 4).
- **[[d3.js]]** — data-driven; first-class for graphic design (priority 3); modular utilities reusable elsewhere.
- **[[The Color Stack]]** (culori + chroma.js + d3-color) — first-class infrastructure; culori is the wiki's OKLCH default.
- **[[Web Audio API and AudioWorklet]]** — first-class audio infrastructure for visualizers.
- **[[Anthropic TypeScript SDK]]** — first-class LLM default per CLAUDE.md.

### Synthesis (2 pages — `wiki/tools/` and `wiki/questions/`)

- **[[Tools Map]]** — comparative verdicts + recommended stacks per priority.
- **This page**: Research synthesis.

## Five cross-cutting themes

### 1. The L4 layer is now operational.

After Arnheim closed L1 (perception substrate), Affect Foundations and L1 Cleanup completed L1+L2, and the Catalog sweep scaffolded L3 — this sweep closes **L4 (generation)**. The wiki now has:

- **L1 Perception substrate** (30+ pages): Arnheim, constancies, face perception.
- **L2 Theory** (13+ pages): emotion + color + empirical-aesthetics + cross-modal.
- **L3 Design** (catalog stubs in place; depth-dives queued).
- **L4 Generation** (20 pages from this sweep): framework + tools + verdicts.
- **L5 Application** (the four priorities themselves).

L1 → L2 → L4 is a **complete vertical path** from perception substrate through theory to programmable generation. L3 (practical design disciplines) remains scaffolded; that's the next sweep.

### 2. The "effective complexity" unification spans the wiki.

Galanter's effective-complexity claim now sits at the **generative side** of the wiki's central theoretical unification:

```
Generative side (this sweep)        Aesthetic-evaluation side (Affect Foundations sweep)
                                    
Galanter / Gell-Mann                Berlyne's arousal-potential
effective complexity        ←→      inverted-U preference law
        |                                       |
        |                                       v
        v                           Birkhoff M=O/C, Visual Entropy,
        |                           Fractal Dimension, Datta features, NIMA
        |                           (all proxies for arousal-potential)
        v                                       |
Procedural paradigms                            v
target the mid-range            ←→   Engaged viewer (mid-complexity preferred)
```

Generators **aim for** effective complexity; viewers **prefer** it. Same underlying construct, two vantages. The wiki now has **explicit pages on both sides**, with the connection made plain.

### 3. The autonomy-control gradient maps to the procedural-paradigms taxonomy.

The [[The Autonomy-Control Gradient]] is the **single axis** along which all five [[Procedural Paradigms]] arrange:

| Position | Paradigm |
|---|---|
| Most controlled | Direct manipulation / Photoshop |
| ↓ | Parametric design |
| ↓ | Rule-based generation |
| Middle | Stochastic-rule generation |
| ↓ | Iterative / dynamical-systems |
| ↓ | Evolutionary / search-based |
| Most autonomous | Learning-based / neural |

The middle is the sweet spot — same logic as effective complexity. **The middle is where the artist + system collaborate productively.** Pure control is the artist alone; pure autonomy is the system alone; the middle is the collaborative regime where generative art lives.

### 4. The tools split cleanly into infrastructure + paradigm-specialists + general-purpose.

The 10 evaluated tools fall into three categories:

**Infrastructure** (used by everyone, regardless of paradigm):
- [[The Color Stack]] (culori) — perceptual color manipulation.
- [[Web Audio API and AudioWorklet]] — audio input for visualizers.
- [[WebGPU]] — modern GPU access.
- [[Anthropic TypeScript SDK]] — LLM integration.

**Paradigm specialists** (best for a specific paradigm or priority):
- [[paper.js]] — vector graphics / branding.
- [[Hydra]] — live-coding visuals.
- [[d3.js]] — data-driven design.
- [[Pts.js]] — geometric algorithms.

**General-purpose** (cover many paradigms well):
- [[three.js]] — the dominant general-purpose 3D library.
- [[p5.js]] — the dominant general-purpose 2D library.

The recommended stack pattern: **infrastructure + general-purpose + paradigm-specialist** for the specific work. Not all libraries at once.

### 5. The wiki's policy decisions are now consistent across the framework.

The three locked policy decisions (clustered sweeps; reading-only on concept pages; algo-comp-before-tools) have shaped this sweep concretely:

- **Clustered**: framework + tools done in one paired sweep, exploiting the rubric-bridge that connects them.
- **Reading-only**: no code on framework or tool pages. The Tools Map produces *verdicts*, not example code.
- **Framework-first**: the Library Evaluation Rubric is *derived from* the framework pages; tools are evaluated against it; the framework-first order makes the evaluation principled rather than arbitrary.

These decisions are paying off: each subsequent sweep is more efficient because the framework is in place.

## Specific empirical claims absorbed

| Claim | Source | Implication |
|---|---|---|
| Generative art lives in the **effective-complexity** middle | Galanter 2003; Gell-Mann 1994 | Target mid-complexity in generators |
| **Rule 110 cellular automaton is Turing-complete** | Cook 2004 | Massive computation from minimal rules — paradigm case of complexity-from-simplicity |
| Game of Life is Turing-complete | Berlekamp, Conway & Guy 1982 | Same |
| **Turing's reaction-diffusion (1952) explains biological pattern formation** | Turing 1952; subsequently confirmed in many species | Generative paradigm with biological grounding |
| **Boden's three creativity types**: combinational, exploratory, transformational | Boden 1990 | Different paradigms / tools serve different creativity types |
| **The autonomy-control middle is the collaborative regime** | this sweep's synthesis | Generative art is a collaboration between artist (rule-design) and system (rule-execution) |
| **Three.js's WebGPU renderer is production-ready in 2026** | the three.js release notes | New work targets the WebGPU renderer + TSL |
| **OKLCH provides perceptually-uniform interpolation** | Ottosson 2020 | Color interpolation in generative work should use OKLCH, not RGB |
| **Michotte's 70 ms causality threshold** (from Sweep 3) | Michotte 1946 | Latency budget for visualizer pipelines: audio→render must clear 70 ms for causal feel |

## Implementation plan (queued for after this sweep)

Per `feedback_implementation-in-sweeps` policy, **no implementation code was written** during the framework or tool pages. The Tools Map's recommended stacks are now ready to inform the next phase.

The next-after-next sweep — **not the next sweep** (Practical Design is next per the locked sequence) — should be the **implementation-notes pass**:

1. Revisit framework concept pages and add implementation notes for key algorithms (L-system in TS; Game of Life shader; Gray-Scott reaction-diffusion shader; flow-field particle systems).
2. Add minimal "hello-world" examples to each tool page using the now-evaluated stack.
3. Build the three cross-cutting research projects (Directed-Tension Score; Cross-Modal Vocabulary mapper; Physiognomic-Features Extractor) using the recommended stack.

This is the **first time the wiki will produce actual code**. It waits until after the **Practical Design sweep** because typography, light-vocabulary, and materials/PBR will affect the implementation surface (especially typography for design work and PBR for 3D).

## Cross-references and updates to existing pages

The following existing pages should be updated:

- **[[Algorithmic Composition]]** stub — move to `stable`; link to the 8 framework pages.
- **[[Computational Aesthetics]]** — link to [[Galanter's Generative Art Framework]] (sister field).
- **[[Vectorizing Aesthetic Concepts]]** — link to [[Anthropic TypeScript SDK]] as the LLM substrate.
- **[[JSON Archetypes for Visual Tasks]]** — link to [[Anthropic TypeScript SDK]] structured-output capability.
- **[[Multimodal Evaluation Loops]]** — link to [[Anthropic TypeScript SDK]] and [[LLM-as-Judge for Visual Quality]].
- **[[LLM-as-Judge for Visual Quality]]** — link to Anthropic SDK page; integrate the persona-based recommendation.
- **[[Photo Aesthetic Features]]** — link to [[Galanter's Generative Art Framework]] (effective-complexity unification).
- **[[Cross-Modal Emotion Mapping]]** — link to [[Web Audio API and AudioWorklet]] and [[Hydra]] (priority-4 pipeline pieces).
- **[[OKLCH]]** — link to [[The Color Stack]] as the implementation layer.
- **[[Color Harmony]]** — link to [[The Color Stack]].

## Connection to the four user priorities (updated)

| Priority | Recommended core stack (from this sweep) |
|---|---|
| 1. Generative art | **three.js + WebGPU + culori + Anthropic SDK**; add paper.js for vector / static work; add p5.js for prototyping |
| 2. Branding | **paper.js + culori + Anthropic SDK**; add three.js for 3D experiences |
| 3. Graphic design | **d3.js + paper.js + culori + Anthropic SDK**; add three.js for hero work |
| 4. Music-reactive visualizers | **Web Audio API + three.js + culori + Hydra** (offline parameter exploration via Anthropic SDK) |

These are now **documented recommendations**, not informal opinions. Future work has a clear starting point.

## Open threads

### What this sweep doesn't cover (intentionally)

- **Computer vision libraries** (OpenCV.js, ml5.js, TensorFlow.js) — deferred to a future "CV / ML in the browser" depth-dive.
- **Specialized scientific visualization** (Plotly, deck.gl) — adjacent and not central.
- **Audio synthesis frameworks** (Tone.js for composition; not just analysis) — adjacent.
- **Game engines** (Babylon.js, PlayCanvas, Unity-WebGL) — different problem space.
- **Server-side rendering** (node-canvas, Puppeteer rendering) — adjacent.

### Primary sources still untouched

- Galanter 2003 (the paper itself — the wiki has read summaries; should read the full text).
- Boden 2004 *The Creative Mind* (full text).
- Whitelaw 2004 *Metacreation: Art and Artificial Life* (full text).
- Wolfram 2002 *A New Kind of Science* (touched; deeper read worthwhile for specific CA aesthetics).
- Prusinkiewicz & Lindenmayer 1990 *The Algorithmic Beauty of Plants* (touched; full read for plant-specific work).

### The implementation-notes pass

As noted above, this is **queued but not yet started**. Three priorities for that pass:

1. **Directed-Tension Score** implementation — the 5-generator formula in [[Directed Tension]] becomes a real TS function.
2. **Cross-modal vocabulary mapper** — table from [[Cross-Modal Emotion Mapping]] becomes a real audio→visual translation module.
3. **Hello-world generative examples** for each of the recommended-stack libraries.

## Connection to the wiki's structural narrative

The wiki has now built **three vertical paths** through its five-layer stratification:

1. **The perception path** (Arnheim, constancies, face): L1 → connects upward to L2 expression theory.
2. **The aesthetic-evaluation path** (Berlyne, fluency, neuroaesthetics): L2 → unified via the arousal-potential unification.
3. **The generation path** (Galanter, paradigms, tools): L4 → connects downward to L2 via effective-complexity = arousal-potential.

The **two ends meet at L2**: Berlyne's arousal-potential (evaluation side) = Galanter's effective complexity (generation side). Each unifies many measurements / techniques on its own side; together they form **a single theoretical pillar** that the wiki's design work and implementation work will stand on.

L3 (design disciplines) is the **horizontal layer** that connects all of these to the user's actual work. The Practical Design sweep (next) closes L3.

## Related pages

[[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]] · [[Research - Arnheim Sweep 1]] · [[Research - Arnheim Sweep 2]] · [[Research - Arnheim Sweep 3]] · [[Research - Affect Foundations Sweep]] · [[Research - L1 Cleanup Sweep]] · [[Algorithmic Composition]] · [[Galanter's Generative Art Framework]] · [[Algorithmic Art History]] · [[Procedural Paradigms]] · [[L-Systems and Grammars]] · [[Cellular Automata and Reaction-Diffusion]] · [[Computational Creativity]] · [[The Autonomy-Control Gradient]] · [[Library Evaluation Rubric]] · [[p5.js]] · [[paper.js]] · [[three.js]] · [[WebGPU]] · [[Pts.js]] · [[Hydra]] · [[d3.js]] · [[The Color Stack]] · [[Web Audio API and AudioWorklet]] · [[Anthropic TypeScript SDK]] · [[Tools Map]] · [[Berlyne's Arousal-Potential Theory]]
