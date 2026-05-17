---
title: Style Transfer Pipeline
type: technique
status: developing
tags: [technique, style-transfer, diffusion, ip-adapter, controlnet, ai-art, implementation]
address: c-000222
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Diffusion-Era Style Transfer]]", "[[Style as Rule-System]]", "[[Cloud Inference APIs]]", "[[AI Art Toolkit Map]]"]
language: typescript
---

# Style Transfer Pipeline

Implementation patterns for the **2026 state-of-art style-transfer stack**: IP-Adapter + ControlNet + (when needed) ICAS. The named successor to Gatys 2015 neural-style-transfer per [[Diffusion-Era Style Transfer]] and the wiki's successor-theory tracking convention.

**Use cases**: style-consistent generative art series, brand-style enforcement on generated imagery, photographic-to-illustration translation, music-album-art style continuity.

## Why this stack

| Method | Status (2026) | When to use |
|---|---|---|
| **Gatys 2015 (VGG feature matching)** | Historical | Reproducibility of pre-2020 papers only |
| **AdaIN / WCT** | Niche | Real-time fast style transfer; lower quality than diffusion |
| **IP-Adapter** | First-class | Style-from-image, prompt-from-image; lightweight (~50 MB), composable with ControlNet |
| **ControlNet** | First-class | Structural conditioning (pose, depth, edges, segmentation) — pairs with IP-Adapter for "style-from-A + structure-from-B" |
| **ICAS** (Iterative Consistent Aesthetic Sampling) | Emerging 2025 | High-fidelity style preservation; computationally heavier |
| **Diffusion fine-tuning (LoRA/DreamBooth)** | Mature | When you have a style corpus and need persistent style — train once, apply many times |

The recommended default: **IP-Adapter for style + ControlNet for structure**, both running on top of an SDXL-class or Flux-class base model.

## Architecture (browser via cloud + local fallback)

```typescript
// Browser-side: too heavy to run SDXL diffusion locally; route to cloud
import Anthropic from "@anthropic-ai/sdk";

interface StyleTransferRequest {
  contentImage: string;          // base64 or URL
  styleImage: string;            // base64 or URL  
  structuralControl?: "pose" | "depth" | "edge" | "segmentation" | "none";
  strength: number;              // 0..1, how much style to apply
  preserveContent: number;       // 0..1, how much structure to preserve
  prompt?: string;               // optional text augmentation
  negativePrompt?: string;
}

interface StyleTransferResult {
  imageUrl: string;
  metadata: {
    seed: number;
    model: string;
    stylePreservationScore?: number;
    structuralFidelityScore?: number;
  };
}

async function styleTransfer(req: StyleTransferRequest): Promise<StyleTransferResult> {
  // 1. Optionally extract structural control (pose/depth/edge) from content image
  let controlImage: string | undefined;
  if (req.structuralControl && req.structuralControl !== "none") {
    controlImage = await extractControl(req.contentImage, req.structuralControl);
  }
  
  // 2. Route to cloud inference (Replicate / Modal / Fal / Together)
  return await runInference({
    model: "sdxl + ip-adapter + controlnet",
    inputs: {
      style_image: req.styleImage,
      content_image: controlImage ?? req.contentImage,
      control_type: req.structuralControl,
      ip_adapter_strength: req.strength,
      controlnet_strength: req.preserveContent,
      prompt: req.prompt ?? "",
      negative_prompt: req.negativePrompt ?? "",
    },
  });
}
```

## Extracting structural controls

Each ControlNet variant takes a different conditioning image. Browser-side extraction:

```typescript
async function extractControl(image: string, type: string): Promise<string> {
  switch (type) {
    case "edge":
      return await runCanny(image);                          // OpenCV.js
    case "depth":
      return await runDepthAnything(image);                  // via @xenova/transformers
    case "pose":
      return await runOpenposeFormat(image);                 // MediaPipe + render to openpose format
    case "segmentation":
      return await runSAM2Segmentation(image);               // SAM 2 via ONNX
    default:
      throw new Error(`Unknown control type: ${type}`);
  }
}
```

