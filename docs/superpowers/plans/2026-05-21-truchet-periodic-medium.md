# Truchet Periodic Medium — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a wall-to-wall Truchet tile medium to the toolkit — a periodic tessellation that fills the canvas — proving the operator/composer/improve spine is medium-agnostic by adding one new `periodicity` operator and reusing everything else.

**Architecture:** A `generateTruchet` generator emits a square grid of cells (each = one `tile` square + two `path` arc polylines). A new `periodicity` operator measures translational self-similarity on the cell frames (rotation-blind). The `truchet` profile binds periodicity + the reused constructionGrammar/lineContinuity/colorChord. `compose.ts`, `improve.ts`, `tuning.ts` are untouched.

**Tech Stack:** TypeScript (ESM, `moduleResolution: Bundler`), vitest, tsx, culori. No new deps.

**Spec:** `docs/superpowers/specs/2026-05-21-truchet-periodic-medium-design.md`

**Working dir:** all `npm`/`npx` commands run from `cd /Users/ag/Lab/VisualThinking/toolkit`; all `git` from `cd /Users/ag/Lab/VisualThinking`. Bash cwd resets between calls — always prefix with the right `cd`.

**Key facts verified from the existing code:**
- `Element.kind` already includes `"path"`; `Element.role` is `"line" | "tile" | "background"`; `Symmetry.lattice?: [Vec2, Vec2]` already exists.
- `geom.ts` exports `centroid`, `scaleAbout`, `polyArea`.
- `lineContinuity` reads each `line`-role element's first & last point; `constructionGrammar` sums `tile` areas ÷ `region` area; `colorChord` scores `plan.palette` (independent of element colorRefs).
- `SAMARKAND_PALETTE` (5 OKLCH colors, on-arc) and `OFF_ARC` are exported from `generators/igp.ts` and `variants.ts` respectively.
- The composer ranks `fixes` by `(1-score)·weight` descending; `improve` acts on the worst-weighted *actionable* fix.

**Cliff-knob reasoning (why coarse steps, no probe needed):** with `eps = 1e-3·diag ≈ 1.13px`, any `latticeJitter > ~0.011` displaces cell centroids past `eps`, so periodicity collapses to ~0 and stays there until jitter returns near 0 — a fine step yields no gain and trips the revert guard. Same for `arcGap`: any gap retracting endpoints past the 1px snap breaks continuity. So both knobs use a coarse step equal to their max (one move to 0). This mirrors the `segmentScale` lesson from the close-the-loop slice.

---

## File Structure

**New:**
- `src/operators/periodicity.ts` — translational self-match operator.
- `src/generators/truchet.ts` — generator + `TruchetParams` + `defaultTruchetParams`.
- `src/profiles/truchet.ts` — `truchetProfile`.
- `src/tuning/truchet.ts` — `truchetTuning`.
- `test/operators/periodicity.test.ts`, `test/generators/truchet.test.ts`, `test/acceptance-truchet.test.ts`.

**Modified:**
- `src/operators/index.ts` — register `periodicity`.
- `src/renderers/svg.ts` — add `kind:"path"` → `<polyline>` branch.
- `src/variants.ts` — `truchetGood` + `truchetVariants`.
- `src/scripts/render-gallery.ts` — add Truchet scorecard + improvement groups.
- `README.md` — document the medium + periodicity + the medium-agnostic finding.

**Untouched (the proof):** `src/compose.ts`, `src/improve.ts`, `src/tuning.ts`, `src/profile.ts`, all other operators.

---

## Task 1: `periodicity` operator + register

