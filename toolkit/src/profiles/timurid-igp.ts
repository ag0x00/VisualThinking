import type { AestheticProfile } from "../profile";

// Hand-set from the 9 Samarkand reference images. Tune via `npm run render`
// eyeball + the acceptance test.
export const timuridIgpProfile: AestheticProfile = {
  medium: "timurid-igp",
  operators: [
    { operator: "symmetry", weight: 0.30, target: { minFidelity: 0.98 } },
    { operator: "complexity", weight: 0.25, target: { band: [0.55, 0.78], falloff: 0.25 } },
    { operator: "lineContinuity", weight: 0.25, target: { minContinuity: 0.6 } },
    { operator: "colorChord", weight: 0.20, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: {
    references: ["~/Downloads/blue tiles of samarkand/*"],
    notes: "9 reference images; targets hand-set, validated by good-vs-degraded ranking + render eyeball",
  },
};
