// The crossfade screensaver shell. Each cycle the variety engine produces a new
// tasteful girih12 mosaic; we render it to the hidden layer and dissolve it in over
// the visible one. Endless. Seeded from the clock (so every launch differs) or from
// ?seed= for a reproducible run. ?hold= / ?fade= tune the timing while eyeballing.
//
// This shell is deliberately thin: a compositor (two layers + opacity), NOT a
// per-frame redraw loop. The "morph" is a dissolve, so no canvas renderer or plan
// interpolation is needed yet — the consumer revealed exactly which toolkit piece
// was load-bearing (variety) and which was speculative (a canvas adapter).
import { generateArt } from "../../toolkit/src/variety";
import { renderSvg } from "../../toolkit/src/renderers/svg";

const params = new URLSearchParams(location.search);
const HOLD = Number(params.get("hold")) || 20000; // ms a mosaic stays before the next dissolves in
const FADE = Number(params.get("fade")) || 6000;  // ms crossfade duration (must match the CSS var)
let seed = Number(params.get("seed")) || (Date.now() >>> 0);

const layers = [document.getElementById("a"), document.getElementById("b")].filter(Boolean) as HTMLElement[];
layers.forEach((l) => l.style.setProperty("--fade", `${FADE}ms`));
let front = -1; // index of the currently-visible layer; -1 before the first frame

// The render-plan SVG is a fixed 800×800 square; let it cover the viewport instead
// of letterboxing (square art, any screen) by switching to slice + fluid sizing.
function fitToViewport(host: HTMLElement): void {
  const svg = host.querySelector("svg");
  if (!svg) return;
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
}

function next(): void {
  const { plan, meta } = generateArt(seed++);
  const back = front < 0 ? 0 : 1 - front;
  layers[back].innerHTML = renderSvg(plan);
  fitToViewport(layers[back]);
  void layers[back].offsetWidth; // force reflow so the transition runs from opacity 0
  layers[back].style.opacity = "1";
  if (front >= 0) layers[front].style.opacity = "0";
  front = back;
  const hue = Math.round((meta.hueArc.lo + meta.hueArc.hi) / 2);
  console.log(`seed ${meta.seed} · ${meta.generator} · score ${meta.score.toFixed(3)} · hue ${hue}°`);
}

next();
setInterval(next, HOLD);
