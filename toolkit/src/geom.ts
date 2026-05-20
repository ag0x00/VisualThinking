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
