---
address: c-000229
title: PlotBoilerplate
type: tool
status: developing
tags: [tool, typescript, npm, geometry, vector, plotter, library, ikarus-kappler]
created: 2026-05-18
updated: 2026-05-18
verdict: second-class
---

# PlotBoilerplate

**Actively-maintained TypeScript geometry/drawing library** by IkarosKappler. The author's evolution from the dormant ES5 [[IkarosKappler/girih]] (2018) into a modern TS-first multi-renderer geometry stack. Explicitly **credits Lu & Steinhardt** for girih work; positioned as a substrate for plotter-style and creative-coding work.

## Status

- **License**: MIT (clean)
- **Distribution**: npm — `plotboilerplate`
- **Version**: v1.27.1 (March 2026)
- **Stars**: actively growing; 1062+ commits
- **Renderer**: SVG, Canvas, WebGL (multi-backend)
- **Demo**: https://plotboilerplate.io/repo/main-dist.html

## Use cases (for VisualThinking toolkit)

Candidate for the toolkit's rendering substrate OR for math borrowing. Specifically:

1. **2D vector primitives** — `Point2`, `Vertex`, `Line`, `Polygon`, `Circle`, `Bezier`, etc.
2. **Multi-renderer abstraction** — write geometry once, render via SVG/Canvas/WebGL
3. **Exporters** — SVG, PNG, plotter formats
4. **Plotter-style line work** — adjacent to Samarkand cuerda-seca aesthetic if outline-only rendering becomes a goal

## Capabilities

- Comprehensive 2D geometry primitives
- Multi-backend rendering
- Active maintenance (March 2026 commit)
- TypeScript-native
- Plotter-export support (SVG, HPGL adjacent)
- Author's own girih experiments demonstrate it can host IGP-style work

## Limitations

- **Not IGP-specific** — provides the primitives, but Bonner polygon-in-contact, Lee rosette construction, Lu-Steinhardt subdivision are not built-in. Toolkit would layer those on top.
- Substantial API surface — vendoring or partial port is non-trivial
- Author's [[IkarosKappler/girih|earlier dedicated girih repo]] has the *taxonomy* but is GPL-2.0 and ES5; PlotBoilerplate has the *primitives* but not the IGP-specific layer

## Verdict

**Second-class** — worth a follow-up dedicated evaluation. Pending decision: does the toolkit benefit from depending on PlotBoilerplate as a geometry substrate, or should it use [[three.js]] / [[paper.js]] / [[p5.js]] as the primitive layer? Defer until toolkit architecture is locked.

**Open question for the toolkit author**: PlotBoilerplate's multi-renderer abstraction matches the toolkit's likely need to support static (SVG for screensaver vector output) and dynamic (Canvas/WebGPU for animated visualizers) targets from a single geometry pipeline. Worth comparing against three.js + manual SVG export.

## Related

- [[Research - IGP Library Landscape 2026-05-18]] (full audit)
- [[IkarosKappler/girih]] — earlier dormant repo by same author
- [[three.js]] · [[paper.js]] · [[p5.js]] — alternative geometry substrates
- [[Symmetry-Group Pattern Generator]] (c-000221) — the technique this could implement

## Sources

1. npm package. https://www.npmjs.com/package/plotboilerplate
2. GitHub. https://github.com/IkarosKappler/plotboilerplate
3. Live demo. https://plotboilerplate.io/repo/main-dist.html
