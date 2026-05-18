import type { Caution } from "../types/shared.js";

export const EVALUATION_GUIDE_MAP: Record<string, string[]> = {
  "static-pattern-image": [
    "Directed Tension Score",
    "OKLCH Pair-Relation Classifier",
    "Visual Hierarchy and Negative Space Scoring",
    "Aesthetic Measure Stack",
  ],
  "figurative-image": [
    "Directed Tension Score",
    "Pose-Emotion Dimension Scorer",
    "Contrapposto Scorer",
    "Cultural Emblem Detector",
    "Aesthetic Measure Stack",
  ],
  "realtime-visualizer": [
    "Audio-to-Visual Cross-Modal Mapping",
    "Realtime Pose-to-Visualizer Loop",
    "Directed Tension Score",
  ],
  "brand-photography": [
    "Pose-Emotion Dimension Scorer",
    "Contrapposto Scorer",
    "Cultural Emblem Detector",
    "Contrast Checking Pipeline",
    "OKLCH Pair-Relation Classifier",
  ],
  "typography-layout": [
    "Visual Hierarchy and Negative Space Scoring",
    "Contrast Checking Pipeline",
    "OKLCH Pair-Relation Classifier",
  ],
  // Fixture-only mapping for unit tests against the synthetic vault
  "fixture-pattern-image": [
    "Test Technique Full",
  ],
};

export const GLOBAL_CAVEATS: Caution[] = [
  {
    kind: "empirical-mixed",
    text: "Use scorers comparatively (this iteration vs. previous), not as universal aesthetic predictors. Birkhoff M=O/C and Berlyne's inverted-U have mixed empirical support.",
  },
  {
    kind: "cross-cultural-limit",
    text: "Most evaluation calibration is on WEIRD samples. Validate cross-culturally before deploying to global audiences.",
  },
];
