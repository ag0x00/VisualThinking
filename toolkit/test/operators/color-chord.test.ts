import { describe, it, expect } from "vitest";
import { colorChordOperator } from "../../src/operators/color-chord";
import type { RenderPlan, Oklch } from "../../src/render-plan";

function planWith(palette: Oklch[]): RenderPlan {
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", order: 6 },
    palette,
    elements: [],
  };
}

const target = { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 };

describe("colorChordOperator", () => {
  it("scores an on-arc blue chord with a near-white near 1", () => {
    const plan = planWith([
      { l: 0.45, c: 0.12, h: 240 },
      { l: 0.62, c: 0.11, h: 200 },
      { l: 0.95, c: 0.01, h: 200 }, // neutral white, hue-exempt
    ]);
    const m = colorChordOperator.measure(plan);
    expect(colorChordOperator.scoreAgainst(m, target).score).toBeGreaterThan(0.85);
  });

  it("scores an off-arc palette low and flags colorChord", () => {
    const plan = planWith([
      { l: 0.45, c: 0.15, h: 30 },
      { l: 0.62, c: 0.14, h: 110 },
      { l: 0.95, c: 0.12, h: 330 }, // chromatic, NOT hue-exempt
    ]);
    const m = colorChordOperator.measure(plan);
    const s = colorChordOperator.scoreAgainst(m, target);
    expect(s.score).toBeLessThan(0.6);
    expect(s.fix.axis).toBe("colorChord");
  });
});
