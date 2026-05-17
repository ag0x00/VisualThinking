---
title: LLM-as-Judge for Visual Quality
type: concept
aliases: [MLLM as judge, LLM-as-a-judge, vision LLM evaluator]
tags: [concept, llm-techniques, evaluation, multimodal]
status: developing
address: c-000036
created: 2026-05-16
updated: 2026-05-16
---

# LLM-as-Judge for Visual Quality

> Using a vision-capable LLM (MLLM) as an **automated evaluator** of image quality, aesthetics, or fit-to-spec. Standard tasks: scoring (assign a number), pair comparison (which is better?), batch ranking (sort N images). The benchmark reference is Chen et al., *MLLM-as-a-Judge*, ICML 2024 (Source: [[MLLM-as-a-Judge]]).

This concept is the **evaluation half** of [[Multimodal Evaluation Loops]]. When the loop has a critic, the critic is an LLM-as-judge. But MLLM-as-judge is also used standalone — for benchmarking, A/B testing, dataset curation, and any task where you'd otherwise hire human raters.

## The three task types

From Chen et al.'s benchmark (Source: [[MLLM-as-a-Judge]]):

| Task | What | How well MLLMs do |
|---|---|---|
| **Pair Comparison** | "Is A better than B?" | **Strong.** Human-like discernment. Recommended default. |
| **Scoring** | "Score image A on $X$ from 1–10" | **Weak.** Significant divergence from human preferences. |
| **Batch Ranking** | "Sort these N images from best to worst" | **Weak.** Persistent inconsistencies, position bias. |

The takeaway from the 2024 benchmark: **if you need MLLM evaluation today, use pair comparison.** Scoring and ranking are not yet reliable for human-parity output.

This finding is robust across GPT-4V and other state-of-the-art MLLMs at the time of the benchmark; the architectural reason is suspected to be that pairwise judgments are *relative* (anchored by the other image) while absolute scoring requires *internalized* aesthetic norms which MLLMs don't reliably have.

## Known biases

Chen et al. document multiple persistent failure modes (Source: [[MLLM-as-a-Judge]]):

- **Position bias** — preferring image A or B depending on order; partially fixed by averaging both orderings.
- **Length / verbosity bias** — preferring more-detailed images or more-detailed accompanying text.
- **Hallucinated content** — the judge describes elements that aren't in the image and uses those hallucinations in its judgment.
- **Inconsistency** — same MLLM, same images, different orderings, different verdicts.
- **Format bias** — preference for certain image dimensions, aspect ratios.

All of these affect even **GPT-4V** at benchmark time. Assume any MLLM-as-judge pipeline has them unless explicitly debiased.

## Mitigations

Practical patterns to harden an MLLM judge:

1. **Always evaluate both orderings.** $(A, B)$ and $(B, A)$, average the verdict. Halves position-bias error.
2. **Prefer pair comparison over scoring.** When scoring is unavoidable, use a small ordinal scale (1–5) rather than 1–10.
3. **Use a structured rubric.** A [[JSON Archetypes for Visual Tasks|JSON evaluation archetype]] forces the judge to reason in well-defined categories rather than emit a single number.
4. **Pre-extract features with CV.** Don't ask the MLLM to compute centroids, contrast ratios, or fractal dimensions — give it those numbers as context. Avoids the [[Mind the Gap - VLM Spatial Reasoning|VLM spatial-reasoning gap]].
5. **Calibrate against human ratings.** For each new domain, run a small human-rated sample (50–100 pairs) and check the MLLM agreement rate. Reject the system below ~70% agreement.
6. **Use a "judge ensemble"** — multiple MLLMs vote. Reduces single-model bias but expensive.
7. **Iterate the critique itself.** Duan et al.'s pattern: ask the judge to refine its own critique with few-shot examples (Source: [[Visual Prompting Iterative Refinement]]).

## What MLLM judges are good for

Despite the caveats, MLLMs-as-judges are **enormously useful** for tasks where:

- A pairwise comparison fits the workflow naturally (A/B testing, iterative refinement).
- Domain-specific criteria can be enumerated explicitly in a rubric.
- A 70%-human-agreement evaluator is meaningfully better than no evaluator.
- Throughput matters more than perfect accuracy (curation at scale).

For *this vault's* purposes — programmatic art with foundations-grounded criteria — MLLMs-as-judges work well **if** the loop:

- Computes objective measurements (entropy, $D$, ΔE, WCAG) via CV.
- Asks the MLLM only to judge dimensions that depend on holistic visual perception (does the composition feel balanced? does the palette evoke the requested mood?).
- Uses pair comparison whenever possible.

This division of labor — CV for the measurables, MLLM for the gestaltlike — is the right hand-off given current capabilities.

## Comparison to NIMA-style learned evaluators

[[NIMA - Neural Image Assessment]] (Talebi & Milanfar, 2017) is a different evaluation pattern: train a CNN to predict the *distribution* of human opinion scores. Different tradeoffs:

| | LLM-as-Judge | NIMA-style CNN |
|---|---|---|
| Setup cost | Zero (use API) | Training, dataset, infrastructure |
| Inference cost | API per request | Cheap per inference |
| Interpretability | Strong (text critique) | None (scalar score) |
| Domain transfer | Strong (re-prompt) | Requires re-training |
| Calibration to humans | 70–80% agreement (pairwise) | Spearman ρ ≈ 0.6 (NIMA on AVA) |
| Bias | Documented and large | Different biases, less documented |

For *interpretability-required* applications (design critique, curation feedback, iterative refinement), LLM-as-judge wins. For *throughput-required* applications (auto-curation at billion-image scale), NIMA-style wins. Hybrid systems use both: NIMA for the first-pass filter, LLM-as-judge for the qualitative review.

## Why it matters for this vault

LLM-as-Judge is **the evaluation primitive** for any wiki-driven art system. The concepts in this wiki — [[The Gestalt Principles of Visual Perception]], [[Color Harmony]], [[Rule of Thirds]], [[Fractal Dimension]] — are *what the judge applies*. The vault's [[JSON Archetypes for Visual Tasks]] is *how the judge speaks*. The [[Multimodal Evaluation Loops]] page is *where the judge fits*.

For a 2026 build:

1. Use Claude Sonnet 4.6 / Opus 4.7 with structured-output mode (Source: [[Anthropic - Structured Outputs]]).
2. Pre-extract numerical features with OpenCV / saliency models / `culori` / etc.
3. Give the MLLM the image + features + rubric.
4. Require structured JSON output per [[JSON Archetypes for Visual Tasks]].
5. Use pair comparison wherever possible; calibrate against humans for new domains.

## Related

[[Multimodal Evaluation Loops]] · [[Vectorizing Aesthetic Concepts]] · [[JSON Archetypes for Visual Tasks]] · [[Mind the Gap - VLM Spatial Reasoning]] · [[NIMA - Neural Image Assessment]] · [[Photo Aesthetic Features]] · [[MLLM-as-a-Judge]] · [[Visual Prompting Iterative Refinement]] · [[Self-Refine - Iterative Refinement]]
