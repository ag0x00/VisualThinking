import { generateIgp, defaultIgpParams } from "./generators/igp";
import { generateTiling, defaultTilingParams } from "./generators/tiling";
import type { Oklch, RenderPlan, Vec2 } from "./render-plan";

export function goodPlan(): RenderPlan {
  return generateIgp(defaultIgpParams());
}

export function tilingGood(): RenderPlan {
  return generateTiling(defaultTilingParams());
}

// Deterministic jitter (no RNG dependency).
export function jitter(plan: RenderPlan, mag: number): RenderPlan {
  let i = 0;
  const h = () => {
    const s = Math.sin(++i * 12.9898) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };
  return {
    ...plan,
    elements: plan.elements.map((e) =>
      e.role === "background" ? e : { ...e, points: e.points.map(([x, y]) => [x + h() * mag, y + h() * mag] as Vec2) },
    ),
  };
}

export const OFF_ARC: Oklch[] = [
  { l: 0.45, c: 0.15, h: 30 },
  { l: 0.62, c: 0.14, h: 110 },
  { l: 0.72, c: 0.12, h: 330 },
  { l: 0.95, c: 0.12, h: 30 }, // chromatic white → NOT hue-exempt
  { l: 0.30, c: 0.10, h: 120 },
];

export interface Variant {
  label: string;
  description: string;
  plan: RenderPlan;
}

// The four deliberate failures the acceptance test asserts against, shared so
// the gallery shows exactly what is tested.
export function degradedVariants(): Variant[] {
  const good = goodPlan();
  return [
    { label: "broken-symmetry", description: "points jittered 8px beyond tolerance", plan: jitter(good, 8) },
    { label: "under-dense", description: "1 ring, no stars", plan: generateIgp({ ...defaultIgpParams(), rings: 1, includeStars: false }) },
    { label: "over-dense", description: "14 rings", plan: generateIgp({ ...defaultIgpParams(), rings: 14 }) },
    { label: "disconnected lines", description: "segments retracted to 0.7 (gaps at junctions)", plan: generateIgp({ ...defaultIgpParams(), segmentScale: 0.7 }) },
    { label: "wrong-chord", description: "off-arc (warm) palette", plan: { ...good, palette: OFF_ARC } },
  ];
}

// Tile-medium deliberate failures (scored by the timurid-tiling profile).
export function tilingVariants(): Variant[] {
  const good = tilingGood();
  return [
    { label: "broken-symmetry", description: "tile points jittered 8px", plan: jitter(good, 8) },
    { label: "overlapping cells", description: "cells scaled 1.12× (overlap)", plan: generateTiling({ ...defaultTilingParams(), cellScale: 1.12 }) },
    { label: "gappy cells", description: "cells scaled 0.8× (gaps)", plan: generateTiling({ ...defaultTilingParams(), cellScale: 0.8 }) },
    { label: "uneven channels", description: "cuerda-seca jittered (uneven/missing cream lines)", plan: generateTiling({ ...defaultTilingParams(), channelJitter: 1.0 }) },
    { label: "monotone", description: "single glaze colour (no variety)", plan: generateTiling({ ...defaultTilingParams(), colorCount: 1 }) },
    { label: "wrong-chord", description: "off-arc (warm) palette", plan: { ...good, palette: OFF_ARC } },
  ];
}
