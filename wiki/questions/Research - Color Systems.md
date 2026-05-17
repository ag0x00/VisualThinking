---
type: synthesis
title: "Research: Color Systems"
tags: [research, color, art-fundamentals, computational-aesthetics]
status: developing
address: c-000023
created: 2026-05-16
updated: 2026-05-16
related:
  - "[[The Munsell and CIELAB Color Systems]]"
  - "[[CIEDE2000]]"
  - "[[OKLCH]]"
  - "[[Color Harmony]]"
  - "[[WCAG Contrast Ratios]]"
  - "[[Wikipedia - Munsell color system]]"
  - "[[Techkon - CIE Delta E 2000 Formula]]"
  - "[[Bottosson - Oklab Color Space]]"
  - "[[W3C WCAG 22 - Contrast Minimum]]"
sources:
  - "[[Wikipedia - Munsell color system]]"
  - "[[Techkon - CIE Delta E 2000 Formula]]"
  - "[[Bottosson - Oklab Color Space]]"
  - "[[W3C WCAG 22 - Contrast Minimum]]"
---

# Research: Color Systems

## Overview

Programmable color reasoning belongs in a **perceptual space**, not in device coordinates. The lineage runs Munsell (1905) → CIELAB (1976) → CIEDE2000 (2000) → Oklab/OKLCH (2020), each fixing specific problems with its predecessor. Around this perceptual-space core sit two practical layers: the **harmony rules** (analogous, complementary, triadic, …) that select multiple coordinated hues, and the **accessibility metric** (WCAG contrast ratios) that constrains text/background pairings to be readable. Together these form the "color" branch of this wiki's spine.

## Key Findings

- **Perceptual coordinates are the default; RGB/HSV are exceptions.** Every meaningful color operation — perceived difference, harmony, contrast, palette generation, gradient interpolation — gives bad results in device coordinates and good results in perceptual coordinates. RGB and HSV are kept for legacy compatibility and for cases where the device matters more than the perception (e.g., raw image-sensor processing).
- **OKLCH is the current best default.** Released in 2020 by Björn Ottosson; designed specifically for image processing; comparable to or better than CIELAB on every measured axis; vastly better than HSV; comparable in uniformity to CAM16-UCS while being far simpler computationally. Standardized in CSS Color Level 4 and 5; default gradient interpolation in Adobe Photoshop, Unity, Godot. (Source: [[Bottosson - Oklab Color Space]])
- **CIEDE2000 remains the standard scalar color-difference metric in industry.** $\Delta E_{00} \approx 1$ is the just-noticeable difference for a trained observer in ideal conditions. The formula corrects CIELAB's non-uniformity in chroma, hue (especially blues), and lightness via weighting functions. Used in printing, packaging, textiles, dentistry, and any application needing tight tolerance specifications. (Source: [[Techkon - CIE Delta E 2000 Formula]])
- **WCAG contrast (4.5:1 / 3:1) is the practical accessibility baseline.** A luminance-only ratio with thresholds empirically tied to 20/40 vision. The formula deliberately ignores hue because hue discrimination varies with color-vision deficiency while luminance contrast is preserved across most differences. Known to over-pass dark-on-light pairings; the APCA algorithm has been proposed as a successor for WCAG 3, but is not yet normative. (Source: [[W3C WCAG 22 - Contrast Minimum]])
- **Harmony rules are programmable geometric relations on a color wheel — but only useful in a perceptual wheel.** Generating an "analogous palette" by picking ±30° hue offsets gives clean results in OKLCH and noticeably uneven results in HSV, because HSV's hue angle is not perceptually uniform. The canonical rules (monochromatic, analogous, complementary, split-complementary, triadic, tetradic) define hue relations only; lightness, chroma, and neutral anchors must be specified separately.
- **The Munsell renotation data is the ground truth.** Modern perceptual color spaces are evaluated by how well they predict the Munsell data as concentric rings (Source: [[Bottosson - Oklab Color Space]]). Oklab and CAM16-UCS predict it cleanly; CIELAB, OSA-UCS, IPT, and especially HSV distort the rings visibly.

## The pipeline

Practical color reasoning for digital work:

```
sRGB ──(gamma decode)──→ linear sRGB ──(M_1)──→ LMS-like
                                                    │
                                                    │ (cube root)
                                                    ↓
                                                  L'M'S'
                                                    │
                                                    │ (M_2)
                                                    ↓
                                                  Oklab (L, a, b)
                                                    │
                                                    │ (polar)
                                                    ↓
                                                  OKLCH (L, C, h)
                                                    │
       ┌────────────────────────────────────────────┤
       │                                            │
   harmony rules                              ΔE thresholds
   (hue offsets)                              (CIEDE2000 / OKLCH ΔE)
       │                                            │
       └──────────────┬─────────────────────────────┘
                      ↓
              WCAG contrast check
              (relative luminance)
                      │
                      ↓
              accept / reject palette
```

