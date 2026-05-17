---
title: Research - Body Language Depth Sweep
type: research
status: complete
tags: [research, sweep, body-language, synthesis]
address: c-000210
created: 2026-05-17
updated: 2026-05-17
sweep: body-language-depth
covers_items: [11]
---

# Research — Body Language Depth Sweep

**Sweep 6 of the locked clustered-sweep sequence. Completed 2026-05-17.** Single-item depth-dive on priority #11 (body language / pose semantics). Lightest sweep in the queue — Arnheim-leveraged, [[Face Perception]]-adjacent. Catalog stub: [[Body Language and Pose Semantics]] (c-000084).

## Question

What is the field of body-language and pose semantics, what does it supply for the four wiki priorities, and what computable handles does it provide for generative work?

## Sweep deliverables (6 pages + this synthesis)

| Page | Address | Role |
|---|---|---|
| [[Universal Body Language Dimensions]] | c-000203 | **Structural anchor** — 5 dimensions (approach/avoidance, expansion/contraction, up/down, stability, energy). The programmable surface. |
| [[Birdwhistell's Kinesics]] | c-000204 | **Historical anchor** — first systematic framework; largely superseded but partial contributions survive. |
| [[Mehrabian's 55-38-7 Misinterpretation]] | c-000205 | **Empirical correction** — blocks the most-quoted body-language myth; preserves the narrow legitimate finding. |
| [[de Gelder's Whole-Body Emotion Perception]] | c-000206 | **Contemporary empirical anchor** — EBA/FBA, dimensional reading, cross-cultural results. |
| [[Cultural Variability in Body Language]] | c-000207 | **Cultural-overlay layer** — emblem catalog, proxemics, gesture conventions; high-stakes for global work. |
| [[Contrapposto and Pose Canons]] | c-000208 | **Art-historical pose canon** — Polykleitos → Michelangelo → comics → 3D rigging; 6-feature computable contrapposto score. |
| [[Pose Extraction Pipeline]] | c-000209 | **Tools layer** — MediaPipe / MoveNet / RTMPose / Sapiens comparison; recommended stacks per priority. |

## Key findings

### 1. The dimensional framework holds

[[Universal Body Language Dimensions]] supplies the wiki's working model of body-emotion: 5 orthogonal dimensions (approach/avoidance, expansion/contraction, up/down, stability, energy) parameterize discrete emotion readings via combinatorial mapping. Empirically anchored in [[de Gelder's Whole-Body Emotion Perception]] and consistent with Arnheim's [[Expression as Configuration of Forces]].

**Programmable consequence**: prompts and evaluation should specify dimensions rather than labels. "Approach 0.7, expansion 0.8, upward 0.6, stable, medium energy" is more transferable than "confident."

### 2. The body channel is independent of the face

The EBA/FBA findings (Downing et al. 2001; Peelen & Downing 2005) and dissociations between prosopagnosia (face-recognition deficit) and body-emotion-reading establish that the body channel is **neurally and computationally distinct** from the face channel. Implication for generation: **specify body and face emotions separately**, and verify alignment — observers will trust whichever is more vivid when they conflict (the narrow legitimate Mehrabian finding).

### 3. The structural-linguistic framing failed; the dimensional one succeeds

Birdwhistell's kinesics (phoneme-analog kinemes, syntactic combination) did not pan out empirically. The contemporary dimensional + continuous-gesture framing (McNeill, de Gelder, Tsakiris) does. Body language is not a code; it's a **dimensional perceptual readout**.

### 4. Mehrabian's 55-38-7 is a myth in the popular form, real in narrow form

The fixed-partition claim ("93% nonverbal") is widely misquoted. Mehrabian's actual finding applies only to **single-word inconsistent-channel** judgments of speaker attitude. The narrow finding — **observers weight body and voice over words when channels conflict** — is a useful design principle for figurative work, branding photography, and music-reactive visualizers.

### 5. The cultural-overlay layer is high-stakes for global work

Per [[Cultural Variability in Body Language]], the emblem catalog (thumbs-up, OK-sign, V-back-of-hand, head-shake direction, beckoning) carries high-risk cross-cultural inversion. The dimensional substrate transfers; specific gestures do not. For global branding, **avoid emblems** or **localize them**.

### 6. Contrapposto is computable

[[Contrapposto and Pose Canons]] extracts a 6-feature score from a pose-skeleton: hip-shoulder counter-rotation, weight asymmetry, free-leg flex, spinal S-curve, head-tilt, center-of-mass stability. The score discriminates **alive-figurative** poses from **wooden / mid-action** poses. This is the figurative-generation pose-evaluation primitive.

### 7. The 2026 tools stack is clear

[[Pose Extraction Pipeline]]: **MediaPipe Tasks** for accuracy + JS-first ergonomics, **MoveNet Lightning** for realtime browser performance, **RTMPose / Sapiens via ONNX** for offline batch when accuracy matters. The JS/TS ecosystem is mature for browser pipelines.

## Application priority alignment

| Priority | Body-language deliverables |
|---|---|
| **1. Generative art** | Dimensional pose specification, contrapposto scoring, body-face alignment checks, pose-skeleton evaluation pipeline. |
| **2. Branding** | Executive-photo / brand-photo emblem audit; pose-archetype mapping; cultural-validation for global campaigns. |
| **3. Graphic design** | Editorial photography pose-feature evaluation; stock-imagery emblem checking. |
| **4. Music-reactive visualizers** | MoveNet → audio-feature-modulated body-driven rendering; cross-modal dimensional mapping (rising pitch → upward dimension, spectral spread → expansion). |

## Six conventions applied

Per [[Wiki Methodology]] (Phase 4 lock-in, 2026-05-17):

### #1 Catalog-stub cross-check

The [[Body Language and Pose Semantics]] stub listed: Darwin, Birdwhistell, Mehrabian, de Gelder, Muybridge, Polykleitos, Donatello, Michelangelo + concepts (universal dimensions, contrapposto, gesture/proxemics, power-pose research). Coverage check:

| Stub item | Where covered |
|---|---|
| Darwin (1872) | Cited in [[Universal Body Language Dimensions]] and [[Birdwhistell's Kinesics]] as evolutionary universalist anchor |
| Birdwhistell | Full page [[Birdwhistell's Kinesics]] |
| Mehrabian | Full page [[Mehrabian's 55-38-7 Misinterpretation]] |
| de Gelder | Full page [[de Gelder's Whole-Body Emotion Perception]] |
| Muybridge | Cited in [[Contrapposto and Pose Canons]] indirectly (motion-analysis tradition); not given a dedicated page — historical photography is bio-territory, programmability-principle excludes |
| Polykleitos, Donatello, Michelangelo | [[Contrapposto and Pose Canons]] (attribution-only, no biography pages) |
| Universal body dimensions | [[Universal Body Language Dimensions]] |
| Contrapposto, pose-as-narrative | [[Contrapposto and Pose Canons]] |
| Gesture/proxemics/emblems | [[Cultural Variability in Body Language]] |
| Power-pose research | Briefly cited in stub; **expanded in this synthesis** — Carney/Cuddy/Yap 2010 *correlation* of expansive-pose ↔ dominant-attribution-by-observer is robust; *causal* hormonal claim failed replication (Ranehill 2015; Garrison 2016). For generation: observers read expansive poses as dominant regardless of poser's hormones. Not given a dedicated page because the empirical-cause claim is dead and the observer-attribution claim is subsumed by [[Universal Body Language Dimensions]] dimension 2 (expansion). |
| MediaPipe / OpenPose pose extraction | [[Pose Extraction Pipeline]] |
| Animation 12-principles overlap | Cross-referenced; pre-existing page [[Disney Animation Principles]] (c-000188 from Sweep 5) already covers anticipation / follow-through / exaggeration. |

**Cross-check passes**: every stub item either has a dedicated page, is covered by attribution in another page, or is explicitly noted as subsumed/dead.

### #2 Framing-canonicity audit

| Framework | Status | Where flagged |
|---|---|---|
| Darwin universalism (1872) | Partially correct — universal substrate at dimensional level; over-extended on specific emotional displays | [[Universal Body Language Dimensions]] cross-cultural section |
| Birdwhistell kinesics | **Mostly superseded**; gesture studies (McNeill, Kendon) and embodied-cognition replaced the structural-linguistic framing | [[Birdwhistell's Kinesics]] framing-canonicity audit |
| Mehrabian 55-38-7 popular form | **Myth**; narrow finding remains useful | [[Mehrabian's 55-38-7 Misinterpretation]] (whole page) |
| de Gelder dimensional framework | Defensible-not-settled; remains live; tension with [[Constructed Emotion Theory]] noted | [[de Gelder's Whole-Body Emotion Perception]] framing-canonicity section |
| Hall proxemic distances (1966) | Schema holds; specific distances do not generalize | [[Cultural Variability in Body Language]] proxemics caveat |
| Polykleitos / contrapposto canon | Lasting structural value (computable); **Western-art-historical** convention, not cross-cultural aesthetic preference | [[Contrapposto and Pose Canons]] cross-cultural section |
| Carney/Cuddy/Yap power-pose causal claim (2010) | **Empirically dead**; correlational reading-claim survives | Noted above + in catalog-stub cross-check |

Pattern: 5 of 7 frameworks had named contestation, consistent with Phase 3's ~75% base-rate finding.

### #3 npm / GitHub audit

Conducted in [[Pose Extraction Pipeline]] npm audit section. Key surveyed packages: `@mediapipe/tasks-vision`, `@tensorflow-models/pose-detection`, `onnxruntime-web`, `@xenova/transformers`, `kalidokit`. Top-15 by weekly downloads identified; no major missed packages.

### #4 Source-fetch fallback ladder

All primary sources accessible via citations and public abstracts. No live-fetch attempts on PDFs needed for this sweep (every key paper had sufficient public secondary-source coverage; de Gelder 2016 *Emotions and the Body* exists in summary form in multiple review articles). **No gap flags needed**.

### #5 Cross-cultural validity flag

Applied heavily — the cross-cultural overlay is the central theoretical move of this sweep. Each page carries explicit cultural-validity statements:

- [[Universal Body Language Dimensions]] — dimensions universal; labels cultural; Tracy & Robins 2008 + Crivelli et al. 2017 cited.
- [[Birdwhistell's Kinesics]] — kinesics rejected universalism (correctly for emblems, over-extended for dimensions).
- [[Mehrabian's 55-38-7 Misinterpretation]] — Western-sample-only; no cross-cultural claim.
- [[de Gelder's Whole-Body Emotion Perception]] — explicit cross-cultural section with WEIRD-bias acknowledgment.
- [[Cultural Variability in Body Language]] — entire page is the cultural-overlay layer.
- [[Contrapposto and Pose Canons]] — explicit cross-cultural section (tribhanga, Japanese woodblock, African / pre-Columbian).
- [[Pose Extraction Pipeline]] — model-training-data bias flag for non-WEIRD clothing / postures.

### #6 Successor-theory tracking

Applied to every pre-2000 anchor:

| Anchor | Era | Named successor(s) |
|---|---|---|
| Darwin 1872 *Expression of the Emotions* | 1872 | Plutchik, Ekman, de Gelder (dimensional / embodied successors); see [[Emotion Psychology]] |
| Polykleitos *Canon* ~440 BCE | Antiquity | Lomazzo *Trattato* 1584; Hogarth *Dynamic Anatomy* 1958; contemporary 3D rigging IK |
| Birdwhistell *Kinesics and Context* 1970 | 1970 | McNeill 1992 *Hand and Mind*; Kendon 2004 *Gesture*; embodied cognition (Gallese); de Gelder |
| Mehrabian *Silent Messages* 1971 | 1971 | Hall 2006; Patterson 2011; Vrij et al. 2019 (lie-detection field correction) |
| Hall *The Hidden Dimension* 1966 | 1966 | Sorokowska et al. 2017 (42-country replication) |
| Carney/Cuddy/Yap power-pose 2010 | 2010 | Ranehill 2015; Garrison 2016 (failed replications) — successor is "this finding doesn't replicate" |
| Ekman & Friesen 1969 emblems | 1969 | Morris et al. 1979; Axtell 1998; Matsumoto & Hwang 2013 |

## Connections to prior sweeps

| Prior sweep | Connection |
|---|---|
| **Arnheim depth-dives (Sweeps 1-3)** | [[Expression as Configuration of Forces]] is the abstract theoretical predecessor of [[Universal Body Language Dimensions]]. [[Directed Tension]] is the structural principle behind [[Contrapposto and Pose Canons]]. Body-language is one of the cleanest "Arnheim → contemporary empirics" alignment cases in the wiki. |
| **Affect Foundations (Sweep 1)** | [[PAD Emotion Model]], [[Russell's Affect Circumplex]], [[Plutchik's Wheel of Emotions]], [[Constructed Emotion Theory]] all interact with body-emotion dimensional reading. Tension with Barrett's constructed-emotion theory noted in de Gelder page. |
| **L1 Cleanup (Sweep 2)** | [[Face Perception]], [[Configural Face Processing]], [[The Face-Specific Pathway]] are the face-channel parallels. Body and face channels are dissociable; pair them carefully. |
| **Movement-Rhythm-Style-Symbolism (Sweep 5)** | [[Disney Animation Principles]] (anticipation, exaggeration, arc) operates on contrapposto-axis movement. [[Jungian Archetypes and Brand Archetypes]] specify pose vocabularies that interact with the cultural-overlay layer. |
| **Practical Design (Sweep 4)** | Brand photography — executive-headshot conventions are contrapposto-defined. |

## Open threads

- **Build a contrapposto scorer** on the AVA / GenAI-Bench / SAM-2 segmented image data. Validate score against human "alive" / "wooden" ratings of figures.
- **Cultural-emblem auto-detector** — train a MediaPipe-hand-landmark → emblem classifier for the high-risk set; flag generated imagery containing them.
- **Cross-modal pose-rhythm coupling**: how well do pose-skeleton-energy features track musical-rhythm features in dance videos? Useful for music-reactive visualizer training.
- **Pose-emotion VLM benchmark**: how well do Claude Opus 4.7 / GPT-5 / Gemini 2.5 read body-emotion vs face-emotion? Predict body channel is *worse* given training-data emphasis on face.
- **Multi-figure proxemics scoring**: distance between figure pose-skeletons → relationship reading score. Validate on stock-imagery sets tagged "team / family / couple / strangers."
- **Indian classical *tribhanga* pose** — depth-dive (currently mentioned in [[Contrapposto and Pose Canons]] cross-cultural section). Compute *tribhanga*-vs-contrapposto distinction from skeletons.

## What this sweep does NOT cover

- **Animal-locomotion / Muybridge tradition** — programmability-principle deferral; would only need a page if motion-analysis becomes a research direction.
- **Carney/Cuddy/Yap power-pose causal mechanism** — explicitly noted as dead claim; no dedicated page.
- **Detailed brand-photography pose-taxonomy across top-100 brands** — flagged in catalog stub as future empirical project; deferred to research / data-collection phase, not a wiki concept page.
- **Implementation-level techniques** — reserved for Sweep 7 (Implementation-notes pass) per `feedback_implementation-in-sweeps`. Queued at top of [[Pose Extraction Pipeline]].

## Status

Sweep 6 complete. **Sweep 7 — Implementation-notes pass** is the only remaining locked-sequence item. The 15-gap priority queue is now fully covered as a *reading layer*; remaining work is the implementation translation.

## Related pages

[[Body Language and Pose Semantics]] · [[Universal Body Language Dimensions]] · [[Birdwhistell's Kinesics]] · [[Mehrabian's 55-38-7 Misinterpretation]] · [[de Gelder's Whole-Body Emotion Perception]] · [[Cultural Variability in Body Language]] · [[Contrapposto and Pose Canons]] · [[Pose Extraction Pipeline]] · [[Expression as Configuration of Forces]] · [[Face Perception]] · [[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]]
