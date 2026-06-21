---
title: Kubelka-Munk Optical Compositing
type: concept
status: developing
tags: [concept, color, pigment, rendering, watercolor, optical-compositing]
address: c-000236
created: 2026-06-21
sources: ["[[Curtis et al - Computer-Generated Watercolor]]"]
confidence: high
---

# Kubelka-Munk Optical Compositing

**One-line:** A two-constant optical model that turns a layer of pigment into **reflectance + transmittance** from its **absorption $K$** and **scattering $S$** coefficients and **thickness** — the reason simulated [[Shallow-Water Watercolor Simulation|watercolour]] glazes look *luminous and transparent* instead of like stacked stickers.[^km][^wiki]

## The problem it solves

Naive **alpha-over compositing** treats paint as opaque colour with coverage. Real pigment is **translucent**: light passes *through* a glaze, reflects off lower layers and the paper, and passes back *out* — absorbed and scattered along the way. Stacking two glazes is therefore an **optical** operation, not a blend. Kubelka–Munk (K–M) captures this, giving the characteristic watercolour build-up where a yellow glaze over blue reads as a glowing green, and white paper shows through as light (Source: [[Curtis et al - Computer-Generated Watercolor]]).

## The model

Each pigment is described **per channel** (RGB, or per-wavelength for accuracy) by two constants:

- **$K$ — absorption coefficient** (how much light it eats),
- **$S$ — scattering coefficient** (how much it bounces back).

From $K$, $S$ and a layer **thickness** $x$, K–M gives that layer's **reflectance $R$** and **transmittance $T$** (closed-form hyperbolic expressions). For an infinitely thick layer the reflectance reduces to the well-known
$$R_\infty = 1 + \frac{K}{S} - \sqrt{\left(\frac{K}{S}\right)^2 + 2\frac{K}{S}}.$$
The ratio $K/S$ is the workhorse — mixing pigments mixes their $K$ and $S$ (weighted by concentration), and $K/S$ predicts the resulting colour.

## Compositing a stack of glazes

Layers are combined with the **optical-compositing recurrence** (a.k.a. the "two-flux" / Kubelka layering equations). For a glaze with reflectance $R$, transmittance $T$ over a substrate of reflectance $R_0$:
$$R_{\text{total}} = R + \frac{T^2 R_0}{1 - R\,R_0},\qquad T_{\text{total}} = \frac{T\,T_0}{1 - R\,R_0}.$$
The $\frac{1}{1 - R R_0}$ term is **inter-reflection** between layer and substrate — the physical source of the luminous depth. Curtis et al. composite their ordered watercolour glazes this way over the white-paper reflectance.

## Why it earns a wiki page (transferable, taste-free)

Per CLAUDE.md's toolkit boundary, a measurement/operator belongs in core when its **property is transferable across unrelated mediums**. K–M qualifies:

- It is the standard model in **paint/coatings/textile/print colour science** (computing dye recipes, paper colour). Not watercolour-specific.
- Reusable for **any pigment medium** the project might generate — gouache, oil glazing, ink wash, even procedural "stained-glass"/cuerda-seca looks where a translucent layer sits over a substrate.
- It is a **rendering operator** (measures/transforms pixels), not a taste setting — exactly the bias-safe kind of thing to centralise. The *choice of pigments* is the taste (project profile); the K–M math is neutral.

> [!gap] Coefficients need calibration
> $K$ and $S$ per pigment are not given by the colour you want — they are fit from measured paint samples (or hand-tuned). For generative use, a small palette of hand-picked $(K,S)$ pairs is enough; the [[Pigmento - Pigment-Based Image Analysis|Pigmento]] line of work recovers them from images. (Confidence: medium — calibration detail not yet read in depth.)

## For the project

- Pairs with [[Shallow-Water Watercolor Simulation]] and [[Lattice Boltzmann Method for Ink Dispersion]] as the **render** stage after the **flow** stage.
- Connects to the colour spine: [[The Munsell and CIELAB Color Systems]], [[OKLCH Pair-Relation Classifier]] — K–M is the *physical* colour-mixing model, complementary to perceptual spaces.

## Related

- [[Shallow-Water Watercolor Simulation]] · [[Lattice Boltzmann Method for Ink Dispersion]] · [[Stable Fluids and GPU Ink Advection]]
- [[Research - Color Systems]] — perceptual vs. physical colour models.

[^km]: Kubelka, P. & Munk, F. (1931). *Ein Beitrag zur Optik der Farbanstriche.* The original two-flux theory. Used for optical compositing in Curtis et al. (1997), https://grail.cs.washington.edu/projects/watercolor/paper_small.pdf
[^wiki]: Kubelka–Munk theory overview: https://en.wikipedia.org/wiki/Kubelka%E2%80%93Munk_theory
