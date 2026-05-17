---
title: Vectorizing Aesthetic Concepts
type: concept
aliases: [aesthetic concept vectorization, art prompt engineering, coordinate prompting]
tags: [concept, llm-techniques, prompt-engineering]
status: developing
address: c-000033
created: 2026-05-16
updated: 2026-05-16
---

# Vectorizing Aesthetic Concepts

> The technique of **translating fuzzy art-vocabulary into coordinate, metric, and constraint language** that an LLM can act on programmatically. Instead of asking a vision-capable LLM to "make the composition balanced," ask: "place the centroid of saliency-weighted mass within 5% of the canvas center, and ensure no single quadrant carries more than 35% of the total." (Source: [[Wiki Seed]] proposes this technique by example.)

This is the **foundational technique of the LLM-techniques branch**: every other technique in this branch (JSON archetypes, multimodal evaluation loops, LLM-as-judge) depends on having a vocabulary of programmable aesthetic concepts to work with. The wiki's other three branches — [[Research - Tonal Foundations in Classical Painting|tonal foundations]], [[Research - Composition Foundations|composition]], [[Research - Color Systems|color]], [[Research - Aesthetic Measures|aesthetic measures]] — are the source of that vocabulary.

## The translation pattern

For each fuzzy concept, find a programmable definition. A non-exhaustive table:

| Art vocabulary | Programmable form | Source concept |
|---|---|---|
| "Balanced" | Saliency centroid within $X$% of canvas center | [[The Gestalt Principles of Visual Perception]] (Arnheim) |
| "Harmonious palette" | OKLCH hue offsets matching a canonical scheme + chroma within band | [[Color Harmony]] / [[OKLCH]] |
| "Dramatic lighting" | Bimodal luminance histogram (Otsu separability $> 0.6$) | [[Tenebrism]] |
| "Soft" / "atmospheric" | Frequency-dependent edge diffusion; preserved mid-tones | [[Sfumato]] |
| "Visually engaging" | Fractal dimension $D \in [1.3, 1.5]$; mid-range entropy | [[Fractal Dimension]] / [[Visual Entropy]] |
| "Well-composed" | Saliency mass within $X$px of a canonical grid focal point | [[Compositional Grids]] / [[Rule of Thirds]] |
| "Readable" (text over image) | Contrast ratio $\geq 4.5{:}1$ for normal text | [[WCAG Contrast Ratios]] |
| "Coherent" / "unified" | Low region-count after spatial clustering; uniform texton density | [[The Gestalt Principles of Visual Perception]] |
| "Tonally rich" | $H$ (entropy) in mid-range; CIEDE2000 spread in palette | [[Visual Entropy]] / [[CIEDE2000]] |
| "Striking accent color" | Palette ΔE outlier — one color with $\Delta E_{00} \geq 25$ from the cluster | [[CIEDE2000]] / [[Color Harmony]] |

This is the vault's spine in tabular form: foundations on the right, programmable language on the left.

## Why it works

LLMs trained on text struggle with vague aesthetic directives because the training corpus contains contradictory examples. "Balanced composition" can mean rule-of-thirds focal alignment, center-weighted symmetry, golden-section armatures, or asymmetric weight balance — all attested in art-history writing. The fuzzy term doesn't constrain.

A coordinate-and-metric directive constrains *unambiguously*:

> "Place the saliency centroid at $(x, y)$ such that $|x - 0.5| < 0.05$ AND $|y - 0.5| < 0.05$ on a normalized canvas."

The LLM (or downstream generative system) now knows what to optimize. The output is verifiable. The judgment can be inverted into evaluation: ask the model to check whether an existing image meets the constraint.

## The Wiki Seed example (operationalized)

The seed proposes:

> "Analyze the distribution of visual weights across a $1000 \times 1000$ matrix. Ensure the center of mass of dark tones ($Y \leq 30$) balances perfectly against the directional vector of the accent colors ($Chroma \geq 70$)."

Decomposed:

- **"Visual weight"** → luminance-weighted area: each pixel contributes $1 - Y/255$ in greyscale (darker = heavier).
- **"Dark tones"** → luminance $Y \leq 30$ on a 0–255 scale.
- **"Accent colors"** → pixels with [[OKLCH]] chroma $C \geq 70$ (high-saturation).
- **"Center of mass"** → standard centroid computation per category.
- **"Directional vector of accent colors"** → centroid of accent pixels relative to canvas center; the vector from center to that centroid.
- **"Balances perfectly"** → the dark-tone centroid + accent-color centroid sum approximately to zero (relative to canvas center) — i.e., they are on opposite sides.

This is the entire technique in one example: a single art-speak directive becomes ~5 lines of NumPy.

## VLM limits to be aware of

A pressing caveat (2024–2026 state of the art): **vision-language models perform poorly at native spatial reasoning**. Stogiannidis, McDonagh, Tsaftaris (March 2025) benchmarked 13 state-of-the-art VLMs on spatial relations, orientation, mental rotation, and spatial visualization tasks and found **average accuracy approximating random chance** (Source: [[Mind the Gap - VLM Spatial Reasoning]]).

Implications for vectorizing aesthetic concepts:

1. **Don't ask the VLM to compute coordinates from the image directly.** Use deterministic computer-vision tooling (OpenCV, saliency models) to extract the coordinates, then feed those to the LLM as text/JSON.
2. **Pair comparisons work better than scoring.** MLLMs are decent at "is image A more balanced than image B?" but poor at "score image A on balance from 1–10" (Source: [[MLLM-as-a-Judge]]).
3. **Bounding-box outputs degrade with image complexity.** When asking VLMs to localize, expect noise; iterative refinement (Duan et al.) helps (Source: [[Visual Prompting Iterative Refinement]]).

The workaround: **the LLM is the reasoner; CV libraries are the eyes.** The vault's tools branch (forthcoming sweep) will cover the CV side.

## Programmable form

For an LLM-driven art critic / generator:

```
1. User asks: "Make this image more dramatic."
2. System retrieves "dramatic" from a vectorization table:
   - bimodal luminance histogram (Otsu)
   - centered light source
   - dark periphery (>60% of pixels below luminance threshold)
3. Each criterion becomes a tool call:
   - run_otsu(image) → separability score
   - compute_luminance_histogram(image) → bins
   - compute_saliency_centroid(image) → (x, y)
4. LLM receives the measurements as JSON, not the image directly.
5. LLM proposes edits OR scores the current image against the criteria.
```

The key move is step 4: **the LLM works on numerical features extracted by CV, not on the pixels.** This sidesteps the VLM spatial-reasoning gap while preserving the LLM's strength at natural-language reasoning and instruction-following.

## Why it matters for this vault

Vectorizing aesthetic concepts is the **operating system of the LLM-techniques branch**. The vault's other branches provide the vocabulary; this technique is *how* you actually use them with an LLM. Pair with:

- [[JSON Archetypes for Visual Tasks]] — the output format for vectorized directives.
- [[Multimodal Evaluation Loops]] — the iterative refinement architecture that uses these directives.
- [[LLM-as-Judge for Visual Quality]] — using the same vocabulary in evaluation mode.

## Related

[[JSON Archetypes for Visual Tasks]] · [[Multimodal Evaluation Loops]] · [[LLM-as-Judge for Visual Quality]] · [[Mind the Gap - VLM Spatial Reasoning]] · [[The Gestalt Principles of Visual Perception]] · [[Compositional Grids]] · [[OKLCH]] · [[Color Harmony]] · [[Fractal Dimension]] · [[Visual Entropy]]
