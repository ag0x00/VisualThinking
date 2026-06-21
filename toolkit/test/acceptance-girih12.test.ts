import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { improve } from "../src/improve";
import { generateGirih12, defaultGirih12Params } from "../src/generators/girih12";
import { girih12Profile } from "../src/profiles/girih12";
import { girih12Tuning } from "../src/tuning/girih12";
import { girih12Good, girih12Variants } from "../src/variants";

const goodR = compose(girih12Good(), girih12Profile);
const v = Object.fromEntries(girih12Variants().map((x) => [x.label, compose(x.plan, girih12Profile)]));

describe("girih12 acceptance", () => {
  it("the clean mosaic scores well", () => {
    expect(goodR.composite).toBeGreaterThanOrEqual(0.85);
  });

  it("good outranks every deliberate failure", () => {
    for (const k of Object.keys(v)) expect(goodR.composite).toBeGreaterThan(v[k].composite);
  });

  it("broken-lattice: periodicity is the top fix", () => {
    expect(v["broken-lattice"].fixes[0].axis).toBe("periodicity");
  });

  it("gappy-grout: constructionGrammar is the top fix", () => {
    expect(v["gappy-grout"].fixes[0].axis).toBe("constructionGrammar");
  });

  it("uneven-channels: cuerdaSeca is the top fix", () => {
    expect(v["uneven-channels"].fixes[0].axis).toBe("cuerdaSeca");
  });

  it("wrong-chord flags colorChord", () => {
    expect(v["wrong-chord"].fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});

describe("girih12 improve (loop on a real art medium)", () => {
  // degraded on two axes: lattice drift (periodicity) + oversized grout (coverage)
  const start = { ...defaultGirih12Params(), latticeJitter: 0.15, groutGap: 0.25 };

  it("recovers a degraded mosaic, touching periodicity + constructionGrammar", () => {
    const startScore = compose(generateGirih12(start), girih12Profile).composite;
    const r = improve(generateGirih12, start, girih12Profile, girih12Tuning, { targetComposite: 0.95 });
    expect(r.finalScore).toBeGreaterThan(startScore);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("periodicity");
    expect(axes).toContain("constructionGrammar");
  });

  it("climbs monotonically", () => {
    const r = improve(generateGirih12, start, girih12Profile, girih12Tuning, { targetComposite: 0.95 });
    for (const s of r.trajectory) expect(s.compositeAfter).toBeGreaterThan(s.compositeBefore);
  });
});
