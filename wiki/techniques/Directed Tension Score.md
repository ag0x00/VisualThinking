---
title: Directed Tension Score
type: technique
status: developing
tags: [technique, composition, arnheim, directed-tension, scoring, implementation]
address: c-000213
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Directed Tension]]", "[[Dynamics of Obliqueness]]", "[[Expression as Configuration of Forces]]"]
language: typescript
---

# Directed Tension Score

Implementation of Arnheim's [[Directed Tension]] thesis: the visual "dynamism" of an image as a weighted sum of **five structural generators**. Top-priority research project from Arnheim Sweep 3.

The five generators:

1. **Obliqueness** — deviation of dominant axes from horizontal/vertical
2. **Asymmetry** — imbalance of visual weight around the center
3. **Truncation** — figures cropped by frame edges
4. **Gradient** — tonal/spatial gradients (depth, light)
5. **Convergence** — converging lines toward focal regions

A high score predicts "dynamic," "alive," "active"; a low score predicts "still," "balanced," "calm."

**Use cases**: composition scoring in generative art evaluation, comparing generated images against intended dynamism targets, training-signal for figure-composition optimization.

## Pipeline

```typescript
import * as tf from "@tensorflow/tfjs";  // or onnxruntime-web for ONNX-only

interface DirectedTensionScore {
  total: number;            // weighted sum, normalized 0..1
  obliqueness: number;
  asymmetry: number;
  truncation: number;
  gradient: number;
  convergence: number;
  generators: Record<string, number>;
}

async function scoreDirectedTension(image: ImageData): Promise<DirectedTensionScore> {
  // 1. Edge map (Canny or learned)
  const edges = await computeEdgeMap(image);

  // 2. Dominant axis extraction via Hough transform on edges
  const lines = houghLines(edges, { minLength: 0.1 * image.width });

  // 3. Compute each generator
  const obliqueness = scoreObliqueness(lines);
  const asymmetry   = scoreAsymmetry(image);
  const truncation  = scoreTruncation(edges, image);
  const gradient    = scoreGradient(image);
  const convergence = scoreConvergence(lines);

  // 4. Weighted sum (calibration weights — see below)
  const weights = { obliqueness: 0.25, asymmetry: 0.20, truncation: 0.15, gradient: 0.15, convergence: 0.25 };
  const total =
    weights.obliqueness * obliqueness +
    weights.asymmetry * asymmetry +
    weights.truncation * truncation +
    weights.gradient * gradient +
    weights.convergence * convergence;

  return {
    total, obliqueness, asymmetry, truncation, gradient, convergence,
    generators: { obliqueness, asymmetry, truncation, gradient, convergence },
  };
}
```

## Generator implementations

### 1. Obliqueness

```typescript
function scoreObliqueness(lines: Line[]): number {
  // For each line, distance of its angle from 0 / 90 / 180 / 270 degrees.
  // Image is "oblique" when the dominant lines are NOT axis-aligned.
  if (lines.length === 0) return 0;
  const obliquenesses = lines.map(line => {
    const angleDeg = (Math.atan2(line.dy, line.dx) * 180 / Math.PI + 180) % 90;
    const distFromAxis = Math.min(angleDeg, 90 - angleDeg);  // 0 at axis, 45 at max-oblique
    return distFromAxis / 45;
  });
  // Length-weight: longer lines matter more
  const totalLength = lines.reduce((s, l) => s + l.length, 0);
  const weighted = lines.reduce((s, l, i) => s + l.length * obliquenesses[i], 0);
  return weighted / totalLength;
}
```

### 2. Asymmetry

```typescript
function scoreAsymmetry(image: ImageData): number {
  // Visual weight = saliency-weighted pixel mass.
  // Use a fast saliency proxy: gradient magnitude + center-bias correction.
  const saliency = computeSaliency(image);   // 2D map
  const W = image.width, H = image.height;
  let sumL = 0, sumR = 0, sumT = 0, sumB = 0, total = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const s = saliency[y * W + x];
      total += s;
      if (x < W / 2) sumL += s; else sumR += s;
      if (y < H / 2) sumT += s; else sumB += s;
    }
  }
  const horizAsym = Math.abs(sumL - sumR) / total;
  const vertAsym = Math.abs(sumT - sumB) / total;
  // Combined; horizontal asymmetry weighs more (Arnheim: vertical axis is stronger)
  return 0.6 * horizAsym + 0.4 * vertAsym;
}
```

### 3. Truncation

```typescript
function scoreTruncation(edges: ImageData, image: ImageData): number {
  // Edges intersecting the frame boundary indicate truncated figures.
  // Higher density at the boundary = more truncation = more tension.
  const W = image.width, H = image.height;
  const border = 4;  // pixels
  let boundaryEdges = 0;
  let totalEdges = 0;
  const data = edges.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const e = data[(y * W + x) * 4];  // single channel
      if (e > 128) {
        totalEdges++;
        if (x < border || x >= W - border || y < border || y >= H - border) {
          boundaryEdges++;
        }
      }
    }
  }
  if (totalEdges === 0) return 0;
  const boundaryRatio = boundaryEdges / totalEdges;
  // Expected baseline: ~ (border * perimeter) / total area. Subtract baseline.
  const baseline = (border * 2 * (W + H)) / (W * H);
  return Math.max(0, Math.min(1, (boundaryRatio - baseline) * 5));
}
```

### 4. Gradient

```typescript
function scoreGradient(image: ImageData): number {
  // Spatial gradient of luminance, integrated. Smooth gradients = depth/light cues = directed tension.
  // Distinguish smooth gradients from high-frequency noise: use Gaussian-blurred image, then gradient magnitude.
  const blurred = gaussianBlur(image, 8);
  const gradMag = gradientMagnitude(blurred);
  // Long-range gradient: ratio of low-spatial-frequency gradient to total
  const dcCoeff = lowPass(gradMag, 32);
  const total = sum(gradMag);
  return total === 0 ? 0 : sum(dcCoeff) / total;
}
```

### 5. Convergence

```typescript
function scoreConvergence(lines: Line[]): number {
  // Find vanishing points: pairs of lines whose extensions intersect inside or near the image.
  // High convergence = many lines pointing toward common foci.
  let convergencePoints = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const intersection = intersect(lines[i], lines[j]);
      if (intersection && isNearImage(intersection, lines[0].W, lines[0].H, 0.3)) {
        convergencePoints++;
      }
    }
  }
  const numPairs = (lines.length * (lines.length - 1)) / 2;
  return numPairs === 0 ? 0 : Math.min(1, convergencePoints / numPairs);
}
```

## Calibration

The 5 weights (0.25 / 0.20 / 0.15 / 0.15 / 0.25 above) are conservative seeds. Calibration:

1. **Labeled dataset**: ~200 images, each rated for "dynamism" on a 1-7 scale by 5+ annotators. Sources: AVA dataset filtered for "dynamism" / "movement" tags + manual ratings on a balanced art-historical set.
2. **Fit weights**: linear regression (or ridge / lasso for regularization) of human dynamism rating against the 5 generator scores.
3. **Validate**: held-out 20% test set. Spearman correlation > 0.6 against human ratings is the goal.
4. **Persist** in `.vault-meta/directed-tension-weights.json`.

The reasonable expectation is that **obliqueness + convergence** dominate the predicted weight. Truncation may be lower-impact than Arnheim claimed because contemporary photography uses truncation as a default convention, reducing its discriminative power.

## Edge-map and Hough implementation

- **Edge map**: classical Canny via OpenCV.js, or a learned edge detector (Holistically-Nested Edge Detection) via ONNX. The learned detector is more semantic; Canny is faster.
- **Hough lines**: OpenCV.js `HoughLinesP`. For Pure-TS, use `hough-transform` package or roll the standard accumulator.
- **Saliency**: at least three options — gradient-magnitude (simplest), Itti-Koch (classic), or learned (BASNet/U2-Net via ONNX). Quality vs latency tradeoff.

## Library recommendations

- **OpenCV.js** — for edge maps, Hough lines. Heaviest of the JS options (~9 MB wasm); use lazy loading.
- **@tensorflow/tfjs** + saliency model — for learned saliency.
- **@xenova/transformers** — for ONNX-based saliency/edge models.

For Python parity (offline batch): OpenCV + scikit-image + Pillow.

## Performance

- Single image: 200–800 ms on mid laptop with OpenCV.js. Acceptable for offline batch + per-generation evaluation.
- For realtime: pre-compute on keyframes only; interpolate between.

## Validation

Test against Arnheim's worked examples:
- Renaissance contrapposto figures should score high on obliqueness + convergence + gradient
- Egyptian frontal-symmetric statuary should score near minimum
- Baroque action paintings (Caravaggio, Bernini): high on all 5
- Mondrian grids: low obliqueness, may score high on asymmetry depending on the work
- Random uniform-noise images: should score near 0 on all 5 (noise has no structure)

## Extensions

- **Anisotropy**: a vector-valued score (per-quadrant) rather than scalar, identifying *direction* of tension as well as magnitude.
- **Figural decomposition**: run on each detected figure separately + on the figure-ground relationship.
- **Combine with [[Contrapposto Scorer]]** for figurative imagery: figural pose-tension feeds the asymmetry + convergence terms.

## Related pages

[[Directed Tension]] · [[Dynamics of Obliqueness]] · [[Expression as Configuration of Forces]] · [[Visual Balance]] · [[Simplicity (Arnheim)]] · [[Aesthetic Measure Stack]] · [[Visual Hierarchy and Negative Space Scoring]] · [[Contrapposto Scorer]]

## Sources

- Arnheim, R. (1974). *Art and Visual Perception*, Ch. IX–X.
- Arnheim, R. (1988). *The Power of the Center*.
- Datta, R., Joshi, D., Li, J., & Wang, J. Z. (2006). Studying aesthetics in photographic images. ECCV. (The 56-feature aesthetic-measure tradition.)
- AVA dataset: Murray, N., Marchesotti, L., & Perronnin, F. (2012). AVA: A large-scale database for aesthetic visual analysis. CVPR.
