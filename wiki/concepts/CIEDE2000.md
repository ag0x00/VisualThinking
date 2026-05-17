---
title: CIEDE2000
type: concept
aliases: [CIE Delta E 2000, ΔE2000, dE00]
tags: [concept, color, computational-aesthetics, metrics]
status: developing
address: c-000015
created: 2026-05-16
updated: 2026-05-16
---

# CIEDE2000

> The CIE's 2000 color-difference formula. Replaces simple Euclidean distance in CIELAB with a perceptually-weighted distance that corrects for CIELAB's known non-uniformities (Source: [[Techkon - CIE Delta E 2000 Formula]]).

A scalar $\Delta E_{00}$ between two colors specified in [[The Munsell and CIELAB Color Systems|CIELAB]]. The standard threshold is $\Delta E_{00} \approx 1$ for the **just-noticeable difference** (JND) for a trained observer in ideal viewing conditions.

## The formula's shape

The formula takes three differences and a set of weighting functions:

$$\Delta E_{00} = \sqrt{ \left(\frac{\Delta L'}{k_L S_L}\right)^2 + \left(\frac{\Delta C'}{k_C S_C}\right)^2 + \left(\frac{\Delta H'}{k_H S_H}\right)^2 + R_T \frac{\Delta C'}{k_C S_C} \frac{\Delta H'}{k_H S_H} }$$

Components:
- **$\Delta L'$ — lightness difference.** Adjusted from raw CIELAB $\Delta L^*$.
- **$\Delta C'$ — chroma difference.** Adjusted from $\Delta C^*_{ab}$ via a chroma-dependent correction term.
- **$\Delta H'$ — hue difference.** Computed from a hue-angle difference, in CIELAB's polar form.
- **$S_L, S_C, S_H$ — weighting functions** that scale each axis based on the mean lightness, chroma, and hue of the two colors. These are the corrections for non-uniformity.
- **$R_T$ — rotation term.** A small cross-term that accounts for hue rotation in the blue region (where CIELAB is worst).
- **$k_L, k_C, k_H$ — parametric factors.** Usually 1; can be set per industry (textiles, graphic arts).

Reference implementation: [Bruce Lindbloom's CIEDE2000 calculator](http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html).

## Thresholds in practice

| $\Delta E_{00}$ | Interpretation |
|---|---|
| $\leq 1$ | Imperceptible to the trained observer (JND) |
| $1$–$2$ | Perceivable on close inspection |
| $2$–$3.5$ | Perceptible at a glance |
| $3.5$–$5$ | Clear difference |
| $\geq 5$ | Different colors |
| $\geq 10$ | Strongly different |

For specific industries: textiles often use $\Delta E_{00} < 1$ as the acceptance criterion; printing/packaging typically $< 2$; tooth-color matching in dentistry uses 50%:50% perceptibility/acceptability thresholds around 0.8–2.7 depending on application (Source: search result *Perceptibility and Acceptability Thresholds*, PMC11733899).

## Where it still falls short

> "The CIEDE2000 formula may not be the final word with respect to a colour difference formula." — CIE/ISO workshop materials (Source: [color.org workshop PDF, referenced via search].)

Known limits:
- Tuned for **small** color differences (< 5 ΔE). Larger differences are less reliable.
- Designed for **D65 daylight** illumination. Departures from this require care.
- Not equivalent to perception under **HDR**, transparent media, or self-luminous displays — only surface-color comparison.
- The blue-hue correction is *better* than CIE76/CIE94 but not perfect; [[OKLCH]] / Oklab does meaningfully better in this region (Source: [[Bottosson - Oklab Color Space]]).

Successors / alternatives:
- **CAM16-UCS** — best overall perceptual uniformity but heavy computationally.
- **[[OKLCH]] Euclidean distance** — simple, well-behaved, and competitive with CIEDE2000 in most regions; better in blues.

## Programmable form

Treat $\Delta E_{00}$ as a function $(\text{Lab}_1, \text{Lab}_2) \to \mathbb{R}_{\geq 0}$. Available in standard libraries:
- Python: `colormath`, `colour-science`
- JavaScript: `chroma.js` (`chroma.deltaE(c1, c2, 'CIEDE2000')`), `culori`
- Reference C: Bruce Lindbloom's site

The formula is well-defined but algebraically dense; never write it by hand. Always test against the [Sharma 2005 reference dataset](http://www2.ece.rochester.edu/~gsharma/ciede2000/) (34 test pairs).

## Why it matters for this vault

CIEDE2000 is the **scalar color-difference primitive** under most programmable color operations:

- Palette generation — generate candidate colors, filter pairs by $\Delta E_{00} \geq$ threshold for visual distinctness.
- LLM critic for harmony — evaluate "are these colors close enough to count as analogous" by hue distance + small ΔE.
- Color search / matching — find the closest candidate from a set.
- Quantization quality — measure perceptual loss after gamut clipping or palette reduction.

For practical work today, CIEDE2000 remains the de facto standard in **print and industry**; [[OKLCH]] Euclidean distance is increasingly the default in **digital design and image processing**. Both are correct contexts; both belong in the toolbox.

## Related
[[The Munsell and CIELAB Color Systems]] · [[OKLCH]] · [[Color Harmony]] · [[WCAG Contrast Ratios]] · [[Techkon - CIE Delta E 2000 Formula]]
