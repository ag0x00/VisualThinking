import { operators } from "./operators/index";
import type { Fix } from "./operators/types";
import type { AestheticProfile } from "./profile";
import type { RenderPlan } from "./render-plan";

export interface CompositionResult {
  composite: number;
  perOperator: { name: string; score: number; measured: number; target: string; weight: number; fix: Fix }[];
  fixes: Fix[];
}

export function compose(plan: RenderPlan, profile: AestheticProfile): CompositionResult {
  const perOperator = profile.operators.map((b) => {
    const op = operators[b.operator];
    if (!op) throw new Error(`Unknown operator: ${b.operator}`);
    const m = op.measure(plan);
    const s = op.scoreAgainst(m, b.target);
    return { name: b.operator, score: s.score, measured: s.measured, target: s.target, weight: b.weight, fix: s.fix };
  });
  const wsum = perOperator.reduce((s, p) => s + p.weight, 0);
  const composite = wsum === 0 ? 0 : perOperator.reduce((s, p) => s + p.score * p.weight, 0) / wsum;
  const fixes = perOperator
    .filter((p) => p.fix.direction !== "ok")
    .sort((a, b) => (1 - b.score) * b.weight - (1 - a.score) * a.weight)
    .map((p) => p.fix);
  return { composite, perOperator, fixes };
}
