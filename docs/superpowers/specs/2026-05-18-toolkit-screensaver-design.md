# Toolkit + Samarkand Screensaver — Design Spec

**Date**: 2026-05-18
**Branch**: `toolkit-screensaver`
**Authors**: anton (user) + Claude
**Status**: draft for review

## Goal

Build **Subsystem B (toolkit)** and **Subsystem C (macOS screensaver)** in lockstep so the toolkit's API is shaped by one concrete consumer rather than designed in isolation (KISS, "B-via-C"). The screensaver is the test artifact; **the toolkit + workflow validation is the product**.

Visual genre: Samarkand-style Islamic geometric patterns. Lines are the visible art; tiles are scaffolding for placing the line decorations correctly. Construction via Bonner's polygonal technique ([[Islamic Geometric Patterns and the Polygonal Technique]] c-000191) augmented with Lu-Steinhardt 2007 girih-tile subdivision where applicable. Periodic 6-fold scaffold (p6 / p6m) as the starting symmetry; 8-fold and 12-fold as *local* rotational motifs on p4m / p6m lattices in later MVPs (per crystallographic restriction theorem).

## Background

This spec follows from:

- The wiki's locked sweep sequence and 15-gap depth-dive (completed 2026-05-17)
- Subsystem A (wiki MCP server, `@visualthinking/wiki-mcp@0.1.0`) shipped — PR #1 merged; registered at `.mcp.json` for project-local consumption
- The 2026-05-18 toolkit-screensaver brainstorm, which exposed three workflow gaps captured in [[Research - IGP Library Landscape 2026-05-18]] (c-000226): wiki had concept-depth but no tool-depth on IGPs, `wiki_orient` under-surfaces named-tradition terms, npm-search audit was skipped before designing
- 4-parallel-subagent library audit (2026-05-18) which produced the locked recommendation: **port the math, depend on nothing** for the geometry core

## Constraints and conventions

- **JS/TS first** per `feedback_language-preference.md`
- **Default stack** per wiki/techniques/: culori + three.js + WebGPU + Anthropic SDK
- **No external geometry dependency for the core** — port from `tactile-js` (BSD-3), `wallpaper-groups` (MIT), `Alzulejo` (MIT), and the Kaplan Bridges 2000 paper (algorithm-only, legally clean)
- **Toolkit is runtime-independent of the MCP** — MCP is dev-time consultation only
- **One-click-away primary sources** in tool/concept page references (`feedback_one-click-primary-sources`)
- **Cross-cultural validity flag**: IGPs are a non-Western tradition; honor the form without claiming canonicity (`feedback_cross-cultural-validity`)
- **Test artifact ≠ goal**: audit workflow gaps as first-class deliverables alongside the artifact (`feedback_test-artifact-vs-workflow`)

## Architecture (Approach 2 — renderer-agnostic render-plan + adapters)

```
[geometry layer] → [aesthetic layer] → [render plan] → [renderer adapter] → [output]
   wallpaper        palette                typed data       SVG | Canvas       SVG string |
   polygon          imperfections          structures       | WebGPU           Canvas ctx |
   rosette          (procedural)                                               GPU buffers
   girih
```

**Why this approach** (vs SVG-first pipeline or PlotBoilerplate dep): same toolkit serves screensaver (SVG) + future music-reactive visualizer (WebGPU). Animation = generate plans over time, no rearchitecture. Renderers are swappable. The math layer never touches pixels — testable in isolation. The render-plan abstraction makes visual-regression testing tractable (diff plans, not pixels).

## Components

### Geometry core (ported math, framework-free)

```
toolkit/src/
├── wallpaper/      # 17 wallpaper-group transforms
│                   # Source: wallpaper-groups (MIT, 15/17) + tactile-js (BSD-3) for the missing 2
├── polygon/        # Polygon primitives + Bonner edge-midpoint contact-angle (Hankin)
│                   # Source: Alzulejo polygon.svelte.ts:160-224 (MIT, ~64 LOC)
├── rosette/        # Lee 1995 rosette construction (n, q, s) for 8-fold/12-fold local motifs
│                   # Source: Kaplan Bridges 2000 paper, port algorithm
├── planar-graph/   # "Discard underlay, keep line network" transform
│                   # Source: Alzulejo rosette.svelte.ts (MIT, ~384 LOC)
├── girih/          # Lu-Steinhardt 5-tile system (decagon, pentagon, elongated hex, bowtie, rhomb)
│                   # Source: Lu-Steinhardt 2007 Science paper, port from paper
├── inflation/      # Self-similar subdivision (Lu-Steinhardt Fig. 3 D/E)
│                   # Source: Bridges 2000 + Lu-Steinhardt 2007, port algorithm
└── isohedral/      # Optional: 81-of-93 isohedral tilings + edge-shape (J/U/S/I) parameterization
                    # Source: tactile-js (BSD-3, full port if/when needed)
```

### Aesthetic layer (toolkit-original)

