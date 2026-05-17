---
title: "Research – L1 Cleanup Sweep (Perceptual Constants + Face Perception)"
type: research-synthesis
status: developing
tags: [research, synthesis, perception, constancy, face, l1-cleanup]
created: 2026-05-17
address: c-000113
sources: ["[[Perceptual Constants]]", "[[Face Perception]]"]
confidence: high
---

# Research – L1 Cleanup Sweep (Perceptual Constants + Face Perception)

The second clustered depth-dive sweep, completing the **L1 (perception substrate) layer** of the wiki. Items 5 (Perceptual Constants) and 12 (Face Perception) were the only L1 fields remaining after Arnheim's three sweeps closed the Ch. I–II, V–X material.

This sweep is **shorter and tighter** than the Affect Foundations sweep, by design. Both topics are well-bounded with mature literatures; the goal was to close them cleanly and connect them to the existing perception pages.

## What's new from this sweep

**10 new concept pages + 1 synthesis** (c-000103 … c-000113):

### Perceptual Constants (queue item 5)

- **[[The Five Visual Constancies]]** — overview of size, shape, lightness, color, position constancies and how they relate.
- **[[Size Constancy and Size Illusions]]** — Müller-Lyer, Ponzo, Ebbinghaus, Ames room, moon illusion. Emmert's law and the perceived-distance → size pipeline.
- **[[Lightness and Color Constancy]]** — Adelson checker-shadow, Land's retinex, "the dress" 2015 phenomenon. The illuminant-discounting computation.
- **[[Helmholtz Gibson and Bayesian Perception]]** — the inference-vs-direct-pickup debate and its modern Bayesian / predictive-processing resolution.
- **[[Cross-Cultural Perceptual Variation]]** — Segall et al. 1966 carpentered-world; Müller-Lyer cross-cultural variation; the WEIRD problem.

### Face Perception (queue item 12)

- **[[The Face-Specific Pathway]]** — FFA, OFA, STS; N170 component; prosopagnosia; the two-route Bruce-Young model.
- **[[Configural Face Processing]]** — face-inversion effect, Margaret Thatcher illusion, composite-face effect, second-order relations.
- **[[FACS - Facial Action Coding System]]** — 44 anatomically-defined AUs; Duchenne smile; computable automated FACS pipelines (OpenFace, py-feat, MediaPipe).
- **[[The Uncanny Valley]]** — Mori 1970; motion-amplification; modern AI-face implications; pareidolia as the opposite-pole phenomenon.
- **[[Face Recognition Universality Debate]]** — Ekman vs Barrett on cross-cultural face-emotion recognition; the Crivelli + Gendron findings; what survives.

## Four cross-cutting themes

### 1. **Constancies are achievements, not gifts.**

Across all five constancies, the picture is the same: the visual system **constructs stable percepts via inference / invariant-pickup from environmental cues**. The construction is fast, automatic, cognitively-impenetrable, and tuned to environmental statistics — meaning it's **learned and modifiable on long timescales** and **fails predictably when its cues are misleading**.

This is the wiki's **L1 statement of Arnheim's central thesis**: the world we see is **brain-constructed**, not transparently given. Constancies operationalize that thesis at the level of basic perception.

### 2. **The Bayesian / predictive-processing synthesis closes both topic areas.**

- **For constancies**: the Helmholtz–Gibson debate resolves into a Bayesian-predictive view where the brain does Helmholtz-style inference *implemented* via Gibson-style invariant-pickup.
- **For faces**: the uncanny-valley phenomenon is best explained as **high-precision prediction error** in the face-specific pathway.
- **For cross-cultural variation**: differences are differences in **priors**, not architecture. Same Bayesian machinery; different prior distributions tuned by environmental statistics.

