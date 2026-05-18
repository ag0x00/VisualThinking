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
