import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { timuridIgpProfile } from "../src/profiles/timurid-igp";
import { goodPlan, degradedVariants } from "../src/variants";

const good = goodPlan();
const goodResult = compose(good, timuridIgpProfile);
const variant = Object.fromEntries(
  degradedVariants().map((v) => [v.label, compose(v.plan, timuridIgpProfile)]),
);
const opScore = (r: ReturnType<typeof compose>, name: string) =>
  r.perOperator.find((p) => p.name === name)!.score;

describe("operator-composition spine (acceptance)", () => {
  it("the good plan scores high overall", () => {
    expect(goodResult.composite).toBeGreaterThan(0.7);
  });

  it("ranks good above broken-symmetry and the top fix is symmetry", () => {
    const r = variant["broken-symmetry"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(opScore(r, "symmetry")).toBeLessThan(opScore(goodResult, "symmetry"));
    expect(r.fixes[0].axis).toBe("symmetry");
  });

  it("ranks good above under-dense and flags complexity:increase", () => {
    const r = variant["under-dense"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "complexity" && f.direction === "increase")).toBe(true);
  });

  it("ranks good above over-dense and flags complexity:decrease", () => {
    const r = variant["over-dense"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "complexity" && f.direction === "decrease")).toBe(true);
  });

  it("ranks good above wrong-chord and flags colorChord", () => {
    const r = variant["wrong-chord"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});
