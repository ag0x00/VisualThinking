---
address: c-000154
title: TensorFlow.js
type: tool
status: developing
tags: [tools, ai, ml, browser, inference, training]
created: 2026-05-17
updated: 2026-05-17
verdict: second-class
---

# TensorFlow.js

**One-line purpose:** Google's general-purpose machine-learning library for JavaScript. Older, broader, more architecture-flexible than [[Transformers.js]] — but partly superseded for transformer-model inference and trending toward maintenance mode for generative-art use cases.

## What it does

TF.js supports:

- **Pre-trained model inference** in browser (WebGL or WebGPU backend) or Node.js (native CPU/GPU)
- **Training** — full SGD, optimizers, autograd; can train small models in-browser
- **Conversion** — convert TensorFlow Python models to TF.js format via `tensorflowjs_converter`
- **Backends** — WebGL, WebGPU (preview), WASM, CPU; auto-selects best available
- **Pre-built models** — PoseNet, MoveNet, BlazeFace, MobileNet, Toxicity, USE, KNN classifier, MagentaJS music models (now stale)

The library was the dominant in-browser ML platform from 2018 through ~2023. The rise of [[Transformers.js]] (and the migration of generative-art workflows toward transformer architectures) has shifted it to a more general-utility / legacy position.

## Why this matters for the wiki

For [[AI Art and Latent Space]] work specifically, **TF.js is mostly superseded** by [[Transformers.js]] for transformer models. TF.js retains relevance for:

- **Non-transformer architectures**: classic CNNs, RNNs, LSTMs — image classification, pose detection, gesture recognition
- **In-browser training**: small models (image classifiers, gesture recognizers) you train on user input
- **Established model ecosystem**: PoseNet/MoveNet are still the standard browser-side body-pose libraries (relevant to [[Body Language and Pose Semantics]])
- **WebGL fallback**: works on older devices where WebGPU isn't available

## Install footprint

- `npm install @tensorflow/tfjs` — ~600KB minified
- Plus a backend: `@tensorflow/tfjs-backend-webgpu`, `-webgl`, `-wasm`, `-cpu`
- Optional pre-built models: `@tensorflow-models/pose-detection`, `@tensorflow-models/face-detection`, etc.

## LLM-codegen friendliness

**Medium.** TF.js's API is verbose vs Transformers.js's pipeline pattern. Model loading + tensor manipulation + backend selection adds boilerplate. LLMs generate working TF.js code reliably but the resulting code is rarely concise.

## Maintenance

- Active but velocity has slowed since the Transformers.js rise
- Google-backed; presumably stable indefinitely as a maintenance project
- Frequent backend updates (WebGPU support gradually improving)
- GitHub: https://github.com/tensorflow/tfjs

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | Low-medium | Use [[Transformers.js]] for diffusion/AI-art workflows; TF.js for niche non-transformer work |
| 2. Branding | Low | Limited direct application |
| 3. Graphic design | Low | Limited direct application |
| 4. Music-reactive | Low-medium | Body-pose detection (PoseNet/MoveNet) for performer-tracking music-reactive work — clear niche |

## Use TF.js when

- You need **PoseNet / MoveNet / BlazeFace / hand-tracking** for body/gesture-driven art (relevant for performance installations, AR-style branding)
- You're doing **in-browser training** on small datasets (a user-customized gesture classifier, for instance)
- You need a non-transformer architecture (classic CNN, RNN) where Transformers.js doesn't apply
- Cross-browser support is critical and WebGPU isn't yet universal in your audience

## Use [[Transformers.js]] instead when

- You're doing **text-to-image** or **image-to-image** diffusion
- You're using a **CLIP / vision-language** model
- You want **the smallest, most-recent API surface**

## Verdict

**Second-class.** Useful in specific niches (pose detection, in-browser training, non-transformer architectures) but not the default ML library for new generative-art projects.

Recommended pairing: [[Transformers.js]] as the primary AI-art ML layer; TF.js *only* when you need PoseNet / MoveNet / non-transformer architecture.

## Related

- [[Transformers.js]] — primary ML for AI-art framing
- [[ml5.js]] — friendlier wrapper layer (uses TF.js underneath for older models)
- [[Body Language and Pose Semantics]] — PoseNet/MoveNet is the main reason TF.js stays relevant
- [[Tools Map]] · [[AI Art Toolkit Map]]

## Sources

- TF.js docs: https://www.tensorflow.org/js
- GitHub: https://github.com/tensorflow/tfjs
- Comparison context: see [[Transformers.js]]
