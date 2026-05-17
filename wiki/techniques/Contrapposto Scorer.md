---
title: Contrapposto Scorer
type: technique
status: developing
tags: [technique, body-language, pose, contrapposto, scoring, implementation]
address: c-000217
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Contrapposto and Pose Canons]]", "[[Directed Tension]]", "[[Pose Extraction Pipeline]]"]
language: typescript
---

# Contrapposto Scorer

Implementation of the 6-feature contrapposto score from [[Contrapposto and Pose Canons]]. Discriminates **alive-figurative** poses (Polykleitos-style weight-shift, Michelangelo-style serpentinata) from **wooden** poses (frontal-symmetric Egyptian, stiff stock-photo) and **mid-action** poses (Bernini-style active).

**Use cases**: scoring figurative generation for "alive-ness," diagnosing wooden character defaults in generative pipelines, automatic detection of contrapposto axis for art-historical analysis.

## The 6 features (from [[Contrapposto and Pose Canons]])

| Feature | What it measures |
|---|---|
| **Hip-shoulder counter-rotation** | Angle between hip and shoulder lines |
| **Weight asymmetry** | Pelvis offset from ankle midpoint |
| **Free-leg flex** | Knee angle of non-standing leg |
| **Spinal S-curve** | Signed angle sum across hip-shoulder-head |
| **Head-tilt** | Head midline angle vs spine axis |
| **Stability** | Center of mass over base of support |

## Implementation

```typescript
interface ContrappostoScore {
  composite: number;             // weighted sum, 0..1
  features: {
    hipShoulderRotation: number;     // degrees
    weightAsymmetry: number;         // 0..1
    freeLegFlex: number;             // degrees (0 = straight, larger = bent)
    spinalSCurve: number;            // signed sum, degrees
    headTilt: number;                // signed degrees
    stability: number;               // 0..1
  };
  classification: "frontal-symmetric" | "weak-contrapposto" | "classical-contrapposto" | "serpentinata" | "mid-action";
  standingLeg: "left" | "right" | "ambiguous";
}

function scoreContrapposto(s: PoseSkeleton): ContrappostoScore {
  const features = {
    hipShoulderRotation: hipShoulderCounterRotation(s),
    weightAsymmetry:     weightAsymmetry(s),
    freeLegFlex:         freeLegFlex(s),
    spinalSCurve:        spinalSCurve(s),
    headTilt:            headTilt(s),
    stability:           stabilityScore(s),
  };

  const standingLeg = identifyStandingLeg(s);
  const classification = classify(features, standingLeg);
  const composite = compositeScore(features);

  return { composite, features, classification, standingLeg };
}
```

### Feature implementations

