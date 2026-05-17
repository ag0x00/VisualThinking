---
address: c-000162
title: AI Art Toolkit Map
type: tool
status: developing
tags: [tools, ai, ml, map, ai-art, browser, cloud]
created: 2026-05-17
updated: 2026-05-17
---

# AI Art Toolkit Map

**One-line purpose:** Synthesis page connecting the [[AI Art and Latent Space]] framing to the concrete JS / TS toolchain — when to use which tool, the canonical pipeline patterns, and how this stack respects the [[Hertzmann - Can Computers Create Art|social-agent / artist-as-tool-user]] argument that anchors the framing.

> [!important] Phase 2 deliverable (2026-05-17)
> [[AI Art and Latent Space]] (Phase 1 framing) needs a concrete toolchain page. This is it. Parallel to [[Tools Map]] but scoped to the AI-art framing specifically.

## The 2026 client-side / cloud-side split

The canonical 2026 AI-art toolchain has two layers:

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT (BROWSER)                                           │
│    • Transformers.js  — in-browser inference, small/medium models  │
│    • ml5.js           — Processing-friendly wrapper                │
│    • TensorFlow.js    — pose / non-transformer architectures       │
│    • Custom WebGPU    — for novel architectures via wgpu shaders   │
└─────────────────────────────────────────────────────────────┘
                                ↕
┌─────────────────────────────────────────────────────────────┐
│  CLOUD (INFERENCE APIs)                                     │
│    • Replicate        — variety, prototyping, community models     │
│    • fal.ai           — low-latency interactive                    │
│    • Anthropic SDK    — critic-loop (vision-language)              │
│    • Hugging Face IE  — dedicated capacity, custom models          │
│    • OpenAI / DALL-E  — single-vendor production                   │
│    • ComfyUI (self-hosted) — node-graph workflows                  │
└─────────────────────────────────────────────────────────────┘
```

## Canonical pipeline patterns

### Pattern 1: Pure client-side (offline, free, lower quality)

```
User → Transformers.js (SDXL-Turbo or similar) → Output
```

Use case: indie / offline / privacy-sensitive / educational. Free at inference time (uses user's GPU). Limited to models that fit in browser memory (~5GB max).

### Pattern 2: Pure cloud (highest quality, paid, slower)

```
User → Cloud API (Replicate / fal.ai / etc.) → Output
```

Use case: production work, large models (FLUX, full SDXL), batch generation. Pay-per-inference cost; minimal latency variance.

### Pattern 3: Hybrid prototype-and-render

```
User → Transformers.js (rapid iteration on prompt/params) → 
       Cloud API (final-quality render at chosen params) → Output
```

Use case: most production AI-art work. Iterate cheaply in-browser; render expensively in cloud. **Recommended default pattern.**

### Pattern 4: Critic-loop (Hertzmann-aware)

```
User intent (prompt, constraint, reference)
    ↓
Diffusion model (Transformers.js or Cloud) → Candidate output
    ↓
Multimodal LLM (Anthropic / OpenAI vision) evaluates candidate against intent
    ↓
LLM rewrites prompt / suggests parameter changes
    ↓
Loop until satisfied → Final output
```

This pattern is **theoretically load-bearing** for the wiki's framing: it keeps the *artist's intent* (encoded in the prompt and the satisfaction criterion) as the locus of authorship, with the diffusion model and the LLM both serving as *tools* per [[Hertzmann - Can Computers Create Art|Hertzmann's social-agent argument]].

See [[MLLM-as-a-Judge]] for the critic-loop pattern's research grounding.

## Decision matrix

| Decision | Choose A | Choose B |
|---|---|---|
| Browser-first vs server-first | Transformers.js | Cloud APIs |
| Variety vs production stability | Replicate (variety) | OpenAI / Anthropic / one fixed vendor |
| Low latency vs high quality | fal.ai (latency) | Replicate / HF IE (quality) |
| Processing-tradition wrapper vs lower-level | [[ml5.js]] | [[Transformers.js]] |
| Non-transformer architecture (pose / classic CNN) | [[TensorFlow.js]] | [[Transformers.js]] |
| Custom node-graph workflows | self-hosted ComfyUI | Replicate runs of named models |
| Brand-consistent variant generation | LoRAs on Replicate / fal.ai | Direct Anthropic generation with style prompts |

## Mapping to the user's four priorities

### Priority 1 — Generative art

Primary stack:
- **[[Transformers.js]]** for client-side prototyping
- **Replicate** or **fal.ai** for production renders
- **[[Anthropic TypeScript SDK]]** for critic-loop pattern

Optional: **ComfyUI** (self-hosted) for complex multi-stage workflows.

### Priority 2 — Branding

Primary stack:
- **Cloud APIs** (Replicate or HF IE) for brand-asset variant generation
- **LoRAs** on top of base diffusion models for brand-style consistency
- **[[Anthropic TypeScript SDK]]** for brand-guideline-compliant prompt engineering

Browser-side rarely fits production branding work (quality matters more than free).

### Priority 3 — Graphic design

Primary stack:
- **OpenAI image API** or **Replicate** for mood-board / asset generation
- **Adobe Firefly / Midjourney API** if working within those creative-stack ecosystems
- **[[Anthropic TypeScript SDK]]** for layout reasoning, copy generation

### Priority 4 — Music-reactive visualizers

**AI-art does not fit well for true real-time.** Diffusion is too slow (1-5s per image). Recommendations:

- **Pre-rendered latent walks** triggered live by audio events
- **LCM / SDXL-Lightning / SD-Turbo** in browser via Transformers.js for *just-fast-enough* real-time (~200-500ms; barely tolerable for slow music)
- **Hydra-driven shader visuals** for true real-time work (not AI-art but the better fit)

## Cost / risk discipline

- **Cap API spend per-project** — set monthly budgets in provider consoles
- **Cache aggressively** — same prompt+seed+params → same output
- **Prototype free** (Transformers.js); pay only for final renders
- **Authorship and rights** remain unresolved across providers; check terms before commercial use
- **Training-data politics** — some artists / rights-holders contest training-data use; for commercial branding work, verify the provider's training-data stance

## What this map does *not* include

- **Audio AI** (Suno, Udio, MusicGen) — outside the wiki's current scope, though Magenta.js (now deprecated) used to fit
- **Video AI** (Veo, Sora, Runway Gen-3) — emerging; not yet mature as JS API
- **3D AI** (Meshy, Trellis, Hunyuan3D) — emerging; promising for [[three.js]] asset generation
- **Voice / TTS** — outside scope

Likely Phase-2-followup additions as these mature in 2026-2027.

## Verdict

**First-class as a synthesis page.** Anchors the AI-art framing to a concrete toolchain. Pairs with [[Tools Map]] (which surveys all tools across all framings) and [[AI Art and Latent Space]] (which provides the theoretical framing).

## Related

- [[AI Art and Latent Space]] — theoretical framing
- [[Transformers.js]] · [[TensorFlow.js]] · [[ml5.js]] — client-side tools
- [[Cloud Inference APIs]] — server-side tools
- [[Anthropic TypeScript SDK]] · [[MLLM-as-a-Judge]] — critic-loop layer
- [[Hertzmann - Can Computers Create Art]] — theoretical anchor
- [[Tools Map]] — broader-scope toolchain survey

## Sources

- Per-tool sources cited on individual pages
- Hugging Face Inference: https://huggingface.co/inference-endpoints
- Replicate: https://replicate.com/
- fal.ai: https://fal.ai/
