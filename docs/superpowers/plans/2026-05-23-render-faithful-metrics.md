# Render-Faithful Metrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the toolkit's area/colour operators measure what the renderer draws, not the RenderPlan's declared intent — fixing the three girih12 `groutGap=0.15` defects (overhang-inflated coverage, dark-bowtie bleed, cream dominance) at their shared root.

**Architecture:** A shared `clipToConvexRegion` resolver gives operators the in-frame area of any element; `constructionGrammar` and `colorChord` consume it (deterministic, no runtime deps). A dev-only `@resvg/resvg-js` raster oracle provides pixel ground-truth used in tests + an adversarial "ugliest render that still maxes the score" test class. The grout goes cream-by-construction so bowties cannot form.

**Tech Stack:** TypeScript (ESM, Bundler), vitest, tsx, culori, `@resvg/resvg-js` (devDependency, tests only).

**Spec:** `docs/superpowers/specs/2026-05-23-render-faithful-metrics-design.md`

**Working dir:** `npm`/`npx` from `cd /Users/ag/Lab/VisualThinking/toolkit`; `git` from `cd /Users/ag/Lab/VisualThinking`. Bash cwd can reset between calls — always prefix the `cd`.

**Shared-operator constraint:** `constructionGrammar` (tiling/truchet/girih12) and `colorChord` (all four media) are shared. After each change, re-probe and keep the existing tests green; only change an expected threshold *with a one-line reason in the commit*. igp strapwork has **no `region`** (it's lines) → `colorChord` must keep a membership fallback for that case so its tests are untouched.

**Current baseline:** 97 tests pass, tsc clean. PR #2 push is **held** until this lands.

---

## File Structure

**Modify:**
- `src/geom.ts` — add `clipToConvexRegion` + `effectiveArea`.
- `src/operators/construction-grammar.ts` — coverage via `effectiveArea`.
- `src/operators/color-chord.ts` — area-weighted hue + neutral-dominance balance, with membership fallback for region-less (line) plans.
- `src/generators/girih12.ts` — background `colorRef = CREAM`; default `groutGap` → 0.05.
- `src/profiles/girih12.ts` — restore standard coverage band; adjust colorChord target (`neutralCap`) per probe.
- Possibly `src/profiles/{timurid-tiling,truchet}.ts` — only if a probe shows the area-weighted colorChord moved a score out of band.
- `package.json` — add `@resvg/resvg-js` devDependency.
- `README.md` — note the render-faithful change + raster oracle.

**Create:**
- `test/geom.test.ts` (if absent — else extend) — clip/effectiveArea unit tests.
- `test/util/raster-oracle.ts` — `measureFromRaster(plan)`.
- `test/raster-agreement.test.ts` — runtime operators agree with pixels per medium.
- `test/adversarial.test.ts` — the "ugliest render that still maxes the score" class.

**Untouched:** `compose.ts`, `improve.ts`, `tuning.ts`, `profile.ts`, all generators except girih12, `symmetry`/`complexity`/`periodicity`/`lineContinuity`/`cuerdaSeca`/`tileComplexity` operators (cuerdaSeca's blind spot is removed structurally by the cream ground, so the operator itself does not change).

---

## Task 1: Shared geometry resolver

**Files:**
- Modify: `src/geom.ts`
- Test: `test/geom.test.ts`

- [ ] **Step 1: Write the failing test**

Create/extend `test/geom.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { clipToConvexRegion, effectiveArea, polyArea } from "../src/geom";
import type { Vec2 } from "../src/render-plan";

const RECT: Vec2[] = [[0, 0], [100, 0], [100, 100], [0, 100]];

describe("clipToConvexRegion", () => {
  it("leaves a fully-inside polygon's area unchanged", () => {
    const sq: Vec2[] = [[10, 10], [40, 10], [40, 40], [10, 40]];
    expect(effectiveArea(sq, RECT)).toBeCloseTo(polyArea(sq), 6);
  });

  it("clips a straddling polygon to the in-frame part", () => {
    const sq: Vec2[] = [[80, 80], [120, 80], [120, 120], [80, 120]]; // half-out each axis
    expect(effectiveArea(sq, RECT)).toBeCloseTo(400, 4); // 20x20 corner inside
  });

  it("returns ~0 area for a fully-outside polygon", () => {
    const sq: Vec2[] = [[200, 200], [240, 200], [240, 240], [200, 240]];
    expect(effectiveArea(sq, RECT)).toBeCloseTo(0, 6);
  });

  it("works against a convex non-rect region (triangle)", () => {
    const tri: Vec2[] = [[0, 0], [100, 0], [0, 100]];
    const sq: Vec2[] = [[10, 10], [90, 10], [90, 90], [10, 90]]; // partly past the hypotenuse
    expect(effectiveArea(sq, tri)).toBeLessThan(polyArea(sq));
    expect(effectiveArea(sq, tri)).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/geom.test.ts`
Expected: FAIL — `clipToConvexRegion`/`effectiveArea` not exported.

- [ ] **Step 3: Implement in `src/geom.ts`**

Append (the file already exports `polyArea`, `centroid`, `scaleAbout` and imports `Vec2`):

```ts
// Sutherland–Hodgman clip of a subject polygon against a CONVEX region polygon.
// Region winding is detected from its signed area, so either orientation works.
// Returns the clipped polygon ([] if fully outside).
export function clipToConvexRegion(subject: Vec2[], region: Vec2[]): Vec2[] {
  if (region.length < 3 || subject.length < 3) return subject;
  let area2 = 0;
  for (let i = 0; i < region.length; i++) {
    const [x0, y0] = region[i];
    const [x1, y1] = region[(i + 1) % region.length];
    area2 += x0 * y1 - x1 * y0;
  }
  const ccw = area2 > 0;
  let output = subject;
  for (let i = 0; i < region.length && output.length > 0; i++) {
    const a = region[i];
    const b = region[(i + 1) % region.length];
    const inside = (p: Vec2) => {
      const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
      return ccw ? cross >= 0 : cross <= 0;
    };
    const intersect = (p: Vec2, q: Vec2): Vec2 => {
      const r: Vec2 = [q[0] - p[0], q[1] - p[1]];
      const s: Vec2 = [b[0] - a[0], b[1] - a[1]];
      const denom = r[0] * s[1] - r[1] * s[0];
      if (denom === 0) return q;
      const t = ((a[0] - p[0]) * s[1] - (a[1] - p[1]) * s[0]) / denom;
      return [p[0] + t * r[0], p[1] + t * r[1]];
    };
    const input = output;
    output = [];
    for (let j = 0; j < input.length; j++) {
      const cur = input[j];
      const prev = input[(j + input.length - 1) % input.length];
      const curIn = inside(cur);
      const prevIn = inside(prev);
      if (curIn) {
        if (!prevIn) output.push(intersect(prev, cur));
        output.push(cur);
      } else if (prevIn) {
        output.push(intersect(prev, cur));
      }
    }
  }
  return output;
}

// Area of a polygon clipped to the region — i.e. the part the renderer actually shows.
export function effectiveArea(poly: Vec2[], region: Vec2[]): number {
  return polyArea(clipToConvexRegion(poly, region));
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/geom.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/geom.ts toolkit/test/geom.test.ts && git commit -m "$(cat <<'EOF'
toolkit: add clipToConvexRegion + effectiveArea (shared in-frame geometry resolver)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: constructionGrammar clip-to-region + girih12 grout fix (one green commit)

These are coupled: clipping girih12's wall-to-wall tiles *lowers* its coverage, and the cream-ground + thinner grout are what land it back in the standard band. Doing them together keeps every commit green.

**Files:**
- Modify: `src/operators/construction-grammar.ts`, `src/generators/girih12.ts`, `src/profiles/girih12.ts`
- Test: existing `test/operators/*`, `test/acceptance-*` (re-run; adjust girih12 band)

- [ ] **Step 1: constructionGrammar uses `effectiveArea`**

In `src/operators/construction-grammar.ts`, change the import and the coverage line:

```ts
import { effectiveArea } from "../geom"; // replaces: import { polyArea } from "../geom";
```

```ts
    const sumCell = tiles.reduce((s, t) => s + effectiveArea(t.points, plan.region!), 0);
```

(Everything else in the operator is unchanged. `plan.region` is already guarded non-empty above by the `regionArea === 0` early-return.)

- [ ] **Step 2: girih12 cream ground + thinner grout**

In `src/generators/girih12.ts`, change the background colorRef and the default grout:

```ts
// background is now the CREAM ground (was BG/deep-blue): any inter-tile gap reads
// as cream channel, so dark "bowtie" bleed is impossible at any grout width.
const elements: Element[] = [
  { kind: "polygon", role: "background", points: [[0, 0], [W, 0], [W, H], [0, H]], colorRef: CREAM },
];
```

```ts
    groutGap: 0.05, channelWidth: 4, channelJitter: 0, latticeJitter: 0,
```

(Leave `BG = 3` defined — deep-blue stays in `SAMARKAND_7` for later use. Update the `const BG = 3, CREAM = 4, ...` comment to note BG is currently unused.)

- [ ] **Step 3: Probe girih12 coverage + the other media**

Run:

```bash
cd /Users/ag/Lab/VisualThinking/toolkit && npx tsx -e '
import { compose } from "./src/compose";
import { generateGirih12, defaultGirih12Params } from "./src/generators/girih12";
import { girih12Profile } from "./src/profiles/girih12";
import { truchetGood, tilingGood } from "./src/variants";
import { truchetProfile } from "./src/profiles/truchet";
import { timuridTilingProfile } from "./src/profiles/timurid-tiling";
for (const g of [0.03,0.05,0.07,0.10]) {
  const r = compose(generateGirih12({...defaultGirih12Params(), groutGap:g}), girih12Profile);
  console.log("girih12 grout",g,"constr", r.perOperator.find(p=>p.name==="constructionGrammar")!.measured.toFixed(3));
}
console.log("truchet constr", compose(truchetGood(), truchetProfile).perOperator.find(p=>p.name==="constructionGrammar")!.measured.toFixed(3));
console.log("tiling  constr", compose(tilingGood(), timuridTilingProfile).perOperator.find(p=>p.name==="constructionGrammar")!.measured.toFixed(3));
'
```

Read the girih12 coverage at `groutGap 0.05`. **Set the girih12 profile band so 0.05 sits mid-band** (likely `[0.85, 1.05]`; if 0.05 reads ~0.95, that band is correct as-is). Confirm truchet/tiling coverage are still ~what their profiles expect (they don't overhang, so expect ~unchanged). If tiling/truchet moved out of band, record the new measured value and widen that profile's band minimally with a comment.

- [ ] **Step 4: Update girih12 profile band**

In `src/profiles/girih12.ts`, set the constructionGrammar target to the probed standard band (replace the loosened comment):

```ts
    { operator: "constructionGrammar", weight: 0.30, target: { band: [0.85, 1.05], falloff: 0.2 } },
```

Update the file's top comment: coverage now clips to the frame (no overhang inflation), so the band is standard and `groutGap` is the visually-correct ~0.05.

- [ ] **Step 5: Run the affected suites**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/acceptance-girih12.test.ts test/acceptance-tiling.test.ts test/operators/construction-grammar.test.ts && npm test 2>&1 | tail -4`
Expected: girih12 good still ≥0.85 and outranks variants; gappy-grout (now `groutGap 0.25`) still flags constructionGrammar; tiling/truchet acceptance green. **If the girih12 improve test's degraded start no longer degrades coverage** (because the band moved), bump that start's `groutGap` until `compose(...).constructionGrammar` is below the band, and update `test/acceptance-girih12.test.ts` + the gallery `improveGirih12` start to match (record the value).

- [ ] **Step 6: Re-eyeball girih12 + commit**

```bash
cd /Users/ag/Lab/VisualThinking/toolkit && npx tsx -e '
import { writeFileSync } from "node:fs";
import { girih12Good } from "./src/variants";
import { renderSvg } from "./src/renderers/svg";
writeFileSync("out/girih12-final.svg", renderSvg(girih12Good()));
' && open "$(pwd)/out/girih12-final.svg"
```
Confirm: thin cream channels, no dark bowties, glaze-dominant (not cream-dominant). Then:

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/operators/construction-grammar.ts toolkit/src/generators/girih12.ts toolkit/src/profiles/girih12.ts toolkit/test/acceptance-girih12.test.ts toolkit/src/scripts/render-gallery.ts && git commit -m "$(cat <<'EOF'
toolkit: constructionGrammar clips coverage to the frame; girih12 cream ground + thin grout

Coverage now sums in-frame tile area (effectiveArea), so off-canvas overhang stops
inflating it — girih12 returns to the standard [0.85,1.05] band at the visually
correct groutGap 0.05. Background is the cream ground, so inter-tile gaps read as
cream channel (dark "bowtie" bleed structurally impossible). truchet/tiling
unchanged (no overhang).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: colorChord — area-weighted hue + neutral-dominance balance

**Files:**
- Modify: `src/operators/color-chord.ts`
- Test: `test/operators/color-chord.test.ts`, all `test/acceptance-*`

- [ ] **Step 1: Write the failing test**

Extend `test/operators/color-chord.test.ts` (keep existing cases):

```ts
import { generateGirih12, defaultGirih12Params } from "../../src/generators/girih12";

describe("colorChord is area-weighted (fill media)", () => {
  const target = { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45, neutralCap: 0.25 };

  it("a tiny off-arc accent barely dents the score (girih12 good)", () => {
    const m = colorChordOperator.measure(generateGirih12(defaultGirih12Params()));
    const s = colorChordOperator.scoreAgainst(m, target);
    expect(s.score).toBeGreaterThan(0.85); // 3.75%-area saffron no longer tanks it
  });

  it("cream dominance (thick grout) is penalised", () => {
    const m = colorChordOperator.measure(generateGirih12({ ...defaultGirih12Params(), groutGap: 0.15 }));
    const s = colorChordOperator.scoreAgainst(m, target);
    expect(s.score).toBeLessThan(0.85); // ~35% cream ground trips the balance term
  });

  it("falls back to membership for region-less line plans (no crash, finite score)", () => {
    const linePlan = { bounds: { width: 100, height: 100 }, symmetry: { group: "p6m" }, palette: [{ l: 0.5, c: 0.1, h: 200 }], elements: [{ kind: "segment" as const, role: "line" as const, points: [[0,0],[10,10]] as any, strokeRef: 0 }] };
    const s = colorChordOperator.scoreAgainst(colorChordOperator.measure(linePlan as any), target);
    expect(Number.isFinite(s.score)).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/operators/color-chord.test.ts`
Expected: FAIL — `measure` doesn't return area data; `neutralCap` unused; girih12 good currently scores 0.78 (< 0.85).

- [ ] **Step 3: Rewrite `src/operators/color-chord.ts`**

```ts
import type { Oklch, RenderPlan } from "../render-plan";
import type { Operator, OperatorScore } from "./types";
import { effectiveArea } from "../geom";

const CHROMA_NEUTRAL = 0.03;

interface ChordMeasurement {
  lightnessSpread: number;
  palette: Oklch[];
  areaByColor: Map<number, number>; // empty for region-less (line) plans → membership fallback
}

interface ChordTarget {
  hueArc: { lo: number; hi: number };
  minLightnessSpread: number;
  neutralCap?: number; // max share of neutral (cream) area before balance penalty
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
    const regionArea = region ? Math.abs(region.reduce((s, _p, i) => {
      const [x0, y0] = region[i], [x1, y1] = region[(i + 1) % region.length];
      return s + x0 * y1 - x1 * y0;
    }, 0) / 2) : 0;
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
      const cap = t.neutralCap ?? 0.25;
      balance = 1 - Math.max(0, neutralShare - cap) / (1 - cap);
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
```

- [ ] **Step 4: Add `neutralCap` to the girih12 profile colorChord target**

In `src/profiles/girih12.ts`:

```ts
    { operator: "colorChord", weight: 0.20, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45, neutralCap: 0.25 } },
```

- [ ] **Step 5: Re-probe all four media + adjust**

Run:

```bash
cd /Users/ag/Lab/VisualThinking/toolkit && npx tsx -e '
import { compose } from "./src/compose";
import { timuridIgpProfile } from "./src/profiles/timurid-igp";
import { timuridTilingProfile } from "./src/profiles/timurid-tiling";
import { truchetProfile } from "./src/profiles/truchet";
import { girih12Profile } from "./src/profiles/girih12";
import { goodPlan, tilingGood, truchetGood, girih12Good, degradedVariants, tilingVariants, truchetVariants, girih12Variants } from "./src/variants";
const sets = [["igp",goodPlan(),timuridIgpProfile,degradedVariants()],["tiling",tilingGood(),timuridTilingProfile,tilingVariants()],["truchet",truchetGood(),truchetProfile,truchetVariants()],["girih12",girih12Good(),girih12Profile,girih12Variants()]] as const;
for (const [name,good,prof,vars] of sets) {
  const cc = (p:any)=>compose(p,prof as any).perOperator.find((o:any)=>o.name==="colorChord");
  const g = cc(good);
  const wc = (vars as any[]).find(v=>v.label==="wrong-chord");
  console.log(name, "good colorChord", g.measured.toFixed(2), Math.round(g.score*100)+"%", "| wrong-chord", wc?Math.round(cc(wc.plan).score*100)+"%":"-");
}
'
```

Confirm: every `good` colorChord still scores high (≥ ~0.85 on the fill media; igp membership unchanged) and every `wrong-chord` still scores low. If a fill medium's good dropped (e.g. tiling's deep-blue background pushes neutralShare — it shouldn't, deep-blue is chromatic not neutral), record the value and either adjust that profile's `neutralCap` or note why. **Do not** change the 0.45/0.30/0.25 split unless a probe shows a medium can't pass; if you must, record the new split + reason.

- [ ] **Step 6: Run full suite**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm test 2>&1 | tail -6 && npm run typecheck 2>&1 | tail -1`
Expected: all green, tsc clean. Fix any acceptance threshold that legitimately moved (record reason in the commit).

- [ ] **Step 7: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/operators/color-chord.ts toolkit/src/profiles/girih12.ts toolkit/test/operators/color-chord.test.ts && git commit -m "$(cat <<'EOF'
toolkit: colorChord area-weighted + neutral-dominance balance (membership fallback for line media)

Per-colour in-frame area share (occlusion-aware: background = region minus tiles)
drives hue-on-arc, so a tiny off-arc accent no longer tanks the score (fixes the
girih12 saffron under-scoring) and a cream-dominant field is penalised by a balance
term. Region-less line plans (igp strapwork) keep the old membership formula.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Raster oracle (dev-only)

**Files:**
- Modify: `package.json` (devDependency)
- Create: `test/util/raster-oracle.ts`, `test/raster-agreement.test.ts`

- [ ] **Step 1: Install the rasteriser + verify its API**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm install -D @resvg/resvg-js`
Then confirm the render API with context7 (the `mcp__context7__*` tools) for `@resvg/resvg-js` — specifically how to get an RGBA pixel buffer (expected: `new Resvg(svg, { fitTo: { mode: "width", value } }); const img = resvg.render(); img.pixels` is a `Buffer` of RGBA, with `img.width`/`img.height`). Adjust the helper below to match the installed version's exact API.

- [ ] **Step 2: Write the oracle helper**

Create `test/util/raster-oracle.ts`:

```ts
import { Resvg } from "@resvg/resvg-js";
import { formatHex } from "culori";
import type { RenderPlan } from "../../src/render-plan";
import { renderSvg } from "../../src/renderers/svg";

export interface RasterMeasurement {
  coverage: number;                       // fraction of pixels not the background colour
  areaShareByHex: Record<string, number>; // per-colour pixel fraction
  bgHex: string;
}

// Rasterise the plan and measure ground truth from pixels. Tests/calibration only.
export function measureFromRaster(plan: RenderPlan, px = 256): RasterMeasurement {
  const resvg = new Resvg(renderSvg(plan), { fitTo: { mode: "width", value: px } });
  const img = resvg.render();
  const { pixels, width, height } = img; // RGBA buffer
  const bg = plan.elements.find((e) => e.role === "background");
  const bgHex = (bg?.colorRef != null
    ? formatHex({ mode: "oklch", ...plan.palette[bg.colorRef] })
    : "#000000") ?? "#000000";
  const counts = new Map<string, number>();
  const total = width * height;
  for (let i = 0; i < pixels.length; i += 4) {
    const hex = "#" + [pixels[i], pixels[i + 1], pixels[i + 2]].map((v) => v.toString(16).padStart(2, "0")).join("");
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }
  const areaShareByHex: Record<string, number> = {};
  let bgCount = 0;
  for (const [hex, n] of counts) {
    areaShareByHex[hex] = n / total;
    if (nearHex(hex, bgHex, 12)) bgCount += n;
  }
  return { coverage: 1 - bgCount / total, areaShareByHex, bgHex };
}

// allow small antialiasing drift when matching a colour
function nearHex(a: string, b: string, tol: number): boolean {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return pa.every((v, i) => Math.abs(v - pb[i]) <= tol);
}

// Total pixel share of colours whose hue is OUTSIDE [lo,hi] and chroma ≥ 0.03,
// i.e. visible "wrong"/off-arc area — used to cross-check colorChord.
export function offArcShare(m: RasterMeasurement, palette: { l: number; c: number; h: number }[], lo: number, hi: number): number {
  const onArcHexes = new Set(
    palette.filter((c) => c.c < 0.03 || ((((c.h % 360) + 360) % 360) >= lo && (((c.h % 360) + 360) % 360) <= hi)).map((c) => formatHex({ mode: "oklch", ...c }) ?? ""),
  );
  let off = 0;
  for (const [hex, share] of Object.entries(m.areaShareByHex)) {
    if (![...onArcHexes].some((h) => nearHex(hex, h, 12))) off += share;
  }
  return off;
}
```

- [ ] **Step 3: Write the raster-agreement test**

Create `test/raster-agreement.test.ts`:

```ts
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
      // both express "fraction of frame that is glaze, not ground"; allow grout/AA slack
      expect(Math.abs(Math.min(planCov, 1) - rasterCov)).toBeLessThan(0.2);
    });
  }
});
```

(Tolerance is loose by design — the plan metric counts geometry, the raster counts the rendered glaze minus grout; they must *agree in the large*, which is what catches a 1.25-vs-0.8 divergence. Tighten if the probe shows they track closely.)

- [ ] **Step 4: Run + verify**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/raster-agreement.test.ts`
Expected: PASS (3). If a case diverges past 0.2, that is a real finding — investigate before loosening the tolerance (it may be the next render-faithfulness bug).

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/package.json toolkit/package-lock.json toolkit/test/util/raster-oracle.ts toolkit/test/raster-agreement.test.ts && git commit -m "$(cat <<'EOF'
toolkit: dev-only resvg raster oracle + per-medium raster-agreement cross-check

measureFromRaster() gives pixel ground truth (coverage, per-colour area share,
off-arc share). Tests assert the deterministic plan-based operators agree with the
render within tolerance — the regression guard against plan↔pixel drift.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Adversarial test class

**Files:**
- Create: `test/adversarial.test.ts`

- [ ] **Step 1: Write the tests**

Create `test/adversarial.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { generateGirih12, defaultGirih12Params } from "../src/generators/girih12";
import { girih12Profile } from "../src/profiles/girih12";
import { measureFromRaster, offArcShare } from "./util/raster-oracle";

// "The ugliest render that still maxed the OLD score" — must now be caught.
describe("adversarial: bad designs can no longer max the score", () => {
  it("thick grout (0.15) is now penalised on colorChord, and the oracle confirms cream dominance", () => {
    const plan = generateGirih12({ ...defaultGirih12Params(), groutGap: 0.15 });
    const cc = compose(plan, girih12Profile).perOperator.find((p) => p.name === "colorChord")!;
    expect(cc.score).toBeLessThan(0.85); // was 100% under the old membership model
    const m = measureFromRaster(plan);
    expect(m.coverage).toBeLessThan(0.8); // lots of cream ground showing → low glaze coverage
  });

  it("good girih12 has negligible off-arc area (the saffron accent stays under budget)", () => {
    const plan = generateGirih12(defaultGirih12Params());
    const m = measureFromRaster(plan);
    expect(offArcShare(m, defaultGirih12Params().palette, 180, 265)).toBeLessThan(0.05);
  });

  it("coverage no longer reads ≫1 from off-canvas overhang (clip-to-frame holds)", () => {
    const plan = generateGirih12(defaultGirih12Params());
    const cov = compose(plan, girih12Profile).perOperator.find((p) => p.name === "constructionGrammar")!.measured;
    expect(cov).toBeLessThanOrEqual(1.1);
  });
});
```

- [ ] **Step 2: Run + verify**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/adversarial.test.ts`
Expected: PASS (3). If the first assertion fails (thick grout still ≥0.85), the `neutralCap` is too loose — lower it in the girih12 profile until 0.15 is caught while 0.05 stays ≥0.85, and re-run Task 3 Step 6.

- [ ] **Step 3: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/test/adversarial.test.ts && git commit -m "$(cat <<'EOF'
toolkit: adversarial test class — the ugliest render that still maxes the score

Asserts the old girih12 groutGap=0.15 defect is now caught (colorChord < 0.85,
raster confirms cream dominance + low glaze coverage) and overhang no longer
inflates coverage. The dual of the deliberate-failure variants.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Gallery refresh, README, final verification, finish branch

**Files:**
- Modify: `src/scripts/render-gallery.ts` (only if the girih12 improve start changed in Task 2 Step 5), `README.md`

- [ ] **Step 1: Regenerate the gallery + eyeball**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm run gallery 2>&1 | tail -1 && open "$(pwd)/out/gallery.html"`
Confirm the girih12 GOOD card reads as a glaze-dominant mosaic with thin cream channels and no dark bowties, and the improvement group still climbs.

- [ ] **Step 2: README note**

In `README.md`, under the girih12 section, replace the two-caveat paragraph's coverage/colorChord caveats with the resolution:

```markdown
**Render-faithful metrics (2026-05-23):** the area operators measure what the renderer draws, not declared intent. `constructionGrammar` clips tile area to the frame (off-canvas overhang no longer inflates coverage), so `groutGap` is the visually-correct ~0.05 with a standard band. `colorChord` is area-weighted with a balance term — a tiny off-arc accent barely dents it while a cream-dominant field is penalised. The grout is cream-by-construction (cream ground), so dark bleed cannot form. A dev-only `@resvg/resvg-js` raster oracle cross-checks each operator against pixels, and an adversarial test class asserts the old `groutGap=0.15` defect now scores low.
```

Add `@resvg/resvg-js` is dev-only to the Layout/deps note if one exists.

- [ ] **Step 3: Final full verification**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm test 2>&1 | tail -6 && npm run typecheck 2>&1 | tail -1; echo "TC:$?"`
Expected: all tests pass (97 prior, adjusted-with-reason where noted, + geom 4 + colorChord 3 + raster 3 + adversarial 3 ≈ 110), tsc clean.

- [ ] **Step 4: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/README.md toolkit/src/scripts/render-gallery.ts && git commit -m "$(cat <<'EOF'
toolkit: document render-faithful metrics + refresh gallery

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Finish the development branch**

Use the **superpowers:finishing-a-development-branch** skill. Tests verified in Step 3. This extends open PR #2 on `toolkit-screensaver`; the held push happens here — **push and let PR #2 update** (the girih12 defect is now fixed). Update `.claude/memory/project_subsystem-trajectory.md`: record render-faithful-metrics shipped (clip-to-frame coverage, area-weighted colorChord, cream-ground grout, raster oracle, adversarial test class), and that the proportion-aware colorChord todo is now DONE.

---

## Self-Review Notes

- **Spec coverage:** resolver (T1); constructionGrammar clip + cream ground + grout re-thin (T2); colorChord area-weighted + balance + membership fallback (T3); raster oracle + agreement (T4); adversarial class (T5); README + push (T6). Every spec component maps to a task. ✓
- **Shared-operator safety:** T2 re-probes tiling/truchet coverage; T3 re-probes all four media's colorChord; both keep tests green or update thresholds with a recorded reason. igp strapwork is protected by the membership fallback (region-less → old formula). ✓
- **cuerdaSeca:** unchanged by design — the cream ground removes its blind spot structurally; the raster oracle (bleed via low glaze coverage) is the guard. No task edits it. ✓
- **Type consistency:** `clipToConvexRegion`/`effectiveArea` (T1) used identically in construction-grammar (T2) and color-chord (T3); `ChordTarget.neutralCap?` defined in T3 and set in the girih12 profile (T3 S4); `measureFromRaster`/`offArcShare` defined in T4 and used in T4/T5. ✓
- **Probe-before-assert:** T2 S3, T3 S5 calibrate before thresholds are fixed (established pattern). ✓
- **Determinism:** raster oracle is dev/test-only; `compose`/`improve` never import it. ✓
