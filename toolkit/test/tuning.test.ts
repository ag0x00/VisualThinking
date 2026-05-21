import { describe, it, expect } from "vitest";
import { applyNudge, type TuningBinding } from "../src/tuning";

const ringsB: TuningBinding = { param: "rings", kind: "int", step: 1, min: 3, max: 9 };
const ssB: TuningBinding = { param: "segmentScale", kind: "num", step: 0.6, min: 0.4, max: 1.0 };
const jitterB: TuningBinding = { param: "channelJitter", kind: "num", step: 0.1, min: 0, max: 1, invert: true };

describe("applyNudge", () => {
  it("increases an int knob by its step", () => {
    const r = applyNudge({ rings: 6 }, ringsB, "increase");
    expect(r.to).toBe(7);
    expect(r.from).toBe(6);
    expect(r.changed).toBe(true);
    expect(r.params.rings).toBe(7);
  });

  it("decreases an int knob and clamps at min", () => {
    expect(applyNudge({ rings: 4 }, ringsB, "decrease").to).toBe(3);
    const pinned = applyNudge({ rings: 3 }, ringsB, "decrease");
    expect(pinned.to).toBe(3);
    expect(pinned.changed).toBe(false);
  });

  it("clamps a num knob at max and reports pinned as unchanged", () => {
    expect(applyNudge({ segmentScale: 0.5 }, ssB, "increase").to).toBe(1.0);
    const pinned = applyNudge({ segmentScale: 1.0 }, ssB, "increase");
    expect(pinned.changed).toBe(false);
  });

  it("inverts the direction sign when invert is set", () => {
    // fix says "increase" (quality), invert flips it to a -step on the knob
    const r = applyNudge({ channelJitter: 0.6 }, jitterB, "increase");
    expect(r.to).toBeCloseTo(0.5, 10);
    expect(r.changed).toBe(true);
  });

  it("treats direction 'ok' as a no-op", () => {
    const r = applyNudge({ rings: 6 }, ringsB, "ok");
    expect(r.changed).toBe(false);
    expect(r.to).toBe(6);
  });

  it("does not mutate the input params object", () => {
    const input = { rings: 6 };
    applyNudge(input, ringsB, "increase");
    expect(input.rings).toBe(6);
  });
});

import { igpTuning } from "../src/tuning/igp";
import { tilingTuning } from "../src/tuning/tiling";
import { defaultIgpParams } from "../src/generators/igp";
import { defaultTilingParams } from "../src/generators/tiling";

describe("tuning maps", () => {
  it("igp binds complexity→rings and lineContinuity→segmentScale (cliff step)", () => {
    expect(igpTuning.complexity.param).toBe("rings");
    expect(igpTuning.lineContinuity.param).toBe("segmentScale");
    expect(igpTuning.lineContinuity.step).toBe(0.6); // coarse: crosses the continuity cliff
    expect(igpTuning.symmetry).toBeUndefined();
    expect(igpTuning.colorChord).toBeUndefined();
  });

  it("tiling binds three axes; cuerdaSeca is inverted; colorCount capped at fillCount", () => {
    expect(tilingTuning.constructionGrammar.param).toBe("cellScale");
    expect(tilingTuning.tileComplexity.param).toBe("colorCount");
    expect(tilingTuning.tileComplexity.max).toBe(3);
    expect(tilingTuning.cuerdaSeca.param).toBe("channelJitter");
    expect(tilingTuning.cuerdaSeca.invert).toBe(true);
  });

  it("every bound param is a real key on the generator's default params", () => {
    const ip = defaultIgpParams() as Record<string, unknown>;
    for (const b of Object.values(igpTuning)) expect(b.param in ip).toBe(true);
    const tp = defaultTilingParams() as Record<string, unknown>;
    for (const b of Object.values(tilingTuning)) expect(b.param in tp).toBe(true);
  });
});