**Files:**
- Create: `src/operators/periodicity.ts`
- Modify: `src/operators/index.ts`
- Test: `test/operators/periodicity.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/operators/periodicity.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { periodicityOperator } from "../../src/operators/periodicity";
import type { Element, Oklch, RenderPlan, Vec2 } from "../../src/render-plan";

const PAL: Oklch[] = [{ l: 0.5, c: 0.1, h: 200 }];
const sq = (ox: number, oy: number): Vec2[] => [[ox, oy], [ox + 100, oy], [ox + 100, oy + 100], [ox, oy + 100]];
function plan(tiles: Vec2[][], lattice?: [Vec2, Vec2], extra: Element[] = []): RenderPlan {
  const els: Element[] = tiles.map((points) => ({ kind: "polygon", role: "tile", points }));
  return { bounds: { width: 200, height: 100 }, symmetry: { group: "p4", lattice }, palette: PAL, elements: [...els, ...extra] };
}

describe("periodicity", () => {
  it("scores a clean lattice 1.0", () => {
    expect(periodicityOperator.measure(plan([sq(0, 0), sq(100, 0)], [[100, 0], [0, 100]])).value).toBe(1);
  });

  it("drops below 1 and asks to increase when a cell is off-lattice", () => {
    const m = periodicityOperator.measure(plan([sq(0, 0), sq(150, 0)], [[100, 0], [0, 100]]));
    expect(m.value).toBeLessThan(1);
    const s = periodicityOperator.scoreAgainst(m, { minFidelity: 0.95 });
    expect(s.fix.axis).toBe("periodicity");
    expect(s.fix.direction).toBe("increase");
  });

  it("returns 1.0 when no lattice is declared", () => {
    expect(periodicityOperator.measure(plan([sq(0, 0)], undefined)).value).toBe(1);
  });

  it("ignores arc rotation (matches on tile frames only)", () => {
    const base = plan([sq(0, 0), sq(100, 0)], [[100, 0], [0, 100]]);
    const withArc = plan([sq(0, 0), sq(100, 0)], [[100, 0], [0, 100]], [{ kind: "path", role: "line", points: [[0, 0], [50, 50]] }]);
    expect(periodicityOperator.measure(withArc).value).toBe(periodicityOperator.measure(base).value);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/operators/periodicity.test.ts`
Expected: FAIL — `Cannot find module '../../src/operators/periodicity'`.

- [ ] **Step 3: Implement `src/operators/periodicity.ts`**

```ts
import type { RenderPlan, Vec2 } from "../render-plan";
import type { Measurement, Operator } from "./types";
import { centroid } from "../geom";

// Translational self-similarity: shift the cell frames by each lattice vector and
// count how many land on an existing cell frame. Matches on `tile` centroids only,
// so per-cell motif rotation does not affect the score — a clean lattice is ~1.0
// regardless of how varied the tiles are; corruption of the lattice drops it.
export const periodicityOperator: Operator<{ minFidelity: number }> = {
  name: "periodicity",
  measure(plan: RenderPlan): Measurement {
    const lattice = plan.symmetry.lattice;
    const cents = plan.elements.filter((e) => e.role === "tile").map((t) => centroid(t.points));
    if (!lattice || cents.length === 0) return { value: 1, components: { matches: 0, targets: 0 } };
    const eps = 1e-3 * Math.hypot(plan.bounds.width, plan.bounds.height);
    const inBounds = (p: Vec2) => p[0] >= 0 && p[0] <= plan.bounds.width && p[1] >= 0 && p[1] <= plan.bounds.height;
    let targets = 0;
    let matches = 0;
    for (const v of lattice) {
      for (const c of cents) {
        const t: Vec2 = [c[0] + v[0], c[1] + v[1]];
        if (!inBounds(t)) continue;
        targets++;
        if (cents.some((o) => Math.hypot(o[0] - t[0], o[1] - t[1]) <= eps)) matches++;
      }
    }
    return { value: targets === 0 ? 1 : matches / targets, components: { matches, targets } };
  },
  scoreAgainst(m, target) {
    const min = target.minFidelity;
    const score = Math.max(0, Math.min(1, m.value / min));
    const direction = m.value < min ? "increase" : "ok";
    return {
      score,
      measured: m.value,
      target: `≥${min}`,
      rule: "floor — higher is better (pattern repeats under lattice translation)",
      fix: {
        axis: "periodicity",
        direction,
        detail:
          direction === "ok"
            ? `lattice fidelity ${m.value.toFixed(3)} — pattern tiles cleanly`
            : `lattice fidelity ${m.value.toFixed(3)} below ${min} — cells drift off the grid`,
      },
    };
  },
};
```

