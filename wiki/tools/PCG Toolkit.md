---
address: c-000160
title: PCG Toolkit
type: tool
status: developing
tags: [tools, procgen, pcg, l-system, noise, prng, wfc, tracery]
created: 2026-05-17
updated: 2026-05-17
verdict: first-class-as-survey
---

# PCG Toolkit

**One-line purpose:** Survey of the **JS / TS tools for procedural content generation** — Wave Function Collapse, Tracery (grammars), seedable PRNGs, simplex/perlin noise, L-system implementations. Anchored on the [[Procedural Content Generation]] framing.

> [!important] Phase 2 discovery (2026-05-17)
> The PCG ecosystem on npm is **substantially less mature than three.js or audio**. The canonical implementations (`mxgmn/WaveFunctionCollapse`, the Lindenmayer / shape-grammar literature, `ROT.js`) live primarily on **GitHub**, not as actively-maintained npm packages. npm-search for `keywords:wave-function-collapse` returns only minor / niche packages. npm-search for `keywords:procedural-generation` returns only ~10 packages with >50 weekly downloads. **Discovery for PCG must go beyond npm-search to GitHub repository discovery and game-development resources.** This is itself a finding worth memorializing.

## Why this matters for the wiki

[[Procedural Content Generation]] is one of nine framings in [[Framings of Generative Art]]. The [[Library Evaluation Rubric]] should evaluate PCG tools by:

1. Determinism from seed (essential for long-form / reproducible art)
2. Output controllability / expressive range
3. Runtime cost (Wave Function Collapse can be slow; constraint-solvers slower)
4. Browser-friendliness (some classic PCG is Python/C++)

The PCG framing's algorithms transfer cleanly to art applications even when the source is game-dev. The Shaker/Togelius/Nelson textbook ([[Procedural Content Generation]]) explicitly cites art generation as a parallel application.

## The categories

### 1. Wave Function Collapse (WFC)

**Canonical implementation:** [mxgmn/WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) — Maxim Gumin's C# original from 2016. Influential but not directly usable in JS.

**JS ports / variants (npm sparse):**
- `@zakkster/lite-wfc` (npm, ~3 weekly) — "Zero-GC Wave Function Collapse. 32-bit bitmask domains, popcount LUT, flat propagation queue." Recent, optimized for performance.
- `dungeon-cartographer` (~20 weekly) — broader procgen lib that includes WFC
- Several niche GitHub projects (search for "wfc" + "javascript")

**Status:** WFC has fewer mature JS implementations than its visibility would suggest. For serious WFC work in 2026, recommended path: port Gumin's C# directly (it's a small, clean algorithm) or use one of the niche libraries above.

WFC works well for:
- **Tile-based art** — generate larger images from small tile-set examples
- **Pixel-art** — preserves local consistency
- **Vector pattern generation** — when adapted with vector tiles
- **Deterministic from seed** — fits [[Long-form On-Chain Generative Art|long-form on-chain]] requirements

### 2. Grammar-based generation (Tracery + L-systems)

**Tracery:** Kate Compton's text-grammar library — `tracery-grammar` (~722 weekly downloads, v2.8.4, last published 2024-11-18). The canonical generative-text tool; used by NaNoGenMo, Twitter bots (RIP), text-art projects.

Variants:
- `tracery` (v1.0.3, ~6052 monthly but not updated since 2015) — older
- `bracery` (~470 monthly) — compatible derivative
- `clerestory` (~255 monthly) — context-free grammar inspired by Tracery
- `brogue` (~98 monthly) — Tracery-based with extensions

**L-systems:** No single dominant JS package. Shiffman's *Nature of Code* shows hand-coded L-systems; production code typically rolls its own. See [[L-Systems and Grammars]] for the theory.

### 3. Seedable PRNGs (deterministic random)

Essential for any [[Long-form On-Chain Generative Art|deterministic / long-form work]]. Standard choices:

