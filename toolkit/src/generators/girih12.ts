import type { Element, Oklch, RenderPlan, Vec2 } from "../render-plan";
import { centroid, scaleAbout } from "../geom";

// Dedicated 7-colour Samarkand chord (+ cream = 8 entries). Indices 0–3 cool
// spine, 4 cream channel, 5–7 warm accents. NOT the shared SAMARKAND_PALETTE —
// the other generators derive bg/cream/fill indices from that array's length.
export const SAMARKAND_7: Oklch[] = [
  { l: 0.45, c: 0.12, h: 240 }, // 0 cobalt — star
  { l: 0.62, c: 0.11, h: 200 }, // 1 turquoise — petal A
  { l: 0.72, c: 0.09, h: 190 }, // 2 light-turquoise — petal B / triangle
  { l: 0.30, c: 0.06, h: 250 }, // 3 deep-blue — ground (shows only in grout)
  { l: 0.95, c: 0.01, h: 200 }, // 4 cream — cuerda-seca channel (neutral)
  { l: 0.78, c: 0.13, h: 80 },  // 5 saffron — warm accent (symmetric)
  { l: 0.50, c: 0.10, h: 50 },  // 6 sienna — (reserved for future symmetric role)
  { l: 0.62, c: 0.05, h: 135 }, // 7 sage — (reserved)
];
const BG = 3, CREAM = 4, STAR = 0, PETAL_A = 1, PETAL_B = 2, TRI = 2, ACCENT = 5;

export interface Girih12Params {
  bounds: { width: number; height: number };
  dodecaRadius: number;   // R — dodecagon circumradius
  contactAngle: number;   // degrees; starRatio = cos(contactAngle) — bigger = sharper star
  groutGap: number;       // 0 = regions touch; >0 insets each region (dark grout between glazes)
  channelWidth: number;   // cuerda-seca cream stroke width
  channelJitter: number;  // 0 = uniform; >0 perturbs per-region channel (degrades cuerdaSeca)
  latticeJitter: number;  // 0 = clean lattice; >0 drifts each dodecagon (degrades periodicity)
  accentStride: number;   // warm accent on a sub-lattice: dodecagons where i%stride==0 && j%stride==0
  palette: Oklch[];
  rngSeed: number;
}

export function defaultGirih12Params(): Girih12Params {
  return {
    bounds: { width: 800, height: 800 }, dodecaRadius: 70, contactAngle: 65,
    groutGap: 0.15, channelWidth: 4, channelJitter: 0, latticeJitter: 0,
    accentStride: 4, palette: SAMARKAND_7, rngSeed: 1,
  };
}

function hash(i: number, j: number, seed: number): number {
  const s = Math.sin(i * 73.13 + j * 914.7 + seed * 131.7) * 43758.5453;
  return s - Math.floor(s);
}
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function generateGirih12(params: Girih12Params = defaultGirih12Params()): RenderPlan {
  const { bounds, dodecaRadius: R, contactAngle, groutGap, channelWidth, channelJitter, latticeJitter, accentStride, palette, rngSeed } = params;
  const W = bounds.width, H = bounds.height;
  const a = R * Math.cos(Math.PI / 12);
  const D = 2 * a;
  const s = 2 * R * Math.sin(Math.PI / 12);     // dodecagon edge length
  const triApexR = a + (s * Math.sqrt(3)) / 2;  // equilateral triangle apex, radial
  const starRatio = Math.cos((contactAngle * Math.PI) / 180);
  const inset = (pts: Vec2[]) => (groutGap > 0 ? scaleAbout(pts, centroid(pts), 1 - groutGap) : pts);

  const elements: Element[] = [
    { kind: "polygon", role: "background", points: [[0, 0], [W, 0], [W, H], [0, H]], colorRef: BG },
  ];

  // deterministic per-region channel width (uniform unless channelJitter > 0)
  let cellSeq = 0;
  const channelOf = (): number => {
    if (channelJitter === 0) return channelWidth;
    const t = Math.sin(cellSeq++ * 91.7) * 43758.5453;
    return channelWidth * Math.max(0, 1 + channelJitter * ((t - Math.floor(t)) * 2 - 1));
  };

  const u1: Vec2 = [D, 0];
  const u2: Vec2 = [D * Math.cos(Math.PI / 3), D * Math.sin(Math.PI / 3)];
  const triSeen = new Set<string>();

  // Shear-aware lattice range: rows shift right by j·D/2, so i must start
  // increasingly negative to keep the lower-left filled (off-canvas dodecagons
  // are culled by the bounds check; their on-canvas tiles still draw).
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
      const Vk = (k: number): Vec2 => [cx + R * Math.cos((Math.PI / 6) * k + Math.PI / 12), cy + R * Math.sin((Math.PI / 6) * k + Math.PI / 12)];
      const Mk = (k: number): Vec2 => [cx + a * Math.cos((Math.PI / 6) * k), cy + a * Math.sin((Math.PI / 6) * k)];
      const Ik = (k: number): Vec2 => [cx + a * starRatio * Math.cos((Math.PI / 6) * k + Math.PI / 12), cy + a * starRatio * Math.sin((Math.PI / 6) * k + Math.PI / 12)];

      // 12-point star — warm accent on a symmetric sub-lattice (never scattered)
      const star: Vec2[] = [];
      for (let k = 0; k < 12; k++) { star.push(Mk(k)); star.push(Ik(k)); }
      const isAccent = accentStride > 0 && mod(i, accentStride) === 0 && mod(j, accentStride) === 0;
      elements.push({ kind: "polygon", role: "tile", points: inset(star), colorRef: isAccent ? ACCENT : STAR, strokeRef: CREAM, channel: channelOf(), motifId: "star" });

      // 12 petals/kites — symmetric 2-colour alternation by edge parity ("every other kite")
      for (let k = 0; k < 12; k++) {
        const petal: Vec2[] = [Mk(k), Vk(k), Mk((k + 1) % 12), Ik(k)];
        elements.push({ kind: "polygon", role: "tile", points: inset(petal), colorRef: k % 2 === 0 ? PETAL_A : PETAL_B, strokeRef: CREAM, channel: channelOf(), motifId: "petal" });
      }

      // interstitial triangles — GLAZED tiles (no empty gaps). Odd-k edges border
      // a triangle; apex is radial. Each is shared by 3 dodecagons → dedup by
      // rounded centroid (a clean lattice merges them; jitter leaves them ragged).
      for (let k = 1; k < 12; k += 2) {
        const apex: Vec2 = [cx + triApexR * Math.cos((Math.PI / 6) * k), cy + triApexR * Math.sin((Math.PI / 6) * k)];
        const tri: Vec2[] = [Vk(k - 1), Vk(k), apex];
        const c = centroid(tri);
        const key = `${Math.round(c[0])},${Math.round(c[1])}`;
        if (triSeen.has(key)) continue;
        triSeen.add(key);
        if (c[0] < -R || c[0] > W + R || c[1] < -R || c[1] > H + R) continue;
        elements.push({ kind: "polygon", role: "tile", points: inset(tri), colorRef: TRI, strokeRef: CREAM, channel: channelOf(), motifId: "triangle" });
      }
    }
  }

  return {
    bounds, symmetry: { group: "p6m", lattice: [u1, u2], center: [W / 2, H / 2], order: 12 },
    palette, elements, region: [[0, 0], [W, 0], [W, H], [0, H]],
  };
}
