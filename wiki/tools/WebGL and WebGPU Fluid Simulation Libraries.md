---
address: c-000237
title: WebGL and WebGPU Fluid Simulation Libraries
type: tool
status: developing
tags: [tools, fluid-simulation, webgl, webgpu, ink, generative-art, prior-art]
created: 2026-06-21
updated: 2026-06-21
verdict: first-class
---

# WebGL and WebGPU Fluid Simulation Libraries

**One-line purpose:** Ready-made, browser-native fluid/ink solvers to **adapt rather than reinvent** when building ink-on-paper or ink-in-water visuals. Per CLAUDE.md — *generators lean on prior art; the wiki points to the ready-made implementations.*

## Why this matters for the wiki

Ink animation is **dynamic generative art (priority #1)** and feeds the **music visualizer (priority #4)**. All of these implement [[Stable Fluids and GPU Ink Advection|Stam's Stable Fluids]] (or SPH) on the GPU; the differences are API (WebGL/WebGPU/Unity), code size, and how easy the **ink/dye field** is to splat. Building a fluid solver from scratch is both wasted effort and a bias magnet — start from one of these.

## The landscape

| Repo | Stack | Method | Use it for |
|---|---|---|---|
| **PavelDoGreat / WebGL-Fluid-Simulation** | WebGL | Stable Fluids | **Default pick.** The famous "splat colourful ink and watch it swirl" demo. Drop-in, configurable, dye-first. Most-forked. |
| **amandaghassaei / FluidSimulation** | WebGL | grid-particle Navier–Stokes | Best **learning** reference — clean, well-documented "real-time ink simulation." |
| **kishimisu / WebGPU-Fluid-Simulation** | WebGPU | Stam's *Real-Time Fluid Dynamics for Games* | Modern **WebGPU** path; good compute-shader template. |
| **loicmagne / webgl2_fluidsim** | WebGL2 | Stable Fluids | **Minimal** (~500 LOC) — easiest to read end-to-end and modify. |
| **jeantimex / fluid** | WebGPU | SPH (smoothed-particle) | Particle (Lagrangian) rather than grid — different look; droplets/splashes. |
| **keijiro / StableFluids** | Unity / HLSL | Stable Fluids | If targeting a native/Unity saver instead of WebView. |

## Verdict for this project

- **First-class** for the screensaver / visualizer: WebView `.saver` + WebGL is the project's default stack, and PavelDoGreat or loicmagne adapt cleanly.
- These give the **flow** stage. They do **not** give the *ink-into-absorbent-paper* look — for feathery/branching/pinned-edge sumi-e you need the [[Lattice Boltzmann Method for Ink Dispersion|LBM/MoXi]] modifications layered on top, and the paper/paint look wants [[Kubelka-Munk Optical Compositing]] rendering rather than additive dye.
- No published *MoXi-grade LBM ink-on-paper* JS library surfaced — that part is **build-from-paper** (see [[Research - Ink and Watercolor Simulation on Paper]] open questions).

## Related

- [[Stable Fluids and GPU Ink Advection]] — the algorithm these implement.
- [[Lattice Boltzmann Method for Ink Dispersion]] · [[Shallow-Water Watercolor Simulation]] — the paper-medium models to graft on.
- [[three.js]] · [[AI Art Toolkit Map]] — surrounding stack.
