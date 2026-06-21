import { describe, it, expect } from "vitest";
import { validateRenderPlan, type RenderPlan } from "../src/render-plan";

const base: RenderPlan = {
  bounds: { width: 100, height: 100 },
  symmetry: { group: "p6m", center: [50, 50], order: 6 },
  palette: [{ l: 0.5, c: 0.1, h: 200 }],
  elements: [
    { kind: "segment", role: "line", points: [[0, 0], [10, 10]], strokeRef: 0 },
  ],
};

describe("validateRenderPlan", () => {
  it("accepts a well-formed plan", () => {
    expect(validateRenderPlan(base)).toEqual([]);
  });

  it("flags out-of-range strokeRef", () => {
    const bad = { ...base, elements: [{ ...base.elements[0], strokeRef: 5 }] };
    expect(validateRenderPlan(bad).some((e) => e.includes("strokeRef"))).toBe(true);
  });

  it("flags empty palette and degenerate elements", () => {
    const bad: RenderPlan = {
      ...base,
      palette: [],
      elements: [{ kind: "segment", role: "line", points: [[0, 0]] }],
    };
    const errs = validateRenderPlan(bad);
    expect(errs.some((e) => e.includes("palette"))).toBe(true);
    expect(errs.some((e) => e.includes(">=2 points"))).toBe(true);
  });
});
