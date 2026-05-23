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
const PERIOD = Number(params.get("period") ?? 8); // seconds per breath (short while we tune)
const CENTER = Number(params.get("center") ?? 40); // θ midpoint (deg)
const AMP = Number(params.get("amp") ?? 16); // θ swing (deg): median ~56 ↔ acute ~24
const LEVELS = Number(params.get("levels") ?? 2); // 1 = single-pass; 2+ = multi-level rosette
const LINE_W = Number(params.get("line") ?? 1.5);
const HUD = params.get("hud") !== "0"; // on by default while debugging

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
let cssW = 0, cssH = 0;
function rebuild(): void {
  const dpr = window.devicePixelRatio || 1;
  cssW = window.innerWidth; cssH = window.innerHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
  grid = buildTiling({ typeIndex: TYPE, bounds: { width: cssW, height: cssH }, scale: SCALE });
  console.log(`rebuild · ${cssW}×${cssH} · tiling IH-index ${TYPE} · ${grid.polys.length} tiles`);
}

const t0 = performance.now();
let frames = 0, lastFpsT = t0, fps = 0;
function frame(): void {
  try {
    const now = performance.now();
    const tSec = (now - t0) / 1000;
    const theta = thetaAt(tSec);
    const plan = strapworkPlan(grid, theta, { palette: LINE_PALETTE, levels: LEVELS });
    renderToCanvas(plan, ctx, { lineWidth: LINE_W });

    frames++;
    if (now - lastFpsT >= 500) { fps = Math.round((frames * 1000) / (now - lastFpsT)); frames = 0; lastFpsT = now; }
    if (HUD) {
      ctx.fillStyle = "#c0392b";
      ctx.font = "16px ui-monospace, monospace";
      ctx.fillText(`θ ${theta.toFixed(1)}°   t ${tSec.toFixed(1)}s   ${fps} fps`, 14, 24);
    }
  } catch (err) {
    console.error("frame error:", err);
  }
  requestAnimationFrame(frame); // always reschedule, even on error
}

window.addEventListener("resize", rebuild);
rebuild();
requestAnimationFrame(frame);
console.log(`θ-breath start · breath ${CENTER}±${AMP}° over ${PERIOD}s · levels ${LEVELS} · hud=${HUD}`);
