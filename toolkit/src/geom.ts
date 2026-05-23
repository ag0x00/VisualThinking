import type { Vec2 } from "./render-plan";

export function polyArea(pts: Vec2[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  }
  return Math.abs(a) / 2;
}

export function centroid(pts: Vec2[]): Vec2 {
  let x = 0, y = 0;
  for (const [px, py] of pts) {
    x += px;
    y += py;
  }
  return [x / pts.length, y / pts.length];
}

export function scaleAbout(pts: Vec2[], c: Vec2, f: number): Vec2[] {
  return pts.map(([x, y]) => [c[0] + (x - c[0]) * f, c[1] + (y - c[1]) * f] as Vec2);
}

// Sutherland–Hodgman clip of a subject polygon against a CONVEX region polygon.
// Region winding is detected from its signed area, so either orientation works.
// Returns the clipped polygon ([] if fully outside).
export function clipToConvexRegion(subject: Vec2[], region: Vec2[]): Vec2[] {
  if (region.length < 3 || subject.length < 3) return subject;
  let area2 = 0;
  for (let i = 0; i < region.length; i++) {
    const [x0, y0] = region[i];
    const [x1, y1] = region[(i + 1) % region.length];
    area2 += x0 * y1 - x1 * y0;
  }
  const ccw = area2 > 0;
  let output = subject;
  for (let i = 0; i < region.length && output.length > 0; i++) {
    const a = region[i];
    const b = region[(i + 1) % region.length];
    const inside = (p: Vec2) => {
      const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
      return ccw ? cross >= 0 : cross <= 0;
    };
    const intersect = (p: Vec2, q: Vec2): Vec2 => {
      const r: Vec2 = [q[0] - p[0], q[1] - p[1]];
      const s: Vec2 = [b[0] - a[0], b[1] - a[1]];
      const denom = r[0] * s[1] - r[1] * s[0];
      if (denom === 0) return q;
      const t = ((a[0] - p[0]) * s[1] - (a[1] - p[1]) * s[0]) / denom;
      return [p[0] + t * r[0], p[1] + t * r[1]];
    };
    const input = output;
    output = [];
    for (let j = 0; j < input.length; j++) {
      const cur = input[j];
      const prev = input[(j + input.length - 1) % input.length];
      const curIn = inside(cur);
      const prevIn = inside(prev);
      if (curIn) {
        if (!prevIn) output.push(intersect(prev, cur));
        output.push(cur);
      } else if (prevIn) {
        output.push(intersect(prev, cur));
      }
    }
  }
  return output;
}

// Area of a polygon clipped to the region — i.e. the part the renderer actually shows.
export function effectiveArea(poly: Vec2[], region: Vec2[]): number {
  return polyArea(clipToConvexRegion(poly, region));
}
