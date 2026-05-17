---
title: culori
type: tool
status: developing
tags: [tool, color, library, oklch, default-stack]
address: c-000225
created: 2026-05-17
updated: 2026-05-17
verdict: first-class
---

# culori

**Modern color library for JavaScript** (Dan Burzo, 2017+). The wiki's **default color library** per Sweep 7 ([[Research - Implementation-notes Pass]]). Promoted to first-class because it has (1) production-quality OKLCH/OKLab support, (2) tree-shakable modular API, (3) small footprint (~30 KB), (4) extensive color-difference and conversion coverage including CIEDE2000, P3, Rec.2020.

**Verdict**: first-class for all four wiki priorities — color is foundational across generative art, branding, graphic design, and music-reactive visualizers.

## Purpose

Convert, parse, format, interpolate, and compare colors across ~25 color spaces. Modular: import only what you need.

```typescript
import { converter, parse, formatHex, differenceCiede2000 } from "culori";
const toOklch = converter("oklch");
const c = toOklch(parse("#ff6b6b"));   // { mode: "oklch", l: 0.7, c: 0.18, h: 25 }
```

## Why culori is the wiki's default

The wiki's implementation pass settled on culori as the primary color library across multiple technique pages:

- [[OKLCH Pair-Relation Classifier]] (Sweep 7) — implements Arnheim's 4 hue-pair classes via culori OKLCH.
- [[Contrast Checking Pipeline]] (Sweep 7) — uses culori for sRGB→linear conversion in WCAG 2 luminance.
- [[Aesthetic Measure Stack]] (Sweep 7) — color statistics for Datta features via culori.
- [[Audio-to-Visual Cross-Modal Mapping]] (Sweep 7) — palette interpolation.
- [[Style Transfer Pipeline]] (Sweep 7) — brand-palette remapping via culori conversion.

Reasons it won the default slot:

| Factor | culori | chroma.js | Color.js (W3C) |
|---|---|---|---|
| OKLCH/OKLab support | ✅ Native | ✅ Native | ✅ Native (spec impl) |
| Bundle size | ~30 KB tree-shakable | ~13 KB monolithic | ~80 KB |
| API style | Functional, modular | OO-chaining | OO-chaining |
| ΔE 2000 | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| P3 / Rec.2020 wide-gamut | ✅ | partial | ✅ |
| Maintenance (2026) | Active | Active | Active (W3C-tied) |
| TypeScript | First-class types | Community types | First-class types |

For the wiki's evaluation pipelines, **tree-shakability** beats the absolute size advantage of chroma.js — most uses only need 2-3 functions, not the full library.

## Core API surface

```typescript
import {
  parse, formatHex, formatRgb, formatCss,
  converter,
  differenceEuclidean, differenceCiede2000, differenceCiede76,
  interpolate, interpolateColors,
  inGamut, clampChroma,
  filterDeficiencyProt, filterDeficiencyDeuter, filterDeficiencyTrit,
} from "culori";

// Parse any CSS color
const c1 = parse("oklch(70% 0.18 25)");

// Convert to a specific space
const toOklch = converter("oklch");
const toLab = converter("lab");

// Color difference
const dE = differenceCiede2000()(c1, c2);

// Interpolate (great for palette generation)
const palette = interpolate(["#ff6b6b", "#4ecdc4"], "oklch");
const swatches = [0, 0.2, 0.4, 0.6, 0.8, 1].map(palette);

// Wide-gamut handling
const inP3 = inGamut("p3")(c1);
const clamped = clampChroma(c1, "oklch");

// CVD simulation (colorblindness)
const protan = filterDeficiencyProt(0.8)(c1);
```

## Use cases per priority

### 1. Generative art

- Palette generation via OKLCH interpolation in perceptual space (avoids the muddy-middle issue of sRGB interpolation).
- Palette validation via [[OKLCH Pair-Relation Classifier]].
- ΔE-based color quantization for palette enforcement.

### 2. Branding

- Brand-color OKLCH specification for color-system tokens.
- Tight ΔE_OK < 2 for "indistinguishable" thresholds in tolerance specs.
- Wide-gamut P3 fallbacks for modern device color fidelity.

### 3. Graphic design

- Color contrast pipelines (see [[Contrast Checking Pipeline]]).
- CVD simulation for accessibility audits.
- CSS color-function generation (`oklch()`, `color(display-p3 ...)`, etc.) for design tokens.

### 4. Music-reactive visualizers

- Real-time color interpolation in OKLCH for smooth perceptual transitions (sRGB interpolation produces banding/flicker; OKLCH does not).
- Audio-feature-driven palette modulation; see [[Audio-to-Visual Cross-Modal Mapping]].

## Limitations / gaps

- No image-pixel-array operations — for that, pair with OpenCV.js or raw `ImageData` loops.
- No color-naming dictionary (X11 / W3C named colors are supported, but no semantic-color database).
- HCT (Material 3 Hue-Chroma-Tone) is not supported as of 2026 — Material 3 uses its own implementation.

## Performance

- Single-color conversion: ~microseconds; negligible.
- Batch operations on ImageData arrays: ~100k pixels per 100 ms on mid laptop. For real-time per-frame image operations, prefer shader-side color math; use culori for setup + tokens.

## Library recommendations

- **culori** (primary, this page)
- **chroma.js** as alternative if smaller monolithic API preferred and tree-shaking isn't critical
- **Color.js** (W3C reference) for spec-canonical implementations of CSS Color Module Level 4+

For Python parity: `colour-science`. For Rust: `palette` crate.

## Related pages

[[OKLCH]] · [[OKLCH Pair-Relation Classifier]] · [[Contrast Checking Pipeline]] · [[CIEDE2000]] · [[Color Harmony]] · [[Arnheim's Color Syntax]] · [[The Color Stack]] · [[Tools Map]] · [[The Munsell and CIELAB Color Systems]]

## Sources

- culori documentation: culorijs.org
- Dan Burzo, *culori* on GitHub: github.com/Evercoder/culori
- Björn Ottosson (2020), *A perceptual color space for image processing* (OKLab origin paper).
- W3C CSS Color Module Level 4 specification.
