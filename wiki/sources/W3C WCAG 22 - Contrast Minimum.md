---
title: "W3C WCAG 2.2 - Understanding Success Criterion 1.4.3: Contrast (Minimum)"
type: source
source_type: standards-document
publisher: W3C (Web Accessibility Initiative)
date_retrieved: 2026-05-16
url: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
confidence: high
status: developing
tags: [source, color, accessibility, standards]
address: c-000022
created: 2026-05-16
---

# W3C — Understanding SC 1.4.3: Contrast (Minimum)

## Summary

The W3C's official explanation of Success Criterion 1.4.3 in **WCAG 2.2** — the foundational web-accessibility contrast standard. Covers the 4.5:1 (normal text) and 3:1 (large text) thresholds, the rationale based on 20/40 vision and ANSI/HFS 100-1988, the contrast-ratio formula, the relative-luminance formula for sRGB, and the relationship to the AAA 7:1 threshold (SC 1.4.6) and the non-text 3:1 threshold (SC 1.4.11).

## What it contributes

- **The contrast-ratio formula**: $(L_1 + 0.05) / (L_2 + 0.05)$, with the $0.05$ constant accounting for typical viewing flare per IEC 61966-2-1.
- **The relative-luminance formula** for sRGB: $L = 0.2126 R + 0.7152 G + 0.0722 B$ with per-channel linearization at the 0.04045 threshold.
- **The 20/40-vision empirical justification** for 4.5:1 (ANSI/HFS 100-1988 baseline of 3:1, multiplied by an empirical contrast-sensitivity-loss factor of ~1.5 for moderately impaired vision).
- **The 20/80 justification** for the 7:1 AAA target.
- **Large-text exemption**: 18pt (or 14pt bold) and larger only need 3:1.
- **Explicit exemptions**: inactive UI components, decorative text, text in pictures, logo/brand text.
- The note that **calculations should be evaluated as strict thresholds** (4.499:1 fails 4.5:1 — no rounding).
- References to ANSI/HFS 100-1988, ISO 9241-3, ARDITI-FAYE, ARDITI-KNOBLAUCH (1994, 1996), GITTINGS-FOZARD 1986 — the empirical literature underlying the thresholds.

## Key claims

- **high** Normal text contrast ratio must be at least 4.5:1 for WCAG AA conformance.
- **high** Large text (≥ 18pt, or ≥ 14pt bold) needs at least 3:1.
- **high** AAA conformance requires 7:1 for normal text and 4.5:1 for large text (SC 1.4.6).
- **high** The contrast ratio formula is $(L_1 + 0.05) / (L_2 + 0.05)$ where the $0.05$ models viewing flare.
- **high** The 4.5:1 ratio compensates for the contrast sensitivity loss associated with ~20/40 vision (typical of unaided elders around age 80; GITTINGS-FOZARD 1986).
- **high** The formula deliberately uses luminance only, not hue, because hue discrimination varies dramatically with color vision deficiency while luminance-based contrast is largely preserved.
- **high** Thresholds are strict: 4.499:1 does not pass 4.5:1.
- **high** The contrast formula is meant for text on background; non-text contrast has separate criteria (SC 1.4.11).
- **medium** The 2021 update changed the linearization threshold from 0.03928 to 0.04045; this has no practical effect on calculations in the typical sRGB range.

## Confidence notes

**High confidence**: this is a primary standards document, normatively in force on the web. The formulas, thresholds, and empirical justifications are sourced to ANSI, ISO, and peer-reviewed vision-science literature (Arditi, Knoblauch, Gittings, Fozard). The document distinguishes between normative requirements (the ratios) and informative discussion (the rationale).

Known limits of this standard (not contradicted by the document but acknowledged elsewhere):
- WCAG 2.x contrast does not account for font weight, size beyond 18/14pt, or letter spacing.
- The luminance-only approach can over-pass dark-mode pairings (light text on dark backgrounds may test as passing while being subjectively harder to read).
- **APCA** (Accessible Perceptual Contrast Algorithm, Andrew Somers) has been proposed as a successor for WCAG 3 with explicit font-size and weight modeling, but is not part of WCAG 2.x.

## Why we cite it

The authoritative source for the WCAG contrast formula and thresholds. Cited from [[WCAG Contrast Ratios]] for every formula, threshold, and historical-empirical justification.

## Related pages

[[WCAG Contrast Ratios]] · [[The Munsell and CIELAB Color Systems]] · [[OKLCH]]
