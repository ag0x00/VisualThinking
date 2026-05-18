---
name: language-preference
description: "For the VisualThinking project, prefer JS/TS for building visuals. Python is second-class (only when JS equivalent is weak). Rust/Go only if there is a compelling 2026-specific reason (GPU portability, native binary cold-start)."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

**Rule.** For the VisualThinking project (`/Users/ag/Lab/VisualThinking`), default to **JS/TS** when building visuals, generative-art experiments, or LLM-driven aesthetic pipelines. Use Python only when a JS equivalent is meaningfully weaker (advanced CV beyond OpenCV.js; serious scientific colour-science work; ML model training). Consider Rust (wgpu, candle) or Go only when there is a compelling 2026-specific reason — e.g., native binary cold-start, very tight GPU loops needing portability, or a CLI tool that should ship without Node.

**Why:** The user stated this preference explicitly on 2026-05-16. The 2026 ecosystem supports the choice well: WebGPU is GA in major browsers; three.js r170+ has a WebGPU renderer; TensorFlow.js + transformers.js + ONNX Runtime Web cover the ML inference cases; Anthropic ships a first-class TypeScript SDK with structured-output support. The wiki's [[OKLCH]] / [[Color Harmony]] / [[Compositional Grids]] / [[Visual Entropy]] concepts have strong JS-first library coverage (chroma.js, culori, paper.js, Pts.js, p5.js, three.js).

**How to apply:**
- When picking libraries for the [[tools sweep|wiki/tools/]] branch or for actual builds, JS/TS libraries are first-class. Python libraries are mentioned as secondary alternatives.
- When proposing an architecture (e.g., for a programmatic art pipeline), default to a JS/TS stack: browser + Anthropic TS SDK + WebGPU + three.js / p5.js / culori, etc.
- When a Python library is clearly the right choice (e.g., `colour-science` for advanced colorimetry, `scikit-image` for advanced CV operations, PyTorch for training), say so explicitly and explain why JS alternatives aren't sufficient.
- Don't preemptively suggest Rust/Go without a stated reason tied to 2026 GPU portability, native binary distribution, or cold-start performance.

Related: see CLAUDE.md global preference for using `logger.` (not `console.`) in TS projects.
