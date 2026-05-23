import type { Vec2 } from "../render-plan";

// Hankin's "polygons in contact" (PIC), in Kaplan's uniform-inference form.
// Given one tile polygon and a contact angle, infer that cell's strapwork lines.
//
// Each edge owns a contact point at its midpoint; two rays leave it INTO the tile,
// each making angle θ with the edge (θ measured from the edge: θ→90° = along the
// inward normal). The 2n rays are paired greedily by least path length; an accepted
// pair {i,j} crossing at P contributes the two segments midᵢ→P and P→midⱼ.
//
// Continuity is a property of the shared EDGE, not the cell: the neighbour computes
// the same midpoint at the same θ, so the strand crosses the boundary regardless of
// how either cell routes its interior. That invariant is what makes per-cell
// re-decoration safe (the edge is the API; inferStrapwork is the implementation).

export interface Segment {
  a: Vec2;
  b: Vec2;
}

interface Ray {
  o: Vec2; // origin (an edge midpoint)
  d: Vec2; // unit direction, into the tile
}

const sub = (p: Vec2, q: Vec2): Vec2 => [p[0] - q[0], p[1] - q[1]];
const mid = (p: Vec2, q: Vec2): Vec2 => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const norm = (p: Vec2): Vec2 => {
  const m = Math.hypot(p[0], p[1]) || 1;
  return [p[0] / m, p[1] / m];
};
const rotate = (v: Vec2, phi: number): Vec2 => {
  const c = Math.cos(phi), s = Math.sin(phi);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
};
// signed area > 0 ⇒ CCW winding (interior is to the LEFT of each directed edge)
const isCCW = (verts: Vec2[]): boolean => {
  let a = 0;
  for (let i = 0; i < verts.length; i++) {
    const [x0, y0] = verts[i], [x1, y1] = verts[(i + 1) % verts.length];
    a += x0 * y1 - x1 * y0;
  }
  return a > 0;
};

// Forward intersection of two half-lines; null if parallel or behind either origin.
function rayHit(r1: Ray, r2: Ray): { p: Vec2; t: number; s: number } | null {
  const det = r2.d[0] * r1.d[1] - r1.d[0] * r2.d[1];
  if (Math.abs(det) < 1e-9) return null;
  const dx = r2.o[0] - r1.o[0], dy = r2.o[1] - r1.o[1];
  const t = (-dx * r2.d[1] + r2.d[0] * dy) / det;
  const s = (r1.d[0] * dy - r1.d[1] * dx) / det;
  if (t < 1e-6 || s < 1e-6) return null;
  return { p: [r1.o[0] + t * r1.d[0], r1.o[1] + t * r1.d[1]], t, s };
}

// The full inference: the strands PLUS the interior crossing points where paired
// rays met. The crossings are the seed for a second (inner) level — they form a
// ring inside the cell that can itself be decorated, giving multi-level depth.
export function inferStrapworkDetailed(verts: Vec2[], contactAngleDeg: number): { segments: Segment[]; crossings: Vec2[] } {
  const n = verts.length;
  if (n < 3) return { segments: [], crossings: [] };
  const ccw = isCCW(verts);
  const offFromNormal = Math.PI / 2 - (contactAngleDeg * Math.PI) / 180;

  // two rays per edge midpoint, fired into the tile. The interior side is fixed by
  // winding (left of each directed edge for CCW) — correct even for non-convex tiles
  // like the bowtie, where a centroid-direction test would fail at reflex corners.
  const rays: Ray[] = [];
  for (let i = 0; i < n; i++) {
    const a = verts[i], b = verts[(i + 1) % n];
    const m = mid(a, b);
    const along = norm(sub(b, a));
    const inward: Vec2 = ccw ? [-along[1], along[0]] : [along[1], -along[0]];
    rays.push({ o: m, d: rotate(inward, offFromNormal) });
    rays.push({ o: m, d: rotate(inward, -offFromNormal) });
  }

  // candidate pairings by ascending path length (greedy least-length inference)
  const cands: { i: number; j: number; p: Vec2; cost: number }[] = [];
  for (let i = 0; i < rays.length; i++) {
    for (let j = i + 1; j < rays.length; j++) {
      const hit = rayHit(rays[i], rays[j]);
      if (hit) cands.push({ i, j, p: hit.p, cost: hit.t + hit.s });
    }
  }
  cands.sort((x, y) => x.cost - y.cost);

  const used = new Array<boolean>(rays.length).fill(false);
  const segments: Segment[] = [];
  const crossings: Vec2[] = [];
  for (const { i, j, p } of cands) {
    if (used[i] || used[j]) continue;
    used[i] = used[j] = true;
    segments.push({ a: rays[i].o, b: p }, { a: p, b: rays[j].o });
    crossings.push(p);
  }
  return { segments, crossings };
}

export function inferStrapwork(verts: Vec2[], contactAngleDeg: number): Segment[] {
  return inferStrapworkDetailed(verts, contactAngleDeg).segments;
}
