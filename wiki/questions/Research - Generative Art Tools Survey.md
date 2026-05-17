---
address: c-000164
title: "Research — Generative Art Tools Survey (Option C Phase 2)"
type: synthesis
status: developing
tags: [synthesis, research, tools, methodology, option-c, phase-2]
created: 2026-05-17
updated: 2026-05-17
sweep: "3.5 — Discovery Methodology Fix, Phase 2"
related:
  - "[[Tools Map]]"
  - "[[AI Art Toolkit Map]]"
  - "[[Live Coding Tools Survey]]"
  - "[[PCG Toolkit]]"
  - "[[Postdigital Tools]]"
  - "[[Framings of Generative Art]]"
---

# Research — Generative Art Tools Survey (Option C Phase 2)

## Overview

Phase 2 of the Discovery Methodology Fix (`wiki/meta/Discovery Methodology Plan.md`). Where Phase 1 surveyed *framings* of generative art, Phase 2 surveys *tools* — applying the new discovery methodology (programmatic npm-search, awesome-list scans, primary-source verification) to close gaps left by the original 2026-05-17 tools sweep. Pairs Tools coverage with the 9 framings in [[Framings of Generative Art]].

## Methodology actually used

- **Round 1**: 8 parallel `registry.npmjs.org` searches across keywords `generative-art`, `creative-coding`, `livecoding`, `procedural-generation`, `webgpu`, `diffusion`, + 2 awesome-list reads.
- **Round 2**: 10 targeted gap-fill searches for specific known packages (Transformers.js, ml5, Magenta.js, Tone.js, Meyda, A-Frame, Tracery, WFC, procgen, glitch).
- **Deliberate scope-narrowing**: the 9 framings of [[Framings of Generative Art]] anchored which categories to evaluate; no purely tech-driven discovery.

This matches the Phase 2 plan in `wiki/meta/Discovery Methodology Plan.md`.

## Key findings

1. **Strudel is the major missed entrant.** 23 `@strudel/*` packages; @strudel/core at 2,775 weekly. Browser-native JS port of TidalCycles with `@strudel/hydra` integration. **Single largest finding of Phase 2** — Strudel reframes the priority-4 (music-reactive) recommendation. See [[Strudel]].
2. **Transformers.js at 1.12M weekly downloads is one of the largest libraries in any creative-coding category.** Was completely absent from the prior tools sweep. Reframes the [[AI Art and Latent Space]] framing toward client-side inference. See [[Transformers.js]].
3. **Tone.js (321K) and Meyda (13K) deserve standalone pages.** The prior sweep folded them into Web Audio. Tone.js's adoption is comparable to three.js; Meyda is the canonical real-time audio-feature-extraction library. See [[Tone.js]] · [[Meyda]].
4. **WebGPU has a maturity DX stack now.** `typegpu` + `wgsl_reflect` + `vite-plugin-glsl` + `shaders` together rewire the WebGPU DX from "C-API-in-JS" to "first-class TypeScript with shader hot-reload." Previously presented WebGPU as primitive; updated. See [[WGSL Tooling]].
5. **Magenta.js is deprecated.** No real updates since 2021-11. Wiki should note this; prior sweep treated it as current.
6. **PCG-on-npm is sparse.** Canonical PCG (Wave Function Collapse, ROT.js, classic L-systems) lives primarily on GitHub, not as well-maintained npm packages. Methodology finding: **PCG sweeps must look beyond npm** (GitHub topic search, Procjam catalogue, textbook bibliographies). See [[PCG Toolkit]].
7. **Postdigital tooling is mostly hand-coded techniques.** npm-search for `keywords:glitch` returns mostly text-glitch packages; the deep image-domain glitch / pixel-sort / datamosh work is typically done in fragment shaders. See [[Postdigital Tools]].
8. **A-Frame at 52K weekly is the WebXR standard.** Worth a standalone entry as immersive web art matures with Vision Pro / Quest browser. See [[A-Frame]].
9. **AI-art toolchain needs explicit hybrid pattern.** Browser-side ([[Transformers.js]]) + cloud-side ([[Cloud Inference APIs]]) + critic-loop ([[Anthropic TypeScript SDK]]) is the production pattern. See [[AI Art Toolkit Map]].
10. **Recommended priority-4 stack changes.** Old: "custom Web Audio + Three.js." New: **Strudel + Hydra in one HTML page** (live-coding paradigm) OR **Tone.js + three.js + Meyda** (imperative-JS paradigm). Live-coding is now the wiki's primary recommendation for priority 4. See [[Live Coding Tools Survey]].

## New pages created (this sweep)

**Standalone tool pages (8):**
- [[Strudel]] (c-000151) — major new entrant
- [[Transformers.js]] (c-000153) — AI-art primary
- [[TensorFlow.js]] (c-000154) — non-transformer / legacy ML
- [[ml5.js]] (c-000155) — Processing-school ML
- [[Tone.js]] (c-000156) — promoted from Web Audio folding
- [[Meyda]] (c-000157) — audio feature extraction
- [[A-Frame]] (c-000158) — WebXR
- [[WGSL Tooling]] (c-000159) — typegpu + wgsl_reflect + vite-plugin-glsl + shaders

