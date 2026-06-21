import { describe, it, expect } from "vitest";
import { colorChordOperator } from "../../src/operators/color-chord";
import type { RenderPlan, Oklch } from "../../src/render-plan";
import { generateGirih12, defaultGirih12Params } from "../../src/generators/girih12";

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

describe("colorChord is area-weighted on fill media", () => {
  const areaTarget = { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45, neutralCap: 0.25 };

  it("a tiny off-arc accent barely dents the score (girih12 good)", () => {
    const m = colorChordOperator.measure(generateGirih12(defaultGirih12Params()));
    const s = colorChordOperator.scoreAgainst(m, areaTarget);
    expect(s.score).toBeGreaterThan(0.85); // 3.75%-area saffron no longer tanks it
  });

  it("cream dominance (very thick grout → cream is ~half the frame) is penalised", () => {
    // With the cream ground, thin/moderate grout is fine (no dark bleed); only genuine
    // cream DOMINANCE is a defect. groutGap 0.30 → ~51% cream → balance term bites.
    const dominant = colorChordOperator.scoreAgainst(colorChordOperator.measure(generateGirih12({ ...defaultGirih12Params(), groutGap: 0.30 })), areaTarget);
    const good = colorChordOperator.scoreAgainst(colorChordOperator.measure(generateGirih12(defaultGirih12Params())), areaTarget);
    expect(dominant.score).toBeLessThan(0.85);
    expect(dominant.score).toBeLessThan(good.score); // monotone: more cream scores worse
  });

  it("falls back to membership for region-less line plans (finite, no crash)", () => {
    const linePlan: RenderPlan = {
      bounds: { width: 100, height: 100 },
      symmetry: { group: "p6m", order: 6 },
      palette: [{ l: 0.5, c: 0.1, h: 200 }],
      elements: [{ kind: "segment", role: "line", points: [[0, 0], [10, 10]], strokeRef: 0 }],
    };
    const s = colorChordOperator.scoreAgainst(colorChordOperator.measure(linePlan), areaTarget);
    expect(Number.isFinite(s.score)).toBe(true);
  });
});
