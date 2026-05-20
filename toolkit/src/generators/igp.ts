import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";

export const SAMARKAND_PALETTE: Oklch[] = [
  { l: 0.45, c: 0.12, h: 240 }, // cobalt
  { l: 0.62, c: 0.11, h: 200 }, // turquoise
  { l: 0.72, c: 0.09, h: 190 }, // light turquoise
  { l: 0.95, c: 0.01, h: 200 }, // near-white (neutral; hue-exempt)
  { l: 0.30, c: 0.06, h: 250 }, // deep blue (background)
];

export interface IgpParams {
  bounds: { width: number; height: number };
  rings: number;
  ringSpacing: number;
  includeStars: boolean;
  palette: Oklch[];
}

export function defaultIgpParams(): IgpParams {
  return { bounds: { width: 800, height: 800 }, rings: 6, ringSpacing: 55, includeStars: true, palette: SAMARKAND_PALETTE };
}

export function generateIgp(params: IgpParams = defaultIgpParams()): RenderPlan {
  const { bounds, rings, ringSpacing, includeStars, palette } = params;
  const center: Vec2 = [bounds.width / 2, bounds.height / 2];
  const order = 6;
  const lineColors = Math.max(1, palette.length - 1); // reserve last index for background
  const elements: Element[] = [];

  // background (excluded from symmetry + complexity by role)
  elements.push({
    kind: "polygon",
    role: "background",
    points: [[0, 0], [bounds.width, 0], [bounds.width, bounds.height], [0, bounds.height]],
    colorRef: palette.length - 1,
  });

  const vertex = (r: number, k: number): Vec2 => {
    const a = (2 * Math.PI * k) / order;
    return [center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)];
  };

  for (let ring = 1; ring <= rings; ring++) {
    const r = ring * ringSpacing;
    const strokeRef = (ring - 1) % lineColors;
    // hexagon edges
    for (let k = 0; k < order; k++) {
      elements.push({ kind: "segment", role: "line", points: [vertex(r, k), vertex(r, (k + 1) % order)], strokeRef, motifId: `ring-${ring}` });
    }
    // star crossings (connect k to k+2)
    if (includeStars) {
      for (let k = 0; k < order; k++) {
        elements.push({ kind: "segment", role: "line", points: [vertex(r, k), vertex(r, (k + 2) % order)], strokeRef: (strokeRef + 1) % lineColors, motifId: `star-${ring}` });
      }
    }
  }

  // spokes from centre to outer ring
  for (let k = 0; k < order; k++) {
    elements.push({ kind: "segment", role: "line", points: [center, vertex(rings * ringSpacing, k)], strokeRef: 1 % lineColors, motifId: "spokes" });
  }

  return { bounds, symmetry: { group: "p6m", center, order }, palette, elements };
}
