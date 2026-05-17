---
title: Pyramidal Space
type: concept
status: developing
tags: [concept, space, perception, perspective]
created: 2026-05-17
address: c-000054
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Pyramidal Space

Our visual world is neither flat (the retinal projection) nor fully Euclidean (the physical 3D world). It is **non-Euclidean, pyramidal** — a frame of reference that *gets narrower with distance*, in which parallels converge but objects of equal scale still look "equal," and in which size is replaced by *scale* as the conserved quantity.

Arnheim borrows the term from Gibson: "**Scale, not size, is what remains constant in perception.**" The world is partially compensated for the projective distortion in the retina, but never fully so.

## Two extreme conceptions of space

| | Flat retinal projection | Full Euclidean space |
|---|---|---|
| Receding parallels | converge | stay parallel |
| Distant objects | small | unchanged |
| Tilted shapes | trapezoid | rectangular |

Neither extreme is what we actually perceive. The naïve observer sees a pyramidal in-between: rails converge but are *perceived as parallel*; columns down a cathedral aisle vary in retinal size but are *perceived as equal*. Both observations are direct, not inferred.

## Pyramidal geometry

Imagine a Euclidean cube whose far side has shrunk to a point. Parallels diverging from that point fan out in all directions. Objects of *equal linear size* would have to be *proportionally larger toward the vertex* to look equal. An object moving toward the vertex shrinks without "becoming smaller" and slows down without changing physical speed.

In such a world: **objects look equal when they have identical relations to the spatial framework**, not when they have identical metric sizes (Figure 208 in Arnheim — equal bars in pyramidal space have the same proportional share of the local framework).

## "Newtonian oases"

Within a frontal plane and at near distance (a few yards), space is approximately Euclidean. Shape and size are seen *as unchangeable*. From these regions of near-Euclidean behavior our cultural reasoning derives its simplified flat-space conception, but it doesn't generalize to the full visual world.

## Compensation factors

Several factors determine how much projective distortion is corrected:

- **Stereoscopic vision** — both eyes' cooperation strengthens depth and compensation.
- **Observer training** — an art student trained in projective drawing more readily *sees* the convergence; the layman struggles to.
- **Cultural exposure** — Thouless found Indian students, less exposed to perspective conventions, saw tilted objects more nearly in their "real" shape than British students.
- **Pattern simplicity** — symmetrical projections (e.g., looking straight down a church nave) reduce depth perception; oblique projections increase it.

Photographers compensate (long focal length flattens, wide-angle exaggerates), and architects in Greek temples *increased column thickness with height* (Vitruvius) to counter projective shrinkage.

## Why this matters for programmable art

1. **Camera/lens choice is a perceptual statement.** A long lens flattens (more Newtonian); a wide lens enhances pyramidality. Both are equally "realistic" — they reflect different positions in the pyramidal-vs-Euclidean spectrum.
2. **"Realistic size" is not the right default for generated scenes.** Architectural-quality renders compensate (e.g., shifting lenses to avoid converging verticals). The right default depends on which oasis you're claiming.
3. **For LLM-driven composition**, instructing "make the doorway appear at the back" means selecting *spatial-framework relations* (smaller, top of frame, defocused, with overlapping cues), not just smaller pixel-size. The framework is the unit, not the centimeter.
4. **Distance perception breaks when the framework is discontinuous.** Looking down from an airplane (no intermediate framework) shrinks apparent distance; the moon and Grand Canyon panoramas have no anchor at all.

## Connection to other pages

The pyramidal frame is the geometric basis for [[Central Perspective]] (which makes pyramidality explicit and unified) and for [[Perceptual Gradients]] (which are the *cues* by which the framework is constructed).

[[Birkhoff's Aesthetic Measure]] and [[Visual Entropy]] need to be evaluated *within* the perceived (pyramidal) framework, not the retinal or Euclidean one — a fact that complicates any naive pixel-domain aesthetic metric.

## Related pages

[[Central Perspective]] · [[Perceptual Gradients]] · [[Figure and Ground]] · [[Simplicity (Arnheim)]] · [[Aerial Perspective]] · [[Photo Aesthetic Features]]

## Source

Arnheim, *Art and Visual Perception* (1954/1974), Chapter V "Space," pp. 265–268, citing J.J. Gibson (*The Perception of the Visual World*, 1950: "Scale, not size, is actually what remains constant in perception").
