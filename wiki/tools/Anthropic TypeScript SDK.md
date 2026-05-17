---
title: Anthropic TypeScript SDK
type: tool
status: developing
tags: [tool, library, llm, anthropic, claude, typescript]
address: c-000131
created: 2026-05-17
url: https://github.com/anthropics/anthropic-sdk-typescript
license: MIT
last_release: continuous (2026)
verdict: first-class-default-llm
---

# Anthropic TypeScript SDK

The **official TypeScript / JavaScript SDK for the Claude API** (Anthropic, 2023+). Provides typed access to Claude (Opus, Sonnet, Haiku) models for chat completion, structured outputs, tool use, vision (multimodal image input), and streaming. Specified in CLAUDE.md as the wiki's **default LLM integration layer**.

**Verdict: first-class default LLM SDK** for the wiki's pipelines. Other LLMs (OpenAI, Google, Mistral) can be integrated similarly but Claude is the wiki's chosen model family.

## Purpose (one line)

Official TypeScript / JavaScript SDK for the Claude API, with typed methods for messages, streaming, structured outputs, tool use, and vision (multimodal image input).

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **4 / 5** | Claude as critic / planner / iterative-refinement-loop driver |
| 2. Branding | **4 / 5** | Claude for brand-voice generation; mark-description / variation prompting; persona-guided judging |
| 3. Graphic design | **4 / 5** | Layout-suggestion, copy generation, art-direction-feedback |
| 4. Music-reactive visualizers | **2 / 5** | LLMs are too slow for real-time visualizer loops; useful for *offline* parameter-space exploration |

### Paradigm coverage (in generative pipelines)

- ✅ **Critic / fitness-function**: Claude can score outputs against rubric criteria. Essential for [[LLM-as-Judge for Visual Quality]] pipelines.
- ✅ **Planner**: Claude as the planning layer that chooses what to generate next.
- ✅ **Structured output**: Claude produces JSON matching a schema; powers [[JSON Archetypes for Visual Tasks]].
- ✅ **Tool use**: Claude calls external tools (image generation, image analysis, code execution) — enables agentic generative loops.
- ✅ **Vision**: Claude can *see* images and reason about them — critical for self-critique loops.

### Autonomy-control fit

**Score: 5 / 5** — extremely flexible. From tight-control (single chat completion with deterministic temperature) to autonomous (agentic tool-use loops over many turns). LLM-as-collaborator works at every regime.

### API surface

- ✅ **Messages API**: standard chat-completion endpoint with system + user + assistant turns.
- ✅ **Streaming**: token-by-token streaming for low-latency UIs.
- ✅ **Tool use** ("function calling"): Claude can call typed tools you define.
- ✅ **Vision**: image inputs alongside text.
- ✅ **Structured outputs**: prompted JSON or schema-validated output via the Messages API + careful prompting; native structured-output mode in newer API versions.
- ✅ **Prompt caching**: cache long system prompts to reduce latency and cost.
- ✅ **Batch API**: process many requests asynchronously at lower cost.
- ✅ **Files API**: upload reference assets that persist across calls.

### Idiomaticity and LLM-codegen friendliness

**Score: 5 / 5** — first-class TypeScript:

- **TypeScript-first design**: every API response is typed.
- **Comprehensive documentation** at https://docs.anthropic.com/.
- **Examples and cookbook** at https://github.com/anthropics/anthropic-cookbook.
- **Stable API patterns** with versioned releases.
- **LLMs (including Claude itself) generate working code for this SDK reliably.**

### Production-readiness

**Score: 5 / 5** — production-ready:

- MIT-licensed SDK.
- Anthropic's hosted API is production-grade with SLAs.
- Used in production at scale across the LLM-application ecosystem.
- Bundle size for the SDK: ~50kB gzipped. The underlying network calls dominate.

## Model selection (2026)

Per CLAUDE.md global instructions: "always use the latest available version of a model. For example, Haiku-4.5 as of Nov 2025." For the wiki's purposes in 2026:

| Model | Use case |
|---|---|
| **Claude Opus 4.x** | Deep reasoning; planning; high-stakes critique; nuanced art evaluation. Slower / more expensive. |
| **Claude Sonnet 4.x** | The workhorse; most pipelines run here. Strong reasoning + reasonable speed and cost. |
| **Claude Haiku 4.x** | Fast / cheap; high-volume work; tight loops; low-stakes classification. |
| **Claude (vision)** | All current Claude models accept image inputs; use the strongest available model when image-reasoning quality matters. |

For **LLM-as-judge** ([[LLM-as-Judge for Visual Quality]]) pipelines: Opus 4 or Sonnet 4 for quality. For **autonomous generation loops** with many calls: Haiku 4 for cost.

## Compared to direct alternatives

