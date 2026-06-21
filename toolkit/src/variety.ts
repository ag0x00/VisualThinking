import { clampChroma } from "culori";
import type { Oklch, RenderPlan } from "./render-plan";
import { generateGirih12, defaultGirih12Params, type Girih12Params } from "./generators/girih12";
import { girih12Profile } from "./profiles/girih12";
import { compose } from "./compose";
import type { AestheticProfile } from "./profile";

// The variety engine. One seeded integer → a new, tasteful-by-construction 12-fold
// mosaic + roaming-family palette. The toolkit's operators already encode taste
// (compose scores a plan); this samples the *input space* and uses the score only
// as a FLOOR GUARD — accept the first sample that clears the floor, else keep the
// best seen. Not best-of-N: best-of-N is an optimiser that converges output toward
// the profile's favourite region and erodes the variety we are after.

// ── seeded RNG ───────────────────────────────────────────────────────────────
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const range = (rng: () => number, lo: number, hi: number): number => lo + (hi - lo) * rng();
const int = (rng: () => number, lo: number, hi: number): number => Math.floor(lo + (hi - lo + 1) * rng());
const pick = <T>(rng: () => number, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];

// ── procedural chord ─────────────────────────────────────────────────────────
// A graded cool-ish spine within one hue family + neutral cream + a near-complementary
// accent. Emitted in girih12's SAMARKAND_7 index layout: only 0,1,2 (spine), 4 (cream),
// 5 (accent) are read by the generator; 3/6/7 are valid filler. Every colour is
// gamut-mapped into sRGB so it renders true. The arc follows the family, so the chord
// scores well wherever the family roams.
export interface Chord {
  palette: Oklch[];
  hueArc: { lo: number; hi: number };
}

const gamut = (o: Oklch): Oklch => {
  const cl = clampChroma({ mode: "oklch", l: o.l, c: o.c, h: o.h }, "oklch") as { l: number; c: number; h?: number };
  return { l: cl.l, c: cl.c, h: cl.h ?? o.h };
};
const norm360 = (h: number): number => ((h % 360) + 360) % 360;

export function randomChord(rng: () => number): Chord {
  const h0 = range(rng, 0, 360);
  const spread = range(rng, 22, 45);
  const inFamily = (): number => h0 + range(rng, -spread, spread);

  const spine: Oklch[] = [
    { l: range(rng, 0.38, 0.44), c: range(rng, 0.10, 0.14), h: inFamily() }, // 0 star (dark)
    { l: range(rng, 0.56, 0.62), c: range(rng, 0.09, 0.13), h: inFamily() }, // 1 petal A (mid)
    { l: range(rng, 0.68, 0.74), c: range(rng, 0.08, 0.11), h: inFamily() }, // 2 petal B / triangle (light)
  ];
  const cream: Oklch = { l: range(rng, 0.94, 0.96), c: 0.012, h: h0 }; // 4 neutral
  const accent: Oklch = { l: range(rng, 0.62, 0.80), c: range(rng, 0.10, 0.14), h: h0 + 180 + range(rng, -25, 25) }; // 5

  const palette = [spine[0], spine[1], spine[2], spine[0], cream, accent, spine[1], spine[2]].map(gamut);
  return { palette, hueArc: { lo: norm360(h0 - spread), hi: norm360(h0 + spread) } };
}

// ── param sampler ────────────────────────────────────────────────────────────
// Geometry knobs sampled within tasteful ranges. groutGap is fixed at the
// render-faithful sweet spot; jitter is held at 0 (it only ever degrades the
// periodicity / cuerda-seca scores). The palette + matching arc come from the chord.
export function sampleGirih12(rng: () => number): { params: Girih12Params; hueArc: { lo: number; hi: number } } {
  const { palette, hueArc } = randomChord(rng);
  return {
    params: {
      ...defaultGirih12Params(),
      contactAngle: range(rng, 55, 72),
      dodecaRadius: range(rng, 55, 90),
      accentStride: pick(rng, [3, 4, 5]),
      channelWidth: range(rng, 3, 6),
      groutGap: 0.05,
      channelJitter: 0,
      latticeJitter: 0,
      palette,
      rngSeed: int(rng, 1, 1 << 20),
    },
    hueArc,
  };
}

// ── entry ────────────────────────────────────────────────────────────────────
export interface ArtMeta {
  seed: number;
  generator: "girih12";
  params: Girih12Params;
  hueArc: { lo: number; hi: number };
  score: number;
  tries: number;
}
export interface Art {
  plan: RenderPlan;
  score: number;
  meta: ArtMeta;
}

// girih12Profile with the colorChord binding's hueArc swapped for this run's family,
// so the chord is judged on coherence-within-family + balance, not "is it blue".
function profileForFamily(arc: { lo: number; hi: number }): AestheticProfile {
  return {
    ...girih12Profile,
    operators: girih12Profile.operators.map((b) =>
      b.operator === "colorChord"
        ? { ...b, target: { ...(b.target as Record<string, unknown>), hueArc: arc } }
        : b
    ),
  };
}

export function generateArt(seed: number, opts: { floor?: number; maxTries?: number } = {}): Art {
  const floor = opts.floor ?? 0.9;
  const maxTries = opts.maxTries ?? 5;
  const rng = mulberry32(seed);

  let best: Art | undefined;
  for (let tries = 1; tries <= maxTries; tries++) {
    const { params, hueArc } = sampleGirih12(rng);
    const plan = generateGirih12(params);
    const score = compose(plan, profileForFamily(hueArc)).composite;
    const art: Art = { plan, score, meta: { seed, generator: "girih12", params, hueArc, score, tries } };
    if (!best || score > best.score) best = art;
    if (score >= floor) return art; // accept as sampled — variety preserved
  }
  return best!; // none cleared the floor: the best we saw
}