This is what an LLM-assisted color tool should do internally; the developer never has to see CIELAB or sRGB.

## Named contributors (attribution only, no dedicated pages)

Per the wiki's programmability principle, individuals appear as attribution:

- **Albert Munsell** (1858–1918) — *A Color Notation* (1905); first perceptually-organized color system.
- **CIE** — International Commission on Illumination; XYZ (1931), CIELAB (1976), CIEDE2000 (2000).
- **Mark Fairchild, others** — CIECAM02 (2002), CAM16-UCS (2016): color-appearance models with viewing-condition modeling.
- **Björn Ottosson** — Oklab/OKLCH (2020).
- **Johannes Itten** (1888–1967) — *The Elements of Color* (Bauhaus); canonical pedagogical treatment of color and harmony. Named in [[Wiki Seed]]; not yet directly read.
- **Andrew Somers** — APCA (Accessible Perceptual Contrast Algorithm); proposed successor to WCAG contrast for WCAG 3.

## Key Concepts

- [[The Munsell and CIELAB Color Systems]] — perceptual color spaces, the lineage and the math.
- [[CIEDE2000]] — the de facto color-difference scalar; ΔE thresholds and the formula's structure.
- [[OKLCH]] — modern perceptual space, the new default for digital work.
- [[Color Harmony]] — the rule layer that picks multiple coordinated hues.
- [[WCAG Contrast Ratios]] — the practical accessibility metric for text on background.

## Contradictions and uncertainty

- **CIELAB's "approximate uniformity" vs. modern alternatives.** CIELAB has known blue-rotation and saturation issues; CIEDE2000 corrects them with weighting functions; OKLCH addresses them by re-deriving the underlying transform. There is no single right choice — CIEDE2000 is correct in print/packaging contexts; OKLCH is correct in digital design contexts; CAM16-UCS is correct when viewing conditions must be modeled but is heavy. (Source: synthesis from [[Bottosson - Oklab Color Space]] and [[Techkon - CIE Delta E 2000 Formula]])
- **WCAG contrast over-passes dark-on-light text.** Light text on dark backgrounds tests as more readable than it usually is, because the formula is not based on reading-performance data. APCA addresses this but is not normative.
- **Empirical basis for harmony rules.** The classical harmony schemes (complementary, triadic, etc.) trace back to design-textbook tradition. There is *surprisingly little* rigorous experimental work confirming that, say, triadic palettes are systematically preferred. This is a research gap, not a refutation.
- **Per-vault: the seed names *RYB color wheel* dismissively as "messy for programming."** That's correct for *programmable* purposes. RYB still has historical and pedagogical value (it's what students learn first, and complementary pairs in RYB are *visually plausible*) but should not appear in code paths.

## Open Questions

- **Johannes Itten, *The Elements of Color*** — direct read. The seed names this as the Bauhaus-era canonical reference. Worth a deep treatment in a future sweep.
- **Andrew Somers' APCA spec** — read the spec, the empirical-reading-performance studies, and the WCAG 3 working drafts that incorporate it.
- **HCT (Material Design 3)** — Google's parallel modern perceptual space with role-based palette generation. Compare with OKLCH; identify where each is preferable.
- **Practical OKLCH ΔE thresholds** — the equivalents of CIEDE2000's $\leq 1$, $\leq 2$, etc. Some work exists in the design-systems community (Tailwind v4, Radix Colors) but not yet a single accepted standard.
- **Empirical harmony-preference studies** — what does the experimental literature actually say about preferences for analogous vs. complementary vs. triadic schemes? Where it's been tested rigorously rather than asserted.
- **Cultural color associations** — entirely outside the perceptual-uniformity framework. A separate research direction worth flagging as the next layer after harmony.
- **Wikipedia's *Color scheme* article** was fetched but exceeded token budget; revisit in a future round for a more rigorous canonical harmony reference.

## What this sweep did NOT cover

- **Aesthetic measures** ([[Birkhoff's Aesthetic Measure]], fractal dimension, deeper [[Visual Entropy]]) — queued for the next sweep.
- **LLM techniques** — vectorizing aesthetic concepts, JSON archetypes, multimodal eval loops.
- **Tools** — `chroma.js`, `culori`, `colormath`, OpenCV.js color operations. Deferred until conceptual scaffold is solid.
- Itten's *Elements of Color* — primary source, not yet read.
- APCA, HCT, CAM16-UCS — named but not given dedicated pages.
- Color-vision deficiency modeling — important practical concern for accessibility, not covered in this sweep.

## Sources

- [[Wikipedia - Munsell color system]] — historical and definitional anchor.
- [[Techkon - CIE Delta E 2000 Formula]] — industry explainer with MacAdam-ellipse context.
- [[Bottosson - Oklab Color Space]] — primary source for Oklab/OKLCH, with reference implementation and comparison data.
- [[W3C WCAG 22 - Contrast Minimum]] — normative standards document for accessibility contrast.
