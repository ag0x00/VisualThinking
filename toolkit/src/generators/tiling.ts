import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";
import { centroid, scaleAbout } from "../geom";
import { SAMARKAND_PALETTE } from "./igp";

export interface TilingParams {
  bounds: { width: number; height: number };
  rings: number;
  ringSpacing: number;
  palette: Oklch[];
  cellScale: number; // 1 = perfect tiling; >1 overlaps neighbours; <1 leaves gaps
}

export function defaultTilingParams(): TilingParams {
  return { bounds: { width: 800, height: 800 }, rings: 6, ringSpacing: 60, palette: SAMARKAND_PALETTE, cellScale: 1 };
}

// Concentric 6-fold rings of trapezoidal glaze cells around a central hexagon.
// A valid tiling by construction; `cellScale` perturbs it for degradation tests.
export function generateTiling(params: TilingParams = defaultTilingParams()): RenderPlan {
  const { bounds, rings, ringSpacing, palette, cellScale } = params;
  const center: Vec2 = [bounds.width / 2, bounds.height / 2];
  const order = 6;
  const bgIdx = palette.length - 1;
  const creamIdx = Math.max(0, palette.length - 2);
  const fillCount = Math.max(1, palette.length - 2); // palette indices 0..length-3 are fills
  const elements: Element[] = [];

  elements.push({
    kind: "polygon",
    role: "background",
    points: [[0, 0], [bounds.width, 0], [bounds.width, bounds.height], [0, bounds.height]],
    colorRef: bgIdx,
  });

  const vertex = (r: number, k: number): Vec2 => {
    const a = (2 * Math.PI * k) / order;
    return [center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)];
  };
  const cell = (pts: Vec2[], colorRef: number, motifId: string) => {
    elements.push({ kind: "polygon", role: "tile", points: scaleAbout(pts, centroid(pts), cellScale), colorRef, strokeRef: creamIdx, motifId });
  };

  // central hexagon
  cell(Array.from({ length: order }, (_, k) => vertex(ringSpacing, k)), 0, "core");

  // trapezoidal bands
  for (let ring = 1; ring < rings; ring++) {
    const rIn = ring * ringSpacing;
    const rOut = (ring + 1) * ringSpacing;
    for (let k = 0; k < order; k++) {
      const pts: Vec2[] = [vertex(rIn, k), vertex(rIn, (k + 1) % order), vertex(rOut, (k + 1) % order), vertex(rOut, k)];
      cell(pts, (ring + k) % fillCount, `band-${ring}`);
    }
  }

  // the region the cells are meant to fill (unscaled outer hexagon)
  const region: Vec2[] = Array.from({ length: order }, (_, k) => vertex(rings * ringSpacing, k));

  return { bounds, symmetry: { group: "p6m", center, order }, palette, elements, region };
}
