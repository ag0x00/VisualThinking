import { IsohedralTiling, tilingTypes, mul } from "tactile-js";
import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";
import { inferStrapwork, inferStrapworkDetailed, type Segment } from "./strapwork";

// The polygonal-technique line generator. Two layers, separable so animation can
// re-decorate a STATIC grid each frame at a new contact angle without recomputing
// the tiling (the major grid is fixed; only the strapwork θ breathes):
//
//   buildTiling(...)         → the invisible polygon grid (tactile-js, computed once)
//   strapworkPlan(grid, θ)   → a line-only RenderPlan (Hankin inference, per θ)
//   generatePolygonal(...)   → convenience = build + decorate
//
// Lines only, monochrome by default (ink on a warm ground) — colour is removed per
// the line-art direction. The tiling provider is tactile-js (isohedral types);
// curate to the clean edge-to-edge ones (see CLEAN_TYPES).

// Curated isohedral type INDICES (into tactile-js `tilingTypes`) that give clean,
// edge-to-edge straight-edge polygon tilings — verified to decorate into coherent
// strapwork. (The pentagon/“J-edge” types can be non-edge-to-edge; excluded.)
export const CLEAN_TYPES = [0, 6, 7, 12, 15, 20, 27, 50, 63, 74, 78, 80];

// ink (near-black) on a warm cream ground — classic line-art reading.
export const LINE_PALETTE: Oklch[] = [
  { l: 0.22, c: 0.01, h: 60 }, // 0 ink (stroke)
  { l: 0.96, c: 0.008, h: 85 }, // 1 ground (background)
];

export interface PolyTiling {
  polys: Vec2[][];
  bounds: { width: number; height: number };
  region: Vec2[];
  typeIndex: number;
}

const rect = (w: number, h: number): Vec2[] => [[0, 0], [w, 0], [w, h], [0, h]];

const centroidOf = (pts: Vec2[]): Vec2 => {
  let x = 0, y = 0;
  for (const p of pts) { x += p[0]; y += p[1]; }
  return [x / pts.length, y / pts.length];
};
// drop near-duplicate points, then order them into a ring (CCW by angle about centroid)
function ring(pts: Vec2[]): Vec2[] {
  const uniq: Vec2[] = [];
  for (const p of pts) if (!uniq.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.5)) uniq.push(p);
  if (uniq.length < 3) return uniq;
  const c = centroidOf(uniq);
  return uniq.sort((p, q) => Math.atan2(p[1] - c[1], p[0] - c[0]) - Math.atan2(q[1] - c[1], q[0] - c[0]));
}

// Multi-level rosette: pass 1 anchors strands at the cell's edge midpoints (this is
// what keeps neighbours joined); each further pass decorates the INTERIOR ring of the
// previous pass's crossing points, nesting a smaller star inside the void. Purely
// interior, so inter-cell continuity and the contact-angle breath are untouched.
export function inferMultiLevel(verts: Vec2[], contactAngle: number, levels: number, innerAngle?: number): Segment[] {
  const out: Segment[] = [];
  let poly = verts;
  for (let l = 0; l < Math.max(1, levels); l++) {
    const { segments, crossings } = inferStrapworkDetailed(poly, l === 0 ? contactAngle : innerAngle ?? contactAngle);
    out.push(...segments);
    const inner = ring(crossings);
    if (inner.length < 3) break;
    poly = inner;
  }
  return out;
}

// Build the static polygon grid: fill a region (a margin beyond the canvas, so
// boundary strands infer correctly) and scale tile-space → pixels.
export function buildTiling(opts: {
  typeIndex: number;
  bounds: { width: number; height: number };
  scale?: number;
  params?: number[];
}): PolyTiling {
  const { typeIndex, bounds } = opts;
  const scale = opts.scale ?? 84;
  const t = new IsohedralTiling(tilingTypes[typeIndex]);
  if (opts.params) t.setParameters(opts.params);
  const verts = t.vertices();
  const m = 1.5; // tile-space margin so off-canvas neighbours still decorate
  const polys: Vec2[][] = [];
  for (const inst of t.fillRegionBounds(-m, -m, bounds.width / scale + m, bounds.height / scale + m)) {
    polys.push(verts.map((v) => {
      const p = mul(inst.T, v);
      return [p.x * scale, p.y * scale] as Vec2;
    }));
  }
  return { polys, bounds, region: rect(bounds.width, bounds.height), typeIndex };
}

export interface DecorateOpts {
  palette?: Oklch[];
  levels?: number;       // 1 = single-pass; 2+ = multi-level rosette (interior nesting)
  innerAngle?: number;   // contact angle for the inner level(s); defaults to the outer angle
}

// Decorate a static grid at one contact angle → a line-only RenderPlan.
export function strapworkPlan(tiling: PolyTiling, contactAngle: number, opts: DecorateOpts = {}): RenderPlan {
  const palette = opts.palette ?? LINE_PALETTE;
  const levels = opts.levels ?? 1;
  const elements: Element[] = [
    { kind: "polygon", role: "background", points: rect(tiling.bounds.width, tiling.bounds.height), colorRef: 1 },
  ];
  for (const poly of tiling.polys) {
    const segs = levels > 1 ? inferMultiLevel(poly, contactAngle, levels, opts.innerAngle) : inferStrapwork(poly, contactAngle);
    for (const s of segs) {
      elements.push({ kind: "segment", points: [s.a, s.b], role: "line", strokeRef: 0 });
    }
  }
  return {
    bounds: tiling.bounds,
    symmetry: { group: "p6m" },
    palette,
    elements,
    region: tiling.region,
  };
}

export function generatePolygonal(opts: {
  typeIndex: number;
  contactAngle: number;
  bounds: { width: number; height: number };
  scale?: number;
  params?: number[];
} & DecorateOpts): RenderPlan {
  return strapworkPlan(buildTiling(opts), opts.contactAngle, opts);
}
