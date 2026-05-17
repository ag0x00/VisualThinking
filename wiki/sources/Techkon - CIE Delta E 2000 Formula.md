---
title: "Techkon - Demystifying the CIE Delta E 2000 Formula"
type: source
source_type: industry-explainer
author: Carlos Stanza, Jinkai Qian
publisher: Techkon (Datacolor)
date_published: 2023-08-14
date_modified: 2025-06-11
date_retrieved: 2026-05-16
url: https://techkon.datacolor.com/demystifying-the-cie-delta-e-2000-formula/
confidence: medium
status: developing
tags: [source, color, ciede2000, metrics]
address: c-000020
created: 2026-05-16
---

# Techkon — Demystifying the CIE ΔE 2000 Formula

## Summary

Industry explainer of the **CIEDE2000** color-difference formula from the perspective of a printing-and-packaging color-instrument vendor. Covers the formula's motivation (CIELAB's known non-uniformity, with the MacAdam ellipse providing the visual evidence), the component differences (ΔL*, ΔC*, ΔH*), the weighting functions that adjust for human-vision non-uniformity, and the practical industry threshold of ΔE ≤ 1 as the perceptual JND.

## What it contributes

- The **MacAdam ellipse** context — the seminal experimental data showing that the same Euclidean distance in chromaticity corresponds to vastly different perceived differences depending on hue. This is the empirical basis for needing a non-Euclidean color-difference formula.
- A practical breakdown of the CIEDE2000 formula's components: lightness, chroma, hue, and the chroma/hue weighting functions.
- The link to **Bruce Lindbloom's** reference implementation (brucelindbloom.com), which is the de facto canonical implementation.
- The industry context: CIEDE2000 is now the preferred method in printing and packaging; instruments like Techkon's SpectroDens 4 implement it alongside CIELAB and earlier ΔE formulas.

## Key claims

- **high** $\Delta E_{00} \approx 1$ is the threshold for an imperceptible difference; values above indicate a perceivable distinction.
- **high** Human color perception is non-uniform: more L-cones than M and S cones means higher tolerance in the 560 nm range than near 400 nm or 700 nm.
- **high** MacAdam ellipses are oriented and sized differently across the chromaticity diagram — the empirical evidence for non-uniform color perception.
- **high** The CIEDE2000 formula has four main components: ΔL* lightness difference, ΔC* chroma difference, Δh hue difference, and ΔL*ΔC* / ΔC*Δh weighting functions that adjust for non-uniformity.
- **medium** CIEDE2000 is the preferred method in printing and packaging industries.
- **medium** Increasing a weighting-function value reduces sensitivity to that attribute (allows more discrepancy at the same ΔE tolerance).

## Confidence notes

**Medium.** The source is an industry vendor; useful for the practical / industry context but not a primary scientific reference for the formula itself. The MacAdam ellipse and JND claims are well-established. The formula breakdown is correct but compressed; for the actual equations, defer to Bruce Lindbloom's site or the CIE technical documents. Some content is marketing (SpectroDens 4 product mentions).

## Why we cite it

The cleanest non-academic explainer of CIEDE2000 that includes the MacAdam-ellipse motivation and the practical industry context. Cited from [[CIEDE2000]] for the JND threshold, the formula breakdown, and the link to Bruce Lindbloom's reference implementation.

## Related pages

[[CIEDE2000]] · [[The Munsell and CIELAB Color Systems]] · [[OKLCH]]
