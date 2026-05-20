import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { generateIgp, defaultIgpParams } from "../src/generators/igp";
import { timuridIgpProfile } from "../src/profiles/timurid-igp";
import type { Oklch, RenderPlan, Vec2 } from "../src/render-plan";

// Deterministic jitter (no RNG dependency).
function jitter(plan: RenderPlan, mag: number): RenderPlan {
  let i = 0;
  const h = () => {
    const s = Math.sin(++i * 12.9898) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };
  return {
    ...plan,
    elements: plan.elements.map((e) =>
      e.role === "background" ? e : { ...e, points: e.points.map(([x, y]) => [x + h() * mag, y + h() * mag] as Vec2) },
    ),
  };
}

const OFF_ARC: Oklch[] = [
  { l: 0.45, c: 0.15, h: 30 },
  { l: 0.62, c: 0.14, h: 110 },
  { l: 0.72, c: 0.12, h: 330 },
  { l: 0.95, c: 0.12, h: 30 }, // chromatic white → NOT hue-exempt
  { l: 0.30, c: 0.10, h: 120 },
];

const good = generateIgp(defaultIgpParams());
const goodResult = compose(good, timuridIgpProfile);
const opScore = (r: ReturnType<typeof compose>, name: string) =>
  r.perOperator.find((p) => p.name === name)!.score;

describe("operator-composition spine (acceptance)", () => {
  it("the good plan scores high overall", () => {
    expect(goodResult.composite).toBeGreaterThan(0.7);
  });

  it("ranks good above broken-symmetry and the top fix is symmetry", () => {
    const r = compose(jitter(good, 8), timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(opScore(r, "symmetry")).toBeLessThan(opScore(goodResult, "symmetry"));
    expect(r.fixes[0].axis).toBe("symmetry");
  });

  it("ranks good above under-dense and flags complexity:increase", () => {
    const sparse = generateIgp({ ...defaultIgpParams(), rings: 1, includeStars: false });
    const r = compose(sparse, timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "complexity" && f.direction === "increase")).toBe(true);
  });

  it("ranks good above over-dense and flags complexity:decrease", () => {
    const dense = generateIgp({ ...defaultIgpParams(), rings: 14 });
    const r = compose(dense, timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "complexity" && f.direction === "decrease")).toBe(true);
  });

  it("ranks good above wrong-chord and flags colorChord", () => {
    const offChord = { ...good, palette: OFF_ARC };
    const r = compose(offChord, timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});
