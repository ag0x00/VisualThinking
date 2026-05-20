import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import type { AestheticProfile } from "../src/profile";
import type { RenderPlan, Vec2 } from "../src/render-plan";

function symmetricPlan(): RenderPlan {
  const c: Vec2 = [50, 50];
  const els = Array.from({ length: 6 }, (_, k) => {
    const a = (2 * Math.PI * k) / 6;
    const p: Vec2 = [c[0] + 40 * Math.cos(a), c[1] + 40 * Math.sin(a)];
    return { kind: "segment" as const, role: "line" as const, points: [c, p], motifId: "spokes" };
  });
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", center: c, order: 6 },
    palette: [{ l: 0.3, c: 0.1, h: 240 }, { l: 0.9, c: 0.02, h: 200 }],
    elements: els,
  };
}

const profile: AestheticProfile = {
  medium: "test",
  operators: [
    { operator: "symmetry", weight: 0.5, target: { minFidelity: 0.98 } },
    { operator: "colorChord", weight: 0.5, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
};

describe("compose", () => {
  it("returns a weighted composite and per-operator scores", () => {
    const r = compose(symmetricPlan(), profile);
    expect(r.composite).toBeGreaterThan(0.8);
    expect(r.perOperator.map((p) => p.name).sort()).toEqual(["colorChord", "symmetry"]);
  });

  it("ranks fixes by impact = (1 - score) * weight, descending", () => {
    const broken = symmetricPlan();
    broken.elements = broken.elements.map((e) => ({ ...e, points: e.points.map(([x, y]) => [x + 9, y + 9] as Vec2) }));
    const r = compose(broken, profile);
    expect(r.fixes[0].axis).toBe("symmetry");
  });

  it("throws on an unknown operator", () => {
    expect(() => compose(symmetricPlan(), { medium: "x", operators: [{ operator: "nope", weight: 1, target: {} }] }))
      .toThrow(/Unknown operator/);
  });
});
