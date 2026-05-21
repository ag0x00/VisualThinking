import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { improve } from "../src/improve";
import { generateTruchet, defaultTruchetParams } from "../src/generators/truchet";
import { truchetProfile } from "../src/profiles/truchet";
import { truchetTuning } from "../src/tuning/truchet";
import { truchetGood, truchetVariants } from "../src/variants";

const goodR = compose(truchetGood(), truchetProfile);
const v = Object.fromEntries(truchetVariants().map((x) => [x.label, compose(x.plan, truchetProfile)]));

describe("truchet acceptance", () => {
  it("the clean pattern scores high", () => {
    expect(goodR.composite).toBeGreaterThanOrEqual(0.9);
  });

  it("good outranks every deliberate failure", () => {
    for (const k of Object.keys(v)) expect(goodR.composite).toBeGreaterThan(v[k].composite);
  });

  it("broken-lattice: periodicity is the top fix", () => {
    expect(v["broken-lattice"].fixes[0].axis).toBe("periodicity");
  });

  it("gappy-grid flags constructionGrammar", () => {
    expect(v["gappy-grid"].fixes.some((f) => f.axis === "constructionGrammar")).toBe(true);
  });

  it("disconnected-arcs flags lineContinuity", () => {
    expect(v["disconnected-arcs"].fixes.some((f) => f.axis === "lineContinuity")).toBe(true);
  });

  it("wrong-chord flags colorChord", () => {
    expect(v["wrong-chord"].fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});

describe("truchet improve (loop generalizes to a new medium)", () => {
  const start = { ...defaultTruchetParams(), latticeJitter: 0.2, cellScale: 0.85 };

  it("recovers a degraded grid to target, touching periodicity then constructionGrammar", () => {
    const startScore = compose(generateTruchet(start), truchetProfile).composite;
    const r = improve(generateTruchet, start, truchetProfile, truchetTuning);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    expect(r.finalScore).toBeGreaterThan(startScore);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("periodicity");
    expect(axes).toContain("constructionGrammar");
  });

  it("climbs monotonically", () => {
    const r = improve(generateTruchet, start, truchetProfile, truchetTuning, { targetComposite: 0.99 });
    for (const s of r.trajectory) expect(s.compositeAfter).toBeGreaterThan(s.compositeBefore);
  });
});
