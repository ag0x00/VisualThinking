---
title: Contrast Checking Pipeline
type: technique
status: developing
tags: [technique, color, contrast, wcag, apca, accessibility, implementation]
address: c-000212
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[WCAG Contrast Ratios]]", "[[OKLCH]]", "[[Variable Fonts and Web Typography]]"]
language: typescript
---

# Contrast Checking Pipeline

Implementation of color contrast validation for type-on-background pairs. Covers **WCAG 2.x** (the legacy standard with documented perceptual flaws), **APCA / WCAG 3 draft** (the better-but-not-yet-normative successor), and **practical hybrid** workflows for production design systems.

**Use cases**: design-system token validation, generated-palette accessibility auditing, real-time UI generation with contrast guards.

## Background

WCAG 2's contrast formula uses sRGB relative luminance ratios that systematically misjudge mid-range pairs (especially dark-text on saturated-color, and pale-text on white). **APCA (Accessible Perceptual Contrast Algorithm)** by Andrew Somers fixes the perceptual issues but uses absolute polarity-aware scoring (Lc values, not ratios). Both are useful; pick by context.

| Standard | Status (2026) | When to use |
|---|---|---|
| WCAG 2.x | Normative for most legal-compliance contexts (EU EAA, ADA, Section 508) | Compliance audits, regulatory work |
| APCA | Non-normative; informative for WCAG 3 draft | Design-quality work, perceptual correctness, modern systems |
| Hybrid | — | Pass both: meets compliance AND looks right |

## WCAG 2 implementation

```typescript
import { converter, parse } from "culori";

const toRgb = converter("rgb");

function relativeLuminance(color: string): number {
  const { r, g, b } = toRgb(parse(color))!;
  const linearize = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function wcagContrast(foreground: string, background: string): number {
  const L1 = relativeLuminance(foreground);
  const L2 = relativeLuminance(background);
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

// Thresholds
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;   // 18pt+ or 14pt+ bold
const WCAG_AAA_NORMAL = 7.0;
const WCAG_AAA_LARGE = 4.5;
```

## APCA implementation

APCA is normalized differently from WCAG; positive Lc means dark text on light background, negative means the inverse. The reference implementation is at `apca-w3` on npm.

```typescript
// Use the reference implementation directly — APCA's coefficients are subtle and small reimplementations drift.
import { APCAcontrast, sRGBtoY, displayP3toY } from "apca-w3";

function apcaScore(foreground: string, background: string): number {
  const { r: fr, g: fg, b: fb } = toRgb(parse(foreground))!;
  const { r: br, g: bg, b: bb } = toRgb(parse(background))!;
  const fY = sRGBtoY([fr * 255, fg * 255, fb * 255]);
  const bY = sRGBtoY([br * 255, bg * 255, bb * 255]);
  return Math.abs(APCAcontrast(fY, bY));  // |Lc|, polarity-stripped for threshold comparison
}

// APCA thresholds (informative, not normative; see Bronze Simple Mode)
const APCA_BODY_TEXT = 75;       // Body copy, ~16px
const APCA_LARGE_TEXT = 60;      // ≥24px or ≥18.66px bold
const APCA_NON_TEXT = 45;        // Icons, UI elements
const APCA_INCIDENTAL = 30;      // Decorative, disabled
```

## Hybrid validator

For production design systems aiming at both compliance and perceptual quality:

