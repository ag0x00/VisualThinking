import { formatHex } from "culori";
import type { RenderPlan } from "../render-plan";

// Minimal 2D-context surface the renderer touches — typed structurally so it can be
// driven by a real CanvasRenderingContext2D in the browser OR a recording mock in tests.
export interface Ctx2D {
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  lineCap: string;
  lineJoin: string;
  fillRect(x: number, y: number, w: number, h: number): void;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  closePath(): void;
  stroke(): void;
  fill(): void;
}

// Second renderer adapter (alongside svg.ts) — the per-frame redraw path for
// animation. Walks the same RenderPlan the SVG renderer does; strokes are batched
// into one path per colour for speed (thousands of strapwork segments per frame).
export function renderToCanvas(plan: RenderPlan, ctx: Ctx2D, opts: { lineWidth?: number } = {}): void {
  const hex = (i: number | undefined, fb: string): string =>
    i == null ? fb : (formatHex({ mode: "oklch", l: plan.palette[i].l, c: plan.palette[i].c, h: plan.palette[i].h }) ?? fb);
  const { width: W, height: H } = plan.bounds;

  const bg = plan.elements.find((e) => e.role === "background");
  if (bg) {
    ctx.fillStyle = hex(bg.colorRef, "#000000");
    ctx.fillRect(0, 0, W, H);
  }

  ctx.lineWidth = opts.lineWidth ?? 1.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // batch stroked elements (segments/paths) by colour into one path each
  const byStroke = new Map<number, RenderPlan["elements"]>();
  for (const e of plan.elements) {
    if (e.role === "background" || e.strokeRef == null) continue;
    const g = byStroke.get(e.strokeRef);
    if (g) g.push(e); else byStroke.set(e.strokeRef, [e]);
  }
  for (const [ref, els] of byStroke) {
    ctx.strokeStyle = hex(ref, "#ffffff");
    ctx.beginPath();
    for (const e of els) {
      const pts = e.points;
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
  }
}
