import { describe, it, expect } from "vitest";
import { buildGalleryHtml, type GalleryEntry } from "../../src/renderers/gallery";
import { compose } from "../../src/compose";
import { renderSvg } from "../../src/renderers/svg";
import { timuridIgpProfile } from "../../src/profiles/timurid-igp";
import { goodPlan, degradedVariants } from "../../src/variants";

function entries(): GalleryEntry[] {
  const good = goodPlan();
  return [
    { label: "GOOD", description: "target", svg: renderSvg(good), result: compose(good, timuridIgpProfile) },
    ...degradedVariants().map((v) => ({
      label: v.label,
      description: v.description,
      svg: renderSvg(v.plan),
      result: compose(v.plan, timuridIgpProfile),
    })),
  ];
}

describe("buildGalleryHtml", () => {
  it("emits one card per entry with composite scores and embedded svg", () => {
    const html = buildGalleryHtml(entries());
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect((html.match(/<section class="card">/g) ?? []).length).toBe(5);
    expect((html.match(/<svg /g) ?? []).length).toBe(5);
    expect(html.includes("composite")).toBe(true);
    // every label rendered
    for (const label of ["GOOD", "broken-symmetry", "under-dense", "over-dense", "wrong-chord"]) {
      expect(html.includes(label)).toBe(true);
    }
  });

  it("includes the scoring legend and per-metric rules", () => {
    const html = buildGalleryHtml(entries());
    expect(html.includes("What does the percentage mean?")).toBe(true);
    expect(html.includes("target-adherence")).toBe(true);
    expect(html.includes("floor — higher is better")).toBe(true);
    expect(html.includes("band — too little or too much both score low")).toBe(true);
  });

  it("splits colorChord into hue and lightness sub-bars", () => {
    const html = buildGalleryHtml(entries());
    expect(html.includes("hue on-arc")).toBe(true);
    expect(html.includes("lightness spread")).toBe(true);
  });
});
