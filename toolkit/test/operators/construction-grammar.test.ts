import { describe, it, expect } from "vitest";
import { constructionGrammarOperator } from "../../src/operators/construction-grammar";
import { generateTiling, defaultTilingParams } from "../../src/generators/tiling";

const target = { band: [0.95, 1.05] as [number, number], falloff: 0.2 };

describe("constructionGrammarOperator", () => {
  it("coverage ≈ 1 for a perfect tiling, scoring ok", () => {
    const m = constructionGrammarOperator.measure(generateTiling(defaultTilingParams()));
    expect(m.value).toBeCloseTo(1, 2);
    expect(constructionGrammarOperator.scoreAgainst(m, target).fix.direction).toBe("ok");
  });

  it("flags overlap (coverage > 1) as decrease", () => {
    const m = constructionGrammarOperator.measure(generateTiling({ ...defaultTilingParams(), cellScale: 1.12 }));
    expect(m.value).toBeGreaterThan(1.05);
    expect(constructionGrammarOperator.scoreAgainst(m, target).fix.direction).toBe("decrease");
  });

  it("flags gaps (coverage < 1) as increase", () => {
    const m = constructionGrammarOperator.measure(generateTiling({ ...defaultTilingParams(), cellScale: 0.8 }));
    expect(m.value).toBeLessThan(0.95);
    expect(constructionGrammarOperator.scoreAgainst(m, target).fix.direction).toBe("increase");
  });
});
