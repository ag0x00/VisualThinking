import { describe, it, expect } from "vitest";
import { polyArea, centroid, scaleAbout } from "../src/geom";
import type { Vec2 } from "../src/render-plan";

const square: Vec2[] = [[0, 0], [10, 0], [10, 10], [0, 10]];

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
