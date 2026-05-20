import type { Element, RenderPlan } from "../render-plan";
import type { FixDirection, Measurement, Operator } from "./types";

const NBINS = 12;
const MOTIF_REF = 18;
const DENSITY_REF = 110;
const W_ANGLE = 0.34, W_MOTIF = 0.33, W_DENSITY = 0.33;

function orientationEntropy(lines: Element[]): number {
  const bins = new Array(NBINS).fill(0);
  let n = 0;
  for (const e of lines) {
    for (let i = 0; i + 1 < e.points.length; i++) {
      const [x0, y0] = e.points[i];
      const [x1, y1] = e.points[i + 1];
      let a = Math.atan2(y1 - y0, x1 - x0); // [-π, π]
      a = ((a % Math.PI) + Math.PI) % Math.PI; // fold to [0, π)
      const bin = Math.min(NBINS - 1, Math.floor((a / Math.PI) * NBINS));
      bins[bin]++;
      n++;
    }
  }
  if (n === 0) return 0;
  let h = 0;
  for (const c of bins) {
    if (c > 0) {
      const p = c / n;
      h -= p * Math.log(p);
    }
  }
  return h / Math.log(NBINS); // normalized 0..1
}

export const complexityOperator: Operator<{ band: [number, number]; falloff?: number }> = {
  name: "complexity",
  measure(plan: RenderPlan): Measurement {
    const lines = plan.elements.filter((e) => e.role === "line");
    const angleEntropy = orientationEntropy(lines);
    const motifs = new Set(
      plan.elements.filter((e) => e.role !== "background").map((e) => e.motifId ?? ""),
    ).size;
    const motifNorm = Math.min(1, motifs / MOTIF_REF);
    const densityNorm = Math.min(1, lines.length / DENSITY_REF);
    const value = W_ANGLE * angleEntropy + W_MOTIF * motifNorm + W_DENSITY * densityNorm;
    return { value, components: { angleEntropy, motifNorm, densityNorm, motifs, lineCount: lines.length } };
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
      rule: "band — too little or too much both score low",
      fix: {
        axis: "complexity",
        direction,
        detail:
          direction === "ok"
            ? `complexity ${v.toFixed(2)} in band`
            : `complexity ${v.toFixed(2)} → ${direction} toward [${lo}, ${hi}]`,
      },
    };
  },
};
