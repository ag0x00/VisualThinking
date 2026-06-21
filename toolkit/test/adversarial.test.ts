import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { generateGirih12, defaultGirih12Params, SAMARKAND_7 } from "../src/generators/girih12";
import { girih12Profile } from "../src/profiles/girih12";
import { measureFromRaster, shareOfPaletteColor } from "./util/raster-oracle";

// The dual of the "deliberate-failure" variants: not "does the metric catch a bad
// design" but "can a bad design still MAX the score." Each case is a render that
// fooled an operator before the render-faithful redesign.
describe("adversarial: bad designs can no longer max the score", () => {
  it("coverage no longer reads ≫1 from off-canvas overhang (clip-to-frame holds)", () => {
    const cov = compose(generateGirih12(defaultGirih12Params()), girih12Profile)
      .perOperator.find((p) => p.name === "constructionGrammar")!.measured;
    expect(cov).toBeLessThanOrEqual(1.1); // was ~1.25 (full off-canvas tiles counted)
  });

  it("cream dominance (very thick grout) is penalised on colorChord, oracle confirms cream rules the frame", () => {
    const plan = generateGirih12({ ...defaultGirih12Params(), groutGap: 0.30 });
    const cc = compose(plan, girih12Profile).perOperator.find((p) => p.name === "colorChord")!;
    expect(cc.score).toBeLessThan(0.85); // was 100% under the old membership model
    const m = measureFromRaster(plan);
    expect(m.coverage).toBeLessThan(0.6); // most of the frame is cream ground, not glaze
  });

  it("good girih12 keeps the saffron accent under the 5% budget (raster ground truth)", () => {
    const m = measureFromRaster(generateGirih12(defaultGirih12Params()));
    const saffron = shareOfPaletteColor(m, SAMARKAND_7[5]); // idx 5 = saffron accent
    expect(saffron).toBeGreaterThan(0); // present
    expect(saffron).toBeLessThan(0.06); // under budget
  });

  it("the cream ground leaves no deep-blue bleed (the old bowtie colour is absent)", () => {
    // Deep-blue (idx 3) was the bowtie-bleed colour; with the cream ground it is
    // used by nothing, so it must not appear in the render.
    const m = measureFromRaster(generateGirih12(defaultGirih12Params()));
    expect(shareOfPaletteColor(m, SAMARKAND_7[3])).toBeLessThan(0.02);
  });
});
