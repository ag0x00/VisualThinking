import { describe, it, expect } from "vitest";
import { symmetryOperator } from "../../src/operators/symmetry";
import type { RenderPlan, Vec2 } from "../../src/render-plan";

// A 6-fold-symmetric set of spokes about the centre.
function spokes(): RenderPlan {
  const c: Vec2 = [50, 50];
  const els = Array.from({ length: 6 }, (_, k) => {
    const a = (2 * Math.PI * k) / 6;
    const p: Vec2 = [c[0] + 40 * Math.cos(a), c[1] + 40 * Math.sin(a)];
    return { kind: "segment" as const, role: "line" as const, points: [c, p] };
  });
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", center: c, order: 6 },
    palette: [{ l: 0.5, c: 0.1, h: 200 }],
    elements: els,
  };
}

describe("symmetryOperator", () => {
  it("measures fidelity ~1 for a 6-fold-symmetric plan", () => {
    expect(symmetryOperator.measure(spokes()).value).toBeGreaterThan(0.99);
  });

  it("drops fidelity when points are jittered beyond tolerance", () => {
    const plan = spokes();
    const broken = {
      ...plan,
      elements: plan.elements.map((e, i) => ({
        ...e,
        points: e.points.map(([x, y]) => [x + (i % 2 ? 9 : -9), y + 7] as Vec2),
      })),
    };
    expect(symmetryOperator.measure(broken).value).toBeLessThan(0.5);
  });

  it("scores below target as a fix to increase symmetry", () => {
    const s = symmetryOperator.scoreAgainst({ value: 0.6 }, { minFidelity: 0.98 });
    expect(s.score).toBeLessThan(1);
    expect(s.fix).toMatchObject({ axis: "symmetry", direction: "increase" });
  });
});
