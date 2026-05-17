---
title: three.js Addon Ecosystem
type: tool-overview
status: developing
tags: [tool, ecosystem, three.js, addons, drei, pmndrs, javascript]
address: c-000137
created: 2026-05-17
sources: ["[[three.js]]"]
confidence: high
---

# three.js Addon Ecosystem

A **survey** of the addon / extension libraries that extend [[three.js]]. Three.js itself ships with an **examples/jsm** directory (~150 add-on modules) and is surrounded by a large external ecosystem — controls, loaders, post-processing, helpers, physics, ML, AR/VR, and more.

Part of the addendum to the original Algorithmic Composition + Tools sweep. The [[three.js]] page covered the core library; this page covers the *ecosystem around it* that determines real productivity for non-trivial work.

## Three.js core examples/jsm modules

These ship with three.js but are imported separately (not part of the default bundle). The major categories:

### three-stdlib (the pmndrs maintenance fork)

Before listing the core modules: **three-stdlib** (~12M weekly downloads, MIT) is the **pmndrs-maintained standalone version** of three.js's examples/jsm directory. It decouples the addon ecosystem from three.js's core release cycle and adds TypeScript-first packaging.

**Use three-stdlib instead of three.js's bundled examples** when:
- You want stable addon versions independent of three.js core upgrades.
- You're using react-three-fiber + drei (drei depends on three-stdlib internally).
- You want better TypeScript types than the core's examples ship with.

Most production three.js work in 2026 uses three-stdlib transparently via drei.

### Controls

- **From core/three-stdlib**: `OrbitControls`, `TrackballControls`, `FlyControls`, `FirstPersonControls`, `MapControls`, `PointerLockControls`, `ArcballControls`, `DragControls`, `TransformControls`.
- **camera-controls** (yomotsu, ~12M weekly dl, MIT) — **the production-grade alternative to OrbitControls**. Smooth damped transitions, programmatic camera moves (truck, dolly, fitToBox), better mobile support, focus-on-target with animation. Used at scale in product configurators, AR previewers, brand sites. drei exposes it as `<CameraControls>`.
- **Default recommendation**: `OrbitControls` for quick setup; **camera-controls** for production-quality interaction and programmatic camera moves.

### Loaders

- `GLTFLoader` (glTF / GLB — the modern standard), `OBJLoader`, `FBXLoader`, `DRACOLoader` (compressed geometry), `KTX2Loader` (compressed textures), `RGBELoader` (HDR), `EXRLoader`, `SVGLoader`, `FontLoader`.
- **Default recommendation**: GLTF for 3D models; KTX2 + DRACO for production performance.

### Post-processing (built-in path)

- `EffectComposer` + render passes (`RenderPass`, `UnrealBloomPass`, `OutlinePass`, `ShaderPass`, etc.).
- **Note**: For production-quality post-processing, prefer the external `pmndrs/postprocessing` library (next section) — it's significantly better.

### Geometry helpers

- `BufferGeometryUtils` (merge / instance / index), `ParametricGeometry`, `TextGeometry`, `MeshSurfaceSampler`, `ConvexHull`.

### Math / scene utilities

- `MeshoptDecoder` (high-performance mesh decompression), `BVH` (bounding-volume hierarchies for raycasting), `LightProbeGenerator`, `SceneUtils`.

### Animation

- `AnimationUtils`, `MMDAnimationHelper`, integration with skinned-mesh rigs.

The examples/jsm modules are **first-party**; they're production-ready and well-documented. Always tree-shake imports.

## HDR workflows

Production-quality three.js scenes with realistic lighting use HDR environment maps and tone-mapping. The relevant addons:

- **@monogrid/gainmap-js** (~11M weekly dl, MIT) — Adobe Gainmap Technology port: store HDR images as an SDR base + a gain map. Allows shipping HDR-capable environments to standard web browsers without full HDR file formats. **Increasingly the production HDR-shipping standard.**
- **Three-stdlib `RGBELoader`, `EXRLoader`** — load `.hdr` and `.exr` HDR environment maps.
- **Drei `<Environment preset="..." />`** — built-in HDR presets (warehouse, studio, sunset, etc.) for one-line image-based lighting.

For shipping production scenes: **drei `<Environment>` + gainmap for custom HDRs** is the modern workflow.

## Adaptive quality / performance budgeting

Production three.js apps need to **degrade gracefully on weak hardware**. The key tool:

