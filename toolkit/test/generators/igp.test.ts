import { describe, it, expect } from "vitest";
import { generateIgp, defaultIgpParams, SAMARKAND_PALETTE } from "../../src/generators/igp";
import { symmetryOperator } from "../../src/operators/symmetry";
import { validateRenderPlan } from "../../src/render-plan";

describe("generateIgp", () => {
  it("produces a valid plan", () => {
    expect(validateRenderPlan(generateIgp(defaultIgpParams()))).toEqual([]);
  });

  it("default params yield 78 line elements and 13 motifs", () => {
    const plan = generateIgp(defaultIgpParams());
    const lines = plan.elements.filter((e) => e.role === "line");
    const motifs = new Set(lines.map((e) => e.motifId)).size;
    expect(lines.length).toBe(78);
    expect(motifs).toBe(13);
  });

  it("is 6-fold-symmetric by construction", () => {
    expect(symmetryOperator.measure(generateIgp(defaultIgpParams())).value).toBeGreaterThan(0.99);
  });

  it("uses a blue palette within the turquoise→cobalt arc (white exempt)", () => {
    expect(SAMARKAND_PALETTE.every((c) => c.c < 0.03 || (c.h >= 180 && c.h <= 265))).toBe(true);
  });
});
