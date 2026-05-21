import type { AestheticProfile } from "../profile";

// Truchet (wall-to-wall arc tiles). periodicity REPLACES symmetry here: the
// invariance is translation by the lattice, not rotation about a centre.
// constructionGrammar/lineContinuity/colorChord are reused unchanged.
export const truchetProfile: AestheticProfile = {
  medium: "truchet",
  operators: [
    { operator: "periodicity", weight: 0.30, target: { minFidelity: 0.95 } },
    { operator: "constructionGrammar", weight: 0.25, target: { band: [0.95, 1.05], falloff: 0.2 } },
    { operator: "lineContinuity", weight: 0.25, target: { minContinuity: 0.64 } }, // calibrated: clean ≈ 0.688 − 0.05
    { operator: "colorChord", weight: 0.20, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: { references: [], notes: "Truchet: lattice periodicity + canvas coverage + arc continuity + chord" },
};
