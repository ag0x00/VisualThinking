---
address: c-000239
title: "Curtis et al. — Computer-Generated Watercolor"
type: source
source_type: paper
author: "Cassidy J. Curtis; Sean E. Anderson; Joshua E. Seims; Kurt W. Fleischer; David H. Salesin"
date_published: 1997
venue: ACM SIGGRAPH 97
url: https://grail.cs.washington.edu/projects/watercolor/paper_small.pdf
status: developing
confidence: high
tags: [source, fluid-simulation, watercolor, pigment, kubelka-munk, npr]
key_claims:
  - "A watercolour painting is an ordered stack of translucent glazes, each a shallow-water fluid sim"
  - "Three coupled layers — shallow-water, pigment-deposition, capillary — produce edge-darkening, backruns, granulation"
  - "Kubelka-Munk optical compositing gives the luminous transparency of layered glazes"
---

# Curtis et al. — Computer-Generated Watercolor

**Citation:** Curtis, C., Anderson, S., Seims, J., Fleischer, K. & Salesin, D. (1997). *Computer-Generated Watercolor.* Proc. ACM SIGGRAPH 97, 421–430. PDF: https://grail.cs.washington.edu/projects/watercolor/paper_small.pdf · Patent [US6198489B1](https://patents.google.com/patent/US6198489B1/en).

## What it contributes

The **canonical Western-watercolour algorithm** and the reference for **wet-on-wet / wet-on-dry** painting. Explicitly an **empirical "minimal simulation"** — it targets the artistic effects an artist recognises, kept predictable and controllable, not strict CFD. Detailed in [[Shallow-Water Watercolor Simulation]].

## Key claims (confidence: high)

- **Glaze stack.** A painting = ordered translucent glazes; each glaze is an independent **shallow-water fluid simulation** over a rough paper height-field.
- **Three coupled layers** per glaze: **shallow-water** (surface velocity/pressure inside a wet mask), **pigment-deposition** (advection + deposition/lifting per pigment, governed by density, staining power, granulation), **capillary** (water diffusing into paper → backruns).
- **Effects reproduced:** edge-darkening, intentional backruns, granulation, pigment separation, drybrush, glazing, flow patterns (their Figure 1).
- **Rendering:** [[Kubelka-Munk Optical Compositing|Kubelka–Munk]] two-constant model composites the glazes optically over white paper → luminous transparency.
- **Three applications:** interactive paint system, automatic image *watercolorization*, NPR rendering of 3-D scenes.

## Lineage

Builds on Small's cellular-automaton watercolour (Connection Machine); adds the paper height-field, richer shallow-water step, and K–M rendering. Made real-time by later work via [[Stam - Stable Fluids|semi-Lagrangian advection]] and, more recently, the [[Lattice Boltzmann Method for Ink Dispersion|Lattice Boltzmann method]].

## Related

- [[Shallow-Water Watercolor Simulation]] · [[Kubelka-Munk Optical Compositing]] · [[Chu Tai - MoXi Real-Time Ink Dispersion]] · [[Research - Ink and Watercolor Simulation on Paper]]
