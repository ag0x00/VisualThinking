---
title: WebGPU
type: tool
status: developing
tags: [tool, library, gpu, webgpu, shaders, compute]
address: c-000125
created: 2026-05-17
url: https://www.w3.org/TR/webgpu/
license: W3C standard (browser implementations vary)
last_release: WebGPU 1.0 (W3C Recommendation, 2025)
verdict: first-class-for-performance
---

# WebGPU

The **modern GPU API for the web** — successor to WebGL. Provides both **render pipelines** (for graphics) and **compute pipelines** (for general-purpose GPU work) via a unified, modern, lower-level API. Standardized by W3C; available in Chromium-based browsers since 2023; Safari support shipping (in stages) 2024–2026; Firefox 2024–2026.

WebGPU is the **wiki's default GPU layer** per CLAUDE.md. Most artists won't write raw WebGPU — they'll use it via [[three.js]]'s WebGPU renderer or higher-level libraries. But for **compute-heavy work** (large CA, RD, particle systems, custom rendering pipelines), raw WebGPU is the right tool.

**Verdict: first-class for performance-critical and compute work; second-class for typical artist workflows** (use three.js for those).

## Purpose (one line)

Modern low-level GPU API for the web, supporting both rendering and compute, with WGSL shading language and explicit pipeline objects.

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **4 / 5** | Best for performance-critical, compute-heavy generative work; verbose for simple cases |
| 2. Branding | **2 / 5** | Mostly overkill; brand work rarely needs compute-shader scale |
| 3. Graphic design | **2 / 5** | Same; high-resolution print is fine in CPU-based pipelines |
| 4. Music-reactive visualizers | **5 / 5** | **Best-in-class** for dense, real-time, audio-reactive visualization; compute shaders for FFT processing + visualization in one pipeline |

### Paradigm coverage

- ✅ **Rule-based / deterministic**: shaders are deterministic given inputs.
- ✅ **Stochastic / random-within-rules**: WGSL `hash()` patterns and `textureSample()` with random-texture inputs.
- ✅ **Iterative / dynamical-systems**: **compute shaders make this paradigm shine.** CA, RD, particle systems run at the speed of the GPU.
- ⚠️ **Evolutionary**: possible (GPU-parallel fitness evaluation) but not the typical use-case.
- ✅ **Learning-based**: compute shaders can run inference; integrations with `tf.js` and other ML libraries. Increasingly used for in-browser ML.

### Autonomy-control fit

**Score: 4 / 5** — WebGPU is **lower-level**, supporting **any** point on the autonomy-control gradient, but **with significant boilerplate**. Best for the **autonomous-end** (compute-shader-driven dynamical systems); for controlled work, the boilerplate-to-value ratio is unfavorable.

### Primitive vocabulary

- ✅ Render pipelines: vertex + fragment shaders, blending, depth testing, MSAA, render passes.
- ✅ Compute pipelines: arbitrary parallel computation; storage buffers and textures for IO.
- ✅ Storage buffers and textures: read-write, persistent across frames.
- ✅ Bind groups for resource binding (more explicit than WebGL).
- ✅ Pipeline state objects (PSOs) for performance.
- ⚠️ No high-level scene-graph (use three.js for that).
- ⚠️ No built-in cameras, lights, materials (use three.js).
- ⚠️ WGSL is its own shading language (similar to GLSL/HLSL but distinct).

### Idiomaticity and LLM-codegen friendliness

**Score: 3 / 5** — challenging:

