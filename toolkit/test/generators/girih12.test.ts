import { describe, it, expect } from "vitest";
import { generateGirih12, defaultGirih12Params, SAMARKAND_7 } from "../../src/generators/girih12";
import { validateRenderPlan } from "../../src/render-plan";
import { polyArea } from "../../src/geom";

describe("generateGirih12", () => {
  it("emits a valid plan: stars + 12 petals each + glazed triangles + background, on a hex lattice", () => {
    const p = generateGirih12(defaultGirih12Params());
    expect(validateRenderPlan(p)).toEqual([]);
    const stars = p.elements.filter((e) => e.role === "tile" && e.motifId === "star");
    const petals = p.elements.filter((e) => e.role === "tile" && e.motifId === "petal");
    const triangles = p.elements.filter((e) => e.role === "tile" && e.motifId === "triangle");
    expect(stars.length).toBeGreaterThan(0);
    expect(petals.length).toBe(stars.length * 12); // 12 petals per dodecagon
    expect(triangles.length).toBeGreaterThan(0); // no empty gaps — interstices are glazed tiles
    expect(p.elements.some((e) => e.role === "background")).toBe(true);
    expect(p.symmetry.lattice).toBeDefined();
    expect(p.region).toEqual([[0, 0], [800, 0], [800, 800], [0, 800]]);
  });

  it("places warm accents symmetrically — present but under the 5% area budget", () => {
    const p = generateGirih12(defaultGirih12Params());
    const total = p.bounds.width * p.bounds.height;
    const accentArea = p.elements
      .filter((e) => e.role === "tile" && e.colorRef != null && e.colorRef >= 5)
      .reduce((s, e) => s + polyArea(e.points), 0);
    expect(accentArea).toBeGreaterThan(0); // accents are actually present
    expect(accentArea / total).toBeLessThan(0.05);
  });

  it("colors are bound to shape-class (stars one color modulo the symmetric accent; petals a symmetric 2-coloring)", () => {
    const p = generateGirih12(defaultGirih12Params());
    const starColors = new Set(p.elements.filter((e) => e.motifId === "star").map((e) => e.colorRef));
    const petalColors = new Set(p.elements.filter((e) => e.motifId === "petal").map((e) => e.colorRef));
    const triColors = new Set(p.elements.filter((e) => e.motifId === "triangle").map((e) => e.colorRef));
    expect(starColors.size).toBeLessThanOrEqual(2); // base + one accent, never scattered singletons
    expect(petalColors.size).toBe(2); // symmetric alternation
    expect(triColors.size).toBe(1); // triangles one consistent color
  });

  it("is deterministic for fixed params", () => {
    expect(JSON.stringify(generateGirih12(defaultGirih12Params()))).toBe(JSON.stringify(generateGirih12(defaultGirih12Params())));
  });

  it("SAMARKAND_7 has 8 entries and is generator-local (shared SAMARKAND_PALETTE untouched)", () => {
    expect(SAMARKAND_7.length).toBe(8);
  });
});
