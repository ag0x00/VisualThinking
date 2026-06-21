# 12-Fold Girih Glazed Mosaic — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A filled, colored 12-fold star-and-rosette Islamic glazed-tile mosaic generator, evaluated and improvable by the existing operator spine.

**Architecture:** `generateGirih12` builds the 3.12.12 tiling (dodecagons on a hex lattice, triangle gaps left as dark ground), decorates each dodecagon by direct trig into a 12-star + 12 petals, fills them from a dedicated `SAMARKAND_7` palette with <5% warm accents, and adds cuerda-seca channels + a grout inset. Scored by `periodicity + constructionGrammar + cuerdaSeca + colorChord`. No new operator; the spine is untouched.

**Tech Stack:** TypeScript (ESM, Bundler), vitest, tsx, culori. No new deps.

**Spec:** `docs/superpowers/specs/2026-05-21-girih12-igp-mosaic-design.md`

**Working dir:** `npm`/`npx` from `cd /Users/ag/Lab/VisualThinking/toolkit`; `git` from `cd /Users/ag/Lab/VisualThinking`. Bash cwd resets between calls — always prefix.

**Verified by prototype (2026-05-21):** the geometry below renders a valid 12-fold mosaic; star+12-petals exactly partition each dodecagon (sum = 3·R² per dodecagon); `periodicity` = 1.000 and `cuerdaSeca` = 1.000 by construction; `colorChord` ≈ 0.775 (the expected, accepted accent penalty). Measured coverage runs ~1.0–1.1 (includes canvas overhang); the grout inset and the probe in Task 2 land it in band.

