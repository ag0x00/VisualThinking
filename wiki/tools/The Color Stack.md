---
title: The Color Stack (culori, chroma.js, d3-color)
type: tool
status: developing
tags: [tool, library, color, oklch, culori, chroma, javascript]
address: c-000129
created: 2026-05-17
url: https://culorijs.org/
license: MIT (culori); BSD-3 (chroma.js); ISC (d3-color)
last_release: continuous (all three, 2026)
verdict: first-class-culori-default
---

# The Color Stack (culori, chroma.js, d3-color)

The **three modern color-manipulation libraries** for JavaScript / TypeScript. They overlap substantially in features but differ in **default color spaces**, **API style**, and **bundle size**. The wiki's CLAUDE.md specifies **culori** as the default; this page evaluates all three and explains when to use which.

**Verdict: culori is first-class default for new work; chroma.js is first-class for legacy / simple use; d3-color is first-class within d3.js pipelines.**

## Purpose (one line)

Three libraries for color-space conversion, manipulation, interpolation, and analysis in JS/TS, supporting modern perceptual color spaces (OKLCH, Lab, LCh) alongside RGB / HSL.

## The three libraries

### culori (Dan Burzo, 2018+)

**The wiki's default.** Why:

- **OKLCH-native** — culori treats OKLCH (and OKLab) as **first-class color spaces**, not afterthoughts. The wiki has a dedicated [[OKLCH]] page.
- **Modern color spaces**: OKLCH, OKLab, P3, Rec2020, HCT (Material Design 3), all the CIE spaces.
- **Functional / tree-shakeable API**: `import { oklch, formatHex } from "culori";`
- **TypeScript first**.
- **MIT licensed**.

Bundle size: ~30kB gzipped (tree-shaken).

### chroma.js (Gregor Aisch, 2012+)

**The established / legacy choice.** Was the dominant JS color library before culori. Still excellent, but less modern.

- **Object-oriented API**: `chroma('orange').darken(2).hex()`.
- **Substantial training-data presence** — LLMs handle it well.
- **Modern color spaces** added in v2+ but feel bolted-on next to RGB / HSL.
- **BSD-3 licensed**.

Bundle size: ~50kB gzipped (not tree-shakeable as cleanly as culori).

### d3-color (part of d3.js, 2011+)

**The d3-ecosystem choice.** If you're in a d3.js pipeline, d3-color is already there.

- **Functional API**.
- **OKLCH support** added in d3-color v3+.
- **Smaller surface area** than chroma.js / culori — focused on the operations d3 needs.
- **ISC licensed**.

Bundle size: ~10kB gzipped (subset of d3 install).

## Rubric scores (culori — the default)

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **5 / 5** | OKLCH-native = perceptually-uniform color spaces are the right primitive |
| 2. Branding | **5 / 5** | Brand-color specification in perceptual spaces; cross-medium consistency |
| 3. Graphic design | **5 / 5** | OKLCH gradients, perceptual contrast, WCAG-compliant interpolation |
| 4. Music-reactive visualizers | **5 / 5** | Perceptual color interpolation for smooth audio-driven color shifts |

### Paradigm coverage

- ✅ Conversions between color spaces: RGB ↔ HSL ↔ OKLCH ↔ Lab ↔ LCh ↔ HCT ↔ etc.
- ✅ Color interpolation: in any color space (perceptual interpolation is the win).
- ✅ Color manipulation: rotate hue, adjust lightness, mix, blend modes.
- ✅ Gamut mapping: OKLCH to sRGB / P3 with controlled gamut behavior.
- ✅ Color difference: $\Delta E_{00}$, $\Delta E_{OK}$.
- ✅ Color parsing: CSS Color Module 4 / 5 syntax (incl. `oklch(...)`, `color(display-p3 ...)`, etc.).

### Autonomy-control fit

**Score: 5 / 5** — color libraries are infrastructure, applicable at every point on the gradient.

### Primitive vocabulary

Color spaces supported by culori:
- RGB family: `rgb`, `lrgb` (linear-RGB), `a98` (Adobe RGB), `p3` (Display-P3), `prophoto`, `rec2020`.
- HSL family: `hsl`, `hsv`, `hsi`, `hwb`.
- LAB / LCh family: `lab` (CIELab D50/D65), `lch`, `oklab`, `oklch`.
- HCT (Material Design 3): `hct`.
- XYZ (D50/D65): `xyz50`, `xyz65`.
- Special: `cmyk`, `yiq`, `dlab` (DIN99), `lab65`, `lrgb`.

