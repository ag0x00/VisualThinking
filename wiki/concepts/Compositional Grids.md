---
title: Compositional Grids
type: concept
tags: [concept, composition, geometry]
status: developing
created: 2026-05-15
updated: 2026-05-16
---

# Compositional Grids

> The family of overlay systems used to organize a picture plane. Each grid is a **deterministic function from canvas dimensions to a set of focal coordinates and force lines** — the single most direct interface between traditional composition and code.

## Taxonomy

| Grid | Construction | Focal points | Best for |
|---|---|---|---|
| [[Rule of Thirds]] | 3×3 division | 4 intersections | Default heuristic; single off-center subject |
| Quadrants (centred symmetric) | Vertical + horizontal axis | 1 point (centre) | Symmetric subjects; portraits with frontal gaze |
| [[Dynamic Symmetry]] armatures | Root-rectangle reciprocal diagonals | Multiple "eyes" on diagonals | Multi-subject compositions; classical-style layouts |
| Golden-section grid | Lines at $1/\phi \approx 0.382$ and $1 - 1/\phi \approx 0.618$ | 4 intersections | Closely related to rule-of-thirds; pleasingly similar |
| [[Golden Spiral]] / Fibonacci | Logarithmic spiral with $\phi$ growth | Pole of the spiral | Single dominant subject with directional flow |
| Diagonal method | Two corner-to-corner diagonals (or 45° diagonals from corners) | Centre + diagonal intersections | Dynamic, energetic layouts |
| Triangular | Three converging force lines | Three vertices + centroid | Hierarchical groupings; group portraits |

The diagonal method, sometimes called *rabatment*, is a separate compositional language emphasizing diagonal energy; it's mentioned in Wikipedia's coverage but not part of any of the spiral/root-rectangle systems.

## Programmable interface

Every grid in the taxonomy admits the same API:

```
grid(w, h, type) → {
  focal_points: [(x, y), ...],
  force_lines:  [((x1, y1), (x2, y2)), ...],
  regions:      [polygon, ...]
}
```

For a generative system this is enough to *place* subjects; for an evaluation system it's enough to *score* an existing image by measuring saliency-mass overlap with focal points and orientation alignment with force lines.

## How to pick a grid

A grid is **the compositional language** the image speaks. Picking one is roughly equivalent to picking a style:

- Rule of thirds → photographic / pictorial naturalism.
- Golden-section → classical / harmonic.
- Dynamic Symmetry → academic / Baroque revival (per [[Public Seminar - Dynamic Symmetry]]).
- Diagonal → modernist / kinetic.
- Centred symmetric → iconic, devotional, or formal portrait.

A single image rarely speaks two grids at once. The **scoring** problem — given an image, which grid does it best fit? — is open and surprisingly hard. A reasonable starting heuristic is the maximum saliency-overlap across all candidate grids.

## Why it matters for this vault

Grids are the **programmable surface** of composition. They are deterministic, parameter-free given canvas dimensions, and trivial to serialize as JSON. For an LLM critic, the question "is the subject placed well?" reduces to "does the saliency mass overlap a focal point of *some* canonical grid?"

The deeper question — *why* the focal points feel right — is answered by [[The Gestalt Principles of Visual Perception]], not by the grids themselves. The grids are scaffolding; Gestalt is the substrate.

## Caveats

- **No grid is universal.** Cartier-Bresson explicitly argued that the only "geometrical analysis" worth doing happens *after* the photograph, as post-mortem critique, not as a viewfinder overlay (Source: [[PetaPixel - True Photographic History]]).
- **Grids don't compose for you.** They constrain *where*, not *what*. Subject meaning, [[Chiaroscuro]] tonal weight, [[The Munsell and CIELAB Color Systems]] palette — all interact with grid placement.

## To research

- An empirical study scoring a large corpus of paintings/photos against the taxonomy and reporting per-grid recall.
- How LLM critics currently perform at "name the grid this image is using."
- Whether mixing grids (e.g., rule-of-thirds for primary subject + diagonal for secondary energy) actually helps or just confuses the eye.

## Related
[[Rule of Thirds]] · [[Dynamic Symmetry]] · [[Golden Spiral]] · [[The Gestalt Principles of Visual Perception]] · [[PetaPixel - True Photographic History]] · [[Public Seminar - Dynamic Symmetry]]