| Alternative | When to prefer it |
|---|---|
| **OpenAI SDK (`openai`)** | If the project requires GPT-4 / GPT-5 / OpenAI-specific features. |
| **Google AI SDK (`@google/genai`)** | For Gemini integration. |
| **Mistral / Cohere / xAI SDKs** | Specific model needs. |
| **Vercel AI SDK** | Cross-provider abstraction; framework-aware (Next.js / Svelte / Solid). |
| **LangChain.js** | If the project benefits from LangChain's orchestration patterns; substantial overhead. |
| **LlamaIndex.ts** | RAG-heavy projects with document indexing. |
| **Direct HTTP calls** | If you're avoiding all dependencies and only need a single endpoint. |

Per CLAUDE.md, the wiki defaults to **Anthropic SDK** directly. Multi-provider abstractions (Vercel AI SDK, LangChain) add useful layers but trade some Anthropic-specific feature access; reach for them when cross-provider work is the requirement.

## Use-cases the Anthropic SDK excels at

- **LLM-as-judge pipelines** ([[LLM-as-Judge for Visual Quality]]): rate generated images on rubric criteria.
- **Iterative refinement loops** ([[Multimodal Evaluation Loops]]): generate → judge → refine.
- **Persona-based evaluation**: multiple Claude personas for cross-cultural / cross-expertise judging.
- **Concept-to-parameter translation**: brief in natural language → JSON parameters for generator ([[JSON Archetypes for Visual Tasks]]).
- **Vision-driven self-critique**: Claude *sees* the output and suggests improvements.
- **Brand-voice generation**: copy, taglines, art-direction notes.

## Use-cases the Anthropic SDK is wrong for

- **Real-time loops** (priority 4 visualizers at frame rate): LLM latency is 100ms+; not feasible in a 16ms frame budget. Use Claude offline / between performance sessions.
- **Pure-rendering pipelines** that don't need natural-language reasoning.
- **Heavy bulk processing on a budget**: batch API helps but for large volumes, smaller / cheaper models or specialized tools may be more cost-effective.

## Integration patterns for the wiki's stack

### Pattern 1: LLM-as-judge for generative output

```text
generate image (three.js / WebGPU)
  → send image + rubric to Claude (Sonnet 4 or Opus 4)
  → receive structured rating + critique
  → update generator parameters
  → iterate
```

This is the **canonical generation + evaluation loop**. See [[Multimodal Evaluation Loops]].

### Pattern 2: Concept-to-parameter pipeline

```text
brief (natural language) → Claude
  → structured output: JSON with generator parameters
  → run generator
```

The LLM does the **briefing translation**; the generator does the rendering. Clean separation.

### Pattern 3: Persona-based aesthetic evaluation

```text
generate output
  → send to N Claude personas (each with different system prompts: art critic, brand strategist, target demographic, etc.)
  → aggregate ratings
  → identify consensus + disagreement
```

This addresses the [[Neuroaesthetics and Individual Variation|individual-variation]] challenge: no universal beauty, but aggregated persona-views approximate the target audience.

## Caveats

- **API costs**: every call is metered. Tight loops can become expensive — budget accordingly or use Haiku for high-volume work.
- **Latency**: real-time use is not feasible. Most pipelines must be **offline or near-real-time** (>100ms per turn).
- **Reproducibility**: LLM outputs are stochastic even at temperature 0 (small variations). Acceptable for art; not for safety-critical applications.
- **Rate limits**: scale-up requires Anthropic-side approval.
- **Privacy**: API calls send data to Anthropic. For private-content work, review the [data privacy policy](https://www.anthropic.com/privacy).
- **Model drift**: model updates may change behavior. Pin models explicitly (`claude-sonnet-4-...`) when reproducibility matters.

## Connection to the wiki's framework

The Anthropic SDK is the **LLM substrate** for several wiki pages:

- [[Vectorizing Aesthetic Concepts]] — concept-vector generation.
- [[JSON Archetypes for Visual Tasks]] — structured-output prompts.
- [[Multimodal Evaluation Loops]] — generate-judge-refine loops.
- [[LLM-as-Judge for Visual Quality]] — Claude-as-critic.

The locked policy ([[Wiki Methodology]]) defers actual implementation code to **after** the tools sweep, so this page describes the SDK's role rather than providing example code.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[Vectorizing Aesthetic Concepts]] · [[JSON Archetypes for Visual Tasks]] · [[Multimodal Evaluation Loops]] · [[LLM-as-Judge for Visual Quality]] · [[Computational Creativity]] · [[Mind the Gap - VLM Spatial Reasoning]] · [[Tools Map]]

## Source

- Project home: https://docs.anthropic.com/
- TypeScript SDK: https://github.com/anthropics/anthropic-sdk-typescript
- Anthropic Cookbook: https://github.com/anthropics/anthropic-cookbook
- Claude model documentation: https://docs.anthropic.com/en/docs/about-claude/models
- API pricing: https://www.anthropic.com/pricing#api
