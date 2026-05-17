---
address: c-000182
title: Procedural and Neural Texture Synthesis
type: concept
status: developing
tags: [concepts, texture, procedural, neural, worley, perlin, gatys]
created: 2026-05-17
updated: 2026-05-17
---

# Procedural and Neural Texture Synthesis

The **two contemporary approaches** to generating texture maps without source photos: **procedural** (algorithmic, parametric, deterministic-from-seed — Perlin, simplex, Worley/Voronoi, reaction-diffusion) and **neural** (CNN-feature-correlations, diffusion-model-based, learned-from-data — Gatys et al. 2015 onward). Both pair with [[PBR Material Parameters]] to produce the texture maps (base color, roughness, normal, AO) that PBR pipelines consume.

> [!note] Two lineages, both live
> Procedural noise (Perlin 1985+) and neural synthesis (Gatys 2015+) are **complementary** rather than successor-and-predecessor. Procedural noise is fast, parametric, deterministic, small-footprint. Neural synthesis is high-fidelity, photoreal, but heavier and less controllable. Production work in 2026 uses both — procedural for runtime-generated textures, neural for offline-baked high-quality maps.

## Procedural texture synthesis

### The noise primitives

The foundational building blocks. Most procedural textures are *compositions* of noise functions.

| Noise | Year | Character | Use cases |
|---|---|---|---|
| **Perlin noise** | 1985 (Ken Perlin) | Smooth gradient noise; classic clouds, terrain | Universal default |
| **Simplex noise** | 2001 (Perlin, improved) | Faster + less directional bias than Perlin | Modern Perlin replacement |
| **Worley / cellular noise** | 1996 (Steven Worley) | Distance-to-nearest-feature; cellular patterns | Skin pores, scales, stone, organic |
| **Voronoi diagrams** | (mathematical lineage) | Distance-to-nearest plus region-labels | Cellular structures; Worley's parent |
| **Value noise** | Earliest | Discrete grid values + interpolation | Simple but blocky; mostly superseded |
| **Fractal noise** | (Mandelbrot lineage) | Self-similar across scales | Terrain, clouds, organic patterns |
| **Curl noise** | (Bridson 2007) | Divergence-free vector field | Fluid-flow visualization |
| **Worley-Perlin hybrids** | (community) | Combination patterns | Lava, marble, biological tissue |

The dominant npm package: **`simplex-noise`** (5M+ weekly downloads; see [[PCG Toolkit]]).

### Composition patterns

Real procedural textures compose multiple noises:

```
texture(p) = base_color(perlin(p, freq=1)) +
             surface_detail(perlin(p, freq=8) * 0.5) +
             cellular(worley(p, freq=16)) * variation
```

Multi-octave (fractal Brownian motion / fBm) is the standard pattern: sum N octaves at doubling frequency with halving amplitude. Adds natural-feeling detail across scales.

### Reaction-diffusion systems

For organic / biological patterns ([[Cellular Automata and Reaction-Diffusion|the wiki has a dedicated page]] for the dynamics). The Gray-Scott reaction-diffusion equation produces:

- **Spots** (cheetah, ladybug)
- **Stripes** (zebra, tiger)
- **Mazes** (brain coral, fingerprint)
- **Fluid-flow patterns**

Reaction-diffusion can be generated **directly on arbitrary 3D surface meshes** (Turk 1991) — the simulation runs in surface coordinates, producing patterns that respect surface topology.³

### Where procedural shines

- **Runtime generation** at any resolution; no asset size
- **Deterministic from seed** — fits [[Long-form On-Chain Generative Art|long-form generative art]]
- **Parametric** — tweak frequency, amplitude, octaves, falloff
- **Cross-renderer portable** — same shader runs identically
- **Tiny footprint** — a 50-line GLSL shader = entire texture system

### Where procedural struggles

- **Photoreal cloth, skin, hair** — too irregular for clean parameterization
- **Brand-specific designed textures** — a brand wants *this specific* damask, not "a damask-like pattern"
- **Style consistency across multiple materials** — hard to enforce procedurally

## Neural texture synthesis

### The Gatys lineage

**Gatys, Ecker & Bethge 2015**¹ showed that **pair-wise correlations of features** in a discriminatively-trained CNN (VGG-19, ImageNet) produce dramatically better texture-synthesis than Heeger-Simoncelli statistical features.

The mechanism: given a target texture image, **optimize a new image** to match the Gram matrices (feature correlations) of the target at multiple CNN layers. The optimization runs through gradient descent in image space.

The same architecture, slightly modified, produces **neural style transfer**: combine *content* features from one image with *style* features (Gram matrices) of another. The Prisma app (2016) and contemporary diffusion-model style transfer trace to this lineage.

