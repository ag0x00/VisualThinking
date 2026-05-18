---
name: brainstorm-state
description: "In-progress brainstorm for toolkit-screensaver MVP; session was relaunched to load wiki MCP"
metadata:
  type: project
---

## In-progress brainstorm (paused for MCP relaunch 2026-05-18)

Mid-brainstorm for **Subsystem B-via-C** (toolkit + screensaver MVP) on branch `toolkit-screensaver`. Session paused so [[subsystem-trajectory|the wiki MCP we just shipped]] can be loaded as a tool from `.mcp.json`.

### Vision anchor (locked)

User-provided: Samarkand blue-tile aesthetic (Timurid IGPs). 9 reference images at `~/Downloads/blue tiles of samarkand/`. User confirmed my read; key facts:

- **Origin** — Timurid / Samarkand-Uzbek tile tradition (Shah-i-Zinda, Registan-adjacent, Hazrati Imam-style)
- **Palette spine** — lapis cobalt × turquoise blue-chord. Cream as breathing space. Saffron / sienna / sage as low-coverage accents (<5%). Black/dark-blue cuerda-seca outlines
- **Pattern grammar** — three coexisting wallpaper-group systems: p4m / 8-fold Khatam stars, p6m / 12-fold rosettes with strap-work + floral infill, p6m / 6-fold star-and-hex
- **Treatment** — cuerda seca outlines non-negotiable; glaze pooling; patina/weathering; multi-scale hierarchy

### Locked design decisions

- **Fidelity** — interpretive, geometry-led. Blue chord preserved. Heart of the medium honored without literal reproduction
- **Mathematical engine** — Bonner's polygonal-technique parameterization per `wiki/concepts/Islamic Geometric Patterns and the Polygonal Technique.md` (c-000191). Fixed: polygonal underlay (defines symmetry group + scaffolding). Variable: pattern-line rule (entry points + crossing angles per polygon type)
- **Animation strategy** — vary rule while keeping underlay. Symmetry group preserved (p4m stays p4m). Only line-crossings morph. Maps to how adjacent IGP bays in real architecture combine different varieties at the same scale
- **Imperfections** — procedural, in-shader. Per-cell glaze-pool noise, edge-bleed at cuerda-seca boundaries, sub-pixel micro-rotation, soft Lambertian shading. No asset textures
- **Cadence** — option C (continuous slow morph, no discrete swaps)
- **Interplay** — NOT whole-screen swap. Before/after patterns coexist spatially while one fades and the other emerges. Spatial-temporal interpenetration. User's exact words: "I want both 'before' and 'after' patterns interplay with each other while gradually replacing one another"

### MCP dogfooding decision

The wiki MCP we shipped as Subsystem A is registered at `.mcp.json` (project scope) pointing at `mcp/dist/index.js`. **Toolkit will be runtime-independent of the MCP**; MCP is dev-time companion (Claude consults it during toolkit authoring). Confirmed by the design pattern alone.

### Open clarifying questions (next, in order)

1. **Interplay mechanism** — region-based wavefront vs cell-by-cell timing vs full superposition (alpha-blended overlays) vs interleaved-scales. Visual companion screen for this one
2. **Spatial driver** for interplay — linear wavefront, radial, Voronoi, low-frequency noise field, advected flow?
3. **Default symmetry group** — p4m (8-fold) primary, p6m (12-fold) secondary? Or rotate?
4. **Screensaver host** — WebView `.saver` still preferred (per `subsystem-trajectory`)?
5. **Repo structure** — toolkit/ + screensaver/ as siblings to `mcp/` in this repo?

### Visual companion state

- Server at `http://localhost:53796` (may have auto-exited if relaunch took > 30 min)
- Session dir: `.superpowers/brainstorm/13992-1779082369/`
- Latest pushed screen: `vision-read-v2.html`
- All content persists in `<session>/content/`; restart server with same `--project-dir` if needed

### Brainstorming-skill task state

Currently on task #3 (Ask clarifying questions, in_progress). Tasks #1, #2 completed. Tasks #4-9 pending. Tasks survive across sessions.

### Post-relaunch action

1. Verify `mcp__visualthinking-wiki__*` tools are loaded (look for `orient`, `search`, `getRelated` in tool list)
2. Read this memory + latest brainstorm screen
3. Use `orient` to get the wiki's IGP-relevant anchor pages with one query
4. Push interplay-mechanism options to visual companion
5. Continue brainstorming-skill flow

