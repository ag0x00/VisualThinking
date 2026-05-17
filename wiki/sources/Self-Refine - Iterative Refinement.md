---
title: "Madaan et al. - Self-Refine: Iterative Refinement with Self-Feedback"
type: source
source_type: peer-reviewed-paper
authors: [Aman Madaan, Niket Tandon, Prakhar Gupta, Skyler Hallinan, Luyu Gao, Sarah Wiegreffe, Uri Alon, Nouha Dziri, Shrimai Prabhumoye, Yiming Yang, Shashank Gupta, Bodhisattwa Prasad Majumder, Katherine Hermann, Sean Welleck, Amir Yazdanbakhsh, Peter Clark]
publisher: "NeurIPS 2023"
date_published: 2023-09-21
date_retrieved: 2026-05-16
url: https://neurips.cc/virtual/2023/poster/71632
proceedings_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract-Conference.html
project_page: https://selfrefine.info/
confidence: high
status: developing
tags: [source, llm-techniques, iterative-refinement, primary-research]
address: c-000040
created: 2026-05-16
---

# Madaan et al. — Self-Refine: Iterative Refinement with Self-Feedback

## Summary

Foundational NeurIPS 2023 paper introducing **Self-Refine**: an approach where a single LLM generates an initial output, provides feedback on that output, and refines itself based on the feedback — *iteratively, without any supervised training data, additional training, or reinforcement learning*. Evaluated across 7 diverse tasks (dialogue, math reasoning, code optimization, sentiment reversal, etc.) on GPT-3.5, ChatGPT, and GPT-4. **Outputs preferred ~20% absolute improvement** in task performance over single-shot generation.

## What it contributes

- The **canonical formulation of the self-refine pattern**: single LLM serves as generator, refiner, and feedback provider.
- Empirical evidence that **iterative self-feedback alone** (no training, no external signal) substantially improves LLM outputs.
- **~20% absolute average improvement** across 7 tasks — a strong baseline for any iterative-refinement system.
- Demonstration that even **state-of-the-art LLMs (GPT-4 at the time)** benefit from the loop — refining the SOTA, not just bootstrapping weaker models.
- The architectural template that **subsequent visual / multimodal iterative-refinement work builds on** (e.g., Duan et al. 2024 — Source: [[Visual Prompting Iterative Refinement]]).

## Key claims

- **high** A single LLM acting as generator, feedback provider, and refiner can iteratively improve its own outputs without any supervised training or RL.
- **high** Across 7 diverse tasks, Self-Refine outputs are preferred by humans and automatic metrics over single-shot generation.
- **high** Average ~20% absolute improvement in task performance over single-shot baseline.
- **high** The technique works on GPT-3.5, ChatGPT, and GPT-4 — i.e., across LLM capability tiers.
- **high** No additional training data, no fine-tuning, no reinforcement learning — pure test-time technique.

## Confidence notes

**High confidence.** Peer-reviewed at NeurIPS 2023 (the top ML conference). 16 authors across academic and industry institutions (CMU, AI2, Microsoft, NVIDIA, etc.). Project page (selfrefine.info) hosts code and reproduction details. Findings have been replicated and built on extensively in 2024–2025 literature.

Limit: the 20% improvement is averaged across tasks. Per-task variance is significant — some tasks improve much more (code, dialogue), others less. The *visual* domain wasn't directly evaluated; that was Duan et al.'s 2024 follow-up (Source: [[Visual Prompting Iterative Refinement]]).

Caveats from subsequent work (e.g., the PromptEngineering subreddit thread): without explicit "satisfied" criteria, the refiner can find faults indefinitely and either thrash or output regressions. This is widely-known and addressed in production deployments via bounded iteration + explicit acceptance predicates.

## Why we cite it

The **foundational reference for iterative self-refinement** in LLMs. Cited from [[Multimodal Evaluation Loops]] for the basic loop architecture; from [[LLM-as-Judge for Visual Quality]] for the critic-is-the-same-model pattern; from [[Research - LLM Techniques]] for the synthesis.

## Related pages

[[Multimodal Evaluation Loops]] · [[Visual Prompting Iterative Refinement]] · [[LLM-as-Judge for Visual Quality]] · [[Vectorizing Aesthetic Concepts]]
