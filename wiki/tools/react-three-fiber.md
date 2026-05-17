---
title: react-three-fiber
type: tool
status: developing
tags: [tool, library, react, three.js, declarative, javascript]
address: c-000135
created: 2026-05-17
url: https://r3f.docs.pmnd.rs/
license: MIT
last_release: r3f 8.x / drei 9.x (continuous, 2026)
verdict: first-class-for-react-codebases
---

# react-three-fiber

A **React renderer for [[three.js]]** by Paul Henschel ("pmndrs" / Poimandres collective, 2018+). Lets you build three.js scenes using **declarative JSX components** instead of imperative API calls — leveraging React's reactivity model for state-driven 3D. The de-facto standard way to use three.js in a React codebase.

**Verdict: first-class for React codebases.** Adds a paradigm layer on top of three.js without losing access to the underlying library. For non-React codebases, use three.js directly.

## Purpose (one line)

React renderer for three.js that maps the three.js scene-graph to JSX components, with hooks for animation, controls, loaders, and an extensive helpers ecosystem (drei).

## Why this wasn't in the original Tools sweep

Mentioned in passing on the [[three.js]] page but not given its own evaluation. r3f is a distinct paradigm — JSX-declarative vs imperative — and deserves its own rubric assessment. Surfaced by an npm-survey audit 2026-05-17.

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **5 / 5** | Identical to three.js's score; r3f doesn't lose any three.js capability |
| 2. Branding | **4 / 5** | Strong for 3D brand experiences in React-based marketing sites |
| 3. Graphic design | **4 / 5** | Strong for React-based interactive editorial work |
| 4. Music-reactive visualizers | **5 / 5** | The standard React-based visualizer stack |

### Paradigm coverage

Identical to [[three.js]]: rule-based, stochastic, iterative, evolutionary (rare), learning-based. r3f adds **React-state-driven reactive paradigm** on top, where scene-graph changes flow from state changes naturally.

### What r3f adds over three.js

1. **Declarative scene-graph**:
   - Instead of imperative `scene.add(mesh); mesh.position.set(0, 1, 0);`
   - You write `<mesh position={[0, 1, 0]}>` and the renderer reconciles changes.
2. **React-state binding**: animate by updating state; r3f handles re-rendering correctly.
3. **Hooks-based animation loop**: `useFrame()` runs each frame; clean integration with React lifecycle.
4. **Suspense + asset loading**: 3D models load with React Suspense — clean loading-state handling.
5. **drei ecosystem**: massive addon library (cameras, controls, loaders, environment, post-processing, helpers, materials, shaders).

### What r3f doesn't change

- All three.js APIs are accessible via refs or directly.
- Performance is essentially identical (r3f's overhead is negligible for typical scenes).
- WebGPU renderer support — same as three.js.
- Shader access — same as three.js.

### Idiomaticity and LLM-codegen friendliness

**Score: 5 / 5** — strong:

- **Major training-data presence** — r3f is increasingly the dominant pattern in React 3D codebases.
- **Documentation is excellent** at https://r3f.docs.pmnd.rs/ — comprehensive with examples.
- **Declarative idiom is natural for React developers** — much shorter than imperative three.js for typical scenes.
- **drei ecosystem** has working examples for nearly any common need.

### Production-readiness

**Score: 5 / 5** — industry standard for React 3D:

- MIT-licensed.
- pmndrs collective maintains it actively.
- Production usage at scale: Vercel, Cosmos, IKEA's product pages, hundreds of agency / brand sites.
- Bundle size moderate (~30kB for r3f core + tree-shaken three.js, plus what you import from drei).

## The drei ecosystem

`@react-three/drei` is the canonical addon library for r3f — by the same authors. As of 2026 it includes 200+ helpers, organized into:

- **Cameras**: `PerspectiveCamera`, `OrthographicCamera`, `CubeCamera`.
- **Controls**: `OrbitControls`, `TrackballControls`, `FlyControls`, `PointerLockControls`, `KeyboardControls`.
- **Loaders**: `useGLTF`, `useTexture`, `useFBX`, `useVideoTexture`.
- **Abstractions**: `Sphere`, `Box`, `Plane`, `Torus`, `Text`, `Line`, `MeshDistortMaterial`, `MeshWobbleMaterial`.
- **Environment**: `Sky`, `Stars`, `Cloud`, `Environment` (HDR-based image-based-lighting).
- **Post-processing wrappers**: integrates with `pmndrs/postprocessing`.
- **Effects**: `Sparkles`, `Trail`, `Float`, `MeshTransmissionMaterial` (glass).
- **Performance**: `Instances`, `Detailed`, `BVH`, `AdaptiveDpr`.
- **Shaders**: shader-material wrappers; GLSL helpers.

Bundle size for drei is huge if you import the whole thing (~1MB+); always tree-shake.

## Related pmndrs libraries

The Poimandres collective maintains an ecosystem of complementary libraries:

| Library | Purpose |
|---|---|
| **drei** | r3f helpers (above) |
| **react-three-rapier** | Rapier physics engine binding for r3f |
| **react-three-cannon** | Cannon physics engine binding for r3f (older; rapier is the modern choice) |
| **react-three-postprocessing** | Post-processing chain for r3f |
| **react-spring** | Spring-physics animation; pairs with r3f |
| **zustand** | State management; lightweight, works well with r3f |
| **leva** | GUI controls (TweakPane-like); pairs with r3f for parameter exploration |
| **valtio** | Proxy-state alternative to zustand |

Together these form a **complete React 3D stack** that's much more productive than raw three.js for non-trivial projects.

## When to use r3f vs raw three.js

| Use r3f when... | Use raw three.js when... |
|---|---|
| Your codebase is React-based | Vanilla JS / TS or other framework (Svelte, Vue, Solid) |
| Many scene elements driven by app state | Scene is largely static or one-time-setup |
| Need React lifecycle + 3D | Long-running art-installation, no UI integration |
| Want drei ecosystem out of the box | Want minimal dependencies |
| Want React Suspense for asset loading | Custom loading flow |

Most modern web-based art with substantial UI lives in React. **For those, r3f is the default**, not raw three.js.

For non-React frameworks:

- **Svelte**: try `threlte` (similar paradigm) or use three.js directly.
- **Vue**: try `TresJS`.
- **Solid**: `solid-three`.

## Use-cases r3f excels at

- **React-based brand sites with 3D** (priority 2): product configurators, hero scenes, immersive landing pages.
- **Interactive data visualization in 3D** within React apps.
- **Music-reactive visualizers** in React apps (priority 4) — pair with Web Audio API or react-three-rapier for physics.
- **React-based generative art** (priority 1): the drei ecosystem provides nearly everything you need.
- **React Native / cross-platform** via Expo's three.js / r3f support.

## Use-cases r3f is wrong for

- **Non-React codebases**: use three.js directly.
- **Maximum-minimal-dependency projects**: r3f + drei + React is a lot of dependencies; sometimes you want less.
- **Pure performance-critical compute work**: r3f's React integration is negligible cost but not zero; raw three.js or raw WebGPU may be marginally faster.

## Connection to the wiki's framework

r3f is the **React-native path** through the three.js part of the wiki's recommended stack. For any wiki priority where the deliverable is a React app (which is most production web apps in 2026), r3f + drei is the natural stack. The underlying [[three.js]] capabilities and [[WebGPU]] performance are accessible; the React integration adds productivity for app-style work.

## Caveats

- **drei bundle size** can explode if not tree-shaken; always import only what you use.
- **r3f has a small learning curve** beyond React + three.js — the lifecycle integration takes adjustment.
- **r3f's WebGPU renderer support** lags three.js core by a release or two; check before relying on bleeding-edge WebGPU features.
- **Server-side rendering** has limitations — 3D scenes need to render client-side. Next.js + r3f works fine with `dynamic` imports.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[three.js]] · [[WebGPU]] · [[three.js Addon Ecosystem]] · [[Creative Coding Utilities]] · [[Tools Map]]

## Source

- Project home: https://r3f.docs.pmnd.rs/
- Repository: https://github.com/pmndrs/react-three-fiber
- drei: https://github.com/pmndrs/drei
- pmndrs collective: https://github.com/pmndrs
- Three.js Journey course (Bruno Simon) covers r3f extensively: https://threejs-journey.com/
