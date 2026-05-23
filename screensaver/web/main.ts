// The θ-breath screensaver. A fixed polygon grid (the invisible major grid) is
// re-decorated every frame at a contact angle that breathes between median (calm)
// and acute (tense) — the variation principle animated. The geometry stays
// crystalline; the LIFE is entirely in the motion + tension:
//   · directed tension (c-000068): acute angles thrust → the pattern tightens/relaxes
//   · organic motion (c-000067): never constant-rate; θ is driven by noise-perturbed
//     oscillation so it never perfectly repeats ("perfect repetition reads as dead").
import { buildTiling, strapworkPlan, LINE_PALETTE, CLEAN_TYPES, type PolyTiling } from "../../toolkit/src/generators/polygonal";
import { renderToCanvas } from "../../toolkit/src/renderers/canvas";

const params = new URLSearchParams(location.search);
const TYPE = Number(params.get("type") ?? CLEAN_TYPES[1]); // tactile-js tiling index (default IH7)
const SCALE = Number(params.get("scale") ?? 96);
const PERIOD = Number(params.get("period") ?? 26); // seconds per breath
const CENTER = Number(params.get("center") ?? 42); // θ midpoint (deg)
const AMP = Number(params.get("amp") ?? 12); // θ swing (deg): median ~54 ↔ acute ~30
const LINE_W = Number(params.get("line") ?? 1.5);

const canvas = document.getElementById("c") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// 1-D value noise in [-1,1], smoothstep-interpolated — the organic perturbation source.
function makeNoise(seed: number): (x: number) => number {
  const hash = (i: number) => { const v = Math.sin((i + seed) * 127.1) * 43758.5453; return (v - Math.floor(v)) * 2 - 1; };
  return (x: number) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return hash(i) * (1 - u) + hash(i + 1) * u;
  };
}
const nFreq = makeNoise(11), nAmp = makeNoise(23), nPhase = makeNoise(37);

// θ(t): a slow breath, organically perturbed so it never loops exactly.
function thetaAt(tSec: number): number {
  const baseFreq = 1 / PERIOD;
  const freqJit = 1 + 0.15 * nFreq(tSec * 0.05);
  const ampJit = 1 + 0.10 * nAmp(tSec * 0.07);
  const phase = 0.4 * nPhase(tSec * 0.03);
  const osc = Math.sin(2 * Math.PI * baseFreq * tSec * freqJit + phase);
  return CENTER + AMP * ampJit * osc;
}

let grid: PolyTiling;
function rebuild(): void {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
  grid = buildTiling({ typeIndex: TYPE, bounds: { width: w, height: h }, scale: SCALE });
}

const t0 = performance.now();
function frame(): void {
  const tSec = (performance.now() - t0) / 1000;
  const plan = strapworkPlan(grid, thetaAt(tSec), LINE_PALETTE);
  renderToCanvas(plan, ctx, { lineWidth: LINE_W });
  requestAnimationFrame(frame);
}

window.addEventListener("resize", rebuild);
rebuild();
requestAnimationFrame(frame);
console.log(`θ-breath · tiling IH-index ${TYPE} · breath ${CENTER}±${AMP}° over ${PERIOD}s`);
