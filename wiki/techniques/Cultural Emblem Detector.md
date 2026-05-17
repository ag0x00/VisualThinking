---
title: Cultural Emblem Detector
type: technique
status: developing
tags: [technique, body-language, emblem, hand-gesture, cross-cultural, branding, implementation]
address: c-000218
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Cultural Variability in Body Language]]", "[[Pose Extraction Pipeline]]"]
language: typescript
---

# Cultural Emblem Detector

Hand-landmark-based detector for the **high-risk emblem set** from [[Cultural Variability in Body Language]]. Flags generated and stock imagery containing gestures that carry **culturally-inverted meaning** in major regions.

**Use cases**: brand-photography emblem audit before global rollout, generated-figure pre-publication checking, stock-imagery filtering pipelines.

## Threat model

The detector targets emblems that **invert valence** across cultures, not all gestures:

- **Thumbs-up** → vulgar insult in Iran, parts of Middle East, West Africa
- **OK-sign** (thumb-index circle) → vulgar in Brazil, Turkey, Venezuela; "zero/worthless" in France; "money" in Japan
- **V-back-of-hand** (V-sign with palm facing the maker) → vulgar in UK / Australia / NZ / Ireland
- **Crossed fingers** → vulgar in Vietnam
- **Beckoning palm-up** → "for dogs only" in Philippines / Singapore / parts of East Asia
- **Pointing index finger** → rude in many Asian / African contexts (use open hand)
- **Showing sole of foot** → highly offensive in Middle East / Thailand / Buddhist Asia
- **Touching someone's head** → offensive in Thailand / Buddhist Asia

This detector covers the **hand-landmark-detectable subset** — thumbs-up, OK-sign, V-back-of-hand, crossed-fingers, beckoning, pointing. Foot/head-position emblems are pose-skeleton based (see Extensions).

## Architecture

```typescript
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface HandLandmark { x: number; y: number; z: number; }
type Hand = HandLandmark[];   // 21 landmarks

// MediaPipe hand-21 landmark indices
const HL = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const;

interface EmblemDetection {
  emblem: string;
  confidence: number;
  hand: "left" | "right";
  riskRegions: string[];
  bbox: { x: number; y: number; w: number; h: number };
}

function detectEmblems(hand: Hand, handedness: "left" | "right"): EmblemDetection[] {
  const detections: EmblemDetection[] = [];
  const finger = analyzeFingerStates(hand);

  if (isThumbsUp(finger))          detections.push(mkDet("thumbs-up", 0.9, hand, handedness, ["Iran", "Middle East", "West Africa", "Greece (historic)"]));
  if (isOkSign(hand, finger))      detections.push(mkDet("ok-sign", 0.9, hand, handedness, ["Brazil", "Turkey", "Venezuela", "France (means 'zero')", "Japan (means 'money')"]));
  if (isVBackOfHand(hand, finger)) detections.push(mkDet("v-back-of-hand", 0.85, hand, handedness, ["UK", "Australia", "New Zealand", "Ireland"]));
  if (isCrossedFingers(hand))      detections.push(mkDet("crossed-fingers", 0.8, hand, handedness, ["Vietnam"]));
  if (isBeckoningPalmUp(hand, finger)) detections.push(mkDet("beckoning-palm-up", 0.7, hand, handedness, ["Philippines", "Singapore", "parts of East Asia"]));
  if (isPointingIndex(finger))     detections.push(mkDet("pointing-index", 0.7, hand, handedness, ["many Asian", "many African"]));

  return detections;
}
```

### Finger-state analysis

```typescript
interface FingerStates {
  thumb: "extended" | "folded";
  index: "extended" | "folded";
  middle: "extended" | "folded";
  ring: "extended" | "folded";
  pinky: "extended" | "folded";
}

function analyzeFingerStates(h: Hand): FingerStates {
  // A finger is "extended" if its TIP is farther from WRIST than its MCP
  // and the joint-bend angle is small (close to 180°)
  return {
    thumb:  isThumbExtended(h) ? "extended" : "folded",
    index:  isFingerExtended(h, HL.INDEX_MCP, HL.INDEX_PIP, HL.INDEX_DIP, HL.INDEX_TIP) ? "extended" : "folded",
    middle: isFingerExtended(h, HL.MIDDLE_MCP, HL.MIDDLE_PIP, HL.MIDDLE_DIP, HL.MIDDLE_TIP) ? "extended" : "folded",
    ring:   isFingerExtended(h, HL.RING_MCP, HL.RING_PIP, HL.RING_DIP, HL.RING_TIP) ? "extended" : "folded",
    pinky:  isFingerExtended(h, HL.PINKY_MCP, HL.PINKY_PIP, HL.PINKY_DIP, HL.PINKY_TIP) ? "extended" : "folded",
  };
}

function isFingerExtended(h: Hand, mcp: number, pip: number, dip: number, tip: number): boolean {
  // Joint angles near 180° at PIP and DIP
  const pipAngle = jointAngle(h[mcp], h[pip], h[dip]);
  const dipAngle = jointAngle(h[pip], h[dip], h[tip]);
  return pipAngle > 160 && dipAngle > 160;
}

function isThumbExtended(h: Hand): boolean {
  const ipAngle = jointAngle(h[HL.THUMB_MCP], h[HL.THUMB_IP], h[HL.THUMB_TIP]);
  // Thumb is "extended" if joint is straight AND tip is far from palm
  const palmCenter = midpoint(h[HL.WRIST], h[HL.MIDDLE_MCP]);
  const thumbAwayFromPalm = dist(h[HL.THUMB_TIP], palmCenter) > dist(h[HL.THUMB_MCP], palmCenter) * 1.3;
  return ipAngle > 150 && thumbAwayFromPalm;
}
```

