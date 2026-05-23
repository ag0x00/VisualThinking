// Minimal ambient types for tactile-js (Craig Kaplan, BSD-3) — it ships no .d.ts.
// Only the surface the toolkit uses: isohedral tiling types + region fill + prototile
// vertices + the matrix×point helper. See node_modules/tactile-js/tactile.js.
declare module "tactile-js" {
  export const EdgeShape: Record<string, number>;
  export const numTypes: number;
  export const tilingTypes: number[];
  export interface Pt { x: number; y: number }
  export interface Placement { T: number[]; t1: number; t2: number; aspect: number }
  export function makePoint(coeffs: number[], offs: number, params: number[]): Pt;
  export function makeMatrix(coeffs: number[], offs: number, params: number[]): number[];
  export function mul(A: number[], B: Pt): Pt;
  export function matchSeg(p: Pt, q: Pt): number[];
  export class IsohedralTiling {
    constructor(type: number);
    numParameters(): number;
    getParameters(): number[];
    setParameters(params: number[]): void;
    numVertices(): number;
    vertices(): Pt[];
    numAspects(): number;
    getT1(): Pt;
    getT2(): Pt;
    fillRegionBounds(xmin: number, ymin: number, xmax: number, ymax: number): Iterable<Placement>;
    fillRegionQuad(A: Pt, B: Pt, C: Pt, D: Pt): Iterable<Placement>;
  }
}
