---
type: synthesis
title: "Research: LLM Techniques for Visual Reasoning"
tags: [research, llm-techniques, multimodal]
status: developing
address: c-000042
created: 2026-05-16
updated: 2026-05-16
related:
  - "[[Vectorizing Aesthetic Concepts]]"
  - "[[JSON Archetypes for Visual Tasks]]"
  - "[[Multimodal Evaluation Loops]]"
  - "[[LLM-as-Judge for Visual Quality]]"
  - "[[MLLM-as-a-Judge]]"
  - "[[Anthropic - Structured Outputs]]"
  - "[[Visual Prompting Iterative Refinement]]"
  - "[[Self-Refine - Iterative Refinement]]"
  - "[[Mind the Gap - VLM Spatial Reasoning]]"
sources:
  - "[[MLLM-as-a-Judge]]"
  - "[[Anthropic - Structured Outputs]]"
  - "[[Visual Prompting Iterative Refinement]]"
  - "[[Self-Refine - Iterative Refinement]]"
  - "[[Mind the Gap - VLM Spatial Reasoning]]"
---

# Research: LLM Techniques for Visual Reasoning

## Overview

This is the **operational layer** of the vault — the techniques that let an LLM actually use the foundations from the other three branches ([[Research - Tonal Foundations in Classical Painting|tonal foundations]], [[Research - Composition Foundations|composition]], [[Research - Color Systems|color]], [[Research - Aesthetic Measures|aesthetic measures]]). Four techniques form the operational kernel: **vectorizing aesthetic concepts** (translating fuzzy art-speak into coordinate and metric language); **JSON archetypes** (forcing structured output via schema constraints); **multimodal evaluation loops** (generate → critique → refine with a vision-LLM critic); and **LLM-as-judge** (the evaluation primitive used standalone or inside loops). One critical caveat anchors all four: state-of-the-art VLMs perform at random chance on native spatial reasoning, so the architecture must offload measurable quantities to deterministic CV and ask the LLM only for holistic judgment.

## Key Findings

- **Vectorization is the bridge between the wiki's foundations and any LLM that uses them.** The wiki's other branches are vocabulary; vectorizing aesthetic concepts is the technique for turning that vocabulary into directives an LLM can act on programmatically. The translation pattern is "fuzzy term → coordinate / metric / constraint." (Synthesis from all sources; the [[Wiki Seed]] proposes this technique by example.)
- **Native VLM spatial reasoning is at random-chance level (2024–2025 SOTA).** Stogiannidis et al. (March 2025) benchmark 13 SOTA VLMs on spatial relations, orientation, mental rotation, and spatial visualization; average accuracy is approximately random chance (Source: [[Mind the Gap - VLM Spatial Reasoning]]). This is the dominant architectural constraint: don't ask the VLM to compute coordinates; ask it to reason over CV-extracted features.
- **Structured output (JSON schema with constrained decoding) is generally available across Claude 4.x models.** `output_config.format` guarantees schema-compliant responses through grammar compilation, not best-effort. Complexity limits (20 strict tools, 24 optional parameters, 16 union-type parameters, 180s compilation timeout) bound how complex a schema can be (Source: [[Anthropic - Structured Outputs]]). Most visual-task archetypes fit comfortably inside the limits.
- **MLLMs are strong at pair comparison and weak at scoring / ranking.** Chen et al. (ICML 2024 Oral): "remarkable human-like discernment in Pair Comparison; significant divergence from human preferences in Scoring Evaluation and Batch Ranking." Persistent biases (position, verbosity, hallucinations, inconsistency) affect even GPT-4V (Source: [[MLLM-as-a-Judge]]). Mitigation: prefer pair comparison; if scoring is unavoidable, use small ordinal scales and a structured rubric.
- **Iterative self-refinement works.** Madaan et al. (Self-Refine, NeurIPS 2023) show ~20% absolute improvement across 7 tasks using a single LLM as generator/refiner/critic — no training, no RL, no external data (Source: [[Self-Refine - Iterative Refinement]]). For *visual* iterative refinement, Duan et al. (Dec 2024 / May 2025) extend the pattern to UI design critique, closing 50% of the gap to human-expert performance with off-the-shelf MLLMs by **iteratively refining text comments and bounding boxes** using per-step few-shot examples (Source: [[Visual Prompting Iterative Refinement]]).
- **The deployment recipe.** For an LLM-driven art / design system in 2026: (1) vectorize the user spec, (2) shape the output with a JSON archetype, (3) extract features via CV (saliency, histogram, $D$, ΔE pairs, grid overlap, WCAG), (4) feed image + features + schema + rubric to an MLLM, (5) use pair comparison wherever possible, (6) iterate with bounded loops and explicit acceptance predicates.

