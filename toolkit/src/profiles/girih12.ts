import type { AestheticProfile } from "../profile";

// 12-fold girih glazed mosaic. periodicity (translational lattice) replaces the
// centre-rotation `symmetry` operator, exactly as for truchet. constructionGrammar
// now sees FULL coverage because the interstitial triangles are glazed tiles (not
// background) — a region tagged `background` would silently dodge this check.
// colorChord under-scores the warm accent (saffron is off the cool arc) — accepted
// for v1; the fix (proportion/area-aware chord) is on the todo in
// project_subsystem-trajectory.md. The palette is not a tuning knob, so improve()
// cannot "fix" the chord by stripping the (intentional, symmetric) accent.
export const girih12Profile: AestheticProfile = {
  medium: "girih12",
  operators: [
    { operator: "periodicity", weight: 0.30, target: { minFidelity: 0.95 } },
    { operator: "constructionGrammar", weight: 0.30, target: { band: [0.85, 1.05], falloff: 0.2 } },
    { operator: "cuerdaSeca", weight: 0.20, target: { minQuality: 0.85 } },
    { operator: "colorChord", weight: 0.20, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: { references: ["~/Downloads/blue tiles of samarkand/*"], notes: "12-fold girih; default groutGap 0.15 lands wall-to-wall coverage at ~1.0 (offsets off-canvas tile overhang); warm accent under-scored by single-arc colorChord (todo: proportion-aware chord)" },
};
