import { describe, it, expect } from "vitest";
import { renderSvg } from "../../src/renderers/svg";
import { generateIgp, defaultIgpParams } from "../../src/generators/igp";

describe("renderSvg", () => {
  it("emits an svg with one line per line-element and a background rect", () => {
    const plan = generateIgp(defaultIgpParams());
    const svg = renderSvg(plan);
    expect(svg.startsWith("<svg")).toBe(true);
    expect((svg.match(/<line /g) ?? []).length).toBe(78);
    expect(svg.includes("<rect")).toBe(true);
    expect(svg.includes("#")).toBe(true); // culori produced hex colors
  });
});

import type { RenderPlan } from "../../src/render-plan";

describe("renderSvg path elements", () => {
  it("renders a path as an unfilled stroked polyline", () => {
    const plan: RenderPlan = {
      bounds: { width: 100, height: 100 },
      symmetry: { group: "p4" },
      palette: [{ l: 0.9, c: 0.01, h: 200 }],
      elements: [{ kind: "path", role: "line", points: [[0, 0], [50, 50], [100, 0]], strokeRef: 0 }],
    };
    const svg = renderSvg(plan);
    expect(svg).toContain("<polyline");
    expect(svg).toContain('fill="none"');
    expect(svg).not.toContain("<polygon");
  });
});
