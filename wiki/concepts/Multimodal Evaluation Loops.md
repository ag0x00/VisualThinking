---
title: Multimodal Evaluation Loops
type: concept
aliases: [iterative refinement loop, generate-critique-refine, multimodal feedback loop, self-refine]
tags: [concept, llm-techniques, multimodal, iterative-refinement]
status: developing
address: c-000035
created: 2026-05-16
updated: 2026-05-16
---

# Multimodal Evaluation Loops

> The **generate → critique → refine** pattern using a vision-capable LLM (MLLM) as both generator and critic. Generate programmatic art, render it, feed the image back to the LLM with the original specification, ask it to critique against domain-specific criteria, regenerate with corrections, repeat. (Source: [[Wiki Seed]] proposes this pattern; [[Self-Refine - Iterative Refinement]] and [[Visual Prompting Iterative Refinement]] are the primary technical references.)

This is **the third leg of the LLM-techniques branch**, joining [[Vectorizing Aesthetic Concepts]] (vocabulary) and [[JSON Archetypes for Visual Tasks]] (output format). The loop is what closes the gap between specification and output.

## The basic loop

```
INIT:  spec ← user request, vectorized via [[Vectorizing Aesthetic Concepts]]
       spec ← rendered to a JSON Archetype  ([[JSON Archetypes for Visual Tasks]])

REPEAT for k iterations or until critic.satisfied():
    1. GENERATE:  artifact_k ← generator(spec, prior_artifact, prior_critique)
    2. RENDER:    image_k    ← rasterize(artifact_k)
    3. EXTRACT:   features_k ← cv_pipeline(image_k)    # saliency, histogram, D, ΔE pairs, …
    4. CRITIQUE:  critique_k ← critic(image_k, features_k, spec, JSON_archetype)
    5. CHECK:     if critique_k.satisfied: break

RETURN artifact_k, image_k
```

The architecture has three components:

- **Generator** — programmatic image creator (code, diffusion model, vector renderer).
- **CV pipeline** — extracts numerical features ([[Visual Entropy]], [[Fractal Dimension]], saliency centroid, [[CIEDE2000]] distances, [[Compositional Grids]] alignments). This is what *sees* the image; the LLM works on its outputs.
- **Critic** — vision-capable LLM constrained to a JSON evaluation archetype, applying domain-specific criteria.

In **Self-Refine** (Madaan et al., NeurIPS 2023), all three are the same underlying LLM with different prompts. Across 7 tasks (dialogue, math reasoning, code optimization, etc.), Self-Refine improved outputs by ~20% absolute over single-shot generation — same model, no extra training, no RL, just the loop (Source: [[Self-Refine - Iterative Refinement]]).

## Visual-domain extensions

The visual domain adds two complications beyond text Self-Refine:

1. **Image generation isn't text generation.** The "regenerate with corrections" step has to translate text critiques into actionable changes to a generative pipeline (a re-prompt to a diffusion model; a code edit to a p5.js sketch; parameter changes to a 3D renderer).

2. **The critic must *see* the image.** VLMs do this natively but with caveats (see [[Mind the Gap - VLM Spatial Reasoning]] — average VLM accuracy on spatial reasoning ≈ random chance). The mitigation: a deterministic CV pipeline extracts numerical features first, and the VLM is asked to reason over the features-plus-image, not the image alone.

Duan et al. (2024, Google) demonstrated the visual version concretely for **UI design critique** (Source: [[Visual Prompting Iterative Refinement]]):

- Input: a UI screenshot + design guidelines.
- Pipeline iteratively refines both *text comments* and *bounding boxes* that ground each comment to a specific region.
- Per-step few-shot examples tailored to each refinement task.
- Evaluated on Gemini-1.5-pro and GPT-4o; **human experts preferred the iterated pipeline's critiques to baseline; pipeline reduced the gap to human-expert performance by 50% on one metric**.

The same architecture transfers to fine-art critique, generative-art evaluation, accessibility audits — anywhere a visual artifact has objective constraints plus subjective quality dimensions.

## Practical recipe

For a programmatic art system in 2026:

```python
def loop(user_spec, max_iters=5):
    spec = vectorize(user_spec)              # [[Vectorizing Aesthetic Concepts]]
    archetype = JSON_archetype_for_task(spec) # [[JSON Archetypes for Visual Tasks]]

    artifact = None
    critique = None
    for k in range(max_iters):
        artifact = generator(spec, prior=artifact, critique=critique)
        image = rasterize(artifact)
        features = {
            "saliency_centroid":     cv.saliency_centroid(image),
            "luminance_histogram":   cv.histogram(image, channel="L"),
            "fractal_D":             cv.box_counting_dimension(image),
            "visual_entropy":        cv.shannon_entropy(image),
            "palette_oklch":         cv.extract_palette(image, space="oklch"),
            "ciede2000_pairs":       cv.pairwise_deltaE(palette, formula="ciede2000"),
            "grid_overlap":          cv.grid_score(image, grid=spec["grid"]),
            "wcag_contrast":         cv.wcag_pairs(image, text_regions),
        }
        critique = critic_llm(
            image=image,
            features=features,
            spec=spec,
            schema=evaluation_archetype,
        )
        if critique["satisfied"]:
            return artifact, image, k+1
    return artifact, image, max_iters
```

This is one (long) page of code that ties together every branch of the wiki.

## Known failure modes

The PromptEngineering subreddit and Self-Refine paper both flag a real issue: **without guardrails, the critic will always find something to criticize**, leading to thrashing or false negatives. Mitigations:

1. **Define a satisfied predicate explicitly.** "All scores ≥ 7, no comments with severity ≥ HIGH." Otherwise the critic loops forever.
2. **Few-shot the critic with examples of acceptable outputs.** Duan et al.'s approach — tailored few-shot for each step (Source: [[Visual Prompting Iterative Refinement]]).
3. **Bound the loop.** `max_iters = 5` is a reasonable default; longer rarely helps.
4. **Compare to baseline.** Always compare iter-$k$ output to the original generation; reject regressions.

Also: critic biases (length, position, format) are real (Source: [[MLLM-as-a-Judge]]). For critical applications, use pairwise comparison (where MLLMs are most accurate) rather than absolute scoring (where they are least accurate).

## Why it matters for this vault

The multimodal evaluation loop is **the deployment pattern** for programmable visual aesthetics. Once you have:

- The vocabulary ([[Vectorizing Aesthetic Concepts]])
- The output format ([[JSON Archetypes for Visual Tasks]])
- The judgment policy ([[LLM-as-Judge for Visual Quality]])
- The foundational concepts (the wiki's other three branches)

...the loop is what assembles them into a working system. Every page in this wiki is *input* to a loop iteration; the loop is *how the wiki gets used*.

## Related

[[Vectorizing Aesthetic Concepts]] · [[JSON Archetypes for Visual Tasks]] · [[LLM-as-Judge for Visual Quality]] · [[Mind the Gap - VLM Spatial Reasoning]] · [[Self-Refine - Iterative Refinement]] · [[Visual Prompting Iterative Refinement]] · [[Photo Aesthetic Features]] · [[NIMA - Neural Image Assessment]]
