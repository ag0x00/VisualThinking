---
title: Cellular Automata and Reaction-Diffusion
type: concept
status: developing
tags: [concept, generative-art, cellular-automata, reaction-diffusion, dynamical-systems]
address: c-000118
created: 2026-05-17
sources: ["[[Algorithmic Composition]]"]
confidence: high
---

# Cellular Automata and Reaction-Diffusion

> [!note] Useful across multiple framings
> CA and reaction-diffusion are the **canonical** computable handles for [[Artificial Life Art|a-life art]] (Whitelaw 2004 — emergence is the central concept) and also for [[Procedural Content Generation|PCG]] (cave generation, terrain). [[Galanter's Generative Art Framework|Galanter]] cites them as cases of "complexity-from-simplicity"; [[Live Coding and Algorave|live-coding]] uses them as real-time visuals (Lenia, Hydra). See [[Framings of Generative Art]].

Two closely-related **iterative-local-rule** paradigms that produce **emergent global structure** from simple cell-by-cell update equations. **Cellular automata** (CA) are discrete (grid + discrete states + integer time); **reaction-diffusion** systems are continuous (grid + real-valued concentrations + continuous time, often modeled with finite differences).

Both are often cited as paradigm cases of **effective complexity** under [[Galanter's Generative Art Framework|Galanter's framing]] — small rules produce richly structured output. They are *also* the canonical generative substrate for [[Artificial Life Art|Whitelaw's a-life framing]] where emergence is foregrounded as the artwork itself, not just as an aesthetic property of the output.

## Cellular automata

A cellular automaton is a grid of cells, each with a discrete **state** (typically 0/1 but can be more), updated **in parallel** at each time step according to a **local rule** that depends on the cell's neighborhood.

### Conway's Game of Life (1970)

The canonical CA. 2D grid; each cell is **alive (1)** or **dead (0)**; each cell's next state depends on its 8 Moore neighbors:

- A live cell with 2 or 3 live neighbors stays alive (survival).
- A live cell with fewer than 2 or more than 3 dies (under/overpopulation).
- A dead cell with exactly 3 live neighbors becomes alive (reproduction).

From these rules emerge:

- **Still lifes** (block, beehive, loaf) — stable patterns.
- **Oscillators** (blinker, toad, pulsar) — periodic patterns.
- **Gliders** — patterns that move across the grid.
- **Glider guns** — patterns that emit gliders indefinitely.
- **Spaceships, puffers, breeders** — increasingly complex moving patterns.
- **Turing-complete computation** — Game of Life can simulate any Turing machine (Berlekamp, Conway & Guy 1982).

This is the **paradigm demonstration** of complexity-from-simplicity. The full ruleset is 4 lines; the output supports universal computation.

### Wolfram's 1D cellular automata

Stephen Wolfram's *A New Kind of Science* (2002) systematically explored 1D CAs (a row of cells; each updated based on 3 cells: itself, left neighbor, right neighbor). For 2-state cells and 3-cell neighborhood, there are $2^{2^3} = 256$ possible rules.

Wolfram classified the 256 rules into **4 behavior classes**:

1. **Class 1**: dies out — homogeneous fixed point.
2. **Class 2**: stable or periodic patterns.
3. **Class 3**: aperiodic, chaotic.
4. **Class 4**: complex localized structures + persistent patterns — the **edge-of-chaos** regime where computation can happen.

**Rule 110** is the most-famous Class-4 CA: simple-looking 1D CA, **proven Turing-complete** (Cook 2004). This is the canonical example of how complexity can emerge from minimal rules — and aligns directly with Galanter's effective-complexity claim.

### CA in generative art

- **Pixel-art and graphic patterns**: Game of Life animations, Wolfram-rule strips.
- **Texture synthesis**: CAs producing leather, scales, organic surfaces.
- **Procedural levels and dungeons**: CA-smoothed cave / dungeon generation (popular in roguelikes).
- **Generative-art Genuary entries**: CA-driven compositions appear annually.

CAs are **excellent for music-reactive visualizers** (priority 4): step the CA once per beat; let the emergent patterns visualize the music's structure.

## Reaction-diffusion systems

The continuous analog. Originally formulated by **Alan Turing (1952)** as a model of **biological pattern formation** — how zebra stripes, leopard spots, and animal pigment patterns might emerge from simple chemical reactions.

### The Gray-Scott model (most popular for art)

Two chemicals $U$ and $V$ diffuse and react:

$$\frac{\partial U}{\partial t} = D_U \nabla^2 U - UV^2 + F(1 - U)$$

$$\frac{\partial V}{\partial t} = D_V \nabla^2 V + UV^2 - (F+k)V$$

Where:
- $D_U, D_V$: diffusion rates of the two chemicals.
- $F$: feed rate (how fast $U$ is replenished).
- $k$: kill rate (how fast $V$ decays).

Tiny changes in $(F, k)$ produce **wildly different patterns**: spots, stripes, mazes, holes, traveling waves, growing fronts, mitosis-like spawning, "chaos." Pearson 1993 mapped the parameter space and labeled regimes (alpha through chi).

The **aesthetic strategy**: pick $(F, k)$ in the interesting regimes; let the system evolve; harvest at well-chosen times.

### Other reaction-diffusion variants

- **FitzHugh-Nagumo** — excitable-medium model; produces traveling waves, spirals (matches cardiac-tissue dynamics).
- **Gierer-Meinhardt** — activator-inhibitor model used heavily in developmental biology.
- **Lattice Boltzmann** — fluid-dynamics-derived RD systems.

### Generative-art use

- **Karl Sims's *Reaction-Diffusion***: 1990s installation work.
- **Robert Hodgin** and many other p5.js / openFrameworks practitioners.
- **Pattern-fills for textile and surface design** — Gray-Scott outputs are the basis of many "organic" texture libraries.
- **Audio-reactive visualizers** — modulate $(F, k)$ or diffusion rates with audio features for music-reactive RD patterns.

### Aesthetic properties

Reaction-diffusion produces patterns with characteristic features:

- **Soft, organic curves** — no hard edges.
- **Multi-scale structure** — patterns at multiple spatial frequencies.
- **Continuous variation** — perfect for music-reactive systems where audio modulates parameters smoothly.
- **High fractal dimension** in many regimes — natively in the [[Fractal Dimension|preferred range]] $D \in [1.3, 1.5]$.

## CA vs RD: when to use which

| Criterion | Cellular Automata | Reaction-Diffusion |
|---|---|---|
| **Type** | Discrete cells, discrete states | Continuous concentrations |
| **Visual feel** | Sharp / pixelated / digital | Soft / organic / biological |
| **Computational cost** | Cheap (one int per cell per step) | Moderate (floats; many sub-steps) |
| **Parameter space** | Discrete (rule selection) | Continuous ($F, k$, diffusion rates) |
| **Tuning** | Pick the right rule | Tune $F, k$ in known interesting regimes |
| **Real-time on GPU** | Easy (Game of Life shaders are textbook) | Easy (fragment shaders for diffusion + reaction) |
| **Best for** | Pixel art, digital aesthetics, retro effects | Organic patterns, smooth transitions, surface textures |

Most music-reactive visualizers (priority 4) prefer RD for its smooth modulation. Most retro / 8-bit-aesthetic generative art prefers CA.

## Implementation considerations

Both are **GPU-friendly**:

- CA: store grid as a texture; fragment shader reads neighbors and writes new state.
- RD: same, but with float textures and 2-pass updates (diffusion + reaction).

On modern hardware (WebGPU compute shaders), both can run at hundreds of FPS on $1024 \times 1024$ grids — making them practical for real-time visualization.

The wiki defers specific library / framework choices to the tools sweep — see [[WebGPU]], [[three.js]], [[p5.js]]. For now: any tool that exposes fragment-shader or compute-shader pipelines suffices.

## Connection to other wiki pages

- [[Galanter's Generative Art Framework]] — CA/RD are paradigm cases of effective-complexity.
- [[Procedural Paradigms]] — both are iterative / dynamical-systems paradigms.
- [[L-Systems and Grammars]] — sibling-paradigm; L-systems for branching, CA/RD for spatial-pattern.
- [[Fractal Dimension]] — many CA/RD outputs naturally sit in the preferred fractal-D range.
- [[Movement Rhythm and Repetition]] — wallpaper-group-like patterns emerge from CA/RD.
- [[Organic vs Mechanical Motion]] — RD systems produce organic-feeling motion; CA tends to mechanical-feeling.

## Caveats

- **Initial conditions matter strongly** for CA. A random init produces different long-term behavior than a designed init.
- **RD parameters are sensitive**. Tiny changes in $(F, k)$ can collapse the pattern; tune carefully.
- **Both can be slow to "interesting"** — sometimes 10⁴+ iterations before patterns stabilize. Real-time use requires good initialization or fast iteration.
- **Visually they have a strong "era" signature** — CA looks like 1980s Wolfram, RD like 1990s-2000s screen-savers. Modern aesthetic use often combines with shading / post-processing to escape the era association.

## Related pages

[[Algorithmic Composition]] · [[Procedural Paradigms]] · [[Galanter's Generative Art Framework]] · [[L-Systems and Grammars]] · [[Fractal Dimension]] · [[Visual Entropy]] · [[Movement Rhythm and Repetition]] · [[Organic vs Mechanical Motion]] · [[The Autonomy-Control Gradient]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources

- Turing 1952 "The chemical basis of morphogenesis" — *Philosophical Transactions of the Royal Society B* 237(641).
- Gardner 1970 "Mathematical games: the fantastic combinations of John Conway's new solitaire game 'Life'" — *Scientific American* 223(4).
- Wolfram 2002 *A New Kind of Science*. Wolfram Media.
- Cook 2004 "Universality in elementary cellular automata" — *Complex Systems* 15(1).
- Pearson 1993 "Complex patterns in a simple system" — *Science* 261(5118).
- Berlekamp, Conway & Guy 1982 *Winning Ways for Your Mathematical Plays*. Academic Press.
- Witkin & Kass 1991 "Reaction-diffusion textures" — SIGGRAPH '91.
