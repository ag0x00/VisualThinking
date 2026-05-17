---
title: Depth by Overlapping
type: concept
status: developing
tags: [concept, space, depth-cues, composition]
created: 2026-05-17
address: c-000052
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Depth by Overlapping

Overlapping (also called **occlusion** or **interposition**) is the strongest pictorial cue to depth — strong enough to override real physical distance between two glass plates in the Kopfermann experiment (a far triangle behind a near "L" is seen as the L overlapping the triangle, not as separated planes). Arnheim treats it in Chapter V of *Art and Visual Perception*.

## The Helmholtz–Ratoosh rule

Originally formulated by Helmholtz in 1866 and refined by Ratoosh:

> At the points where the outlines of two objects meet, the object whose contour does **not change direction** is seen as lying in front. The object whose contour is *interrupted* lies behind.

This is a strictly *local* rule applied at intersection points. Ratoosh's mathematical proof: "Interposition can provide a cue only at the points where the outlines of two objects meet. What happens at one point of intersection is independent of what happens at the other."

## Arnheim's correction: the global simplicity factor

The Helmholtz–Ratoosh rule applies at intersection points, but the depth percept depends on whether *making one figure complete behind the other* yields a simpler whole. Examples:

- Two adjoining hexagons sharing a border: no depth, because completion adds complexity.
- A circle behind a square (the circle interrupted by a square edge): clear depth, because the circle is completable as a simple shape.
- Two figures *touching* without intersection: weak depth, even when one contour suggests continuity.

The rule generalizes to: **overlap produces depth when the completed pattern (an interrupted figure restored as simple shape) yields a structurally simpler total than the flat alternative.** This connects overlapping to the general principle of perceptual simplicity (see [[Simplicity (Arnheim)]]).

## Effects in composition

1. **Sequence of depth** through chains of overlaps creates strong recession even without converging perspective (e.g., Mary Cassatt's *Boating Party*, Chinese landscape painting). Mountains and clouds are stacked frontal slices.
2. **Frontal-plane preservation** — a painter can obtain a strong depth interval through one overlap while keeping the rest of the surface flat. Cézanne uses this to keep planes detached without classical perspective.
3. **Tension residue** — overlap always leaves a *tension* between the units, the urge to tear apart and float free. Empirically: when asked to reproduce a remembered painting, observers often *eliminate* the overlap (Wallach finding).

## Limits and edge cases

- **Locally contradictory intersections** (e.g., Penrose-style impossible figures) leave depth ambiguous or impossible — the figure cannot resolve which unit is in front.
- **Outline rectangles cut from cardboard** (Arnheim's hypothetical) — even with no overlap, Helmholtz-Ratoosh's condition can fail to produce depth if the cuts produce a complete simple total.
- **Physical-plane reinforcement** — overlap is more compelling when stage scenery, projection screens, or actual depth differences support the painted superposition. On a flat painted canvas it is weaker.

## Programmable implications

- **Z-order in compositions** maps directly to this rule. Render order matters more than parallax for a still image.
- A scoring metric for "depth read": count the number of overlap events where the front-figure rule is unambiguous, weighted by the simplicity gain (front figure simple as a whole vs simple as a fragment).
- For generative art, **chains of overlaps** are cheaper and more controllable than full perspective. A foreground/midground/background can be obtained with three rectangles + three overlap events.
- For evaluation: a [[Multimodal Evaluation Loops|multimodal critic]] can be prompted to identify the front-most element and verify it matches the intended z-order.

## Related pages

[[Figure and Ground]] · [[Perceptual Gradients]] · [[Central Perspective]] · [[Simplicity (Arnheim)]] · [[Pyramidal Space]] · [[Compositional Grids]]

## Source

Arnheim, *Art and Visual Perception* (1954/1974), Chapter V "Space," pp. 239–243. Primary references: Helmholtz, *Handbuch der physiologischen Optik* (1866); Ratoosh on interposition (cited by Arnheim).
