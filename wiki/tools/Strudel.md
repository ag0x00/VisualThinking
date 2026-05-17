---
address: c-000151
title: Strudel
type: tool
status: developing
tags: [tools, live-coding, audio, music, pattern, dsl]
created: 2026-05-17
updated: 2026-05-17
verdict: first-class
ecosystem_size: 23 packages
---

# Strudel

**One-line purpose:** Browser-native port of [TidalCycles](https://tidalcycles.org/) — a pattern-DSL for live-coded music, with optional visual integration via [[Hydra]] and a `@strudel/draw` module for direct visual output. Strudel is the most-developed live-coding tool in the JavaScript ecosystem and the most direct technical match for the wiki's priority 4 (music-reactive visualizers).

> [!important] Phase 2 discovery (2026-05-17)
> Strudel was missed in the prior tools sweep. As of 2026-05, the `@strudel/*` scope publishes **23 packages**, with `@strudel/core` at ~2,775 weekly downloads, `@strudel/mini` at 2,643, `@strudel/tonal` at 2,519, `@strudel/transpiler` at 2,227, `@strudel/webaudio` at 1,524, `@strudel/draw` at 1,506. Active development (most packages published 2026-01). This is the **single largest new finding** of the Phase 2 sweep.

## Why this matters for the wiki

Strudel is the JavaScript implementation of [TidalCycles](https://tidalcycles.org/)'s pattern combinator language. TidalCycles itself is Haskell-embedded — beautiful but inaccessible to JS-first developers. Strudel preserves TidalCycles's pattern semantics in JS, runs in the browser without installation, and exposes hooks to both Web Audio (sound) and Hydra (visual). This **closes the live-coding pipeline natively in the browser** for the first time, which is exactly the constraint of priority 4 (music-reactive visuals shipped as web apps).

Quoting [[Live Coding and Algorave|the live-coding framing page]]: this priority is *the* match for the TOPLAP tradition. Strudel makes the framing tractable in JS/TS without leaving the browser.

## What it does

A Strudel program is a single expression that composes patterns:

```javascript
// Sound + visual driven by the same pattern (illustrative — actual API differs slightly)
stack(
  s("bd*4, ~ sd ~ sd").gain(.8),
  note("c3 e3 g3 b3").s("piano").slow(2)
).hush(2)
```

Pattern primitives (`s`, `note`, `n`, `stack`, `cat`, `seq`, `slow`, `fast`, `every`, `sometimes`, `degradeBy`, `striate`) compose into rich rhythmic and tonal structures. The `@strudel/mini` parser implements TidalCycles's mini-notation (`"bd*4 [~ sd]"` etc.) directly. The `@strudel/transpiler` lets you write Strudel as plain JS source and compiles it to a live-loop-friendly evaluatable form.

## Strudel ↔ Hydra integration

`@strudel/hydra` (321 weekly) provides the bridge: pattern events from Strudel drive Hydra visual parameters. The same `every` / `slow` / `cps` (cycles-per-second) primitives that govern audio also modulate visual oscillators. This produces **causally-linked audio-and-visual** in a way that's exceptionally hard to do with separate Web Audio + Three.js pipelines.

Per the [[Phenomenal Causality|70ms causality threshold]] (Arnheim sweep finding via Michotte 1946): browser audio-event → render-frame latency must be <70ms for perceived causation. Strudel + Hydra running in the same browser context routinely hits this; setTimeout-driven JS pipelines do not.

## Install footprint

- Browser-embed via `<script type="module">` import from a CDN (esm.sh, jsdelivr); zero install.
- Or `npm install @strudel/web` for a single-bundle browser-ready entry.
- `@strudel/repl` exposes the live editor as a Web Component you can embed in any page.

The browser-first design is uniquely well-suited to the user's deployment model.

## LLM-codegen friendliness

**High.** Strudel's vocabulary is small (~50 primitive functions), highly compositional, and well-documented. Pattern strings are short and human-readable. A capable LLM can generate, modify, and verify Strudel programs reliably. Compared to writing custom Three.js + Web Audio plumbing, Strudel's high-level primitives let an LLM stay at the *musical intention* layer rather than the *signal-routing* layer.

The DSL design is intentionally minimal-and-orthogonal — a hallmark of [[Live Coding and Algorave|TOPLAP-tradition]] thinking. This is exactly the kind of small-surface-area DSL the [[Library Evaluation Rubric]] LLM-friendliness criterion rewards.

## Maintenance

- Last meaningful release: 2026-01 across most `@strudel/*` packages
- Active GitHub organization: [tidalcycles/strudel](https://github.com/tidalcycles/strudel)
- Continuous documentation site: https://strudel.cc/
- Run-anywhere REPL: https://strudel.cc/

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | Medium | Audio-driven generative; if rendering visuals, do it through @strudel/draw or @strudel/hydra |
| 2. Branding | Low | Performance/improvisational tradition, not identity-system fit |
| 3. Graphic design | Low | Time-based art; doesn't translate to static deliverables |
| 4. **Music-reactive visualizers** | **★ Highest** | This is the wiki's strongest single recommendation for priority 4. Strudel + Hydra in one browser page implements the entire music-reactive-visualizer pipeline with sub-frame latency. |

## What Strudel doesn't do

- **Not a standalone DAW** — for production music, use Strudel-output via OSC/MIDI to a DAW.
- **Not the right tool for static / offline-rendered art** — purely time-based.
- **No native 3D scene** — `@strudel/draw` is 2D; `@strudel/hydra` brings GPU shader-rendered visuals but stays in shader-rather-than-scene mode.
- **Pre-existing TidalCycles knowledge helps** — the docs are good, but the pattern-combinator mindset has a learning curve.

## Verdict

**First-class.** Add to the recommended priority-4 stack:

> **For music-reactive visualizers in 2026: Strudel + Hydra in one HTML page.** Plus an optional [[three.js|three.js scene]] layered via canvas-source for 3D backdrops.

Wins over the previous priority-4 recommendation (custom Web Audio + Three.js) on three axes:
1. **Causality discipline** — Strudel's cycles model makes audio↔visual sync correct-by-construction.
2. **LLM-codegen** — small DSL is easier for an LLM-as-artist to generate than imperative Web Audio + render-loop code.
3. **Browser-first** — zero install, can be a static HTML page, can be embedded in any web property.

The [[Tools Map]] now positions Strudel + [[Hydra]] as the canonical priority-4 stack.

## Related

- [[Live Coding and Algorave]] — the theoretical framing
- [[Hydra]] — visual partner; `@strudel/hydra` integrates them
- [[Web Audio API and AudioWorklet]] — Strudel sits on this substrate
- [[Phenomenal Causality]] — the 70ms threshold Strudel respects
- [[Tools Map]] · [[Live Coding Tools Survey]]

## Sources

- npm registry, 2026-05-17 (23-package ecosystem confirmed)
- Strudel docs site: https://strudel.cc/
- GitHub: https://github.com/tidalcycles/strudel
- Algorave / TOPLAP context: see [[Live Coding and Algorave]]
