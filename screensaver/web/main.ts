// The θ-breath screensaver. A fixed polygon grid (the invisible major grid) is
// re-decorated every frame at a contact angle that breathes between median (calm)
// and acute (tense) — the variation principle animated. The geometry stays
// crystalline; the LIFE is entirely in the motion + tension:
//   · directed tension (c-000068): acute angles thrust → the pattern tightens/relaxes
//   · organic motion (c-000067): never constant-rate; θ is driven by noise-perturbed
//     oscillation so it never perfectly repeats ("perfect repetition reads as dead").
import { buildTiling, buildOctagonSquareTiling, buildDodecagonTriangleTiling, strapworkPlanField, LINE_PALETTE, CLEAN_TYPES, type PolyTiling } from "../../toolkit/src/generators/polygonal";
import { renderToCanvas } from "../../toolkit/src/renderers/canvas";
import type { Vec2 } from "../../toolkit/src/render-plan";

const params = new URLSearchParams(location.search);
const GRID = params.get("grid") ?? "dod12"; // "dod12" = 12-star girih · "octsq" = 8-star · else a tactile-js type
const TYPE = Number(params.get("type") ?? CLEAN_TYPES[1]); // tactile-js tiling index (when grid≠octsq)
const SCALE = Number(params.get("scale") ?? 84);
const PERIOD = Number(params.get("period") ?? 14); // seconds per breath
// Breath stays low-to-mid: at high θ the central star balloons into a huge empty motif
// that dominates the field (boring). [39,55] keeps every motif modest.
const CENTER = Number(params.get("center") ?? 47); // θ midpoint
const AMP = Number(params.get("amp") ?? 8); // θ swing → θ ∈ [39, 55]
const WAVELEN = Number(params.get("wave") ?? 540); // spatial wavelength of the travelling wave (px)
const WAVE_DIR = (Number(params.get("dir") ?? 28) * Math.PI) / 180; // travel direction
const LINE_W = Number(params.get("line") ?? 1.5);
const HUD = params.get("hud") === "1"; // opt-in (debug)

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
const nAmp = makeNoise(23), nPhase = makeNoise(37);

// θ as a travelling wave over space + time: the breath, but with a spatial phase so
// it SWEEPS across the grid (propagating tile-replacement) rather than moving in
// lock-step. θ depends only on the edge midpoint, so two cells sharing an edge agree
// and strands stay continuous. (Global breath is the WAVELEN→∞ limit of this.)
const dirX = Math.cos(WAVE_DIR), dirY = Math.sin(WAVE_DIR);
function angleAt(mid: Vec2, tSec: number): number {
  const proj = mid[0] * dirX + mid[1] * dirY;
  const ampJit = 1 + 0.10 * nAmp(tSec * 0.07);
  const phase = 2 * Math.PI * (proj / WAVELEN) - 2 * Math.PI * (tSec / PERIOD) + 0.3 * nPhase(tSec * 0.03);
  return CENTER + AMP * ampJit * Math.sin(phase);
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
  const bounds = { width: cssW, height: cssH };
  grid = GRID === "dod12"
    ? buildDodecagonTriangleTiling({ bounds, scale: SCALE })
    : GRID === "octsq"
    ? buildOctagonSquareTiling({ bounds, scale: SCALE })
    : buildTiling({ typeIndex: TYPE, bounds, scale: SCALE });
  console.log(`rebuild · ${cssW}×${cssH} · grid ${GRID} · ${grid.polys.length} tiles`);
}

const t0 = performance.now();
let frames = 0, lastFpsT = t0, fps = 0;
function frame(): void {
  try {
    const now = performance.now();
    const tSec = (now - t0) / 1000;
    const plan = strapworkPlanField(grid, (mid) => angleAt(mid, tSec), LINE_PALETTE);
    renderToCanvas(plan, ctx, { lineWidth: LINE_W });

    frames++;
    if (now - lastFpsT >= 500) { fps = Math.round((frames * 1000) / (now - lastFpsT)); frames = 0; lastFpsT = now; }
    if (HUD) {
      ctx.fillStyle = "#c0392b";
      ctx.font = "16px ui-monospace, monospace";
      ctx.fillText(`θ~${angleAt([cssW / 2, cssH / 2], tSec).toFixed(1)}°   t ${tSec.toFixed(1)}s   ${fps} fps`, 14, 24);
    }
  } catch (err) {
    console.error("frame error:", err);
  }
  requestAnimationFrame(frame); // always reschedule, even on error
}

window.addEventListener("resize", rebuild);
rebuild();
requestAnimationFrame(frame);
console.log(`travelling-wave girih · θ ${CENTER}±${AMP}° · wave ${WAVELEN}px @ ${Math.round((WAVE_DIR * 180) / Math.PI)}° over ${PERIOD}s · grid ${GRID}`);
