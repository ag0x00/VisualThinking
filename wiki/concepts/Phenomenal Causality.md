---
title: Phenomenal Causality
type: concept
status: developing
tags: [concept, perception, motion, gestalt, arnheim, michotte, causality]
address: c-000066
created: 2026-05-17
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Phenomenal Causality

The **direct perception of causation** between visual events — not inference, not learned association, but a Gestalt phenomenon as immediate as color or shape. **Albert Michotte's 1946 monograph** *La perception de la causalité* established that under tightly controlled timing conditions, observers *see* one moving object **launch**, **trigger**, or **carry** another. The causal relation is **in the percept**, not added by reasoning.

This is one of the strongest demonstrations against the empiricist view of perception (Hume: causation is unobservable; we only see succession). Michotte showed observers a sequence and they reported the cause directly.

## Michotte's launching experiment

Two squares A and B on a screen.

1. A moves rightward toward stationary B.
2. The instant A touches B, A stops and B begins moving rightward at A's speed (or slightly slower).
3. Observers spontaneously describe: **"A hit B and made it move."**

Critical parameters and their thresholds:

| Manipulation | Effect on causality percept |
|---|---|
| Delay between A stopping and B starting | > ~70 ms: causality breaks; "A stopped, then B started independently" |
| Spatial gap at the contact point | Even small gaps (~1°) weaken the percept; "A came up to B, then B moved" |
| B's speed >> A's speed | Causality breaks; B reads as self-propelled with own motive |
| B's speed ≈ A's speed | Strong **launching** percept |
| B's speed << A's speed and B *continues* with A behind it | **Triggering** or **entraining** percept |
| A and B move together after contact, in physical contact | **Carrying / transport** percept |

These thresholds are remarkably tight and consistent across cultures and ages — including in infants (Leslie & Keeble 1987 showed 6-month-olds discriminate launching from non-causal sequences).

## Beyond launching

Michotte catalogued multiple causal Gestalts:

- **Launching** (collision → motion transfer)
- **Triggering** (contact → independent motion, like striking a match)
- **Entraining / carrying** (contact → joint motion)
- **Braking** (contact stops a moving object)
- **Pulling** (one object's motion drags another behind it)
- **Penetration** (one object enters another and disappears)

Each has its own timing window and its own phenomenological character.

## Programmable implications

Phenomenal causality is **directly relevant to all four user priorities**, but especially the dynamic ones (priorities 1, 4):

- **Music-reactive visualizers (priority 4).** Beats can be visualized as launches: an attack on the drum *causes* a particle to fly. If timing is off by > 70 ms, the perceptual contract breaks and the visualizer feels disconnected from the audio. **The 70 ms threshold is a hard latency budget for any beat-driven visualizer that wants to feel causal.**
- **Interactive web art (priority 1 dynamic + priority 3 graphic design).** UI affordances ride on phenomenal causality: a click *causes* a button to depress, a hover *causes* a tooltip to appear. Animation timing functions (e.g., `cubic-bezier(0,0,.2,1)`) work because they preserve causal pacing.
- **Generative art with implied physics (priority 1).** Particle systems read as physically meaningful when their collisions obey Michotte timing. Cheating physics is fine; cheating phenomenal causality is not.
- **Logo/identity motion (priority 2 branding).** "X transforms into Y" is read as causal if the timing follows launching/transport thresholds. Brand-mark animations that fail Michotte's timing read as cuts, not transformations.

## Cross-cultural / robustness

- Universal across cultures (Schlottmann & Anderson 1993).
- Present in 6-month-old infants (Leslie & Keeble 1987).
- Surviving in **patients with damage to higher reasoning systems** (Schlottmann 2000) — confirming causality perception is a low-level visual mechanism, not high-level inference.

## What Michotte got wrong (modern context)

The naïve interpretation — that *all* causation is just Michotte-style direct perception — is too strong. Modern accounts:

- **Hume + Bayesian inference** still matters for non-direct causal reasoning ("the bridge collapsed because of fatigue").
- **Probabilistic causal models** (Pearl, do-calculus) are needed for causal questions that span time, space, and inference.
- But the **immediate, visual, low-level** causation that Michotte described is real, robust, and shapes everything from animation timing to physical engine "feel."

## Related pages

[[Stroboscopic Motion]] · [[Frame of Reference for Motion]] · [[Organic vs Mechanical Motion]] · [[Directed Tension]] · [[Perceptual Forces]] · [[Visual Balance]] · [[The Gestalt Principles of Visual Perception]] · [[Arnheim - Art and Visual Perception]]

## Source

Arnheim Ch. VIII (Movement), citing Albert Michotte, *La perception de la causalité* (1946; English 1963, *The Perception of Causality*, Methuen). Modern reviews: Scholl & Tremoulet 2000 (*Trends in Cognitive Sciences*) on perceptual causality and animacy.