### Successor architectures

- **Style-based GANs** (Karras et al. 2018+) — separate style + structure
- **Diffusion models** (DDPM 2020+, Stable Diffusion 2022+) — current state-of-art for arbitrary image / texture generation
- **Material-specific neural models**: trained on PBR-parameter datasets, produce metallic-roughness-normal-AO simultaneously
- **Substance / Adobe Firefly textures**: production tools using neural texture generation

### The "semi-procedural" middle ground

Guehl et al. 2020 *Semi-Procedural Textures Using Point Process Texture Basis Functions*: combines **procedural placement** (point processes, Poisson sampling) with **neural appearance** (CNN-features for individual texton appearance).⁴ A texton library + procedural distribution = compelling stochastic textures with low memory.

This pattern (procedural-structure + neural-appearance) is increasingly the production sweet spot for generative texture work.

## The PBR texture set

For a PBR material, a complete texture set is:

| Map | Channels | What it stores |
|---|---|---|
| Base color (albedo) | RGB | Surface color (no lighting baked in) |
| Metallic | Grayscale | 0-1 metallic value per texel |
| Roughness | Grayscale | 0-1 roughness per texel |
| Normal | RGB (tangent-space) | Micro-geometry deviations |
| Ambient occlusion (AO) | Grayscale | Self-shadowing in crevices |
| Optional: height/displacement | Grayscale | True surface elevation (for parallax / tessellation) |

A procedural or neural pipeline produces all of these for a coherent material. The "metallic-roughness packed" texture (some renderers pack metallic into B-channel, roughness into G-channel of a single texture) is the storage-optimized variant.

## Computable handles

For [[three.js]] / [[WebGPU]] procedural-texture work:

```glsl
// Fragment shader; tile-able procedural marble
vec3 marble(vec2 uv) {
  float veining = fbm(uv * 4.0, octaves=6);
  float saturation = smoothstep(0.4, 0.6, veining);
  vec3 base = vec3(0.92);
  vec3 vein = vec3(0.4, 0.35, 0.4);
  return mix(base, vein, saturation);
}
```

For neural texture work: use [[Cloud Inference APIs]] (Replicate / fal.ai) with material-generation models, or [[Transformers.js]] with smaller diffusion models for browser-side.

## Practitioner libraries / tools

Per [[PCG Toolkit]]:

- **simplex-noise** (npm, dominant)
- **Substance Designer / Painter** — node-graph procedural texture authoring (Adobe; production standard)
- **Material Maker** (open-source Substance alternative)
- **ShaderToy** — community-shared procedural texture/shader code
- **PolyHaven** — free PBR-texture library; mostly photographed but procedurally-tileable
- **AmbientCG (formerly CC0 Textures)** — public-domain PBR texture set

For [[WebGPU]] specifically: write WGSL shaders for procedural textures; use [[WGSL Tooling|vite-plugin-glsl]] for hot-reload during development.

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art** ★ | Procedural textures are universal in generative art; neural for high-quality offline renders |
| 2. Branding | Procedural for parametric-identity systems; neural for premium brand assets |
| **3. Graphic design** ★ | Background patterns, paper textures, design system tiles — procedural is the right tool |
| **4. Music-reactive** ★ | Audio-driven procedural texture parameters → live-shifting materials |

## Related

- [[Materials and Texture]] · [[PBR Material Parameters]] · [[Material Perception]] · [[Materiality in Graphic Design]] · [[PCG Toolkit]] · [[Cellular Automata and Reaction-Diffusion]] · [[Cloud Inference APIs]] · [[Transformers.js]] · [[WGSL Tooling]] · [[three.js]] · [[WebGPU]]

## Sources

1. Gatys, Ecker, Bethge. *Texture Synthesis Using Convolutional Neural Networks* (2015). https://arxiv.org/abs/1505.07376
2. Worley, Steven. *A Cellular Texture Basis Function* (SIGGRAPH 1996).
3. Turk, Greg. *Generating Textures on Arbitrary Surfaces Using Reaction-Diffusion* (SIGGRAPH 1991). https://faculty.cc.gatech.edu/~turk/my_papers/reaction_diffusion.pdf
4. Guehl et al. *Semi-Procedural Textures Using Point Process Texture Basis Functions* (Computer Graphics Forum 2020). https://onlinelibrary.wiley.com/doi/10.1111/cgf.14061
5. Perlin, Ken. *An Image Synthesizer* (SIGGRAPH 1985); *Improving Noise* (SIGGRAPH 2002, simplex).
6. PolyHaven: https://polyhaven.com/textures
7. AmbientCG: https://ambientcg.com/
