---
title: Aesthetic Measure Stack
type: technique
status: developing
tags: [technique, aesthetics, birkhoff, entropy, fractal, datta, scoring, implementation]
address: c-000215
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Computational Aesthetics]]", "[[Birkhoff's Aesthetic Measure]]", "[[Visual Entropy]]", "[[Fractal Dimension]]", "[[Photo Aesthetic Features]]"]
language: typescript
---

# Aesthetic Measure Stack

A composite implementation of the wiki's four primary aesthetic-measure traditions:

1. **Birkhoff's M = O / C** — order divided by complexity
2. **Visual entropy** — Shannon entropy on image statistics
3. **Fractal dimension** — box-counting D on edge maps
4. **Datta 56-feature** — practical photo-aesthetic features

Each is implemented separately; the stack returns all four scores plus a meta-score combining them.

**Caveat per Phase 3 audit** ([[Berlyne's Arousal-Potential Theory]]): the universal-inverted-U preference theory underpinning these measures has mixed empirical support. Use the stack as **comparative measurement** across generated outputs, not as a universal "aesthetic" oracle.

## Architecture

```typescript
interface AestheticScores {
  birkhoff: { M: number; O: number; C: number };
  entropy: { rgb: number; hsv: number; spatial: number };
  fractal: { dimension: number; rSquared: number };
  datta: Record<string, number>;   // 56 features
  composite: number;                // weighted combination, 0..1
}

async function scoreAesthetics(image: ImageData): Promise<AestheticScores> {
  const [birkhoff, entropy, fractal, datta] = await Promise.all([
    scoreBirkhoff(image),
    scoreEntropy(image),
    scoreFractal(image),
    scoreDatta(image),
  ]);
  const composite = combineScores(birkhoff, entropy, fractal, datta);
  return { birkhoff, entropy, fractal, datta, composite };
}
```

## 1. Birkhoff's M = O / C

Birkhoff (1933) proposed aesthetic value M as Order divided by Complexity. The exact operationalization is task-specific; for 2D images:

```typescript
async function scoreBirkhoff(image: ImageData): Promise<{ M: number; O: number; C: number }> {
  // Complexity proxy: number of independent visual elements (edges, distinct regions, color count)
  const edges = await edgeMap(image);
  const edgeCount = countEdges(edges);
  const regionCount = (await segment(image)).regions.length;
  const distinctColors = countDistinctOklch(image, { tolerance: 0.02 });
  const C = normalize(edgeCount + regionCount + distinctColors, image.width * image.height);

  // Order proxy: symmetries, repetitions, axes
  const symmetries = countSymmetries(image);     // horiz, vert, diag, rotational
  const repetitions = countRepetitions(image);   // self-similar patches
  const gridAlignment = scoreGridAlignment(image);  // how well elements land on a regular grid
  const O = normalize(symmetries + repetitions + gridAlignment, 1);

  const M = C === 0 ? 0 : O / C;
  return { M, O, C };
}
```

**Caveat**: Birkhoff's measure has had **little empirical support** as a universal aesthetic predictor. It's useful for relative comparison within a generative system (e.g., "this iteration is more ordered than the last") and as a sanity check (degenerate outputs score near 0 or ∞).

## 2. Visual entropy

Shannon entropy on three image statistics: per-pixel RGB values, per-pixel HSV values, and spatial-frequency statistics.

```typescript
function scoreEntropy(image: ImageData): { rgb: number; hsv: number; spatial: number } {
  return {
    rgb:     shannonEntropy(rgbHistogram(image, { bins: 32 })),
    hsv:     shannonEntropy(hsvHistogram(image, { hBins: 18, sBins: 8, vBins: 8 })),
    spatial: spatialEntropy(image),
  };
}

function shannonEntropy(histogram: number[]): number {
  const total = histogram.reduce((s, c) => s + c, 0);
  if (total === 0) return 0;
  return -histogram.reduce((s, c) => {
    if (c === 0) return s;
    const p = c / total;
    return s + p * Math.log2(p);
  }, 0);
}

function spatialEntropy(image: ImageData): number {
  // Use 2D-DCT or FFT magnitude; compute entropy across log-spaced frequency bands
  const spectrum = magnitudeSpectrum(toGrayscale(image));
  const bandHistogram = logSpacedBands(spectrum, 16);
  return shannonEntropy(bandHistogram);
}
```

Entropy maps directly to Berlyne's "complexity" axis of [[Berlyne's Arousal-Potential Theory]]. High entropy = high complexity. Per Berlyne, peak preference is at **intermediate** entropy.

## 3. Fractal dimension

Box-counting fractal dimension on the edge map. Many natural images (especially landscapes and Pollock-style abstraction) have fractal dimension around 1.3–1.5, which empirical-aesthetics work suggests correlates with preference.

```typescript
function scoreFractal(image: ImageData): { dimension: number; rSquared: number } {
  const edges = edgeMap(image);
  const sizes = [2, 4, 8, 16, 32, 64, 128];
  const counts = sizes.map(s => boxCount(edges, s));

  // Log-log regression: log(N) = -D * log(s) + const
  const xs = sizes.map(s => Math.log(s));
  const ys = counts.map(c => Math.log(c));
  const { slope, rSquared } = linearRegression(xs, ys);

  return { dimension: -slope, rSquared };
}
```

**Calibration note**: fractal D around 1.3–1.5 correlates with naturalistic preference in many studies, but the correlation is heavily context-dependent (Spehar, Clifford, Newell, Taylor 2003; later replications mixed). Use the score for *comparison* within a generative system, not as a universal predictor.

## 4. Datta 56 features

Datta, Joshi, Li, Wang (2006) defined 56 photo-aesthetic features. The most useful subset for generation evaluation:

```typescript
function scoreDatta(image: ImageData): Record<string, number> {
  return {
    // Color
    avgBrightness: averageBrightness(image),
    avgSaturation: averageSaturation(image),
    avgHue:        averageHue(image),
    colorfulness:  hasler2003Colorfulness(image),  // standard Hasler-Süsstrunk metric
    
    // Spatial composition
    ruleOfThirdsScore: scoreRuleOfThirds(image),
    centerSaliencyMass: centerSaliencyMass(image),
    
    // Texture / detail
    blur:          laplacianVariance(image),       // motion-blur or out-of-focus indicator
    sharpness:     gradientMagnitudeSum(image),
    
    // Brightness distribution
    darknessRatio: pixelsBelowThreshold(image, 0.2),
    lightnessRatio: pixelsAboveThreshold(image, 0.8),
    
    // Wavelet textures (3 levels × 3 channels = 9 features)
    ...waveletStatistics(image),
    
    // ... 56 total in the full Datta set; pick the subset relevant to your task
  };
}
```

For generation, the **colorfulness** (Hasler-Süsstrunk 2003) and **rule-of-thirds** scores are usually highest-signal. **Sharpness** and **blur** are useful for distinguishing finished from in-progress generation.

## Composite scoring

Combining the four is **task-dependent**. A useful default for "is this image well-formed":

```typescript
function combineScores(b: BirkhoffScore, e: EntropyScore, f: FractalScore, d: DattaScore): number {
  // Penalize extremes
  const entropyPenalty = Math.abs(e.rgb - 6.5) / 2;     // ~6.5 is mid-range
  const fractalPenalty = Math.abs(f.dimension - 1.4);   // ~1.4 is natural-image-like
  const colorfulnessReward = d.colorfulness / 100;
  const sharpnessReward = clamp(d.sharpness / 1000, 0, 1);

  return clamp(
    0.3 * colorfulnessReward +
    0.3 * sharpnessReward +
    0.2 * (1 - entropyPenalty) +
    0.2 * (1 - fractalPenalty),
    0, 1
  );
}
```

**Calibrate against your specific task**. The composite is meaningful only relative to a corpus.

## Critical caveats (per Phase 3 audit)

> [!warning] These measures are not a universal aesthetic oracle
> Per the Phase 3 canonicity audit ([[Research - Phase 3 Canonicity Audit]]):
> - **Birkhoff's M** has had little empirical replication as universal aesthetic predictor since 1933.
> - **Berlyne's inverted-U** has mixed support — see [[Berlyne's Arousal-Potential Theory]] critique section.
> - **Fractal D preference** is real but heavily context-dependent.
> - **Datta features** have good ML-utility for predicting human ratings on *photographs*, but generalize less well to abstract or stylized imagery.
>
> Use the stack as:
> 1. **Comparative measurement** within a generation pipeline (this iteration vs. that one)
> 2. **Anomaly detection** (degenerate outputs score near edges)
> 3. **Training signal** when paired with human-rating ground truth
>
> Do NOT use as:
> - A standalone "this image is beautiful" score
> - A cross-cultural universal aesthetic predictor
> - A replacement for human evaluation

## Library recommendations

- **OpenCV.js** for edge maps and image filters
- **wavelets-js** or `pywavelets` (Python parity) for wavelet decomposition
- **Custom TS** for box-counting fractal D (small enough to vendor inline)
- **@xenova/transformers** for learned saliency feeding Datta features

## Performance

- All four measures: ~500-1500 ms per image on mid laptop
- For realtime: only the entropy measures are realtime-capable; the others are batch-only
- For generation evaluation: run all four on each candidate; ~1s overhead per evaluation

## Related pages

[[Computational Aesthetics]] · [[Birkhoff's Aesthetic Measure]] · [[Visual Entropy]] · [[Fractal Dimension]] · [[Photo Aesthetic Features]] · [[Berlyne's Arousal-Potential Theory]] · [[Galanter's Generative Art Framework]] · [[Directed Tension Score]] · [[Visual Hierarchy and Negative Space Scoring]]

## Sources

- Birkhoff, G. D. (1933). *Aesthetic Measure*. Harvard UP.
- Berlyne, D. E. (1971). *Aesthetics and Psychobiology*. Appleton-Century-Crofts.
- Datta, R., Joshi, D., Li, J., & Wang, J. Z. (2006). Studying aesthetics in photographic images using a computational approach. ECCV.
- Hasler, D., & Süsstrunk, S. (2003). Measuring colorfulness in natural images. SPIE.
- Spehar, B., Clifford, C., Newell, B., & Taylor, R. (2003). Universal aesthetic of fractals. *Computers & Graphics* 27, 813–820.
- Galanter, P. (2012). Computational aesthetic evaluation: Past and future. *Computers and Creativity*.