## Style consistency for brand work

For branding (priority 2), the standard pattern is:

1. **Curate a style corpus**: 20-50 brand images representative of the visual identity
2. **Choose between LoRA-finetune (persistent) vs. IP-Adapter (on-demand)**:
   - LoRA: train once, get a consistent style "voice"; ~1-3 hours training on a single image set
   - IP-Adapter: use one or two reference images per generation; zero-shot but less consistent across batches
3. **Combine with structural ControlNet** to preserve specific brand layout templates

```typescript
interface BrandStylePipeline {
  loraId?: string;                          // pretrained brand LoRA
  ipAdapterRefs: string[];                  // 1-3 style anchor images
  structuralTemplate?: string;              // brand template (poster, package, ad)
  brandColors?: string[];                   // OKLCH targets for color enforcement
  brandTypography?: { family: string; weights: number[] };
}

async function generateBrandedImage(
  prompt: string,
  pipeline: BrandStylePipeline
): Promise<StyleTransferResult> {
  const result = await runInference({
    model: pipeline.loraId ? `sdxl-lora-${pipeline.loraId}` : "sdxl",
    inputs: {
      prompt,
      ip_adapter_images: pipeline.ipAdapterRefs,
      controlnet_image: pipeline.structuralTemplate,
      // ...
    },
  });
  
  // Post-process: enforce brand palette via color-quantize or palette-mapping
  if (pipeline.brandColors) {
    result.imageUrl = await remapToPalette(result.imageUrl, pipeline.brandColors);
  }
  
  return result;
}
```

## Cloud inference options (per `feedback_language-preference`)

Most pipelines route to cloud — local SDXL is heavy. JS/TS clients:

| Provider | Strengths | Cost ballpark (2026) |
|---|---|---|
| **Replicate** | Easy public-model catalog, REST + JS SDK | ~$0.001-0.005 per SDXL image |
| **Fal.ai** | Optimized speed; ~1-3s SDXL | ~$0.003-0.008 |
| **Together AI** | Open-source models, batch API | ~$0.001-0.004 |
| **Modal** | Custom Python deploys, GPU access | ~$0.50-1.50/hour A10 GPU + per-second |
| **Anthropic API** | No image generation but image *editing* via Claude vision + tool use | Variable |

See [[Cloud Inference APIs]] for the full comparison.

## Style preservation scoring

After generation, validate that the output actually carries the style. Two approaches:

```typescript
async function scoreStylePreservation(generated: string, styleRef: string): Promise<number> {
  // Option 1: VGG / CLIP-style Gram matrix similarity (classical Gatys)
  const gramSim = await gramMatrixSimilarity(generated, styleRef);
  
  // Option 2: CLIP image embedding cosine similarity (semantic style)
  const clipSim = await clipImageSimilarity(generated, styleRef);
  
  // Option 3: VLM evaluation (Claude Opus 4.7 / GPT-5)
  const vlmScore = await vlmRateStyleMatch(generated, styleRef);
  
  // Composite: weighted
  return 0.3 * gramSim + 0.3 * clipSim + 0.4 * vlmScore;
}
```

For brand-style enforcement, **VLM-rate** is the most reliable in 2026 — it captures semantic style ("looks like an Apple ad") better than feature similarity.

## ICAS for high-fidelity cases

When IP-Adapter alone undershoots, **Iterative Consistent Aesthetic Sampling** (2025) applies multi-step refinement:

```typescript
async function icasTransfer(req: StyleTransferRequest, iterations: number = 3): Promise<StyleTransferResult> {
  let current = await styleTransfer(req);
  for (let i = 0; i < iterations - 1; i++) {
    const score = await scoreStylePreservation(current.imageUrl, req.styleImage);
    if (score > 0.85) break;   // good enough
    
    // Re-condition: use previous output as additional style reference
    current = await styleTransfer({
      ...req,
      styleImage: [req.styleImage, current.imageUrl] as any,
      strength: req.strength * 1.1,
    });
  }
  return current;
}
```

