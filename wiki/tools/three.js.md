---
title: three.js
type: tool
status: developing
tags: [tool, library, 3d, webgl, webgpu, javascript]
address: c-000124
created: 2026-05-17
url: https://threejs.org/
license: MIT
last_release: r170+ (continuous, 2026)
verdict: first-class
---

# three.js

The **dominant 3D library in the JS/TS ecosystem** (Ricardo Cabello / "Mr.doob" 2010+). Wraps WebGL (now also WebGPU as of r150+) with a scene-graph + materials + lights + cameras model. The default 3D rendering choice across creative coding, games, data visualization, virtual showrooms, AR/VR (with WebXR), and increasingly **2D work with 3D under the hood** (depth + lighting + post-processing applied to 2D scenes).

**Verdict: first-class.** Industry-standard, deeply LLM-friendly, actively migrating to WebGPU, supports essentially every paradigm the wiki needs.

## Purpose (one line)

Scene-graph-based 3D rendering library wrapping WebGL/WebGPU, with built-in materials, lights, cameras, geometry primitives, post-processing, model loaders, and integrations with the broader JS ecosystem.

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **5 / 5** | Best-in-class for any work involving depth, light, materials, or 3D forms |
| 2. Branding | **4 / 5** | Strong for 3D / spatial brand experiences; overkill for flat brand-marks |
| 3. Graphic design | **4 / 5** | Strong for hero compositions with depth + materials; overkill for typography-heavy print work |
| 4. Music-reactive visualizers | **5 / 5** | The dominant choice for music visualization; massive ecosystem of audio-reactive examples |

### Paradigm coverage

- ✅ **Rule-based / deterministic**: scene-graph manipulation is naturally rule-based; deterministic given fixed inputs.
- ✅ **Stochastic / random-within-rules**: trivial — bring your own randomness; instance materials and positions stochastically.
- ✅ **Iterative / dynamical-systems**: native `requestAnimationFrame` loop; GPU-accelerated via shader materials; CA/RD/particles all natural.
- ⚠️ **Evolutionary**: not native, but generative-population-and-fitness loops integrate cleanly.
- ✅ **Learning-based**: integrates with TensorFlow.js (for in-browser inference) and any external model API. NeRF and Gaussian-splat rendering have community libraries on top of three.js.

### Autonomy-control fit

**Score: 5 / 5** — three.js spans the entire autonomy-control gradient. Direct manipulation (place a mesh exactly at $(x, y, z)$), parametric design (scenes built from data), stochastic-rule generation (instanced meshes with random transforms), iterative (shaders + animation loop), evolutionary (population-based composition + fitness), learning-based (model inference results rendered) — all natural.

### Primitive vocabulary

- ✅ 3D primitives: `BoxGeometry`, `SphereGeometry`, `TorusGeometry`, `IcosahedronGeometry`, `BufferGeometry` (custom), `Mesh`, `Group`, `Object3D`.
- ✅ Cameras: `PerspectiveCamera`, `OrthographicCamera`, controls (`OrbitControls`, `FirstPersonControls`, etc. in addons).
- ✅ Lights: ambient, directional, point, spot, hemisphere, area; full shadow-mapping; image-based lighting via environment maps.
- ✅ Materials: PBR (`MeshStandardMaterial`, `MeshPhysicalMaterial`), unlit (`MeshBasicMaterial`), custom shaders (`ShaderMaterial`, `RawShaderMaterial`), Node-system shaders (TSL — Three.js Shading Language, 2024+).
- ✅ Post-processing: bloom, depth-of-field, SSAO, motion blur, custom effects via `EffectComposer` and `pmndrs/postprocessing`.
- ⚠️ Color: RGB / HSL; **no OKLCH / Lab native**. Bring culori for perceptual color work.
- ✅ Pattern primitives: `InstancedMesh` enables millions of instances at 60 fps on modern hardware.
- ✅ 2D primitives via 3D: orthographic camera + planes + `ShaderMaterial` makes three.js a powerful 2D engine when shaders are wanted.

### Idiomaticity and LLM-codegen friendliness

**Score: 5 / 5** — among the most-LLM-friendly libraries:

- **Massive training-data presence**: years of three.js code in every public corpus; tutorials, examples, official site has hundreds of examples.
- **Documentation is comprehensive** (every class documented; many examples).
- **TypeScript-first** since r150 — types are first-class, not afterthoughts.
- **Stable patterns** for common tasks (scene + camera + renderer + animation loop is canonical).
- **Active community**: Three.js Journey (Bruno Simon's course), Discourse forum, hundreds of YouTube tutorials.

The downside: the **API surface is huge** (~thousands of classes/functions). LLMs occasionally generate code using deprecated APIs from older versions; specify the version when asking.

### Production-readiness

**Score: 5 / 5** — industry-standard:

- Active development (multiple releases per year; r1xx → r17x in 2026).
- MIT licensed.
- Bundle size moderate-to-large depending on which addons (~600kB gzipped for full library, less with tree-shaking).
- Shipped in production at scale: Bruno Simon's portfolio, Google Maps' 3D rendering, IKEA's product viewers, dozens of commerce platforms, art / NFT installations.
- WebGPU support active and maturing — three.js's WebGPU renderer is the practical path to compute-shader work for most artists.

## Compared to direct alternatives

| Alternative | When to prefer it |
|---|---|
| **Babylon.js** | Game-engine-oriented 3D; better for full-game development; less elegant for art-style 3D. |
| **PlayCanvas** | Game-engine; has GUI editor. Not three.js's audience. |
| **Raw WebGL** | Educational; not for production. Three.js solves WebGL ergonomics. |
| **Raw WebGPU** | Specific compute-shader workloads; finer control. Three.js's WebGPU renderer is enough for most art work. |
| **react-three-fiber** | If you're in a React app, definitely use r3f on top of three.js. Same library, React API. |
| **A-Frame** | XR/VR-first; declarative HTML. r3f is more powerful for non-XR. |

## Use-cases three.js excels at

- **Any 3D generative art** (priority 1, dynamic): the default.
- **Music-reactive visualizers** (priority 4): the dominant choice; massive ecosystem of audio-reactive examples; GPU acceleration enables high-density visualizations.
- **Brand experiences and product showcases** (priority 2): 3D product configurators, immersive brand sites.
- **Data visualization in 3D**: three.js + d3.js for hybrid 2D-data + 3D-rendering.
- **Custom shader work**: ShaderMaterial / TSL provides full GLSL access while handling boilerplate.
- **2D work with depth and lighting**: using orthographic camera + planes for 2D-with-shaders.

## Use-cases three.js is wrong for

- **Pure 2D vector work with SVG export** (priority 2 brand-marks): use paper.js.
- **Quick prototypes without a build step**: use p5.js.
- **Live-coding visuals** (priority 4 alternative paradigm): Hydra is purpose-built; three.js is too verbose for live performance.
- **Pure data-driven SVG** (priority 3): d3.js's SVG paradigm is more natural.

## Migration path: WebGL → WebGPU

three.js is **actively migrating** to WebGPU as the default renderer. As of 2026:

- WebGPU renderer is **production-ready** for most workloads.
- TSL (Three.js Shading Language) replaces direct GLSL for new work — it compiles to WebGL or WebGPU as needed.
- WebGPU enables **compute shaders** for true GPU-accelerated CA, RD, particle systems, and other [[Procedural Paradigms|iterative paradigms]].
- WebGL renderer remains for compatibility (Safari pre-WebGPU; older browsers).

**Recommendation**: new work targets the WebGPU renderer + TSL; legacy work stays on WebGL until forced to migrate.

## Connection to the wiki's framework

three.js is **the wiki's 3D-and-dynamic default**, mentioned explicitly in CLAUDE.md as part of the WebGPU + three.js + Anthropic TS SDK + culori stack. It supports all five [[Procedural Paradigms]], spans the full [[The Autonomy-Control Gradient|autonomy-control gradient]], and integrates with essentially every other tool in the wiki's stack.

For the music-reactive visualizer pipeline (priority 4), the recommended path is: **Web Audio API → three.js shader materials with audio data as uniforms → WebGPU rendering**. The [[Web Audio API and AudioWorklet]] page details the audio side.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[WebGPU]] · [[p5.js]] · [[paper.js]] · [[Pts.js]] · [[The Color Stack]] · [[Web Audio API and AudioWorklet]] · [[Procedural Paradigms]] · [[Cellular Automata and Reaction-Diffusion]] · [[Tools Map]]

## Addon ecosystem and React variant

See **[[three.js Addon Ecosystem]]** for the surrounding ecosystem — drei, postprocessing, troika-three-text, rapier, leva, theatre.js, and the rest of the pmndrs collective. The recommended production stack is three.js + drei + postprocessing + leva + r3f (if React); see the ecosystem page for the full recommended stack.

See **[[react-three-fiber]]** for the React-native way to use three.js — declarative JSX scene-graph with full three.js capability and the drei ecosystem.

## Source

- Project home: https://threejs.org/
- Repository: https://github.com/mrdoob/three.js
- Reference: https://threejs.org/docs/
- Examples: https://threejs.org/examples/
- Cabello et al. 2010+. Original commit April 2010.
- Three.js Journey course (Bruno Simon): https://threejs-journey.com/ — the canonical learning resource.
