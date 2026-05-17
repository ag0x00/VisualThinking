---
title: Organic vs Mechanical Motion
type: concept
status: developing
tags: [concept, perception, motion, animation, arnheim]
address: c-000067
created: 2026-05-17
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Organic vs Mechanical Motion

Arnheim's "**scale of complexity**" for perceived motion: the eye distinguishes **mechanical** motion (rigid, repetitive, deterministic, single-frequency) from **organic / living** motion (multi-jointed, internally-driven, variable-frequency, subtly aperiodic). The distinction is not subjective; it follows from the **structural complexity** of the motion pattern and the eye's reading of whether the motion appears **externally caused** or **self-generated**.

This is a low-level perceptual judgment closely tied to the **animacy detection** machinery in human vision (Heider & Simmel 1944; Tremoulet & Feldman 2000).

## The scale

| Position | Characteristic | Examples |
|---|---|---|
| **Pure mechanical** | Single rigid translation/rotation, constant speed, infinite repetition | Clock pendulum, gear, conveyor belt |
| **Mechanical-complex** | Multiple rigid parts moving with fixed phase relations | Watch escapement, piston engine |
| **Quasi-organic** | Articulated parts, variable phase, subtle damping | Walking robot, rag-doll physics |
| **Organic** | Multi-joint, internal initiation, micro-variation in timing and amplitude | Walking human, swimming fish, branch in wind |
| **Highly organic** | Goal-directed, context-responsive, fluid acceleration profile | Dancer improvising, predator stalking, hand drawing |

The boundaries are not sharp; what matters is the **gradient of complexity** and the **statistical signature** of the motion.

## What makes motion read as living

Arnheim identifies several cues, expanded by subsequent research:

1. **Multiple coordinated parts.** A single rigid body cannot read as fully organic; living things are articulated.
2. **Phase variation.** Joint angles change in non-locked relations — the knee leads the hip, the elbow trails the shoulder, with timing drift.
3. **Self-initiated starts and stops.** Motion that begins without external trigger reads as agentic.
4. **Goal-direction.** A trajectory that **curves toward** something (a target, a destination) reads as intentional; uniform straight-line motion reads as mechanical.
5. **Acceleration profile.** Living motion accelerates and decelerates with a roughly minimum-jerk profile (Flash & Hogan 1985); pure mechanical motion typically has step-changes or constant velocity.
6. **Micro-variability.** Even repeated motions (walking, breathing) vary cycle-to-cycle in amplitude, frequency, and timing. Perfect repetition reads as dead.

## The biological motion literature

Beyond Arnheim, **Gunnar Johansson's 1973 point-light walker** experiment is the canonical demonstration: a handful of bright dots on the major joints of a walker (12–14 dots), shown in motion against black, is instantly recognized as a walking human — including gender, mood, and identity. The **structural complexity** of the motion pattern alone carries the percept.

This connects directly to [[Phenomenal Causality]]: both are low-level perceptual mechanisms that classify motion patterns into causal/agentic categories without conscious inference.

## Programmable implications

This is one of the most actionable concepts for the user's four priorities:

- **Generative art (priority 1).** Procedural creature/character motion that reads as alive needs: multi-joint articulation, phase-variation across joints, minimum-jerk acceleration profiles, and small (~5–15%) cycle-to-cycle variation. Constant-speed loops kill the effect.
- **Branding motion (priority 2).** Logo animations land somewhere on this scale and the choice signals the brand. Banks/insurance favor mechanical (precise, reliable); creative agencies favor organic (lively, human). Get the position right before fine-tuning easing curves.
- **Web/poster motion (priority 3).** Scroll-triggered animations with constant velocity feel cheap; ones with subtle ease-in-out and small randomization feel premium. The premium signal *is* the organic-motion signature.
- **Music-reactive visualizers (priority 4).** Visualizers that lock perfectly to a click-track read as mechanical (and feel dead even when beat-accurate). Adding **lag, anticipation, follow-through, and per-element phase variation** is what makes the visualizer feel like it's *dancing with* the music rather than being driven by it.
- **WebGPU shader noise.** Replace Perlin/simplex constant-rate animation with multi-octave variable-rate noise mod by another slow noise → instant organic feel.

## Implementation recipe

For organic motion in JS/TS:

```js
// Pseudocode for a procedural living oscillation
function organicOscillate(t, baseFreq, amp) {
  const freqJitter = 1 + 0.1 * noise(t * 0.3);  // 10% frequency variation
  const ampJitter = 1 + 0.08 * noise(t * 0.5 + 100);  // 8% amplitude variation
  const phase = noise(t * 0.2 + 200) * 0.3;  // small phase drift
  return amp * ampJitter * Math.sin(t * baseFreq * freqJitter + phase);
}
```

Drive each "joint" of a composite element with one of these, with slightly different seeds. The result reads as alive at the perceptual level even without sophisticated rigging.

## What this is NOT

- Not the **uncanny valley**. The uncanny valley is a separate phenomenon involving near-human appearance with imperfect motion (queue item 12). Organic-vs-mechanical operates at the perceptual-motion level regardless of figural representation; the uncanny valley operates at the recognition-of-human-form level.
- Not motion **complexity in pixels per second**. A faster mechanical motion is still mechanical; a slow organic motion is still organic. The discriminator is structural, not energetic.

## Related pages

[[Stroboscopic Motion]] · [[Frame of Reference for Motion]] · [[Phenomenal Causality]] · [[Directed Tension]] · [[Expression as Configuration of Forces]] · [[Physiognomic Perception]] · [[Perceptual Forces]] · [[Arnheim - Art and Visual Perception]]

## Source

Arnheim Ch. VIII, "A Scale of Complexity" and "The Body as an Instrument." The Johansson point-light walker (1973, *Perception & Psychophysics* 14:201–211) is a post-Arnheim canonical reference. Flash & Hogan 1985 (*Journal of Neuroscience* 5:1688–1703) on minimum-jerk trajectories. Tremoulet & Feldman 2000 (*Perception* 29:943–951) on perception of animacy from simple motion.
