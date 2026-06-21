import type { Vec2 } from "../render-plan";

// The five Lu-Steinhardt girih tiles. All share one edge length; all interior
// angles are multiples of 36°. Each is built by a turtle walk (turn by the
// exterior angle at each vertex) and centered on its centroid. Decorated by the
// shared PIC inference at a 54°-from-edge contact angle (= the 72°/108° girih rule),
// they assemble into authentic girih — strands continuous across shared edges.

export type GirihTile = "decagon" | "pentagon" | "hexagon" | "bowtie" | "rhombus";

// The canonical girih contact angle (degrees from the edge). 54° == the 72°/108°
// "two lines through each edge midpoint" rule (Lu & Steinhardt 2007).
export const GIRIH_ANGLE = 54;

function buildTile(interior: number[], s = 1): Vec2[] {
  const pts: Vec2[] = [];
  let x = 0, y = 0, heading = 0;
  for (const a of interior) {
    pts.push([x, y]);
    x += s * Math.cos(heading);
    y += s * Math.sin(heading);
    heading += Math.PI - (a * Math.PI) / 180; // exterior-angle turn (left; reflex turns right)
  }
  const cx = pts.reduce((acc, p) => acc + p[0], 0) / pts.length;
  const cy = pts.reduce((acc, p) => acc + p[1], 0) / pts.length;
  return pts.map(([px, py]) => [px - cx, py - cy] as Vec2);
}

// interior-angle sequences (degrees)
const ANGLES: Record<GirihTile, number[]> = {
  decagon: Array(10).fill(144),
  pentagon: Array(5).fill(108),
  hexagon: [72, 144, 144, 72, 144, 144], // elongated hexagon ("bobbin"/shesh-band)
  bowtie: [72, 72, 216, 72, 72, 216],     // non-convex (two reflex corners)
  rhombus: [72, 108, 72, 108],            // fat decagonal rhombus
};

export function tile(kind: GirihTile, s = 1): Vec2[] {
  return buildTile(ANGLES[kind], s);
}

// rigid placement: rotate (radians) + scale + translate a tile's local vertices
export function place(poly: Vec2[], center: Vec2, rot = 0, scale = 1): Vec2[] {
  const c = Math.cos(rot), sn = Math.sin(rot);
  return poly.map(([x, y]) => [
    center[0] + scale * (x * c - y * sn),
    center[1] + scale * (x * sn + y * c),
  ] as Vec2);
}

// Edge-matching placement: lay a new tile so its edge `edgeIndex` coincides with the
// world edge [P, Q] (shared, reversed) — the new tile lands on the far side of P→Q.
// This is how girih tiles assemble: attach tile to tile by matching equal-length edges.
export function attach(base: [Vec2, Vec2], kind: GirihTile, edgeIndex: number, s = 1): Vec2[] {
  const [P, Q] = base;
  const local = tile(kind, s);
  const vj = local[edgeIndex], vk = local[(edgeIndex + 1) % local.length];
  const eLocal = Math.atan2(vk[1] - vj[1], vk[0] - vj[0]);
  const eTarget = Math.atan2(P[1] - Q[1], P[0] - Q[0]); // reversed: P-Q
  const rot = eTarget - eLocal;
  const c = Math.cos(rot), sn = Math.sin(rot);
  return local.map(([x, y]) => {
    const dx = x - vj[0], dy = y - vj[1];
    return [Q[0] + dx * c - dy * sn, Q[1] + dx * sn + dy * c] as Vec2; // vj → Q, vk → P
  });
}
