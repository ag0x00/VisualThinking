---
type: synthesis
title: "Research - Ink and Watercolor Simulation on Paper"
tags: [research, generative-art, fluid-simulation, ink, watercolor]
status: developing
address: c-000242
created: 2026-06-21
updated: 2026-06-21
related:
  - "[[Lattice Boltzmann Method for Ink Dispersion]]"
  - "[[Shallow-Water Watercolor Simulation]]"
  - "[[Stable Fluids and GPU Ink Advection]]"
  - "[[Kubelka-Munk Optical Compositing]]"
  - "[[WebGL and WebGPU Fluid Simulation Libraries]]"
  - "[[Cellular Automata and Reaction-Diffusion]]"
sources:
  - "[[Chu Tai - MoXi Real-Time Ink Dispersion]]"
  - "[[Curtis et al - Computer-Generated Watercolor]]"
  - "[[Stam - Stable Fluids]]"
  - "[[Animated Ink Bleeding with CFD]]"
---

# Research - Ink and Watercolor Simulation on Paper

## Overview

Realistic **ink-applied-to-paper** animation is a solved problem with three well-established algorithm families, distinguished by the *physical look* they target. The dominant insight (Source: [[Chu Tai - MoXi Real-Time Ink Dispersion]]): ink-into-paper is **porous-media percolation**, not simple diffusion — plain Fick/Gaussian blur cannot make the feathery, branching, edge-darkened patterns that read as real ink. Choose the algorithm by the look you want, then render pigment layers with [[Kubelka-Munk Optical Compositing|Kubelka–Munk]], and **adapt prior-art code** rather than building a solver from scratch.

## Key Findings

- **The look picks the algorithm — a clean decision rule:**
  - *Ink-into-absorbent-paper* (sumi-e: feathery, branching, pinned/darkened edges) → **[[Lattice Boltzmann Method for Ink Dispersion|Lattice Boltzmann / MoXi]]** (Source: [[Chu Tai - MoXi Real-Time Ink Dispersion]]).
  - *Western watercolour* (wet-on-wet, backruns, granulation, glazing) → **[[Shallow-Water Watercolor Simulation|shallow-water three-layer / Curtis]]** (Source: [[Curtis et al - Computer-Generated Watercolor]]).
  - *Free ink-in-water / smoke* (swirling, soft) → **[[Stable Fluids and GPU Ink Advection|Stable Fluids / Stam]]** advecting a dye field (Source: [[Stam - Stable Fluids]]).
- **LBM vs. Navier–Stokes is the central engineering tradeoff.** LBM is local and **Poisson-free** → GPU-native, preserves fine ink streaks, native to porous media. Stable Fluids needs a global pressure solve and its semi-Lagrangian advection is **dissipative** (smears detail — softens ink) but has by far the largest ready-made codebase (Source: [[Chu Tai - MoXi Real-Time Ink Dispersion]]; [[Stam - Stable Fluids]]).
- **Layered architecture is shared across methods:** a **flow** stage (move water) ⊕ a **pigment** stage (advect + deposit/lift, with per-pigment density/staining/granulation) ⊕ a **dry/fixture** stage. MoXi's surface/flow/fixture and Curtis's shallow-water/pigment/capillary are the same decomposition.
- **Edge-darkening and backruns are emergent, not painted on** — they fall out of outward boundary flow + uneven evaporation (MoXi) or capillary re-entry (Curtis). This is why a physical sim beats a hand-faked blur.
- **Rendering is optical, not alpha-over.** [[Kubelka-Munk Optical Compositing|Kubelka–Munk]] (absorption $K$ + scattering $S$ per layer) gives watercolour's luminous transparency; naive blending looks like stacked decals.
- **LBM is still current** — a 2024 paper drives ink bleeding with LBM via the TCLB framework (Source: [[Animated Ink Bleeding with CFD]]).
- **Cheap substitutes exist for ambient art:** curl-noise advection (no projection), [[Cellular Automata and Reaction-Diffusion|Gray–Scott reaction–diffusion]] for organic bleeding fronts, or domain-warped noise + edge-darkening for a static blot. Use when a full sim is overkill for a [[screensaver]].

## Key Concepts

- [[Lattice Boltzmann Method for Ink Dispersion]] — real-time porous-media ink percolation (MoXi).
- [[Shallow-Water Watercolor Simulation]] — three-layer Western watercolour (Curtis).
- [[Stable Fluids and GPU Ink Advection]] — Stam's stable N–S solver; the browser default.
- [[Kubelka-Munk Optical Compositing]] — translucent pigment-layer rendering.
- [[WebGL and WebGPU Fluid Simulation Libraries]] — prior-art code to adapt.

## How this maps to the project

- **Priority #1 (dynamic generative art):** a self-running ink-bloom field is a natural [[screensaver]] motif alongside the girih travelling-wave work. Recommended first build: adapt a [[WebGL and WebGPU Fluid Simulation Libraries|Stable-Fluids repo]] for an ambient ink-in-water saver (lowest effort), then layer MoXi modifications if the *paper* look is wanted.
- **Priority #4 (music visualizer):** splat ink/velocity on audio onsets into a Stable-Fluids field — see [[Audio-to-Visual Cross-Modal Mapping]].
- **Branding / graphic design (priorities #2–3):** Curtis-style **image watercolorization** turns a target image into a controllable hand-painted treatment.
- **Boundary discipline (CLAUDE.md):** the *flow/pigment/render* operators are transferable spine; the *pigment palette and paper params* are taste → project profile. Reuse [[WebGL and WebGPU Fluid Simulation Libraries|existing solvers]]; don't reinvent.

## Contradictions

- **None substantive.** MoXi critiques Curtis (fixed wet–dry boundary can't evolve ink-mark shape; loosely-coupled surface/capillary layers) — a *scope* difference (Eastern porous ink vs. Western surface watercolour), not a factual conflict. Both are widely cited and validated.

## Open Questions

- **No MoXi-grade LBM ink-on-paper JS/WebGL library surfaced.** The browser repos ([[WebGL and WebGPU Fluid Simulation Libraries]]) are all Navier–Stokes/SPH, not porous LBM. A faithful sumi-e generator is **build-from-paper** (MoXi's four modifications on a D2Q9 LBM) or a port of TCLB. Per the [[feedback_implementation-in-sweeps|reading-only sweep rule]], JS implementation is deferred until after the tools sweep.
- **Kubelka–Munk coefficient calibration** ($K,S$ per pigment) not read in depth — Pigmento-line work recovers them from images; for generative use a small hand-tuned palette likely suffices. (Confidence: medium.)
- **[[Animated Ink Bleeding with CFD|The 2024 LBM ink-bleeding paper]]** read only at abstract level — real-time vs. offline, and the TCLB pipeline, need a full read.
- **3-D / volumetric ink** (Blender Mantaflow ink-drop tutorials) noted but out of scope here (offline render, not algorithmic real-time).

## Sources

- [[Chu Tai - MoXi Real-Time Ink Dispersion]] — Chu & Tai, SIGGRAPH 2005 (LBM ink percolation).
- [[Curtis et al - Computer-Generated Watercolor]] — Curtis et al., SIGGRAPH 1997 (shallow-water watercolour + K–M).
- [[Stam - Stable Fluids]] — Stam, SIGGRAPH 1999 (stable N–S; the browser-fluid foundation).
- [[Animated Ink Bleeding with CFD]] — 2024, LBM via TCLB (recency check).
