import { describe, it, expect } from "vitest";
import { cuerdaSecaOperator } from "../../src/operators/cuerda-seca";
import { generateTiling, defaultTilingParams } from "../../src/generators/tiling";

const target = { minQuality: 0.85 };

describe("cuerdaSecaOperator", () => {
  it("uniform channels are complete and uniform, scoring ok", () => {
    const m = cuerdaSecaOperator.measure(generateTiling(defaultTilingParams()));
    expect(m.components?.complete).toBe(1);
    expect(m.components?.uniformity).toBe(1);
    expect(cuerdaSecaOperator.scoreAgainst(m, target).fix.direction).toBe("ok");
  });

  it("jittered channels lose uniformity and score as increase", () => {
    const m = cuerdaSecaOperator.measure(generateTiling({ ...defaultTilingParams(), channelJitter: 1.0 }));
    expect(m.value).toBeLessThan(0.85);
    expect((m.components?.uniformity ?? 1)).toBeLessThan(0.7);
    expect(cuerdaSecaOperator.scoreAgainst(m, target).fix.direction).toBe("increase");
  });

  it("reports 0 when no tiles carry a channel", () => {
    expect(cuerdaSecaOperator.measure({ bounds: { width: 10, height: 10 }, symmetry: { group: "p6m" }, palette: [{ l: 0.5, c: 0.1, h: 200 }], elements: [] }).value).toBe(0);
  });
});
