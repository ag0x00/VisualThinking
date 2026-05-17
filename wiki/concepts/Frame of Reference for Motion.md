---
title: Frame of Reference for Motion
type: concept
status: developing
tags: [concept, perception, motion, gestalt, arnheim, duncker]
address: c-000065
created: 2026-05-17
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Frame of Reference for Motion

In any scene with relative displacement, the eye does not perceive **mutual motion** — it picks one element as stationary (the *frame*) and assigns the motion to the other. **Karl Duncker's 1929 experiments** established the rule that determines which is which: the **enclosing, larger, structurally-dominant** element is read as the frame; the **enclosed, smaller, dependent** element is read as moving.

This is Arnheim's "**hierarchy of dependence**" — the relational structure that makes motion perception non-symmetric.

## Duncker's rules (1929)

In a dark room with no external references:

- A **luminous rectangle** containing a **luminous dot**, with the rectangle physically moving: the **dot is seen as moving**, the rectangle stationary. The container wins.
- A **frame around a stationary dot**, frame physically moving: same — dot moves, frame stationary (induced motion).
- A **larger object** beside a smaller one, larger moving: still the **smaller** is seen as moving more, even when the larger is the physically displaced one.
- The **brighter / sharper / more salient** element tends to be read as the figure that moves, but enclosure dominates.

## The hierarchy

Arnheim's generalization: a scene establishes a tree of dependence. At the root, the **largest stable framework** (the picture frame, the visible horizon, the room). Each subordinate element is located *within* its enclosing element and moves *relative to it*. Motion percepts attach at the leaves, not the trunk.

Examples Arnheim draws out:

- **Moon and clouds.** Wind moves the clouds, but because the clouds frame the moon (subtend a larger visual angle in the local patch), the **moon appears to drift** through the static cloud layer. The eye misallocates.
- **Train motion.** Looking out a train window at another train: which is moving is genuinely ambiguous until a fixed reference (platform, tree) breaks the tie.
- **A dancer on stage.** The stage is the frame; the dancer moves. If the dancer holds still and the lighting cycles, the *lighting* changes but the dancer is still read as the locus of action.
- **Camera moves in film.** A tracking shot moves the camera; viewers see the **world flow past**, not the camera move. The picture frame is the unmoving root.

## Why this matters perceptually

The hierarchy is not just convention. It enforces **simplicity** ([[Simplicity (Arnheim)]]): attributing motion to the smallest sub-element leaves the largest part of the scene structurally constant, minimizing total perceptual change. Spreading motion across the whole scene would be more complex.

It also explains many **illusions**:

- *Induced motion* (Duncker's frame-moves-dot-stays).
- *Vection* (when the visual surround moves coherently, you feel **yourself** moving — the surround becomes the frame and your body the figure within it).
- *Pictorial motion in static images* — when a frame is depicted (a window, a doorway, a courtyard), figures within it are perceptually freer to imply motion.

## Programmable implications

- **Frame placement controls implied dynamics.** Putting a strong rectangular frame around a composition stabilizes everything outside the frame and frees elements *inside* it to read as moving or unstable. Conversely, a fluid background with no fixed reference makes any element feel disturbed.
- **Visualizer architecture (priority 4).** Lock a stable structural element (a grid, a horizon, a circular boundary) and let the music-reactive elements live inside it. The fixed frame is *not* wasted real estate — it's the scaffold that lets the rest *read as motion* rather than as noise.
- **Logo motion (priority 2 branding).** A mark with implied motion (Nike swoosh, Amazon arrow) only reads as moving because of an implicit frame relative to which it moves. A motion-suggesting mark needs its perceptual frame, not just its dynamic line.
- **Generative composition guard.** If a generator produces a scene with no stable frame element, motion claims become meaningless. Add a frame layer (margin, horizon, anchor) before evaluating motion or balance.
- **WebGPU/three.js camera and skybox.** The skybox is the perceptual frame for the world; movement is read relative to it. Replacing a static skybox with a slowly-drifting one shifts motion perception dramatically — try this deliberately, not by accident.

## Why we cite this

Duncker's hierarchy is one of the few **directly computable** principles from Gestalt motion research. Implementations:

- Score frame-candidacy for each element: size, enclosure, contour-closedness, central-symmetry, contrast-with-surround.
- The highest-scoring element is the frame; motion implications attach below.

This is a programmable substrate for [[Visual Balance]] in dynamic scenes.

## Related pages

[[Stroboscopic Motion]] · [[Phenomenal Causality]] · [[Organic vs Mechanical Motion]] · [[Figure and Ground]] · [[Pyramidal Space]] · [[The Structural Skeleton]] · [[Visual Balance]] · [[Simplicity (Arnheim)]] · [[Arnheim - Art and Visual Perception]]

## Source

Arnheim Ch. VIII, citing Karl Duncker, "Über induzierte Bewegung" (*Psychologische Forschung* 12, 1929) — the foundational paper on induced motion and motion frames of reference.