```typescript
function hipShoulderCounterRotation(s: PoseSkeleton): number {
  // Frontal-plane angle between hip-line and shoulder-line
  const hipVec = { x: s[LM.R_HIP].x - s[LM.L_HIP].x, y: s[LM.R_HIP].y - s[LM.L_HIP].y };
  const shoulderVec = { x: s[LM.R_SHOULDER].x - s[LM.L_SHOULDER].x, y: s[LM.R_SHOULDER].y - s[LM.L_SHOULDER].y };
  const hipAngle = Math.atan2(hipVec.y, hipVec.x) * 180 / Math.PI;
  const shoulderAngle = Math.atan2(shoulderVec.y, shoulderVec.x) * 180 / Math.PI;
  return Math.abs(hipAngle - shoulderAngle);
}

function weightAsymmetry(s: PoseSkeleton): number {
  const pelvisX = (s[LM.L_HIP].x + s[LM.R_HIP].x) / 2;
  const ankleMidX = (s[LM.L_ANKLE].x + s[LM.R_ANKLE].x) / 2;
  const ankleSpread = Math.abs(s[LM.L_ANKLE].x - s[LM.R_ANKLE].x);
  if (ankleSpread < 0.02) return 0;  // feet together — no contrapposto possible
  return Math.abs(pelvisX - ankleMidX) / (ankleSpread / 2 + 0.05);
}

function identifyStandingLeg(s: PoseSkeleton): "left" | "right" | "ambiguous" {
  // Standing leg is the one closer to the pelvis x-coordinate
  const pelvisX = (s[LM.L_HIP].x + s[LM.R_HIP].x) / 2;
  const lDist = Math.abs(pelvisX - s[LM.L_ANKLE].x);
  const rDist = Math.abs(pelvisX - s[LM.R_ANKLE].x);
  if (Math.abs(lDist - rDist) < 0.03) return "ambiguous";
  return lDist < rDist ? "left" : "right";
}

function freeLegFlex(s: PoseSkeleton): number {
  // Knee angle of the non-standing leg
  const standing = identifyStandingLeg(s);
  if (standing === "ambiguous") return 0;

  const freeKnee = standing === "left" ? LM.R_KNEE : LM.L_KNEE;
  const freeHip  = standing === "left" ? LM.R_HIP  : LM.L_HIP;
  const freeAnkle = standing === "left" ? LM.R_ANKLE : LM.L_ANKLE;
  const angle = jointAngle(s[freeHip], s[freeKnee], s[freeAnkle]);
  return 180 - angle;  // 0 = straight; larger = more bent
}

function spinalSCurve(s: PoseSkeleton): number {
  // Signed sum of:
  //   1. Hip-shoulder lateral offset (which way the torso leans)
  //   2. Shoulder-nose lateral offset (which way the head leans)
  // S-curve: signs alternate; C-curve: signs match
  const hipMidX = (s[LM.L_HIP].x + s[LM.R_HIP].x) / 2;
  const shoulderMidX = (s[LM.L_SHOULDER].x + s[LM.R_SHOULDER].x) / 2;
  const noseX = s[LM.NOSE].x;

  const torsoLean = shoulderMidX - hipMidX;
  const headLean  = noseX - shoulderMidX;
  // S-curve quality: product is negative (signs oppose); magnitude is the score
  const product = torsoLean * headLean;
  const magnitudes = Math.abs(torsoLean) + Math.abs(headLean);
  return product < 0 ? magnitudes * 100 : -magnitudes * 100;
}

function headTilt(s: PoseSkeleton): number {
  // Angle of head-midline (nose to mid-shoulders) from vertical
  const shoulderMid = midpoint(s[LM.L_SHOULDER], s[LM.R_SHOULDER]);
  const dx = s[LM.NOSE].x - shoulderMid.x;
  const dy = shoulderMid.y - s[LM.NOSE].y;  // y inverted
  return Math.atan2(dx, dy) * 180 / Math.PI;  // signed
}

function compositeScore(f: ContrappostoScore["features"]): number {
  // Weights are conservative seeds — calibrate against labeled art-history corpus
  const rotationScore = clamp((f.hipShoulderRotation - 5) / 20, 0, 1);       // 5° dead zone, max at 25°
  const asymmetryScore = clamp(f.weightAsymmetry, 0, 1);
  const flexScore = clamp(f.freeLegFlex / 30, 0, 1);                          // 30° flex = classical
  const sCurveScore = clamp(Math.max(0, f.spinalSCurve) / 30, 0, 1);
  const stabilityScore = f.stability;                                         // already 0..1

  return (
    0.30 * rotationScore +
    0.20 * asymmetryScore +
    0.15 * flexScore +
    0.20 * sCurveScore +
    0.15 * stabilityScore
  );
}

function classify(f: ContrappostoScore["features"], standing: ReturnType<typeof identifyStandingLeg>): ContrappostoScore["classification"] {
  if (f.hipShoulderRotation < 8 && f.weightAsymmetry < 0.2) return "frontal-symmetric";
  if (f.stability < 0.4) return "mid-action";
  if (f.hipShoulderRotation > 25 && Math.abs(f.spinalSCurve) > 20) return "serpentinata";
  if (f.hipShoulderRotation > 15 && f.weightAsymmetry > 0.3 && f.stability > 0.6) return "classical-contrapposto";
  return "weak-contrapposto";
}
```

