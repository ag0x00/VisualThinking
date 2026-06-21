# Close the Loop — `improve()` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `improve(generate, params, profile, tuning)` to the toolkit — a deterministic generate→score→fix→regenerate loop that turns the composer's ranked fixes into parameter nudges.

**Architecture:** A per-generator *tuning map* binds each `fix.axis` to one scalar knob (param/step/bounds, with an `invert` flag for inverse-sense knobs). The loop greedily applies the single worst-weighted *actionable* fix per iteration, regenerates, keeps the step only if the composite improved, and stops on the first non-improvement. Output is a trajectory the gallery renders as a knob-by-knob climb.

**Tech Stack:** TypeScript (ESM, `moduleResolution: Bundler`), vitest, tsx. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-05-20-close-the-loop-design.md`

**Working dir for all commands:** `cd /Users/ag/Lab/VisualThinking/toolkit`. All `git` commands run from `cd /Users/ag/Lab/VisualThinking`. (Bash cwd persists between calls — always prefix with the right `cd`.)

**Probe-verified facts (2026-05-20), used for the assertions below:**
- IGP default (good) composite = **1.000**. IGP `{rings:3, segmentScale:0.5}` = **0.708** (lineContinuity=0.00 is the top fix). After segmentScale→1.0: **0.990** (top fix becomes complexity); after rings 3→4: **1.000**.
- Tiling default (good) = **1.000**. Tiling `{cellScale:0.9, channelJitter:0.6}` = **0.823** (constructionGrammar is the top fix). cellScale 0.9→0.93 → **0.892**; converges to ~1.0 as cellScale→1.0 and channelJitter→0.

---

## File Structure

**New:**
- `src/tuning.ts` — `NudgeKind`, `TuningBinding`, `TuningMap` types + `applyNudge`.
- `src/tuning/igp.ts` — `igpTuning` map.
- `src/tuning/tiling.ts` — `tilingTuning` map.
- `src/improve.ts` — `ImproveOptions`, `ImproveStep`, `ImproveResult`, `improve`.
- `test/tuning.test.ts` — `applyNudge` units + tuning-map structural checks.
- `test/improve.test.ts` — loop acceptance + invariants for both media.

**Modified:**
- `src/scripts/render-gallery.ts` — add two "Improvement" groups (igp + tiling).
- `README.md` — document `improve` + tuning maps.

**Reused unchanged:** `src/renderers/gallery.ts` (trajectory steps map onto existing `GalleryEntry`).

---

## Task 1: Tuning types + `applyNudge`

**Files:**
- Create: `src/tuning.ts`
- Test: `test/tuning.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/tuning.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { applyNudge, type TuningBinding } from "../src/tuning";

const ringsB: TuningBinding = { param: "rings", kind: "int", step: 1, min: 3, max: 9 };
const ssB: TuningBinding = { param: "segmentScale", kind: "num", step: 0.6, min: 0.4, max: 1.0 };
const jitterB: TuningBinding = { param: "channelJitter", kind: "num", step: 0.1, min: 0, max: 1, invert: true };

