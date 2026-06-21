---
title: Shallow-Water Watercolor Simulation
type: concept
status: developing
tags: [concept, generative-art, fluid-simulation, watercolor, pigment, npr]
address: c-000234
created: 2026-06-21
sources: ["[[Curtis et al - Computer-Generated Watercolor]]"]
confidence: high
---

# Shallow-Water Watercolor Simulation

**One-line:** The canonical algorithm for **Western wet-on-wet / wet-on-dry watercolour** — Curtis, Anderson, Seims, Fleischer & Salesin, *Computer-Generated Watercolor* (SIGGRAPH 1997).[^curtis] A painting is an ordered stack of translucent **glazes**, each produced by a shallow-water fluid sim over a paper height-field, then composited optically with [[Kubelka-Munk Optical Compositing]].

## The model is empirical, not strict physics

Curtis is explicit: this is a *"minimal simulation"* in the Cockshott sense — it reproduces the **salient artistic effects** an artist would recognise (edge-darkening, backruns, granulation, glazing, drybrush), not a faithful CFD of water. That stance is the right one for art generation: target the *look*, keep it **predictable and controllable** (Source: [[Curtis et al - Computer-Generated Watercolor]]). Contrast with [[Lattice Boltzmann Method for Ink Dispersion|MoXi]], which is more physically grounded in porous-media percolation.

## Three coupled layers per glaze

Each glaze runs an independent fluid sim with three stacked fields over the paper:

1. **Shallow-water layer** — water moves on the paper *surface*, confined to a **wet-area mask** $M$ (where the brush wet the paper). Maintains a velocity field $(u,v)$ and pressure $p$; a relaxation/divergence step keeps flow plausible. A **paper height-field** $h$ (rough fibre texture) biases flow into the valleys. Outward velocity at the mask boundary is what drives **edge-darkening**.
2. **Pigment-deposition layer** — each pigment $g_k$ is **advected** by the surface velocity, and exchanges with the paper via **deposition** (settling out) and **lifting** (re-suspending). Per-pigment parameters set the character:
   - **density** $\rho$ — heavy pigments settle fast, travel less;
   - **staining power** $\omega$ — how strongly it adheres / resists lifting;
   - **granulation** $\gamma$ — settling into paper *valleys* → mottled texture (Figure 1d in the paper).
   Distinct pigments separate as they travel at different rates → **pigment separation**.
3. **Capillary layer** — water **diffuses into the paper** beyond the wet mask by capillarity (a separate diffusion field $s$ vs. paper capacity $c$). When this capillary water re-enters a damp painted region it pushes pigment along, producing branching **backruns** (Figure 1c) — the effect that needs the third layer.

## Effects and how each is produced

| Watercolour effect | Where it comes from |
|---|---|
| **Edge-darkening** | sizing + surface tension hold the mask edge fixed; as it dries, outward surface flow carries pigment to the rim and deposits it there. |
| **Backruns** (blooms) | capillary-layer water spreading back into damp paint, pushing pigment into branching fronts. |
| **Granulation / separation** | per-pigment density + granulation → settling into paper valleys; differing transport rates split mixed pigments. |
| **Drybrush** | brush wets only the *raised* paper cells (height-field threshold) → ragged, gappy stroke. |
| **Glazing** | layering independent dried glazes, composited by Kubelka–Munk → luminous, transparent build-up. |
| **Flow patterns** | velocity field over the height-field, like water finding valleys. |

## Implementation lineage and cost

- Descends from Small's cellular-automaton watercolour on the Connection Machine; Curtis adds the height-field paper, the richer shallow-water step, and K–M rendering.
- The original is an **offline** per-glaze simulation. Real-time follow-ups (van Laerhoven et al. 2004) use **semi-Lagrangian advection** ([[Stable Fluids and GPU Ink Advection|Stam 1999]]); modern GPU watercolour ports favour the **[[Lattice Boltzmann Method for Ink Dispersion|Lattice Boltzmann method]]** for the flow step (stability + locality) — see the [[Animated Ink Bleeding with CFD]] thread.
- Three published applications: an interactive paint system, automatic image **"watercolorization,"** and **NPR rendering** of 3-D scenes (Source: [[Curtis et al - Computer-Generated Watercolor]]).

## For generative-art / branding use

- **Watercolorization of an image** is directly useful for [[the four application priorities|branding & graphic-design assets]]: take a target image, assign pigments, run glazes → a controllable hand-painted treatment.
- The three-layer split is the reusable idea: **surface flow ⊕ pigment exchange ⊕ capillary backrun** is a transferable decomposition for any wet medium (gouache, ink-wash).
- Adapt prior art rather than rebuild — [[WebGL and WebGPU Fluid Simulation Libraries]] supply the shallow-water/advection core.

## Related

- [[Lattice Boltzmann Method for Ink Dispersion]] — the Eastern-ink sibling; porous percolation rather than surface shallow-water.
- [[Kubelka-Munk Optical Compositing]] — the optical model that makes the glazes look like watercolour, not decals.
- [[Stable Fluids and GPU Ink Advection]] — the advection scheme that makes Curtis real-time.
- [[Cellular Automata and Reaction-Diffusion]] — Small's CA ancestor; cheap bleeding-edge substitute.

[^curtis]: Curtis, C., Anderson, S., Seims, J., Fleischer, K. & Salesin, D. (1997). *Computer-Generated Watercolor.* Proc. ACM SIGGRAPH 97, 421–430. PDF: https://grail.cs.washington.edu/projects/watercolor/paper_small.pdf · Patent: https://patents.google.com/patent/US6198489B1/en
