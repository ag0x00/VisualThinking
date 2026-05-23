import { describe, it, expect } from "vitest";
import { inferStrapwork } from "../src/generators/strapwork";
import type { Vec2 } from "../src/render-plan";

const SQUARE: Vec2[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
const finite = (v: Vec2) => Number.isFinite(v[0]) && Number.isFinite(v[1]);
const inside = (v: Vec2, lo = -0.02, hi = 1.02) => v[0] >= lo && v[0] <= hi && v[1] >= lo && v[1] <= hi;

describe("inferStrapwork: Hankin polygons-in-contact", () => {
  it("fires two rays per edge and pairs them into segments", () => {
    const segs = inferStrapwork(SQUARE, 45);
    expect(segs.length).toBeGreaterThan(0);
    expect(segs.length % 2).toBe(0); // each accepted pair emits two segments
    expect(segs.length).toBeLessThanOrEqual(2 * SQUARE.length); // ≤ 2n
  });

  it("clips every strand at an interior crossing — nothing flies off the tile", () => {
    const segs = inferStrapwork(SQUARE, 45);
    for (const s of segs) {
      expect(finite(s.a) && finite(s.b)).toBe(true);
      expect(inside(s.a) && inside(s.b)).toBe(true);
    }
  });

  it("anchors every strand at an edge midpoint (the shared-edge contact point)", () => {
    const mids: Vec2[] = [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]];
    const near = (v: Vec2) => mids.some((m) => Math.hypot(v[0] - m[0], v[1] - m[1]) < 1e-6);
    // each segment is mid→P or P→mid, so at least one endpoint is a contact point.
    // (at the special angle 45° the crossing P itself lands on a midpoint, so both are.)
    for (const s of inferStrapwork(SQUARE, 30)) {
      expect(near(s.a) || near(s.b)).toBe(true);
    }
  });

  it("contact angle changes the motif (acute vs obtuse give different geometry)", () => {
    const acute = inferStrapwork(SQUARE, 25);
    const obtuse = inferStrapwork(SQUARE, 70);
    // the crossing points differ between angles
    const crossingsAcute = acute.map((s) => s.b);
    const crossingsObtuse = obtuse.map((s) => s.b);
    expect(JSON.stringify(crossingsAcute)).not.toEqual(JSON.stringify(crossingsObtuse));
  });

  it("degenerate input is handled (fewer than 3 verts → no segments)", () => {
    expect(inferStrapwork([[0, 0], [1, 0]], 45)).toEqual([]);
  });
});
