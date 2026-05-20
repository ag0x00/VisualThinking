import type { RenderPlan, Vec2 } from "../render-plan";
import type { Measurement, Operator } from "./types";

function norm([x, y]: Vec2): Vec2 {
  const m = Math.hypot(x, y) || 1;
  return [x / m, y / m];
}

function nodeKey([x, y]: Vec2, snap: number): string {
  return `${Math.round(x / snap)},${Math.round(y / snap)}`;
}

// Gestalt "good continuation" for strapwork: do line segments connect end-to-end
// (few dangling ends) and pass straight THROUGH junctions (rather than kinking)?
// value = 0.5·connectedness + 0.5·continuation, both in [0,1].
export const lineContinuityOperator: Operator<{ minContinuity: number; snap?: number }> = {
  name: "lineContinuity",
  measure(plan: RenderPlan): Measurement {
    const segs = plan.elements.filter((e) => e.role === "line" && e.points.length >= 2);
    if (segs.length === 0) return { value: 0, components: { segments: 0 } };
    const snap = 1.0; // px grid at which endpoints count as coincident
    const nodes = new Map<string, Vec2[]>(); // node → incident unit directions (pointing away)
    const add = (p: Vec2, dir: Vec2) => {
      const k = nodeKey(p, snap);
      const arr = nodes.get(k) ?? [];
      arr.push(norm(dir));
      nodes.set(k, arr);
    };
    for (const s of segs) {
      const a = s.points[0];
      const b = s.points[s.points.length - 1];
      add(a, [b[0] - a[0], b[1] - a[1]]);
      add(b, [a[0] - b[0], a[1] - b[1]]);
    }
    const totalEnds = segs.length * 2;
    let dangling = 0;
    let contSum = 0;
    let contCount = 0;
    for (const dirs of nodes.values()) {
      if (dirs.length === 1) {
        dangling++;
        continue;
      }
      for (let i = 0; i < dirs.length; i++) {
        let best = 0;
        for (let j = 0; j < dirs.length; j++) {
          if (i === j) continue;
          // -dot == 1 when the two edges are collinear & opposite (straight through)
          const through = -(dirs[i][0] * dirs[j][0] + dirs[i][1] * dirs[j][1]);
          if (through > best) best = through;
        }
        contSum += best;
        contCount++;
      }
    }
    const connectedness = 1 - dangling / totalEnds;
    const continuation = contCount ? contSum / contCount : 0;
    const value = 0.5 * connectedness + 0.5 * continuation;
    return { value, components: { connectedness, continuation, dangling, nodes: nodes.size } };
  },
  scoreAgainst(m, target) {
    const min = target.minContinuity;
    const score = Math.max(0, Math.min(1, m.value / min));
    const direction = m.value < min ? "increase" : "ok";
    return {
      score,
      measured: m.value,
      target: `≥${min}`,
      rule: "floor — higher is better (lines connect + pass through)",
      fix: {
        axis: "lineContinuity",
        direction,
        detail:
          direction === "ok"
            ? `continuity ${m.value.toFixed(2)} — lines connect and pass through`
            : `continuity ${m.value.toFixed(2)} — lines break/dangle; connect ends + straighten through-lines`,
      },
    };
  },
};
