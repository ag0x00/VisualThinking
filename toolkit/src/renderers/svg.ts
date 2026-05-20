import { formatHex } from "culori";
import type { RenderPlan } from "../render-plan";

export function renderSvg(plan: RenderPlan): string {
  const hex = (i: number | undefined, fallback: string): string => {
    if (i == null) return fallback;
    const c = plan.palette[i];
    return formatHex({ mode: "oklch", l: c.l, c: c.c, h: c.h }) ?? fallback;
  };
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${plan.bounds.width}" height="${plan.bounds.height}" viewBox="0 0 ${plan.bounds.width} ${plan.bounds.height}">`,
  ];
  for (const e of plan.elements) {
    if (e.role === "background") {
      parts.push(`<rect width="${plan.bounds.width}" height="${plan.bounds.height}" fill="${hex(e.colorRef, "#0a1a2f")}"/>`);
    } else if (e.kind === "segment") {
      const [[x0, y0], [x1, y1]] = e.points;
      parts.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="1.5"/>`);
    } else {
      const pts = e.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
      parts.push(`<polygon points="${pts}" fill="${hex(e.colorRef, "none")}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="1.5"/>`);
    }
  }
  parts.push(`</svg>`);
  return parts.join("\n");
}
