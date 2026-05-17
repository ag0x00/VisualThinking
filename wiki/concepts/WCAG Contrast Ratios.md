---
title: WCAG Contrast Ratios
type: concept
aliases: [WCAG contrast, relative luminance contrast, contrast ratio]
tags: [concept, color, accessibility, computational-aesthetics, metrics]
status: developing
address: c-000018
created: 2026-05-16
updated: 2026-05-16
---

# WCAG Contrast Ratios

> The **luminance-contrast formula** standardized by the W3C in WCAG 2.0 (2008) and carried forward in WCAG 2.1 / 2.2. The de facto baseline for "is this text readable against its background?" on the web (Source: [[W3C WCAG 22 - Contrast Minimum]]).

A simple ratio between the relative luminance of two colors, with empirically-derived thresholds for the level of contrast required by readers with normal and impaired vision.

## The formula

For two colors with **relative luminance** $L_1 \geq L_2$:

$$\text{contrast ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

The constant $0.05$ accounts for typical viewing flare (ambient reflection from the display surface), per IEC/4WD 61966-2-1 (Source: [[W3C WCAG 22 - Contrast Minimum]]). The ratio ranges from 1:1 (identical colors) to 21:1 (pure black on pure white).

**Relative luminance** for an sRGB color $(R, G, B)$ with channels in $[0, 1]$:

1. Linearize each channel:
$$C_{\text{lin}} = \begin{cases} C / 12.92 & \text{if } C \leq 0.04045 \\ \left(\frac{C + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$

2. Weighted sum:
$$L = 0.2126 \, R_{\text{lin}} + 0.7152 \, G_{\text{lin}} + 0.0722 \, B_{\text{lin}}$$

The channel weights match the human eye's sensitivity: green contributes most, blue least. They derive from the BT.709 / sRGB luminance formula.

## The thresholds

| Threshold | Use case | Compliance level |
|---|---|---|
| **3:1** | Large text (≥ 18pt or ≥ 14pt bold) | WCAG AA |
| **4.5:1** | Normal text (smaller than the above) | WCAG AA |
| **3:1** | Non-text UI components, graphical objects | WCAG AA (SC 1.4.11) |
| **7:1** | Normal text | WCAG AAA |
| **4.5:1** | Large text | WCAG AAA |

The 3:1 minimum is the level recommended for standard text and vision in ANSI/HFS 100-1988. The 4.5:1 AA target accounts for the contrast-sensitivity loss associated with **20/40 vision** (roughly the visual acuity of an average 80-year-old) — empirical work shows that 20/40 corresponds to a sensitivity loss of about 1.5×, so $3 \times 1.5 = 4.5$. The 7:1 AAA target similarly compensates for 20/80 vision (Source: [[W3C WCAG 22 - Contrast Minimum]]).

## What the formula does NOT do

WCAG contrast is *only about achromatic luminance*. It deliberately ignores hue, because:

- Hue discrimination varies dramatically with color vision deficiency.
- Luminance contrast is preserved across most color-vision differences (the L and M cones overlap heavily in spectral response).

Consequence: two colors with identical luminance ratio can have *very different* perceived contrast for a normally-sighted reader (e.g., red-on-black vs. yellow-on-black at the same WCAG ratio look very different). The W3C is upfront about this — WCAG aims at the **lower bound** for accessibility, not the perceptual ground truth.

## Known limits and the APCA successor

WCAG contrast has known issues:

- **Overstates contrast at the dark end.** Light text on dark backgrounds tends to *test* as more readable than it actually is, because the formula is not based on actual reading-performance data.
- **Understates contrast at the light end.** Dark text on near-white backgrounds sometimes fails 4.5:1 even when clearly readable.
- **No model of font weight, size, or spacing.** A 4.5:1 ratio is treated identically for a thin sans-serif and a heavy slab serif.

The proposed successor is **APCA** (Accessible Perceptual Contrast Algorithm) by Andrew Somers, designed around actual reading-performance data with explicit font-weight and size adjustments. APCA is **not** part of WCAG 2.x; it has been considered for WCAG 3 (a parallel standards effort, not a successor to 2.x). For now, treat WCAG 2.x contrast as the **default accessibility baseline** and APCA as the **research alternative**.

## Programmable form

```
def wcag_contrast(rgb1, rgb2):
    L1 = relative_luminance(rgb1)
    L2 = relative_luminance(rgb2)
    if L1 < L2: L1, L2 = L2, L1
    return (L1 + 0.05) / (L2 + 0.05)
```

Available in: `chroma.js` (`chroma.contrast()`), `culori` (`wcagContrast()`), Python `wcag-contrast-ratio`. Trivial to implement from scratch given the formula above.

For palette design: WCAG contrast is computed pairwise on (foreground, background) color pairs. A 6-color palette has up to 15 pairs to check. Most design systems pre-bake compliant pairs ("primary on background," "primary text on primary fill," etc.).

## Why it matters for this vault

WCAG is the **practical** color metric — the one that constrains what colors can actually appear next to each other in usable interfaces. It's also the most-cited entry point from web design into perceptual color science, which makes it a useful bridge for LLM-driven design tools.

For an LLM critic evaluating a UI palette, WCAG contrast is the **first** check: any text-on-background pair below 4.5:1 (for normal text) is a hard fail regardless of harmony, hue relations, or chroma. Get this right before getting anything else right.

For a generative system, WCAG contrast can be a **constraint** during sampling: reject palette pairs below threshold. Combined with [[OKLCH]] for harmony and [[CIEDE2000]] for distinctness, this is enough machinery to generate fully-compliant design-system color tokens automatically.

## To research

- **APCA** (Somers) — read the spec and the empirical reading-performance studies that motivate it.
- Eye-tracking / reading-time studies that validate (or refute) the 4.5:1 threshold for various font weights and sizes.
- The contrast-of-chromatic-elements problem — non-text contrast (icons, focus rings) per WCAG 1.4.11.
- Material 3's tone-based contrast system (HCT) as a parallel design-system approach.

## Related
[[The Munsell and CIELAB Color Systems]] · [[OKLCH]] · [[CIEDE2000]] · [[Color Harmony]] · [[W3C WCAG 22 - Contrast Minimum]]
