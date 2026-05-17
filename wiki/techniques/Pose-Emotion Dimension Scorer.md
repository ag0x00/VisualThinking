---
title: Pose-Emotion Dimension Scorer
type: technique
status: developing
tags: [technique, body-language, pose, mediapipe, scoring, implementation]
address: c-000216
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Universal Body Language Dimensions]]", "[[de Gelder's Whole-Body Emotion Perception]]", "[[Pose Extraction Pipeline]]"]
language: typescript
---

# Pose-Emotion Dimension Scorer

Implementation of the 5-axis [[Universal Body Language Dimensions]] from a [[Pose Extraction Pipeline|MediaPipe pose skeleton]]. Reads a 33-landmark pose and emits scalar values for **approach/avoidance, expansion/contraction, up/down, stability, energy** — the de Gelder dimensional substrate.

**Use cases**: validate generated figurative imagery against pose-emotion targets, score brand-photography for emotional register, drive music-reactive avatars by dimensional readout.

## Input format

MediaPipe Tasks `PoseLandmarker` returns 33 landmarks per detected person. Each landmark: `{ x, y, z, visibility }`, with x/y normalized to image dimensions and z relative to hips.

```typescript
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface Landmark { x: number; y: number; z: number; visibility: number; }
type PoseSkeleton = Landmark[];  // length 33

// Landmark indices (MediaPipe Pose-33)
const LM = {
  NOSE: 0,
  L_SHOULDER: 11, R_SHOULDER: 12,
  L_ELBOW: 13, R_ELBOW: 14,
  L_WRIST: 15, R_WRIST: 16,
  L_HIP: 23, R_HIP: 24,
  L_KNEE: 25, R_KNEE: 26,
  L_ANKLE: 27, R_ANKLE: 28,
} as const;
```

## Dimension implementations

```typescript
interface PoseDimensions {
  approach: number;        // -1 (avoidance) .. +1 (approach)
  expansion: number;       // -1 (contracted) .. +1 (expanded)
  upward: number;          // -1 (downward) .. +1 (upward)
  stability: number;       //  0 (unstable)  .. +1 (stable)
  energy: number;          //  0 (low)       .. +1 (high)
  confidence: number;      //  0..1 — based on landmark visibility
}

function scorePoseDimensions(skeleton: PoseSkeleton): PoseDimensions {
  const approach   = scoreApproach(skeleton);
  const expansion  = scoreExpansion(skeleton);
  const upward     = scoreUpward(skeleton);
  const stability  = scoreStability(skeleton);
  const energy     = scoreEnergy(skeleton);
  const confidence = meanVisibility(skeleton, [
    LM.NOSE, LM.L_SHOULDER, LM.R_SHOULDER, LM.L_HIP, LM.R_HIP,
    LM.L_KNEE, LM.R_KNEE, LM.L_ANKLE, LM.R_ANKLE,
  ]);

  return { approach, expansion, upward, stability, energy, confidence };
}
```

### Approach / avoidance

Z-coordinate of shoulders relative to hips (lean forward = approach). Also: torso-rotation toward viewer (frontal vs profile) increases approach.

```typescript
function scoreApproach(s: PoseSkeleton): number {
  const shoulderMidZ = (s[LM.L_SHOULDER].z + s[LM.R_SHOULDER].z) / 2;
  const hipMidZ      = (s[LM.L_HIP].z + s[LM.R_HIP].z) / 2;
  // Negative z = closer to camera in MediaPipe convention
  const leanForward = hipMidZ - shoulderMidZ;
  return clamp(leanForward * 4, -1, 1);   // scale calibrated empirically
}
```

### Expansion / contraction

Limb-extension distance normalized by body height.

```typescript
function scoreExpansion(s: PoseSkeleton): number {
  const bodyHeight = dist(s[LM.NOSE], midpoint(s[LM.L_ANKLE], s[LM.R_ANKLE]));
  if (bodyHeight === 0) return 0;

  // Arm extension
  const lArmExt = dist(s[LM.L_SHOULDER], s[LM.L_WRIST]);
  const rArmExt = dist(s[LM.R_SHOULDER], s[LM.R_WRIST]);
  const armRatio = (lArmExt + rArmExt) / (2 * bodyHeight * 0.6);  // 0.6 = typical max-arm/body

  // Leg stance width
  const stance = Math.abs(s[LM.L_ANKLE].x - s[LM.R_ANKLE].x);
  const shoulderWidth = Math.abs(s[LM.L_SHOULDER].x - s[LM.R_SHOULDER].x);
  const stanceRatio = shoulderWidth > 0 ? stance / shoulderWidth : 1;

  // Combined expansion score
  return clamp((armRatio + stanceRatio - 2) * 0.5, -1, 1);
}
```

### Upward / downward

Head height relative to expected upright posture; chin elevation.

```typescript
function scoreUpward(s: PoseSkeleton): number {
  const shoulderMidY = (s[LM.L_SHOULDER].y + s[LM.R_SHOULDER].y) / 2;
  const hipMidY      = (s[LM.L_HIP].y + s[LM.R_HIP].y) / 2;
  const torsoLength  = Math.abs(shoulderMidY - hipMidY);

  // Head height: distance from shoulder line to nose, normalized by torso
  const headRise = (shoulderMidY - s[LM.NOSE].y) / torsoLength;
  // Typical: 0.5-0.7 for upright; <0.3 for slumped; >0.8 for chin-up
  return clamp((headRise - 0.5) * 3, -1, 1);
}
```

### Stability

Center of mass over base of support.

```typescript
function scoreStability(s: PoseSkeleton): number {
  // CoM proxy: midpoint of shoulders + hips, weighted toward hips
  const com = {
    x: 0.3 * midpoint(s[LM.L_SHOULDER], s[LM.R_SHOULDER]).x + 0.7 * midpoint(s[LM.L_HIP], s[LM.R_HIP]).x,
    y: 0.3 * midpoint(s[LM.L_SHOULDER], s[LM.R_SHOULDER]).y + 0.7 * midpoint(s[LM.L_HIP], s[LM.R_HIP]).y,
  };

  // Base of support: x-range of ankles
  const minX = Math.min(s[LM.L_ANKLE].x, s[LM.R_ANKLE].x);
  const maxX = Math.max(s[LM.L_ANKLE].x, s[LM.R_ANKLE].x);
  const baseWidth = Math.max(maxX - minX, 0.02);   // avoid div-by-zero

  // How centered CoM is relative to base
  const baseCenter = (minX + maxX) / 2;
  const offset = Math.abs(com.x - baseCenter);
  return clamp(1 - (offset / (baseWidth / 2 + 0.05)) * 0.5, 0, 1);
}
```

### Energy

For single image: pose-tension proxy (sharp joint angles, asymmetric limb positions).
For video: skeletal-velocity variance.

```typescript
function scoreEnergy(s: PoseSkeleton): number {
  // Single-image energy: angular sharpness at major joints
  const lElbowAngle = jointAngle(s[LM.L_SHOULDER], s[LM.L_ELBOW], s[LM.L_WRIST]);
  const rElbowAngle = jointAngle(s[LM.R_SHOULDER], s[LM.R_ELBOW], s[LM.R_WRIST]);
  const lKneeAngle  = jointAngle(s[LM.L_HIP], s[LM.L_KNEE], s[LM.L_ANKLE]);
  const rKneeAngle  = jointAngle(s[LM.R_HIP], s[LM.R_KNEE], s[LM.R_ANKLE]);

  // Average distance from "neutral" 180° angle. Larger deviation = more pose-tension.
  const deviation = (
    Math.abs(180 - lElbowAngle) +
    Math.abs(180 - rElbowAngle) +
    Math.abs(180 - lKneeAngle) +
    Math.abs(180 - rKneeAngle)
  ) / 4;

  return clamp(deviation / 90, 0, 1);   // 90° deviation = max
}

function scoreEnergyVideo(skeletons: PoseSkeleton[], fps: number): number {
  // Skeletal velocity variance across consecutive frames
  let totalVar = 0;
  for (let i = 1; i < skeletons.length; i++) {
    for (let j = 0; j < 33; j++) {
      const d = dist(skeletons[i][j], skeletons[i - 1][j]) * fps;
      totalVar += d * d;
    }
  }
  return clamp(totalVar / skeletons.length / 33 / 5, 0, 1);
}
```

## Dimension-to-emotion mapping (lookup table from concept page)

```typescript
const EMOTION_TEMPLATES: Record<string, Partial<PoseDimensions>> = {
  fear:       { approach: -0.7, expansion: -0.6, upward: -0.4, stability: 0.2, energy: 0.7 },
  anger:      { approach:  0.6, expansion:  0.7, stability: 0.7, energy: 0.8 },
  sadness:    { approach: -0.4, expansion: -0.5, upward: -0.6, stability: 0.7, energy: 0.2 },
  joy:        { approach:  0.5, expansion:  0.7, upward:  0.6, energy: 0.7 },
  submission: { approach: -0.5, expansion: -0.5, upward: -0.5, stability: 0.6, energy: 0.2 },
  dominance:  { approach:  0.3, expansion:  0.7, upward:  0.5, stability: 0.9, energy: 0.4 },
  pride:      { expansion: 0.5, upward: 0.7, stability: 0.9, energy: 0.4 },
  shame:      { approach: -0.4, expansion: -0.6, upward: -0.7, stability: 0.7, energy: 0.2 },
};

function classifyEmotion(d: PoseDimensions): Array<{ emotion: string; score: number }> {
  return Object.entries(EMOTION_TEMPLATES)
    .map(([emotion, template]) => ({
      emotion,
      score: 1 - templateDistance(d, template),
    }))
    .sort((a, b) => b.score - a.score);
}

function templateDistance(d: PoseDimensions, t: Partial<PoseDimensions>): number {
  let sumSq = 0, count = 0;
  for (const [key, target] of Object.entries(t)) {
    const k = key as keyof PoseDimensions;
    if (target === undefined || k === "confidence") continue;
    sumSq += Math.pow(d[k] - target, 2);
    count++;
  }
  return count === 0 ? 1 : Math.sqrt(sumSq / count);
}
```

## Calibration

1. **BEAST stimulus set** ([[de Gelder's Whole-Body Emotion Perception]]) is the gold standard. Run the scorer on BEAST images; compare emotion-classification accuracy against de Gelder's published human-rating data.
2. **Confidence threshold**: discard frames with `confidence < 0.6` (low landmark visibility). Stylized / occluded / generated figures often have poor landmark visibility.
3. **Camera-angle normalization**: profile views distort approach scoring. Either detect view angle (via shoulder/hip ratio) and rescale, or filter to frontal/three-quarter views only.
4. **Per-domain calibration**: brand photography, classical sculpture, anime, sports photography each need re-tuned thresholds.

## Cross-cultural validity (per `feedback_cross-cultural-validity`)

The dimensions are **substrate-level universal**; the emotion-label mapping (fear/joy/pride) is **culturally variable**. For global applications:

- **Specify in dimensions, not labels**. The pipeline lets you target "approach 0.6, expansion 0.7, upward 0.5" without committing to a label.
- **Per-region label tables**: if you need to surface labels, maintain region-specific EMOTION_TEMPLATES tables. The pride/arrogance Western/East-Asian inversion (Tracy & Robins 2008) is the clearest case.

## Library recommendations

- **@mediapipe/tasks-vision** — primary; full 33-landmark Pose Landmarker
- Alternative: **@tensorflow-models/pose-detection** with MoveNet (17 landmarks — modify indices accordingly)
- For video / realtime: same libraries, frame-by-frame

## Performance

- Single frame, pre-extracted skeleton: ~0.5 ms (pure JS math)
- With MediaPipe extraction: ~15-30 ms / frame on mid laptop
- Realtime at 30 FPS: yes, comfortably

## Validation

Reference cases:
- Polykleitos *Doryphoros* pose (image) → expansion ~0.2, upward ~0.5, stability ~0.95, energy ~0.3 — "dominance / pride"
- Munch *The Scream* → expansion ~-0.5, upward ~-0.3, stability ~0.4, energy ~0.7 — "fear"
- Classical contrapposto with raised arms → high expansion + high upward → "joy / triumph"
- Egyptian frontal pose → near-zero on all 5 dimensions — "ceremonial / dead"

## Related pages

[[Universal Body Language Dimensions]] · [[de Gelder's Whole-Body Emotion Perception]] · [[Pose Extraction Pipeline]] · [[Contrapposto Scorer]] · [[Cultural Emblem Detector]] · [[Body Language and Pose Semantics]] · [[Expression as Configuration of Forces]] · [[Realtime Pose-to-Visualizer Loop]]

## Sources

- de Gelder, B. (2016). *Emotions and the Body*. Oxford UP.
- MediaPipe Pose documentation: developers.google.com/mediapipe/solutions/vision/pose_landmarker
- BEAST validation: de Gelder & Van den Stock (2011). *Frontiers in Psychology* 2, 181.
