import type { Oklch, RenderPlan } from "../render-plan";
import type { Operator, OperatorScore } from "./types";
import { effectiveArea, polyArea } from "../geom";

const CHROMA_NEUTRAL = 0.03;
// Neutral (cream) area share above `neutralCap` is penalised; balance reaches 0
// when the neutral share is NEUTRAL_DOM_SPAN above the cap (i.e. cream dominates).
const NEUTRAL_DOM_SPAN = 0.35;

interface ChordMeasurement {
  lightnessSpread: number;
  palette: Oklch[];
  areaByColor: Map<number, number>; // empty for region-less (line) plans → membership fallback
}

interface ChordTarget {
  hueArc: { lo: number; hi: number };
  minLightnessSpread: number;
  neutralCap?: number; // max share of neutral (cream) area before the balance term bites
}

function hueInArc(h: number, lo: number, hi: number): boolean {
  const H = ((h % 360) + 360) % 360;
  return lo <= hi ? H >= lo && H <= hi : H >= lo || H <= hi;
}

export const colorChordOperator: Operator<ChordTarget, ChordMeasurement> = {
  name: "colorChord",
  measure(plan: RenderPlan): ChordMeasurement {
    const ls = plan.palette.map((c) => c.l);
    const lightnessSpread = ls.length ? Math.max(...ls) - Math.min(...ls) : 0;
    const areaByColor = new Map<number, number>();
    const region = plan.region;
    const regionArea = region ? polyArea(region) : 0;
    if (region && regionArea > 0) {
      let tileArea = 0;
      for (const e of plan.elements) {
        if (e.role === "background" || e.colorRef == null) continue;
        const a = effectiveArea(e.points, region);
        areaByColor.set(e.colorRef, (areaByColor.get(e.colorRef) ?? 0) + a);
        tileArea += a;
      }
      const bg = plan.elements.find((e) => e.role === "background");
      if (bg?.colorRef != null) {
        const rem = Math.max(0, regionArea - tileArea); // visible ground (tiles drawn on top)
        areaByColor.set(bg.colorRef, (areaByColor.get(bg.colorRef) ?? 0) + rem);
      }
    }
    return { lightnessSpread, palette: plan.palette, areaByColor };
  },
  scoreAgainst(m, t): OperatorScore {
    const pal = m.palette;
    const targetLabel = `hue ${t.hueArc.lo}–${t.hueArc.hi}°`;
    const rule = "blend — area-weighted hue + lightness + balance (fill media); membership (line media)";
    if (pal.length === 0) {
      return { score: 0, measured: 0, target: targetLabel, rule, fix: { axis: "colorChord", direction: "increase", detail: "empty palette" } };
    }
    const spreadScore = Math.min(1, m.lightnessSpread / t.minLightnessSpread);
    const totalArea = [...m.areaByColor.values()].reduce((s, a) => s + a, 0);

    let value: number;
    let hueMeasured: number;
    let balance = 1;
    if (totalArea > 0) {
      let onArc = 0;
      let neutral = 0;
      for (const [idx, a] of m.areaByColor) {
        const c = pal[idx];
        if (!c) continue;
        const isNeutral = c.c < CHROMA_NEUTRAL;
        if (isNeutral || hueInArc(c.h, t.hueArc.lo, t.hueArc.hi)) onArc += a;
        if (isNeutral) neutral += a;
      }
      const hueOnArc = onArc / totalArea;
      const neutralShare = neutral / totalArea;
      const cap = t.neutralCap ?? 0.20;
      balance = 1 - Math.min(1, Math.max(0, (neutralShare - cap) / NEUTRAL_DOM_SPAN));
      hueMeasured = hueOnArc;
      value = 0.45 * hueOnArc + 0.30 * spreadScore + 0.25 * balance;
    } else {
      // region-less line plan: palette-membership (unchanged behaviour)
      const inArc = pal.filter((c) => c.c < CHROMA_NEUTRAL || hueInArc(c.h, t.hueArc.lo, t.hueArc.hi));
      hueMeasured = inArc.length / pal.length;
      value = 0.6 * hueMeasured + 0.4 * spreadScore;
    }
    const ok = value > 0.85;
    return {
      score: value,
      measured: hueMeasured,
      target: targetLabel,
      rule,
      components: totalArea > 0
        ? [
            { label: "hue on-arc (area)", score: hueMeasured, weight: 0.45 },
            { label: "lightness spread", score: spreadScore, weight: 0.30 },
            { label: "balance (no colour dominates)", score: balance, weight: 0.25 },
          ]
        : [
            { label: "hue on-arc (membership)", score: hueMeasured, weight: 0.6 },
            { label: "lightness spread", score: spreadScore, weight: 0.4 },
          ],
      fix: {
        axis: "colorChord",
        direction: ok ? "ok" : "increase",
        detail: ok ? "chord on-target" : `hue ${hueMeasured.toFixed(2)}, balance ${balance.toFixed(2)}, spread ${m.lightnessSpread.toFixed(2)}`,
      },
    };
  },
};
