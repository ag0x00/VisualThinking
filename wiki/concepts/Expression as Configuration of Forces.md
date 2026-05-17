---
title: Expression as Configuration of Forces
type: concept
status: developing
tags: [concept, perception, expression, gestalt, arnheim, isomorphism]
address: c-000070
created: 2026-05-17
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Expression as Configuration of Forces

The **central thesis of Arnheim's chapter on Expression** and one of the strongest claims in the book: the emotional or expressive quality of a visual pattern is **not projection from the viewer**, **not learned association**, and **not anthropomorphic empathy** — it is an **intrinsic structural property** of the configuration of forces in the pattern itself.

> "Expression is conveyed not so much by the 'geometric-technical' properties of the percept as such, but by the forces they can be assumed to arouse in the nervous system of the observer." — Arnheim

The expressive content is *in* the visual pattern, registered by the visual system through the **isomorphism** between the configuration of forces in the image and the configuration of forces in the felt experience.

This is **explicitly an anti-empathy position**.

## What Arnheim rejects

The traditional **empathy theory** (Theodor Lipps, *Einfühlung*, late 19th c.): we project our own kinesthetic feelings onto inanimate objects. A weeping willow looks sad because we **imagine ourselves** in the position of the drooping branches and the imagining is what feels sad.

Arnheim rejects this on several grounds:

1. **Phenomenological immediacy.** The sadness of the willow is registered too fast and too uniformly to be a layered inference. We don't "imagine ourselves" first and then read sadness; we *see* sadness.
2. **Wertheimer's argument from dance.** A college dance group asked to improvise sadness produced a converged formal vocabulary: slow, low-amplitude, downward-curving, gravitationally-passive movements. The sadness reading is *in the formal structure of the motion*, not in the dancers' biographies or projected emotions.
3. **The William James inversion.** Body and mind are different *media* (one physical, one mental) but they share **structural properties**: intensity, volume, simplicity vs complication, smoothness vs agitation, rest vs activity. The shared structure is what carries expression across the medium gap.
4. **Animism without projection.** A steep rock, a willow tree, a sunset color, a cracked wall, a tumbling leaf, even a pure line have expression *of their own*. They are not "human expression in disguise" — they are configurations of forces that happen to share structure with certain human emotional states.

## What he replaces it with: isomorphism

The Gestalt principle of **psychophysical isomorphism** (Köhler, Wertheimer): the brain state corresponding to a percept has the same *structural form* as the percept itself, and the felt experience has the same structural form as the brain state. Therefore:

- A sad facial expression has a certain configuration of forces (slack, downward, low-energy).
- The brain state representing it has the same configuration of forces.
- The felt experience of sadness *is itself* a configuration of forces of the same form.
- A non-face stimulus with the same configuration of forces (a willow, a slumped chair) produces *the same kind of brain state* and *the same felt experience*.

Sadness is not human-specific; it's a **shape of forces**. Many things — human face, weeping willow, slow dance, late twilight, a rock formation — instantiate that shape.

## The Linnean classification by expression

Arnheim takes the radical implication seriously: the eye **spontaneously classifies all phenomena** by their expressive configuration, cutting across the conventional categories of animate/inanimate, human/non-human, mental/physical:

| Conventional category | Expressive category |
|---|---|
| Drooping branch (plant) | Sad-shape |
| Slumped human (animal) | Sad-shape |
| Slowly-falling tar (substance) | Sad-shape |
| Twilight color (light) | Sad-shape |

> "On the basis of their expressive appearance, our eye spontaneously creates a kind of Linnean classification of all things existing."

He cites primitive languages (Klamath) that use shape/motion prefixes cutting across our categories (round/spheroidal/disc applies equally to celestial bodies, fruits, stones, dwellings, gathered crowds). And Braque's advice to artists: find the **common in the dissimilar** ("the swallow knifes the sky").

## The universal vocabulary of expression

Arnheim names the structural dimensions that carry expression in *any* medium:

- **Rising and falling**
- **Dominance and submission**
- **Weakness and strength**
- **Harmony and discord**
- **Struggle and conformance**
- **Expansion and contraction**
- **Approach and withdrawal**
- **Tension and release**

These are the **primitives**. Specific emotions are combinations: sadness ≈ low-energy + downward + soft + slow + passive. Anger ≈ high-energy + outward + sharp + fast + active. Joy ≈ upward + open + rapid + rising. Despair ≈ downward + collapsed + contractive.

Each primitive can be realized in shape, color, motion, line, mass, or texture. **This is the cross-modal vocabulary that makes color-emotion (queue item 2) and pose-emotion (queue item 11) commensurable.**

## Programmable implications

The most important Arnheim concept for **emotion-driven generative art**:

- **Direct mapping from emotion to visual parameters.** Don't infer "sad" → "use blue." Infer "sad" → **low-energy, downward, soft, passive** → specific parameter ranges in motion, shape, density, brightness.
- **Cross-modal commensurability.** The same dimensions parameterize visual AND auditory expression — slow tempo, low pitch, soft attack also code sadness. This is why music-reactive visualizers (priority 4) can be made truly expressive: emotion in the audio and emotion in the visuals share a common structural vocabulary.
- **No anthropomorphism required.** A purely abstract generator can produce expressive output if it controls the structural primitives. This is the affordance of `paper.js`, `pts.js`, WebGPU primitives — they can express without any figural content.
- **Brand emotion (priority 2).** Brand-character (warm/cold, dynamic/stable, friendly/serious) decomposes into the same primitives. A logo that is rising + open + curved + balanced reads as friendly-energetic; rising + sharp + angular reads as aggressive-energetic.
- **Critic prompts for LLM evaluation.** "Score this image on rising-vs-falling, expansion-vs-contraction, harmony-vs-discord" produces more measurable expressive judgments than "is it beautiful?" or "what emotion?"

## The corollary: All Art Is Symbolic

Arnheim's chapter ends with the claim that **all art is symbolic** in the technical sense: every work, even pure abstraction, *means* something because its configuration of forces matches the configuration of countless physical and mental situations. The work doesn't *depict* the universal pattern; it *is* an instance of it, and that's why it resonates.

This is also why he rejects psychoanalytic readings of art (everything symbolizes sex/parents/genitals) as **too restrictive** — the actual universal underlying any work is much broader than any one human-life category. The story of Jonah symbolizes withdrawal-into-isolation, of which sexual symbolism is a tiny subset.

## Related pages

[[Directed Tension]] · [[Physiognomic Perception]] · [[Symbolic Pattern in Composition]] · [[Perceptual Forces]] · [[The Structural Skeleton]] · [[Visual Balance]] · [[Simplicity (Arnheim)]] · [[Organic vs Mechanical Motion]] · [[Arnheim - Art and Visual Perception]]

## Source

Arnheim Ch. X (Expression), §§ "Inside Linked to Outside," "Expression Embedded in Structure," "The Priority of Expression," "The Physiognomics of Nature." Citing Wertheimer (the Binney dance experiment), William James (*Principles of Psychology* 1890 on body-mind structural analogies), Köhler (*Gestalt Psychology* 1929), Lipps (rejected), Berkeley (Berkeley's essay on vision, pre-Lipps version of the projection theory, also rejected).
