---
title: FACS — Facial Action Coding System
type: concept
status: developing
tags: [concept, face, emotion, facs, ekman, anatomy]
address: c-000110
created: 2026-05-17
sources: ["[[Face Perception]]"]
confidence: high
---

# FACS — Facial Action Coding System

The **Facial Action Coding System** (Ekman & Friesen 1978; revised 2002 with Joseph Hager): an anatomically-grounded taxonomy of **44 facial muscle movements** ("**Action Units**" or AUs), each corresponding to one or a small set of facial muscles. FACS is the **standard analytic vocabulary** for facial expression — used in psychology, behavioral research, animation, computer vision, and clinical assessment.

FACS makes facial emotion **decomposable and computable**. Combinations of AUs map to emotion-expressions according to predictions from emotion theories — though as Barrett 2019 shows, the AU-to-emotion mapping is weaker than originally claimed (see [[Face Recognition Universality Debate]]).

## What an Action Unit is

An **AU** corresponds to:

- A specific facial muscle (e.g., AU4 = corrugator supercilii, which lowers the brow).
- Or a coordinated set (e.g., AU12 = lip-corner puller, primarily zygomaticus major, with additional smaller muscles).

Each AU has:

- A **numerical code** (AU1, AU2, ..., AU45).
- A **descriptive name** ("Inner brow raiser," "Cheek raiser," "Lip stretcher").
- An **intensity scale** A–E (trace → maximal).
- A **laterality marker** (Left, Right, Bilateral).
- An **anatomical basis** (which muscle, what motion).

## Selected major AUs

| AU | Name | Muscle | Description |
|---|---|---|---|
| **AU1** | Inner Brow Raiser | Frontalis (medial) | Raises inner corners of brow; "concerned" or "sad" look |
| **AU2** | Outer Brow Raiser | Frontalis (lateral) | Raises outer brow; "surprised" |
| **AU4** | Brow Lowerer | Corrugator + depressor supercilii | Furrows brow; "angry" or "concentrating" |
| **AU5** | Upper Lid Raiser | Levator palpebrae superioris | Widens eye; "surprise" or "fear" |
| **AU6** | Cheek Raiser | Orbicularis oculi (orbital) | Crow's feet; the **Duchenne** marker for genuine smiles |
| **AU7** | Lid Tightener | Orbicularis oculi (palpebral) | Squints eye; "anger" or "discomfort" |
| **AU9** | Nose Wrinkler | Levator labii superioris alaeque nasi | "Disgust" |
| **AU10** | Upper Lip Raiser | Levator labii superioris | Sneer; "contempt" or "disgust" |
| **AU12** | Lip Corner Puller | Zygomaticus major | Smile; corners of mouth pull up |
| **AU14** | Dimpler | Buccinator | Tightens mouth corners horizontally; "contempt" |
| **AU15** | Lip Corner Depressor | Depressor anguli oris | Frown; corners pull down |
| **AU17** | Chin Raiser | Mentalis | Pushes chin up; pout |
| **AU20** | Lip Stretcher | Risorius | Pulls lips horizontally; "fear" |
| **AU23** | Lip Tightener | Orbicularis oris | Tightens lips inward; "anger" |
| **AU25** | Lips Part | Relaxation of mouth-closing muscles | Mouth slightly open |
| **AU26** | Jaw Drop | Masseter (relaxation) | Mouth open; surprise |
| **AU45** | Blink | Various | Eyelid closure (rapid) |

There are ~30 more, including head-position AUs (AU51–AU58 for head turn/tilt) and gaze-position AUs (AU61–AU66 for eye direction).

## AU combinations for basic emotions (Ekman 1992 predictions)

Each "**basic emotion**" has a canonical prototype expression made of specific AU combinations:

| Emotion | Prototype AU set |
|---|---|
| **Joy / Happiness** | AU6 + AU12 (the **Duchenne smile**) |
| **Sadness** | AU1 + AU4 + AU15 (sometimes + AU17) |
| **Surprise** | AU1 + AU2 + AU5 + AU26 |
| **Fear** | AU1 + AU2 + AU4 + AU5 + AU20 + AU26 |
| **Anger** | AU4 + AU5 + AU7 + AU23 (sometimes + AU24) |
| **Disgust** | AU9 + AU15 + AU16 |
| **Contempt** | AU14 (unilateral; one of the few asymmetric emotions) |

These are **prototypes**, not requirements. Actual emotion-episodes engage subsets, often with intensity-and-asymmetry variation.

## The Duchenne smile

A canonical distinction in FACS:

- **AU12 alone** = social smile / polite smile / posed smile.
- **AU6 + AU12** = **Duchenne smile** — the eye-crinkle accompanying the mouth-pull. Considered the marker of *genuine* enjoyment.

Named for Guillaume Duchenne (1862), the French neurologist who first noted that the orbicularis oculi (AU6) is hard to engage voluntarily — most people can't produce a Duchenne smile on command. So a Duchenne smile is taken as evidence of authentic positive emotion.

Caveats (Krumhuber & Manstead 2009): Duchenne smiles **can** be produced voluntarily by trained subjects, and non-Duchenne smiles **can** accompany genuine emotion. The 1:1 mapping is statistical, not deterministic. But the correlation is real.

