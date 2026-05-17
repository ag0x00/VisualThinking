---
title: Procedural Paradigms
type: concept
status: developing
tags: [concept, generative-art, algorithmic-composition, paradigms]
address: c-000116
created: 2026-05-17
sources: ["[[Algorithmic Composition]]"]
confidence: high
---

# Procedural Paradigms

> [!note] Taxonomy anchored on Galanter's framing
> The five-paradigm taxonomy below is the most useful taxonomy *under* the [[Galanter's Generative Art Framework|Galanter framing]] of generative art. Alternative framings propose different taxonomies — [[Procedural Content Generation|PCG / game-dev]] distinguishes search-based / constraint-based / grammar-based / fractal / ML methods; [[AI Art and Latent Space|AI-art]] distinguishes GAN / VAE / diffusion / autoregressive; [[Live Coding and Algorave|live-coding]] distinguishes DSL families. See [[Framings of Generative Art]] for the framings map.

A **taxonomy of approaches** for generating visual art programmatically. Each paradigm is a different *kind of system* the artist sets up; each makes different tradeoffs along the [[The Autonomy-Control Gradient|autonomy-control axis]] and is good at different aesthetic problems.

Five paradigms cover essentially all contemporary generative work:

1. **Rule-based / deterministic** — explicit rules; predictable output given inputs.
2. **Stochastic / random-within-rules** — rules constrain a randomness that explores within them.
3. **Iterative / dynamical-systems** — equations evolved over time; emergent patterns from local rules.
4. **Evolutionary / search-based** — selection pressure on a population of candidates.
5. **Learning-based / neural** — deep models trained on data; the model itself is the rule-system.

Most contemporary practice **mixes paradigms** — a rule-based composition with stochastic placements; a neural-generation step within a rule-based pipeline; etc.

## 1. Rule-based / deterministic

The simplest paradigm. The artist writes explicit rules; the program executes them; the output is fully determined by inputs.

**Examples**:
- LeWitt instructions: "Draw 10,000 straight lines and 10,000 not-straight lines, all at random."
- Geometric construction: bisect this angle; reflect across this axis; iterate.
- Architectural CAD generation: parametric models with explicit parameter values.

**Strengths**:
- **Transparent**: every output can be traced to its rule-set.
- **Reproducible**: same input → same output, indefinitely.
- **Debuggable**: when output is wrong, the cause is in the rules.

**Weaknesses**:
- **Boring** if rules are too constrained. Pure determinism produces output that's predictable, lacking [[Galanter's Generative Art Framework|effective complexity]].
- **Brittle** to scope changes. Adding a new visual feature often requires major rule restructuring.

**Best for**: brand-identity systems, architectural visualization, technical illustration, anything requiring **explicit communicable specification**.

**Wiki priority fit**: priority 2 (branding) heavily; priority 1 (generative art) as a primitive used inside larger systems.

## 2. Stochastic / random-within-rules

The dominant paradigm in the Stuttgart school and most contemporary generative art (per [[Algorithmic Art History]]). Rules constrain the **structure**; randomness explores **within** the constrained space.

**Examples**:
- Vera Molnár's *(Des)Ordres* — grid with random perturbations.
- Tyler Hobbs's *Fidenza* (Art Blocks 2021) — curved-stripe generator with rule-constrained randomness.
- Perlin/Simplex noise–driven gradients, particle systems, terrain.
- Most p5.js sketches.

