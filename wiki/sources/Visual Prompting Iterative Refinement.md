---
title: "Duan et al. - Visual Prompting with Iterative Refinement for Design Critique Generation"
type: source
source_type: peer-reviewed-paper
authors: [Peitong Duan, Chin-Yi Cheng, Bjoern Hartmann, Yang Li]
publisher: "arXiv:2412.16829 (Google / UC Berkeley)"
date_published: 2024-12-22
date_revised: 2025-05-22
date_retrieved: 2026-05-16
url: https://arxiv.org/abs/2412.16829
confidence: high
status: developing
tags: [source, llm-techniques, multimodal, iterative-refinement, design-critique, primary-research]
address: c-000039
created: 2026-05-16
---

# Duan, Cheng, Hartmann, Li — Visual Prompting with Iterative Refinement for Design Critique Generation

## Summary

Primary research paper (arXiv:2412.16829, Dec 2024, revised May 2025) introducing an **iterative visual prompting pipeline for UI design critique**. Takes a UI screenshot + design guidelines as input; produces a list of design comments, each grounded with a bounding box mapping the comment to a specific region of the screenshot. The pipeline iteratively refines both the text comments and the bounding boxes using few-shot examples tailored per step. Evaluated on **Gemini-1.5-pro and GPT-4o**; human experts preferred the iterated outputs over baseline; the pipeline **closed 50% of the gap to human performance on one rating metric**. The technique also generalized to open-vocabulary object and attribute detection.

## What it contributes

- A **working multimodal iterative-refinement architecture** for visual critique, with empirical evaluation against human-expert benchmarks.
- The key insight that **iterative refinement of *bounding boxes* alongside text comments** is what drives the human-preference improvement — not just text refinement alone.
- The use of **few-shot examples tailored per refinement step** (different exemplars for text refinement vs. bounding-box refinement).
- **Quantitative gap-closure to human performance**: 50% on one metric using off-the-shelf MLLMs without fine-tuning.
- Demonstration that the architecture **generalizes** to non-critique tasks: open-vocabulary object and attribute detection in images.
- A practical template for any system that needs to: take an image, apply domain-specific guidelines, produce *visually-grounded* commentary (not just text).

## Key claims

- **high** Iterative visual prompting with few-shot refinement closes 50% of the gap to human design-critique performance on at least one rating metric.
- **high** Refining both **text output and bounding boxes** is more effective than refining text alone.
- **high** Few-shot examples tailored to each refinement step yield better critiques than generic few-shot prompts.
- **high** The architecture works with off-the-shelf MLLMs (Gemini-1.5-pro, GPT-4o) — no fine-tuning required.
- **high** Human experts preferred the iterated-pipeline outputs over baseline (statistically significant).
- **medium** The approach generalizes to open-vocabulary object and attribute detection, suggesting the iterative-grounding pattern is broadly useful for visual MLLM tasks.

## Confidence notes

**High confidence.** ArXiv preprint, but two strong indicators:

1. The author affiliations are notable (Google Research / UC Berkeley — Cheng and Li from Google, Hartmann from Berkeley).
2. The paper was revised in May 2025, suggesting active follow-through.

Evaluation methodology: human experts as ground truth, blind comparison to baseline, statistical significance reported. Reproducible: uses publicly available MLLM APIs (Gemini-1.5-pro, GPT-4o) without proprietary modifications.

Limit: paper focuses on UI critique specifically. Transfer to fine-art or generative-art critique is *plausible but not directly evaluated*.

## Why we cite it

The strongest empirical evidence for **multimodal iterative refinement working** on a visual critique task with off-the-shelf models. Cited from [[Multimodal Evaluation Loops]] for the architecture and the 50% gap-closure result; from [[LLM-as-Judge for Visual Quality]] for the bounding-box-grounded critique pattern; from [[JSON Archetypes for Visual Tasks]] for the comment-with-bbox structured output; from [[Research - LLM Techniques]] for the synthesis.

## Related pages

[[Multimodal Evaluation Loops]] · [[LLM-as-Judge for Visual Quality]] · [[JSON Archetypes for Visual Tasks]] · [[Vectorizing Aesthetic Concepts]] · [[Self-Refine - Iterative Refinement]]
