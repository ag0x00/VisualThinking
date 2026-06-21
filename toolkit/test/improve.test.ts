import { describe, it, expect } from "vitest";
import { improve } from "../src/improve";
import { compose } from "../src/compose";
import { generateIgp, defaultIgpParams } from "../src/generators/igp";
import { generateTiling, defaultTilingParams } from "../src/generators/tiling";
import { timuridIgpProfile } from "../src/profiles/timurid-igp";
import { timuridTilingProfile } from "../src/profiles/timurid-tiling";
import { igpTuning } from "../src/tuning/igp";
import { tilingTuning } from "../src/tuning/tiling";

const igpStart = { ...defaultIgpParams(), rings: 3, segmentScale: 0.5 }; // ≈0.708
const tilingStart = { ...defaultTilingParams(), cellScale: 0.9, channelJitter: 1.0 }; // ≈0.790 (degrades constructionGrammar + cuerdaSeca)

describe("improve — recovery to target", () => {
  it("igp: lifts a degraded start to the default target (0.85)", () => {
    const startScore = compose(generateIgp(igpStart), timuridIgpProfile).composite;
    const r = improve(generateIgp, igpStart, timuridIgpProfile, igpTuning);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    expect(r.finalScore).toBeGreaterThan(startScore);
    expect(r.trajectory.length).toBeGreaterThan(0);
  });

  it("tiling: lifts a degraded start to the default target (0.85)", () => {
    const startScore = compose(generateTiling(tilingStart), timuridTilingProfile).composite;
    const r = improve(generateTiling, tilingStart, timuridTilingProfile, tilingTuning);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    expect(r.finalScore).toBeGreaterThan(startScore);
  });
});

describe("improve — full climb exercises both knobs", () => {
  it("igp: fixes lineContinuity first, then complexity", () => {
    const r = improve(generateIgp, igpStart, timuridIgpProfile, igpTuning, { targetComposite: 0.99 });
    expect(r.finalScore).toBeGreaterThanOrEqual(0.99);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("lineContinuity");
    expect(axes).toContain("complexity");
    expect(axes.indexOf("lineContinuity")).toBeLessThan(axes.indexOf("complexity"));
  });

  it("tiling: drives constructionGrammar and cuerdaSeca", () => {
    const r = improve(generateTiling, tilingStart, timuridTilingProfile, tilingTuning, { targetComposite: 0.99 });
    expect(r.finalScore).toBeGreaterThanOrEqual(0.99);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("constructionGrammar");
    expect(axes).toContain("cuerdaSeca");
  });
});

describe("improve — trajectory invariants", () => {
  it("is monotonic, chained, and finalScore matches the last step", () => {
    const r = improve(generateIgp, igpStart, timuridIgpProfile, igpTuning, { targetComposite: 0.99 });
    const startScore = compose(generateIgp(igpStart), timuridIgpProfile).composite;
    expect(r.trajectory[0].compositeBefore).toBeCloseTo(startScore, 10);
    for (let i = 0; i < r.trajectory.length; i++) {
      const s = r.trajectory[i];
      expect(s.compositeAfter).toBeGreaterThan(s.compositeBefore); // every recorded step improves
      if (i > 0) expect(s.compositeBefore).toBeCloseTo(r.trajectory[i - 1].compositeAfter, 10);
    }
    const last = r.trajectory[r.trajectory.length - 1];
    expect(r.finalScore).toBeCloseTo(last.compositeAfter, 10);
    expect(r.trajectory.length).toBeLessThanOrEqual(20);
  });

  it("returns the start unchanged when the target is already met", () => {
    const good = defaultIgpParams();
    const r = improve(generateIgp, good, timuridIgpProfile, igpTuning, { targetComposite: 0.5 });
    expect(r.trajectory).toEqual([]);
    expect(r.finalParams).toEqual(good);
    expect(r.finalScore).toBeCloseTo(1.0, 10);
  });
});
