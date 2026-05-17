---
address: c-000161
title: Cloud Inference APIs
type: tool
status: developing
tags: [tools, ai, ml, cloud, inference, api, diffusion]
created: 2026-05-17
updated: 2026-05-17
verdict: first-class-as-survey
---

# Cloud Inference APIs

**One-line purpose:** Survey of **cloud-hosted ML inference APIs** that complement (or substitute for) browser-side [[Transformers.js]] — used when models are too large for client-side, when you need batch generation, when consistent quality matters, or when you want hosted-state for production. Includes Replicate, fal.ai, OpenAI image APIs, Anthropic vision, Hugging Face Inference Endpoints, and others.

> [!important] Phase 2 discovery (2026-05-17)
> The Phase 1 [[AI Art and Latent Space]] framing centered the artist-as-prompt-engineer pattern but didn't enumerate the cloud-inference layer. For production AI-art work, **cloud is still required for larger models** (FLUX, full SDXL, video, large LLMs). This page completes the AI-art toolchain.

## Why this matters for the wiki

The [[AI Art and Latent Space]] framing positioned diffusion-and-friends as the dominant contemporary form. In practice:

- **Browser-side ([[Transformers.js]])** handles up to ~SDXL-Turbo, image classification, lightweight diffusion, vision-language inference.
- **Cloud APIs** handle FLUX, full SDXL, video, audio generation, large LLMs, and anything requiring consistent GPU resources.

For the user's priorities, the **hybrid pattern** is:
- Prototype in browser via [[Transformers.js]] — instant iteration
- Production renders via cloud APIs — quality + consistency
- Critic loop via multimodal LLM (Anthropic / OpenAI / Gemini) — see [[MLLM-as-a-Judge]]

This page surveys the cloud layer.

## The major providers

### Replicate

URL: https://replicate.com/

The most-versatile generative-AI cloud platform. Hosts thousands of community-uploaded models. Run via REST API or `replicate` JS SDK (`npm install replicate`). Pay-per-second of inference. Free for low-volume work; affordable for production.

**Best for:** rapid prototyping across many model variants; community / experimental models; running specific community LoRAs

```javascript
import Replicate from 'replicate';
const r = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const output = await r.run('black-forest-labs/flux-schnell', {
  input: { prompt: 'a tree at sunset, watercolor' }
});
```

### fal.ai

URL: https://fal.ai/

Specialized in **fast inference** for diffusion / TTS / video. Engineered for low-latency interactive applications (single-image diffusion in ~1s). Has both REST and WebSocket APIs for streaming.

**Best for:** low-latency interactive workflows; real-time-ish generation; commercial production with consistent SLAs

### OpenAI Image API

URL: https://platform.openai.com/docs/guides/images/

DALL-E 3 and GPT-image generation. Stable, well-documented, slower-moving than open-model platforms but excellent for production reliability.

**Best for:** production work where you want a single vendor / stable model

### Anthropic Vision (via Claude API)

URL: https://docs.anthropic.com/en/docs/build-with-claude/vision

Not image *generation* but **image understanding** — multimodal LLM that reads images and reasons about them. Critical for the **critic-loop** pattern: generate via diffusion, evaluate via multimodal LLM, iterate. See [[MLLM-as-a-Judge]].

`npm install @anthropic-ai/sdk` — see [[Anthropic TypeScript SDK]] for full evaluation.

**Best for:** vision-language tasks, critic-loops, image-driven generation, structured outputs from visual input

### Hugging Face Inference Endpoints

URL: https://huggingface.co/inference-endpoints

Deploy any HF Hub model behind a dedicated endpoint. Use when you need a *specific* model not available on Replicate / fal, or need dedicated GPU resources without per-second pricing.

**Best for:** production with custom / fine-tuned models; commercial work needing reserved capacity

### Modal / Banana / RunPod / Lambda Labs

URLs: https://modal.com/, https://banana.dev/, https://runpod.io/, https://lambda.ai/

Lower-level GPU-as-a-service platforms. Build custom inference containers. Heavier infrastructure work but greater flexibility.

**Best for:** custom workflows, ComfyUI deployment, complex pipelines, when standard providers don't fit

### ComfyUI as a Service

ComfyUI (https://github.com/comfyanonymous/ComfyUI) is the dominant node-graph workflow tool for diffusion. Self-hosted on a Lambda Labs / RunPod box or via managed providers (ThinkDiffusion, RunDiffusion). For complex multi-step diffusion workflows (img2img → ControlNet → upscale → refine), ComfyUI is the standard.

**Best for:** complex multi-stage diffusion pipelines; production work using LoRAs + ControlNets + refiners

## Recommended stack pattern

For a wiki-priority art app:

```
Browser:           Transformers.js (prototype, simple cases)
                ↓
Cloud:             Replicate (variety) OR fal.ai (latency)
                        for large models / production renders
                ↓
Critic loop:       Anthropic SDK (Claude Opus 4.7 vision)
                        evaluates outputs against criteria
                ↓
Iterate:           LLM-driven prompt refinement → next render
```

This matches the [[Hertzmann - Can Computers Create Art|Hertzmann framing]] of artist-as-curator-and-prompt-engineer over a *tool* (the model), with the LLM serving as both curator-assistant and prompt-refiner.

## LLM-codegen friendliness

All providers ship official JS/TS SDKs with TypeScript types. LLMs reliably generate working API client code from natural-language descriptions. The pattern is essentially the same across providers:

```javascript
import Client from 'provider-sdk';
const client = new Client({ apiKey: ... });
const result = await client.run({ model: '...', input: { ... } });
```

## Fit with the four priorities

| Priority | Fit | Recommended pattern |
|---|---|---|
| 1. Generative art | **High** | Replicate / fal.ai for production renders; Anthropic for critic-loop |
| 2. Branding | **High** | Cloud APIs for consistent brand-asset variant generation; LoRAs for brand-style |
| 3. Graphic design | **High** | Image/mood-board generation; rapid iteration |
| 4. Music-reactive | Low-medium | Cloud round-trip too slow for real-time; use pre-rendered latent walks |

## Cost discipline

Cloud inference can add up quickly. Patterns:

- Budget per-project: cap monthly spend
- Cache aggressively: same prompt+params → same output, no need to re-run
- Use cheaper preview models for iteration; switch to full quality only for final renders
- Local-first when possible (Transformers.js for prototyping)

## Verdict

**First-class as a survey-and-pointers page.** Individual provider pages aren't needed (the surface area is the SDK and the API docs, both elsewhere). This page anchors the *category*.

[[Tools Map]] should add a "Cloud Inference" row pointing here.

## Related

- [[AI Art and Latent Space]] — theoretical framing
- [[Transformers.js]] — browser-side complement
- [[Anthropic TypeScript SDK]] — full evaluation of the critic-loop layer
- [[MLLM-as-a-Judge]] — the pattern these APIs enable
- [[AI Art Toolkit Map]]
- [[Tools Map]]

## Sources

- Provider docs as cited above (Replicate, fal.ai, OpenAI, Anthropic, Hugging Face)
- Per-provider npm SDKs verified via npm registry 2026-05-17
- [[Hertzmann - Can Computers Create Art]] for the artist-as-tool-user framing
