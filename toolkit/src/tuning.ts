import type { FixDirection } from "./operators/types";

export type NudgeKind = "int" | "num";

export interface TuningBinding {
  param: string; // key into the generator's params object (a numeric field)
  kind: NudgeKind;
  step: number;
  min: number;
  max: number;
  invert?: boolean; // true → flip the direction→delta sign (e.g. higher quality ⇐ less jitter)
}

export type TuningMap = Record<string, TuningBinding>; // keyed by fix.axis

export interface NudgeResult<P> {
  params: P;
  from: number;
  to: number;
  changed: boolean;
}

const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));

// Pure: returns a new params object with one knob nudged in the fix's direction.
// `changed` is false when direction is "ok" or the value is already pinned at the
// relevant bound (so the loop can treat the binding as non-actionable).
// P is unconstrained (declared param interfaces like IgpParams are not assignable
// to Record<string, unknown>); we index/spread through a cast instead.
export function applyNudge<P>(params: P, binding: TuningBinding, direction: FixDirection): NudgeResult<P> {
  const from = (params as Record<string, number>)[binding.param];
  if (direction === "ok") return { params, from, to: from, changed: false };
  const sign = (direction === "increase" ? 1 : -1) * (binding.invert ? -1 : 1);
  let next = from + sign * binding.step;
  if (binding.kind === "int") next = Math.round(next);
  next = clamp(next, binding.min, binding.max);
  if (next === from) return { params, from, to: from, changed: false };
  const updated = { ...(params as Record<string, unknown>), [binding.param]: next } as P;
  return { params: updated, from, to: next, changed: true };
}