- [ ] **Step 4: Register it — edit `src/operators/index.ts`**

Add the import and the registry entry:

```ts
import { periodicityOperator } from "./periodicity";
```

and inside the `operators` object, add:

```ts
  periodicity: periodicityOperator,
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/operators/periodicity.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/operators/periodicity.ts toolkit/src/operators/index.ts toolkit/test/operators/periodicity.test.ts && git commit -m "$(cat <<'EOF'
toolkit: add periodicity operator (translational lattice self-match)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: SVG `path` → `<polyline>` branch

**Files:**
- Modify: `src/renderers/svg.ts`
- Test: `test/renderers/svg.test.ts` (append)

- [ ] **Step 1: Write the failing test (append to `test/renderers/svg.test.ts`)**

Add at the end of the file:

```ts
import { renderSvg as renderSvgPath } from "../../src/renderers/svg";
import type { RenderPlan as RP } from "../../src/render-plan";

describe("renderSvg path elements", () => {
  it("renders a path as an unfilled stroked polyline", () => {
    const plan: RP = {
      bounds: { width: 100, height: 100 },
      symmetry: { group: "p4" },
      palette: [{ l: 0.9, c: 0.01, h: 200 }],
      elements: [{ kind: "path", role: "line", points: [[0, 0], [50, 50], [100, 0]], strokeRef: 0 }],
    };
    const svg = renderSvgPath(plan);
    expect(svg).toContain("<polyline");
    expect(svg).toContain('fill="none"');
    expect(svg).not.toContain("<polygon");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/renderers/svg.test.ts`
Expected: FAIL — the path currently renders as `<polygon>` (the `else` branch), so `not.toContain("<polygon")` fails (and `<polyline` is absent).

- [ ] **Step 3: Add the `path` branch in `src/renderers/svg.ts`**

In the element loop, change the trailing `else` so `path` is handled before the polygon fallback. Replace:

```ts
    } else if (e.kind === "segment") {
      const [[x0, y0], [x1, y1]] = e.points;
      parts.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="1.5"/>`);
    } else {
      const pts = e.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
      const sw = e.channel ?? 1.5; // cuerda-seca channel rendered as the cream stroke
      parts.push(`<polygon points="${pts}" fill="${hex(e.colorRef, "none")}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="${sw.toFixed(2)}"/>`);
    }
```

with:

```ts
    } else if (e.kind === "segment") {
      const [[x0, y0], [x1, y1]] = e.points;
      parts.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="1.5"/>`);
    } else if (e.kind === "path") {
      const pts = e.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
      parts.push(`<polyline points="${pts}" fill="none" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="1.5"/>`);
    } else {
      const pts = e.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
      const sw = e.channel ?? 1.5; // cuerda-seca channel rendered as the cream stroke
      parts.push(`<polygon points="${pts}" fill="${hex(e.colorRef, "none")}" stroke="${hex(e.strokeRef, "#ffffff")}" stroke-width="${sw.toFixed(2)}"/>`);
    }
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/renderers/svg.test.ts`
Expected: PASS (existing svg tests + the new one).

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/renderers/svg.ts toolkit/test/renderers/svg.test.ts && git commit -m "$(cat <<'EOF'
toolkit: render path elements as unfilled polylines (for arc tiles)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `generateTruchet` generator

**Files:**
- Create: `src/generators/truchet.ts`
- Test: `test/generators/truchet.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/generators/truchet.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateTruchet, defaultTruchetParams } from "../../src/generators/truchet";
import { validateRenderPlan } from "../../src/render-plan";

describe("generateTruchet", () => {
  it("emits gridSize^2 tiles, 2 arcs per cell, a background, and a valid plan", () => {
    const p = generateTruchet(defaultTruchetParams());
    expect(p.elements.filter((e) => e.role === "tile").length).toBe(64); // 8x8
    expect(p.elements.filter((e) => e.role === "line" && e.kind === "path").length).toBe(128); // 2 per cell
    expect(p.elements.some((e) => e.role === "background")).toBe(true);
    expect(validateRenderPlan(p)).toEqual([]);
  });

  it("declares the lattice and the canvas region", () => {
    const p = generateTruchet(defaultTruchetParams());
    expect(p.symmetry.lattice).toEqual([[100, 0], [0, 100]]); // 800 / 8
    expect(p.region).toEqual([[0, 0], [800, 0], [800, 800], [0, 800]]);
  });

  it("is deterministic for a fixed seed", () => {
    expect(JSON.stringify(generateTruchet(defaultTruchetParams()))).toBe(JSON.stringify(generateTruchet(defaultTruchetParams())));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/generators/truchet.test.ts`
Expected: FAIL — `Cannot find module '../../src/generators/truchet'`.

- [ ] **Step 3: Implement `src/generators/truchet.ts`**

```ts
import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";
import { centroid, scaleAbout } from "../geom";
import { SAMARKAND_PALETTE } from "./igp";

export interface TruchetParams {
  bounds: { width: number; height: number };
  gridSize: number; // cells per side
  cellScale: number; // 1 = squares tile exactly; <1 gaps, >1 overlap (drives constructionGrammar)
  latticeJitter: number; // 0 = clean grid; >0 drifts each cell off its lattice point (drives periodicity)
  arcGap: number; // 0 = arcs meet at edge midpoints; >0 retracts arc endpoints inward (drives lineContinuity)
  arcSteps: number; // polyline points per quarter arc
  palette: Oklch[];
  rngSeed: number;
}

export function defaultTruchetParams(): TruchetParams {
  return { bounds: { width: 800, height: 800 }, gridSize: 8, cellScale: 1, latticeJitter: 0, arcGap: 0, arcSteps: 10, palette: SAMARKAND_PALETTE, rngSeed: 1 };
}

// Deterministic per-cell hash in [0, 1).
function hash(i: number, j: number, seed: number): number {
  const s = Math.sin(i * 73.13 + j * 914.7 + seed * 131.7) * 43758.5453;
  return s - Math.floor(s);
}

// A quarter arc as an (steps+1)-point polyline. gap retracts both endpoints
// symmetrically inward along the arc (breaking the join with neighbours).
function arcPolyline(cx: number, cy: number, r: number, a0: number, a1: number, steps: number, gap: number): Vec2[] {
  const span = a1 - a0;
  const s0 = a0 + gap * 0.5 * span;
  const s1 = a1 - gap * 0.5 * span;
  const pts: Vec2[] = [];
  for (let k = 0; k <= steps; k++) {
    const a = s0 + (s1 - s0) * (k / steps);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

export function generateTruchet(params: TruchetParams = defaultTruchetParams()): RenderPlan {
  const { bounds, gridSize, cellScale, latticeJitter, arcGap, arcSteps, palette, rngSeed } = params;
  const cw = bounds.width / gridSize;
  const ch = bounds.height / gridSize;
  const r = cw / 2;
  const bgIdx = palette.length - 1;
  const lineIdx = Math.max(0, palette.length - 2); // near-white neutral
  const fillCount = Math.max(1, palette.length - 2);
  const elements: Element[] = [
    { kind: "polygon", role: "background", points: [[0, 0], [bounds.width, 0], [bounds.width, bounds.height], [0, bounds.height]], colorRef: bgIdx },
  ];

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      const ox = i * cw;
      const oy = j * ch;
      const jx = (hash(i, j, rngSeed + 7) * 2 - 1) * latticeJitter * cw;
      const jy = (hash(i, j, rngSeed + 13) * 2 - 1) * latticeJitter * cw;
      const off = (p: Vec2): Vec2 => [p[0] + jx, p[1] + jy];

      const square: Vec2[] = [[ox, oy], [ox + cw, oy], [ox + cw, oy + ch], [ox, oy + ch]];
      const scaled = scaleAbout(square, centroid(square), cellScale).map(off);
      elements.push({ kind: "polygon", role: "tile", points: scaled, colorRef: Math.floor(hash(i, j, rngSeed + 3) * fillCount) % fillCount, motifId: `cell-${i}-${j}` });

      // Two quarter-arc configs (centres at opposite corners), chosen per cell.
      const config = hash(i, j, rngSeed) < 0.5 ? 0 : 1;
      const arcs: [number, number, number, number][] = config === 0
        ? [[ox, oy, 0, Math.PI / 2], [ox + cw, oy + ch, Math.PI, 1.5 * Math.PI]] // TL, BR
        : [[ox + cw, oy, Math.PI / 2, Math.PI], [ox, oy + ch, 1.5 * Math.PI, 2 * Math.PI]]; // TR, BL
      for (const [acx, acy, a0, a1] of arcs) {
        elements.push({ kind: "path", role: "line", points: arcPolyline(acx, acy, r, a0, a1, arcSteps, arcGap).map(off), strokeRef: lineIdx, motifId: `arc-${i}-${j}` });
      }
    }
  }

  const region: Vec2[] = [[0, 0], [bounds.width, 0], [bounds.width, bounds.height], [0, bounds.height]];
  return { bounds, symmetry: { group: "p4", lattice: [[cw, 0], [0, ch]], center: [bounds.width / 2, bounds.height / 2], order: 4 }, palette, elements, region };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/generators/truchet.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/generators/truchet.ts toolkit/test/generators/truchet.test.ts && git commit -m "$(cat <<'EOF'
toolkit: add Truchet generator (periodic arc-tile grid)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Profile, tuning map, variants (+ calibrate the continuity floor)

**Files:**
- Create: `src/profiles/truchet.ts`, `src/tuning/truchet.ts`
- Modify: `src/variants.ts`

- [ ] **Step 1: Probe the clean Truchet's per-operator scores**

Run:

```bash
cd /Users/ag/Lab/VisualThinking/toolkit && npx tsx -e '
import { compose } from "./src/compose";
import { generateTruchet, defaultTruchetParams } from "./src/generators/truchet";
const ops = ["periodicity","constructionGrammar","lineContinuity","colorChord"];
const tmp = { medium:"probe", operators: [
  {operator:"periodicity",weight:1,target:{minFidelity:0.95}},
  {operator:"constructionGrammar",weight:1,target:{band:[0.95,1.05],falloff:0.2}},
  {operator:"lineContinuity",weight:1,target:{minContinuity:0.01}},
  {operator:"colorChord",weight:1,target:{hueArc:{lo:180,hi:265},minLightnessSpread:0.45}},
]};
const r = compose(generateTruchet(defaultTruchetParams()), tmp as any);
for (const p of r.perOperator) console.log(p.name.padEnd(20), "measured", p.measured.toFixed(3));
'
```

Read the printed `lineContinuity measured` value. **Set `minContinuity` in Step 2 to `(that value − 0.05)`, rounded to 2 decimals, but not below 0.40.** (Example: if measured 0.62 → floor 0.57.) This guarantees the clean pattern scores 1.0 on continuity while the `disconnected-arcs` variant — whose continuity collapses to ~0 — scores 0. Record the value you used in a comment in the profile.

- [ ] **Step 2: Create `src/profiles/truchet.ts`**

(Replace `<MINCONT>` with the calibrated number from Step 1.)

```ts
import type { AestheticProfile } from "../profile";

// Truchet (wall-to-wall arc tiles). periodicity REPLACES symmetry here: the
// invariance is translation by the lattice, not rotation about a centre.
// constructionGrammar/lineContinuity/colorChord are reused unchanged.
export const truchetProfile: AestheticProfile = {
  medium: "truchet",
  operators: [
    { operator: "periodicity", weight: 0.30, target: { minFidelity: 0.95 } },
    { operator: "constructionGrammar", weight: 0.25, target: { band: [0.95, 1.05], falloff: 0.2 } },
    { operator: "lineContinuity", weight: 0.25, target: { minContinuity: <MINCONT> } }, // calibrated: clean ≈ <probed> − 0.05
    { operator: "colorChord", weight: 0.20, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: { references: [], notes: "Truchet: lattice periodicity + canvas coverage + arc continuity + chord" },
};
```

- [ ] **Step 3: Create `src/tuning/truchet.ts`**

```ts
import type { TuningMap } from "../tuning";

// Both new knobs are cliff knobs (continuity/periodicity collapse past a tiny
// displacement and only recover near 0), so they use a coarse step = max to
// cross the discontinuity in one move — same shape as the segmentScale lesson.
export const truchetTuning: TuningMap = {
  periodicity: { param: "latticeJitter", kind: "num", step: 0.4, min: 0, max: 0.4, invert: true }, // less jitter → more periodic
  constructionGrammar: { param: "cellScale", kind: "num", step: 0.03, min: 0.85, max: 1.15 },
  lineContinuity: { param: "arcGap", kind: "num", step: 0.5, min: 0, max: 0.5, invert: true }, // less gap → more continuity
};
```

- [ ] **Step 4: Add Truchet variants — edit `src/variants.ts`**

Add the import at the top (next to the other generator imports):

```ts
import { generateTruchet, defaultTruchetParams } from "./generators/truchet";
```

and append at the end of the file:

```ts
export function truchetGood(): RenderPlan {
  return generateTruchet(defaultTruchetParams());
}

// Truchet (wall-to-wall) deliberate failures, one per profile axis. Note
// broken-lattice degrades BOTH periodicity and lineContinuity (moving cells
// pulls their arcs off neighbours) — periodicity has the higher weight so it
// stays the top fix; the coupling is benign (one knob heals both).
export function truchetVariants(): Variant[] {
  const d = defaultTruchetParams();
  return [
    { label: "broken-lattice", description: "cells jittered off the grid (latticeJitter 0.25)", plan: generateTruchet({ ...d, latticeJitter: 0.25 }) },
    { label: "gappy-grid", description: "cells scaled 0.8 (gaps)", plan: generateTruchet({ ...d, cellScale: 0.8 }) },
    { label: "disconnected-arcs", description: "arcs retracted from edges (arcGap 0.4)", plan: generateTruchet({ ...d, arcGap: 0.4 }) },
    { label: "wrong-chord", description: "off-arc (warm) palette", plan: { ...truchetGood(), palette: OFF_ARC } },
  ];
}
```

- [ ] **Step 5: Typecheck**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm run typecheck`
Expected: clean (exit 0). If it errors on `<MINCONT>`, you forgot to substitute the calibrated number in Step 2.

- [ ] **Step 6: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/profiles/truchet.ts toolkit/src/tuning/truchet.ts toolkit/src/variants.ts && git commit -m "$(cat <<'EOF'
toolkit: add truchet profile + tuning map + variants (continuity floor calibrated)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Acceptance + improve tests

**Files:**
- Create: `test/acceptance-truchet.test.ts`

- [ ] **Step 1: Write the test**

Create `test/acceptance-truchet.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { improve } from "../src/improve";
import { generateTruchet, defaultTruchetParams } from "../src/generators/truchet";
import { truchetProfile } from "../src/profiles/truchet";
import { truchetTuning } from "../src/tuning/truchet";
import { truchetGood, truchetVariants } from "../src/variants";

const goodR = compose(truchetGood(), truchetProfile);
const v = Object.fromEntries(truchetVariants().map((x) => [x.label, compose(x.plan, truchetProfile)]));

describe("truchet acceptance", () => {
  it("the clean pattern scores high", () => {
    expect(goodR.composite).toBeGreaterThanOrEqual(0.9);
  });

  it("good outranks every deliberate failure", () => {
    for (const k of Object.keys(v)) expect(goodR.composite).toBeGreaterThan(v[k].composite);
  });

  it("broken-lattice: periodicity is the top fix", () => {
    expect(v["broken-lattice"].fixes[0].axis).toBe("periodicity");
  });

  it("gappy-grid flags constructionGrammar", () => {
    expect(v["gappy-grid"].fixes.some((f) => f.axis === "constructionGrammar")).toBe(true);
  });

  it("disconnected-arcs flags lineContinuity", () => {
    expect(v["disconnected-arcs"].fixes.some((f) => f.axis === "lineContinuity")).toBe(true);
  });

  it("wrong-chord flags colorChord", () => {
    expect(v["wrong-chord"].fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});

describe("truchet improve (loop generalizes to a new medium)", () => {
  const start = { ...defaultTruchetParams(), latticeJitter: 0.2, cellScale: 0.85 };

  it("recovers a degraded grid to target, touching periodicity then constructionGrammar", () => {
    const startScore = compose(generateTruchet(start), truchetProfile).composite;
    const r = improve(generateTruchet, start, truchetProfile, truchetTuning);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    expect(r.finalScore).toBeGreaterThan(startScore);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("periodicity");
    expect(axes).toContain("constructionGrammar");
  });

  it("climbs monotonically", () => {
    const r = improve(generateTruchet, start, truchetProfile, truchetTuning, { targetComposite: 0.99 });
    for (const s of r.trajectory) expect(s.compositeAfter).toBeGreaterThan(s.compositeBefore);
  });
});
```

- [ ] **Step 2: Run the test**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/acceptance-truchet.test.ts`
Expected: PASS (8 tests). If `broken-lattice` top fix is not `periodicity`, check that periodicity's weight (0.30) exceeds lineContinuity's (0.25) in the profile — both collapse under jitter, and the higher weight must win the ranking.

- [ ] **Step 3: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/test/acceptance-truchet.test.ts && git commit -m "$(cat <<'EOF'
toolkit: acceptance + improve tests for the truchet medium

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Gallery groups

**Files:**
- Modify: `src/scripts/render-gallery.ts`

- [ ] **Step 1: Add Truchet imports**

In `src/scripts/render-gallery.ts`, add to the import block:

```ts
import { truchetProfile } from "../profiles/truchet";
import { truchetTuning } from "../tuning/truchet";
import { generateTruchet, defaultTruchetParams } from "../generators/truchet";
import { truchetGood, truchetVariants } from "../variants";
```

- [ ] **Step 2: Build the two Truchet groups and add them to the output**

After the existing `improveTiling` definition, add:

```ts
const truchet: GalleryGroup = {
  title: "Truchet (wall-to-wall)",
  entries: [
    entry("GOOD (target)", "default 8×8 periodic grid", truchetGood(), truchetProfile),
    ...truchetVariants().map((x) => entry(x.label, x.description, x.plan, truchetProfile)),
  ],
};

const improveTruchet = improvementGroup(
  "Improvement — truchet (improve() on a new medium)",
  generateTruchet,
  { ...defaultTruchetParams(), latticeJitter: 0.2, cellScale: 0.85 },
  truchetProfile,
  truchetTuning,
);
```

Then change the final `buildGalleryHtml([...])` call to include them first:

```ts
writeFileSync("out/gallery.html", buildGalleryHtml([improveTruchet, truchet, improveIgp, improveTiling, tilework, strapwork]));
```

- [ ] **Step 3: Typecheck, run, and verify the output**

Run:

```bash
cd /Users/ag/Lab/VisualThinking/toolkit && npm run typecheck && npm run gallery && grep -c "Truchet" out/gallery.html && grep -oE "step [0-9]+: (periodicity|constructionGrammar)" out/gallery.html | head
```

Expected: typecheck clean; `wrote out/gallery.html`; `grep -c "Truchet"` ≥ 2 (both group headings); and at least a `step 1: periodicity` line (the improvement trajectory rendered).

- [ ] **Step 4: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/scripts/render-gallery.ts && git commit -m "$(cat <<'EOF'
toolkit: add Truchet scorecard + improvement groups to the gallery

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: README + final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read the README's layout section to find the insertion point**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && grep -n "^## \|periodicity\|tile-complexity" README.md`
Find the scoring-model table row list and the `operators/` line in the Layout block.

- [ ] **Step 2: Add `periodicity` to the scoring-model table**

In the metric table (the "What \"score\" means" section), add a row after the `cuerdaSeca`/`tileComplexity` rows:

```markdown
| **periodicity** | floor (`≥0.95`) | fraction of cell frames that map onto another frame under lattice translation — measures the *grid*, not the cell contents (rotation-blind), so varied tilings still score high (periodic plans only) | 1.0 → 100% (clean grid) · 0.0 → 0% (cells drift off-lattice) |
```

- [ ] **Step 3: Add a short Truchet/medium-agnostic note**

After the "Closing the loop — `improve()`" section, add:

```markdown
## A third medium — Truchet (the medium-agnostic test)

The `truchet` generator + profile fill the canvas with a periodic arc-tile grid — a deliberately different geometry from the centred IGP/tiling generators, used to test that the spine is medium-agnostic. The result: it took **one new operator** (`periodicity`, translational lattice self-match, replacing centre-rotation `symmetry`) and a new generator/profile/tuning map. `constructionGrammar`, `lineContinuity`, `colorChord`, the composer, and `improve()` were **reused unchanged**. The boundary that keeps the toolkit from accreting bias is in `../CLAUDE.md` → Engineering discipline: operators *measure* (taste-free), profiles *set targets* (project-owned taste), and a measurement belongs in core only if its property is transferable across unrelated mediums.
```

- [ ] **Step 4: Update the Layout block**

In the `src/` Layout listing, update the `generators/`, `profiles/`, `operators/`, and `tuning/` lines to mention Truchet/periodicity:

```
  operators/          # symmetry · complexity · color-chord · construction-grammar · line-continuity · cuerda-seca · tile-complexity · periodicity
  profiles/           # timurid-igp.ts (lines) · timurid-tiling.ts (cells) · truchet.ts (periodic)
  generators/         # igp.ts (line strapwork) · tiling.ts (filled cells) · truchet.ts (wall-to-wall arcs)
  tuning/             # igp.ts · tiling.ts · truchet.ts (per-generator fix→param maps)
```

- [ ] **Step 5: Final full verification**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm test && npm run typecheck`
Expected: all tests pass (the prior 68 + periodicity 4 + svg path 1 + generator 3 + truchet acceptance 8 = 84), typecheck clean.

- [ ] **Step 6: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/README.md && git commit -m "$(cat <<'EOF'
toolkit: document the truchet medium + periodicity operator in README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 7: Finish the development branch**

Use the **superpowers:finishing-a-development-branch** skill. Tests verified in Step 5. This extends open PR #2 on `toolkit-screensaver`; the expected choice is to push and let the PR update.

---

## Self-Review Notes

- **Spec coverage:** periodicity operator (Task 1), generator with all knobs (Task 3), profile + tuning + variants (Task 4), SVG path branch (Task 2), acceptance + improve (Task 5), gallery groups (Task 6), README + finding (Task 7). The "untouched spine" requirement holds — no task edits `compose.ts`/`improve.ts`/`tuning.ts`/`profile.ts`. ✓
- **broken-lattice coupling** (degrades periodicity AND lineContinuity) is handled: the variant comment + the acceptance test assert periodicity is the *top* fix (higher weight), not the only fix — matching the spec. ✓
- **Calibration:** only `minContinuity` needs a probe (Task 4 Step 1); both tuning steps are coarse by the cliff-knob argument (no probe). Acceptance thresholds are mostly relative (`good > variant`), with `≥0.9`/`≥0.85` defensible because periodicity/grammar/colorChord all reach ~1.0 by construction and the continuity floor is set ≤ clean. ✓
- **Type consistency:** `TruchetParams` field names (`gridSize`, `cellScale`, `latticeJitter`, `arcGap`, `arcSteps`, `palette`, `rngSeed`) are identical across generator, tuning map params, variants, improve starts, and gallery. `periodicityOperator` target shape `{ minFidelity }` matches the profile binding. `improvementGroup` (already in render-gallery from the close-the-loop slice) is reused as-is. ✓
- **No injectable-registry work** — `periodicity` goes in the existing global registry per the minimal-scope decision. ✓
