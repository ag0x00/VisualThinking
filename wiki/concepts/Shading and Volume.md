---
title: Shading and Volume
type: concept
status: developing
tags: [concept, light, depth-cues, programmability]
created: 2026-05-17
address: c-000058
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Shading and Volume

**Shading** is a gradient of brightness on a surface that the eye reads as a deviation from frontal flatness, producing the perception of **volume**. Arnheim (Chapter VI) gives the geometric rule and its limits.

## The Gehrcke–Lau cone experiment

A whitewashed cone, viewed end-on:

- Evenly lit → seen as a **flat disk** (no shading gradient = no volume).
- Lit from one side → seen as a **cone** (asymmetric shading triggers 3D recovery).

Crucially, *lateral illumination simplifies the pattern in two ways*:

1. It produces a *homogeneously white surface* that, in 3D, comes free of the uneven shading.
2. It translates the gray-scale gradient into a *spatial orientation* (the same way perspective convergence translates parallels into depth).

**Without shading, three-dimensional perception of smooth objects fails even when the contour is visible.**

## The geometric rule for spheres

For a perfectly diffuse (Lambertian) sphere:

> The degree of darkness at any point determines its **angular deviation** from the tangent plane at the brightest spot.

In other words: take the highest-luminance point as the "top" of the sphere. From there, isobrightness contours radiate outward as circles of equal angular distance. Equal darkness ↔ equal angular tilt away from the tangent plane.

This is essentially the **Lambertian cosine law**: $L = I \cos\theta$, where $\theta$ is the angle between the surface normal and the light direction. Arnheim states it perceptually without the math, but the math is what 3D rendering engines implement.

For **non-spherical** objects, the gradient is more complex: shading direction encodes local normal direction, and **parallel surfaces tend to share brightness**, which the eye uses to group them perceptually ("a fly walking across an object" would see chaos; the surveying eye groups similarly oriented patches).

## Shading as plane-grouping

Areas of *similar* brightness are read as *parallel* surfaces. This connects shading directly to [[The Gestalt Principles of Visual Perception]] (similarity grouping). The corollary:

- Parallel facets of a polyhedron get **similar brightness**.
- Tilted facets get **graded brightness**.
- This serves to *knit* the surface together as one coherent object.

Cast shadows and reflections can interfere with this. Sculpture in marble may show veining or dirt that the eye misreads as shading variation, distorting the perceived shape — a problem for marble artists and a free trick for trompe-l'œil.

## The Cézanne "abstract shading" use

Cézanne (and Titian before him) used shading **not** to render illumination but to **separate planes**:

- A green apple may show shades of *different greens* whose distribution doesn't follow any consistent light source — purely to detach overlapping objects from each other.
- A cheek may be darkened against a light background by a gradient of darkness that's "abstract" (without naturalistic light cause).

This is what Schaefer-Simmern calls a developmentally late stage: shading is mastered for its **formal value**, independent of physical illumination. Cubism continued this use.

## Programmable implications

1. **Sphere shading** is the cheapest 3D illusion: a single radial gradient with proper darkening at the edges produces volume. Web-CSS can do it with `radial-gradient(circle at 30% 30%, ...)`.
2. **For arbitrary objects**, shade based on local surface normal (PBR pipelines). The harder choice is *which* light source to use — too many sources defeat the perceptual grouping (Arnheim's two-condition rule, see [[Illumination as a Perceptual Layer]]).
3. **Abstract / Cézanne-style shading**: shade not by light direction but by **plane membership**. This is a useful technique for generative compositions that want depth-cues *without* committing to a physical scene.
4. **For sculpture, branding, logo design**: even a logo can carry shading. A subtle radial gradient on a 2D mark gives apparent convexity without committing to a 3D scene; reverse the gradient for concavity. Use sparingly (modern flat design deliberately avoids this).
5. **For evaluation**: a [[LLM-as-Judge for Visual Quality]] critic can score "is the volume of [X] readable?" by checking the brightness-gradient direction against the implied light direction.

## When shading is NOT a depth cue

- If both the contour and shading converge/curve, depth is reinforced (Figure 224 in Arnheim).
- If the contour is symmetric (e.g., a circle) and shading is symmetric too, **no depth** results.
- If the contour is asymmetric or convex/concave and the shading is **also asymmetric**, depth is strong.

The rule: **distortion must run counter to the simpler frontal-plane reading.** Otherwise it's just texture, not volume.

## Related pages

[[Illumination as a Perceptual Layer]] · [[Chiaroscuro]] · [[Perceptual Gradients]] · [[Simplicity (Arnheim)]] · [[Aerial Perspective]] · [[Figure and Ground]] · [[The Structural Skeleton]]

## Source

Arnheim, *Art and Visual Perception* (1954/1974), Chapter VI "Light," pp. 300–303, 310–311. Empirical work: Gehrcke and Lau on the cone experiment.
