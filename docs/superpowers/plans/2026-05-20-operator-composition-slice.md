# Operator-Composition Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first `toolkit/` modules — a deterministic generate→score spine that proves the operator → profile → composer model on self-generated Islamic-geometric render-plans.

**Architecture:** Pure functions over a `RenderPlan` data type. **Operators measure (target-free); profiles set targets.** A composer runs a profile's operator bindings against a plan and returns a weighted composite + ranked fixes. A minimal 6-fold IGP generator produces inputs; an SVG renderer produces output for visual calibration. The acceptance test asserts a "good" generated plan out-scores deliberately-degraded variants and that the top fix names the broken axis.

**Tech Stack:** TypeScript (ESM, `moduleResolution: Bundler`), vitest, culori (OKLCH→hex in the renderer only), tsx (render script). No runtime deps in the operators.

**Spec:** `docs/superpowers/specs/2026-05-20-operator-composition-slice-design.md`

**Commit convention:** every commit message in this plan must append the trailer `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` (repo convention). Commands below omit it for brevity.

**Deviation from spec:** the profile ships as a typed `.ts` module (`profiles/timurid-igp.ts`), not `.json`, to get type-checking and avoid ESM JSON-import-assertion friction. Behaviour is identical.

---

### Task 1: Scaffold `toolkit/`

**Files:**
- Create: `toolkit/package.json`
- Create: `toolkit/tsconfig.json`
- Create: `toolkit/.gitignore`

- [ ] **Step 1: Create `toolkit/package.json`**

```json
{
  "name": "@visualthinking/toolkit",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "render": "tsx src/scripts/render-sample.ts"
  },
  "dependencies": {
    "culori": "^4.0.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `toolkit/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src", "test"]
}
```

- [ ] **Step 3: Create `toolkit/.gitignore`**

```
node_modules/
out/
```

- [ ] **Step 4: Install**

Run: `cd toolkit && npm install`
Expected: completes; `toolkit/node_modules/culori` and `toolkit/node_modules/vitest` exist.

- [ ] **Step 5: Commit**

```bash
git add toolkit/package.json toolkit/tsconfig.json toolkit/.gitignore toolkit/package-lock.json
git commit -m "chore(toolkit): scaffold TS + vitest + culori"
```

---

### Task 2: `RenderPlan` schema + validator

**Files:**
- Create: `toolkit/src/render-plan.ts`
- Test: `toolkit/test/render-plan.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { validateRenderPlan, type RenderPlan } from "../src/render-plan";

const base: RenderPlan = {
  bounds: { width: 100, height: 100 },
  symmetry: { group: "p6m", center: [50, 50], order: 6 },
  palette: [{ l: 0.5, c: 0.1, h: 200 }],
  elements: [
    { kind: "segment", role: "line", points: [[0, 0], [10, 10]], strokeRef: 0 },
  ],
};