## The four techniques and how they compose

```
                 ┌────────────────────────────────────────────┐
                 │  USER REQUEST  ("make this more dramatic") │
                 └───────────────────┬────────────────────────┘
                                     ↓
                ┌────────────────────────────────────────┐
                │   [[Vectorizing Aesthetic Concepts]]   │  ← fuzzy → coordinate/metric
                │   "dramatic" → bimodal luminance       │
                │   + Otsu separability > 0.6 + ...      │
                └────────────────────┬───────────────────┘
                                     ↓
                ┌────────────────────────────────────────┐
                │  [[JSON Archetypes for Visual Tasks]]  │  ← output format
                │   schema: { harmony, focal_points,     │
                │             scores, bbox_critiques }   │
                └────────────────────┬───────────────────┘
                                     ↓
                ┌────────────────────────────────────────┐
                │   [[Multimodal Evaluation Loops]]      │  ← the architecture
                │   generate → render → CV features →    │
                │   critic_llm → refine → repeat         │
                └────────────────────┬───────────────────┘
                                     ↓
                ┌────────────────────────────────────────┐
                │   [[LLM-as-Judge for Visual Quality]]  │  ← inside the loop, or standalone
                │   pair compare, structured rubric,     │
                │   debiased ordering, CV features given │
                └────────────────────────────────────────┘
```

Each box is a wiki concept page. Each arrow is a method dependency. The wiki *itself* is the system.

## Named contributors (attribution only, no dedicated pages)

Per the wiki's programmability principle:

- **Aman Madaan, Niket Tandon, Prakhar Gupta, et al.** (CMU / AI2, NeurIPS 2023) — Self-Refine.
- **Dongping Chen et al.** (ICML 2024 Oral) — MLLM-as-a-Judge benchmark.
- **Peitong Duan, Chin-Yi Cheng, Bjoern Hartmann, Yang Li** (Google / UC Berkeley, Dec 2024) — Visual prompting with iterative refinement for design critique.
- **Ilias Stogiannidis, Steven McDonagh, Sotirios A. Tsaftaris** (University of Edinburgh, March 2025) — SRBench / VLM spatial reasoning benchmark.
- **Anthropic** — Claude API structured outputs implementation.
- **Hossein Talebi, Peyman Milanfar** (Google, 2017) — NIMA, the deep-learning aesthetics counterpart to LLM-as-judge ([[NIMA - Neural Image Assessment]]).

## Key Concepts

- [[Vectorizing Aesthetic Concepts]] — translating fuzzy art-speak into coordinate / metric / constraint language.
- [[JSON Archetypes for Visual Tasks]] — schema-first structured output for layouts, palettes, evaluation rubrics.
- [[Multimodal Evaluation Loops]] — the generate → critique → refine architecture.
- [[LLM-as-Judge for Visual Quality]] — the evaluation primitive, standalone or inside a loop.

## Contradictions and uncertainty