### Emblem-specific detectors

```typescript
function isThumbsUp(f: FingerStates): boolean {
  return f.thumb === "extended" &&
         f.index === "folded" && f.middle === "folded" &&
         f.ring  === "folded" && f.pinky  === "folded";
}

function isOkSign(h: Hand, f: FingerStates): boolean {
  // Thumb tip touches index tip; other fingers extended
  const thumbIndexDist = dist(h[HL.THUMB_TIP], h[HL.INDEX_TIP]);
  const palmSize = dist(h[HL.WRIST], h[HL.MIDDLE_MCP]);
  const touching = thumbIndexDist < palmSize * 0.15;
  return touching && f.middle === "extended" && f.ring === "extended" && f.pinky === "extended";
}

function isVBackOfHand(h: Hand, f: FingerStates): boolean {
  // V-sign: index + middle extended, others folded
  // Palm facing AWAY from camera (back of hand toward camera) — this is the offensive variant
  if (!(f.index === "extended" && f.middle === "extended" && f.ring === "folded" && f.pinky === "folded")) return false;
  // Palm orientation: cross product of finger vector × thumb vector — z sign indicates palm direction
  const palmNormal = palmNormalVector(h);
  return palmNormal.z > 0;   // sign convention: positive z = palm away from camera
}

function isCrossedFingers(h: Hand): boolean {
  // Index and middle fingers crossed: tips swapped in x-direction
  const indexTipX = h[HL.INDEX_TIP].x;
  const middleTipX = h[HL.MIDDLE_TIP].x;
  const indexMcpX = h[HL.INDEX_MCP].x;
  const middleMcpX = h[HL.MIDDLE_MCP].x;
  // Normal: index left of middle at both MCP and tip (or vice versa)
  // Crossed: order swaps between MCP and tip
  const mcpOrder = indexMcpX < middleMcpX;
  const tipOrder = indexTipX < middleTipX;
  return mcpOrder !== tipOrder;
}

function isBeckoningPalmUp(h: Hand, f: FingerStates): boolean {
  // Palm facing up, fingers curling toward palm in a "come here" motion
  // Hard to detect from single frame; for static images: palm-up orientation + fingers partially curled
  const palmNormal = palmNormalVector(h);
  const palmFacingUp = palmNormal.y < -0.5;
  const fingersCurled = f.index === "folded" && f.middle === "folded";
  return palmFacingUp && fingersCurled;
}

function isPointingIndex(f: FingerStates): boolean {
  return f.index === "extended" &&
         f.middle === "folded" && f.ring === "folded" && f.pinky === "folded";
  // Note: at people requires figure-context not just hand-shape
}

function palmNormalVector(h: Hand): { x: number; y: number; z: number } {
  // Cross product of (WRIST→INDEX_MCP) × (WRIST→PINKY_MCP) gives palm normal
  const v1 = sub(h[HL.INDEX_MCP], h[HL.WRIST]);
  const v2 = sub(h[HL.PINKY_MCP], h[HL.WRIST]);
  return cross(v1, v2);
}
```

## Full image-level pipeline

```typescript
async function auditImageForEmblems(image: ImageData, targetRegions: string[]): Promise<{
  detections: EmblemDetection[];
  riskLevel: "safe" | "warning" | "block";
  recommendations: string[];
}> {
  // 1. Run MediaPipe HandLandmarker to extract hand skeletons
  const hands = await runHandLandmarker(image);

  // 2. Detect emblems in each hand
  const allDetections = hands.flatMap(({ landmarks, handedness }) =>
    detectEmblems(landmarks, handedness)
  );

  // 3. Filter to relevant-region risks
  const relevant = allDetections.filter(d =>
    d.riskRegions.some(r => targetRegions.some(t => r.toLowerCase().includes(t.toLowerCase())))
  );

  // 4. Risk levels
  let riskLevel: "safe" | "warning" | "block" = "safe";
  const recommendations: string[] = [];
  if (relevant.length > 0) {
    const maxConfidence = Math.max(...relevant.map(d => d.confidence));
    if (maxConfidence > 0.8) {
      riskLevel = "block";
      recommendations.push("Image contains high-confidence cross-culturally-risky emblem. Re-generate or replace.");
    } else {
      riskLevel = "warning";
      recommendations.push("Image contains moderate-confidence emblem; human review recommended.");
    }
  }

  return { detections: relevant, riskLevel, recommendations };
}
```

