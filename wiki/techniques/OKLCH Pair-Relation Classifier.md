---
title: OKLCH Pair-Relation Classifier
type: technique
status: developing
tags: [technique, color, oklch, arnheim, classifier, implementation]
address: c-000211
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Arnheim's Color Syntax]]", "[[OKLCH]]", "[[Color Harmony]]"]
language: typescript
---

# OKLCH Pair-Relation Classifier

Implementation of [[Arnheim's Color Syntax]]: classifying any color pair into one of four structural relations — **identity**, **similarity**, **contrast**, **mutual completion** — using [[OKLCH]] as the perceptual color space. The top-priority research project from Arnheim Sweep 2.

**Use cases**: palette validation in generative art, harmony scoring for branding, color-pair classification in computational aesthetics evaluation.

## The four pair-relations (from [[Arnheim's Color Syntax]])

| Relation | Definition |
|---|---|
| **Identity** | Same hue, possibly different lightness/chroma. The pair shares everything except brightness/saturation. |
| **Similarity** | Adjacent hues, similar lightness, similar chroma. Pair "blends." |
| **Contrast** | Distant hues, no completion structure. Pair "clashes" without resolution. |
| **Mutual completion** | Complementary hues — each contains the other's complement-need. Pair "resolves." |

## Inputs

A pair of color values in any of these formats: sRGB hex, sRGB triplet, OKLCH triplet, CIELAB. Convert via [[culori]] or similar.

## Algorithm

```typescript
import { converter, differenceEuclidean, formatHex, parse } from "culori";

interface OklchColor { l: number; c: number; h: number; }
type PairRelation = "identity" | "similarity" | "contrast" | "mutual-completion";

const toOklch = converter("oklch");

function classifyPair(a: string, b: string): {
  relation: PairRelation;
  scores: Record<PairRelation, number>;
  hueDelta: number;
  lightnessDelta: number;
  chromaDelta: number;
} {
  const A = toOklch(parse(a)) as OklchColor;
  const B = toOklch(parse(b)) as OklchColor;

  const dL = Math.abs(A.l - B.l);
  const dC = Math.abs(A.c - B.c);
  const dH = hueDistance(A.h, B.h);  // shortest arc, 0-180

  const scores: Record<PairRelation, number> = {
    identity:           identityScore(dH, dC),
    similarity:         similarityScore(dH, dL, dC),
    "mutual-completion": completionScore(dH, A.c, B.c),
    contrast:           contrastScore(dH, A.c, B.c),
  };

  const relation = (Object.entries(scores) as [PairRelation, number][])
    .reduce((best, cur) => cur[1] > best[1] ? cur : best)[0];

  return { relation, scores, hueDelta: dH, lightnessDelta: dL, chromaDelta: dC };
}

function hueDistance(h1: number | undefined, h2: number | undefined): number {
  if (h1 == null || h2 == null) return 0;  // chromatic-axis pole; hue undefined
  const d = Math.abs(h1 - h2) % 360;
  return d > 180 ? 360 - d : d;
}

// Conservative thresholds — calibrate against labeled palettes.
function identityScore(dH: number, dC: number): number {
  // Same hue, allow some chroma variation
  return dH < 5 ? 1 - dH / 5 : 0;
}

function similarityScore(dH: number, dL: number, dC: number): number {
  // Adjacent hues, similar everything else
  if (dH > 30) return 0;
  const hueFit = 1 - dH / 30;
  const lightFit = Math.max(0, 1 - dL / 0.3);
  const chromaFit = Math.max(0, 1 - dC / 0.1);
  return hueFit * lightFit * chromaFit;
}

function completionScore(dH: number, cA: number, cB: number): number {
  // Complementary: hue distance near 180°
  // Require both colors to have meaningful chroma — gray pairs aren't completing
  const hueFit = Math.max(0, 1 - Math.abs(dH - 180) / 30);
  const chromaFit = Math.min(cA, cB) / 0.15;  // both saturated
  return hueFit * Math.min(1, chromaFit);
}

function contrastScore(dH: number, cA: number, cB: number): number {
  // Distant hues that aren't complementary
  if (dH < 60) return 0;
  if (Math.abs(dH - 180) < 30) return 0;  // that's completion
  return Math.min(1, dH / 120) * Math.min(cA, cB) / 0.15;
}
```

## Calibration

The thresholds above are conservative seeds. Calibration procedure:

1. Curate a labeled set: 200+ color pairs, each tagged `identity`, `similarity`, `contrast`, `mutual-completion` by 3+ annotators. Use disagreement-discard or majority vote.
2. Run the classifier; build confusion matrix.
3. Adjust thresholds to maximize macro-F1 across the 4 classes.
4. Persist thresholds in `.vault-meta/oklch-classifier-thresholds.json`.
5. Re-run quarterly against expanded dataset.

## Validation approach

- **Held-out test set**: 20% of labeled pairs, never seen during calibration.
- **Per-class accuracy** matters more than overall — completion is the rarest, hardest class.
- **Cross-cultural slice**: test against East-Asian + Western annotator subsets separately. Per [[Cultural Variability in Body Language]] and [[Color Psychology]], expect some annotator-cluster disagreement on completion pairs.

## Library recommendations (per `feedback_language-preference`)

- **[culori](https://culorijs.org/)** — primary; modern OKLCH support, tree-shakable, ~30 kB. Default choice.
- **[chroma.js](https://gka.github.io/chroma.js/)** — alternative; established, slightly larger. Use if already integrated.
- **Color.js (CSS Color)** — W3C reference implementation; verbose but spec-canonical.

For Python parity (when only Python tooling fits): `colour-science` for OKLCH conversion + the algorithm above ported directly.

## Performance

For batch palette analysis: ~100k pair comparisons per second on a single thread (no GPU needed). For realtime generation, palette analysis is negligible overhead.

## Extensions

- **N-tuple analysis**: extend to triples / quads for full-palette structural classification. Most palettes contain multiple pair-relations simultaneously — a healthy palette typically has at least one completion pair plus identity/similarity backbone.
- **Warm/cool deviation overlay**: the [[Warm and Cool Colors]] deviation theory predicts that pairs deviating consistently from the "neutral axis" feel "warm" or "cool" together. Add a 5th derived feature.
- **OKLCH ΔE production thresholds**: identity tolerance for branding (ΔE_OK < 2 for "indistinguishable"), similarity tolerance for design systems (ΔE_OK < 5 for "in the same step").

## Related pages

[[Arnheim's Color Syntax]] · [[OKLCH]] · [[Color Harmony]] · [[Color Psychology]] · [[Complementary Colors]] · [[Warm and Cool Colors]] · [[Contrast Checking Pipeline]] · [[Hue Brightness Saturation]] · [[CIEDE2000]]

## Sources

- Arnheim, R. (1974). *Art and Visual Perception*, Ch. VII.
- Björn Ottosson (2020). "A perceptual color space for image processing." (OKLCH/OKLab origin.)
- culori documentation: culorijs.org
