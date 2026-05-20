import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { timuridTilingProfile } from "../src/profiles/timurid-tiling";
import { tilingGood, tilingVariants } from "../src/variants";

const good = tilingGood();
const goodResult = compose(good, timuridTilingProfile);
const variant = Object.fromEntries(
  tilingVariants().map((v) => [v.label, compose(v.plan, timuridTilingProfile)]),
);
const opScore = (r: ReturnType<typeof compose>, name: string) =>
  r.perOperator.find((p) => p.name === name)!.score;

describe("tiling spine (acceptance)", () => {
  it("the good tiling scores high overall", () => {
    expect(goodResult.composite).toBeGreaterThan(0.85);
  });

  it("the good tiling has near-perfect coverage", () => {
    expect(opScore(goodResult, "constructionGrammar")).toBeGreaterThan(0.95);
  });

  it("ranks good above overlapping cells and flags constructionGrammar:decrease", () => {
    const r = variant["overlapping cells"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "constructionGrammar" && f.direction === "decrease")).toBe(true);
  });

  it("ranks good above gappy cells and flags constructionGrammar:increase", () => {
    const r = variant["gappy cells"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "constructionGrammar" && f.direction === "increase")).toBe(true);
  });

  it("ranks good above broken-symmetry and the top fix is symmetry", () => {
    const r = variant["broken-symmetry"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes[0].axis).toBe("symmetry");
  });

  it("ranks good above wrong-chord and flags colorChord", () => {
    const r = variant["wrong-chord"];
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});
