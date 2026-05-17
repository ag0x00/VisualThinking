---
title: Materials and Texture
type: concept
status: developed
tags: [field, material, texture, perception, catalog-stub]
address: c-000086
created: 2026-05-17
updated: 2026-05-17
priority_rank: 13
depth_dive_complete: 2026-05-17
---

# Materials and Texture

> [!success] Depth-dive complete 2026-05-17
> See [[Research - Practical Design Sweep]]. Page-by-page coverage: [[PBR Material Parameters]] · [[Material Perception]] · [[Procedural and Neural Texture Synthesis]] · [[Materiality in Graphic Design]].

**Field stub from catalog sweep 2026-05-17, now depth-dived.**

The perception of **what something is made of** from visual cues alone: cloth vs metal, polished vs rough, hard vs soft, warm vs cool to the touch, light vs heavy. Closely tied to the **perception of "thingness"** — the categorical reading that says "this is a *kind of stuff*."

A largely undocumented topic for the wiki, but operationally critical for any photorealistic generation pipeline and for the perceived premium-vs-cheap quality of any design.

## Canonical figures and traditions

- **James J. Gibson** — *The Senses Considered as Perceptual Systems* (1966); the founding **ecological** account of texture and material perception.
- **Roland Fleming** — *Visual perception of materials and their properties* (2014, Vision Research review). Contemporary anchor; computational + perceptual account.
- **Edward H. Adelson** — *Beyond Lambert: reconstructing complex surfaces from extended highlights* (1996); the lab that brought material perception into computational vision.
- **Ed Catmull & Pat Hanrahan & James Kajiya** — the rendering-equation lineage (RenderMan, 1980s+); the engineering anchor for material rendering.
- **David Marr** — *Vision* (1982); foundational work on surface representation in the 2½-D sketch.

## Key concepts (depth-dive will expand)

### Surface properties the eye estimates

| Property | Optical cue | Perceptual category |
|---|---|---|
| **Roughness** | Specular highlight sharpness; texture-detail visibility | smooth ↔ rough |
| **Glossiness** | Specular-to-diffuse ratio; sharp vs broad highlight | matte ↔ glossy |
| **Translucency** | Light penetration and re-emergence; subsurface scattering | opaque ↔ translucent ↔ transparent |
| **Iridescence** | Color shift with viewing angle | none ↔ pearlescent ↔ rainbow |
| **Metallic** | Hue of the highlight matches the body color | dielectric ↔ metallic |
| **Velvet / fuzz** | Inverse-Lambertian falloff (Fresnel-like edges) | smooth ↔ fuzzy |
| **Wetness** | High specular + slightly desaturated surface | dry ↔ wet |

### Material categories

- **Hard non-metal**: wood, stone, ceramic, plastic. Subdivides further by surface texture and gloss.
- **Hard metal**: silver/gold/copper specifics. Color of highlight = color of metal.
- **Soft cloth**: cotton, silk, leather, velvet, wool. Distinguishable by gloss, drape, fiber-detail texture.
- **Translucent**: glass, water, jade, wax, skin. Subsurface scattering is the major cue.
- **Living tissue**: skin, fur, plant, eyes. Subsurface scattering + specific texture patterns + specular highlights (corneal, lip).
- **Liquid**: standing water, splashes, slurry. Specular + surface tension + transparency.

### Statistical-image accounts

- Heeger & Bergen 1995, Portilla & Simoncelli 2000: textures are described by **statistical features** of image patches (orientation histograms, contrast moments, scale relations). The visual system uses similar statistics to discriminate materials.
- This is why **fine-tuned procedural textures** that match these statistics read as the material; not the underlying physical model.

### Material expression in design

