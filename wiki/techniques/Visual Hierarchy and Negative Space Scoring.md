---
title: Visual Hierarchy and Negative Space Scoring
type: technique
status: developing
tags: [technique, composition, hierarchy, negative-space, scoring, implementation]
address: c-000214
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Visual Hierarchy and Typography]]", "[[Negative Space]]", "[[Swiss Grid System]]", "[[Ma and Yohaku no Bi]]"]
language: typescript
---

# Visual Hierarchy and Negative Space Scoring

Computational scoring for two related graphic-design fundamentals: **visual hierarchy** (which elements draw the eye first, second, third) and **negative space** (the figure-ground ratio and structural use of empty area).

**Use cases**: generated-layout validation, editorial / poster / web-page composition scoring, branding identity audit, music-reactive layout pacing.

## Part 1: Visual hierarchy

Visual hierarchy is the **ordered sequence of attention-grabs** in a composition. A working hierarchy has clear primary, secondary, tertiary, etc. levels — viewers' eyes land where intended, in the intended order.

### Saliency-based hierarchy detection

```typescript
import * as tf from "@tensorflow/tfjs";

interface HierarchyLevel {
  rank: number;            // 1 = primary attention, 2 = secondary, ...
  region: { x: number; y: number; w: number; h: number };
  saliencyScore: number;   // 0..1 normalized
  area: number;
  proxy: string;           // e.g., "largest type", "highest-contrast figure"
}

async function detectHierarchy(image: ImageData): Promise<HierarchyLevel[]> {
  // 1. Compute saliency map
  const saliency = await computeSaliencyMap(image);   // BASNet / U2-Net / Itti-Koch

  // 2. Non-maximum suppression: find peaks
  const peaks = findSaliencyPeaks(saliency, { minDistance: 0.1 * image.width });

  // 3. Region-grow around each peak to its local salient blob
  const regions = peaks.map(p => growRegion(saliency, p, { threshold: 0.6 * p.value }));

  // 4. Rank by integrated saliency (peak intensity × area)
  const ranked = regions
    .map(r => ({ ...r, score: r.peakValue * Math.sqrt(r.area) }))
    .sort((a, b) => b.score - a.score);

  return ranked.map((r, i) => ({
    rank: i + 1,
    region: r.bbox,
    saliencyScore: r.score,
    area: r.area,
    proxy: classifyRegion(r, image),
  }));
}
```

### Hierarchy quality score

```typescript
function scoreHierarchyQuality(levels: HierarchyLevel[]): {
  separation: number;        // gap between rank 1 and rank 2 — well-separated hierarchy
  count: number;             // 1-3 levels is good; 4+ is muddled
  primaryDominance: number;  // 0..1 — how clearly rank-1 leads
} {
  if (levels.length === 0) return { separation: 0, count: 0, primaryDominance: 0 };
  const s1 = levels[0].saliencyScore;
  const s2 = levels[1]?.saliencyScore ?? 0;
  const sN = levels.reduce((s, l) => s + l.saliencyScore, 0);

  return {
    separation: s1 > 0 ? (s1 - s2) / s1 : 0,
    count: levels.length,
    primaryDominance: sN > 0 ? s1 / sN : 0,
  };
}
```

### Hierarchy guidelines

| Metric | Healthy range | Failure mode |
|---|---|---|
| **Levels detected (above 0.3 normalized)** | 2–4 | 1 = no hierarchy; 5+ = muddled |
| **Primary dominance** | > 0.4 | Below: nothing clearly leads — competing focal regions |
| **Rank-1 to rank-2 gap** | > 0.25 | Below: tied for attention; viewer doesn't know where to look first |
| **Primary region area** | < 30% of total saliency mass | Above: not "hierarchy," just one dominant figure |

For [[Swiss Grid System]] / editorial work, hierarchy via type-size ratios should yield 3–5 detected levels with smooth separation.

## Part 2: Negative space scoring

Negative space is the **figure-free area** of a composition. [[Ma and Yohaku no Bi]] (the Japanese tradition) treats negative space as actively meaningful; Swiss design treats it as primary structural material; Western tradition often treats it as residual.

### Figure-ground segmentation

```typescript
async function segmentFigure(image: ImageData): Promise<ImageData> {
  // Use SAM-2 or Detectron2-Lite for general; foreground-segmentation models for graphic-design layouts.
  // For type-on-background detection: text-detection model (CRAFT, EAST, DBNet) + figure model.
  return await runSAM2(image);  // returns binary mask
}

function negativeSpaceRatio(figureMask: ImageData): number {
  let figure = 0, total = 0;
  const d = figureMask.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] > 128) figure++;
    total++;
  }
  return 1 - figure / total;
}
```

### Active vs passive negative space

Active negative space has shape — the space itself reads as figural. Passive negative space is residual.

