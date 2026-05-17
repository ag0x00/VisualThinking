---
title: Central Perspective
type: concept
status: developing
tags: [concept, space, perspective, composition, history]
created: 2026-05-17
address: c-000056
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Central Perspective

**Central perspective** (also called **linear perspective**, **one-point perspective**, **focused perspective**) is the spatial system, discovered in Italy around 1430, in which all orthogonals to the picture plane converge to a single **vanishing point** on the horizon. Arnheim treats it (Chapter V) not as a discovery of "truth" but as one cultural solution to the problem of unifying pictorial space — equally valid alongside two-dimensional Egyptian space, isometric Japanese space, or modern cubist atomization.

## Three reasons it matters historically

1. **Unification of space.** Before 1430, pictorial space was atomized — each object had its own spatial system, with seams (Cennino Cennini's 14th-c instructions list five *different* recession slopes for parts of a building). Central perspective replaced this with one law: every receding line goes through one center.
2. **Coincidence of two principles.** Central perspective is *simultaneously* (a) the culmination of pictorial unity-seeking and (b) a mechanical tracing of the world through a pane of glass (Dürer's drawing machines). For the first time the artist's intuition and the engineer's measurement produced the same image — for a moment.
3. **Symbolism of the center.** The vanishing point puts a "**center to which all existence is referred**" inside the picture. Leonardo's *Last Supper* places it on Christ's face — harmony, stability, minimum depth. Tintoretto's later *Last Supper* puts vanishing point and subject in *different* places — eccentricity reveals dramatic conflict, the modern theme.

## Geometric structure

Two ingredients:

- **Horizon line** = the height of the observer's eye, projected as a horizontal line. Determines the eye level.
- **Vanishing point(s)** on the horizon, one per family of parallel lines receding into depth.

**One-point** perspective: orthogonals to the picture plane converge to a single vanishing point centered on the horizon. The frontal plane stays parallel to the picture.

**Two-point** perspective: two orthogonal families of horizontals (e.g., the two visible sides of a cube), each converging to its own vanishing point on the horizon. The vertical remains vertical.

**Three-point** perspective: adds a vertical vanishing point above or below for towering buildings or low/high observers. (Arnheim treats this less.)

## Compared to alternatives

| System | Cube representation | When used |
|---|---|---|
| **Two-dimensional** (Egyptian, child) | Front view + outline; no recession | Pre-perspective cultures; early children's drawings |
| **Frontal-isometric** | Frontal square + slanted (oblique) sides drawn parallel | Medieval Europe, Indian, Chinese; mathematicians/engineers |
| **Angular-isometric** | Two visible sides oblique; verticals vertical | Japanese 18th-c woodcuts; modern axonometric drawing |
| **Central / focused** | All edges converge to vanishing point(s) | Renaissance through ~1900 European painting |
| **Cubist atomized** | Multiple incompatible spatial systems on one canvas | 20th-c after Cézanne |

Each is **equally complete** as a system; "realism" is not the metric. Engineers prefer isometric because it preserves measurement; the Renaissance preferred central because it preserves "look."

## Programmable implications

For generative tools:

- **Three.js / WebGPU** default cameras are essentially central perspective. The FOV (field of view) parameter controls how strongly the convergence reads — high FOV ≈ short focal lens ≈ exaggerated depth; low FOV ≈ telephoto ≈ flat.
- **Orthographic projection** in 3D engines is **frontal-isometric perspective**. Use it for: technical illustration, axonometric games, brand identity (logo construction), interfaces where measurement matters.
- **For a logo or brand mark**: central perspective creates a focal narrative (the eye is drawn to one point); isometric creates "construction-like" rigor and infinity. Choose deliberately.
- **For a poster / single-frame composition**: an off-center vanishing point (Tintoretto's eccentric placement) generates productive tension; a centered one reads as stable, ceremonial, balanced.
- **For real-time visualizers** (priority 4): camera motion through a central-perspective scene is the strongest depth signal available. A traveling vanishing point produces motion sickness *and* immersion in roughly equal measure (cf. Borromini's Palazzo Spada).

## Photographic considerations

The angle of convergence depends on:

1. **Camera distance** — closer cameras = more convergence (wide-angle distortion).
2. **Focal length** — short focal length covers wider field, more convergence.
3. **Viewing distance** — perspective is "correct" only when viewed from the same projective angle. Wide-angle photos viewed at normal distance show *exaggerated* convergence; that's not "wrong," it's a system mismatch.

For [[LLM-as-Judge for Visual Quality]]: VLMs can usually identify the number of vanishing points and whether they're consistent. They are *unreliable* on subtle convergence errors (a column that should converge at 0.3° more than it does).

## Caveats and limits

- Central perspective compels a **single, fixed observer point**. This is not how vision works in continuous motion (binocular, head-moving, gaze-saccading). Cézanne and the cubists explicitly broke with it for this reason.
- It **strongly violates** the simplicity of the represented object — every receding edge is now non-parallel, foreshortened, location-dependent. Reconstructing the cube from the drawing is hard. Hence its slow adoption ("can be conceived by the human mind only after a long process of refinement").
- It produces a **focused world** with a center — symbolically, this is unsuitable for Taoist or medieval-Church cosmologies, but expressed the Renaissance shift to anthropocentric, individual-asserting Western thought.

## Related pages

[[Pyramidal Space]] · [[Perceptual Gradients]] · [[Aerial Perspective]] · [[Compositional Grids]] · [[Dynamic Symmetry]] · [[Simplicity (Arnheim)]] · [[Photo Aesthetic Features]]

## Source

Arnheim, *Art and Visual Perception* (1954/1974), Chapter V "Space," pp. 278–289. Historical references: William M. Ivins Jr., *Art and Geometry* (1946); Erwin Panofsky, *Perspective as Symbolic Form* (1927/1991).
