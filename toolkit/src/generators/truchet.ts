import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";
import { centroid, scaleAbout } from "../geom";
import { SAMARKAND_PALETTE } from "./igp";

export interface TruchetParams {
  bounds: { width: number; height: number };
  gridSize: number; // cells per side
  cellScale: number; // 1 = squares tile exactly; <1 gaps, >1 overlap (drives constructionGrammar)
  latticeJitter: number; // 0 = clean grid; >0 drifts each cell off its lattice point (drives periodicity)
  arcGap: number; // 0 = arcs meet at edge midpoints; >0 retracts arc endpoints inward (drives lineContinuity)
  arcSteps: number; // polyline points per quarter arc
  palette: Oklch[];
  rngSeed: number;
}

export function defaultTruchetParams(): TruchetParams {
  return { bounds: { width: 800, height: 800 }, gridSize: 8, cellScale: 1, latticeJitter: 0, arcGap: 0, arcSteps: 10, palette: SAMARKAND_PALETTE, rngSeed: 1 };
}

// Deterministic per-cell hash in [0, 1).
function hash(i: number, j: number, seed: number): number {
  const s = Math.sin(i * 73.13 + j * 914.7 + seed * 131.7) * 43758.5453;
  return s - Math.floor(s);
}

// A quarter arc as an (steps+1)-point polyline. gap retracts both endpoints
// symmetrically inward along the arc (breaking the join with neighbours).
function arcPolyline(cx: number, cy: number, r: number, a0: number, a1: number, steps: number, gap: number): Vec2[] {
  const span = a1 - a0;
  const s0 = a0 + gap * 0.5 * span;
  const s1 = a1 - gap * 0.5 * span;
  const pts: Vec2[] = [];
  for (let k = 0; k <= steps; k++) {
    const a = s0 + (s1 - s0) * (k / steps);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

export function generateTruchet(params: TruchetParams = defaultTruchetParams()): RenderPlan {
  const { bounds, gridSize, cellScale, latticeJitter, arcGap, arcSteps, palette, rngSeed } = params;
  const cw = bounds.width / gridSize;
  const ch = bounds.height / gridSize;
  const r = cw / 2;
  const bgIdx = palette.length - 1;
  const lineIdx = Math.max(0, palette.length - 2); // near-white neutral
  const fillCount = Math.max(1, palette.length - 2);
  const elements: Element[] = [
    { kind: "polygon", role: "background", points: [[0, 0], [bounds.width, 0], [bounds.width, bounds.height], [0, bounds.height]], colorRef: bgIdx },
  ];

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      const ox = i * cw;
      const oy = j * ch;
      const jx = (hash(i, j, rngSeed + 7) * 2 - 1) * latticeJitter * cw;
      const jy = (hash(i, j, rngSeed + 13) * 2 - 1) * latticeJitter * cw;
      const off = (p: Vec2): Vec2 => [p[0] + jx, p[1] + jy];

      const square: Vec2[] = [[ox, oy], [ox + cw, oy], [ox + cw, oy + ch], [ox, oy + ch]];
      const scaled = scaleAbout(square, centroid(square), cellScale).map(off);
      elements.push({ kind: "polygon", role: "tile", points: scaled, colorRef: Math.floor(hash(i, j, rngSeed + 3) * fillCount) % fillCount, motifId: `cell-${i}-${j}` });

      // Two quarter-arc configs (centres at opposite corners), chosen per cell.
      const config = hash(i, j, rngSeed) < 0.5 ? 0 : 1;
      const arcs: [number, number, number, number][] = config === 0
        ? [[ox, oy, 0, Math.PI / 2], [ox + cw, oy + ch, Math.PI, 1.5 * Math.PI]] // TL, BR
        : [[ox + cw, oy, Math.PI / 2, Math.PI], [ox, oy + ch, 1.5 * Math.PI, 2 * Math.PI]]; // TR, BL
      for (const [acx, acy, a0, a1] of arcs) {
        elements.push({ kind: "path", role: "line", points: arcPolyline(acx, acy, r, a0, a1, arcSteps, arcGap).map(off), strokeRef: lineIdx, motifId: `arc-${i}-${j}` });
      }
    }
  }

  const region: Vec2[] = [[0, 0], [bounds.width, 0], [bounds.width, bounds.height], [0, bounds.height]];
  return { bounds, symmetry: { group: "p4", lattice: [[cw, 0], [0, ch]], center: [bounds.width / 2, bounds.height / 2], order: 4 }, palette, elements, region };
}
