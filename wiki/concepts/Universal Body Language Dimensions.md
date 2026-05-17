---
title: Universal Body Language Dimensions
type: concept
status: developing
tags: [body-language, pose, emotion, dimensions, structural, programmable]
address: c-000203
created: 2026-05-17
updated: 2026-05-17
sweep: body-language-depth
---

# Universal Body Language Dimensions

The **structural anchor** of body-language semantics. Five orthogonal dimensions that — when applied to a posed human figure — parameterize the emotional reading observers report. Empirically grounded in [[de Gelder's Whole-Body Emotion Perception]] and consistent with Darwin's (1872) evolutionary thesis, Arnheim's [[Expression as Configuration of Forces]], and the [[PAD Emotion Model]].

This page is the **programmable surface** of body-language work for the wiki: every dimension is computable from a pose-extraction skeleton (see [[Pose Extraction Pipeline]]).

## The five dimensions

| # | Axis | Pose features | Affective valence |
|---|---|---|---|
| 1 | **Approach ↔ avoidance** | Body forward-lean / torso-rotation toward referent vs backward-lean / torso-twist away | Approach: anger, joy, dominance. Avoidance: fear, disgust, submission. |
| 2 | **Expansion ↔ contraction** | Limbs extended outward (open chest, arms wide, legs apart) vs limbs pulled inward (arms crossed, shoulders hunched) | Expansion: confidence, joy, anger. Contraction: fear, sadness, submission. |
| 3 | **Upward ↔ downward** | Head/chin lifted, gaze up, spine extended vs head dropped, gaze down, spine slumped | Upward: pride, joy, dominance. Downward: shame, sadness, defeat. |
| 4 | **Stability ↔ instability** | Balanced weight over feet, vertical spine vs falling, off-balance, leaning past center of mass | Stable: calm, formal, dead. Unstable: action, fear, surprise. |
| 5 | **Energy / arousal** | Tense musculature, sharp angles, high-frequency micro-tension vs slack musculature, smooth curves, low tension | High: anger, joy, fear. Low: sadness, boredom, calm. |

## Combinatorics → discrete emotions

The dimensions are not independent in practice — they covary in human posture — but the principal-axis combinations name conventional emotion categories:

| Emotion | Approach/Avoid | Expand/Contract | Up/Down | Stability | Energy |
|---|---|---|---|---|---|
| Fear | Avoid | Contract | Down | Unstable | High |
| Anger | Approach | Expand | Variable | Stable | High |
| Sadness | Avoid (passive) | Contract | Down | Stable | Low |
| Joy | Approach | Expand | Up | Variable | High |
| Submission | Avoid | Contract | Down | Stable | Low |
| Dominance | Approach (or static) | Expand | Up | Stable | Medium |
| Surprise | Static | Expand | Up | Unstable | High |
| Pride | Static | Expand | Up | Stable | Medium |
| Shame | Avoid | Contract | Down | Stable | Low |
| Disgust | Avoid | Contract | Variable | Stable | Medium |

Compare to the [[PAD Emotion Model]] (Pleasure-Arousal-Dominance): expansion/contraction and up/down jointly track **dominance**; approach/avoidance tracks **pleasure**; energy directly tracks **arousal**. The 5-axis body schema is **richer** than PAD — body has a separate stability dimension that PAD compresses into arousal.

## Mapping to Arnheim's primitives

The dimensions are a direct expression of Arnheim's [[Expression as Configuration of Forces]] thesis. Arnheim argued the body *literally has* expression — observers don't project feelings into it; they read the configuration of forces. The de Gelder dimensions are the operational form of that claim:

| Arnheim primitive | Body dimension |
|---|---|
| Expansion / contraction | Dimension 2 |
| Rising / falling | Dimension 3 (up/down) |
| Approach / withdrawal | Dimension 1 |
| Stability / instability | Dimension 4 |
| Tension / relaxation | Dimension 5 |

The Arnheim → de Gelder mapping is one of the cleanest "abstract theory predicts contemporary empirical findings" alignments in the wiki. See also [[Cross-Modal Emotion Mapping]] for the audio-visual extension (rising musical pitch → dimension 3 in figural visualizers).

## Cultural-validity flag

> [!note] Universal substrate + cultural overlay (per `feedback_cross-cultural-validity` memory)
> The 5 dimensions are **substrate-level**: cross-culturally validated in de Gelder's lab (Western + East-Asian + African samples). The *mapping from dimension-combinations to discrete emotion labels* shows cultural variation — e.g., the "pride" expansion/up combination is consistently read as pride in Western samples but as *arrogance* in some East-Asian samples (Tracy & Robins 2008; replicated by Crivelli et al. 2017). The dimensions themselves are robust; the labels are negotiated. For generative work, **prefer specifying dimensions over specifying emotion labels** when targeting global audiences.

See [[Cultural Variability in Body Language]] for the emblem/gesture layer where universality fails entirely.

## Successor-theory check

de Gelder's whole-body framework (2016 review) remains the contemporary anchor. Updates since:

- **Predictive-processing body schema** (Tsakiris 2017; Apps & Tsakiris 2014) — recasts the dimensions as Bayesian priors observers bring to figure-recognition. Compatible with the dimensional account; specifies *how* observers decode quickly.
- **Embodied-simulation** (Gallese 2007; Freedberg & Gallese 2007) — mirror-neuron based account: viewers covertly mimic the posture and read their own simulated affect. Empirically contested (mirror-neuron-causation claims have been pushed back; Hickok 2014), but the *correlation* of viewer-muscle-EMG with figure-pose-tension is robust.
- **Computational pose-affect models** (e.g., Tian et al. 2023; Lazaridou et al. 2024 on VLM body-emotion reading) — direct ML implementations of dimension-based classification.

No named successor theory has displaced the 5-dimension framework as of 2026. It remains live.

## Programmable handles

For generation:

- **Specify pose by dimension**, not by emotion label. Prompts like "approach=0.7, expansion=0.8, upward=0.6, stable=1.0, energy=0.5" are more transferable than "happy" / "confident."
- **Combine dimensions for compound emotions**. The dimensions are linear-combinable in observer reading; pride = expansion + up + stable.
- **Cross-modal**: in real-time music-reactive visualizers, drive expansion from spectral spread, upward from pitch height, energy from RMS, approach/avoidance from stereo-image, stability from beat-grid lock.

For evaluation:

- **Compute pose features from a [[Pose Extraction Pipeline|skeleton]]**. Shoulder-hip line vs vertical = up/down. Limb-extension distance / body height = expansion. Center-of-mass over base of support = stability. Joint-angular-velocity variance = energy (for video).
- **Validate generated figurative work** by scoring against intended dimension targets.

## Related pages

[[de Gelder's Whole-Body Emotion Perception]] · [[Birdwhistell's Kinesics]] · [[Mehrabian's 55-38-7 Misinterpretation]] · [[Cultural Variability in Body Language]] · [[Contrapposto and Pose Canons]] · [[Pose Extraction Pipeline]] · [[Body Language and Pose Semantics]] · [[Expression as Configuration of Forces]] · [[Directed Tension]] · [[PAD Emotion Model]] · [[Russell's Affect Circumplex]] · [[Cross-Modal Emotion Mapping]]

## Sources

- de Gelder, B. (2016). *Emotions and the Body*. Oxford UP.
- Tracy, J. L., & Robins, R. W. (2008). The nonverbal expression of pride: Evidence for cross-cultural recognition. *Journal of Personality and Social Psychology* 94, 516–530.
- Crivelli, C., Russell, J. A., Jarillo, S., & Fernández-Dols, J.-M. (2017). Recognizing spontaneous facial expressions of emotion in a small-scale society of Papua New Guinea. *Emotion* 17(2), 337–347.
- Tsakiris, M. (2017). The multisensory basis of the self: From body to identity to others. *QJEP* 70(4), 597–609.
- Hickok, G. (2014). *The Myth of Mirror Neurons*. W. W. Norton.
- Arnheim, R. (1974). *Art and Visual Perception*. UC Press. (Chapters V, VII, X.)
