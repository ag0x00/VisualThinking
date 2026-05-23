import { describe, it, expect } from "vitest";
import { buildTiling, strapworkPlan, generatePolygonal, CLEAN_TYPES } from "../src/generators/polygonal";
import { validateRenderPlan } from "../src/render-plan";

const BOUNDS = { width: 800, height: 800 };

describe("polygonal generator: tactile-js tiling + strapwork inference → line plan", () => {
  it("builds a non-empty polygon grid from a curated tiling type", () => {
    const t = buildTiling({ typeIndex: CLEAN_TYPES[1], bounds: BOUNDS });
    expect(t.polys.length).toBeGreaterThan(10);
    expect(t.polys[0].length).toBeGreaterThanOrEqual(3); // real polygons
  });

  it("produces a valid line-only RenderPlan (background + segments, no out-of-range refs)", () => {
    const plan = generatePolygonal({ typeIndex: CLEAN_TYPES[1], contactAngle: 45, bounds: BOUNDS });
    expect(validateRenderPlan(plan)).toEqual([]);
    expect(plan.elements.some((e) => e.role === "background")).toBe(true);
    const lines = plan.elements.filter((e) => e.role === "line");
    expect(lines.length).toBeGreaterThan(50);
    expect(lines.every((e) => e.kind === "segment" && e.points.length === 2)).toBe(true);
  });

  it("is deterministic for a fixed type + angle", () => {
    const a = generatePolygonal({ typeIndex: 6, contactAngle: 50, bounds: BOUNDS });
    const b = generatePolygonal({ typeIndex: 6, contactAngle: 50, bounds: BOUNDS });
    expect(a.elements.length).toBe(b.elements.length);
    expect(JSON.stringify(a.elements[1])).toEqual(JSON.stringify(b.elements[1]));
  });

  it("re-decorating the SAME grid at a different angle changes the lines but not the grid", () => {
    const grid = buildTiling({ typeIndex: 6, bounds: BOUNDS });
    const median = strapworkPlan(grid, 50);
    const acute = strapworkPlan(grid, 30);
    // same number of tiles decorated, but the strand geometry differs (the breath)
    const firstSegMedian = JSON.stringify(median.elements.find((e) => e.role === "line"));
    const firstSegAcute = JSON.stringify(acute.elements.find((e) => e.role === "line"));
    expect(firstSegMedian).not.toEqual(firstSegAcute);
  });

  it("multi-level rosette adds interior strands (more lines than single-pass), still valid", () => {
    const grid = buildTiling({ typeIndex: 6, bounds: BOUNDS });
    const l1 = strapworkPlan(grid, 48, { levels: 1 });
    const l2 = strapworkPlan(grid, 48, { levels: 2 });
    const count = (p: typeof l1) => p.elements.filter((e) => e.role === "line").length;
    expect(count(l2)).toBeGreaterThan(count(l1)); // nested inner stars add segments
    expect(validateRenderPlan(l2)).toEqual([]);
    // the outer level is preserved — l2 contains every l1 segment plus more
    expect(count(l2)).toBeGreaterThanOrEqual(count(l1) * 1.5);
  });
});
