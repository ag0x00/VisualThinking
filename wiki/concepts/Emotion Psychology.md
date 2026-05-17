---
title: Emotion Psychology
type: field-overview
status: stable
tags: [field, emotion, psychology, affect-foundations]
address: c-000074
created: 2026-05-17
updated: 2026-05-17
priority_rank: 1
depth_dive_complete: true
---

# Emotion Psychology

**Field overview. Catalog sweep 2026-05-17; depth-dive complete same day as part of [[Research - Affect Foundations Sweep]].**

The scientific study of emotion — what emotions *are* (categories, dimensions, processes), where they live (body, brain, situation, social field), and how they're triggered, expressed, and read. The *category system* the wiki needs in order to map "emotional triggers" to visual parameters.

Arnheim's framework ([[Expression as Configuration of Forces]]) supplies the **structural primitives** (rising/falling, expansion/contraction, harmony/discord, struggle/conformance). What it does **not** supply: the **affect models** that name specific emotions, dimension them, and link them to physiological / behavioral / cultural variables.

## Canonical figures

- **Paul Ekman** — Basic emotions theory; the Facial Action Coding System (FACS); cross-cultural facial-expression studies (1960s–present).
- **Robert Plutchik** — Wheel of emotions (1980); 8 basic + dyadic compounds; evolutionary-functional framing.
- **James A. Russell** — Affect circumplex (1980); two-dimensional valence × arousal model; one of the most empirically validated.
- **Lisa Feldman Barrett** — Constructed-emotion theory (2017 *How Emotions Are Made*); challenges basic-emotion universality; emotions as concepts the brain constructs from interoception + situation.
- William James & Carl Lange — James-Lange theory (1880s): bodily change *precedes* emotional feeling. Foundational despite later modifications.
- Antonio Damasio — Somatic-marker hypothesis (1994 *Descartes' Error*); emotion as essential to rational decision.

## Key concepts (depth-dive will expand)

- **Basic emotions** (Ekman): anger, disgust, fear, happiness, sadness, surprise (later: contempt). Universal facial-expression correlates. Contested but influential.
- **Affect circumplex** (Russell): valence (positive↔negative) × arousal (low↔high) two-axis space. Every emotion is a region in this plane. Highly programmable: map sound features to valence/arousal, then map valence/arousal to visual parameters.
- **Appraisal theories** (Scherer, Lazarus): emotions as cognitive appraisals of situations along dimensions (novelty, goal-relevance, agency, fairness).
- **Discrete vs. dimensional debate**: basic-emotions (discrete categories) vs circumplex/PAD (continuous dimensions). Constructionism (Barrett) sides against universal categories.
- **PAD model** (Mehrabian-Russell): Pleasure × Arousal × Dominance — three dimensions, used in advertising research and ambient-emotion measurement.
- **FACS** (Ekman & Friesen): 44 action units of facial musculature. Computable: OpenFace, py-feat, MediaPipe Face Mesh.

## Why this matters for the wiki's four priorities

| Priority | Use of emotion psychology |
|---|---|
| 1. Generative art | Brief in dimensional terms (valence/arousal target), map to visual parameters via Arnheim's structural primitives. |
| 2. Branding | Brand personality (Aaker scale) overlaps emotion psychology; brand emotional identity decomposes to discrete + dimensional traits. |
| 3. Graphic design | Posters, ads target emotion responses; A/B test on dimensional measures. |
| 4. Music-reactive visualizers | Musical emotion (Russell circumplex applies directly to music; Juslin & Västfjäll 2008) translates cross-modally to visual emotion via the shared structural vocabulary. |

## Connection to Arnheim

Arnheim's vocabulary maps onto Russell's circumplex this way:

- **Arousal** ↔ Arnheim's tension magnitude (sum of directed-tension generators)
- **Valence** ↔ harmony vs. discord; conformance vs. struggle
- **Rising/falling** ↔ approach motivation vs. avoidance
- **Expansion/contraction** ↔ open / closed body posture (Damasio somatic markers)

The depth-dive should make this mapping precise enough to be a generation pipeline.

## What's missing

- Categorical labels (specific names of emotions)
- Cross-cultural variation data (is the circumplex universal?)
- Developmental timeline of emotion concepts
- Neurological substrate (amygdala / insula / anterior cingulate / vmPFC)
- The Barrett-Ekman debate's contemporary state (2020s)
- Mood vs. emotion vs. affect distinction

## Depth-dive complete

Five concept pages produced (2026-05-17, see [[Research - Affect Foundations Sweep]]):

- **[[Russell's Affect Circumplex]]** — 2D valence-arousal substrate; the most-empirically-validated dimensional model.
- **[[Plutchik's Wheel of Emotions]]** — 8 primaries + dyadic compounds; the discrete-evolutionary counterpart.
- **[[PAD Emotion Model]]** — adds dominance axis; central to branding and figural work.
- **[[Constructed Emotion Theory]]** — Barrett 2017 alternative to basic-emotions.
- **[[Appraisal Theories of Emotion]]** — Scherer / Lazarus on emotion-causation.

Plus the cross-cluster bridge: **[[Cross-Modal Emotion Mapping]]** — Russell-circumplex as the music ↔ color ↔ form translation surface.

**Key finding from the sweep**: dimensional (V, A) coordinates travel across cultures, modalities, and time better than categorical labels (joy, anger, etc.). Use (V, A) as the portable emotion specification; reach for category labels only in-culture and high-context.

FACS / facial emotion specifics deferred to **[[Face Perception]]** depth-dive (queue item #12, L1 Cleanup sweep).

## Related pages

[[Expression as Configuration of Forces]] · [[Physiognomic Perception]] · [[Color Psychology]] · [[Face Perception]] · [[Body Language and Pose Semantics]] · [[Empirical Aesthetics]] · [[LLM-as-Judge for Visual Quality]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources to consult in depth-dive

- Russell 1980 "A circumplex model of affect" — *Journal of Personality and Social Psychology* 39(6).
- Plutchik 1980 *Emotion: A Psychoevolutionary Synthesis*.
- Ekman 1992 "An argument for basic emotions" — *Cognition & Emotion* 6(3-4).
- Barrett 2017 *How Emotions Are Made: The Secret Life of the Brain*.
- Juslin & Västfjäll 2008 "Emotional responses to music" — *Behavioral and Brain Sciences* 31.
- Mehrabian 1996 PAD scale validation.
