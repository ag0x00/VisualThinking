import type { RenderPlan, Vec2 } from "../render-plan";
import type { Measurement, Operator } from "./types";
import { centroid } from "../geom";

// Translational self-similarity: shift the cell frames by each lattice vector and
// count how many land on an existing cell frame. Matches on `tile` centroids only,
// so per-cell motif rotation does not affect the score — a clean lattice is ~1.0
// regardless of how varied the tiles are; corruption of the lattice drops it.
export const periodicityOperator: Operator<{ minFidelity: number }> = {
  name: "periodicity",
  measure(plan: RenderPlan): Measurement {
    const lattice = plan.symmetry.lattice;
    const cents = plan.elements.filter((e) => e.role === "tile").map((t) => centroid(t.points));
    if (!lattice || cents.length === 0) return { value: 1, components: { matches: 0, targets: 0 } };
    const eps = 1e-3 * Math.hypot(plan.bounds.width, plan.bounds.height);
    const inBounds = (p: Vec2) => p[0] >= 0 && p[0] <= plan.bounds.width && p[1] >= 0 && p[1] <= plan.bounds.height;
    let targets = 0;
    let matches = 0;
    for (const v of lattice) {
      for (const c of cents) {
        const t: Vec2 = [c[0] + v[0], c[1] + v[1]];
        if (!inBounds(t)) continue;
        targets++;
        if (cents.some((o) => Math.hypot(o[0] - t[0], o[1] - t[1]) <= eps)) matches++;
      }
    }
    return { value: targets === 0 ? 1 : matches / targets, components: { matches, targets } };
  },
  scoreAgainst(m, target) {
    const min = target.minFidelity;
    const score = Math.max(0, Math.min(1, m.value / min));
    const direction = m.value < min ? "increase" : "ok";
    return {
      score,
      measured: m.value,
      target: `≥${min}`,
      rule: "floor — higher is better (pattern repeats under lattice translation)",
      fix: {
        axis: "periodicity",
        direction,
        detail:
          direction === "ok"
            ? `lattice fidelity ${m.value.toFixed(3)} — pattern tiles cleanly`
            : `lattice fidelity ${m.value.toFixed(3)} below ${min} — cells drift off the grid`,
      },
    };
  },
};
