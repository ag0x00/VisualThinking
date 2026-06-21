---
address: c-000228
title: wallpaper-groups
type: tool
status: developed
tags: [tool, javascript, npm, wallpaper-groups, tessellation, library]
created: 2026-05-18
updated: 2026-05-18
verdict: second-class
---

# wallpaper-groups

**Pure-JS npm library** providing 15 of the 17 [[Symmetry Groups and Tessellation|wallpaper-group]] affine transforms as line-array outputs. By Sebastian Herrmann (eskimoblood).

## Status

- **License**: MIT (clean, depend-without-friction)
- **Stars**: ~6 (small ecosystem)
- **Distribution**: npm — `wallpaper-groups`
- **Renderer**: agnostic (returns transformed line arrays; caller renders)

## Use cases (for VisualThinking toolkit)

Pragmatic foundation for the toolkit's repetition layer when full [[tactile-js|isohedral parameterization]] is overkill. Specifically:

1. Take a motif (line segments) and replicate it under one of 15 wallpaper-group transforms
2. Get the transformed coordinates back as plain arrays — feed into SVG, Canvas, WebGPU
3. Skip the math of constructing affine matrices for each group

## Capabilities

- 15 of 17 wallpaper groups (missing `p1` and `p6m`/`p6mm` per their docs)
- Pure JS, npm-installable, small surface
- Output is data, not pixels — composable with any renderer

## Limitations

- Missing 2 groups (`p1`, `p6m`/`p6mm`) — the toolkit will need to fill these in
- **Motif-replication only** — no decoration layer (no Bonner polygon-in-contact, no rosette construction)
- Small ecosystem (6 stars) — maintenance risk if it becomes load-bearing
- Doesn't handle [[Aperiodic Tiling and the Hat Monotile|aperiodic]] tilings

## API surface (sketch)

```javascript
import wallpaper from 'wallpaper-groups';

const motif = [[0, 0, 50, 50]]; // single line segment
const p4m = wallpaper.p4m({
  scale: 100,
  // motif lines, replicated under p4m symmetry
});
// p4m is an array of line tuples in the symmetric pattern
```

## Verdict

**Second-class** — depend on it for the repetition layer if it covers all the wallpaper groups the toolkit needs; otherwise port the relevant transform tables in directly. The math is simple (affine matrices); the value-add is the curated 15-group enumeration with sensible defaults.

For toolkit MVP-1 (6-fold scaffold), `p6` is supported. For MVP-3 (12-fold local motifs on `p6m`), the missing groups will need to be added.

## Related

- [[Research - IGP Library Landscape 2026-05-18]] (full audit)
- [[Symmetry Groups and Tessellation]] (c-000189)
- [[Symmetry-Group Pattern Generator]] (c-000221)
- [[tactile-js]] — more complete alternative; not npm-published
- [[PlotBoilerplate]] — IkarosKappler's actively-maintained geometry stack

## Sources

1. npm package. https://www.npmjs.com/package/wallpaper-groups
2. GitHub. https://github.com/eskimoblood/wallpaper-groups
3. [[Symmetry Groups and Tessellation]] — the 17-group enumeration this library implements
