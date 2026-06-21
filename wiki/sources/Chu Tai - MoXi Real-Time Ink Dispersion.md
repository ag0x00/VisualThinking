---
address: c-000238
title: "Chu & Tai — MoXi: Real-Time Ink Dispersion in Absorbent Paper"
type: source
source_type: paper
author: "Nelson S.-H. Chu; Chiew-Lan Tai"
date_published: 2005
venue: ACM SIGGRAPH 2005
url: http://visgraph.cse.ust.hk/MoXi/moxi.pdf
status: developing
confidence: high
tags: [source, fluid-simulation, ink, lattice-boltzmann, sumi-e, gpu]
key_claims:
  - "Lattice Boltzmann Equation simulates ink percolation in paper in real time without a Poisson solve"
  - "Four LBE modifications (variable permeability, advection modulation, pinning, uneven evaporation) produce feathery/branching/roughened/darkened ink effects"
  - "Three-layer paper model (surface/flow/fixture) gives the wet→dry pigment lifecycle"
---

# Chu & Tai — MoXi: Real-Time Ink Dispersion in Absorbent Paper

**Citation:** Chu, N. S.-H. & Tai, C.-L. (2005). *MoXi: Real-Time Ink Dispersion in Absorbent Paper.* ACM SIGGRAPH 2005. DOI [10.1145/1073204.1073221](https://dl.acm.org/doi/10.1145/1073204.1073221). PDF: http://visgraph.cse.ust.hk/MoXi/moxi.pdf

## What it contributes

The **founding real-time algorithm** for Eastern ink-wash (sumi-e / 水墨) dispersion. Establishes that ink-on-paper is **porous-media percolation**, not Fickian diffusion, and that the **Lattice Boltzmann Equation** is the right GPU-friendly solver because it is local and Poisson-free. Detailed in [[Lattice Boltzmann Method for Ink Dispersion]].

## Key claims (confidence: high)

- **LBE over Navier–Stokes for percolation.** No Poisson solve, all-local ops, easy to add physics; weak compressibility is acceptable because ink flows slowly. (D2Q9 lattice, He–Luo incompressible variant, viscosity $=(1/\omega-1/2)/3$.)
- **The look = four local modifications** to base LBE: variable **permeability** (blocking factor $\kappa$, half-way bounce-back), **advection modulation** ($\psi=\text{smoothstep}$ to avoid negative density), boundary **pinning** (roughening/toes), **uneven evaporation** (edge darkening).
- **Three-layer paper model** — surface (reservoir) → flow (LBE + pigment advection by method of characteristics + hindrance) → fixture (one-way dry deposition).
- **Boundary trimming** renders 512² sim at 1536² with sharp organic edges via an implicit curve over peak-density $\rho_\tau$.
- **Performance:** 512² sim, output 1536², ~44 fps on a GeForce 6800 (2005). Real-time by a wide margin today.

## Where it sits

Improves on Guo–Kunii (1-D filtering / Fick PDE — blurry only) and on [[Curtis et al - Computer-Generated Watercolor|Curtis et al. 1997]] (whose fixed wet–dry boundary can't evolve ink-mark shape, and whose surface/capillary layers are only loosely coupled). The Eastern-ink counterpart to Curtis's Western watercolour.

## Related

- [[Lattice Boltzmann Method for Ink Dispersion]] · [[Curtis et al - Computer-Generated Watercolor]] · [[Stam - Stable Fluids]] · [[Research - Ink and Watercolor Simulation on Paper]]
