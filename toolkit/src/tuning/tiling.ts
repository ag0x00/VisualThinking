import type { TuningMap } from "../tuning";

// Maps the timurid-tiling profile's fix axes to tiling generator knobs.
// symmetry + colorChord have no knob (see igp tuning note).
export const tilingTuning: TuningMap = {
  constructionGrammar: { param: "cellScale", kind: "num", step: 0.03, min: 0.85, max: 1.15 },
  // max = fillCount = palette.length - 2 = 3 for SAMARKAND_PALETTE. The generator
  // re-clamps colorCount to fillCount, so bounding here at 3 keeps a pinned nudge
  // correctly detectable as non-actionable (avoids a 3→4 "change" with no effect).
  tileComplexity: { param: "colorCount", kind: "int", step: 1, min: 1, max: 3 },
  // invert: the fix asks to "increase" quality, but quality rises as jitter falls.
  cuerdaSeca: { param: "channelJitter", kind: "num", step: 0.1, min: 0, max: 1, invert: true },
};
