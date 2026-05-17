---
address: c-000180
title: PBR Material Parameters
type: concept
status: developing
tags: [concepts, material, pbr, gltf, metallic-roughness, three-js]
created: 2026-05-17
updated: 2026-05-17
---

# PBR Material Parameters

The **canonical material-parameter set** of physically-based rendering — base color, metallic, roughness, normal, ambient occlusion, plus extension layers (clearcoat, transmission, sheen, iridescence, specular, anisotropy). Defined in **glTF 2.0** (Khronos Group) and its **KHR_materials_*** extensions; the de-facto industry standard.

> [!note] One canonical anchor; widely adopted
> Unlike many wiki anchors, the glTF 2.0 PBR specification has **broad industry consensus** — three.js, Babylon.js, Unreal, Unity, Blender, Maya, all converge here. Disney's Principled BSDF (2012) is the theoretical-historical anchor; glTF 2.0 metallic-roughness is the implementation-portable surface. The new Disney Principled BSDF v2 (under development in Blender as of 2026) is the named successor at the renderer-internal level, but glTF 2.0 remains the *interchange* standard.¹

## The core (glTF 2.0 metallic-roughness)

Six channels every PBR material needs:

| Parameter | Range / type | Controls | Perceptual meaning |
|---|---|---|---|
| **Base color** (albedo) | RGB or texture | Diffuse + metal-tint color | "What color is this stuff" |
| **Metallic** | 0-1 scalar or texture | 0 = dielectric (plastic/wood/skin); 1 = metal | Categorical: is this metal? |
| **Roughness** | 0-1 scalar or texture | 0 = mirror; 1 = matte | Highlight sharpness; texture-detail visibility |
| **Normal map** | RGB texture (tangent-space) | Surface micro-geometry | Bumps, scratches, fabric weave |
| **Ambient occlusion** | grayscale texture | Self-shadowing in crevices | Depth and dirt |
| **Emissive** | RGB or texture | Self-emitted light | Glowing surfaces |

These six are enough for ~80% of real-world materials.

### The metallic/dielectric distinction

This is the **single most-important PBR categorization**:

- **Dielectric** (metallic = 0): plastic, wood, paint, skin, fabric, ceramic, stone. Has *both* diffuse + specular components. Specular highlight color is **white** (or matches light color); body color is the diffuse albedo.
- **Metallic** (metallic = 1): aluminum, gold, copper, steel, silver. Has *only* specular (no diffuse). Specular highlight color is **the base color** (gold highlight is gold; copper highlight is copper).

Skin reads as dielectric (metallic = 0); polished brass reads as metallic (metallic = 1) with base color brass-yellow. The metallic value drives the entire light-interaction model.

### The roughness curve

Roughness is *not* perceptually linear:

- **0.0-0.05** — mirror-polished; near-perfect specular reflection. Highlights are pinpoint.
- **0.05-0.2** — high gloss (lacquered car paint, polished metal)
- **0.2-0.4** — semi-gloss (satin finish, smooth plastic)
- **0.4-0.6** — semi-matte (eggshell paint, dry skin, paper)
- **0.6-0.8** — matte (chalk, unpolished concrete, fabric)
- **0.8-1.0** — fully diffuse (felt, deep velvet, very rough stone)

Most real-world materials live in 0.3-0.7. Pure mirror-finish (0) and pure-matte (1) are rare in nature.

## The KHR_materials extensions (essential for realism)

Beyond the core, glTF 2.0 ships substantial material extensions:²

### KHR_materials_clearcoat