```
toolkit/src/
├── palette/
│   ├── samarkand-chord.ts    # OKLCH anchors: lapis × turquoise contrast pair +
│   │                          # manganese identity + cream neutral + saffron completion
│   ├── pair-relation.ts      # Implements OKLCH Pair-Relation Classifier (c-000211)
│   └── chord.ts              # Generic chord generators, n-tuple analysis
├── imperfections/
│   ├── glaze-pool.ts         # Per-cell low-frequency noise gradient (render-plan annotation)
│   ├── edge-bleed.ts         # Cuerda-seca boundary softening
│   ├── micro-rotation.ts     # Sub-pixel jitter per cell
│   └── lambertian.ts         # Soft directional shading
└── style/
    └── cuerda-seca.ts        # Cream outline rendering (path-offset + double-stroke)
```

### Render plan + adapters

```
toolkit/src/
├── render-plan/
│   ├── primitives.ts         # Discriminated union: Polygon | Line | Circle | Path
│   ├── style.ts              # Fill, stroke, alpha, opacity-modulator
│   └── annotations.ts        # Imperfection hints (glaze-pool noise seed, edge-bleed amount, etc.)
└── renderers/
    ├── svg.ts                # MVP-1: render plan → SVG string
    ├── canvas.ts             # MVP-3+: render plan → Canvas2D commands
    └── webgpu.ts             # MVP-5+: render plan → GPU buffers (animation)
```

### Animation layer (MVP-5)

```
toolkit/src/
└── animation/
    ├── orbit-timeline.ts     # Time-of-day-driven phase along symmetry-group cosets
    ├── plan-diff.ts          # Diff two render plans → minimal update set
    └── transition.ts         # Pattern variety swap (continuous slow morph; superposition mechanism)
```

## Data flow (MVP-1: static screensaver)

```
seed (random or time-of-day-derived)
  ↓
wallpaper(p6, circumradius: 40) → lattice nodes + group transforms
  ↓
polygon(rule: hexagram) at each node → polygon vertices + decoration lines
  ↓
planar-graph(...) → line network (discard polygon underlay)
  ↓
palette(samarkand-chord, completion-pair: lapis+saffron) → color assignments
  ↓
imperfections({glaze-pool: 0.4, edge-bleed: 0.2, micro-rotation: 0.05}) → annotations
  ↓
render-plan (typed data structure)
  ↓
renderers/svg → SVG string
  ↓
screensaver/webview displays SVG fullscreen
```

## API sketch

```typescript
// toolkit/src/index.ts (public API)

import {
  wallpaperGroup,
  polygon,
  rosette,
  planarGraph,
  palette,
  imperfections,
  RenderPlan,
} from '@visualthinking/toolkit';

import { renderSVG } from '@visualthinking/toolkit/renderers/svg';

// Generate a single beautiful static IGP at p6 / hexagram-rule / Samarkand chord
function generateSamarkandFrame(seed: number, bounds: { w: number; h: number }): string {
  const lattice = wallpaperGroup('p6', { circumradius: 40, bounds });

  const nodes = [...lattice.nodes()].map((node) => {
    const star = polygon.hexagram({ R: 25, r: 25 / Math.sqrt(3) });
    return { node, decoration: star };
  });

  const lineNetwork = planarGraph.fromDecoratedNodes(nodes);

  const colors = palette.samarkandChord({
    completionPair: ['lapis', 'saffron'],
    accentBudget: 0.05,
  });

  const plan: RenderPlan = {
    primitives: lineNetwork.toRenderPlan({ palette: colors }),
    annotations: imperfections({
      glazePool: 0.4,
      edgeBleed: 0.2,
      microRotation: 0.05,
      seed,
    }),
  };

  return renderSVG(plan, bounds);
}
```

## Screensaver integration

`screensaver/` is a macOS WKWebView-based `.saver` bundle (per `subsystem-trajectory.md` recommendation, WKWebViewScreenSaver-style prior art).

```
screensaver/
├── src/
│   ├── main.ts                  # WKWebView host; calls toolkit.generateSamarkandFrame
│   └── index.html               # Fullscreen SVG container
├── VisualThinking.saver/        # macOS .saver bundle structure (Info.plist, Resources/)
├── build.sh                     # Bundle the toolkit + assets, sign, copy to ~/Library/Screen Savers
└── README.md
```

Boot flow:
1. macOS activates screen saver → loads `index.html` in WKWebView
2. `main.ts` calls `generateSamarkandFrame(seed, screenBounds)` from the toolkit
3. SVG fills the screen; no animation in MVP-1
4. On screensaver-end, WKWebView is destroyed (no cleanup needed)
5. Seed source for MVP-1: timestamp + display-id hash, so each invocation is unique but reproducible-on-demand

## Error handling

Conservative defaults; never crash the screensaver. Failures degrade visually:

| Failure | Behavior |
|---|---|
| Geometry layer throws | Fall back to a single solid lapis-filled rectangle |
| Palette layer fails | Fall back to lapis + cream (2-color fallback) |
| Imperfections layer fails | Render plan without annotations |
| Renderer fails | Fall back to a precomputed SVG fallback bundled with the .saver |
| WKWebView fails to load | macOS shows native "screensaver failed" black screen — toolkit can't fix this |

All errors are logged to `~/Library/Logs/VisualThinking-Screensaver.log` for debugging.

## Testing

### Unit (vitest)
- Each module in `toolkit/src/` has a `*.test.ts` covering pure-function behavior
- TDD per `mcp/CLAUDE.md` conventions
- Schema-conformance test similar to `mcp/`: parser produces valid render plans for all wallpaper groups

### Visual regression (Alhambra `.tiling` oracle)
- Reverse-engineer Alhambra's `.tiling` data files (Penrose, Girih Inflation 10, Girih Crab, etc.) into JSON
- For each oracle, generate the same pattern via the toolkit and compare render plans (not pixels)
- Acceptable diffs: numerical tolerance + structural isomorphism
- Catches regressions in geometry without committing to pixel-perfect output

### End-to-end (manual + automated where feasible)
- Build the `.saver`, install to a test macOS volume, activate screensaver, screenshot
- Compare screenshots across releases for unintentional visual drift
- Automated: headless WKWebView rendering toolkit output to PNG, diff against committed snapshots

## MVP roadmap

> **Implementation plan scope**: This spec describes the *unified architecture* across MVPs 1-5 because the render-plan abstraction is shared across phases. The **implementation plan derived from this spec is MVP-1 only** (static p6 hexagram tiling, SVG renderer, screensaver shell). MVPs 2-5 get their own implementation plans when their phase begins, building on the MVP-1 spine.

| Phase | Scope | Deliverable |
|---|---|---|
| **MVP-1** | Static beautiful random pattern on 6-fold scaffold (p6); hexagram rule only; Samarkand chord; SVG renderer; screensaver host | Working `.saver` bundle; one tiling per activation |
| **MVP-2** | Add p4m + 8-fold local rosette (Lee 1995); palette stays Samarkand | Two symmetry families; richer variety |
| **MVP-3** | Add p6m + 12-fold local rosette; strap-work between rosettes; Canvas renderer | Closer to image-2 territory |
| **MVP-4** | Mix multiple wallpaper-group scaffolds in one scene with smooth boundaries (12-fold center → 6-fold body → 3-fold edges); cuerda-seca double-stroke; procedural glaze | Hard problem (boundary geometry); deferred to research-required phase |
| **MVP-5** | Animation: pattern-variety swap via alpha superposition (chord); WebGPU renderer; orbit timeline | The "interplay" the user described; ships when MVP-3 is stable |

## Risks and open questions

| Risk | Mitigation |
|---|---|
| Math port from papers takes longer than estimated | Time-box per algorithm; if Lee 1995 rosette takes > 8 hours, fall back to depending on tactile-js directly (BSD-3, vendor the relevant files) |
| WKWebView SVG performance at 5K+ resolution | Profile early; switch to Canvas at MVP-3 if SVG is the bottleneck |
| Visual quality of procedural glaze imperfections | Iterate against the user's reference images; if procedural can't match, accept the cleaner "modernist" rendering instead |
| `.saver` packaging on macOS Sequoia+ (Sonoma, Sequoia, etc.) | Use prior-art WKWebViewScreenSaver as starting point; verify signing requirements |

**Open**:
- PlotBoilerplate follow-up evaluation — yes or no?
- Repo structure: separate `package.json` per subproject or monorepo (pnpm workspaces)?
- License for the toolkit + screensaver — MIT, like the wiki MCP?

## References

- [[Research - IGP Library Landscape 2026-05-18]] (c-000226) — the audit synthesis
- [[Islamic Geometric Patterns and the Polygonal Technique]] (c-000191) — augmented with implementation landscape
- [[Symmetry-Group Pattern Generator]] (c-000221) — augmented with build-vs-borrow matrix
- [[Symmetry Groups and Tessellation]] (c-000189) — wallpaper-group enumeration
- [[OKLCH Pair-Relation Classifier]] (c-000211) — Arnheim's color syntax in OKLCH
- [[culori]] — color math library
- [[tactile-js]] · [[wallpaper-groups]] · [[PlotBoilerplate]] · [[Alhambra]] · [[Alzulejo]] · [[IkarosKappler/girih]]
- Lu, P. J. and Steinhardt, P. J. *Decagonal and Quasi-crystalline Tilings in Medieval Islamic Architecture*. Science 315 (5815): 1106-1110, 2007.
- Kaplan, C. S. *Computer Generated Islamic Star Patterns*. Bridges 2000.
- Bonner, J. *Islamic Geometric Patterns: Their Historical Development and Traditional Methods of Construction*. Springer 2017.
- `.claude/memory/project_brainstorm-state.md` — in-flight brainstorm state
- `.claude/memory/feedback_test-artifact-vs-workflow.md` — workflow-vs-artifact framing
- `.claude/memory/feedback_npm-audit-before-design.md` — pre-design library audit convention