describe("applyNudge", () => {
  it("increases an int knob by its step", () => {
    const r = applyNudge({ rings: 6 }, ringsB, "increase");
    expect(r.to).toBe(7);
    expect(r.from).toBe(6);
    expect(r.changed).toBe(true);
    expect(r.params.rings).toBe(7);
  });

  it("decreases an int knob and clamps at min", () => {
    expect(applyNudge({ rings: 4 }, ringsB, "decrease").to).toBe(3);
    const pinned = applyNudge({ rings: 3 }, ringsB, "decrease");
    expect(pinned.to).toBe(3);
    expect(pinned.changed).toBe(false);
  });

  it("clamps a num knob at max and reports pinned as unchanged", () => {
    expect(applyNudge({ segmentScale: 0.5 }, ssB, "increase").to).toBe(1.0);
    const pinned = applyNudge({ segmentScale: 1.0 }, ssB, "increase");
    expect(pinned.changed).toBe(false);
  });

  it("inverts the direction sign when invert is set", () => {
    // fix says "increase" (quality), invert flips it to a -step on the knob
    const r = applyNudge({ channelJitter: 0.6 }, jitterB, "increase");
    expect(r.to).toBeCloseTo(0.5, 10);
    expect(r.changed).toBe(true);
  });

  it("treats direction 'ok' as a no-op", () => {
    const r = applyNudge({ rings: 6 }, ringsB, "ok");
    expect(r.changed).toBe(false);
    expect(r.to).toBe(6);
  });

  it("does not mutate the input params object", () => {
    const input = { rings: 6 };
    applyNudge(input, ringsB, "increase");
    expect(input.rings).toBe(6);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/tuning.test.ts`
Expected: FAIL — `Cannot find module '../src/tuning'`.

- [ ] **Step 3: Implement `src/tuning.ts`**

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/tuning.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/tuning.ts toolkit/test/tuning.test.ts && git commit -m "$(cat <<'EOF'
toolkit: add tuning types + applyNudge (fix→param nudge primitive)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: The two tuning maps

**Files:**
- Create: `src/tuning/igp.ts`, `src/tuning/tiling.ts`
- Test: append to `test/tuning.test.ts`

- [ ] **Step 1: Write the failing test (append to `test/tuning.test.ts`)**

Add at the end of the file:

```ts
import { igpTuning } from "../src/tuning/igp";
import { tilingTuning } from "../src/tuning/tiling";
import { defaultIgpParams } from "../src/generators/igp";
import { defaultTilingParams } from "../src/generators/tiling";

describe("tuning maps", () => {
  it("igp binds complexity→rings and lineContinuity→segmentScale (cliff step)", () => {
    expect(igpTuning.complexity.param).toBe("rings");
    expect(igpTuning.lineContinuity.param).toBe("segmentScale");
    expect(igpTuning.lineContinuity.step).toBe(0.6); // coarse: crosses the continuity cliff
    expect(igpTuning.symmetry).toBeUndefined();
    expect(igpTuning.colorChord).toBeUndefined();
  });

  it("tiling binds three axes; cuerdaSeca is inverted; colorCount capped at fillCount", () => {
    expect(tilingTuning.constructionGrammar.param).toBe("cellScale");
    expect(tilingTuning.tileComplexity.param).toBe("colorCount");
    expect(tilingTuning.tileComplexity.max).toBe(3);
    expect(tilingTuning.cuerdaSeca.param).toBe("channelJitter");
    expect(tilingTuning.cuerdaSeca.invert).toBe(true);
  });

  it("every bound param is a real key on the generator's default params", () => {
    const ip = defaultIgpParams() as Record<string, unknown>;
    for (const b of Object.values(igpTuning)) expect(b.param in ip).toBe(true);
    const tp = defaultTilingParams() as Record<string, unknown>;
    for (const b of Object.values(tilingTuning)) expect(b.param in tp).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/tuning.test.ts`
Expected: FAIL — `Cannot find module '../src/tuning/igp'`.

- [ ] **Step 3: Implement the maps**

Create `src/tuning/igp.ts`:

```ts
import type { TuningMap } from "../tuning";

// Maps the timurid-igp profile's fix axes to igp generator knobs.
// symmetry (always p6m) and colorChord (palette is an array, deferred) have no
// knob and are intentionally absent — the loop skips axes with no binding.
export const igpTuning: TuningMap = {
  complexity: { param: "rings", kind: "int", step: 1, min: 3, max: 9 },
  // Cliff knob: line segments only meet (continuity 0→1) at scale 1.0, so a fine
  // step yields no composite gain and would trip the revert-and-stop guard.
  // step 0.6 reaches 1.0 from any start in [0.4, 1.0] in one move.
  lineContinuity: { param: "segmentScale", kind: "num", step: 0.6, min: 0.4, max: 1.0 },
};
```

Create `src/tuning/tiling.ts`:

```ts
import type { TuningMap } from "../tuning";

// Maps the timurid-tiling profile's fix axes to tiling generator knobs.
// symmetry + colorChord have no knob (see igp tuning note).
export const tilingTuning: TuningMap = {
  constructionGrammar: { param: "cellScale", kind: "num", step: 0.03, min: 0.85, max: 1.15 },
  // max = fillCount = palette.length - 2 = 3 for SAMARKAND_PALETTE. The generator
  // re-clamps colorCount to fillCount, so bounding here at 3 keeps a pinned nudge
  // correctly detectable as non-actionable (avoids a 3→4 "change" with no effect).
  tileComplexity: { param: "colorCount", kind: "int", step: 1, min: 1, max: 3 },
  // invert: the fix asks to "increase" quality, but quality rises as jitter falls.
  cuerdaSeca: { param: "channelJitter", kind: "num", step: 0.1, min: 0, max: 1, invert: true },
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/tuning.test.ts`
Expected: PASS (9 tests total).

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/tuning/igp.ts toolkit/src/tuning/tiling.ts toolkit/test/tuning.test.ts && git commit -m "$(cat <<'EOF'
toolkit: add igp + tiling tuning maps (fix.axis → generator knob)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: The `improve` loop

**Files:**
- Create: `src/improve.ts`
- Test: `test/improve.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/improve.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { improve } from "../src/improve";
import { compose } from "../src/compose";
import { generateIgp, defaultIgpParams } from "../src/generators/igp";
import { generateTiling, defaultTilingParams } from "../src/generators/tiling";
import { timuridIgpProfile } from "../src/profiles/timurid-igp";
import { timuridTilingProfile } from "../src/profiles/timurid-tiling";
import { igpTuning } from "../src/tuning/igp";
import { tilingTuning } from "../src/tuning/tiling";

const igpStart = { ...defaultIgpParams(), rings: 3, segmentScale: 0.5 };       // ≈0.708
const tilingStart = { ...defaultTilingParams(), cellScale: 0.9, channelJitter: 0.6 }; // ≈0.823

describe("improve — recovery to target", () => {
  it("igp: lifts a degraded start to the default target (0.85)", () => {
    const startScore = compose(generateIgp(igpStart), timuridIgpProfile).composite;
    const r = improve(generateIgp, igpStart, timuridIgpProfile, igpTuning);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    expect(r.finalScore).toBeGreaterThan(startScore);
    expect(r.trajectory.length).toBeGreaterThan(0);
  });

  it("tiling: lifts a degraded start to the default target (0.85)", () => {
    const startScore = compose(generateTiling(tilingStart), timuridTilingProfile).composite;
    const r = improve(generateTiling, tilingStart, timuridTilingProfile, tilingTuning);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    expect(r.finalScore).toBeGreaterThan(startScore);
  });
});

describe("improve — full climb exercises both knobs", () => {
  it("igp: fixes lineContinuity first, then complexity", () => {
    const r = improve(generateIgp, igpStart, timuridIgpProfile, igpTuning, { targetComposite: 0.99 });
    expect(r.finalScore).toBeGreaterThanOrEqual(0.99);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("lineContinuity");
    expect(axes).toContain("complexity");
    expect(axes.indexOf("lineContinuity")).toBeLessThan(axes.indexOf("complexity"));
  });

  it("tiling: drives constructionGrammar and cuerdaSeca", () => {
    const r = improve(generateTiling, tilingStart, timuridTilingProfile, tilingTuning, { targetComposite: 0.99 });
    expect(r.finalScore).toBeGreaterThanOrEqual(0.99);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("constructionGrammar");
    expect(axes).toContain("cuerdaSeca");
  });
});

describe("improve — trajectory invariants", () => {
  it("is monotonic, chained, and finalScore matches the last step", () => {
    const r = improve(generateIgp, igpStart, timuridIgpProfile, igpTuning, { targetComposite: 0.99 });
    const startScore = compose(generateIgp(igpStart), timuridIgpProfile).composite;
    expect(r.trajectory[0].compositeBefore).toBeCloseTo(startScore, 10);
    for (let i = 0; i < r.trajectory.length; i++) {
      const s = r.trajectory[i];
      expect(s.compositeAfter).toBeGreaterThan(s.compositeBefore); // every recorded step improves
      if (i > 0) expect(s.compositeBefore).toBeCloseTo(r.trajectory[i - 1].compositeAfter, 10);
    }
    const last = r.trajectory[r.trajectory.length - 1];
    expect(r.finalScore).toBeCloseTo(last.compositeAfter, 10);
    expect(r.trajectory.length).toBeLessThanOrEqual(20);
  });

  it("returns the start unchanged when the target is already met", () => {
    const good = defaultIgpParams();
    const r = improve(generateIgp, good, timuridIgpProfile, igpTuning, { targetComposite: 0.5 });
    expect(r.trajectory).toEqual([]);
    expect(r.finalParams).toEqual(good);
    expect(r.finalScore).toBeCloseTo(1.0, 10);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/improve.test.ts`
Expected: FAIL — `Cannot find module '../src/improve'`.

- [ ] **Step 3: Implement `src/improve.ts`**

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/improve.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Run the full suite + typecheck**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm test && npm run typecheck`
Expected: all tests pass; typecheck clean (no output / exit 0).

- [ ] **Step 6: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/improve.ts toolkit/test/improve.test.ts && git commit -m "$(cat <<'EOF'
toolkit: add improve() — greedy single-knob generate→score→fix→regenerate loop

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Gallery improvement groups

**Files:**
- Modify: `src/scripts/render-gallery.ts`

- [ ] **Step 1: Rewrite `src/scripts/render-gallery.ts`**

Replace the whole file with:

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { compose } from "../compose";
import { renderSvg } from "../renderers/svg";
import { buildGalleryHtml, type GalleryEntry, type GalleryGroup } from "../renderers/gallery";
import type { AestheticProfile } from "../profile";
import { timuridIgpProfile } from "../profiles/timurid-igp";
import { timuridTilingProfile } from "../profiles/timurid-tiling";
import { goodPlan, degradedVariants, tilingGood, tilingVariants } from "../variants";
import { improve } from "../improve";
import { igpTuning } from "../tuning/igp";
import { tilingTuning } from "../tuning/tiling";
import { generateIgp, defaultIgpParams } from "../generators/igp";
import { generateTiling, defaultTilingParams } from "../generators/tiling";
import type { RenderPlan } from "../render-plan";

function entry(label: string, description: string, plan: RenderPlan, profile: AestheticProfile): GalleryEntry {
  return { label, description, svg: renderSvg(plan), result: compose(plan, profile) };
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

// Build an "Improvement" group: start state + one card per accepted improve() step.
function improvementGroup<P>(
  title: string,
  generate: (p: P) => RenderPlan,
  start: P,
  profile: AestheticProfile,
  tuning: import("../tuning").TuningMap,
): GalleryGroup {
  const r = improve(generate, start, profile, tuning, { targetComposite: 0.99 });
  const entries: GalleryEntry[] = [
    entry("start", "degraded params, below target", generate(start), profile),
  ];
  for (const s of r.trajectory) {
    entries.push(
      entry(
        `step ${s.iter}: ${s.fix}`,
        `${s.param} ${s.from}→${s.to} · ${pct(s.compositeBefore)}→${pct(s.compositeAfter)}`,
        generate(s.params),
        profile,
      ),
    );
  }
  return { title, entries };
}

const strapwork: GalleryGroup = {
  title: "Strapwork (lines)",
  entries: [
    entry("GOOD (target)", "default 6-fold generator", goodPlan(), timuridIgpProfile),
    ...degradedVariants().map((v) => entry(v.label, v.description, v.plan, timuridIgpProfile)),
  ],
};

const tilework: GalleryGroup = {
  title: "Tilework (cells)",
  entries: [
    entry("GOOD (target)", "default 6-fold tiling", tilingGood(), timuridTilingProfile),
    ...tilingVariants().map((v) => entry(v.label, v.description, v.plan, timuridTilingProfile)),
  ],
};

const improveIgp = improvementGroup(
  "Improvement — strapwork (improve() closing the loop)",
  generateIgp,
  { ...defaultIgpParams(), rings: 3, segmentScale: 0.5 },
  timuridIgpProfile,
  igpTuning,
);

const improveTiling = improvementGroup(
  "Improvement — tilework (improve() closing the loop)",
  generateTiling,
  { ...defaultTilingParams(), cellScale: 0.9, channelJitter: 0.6 },
  timuridTilingProfile,
  tilingTuning,
);

mkdirSync("out", { recursive: true });
writeFileSync("out/gallery.html", buildGalleryHtml([improveIgp, improveTiling, tilework, strapwork]));
console.log("wrote out/gallery.html");
```

- [ ] **Step 2: Verify typecheck**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm run typecheck`
Expected: clean (exit 0).

- [ ] **Step 3: Run the gallery script and verify output**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm run gallery && grep -c "Improvement —" out/gallery.html`
Expected: prints `wrote out/gallery.html` then `2` (two improvement group headings present).

- [ ] **Step 4: Verify the climb is visible**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && grep -oE "step [0-9]+: (lineContinuity|complexity|constructionGrammar|cuerdaSeca|tileComplexity)" out/gallery.html | head`
Expected: at least a `step 1: lineContinuity` (strapwork) and a `step 1: constructionGrammar` (tilework) among the lines — confirming both trajectories rendered as cards.

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/scripts/render-gallery.ts && git commit -m "$(cat <<'EOF'
toolkit: render improve() trajectories as gallery "Improvement" groups

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: README + final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read the current README to find the right insertion point**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && grep -n "^##" README.md`
Identify the section after the scoring-model table (the operators section). The new section goes after it.

- [ ] **Step 2: Add a "Closing the loop — `improve()`" section**

Insert this section after the scoring-model/operators section (use the Read tool first, then Edit to place it before the "Layout" or final section — pick the spot that reads naturally):

```markdown
## Closing the loop — `improve()`

Evaluation feeds back into generation. `improve(generate, params, profile, tuning)` reads the composer's ranked `fixes` and turns the single worst-weighted *actionable* knob one step, regenerates, and keeps the step only if the composite climbed — stopping on the first non-improvement.

```ts
import { improve } from "./src/improve";
import { generateIgp, defaultIgpParams } from "./src/generators/igp";
import { timuridIgpProfile } from "./src/profiles/timurid-igp";
import { igpTuning } from "./src/tuning/igp";

const start = { ...defaultIgpParams(), rings: 3, segmentScale: 0.5 }; // composite ≈0.71
const r = improve(generateIgp, start, timuridIgpProfile, igpTuning);
// r.finalScore ≈ 0.99 ; r.trajectory lists each accepted knob turn
```

A **tuning map** binds each `fix.axis` to one generator knob: `{ param, kind, step, min, max, invert? }`. `invert` flips the direction→delta sign for inverse-sense knobs (cuerda-seca quality rises as `channelJitter` falls). Axes with no knob (`symmetry`, which is always `p6m`; `colorChord`, deferred) are absent from the map and skipped by the loop. One subtlety: `segmentScale` is a *cliff knob* — line continuity only resolves at scale 1.0 — so it uses a coarse step that crosses the discontinuity in one move.

`improve()` returns `{ finalParams, finalPlan, finalScore, trajectory }`; each trajectory step carries a full params snapshot, so `npm run gallery` renders the climb as an "Improvement" group (start → each accepted step → final, composite rising knob-by-knob).
```

- [ ] **Step 3: Final full verification**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm test && npm run typecheck`
Expected: all tests pass (existing 53 + 6 tuning + 6 improve = 65), typecheck clean.

- [ ] **Step 4: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/README.md && git commit -m "$(cat <<'EOF'
toolkit: document improve() + tuning maps in README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Finish the development branch**

Use the **superpowers:finishing-a-development-branch** skill. Tests already verified in Step 3. This work extends the open PR #2 on `toolkit-screensaver`, so the expected choice is to push and let the PR update.

---

## Self-Review Notes

- **Spec coverage:** signature (Task 3), core loop (Task 3), tuning maps incl. invert + deferred axes (Task 2), applyNudge + pinned detection (Task 1), output shape (Task 3), gallery (Task 4), all tests from the spec's Testing section (Tasks 1/3), README (Task 5). ✓
- **Type consistency:** `TuningBinding`/`TuningMap`/`applyNudge`/`NudgeResult` (Task 1) are consumed unchanged in Tasks 2–4; `ImproveStep`/`ImproveResult`/`ImproveOptions` (Task 3) match the gallery usage (Task 4). `applyNudge` takes `FixDirection` (imported from `operators/types`), matching what `compose`'s `fix.direction` provides. ✓
- **Probe-calibrated assertions:** all numeric thresholds (0.85, 0.99, ordering lineContinuity-before-complexity) are backed by the 2026-05-20 probe recorded at the top. ✓
- **Convergence guard** uses `targetComposite: 0.5` against a good (1.0) plan so it breaks immediately → empty trajectory, proving no-op behavior. ✓
```
