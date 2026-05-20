import type { RenderPlan } from "../render-plan";

export interface Measurement {
  value: number;
  components?: Record<string, number>;
}

export type FixDirection = "increase" | "decrease" | "ok";

export interface Fix {
  axis: string;
  direction: FixDirection;
  detail: string;
}

export interface OperatorScore {
  score: number; // 0..1
  fix: Fix;
}

// M defaults to Measurement; colorChord overrides it with a richer payload
// so scoreAgainst can apply a target-dependent hue arc while measure stays
// target-free.
export interface Operator<T = unknown, M = Measurement> {
  name: string;
  measure(plan: RenderPlan): M;
  scoreAgainst(m: M, target: T): OperatorScore;
}