## Automatic FACS detection

The contemporary computer-vision implementations:

- **OpenFace** (Baltrušaitis et al. 2018) — open-source toolkit; estimates AU intensities from images / video; trained on FACS-coded datasets.
- **py-feat** (Cheong et al. 2021) — Python toolkit for facial expression analysis; integrates FACS detection + emotion prediction.
- **MediaPipe Face Mesh** (Google) — extracts 468 facial landmarks in real-time; can be combined with classifiers for AU detection.
- **Affectiva / iMotions** — commercial emotion-AI services with FACS-based analysis.

Performance: on benchmark datasets (DISFA, BP4D), modern AU-detection systems achieve $F_1 \approx 0.6–0.8$ depending on the AU. The high end (AU6, AU12, AU25 — large, easy-to-see) is reliable; the low end (AU14, AU17 — small, easy-to-confuse) is shakier.

For generative art / VLM-as-judge pipelines: FACS-based emotion detection from images is **available but imperfect**. Treat AU-detection output as a *coarse-grained* emotional read, not ground truth.

## Cross-cultural validity of FACS

**Anatomical FACS is universal** — facial muscles are the same across cultures and species. **AU-to-emotion mapping is contested**.

Barrett et al. 2019 (see [[Face Recognition Universality Debate]]):

- People in "anger episodes" produce the canonical anger-AU configuration **< 30%** of the time.
- People producing the anger-AU configuration are in anger episodes **< 30%** of the time.
- The 1:1 mapping breaks down under careful naturalistic study.

What survives: **AU configurations are real, anatomically defined, and detectable**. What's contested: **whether they reliably index discrete emotion categories**.

For our purposes: FACS is the **right level of analytic description** for facial expression (anatomically grounded, computable, well-defined). The mapping from FACS to emotion-categories should be treated as **probabilistic**, not deterministic.

## Implications for the wiki's four priorities

| Priority | Use |
|---|---|
| 1. Generative art | Character / portrait generators that specify AU combinations produce more emotionally-coherent faces than ones that specify emotion-category labels (which suffer from constructionist ambiguity — see [[Constructed Emotion Theory]]). |
| 2. Branding | Mascot / persona faces use AU-specified emotional expressions; the brand can deliberately target a specific configural emotion (genuine joy, calm trust, focused concentration). |
| 3. Graphic design | Editorial photography selection / advertising-cast direction: AU-aware casting. |
| 4. Music-reactive visualizers | Rarely face-relevant unless visualizer includes figural content. |

## Connection to Arnheim and the rest of the wiki

- [[Physiognomic Perception]] — Arnheim's "expression as primary content of vision" implies face-perception is *physiognomic-first*. FACS gives anatomical structure to the physiognomic vocabulary.
- [[Expression as Configuration of Forces]] — Arnheim's anti-empathy thesis: facial expression is intrinsic to the configural pattern. FACS gives anatomical grounding to "configuration of facial forces."
- [[Constructed Emotion Theory]] — Barrett's constructionism predicts the FACS-to-emotion mapping is constructed, not biological. The empirical evidence (weak < 30% correlation) supports this.
- [[Body Language and Pose Semantics]] — FACS is to faces what pose-extraction (MediaPipe Pose) is to bodies.

## Caveats

- FACS coding by trained human coders is **labor-intensive** (~1 hour to code 1 minute of video). Automatic detection is faster but less accurate.
- AU detection performance is **better for clearly-visible high-amplitude expressions** than for subtle ones.
- Lighting, head-pose, occlusion all reduce detection accuracy.
- The FACS taxonomy is **descriptive of European-American faces** — was developed and validated on this population. Cross-ethnicity validity is good but not perfect.

## Related pages

[[Face Perception]] · [[The Face-Specific Pathway]] · [[Configural Face Processing]] · [[The Uncanny Valley]] · [[Face Recognition Universality Debate]] · [[Emotion Psychology]] · [[Plutchik's Wheel of Emotions]] · [[Constructed Emotion Theory]] · [[Physiognomic Perception]] · [[Expression as Configuration of Forces]] · [[Body Language and Pose Semantics]] · [[Field Map - Visual Thinking Knowledge Domains]]

## Sources

- Ekman & Friesen 1978 *Facial Action Coding System: A Technique for the Measurement of Facial Movement*. Consulting Psychologists Press.
- Ekman, Friesen & Hager 2002 *Facial Action Coding System: The Manual on CD-ROM* (revised). A Human Face.
- Duchenne 1862 *Mécanisme de la physionomie humaine*.
- Ekman 1992 "An argument for basic emotions" — *Cognition & Emotion* 6(3-4).
- Krumhuber & Manstead 2009 "Can Duchenne smiles be feigned?" — *Emotion* 9(6).
- Baltrušaitis, Zadeh, Lim & Morency 2018 "OpenFace 2.0: facial behavior analysis toolkit" — *13th IEEE FG*.
- Cheong, Xie, Byrne & Chang 2021 "Py-feat: Python facial expression analysis toolbox" — arXiv preprint.
- Barrett, Adolphs, Marsella, Martinez & Pollak 2019 "Emotional expressions reconsidered" — *Psychological Science in the Public Interest* 20(1).
