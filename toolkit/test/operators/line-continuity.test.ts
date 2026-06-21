import { describe, it, expect } from "vitest";
import { lineContinuityOperator } from "../../src/operators/line-continuity";
import { generateIgp, defaultIgpParams } from "../../src/generators/igp";

const target = { minContinuity: 0.6 };

describe("lineContinuityOperator", () => {
  it("the connected good pattern has no dangling ends and scores ok", () => {
    const m = lineContinuityOperator.measure(generateIgp(defaultIgpParams()));
    expect(m.components?.connectedness).toBe(1);
    expect(m.components?.dangling).toBe(0);
    expect(lineContinuityOperator.scoreAgainst(m, target).fix.direction).toBe("ok");
  });

  it("retracted segments dangle and score as increase", () => {
    const m = lineContinuityOperator.measure(generateIgp({ ...defaultIgpParams(), segmentScale: 0.7 }));
    expect(m.value).toBeLessThan(0.1);
    expect(m.components?.connectedness).toBeLessThan(0.1);
    expect(lineContinuityOperator.scoreAgainst(m, target).fix.direction).toBe("increase");
  });
});