**Strengths**:
- **Effective-complexity friendly**: random-within-rules naturally hits Galanter's mid-range.
- **Variation built in**: each run produces a new instantiation of the same system.
- **Tunable**: the randomness amplitude is a tunable parameter (Molnár's "ordre / désordre" dial).

**Weaknesses**:
- **Hard to control outliers**: pure random can produce occasional bad instantiations.
- **Less interpretable** than pure rule-based.
- **Reproducibility requires seed-tracking** (essential for on-chain generative art like Art Blocks).

**Best for**: most contemporary generative-art applications. The *default* paradigm for priority 1.

**Wiki priority fit**: priority 1 (generative art) directly; priority 4 (visualizers) when randomness modulates audio-driven base patterns.

## 3. Iterative / dynamical-systems

The output emerges from **iterating** local rules over many steps. Each step is simple; the **emergent global structure** is the interesting part.

**Sub-paradigms**:

### L-systems and grammars
Recursive symbolic rewriting (Lindenmayer 1968). Used for plant-like forms, fractal trees, recursive geometric structures. See [[L-Systems and Grammars]].

### Cellular automata
Discrete grid with local update rules (Conway's *Game of Life*, Wolfram CAs). See [[Cellular Automata and Reaction-Diffusion]].

### Reaction-diffusion systems
Continuous PDE-based local rules producing organic patterns (zebra stripes, leopard spots — Turing 1952). See [[Cellular Automata and Reaction-Diffusion]].

### Particle systems
Many particles evolving with local rules (flocking, fluid simulation, hair/cloth). Often physics-based.

### Strange attractors and chaos
Lorenz attractor, Hénon map, Pickover attractors — iterating simple equations produces complex fractal patterns.

**Strengths**:
- **Massive complexity from small rule-sets** — quintessentially Galanter's order-from-simplicity. Cellular-automata Rule 110 (Wolfram) is Turing-complete from a 1D rule with 2 states and 3-cell neighborhood.
- **Organic-feeling output** — emergent patterns often resemble natural systems.
- **Real-time animation friendly** — iterate one step per frame; animation is the natural output.

**Weaknesses**:
- **Hard to direct** — small rule changes can produce qualitatively different outputs.
- **Slow convergence** for some systems (reaction-diffusion may need 10⁴+ iterations to stabilize).
- **Initialization-sensitive** — the starting conditions can dominate.

**Best for**: organic textures, growth simulations, fluid-like visualizers, music-reactive systems (priority 4).

## 4. Evolutionary / search-based

A **population of candidate works** is evaluated against a fitness function; the fittest are mutated/recombined; iterate. The artist designs the **fitness function** and **mutation operators**; the evolutionary process *searches the design space*.

**Examples**:
- **Karl Sims's evolved virtual creatures** (1991, 1994) — 3D evolved morphologies.
- **Karl Sims's *Galápagos*** (1997) — interactive evolutionary art installation: gallery visitors selected which images survived.
- **Picbreeder** (Secretan et al. 2008+) — online collaborative evolution of NEAT-encoded images.
- **DALL-E reranking** — modern diffusion + CLIP-rerank is essentially an evolutionary loop (generate population, score by fitness, keep best).

**Strengths**:
- **Discovers what the artist didn't pre-imagine** — the central appeal of generative work.
- **Aesthetic-fitness-function design** is itself a creative move.
- **Works well when fitness is hard to specify rule-wise** but easy to recognize.

**Weaknesses**:
- **Computationally expensive** (many generations × population).
- **Fitness-function design is the bottleneck** — hard to specify good aesthetic fitness without manual scoring.
- **Mode-collapse** — populations can converge to local optima.

**Best for**: generative-art research, interactive-evolution installations, design-space exploration. Less direct for production work due to compute cost.

**Wiki priority fit**: priority 1 (art research direction); priority 2 if used for brand-mark generation (rare in practice).

## 5. Learning-based / neural

The model is **trained** on data; the trained network *is* the rule-system. Modern paradigm; dominant in commercial generative-AI (2018+).

**Sub-paradigms**:

### Generative Adversarial Networks (GANs)
StyleGAN (Karras 2019+), BigGAN. The "old" deep-learning generative paradigm (2014–2021).

### Diffusion models
DDPM (Ho 2020), Stable Diffusion (Rombach 2021+), DALL-E 2 (2022), Midjourney, FLUX, etc. The current dominant paradigm for text-to-image.

### Autoregressive models
DALL-E (1, 2021), Parti, Muse. Text and image tokens generated sequentially.

### Hybrid VLM + diffusion
GPT-4o-image, Gemini's native image generation, Claude's image generation — language-model controllers driving diffusion or autoregressive image generation.

**Strengths**:
- **High photorealism / detail** at low artist effort.
- **Natural-language interface** — describe what you want.
- **Massive style-coverage** from training data.

**Weaknesses**:
- **Black box** — outputs are hard to control precisely; "prompt engineering" is the only steering mechanism.
- **Reproducibility is delicate** — depends on exact model version, seed, sampler settings.
- **Configural failures** — see [[The Uncanny Valley]]; faces, hands, text in image, internal-consistency failures.
- **Effective-complexity is uncontrolled** — outputs land in many regions of the order-disorder axis; cherry-picking is needed.
- **Training-data ethics**: legal and ethical questions about training-data provenance.

**Best for**: photorealistic / specific-style content where precise compositional control isn't critical. **Less good** for the rule-precise generative-art the user's priority 1 emphasizes; more relevant for priorities 2 and 3 (branding photography, advertising imagery) as an asset-production tool.

## Hybrid paradigms (the current norm)

Most contemporary practice **combines paradigms**:

- **Rule-based composition + stochastic placement**: classical Stuttgart-school recipe.
- **L-system + neural rendering**: generate tree skeleton via L-system; render with neural network.
- **Diffusion + reranking**: generate with diffusion, select with CLIP fitness (an evolutionary-search step).
- **Cellular automaton + audio-reactive parameters**: priority-4 visualizer pattern.
- **Rule-based identity + neural style-transfer**: brand-system generation.

**Hybrid is the default for serious work.** Each paradigm has strengths the others lack; choose the right hammer for each nail in a pipeline.

## Implications for the wiki's four priorities

| Priority | Recommended paradigm mix |
|---|---|
| 1. Generative art (static + dynamic) | Stochastic + iterative (CA, reaction-diffusion, particles) as primary; rule-based for composition; occasional neural for texture |
| 2. Branding | Rule-based primary; stochastic for variation within identity; rarely neural for the mark itself (neural for supporting imagery is fine) |
| 3. Graphic design | Rule-based + stochastic; data-driven (d3.js); occasional neural for content |
| 4. Music-reactive visualizers | Iterative (CA, RD, particles) modulated by audio features; stochastic for organic feel; live-coding (Hydra) for performance |

## Connection to other wiki pages

- [[Galanter's Generative Art Framework]] — provides the theoretical target (effective complexity); all paradigms aim there.
- [[Algorithmic Art History]] — the historical sequence: rule-based (Stuttgart) → stochastic (Molnár) → iterative (CA, L-systems, particles) → evolutionary (Sims) → neural (post-2014).
- [[The Autonomy-Control Gradient]] — each paradigm sits at a different point on this axis.
- [[Library Evaluation Rubric]] — different libraries support different paradigms with different fluency.

## Caveats

- The "paradigm" boundaries are **fuzzy**. Reaction-diffusion is mathematically a PDE (dynamical-system); it can also be viewed as a stochastic-rule system; it can be implemented via neural ODE.
- The taxonomy is **descriptive of current practice**, not prescriptive. New paradigms (e.g., differentiable rendering as a paradigm in itself) are emerging.
- Each paradigm has **subcommunities and aesthetics** of its own. The aesthetics of CA art differs from L-system art differs from diffusion art.

## Related pages

[[Algorithmic Composition]] · [[Galanter's Generative Art Framework]] · [[Algorithmic Art History]] · [[L-Systems and Grammars]] · [[Cellular Automata and Reaction-Diffusion]] · [[Computational Creativity]] · [[The Autonomy-Control Gradient]] · [[Library Evaluation Rubric]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources

- Galanter 2003 "What is generative art?" — 6th GA Conference, Milan.
- McCormack & d'Inverno 2012 (eds.) *Computers and Creativity*. Springer.
- Sims 1991 "Artificial evolution for computer graphics" — *Computer Graphics* 25.
- Whitelaw 2004 *Metacreation: Art and Artificial Life*. MIT Press.
- Wolfram 2002 *A New Kind of Science*. Wolfram Media.
- Ho, Jain & Abbeel 2020 "Denoising diffusion probabilistic models" — *NeurIPS*.
- Rombach, Blattmann, Lorenz, Esser & Ommer 2022 "High-resolution image synthesis with latent diffusion models" — *CVPR*.