This is essentially **every color space a designer would want**.

### Idiomaticity and LLM-codegen friendliness

**Score: 4 / 5** — strong but newer:

- **Moderate training-data presence** — growing rapidly, less than chroma.js but enough for working code.
- **TypeScript-first design** — strong typing.
- **API documentation comprehensive** at https://culorijs.org/api/
- **Functional API** is concise.

### Production-readiness

**Score: 5 / 5** — actively maintained, MIT-licensed, used in production at scale (Tailwind CSS color utilities use culori internally; many design-system tools).

## When to use which

| Use culori when... | Use chroma.js when... | Use d3-color when... |
|---|---|---|
| New work in 2026+ | Legacy code already uses chroma | You're in a d3 pipeline |
| Need OKLCH / OKLab natively | Need maximum LLM-codegen reliability (more training data) | Bundle size matters and d3 is already loaded |
| TypeScript-strict codebase | Quick prototyping / familiar idioms | Functional / minimal needs |
| Working with Material Design 3 HCT | Working with established design-tools that use chroma | Sequential / diverging palettes for charts |

For most wiki contexts, **culori is the right default** per CLAUDE.md. For chart-heavy work where d3 is already loaded, **d3-color is enough**.

## Connection to the wiki's framework

OKLCH is the wiki's **perceptual color space of choice** ([[OKLCH]]) because:

1. **Perceptually uniform** — equal numeric distances feel equal visually (unlike RGB or HSL).
2. **Predictable hue rotation** — rotating the hue doesn't shift perceived lightness.
3. **Native CSS support** since 2023 — `oklch()` is a standard CSS color function.
4. **Smooth interpolation** — `oklch(...)` to `oklch(...)` interpolates naturally; RGB interpolation produces muddy mid-points.

Culori is the JS/TS library that lets you **think in OKLCH** programmatically. For the wiki's [[Arnheim's Color Syntax|color syntax]] work (priority 1) and [[Color Harmony|brand-color systems]] (priority 2), this is critical.

For [[Lightness and Color Constancy|color constancy]] / [[Ecological Valence Theory|EVT-aware palette design]], all three libraries support the necessary conversions, but culori's OKLCH primitives make the work most natural.

## Use-cases the color stack excels at

- **Brand-color specification** in perceptual-uniform spaces (priority 2).
- **Generative-art palettes** where hue / lightness / chroma should vary independently (priority 1).
- **Smooth color transitions** in music-reactive visualizers (priority 4) — OKLCH interpolation feels musical; RGB interpolation feels stuttery.
- **WCAG-compliant contrast checking** with perceptual color differences.
- **Aerial-perspective shaders** ([[Aerial Perspective]]) — OKLCH gradients are the right primitive.
- **Cross-medium color consistency** — print, screen, P3-wide-gamut, OKLCH-specified.

## Use-cases where color libraries are NOT enough

- **In-shader color manipulation**: GLSL / WGSL don't have these libraries; implement perceptual color math in shaders manually. Three.js's TSL adds some support.
- **Hardware-accurate color management** (calibrated print, broadcast color): use specialized tools (Adobe Color Engine, Argyll CMS).

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[OKLCH]] · [[The Munsell and CIELAB Color Systems]] · [[CIEDE2000]] · [[Color Harmony]] · [[Arnheim's Color Syntax]] · [[Warm and Cool Colors]] · [[Ecological Valence Theory]] · [[WCAG Contrast Ratios]] · [[d3.js]] · [[Tools Map]]

## Source

- culori: https://culorijs.org/ ; https://github.com/Evercoder/culori
- chroma.js: https://gka.github.io/chroma.js/ ; https://github.com/gka/chroma.js
- d3-color: https://github.com/d3/d3-color
- CSS Color Module 4: https://www.w3.org/TR/css-color-4/
- CSS Color Module 5: https://www.w3.org/TR/css-color-5/
- OKLCH primer: https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
- Björn Ottosson 2020 "A perceptual color space for image processing" — https://bottosson.github.io/posts/oklab/ (origin of OKLab / OKLCH).