- **Moderate training-data presence** — growing rapidly post-2023 but smaller than WebGL or three.js.
- **WGSL is new** — LLMs sometimes generate GLSL-style code that doesn't compile.
- **Pipeline-creation boilerplate is substantial** and easy to get wrong subtly.
- **Documentation is good** (W3C spec, MDN coverage, https://webgpufundamentals.org).
- **Debugging is harder** than WebGL (errors are less informative; tooling still maturing).

The trajectory: WebGPU's LLM-codegen friendliness will improve rapidly as training data accumulates. For now, **prefer three.js's WebGPU renderer** for LLM-generated code; reach for raw WebGPU when performance demands it and you can verify manually.

### Production-readiness

**Score: 4 / 5** — production-ready in modern browsers:

- **Chrome / Edge**: stable since 2023.
- **Safari**: shipping 2024–2026 (specific WebGPU APIs lagged but core renderer is in).
- **Firefox**: production-ready in stable Firefox releases 2025+.
- **Mobile**: support improving rapidly; iOS WebGPU available 17.0+, Android via Chrome.
- **Fallback strategy**: detect support; fall back to WebGL or canvas for older browsers. Three.js handles this transparently.

The main caveat: **for sites that need to work in all browsers in 2026**, WebGL is still the more-conservative choice. WebGPU-first work is fine for art / experiment / portfolio sites; production e-commerce should test broadly.

## Compared to direct alternatives

| Alternative | When to prefer it |
|---|---|
| **WebGL 2** | Older / broader browser compatibility. Worse API; no compute. |
| **three.js (with WebGPU renderer)** | Default choice for most artists. WebGPU's power with three.js's ergonomics. |
| **react-three-fiber** | If you're React-based, r3f handles WebGPU via three.js. |
| **PixiJS (v8+ with WebGPU)** | Game-style 2D with WebGPU under the hood. |
| **Babylon.js (with WebGPU renderer)** | Game-engine alternative; also has WebGPU support. |

## Use-cases WebGPU excels at

- **Compute-heavy generative work** (priority 1, especially dynamic): CA, RD, particle systems at $1024 \times 1024$ or larger, real-time.
- **Music-reactive visualizers at scale** (priority 4): FFT processing + visualization in one compute-pipeline.
- **Real-time fluid / cloth / soft-body simulations**.
- **Volumetric rendering** (NeRF, voxel grids, Gaussian splatting).
- **Custom rendering pipelines** that don't fit a scene-graph model.

## Use-cases WebGPU is wrong for

- **Quick prototypes**: use p5.js.
- **Standard 3D-scene work**: use three.js (with WebGPU renderer under the hood).
- **Vector graphics**: use paper.js / d3.js.
- **Old-browser support requirements**: use WebGL 2.

## WGSL — the shading language

WebGPU uses **WGSL** (WebGPU Shading Language) rather than GLSL. Key differences from GLSL artists may know:

- **Stricter typing** (no implicit conversions).
- **Storage qualifiers** (`storage<read>`, `storage<read_write>`) are required and explicit.
- **Compute-shader workgroup model** is first-class.
- **Resource bindings** are explicit (`@group(0) @binding(0)`).
- **Syntax** is more Rust-like than C-like.

LLMs are getting better at WGSL; in 2026, code generation for moderate compute shaders is reliable but verify carefully.

## Connection to the wiki's framework

WebGPU is the **performance-critical layer** of the wiki's stack — explicit in CLAUDE.md as part of the default JS/TS stack. Most artists access it via [[three.js]]'s WebGPU renderer or future higher-level libraries. **Reach for raw WebGPU when**:

- You need compute shaders (CA, RD, particle systems at scale).
- You need a custom render pipeline that doesn't fit a scene-graph model.
- You need maximum performance for music-reactive visualization (priority 4) at >$1024 \times 1024$ resolution.

For everything else, three.js is enough.

## Migration path

If you're starting fresh in 2026:
1. **Use three.js with WebGPU renderer** as the default.
2. **Reach for raw WebGPU** only when compute or custom pipeline is needed.
3. **Skip raw WebGL** — it's now a fallback compatibility layer, not a primary target.

If you're maintaining a WebGL codebase:
- For three.js: switch the renderer to WebGPURenderer; most code ports straight.
- For raw WebGL: significant porting work; consider whether the performance gain justifies it.

## Connection to other libraries

- [[three.js]]: primary consumer of WebGPU in the wiki's stack.
- [[Hydra]]: uses WebGL; WebGPU port in progress as of 2026.
- [[Pts.js]]: 2D vector library; WebGPU mostly orthogonal.
- [[p5.js]]: WEBGL mode uses WebGL; WebGPU support discussed but not shipped as of 2026.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[three.js]] · [[Cellular Automata and Reaction-Diffusion]] · [[Procedural Paradigms]] · [[Web Audio API and AudioWorklet]] · [[Tools Map]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Source

- W3C WebGPU Specification: https://www.w3.org/TR/webgpu/
- MDN reference: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- WebGPU Fundamentals: https://webgpufundamentals.org/
- WGSL specification: https://www.w3.org/TR/WGSL/
- Browser status: https://caniuse.com/webgpu
- Sample collection: https://webgpu.github.io/webgpu-samples/
