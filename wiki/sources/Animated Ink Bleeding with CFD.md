---
address: c-000241
title: "Animated Ink Bleeding with Computational Fluid Dynamics"
type: source
source_type: paper
date_published: 2024
venue: ACM (SIGGRAPH-track)
url: https://dl.acm.org/doi/pdf/10.1145/3641234.3671060
status: developing
confidence: medium
tags: [source, fluid-simulation, ink, lattice-boltzmann, animation]
key_claims:
  - "Ink-bleeding animation can be driven by a Lattice Boltzmann Method CFD solver (TCLB framework)"
  - "LBM remains the favoured method for ink/watercolour flow due to efficiency and stability"
---

# Animated Ink Bleeding with Computational Fluid Dynamics

**Citation:** *Animated Ink Bleeding with Computational Fluid Dynamics* (2024). ACM, [10.1145/3641234.3671060](https://dl.acm.org/doi/pdf/10.1145/3641234.3671060).

## What it contributes

A **recent (2024)** data point confirming that the [[Lattice Boltzmann Method for Ink Dispersion|Lattice Boltzmann Method]] is still the preferred solver for ink/watercolour bleeding ~20 years after [[Chu Tai - MoXi Real-Time Ink Dispersion|MoXi]]. Runs simulations with a numerical scheme based on **LBM**, implemented in the **TCLB** open-source framework.

> [!gap] Not read in full
> Surfaced via search; abstract/snippet only. The TCLB-based pipeline, parameters, and whether it targets real-time or offline rendering need a full read. (Confidence: medium.)

## Why it matters here

- Corroborates the **"LBM for porous/ink flow, Stable Fluids for free ink-in-water"** split that organises [[Research - Ink and Watercolor Simulation on Paper]].
- TCLB is a reusable LBM engine — a possible prior-art base for a paper-ink generator (vs. the JS fluid repos in [[WebGL and WebGPU Fluid Simulation Libraries]], which are N–S, not porous LBM).

## Related

- [[Lattice Boltzmann Method for Ink Dispersion]] · [[Research - Ink and Watercolor Simulation on Paper]]
