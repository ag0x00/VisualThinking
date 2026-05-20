import type { Oklch, RenderPlan } from "../render-plan";
import type { Operator, OperatorScore } from "./types";

const CHROMA_NEUTRAL = 0.03;

interface ChordMeasurement {
  lightnessSpread: number;
  palette: Oklch[];
}

interface ChordTarget {
  hueArc: { lo: number; hi: number };
  minLightnessSpread: number;
}

function hueInArc(h: number, lo: number, hi: number): boolean {
  const H = ((h % 360) + 360) % 360;
  return lo <= hi ? H >= lo && H <= hi : H >= lo || H <= hi;
}

export const colorChordOperator: Operator<ChordTarget, ChordMeasurement> = {
  name: "colorChord",
  measure(plan: RenderPlan): ChordMeasurement {
    const ls = plan.palette.map((c) => c.l);
    const spread = ls.length ? Math.max(...ls) - Math.min(...ls) : 0;
    return { lightnessSpread: spread, palette: plan.palette };
  },
  scoreAgainst(m, t): OperatorScore {
    const pal = m.palette;
    const targetLabel = `hue ${t.hueArc.lo}–${t.hueArc.hi}°`;
    if (pal.length === 0) {
      return { score: 0, measured: 0, target: targetLabel, fix: { axis: "colorChord", direction: "increase", detail: "empty palette" } };
    }
    const inArc = pal.filter((c) => c.c < CHROMA_NEUTRAL || hueInArc(c.h, t.hueArc.lo, t.hueArc.hi));
    const hueInRange = inArc.length / pal.length;
    const spreadScore = Math.min(1, m.lightnessSpread / t.minLightnessSpread);
    const value = 0.6 * hueInRange + 0.4 * spreadScore;
    const ok = value > 0.85;
    return {
      score: value,
      measured: hueInRange, // fraction of palette on-arc (neutrals exempt)
      target: targetLabel,
      fix: {
        axis: "colorChord",
        direction: ok ? "ok" : "increase",
        detail: ok
          ? "chord on-target"
          : `hueInRange ${hueInRange.toFixed(2)}, lightness spread ${m.lightnessSpread.toFixed(2)}`,
      },
    };
  },
};
