import type { RenderPlan } from "../render-plan";
import type { FixDirection, Measurement, Operator } from "./types";

const DENSITY_REF = 40; // cell count at which density saturates

function entropyNorm(counts: number[], bins: number): number {
  const total = counts.reduce((s, c) => s + c, 0);
  if (total === 0 || bins <= 1) return 0;
  let h = 0;
  for (const c of counts) {
    if (c > 0) {
      const p = c / total;
      h -= p * Math.log(p);
    }
  }
  return h / Math.log(bins);
}

// Berlyne organized-richness for the tile medium: cell density × colour variety.
// (Note: this scores actual colour USAGE, which colorChord — scoring the palette
// itself — does not. A monotone tiling has a fine palette but no variety.)
export const tileComplexityOperator: Operator<{ band: [number, number]; falloff?: number }> = {
  name: "tileComplexity",
  measure(plan: RenderPlan): Measurement {
    const tiles = plan.elements.filter((e) => e.role === "tile");
    if (tiles.length === 0) return { value: 0, components: { tiles: 0 } };
    const cellDensity = Math.min(1, tiles.length / DENSITY_REF);
    const colorCounts = new Map<number, number>();
    for (const t of tiles) {
      const c = t.colorRef ?? -1;
      colorCounts.set(c, (colorCounts.get(c) ?? 0) + 1);
    }
    const colorVariety = entropyNorm([...colorCounts.values()], plan.palette.length);
    const value = 0.5 * cellDensity + 0.5 * colorVariety;
    return { value, components: { cellDensity, colorVariety, distinctColors: colorCounts.size, tiles: tiles.length } };
  },
  scoreAgainst(m, target) {
    const [lo, hi] = target.band;
    const falloff = target.falloff ?? 0.25;
    const v = m.value;
    let score: number;
    let direction: FixDirection;
    if (v >= lo && v <= hi) {
      score = 1;
      direction = "ok";
    } else if (v < lo) {
      score = Math.max(0, 1 - (lo - v) / falloff);
      direction = "increase";
    } else {
      score = Math.max(0, 1 - (v - hi) / falloff);
      direction = "decrease";
    }
    return {
      score,
      measured: v,
      target: `${lo}–${hi}`,
      rule: "band — cell density × colour variety (too plain or too busy both score low)",
      fix: {
        axis: "tileComplexity",
        direction,
        detail:
          direction === "ok"
            ? `tile complexity ${v.toFixed(2)} in band`
            : `tile complexity ${v.toFixed(2)} → ${direction} (vary cell count / glaze colours)`,
      },
    };
  },
};
