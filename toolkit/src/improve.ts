import { compose } from "./compose";
import type { AestheticProfile } from "./profile";
import type { RenderPlan } from "./render-plan";
import { applyNudge, type TuningMap } from "./tuning";

export interface ImproveOptions {
  targetComposite?: number; // default 0.85 — stop once composite ≥ this
  maxIterations?: number; // default 20
}

export interface ImproveStep<P> {
  iter: number;
  fix: string; // axis acted on
  param: string; // knob turned
  from: number;
  to: number;
  compositeBefore: number;
  compositeAfter: number;
  params: P; // full snapshot after this step
}

export interface ImproveResult<P> {
  finalParams: P;
  finalPlan: RenderPlan;
  finalScore: number;
  trajectory: ImproveStep<P>[];
}

const EPS = 1e-4;

// Greedy single-knob loop: each iteration acts on the worst-weighted ACTIONABLE
// fix (one with a tuning binding whose knob can still move). Keeps the nudge only
// if the composite improved; otherwise reverts (discards it) and stops.
export function improve<P>(
  generate: (p: P) => RenderPlan,
  initialParams: P,
  profile: AestheticProfile,
  tuning: TuningMap,
  opts: ImproveOptions = {},
): ImproveResult<P> {
  const target = opts.targetComposite ?? 0.85;
  const maxIter = opts.maxIterations ?? 20;
  let params = initialParams;
  let score = compose(generate(params), profile);
  const trajectory: ImproveStep<P>[] = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    if (score.composite >= target) break;

    let acted = false;
    for (const fix of score.fixes) {
      const binding = tuning[fix.axis];
      if (!binding) continue; // no knob for this axis (symmetry, colorChord) → skip
      const nudge = applyNudge(params, binding, fix.direction);
      if (!nudge.changed) continue; // pinned at a bound → not actionable, skip
      // This is the top actionable fix; we act on it exactly once this iteration.
      const nextScore = compose(generate(nudge.params), profile);
      if (nextScore.composite > score.composite + EPS) {
        trajectory.push({
          iter,
          fix: fix.axis,
          param: binding.param,
          from: nudge.from,
          to: nudge.to,
          compositeBefore: score.composite,
          compositeAfter: nextScore.composite,
          params: nudge.params,
        });
        params = nudge.params;
        score = nextScore;
        acted = true;
      }
      break; // only the top actionable fix is tried per iteration
    }
    if (!acted) break; // top actionable fix did not improve (revert + stop), or none actionable
  }

  return { finalParams: params, finalPlan: generate(params), finalScore: score.composite, trajectory };
}
