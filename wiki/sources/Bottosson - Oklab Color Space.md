---
title: "Bottosson - A perceptual color space for image processing (Oklab)"
type: source
source_type: primary-blog-post
author: Björn Ottosson
publisher: bottosson.github.io (author's personal site)
date_published: 2020-12-23
date_updated_intro: 2025
date_retrieved: 2026-05-16
url: https://bottosson.github.io/posts/oklab/
license: "Public domain / MIT (code)"
confidence: high
status: developing
tags: [source, color, oklch, perception, primary-research]
address: c-000021
created: 2026-05-16
---

# Bottosson — A Perceptual Color Space for Image Processing (Oklab)

## Summary

The **primary source** for the Oklab color space (and its polar form OKLCH). Björn Ottosson's 2020 blog post introducing Oklab — derivation, motivation, exact matrix values, reference C++ implementation, and comparison plots against CIELAB, CIELUV, OSA-UCS, IPT, JzAzBz, HSV, and CAM16-UCS. Updated in 2025 with adoption notes (Photoshop, CSS Color 4/5, Unity, Godot). The blog post is both the design rationale and the canonical implementation reference.

## What it contributes

- **Exact $M_1$ and $M_2$ matrices** (updated 2021-01-25) for the XYZ → Oklab transform.
- **Reference C++ implementation** for linear sRGB ↔ Oklab, released to public domain (also available under MIT).
- The **comparison methodology** for evaluating perceptual color spaces: three datasets (lightness pairs, chroma pairs, hue pairs) with CIEDE2000-based error computation.
- **Quantitative comparison** of Oklab against CIELAB, CIELUV, CAM16-UCS, OSA-UCS, IPT, JzAzBz, HSV — RMS and 95th-percentile error for each space, on each dataset.
- **Munsell renotation plots** showing visually that Oklab and CAM16-UCS approximate the Munsell rings as near-circles while CIELAB and HSV visibly distort them.
- **Blending plots** showing the hue-shift problem in CIELAB blue→white gradients (passes through purple) and Oklab's smoother behavior.
- The **2025 industry-adoption update** documenting use in Photoshop (default gradient interpolation), CSS Color Level 4 and 5, Unity, Godot.

## Key claims

- **high** Oklab was derived to combine the perceptual uniformity of CAM16-UCS with the computational structure of IPT (simple, scale-invariant, differentiable).
- **high** Oklab achieves the lowest error on lightness and chroma datasets and second-lowest (after JzAzBz) on hue, on the test methodology described.
- **high** Test data: lightness/chroma pairs generated using CAM16 under normal viewing conditions and limited to Pointer's Gamut; hue data from Ebner-Fairchild experimental hue pairs.
- **high** Matrix values are exactly specified; reference C++ implementation matches them.
- **high** Adoption (as of 2025): CSS Color Level 4 and 5; Adobe Photoshop default gradient interpolation; Unity gradients; Godot color picker.
- **high** The non-linearity in the Oklab transform is a **cube root** (γ = 1/3), not the sRGB-style 2.4 exponent.
- **high** Oklab assumes a D65 whitepoint (matches sRGB, rec2020, Display P3).
- **medium** "Oklab gets to roughly CAM16-UCS-level uniformity with a much simpler formula" — claim supported by the cited error tables but not yet replicated independently in 2026.

## Confidence notes

**High confidence.** Ottosson is the designer; this is the primary source. The methodology is documented in detail, the code is open, the matrices are exact, and the comparison data is reproducible. The Munsell-renotation and Luo-Rigg comparison plots are independently verifiable using the open Python tools cited (colorio, colour-science, numpy, scipy, matplotlib).

Independent confirmation of the practical claims is provided by 5+ years of industry adoption since 2020, including CSS Color Level 4/5 (W3C-standardized) and major design tools.

## Why we cite it

The definitive reference for Oklab and OKLCH. Cited from [[OKLCH]] for the derivation, matrices, implementation, and industry adoption; from [[The Munsell and CIELAB Color Systems]] for the visual demonstration that Oklab predicts Munsell rings better than CIELAB; from [[Color Harmony]] for the recommendation to use OKLCH hue angle for harmony generation.

## Related pages

[[OKLCH]] · [[The Munsell and CIELAB Color Systems]] · [[CIEDE2000]] · [[Color Harmony]]
