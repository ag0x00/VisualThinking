import { Resvg } from "@resvg/resvg-js";
import { formatHex } from "culori";
import type { Oklch, RenderPlan, Vec2 } from "../../src/render-plan";
import { renderSvg } from "../../src/renderers/svg";

// point-in-convex-polygon (winding-agnostic) — used to mask raster pixels to the
// design region, so coverage is measured over the same denominator the plan uses
// (the region, which for tiling is a hexagon, not the square canvas).
function pointInConvex(p: Vec2, region: Vec2[]): boolean {
  let area2 = 0;
  for (let i = 0; i < region.length; i++) {
    const [x0, y0] = region[i];
    const [x1, y1] = region[(i + 1) % region.length];
    area2 += x0 * y1 - x1 * y0;
  }
  const ccw = area2 > 0;
  for (let i = 0; i < region.length; i++) {
    const a = region[i];
    const b = region[(i + 1) % region.length];
    const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    if (ccw ? cross < 0 : cross > 0) return false;
  }
  return true;
}

export interface RasterMeasurement {
  coverage: number;                       // fraction of pixels not the background colour
  areaShareByHex: Record<string, number>; // per-colour pixel fraction
  bgHex: string;
}

const hexOf = (c: Oklch): string => formatHex({ mode: "oklch", l: c.l, c: c.c, h: c.h }) ?? "#000000";

// allow small antialiasing drift when matching a colour
function nearHex(a: string, b: string, tol: number): boolean {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return pa.every((v, i) => Math.abs(v - pb[i]) <= tol);
}

// Rasterise the plan and measure ground truth from pixels. Tests/calibration only —
// never imported by compose/improve (keeps the runtime loop deterministic + dep-free).
export function measureFromRaster(plan: RenderPlan, px = 256): RasterMeasurement {
  const resvg = new Resvg(renderSvg(plan), { fitTo: { mode: "width", value: px } });
  const img = resvg.render();
  const { pixels, width, height } = img; // RGBA buffer
  const bg = plan.elements.find((e) => e.role === "background");
  const bgHex = bg?.colorRef != null ? hexOf(plan.palette[bg.colorRef]) : "#000000";
  const region = plan.region;
  const sx = plan.bounds.width / width;
  const sy = plan.bounds.height / height;
  const counts = new Map<string, number>();
  let total = 0;
  for (let p = 0; p < pixels.length; p += 4) {
    const idx = p / 4;
    const rx = idx % width;
    const ry = Math.floor(idx / width);
    if (region && !pointInConvex([(rx + 0.5) * sx, (ry + 0.5) * sy], region)) continue;
    total++;
    const hex = "#" + [pixels[p], pixels[p + 1], pixels[p + 2]].map((v) => v.toString(16).padStart(2, "0")).join("");
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }
  const areaShareByHex: Record<string, number> = {};
  let bgCount = 0;
  for (const [hex, n] of counts) {
    areaShareByHex[hex] = n / total;
    if (nearHex(hex, bgHex, 12)) bgCount += n;
  }
  return { coverage: total === 0 ? 0 : 1 - bgCount / total, areaShareByHex, bgHex };
}

// Pixel share of a specific palette colour (robust to antialiasing via tol) —
// used to cross-check a colour's actual rendered area against the budget/intent.
export function shareOfPaletteColor(m: RasterMeasurement, c: Oklch, tol = 14): number {
  const want = hexOf(c);
  let share = 0;
  for (const [hex, s] of Object.entries(m.areaShareByHex)) {
    if (nearHex(hex, want, tol)) share += s;
  }
  return share;
}