How to apply: read this file at session start; the brainstorm state is in this file plus the persisted HTML screens. Do not re-ask questions whose answers are listed above as "locked."

## Post-relaunch findings (2026-05-18, after IGP library landscape audit)

The brainstorm resumed after MCP relaunch and then detoured into a 4-parallel-subagent IGP library audit triggered by the user's reframing: **"the goal of this exercise is NOT to build a screensaver, actually. it's to figure out what works and what doesn't in our wiki+mcp+toolkit approach."** See `feedback_test-artifact-vs-workflow.md` and `feedback_npm-audit-before-design.md`.

### Locked design decisions (continued from above)

Earlier "locked" decisions about the mathematical engine still hold qualitatively, but the framing is sharpened by Lu-Steinhardt 2007:

- **Lines are the visible art; tiles (or girih tiles, or Bonner polygons) are scaffolding.** The construction is *lines first, tiles emergent as enclosed regions of the line network*. Multiple complex patterns share the same scaffold but differ in which lines are drawn.
- **Vocabulary** for MVP-1: NOT just rhombs + hexagons. Use Bonner's polygonal underlay + per-polygon line rule (or, equivalently, Lu-Steinhardt's 5 girih tiles with edge-line decorations). The atomic move is "place a decorated polygon"; the visible output is the line network across decorated polygon boundaries.
- **6-fold scaffold is the starting point** (p6 or p6m). "8-point" and "12-point" patterns are *local* rotational motifs on p4m / p6m, not independent global grids — per the crystallographic restriction theorem.

### Library landscape (results of 4-subagent audit)

Full synthesis: [[Research - IGP Library Landscape 2026-05-18]] (c-000226).

**Top candidates** for the toolkit's geometry core:
- **[[tactile-js]]** (BSD-3, Kaplan) — port the isohedral classification + edge-shape parameterization
- **[[wallpaper-groups]]** (npm, MIT) — 15-of-17 transform tables; pragmatic foundation
- **[[Alhambra]]** algorithms via Kaplan Bridges 2000 paper — `infer.h`, `rosette.h`, `inflation_tiling.h` (port from paper, not GPL code)
- **[[Alzulejo]]** (MIT, npm) — lift 2 algorithms (Hankin contact-angle + PlanarGraph)
- **[[PlotBoilerplate]]** (IkarosKappler, MIT, TS, npm) — modern geometry substrate; pending follow-up evaluation

**Significant gaps** no library covers (toolkit-original work regardless):
- Cuerda-seca rendering, glaze imperfections, OKLCH-tuned Samarkand palette, animation on symmetry orbits, Bonner's 5 girih tiles with semantic decoration overlays, Lu-Steinhardt subdivision.

**Recommendation locked**: **port the math, depend on nothing** for the geometry core. Use Alhambra `.tiling` files as visual-regression test oracle.

### Workflow lessons surfaced

1. `wiki_orient` under-surfaces named-tradition terms — logged to `mcp/tasks/lessons.md`
2. The wiki's IGP page was research-depth not implementation-depth — augmented with Implementation Landscape section (post-detour)
3. The wiki had zero IGP tool pages — 3 created this session
4. **npm-search audit must run before designing** — `feedback_npm-audit-before-design.md`
5. **Test artifact ≠ goal** — `feedback_test-artifact-vs-workflow.md`

### Next action (post-detour)

We are now in a position to actually start toolkit API design. The remaining open clarifying questions from above are mostly resolved or deprioritized:

- ~~Interplay mechanism~~ — defer until static MVP-1 ships
- ~~Spatial driver~~ — defer
- **Default symmetry group**: start with p6 (6-fold), per user's stated priority "6 point grid first, then 8, then 12"
- **Screensaver host**: WebView `.saver` still preferred (no contradiction surfaced)
- **Repo structure**: toolkit/ + screensaver/ as siblings to mcp/ in this repo

**Next clarifying questions** (or design questions, since we may have enough to proceed):
1. Toolkit module structure: `wallpaper/`, `polygon/`, `palette/`, `imperfections/`, `animation/` — proposal in design doc
2. Rendering backend for MVP-1: SVG (simplest, future-WebGPU upgrade path via renderer-agnostic toolkit) vs Canvas vs WebGPU from day one
3. PlotBoilerplate follow-up evaluation: yes/no — could substitute for manual port of geometry primitives

After these, transition to brainstorming-skill task #4 (Propose architecture approaches) and #5 (Present design sections).
