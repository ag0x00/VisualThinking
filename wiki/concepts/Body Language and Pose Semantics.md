---
title: Body Language and Pose Semantics
type: field-stub
status: developed
tags: [field, body-language, pose, emotion, catalog-stub]
address: c-000084
created: 2026-05-17
updated: 2026-05-17
priority_rank: 11
depth_dive_complete: 2026-05-17
---

# Body Language and Pose Semantics

> [!success] Depth-dive complete 2026-05-17
> See [[Research - Body Language Depth Sweep]]. Page-by-page coverage: [[Universal Body Language Dimensions]] (5-axis structural anchor) · [[Birdwhistell's Kinesics]] (historical, mostly superseded) · [[Mehrabian's 55-38-7 Misinterpretation]] (myth correction) · [[de Gelder's Whole-Body Emotion Perception]] (contemporary empirical anchor) · [[Cultural Variability in Body Language]] (emblem catalog, proxemics) · [[Contrapposto and Pose Canons]] (Polykleitos → 3D rigging, 6-feature computable score) · [[Pose Extraction Pipeline]] (MediaPipe / MoveNet / RTMPose tools).

**Field stub. Catalog sweep 2026-05-17. Depth-dive complete 2026-05-17.**

The semantics of **body posture, gesture, and pose** — what bodies *communicate* through their configuration, independent of the face. A primary emotional-trigger channel for any figurative art and a critical evaluator for any generative system that depicts humans.

Distinct from [[Face Perception]] (item #12 of the queue): body language is decodable at a distance, at low resolution, and in static silhouette.

## Canonical figures and traditions

- **Charles Darwin** — *The Expression of the Emotions in Man and Animals* (1872). Foundational; argued bodily expression is evolved and partly universal.
- **Ray Birdwhistell** — *Kinesics and Context* (1970). Founded the academic study of body language ("kinesics").
- **Albert Mehrabian** — 1971 communication-channels work; the (much-misquoted) "55-38-7" finding (verbal-vocal-facial proportions in interpreting feelings).
- **Beatrice de Gelder** — *Emotions and the Body* (2016); contemporary scientific anchor; whole-body emotion perception.
- **Eadweard Muybridge** — *Animal Locomotion* (1887); the photographic record of bodily motion that founded scientific gesture analysis.
- **Polykleitos** — *Doryphoros* (~440 BCE); the **canonical contrapposto** statue; principle of weight-shift pose.
- **Donatello, Michelangelo** — Renaissance contrapposto masters; pose as drama.

## Key concepts (depth-dive will expand)

### Universal body-language dimensions

de Gelder and collaborators have isolated whole-body emotion-perception dimensions that operate cross-culturally:

- **Approach vs avoidance** — body oriented toward / away from referent.
- **Expansion vs contraction** — open posture (arms wide, chest out) vs closed (curled, arms crossed). Maps directly to [[Expression as Configuration of Forces]] "expansion/contraction" primitive.
- **Upward vs downward** — chin up, gaze up vs slumped, gaze down.
- **Stability vs instability** — balanced stance vs falling/leaning.
- **Energy / arousal** — slack vs tense musculature.

These dimensions parameterize specific emotions:
- **Fear** = contraction + avoidance + downward + high-arousal.
- **Anger** = expansion + approach + high-arousal.
- **Sadness** = contraction + downward + low-arousal.
- **Joy** = expansion + upward + high-arousal.
- **Submission** = contraction + downward + low-energy.
- **Dominance** = expansion + upward + relaxed-confident.

### Contrapposto and pose-as-narrative

- **Contrapposto** (Greek-Renaissance) — weight on one leg, hips and shoulders counter-rotated. Produces **stable dynamism**: the figure is at rest but the structure implies recent or imminent motion. Classic example of [[Directed Tension|directed tension]] in figural form.
- **Frontal symmetric pose** — formal, hieratic, dead (Egyptian / Romanesque / corporate stock photography).
- **Action pose** — mid-stride, leaning, falling. Reads as dynamic.
- **Closed pose** — limbs against torso. Reads as defensive, contained.
- **Open pose** — limbs extended outward. Reads as confident, vulnerable, or theatrical depending on context.

### Gesture and proxemics

- **Emblems** (Ekman & Friesen): culture-specific gestures with verbal-equivalent meaning (thumbs-up, OK-sign, victory-V). Trip-wires for cross-cultural design.
- **Illustrators** — gestures that accompany speech, illustrate ideas. Universal substrate, culture-specific style.
- **Affect displays** — emotional bodily expression. Largely universal (Darwin's claim).
- **Regulators** — control conversation flow (nodding, head-tilt).
- **Adaptors** — self-touching, fidgeting. Reveal anxiety or other internal states.
- **Proxemics** (E. T. Hall 1966): intimate / personal / social / public distance zones. The same is true for pose composition in image — implied distance between figures is meaningful.

### Power-pose / dominance research

- **Carney, Cuddy & Yap 2010** — high-power poses (expansive, open) increase testosterone, decrease cortisol. **Effect size highly contested**; failure to replicate (Ranehill et al. 2015; Garrison et al. 2016). The *cause* claim is dubious, but the *correlation* (expansive pose ↔ dominant attribution by observers) is robust.
- For generation purposes: **observers reliably read expansive poses as dominant** regardless of whether the pose causes hormonal change in the poser.

## Why this matters for the wiki's four priorities

| Priority | Use |
|---|---|
| 1. Generative art | Any figurative generator (characters, portraits, scenes) needs pose semantics. Random or kinematically valid poses without semantic intent feel uncanny. |
| 2. Branding | Brand-photography pose choices (executive portraits, lifestyle imagery) encode brand-character (confident / approachable / aspirational). |
| 3. Graphic design | Editorial / fashion / advertising photography. |
| 4. Music-reactive visualizers | If using figurative representation (dance avatars, character visualizers); also "abstract bodies" (limbs as visual elements) inherit body-language semantics. |

## Connection to existing wiki pages

- [[Expression as Configuration of Forces]] — body language is the *paradigm case* of Arnheim's anti-empathy thesis. The body has expression *as a configuration of forces*, not by us projecting feelings into it.
- [[Physiognomic Perception]] — body language is read physiognomically (instantly, structurally) before any geometric analysis.
- [[Emotion Psychology]] — body language is one of the major emotion-output channels.
- [[Face Perception]] — the other major output channel; depth-dive #12.
- [[Directed Tension]] — contrapposto = directed tension in figural form.

## What's missing

- A computable taxonomy of pose features (joint angles, shoulder-hip offset, expansion ratio).
- The full Darwin-Birdwhistell-de Gelder lineage.
- MediaPipe / OpenPose-based pose extraction as an analysis pipeline.
- Cross-cultural emblem-gestures catalog (with the "do not use" set for global branding).
- Animation 12-principles overlap (anticipation, follow-through, exaggeration).

## Depth-dive plan (queued)

1. **de Gelder's whole-body emotion dimensions** as the empirical anchor.
2. **Contrapposto and pose history** — Polykleitos → Michelangelo → contemporary.
3. **Computable pose features** — shoulder-hip angle, expansion ratio, vertical asymmetry, joint-bend angles. Build a "pose-emotion score" via MediaPipe.
4. **Cross-cultural emblem catalog**.
5. **Brand-photography pose taxonomy** — analyze top-100 brands' executive / lifestyle photography for pose conventions.

## Related pages

[[Expression as Configuration of Forces]] · [[Physiognomic Perception]] · [[Emotion Psychology]] · [[Face Perception]] · [[Directed Tension]] · [[Dynamics of Obliqueness]] · [[Visual Balance]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources to consult in depth-dive

- Darwin 1872 *The Expression of the Emotions in Man and Animals*.
- Birdwhistell 1970 *Kinesics and Context*.
- de Gelder 2016 *Emotions and the Body*.
- Hall 1966 *The Hidden Dimension*.
- Carney, Cuddy & Yap 2010 + Ranehill et al. 2015 + Garrison et al. 2016 (the power-pose debate).
- Ekman & Friesen 1969 "The repertoire of nonverbal behavior" — *Semiotica* 1.
- Muybridge 1887 *Animal Locomotion*.
