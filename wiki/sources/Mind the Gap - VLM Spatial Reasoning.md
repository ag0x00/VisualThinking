---
title: "Stogiannidis, McDonagh, Tsaftaris - Mind the Gap: Benchmarking Spatial Reasoning in Vision-Language Models"
type: source
source_type: peer-reviewed-paper
authors: [Ilias Stogiannidis, Steven McDonagh, Sotirios A. Tsaftaris]
publisher: "arXiv:2503.19707 (University of Edinburgh)"
date_published: 2025-03-25
date_retrieved: 2026-05-16
url: https://arxiv.org/abs/2503.19707
code: https://github.com/stogiannidis/srbench
dataset: https://huggingface.co/datasets/stogiannidis/srbench
confidence: high
status: developing
tags: [source, llm-techniques, vlm, spatial-reasoning, limitations, primary-research]
address: c-000041
created: 2026-05-16
---

# Stogiannidis, McDonagh, Tsaftaris — Mind the Gap: Benchmarking Spatial Reasoning in Vision-Language Models

## Summary

Primary research paper (arXiv:2503.19707, March 2025) introducing **SRBench**, a benchmark for evaluating spatial reasoning in Vision-Language Models, and presenting results on **13 state-of-the-art VLMs**. The benchmark isolates spatial reasoning from related tasks (object detection, semantic comprehension) by decomposing into four core elements: **spatial relations, orientation and navigation, mental rotation, and spatial visualization**. The headline finding: **average accuracy across all 13 VLMs approximates random chance**.

## What it contributes

- The **first benchmark to isolate spatial reasoning** as distinct from object detection and semantic understanding in VLMs.
- A **four-element decomposition** of spatial reasoning: relations, orientation/navigation, mental rotation, spatial visualization.
- **Empirical finding**: 13 state-of-the-art VLMs average **random chance** accuracy on spatial-reasoning tasks.
- A public benchmark dataset on HuggingFace and code on GitHub for reproduction.
- A **calibration point for production systems** using VLMs as spatial reasoners: assume they cannot do this reliably and design pipelines accordingly.
- Both **synthetic and real-world image** evaluations, bridging controlled and naturalistic contexts.

## Key claims

- **high** Average accuracy across 13 state-of-the-art VLMs on spatial reasoning tasks approximates **random chance**.
- **high** Existing VLM benchmarks include spatial components but fail to isolate spatial reasoning from object detection or semantic comprehension.
- **high** Spatial reasoning decomposes into four core elements: spatial relations, orientation and navigation, mental rotation, spatial visualization.
- **high** Spatial reasoning is a persistent obstacle in current VLMs (March 2025) — not solved by scale alone in the models tested.
- **medium** The architecture-versus-data question (is this an architectural limitation or a training-data gap?) is not resolved in the paper but identified as future work.

## Confidence notes

**High confidence.** ArXiv preprint with strong indicators: University of Edinburgh affiliation, public code and dataset, 13-model evaluation (a substantial sample), rigorous benchmark design that addresses the central methodological issue (isolation of spatial reasoning from confounding tasks).

The 2025 timestamp means specific tested models are pre-mid-2025; newer models may perform differently. The *categorical finding* (current VLMs are bad at native spatial reasoning) is unlikely to flip in the 12-month window — multiple independent works in 2024–25 corroborate it. Worth re-testing on Claude Opus 4.7 / GPT-5 / Gemini 2.5 when those become available.

For production use today: **assume VLMs cannot do spatial reasoning natively** and offload the spatial pipeline to deterministic CV. This is the operating assumption in [[Vectorizing Aesthetic Concepts]] and [[Multimodal Evaluation Loops]].

## Why we cite it

The **critical caveat source** for the LLM-techniques branch. Cited from [[Vectorizing Aesthetic Concepts]] for the "VLM limits to be aware of" section; from [[Multimodal Evaluation Loops]] for the rationale of CV-features-as-context; from [[LLM-as-Judge for Visual Quality]] for the mitigation that features should be extracted by CV not by the VLM; from [[Research - LLM Techniques]] for the synthesis.

## Related pages

[[Vectorizing Aesthetic Concepts]] · [[Multimodal Evaluation Loops]] · [[LLM-as-Judge for Visual Quality]] · [[MLLM-as-a-Judge]]
