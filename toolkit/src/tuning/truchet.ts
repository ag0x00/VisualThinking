import type { TuningMap } from "../tuning";

// Both new knobs are cliff knobs (continuity/periodicity collapse past a tiny
// displacement and only recover near 0), so they use a coarse step = max to
// cross the discontinuity in one move — same shape as the segmentScale lesson.
export const truchetTuning: TuningMap = {
  periodicity: { param: "latticeJitter", kind: "num", step: 0.4, min: 0, max: 0.4, invert: true }, // less jitter → more periodic
  constructionGrammar: { param: "cellScale", kind: "num", step: 0.03, min: 0.85, max: 1.15 },
  lineContinuity: { param: "arcGap", kind: "num", step: 0.5, min: 0, max: 0.5, invert: true }, // less gap → more continuity
};
