---
title: JSON Archetypes for Visual Tasks
type: concept
aliases: [structured output for visual tasks, JSON schema for art, schema-first prompting]
tags: [concept, llm-techniques, prompt-engineering, structured-output]
status: developing
address: c-000034
created: 2026-05-16
updated: 2026-05-16
---

# JSON Archetypes for Visual Tasks

> **Schema-first prompting** for layouts, palettes, compositional plans, and aesthetic evaluations. Define a JSON schema describing the structure you want; constrain the LLM to output exactly that structure. The seed proposes this technique by example: "Prompting with JSON Archetypes: Force the LLM to output layouts, color palettes, and hierarchies as strict JSON trees" (Source: [[Wiki Seed]]).

This is the **operational layer** of [[Vectorizing Aesthetic Concepts]]: vectorization gives you the vocabulary; JSON archetypes give you the *output format* in which the LLM commits to specific values.

## Why structured output

Without schema constraints, an LLM asked for "a color palette" might return:

- Prose: "I'd suggest a deep navy, complemented by a warm gold and a creamy off-white..."
- A bullet list of color names
- A code fence with hex codes (sometimes valid, sometimes not)
- A markdown table (different format each time)

Downstream consumers — image generators, design tools, evaluation loops — can't reliably parse this. The Anthropic Structured Outputs documentation lists the failure modes precisely: parsing errors from invalid JSON, missing required fields, inconsistent data types, schema violations requiring error handling and retries (Source: [[Anthropic - Structured Outputs]]).

With a JSON schema constraint:

```python
{
  "palette": [
    {"role": "primary",    "oklch": "0.45 0.15 250", "hex": "#1A3A6B"},
    {"role": "accent",     "oklch": "0.75 0.18 80",  "hex": "#E0AA3F"},
    {"role": "background", "oklch": "0.97 0.01 100", "hex": "#F8F5EE"}
  ],
  "harmony_type": "split-complementary",
  "wcag_pairs": [
    {"foreground": "primary", "background": "background", "ratio": 6.8, "passes_aa": true}
  ]
}
```

Now the output is parseable, validated, and acted on without ceremony.

## Modern support (2024–2026)

Both major LLM APIs have **native** structured output as of mid-2024 onward:

- **Anthropic Claude** — `output_config.format` with `type: "json_schema"`; uses constrained-decoding grammar compilation. Generally available on Claude Mythos Preview, Opus 4.7, Opus 4.6, Sonnet 4.6, Sonnet 4.5, Opus 4.5, Haiku 4.5 (Source: [[Anthropic - Structured Outputs]]).
- **OpenAI** — Function calling / Structured Outputs with JSON Schema; same constrained-decoding mechanism.

Both compile the schema into a grammar at first use, cache it for ~24 hours, and reject outputs that violate it at the decode level — not at post-processing. **Result: schema compliance is guaranteed**, not best-effort.

Practical limits to know:

| Limit | Anthropic (typical) |
|---|---|
| Strict tools per request | 20 |
| Optional parameters total | 24 |
| Parameters with union types (`anyOf`) | 16 |
| Compilation timeout | 180 s |

Tips for staying inside the limits: mark only critical fields as required, avoid deep nesting, prefer simple types over unions (Source: [[Anthropic - Structured Outputs]]).

## Archetypes for visual tasks

The most useful schema patterns for this vault's purposes:

### Palette archetype

```json
{
  "type": "object",
  "properties": {
    "harmony_type": {
      "type": "string",
      "enum": ["complementary", "split-complementary", "analogous", "triadic",
               "tetradic", "monochromatic"]
    },
    "base_hue_oklch": {"type": "number"},
    "colors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {"type": "string", "enum": ["primary", "secondary", "accent",
                                              "background", "surface", "neutral"]},
          "oklch_L": {"type": "number"},
          "oklch_C": {"type": "number"},
          "oklch_h": {"type": "number"},
          "hex": {"type": "string"}
        },
        "required": ["role", "oklch_L", "oklch_C", "oklch_h"]
      }
    }
  },
  "required": ["harmony_type", "colors"]
}
```