## Cross-cultural variants

The score above targets **Western contrapposto**. For Indian classical *tribhanga*:

```typescript
function scoreTribhanga(s: PoseSkeleton): number {
  // Tribhanga: three bends — neck, waist, knee — typically more pronounced lateral S-curve
  // than European contrapposto, with less hip-shoulder counter-rotation
  const sCurve = spinalSCurve(s);
  const kneeBend = freeLegFlex(s);
  const headTiltAbs = Math.abs(headTilt(s));
  return clamp(
    0.4 * (sCurve / 50) +
    0.3 * (kneeBend / 40) +
    0.3 * (headTiltAbs / 20),
    0, 1
  );
}
```

Open thread: validate the *tribhanga* scorer against Khajuraho / Konark / Pala-bronze sculpture imagery.

## Calibration corpus

Suggested labeled corpus for calibration:

| Source | Expected classification |
|---|---|
| Polykleitos *Doryphoros* | classical-contrapposto, composite > 0.7 |
| Michelangelo *David* | classical-contrapposto, composite > 0.8 |
| Giambologna *Sabines* | serpentinata, composite > 0.85 |
| Bernini *David* (mid-throw) | mid-action |
| Egyptian standing-Pharaoh statues | frontal-symmetric, composite < 0.2 |
| Stock executive headshots | weak-contrapposto, composite 0.3-0.6 |
| Stiff AI-generated figures (StyleGAN 2018 default) | frontal-symmetric or weak |
| Modern fashion-editorial poses (Avedon, Newton) | classical-contrapposto or serpentinata |

Run scorer, compare to labels, adjust 5 weights.

## Validation against [[Pose-Emotion Dimension Scorer]]

Contrapposto-classical poses should:
- High **stability** (by definition; stable-dynamism)
- Moderate **expansion** (limbs visible but not maximally extended)
- Moderate **upward** (head usually slightly raised)
- Low **energy** (static pose, not action)
- Mixed **approach** (depends on body orientation)

Run both scorers on the same image and check this prediction. If contrapposto-classical poses score high on energy or low on stability, one of the scorers needs recalibration.

## Performance

- Per skeleton (post-MediaPipe): ~0.3 ms
- With MediaPipe extraction: ~15-30 ms / frame
- Suitable for realtime; sensible for offline batch corpus analysis

## Library recommendations

- **@mediapipe/tasks-vision** for landmark extraction
- Pure TS for the scoring math

## Open research

- **Stylized-figure validity**: contrapposto in anime, comics, classical-painting styles is exaggerated beyond anatomical limits. Does the scorer generalize? Likely under-scores anime where joint angles violate normal anatomy.
- **Multi-figure compositions**: combined-figures contrapposto-axis analysis. Do figures' axes align (chorus line) or vary (active scene)?
- **Skeleton-from-illustration**: pose-estimation models trained on photos often fail on drawings. RTMPose has flat-shading-style variants; needs validation.

## Related pages

[[Contrapposto and Pose Canons]] · [[Directed Tension]] · [[Pose Extraction Pipeline]] · [[Pose-Emotion Dimension Scorer]] · [[Universal Body Language Dimensions]] · [[Body Language and Pose Semantics]] · [[Expression as Configuration of Forces]] · [[Directed Tension Score]]

## Sources

- Pollitt, J. J. (1995). The Canon of Polykleitos and other canons.
- Hogarth, B. (1958). *Dynamic Anatomy*. Watson-Guptill.
- Loomis, A. (1943). *Figure Drawing for All It's Worth*. Viking.
- MediaPipe Pose Landmarker reference.
