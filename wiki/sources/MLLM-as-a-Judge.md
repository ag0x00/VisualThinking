---
title: "MLLM-as-a-Judge: Assessing Multimodal LLM-as-a-Judge with Vision-Language Benchmark"
type: source
source_type: peer-reviewed-paper
authors: [Dongping Chen, Ruoxi Chen, Shilin Zhang, Yinuo Liu, Yaochen Wang, Huichi Zhou, Qihui Zhang, Yao Wan, Pan Zhou, Lichao Sun]
publisher: "ICML 2024 (Oral); arXiv:2402.04788"
date_published: 2024-02-07
date_revised: 2024-06-11
date_retrieved: 2026-05-16
url: https://arxiv.org/abs/2402.04788
project_page: https://mllm-judge.github.io/
confidence: high
status: developing
tags: [source, llm-techniques, mllm, evaluation, primary-research]
address: c-000037
created: 2026-05-16
---

# Chen et al. — MLLM-as-a-Judge: Assessing Multimodal LLM-as-a-Judge with Vision-Language Benchmark

## Summary

ICML 2024 (Oral) paper introducing **MLLM-as-a-Judge**, a benchmark for assessing the ability of Multimodal LLMs to serve as automated judges across three task types: **Scoring Evaluation**, **Pair Comparison**, and **Batch Ranking**. Benchmarks state-of-the-art MLLMs (including GPT-4V) against human preferences and documents persistent biases and failure modes.

## What it contributes

- The **canonical reference benchmark** for evaluating MLLM-as-judge systems in 2024-onward research.
- The **three-task framing**: Scoring (absolute number), Pair Comparison (A vs B), Batch Ranking (sort N).
- The **central empirical finding**: MLLMs are strong at Pair Comparison ("remarkable human-like discernment") but show significant divergence from human preferences in Scoring and Batch Ranking.
- **Documented failure modes** of MLLM judges: position bias, verbosity bias, hallucinations in judgment, inconsistency across orderings.
- Specific demonstration that **even GPT-4V** suffers these issues at benchmark time.
- The argument that MLLMs **are not yet fully reliable evaluators** despite being useful — a calibration point for production systems.
- A publicly available dataset and code at the project homepage for reproducibility.

## Key claims

- **high** MLLMs demonstrate "remarkable human-like discernment in Pair Comparison."
- **high** MLLMs show "significant divergence from human preferences in Scoring Evaluation and Batch Ranking."
- **high** Persistent biases identified in MLLM judges include position bias, verbosity bias, hallucinatory responses, and inconsistencies in judgment.
- **high** These limitations apply "even in advanced models such as GPT-4V."
- **high** The three-task benchmark covers diverse modalities (Scoring, Pair Comparison, Batch Ranking) and is publicly available.
- **medium** MLLMs need enhancements and further research before they can be regarded as fully reliable evaluators.

## Confidence notes

**High confidence.** Peer-reviewed at ICML 2024 with **Oral acceptance** (the most prestigious presentation tier — roughly top 1% of submissions). 10 authors across multiple institutions. Public dataset and code at https://mllm-judge.github.io/. Findings are reproducible and have been built on by subsequent work in MLLM-as-judge robustness (papers 2024–2026).

The 2024 timestamp does mean the specific MLLM versions tested (GPT-4V, Gemini, etc.) are pre-2025; newer models may perform differently. The *categories* of failure (position bias, verbosity bias, scoring vs pair-comparison gap) are architectural and likely persistent across model generations.

## Why we cite it

The canonical primary source for **MLLM-as-judge** capabilities and limits. Cited from [[LLM-as-Judge for Visual Quality]] for the central pair-vs-scoring finding and the bias taxonomy; from [[Multimodal Evaluation Loops]] for the critic role; from [[Vectorizing Aesthetic Concepts]] for the VLM-limits framing; from [[Research - LLM Techniques]] for the synthesis.

## Related pages

[[LLM-as-Judge for Visual Quality]] · [[Multimodal Evaluation Loops]] · [[Vectorizing Aesthetic Concepts]] · [[Mind the Gap - VLM Spatial Reasoning]] · [[Visual Prompting Iterative Refinement]]
