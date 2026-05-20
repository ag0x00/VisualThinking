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
  // For tiles: the cuerda-seca channel (cream separating line) width, in px.
  // Rendered as the cream stroke; cuerdaSeca scores its completeness + uniformity.
  channel?: number;
}

export interface RenderPlan {
  bounds: { width: number; height: number };
  symmetry: Symmetry;
  palette: Oklch[];
  elements: Element[];
  // For tile-based plans: the boundary polygon the cells are meant to fill.
  // constructionGrammar measures coverage against this (it must not scale with
  // the cells, or gap/overlap would be undetectable).
  region?: Vec2[];
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