## Calibration

1. **Synthetic test set**: render hand skeletons in each emblem pose; check classifier hits 100% (these are non-ambiguous).
2. **Real-image test set**: ~50 images per emblem, half pictures of the gesture and half pictures of similar but non-emblem hand shapes (e.g., relaxed-thumb-up vs deliberate-thumbs-up). Maximize precision over recall — false positives are tolerable, false negatives leak through.
3. **Stylized-image set**: anime / comics / classical-painting hands. Expect classifier to fail; document the gap.

## Pose-level extensions

The 6 hand-emblem detectors cover the hand subset. For the foot / head emblems, use the full pose skeleton (see [[Pose Extraction Pipeline]]):

```typescript
function detectFootSoleShown(s: PoseSkeleton): boolean {
  // Foot pointing toward camera with sole visible
  // Detect via ankle-to-toe vector + 3D z-coordinate of foot landmarks
  const lFoot = s[31];   // L_FOOT_INDEX in MediaPipe
  const rFoot = s[32];   // R_FOOT_INDEX
  // Heuristic: foot landmark's z-coordinate close to or negative of ankle's z (foot pointing forward)
  return (s[LM.L_ANKLE].z - lFoot.z) > 0.05 || (s[LM.R_ANKLE].z - rFoot.z) > 0.05;
}

function detectHeadTouch(skeletons: PoseSkeleton[]): boolean {
  // Multi-person: detect when one person's hand landmarks are near another's head landmark
  // Only relevant for multi-figure imagery
  for (let i = 0; i < skeletons.length; i++) {
    for (let j = 0; j < skeletons.length; j++) {
      if (i === j) continue;
      const headPos = skeletons[i][LM.NOSE];
      for (const handPos of [skeletons[j][LM.L_WRIST], skeletons[j][LM.R_WRIST]]) {
        if (dist(headPos, handPos) < 0.05) return true;
      }
    }
  }
  return false;
}
```

## Library recommendations

- **@mediapipe/tasks-vision** with both `HandLandmarker` and `PoseLandmarker`
- For multi-person images: run pose-detection first to find people, then hand-landmark within each person's bounding box

## Performance

- HandLandmarker on single image: ~20-40 ms
- Emblem detection from landmarks: ~0.5 ms
- Total per image: ~25-50 ms; suitable for realtime moderation

## Cross-cultural validity (per `feedback_cross-cultural-validity`)

This page **is** a cross-cultural-validity tool. The detector's value lies in catching emblem-inversion before publication.

> [!warning] False-positive cost vs false-negative cost
> The detector is biased toward false positives — better to flag a benign thumbs-up than miss an offensive one. Tune thresholds accordingly. For automated blocking, prefer human-in-the-loop review on warning cases.

## Open research

- **Emblem novel-detection**: train a hand-shape classifier on emblem datasets (e.g., Jester gesture dataset) rather than rule-based heuristics. ML approach would catch variants the rules miss.
- **Region-specific emblem expansion**: the catalog above covers ~6 emblems; full coverage is 50+ across major regions (per Morris et al. 1979). Add regional packs.
- **Brand-photography automated audit pipeline**: combine emblem detector + pose-emotion scorer + facial-expression analyzer for full pre-publication audit.

## Related pages

[[Cultural Variability in Body Language]] · [[Pose Extraction Pipeline]] · [[Pose-Emotion Dimension Scorer]] · [[Body Language and Pose Semantics]] · [[Jungian Archetypes and Brand Archetypes]] · [[Non-Western Iconographic Systems]]

## Sources

- Morris, D., Collett, P., Marsh, P., & O'Shaughnessy, M. (1979). *Gestures: Their Origins and Distribution*. Stein & Day.
- Axtell, R. E. (1998). *Gestures: The Do's and Taboos of Body Language Around the World*. Wiley.
- Matsumoto, D., & Hwang, H. C. (2013). Cultural similarities and differences in emblematic gestures. *Journal of Nonverbal Behavior* 37, 1–27.
- MediaPipe HandLandmarker: developers.google.com/mediapipe/solutions/vision/hand_landmarker
- Jester gesture dataset (Twenty Billion Neurons / Qualcomm).
