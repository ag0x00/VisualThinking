---
title: Stable Fluids and GPU Ink Advection
type: concept
status: developing
tags: [concept, generative-art, fluid-simulation, navier-stokes, gpu, webgl, ink]
address: c-000235
created: 2026-06-21
sources: ["[[Stam - Stable Fluids]]"]
confidence: high
---

# Stable Fluids and GPU Ink Advection

**One-line:** Jos Stam's **Stable Fluids** (SIGGRAPH 1999) is the unconditionally-stable Navier–Stokes solver behind **almost every real-time "ink / dye in water" demo** on the web — you advect an ink **density field** through a fluid **velocity field** and render the density.[^stam] His later *Real-Time Fluid Dynamics for Games* (2003) is the implementable, grid-code version everyone ports.[^games]

## Why it dominates browser ink

Earlier explicit fluid solvers blow up unless the timestep is tiny. Stam's key move — **semi-Lagrangian advection** — is stable at *any* timestep, so interactive framerates are trivial. That stability, plus a small fixed set of grid passes, is why the [[WebGL and WebGPU Fluid Simulation Libraries|WebGL/WebGPU fluid repos]] all descend from it. For ambient generative art (a [[screensaver]], a music visualizer) it is the **default** ink engine: cheap, robust, beautiful.

## The four passes (per frame)

Velocity $\mathbf{u}$, pressure $p$, and a passive **ink/dye density** $d$ live on a grid (textures on GPU):

1. **Advect** — move each quantity backward along the velocity by one step (semi-Lagrangian: sample where the fluid *came from*, bilinear). Applies to both $\mathbf{u}$ (self-advection) and the ink $d$.
2. **Diffuse** — viscosity / dye spread, an implicit (Gauss–Seidel / Jacobi) solve.
3. **Add forces** — splat velocity + ink where the "brush"/emitter is (mouse, audio onset, scripted drops).
4. **Project** — subtract the pressure gradient so the field is **divergence-free** (incompressible). This is a **Poisson solve** (Jacobi iterations on GPU) — the one *global* step and the performance bottleneck.

The ink density is a **passive scalar**: it does nothing to the fluid, it just gets carried — so colour, multiple dyes, and emitters are cheap add-ons.

## Tradeoffs vs. Lattice Boltzmann

| | Stable Fluids (N–S) | [[Lattice Boltzmann Method for Ink Dispersion|Lattice Boltzmann]] |
|---|---|---|
| Global step | **Yes** — pressure Poisson solve (bottleneck on GPU) | **No** — fully local streaming/collision |
| Stability | unconditional (large timesteps) | conditional, but ink is slow so fine |
| Numerical dissipation | **high** — semi-Lagrangian smears detail (softens ink) | lower; preserves fine streaks |
| Porous-media / percolation | not native (free fluid) | native (the reason MoXi chose it) |
| Ecosystem | huge — most web demos | fewer ready ports |

**Rule of thumb:** free-flowing *ink-in-water / smoke* look → Stable Fluids. *Ink-into-absorbent-paper* look (feathery, branching, pinned edges) → [[Lattice Boltzmann Method for Ink Dispersion|LBM/MoXi]]. The semi-Lagrangian dissipation that hurts crisp paper edges actually *helps* the soft underwater-ink look.

## Cheaper substitutes when even this is too much

For a purely ambient saver you may not need a full pressure solve:
- **Curl-noise / flow-noise advection** — advect ink through a divergence-free noise field (no projection step). Convincing swirling ink for near-zero cost.
- **[[Cellular Automata and Reaction-Diffusion|Gray–Scott reaction–diffusion]]** — organic bleeding/branching fronts with no velocity field at all.
- **Domain-warped value noise + edge-darkening** — a static "ink blot" with a darkened rim, animated by warping the domain over time.

## For the project

- Directly serves **dynamic generative art (priority #1)** and the **music/sound visualizer (priority #4)** — splat ink on audio onsets (Meyda) into a Stable-Fluids field. See [[Audio-to-Visual Cross-Modal Mapping]].
- Don't reinvent: adapt [[WebGL and WebGPU Fluid Simulation Libraries|PavelDoGreat / kishimisu / loicmagne]] (CLAUDE.md prior-art rule).
- Render multi-dye washes through [[Kubelka-Munk Optical Compositing]] if a paper/paint look (not glowing dye) is wanted.

## Related

- [[Lattice Boltzmann Method for Ink Dispersion]] · [[Shallow-Water Watercolor Simulation]] · [[WebGL and WebGPU Fluid Simulation Libraries]] · [[Cellular Automata and Reaction-Diffusion]]

[^stam]: Stam, J. (1999). *Stable Fluids.* Proc. ACM SIGGRAPH 99, 121–128. https://www.dgp.toronto.edu/people/stam/reality/Research/pdf/ns.pdf
[^games]: Stam, J. (2003). *Real-Time Fluid Dynamics for Games.* GDC 2003. The grid-code "put a fluid solver in 60 lines" version that the WebGL ports follow.
