---
address: c-000142
title: Procedural Content Generation
type: concept
status: developing
tags: [concepts, generative-art, games, pcg, framings]
created: 2026-05-17
updated: 2026-05-17
---

# Procedural Content Generation

A framing within [[Framings of Generative Art|generative art]] in which algorithmic generation serves *playable content* — levels, terrain, items, quests, narratives, textures, weapons, dungeons. The canonical reference is Shaker, Togelius, and Nelson's textbook *Procedural Content Generation in Games* (Springer, 2016), the first textbook in the field and the first book-length overview of PCG research.¹

> [!note] This is one of nine framings in [[Framings of Generative Art]]
> PCG is sister-disciplinary to generative art but not identical. The Shaker/Togelius/Nelson textbook explicitly cites Galanter's framing of generative art and positions PCG as its *functional* counterpart — both use algorithmic generation, but PCG's evaluation criterion is *playability* and *controllability* rather than aesthetic value.

## Essence

In PCG, the system must produce content that *plays well* — levels that are completable but challenging, dungeons that are navigable, terrain that supports gameplay constraints (resources within reach, paths between points), narratives that branch coherently. The artistic concerns of generative art are sometimes relevant but rarely primary; the dominant constraints are **functional**.

This framing matters for the wiki because:
1. PCG has the most rigorous evaluation methodology of any generative-art-adjacent field (controllability, expressivity, generative spaces, designer-centric AI).
2. Many of the *algorithms* (Wave Function Collapse, search-based PCG, graph grammars, constraint solvers, PCG-via-ML) transfer directly to art generation.
3. Game-dev case studies (*Spelunky*, *Minecraft*, *No Man's Sky*, *Dwarf Fortress*) are the largest-scale generative-art-adjacent works ever made.

## Key practitioners and case studies

- **Noor Shaker, Julian Togelius, Mark J. Nelson** — *Procedural Content Generation in Games* (Springer 2016).¹ Free online at https://www.pcgbook.com/
- **Kate Compton** — *expressive range analysis*, ChromeQuest, Tracery (grammar-based PCG).
- **Maxis Karth & Adam M. Smith** — *WaveFunctionCollapse* and constraint-based PCG.
- **Derek Yu** — *Spelunky* (procedural levels with hand-crafted "room templates").
- **Sean Murray / Hello Games** — *No Man's Sky* (procedurally-generated universe).
- **Tarn Adams** — *Dwarf Fortress* (procedurally-generated history, worlds, characters).
- **Markus Persson / Mojang** — *Minecraft* (procedural terrain via Perlin noise and biome systems).

## What it foregrounds that other framings don't

- **Controllability.** The system must be parameterizable in ways the designer can use — "make this level harder", "this region must have water access."
- **Expressivity / generative space.** Compton's *expressive range* analyzes the actual distribution of outputs a generator produces — not just whether any individual output is good, but whether the output *space* is rich.
- **Designer-centric AI** (Liapis et al.). PCG often is used as a *tool for designers*, not as autonomous generation.
- **Runtime constraints.** Many PCG systems must generate at runtime in milliseconds — vastly tighter than offline generative-art workflows.
- **Functional evaluation.** Playable / completable / fun / fair. Aesthetic concerns are secondary or absent.

## What it contests

- **Galanter:** PCG explicitly distinguishes itself from generative *art* — the system serves play, not aesthetic value. Galanter's effective-complexity has no obvious analog for "completable level."
- **A-life:** A-life centers emergence as the artwork. PCG often *suppresses* emergence in favor of designer control.
- **Practice-led:** PCG is engineering-led; the practitioner is typically a designer working alongside engineers, not an artist tuning by taste.

## Computable handles

The PCG textbook surveys multiple algorithm families, each with a chapter:

- **Search-based PCG.** Evolutionary algorithms on content spaces.
- **Constraint-based PCG.** SAT / ASP solvers; Wave Function Collapse (Gumin 2016).
- **Grammar-based PCG.** L-systems, shape grammars, Tracery (Compton). See [[L-Systems and Grammars]].
- **Fractal / noise-based PCG.** Perlin / Simplex noise, fractal terrain (Mandelbrot lineage). The *Minecraft* approach.
- **Cellular automata.** Cave generation, terrain. See [[Cellular Automata and Reaction-Diffusion]].
- **Machine-learning PCG.** GANs, transformers, RL for level generation (PCG-via-ML or PCGML).
- **Mixed-initiative tools.** Sentient Sketchbook, Ropossum — human-AI design collaboration.

## Fit with the four user priorities

- **1. Generative art (medium).** Many PCG algorithms transfer directly (WFC, grammars, Perlin). PCG case studies offer scale and engineering lessons.
- **2. Branding (low).** PCG does not naturally map to identity work.
- **3. Graphic design (low).** PCG is for interactive game content, not static deliverables.
- **4. Music-reactive (low).** PCG is rarely real-time-audio-reactive; the closest analog is procedural texture / terrain synthesis driven by audio features.

## Programmability handle

For LLM-art systems borrowing from PCG:
- **Use expressive-range analysis (Compton).** Don't just judge individual outputs; analyze the distribution of outputs the generator makes. Crucial when the user wants long-form (Hobbs) or large collections (branding).
- **Wave Function Collapse is the highest-leverage transfer.** WFC turns example images into rule-systems that generate larger images preserving local consistency. Used for tile-based art, pixel-art, vector-art. Very small implementation footprint, deterministic-from-seed (fits on-chain long-form), produces compelling results.
- **Constraint solving** (e.g., Answer Set Programming via Clingo) is under-used in art but produces dramatically more controlled outputs than evolutionary or noise-based generation when the rules can be made explicit.

## Critique

- The PCG community itself has noted that its methods are increasingly indistinguishable from generative art (Smith 2014, "The seven deadly sins of PCG research"). The functional/aesthetic distinction has been blurring since the *No Man's Sky* generation.
- PCG-via-ML inherits the same authorship critiques as [[AI Art and Latent Space|AI-art]] (Hertzmann 2018) — the artist becomes a tuner of pretrained systems.
- The textbook is now 9 years old (2016); the field has shifted significantly toward ML-PCG, which is partly covered in the 2025 update *PCG with ML* (Liu et al.) but mostly post-dates the textbook.

## Related

- [[Framings of Generative Art]] · [[L-Systems and Grammars]] · [[Cellular Automata and Reaction-Diffusion]] · [[Procedural Paradigms]] · [[Algorithmic Composition]] · [[Galanter's Generative Art Framework]]

## Footnotes

1. Shaker, Togelius & Nelson, *Procedural Content Generation in Games*, Springer 2016. Textbook landing page: https://www.pcgbook.com/ — "first textbook about procedural content generation in games, and also the first book-length overview of the research field."
2. Compton, Kate. *Generative Methods*. https://galaxykate0.tumblr.com/post/139774965871/so-you-want-to-build-a-generator
3. Gumin, Maxim. *WaveFunctionCollapse*. https://github.com/mxgmn/WaveFunctionCollapse
4. Liapis, Yannakakis, Togelius. *Designer Modeling for Personalized Game Content Creation Tools*. AIIDE 2013.
