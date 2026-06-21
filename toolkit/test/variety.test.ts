import { describe, it, expect } from "vitest";
import { converter } from "culori";
import { mulberry32, randomChord, sampleGirih12, generateArt } from "../src/variety";
import { validateRenderPlan } from "../src/render-plan";
import { generateGirih12 } from "../src/generators/girih12";

const toRgb = converter("rgb");
const inSrgb = (c: { l: number; c: number; h: number }): boolean => {
  const { r, g, b } = toRgb({ mode: "oklch", l: c.l, c: c.c, h: c.h }) as { r: number; g: number; b: number };
  const ok = (v: number) => v >= -1e-3 && v <= 1 + 1e-3;
  return ok(r) && ok(g) && ok(b);
};
// shortest angular distance between two hues, degrees
const hueDist = (a: number, b: number): number => {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
};
const arcContains = (arc: { lo: number; hi: number }, h: number): boolean => {
  const H = ((h % 360) + 360) % 360;
  return arc.lo <= arc.hi ? H >= arc.lo && H <= arc.hi : H >= arc.lo || H <= arc.hi;
};

describe("mulberry32: seeded, deterministic", () => {
  it("same seed → same stream", () => {
    const a = mulberry32(42), b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("different seeds → different streams", () => {
    const a = mulberry32(1), b = mulberry32(2);
    expect(a()).not.toEqual(b());
  });
  it("stays in [0,1)", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("randomChord: tasteful-by-construction roaming family", () => {
  it("returns 8 colours, all in the sRGB gamut", () => {
    for (const seed of [1, 2, 3, 17, 99, 1000]) {
      const { palette } = randomChord(mulberry32(seed));
      expect(palette).toHaveLength(8);
      palette.forEach((c, i) => expect(inSrgb(c), `seed ${seed} colour ${i}`).toBe(true));
    }
  });
  it("has the lightness range colorChord wants (spread ≥ 0.45)", () => {
    for (const seed of [1, 5, 50, 500]) {
      const { palette } = randomChord(mulberry32(seed));
      const ls = palette.map((c) => c.l);
      expect(Math.max(...ls) - Math.min(...ls)).toBeGreaterThanOrEqual(0.45);
    }
  });
  it("includes a neutral cream (a colour colorChord reads as neutral, c < 0.03)", () => {
    const { palette } = randomChord(mulberry32(3));
    expect(palette.some((c) => c.c < 0.03)).toBe(true);
  });
  it("the accent sits opposite the spine family (hue distance > 90°)", () => {
    const { palette } = randomChord(mulberry32(8));
    expect(hueDist(palette[5].h, palette[0].h)).toBeGreaterThan(90);
  });
  it("the hueArc brackets the spine hues (normalised, wraparound-aware)", () => {
    const { palette, hueArc } = randomChord(mulberry32(11));
    for (const i of [0, 1, 2]) expect(arcContains(hueArc, palette[i].h)).toBe(true);
    expect(hueArc.lo).toBeGreaterThanOrEqual(0);
    expect(hueArc.lo).toBeLessThan(360);
    expect(hueArc.hi).toBeGreaterThanOrEqual(0);
    expect(hueArc.hi).toBeLessThan(360);
  });
});

describe("sampleGirih12: params land in tasteful ranges and validate", () => {
  it("params are within the declared bounds", () => {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const { params } = sampleGirih12(mulberry32(seed));
      expect(params.contactAngle).toBeGreaterThanOrEqual(55);
      expect(params.contactAngle).toBeLessThanOrEqual(72);
      expect(params.dodecaRadius).toBeGreaterThanOrEqual(55);
      expect(params.dodecaRadius).toBeLessThanOrEqual(90);
      expect([3, 4, 5]).toContain(params.accentStride);
      expect(params.channelWidth).toBeGreaterThanOrEqual(3);
      expect(params.channelWidth).toBeLessThanOrEqual(6);
      expect(params.groutGap).toBe(0.05);
      expect(params.latticeJitter).toBe(0);
      expect(params.channelJitter).toBe(0);
    }
  });
  it("the sampled palette produces a valid girih12 plan", () => {
    const { params } = sampleGirih12(mulberry32(123));
    expect(validateRenderPlan(generateGirih12(params))).toEqual([]);
  });
});

describe("generateArt: seeded, quality-floored, varied", () => {
  it("is deterministic per seed", () => {
    const a = generateArt(2026), b = generateArt(2026);
    expect(a.score).toEqual(b.score);
    expect(a.meta.params).toEqual(b.meta.params);
    expect(a.meta.hueArc).toEqual(b.meta.hueArc);
  });
  it("returns a valid plan that clears the floor", () => {
    const r = generateArt(2026, { floor: 0.9 });
    expect(validateRenderPlan(r.plan)).toEqual([]);
    expect(r.score).toBeGreaterThanOrEqual(0.9);
  });
  it("different seeds produce different art", () => {
    const a = generateArt(1), b = generateArt(777);
    const differs =
      JSON.stringify(a.meta.params) !== JSON.stringify(b.meta.params) ||
      JSON.stringify(a.meta.hueArc) !== JSON.stringify(b.meta.hueArc);
    expect(differs).toBe(true);
  });
  it("a floor guard, not best-of-N: a trivially-low floor accepts the first sample (tries === 1)", () => {
    const r = generateArt(2026, { floor: 0 });
    expect(r.meta.tries).toBe(1);
  });
});
