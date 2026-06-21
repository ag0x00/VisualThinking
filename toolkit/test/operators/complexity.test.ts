import { describe, it, expect } from "vitest";
import { complexityOperator } from "../../src/operators/complexity";
import type { RenderPlan, Vec2 } from "../../src/render-plan";

function plan(nMotifs: number, nLines: number): RenderPlan {
  const elements = [];
  for (let i = 0; i < nLines; i++) {
    const a = (Math.PI * i) / nLines;
    const p: Vec2 = [50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)];
    elements.push({
      kind: "segment" as const,
      role: "line" as const,
      points: [[50, 50] as Vec2, p],
      motifId: `m-${i % nMotifs}`,
    });
  }
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", order: 6 },
    palette: [{ l: 0.5, c: 0.1, h: 200 }],
    elements,
  };
}

describe("complexityOperator", () => {
  it("reports higher value for richer plans", () => {
    const lo = complexityOperator.measure(plan(2, 6)).value;
    const hi = complexityOperator.measure(plan(13, 80)).value;
    expect(hi).toBeGreaterThan(lo);
  });

  it("scores in-band as ok, below-band as increase, above-band as decrease", () => {
    const band = { band: [0.55, 0.78] as [number, number], falloff: 0.25 };
    expect(complexityOperator.scoreAgainst({ value: 0.65 }, band).fix.direction).toBe("ok");
    expect(complexityOperator.scoreAgainst({ value: 0.2 }, band).fix.direction).toBe("increase");
    expect(complexityOperator.scoreAgainst({ value: 0.95 }, band).fix.direction).toBe("decrease");
  });
});
