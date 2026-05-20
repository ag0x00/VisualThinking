import { generateIgp, defaultIgpParams } from "./generators/igp";
import type { Oklch, RenderPlan, Vec2 } from "./render-plan";

export function goodPlan(): RenderPlan {
  return generateIgp(defaultIgpParams());
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
    { label: "wrong-chord", description: "off-arc (warm) palette", plan: { ...good, palette: OFF_ARC } },
  ];
}
