---
address: c-000141
title: Practice-led Studio Research
type: concept
status: developing
tags: [concepts, generative-art, studio-practice, craft, framings]
created: 2026-05-17
updated: 2026-05-17
---

# Practice-led Studio Research

A framing within [[Framings of Generative Art|generative art]] that centers the *artist's craft, taste, and curation* as the primary locus of meaning. The generative system is a tool the artist tunes and curates. The lineage runs from John Maeda's Aesthetics and Computation Group (ACG) at the MIT Media Lab (1996–) through Casey Reas and Ben Fry (Processing, 2001), into the contemporary practitioner-essayist tradition of Tyler Hobbs, Manolo Gamboa Naon, Jared Tarbell, Kim Asendorf, Holger Lippmann, and the parametric-identity strain of design studios (Sagmeister, Walter, North, NB Studio).

> [!note] This is one of nine framings in [[Framings of Generative Art]]
> Practice-led framing contests Galanter and Boden's emphasis on the *system* by re-centering the *artist*. The system is a brush, not the artist. The artist's taste, sketches, parameter-tuning, and curated output choices are where artistic identity lives.

## Essence

The studio-research tradition treats generative art as a *design discipline*. Casey Reas: "writing software to generate images" is a craft practice continuous with drawing and painting, not a categorical break.¹ Processing was designed specifically as a "sketchbook for code"² — the sketch metaphor positions code-writing as iterative, expressive, taste-driven work. The artist tunes, throws away, re-tunes, picks the best of N runs, and curates. The *system is not the artist*; the system is a parameterized brush.

This is the strongest framing for **branding** (priority 2) and **graphic design** (priority 3) because parametric-identity design — the contemporary idiom in which a brand is a *generative system* rather than a fixed logo (MIT Media Lab, Casa da Música, OCAD, Whitney) — is exactly the studio-research framing applied to identity work.

## Key practitioners and key claims

- **John Maeda** (MIT ACG, 1996–): aesthetic computation is a design discipline. His students included Reas and Fry. *Design By Numbers* (1999) and *Creative Code* (2004).
- **Casey Reas & Ben Fry** (Processing, 2001+): "Processing is a sketchbook for code." Aim: make programming accessible to artists and designers, position code as a *first-class artistic medium*.²
- **Tyler Hobbs**: extensive essayistic output positions long-form generative art as craft. His writing on QQL, Fidenza, and process-shaping argues the artist's craft is *parameter-space sculpting* and *output-distribution curation*.³
- **Manolo Gamboa Naon, Jared Tarbell, Holger Lippmann, Kim Asendorf**: long-running studio practices in the post-Processing tradition.
- **Sagmeister & Walsh, Karl Gerstner, NB Studio, Build, MetaDesign**: parametric-identity systems applied to commercial branding. The deepest precedent is Karl Gerstner's *Designing Programmes* (1964) — design as the specification of generative rules rather than fixed artifacts.
- **John Maeda's *Laws of Simplicity*** and **Aesthetics and Computation Group** at MIT Media Lab: the institutional cradle.

## What it foregrounds that other framings don't

- **Craft and iteration.** The sketch metaphor; the artist's hand visible in the parameter choices.
- **Taste as constraint.** The artist filters the system's output space by taste — the system never speaks unmediated.
- **Code as material.** Code is read and shared (Reas & Fry's *Form+Code*, Shiffman's *Nature of Code*). Generative-art books are widely-read pedagogically because the practice is teachable as craft.
- **Parametric design.** The brand-or-poster *is* a system; instances are generated under it. This idiom dominates contemporary graphic-design practice for systems-level work.
- **Pedagogy.** Processing, p5.js, and Shiffman's *Coding Train* exist because the studio-research tradition treats teaching as core to the practice.

## What it contests

