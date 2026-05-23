import { describe, it, expect } from "vitest";
import { renderToCanvas, type Ctx2D } from "../src/renderers/canvas";
import type { RenderPlan } from "../src/render-plan";

// a recording mock 2D context
function mockCtx() {
  const calls: { fn: string; args: number[] }[] = [];
  const ctx: Ctx2D = {
    fillStyle: "", strokeStyle: "", lineWidth: 0, lineCap: "", lineJoin: "",
    fillRect: (...a) => calls.push({ fn: "fillRect", args: a }),
    beginPath: () => calls.push({ fn: "beginPath", args: [] }),
    moveTo: (...a) => calls.push({ fn: "moveTo", args: a }),
    lineTo: (...a) => calls.push({ fn: "lineTo", args: a }),
    closePath: () => calls.push({ fn: "closePath", args: [] }),
    stroke: () => calls.push({ fn: "stroke", args: [] }),
    fill: () => calls.push({ fn: "fill", args: [] }),
  };
  return { ctx, calls };
}

const PLAN: RenderPlan = {
  bounds: { width: 100, height: 100 },
  symmetry: { group: "p6m" },
  palette: [{ l: 0.2, c: 0, h: 0 }, { l: 0.96, c: 0.01, h: 85 }],
  elements: [
    { kind: "polygon", role: "background", points: [[0, 0], [100, 0], [100, 100], [0, 100]], colorRef: 1 },
    { kind: "segment", role: "line", points: [[10, 10], [90, 90]], strokeRef: 0 },
    { kind: "segment", role: "line", points: [[90, 10], [10, 90]], strokeRef: 0 },
  ],
};

describe("renderToCanvas: the per-frame redraw adapter", () => {
  it("paints the background once and strokes every segment in one batched path", () => {
    const { ctx, calls } = mockCtx();
    renderToCanvas(PLAN, ctx);
    expect(calls.filter((c) => c.fn === "fillRect")).toHaveLength(1); // bg
    expect(calls.filter((c) => c.fn === "moveTo")).toHaveLength(2);   // one per segment
    expect(calls.filter((c) => c.fn === "lineTo")).toHaveLength(2);
    expect(calls.filter((c) => c.fn === "beginPath")).toHaveLength(1); // batched (monochrome)
    expect(calls.filter((c) => c.fn === "stroke")).toHaveLength(1);
  });

  it("draws the segment endpoints faithfully", () => {
    const { ctx, calls } = mockCtx();
    renderToCanvas(PLAN, ctx);
    const moves = calls.filter((c) => c.fn === "moveTo").map((c) => c.args);
    const lines = calls.filter((c) => c.fn === "lineTo").map((c) => c.args);
    expect(moves).toContainEqual([10, 10]);
    expect(lines).toContainEqual([90, 90]);
  });

  it("honours a custom line width", () => {
    const { ctx } = mockCtx();
    renderToCanvas(PLAN, ctx, { lineWidth: 2.4 });
    expect(ctx.lineWidth).toBe(2.4);
  });
});
