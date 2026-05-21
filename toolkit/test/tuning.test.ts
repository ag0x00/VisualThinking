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