Adds a thin **clearcoat layer** on top of the base material: car paint, lacquered wood, smartphone glass over a screen. Two parameters: `clearcoat` (presence, 0-1) + `clearcoatRoughness` (the clearcoat's own roughness).

### KHR_materials_transmission

Adds **light transmission** through the material: glass, water, clear plastic. The model preserves specular reflection (you see reflections on glass) while light passes through. Parameters: `transmission` (0-1) + optional `ior` (index of refraction).

### KHR_materials_sheen

For **microfiber cloth** (velvet, satin, brushed fabric). The Fresnel-like grazing-angle highlight you see on fabric. Parameters: `sheenColor` + `sheenRoughness`.

### KHR_materials_iridescence

Color-shift with viewing angle (soap bubble, oil slick, pearl, certain insect wings). Parameters: `iridescence` (presence) + `iridescenceIor` + `iridescenceThicknessMinimum/Maximum`.

### KHR_materials_specular

Override the default dielectric-specular (which is `F0 ≈ 0.04` IOR ~1.5) for materials with unusual specular response (gemstones, water vs glass distinction).

### KHR_materials_anisotropy

For **anisotropic reflections** (brushed metal, hair, vinyl record). The highlight stretches in the brushing direction.

### KHR_materials_volume

Used with transmission for **subsurface scattering** approximations (jade, candle wax, skin). Parameters: `thicknessFactor`, `attenuationDistance`, `attenuationColor`.

## Perceptual-property mapping

Per [[Material Perception]] (Fleming lineage), the eye estimates surface properties from optical cues. The PBR parameter mapping:

| Perceived property | Primary PBR parameter | Secondary PBR parameter |
|---|---|---|
| Smoothness vs roughness | roughness | normal-map detail amplitude |
| Glossy vs matte | roughness | clearcoat (presence) |
| Opaque vs translucent | transmission | volume thickness |
| Iridescent | iridescence | — |
| Metal vs non-metal | metallic | base-color (saturation) |
| Velvet / fuzzy | sheen | sheenRoughness |
| Wet | roughness (low) + specular boost | clearcoat |
| Heavy (visual cue) | base-color darkness + clearcoat reflectance |
| Brushed (anisotropic) | anisotropy + roughness |

The mapping is *operational* — a generator that wants to produce "wet stone" sets roughness = 0.1, base-color = stone-dark, optionally clearcoat = 1.0 (water layer). The mapping is the bridge from artist-vocabulary to renderer-vocabulary.

## Material vocabulary cheatsheet

| Material | Metallic | Roughness | Extensions | Notes |
|---|---|---|---|---|
| Polished metal | 1.0 | 0.05-0.15 | — | Base color = metal tint |
| Brushed metal | 1.0 | 0.3-0.5 | anisotropy | Direction matters |
| Plastic (glossy) | 0 | 0.1-0.3 | clearcoat optional | Base color = plastic color |
| Plastic (matte) | 0 | 0.5-0.7 | — | Most consumer plastic |
| Wood (varnished) | 0 | 0.2-0.4 | clearcoat | Normal map = grain |
| Wood (raw) | 0 | 0.6-0.8 | — | Normal map = grain + roughness map |
| Ceramic (glazed) | 0 | 0.1-0.2 | — | Like glossy plastic |
| Concrete | 0 | 0.7-0.9 | — | Heavy roughness map for variation |
| Skin | 0 | 0.4-0.6 | sheen (subtle) + subsurface (volume) | Plus normal + AO + microbump |
| Hair | 0 | varies | anisotropy + sheen | Direction in anisotropy |
| Cotton fabric | 0 | 0.8-1.0 | sheen | Soft fuzz |
| Velvet | 0 | 0.9-1.0 | sheen (high) | Sheen is the defining cue |
| Glass | 0 | 0.0-0.1 | transmission (1.0) + ior 1.5 | Plus volume thickness |
| Water | 0 | 0.0 | transmission (1.0) + ior 1.33 | — |
| Liquid metal | 1.0 | 0.0 | — | Rare; perfectly mirror metal |
| Pearl | 0 | 0.2-0.4 | iridescence | Iridescence is the cue |
| Soap bubble | 0 | 0.0 | iridescence + transmission | Thin film |

## Texture vs scalar

Every PBR parameter can be either:

- **Scalar** (single value across the surface)
- **Texture** (per-texel variation)

Real materials are *almost always* per-texel — uniform color is unusual outside designer-vinyl. A roughness *map* (variation across surface) gives more material-realism than a single roughness value, because real surfaces have weathering, dirt, scratches.

Procedural texture generation (see [[Procedural and Neural Texture Synthesis]]) can produce maps without source photos.

## Computable handles for generative art

For a [[three.js]] or [[WebGPU]] generative system:

```javascript
// three.js MeshStandardMaterial (glTF 2.0 metallic-roughness)
const material = new THREE.MeshPhysicalMaterial({
  color: 0xb87333,            // copper base
  metalness: 1.0,
  roughness: 0.15,            // polished but not mirror
  envMapIntensity: 1.0,       // depends on env-map
  clearcoat: 0.0,
  ior: 1.5
});
```

For LLM-driven systems:

- Encode material recipes as named presets (`"polished_copper"`, `"velvet_red"`, `"wet_river_stone"`)
- Pass scenes through PBR-compliant materials only; reject ad-hoc lighting "tricks"
- For long-form generative art: `MeshPhysicalMaterial` parameter variation is a rich source of distributional variety

## Critique / caveats

- **Cross-renderer consistency** is good but not perfect. Same glTF 2.0 file can look slightly different across renderers due to specular F0, IBL precomputation, and tone-mapping choices.
- **Disney Principled BSDF v2** (Blender 2026) is the next-generation node; backward-compatible with glTF 2.0 but adds more controls. Watch for adoption.
- **Real materials sometimes don't fit PBR**: hair fibers, subsurface-heavy biological materials, holographic foil, lenticular prints. PBR is a *useful approximation*, not a complete physics model.

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art** ★ | PBR is the baseline for 3D generative art quality |
| **2. Branding** | Product-viewer 3D for ecommerce; brand-asset 3D rendering |
| 3. Graphic design | Less direct; 3D-rendered hero imagery |
| 4. Music-reactive | Material choice changes visualizer feel; glass / metal / liquid / cloth give distinct moods |

## Related

- [[Materials and Texture]] (parent stub) · [[Material Perception]] · [[Procedural and Neural Texture Synthesis]] · [[Materiality in Graphic Design]] · [[PBR Lighting and ACES Tone Mapping]] · [[three.js]] · [[WebGPU]] · [[Shading and Volume]]

## Sources

1. *PBR - Physically Based Rendering in glTF*, Khronos. https://www.khronos.org/gltf/pbr/
2. *Khronos Releases Wave of New glTF PBR 3D Material Capabilities*. https://www.khronos.org/news/press/khronos-releases-wave-of-new-gltf-pbr-3d-material-capabilities
3. *KHR_materials_clearcoat / transmission / sheen / iridescence* — glTF GitHub extensions: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos
4. Pharr, Jakob & Humphreys. *Physically Based Rendering: From Theory to Implementation* (3rd ed. 2016).
5. Disney Principled BSDF: Burley, Brent. *Physically-Based Shading at Disney* (SIGGRAPH 2012).
6. three.js MeshPhysicalMaterial: https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial
