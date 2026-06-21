import type { Element, RenderPlan, Vec2 } from "../render-plan";
import type { Measurement, Operator } from "./types";

function rotatePoint([x, y]: Vec2, [cx, cy]: Vec2, a: number): Vec2 {
  const dx = x - cx, dy = y - cy, c = Math.cos(a), s = Math.sin(a);
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

// Order-insensitive: every point in `a` has a unique nearest partner in `b`
// within eps.
function pointSetsMatch(a: Vec2[], b: Vec2[], eps: number): boolean {
  if (a.length !== b.length) return false;
  const used = new Array(b.length).fill(false);
  for (const pa of a) {
    let found = -1;
    for (let j = 0; j < b.length; j++) {
      if (!used[j] && Math.hypot(pa[0] - b[j][0], pa[1] - b[j][1]) <= eps) {
        found = j;
        break;
      }
    }
    if (found < 0) return false;
    used[found] = true;
  }
  return true;
}

export const symmetryOperator: Operator<{ minFidelity: number }> = {
  name: "symmetry",
  measure(plan: RenderPlan): Measurement {
    const order = plan.symmetry.order ?? 6;
    const center = plan.symmetry.center ?? [plan.bounds.width / 2, plan.bounds.height / 2];
    const eps = 1e-3 * Math.hypot(plan.bounds.width, plan.bounds.height);
    const els: Element[] = plan.elements.filter((e) => e.role !== "background");
    if (els.length === 0 || order < 2) return { value: 1 };
    let checks = 0, matches = 0;
    for (let k = 1; k < order; k++) {
      const angle = (2 * Math.PI * k) / order;
      for (const e of els) {
        checks++;
        const rotated = e.points.map((p) => rotatePoint(p, center, angle));
        if (els.some((o) => pointSetsMatch(rotated, o.points, eps))) matches++;
      }
    }
    return { value: checks === 0 ? 1 : matches / checks };
  },
  scoreAgainst(m, target) {
    const min = target.minFidelity;
    const score = Math.max(0, Math.min(1, m.value / min));
    const direction = m.value < min ? "increase" : "ok";
    return {
      score,
      measured: m.value,
      target: `≥${min}`,
      rule: "floor — higher is better",
      fix: {
        axis: "symmetry",
        direction,
        detail:
          direction === "ok"
            ? "symmetry within tolerance"
            : `group fidelity ${m.value.toFixed(3)} below target ${min}`,
      },
    };
  },
};
