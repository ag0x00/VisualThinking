import type { RenderPlan } from "../render-plan";
import type { FixDirection, Measurement, Operator } from "./types";
import { polyArea } from "../geom";

// Validates a tiling by coverage: sum of cell areas ÷ the design region area.
// ≈1 = cells partition the region; <1 = gaps; >1 = overlap. This is a proxy —
// it cannot catch an overlap that is exactly cancelled by a gap elsewhere — but
// it is exact for uniform cell scaling and cheap (no polygon clipping).
export const constructionGrammarOperator: Operator<{ band: [number, number]; falloff?: number }> = {
  name: "constructionGrammar",
  measure(plan: RenderPlan): Measurement {
    const tiles = plan.elements.filter((e) => e.role === "tile");
    const regionArea = plan.region ? polyArea(plan.region) : 0;
    if (tiles.length === 0 || regionArea === 0) {
      return { value: 0, components: { tiles: tiles.length, coverage: 0 } };
    }
    const sumCell = tiles.reduce((s, t) => s + polyArea(t.points), 0);
    const coverage = sumCell / regionArea;
    return { value: coverage, components: { coverage, tiles: tiles.length } };
  },
  scoreAgainst(m, target) {
    const [lo, hi] = target.band;
    const falloff = target.falloff ?? 0.2;
    const v = m.value;
    let score: number;
    let direction: FixDirection;
    let detail: string;
    if (v >= lo && v <= hi) {
      score = 1;
      direction = "ok";
      detail = `coverage ${v.toFixed(2)} — cells partition the region`;
    } else if (v < lo) {
      score = Math.max(0, 1 - (lo - v) / falloff);
      direction = "increase";
      detail = `coverage ${v.toFixed(2)} < 1 — gaps between cells`;
    } else {
      score = Math.max(0, 1 - (v - hi) / falloff);
      direction = "decrease";
      detail = `coverage ${v.toFixed(2)} > 1 — cells overlap`;
    }
    return {
      score,
      measured: v,
      target: `≈1.0 (${lo}–${hi})`,
      rule: "band — region coverage (gaps score low, overlap scores low)",
      fix: { axis: "constructionGrammar", direction, detail },
    };
  },
};
