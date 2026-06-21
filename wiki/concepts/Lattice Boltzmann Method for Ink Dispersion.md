---
title: Lattice Boltzmann Method for Ink Dispersion
type: concept
status: developing
tags: [concept, generative-art, fluid-simulation, ink, lattice-boltzmann, gpu, sumi-e]
address: c-000233
created: 2026-06-21
sources: ["[[Chu Tai - MoXi Real-Time Ink Dispersion]]"]
confidence: high
---

# Lattice Boltzmann Method for Ink Dispersion

**One-line:** A GPU-friendly fluid solver that models water **percolating through paper fibres** as streaming-and-colliding particle populations on a grid — the canonical real-time method for **Eastern ink-wash (sumi-e / 水墨) dispersion**, introduced by the MoXi system (Chu & Tai, SIGGRAPH 2005).[^moxi]

## Why this is the right tool for ink-on-paper

Ink dispersion is **percolation in a disordered porous medium**, not free fluid flow. Fick's-law diffusion alone (Kunii et al.) only blurs — it cannot make the *feathery streaks, branching, and roughened/darkened edges* that read as real ink (Source: [[Chu Tai - MoXi Real-Time Ink Dispersion]]). The Lattice Boltzmann Equation (LBE) wins over a Navier–Stokes solver here for three concrete reasons:

1. **No Poisson solve.** [[Stable Fluids and GPU Ink Advection|Stam-style N–S]] needs a global pressure projection (the GPU bottleneck). LBE is purely **local + explicit** — every update reads only a cell and its neighbours.
2. **GPU-native.** All fields are textures; the update is a fragment/compute shader. MoXi's six LBE fragment programs averaged **~30 GPU instructions each** and ran 512² at ~44 fps on 2005 hardware. Trivially real-time today.
3. **Easy to graft extra physics on.** Percolation, permeability, pinning all bolt onto the base scheme locally — hard to express macroscopically, easy as local rules.

The price: LBE is weakly **compressible**, so the flow speed must stay low — which is exactly true of ink creeping through fibres, so it is a non-issue here (Source: [[Chu Tai - MoXi Real-Time Ink Dispersion]]).

## The core scheme (D2Q9)

- Grid of cells; each holds **9 particle-distribution functions** $f_i$ along the lattice vectors $\mathbf{e}_i$ (centre + 4 axial + 4 diagonal). Weights $w_i$: $4/9$ centre, $1/9$ axial, $1/36$ diagonal.
- Each step does two local operations:
  - **Collision** — relax $f_i$ toward equilibrium $f_i^{(eq)}$ by relaxation parameter $\omega$. Viscosity $= (1/\omega - 1/2)/3$; lower $\omega$ = thicker ink. (He–Luo *incompressible* variant used to minimise compressibility error.)
  - **Streaming** — push each $f_i$ to the neighbour along $\mathbf{e}_i$.
- Density $\rho = \sum_i f_i$ (how wet a cell is); velocity $\mathbf{u} = \frac{1}{\rho_0}\sum_i \mathbf{e}_i f_i$.

## The MoXi modifications — where the look comes from

This is the operational heart: the base LBE is plain fluid; these four local edits make it *ink*.

| Effect (see real-ink photos) | Mechanism |
|---|---|
| **Branching / impeded flow** | **Variable permeability** — a fractional *blocking factor* $\kappa$ per cell (from a paper-grain texture + procedural alum/catalyst dots), applied via **half-way bounce-back** during streaming. $\kappa$ averaged over the two linked cells to conserve momentum. |
| **Free wet–dry boundary** (marks that grow, not a fixed canvas) | **Advection modulation** — weight $\psi = \text{smoothstep}(0,\alpha,\rho)$ damps advection where density is low, preventing the unphysical negative densities a naive single-phase LBE produces. $0.2 \le \alpha \le 0.5$. |
| **Boundary roughening** (toes at the edge) | Local **pinning**: a dry cell whose wet neighbours are below threshold $\sigma$ gets $\kappa$ overwritten to fully block. $\sigma$ modulated by a *pinning texture* (sprinkled line segments) + glue + fixture accumulation. |
| **Boundary darkening** (dark rim as it dries) | **Uneven evaporation** — drop $\rho$ faster at pinned boundary cells; capillary loss there migrates pigment outward, darkening the rim. Same idea as Curtis's edge-darkening (Source: [[Shallow-Water Watercolor Simulation]]). |

## Three-layer paper model

Ink lives in three stacked fields, which gives wet/dry lifecycle:

1. **Surface** — ink reservoir freshly deposited by the brush.
2. **Flow** — where LBE percolation + pigment **advection** happen. Pigment carried by water; advected by **method of characteristics** (trace velocity backward, sample with hardware bilinear). A `SIMULATEHINDRANCE` step lerps new vs. old pigment by flow speed so fibres *hold back* pigment → feathery streaks.
3. **Fixture** — once dry, pigment transfers one-way into fixture (`SIMULATEFIXTURE`: transfer rate rises with dryness and glue). Dried ink can't be washed away — matching real ink.

> [!tip] Rendering trick worth stealing
> MoXi simulates at 512² but outputs at 1536² via **boundary trimming**: upscale the fixture-pigment texture, then trim interpolated pixels along an implicit curve $\phi$ derived from the peak-water-density field $\rho_\tau$, adding a roughening texture term. Sharp, organic edges at print resolution from a coarse sim — cheaper than simulating at full res.

## For the screensaver / generative-art use

- This is **dynamic-art priority #1** material: a self-running ink-bloom field is a natural [[screensaver]] motif (cf. the girih travelling-wave work).
- Ready-made LBE/fluid code to adapt rather than reinvent: see [[WebGL and WebGPU Fluid Simulation Libraries]] (CLAUDE.md: *generators lean on prior art*).
- If full LBE is overkill for an ambient saver, the cheaper substitute is [[Stable Fluids and GPU Ink Advection|Stam advection]] of a dye field, or [[Cellular Automata and Reaction-Diffusion|Gray–Scott reaction–diffusion]] for organic bleeding fronts (no momentum, but convincing edges).
- **Colour/rendering**: composite multiple pigment layers with [[Kubelka-Munk Optical Compositing]] for the luminous wash look rather than naive alpha-over.

## Related

- [[Shallow-Water Watercolor Simulation]] — the Western-watercolor sibling (Curtis): surface flow + capillary layer instead of porous LBE.
- [[Stable Fluids and GPU Ink Advection]] — the N–S alternative MoXi explicitly rejects for percolation but which dominates browser demos.
- [[Cellular Automata and Reaction-Diffusion]] — LBE is itself a lattice-cellular scheme; reaction–diffusion is the cheap cousin for bleeding edges.
- [[Kubelka-Munk Optical Compositing]] — pigment-layer rendering.

[^moxi]: Chu, N. S.-H. & Tai, C.-L. (2005). *MoXi: Real-Time Ink Dispersion in Absorbent Paper.* ACM SIGGRAPH 2005. PDF: http://visgraph.cse.ust.hk/MoXi/moxi.pdf · DOI: https://dl.acm.org/doi/10.1145/1073204.1073221
