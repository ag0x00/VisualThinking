import { IsohedralTiling, tilingTypes, mul } from "tactile-js";
import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";
import { inferStrapwork } from "./strapwork";

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

// Decorate a static grid at one contact angle → a line-only RenderPlan.
export function strapworkPlan(tiling: PolyTiling, contactAngle: number, palette: Oklch[] = LINE_PALETTE): RenderPlan {
  const elements: Element[] = [
    { kind: "polygon", role: "background", points: rect(tiling.bounds.width, tiling.bounds.height), colorRef: 1 },
  ];
  for (const poly of tiling.polys) {
    for (const s of inferStrapwork(poly, contactAngle)) {
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
  palette?: Oklch[];
}): RenderPlan {
  return strapworkPlan(buildTiling(opts), opts.contactAngle, opts.palette);
}