describe("validateRenderPlan", () => {
  it("accepts a well-formed plan", () => {
    expect(validateRenderPlan(base)).toEqual([]);
  });

  it("flags out-of-range strokeRef", () => {
    const bad = { ...base, elements: [{ ...base.elements[0], strokeRef: 5 }] };
    expect(validateRenderPlan(bad).some((e) => e.includes("strokeRef"))).toBe(true);
  });

  it("flags empty palette and degenerate elements", () => {
    const bad: RenderPlan = {
      ...base,
      palette: [],
      elements: [{ kind: "segment", role: "line", points: [[0, 0]] }],
    };
    const errs = validateRenderPlan(bad);
    expect(errs.some((e) => e.includes("palette"))).toBe(true);
    expect(errs.some((e) => e.includes(">=2 points"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd toolkit && npx vitest run test/render-plan.test.ts`
Expected: FAIL — cannot resolve `../src/render-plan`.

- [ ] **Step 3: Write the implementation**

```ts
export type Vec2 = [number, number];

export interface Oklch {
  l: number; // 0..1
  c: number; // chroma
  h: number; // degrees 0..360
}

export interface Symmetry {
  group: string;
  lattice?: [Vec2, Vec2];
  center?: Vec2;
  order?: number;
}

export type ElementRole = "line" | "tile" | "background";

export interface Element {
  kind: "segment" | "polygon" | "path";
  points: Vec2[];
  role: ElementRole;
  colorRef?: number;
  strokeRef?: number;
  motifId?: string;
}

export interface RenderPlan {
  bounds: { width: number; height: number };
  symmetry: Symmetry;
  palette: Oklch[];
  elements: Element[];
}

export function validateRenderPlan(plan: RenderPlan): string[] {
  const errs: string[] = [];
  if (!plan.bounds || plan.bounds.width <= 0 || plan.bounds.height <= 0) {
    errs.push("bounds must be positive");
  }
  if (!Array.isArray(plan.palette) || plan.palette.length === 0) {
    errs.push("palette must be non-empty");
  }
  const n = plan.palette?.length ?? 0;
  plan.elements?.forEach((e, idx) => {
    if (e.points.length < 2) errs.push(`element ${idx}: needs >=2 points`);
    if (e.colorRef != null && (e.colorRef < 0 || e.colorRef >= n)) {
      errs.push(`element ${idx}: colorRef out of range`);
    }
    if (e.strokeRef != null && (e.strokeRef < 0 || e.strokeRef >= n)) {
      errs.push(`element ${idx}: strokeRef out of range`);
    }
  });
  return errs;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd toolkit && npx vitest run test/render-plan.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add toolkit/src/render-plan.ts toolkit/test/render-plan.test.ts
git commit -m "feat(toolkit): RenderPlan schema + validator"
```

---

### Task 3: Operator interface types

**Files:**
- Create: `toolkit/src/operators/types.ts`

(No test — pure type declarations consumed by Tasks 4–7.)

- [ ] **Step 1: Create the file**

```ts
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
```

- [ ] **Step 2: Typecheck**

Run: `cd toolkit && npx tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add toolkit/src/operators/types.ts
git commit -m "feat(toolkit): operator interface (measure/scoreAgainst)"
```

---

### Task 4: `symmetry` operator (continuous group fidelity)

**Files:**
- Create: `toolkit/src/operators/symmetry.ts`
- Test: `toolkit/test/operators/symmetry.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { symmetryOperator } from "../../src/operators/symmetry";
import type { RenderPlan, Vec2 } from "../../src/render-plan";

// A 6-fold-symmetric set of spokes about the centre.
function spokes(): RenderPlan {
  const c: Vec2 = [50, 50];
  const els = Array.from({ length: 6 }, (_, k) => {
    const a = (2 * Math.PI * k) / 6;
    const p: Vec2 = [c[0] + 40 * Math.cos(a), c[1] + 40 * Math.sin(a)];
    return { kind: "segment" as const, role: "line" as const, points: [c, p] };
  });
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", center: c, order: 6 },
    palette: [{ l: 0.5, c: 0.1, h: 200 }],
    elements: els,
  };
}

describe("symmetryOperator", () => {
  it("measures fidelity ~1 for a 6-fold-symmetric plan", () => {
    expect(symmetryOperator.measure(spokes()).value).toBeGreaterThan(0.99);
  });

  it("drops fidelity when points are jittered beyond tolerance", () => {
    const plan = spokes();
    const broken = {
      ...plan,
      elements: plan.elements.map((e, i) => ({
        ...e,
        points: e.points.map(([x, y]) => [x + (i % 2 ? 9 : -9), y + 7] as Vec2),
      })),
    };
    expect(symmetryOperator.measure(broken).value).toBeLessThan(0.5);
  });

  it("scores below target as a fix to increase symmetry", () => {
    const s = symmetryOperator.scoreAgainst({ value: 0.6 }, { minFidelity: 0.98 });
    expect(s.score).toBeLessThan(1);
    expect(s.fix).toMatchObject({ axis: "symmetry", direction: "increase" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd toolkit && npx vitest run test/operators/symmetry.test.ts`
Expected: FAIL — cannot resolve `symmetry`.

- [ ] **Step 3: Write the implementation**

```ts
import type { Element, RenderPlan, Vec2 } from "../render-plan";
import type { Measurement, Operator } from "./types";

function rotatePoint([x, y]: Vec2, [cx, cy]: Vec2, a: number): Vec2 {
  const dx = x - cx, dy = y - cy, c = Math.cos(a), s = Math.sin(a);
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

// Order-insensitive: every point in `a` has a unique nearest partner in `b`
// within eps.
function pointSetsMatch(a: Vec2[], b: Vec2[], eps: number): boolean {
  if (a.length !== b.length) return false;
  const used = new Array(b.length).fill(false);
  for (const pa of a) {
    let found = -1;
    for (let j = 0; j < b.length; j++) {
      if (!used[j] && Math.hypot(pa[0] - b[j][0], pa[1] - b[j][1]) <= eps) {
        found = j;
        break;
      }
    }
    if (found < 0) return false;
    used[found] = true;
  }
  return true;
}

export const symmetryOperator: Operator<{ minFidelity: number }> = {
  name: "symmetry",
  measure(plan: RenderPlan): Measurement {
    const order = plan.symmetry.order ?? 6;
    const center = plan.symmetry.center ?? [plan.bounds.width / 2, plan.bounds.height / 2];
    const eps = 1e-3 * Math.hypot(plan.bounds.width, plan.bounds.height);
    const els: Element[] = plan.elements.filter((e) => e.role !== "background");
    if (els.length === 0 || order < 2) return { value: 1 };
    let checks = 0, matches = 0;
    for (let k = 1; k < order; k++) {
      const angle = (2 * Math.PI * k) / order;
      for (const e of els) {
        checks++;
        const rotated = e.points.map((p) => rotatePoint(p, center, angle));
        if (els.some((o) => pointSetsMatch(rotated, o.points, eps))) matches++;
      }
    }
    return { value: checks === 0 ? 1 : matches / checks };
  },
  scoreAgainst(m, target) {
    const min = target.minFidelity;
    const score = Math.max(0, Math.min(1, m.value / min));
    const direction = m.value < min ? "increase" : "ok";
    return {
      score,
      fix: {
        axis: "symmetry",
        direction,
        detail:
          direction === "ok"
            ? "symmetry within tolerance"
            : `group fidelity ${m.value.toFixed(3)} below target ${min}`,
      },
    };
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd toolkit && npx vitest run test/operators/symmetry.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add toolkit/src/operators/symmetry.ts toolkit/test/operators/symmetry.test.ts
git commit -m "feat(toolkit): symmetry operator (continuous group fidelity)"
```

---

### Task 5: `complexity` operator (organized-richness proxy)

**Files:**
- Create: `toolkit/src/operators/complexity.ts`
- Test: `toolkit/test/operators/complexity.test.ts`

**Calibration constants (named, in the file):** `NBINS=12`, `MOTIF_REF=18`, `DENSITY_REF=110`, blend weights `0.34/0.33/0.33`. These are set so the default generator (Task 8, 78 line-elements / 13 motifs) lands `value≈0.74`, inside the profile band `[0.55, 0.78]`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { complexityOperator } from "../../src/operators/complexity";
import type { RenderPlan, Vec2 } from "../../src/render-plan";

function plan(nMotifs: number, nLines: number): RenderPlan {
  const elements = [];
  for (let i = 0; i < nLines; i++) {
    const a = (Math.PI * i) / nLines;
    const p: Vec2 = [50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)];
    elements.push({
      kind: "segment" as const,
      role: "line" as const,
      points: [[50, 50] as Vec2, p],
      motifId: `m-${i % nMotifs}`,
    });
  }
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", order: 6 },
    palette: [{ l: 0.5, c: 0.1, h: 200 }],
    elements,
  };
}

describe("complexityOperator", () => {
  it("reports higher value for richer plans", () => {
    const lo = complexityOperator.measure(plan(2, 6)).value;
    const hi = complexityOperator.measure(plan(13, 80)).value;
    expect(hi).toBeGreaterThan(lo);
  });

  it("scores in-band as ok, below-band as increase, above-band as decrease", () => {
    const band = { band: [0.55, 0.78] as [number, number], falloff: 0.25 };
    expect(complexityOperator.scoreAgainst({ value: 0.65 }, band).fix.direction).toBe("ok");
    expect(complexityOperator.scoreAgainst({ value: 0.2 }, band).fix.direction).toBe("increase");
    expect(complexityOperator.scoreAgainst({ value: 0.95 }, band).fix.direction).toBe("decrease");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd toolkit && npx vitest run test/operators/complexity.test.ts`
Expected: FAIL — cannot resolve `complexity`.

- [ ] **Step 3: Write the implementation**

```ts
import type { Element, RenderPlan } from "../render-plan";
import type { FixDirection, Measurement, Operator } from "./types";

const NBINS = 12;
const MOTIF_REF = 18;
const DENSITY_REF = 110;
const W_ANGLE = 0.34, W_MOTIF = 0.33, W_DENSITY = 0.33;

function orientationEntropy(lines: Element[]): number {
  const bins = new Array(NBINS).fill(0);
  let n = 0;
  for (const e of lines) {
    for (let i = 0; i + 1 < e.points.length; i++) {
      const [x0, y0] = e.points[i];
      const [x1, y1] = e.points[i + 1];
      let a = Math.atan2(y1 - y0, x1 - x0); // [-π, π]
      a = ((a % Math.PI) + Math.PI) % Math.PI; // fold to [0, π)
      const bin = Math.min(NBINS - 1, Math.floor((a / Math.PI) * NBINS));
      bins[bin]++;
      n++;
    }
  }
  if (n === 0) return 0;
  let h = 0;
  for (const c of bins) {
    if (c > 0) {
      const p = c / n;
      h -= p * Math.log(p);
    }
  }
  return h / Math.log(NBINS); // normalized 0..1
}

export const complexityOperator: Operator<{ band: [number, number]; falloff?: number }> = {
  name: "complexity",
  measure(plan: RenderPlan): Measurement {
    const lines = plan.elements.filter((e) => e.role === "line");
    const angleEntropy = orientationEntropy(lines);
    const motifs = new Set(
      plan.elements.filter((e) => e.role !== "background").map((e) => e.motifId ?? ""),
    ).size;
    const motifNorm = Math.min(1, motifs / MOTIF_REF);
    const densityNorm = Math.min(1, lines.length / DENSITY_REF);
    const value = W_ANGLE * angleEntropy + W_MOTIF * motifNorm + W_DENSITY * densityNorm;
    return { value, components: { angleEntropy, motifNorm, densityNorm, motifs, lineCount: lines.length } };
  },
  scoreAgainst(m, target) {
    const [lo, hi] = target.band;
    const falloff = target.falloff ?? 0.25;
    const v = m.value;
    let score: number;
    let direction: FixDirection;
    if (v >= lo && v <= hi) {
      score = 1;
      direction = "ok";
    } else if (v < lo) {
      score = Math.max(0, 1 - (lo - v) / falloff);
      direction = "increase";
    } else {
      score = Math.max(0, 1 - (v - hi) / falloff);
      direction = "decrease";
    }
    return {
      score,
      fix: {
        axis: "complexity",
        direction,
        detail:
          direction === "ok"
            ? `complexity ${v.toFixed(2)} in band`
            : `complexity ${v.toFixed(2)} → ${direction} toward [${lo}, ${hi}]`,
      },
    };
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd toolkit && npx vitest run test/operators/complexity.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add toolkit/src/operators/complexity.ts toolkit/test/operators/complexity.test.ts
git commit -m "feat(toolkit): complexity operator (organized-richness proxy)"
```

---

### Task 6: `colorChord` operator (OKLCH chord adherence)

**Files:**
- Create: `toolkit/src/operators/color-chord.ts`
- Test: `toolkit/test/operators/color-chord.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { colorChordOperator } from "../../src/operators/color-chord";
import type { RenderPlan, Oklch } from "../../src/render-plan";

function planWith(palette: Oklch[]): RenderPlan {
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", order: 6 },
    palette,
    elements: [],
  };
}

const target = { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 };

describe("colorChordOperator", () => {
  it("scores an on-arc blue chord with a near-white near 1", () => {
    const plan = planWith([
      { l: 0.45, c: 0.12, h: 240 },
      { l: 0.62, c: 0.11, h: 200 },
      { l: 0.95, c: 0.01, h: 200 }, // neutral white, hue-exempt
    ]);
    const m = colorChordOperator.measure(plan);
    expect(colorChordOperator.scoreAgainst(m, target).score).toBeGreaterThan(0.85);
  });

  it("scores an off-arc palette low and flags colorChord", () => {
    const plan = planWith([
      { l: 0.45, c: 0.15, h: 30 },
      { l: 0.62, c: 0.14, h: 110 },
      { l: 0.95, c: 0.12, h: 330 }, // chromatic, NOT hue-exempt
    ]);
    const m = colorChordOperator.measure(plan);
    const s = colorChordOperator.scoreAgainst(m, target);
    expect(s.score).toBeLessThan(0.6);
    expect(s.fix.axis).toBe("colorChord");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd toolkit && npx vitest run test/operators/color-chord.test.ts`
Expected: FAIL — cannot resolve `color-chord`.

- [ ] **Step 3: Write the implementation**

```ts
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
    if (pal.length === 0) {
      return { score: 0, fix: { axis: "colorChord", direction: "increase", detail: "empty palette" } };
    }
    const inArc = pal.filter((c) => c.c < CHROMA_NEUTRAL || hueInArc(c.h, t.hueArc.lo, t.hueArc.hi));
    const hueInRange = inArc.length / pal.length;
    const spreadScore = Math.min(1, m.lightnessSpread / t.minLightnessSpread);
    const value = 0.6 * hueInRange + 0.4 * spreadScore;
    const ok = value > 0.85;
    return {
      score: value,
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd toolkit && npx vitest run test/operators/color-chord.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add toolkit/src/operators/color-chord.ts toolkit/test/operators/color-chord.test.ts
git commit -m "feat(toolkit): colorChord operator (OKLCH chord adherence)"
```

---

### Task 7: Operator registry + composer

**Files:**
- Create: `toolkit/src/operators/index.ts`
- Create: `toolkit/src/profile.ts`
- Create: `toolkit/src/compose.ts`
- Test: `toolkit/test/compose.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import type { AestheticProfile } from "../src/profile";
import type { RenderPlan, Vec2 } from "../src/render-plan";

function symmetricPlan(): RenderPlan {
  const c: Vec2 = [50, 50];
  const els = Array.from({ length: 6 }, (_, k) => {
    const a = (2 * Math.PI * k) / 6;
    const p: Vec2 = [c[0] + 40 * Math.cos(a), c[1] + 40 * Math.sin(a)];
    return { kind: "segment" as const, role: "line" as const, points: [c, p], motifId: "spokes" };
  });
  return {
    bounds: { width: 100, height: 100 },
    symmetry: { group: "p6m", center: c, order: 6 },
    palette: [{ l: 0.3, c: 0.1, h: 240 }, { l: 0.9, c: 0.02, h: 200 }],
    elements: els,
  };
}

const profile: AestheticProfile = {
  medium: "test",
  operators: [
    { operator: "symmetry", weight: 0.5, target: { minFidelity: 0.98 } },
    { operator: "colorChord", weight: 0.5, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
};

describe("compose", () => {
  it("returns a weighted composite and per-operator scores", () => {
    const r = compose(symmetricPlan(), profile);
    expect(r.composite).toBeGreaterThan(0.8);
    expect(r.perOperator.map((p) => p.name).sort()).toEqual(["colorChord", "symmetry"]);
  });

  it("ranks fixes by impact = (1 - score) * weight, descending", () => {
    const broken = symmetricPlan();
    broken.elements = broken.elements.map((e) => ({ ...e, points: e.points.map(([x, y]) => [x + 9, y + 9] as Vec2) }));
    const r = compose(broken, profile);
    expect(r.fixes[0].axis).toBe("symmetry");
  });

  it("throws on an unknown operator", () => {
    expect(() => compose(symmetricPlan(), { medium: "x", operators: [{ operator: "nope", weight: 1, target: {} }] }))
      .toThrow(/Unknown operator/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd toolkit && npx vitest run test/compose.test.ts`
Expected: FAIL — cannot resolve `../src/compose`.

- [ ] **Step 3: Write `toolkit/src/operators/index.ts`**

```ts
import { symmetryOperator } from "./symmetry";
import { complexityOperator } from "./complexity";
import { colorChordOperator } from "./color-chord";
import type { Operator } from "./types";

export const operators: Record<string, Operator<any, any>> = {
  symmetry: symmetryOperator,
  complexity: complexityOperator,
  colorChord: colorChordOperator,
};
```

- [ ] **Step 4: Write `toolkit/src/profile.ts`**

```ts
export interface ProfileBinding {
  operator: string;
  weight: number;
  target: unknown;
}

export interface AestheticProfile {
  medium: string;
  operators: ProfileBinding[];
  calibration?: { references: string[]; notes: string };
}
```

- [ ] **Step 5: Write `toolkit/src/compose.ts`**

```ts
import { operators } from "./operators/index";
import type { Fix } from "./operators/types";
import type { AestheticProfile } from "./profile";
import type { RenderPlan } from "./render-plan";

export interface CompositionResult {
  composite: number;
  perOperator: { name: string; score: number; weight: number; fix: Fix }[];
  fixes: Fix[];
}

export function compose(plan: RenderPlan, profile: AestheticProfile): CompositionResult {
  const perOperator = profile.operators.map((b) => {
    const op = operators[b.operator];
    if (!op) throw new Error(`Unknown operator: ${b.operator}`);
    const m = op.measure(plan);
    const { score, fix } = op.scoreAgainst(m, b.target);
    return { name: b.operator, score, weight: b.weight, fix };
  });
  const wsum = perOperator.reduce((s, p) => s + p.weight, 0);
  const composite = wsum === 0 ? 0 : perOperator.reduce((s, p) => s + p.score * p.weight, 0) / wsum;
  const fixes = perOperator
    .filter((p) => p.fix.direction !== "ok")
    .sort((a, b) => (1 - b.score) * b.weight - (1 - a.score) * a.weight)
    .map((p) => p.fix);
  return { composite, perOperator, fixes };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd toolkit && npx vitest run test/compose.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add toolkit/src/operators/index.ts toolkit/src/profile.ts toolkit/src/compose.ts toolkit/test/compose.test.ts
git commit -m "feat(toolkit): operator registry + weighted composer"
```

---

### Task 8: Minimal 6-fold IGP generator

**Files:**
- Create: `toolkit/src/generators/igp.ts`
- Test: `toolkit/test/generators/igp.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { generateIgp, defaultIgpParams, SAMARKAND_PALETTE } from "../../src/generators/igp";
import { symmetryOperator } from "../../src/operators/symmetry";
import { validateRenderPlan } from "../../src/render-plan";

describe("generateIgp", () => {
  it("produces a valid plan", () => {
    expect(validateRenderPlan(generateIgp(defaultIgpParams()))).toEqual([]);
  });

  it("default params yield 78 line elements and 13 motifs", () => {
    const plan = generateIgp(defaultIgpParams());
    const lines = plan.elements.filter((e) => e.role === "line");
    const motifs = new Set(lines.map((e) => e.motifId)).size;
    expect(lines.length).toBe(78);
    expect(motifs).toBe(13);
  });

  it("is 6-fold-symmetric by construction", () => {
    expect(symmetryOperator.measure(generateIgp(defaultIgpParams())).value).toBeGreaterThan(0.99);
  });

  it("uses a blue palette within the turquoise→cobalt arc (white exempt)", () => {
    expect(SAMARKAND_PALETTE.every((c) => c.c < 0.03 || (c.h >= 180 && c.h <= 265))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd toolkit && npx vitest run test/generators/igp.test.ts`
Expected: FAIL — cannot resolve `igp`.

- [ ] **Step 3: Write the implementation**

```ts
import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";

export const SAMARKAND_PALETTE: Oklch[] = [
  { l: 0.45, c: 0.12, h: 240 }, // cobalt
  { l: 0.62, c: 0.11, h: 200 }, // turquoise
  { l: 0.72, c: 0.09, h: 190 }, // light turquoise
  { l: 0.95, c: 0.01, h: 200 }, // near-white (neutral; hue-exempt)
  { l: 0.30, c: 0.06, h: 250 }, // deep blue (background)
];

export interface IgpParams {
  bounds: { width: number; height: number };
  rings: number;
  ringSpacing: number;
  includeStars: boolean;
  palette: Oklch[];
}

export function defaultIgpParams(): IgpParams {
  return { bounds: { width: 800, height: 800 }, rings: 6, ringSpacing: 55, includeStars: true, palette: SAMARKAND_PALETTE };
}

export function generateIgp(params: IgpParams = defaultIgpParams()): RenderPlan {
  const { bounds, rings, ringSpacing, includeStars, palette } = params;
  const center: Vec2 = [bounds.width / 2, bounds.height / 2];
  const order = 6;
  const lineColors = Math.max(1, palette.length - 1); // reserve last index for background
  const elements: Element[] = [];

  // background (excluded from symmetry + complexity by role)
  elements.push({
    kind: "polygon",
    role: "background",
    points: [[0, 0], [bounds.width, 0], [bounds.width, bounds.height], [0, bounds.height]],
    colorRef: palette.length - 1,
  });

  const vertex = (r: number, k: number): Vec2 => {
    const a = (2 * Math.PI * k) / order;
    return [center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)];
  };

  for (let ring = 1; ring <= rings; ring++) {
    const r = ring * ringSpacing;
    const strokeRef = (ring - 1) % lineColors;
    // hexagon edges
    for (let k = 0; k < order; k++) {
      elements.push({ kind: "segment", role: "line", points: [vertex(r, k), vertex(r, (k + 1) % order)], strokeRef, motifId: `ring-${ring}` });
    }
    // star crossings (connect k to k+2)
    if (includeStars) {
      for (let k = 0; k < order; k++) {
        elements.push({ kind: "segment", role: "line", points: [vertex(r, k), vertex(r, (k + 2) % order)], strokeRef: (strokeRef + 1) % lineColors, motifId: `star-${ring}` });
      }
    }
  }

  // spokes from centre to outer ring
  for (let k = 0; k < order; k++) {
    elements.push({ kind: "segment", role: "line", points: [center, vertex(rings * ringSpacing, k)], strokeRef: 1 % lineColors, motifId: "spokes" });
  }

  return { bounds, symmetry: { group: "p6m", center, order }, palette, elements };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd toolkit && npx vitest run test/generators/igp.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add toolkit/src/generators/igp.ts toolkit/test/generators/igp.test.ts
git commit -m "feat(toolkit): minimal 6-fold IGP generator"
```

---

### Task 9: SVG renderer + sample script

**Files:**
- Create: `toolkit/src/renderers/svg.ts`
- Create: `toolkit/src/scripts/render-sample.ts`
- Test: `toolkit/test/renderers/svg.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { renderSvg } from "../../src/renderers/svg";
import { generateIgp, defaultIgpParams } from "../../src/generators/igp";

describe("renderSvg", () => {
  it("emits an svg with one line per line-element and a background rect", () => {
    const plan = generateIgp(defaultIgpParams());
    const svg = renderSvg(plan);
    expect(svg.startsWith("<svg")).toBe(true);
    expect((svg.match(/<line /g) ?? []).length).toBe(78);
    expect(svg.includes("<rect")).toBe(true);
    expect(svg.includes("#")).toBe(true); // culori produced hex colors
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd toolkit && npx vitest run test/renderers/svg.test.ts`
Expected: FAIL — cannot resolve `svg`.

- [ ] **Step 3: Write `toolkit/src/renderers/svg.ts`**

```ts
import { formatHex } from "culori";
import type { RenderPlan } from "../render-plan";

export function renderSvg(plan: RenderPlan): string {
  const hex = (i: number | undefined, fallback: string): string => {
    if (i == null) return fallback;
    const c = plan.palette[i];
    return formatHex({ mode: "oklch", l: c.l, c: c.c, h: c.h }) ?? fallback;
  };
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${plan.bounds.width}" height="${plan.bounds.height}" viewBox="0 0 ${plan.bounds.width} ${plan.bounds.height}">`,
  ];
  for (const e of plan.elements) {
    if (e.role === "background") {
      parts.push(`<rect width="${plan.bounds.width}" height="${plan.bounds.height}" fill="${hex(e.colorRef, "#0a1a2f")}"/>`);
    } else if (e.kind === "segment") {
      const [[x0, y0], [x1, y1]] = e.points;
      parts.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="1.5"/>`);
    } else {
      const pts = e.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
      parts.push(`<polygon points="${pts}" fill="${hex(e.colorRef, "none")}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="1.5"/>`);
    }
  }
  parts.push(`</svg>`);
  return parts.join("\n");
}
```

- [ ] **Step 4: Write `toolkit/src/scripts/render-sample.ts`**

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { generateIgp, defaultIgpParams } from "../generators/igp";
import { renderSvg } from "../renderers/svg";

mkdirSync("out", { recursive: true });
writeFileSync("out/sample.svg", renderSvg(generateIgp(defaultIgpParams())));
console.log("wrote out/sample.svg");
```

- [ ] **Step 5: Run test + render the sample**

Run: `cd toolkit && npx vitest run test/renderers/svg.test.ts && npm run render`
Expected: test PASS (1 test); `toolkit/out/sample.svg` written. Open it — confirm a blue 6-fold star pattern.

- [ ] **Step 6: Commit**

```bash
git add toolkit/src/renderers/svg.ts toolkit/src/scripts/render-sample.ts toolkit/test/renderers/svg.test.ts
git commit -m "feat(toolkit): SVG renderer + sample render script"
```

---

### Task 10: The Timurid IGP profile

**Files:**
- Create: `toolkit/src/profiles/timurid-igp.ts`

(Consumed by the acceptance test in Task 11; its discrimination there is the profile's test.)

- [ ] **Step 1: Create the file**

```ts
import type { AestheticProfile } from "../profile";

// Hand-set from the 9 Samarkand reference images. Tune via `npm run render`
// eyeball + the Task 11 acceptance test.
export const timuridIgpProfile: AestheticProfile = {
  medium: "timurid-igp",
  operators: [
    { operator: "symmetry", weight: 0.35, target: { minFidelity: 0.98 } },
    { operator: "complexity", weight: 0.35, target: { band: [0.55, 0.78], falloff: 0.25 } },
    { operator: "colorChord", weight: 0.30, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: {
    references: ["~/Downloads/blue tiles of samarkand/*"],
    notes: "9 reference images; targets hand-set, validated by good-vs-degraded ranking + render eyeball",
  },
};
```

- [ ] **Step 2: Typecheck**

Run: `cd toolkit && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add toolkit/src/profiles/timurid-igp.ts
git commit -m "feat(toolkit): timurid-igp aesthetic profile"
```

---

### Task 11: Acceptance test — good outranks degraded (the spine proof)

**Files:**
- Test: `toolkit/test/acceptance.test.ts`

- [ ] **Step 1: Write the acceptance test**

```ts
import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { generateIgp, defaultIgpParams } from "../src/generators/igp";
import { timuridIgpProfile } from "../src/profiles/timurid-igp";
import type { Oklch, RenderPlan, Vec2 } from "../src/render-plan";

// Deterministic jitter (no RNG dependency).
function jitter(plan: RenderPlan, mag: number): RenderPlan {
  let i = 0;
  const h = () => {
    const s = Math.sin(++i * 12.9898) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };
  return {
    ...plan,
    elements: plan.elements.map((e) =>
      e.role === "background" ? e : { ...e, points: e.points.map(([x, y]) => [x + h() * mag, y + h() * mag] as Vec2) },
    ),
  };
}

const OFF_ARC: Oklch[] = [
  { l: 0.45, c: 0.15, h: 30 },
  { l: 0.62, c: 0.14, h: 110 },
  { l: 0.72, c: 0.12, h: 330 },
  { l: 0.95, c: 0.12, h: 30 }, // chromatic white → NOT hue-exempt
  { l: 0.30, c: 0.10, h: 120 },
];

const good = generateIgp(defaultIgpParams());
const goodResult = compose(good, timuridIgpProfile);
const opScore = (r: ReturnType<typeof compose>, name: string) =>
  r.perOperator.find((p) => p.name === name)!.score;

describe("operator-composition spine (acceptance)", () => {
  it("the good plan scores high overall", () => {
    expect(goodResult.composite).toBeGreaterThan(0.7);
  });

  it("ranks good above broken-symmetry and the top fix is symmetry", () => {
    const r = compose(jitter(good, 8), timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(opScore(r, "symmetry")).toBeLessThan(opScore(goodResult, "symmetry"));
    expect(r.fixes[0].axis).toBe("symmetry");
  });

  it("ranks good above under-dense and flags complexity:increase", () => {
    const sparse = generateIgp({ ...defaultIgpParams(), rings: 1, includeStars: false });
    const r = compose(sparse, timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "complexity" && f.direction === "increase")).toBe(true);
  });

  it("ranks good above over-dense and flags complexity:decrease", () => {
    const dense = generateIgp({ ...defaultIgpParams(), rings: 14 });
    const r = compose(dense, timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "complexity" && f.direction === "decrease")).toBe(true);
  });

  it("ranks good above wrong-chord and flags colorChord", () => {
    const offChord = { ...good, palette: OFF_ARC };
    const r = compose(offChord, timuridIgpProfile);
    expect(goodResult.composite).toBeGreaterThan(r.composite);
    expect(r.fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the acceptance test**

Run: `cd toolkit && npx vitest run test/acceptance.test.ts`
Expected: PASS (5 tests).

> **If a discrimination assertion fails**, the failing operator's measured value vs its profile target is the signal. Tune ONLY the relevant named knob and re-run:
> - symmetry fails → `minFidelity` (profile) or `eps` factor (symmetry.ts).
> - complexity good-not-in-band → `band`/`falloff` (profile) or `MOTIF_REF`/`DENSITY_REF` (complexity.ts) so the default generator's value lands ~0.74.
> - colorChord fails → `hueArc`/`minLightnessSpread` (profile) or `CHROMA_NEUTRAL` (color-chord.ts).
> This is the calibration loop; it adjusts constants, never test expectations.

- [ ] **Step 3: Run the full suite + typecheck**

Run: `cd toolkit && npm test && npm run typecheck`
Expected: all tests PASS; tsc clean.

- [ ] **Step 4: Commit**

```bash
git add toolkit/test/acceptance.test.ts
git commit -m "test(toolkit): acceptance — good plan outranks degraded variants"
```

---

### Task 12: Wiki write-back + registry re-score

**Files:**
- Modify: `wiki/concepts/Islamic Geometric Patterns and the Polygonal Technique.md`
- Modify: `wiki/meta/Operational Readiness Registry.md`

> Use the `claude-obsidian:*` skills / `mcp__obsidian-vault__*` tools for vault edits per project convention. Numbers below come from the Task 11 run.

- [ ] **Step 1: Add an aesthetic-profile binding section to the IGP page**

Append a section that records the `timurid-igp` profile (operators + weights + targets) and links each operator to its `toolkit/src/operators/*` implementation. State explicitly: the page now *composes* its Evaluate capability from operators rather than carrying a bespoke metric (per `feedback_cross-domain-composition.md`).

- [ ] **Step 2: Re-score the IGP row in the registry**

Update the `Islamic Geometric Patterns and the Polygonal Technique` row in `wiki/meta/Operational Readiness Registry.md`: Evaluate rises from 0 (it now composes symmetry+complexity+color via the profile/composer). Bump `updated:` and add a note that the score reflects composition, not in-page machinery.

- [ ] **Step 3: Commit (only the non-`wiki/` change; the wiki hook auto-commits `wiki/`)**

```bash
git add "wiki/concepts/Islamic Geometric Patterns and the Polygonal Technique.md" "wiki/meta/Operational Readiness Registry.md"
git commit -m "wiki: bind IGP page to toolkit operators; re-score registry"
```

(If the wiki auto-commit hook already committed these, this step is a no-op — confirm with `git status`.)

---

## Self-review

**Spec coverage:**
- render-plan schema → Task 2 ✓
- 3 operators (symmetry/complexity/colorChord) → Tasks 4/5/6 ✓
- profile schema + timurid profile → Tasks 7/10 ✓
- composer → Task 7 ✓
- minimal 6-fold IGP generator → Task 8 ✓
- SVG renderer (calibration) → Task 9 ✓
- deterministic good-vs-degraded acceptance test → Task 11 ✓
- "operators measure, profiles set targets" → enforced by `Operator` interface (Task 3) + colorChord generic payload ✓
- wiki write-back / registry re-score → Task 12 ✓
- Non-goals (external images, animation, WebGPU, VLM-in-loop) → not built ✓

**Open questions carried (resolve during impl, do not block):** O1 schema completeness (watch for a field an operator wants but the plan lacks), O2 `eps` factor, O3 whether `angleEntropy` should be symmetry-quotiented, O4 whether the weighted sum mis-ranks (would force the organized-complexity composite operator sooner).

**Type consistency:** `RenderPlan`/`Element`/`Vec2`/`Oklch` (Task 2) used identically in 4–11; `Operator`/`Measurement`/`Fix`/`FixDirection`/`OperatorScore` (Task 3) used in 4–7; `compose`/`CompositionResult` (Task 7) used in 11; `generateIgp`/`defaultIgpParams`/`SAMARKAND_PALETTE` (Task 8) used in 9/11; `timuridIgpProfile` (Task 10) used in 11. Operator names `"symmetry"`/`"complexity"`/`"colorChord"` consistent across registry, profile, and assertions.

**Placeholder scan:** no TBD/TODO; every code step shows complete code; the one iterative step (Task 11 calibration) names exact knobs + signal rather than "adjust as needed".
