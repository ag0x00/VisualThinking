import type { TuningMap } from "../tuning";

// improve() knobs for the girih12 medium. periodicity's knob is a cliff knob
// (any per-cell drift past ~1px collapses the lattice match and only recovers at
// 0), so step = max to cross the discontinuity in one move — same shape as the
// truchet/segmentScale lesson. colorChord has no knob: the warm accent is
// intentional and the palette is not tuned.
export const girih12Tuning: TuningMap = {
  periodicity: { param: "latticeJitter", kind: "num", step: 0.3, min: 0, max: 0.3, invert: true }, // less jitter → more periodic
  constructionGrammar: { param: "groutGap", kind: "num", step: 0.04, min: 0, max: 0.30, invert: true }, // less grout → more coverage
  cuerdaSeca: { param: "channelJitter", kind: "num", step: 0.2, min: 0, max: 1, invert: true }, // less jitter → more uniform channels
};