```typescript
interface NegativeSpaceAnalysis {
  ratio: number;              // 0..1, fraction of frame that's not figure
  largestRegionArea: number;  // size of biggest single neg-space blob
  regionCount: number;        // how many disconnected neg-space regions
  edgeContactRatio: number;   // how much neg-space touches frame edge (high = passive border, low = active interior)
  shapeIndex: number;         // compactness of negative regions — high = simple, "active"
}

function analyzeNegativeSpace(figureMask: ImageData): NegativeSpaceAnalysis {
  const inverseMask = invert(figureMask);
  const regions = connectedComponents(inverseMask);

  const total = figureMask.width * figureMask.height;
  const largest = Math.max(...regions.map(r => r.area));
  const edgeContact = regions.reduce((s, r) => s + r.boundaryEdgeLength, 0);
  const totalPerimeter = regions.reduce((s, r) => s + r.perimeter, 0);

  // Shape index: 4π × area / perimeter² — circle = 1, complex shape → 0
  const compactness = regions.map(r => (4 * Math.PI * r.area) / (r.perimeter * r.perimeter));
  const meanCompactness = compactness.reduce((s, c) => s + c, 0) / Math.max(1, regions.length);

  return {
    ratio: 1 - countMask(figureMask) / total,
    largestRegionArea: largest / total,
    regionCount: regions.length,
    edgeContactRatio: totalPerimeter > 0 ? edgeContact / totalPerimeter : 0,
    shapeIndex: meanCompactness,
  };
}
```

### Negative space guidelines

| Tradition | Ratio target | Active vs passive |
|---|---|---|
| **[[Swiss Grid System]]** | 0.4–0.6 | Mixed — structural rhythm |
| **[[Ma and Yohaku no Bi|Japanese ma]]** | 0.6–0.85 | Active — space carries meaning |
| **Maximalist editorial** | 0.1–0.3 | Passive — residual |
| **Dieter Rams / Vignelli minimalism** | 0.5–0.75 | Active |
| **Web hero sections (2026 convention)** | 0.5–0.7 | Active around primary copy |

## Combined evaluation

```typescript
interface CompositionScore {
  hierarchy: ReturnType<typeof scoreHierarchyQuality>;
  negativeSpace: NegativeSpaceAnalysis;
  verdict: "strong" | "acceptable" | "muddled" | "empty";
}

async function scoreComposition(image: ImageData): Promise<CompositionScore> {
  const levels = await detectHierarchy(image);
  const hierarchy = scoreHierarchyQuality(levels);

  const figureMask = await segmentFigure(image);
  const negativeSpace = analyzeNegativeSpace(figureMask);

  let verdict: CompositionScore["verdict"];
  if (negativeSpace.ratio > 0.95) verdict = "empty";
  else if (hierarchy.separation > 0.25 && hierarchy.primaryDominance > 0.4)
    verdict = negativeSpace.ratio > 0.4 ? "strong" : "acceptable";
  else verdict = "muddled";

  return { hierarchy, negativeSpace, verdict };
}
```

## Calibration

Test set: 100+ designs labeled by 3+ annotators on:
- Hierarchy clarity (1-5)
- Negative space character (active / passive / minimal / cluttered)
- Overall composition quality (1-5)

Fit thresholds to maximize agreement with majority labels. Branded design systems benefit from per-brand calibration (Vignelli vs. Magazine vs. Pentagram differ on what "good hierarchy" means).

## Library recommendations

- **Saliency**: `@xenova/transformers` running BASNet/U2-Net via ONNX. Or `tract` for desktop offline.
- **Segmentation**: SAM 2 via ONNX, or `@xenova/transformers` with mobilenet-segmentation for fast cases.
- **Connected components**: `connected-components-3d` on npm, or roll a flood-fill in pure TS.
- **Text detection**: `@xenova/transformers` running CRAFT or EAST for layouts with type.

For Python parity: OpenCV `cv2.connectedComponents`, scikit-image `regionprops`, segment-anything Python.

## Performance

- Hierarchy detection: 200–500 ms via learned saliency
- Segmentation: 300–800 ms via SAM 2
- Total: ~1 second per image. Suitable for batch evaluation, not realtime per-frame.

## Validation

Reference cases:
- Swiss grid layouts (Müller-Brockmann, Hofmann) → strong hierarchy, mid neg-space, low region count
- Japanese sumi-e ink paintings → strong hierarchy, high neg-space, high compactness (active ma)
- Cluttered tabloid covers → muddled hierarchy, low neg-space
- Apple product pages → strong hierarchy, high neg-space, simple region structure

## Related pages

[[Visual Hierarchy and Typography]] · [[Negative Space]] · [[Swiss Grid System]] · [[Ma and Yohaku no Bi]] · [[Negative Space Techniques]] · [[Negative Space in Motion]] · [[Typographic Principles]] · [[Directed Tension Score]] · [[Aesthetic Measure Stack]]

## Sources

- Müller-Brockmann, J. (1981). *Grid Systems in Graphic Design*. Niggli.
- Hofmann, A. (1965). *Graphic Design Manual*. Niggli.
- Kepes, G. (1944). *Language of Vision*. Theobald.
- BASNet: Qin et al. (2019). "BASNet: Boundary-Aware Salient Object Detection." CVPR.
- SAM 2: Ravi et al. (2024). "SAM 2: Segment Anything in Images and Videos." Meta AI.
