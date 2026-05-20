import type { AestheticProfile } from "../profile";

// Tile-medium profile. Binds the operators that apply to filled cells:
// symmetry + construction-grammar (valid tiling) + colorChord. Note `complexity`
// is line-oriented (it measures line segments) and is intentionally NOT bound
// here — a tile-complexity operator (cell/colour variety) is future work.
export const timuridTilingProfile: AestheticProfile = {
  medium: "timurid-tiling",
  operators: [
    { operator: "symmetry", weight: 0.40, target: { minFidelity: 0.98 } },
    { operator: "constructionGrammar", weight: 0.35, target: { band: [0.95, 1.05], falloff: 0.2 } },
    { operator: "colorChord", weight: 0.25, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: {
    references: ["~/Downloads/blue tiles of samarkand/*"],
    notes: "tile medium: grammar (valid tiling) + symmetry + chord; line-complexity deferred",
  },
};
