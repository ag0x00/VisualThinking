---
address: c-000152
title: Live Coding Tools Survey
type: tool
status: developing
tags: [tools, live-coding, survey, dsl, audio, visual]
created: 2026-05-17
updated: 2026-05-17
verdict: first-class-as-survey
---

# Live Coding Tools Survey

**One-line purpose:** Survey of the **live-coding software ecosystem** — TidalCycles, Strudel, Sonic Pi, SuperCollider, Hydra, Gibber, Orca, Improviz — and how they map to the wiki's priority 4 (music-reactive visualizers). Anchored on the [[Live Coding and Algorave]] framing.

> [!important] Phase 2 discovery (2026-05-17)
> The Phase 1 [[Live Coding and Algorave]] framing identified live-coding as the strongest match for priority 4 but only [[Hydra]] had a dedicated tool page. This survey closes the gap, with [[Strudel]] (the major new entrant) getting its own page given its 23-package ecosystem.

## The eight tools

### Strudel — see [[Strudel]] for dedicated evaluation

Browser-native JS port of TidalCycles. **The strongest priority-4 match in the 2026 ecosystem.** 23 npm packages. Zero install. Live-coding paradigm with `@strudel/hydra` integration. **First-class.**

### Hydra — see [[Hydra]] for dedicated evaluation

Browser-based live-coded video synthesis. Olivia Jack's tool. The visual half of the live-coding pipeline. **First-class.**

### TidalCycles

URL: https://tidalcycles.org/

Haskell-embedded pattern combinator language. The **theoretical anchor** of pattern-based live-coding (Alex McLean's 2004 work). Requires Haskell + SuperCollider installation; not browser-based. Substantial learning curve.

For users committed to JS-first deployment: use [[Strudel]] instead (same semantics, no Haskell).

**Verdict:** referenced theoretically; not recommended for new JS-first projects.

### Sonic Pi

URL: https://sonic-pi.net/

Ruby-based live-coding environment. Sam Aaron's tool. Heavy adoption in UK schools (CS curriculum). Strong pedagogy. Installed application; not browser-native. Excellent for teaching but not a fit for browser-deployed art.

**Verdict:** strong for education / standalone-app contexts; not the right primary tool for browser-deployed work.

### SuperCollider

URL: https://supercollider.github.io/

Older (1996+), more mature than TidalCycles or Sonic Pi. Server/client architecture; the audio engine many live-coding systems use (including TidalCycles). Installed application, command-line capable.

**Verdict:** the substrate many live-coding traditions sit on; learn it if going deep into the field; not directly relevant to JS-first generative art.

### Gibber

URL: https://gibber.cc/

Charlie Roberts's browser-based live-coding for both audio and visuals. Older than Hydra; substantial influence on the field. Active but smaller community than Strudel/Hydra.

**Verdict:** historically significant; for new projects prefer Strudel + Hydra.

### Orca

URL: https://github.com/hundredrabbits/Orca

A **2D esoteric programming language** designed for sequencing audio/MIDI. The grid-based interface produces dense visual code. Niche but cultishly loved. Generates MIDI/OSC; pair with any audio engine.

**Verdict:** niche but worth knowing; visually striking; consider if making installation-art or wanting an unusual aesthetic vocabulary.

### Improviz

URL: https://improviz.org/

Visual live-coding cousin to Hydra. Compiled binary (Haskell). Real-time graphics from terse text programs. Less browser-friendly than Hydra.

**Verdict:** alternative to Hydra; prefer Hydra for browser deployment.

## Comparison table

| Tool | Audio? | Visual? | Browser? | DSL ergonomics (1-5) | Priority 4 fit |
|---|---|---|---|---|---|
| **Strudel** | ✅ | ✅ (via @strudel/draw + @strudel/hydra) | ✅ Native | 5 — small, compositional | ★ Highest |
| **Hydra** | (consumes audio) | ✅ | ✅ Native | 5 — tiny shader vocabulary | ★ Highest (visual partner) |
| TidalCycles | ✅ | ❌ (use Hydra separately) | ❌ | 5 (Haskell-embedded) | Medium (use Strudel instead) |
| Sonic Pi | ✅ | ❌ | ❌ | 5 — pedagogical | Low (not browser) |
| SuperCollider | ✅ | ❌ | ❌ | 4 — older syntax | Low (substrate, not direct tool) |
| Gibber | ✅ | ✅ | ✅ | 4 | Medium — prefer Strudel+Hydra |
| Orca | (MIDI/OSC out) | (visual UI but not output) | ✅ (single-page app) | 3 — esoteric grid | Niche |
| Improviz | ❌ | ✅ | ❌ | 4 | Low (prefer Hydra) |

## Recommended priority-4 stack (2026)

**Locked recommendation:** **[[Strudel]] + [[Hydra]] in one HTML page** for music-reactive visualizers under the live-coding paradigm. Optional [[three.js]] layer for 3D backdrops; [[Meyda]] if Strudel's built-in audio features aren't enough.

This supersedes the previous priority-4 recommendation ("custom Web Audio + Three.js"). The new stack:

- Respects the [[Phenomenal Causality|70ms causality threshold]] by construction
- Has small DSL surfaces both an LLM and a human can hold in mind
- Browser-native zero-install
- Aligns with the [[Live Coding and Algorave|TOPLAP tradition]] which is the priority-4 framing

Imperative-JS alternative: **[[Tone.js]] + [[three.js]] + [[Meyda]]** for software-engineering-style music-reactive apps. Use this when the live-coding paradigm doesn't fit (e.g., conventional music-app product work).

## LLM-codegen friendliness ranking

1. **Strudel** — high. Small DSL, well-documented, pattern-strings are short
2. **Hydra** — high. Tiny shader-composition vocabulary; programs fit in one tweet
3. **Tone.js** (imperative alternative) — high. Well-represented in training corpora
4. Sonic Pi / TidalCycles — Ruby / Haskell idioms; less LLM-fluent than the JS options
5. Orca — esoteric; LLM struggles with the 2D grid syntax

## Discovery methodology note

The npm search `keywords:livecoding` returned the **23-package Strudel ecosystem** but missed Hydra (under `keywords:visualization` / standalone install), Tone.js (different keyword), and the standalone applications (Sonic Pi, SuperCollider) which aren't npm-distributed. **Cross-keyword search + standalone-tool awareness is required** for ecosystem-level live-coding surveys.

## Verdict

**Survey page, first-class as a category.** Individual tool pages exist for [[Strudel]] and [[Hydra]] (the JS-native options); TidalCycles, Sonic Pi, SuperCollider, Gibber, Orca, Improviz are pointed-to but don't warrant standalone pages because they're outside the JS-first scope.

## Related

- [[Live Coding and Algorave]] — theoretical framing
- [[Strudel]] · [[Hydra]] — JS-native primary tools
- [[Tone.js]] · [[Meyda]] · [[Web Audio API and AudioWorklet]] — imperative-JS alternative stack
- [[Tools Map]]

## Sources

- npm registry, 2026-05-17 (Strudel ecosystem verified)
- TOPLAP / live-coding tradition: see [[Live Coding and Algorave]]
- Hydra: https://hydra.ojack.xyz/
- TidalCycles: https://tidalcycles.org/
- Sonic Pi: https://sonic-pi.net/
- SuperCollider: https://supercollider.github.io/
- Gibber: https://gibber.cc/
- Orca: https://github.com/hundredrabbits/Orca
- Improviz: https://improviz.org/
