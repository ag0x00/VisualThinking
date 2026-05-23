import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { measureFromRaster } from "./util/raster-oracle";
import { tilingGood, truchetGood, girih12Good } from "../src/variants";
import { timuridTilingProfile } from "../src/profiles/timurid-tiling";
import { truchetProfile } from "../src/profiles/truchet";
import { girih12Profile } from "../src/profiles/girih12";

describe("runtime coverage agrees with the raster oracle (within tolerance)", () => {
  const cases = [
    ["tiling", tilingGood(), timuridTilingProfile],
    ["truchet", truchetGood(), truchetProfile],
    ["girih12", girih12Good(), girih12Profile],
  ] as const;

  for (const [name, plan, profile] of cases) {
    it(`${name}: plan-based coverage ≈ rasterised glaze coverage`, () => {
      const planCov = compose(plan, profile).perOperator.find((p) => p.name === "constructionGrammar")!.measured;
      const rasterCov = measureFromRaster(plan).coverage;
      // both express "fraction of frame that is glaze, not ground"; allow grout/AA slack.
      // The point is to catch a gross divergence (e.g. the old 1.25-vs-0.8 overhang bug).
      expect(Math.abs(Math.min(planCov, 1) - rasterCov)).toBeLessThan(0.2);
    });
  }
});