ICAS adds latency (3× the base diffusion cost in the worst case) but produces noticeably tighter style match for difficult cases.

## Negative prompts for style

Standard productivity in style-transfer is to combine positive style + negative style:

| Goal | Positive prompt elements | Negative prompt elements |
|---|---|---|
| Watercolor style | "watercolor, soft edges, paper texture" | "photograph, sharp, 3d render, digital" |
| Comic book | "comic book line, halftone, bold ink" | "smooth gradient, photograph, painterly" |
| Brutalist editorial | "high contrast, raw, concrete, type-driven" | "soft, ornate, decorative, gradient" |
| Mid-century corporate | "clean grid, sans-serif, mid-century palette" | "ornate, baroque, hand-drawn, organic" |

## Library recommendations

- **@anthropic-ai/sdk** for VLM-based style scoring + image editing workflows
- **Replicate JS client** (`replicate` on npm) for general-purpose inference
- **@huggingface/inference** for HuggingFace-hosted models
- **fal-ai/client** for low-latency Fal.ai
- **@xenova/transformers** for *local* depth-estimation and CLIP scoring (lightweight)

## Performance and cost

| Stage | Latency (cloud) | Cost |
|---|---|---|
| Single SDXL image | ~2-5 s | $0.001-0.005 |
| With IP-Adapter | ~2-5 s | same |
| With ControlNet | ~3-6 s | +20% |
| ICAS (3 iterations) | ~6-15 s | 3× base |
| Flux base model | ~3-8 s | $0.002-0.01 |
| LoRA fine-tune | ~1-3 hours | $1-5 per training run |

## Open research

- **Brand-LoRA libraries**: build a catalog of fine-tuned LoRAs per brand archetype (Mark & Pearson 12 archetypes — see [[Jungian Archetypes and Brand Archetypes]]). Tradeoff: LoRA per archetype × LoRA per industry vertical = many trains.
- **Style anchor selection**: which 2-3 reference images give best IP-Adapter performance? Open empirical question.
- **Real-time style transfer**: WebGPU-resident lightweight diffusion (LCM, Hyper-SD) for ~100-200 ms generation in-browser. 2026 frontier.
- **Cross-modal style** (audio → visual style): style-conditioned visualizer responsive to music genre. Bridges this technique with [[Audio-to-Visual Cross-Modal Mapping]].

## Cross-cultural validity

Diffusion model training corpora are **heavily Western**. Style transfer of non-Western visual traditions (Japanese ukiyo-e, Persian miniature, Pre-Columbian) is noticeably weaker than Western-style transfer in 2026 models. For non-Western styles:

- Use larger style-reference sets
- Use LoRA fine-tuning over IP-Adapter
- Pair with [[Non-Western Iconographic Systems]] explicit prompting to anchor non-Western iconography
- VLM-rate output explicitly against the tradition's visual conventions

## Related pages

[[Diffusion-Era Style Transfer]] · [[Style as Rule-System]] · [[Brand Style Guides as Rule-Systems]] · [[Cloud Inference APIs]] · [[AI Art Toolkit Map]] · [[Anthropic TypeScript SDK]] · [[Transformers.js]] · [[Style as System]] · [[Jungian Archetypes and Brand Archetypes]] · [[Non-Western Iconographic Systems]]

## Sources

- Ye, H., et al. (2023). "IP-Adapter: Text Compatible Image Prompt Adapter for Text-to-Image Diffusion Models." arXiv:2308.06721.
- Zhang, L., Rao, A., & Agrawala, M. (2023). "Adding Conditional Control to Text-to-Image Diffusion Models." (ControlNet) ICCV.
- Gatys, L. A., Ecker, A. S., & Bethge, M. (2015). "A Neural Algorithm of Artistic Style." (Historical reference.)
- ICAS reference: 2024-2025 arXiv preprints; rapidly evolving.
- Replicate API documentation: replicate.com/docs
- Fal.ai documentation: fal.ai/docs