- **Premium materials** read as such even in 2D: matte black, brushed metal, leather grain, wood grain, fine paper texture. Brands signal value by referencing these.
- **Materiality in graphic design** — debossed/embossed effects, foil stamping, letterpress impressions. The contemporary digital revival: skeuomorphic textures in iOS 6, then flat-design backlash, then materialised flat design (Material Design).
- **Texture in generative art** — a flat-color generative composition reads as "cheap"; the same composition with paper-grain noise or canvas texture reads as "fine art."

### PBR (Physically Based Rendering)

- The modern materials pipeline: parameterize each material by **base color (albedo)**, **metallic**, **roughness**, **normal**, **ambient occlusion**, and (for translucents) **subsurface** + **transmission**.
- glTF 2.0's PBR metallic-roughness is the de-facto standard. three.js, WebGPU, Unreal, Unity all converge on this.
- Maps cleanly to perceptual material-property dimensions; the engineering and the perception are now aligned.

## Why this matters for the wiki's four priorities

| Priority | Use |
|---|---|
| 1. Generative art | 3D/WebGPU generators need PBR. 2D generators need texture-layer for "fine-art" reading. |
| 2. Branding | Brand materiality is identity: Apple's aluminum, Tiffany's blue box paperstock, Hermès's leather. |
| 3. Graphic design | Texture in print (paperstock, foil, deboss). On web: subtle paper/grain texture, glassmorphism. |
| 4. Music-reactive visualizers | Material choice (glass vs metal vs liquid) entirely changes the feel of an audio-reactive scene; bass on metal = ring; bass on liquid = ripple; bass on cloth = thud. |

## Connection to existing wiki pages

- [[Shading and Volume]] — Arnheim's Lambertian rule is the diffuse component of PBR. Material perception adds the specular + subsurface complications.
- [[Illumination as a Perceptual Layer]] — material perception requires the two-layer split to work; you can't separate "what color is this metal" from "how is it lit" without it.
- [[Perceptual Constants]] — color constancy / lightness constancy are *prerequisites* for material perception.
- [[Light Vocabulary]] — three-point lighting reveals materials; flat lighting hides them.
- [[Physiognomic Perception]] — materials are read physiognomically (hard, soft, warm, cold) before geometric analysis.

## What's missing

- A canonical PBR-parameter table mapped to perceptual properties.
- Texture-statistics (Portilla-Simoncelli) introduction.
- Procedural-texture techniques (Worley noise, Voronoi-based, reaction-diffusion).
- The materiality of pixel-art / vector / "designed" textures vs photographic.
- Skeuomorphism debates (2007–2013) and Material Design 2014.

## Depth-dive plan (queued)

1. **PBR parameter set** as the operational anchor. Map metallic-roughness-normal to perceptual properties.
2. **Fleming 2014 review** as the contemporary perception state-of-the-art.
3. **Heeger-Simoncelli texture statistics** for the texture-similarity work.
4. **Procedural-texture catalog** (Worley, Perlin, reaction-diffusion, Voronoi).
5. **Materiality in graphic design** — paperstock, foil, deboss; how to communicate these in screen-only contexts.

## Related pages

[[Shading and Volume]] · [[Illumination as a Perceptual Layer]] · [[Perceptual Constants]] · [[Light Vocabulary]] · [[Physiognomic Perception]] · [[Aerial Perspective]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources to consult in depth-dive

- Fleming 2014 "Visual perception of materials and their properties" — *Vision Research* 94.
- Gibson 1966 *The Senses Considered as Perceptual Systems*.
- Adelson 2001 "On seeing stuff: the perception of materials by humans and machines" — *SPIE Human Vision and Electronic Imaging VI*.
- Heeger & Bergen 1995 "Pyramid-based texture analysis/synthesis" — SIGGRAPH '95.
- Portilla & Simoncelli 2000 "A parametric texture model based on joint statistics of complex wavelet coefficients" — IJCV 40.
- Pharr, Jakob & Humphreys 2016 *Physically Based Rendering* (engineering anchor).
- glTF 2.0 PBR specification (Khronos Group).