```typescript
interface ContrastResult {
  wcag2Ratio: number;
  wcag2Pass: { AA: boolean; AAA: boolean };
  apcaLc: number;
  apcaPass: { body: boolean; large: boolean };
  recommendation: "pass" | "warn-perceptual" | "warn-compliance" | "fail";
}

function validateContrast(fg: string, bg: string, opts: { fontSize: number; bold?: boolean }): ContrastResult {
  const wcag2Ratio = wcagContrast(fg, bg);
  const apcaLc = apcaScore(fg, bg);
  const isLargeWcag = opts.fontSize >= 18 || (opts.fontSize >= 14 && opts.bold);
  const isLargeApca = opts.fontSize >= 24 || (opts.fontSize >= 18.66 && opts.bold);

  const wcag2AA = wcag2Ratio >= (isLargeWcag ? WCAG_AA_LARGE : WCAG_AA_NORMAL);
  const wcag2AAA = wcag2Ratio >= (isLargeWcag ? WCAG_AAA_LARGE : WCAG_AAA_NORMAL);
  const apcaBody = apcaLc >= (isLargeApca ? APCA_LARGE_TEXT : APCA_BODY_TEXT);

  let recommendation: ContrastResult["recommendation"];
  if (wcag2AA && apcaBody) recommendation = "pass";
  else if (!wcag2AA && apcaBody) recommendation = "warn-compliance";
  else if (wcag2AA && !apcaBody) recommendation = "warn-perceptual";
  else recommendation = "fail";

  return {
    wcag2Ratio, wcag2Pass: { AA: wcag2AA, AAA: wcag2AAA },
    apcaLc, apcaPass: { body: apcaBody, large: apcaLc >= APCA_LARGE_TEXT },
    recommendation,
  };
}
```

## Generative-art / branding application

For generated palettes:

```typescript
function auditPalette(palette: string[], textColors: string[]): {
  pair: [string, string];
  result: ContrastResult;
}[] {
  return palette.flatMap(bg =>
    textColors.map(fg => ({
      pair: [fg, bg] as [string, string],
      result: validateContrast(fg, bg, { fontSize: 16 }),
    }))
  );
}
```

For brand-system token generation: enforce contrast at the token level. If a generated `--color-text-primary` against `--color-surface` fails the hybrid validator, regenerate. This is cheaper than catching contrast issues at usage time.

## Edge cases

- **Polarity matters in APCA**: dark-on-light scores differ from light-on-dark for the same color pair. WCAG 2 doesn't capture this; APCA does. For text-on-image overlays where polarity varies, score both directions.
- **Gradient backgrounds**: sample the worst pixel under the type. For dynamic gradient + dynamic text, the gradient should be analyzed across its full extent against the foreground.
- **Semi-transparent foreground**: composite against the background first, then score. CSS `color-mix()` makes this easy in 2026.
- **Color blindness simulation**: pair contrast check with [[Color Psychology|protanopia/deuteranopia/tritanopia simulation]] for any safety-critical UI. Libraries: `color-blind` (npm), or culori's color-vision-deficiency mode.

## Library recommendations (per `feedback_language-preference`)

- **culori** — for color parsing and luminance.
- **apca-w3** — official APCA reference; do not reimplement the coefficients.
- **WCAG 2 formula** — small enough to vendor inline as shown above.

For Python parity: `apca-py` package + manual WCAG 2 implementation.

## Validation

Test cases against published reference values from W3C, Adobe Spectrum, and the APCA reference site. Cross-check at least:
- `#000000` on `#FFFFFF` → WCAG 21:1, APCA ~106 Lc
- `#777777` on `#FFFFFF` → WCAG 4.48:1 (borderline AA), APCA ~63 Lc
- `#FFFF00` on `#FFFFFF` → WCAG 1.07:1 (fail) — classic case where WCAG 2's harsh judgment is right
- `#0000FF` on `#FFFFFF` → WCAG 8.59:1 (passes AAA), APCA ~76 Lc — WCAG over-rates this; pure blue on white is hard to read

## Related pages

[[WCAG Contrast Ratios]] · [[OKLCH]] · [[OKLCH Pair-Relation Classifier]] · [[Color Harmony]] · [[Variable Fonts and Web Typography]] · [[Typographic Principles]] · [[Multilingual Typography]]

## Sources

- W3C WCAG 2.1 / 2.2 Contrast specifications.
- Andrew Somers (2020-2024). APCA / SAPC reference. github.com/Myndex/apca-w3
- W3C WCAG 3 draft (Silver) — informative.
- Adobe Spectrum, Material Design 3 contrast guidance.