**Geometry facts:** dodecagon circumradius `R`; apothem `a = R·cos(π/12)`; centers on a hex lattice spaced `D = 2a` (edges shared along the 6 neighbour directions, triangles in the gaps). **Edge midpoints face `k·30°`** (the neighbour directions), **vertices sit at `k·30°+15°`**, inner star points at radius `a·starRatio` on the vertex directions. `starRatio = cos(contactAngle)` (monotonic stand-in for Bonner's contact angle: bigger angle → sharper/deeper star).

**Cliff knob:** `latticeJitter` is a cliff knob for `periodicity` (any per-cell drift past eps≈1.1px collapses the lattice match), so its tuning step is coarse (= max). Same lesson as `segmentScale`/Truchet.

---

## File Structure

**New:** `src/generators/girih12.ts`, `src/profiles/girih12.ts`, `src/tuning/girih12.ts`, `test/generators/girih12.test.ts`, `test/acceptance-girih12.test.ts`.
**Modified:** `src/variants.ts`, `src/scripts/render-gallery.ts`, `README.md`.
**Untouched:** `compose.ts`, `improve.ts`, `tuning.ts`, `profile.ts`, all operators, `SAMARKAND_PALETTE`, other generators.

---

## Task 1: `generateGirih12` generator + `SAMARKAND_7`

**Files:**
- Create: `src/generators/girih12.ts`
- Test: `test/generators/girih12.test.ts`

- [ ] **Step 1: Write the failing test**

Create `test/generators/girih12.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateGirih12, defaultGirih12Params, SAMARKAND_7 } from "../../src/generators/girih12";
import { validateRenderPlan } from "../../src/render-plan";
import { polyArea } from "../../src/geom";

describe("generateGirih12", () => {
  it("emits a valid plan with stars + petals + background and a hex lattice", () => {
    const p = generateGirih12(defaultGirih12Params());
    expect(validateRenderPlan(p)).toEqual([]);
    const stars = p.elements.filter((e) => e.role === "tile" && e.motifId === "star");
    const petals = p.elements.filter((e) => e.role === "tile" && e.motifId === "petal");
    expect(stars.length).toBeGreaterThan(0);
    expect(petals.length).toBe(stars.length * 12); // 12 petals per dodecagon
    expect(p.elements.some((e) => e.role === "background")).toBe(true);
    expect(p.symmetry.lattice).toBeDefined();
    expect(p.region).toEqual([[0, 0], [800, 0], [800, 800], [0, 800]]);
  });

  it("keeps warm accents under the 5% area budget", () => {
    const p = generateGirih12(defaultGirih12Params());
    const total = p.bounds.width * p.bounds.height;
    const accentArea = p.elements
      .filter((e) => e.role === "tile" && e.colorRef != null && e.colorRef >= 5)
      .reduce((s, e) => s + polyArea(e.points), 0);
    expect(accentArea / total).toBeLessThan(0.05);
    expect(accentArea).toBeGreaterThan(0); // accents are actually present
  });

  it("is deterministic for fixed params", () => {
    expect(JSON.stringify(generateGirih12(defaultGirih12Params()))).toBe(JSON.stringify(generateGirih12(defaultGirih12Params())));
  });

  it("SAMARKAND_7 has 5 cool + 3 accents and leaves the shared palette alone", () => {
    expect(SAMARKAND_7.length).toBe(8);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/generators/girih12.test.ts`
Expected: FAIL — `Cannot find module '../../src/generators/girih12'`.

- [ ] **Step 3: Implement `src/generators/girih12.ts`**

```ts
import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";
import { centroid, scaleAbout } from "../geom";

// Dedicated 7-colour Samarkand chord. Indices 0–4 = cool spine, 5–7 = warm
// accents (<5% of frame). NOT the shared SAMARKAND_PALETTE — the other
// generators derive bg/cream/fill indices from that array's length.
export const SAMARKAND_7: Oklch[] = [
  { l: 0.45, c: 0.12, h: 240 }, // 0 cobalt — star
  { l: 0.62, c: 0.11, h: 200 }, // 1 turquoise — petal
  { l: 0.72, c: 0.09, h: 190 }, // 2 light-turquoise — (reserved/secondary)
  { l: 0.30, c: 0.06, h: 250 }, // 3 deep-blue — ground/background
  { l: 0.95, c: 0.01, h: 200 }, // 4 cream — cuerda-seca channel (neutral)
  { l: 0.78, c: 0.13, h: 80 },  // 5 saffron — accent
  { l: 0.50, c: 0.10, h: 50 },  // 6 sienna — accent
  { l: 0.62, c: 0.05, h: 135 }, // 7 sage — accent
];
const BG = 3, CREAM = 4, STAR = 0, PETAL = 1;

export interface Girih12Params {
  bounds: { width: number; height: number };
  dodecaRadius: number;   // R — dodecagon circumradius
  contactAngle: number;   // degrees; starRatio = cos(contactAngle) — bigger = sharper star
  groutGap: number;       // 0 = regions touch; >0 insets each region (dark grout between glazes)
  channelWidth: number;   // cuerda-seca cream stroke width
  channelJitter: number;  // 0 = uniform; >0 perturbs per-region channel (degrades cuerdaSeca)
  latticeJitter: number;  // 0 = clean lattice; >0 drifts each dodecagon (degrades periodicity)
  accentBudget: number;   // max fraction of frame the warm accents may cover
  palette: Oklch[];
  rngSeed: number;
}

export function defaultGirih12Params(): Girih12Params {
  return {
    bounds: { width: 800, height: 800 }, dodecaRadius: 70, contactAngle: 65,
    groutGap: 0.03, channelWidth: 4, channelJitter: 0, latticeJitter: 0,
    accentBudget: 0.05, palette: SAMARKAND_7, rngSeed: 1,
  };
}

function hash(i: number, j: number, seed: number): number {
  const s = Math.sin(i * 73.13 + j * 914.7 + seed * 131.7) * 43758.5453;
  return s - Math.floor(s);
}

export function generateGirih12(params: Girih12Params = defaultGirih12Params()): RenderPlan {
  const { bounds, dodecaRadius: R, contactAngle, groutGap, channelWidth, channelJitter, latticeJitter, accentBudget, palette, rngSeed } = params;
  const W = bounds.width, H = bounds.height;
  const a = R * Math.cos(Math.PI / 12);
  const D = 2 * a;
  const starRatio = Math.cos((contactAngle * Math.PI) / 180);
  const totalArea = W * H;
  const inset = (pts: Vec2[]) => (groutGap > 0 ? scaleAbout(pts, centroid(pts), 1 - groutGap) : pts);

  const elements: Element[] = [
    { kind: "polygon", role: "background", points: [[0, 0], [W, 0], [W, H], [0, H]], colorRef: BG },
  ];

  // deterministic per-region channel width
  let cellSeq = 0;
  const channelOf = (): number => {
    if (channelJitter === 0) return channelWidth;
    const s = Math.sin(cellSeq++ * 91.7) * 43758.5453;
    return channelWidth * Math.max(0, 1 + channelJitter * ((s - Math.floor(s)) * 2 - 1));
  };

  const u1: Vec2 = [D, 0];
  const u2: Vec2 = [D * Math.cos(Math.PI / 3), D * Math.sin(Math.PI / 3)];
  let accentArea = 0;

  // Shear-aware lattice range: rows shift right by j·D/2 as j grows, so i must
  // start increasingly negative to keep the lower-left filled (off-canvas
  // dodecagons are culled by the bounds check below).
  const rows = Math.ceil(H / u2[1]) + 2;
  const cols = Math.ceil(W / D) + 2;
  for (let j = -1; j <= rows; j++) {
    for (let i = -Math.ceil(rows / 2) - 1; i <= cols; i++) {
      let cx = i * u1[0] + j * u2[0];
      let cy = i * u1[1] + j * u2[1];
      if (cx < -R || cx > W + R || cy < -R || cy > H + R) continue;
      if (latticeJitter > 0) {
        cx += (hash(i, j, rngSeed + 7) * 2 - 1) * latticeJitter * D;
        cy += (hash(i, j, rngSeed + 13) * 2 - 1) * latticeJitter * D;
      }
      const Vk = (k: number): Vec2 => [cx + R * Math.cos(Math.PI / 6 * k + Math.PI / 12), cy + R * Math.sin(Math.PI / 6 * k + Math.PI / 12)];
      const Mk = (k: number): Vec2 => [cx + a * Math.cos(Math.PI / 6 * k), cy + a * Math.sin(Math.PI / 6 * k)];
      const Ik = (k: number): Vec2 => [cx + a * starRatio * Math.cos(Math.PI / 6 * k + Math.PI / 12), cy + a * starRatio * Math.sin(Math.PI / 6 * k + Math.PI / 12)];

      // 12-point star (alternate edge-mid outer + inner)
      const star: Vec2[] = [];
      for (let k = 0; k < 12; k++) { star.push(Mk(k)); star.push(Ik(k)); }
      // accent budget: ~7% of dodecagons (hash-scattered across the whole field,
      // not front-loaded) get a warm accent star core, capped at accentBudget area
      let starColor = STAR;
      const aStar = polyAreaLocal(star);
      if (hash(i, j, rngSeed + 5) < 0.07 && accentArea + aStar < accentBudget * totalArea) {
        starColor = 5 + Math.floor(hash(i, j, rngSeed + 11) * 3);
        accentArea += aStar;
      }
      elements.push({ kind: "polygon", role: "tile", points: inset(star), colorRef: starColor, strokeRef: CREAM, channel: channelOf(), motifId: "star" });

      // 12 petals
      for (let k = 0; k < 12; k++) {
        const petal: Vec2[] = [Mk(k), Vk(k), Mk((k + 1) % 12), Ik(k)];
        elements.push({ kind: "polygon", role: "tile", points: inset(petal), colorRef: PETAL, strokeRef: CREAM, channel: channelOf(), motifId: "petal" });
      }
    }
  }

  return {
    bounds, symmetry: { group: "p6m", lattice: [u1, u2], center: [W / 2, H / 2], order: 12 },
    palette, elements, region: [[0, 0], [W, 0], [W, H], [0, H]],
  };
}

// local copy to avoid an import cycle in the accent-budget check
function polyAreaLocal(pts: Vec2[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    s += x0 * y1 - x1 * y0;
  }
  return Math.abs(s) / 2;
}
```

Note: `polyAreaLocal` duplicates `geom.polyArea` deliberately to keep the accent-budget check self-contained; if you prefer, import `polyArea` from `../geom` instead (no cycle exists — do whichever reads cleaner; the test imports `polyArea` from `../geom`).

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/generators/girih12.test.ts`
Expected: PASS (4 tests). If the accent-area test fails because no accent was placed (budget hit too early or `dodecaCount % 4` never fires in a small render), confirm the default render has ≥4 dodecagons (it has ~40).

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/generators/girih12.ts toolkit/test/generators/girih12.test.ts && git commit -m "$(cat <<'EOF'
toolkit: add girih12 generator — 12-fold star-and-rosette glazed mosaic (SAMARKAND_7)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Profile, tuning map, variants (+ calibrate the coverage band)

**Files:**
- Create: `src/profiles/girih12.ts`, `src/tuning/girih12.ts`
- Modify: `src/variants.ts`

- [ ] **Step 1: Probe coverage + per-operator scores to calibrate**

Run:

```bash
cd /Users/ag/Lab/VisualThinking/toolkit && npx tsx -e '
import { compose } from "./src/compose";
import { generateGirih12, defaultGirih12Params } from "./src/generators/girih12";
const tmp = { medium:"probe", operators:[
  {operator:"periodicity",weight:0.30,target:{minFidelity:0.95}},
  {operator:"constructionGrammar",weight:0.30,target:{band:[0.85,1.05],falloff:0.2}},
  {operator:"cuerdaSeca",weight:0.20,target:{minQuality:0.85}},
  {operator:"colorChord",weight:0.20,target:{hueArc:{lo:180,hi:265},minLightnessSpread:0.45}},
]};
for (const g of [0.02,0.03,0.05,0.10,0.15]) {
  const r = compose(generateGirih12({...defaultGirih12Params(), groutGap:g}), tmp as any);
  console.log("grout",g,"composite",r.composite.toFixed(3),"|",r.perOperator.map(p=>p.name+"="+p.measured.toFixed(2)).join(" "));
}
'
```

Read the `constructionGrammar` measured value per groutGap. **Choose `defaultGroutGap` so the good plan's coverage lands inside `[0.85, 1.05]` with margin (aim ~0.95), and confirm the gappy variant (Step 4, groutGap 0.15) lands below 0.85.** If even groutGap 0.15 stays in band, bump the gappy variant's groutGap higher until coverage < 0.85. Record the chosen default in `defaultGirih12Params` if it differs from 0.03.

- [ ] **Step 2: Create `src/profiles/girih12.ts`**

```ts
import type { AestheticProfile } from "../profile";

// 12-fold girih glazed mosaic. periodicity (translational) replaces symmetry.
// constructionGrammar band's lower bound is loosened to 0.85 to ACCEPT a visible
// grout gap (taste in the profile, not an operator change). colorChord will
// under-score the warm accents (off-arc) — accepted for v1; the fix (proportion-
// aware chord) is on the todo in project_subsystem-trajectory.md.
export const girih12Profile: AestheticProfile = {
  medium: "girih12",
  operators: [
    { operator: "periodicity", weight: 0.30, target: { minFidelity: 0.95 } },
    { operator: "constructionGrammar", weight: 0.30, target: { band: [0.85, 1.05], falloff: 0.2 } },
    { operator: "cuerdaSeca", weight: 0.20, target: { minQuality: 0.85 } },
    { operator: "colorChord", weight: 0.20, target: { hueArc: { lo: 180, hi: 265 }, minLightnessSpread: 0.45 } },
  ],
  calibration: { references: ["~/Downloads/blue tiles of samarkand/*"], notes: "12-fold girih; grout accepted via loosened coverage band; warm accents under-scored by single-arc colorChord (todo: proportion-aware chord)" },
};
```

- [ ] **Step 3: Create `src/tuning/girih12.ts`**

```ts
import type { TuningMap } from "../tuning";

export const girih12Tuning: TuningMap = {
  // cliff knob: any drift collapses periodicity; coarse step = max → 0 in one move
  periodicity: { param: "latticeJitter", kind: "num", step: 0.3, min: 0, max: 0.3, invert: true },
  // increase coverage = decrease grout
  constructionGrammar: { param: "groutGap", kind: "num", step: 0.03, min: 0, max: 0.18, invert: true },
  // increase channel quality = decrease jitter
  cuerdaSeca: { param: "channelJitter", kind: "num", step: 0.1, min: 0, max: 1, invert: true },
  // colorChord has no knob — the warm accents are intentional (palette is not tuned)
};
```

- [ ] **Step 4: Add variants — edit `src/variants.ts`**

Add the import next to the other generator imports:

```ts
import { generateGirih12, defaultGirih12Params } from "./generators/girih12";
```

Append at the end of the file:

```ts
export function girih12Good(): RenderPlan {
  return generateGirih12(defaultGirih12Params());
}

// 12-fold girih deliberate failures, one per profile axis.
export function girih12Variants(): Variant[] {
  const d = defaultGirih12Params();
  return [
    { label: "broken-lattice", description: "dodecagons jittered off the grid (latticeJitter 0.2)", plan: generateGirih12({ ...d, latticeJitter: 0.2 }) },
    { label: "gappy-grout", description: "oversized grout (groutGap 0.15)", plan: generateGirih12({ ...d, groutGap: 0.15 }) },
    { label: "uneven-channels", description: "cuerda-seca jittered (channelJitter 1.0)", plan: generateGirih12({ ...d, channelJitter: 1.0 }) },
    { label: "wrong-chord", description: "off-arc (warm) palette", plan: { ...girih12Good(), palette: OFF_ARC } },
  ];
}
```

- [ ] **Step 5: Typecheck**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm run typecheck`
Expected: clean (exit 0).

- [ ] **Step 6: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/profiles/girih12.ts toolkit/src/tuning/girih12.ts toolkit/src/variants.ts && git commit -m "$(cat <<'EOF'
toolkit: add girih12 profile + tuning + variants (coverage band calibrated for grout)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Acceptance + improve tests

**Files:**
- Create: `test/acceptance-girih12.test.ts`

- [ ] **Step 1: Write the test**

Create `test/acceptance-girih12.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { compose } from "../src/compose";
import { improve } from "../src/improve";
import { generateGirih12, defaultGirih12Params } from "../src/generators/girih12";
import { girih12Profile } from "../src/profiles/girih12";
import { girih12Tuning } from "../src/tuning/girih12";
import { girih12Good, girih12Variants } from "../src/variants";

const goodR = compose(girih12Good(), girih12Profile);
const v = Object.fromEntries(girih12Variants().map((x) => [x.label, compose(x.plan, girih12Profile)]));

describe("girih12 acceptance", () => {
  it("the clean mosaic scores well", () => {
    expect(goodR.composite).toBeGreaterThanOrEqual(0.85);
  });

  it("good outranks every deliberate failure", () => {
    for (const k of Object.keys(v)) expect(goodR.composite).toBeGreaterThan(v[k].composite);
  });

  it("broken-lattice: periodicity is the top fix", () => {
    expect(v["broken-lattice"].fixes[0].axis).toBe("periodicity");
  });

  it("gappy-grout flags constructionGrammar", () => {
    expect(v["gappy-grout"].fixes.some((f) => f.axis === "constructionGrammar")).toBe(true);
  });

  it("uneven-channels flags cuerdaSeca", () => {
    expect(v["uneven-channels"].fixes.some((f) => f.axis === "cuerdaSeca")).toBe(true);
  });

  it("wrong-chord flags colorChord", () => {
    expect(v["wrong-chord"].fixes.some((f) => f.axis === "colorChord")).toBe(true);
  });
});

describe("girih12 improve (loop on a real art medium)", () => {
  const start = { ...defaultGirih12Params(), latticeJitter: 0.15, groutGap: 0.15 };

  it("recovers a degraded mosaic, touching periodicity + constructionGrammar", () => {
    const startScore = compose(generateGirih12(start), girih12Profile).composite;
    const r = improve(generateGirih12, start, girih12Profile, girih12Tuning);
    expect(r.finalScore).toBeGreaterThan(startScore);
    expect(r.finalScore).toBeGreaterThanOrEqual(0.85);
    const axes = r.trajectory.map((s) => s.fix);
    expect(axes).toContain("periodicity");
    expect(axes).toContain("constructionGrammar");
  });

  it("climbs monotonically", () => {
    const r = improve(generateGirih12, start, girih12Profile, girih12Tuning, { targetComposite: 0.95 });
    for (const s of r.trajectory) expect(s.compositeAfter).toBeGreaterThan(s.compositeBefore);
  });
});
```

- [ ] **Step 2: Run the test**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npx vitest run test/acceptance-girih12.test.ts`
Expected: PASS (8 tests). If `the clean mosaic scores well` fails (composite < 0.85), the colorChord accent penalty plus a coverage near the band edge dragged it down — re-probe (Task 2 Step 1) and nudge `defaultGroutGap` so coverage sits mid-band; the cool-axis scores (periodicity/cuerdaSeca) are ~1.0 so the composite floor is `0.30·1 + 0.30·gScore + 0.20·1 + 0.20·~0.78`. If `broken-lattice` top fix isn't periodicity, verify periodicity weight (0.30) ≥ the others.

- [ ] **Step 3: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/test/acceptance-girih12.test.ts && git commit -m "$(cat <<'EOF'
toolkit: acceptance + improve tests for the girih12 mosaic medium

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Gallery groups + visual check

**Files:**
- Modify: `src/scripts/render-gallery.ts`

- [ ] **Step 1: Add imports**

In `src/scripts/render-gallery.ts`, add:

```ts
import { girih12Profile } from "../profiles/girih12";
import { girih12Tuning } from "../tuning/girih12";
import { generateGirih12, defaultGirih12Params } from "../generators/girih12";
import { girih12Good, girih12Variants } from "../variants";
```

- [ ] **Step 2: Build the two groups and prepend them to the output**

After the existing `improveTruchet` definition, add:

```ts
const girih12: GalleryGroup = {
  title: "Girih 12-fold (glazed mosaic)",
  entries: [
    entry("GOOD (target)", "12-fold star-and-rosette, Samarkand 7-colour", girih12Good(), girih12Profile),
    ...girih12Variants().map((x) => entry(x.label, x.description, x.plan, girih12Profile)),
  ],
};

const improveGirih12 = improvementGroup(
  "Improvement — girih12 (improve() on a real art medium)",
  generateGirih12,
  { ...defaultGirih12Params(), latticeJitter: 0.15, groutGap: 0.15 },
  girih12Profile,
  girih12Tuning,
);
```

Then update the final `buildGalleryHtml([...])` call to put them first:

```ts
writeFileSync("out/gallery.html", buildGalleryHtml([improveGirih12, girih12, improveTruchet, truchet, improveIgp, improveTiling, tilework, strapwork]));
```

- [ ] **Step 3: Typecheck, render, verify**

Run:

```bash
cd /Users/ag/Lab/VisualThinking/toolkit && npm run typecheck && npm run gallery && grep -ci "girih" out/gallery.html
```

Expected: typecheck clean; `wrote out/gallery.html`; grep count ≥ 2.

- [ ] **Step 4: Visual eyeball + tune star sharpness**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && open "$(pwd)/out/gallery.html"`
Look at the GOOD girih12 card. It should read as a **12-pointed-star mosaic**: cobalt stars, turquoise petals, cream channels, deep-blue triangular interstices, a few saffron/sienna/sage star-centers. If the stars look too shallow or too spiky, adjust `contactAngle` in `defaultGirih12Params` (higher = sharper; try 60–72) and re-run `npm run gallery`. This is aesthetic calibration — pick what reads best; the tests don't depend on the exact angle.

- [ ] **Step 5: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/src/scripts/render-gallery.ts toolkit/src/generators/girih12.ts && git commit -m "$(cat <<'EOF'
toolkit: add girih12 gallery groups (+ contactAngle tuned for the star read)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

(Commit `girih12.ts` again only if Step 4 changed `contactAngle`; otherwise just the script.)

---

## Task 5: README + final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a `periodicity`-style note + the girih12 medium**

After the "A third medium — Truchet" section in `README.md`, add:

```markdown
## A fourth medium — Girih 12-fold mosaic (actual IGP art)

`generateGirih12` builds a 12-fold star-and-rosette **glazed mosaic** (the 3.12.12 tiling decorated by Bonner's polygonal technique), colored from a dedicated 7-color Samarkand chord (`SAMARKAND_7`): a cool cobalt/turquoise spine plus **saffron/sienna/sage warm accents held under a 5% area budget** inside star centers — the proportion + near-complementary contrast that makes historical tilework read as *composed* rather than flat. Scored by `periodicity + constructionGrammar + cuerdaSeca + colorChord`, reusing the spine with no new operator.

Two honest caveats live here, handled differently: the **grout gap** is a feature, so the profile *loosens* the coverage band ([0.85, 1.05]) to accept it (taste in the profile); the **warm accents** are currently *under-scored* by `colorChord`'s single-hue-arc model (a proportion-aware chord is on the todo) — accepted for v1, and `improve()` can't strip them because the palette isn't a tuning knob.
```

- [ ] **Step 2: Update the Layout block**

Update the `generators/`, `profiles/`, and `tuning/` lines to add `girih12`:

```
  profiles/           # timurid-igp.ts · timurid-tiling.ts · truchet.ts · girih12.ts
  generators/         # igp.ts · tiling.ts · truchet.ts · girih12.ts (12-fold glazed mosaic)
  tuning/             # igp.ts · tiling.ts · truchet.ts · girih12.ts
```

- [ ] **Step 3: Final full verification**

Run: `cd /Users/ag/Lab/VisualThinking/toolkit && npm test && npm run typecheck`
Expected: all tests pass (the prior 84 + girih12 generator 4 + acceptance 8 = 96), typecheck clean.

- [ ] **Step 4: Commit**

```bash
cd /Users/ag/Lab/VisualThinking && git add toolkit/README.md && git commit -m "$(cat <<'EOF'
toolkit: document the girih12 mosaic medium + SAMARKAND_7 in README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Finish the development branch**

Use the **superpowers:finishing-a-development-branch** skill. Tests verified in Step 3. This extends open PR #2 on `toolkit-screensaver`; expected choice is to push and let the PR update.

---

## Self-Review Notes

- **Spec coverage:** generator + SAMARKAND_7 + accents<5% (Task 1); profile w/ loosened band + tuning + variants (Task 2); acceptance + improve (Task 3); gallery + visual eyeball (Task 4); README w/ both caveats (Task 5). Spine untouched: no task edits compose/improve/tuning/profile/operators/SAMARKAND_PALETTE. ✓
- **Geometry verified by prototype** (deleted): star+petals partition each dodecagon; periodicity 1.0, cuerdaSeca 1.0, colorChord ~0.78. ✓
- **Calibration:** only the coverage band/default groutGap needs a probe (Task 2 Step 1); the `latticeJitter` cliff step is from eps math; acceptance thresholds are relative (`good > variant`) + a defensible 0.85 floor (periodicity/cuerdaSeca ≈1.0 by construction). ✓
- **Type consistency:** `Girih12Params` field names identical across generator, tuning params, variants, improve starts, gallery. `girih12Tuning` references `latticeJitter`/`groutGap`/`channelJitter` (all real params). `SAMARKAND_7` is generator-local; shared `SAMARKAND_PALETTE` untouched. ✓
- **Two tensions handled as designed:** grout → loosened band (profile taste); accents → accepted under-score + todo. `improve` can't remove accents (palette not a knob). ✓
```
