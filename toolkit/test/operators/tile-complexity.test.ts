import { describe, it, expect } from "vitest";
import { tileComplexityOperator } from "../../src/operators/tile-complexity";
import { generateTiling, defaultTilingParams } from "../../src/generators/tiling";

const target = { band: [0.5, 0.85] as [number, number], falloff: 0.25 };

describe("tileComplexityOperator", () => {
  it("the default tiling lands in band (varied cells + colours)", () => {
    const m = tileComplexityOperator.measure(generateTiling(defaultTilingParams()));
    expect(m.components?.distinctColors).toBe(3);
    expect(tileComplexityOperator.scoreAgainst(m, target).fix.direction).toBe("ok");
  });

  it("a monotone tiling drops below band and flags increase", () => {
    const m = tileComplexityOperator.measure(generateTiling({ ...defaultTilingParams(), colorCount: 1 }));
    expect(m.components?.distinctColors).toBe(1);
    expect(m.value).toBeLessThan(0.5);
    expect(tileComplexityOperator.scoreAgainst(m, target).fix.direction).toBe("increase");
  });
});
