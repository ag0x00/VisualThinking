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
