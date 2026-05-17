---
address: c-000179
title: PBR Lighting and ACES Tone Mapping
type: concept
status: developing
tags: [concepts, light, pbr, aces, tone-mapping, hdr, webgpu]
created: 2026-05-17
updated: 2026-05-17
---

# PBR Lighting and ACES Tone Mapping

The **operational pipeline** translating cinematic-lighting vocabulary ([[Three-Point Lighting and Key-Fill Ratio|three-point]], [[Light Quality Direction and Motivation|quality/direction/motivation]], [[Cinematic Lighting Traditions|tradition]]) into 3D-renderer parameters: physically-based rendering (PBR) light setup, HDR (high-dynamic-range) scene radiance, and **ACES tone-mapping** (now ACES 2.0 as of 2024) for display output. The technical anchor for any 3D / WebGPU generative-art work targeting cinematic quality.

> [!note] Successor-theory tracking
> ACES 1.0 (2014) was the standard for most of the 2010s. **ACES 2.0** shipped in 2024 with substantially redesigned tone-mapping (less aggressive, better hue preservation, multi-display consistency).¹ Old ACES tutorials reference v1; for new work use ACES 2.0 if your renderer supports it.

## Why PBR matters

PBR (physically based rendering) is the **engineering vocabulary** that makes cinematic-lighting accessible:

- **Energy-conserving**: surfaces reflect ≤ incident light; no "free brightness"
- **Material-light decoupled**: same material under different lights produces consistent reads (a metallic surface always looks metallic; a velvet always looks velvet)
- **Physically-calibrated units**: lights specified in nits / lumens / Kelvin, not arbitrary intensities
- **Cross-engine portability**: glTF 2.0 material defined once, renders consistently in three.js, Babylon, Unreal, Blender, Unity

## The HDR scene-radiance pipeline

Modern PBR renderers separate **scene-referred** (linear, HDR, physically-correct) from **display-referred** (sRGB / Rec.709 / HDR10, gamma-encoded, display-tuned) values. The pipeline:

```
1. Materials + lights compute scene-radiance in linear HDR space (often 16-bit float per channel)
2. Camera exposure converts scene-radiance to relative-exposure values
3. Tone-mapping operator maps HDR exposure to 0-1 display range, preserving perceived contrast
4. Display-encoding (sRGB gamma, or PQ for HDR10) writes output
```

The **tone-mapping operator** is where 90% of "looks cinematic vs looks CGI" gets decided.

## ACES (Academy Color Encoding System)

ACES is the **film/cinema-grade** color-management + tone-mapping standard, developed by the Academy of Motion Picture Arts & Sciences. Originally for film production; increasingly adopted in real-time renderers (Unreal 5, three.js, Blender).

### ACES color spaces

- **ACES2065-1 (AP0)** — archival; widest gamut; "the ACES color space"
- **ACEScg (AP1)** — wide-gamut working space for CG/VFX; the renderer's working space
- **ACEScct** — log-encoded working space for color grading

### ACES rendering transform (the tone-mapper)

The **ACES RRT (Reference Rendering Transform) + ODT (Output Device Transform)** combination converts ACEScg radiance values to display-referred output (sRGB / Rec.709 / HDR10 / DCI-P3 / Dolby Cinema 108 nit / etc.). The transform produces:

- **Smooth roll-off** of highlights (no clipping artifacts)
- **S-curve** contrast in shadow + highlight
- **Color preservation** through tone-mapping (less hue-shift than older operators like Reinhard)

### ACES 2.0 (2024) improvements

ACES 2.0 brings significant changes:¹

- **Less aggressive tone scale** — preserves more highlight detail
- **Meticulous hue preservation** — colors don't shift as much through tone-mapping
- **Better SDR ↔ HDR consistency** — single working scene targets multiple displays cleanly
- **Display setups**: 48 nit cinema, 100 nit video/SDR, 108 nit Dolby Cinema, 1000 nit HDR

DaVinci Resolve 20 added enhanced ACES 2.0 support. three.js / Blender / Unreal are at various stages of ACES 2.0 adoption.

## The full pipeline for cinematic-quality generative art

```
Light source [HDR linear, Kelvin temperature, motivated by scene]
         ↓
Material BRDF (glTF 2.0 PBR) [base color, metallic, roughness, normal, IOR, ...]
         ↓
Scene radiance buffer [HDR linear, 16-bit float]
         ↓
Camera exposure (manual or auto)
         ↓
ACES RRT + ODT (or alternative tone-mapper)
         ↓
sRGB / Rec.709 / HDR10 display output
```

Each stage has accessible parameters; the **light source intensity** + **camera exposure** combine to determine "image brightness" — analogous to film cinematographer's stop and ND-filter choices.

## Alternative tone-mapping operators

ACES is one tone-mapper among several:

| Operator | Description | When |
|---|---|---|
| **Reinhard** (2002) | Simple `x / (1 + x)`; soft roll-off | Easy; classic GFX |
| **Filmic (Hable / Uncharted 2)** | S-curve; warmer than Reinhard | Game-engine default ~2010-2017 |
| **ACES (RRT + ODT)** | Film-grade; preserves hue | Cinematic quality, ~2017+ |
| **ACES 2.0** | Improved hue preservation; multi-display | 2024+, current state-of-art |
| **AGX** (Troy Sobotka, 2022) | Hue-preserving alternative to ACES | Blender default since 4.0; gaining adoption |
| **PBR Neutral** (Khronos) | Khronos-designed for glTF; balanced | Standard for glTF viewers |

For three.js: `THREE.ACESFilmicToneMapping` is built-in (older ACES). `THREE.NeutralToneMapping` (PBR Neutral) was added in r167+ (2024). AGX is third-party.

For WebGPU custom shaders: implement ACES or AGX in fragment-shader code; small (~20 lines GLSL each).

## Linking PBR-lighting to cinematic traditions

The bridge from [[Cinematic Lighting Traditions]] to PBR parameters:

| Tradition | PBR-lighting recipe |
|---|---|
| Classical Hollywood / glamour | 3 directional lights (key softbox 2-3m, fill ~25% intensity, rim 50%), low haze (0.05 density), ACES, exposure target = middle gray |
| Noir | 1 hard directional key (small area light), no fill or 10% fill, atmospheric haze 0.2+ density, ACES 2.0 with shadow detail preserved |
| New Naturalism | 1 environment light + practical fixtures only, no traditional 3-light setup, ACES 2.0, exposure tuned to motivated source brightness |
| Music video | 3-5 colored lights with extreme angle, gel-tinted (RGB pure colors), heavy fog/haze 0.5+, filmic or AGX tone-mapping for stylization |
| Streaming cinematic | Three.js soft area lights + global illumination, color-graded post (LUT applied after tone-mapping), teal/orange grade |

## Real-time global illumination (the contemporary frontier)

For [[WebGPU]]-based generative art, **real-time GI** is the 2025-2026 frontier. Options:

- **Lumen (Unreal Engine 5)** — production-tier; not browser-accessible directly
- **Surfel-based GI** (Jure Triglav, 2024+) — open WebGPU implementation; compute-shader-based; achievable
- **Voxel cone tracing** — older but proven; available in Babylon.js
- **Screen-space GI (SSGI)** — cheaper; acceptable for many uses
- **Neural GI** (TransGI 2025) — emerging; ML-driven; research-stage
- **Native ray-tracing**: NOT in WebGPU spec; compute-shader emulation only, slower than HW RT

For most browser-deployed work in 2026, **environment-map IBL (image-based lighting) + screen-space-AO + screen-space-GI** is the production-realistic combination. Full path tracing remains offline.

## Computable handles

For a generative system:

- `renderer.toneMapping = THREE.ACESFilmicToneMapping` (or `NeutralToneMapping`)
- `renderer.toneMappingExposure = 1.0` (key cinematographer "ISO" control)
- `renderer.outputColorSpace = THREE.SRGBColorSpace`
- Lights: use `physicallyCorrectLights` and specify intensity in lumens (or candela for spot/point)
- Environment: `PMREMGenerator` for IBL from HDR equirect map
- glTF 2.0 materials with KHR_materials extensions for sheen, clearcoat, transmission

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art** ★ | PBR + ACES is the *baseline* for cinematic-quality 3D generative art |
| 2. Branding | Product viewers / immersive brand experiences need PBR + ACES |
| 3. Graphic design | Mostly static; less direct but applies to 3D-rendered hero imagery |
| 4. Music-reactive | Real-time GI matters here; ACES less critical for live work |

## Related

- [[Light Vocabulary]] · [[Three-Point Lighting and Key-Fill Ratio]] · [[Light Quality Direction and Motivation]] · [[Cinematic Lighting Traditions]] · [[PBR Material Parameters]] · [[Material Perception]] · [[The Color Stack]] · [[WebGPU]] · [[WGSL Tooling]] · [[three.js]]

## Sources

1. *Leveraging ACES 2.0 in DaVinci Resolve*, Cubie Color. https://www.cubiecolor.com/post/aces-2-0-davinci-resolve-color-grading
2. *Tone Mapping*, ACES Documentation. https://docs.acescentral.com/system-components/output-transforms/technical-details/tone-mapping/
3. *PBR Neutral Tone Mapping*, Khronos. https://modelviewer.dev/examples/tone-mapping
4. *Surfel-based global illumination on the web*, Jure Triglav. https://juretriglav.si/surfel-based-global-illumination-on-the-web/
5. *Advances in Real-Time Rendering in Games*, SIGGRAPH 2025. https://advances.realtimerendering.com/s2025/index.html
6. AGX tone-mapper: https://github.com/sobotka/AgX
7. three.js NeutralToneMapping docs: https://threejs.org/docs/#api/en/constants/Renderer
