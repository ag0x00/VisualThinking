import { describe, it, expect } from "vitest";
import { polyArea, centroid, scaleAbout, clipToConvexRegion, effectiveArea } from "../src/geom";
import type { Vec2 } from "../src/render-plan";

const square: Vec2[] = [[0, 0], [10, 0], [10, 10], [0, 10]];
const RECT: Vec2[] = [[0, 0], [100, 0], [100, 100], [0, 100]];

describe("geom", () => {
  it("polyArea of a 10×10 square is 100", () => {
    expect(polyArea(square)).toBe(100);
  });

  it("centroid of the square is its centre", () => {
    expect(centroid(square)).toEqual([5, 5]);
  });

  it("scaling about the centroid by f scales area by f^2", () => {
    const scaled = scaleAbout(square, centroid(square), 2);
    expect(polyArea(scaled)).toBeCloseTo(400, 6);
  });
});

describe("clipToConvexRegion", () => {
  it("leaves a fully-inside polygon's area unchanged", () => {
    const sq: Vec2[] = [[10, 10], [40, 10], [40, 40], [10, 40]];
    expect(effectiveArea(sq, RECT)).toBeCloseTo(polyArea(sq), 6);
  });

  it("clips a straddling polygon to the in-frame part", () => {
    const sq: Vec2[] = [[80, 80], [120, 80], [120, 120], [80, 120]]; // half-out each axis
    expect(effectiveArea(sq, RECT)).toBeCloseTo(400, 4); // 20x20 corner inside
  });

  it("returns ~0 area for a fully-outside polygon", () => {
    const sq: Vec2[] = [[200, 200], [240, 200], [240, 240], [200, 240]];
    expect(effectiveArea(sq, RECT)).toBeCloseTo(0, 6);
  });

  it("works against a convex non-rect region (triangle)", () => {
    const tri: Vec2[] = [[0, 0], [100, 0], [0, 100]];
    const sq: Vec2[] = [[10, 10], [90, 10], [90, 90], [10, 90]]; // partly past the hypotenuse
    expect(effectiveArea(sq, tri)).toBeLessThan(polyArea(sq));
    expect(effectiveArea(sq, tri)).toBeGreaterThan(0);
  });
});
