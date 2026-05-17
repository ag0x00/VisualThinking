---
title: "Anthropic - Structured Outputs (Claude API Documentation)"
type: source
source_type: standards-document
publisher: Anthropic
date_retrieved: 2026-05-16
url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
confidence: high
status: developing
tags: [source, llm-techniques, structured-output, claude-api, standards]
address: c-000038
created: 2026-05-16
---

# Anthropic — Structured Outputs (Claude API Documentation)

## Summary

Anthropic's official documentation for the **Structured Outputs** feature on Claude. Covers `output_config.format` for JSON-schema-constrained responses and `strict: true` for tool-input validation. Describes the constrained-decoding mechanism (grammar compilation + caching), supported and unsupported JSON Schema features, complexity limits, working examples in 8 languages (Python, TypeScript, C#, Go, Java, PHP, Ruby, plus CLI), and feature compatibility / incompatibility lists.

## What it contributes

- The **canonical specification** for how Claude's structured-output mechanism works.
- **Generally-available model list**: Claude Mythos Preview, Opus 4.7, Opus 4.6, Sonnet 4.6, Sonnet 4.5, Opus 4.5, Haiku 4.5 (as of fetch).
- The mechanism: **constrained-decoding grammar** compiled from the JSON Schema, cached for 24 hours from last use.
- **Working code examples** in Python (Pydantic), TypeScript (Zod), Java, Ruby, PHP, C#, Go, plus CLI / raw JSON.
- **Explicit complexity limits**:
  - 20 strict tools per request
  - 24 optional parameters total
  - 16 parameters with union types
  - 180-second compilation timeout
- The **`output_config.format` API shape** (replacing the older `output_format` from the beta).
- Compatibility notes: works with Batch processing, Streaming, Token counting, Strict tool use; **incompatible** with Citations and Message Prefilling.
- **Two failure modes** where output may still violate schema: refusals (`stop_reason: "refusal"`) and token-limit truncation (`stop_reason: "max_tokens"`).

## Key claims

- **high** Structured outputs guarantee schema-compliant responses through constrained decoding (not post-hoc validation).
- **high** The mechanism applies to both `output_config.format` (Claude's text response) and `strict: true` (tool inputs).
- **high** Native support is generally available across all current Claude 4.x models.
- **high** Both Anthropic SDKs (Python, TypeScript, Java, Ruby, PHP) automatically transform schemas to remove unsupported constraints (e.g., `minimum`, `maxLength`) and re-validate against the original constraints post-response.
- **high** Property ordering: required properties appear first (in schema order), then optional properties.
- **high** Refusals and token-limit truncation can produce non-conforming output.
- **high** Pattern (regex) support is limited; deeply nested schemas with many optionals hit complexity limits.
- **high** Compiled-grammar artifacts are cached up to 24 hours from last use; cache invalidates on schema changes (not on name/description changes alone).

## Confidence notes

**High confidence.** This is a primary, authoritative standards document — the canonical specification of Claude's structured-output feature, written by the vendor implementing it. Updated regularly as model versions ship.

The specific model list, API field names, and exact complexity limits may shift with future Claude model releases. Re-check the doc for production use. The *mechanism* (constrained decoding, grammar compilation, schema caching) is architecturally stable.

## Why we cite it

The primary source for [[JSON Archetypes for Visual Tasks]]. Cited from [[JSON Archetypes for Visual Tasks]] for the API shape, complexity limits, and failure modes; from [[LLM-as-Judge for Visual Quality]] for the structured-rubric output pattern; from [[Multimodal Evaluation Loops]] for the constrained-critique output; from [[Research - LLM Techniques]] for the synthesis.

## Related pages

[[JSON Archetypes for Visual Tasks]] · [[LLM-as-Judge for Visual Quality]] · [[Multimodal Evaluation Loops]] · [[Vectorizing Aesthetic Concepts]]
