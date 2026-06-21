---
address: c-000227
title: tactile-js
type: tool
status: developed
tags: [tool, javascript, tessellation, wallpaper-groups, isohedral, kaplan, library, port-candidate]
created: 2026-05-18
updated: 2026-05-18
verdict: first-class
---

# tactile-js

The **canonical academic JavaScript library** for parameterized isohedral tilings, authored by **Craig S. Kaplan** (University of Waterloo). Covers **81 of the 93 isohedral tiling types** with edge-shape parameterization (J/U/S/I classifier) and prototile manipulation. Used by the **SIGGRAPH 2024 Generative Escher Meshes** paper and as the reference implementation in Kaplan's pedagogical materials.

## Status

- **License**: BSD-3-Clause (permissive — safe to fork or port)
- **Maintainer**: Craig Kaplan + collaborators
- **Stars**: ~240
- **Last commit**: active
- **Distribution**: ES6 module via direct GitHub import; **not npm-published**
- **Renderer**: agnostic (outputs geometry; caller draws)

## Use cases (for VisualThinking toolkit)

Primary candidate for the toolkit's `wallpaper/` and `tessellation/` modules. Specifically:

1. **Isohedral tile classification** — given a tile shape, identify which of 93 tiling types it belongs to
2. **Edge-shape parameterization** — generate the J/U/S/I edge curves that produce valid tilings
3. **Fundamental-domain repetition** — replicate a motif per the tiling's symmetry
4. **Escher-style figurative tilings** — the math substrate that powers SIGGRAPH 2024 Escher Meshes

## Capabilities

- 81 of 93 isohedral tiling types (the parameterizable ones)
- Every [[Symmetry Groups and Tessellation|wallpaper group]] with a polygonal fundamental domain reachable
- Edge-shape classes (J/U/S/I) — non-trivial; tedious to re-derive
- Adjustable tile parameters per type
- Clean separation of geometry from rendering

## Limitations

- **No npm publish** — distribution friction; consume via direct ES6 import or fork/port
- Outputs geometry, not pixels — must pair with a renderer (Canvas, SVG, three.js, WebGPU)
- **No girih-specific tooling** — IGP requires layering Bonner's polygon-in-contact + Lee rosette construction on top (see [[Alhambra]] for the canonical implementation of those)
- **No procedural imperfection / palette layer** — toolkit responsibility

## Math worth borrowing (toolkit `wallpaper/` module)

1. **Isohedral tiling enumeration** — the 93 IH types with parameter vectors
2. **Edge-shape (J/U/S/I) classifier** — given an edge curve, classify its symmetry class
3. **Prototile + edge-shape → tiling** — composition algorithm
4. **Fundamental-domain extraction** — for a given group element, compute the FD

Per BSD-3-Clause, a clean port (with attribution) is the recommended path. See [[Research - IGP Library Landscape 2026-05-18]] for the full landscape and rationale.

## API surface (sketch)

```javascript
import { IsohedralTiling, tilingTypes } from 'tactile-js';

const tiling = new IsohedralTiling(tilingTypes[10]); // IH10
tiling.setParameters([0.5, 0.4]); // valid range per IH type

// Iterate fundamental-domain instances visible in a rectangle
for (const inst of tiling.fillRegion(0, 0, 800, 600)) {
  const T = inst.T;  // affine transform
  const polygon = tiling.shape();
  // Draw polygon with transform T applied — Canvas, SVG, three.js, whatever
}
```

## Verdict

**First-class** — port the math into the toolkit. The BSD-3 license is permissive; the algorithms are the most rigorous available; the author is the academic authority on parameterized tilings. The only reason not to depend on it directly is the no-npm-publish friction and the toolkit's KISS goal of vendoring just what's needed.

## Related

- [[Research - IGP Library Landscape 2026-05-18]] (full audit)
- [[Symmetry Groups and Tessellation]] (c-000189)
- [[Symmetry-Group Pattern Generator]] (c-000221) — the technique tactile-js operationalizes
- [[Islamic Geometric Patterns and the Polygonal Technique]] (c-000191)
- [[wallpaper-groups]] — npm-published alternative for raw transform tables
- [[hatviz]] — Hat/Spectre aperiodic counterpart (by same authors)

## Sources

1. tactile-js GitHub repo. https://github.com/isohedral/tactile-js
2. Kaplan, Craig S. *Introductory Tiling Theory for Computer Graphics*. Morgan & Claypool 2009.
3. Aharoni et al. *Generative Escher Meshes* (SIGGRAPH 2024) — uses tactile-js as substrate. https://arxiv.org/abs/2309.14564
4. Hello Tactile.js (Observable demo). https://observablehq.com/@mattdzugan/hello-tactile-js-a-library-for-eascher-esque-isohedron-tess