- **Galanter:** centers the system. Practice-led centers the artist. The system is necessary but not sufficient.
- **A-life:** centers emergent process. Practice-led often *suppresses* emergence in favor of controlled aesthetic decisions.
- **AI-art (Anadol, Klingemann):** uses pretrained models. Practice-led often resists "black-box generators" in favor of artist-written, transparent rule-systems.
- **Live-coding:** centers performance. Practice-led centers studio work — slower, iterative, private.

## Computable handles

- **Parametric design.** Define a parameter space with semantic meaning ("density", "warmth", "noise-scale", "palette-shift"). Provide UI or notebook sliders for tuning. Artist's expertise = knowing where in the space the good outputs live.
- **Sketch-iterate-curate workflows.** Generate N candidates; curate K of N; refine parameters; repeat. This is the loop *most* practice-led generative art is actually made in.
- **Custom DSLs / libraries.** [[p5.js]], Processing, [[paper.js]], [[Pts.js]], [[three.js]] — chosen for ergonomics, not for what they enable in principle.
- **Parametric-identity systems.** Define a brand as a generative program: typographic rules, color generation, mark variation, layout grammar. Examples: MIT Media Lab identity (Green/Maeda 2011), Casa da Música (Sagmeister 2007), Whitney Museum identity (Experimental Jetset 2013), OCAD-U (Bruce Mau 2011).

## Fit with the four user priorities

- **1. Generative art (high).** Primary tradition for static and dynamic work; vast practitioner literature.
- **2. Branding (high).** Parametric-identity is *the* contemporary idiom for systems-level branding.
- **3. Graphic design (high).** Direct lineage from [Processing](https://processing.org) and [p5.js](https://p5js.org); used in posters, books, editorial design, motion graphics.
- **4. Music-reactive (medium).** Works well but is not the dominant framing — [[Live Coding and Algorave|live-coding]] dominates that priority. Practice-led approach via tools like [[Hydra]] (offline sketches) or three.js + Web Audio is common.

## Programmability handle

For an LLM-as-artist system aimed at this tradition:
- **Tune, don't generate from scratch.** The artist's taste = the parameter-space they've sculpted over many iterations. Give the LLM a curated parameter space, not a blank canvas.
- **Curate distributionally.** For long-form (Hobbs), the entire output set matters. The LLM should sculpt the *distribution*, not just individual outputs.
- **Critique and reject.** Generate N, throw away most. Aesthetic-evaluation models ([[NIMA - Neural Image Assessment|NIMA]], [[Photo Aesthetic Features]]) help here but the artist's taste filter is non-trivial to replace.

## Critique

- The practice-led framing has been criticized as theoretically thin — it foregrounds craft but doesn't theorize *what counts* as good craft, leaving the field reliant on practitioner taste.
- Some critics argue the tradition has been institutionally captured by design schools, drifting away from the experimental/critical edge of [[Algorithmic Art History|early algorithmic art]] (Mohr, Molnár, Nake).
- AI-art (especially diffusion-era) has put pressure on the framing: if an artist's skill is parametric tuning of pretrained models, is that practice-led art or AI-art? The two framings increasingly overlap.

## Related

- [[Framings of Generative Art]] · [[p5.js]] · Processing · [[Long-form On-Chain Generative Art]] · [[AI Art and Latent Space]] · [[Algorithmic Art History]] · [[Galanter's Generative Art Framework]]

## Footnotes

1. Reas, Casey. *Studio International* interview (2018). https://www.studiointernational.com/casey-reas-interview-computer-art-coding — "writing software to generate images" as continuous with drawing/painting practice.
2. Reas & Fry, *Processing: A Programming Handbook for Visual Designers and Artists*, MIT Press 2007. The "sketchbook for code" framing is the central design principle.
3. Hobbs, Tyler. *The Rise of Long-Form Generative Art* (2021). https://www.tylerxhobbs.com/words/the-rise-of-long-form-generative-art — explicit framing of generative art as craft.
4. Gerstner, Karl. *Designing Programmes* (1964). The deepest precedent for parametric-identity design.
5. Maeda, John. *Design By Numbers* (1999) and *Creative Code* (2004). The MIT ACG institutional founding texts.
