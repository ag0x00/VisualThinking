import { describe, it, expect } from "vitest";
import { generateTruchet, defaultTruchetParams } from "../../src/generators/truchet";
import { validateRenderPlan } from "../../src/render-plan";

describe("generateTruchet", () => {
  it("emits gridSize^2 tiles, 2 arcs per cell, a background, and a valid plan", () => {
    const p = generateTruchet(defaultTruchetParams());
    expect(p.elements.filter((e) => e.role === "tile").length).toBe(64); // 8x8
    expect(p.elements.filter((e) => e.role === "line" && e.kind === "path").length).toBe(128); // 2 per cell
    expect(p.elements.some((e) => e.role === "background")).toBe(true);
    expect(validateRenderPlan(p)).toEqual([]);
  });

  it("declares the lattice and the canvas region", () => {
    const p = generateTruchet(defaultTruchetParams());
    expect(p.symmetry.lattice).toEqual([[100, 0], [0, 100]]); // 800 / 8
    expect(p.region).toEqual([[0, 0], [800, 0], [800, 800], [0, 800]]);
  });

  it("is deterministic for a fixed seed", () => {
    expect(JSON.stringify(generateTruchet(defaultTruchetParams()))).toBe(JSON.stringify(generateTruchet(defaultTruchetParams())));
  });
});
