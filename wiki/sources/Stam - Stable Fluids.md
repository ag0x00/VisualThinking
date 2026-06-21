---
address: c-000240
title: "Stam — Stable Fluids"
type: source
source_type: paper
author: "Jos Stam"
date_published: 1999
venue: ACM SIGGRAPH 99
url: https://www.dgp.toronto.edu/people/stam/reality/Research/pdf/ns.pdf
status: developing
confidence: high
tags: [source, fluid-simulation, navier-stokes, semi-lagrangian, gpu]
key_claims:
  - "Semi-Lagrangian advection makes a Navier-Stokes fluid solver unconditionally stable at any timestep"
  - "A passive ink/dye density advected through the velocity field gives real-time ink-in-water"
  - "The method underlies almost all WebGL/WebGPU browser fluid-ink demos"
---

# Stam — Stable Fluids

**Citation:** Stam, J. (1999). *Stable Fluids.* Proc. ACM SIGGRAPH 99, 121–128. PDF: https://www.dgp.toronto.edu/people/stam/reality/Research/pdf/ns.pdf · Practitioner version: *Real-Time Fluid Dynamics for Games* (GDC 2003).

## What it contributes

The **foundational real-time fluid solver** of computer graphics, and the engine behind essentially every browser "ink/dye in water" demo. Its semi-Lagrangian advection is **unconditionally stable**, so interactive framerates need no tiny timesteps. Detailed in [[Stable Fluids and GPU Ink Advection]].

## Key claims (confidence: high)

- **Semi-Lagrangian advection** (trace backward, interpolate) is stable for any timestep — the core contribution.
- **Four passes:** advect → diffuse → add forces → **project** (Poisson solve for a divergence-free, incompressible field).
- **Ink as a passive scalar:** a dye density field advected by the velocity gives cheap, colourful ink; multiple dyes and emitters are trivial add-ons.
- **Cost note:** the projection (pressure Poisson) is the one *global* step and the GPU bottleneck — which is precisely why [[Chu Tai - MoXi Real-Time Ink Dispersion|MoXi]] chose the Poisson-free [[Lattice Boltzmann Method for Ink Dispersion|Lattice Boltzmann]] method for paper percolation.
- **Tradeoff:** semi-Lagrangian advection is **dissipative** — it smears fine detail. This *softens* ink (good for the underwater look, bad for crisp paper edges).

## Related

- [[Stable Fluids and GPU Ink Advection]] · [[WebGL and WebGPU Fluid Simulation Libraries]] · [[Lattice Boltzmann Method for Ink Dispersion]] · [[Research - Ink and Watercolor Simulation on Paper]]
