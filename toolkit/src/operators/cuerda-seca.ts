import type { RenderPlan } from "../render-plan";
import type { Measurement, Operator } from "./types";

// Cuerda seca ("dry cord"): the matte line that keeps adjacent glazes apart.
// Quality = the channels are COMPLETE (every cell has one) and UNIFORM (same
// width everywhere). value = 0.5·completeness + 0.5·uniformity.
export const cuerdaSecaOperator: Operator<{ minQuality: number; minChannel?: number }> = {
  name: "cuerdaSeca",
  measure(plan: RenderPlan): Measurement {
    const channels = plan.elements
      .filter((e) => e.role === "tile" && e.channel != null)
      .map((e) => e.channel as number);
    if (channels.length === 0) return { value: 0, components: { tiles: 0 } };
    const minChannel = 2;
    const complete = channels.filter((c) => c >= minChannel).length / channels.length;
    const mean = channels.reduce((s, c) => s + c, 0) / channels.length;
    const variance = channels.reduce((s, c) => s + (c - mean) ** 2, 0) / channels.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;
    const uniformity = 1 - Math.min(1, cv);
    const value = 0.5 * complete + 0.5 * uniformity;
    return { value, components: { complete, uniformity, meanChannel: mean } };
  },
  scoreAgainst(m, target) {
    const min = target.minQuality;
    const score = Math.max(0, Math.min(1, m.value / min));
    const direction = m.value < min ? "increase" : "ok";
    return {
      score,
      measured: m.value,
      target: `≥${min}`,
      rule: "floor — higher is better (channels complete + uniform width)",
      fix: {
        axis: "cuerdaSeca",
        direction,
        detail:
          direction === "ok"
            ? `channels ${m.value.toFixed(2)} — complete and uniform`
            : `channels ${m.value.toFixed(2)} — uneven/missing; make every cell's cream line present + equal width`,
      },
    };
  },
};
