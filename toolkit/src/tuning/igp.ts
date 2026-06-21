import type { TuningMap } from "../tuning";

// Maps the timurid-igp profile's fix axes to igp generator knobs.
// symmetry (always p6m) and colorChord (palette is an array, deferred) have no
// knob and are intentionally absent — the loop skips axes with no binding.
export const igpTuning: TuningMap = {
  complexity: { param: "rings", kind: "int", step: 1, min: 3, max: 9 },
  // Cliff knob: line segments only meet (continuity 0→1) at scale 1.0, so a fine
  // step yields no composite gain and would trip the revert-and-stop guard.
  // step 0.6 reaches 1.0 from any start in [0.4, 1.0] in one move.
  lineContinuity: { param: "segmentScale", kind: "num", step: 0.6, min: 0.4, max: 1.0 },
};