- **VLM spatial-reasoning weakness vs. successful design-critique applications.** Stogiannidis (March 2025) shows VLMs are bad at spatial reasoning; Duan (Dec 2024 / May 2025) shows VLMs close 50% of the human-expert gap on UI design critique. Resolution: Duan's pipeline does *iterative grounding* — refining the bounding boxes themselves with few-shot examples — which compensates for the VLM's native spatial weakness via the iteration. The single-shot VLM is bad at spatial reasoning; the *pipeline* around it can be made good.
- **MLLM-as-judge pair-comparison strength vs. scoring weakness.** Chen et al. show MLLMs are strong at "A vs B" but weak at "score A from 1 to 10." Resolution: pair comparison anchors judgment in relative terms (which the model is good at); scoring requires *internalized norms* that MLLMs don't reliably have. Use pair comparison whenever possible.
- **Self-Refine's ~20% improvement vs. infinite-fault-finding failure mode.** Self-Refine works when an explicit *satisfied* predicate exists; without it, the critic finds new faults indefinitely. Resolution: bound the loop (`max_iters = 5`) and define acceptance criteria explicitly.
- **Interpretable LLM-as-judge vs. high-throughput NIMA-style learned evaluator.** LLM-as-judge gives interpretable text critiques but is slow and expensive; NIMA gives cheap scalar scores but no explanation. They are different tools for different jobs, often combined in hybrid pipelines.

## Open Questions

- **VLM spatial reasoning on Claude Opus 4.7 / GPT-5 / Gemini 2.5.** Stogiannidis tested 13 models as of March 2025; Claude Opus 4.6, Sonnet 4.5/4.6, GPT-5 series, Gemini 2.5+ may perform differently. Re-test with SRBench when production-ready.
- **Domain transfer of UI critique to fine art / generative art.** Duan et al. evaluate on UI design specifically. Whether iterative bounding-box refinement transfers to fine-art critique is plausible but not directly tested.
- **Calibration of MLLM judges against humans for new aesthetic domains.** Each domain (UI, fine art, photography, generative art, accessibility) needs its own ~50–100 human-rated pair-comparison sample to verify ≥ 70% MLLM-human agreement before production deployment.
- **The "judge ensemble" cost-benefit.** Multiple MLLMs voting reduces single-model bias but multiplies cost. When is the ensemble worth it?
- **APCA-equivalent for aesthetic judgment** — i.e., an empirically-grounded reading-performance-style metric replacing today's heterogeneous human-preference proxies.
- **Best practices for the "satisfied" predicate in production loops.** The Self-Refine paper sidesteps this; practical deployments need real heuristics (threshold scores, max iterations, regression detection).
- **The Anthropic Skills + Plugin architecture and Memory Tool patterns** — operational substrate for these techniques worth its own deep treatment in a future sweep.

## What this sweep did NOT cover

- **Tools** — actual library implementations (`anthropic-sdk`, `culori`, OpenCV.js, `chroma.js`, p5.js, Py5, etc.). Queued for the final sweep.
- **Direct reads of**: Murray et al. 2012 AVA dataset paper; Galanter 2012 *Computational Aesthetic Evaluation: Past and Future*; the most recent MLLM-as-judge papers from late 2025 / early 2026.
- **Prompt-injection / jailbreak resistance** for visual content — relevant for production deployment but outside the aesthetic-reasoning scope.
- **Cost / latency tradeoffs** of iterative refinement at production scale.
- **The OpenAI / Google equivalent of [[Anthropic - Structured Outputs]]** for completeness — though the mechanism is similar.

## Sources

- [[MLLM-as-a-Judge]] — Chen et al., ICML 2024 (Oral). Three-task benchmark; pair-comparison-vs-scoring finding.
- [[Anthropic - Structured Outputs]] — Claude API official documentation. JSON schema constrained decoding.
- [[Visual Prompting Iterative Refinement]] — Duan et al., arXiv 2412.16829 (Dec 2024 / May 2025). 50% gap-closure on UI critique.
- [[Self-Refine - Iterative Refinement]] — Madaan et al., NeurIPS 2023. ~20% improvement, foundational self-refine pattern.
- [[Mind the Gap - VLM Spatial Reasoning]] — Stogiannidis et al., arXiv 2503.19707 (March 2025). VLMs at random chance on spatial reasoning.