- `seedrandom` — Mature, ~1M+ weekly downloads, the de-facto choice
- `alea` — Mulberry32-based, very small
- `mulberry32` (inline implementation) — 7-line copy-paste PRNG, recommended for on-chain where dependency size matters

Pattern: never use `Math.random()` for art — it's non-seedable. Always use a seedable PRNG. Even for offline art, this makes the work reproducible.

### 4. Noise functions (Perlin / Simplex / Worley)

- `simplex-noise` — ~5M+ weekly downloads, the dominant choice. Fast, seedable.
- `open-simplex-noise` (~62K weekly, last published 2021) — OpenSimplex variant; slower-moving
- `fractal-noise` (~70 weekly, niche) — fractal-noise composition wrapper
- Manual Perlin (Ken Perlin's reference implementation is short; many sketches inline it)

Noise functions are the *most-used* PCG primitive in generative art. They're so foundational they show up in [[p5.js]], [[three.js]] examples, and most creative-coding tutorials.

### 5. Roguelike toolkits

**ROT.js** (https://ondras.github.io/rot.js/) — the canonical roguelike toolkit. JS-native, mature (12+ years), includes dungeon generators, FOV (field-of-view), pathfinding, RNG. Not very active on npm but actively used in roguelike game-dev. Borrow its dungeon-generation algorithms for art purposes.

### 6. Cellular automata

No dominant CA library — practitioners typically hand-code Game of Life / Wolfram / Lenia / reaction-diffusion in [[p5.js]] or [[three.js]] shaders. See [[Cellular Automata and Reaction-Diffusion]] for the theory; implementations are typically <100 lines.

## Recommended stack

For PCG in JS art work, install:

```
simplex-noise   # noise functions (essential)
seedrandom      # seedable PRNG (essential for reproducible work)
tracery-grammar # if doing generative text / labels / titles
```

Add WFC implementation only when needed (and consider hand-rolling for full control). Other PCG primitives (L-systems, cellular automata, basic dungeon generation) are typically <100 lines hand-coded.

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | **High** — noise + PRNG are universal | Noise + PRNG are in 90%+ of generative-art sketches |
| 2. Branding | Medium — Tracery for name-generation; grammar-based identity systems | |
| 3. Graphic design | Medium — pattern generation via L-systems, WFC for tile-based patterns | |
| 4. Music-reactive | Low — runtime constraints favor procedural over PCG | |

## Discovery methodology note

The Phase 2 sweep revealed an important methodology finding: **PCG is the framing where pure npm-search audit misses the most**. The canonical algorithms live in:

- Game-development tutorials (Procjam, RogueBasin, gamedev.net)
- Conference papers (FDG, AIIDE, IEEE Conference on Computational Intelligence and Games)
- Academic textbooks ([[Procedural Content Generation|Shaker / Togelius / Nelson 2016]])
- GitHub gists / single-file projects

Future PCG-sweeps should include: GitHub topic search (e.g., `topic:procedural-generation language:javascript`), Procjam catalogue, and academic-textbook bibliographies.

## Verdict

**First-class as a survey-and-pointers page.** Individual pages for Tracery, Simplex Noise, etc. are not needed — these are tiny utility libraries. The right move is this consolidated survey + cross-references to [[Procedural Content Generation]] for theory.

## Related

- [[Procedural Content Generation]] — theoretical framing
- [[L-Systems and Grammars]] · [[Cellular Automata and Reaction-Diffusion]] — specific algorithm pages
- [[Long-form On-Chain Generative Art]] — primary consumer of seedable PRNGs
- [[Creative Coding Utilities]] — overlap on noise / GUI / animation helpers
- [[Tools Map]]

## Sources

- npm registry searches, 2026-05-17 (keywords: procedural-generation, wave-function-collapse, procgen, tracery)
- mxgmn WaveFunctionCollapse: https://github.com/mxgmn/WaveFunctionCollapse
- Tracery (Compton): https://github.com/galaxykate/tracery
- ROT.js: https://ondras.github.io/rot.js/
- Shaker / Togelius / Nelson, PCG textbook: https://www.pcgbook.com/
