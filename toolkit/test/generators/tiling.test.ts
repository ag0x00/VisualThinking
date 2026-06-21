import { describe, it, expect } from "vitest";
import { generateTiling, defaultTilingParams } from "../../src/generators/tiling";
import { symmetryOperator } from "../../src/operators/symmetry";
import { polyArea } from "../../src/geom";
import { validateRenderPlan } from "../../src/render-plan";

describe("generateTiling", () => {
  it("produces a valid plan with a design region", () => {
    const plan = generateTiling(defaultTilingParams());
    expect(validateRenderPlan(plan)).toEqual([]);
    expect(plan.region && plan.region.length).toBe(6);
  });

  it("emits 31 filled tile cells (1 core + 5 bands × 6)", () => {
    const tiles = generateTiling(defaultTilingParams()).elements.filter((e) => e.role === "tile");
    expect(tiles.length).toBe(31);
    expect(tiles.every((t) => t.kind === "polygon" && t.colorRef != null)).toBe(true);
  });

  it("is a valid tiling: cells partition the region (coverage ≈ 1)", () => {
    const plan = generateTiling(defaultTilingParams());
    const sumCell = plan.elements.filter((e) => e.role === "tile").reduce((s, t) => s + polyArea(t.points), 0);
    const regionArea = polyArea(plan.region!);
    expect(sumCell / regionArea).toBeCloseTo(1, 2);
  });

  it("is 6-fold-symmetric by construction", () => {
    expect(symmetryOperator.measure(generateTiling(defaultTilingParams())).value).toBeGreaterThan(0.99);
  });
});