**Survey / map pages (4):**
- [[Live Coding Tools Survey]] (c-000152) — covers 8 tools across live-coding tradition
- [[PCG Toolkit]] (c-000160) — WFC, Tracery, PRNGs, noise, ROT.js
- [[Cloud Inference APIs]] (c-000161) — Replicate, fal.ai, OpenAI, Anthropic vision, HF Inference Endpoints
- [[AI Art Toolkit Map]] (c-000162) — synthesis for the AI-art framing's toolchain
- [[Postdigital Tools]] (c-000163) — hybrid library-survey + technique-catalog

**Synthesis page** (this one, c-000164).

**Total new pages: 13.**

## Revisions to existing pages (planned)

The [[Tools Map]] (c-000132) needs an expansion to reflect Phase 2 findings. Specifically:

- Add AI-art row (Transformers.js, TensorFlow.js, ml5.js, cloud APIs)
- Add WGSL-tooling row (typegpu, vite-plugin-glsl, wgsl_reflect, shaders)
- Add Strudel + Meyda to recommended priority-4 stack
- Update priority-4 stack recommendation (Strudel + Hydra OR Tone + three + Meyda)
- Add WebXR row (A-Frame)
- Add PCG-toolkit row (per [[PCG Toolkit]])
- Add Postdigital row (per [[Postdigital Tools]])

This Tools Map v2 update happens in the same sweep.

## Coverage vs the 9 framings (catalog-stub cross-check)

Per the [[Wiki Methodology|catalog-stub cross-check convention]]:

| Framing | Tools coverage status |
|---|---|
| [[Galanter's Generative Art Framework|Galanter / complexity]] | ✅ Covered: [[p5.js]], [[three.js]], [[The Color Stack]], aesthetic measures |
| [[Computational Creativity|Boden]] | Partial — Boden's framework isn't a *tooling* tradition specifically; treated as theory |
| [[Artificial Life Art|Whitelaw / a-life]] | Partial — no standalone tool pages, but CA / reaction-diffusion serve via [[Cellular Automata and Reaction-Diffusion]] + [[WebGPU]] + custom shaders. Gap could be filled with a dedicated A-Life Tools page if user wants depth. |
| [[Practice-led Studio Research]] | ✅ Covered: [[p5.js]], [[q5.js]], Processing, [[paper.js]], [[three.js]] + ecosystems |
| [[Procedural Content Generation]] | ✅ Covered Phase 2: [[PCG Toolkit]] |
| [[Postdigital Aesthetics]] | ✅ Covered Phase 2: [[Postdigital Tools]] |
| [[Live Coding and Algorave]] | ✅ Covered Phase 2: [[Live Coding Tools Survey]], [[Strudel]], [[Hydra]] |
| [[AI Art and Latent Space]] | ✅ Covered Phase 2: [[AI Art Toolkit Map]], [[Transformers.js]], [[TensorFlow.js]], [[ml5.js]], [[Cloud Inference APIs]] |
| [[Long-form On-Chain Generative Art]] | Partial — covered indirectly via [[PCG Toolkit]] (seedable PRNGs) and existing tools; no fxhash / Art Blocks SDK pages because these are platforms, not libraries. Acceptable gap. |

## Open gaps

- **A-Life Tools standalone page** — Lenia, Boids, particle systems, reaction-diffusion shaders. Could be a Phase 2.5 sweep if user wants depth.
- **fxhash / Art Blocks platform SDKs** — these are deployment platforms, not libraries; arguably outside the [[Library Evaluation Rubric]] scope. Note in Tools Map.
- **WebGPU 3D engines beyond three.js / Babylon** — emerging (Wonderland, regl-3d). Defer until adoption matures.
- **Audio-driven AI** (Suno, Udio, MusicGen as APIs) — outside current scope.
- **3D / Video AI** (Meshy, Trellis, Veo, Sora) — emerging; defer.
- **Demoscene tooling** (size-coding contests, 4K intros) — niche but a real tradition. Defer.

## Methodology notes for Phase 4 lock-in

- **npm-search alone is insufficient** for PCG and postdigital categories. These need GitHub topic-search + practitioner-blog review.
- **Cross-keyword search is required**: any single keyword misses ecosystems with multiple natural tags (e.g., "live-coding" misses Tone.js because Tone uses "music" / "web-audio").
- **Deprecation flagging matters**: Magenta.js was treated as current in the prior sweep. Flag any package without a release in 18+ months.
- **Tool surveys benefit from framing-anchoring**: starting from the 9 framings gave clear scope and prevented endless tangential discovery.

These notes feed into Phase 4 methodology lock-in.

## Contradictions / surprises

- **Procgen is npm-thin** — the visibility/adoption signal in the field doesn't match npm download counts. Methodology adjustment needed.
- **Magenta.js position downgrade** — previously a wiki recommendation; now deprecated. Caught only because we did the npm last-publish check.
- **Strudel ecosystem completely missed** — high-volume, recent, framing-critical. The kind of finding that justifies systematic npm-search audits.

## Sources

- npm registry searches via `registry.npmjs.org/-/v1/search?text=...` (2026-05-17, ~18 distinct queries)
- Awesome-creative-coding (terkelg): https://github.com/terkelg/awesome-creative-coding
- Per-tool sources cited on individual pages

## Phase 3 hand-off

Next: Phase 3 — prior-sweep audit of Affect Foundations and L1 Cleanup canonicity claims (Berlyne, Russell circumplex, Helmholtz-Gibson-Bayesian, Ekman-Barrett). Conservative scope per locked decision.
