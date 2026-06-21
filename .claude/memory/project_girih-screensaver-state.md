---
name: project_girih-screensaver-state
description: Build state of the girih line-art screensaver (toolkit + screensaver/) as of 2026-05-23 — what shipped, the open "static wave" issue, and next steps
metadata:
  type: project
---

State of the **girih line-art screensaver** (branch `toolkit-screensaver`, PR #2), end of 2026-05-23 session. Supersedes the screensaver parts of [[project_subsystem-trajectory]] for current direction.

## Direction (settled this session)
Monochrome **line strapwork** (no colour), **dense interlocking-star girih**, on a **fixed major grid** with a **propagating animation**. Driven by a wiki consult (geometric form + organic motion + directed tension): the geometry stays crystalline; life is in the motion. Earlier colored girih12 mosaic stays as a separate medium.

## What shipped (toolkit/src/)
- `generators/strapwork.ts` — Hankin polygons-in-contact (PIC) inference. `inferStrapwork(verts, angle)` where angle is one number OR **per-edge array**. Inward normal from polygon **winding** (handles non-convex bowtie). `inferStrapworkDetailed` also returns crossing points.
- `generators/girih.ts` — the 5 Lu-Steinhardt tiles (decagon/pentagon/hexagon/bowtie/rhombus) via turtle build; `place()`, `attach()` (edge-matching). **Key fact: a girih tile's decoration = PIC at 54° from the edge** (the 72/108 rule). So our engine already does girih; intricacy is about the TILING.
- `generators/polygonal.ts` — `buildTiling` (tactile-js isohedral, curated `CLEAN_TYPES`), `buildOctagonSquareTiling` (4.8.8 → dense 8-star girih), `buildDodecagonTriangleTiling` (3.12.12 → dense 12-star girih), `strapworkPlan` (single angle, + `levels` multi-level — DEPRECATED, see below), `strapworkPlanField(tiling, angleAt)` (**per-edge angle = function of midpoint → continuity free**), `generatePolygonal`.
- `renderers/canvas.ts` — `renderToCanvas` (per-frame redraw adapter; 2nd renderer, proves render-plan is renderer-agnostic).
- `variety.ts` — seeded variety engine (built earlier; girih12-based; not yet wired to the line generator).
- 142 tests green; tsc clean.

## screensaver/ (the shell)
- `web/main.ts` — fixed grid (default `grid=dod12`), decorated every frame by `strapworkPlanField` with a **travelling-wave** angle field: `θ = CENTER + AMP·sin(2π·proj/WAVELEN − 2π·t/PERIOD)`, organically noise-perturbed. Continuity preserved because θ is a function of edge midpoint. Canvas, DPR-aware, HUD opt-in (`?hud=1`). esbuild bundles (`npm run dev` serves localhost:5500; `npm run build`).
- Knobs: `?grid=dod12|octsq|<tactile#>` `?scale` `?center` `?amp` `?period` `?wave` `?dir` `?line` `?hud`.
- Settled defaults: dod12, θ 47±8 over 14s, scale 84, wave 540px @28°.

## OPEN ISSUE (next session) — wave reads as static
User: "pattern seems static, no tiles being replaced." Cause: **AMP=8 is too small** — across θ∈[39,55] the 12-star motif barely changes, so the travelling wave's passage is imperceptible (same perception trap as the original 26s breath). The wave IS advancing.
- **Fix to try:** widen toward the acute side — `center≈44 amp≈12` (θ∈[32,56]); low θ is busy-not-boring, high θ (>~64) balloons into a huge empty star (the thing user explicitly disliked — keep the high cap). Shorten `?wave` so the front is visible.
- **Clarify with user:** continuous morph-wave (what's built) vs **visibly discrete cluster replacement** — the user's words ("tiles being replaced") may want regions switching to a *genuinely different motif/sub-tiling*, not just a θ shift. That's a different mechanism (swap a cluster's decoration style/tiling, not its contact angle).

## Craft rules learned (the user caught these; see [[feedback_extract-rules-before-generating]])
- **IGP intricacy = MORE TILES (interlocking stars+polygons) or self-similar subdivision — NEVER concentric nesting.** A "star inside a star" ring is a free-floating loop, not a cuttable/glazeable tile. Decoration must be **tile-realizable** (PIC straps satisfy this: open polylines terminating at edge midpoints).
- **Regular decagons can't tile periodically** (10-fold ⊥ any lattice) — that's why historical decagonal girih is quasiperiodic. Periodic dense-star girih = 8-fold (octagon-square) or 12-fold (dodecagon); true 10-fold (the user's Image #4) needs the quasiperiodic pentagrid.
- "No motif should occupy too much visual space" — a real transferable measure (motif/coverage balance); candidate operator. For now handled by capping the breath band.

## Next options (user to pick)
1. Fix the static-wave feel (above) + per-launch variety (random clean tiling/dir) + the **`.saver`** bundle (WKWebView loads the same static build).
2. **Quasiperiodic decagonal (pentagrid)** — true non-repeating 10-fold girih (Image #4 endgame). Port pentagrid math from patterncollider (MIT).
3. **Two-level self-similar** girih (Azari Fig 9 / Darb-i Imam) — scaled girih in every region + heavy overlay lines.

## Wiki additions this session
Ingested Azari et al. 2023 (`wiki/sources/...Azari...`, c-000231) + new concept **The Variation Principle in Islamic Geometric Patterns** (c-000232). Radial girih noted as a worthwhile alternate generator (not built).