- **detect-gpu** (~11M weekly dl, MIT) — Classifies the user's GPU via a benchmark database; returns a tier (TIER_0 to TIER_3) plus FPS hints. Lets you adapt scene quality (texture resolution, shadow quality, particle counts, post-processing chain) per-device automatically.
- **drei `<PerformanceMonitor>`** — Runtime FPS monitoring with callbacks for quality scaling. Pairs with detect-gpu for static + dynamic adaptation.
- **three-stdlib `BufferGeometryUtils.mergeBufferGeometries`** — reduce draw calls dynamically.

The pattern: **detect-gpu at app startup → set initial quality tier → drei PerformanceMonitor adjusts at runtime** as the scene's complexity or the device's load changes.

## External ecosystem: pmndrs (Poimandres)

The **Poimandres collective** maintains the dominant external addon ecosystem for three.js + react-three-fiber:

| Library | Purpose |
|---|---|
| **drei** (`@react-three/drei`) | r3f helpers — 200+ utility components; the canonical r3f-addon library. See [[react-three-fiber]] for detail. |
| **postprocessing** | Production-quality post-processing chain (better than three.js core's). Bloom, depth-of-field, SSAO, SMAA, motion blur, custom effects. Works with vanilla three.js too. |
| **react-three-postprocessing** | r3f wrapper for the postprocessing lib. |
| **react-three-rapier** | Rapier physics engine bindings for r3f. |
| **react-three-cannon** | Cannon physics engine bindings (older; rapier is the modern choice). |
| **react-three-csg** | Constructive solid geometry (CSG) for r3f. |
| **react-three-fiber** itself | See [[react-three-fiber]]. |
| **leva** | GUI control panels (TweakPane-style). Best-in-class GUI for r3f projects. |
| **maath** | Math helpers (curves, geometry, random distributions). |
| **react-spring** | Spring-physics animation; works beautifully with r3f via `@react-spring/three`. |
| **zustand** | State management; lightweight, popular with r3f. |

All MIT-licensed; all actively maintained; many shipped in production at scale.

## Standalone three.js external addons

Beyond pmndrs:

### Text rendering

- **troika-three-text** — high-quality 3D text with SDF rendering; supports any TTF font, multi-line layout, color/material. **Best-in-class** for text in three.js scenes.
- **three-mesh-bvh** — accelerated raycasting for large meshes.

### Animation and motion

- **theatre.js** — visual animation editor + JS API; production-quality animation tooling.
- **GSAP** + three.js — animation library that works on any property; pair with three.js scenes for tweening.
- **anime.js** — lighter-weight animation alternative.

### Volumetric / NeRF / Gaussian Splatting

- **three-gaussian-splatting** — render Gaussian splats in three.js.
- **luma-web** — NeRF / Gaussian splat viewers.
- **three-nebula** — particle systems (advanced).

### Physics engines

- **rapier3d** — Rust-based physics engine (via WASM); the modern choice.
- **cannon-es** — JS-native physics; mature but older.
- **enable3d** + Ammo.js — Bullet physics in 3D.

### Shader / material extensions

- **three-shader-fxaa**, **three-shader-glsl** — shader utilities.
- **TSL** (Three.js Shading Language) — built into three.js r150+; node-based shader graphs that compile to WebGL or WebGPU.

### Modeling / CAD

- **OpenSCAD-WASM** — programmatic CAD; export to three.js.
- **three-csg-ts** — constructive solid geometry.

### Vector graphics / 2D in 3D

- **three-svg-renderer** — SVG output from three.js scenes.
- **CSS3DRenderer** (in examples/jsm) — render HTML elements with 3D transforms.

### XR (AR/VR)

- **WebXR** (via three.js core).
- **react-three-xr** — r3f's XR integration.
- **mind-ar-js** — AR (image / face tracking).

## Information visualization on three.js (Vasco Asturiano's ecosystem)

A coherent set of libraries by **vasturiano** for **data visualization in 3D**. Useful for priority 3 (graphic design) when the work involves spheres / globes / networks / graphs, and for priority 1 when generative work has a data-driven angle.

| Library | Purpose | Weekly dl |
|---|---|---|
| **3d-force-graph** | 3D force-directed graph (uses three.js + d3-force-3d) | ~870K |
| **react-force-graph-3d** | React wrapper of above | ~530K |
| **three-forcegraph** | Force-directed graph as a three.js scene object | ~840K |
| **globe.gl** | UI component for globe data visualization | ~650K |
| **three-globe** | Globe as a three.js scene object | ~840K |
| **react-globe.gl** | React wrapper of globe.gl | ~510K |
| **three-slippy-map-globe** | Tiled slippy-map on a globe | ~694K |
| **three-conic-polygon-geometry** | GeoJSON polygons on spheres | ~898K |
| **three-geojson-geometry** | GeoJSON line/stroke geometry on spheres | ~805K |
| **three-render-objects** | Easy-render-with-interaction wrapper | ~1.4M |

**When to use this ecosystem**:

- **Globe-shaped data viz**: globe.gl or react-globe.gl (e.g., showing flights, trade flows, cyber attacks, climate data).
- **Force-directed network graphs in 3D**: 3d-force-graph (organization charts, knowledge graphs, social networks).
- **GeoJSON on globes**: three-conic-polygon-geometry + three-geojson-geometry (country outlines, weather fronts, geographic boundaries on globes).

All MIT-licensed; vasturiano is the sole maintainer (consistent active development since 2018+, multiple releases per month).

**Caveat**: this is a **niche ecosystem** — relevant only when the work is specifically information-visualization. For pure generative art / branding / music-reactive visualization, it's overkill. But within its niche, it's the **production-standard** stack (used by NASA, Bloomberg, many corporate dashboards).

## A recommended three.js production stack

For a typical priority-1 / priority-2 / priority-4 React-based 3D project in 2026:

```
react                                  (UI)
react-three-fiber                      (declarative three.js)
three                                  (the core)
@react-three/drei                      (helpers + components)
postprocessing (or @react-three/postprocessing)  (effects)
leva                                   (parameter controls)
zustand                                (state)
troika-three-text                      (text)
react-three-rapier                     (physics, if needed)
culori                                 (color — see The Color Stack)
```

Tree-shake aggressively; the unbundled package list is large.

For non-React projects:

```
three                                  (the core)
+ three.js examples/jsm                (built-in addons)
+ postprocessing                       (effects)
+ troika-three-text                    (text)
+ rapier3d                             (physics, if needed)
+ tweakpane / lil-gui                  (parameter controls — see Creative Coding Utilities)
+ culori                               (color)
```

## The TSL transition

Three.js's **TSL (Three.js Shading Language)** is the strategic move for the next several years. It:

- Replaces direct GLSL writing for new work.
- Compiles to **WebGL OR WebGPU** as needed — no separate maintenance.
- Provides a **node-based** shader-graph paradigm.
- Integrates with three.js materials.

For new shader-heavy work, learn TSL rather than writing raw GLSL. The transition is similar to the WebGL → WebGPU transition: not immediate, but the strategic direction.

## How this updates the original Tools Map verdict

The [[Tools Map]] gave three.js "first-class across the board." This page confirms it: the ecosystem of addons makes three.js the **maximally productive** 3D library on the web. The drei addon ecosystem in particular makes r3f the most-productive React-3D path by a wide margin.

The recommended-stack pattern is **three.js + drei + postprocessing + leva + r3f (if React)** for any priority-1/4 project that's non-trivial. Adding domain-specific addons (rapier for physics, troika for text, etc.) as needed.

## Caveats

- **Addon proliferation** is real — there are several abandoned three.js addons on npm that aren't worth using. Stick to actively-maintained ones (last commit < 12 months).
- **Bundle size** can balloon — always tree-shake and bundle-analyze.
- **Version compatibility** matters; pmndrs libraries usually require specific three.js versions (the drei docs specify which).
- **Some addons compete** (e.g., postprocessing libraries — the three.js core's EffectComposer vs `pmndrs/postprocessing`). Choose one.

## Connection to the wiki's framework

This page **expands the [[three.js]] page's evaluation** with the ecosystem productivity that makes three.js the dominant 3D library. For the recommended-stack pattern from [[Tools Map]] (infrastructure + general-purpose + paradigm-specialist):

- three.js core = general-purpose.
- drei / postprocessing / leva = productivity-boosting infrastructure.
- troika-three-text / rapier / etc. = paradigm-specialist as needed.

This is the **actually-shipped** three.js stack for production-quality work.

## Related pages

[[three.js]] · [[react-three-fiber]] · [[WebGPU]] · [[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[Creative Coding Utilities]] · [[p5.js Plugin Ecosystem]] · [[The Color Stack]] · [[Tools Map]]

## Source

- three.js core: https://github.com/mrdoob/three.js
- three.js examples: https://threejs.org/examples/
- pmndrs collective: https://github.com/pmndrs
- drei: https://github.com/pmndrs/drei
- postprocessing: https://github.com/pmndrs/postprocessing
- troika-three-text: https://github.com/protectwise/troika
- theatre.js: https://www.theatrejs.com/
- rapier: https://rapier.rs/
- TSL docs: https://threejs.org/docs/#manual/en/introduction/Three.js-Shading-Language