The Bayesian-predictive framework is now the wiki's dominant L1 theoretical commitment. It's compatible with Arnheim's simplicity-economy framing, with Berlyne's arousal-potential (via prediction-error theories of aesthetics; see [[Berlyne's Arousal-Potential Theory]]), and with the affect-foundations material.

### 3. **The "universal substrate / cultural overlay" pattern recurs everywhere.**

Now confirmed in **four** wiki domains:

| Domain | Universal substrate | Cultural overlay |
|---|---|---|
| Color | Wave physics; Berlin-Kay basic categories; warm/cool affect | Specific symbolic meanings; brand-color associations |
| Emotion | Russell (V, A) circumplex; core affect | Specific emotion-category labels; brand archetype mappings |
| Perception | Constancy mechanisms; Gestalt grouping; basic visual primitives | Illusion susceptibility tuning; pictorial-depth-cue literacy |
| Face emotion | FACS anatomy; basic discriminations; valence reading | Specific emotion-label mappings; scanpath patterns |

The recurring rule: **substrate travels; specifics don't**. This pattern justifies the wiki's policy of preferring dimensional / structural specifications over categorical / symbolic ones for any cross-cultural work.

### 4. **Faces are extreme attention-attractors with consequences for everything else.**

The face-specific pathway means **any face in any composition dominates its hierarchy**, regardless of size, contrast, or placement. This has practical implications across the wiki:

- A pareidolic face-pattern emerging accidentally in abstract work **hijacks the composition's hierarchy**.
- Generative art with figural content must commit to **either cartoon stylization or photorealism with face-manifold constraints** — the uncanny middle is hostile.
- LLM-as-judge pipelines should be aware that their face-attention bias is **harder** than they expect; faces aren't just one feature among many.
- Brand-mascot design exploits face-pathway directly via pareidolic configurations.

## Specific empirical claims absorbed

| Claim | Source | Programmability implication |
|---|---|---|
| Müller-Lyer 10–25% length-perception bias | Müller-Lyer 1889; meta-replications | Perspective-driven illusions are real and substantial |
| Adelson checker-shadow squares are identical RGB but perceptually radically different | Adelson 1995 | Lightness perception is reflectance-inference, not luminance-readout |
| "The dress" splits viewers ~50/50 on assumed illuminant | Lafer-Sousa et al. 2015 | Color constancy is constructed; prior assumptions are individually variable |
| Müller-Lyer susceptibility ~5× lower in non-carpentered-world populations | Segall et al. 1966 | Cultural-tuning of constancy is real and substantial |
| FFA activates ~2-3× more for faces than other objects | Kanwisher et al. 1997 | Faces get dedicated processing resources |
| Face detection at ~100 ms post-stimulus | Crouzet et al. 2010 | Faces dominate attention extremely fast |
| N170 EEG component is face-specific and inversion-sensitive | Bentin et al. 1996 | EEG signature of face processing; inversion disrupts configural mode |
| Face-emotion expression-experience correlation < 30% | Barrett et al. 2019 | Strong universality of face-emotion mapping is empirically untenable |
| Free-labeling cross-cultural face-emotion recognition near chance | Gendron 2014; Crivelli 2017 | Categorical face-emotion labels don't travel; dimensional ratings do |

## Cross-references and updates to existing pages

The following existing pages should be updated to link the new L1 material; queued for a quick pass next session:

- **[[Pyramidal Space]]** — link to [[Size Constancy and Size Illusions]] (the perspective-driven illusions instantiate Arnheim's pyramidal-space framework).
- **[[Illumination as a Perceptual Layer]]** — link to [[Lightness and Color Constancy]] (the computational implementation of Arnheim's two-layer model).
- **[[Shading and Volume]]** — same.
- **[[The Munsell and CIELAB Color Systems]]** — link to [[Lightness and Color Constancy]] (perceptual color spaces incorporate constancy assumptions).
- **[[OKLCH]]** — same.
- **[[Visual Weight]]** — link to [[The Face-Specific Pathway]] (Arnheim's "intrinsic interest" weight factor has a neural substrate in face-pathway processing).
- **[[Simplicity (Arnheim)]]** — link to [[Helmholtz Gibson and Bayesian Perception]] (the Bayesian-perception account makes Arnheim's simplicity principle precise).
- **[[Perceptual Forces]]** — link to the Bayesian-predictive synthesis.
- **[[Emotion Psychology]]** (already linked to [[Russell's Affect Circumplex]] etc.) — add link to [[Face Recognition Universality Debate]].
- **[[Constructed Emotion Theory]]** — add link to [[Face Recognition Universality Debate]] as the face-specific evidence-base.
- **[[LLM-as-Judge for Visual Quality]]** — add note about face-attention bias and uncanny-valley risk.
- **[[Multimodal Evaluation Loops]]** — add note about FACS as an analytic channel.
- **[[Mind the Gap - VLM Spatial Reasoning]]** — link to [[Helmholtz Gibson and Bayesian Perception]] (the inference-vs-direct-pickup framing applies to VLM spatial-reasoning gaps).

## Open threads

### Empirical follow-up

- **Validate Arnheim's pyramidal-space claim** against the constancy-illusion literature. Specifically: is [[Pyramidal Space]] consistent with the modern Bayesian-Helmholtz account? (Provisional answer: yes, but the synthesis hasn't been written explicitly anywhere.)
- **Build a "face-attention" guard** for compositional generators: flag layouts with accidental face-configurations before final render.
- **Test cross-cultural color/face/emotion robustness** of any planned generative pipeline. Use dimensional specifications where possible.

### Primary sources still untouched

- Helmholtz 1867 *Handbuch der physiologischen Optik* (full text).
- Gibson 1979 *The Ecological Approach to Visual Perception* (full text).
- Knill & Richards 1996 *Perception as Bayesian Inference* (full text).
- Clark 2016 *Surfing Uncertainty* (full text).
- Ekman & Friesen 1978 *Facial Action Coding System* manual.
- Barrett 2017 *How Emotions Are Made* (already queued from Affect Foundations).

### Two catalog stubs to update

- [[Perceptual Constants]] — move from `stub` to `stable`; link the 5 new pages.
- [[Face Perception]] — same; link the 5 new pages.

## Connection to the four user priorities (updated)

| Priority | What this sweep delivers |
|---|---|
| 1. Generative art | Face-pathway awareness (avoid accidental pareidolia; commit to stylization or photorealism, not the middle); constancy-aware rendering (PBR pipelines invert lightness/color constancy correctly); cross-cultural-aware perspective use. |
| 2. Branding | Brand-mascot design via pareidolia + configural face processing; logo-readability across constancy-violating conditions (very small, very large, monochrome); cross-cultural face-emotion auditing for global personas. |
| 3. Graphic design | Editorial-photography face-direction with FACS-aware emotion specification; pictorial-depth-cue literacy assumptions in cross-cultural editorial; perspective + Müller-Lyer-style compositional moves. |
| 4. Music-reactive visualizers | Face-detection guard (don't trigger FFA accidentally); constancy-violation as deliberate creative move (impossible-perspective worlds for psychedelic / surreal music); avoid uncanny-valley face emergence. |

## What this sweep doesn't cover (deferred)

- **Bayesian / predictive-coding accounts in depth.** Touched but not deepened. May matter if the wiki integrates with active-inference frameworks later. Possible standalone depth-dive after the practical-design and algo-comp sweeps.
- **Visual attention models** (Itti & Koch saliency; transformer-based attention). Relevant but adjacent. Could fit in a "computational vision" depth-dive if needed.
- **The neural-architecture details** of FFA, V4, MT/V5, parvocellular vs magnocellular. Touched at the level needed; deeper would be neuroscience-for-its-own-sake.

## Closing thought

With L1 Cleanup done, the **perception substrate layer of the wiki is complete**. The wiki now has:

- **L1 perception**: Arnheim (Ch I–II, V–X) + perceptual constants + face perception = 30+ pages covering the substrate.
- **L2 theory**: Affect Foundations (emotion + color + empirical aesthetics) = 12+ pages of dimensional and structural theory.
- **L3 design**: catalog stubs in place; depth-dives queued for the Practical Design sweep.
- **L4 generation**: Algorithmic Composition stub + LLM-techniques pages; awaits the Algorithmic Composition + Tools sweep.

**Next sweep per locked sequence:** **Algorithmic Composition + Tools** (item 4 + tools sweep). This is the **generation layer**, and per `feedback_algo-comp-before-tools` in memory, framework precedes library evaluation. This sweep produces the library-evaluation rubric the tools sweep will apply.

The wiki is increasingly **integrated**: every new sweep is now cross-leveraging existing material rather than building net-new foundations. This is the strategic-catalog → prioritized-depth strategy paying off as predicted.

## Related pages

[[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]] · [[Research - Arnheim Sweep 1]] · [[Research - Arnheim Sweep 2]] · [[Research - Arnheim Sweep 3]] · [[Research - Affect Foundations Sweep]] · [[Perceptual Constants]] · [[Face Perception]] · [[The Five Visual Constancies]] · [[Size Constancy and Size Illusions]] · [[Lightness and Color Constancy]] · [[Helmholtz Gibson and Bayesian Perception]] · [[Cross-Cultural Perceptual Variation]] · [[The Face-Specific Pathway]] · [[Configural Face Processing]] · [[FACS - Facial Action Coding System]] · [[The Uncanny Valley]] · [[Face Recognition Universality Debate]] · [[Simplicity (Arnheim)]] · [[Pyramidal Space]] · [[Illumination as a Perceptual Layer]] · [[Constructed Emotion Theory]] · [[Russell's Affect Circumplex]]