Why this shape: it forces commitment to a [[Color Harmony]] scheme up front, gives each color a *role* (primary/accent/background — the design-system layer), and uses [[OKLCH]] coordinates for perceptual reasoning.

### Layout archetype

```json
{
  "type": "object",
  "properties": {
    "canvas": {"type": "object",
               "properties": {"width": {"type": "number"}, "height": {"type": "number"}},
               "required": ["width", "height"]},
    "grid": {"type": "string",
             "enum": ["rule-of-thirds", "golden-section", "dynamic-symmetry",
                      "diagonal", "centered"]},
    "focal_points": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "x": {"type": "number"},
          "y": {"type": "number"},
          "weight": {"type": "number"},
          "purpose": {"type": "string"}
        },
        "required": ["x", "y", "weight"]
      }
    }
  },
  "required": ["canvas", "grid", "focal_points"]
}
```

### Evaluation archetype (LLM-as-judge output)

```json
{
  "type": "object",
  "properties": {
    "scores": {
      "type": "object",
      "properties": {
        "composition":      {"type": "number", "minimum": 0, "maximum": 10},
        "color_harmony":    {"type": "number", "minimum": 0, "maximum": 10},
        "tonal_balance":    {"type": "number", "minimum": 0, "maximum": 10},
        "visual_engagement":{"type": "number", "minimum": 0, "maximum": 10}
      },
      "required": ["composition", "color_harmony", "tonal_balance", "visual_engagement"]
    },
    "comments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "category": {"type": "string"},
          "comment":  {"type": "string"},
          "bbox":     {"type": "array", "items": {"type": "number"}, "minItems": 4, "maxItems": 4}
        },
        "required": ["category", "comment"]
      }
    }
  },
  "required": ["scores", "comments"]
}
```

The bounding-box field (`bbox`) is critical for [[Multimodal Evaluation Loops]]: ties each critique comment to a specific region. Duan et al. (2024) showed iterative refinement of these bounding boxes is what reduced the gap to human design-critique performance by 50% (Source: [[Visual Prompting Iterative Refinement]]).

## Caveats from the structured-outputs docs

The Anthropic docs flag two scenarios where the output may still not match the schema (Source: [[Anthropic - Structured Outputs]]):

1. **Refusals** (`stop_reason: "refusal"`) — safety/helpfulness overrides schema constraints.
2. **Token-limit truncation** (`stop_reason: "max_tokens"`) — partial output. Retry with higher `max_tokens`.

Property ordering caveat: required properties appear first (in schema order), then optional. If field order matters for downstream consumers, mark all fields required.

Pattern (regex) support is limited; deeply nested schemas with many optionals hit the complexity limit. **Keep schemas flat and small.**

## Why it matters for this vault

JSON archetypes turn the wiki's foundation pages into *executable specifications*. The [[Compositional Grids]] taxonomy isn't just documentation — it's the enum for the `grid` field in the Layout archetype. The [[Color Harmony]] schemes are the enum for `harmony_type`. The [[WCAG Contrast Ratios]] thresholds are the constraint on `ratio`. The wiki *feeds* the schemas; the schemas *constrain* the LLM.

For an LLM-driven art generator/critic in 2026, the canonical recipe is:

1. **User input** (text or image)
2. **System prompt** with vectorized aesthetic vocabulary (see [[Vectorizing Aesthetic Concepts]])
3. **JSON schema** in `output_config.format` shaping the response
4. **CV-extracted features** as context (centroid, histogram, $D$, ΔE pairs) — not raw image
5. **Constrained-decoding output** — guaranteed-valid JSON per the schema
6. **Downstream consumer** (image generator, design tool, eval loop) parses and acts

## Related

[[Vectorizing Aesthetic Concepts]] · [[Multimodal Evaluation Loops]] · [[LLM-as-Judge for Visual Quality]] · [[Compositional Grids]] · [[Color Harmony]] · [[OKLCH]] · [[Anthropic - Structured Outputs]] · [[Visual Prompting Iterative Refinement]]
