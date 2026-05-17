---
title: Color Harmony
type: concept
aliases: [color schemes, color theory, harmony rules]
tags: [concept, color, composition, computational-aesthetics]
status: developing
address: c-000017
created: 2026-05-16
updated: 2026-05-16
---

# Color Harmony

> A family of rules for selecting **multiple colors that look coherent together**. Each rule is a fixed geometric relation on a color wheel — pick a hue, then take its neighbors, opposites, or evenly-spaced siblings. Trivially programmable in any cylindrical color space, but the *quality* of the result depends heavily on which color space you use.

## The canonical schemes

| Scheme | Construction | Effect |
|---|---|---|
| **Monochromatic** | One hue, varying $L$ and $C$ only | Calm, minimal, easy to make readable |
| **Analogous** | Three adjacent hues (within ~30° on the wheel) | Harmonious, low-tension, often nature-like |
| **Complementary** | Two hues 180° apart | Maximum hue contrast; energetic but can clash |
| **Split-complementary** | One hue + the two hues adjacent to its complement | Softer than complementary; still high contrast |
| **Triadic** | Three hues 120° apart | Vibrant; harder to balance |
| **Tetradic / Rectangular** | Four hues in two complementary pairs, rectangular | Rich; usually needs one dominant + three accents |
| **Square** | Four hues 90° apart | Vivid; rare for the same reason as triadic |

These are the rules taught universally in color-theory courses and design textbooks. They're popular because they're cheap to apply and almost always *not bad* — but they're heuristics, not laws.

## What color wheel?

This is the part that's poorly handled in popular treatments. "Pick the hue 180° around the wheel" depends entirely on **which wheel**:

- **RYB (artist's wheel)** — the historical pigment-mixing wheel. Red, Yellow, Blue as primaries; orange/green/violet as secondaries. *Visually plausible* complementary pairs (red ↔ green, blue ↔ orange, yellow ↔ purple) but mathematically arbitrary.
- **RGB (additive screen wheel)** — primaries are red/green/blue; complements are cyan/magenta/yellow. Not perceptually uniform.
- **HSV / HSL on RGB** — same as above with a lightness/saturation cylinder. Not perceptually uniform; the same "hue angle distance" feels very different in different parts of the wheel.
- **CIELAB LCh hue angle** — perceptually uniform-ish. Better than HSV but with known issues in blues (see [[The Munsell and CIELAB Color Systems]]).
- **[[OKLCH]] hue angle** — **the current best default.** Perceptually uniform across the wheel; complementary pairs picked by 180° offset in OKLCH genuinely feel like complements.

> **Use OKLCH or CIELAB for harmony generation in new code.** Generating an "analogous" palette by picking ±30° in HSV gives noticeably uneven results because the same angle is much wider perceptually in blues than in reds.

## Programmable form

For any modern perceptual space:

```
harmony(base_hue, scheme):
  match scheme:
    monochromatic     → [base_hue] × varying (L, C)
    analogous         → [base_hue − 30°, base_hue, base_hue + 30°]
    complementary     → [base_hue, base_hue + 180°]
    split_complement  → [base_hue, base_hue + 150°, base_hue + 210°]
    triadic           → [base_hue, base_hue + 120°, base_hue + 240°]
    tetradic          → [base_hue, base_hue + 60°, base_hue + 180°, base_hue + 240°]
    square            → [base_hue, base_hue + 90°, base_hue + 180°, base_hue + 270°]
```

In OKLCH this gives a usable palette directly. In CIELAB, add a small correction for blue-region rotation. In HSV, accept that the result will look uneven; better to convert to a perceptual space first.

The lightness and chroma of generated colors are **not** fixed by the harmony rule. A common practice: keep $L$ and $C$ constant across the palette for a flat / poster look, or vary them along a gradient for hierarchy.

## What the rules don't tell you

The harmony schemes are a **starting point**, not a finished palette. They specify *hue relations* and nothing else. A working palette also needs:

- **Lightness contrast** — controlled by $L$; verified by [[WCAG Contrast Ratios]] for text.
- **Chroma balance** — usually one dominant high-chroma color, others lower-chroma. Equal-chroma palettes feel chaotic.
- **Neutral anchors** — a near-grey, off-white, or dark color to ground the palette.
- **Functional roles** — primary, secondary, background, error, success. Modern design systems (Material 3 via HCT, Radix Colors via OKLCH) build these on top of the harmony skeleton.

> [!gap] The deep-source for harmony rules in this sweep was Wikipedia's *Color scheme* article (firecrawl-fetched, exceeded token budget). The popular harmony lists above are drawn from search-result summaries of Color Matters, paperpapers, and similar sources, plus the more rigorous treatment in Johannes Itten's *The Elements of Color* (named in [[Wiki Seed]], not yet directly read).

## Why it matters for this vault

Color harmony is **the rule layer of color** — analogous to [[Compositional Grids]] for shape. It's the cheapest programmable way to get from "pick a base color" to "pick a palette of N coherent colors."

For an LLM critic: "are these colors in a harmonic relation?" reduces to "compute hue distances in OKLCH, check whether they match one of the canonical patterns to within tolerance."

For a generative system: harmony rules are the simplest way to constrain palette sampling. Combined with [[CIEDE2000]] or OKLCH ΔE thresholds for distinctness, you can sample N colors from a chosen scheme in a few lines.

## To research

- Johannes Itten's *The Elements of Color* (Bauhaus) for the canonical pedagogical treatment.
- Empirical studies of *which* harmony schemes actually predict preference. There is surprisingly little rigorous work; most claims trace back to design-textbook tradition rather than experimental data.
- Material 3 / HCT and Radix Colors as modern **role-based** palette systems built on top of harmony skeletons.
- The interaction between harmony and **cultural color associations** — a topic the harmony rules sidestep entirely.

## Related
[[The Munsell and CIELAB Color Systems]] · [[OKLCH]] · [[CIEDE2000]] · [[WCAG Contrast Ratios]] · [[Compositional Grids]]
