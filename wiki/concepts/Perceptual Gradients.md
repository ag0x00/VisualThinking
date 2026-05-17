---
title: Perceptual Gradients
type: concept
status: developing
tags: [concept, space, depth-cues, programmability]
created: 2026-05-17
address: c-000053
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Perceptual Gradients

A **gradient** is a gradual change in some perceptual quality across space. Following J.J. Gibson and Arnheim, *three-dimensional space is created by perceptual gradients*: the eye reads the gradient as a distortion that resolves into the simplest pattern by tilting the surface into depth.

A gradient is a depth cue **iff** the pattern with the gradient is a distortion of a simpler pattern that the visual system can recover by going to 3D.

## The canonical six gradients

Each can be controlled programmatically.

### 1. Size gradient
Objects of constant physical size project as gradually shrinking on the retina with increasing distance. In the picture plane: smaller units near the top read as further.

### 2. Location gradient (perspective convergence)
Parallels converge; intervals between elements decrease. The location gradient is the *spacing*, not the size.

### 3. Texture gradient
Texture units (stones in a field, blades of grass, pebbles, weave) become smaller, denser, and more compressed toward the horizon. Arnheim notes that artificial (regular) textures — checkerboards, coffered vaults, wallpaper — are *more effective* than natural ones because the regularity makes the gradient unambiguous. "Realism as such is no contributor to depth."

### 4. Brightness gradient
Maximum brightness at the level nearest to or coincident with the light source. Brightness establishes a key spatial-distance reference that need not be in the foreground. Rembrandt placed it at any depth that suited him, building a *spherical gradient expanding in all directions* from that point.

### 5. Sharpness gradient (depth of field)
Sharp ≈ near; blurred ≈ far. In photography, the focused zone defines the "base" of distance; everything else is a deviation. Note: the zone of sharpness can be placed *anywhere* in depth, not just the foreground. In motion pictures focus tracks the most important object.

### 6. Color / aerial-perspective gradient
First described by Leonardo. Distant objects become paler, cooler (bluer), and lower in saturation due to atmospheric scattering. **Effective even at small distances where physical air-effect is negligible** — what counts is the *perceptual gradient*, not its physical realism. (See [[Aerial Perspective]].)

## Motion gradient (the seventh)

Camera or observer motion produces **motion parallax**: near objects sweep past quickly, distant ones slowly. The "traveling camera" obtains more depth than a static one. The horizon is the perceptual zero (still); near objects move backward; objects above the horizon (clouds, sun) travel *with* the observer. The same principle is what Wallach exploited in shadow experiments (rotating-object percepts).

## What gradients are NOT

Not every convergence or shrinkage creates depth. Arnheim's correction: gradients produce depth **only when seen as distortions** of a simpler pattern. A triangle has converging sides but is not perceived as a 3D wedge — because the triangle is a complete simple shape on its own and does not call for resolution into 3D. Similarly, overlapping and binocular parallax can produce depth *without* gradients, because they yield simpler 3D patterns directly.

## Programmable implications

For a generative or evaluative system:

- **Each gradient is an independent parameter** that can be tuned 0–1. Combining 3+ gradients in agreement yields convincing depth; conflicting gradients yield ambiguity or flatness.
- **For a "depth budget"** on a flat composition (poster, logo, UI), enable 1–2 gradients selectively. Most contemporary "flat design" deliberately suppresses all six.
- **A CV/LLM critic** can verify: count the gradients present, score their mutual consistency, and check whether their implied depth direction agrees.
- **Aerial perspective and brightness gradient** are particularly cheap programmatically: they map to opacity and luminance only, no geometry.
- **Texture gradient** with a regular pattern (grid, dots, hatching) is the most controllable: the *period* of the pattern is the gradient knob.

## Related pages

[[Aerial Perspective]] · [[Central Perspective]] · [[Pyramidal Space]] · [[Figure and Ground]] · [[Depth by Overlapping]] · [[Photo Aesthetic Features]] · [[Simplicity (Arnheim)]]

## Source

Arnheim, *Art and Visual Perception* (1954/1974), Chapter V "Space," pp. 268–271, citing James J. Gibson's *The Perception of the Visual World* (1950) for the gradient-based theory.
