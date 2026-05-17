---
title: OKLCH
type: concept
aliases: [Oklab, Ok Lab, oklch, oklab]
tags: [concept, color, perception, computational-aesthetics]
status: developing
address: c-000016
created: 2026-05-16
updated: 2026-05-16
---

# OKLCH

> A modern perceptual color space, designed by **Björn Ottosson** in 2020 specifically for image processing. Oklab is the Cartesian form ($L, a, b$); OKLCH is the polar form ($L, C, h$). Now standard in CSS Color 4/5, Photoshop gradients, Unity, Godot, and the design-system layer of major tools (Source: [[Bottosson - Oklab Color Space]]).

OKLCH is to [[The Munsell and CIELAB Color Systems|CIELAB]] roughly what CIELAB was to RGB: a coordinate system that fixes specific perceptual problems while keeping the math tractable. It's the current best default for digital color work.

## Why it exists

CIELAB (1976) is *approximately* perceptually uniform. Three problems that motivated Oklab:

1. **Blue hue rotation.** Constant-CIELAB-hue colors *visibly* shift toward purple in the blue region.
2. **Lightness errors.** CIELAB's lightness prediction breaks down for highly saturated colors (especially saturated yellows look much lighter than CIELAB says).
3. **Bad blending.** Mixing colors in CIELAB produces shifts through unwanted intermediate hues — a white-to-blue gradient passes through purple.

Ottosson tested the major perceptual spaces — CIELAB, CIELUV, CIECAM02-UCS, CAM16-UCS, OSA-UCS, IPT, JzAzBz, HSV — against three datasets (lightness pairs, chroma pairs, hue pairs). Oklab was derived to match the best of CAM16-UCS on uniformity while keeping the simple IPT-style computational structure (Source: [[Bottosson - Oklab Color Space]]).

## The transform

From CIE XYZ (D65 whitepoint, Y=1), Oklab is a three-step pipeline:

1. **Linear cone-response approximation.** $XYZ \to (l, m, s)$ via a $3 \times 3$ matrix $M_1$ (LMS-like, but not exactly).
2. **Non-linearity.** $(l, m, s) \to (l', m', s') = (l^{1/3}, m^{1/3}, s^{1/3})$. (Note: a cube root, not a power 2.2 sRGB-style.)
3. **Linear transform to opponent axes.** $(l', m', s') \to (L, a, b)$ via $M_2$.

Polar form:
$$C = \sqrt{a^2 + b^2}, \quad h = \mathrm{atan2}(b, a)$$

The matrices $M_1, M_2$ are derived to minimize CIEDE2000 error against the three datasets — Oklab is *trained* to match human perception experiments. (Source: [[Bottosson - Oklab Color Space]] for exact matrix values.)

The forward and inverse transforms together are ~20 floating-point operations. From linear sRGB, the entire pipeline is ~15 ops.

## Comparison with predecessors

Lower is better (RMS color-difference error, ΔE on test datasets):

| Property | Oklab | CIELAB | CIELUV | CAM16-UCS | HSV |
|---|---|---|---|---|---|
| Lightness pairs | **0.20** | 1.70 | 1.72 | 0.00* | 11.59 |
| Chroma pairs | **0.81** | 1.84 | 2.32 | 0.00* | 3.38 |
| Hue pairs | 0.49 | 0.69 | 0.68 | 0.59 | 1.10 |

*CAM16-UCS scores 0 on its own training data; not directly comparable. Source: [[Bottosson - Oklab Color Space]].*

Bottom line: Oklab is comparable to or better than CIELAB on every axis, comparable to CAM16-UCS while being much simpler, and dramatically better than HSV (which fails on every dimension).

## OKLCH vs OKLAB

In practice, design tools and CSS expose **OKLCH** — the polar (lightness, chroma, hue) form — rather than OKLAB. Reasons:
- Hue angle is the natural parameter for harmony rules ([[Color Harmony]]).
- Chroma is the natural parameter for saturation.
- $L$ alone is the lightness; useful for accessibility checks.

Conversions are cheap and exact. Most code paths internally use Oklab and expose OKLCH at the API boundary.

## Adoption

Specs and tools using Oklab/OKLCH as of 2024–2026:

- **CSS Color Level 4** — `oklab()` and `oklch()` are first-class color functions; supported in all major browsers.
- **CSS Color Level 5** — color-mix and gradient interpolation default to OKLCH-equivalent spaces where applicable.
- **Adobe Photoshop** — default gradient interpolation.
- **Unity, Godot** — color picker / gradient.
- **Major design systems** — Tailwind v4, Radix Colors, Apple HIG color guidance, Material 3 (via HCT, an adjacent space).

## Programmable form

Treat OKLCH as the **default color space for new code**. Convert sRGB → linear sRGB → Oklab → OKLCH at input; manipulate; convert back at output:

```
sRGB ──(gamma decode)──→ linear sRGB ──(M_1)──→ LMS ──(cbrt)──→ L'M'S' ──(M_2)──→ Oklab ──→ OKLCH
```

Libraries: `culori` (JS, full Oklab/OKLCH), `colour-science` (Python), `chroma.js` (JS, partial — Oklab through `chroma.oklab()`), [reference C code in the Oklab blog post] (public domain / MIT).

## Why it matters for this vault

OKLCH is **the current best default** for any programmable color operation:

- For an LLM critic asked to evaluate "do these colors work together?", OKLCH gives the cleanest reduction: hue distance, lightness contrast, chroma matching — all in well-behaved coordinates.
- For palette generation, sampling uniformly in OKLCH produces visibly uniform palettes.
- For gradient interpolation, OKLCH interpolation avoids the "muddy middle" that RGB/HSV produce.
- For accessibility checks, OKLCH's $L$ axis is more meaningful than HSL's lightness; combine with [[WCAG Contrast Ratios]] for final go/no-go on text contrast.

## To research

- The Oklab → OKLCH gamut-mapping problem (chroma clipping vs. lightness adjustment). Active research, no single accepted approach.
- HCT (Material 3) as a parallel modern perceptual space — what does it do differently?
- Practical OKLCH ΔE thresholds for JND, "harmonious," "distinct" — equivalents of the CIEDE2000 thresholds in [[CIEDE2000]].

## Related
[[The Munsell and CIELAB Color Systems]] · [[CIEDE2000]] · [[Color Harmony]] · [[WCAG Contrast Ratios]] · [[Bottosson - Oklab Color Space]]
