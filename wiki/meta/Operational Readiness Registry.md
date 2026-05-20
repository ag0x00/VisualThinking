---
title: Operational Readiness Registry
type: registry
status: living
tags: [meta, registry, operational-readiness]
created: 2026-05-19
updated: 2026-05-19
---

# Operational Readiness Registry

> Meta/registry page — **address-exempt** per [[Wiki Methodology]]. Living document; re-score pages here when they are deepened.

Triage map of every `wiki/concepts/` page against the **operational readiness standard** (see [[Wiki Methodology]] §Operational readiness): a concept page must equip three operations, not merely define a concept. This registry is the **Option C** deliverable (decision 2026-05-19): a ranked gap map produced *before* build-and-fill, and the seed/training data for a future `wiki_assessReadiness(concept)` MCP capability.

## The rubric (each operation scored 0 / 1 / 2)

- **Perceive (P)** — explains the perceptual/cognitive **mechanism** (*why* a viewer experiences the effect). 2 = explicit mechanism w/ sources · 1 = names the effect, mechanism thin/asserted · 0 = no perceptual account.
- **Build (B)** — concrete generative levers: rules, **parameter ranges/numbers**, code/pseudocode, named library pointers, AND/OR concrete **LLM prompt formulations**. 2 = concrete buildable levers · 1 = direction only, no numbers/code/prompts · 0 = none.
- **Evaluate (E)** — can **assess an artifact (incl. an external image we did NOT create)** and propose concrete improvements: a metric/score AND code-or-prompt-level fixes. 2 = metric(s) + improvement levers · 1 = qualitative criteria only · 0 = none.

`total = P + B + E` (0–6). **Lower = bigger operational gap.** `primary_app` = the highest-priority application the page materially serves, from the user's ordered list: **1** Generative art · **2** Branding · **3** Graphic design · **4** Music-reactive visualizers. Foundational perception/color/composition substrate that gen-art depends on is tagged **1**.

Scored 2026-05-19 via 7 parallel triage subagents on one shared rubric (fast-score, not deep-dive). 141 concept pages scored; 2 meta pages excluded.

## Headline findings

- **Evaluate is the systemic gap.** ~112 of 141 pages score E < 2. Most pages can describe a mechanism (Perceive strong) and many give build levers, but **few define a metric/score that can assess an external image and propose code-or-prompt fixes** — exactly the capability the standard was written to force. The "critique an image we didn't make" workflow is the wiki's single biggest operational hole.
- **Field-overview and stub pages are the floor.** The lowest scorers are index/overview pages (Emotion Psychology, Perceptual Constants, Algorithmic Composition, Light Vocabulary) and `status: stub` pages that defer all numbers/code to child pages. They are *hubs*, not operational pages — acceptable as routers, but they must point to operational children, and several don't yet.
- **A clear "fully operational" cohort exists** (total = 6, 15 pages): these are the templates to copy — explicit mechanism + concrete levers + a real metric. Examples: Gestalt Principles, Visual Balance, The Structural Skeleton, FACS, Visual Entropy, Fractal Dimension, LLM-as-Judge, Tenebrism, Universal Body Language Dimensions.
- **The active build thread has a flagged gap.** [[Islamic Geometric Patterns and the Polygonal Technique]] scores 1/2/0 = 3 — strong Build (libraries + technique), but **no perceptual mechanism and zero Evaluate**: it cannot yet score whether a generated pattern is *good*. Directly relevant to the toolkit-screensaver build.
- **Dangling dependency:** several pose/face pages (Contrapposto, Universal Body Language Dimensions, FACS) lean on a "Pose Extraction Pipeline" page that does not exist in `wiki/concepts/` — verify it lives in `wiki/techniques/` or queue it.

## Readiness distribution

| Band | app1 Gen-art | app2 Branding | app3 Graphic | app4 Music | total |
|---|---|---|---|---|---|
| **Critical (0–2)** | 11 | 2 | 1 | 0 | **14** |
| **Weak (3)** | 20 | 7 | 1 | 2 | **30** |
| **Partial (4)** | 29 | 4 | 6 | 3 | **42** |
| **Strong (5–6)** | 46 | 1 | 3 | 5 | **55** |
| **Total** | 106 | 14 | 11 | 10 | **141** |

Gen-art (priority 1) holds both the most pages and the most strong pages — expected, since the May sweeps targeted it. Branding (priority 2) is the weakest cohort proportionally: 9 of 14 pages are Critical/Weak, and only 1 is Strong. **Branding is the most under-operationalized priority application.**

## Priority fill queue

Sorted by (priority-app asc, total asc): high-priority + low-readiness floats to top. Re-deepen these first via targeted autoresearch — each fill must close the *specific* operational gap named, not "learn more about X" (see [[Wiki Methodology]] §Operational readiness, and the `npm-audit-before-design` memory's program-style prompt pattern).

**Tier 1 — Gen-art, Critical (total ≤ 2):** the 11 lowest-readiness pages on the top-priority application. Most are field-overviews that should either become operational or be explicitly demoted to router pages with operational children.

**Tier 2 — Gen-art, Weak (total 3):** 20 pages. Includes the build-relevant [[Islamic Geometric Patterns and the Polygonal Technique]] (needs Perceive + Evaluate), [[Aperiodic Tiling and the Hat Monotile]], the lighting-recipe pages (Cinematic Lighting, Three-Point Lighting, PBR Lighting — all missing an Evaluate metric), and the procedural-theory pages (Algorithmic Composition, Procedural Content Generation, Procedural Paradigms).

**Tier 3 — Branding, all Critical/Weak (total ≤ 3):** 9 pages. The most under-served *application*. Branding-specific eval metrics (brand-mark consistency scoring, archetype-fit, cultural-color risk) are absent across the board.

## Full registry (sorted: primary_app ↑, total ↑, page ↑)

### Priority 1 — Generative art

| page | P | B | E | total | gap_note |
|---|---|---|---|---|---|
| Birdwhistell's Kinesics | 1 | 0 | 0 | 1 | Historical anchor; no levers or eval, defers to other pages |
| Framings of Generative Art | 1 | 0 | 0 | 1 | Map/taxonomy only; no levers, no metric (acceptable as index) |
| Algorithmic Art History | 1 | 1 | 0 | 2 | History/lineage only; no params, no metric, no eval |
| Emotion Psychology | 1 | 1 | 0 | 2 | Field overview; mappings promissory, no metric |
| Goethe and Kandinsky on Color | 1 | 1 | 0 | 2 | Vocabulary only; no parameters, no artifact-eval metric |
| Light Vocabulary | 1 | 1 | 0 | 2 | Catalog stub: no numbers, code, or evaluation metric |
| Materials and Texture | 1 | 1 | 0 | 2 | Catalog stub: directional only, no numbers/code/metric |
| Perceptual Constants | 1 | 1 | 0 | 2 | Field-overview index; mechanism deferred, no levers/metric |
| Plutchik's Wheel of Emotions | 1 | 1 | 0 | 2 | Label taxonomy; no generative numbers or eval metric |
| Procedural and Neural Texture Synthesis | 0 | 2 | 0 | 2 | No perceptual mechanism; no texture-match/eval metric |
| The Autonomy-Control Gradient | 1 | 1 | 0 | 2 | Conceptual axis; no parameters, code, or eval metric |
| Algorithmic Composition | 1 | 1 | 1 | 3 | Field overview; defers all numbers/code to child pages |
| Aperiodic Tiling and the Hat Monotile | 1 | 2 | 0 | 3 | No perceptual mechanism; no quality metric or fix path |
| Appraisal Theories of Emotion | 2 | 1 | 0 | 3 | No metric/code to evaluate or assess an artifact |
| Artificial Life Art | 1 | 1 | 1 | 3 | Names handles but no param ranges, code, or output metric |
| Body Language and Pose Semantics | 1 | 1 | 1 | 3 | Stub; computable pose features deferred to child pages |
| Cinematic Lighting Traditions | 1 | 2 | 0 | 3 | No metric to assess/classify a tradition in an image |
| Computational Creativity | 1 | 1 | 1 | 3 | Taxonomy/philosophy; Ritchie criteria not operationalized |
| Constructed Emotion Theory | 2 | 1 | 0 | 3 | No metric or assessment of an artifact |
| Helmholtz Gibson and Bayesian Perception | 2 | 1 | 0 | 3 | Theory page; no build params, no artifact metric |
| Islamic Geometric Patterns and the Polygonal Technique | 1 | 2 | 0 | 3 | Strong build/libs; no aesthetic mechanism or evaluation metric |
| Mehrabian's 55-38-7 Misinterpretation | 1 | 1 | 1 | 3 | Myth-correction; pose-caption alignment lever but no metric |
| Movement Rhythm and Repetition | 1 | 1 | 1 | 3 | Stub; defers concrete levers/metrics to depth-dive |
| Negative Space | 1 | 1 | 1 | 3 | Stub; metrics named only, no formulas/code/prompts |
| PBR Lighting and ACES Tone Mapping | 1 | 2 | 0 | 3 | No evaluation metric for tone-mapped/cinematic output |
| Procedural Content Generation | 1 | 1 | 1 | 3 | Algorithm families named but no params/code/metric |
| Procedural Paradigms | 1 | 1 | 1 | 3 | Taxonomy with strengths/weaknesses; no params, code, or metric |
| Pyramidal Space | 2 | 1 | 0 | 3 | No metric or evaluation of an artifact's space handling |
| Style as System | 1 | 1 | 1 | 3 | Stub; defers computable Wölfflin scorer to depth-dive |
| Three-Point Lighting and Key-Fill Ratio | 1 | 2 | 0 | 3 | No metric to measure key:fill ratio from an image |
| Warm and Cool Colors | 2 | 1 | 0 | 3 | temperature() is a stub; no numbers, no artifact-eval metric |
| AI Art and Latent Space | 1 | 2 | 1 | 4 | No eval metric; no concrete prompt/param recipe to score outputs |
| Berlyne's Arousal-Potential Theory | 2 | 1 | 1 | 4 | Names complexity metrics but no concrete eval pipeline/numbers |
| Color Harmony | 1 | 2 | 1 | 4 | No metric to score whether an external palette achieves harmony |
| Compositional Grids | 1 | 2 | 1 | 4 | Saliency-overlap metric named but no formula or fix levers |
| Cross-Cultural Perceptual Variation | 2 | 1 | 1 | 4 | No concrete params/metrics; design advice stays directional |
| Diffusion-Era Style Transfer | 1 | 2 | 1 | 4 | No metric to score transfer fidelity; eval is qualitative |
| Directed Tension | 2 | 1 | 1 | 4 | Generator vectors described, no formulas/code or scoring metric |
| Dynamic Symmetry | 1 | 2 | 1 | 4 | Armature API sketched; no eye-fit metric or improvement levers |
| Empirical Aesthetics | 2 | 1 | 1 | 4 | Field overview; defers Build+Eval to child pages |
| Face Perception | 2 | 1 | 1 | 4 | Field overview; concrete levers live in child pages |
| Face Recognition Universality Debate | 2 | 1 | 1 | 4 | Cautions but no metric/code to score face emotion |
| Figure and Ground | 2 | 1 | 1 | 4 | 8-cue metric proposed but no code or numeric thresholds |
| Galanter's Generative Art Framework | 2 | 1 | 1 | 4 | Effective-complexity not turned into a generator param |
| Golden Spiral | 1 | 2 | 1 | 4 | Warns against fit-metric; no constructive evaluation/fix path |
| Light Quality Direction and Motivation | 2 | 2 | 0 | 4 | No metric to evaluate/score lighting in an artifact |
| Long-form On-Chain Generative Art | 1 | 2 | 1 | 4 | Consistency/variety/unity named but no computed metric |
| Material Perception | 2 | 1 | 1 | 4 | No PBR numbers/code; eval qualitative only |
| Neuroaesthetics and Individual Variation | 2 | 1 | 1 | 4 | Findings rich; no generative params, no computed metric |
| PBR Material Parameters | 1 | 2 | 1 | 4 | No metric scoring material-read of an artifact |
| Perceptual Concepts | 2 | 1 | 1 | 4 | Gives critic prompt but no parameters/metric; theory hub |
| Perceptual Forces | 2 | 1 | 1 | 4 | Substrate theory; pipeline sketched, no code/numbers |
| Photo Aesthetic Features | 1 | 1 | 2 | 4 | 56 features as eval vocab; thin mechanism; no extraction code |
| Practice-led Studio Research | 1 | 2 | 1 | 4 | Eval leans on external NIMA; no own metric |
| Sfumato | 2 | 1 | 1 | 4 | No code for freq-dependent diffusion; eval qualitative |
| Symbolic Pattern in Composition | 2 | 1 | 1 | 4 | Pattern-to-intent framing; no metric or concrete code |
| Symmetry Groups and Tessellation | 1 | 2 | 1 | 4 | No perceptual mechanism; group-classify metric only sketched |
| The Face-Specific Pathway | 2 | 1 | 1 | 4 | Mechanism-rich; salience levers vague, no metric |
| The Five Visual Constancies | 2 | 1 | 1 | 4 | Overview; no params/numbers, no artifact metric |
| de Gelder's Whole-Body Emotion Perception | 2 | 1 | 1 | 4 | Levers/eval point to other pages; no own numbers |
| Aerial Perspective | 2 | 2 | 1 | 5 | E lever named but no numeric saturation/depth threshold metric |
| Arnheim's Color Syntax | 2 | 2 | 1 | 5 | No metric/threshold to score a palette's harmony class |
| CIEDE2000 | 1 | 2 | 2 | 5 | Thin on perceptual mechanism; metric/code strong |
| Cellular Automata and Reaction-Diffusion | 2 | 2 | 1 | 5 | No metric to score CA/RD output quality; eval qualitative |
| Central Perspective | 2 | 2 | 1 | 5 | E qualitative (VLM unreliable); no convergence-consistency metric |
| Chiaroscuro | 2 | 1 | 2 | 5 | No code/parameter ranges for the falloff function |
| Complementary Colors | 2 | 2 | 1 | 5 | Achromatic-balance check qualitative; no fix-proposal levers |
| Computational Aesthetics | 2 | 1 | 2 | 5 | Prescribes recipe but no concrete generative params |
| Configural Face Processing | 2 | 2 | 1 | 5 | Eval has spacing thresholds but no detector/metric pipeline |
| Disney Animation Principles | 2 | 2 | 1 | 5 | No metric to score motion naturalness of an artifact |
| Expression as Configuration of Forces | 2 | 2 | 1 | 5 | Emotion-to-param mapping; critic prompt qualitative, no metric |
| Hue Brightness Saturation | 2 | 2 | 1 | 5 | Eval is per-axis advice; no scoring metric for an external image |
| Illumination as a Perceptual Layer | 2 | 1 | 2 | 5 | Prompt-only build; lacks numeric levers/code |
| JSON Archetypes for Visual Tasks | 1 | 2 | 2 | 5 | Perceive thin; schemas/code strong; eval archetype concrete |
| L-Systems and Grammars | 2 | 2 | 1 | 5 | No metric to evaluate L-system output; eval qualitative |
| Lightness and Color Constancy | 2 | 2 | 1 | 5 | E names WCAG but no constancy-failure score for image |
| Multimodal Evaluation Loops | 1 | 2 | 2 | 5 | Perceive thin; loop+code+metrics strong for build/eval |
| OKLCH | 2 | 2 | 1 | 5 | No concrete ΔE thresholds to evaluate/critique a palette |
| Op-Art and Cross-Modal Rhythm | 2 | 2 | 1 | 5 | No metric scoring induced-motion strength |
| Organic vs Mechanical Motion | 2 | 2 | 1 | 5 | Has code; no metric to classify motion organic/mechanical |
| Physiognomic Perception | 2 | 2 | 1 | 5 | Proposes physiognomic features but no defined metric/formula |
| Rule of Thirds | 1 | 2 | 2 | 5 | Mechanism thin (saccade hand-wave); no fix prompts |
| Russell's Affect Circumplex | 2 | 2 | 1 | 5 | Arnheim mapping is qualitative; no eval metric/score |
| Shading and Volume | 2 | 2 | 1 | 5 | Eval lacks a numeric volume-readability metric |
| Simplicity (Arnheim) | 2 | 2 | 1 | 5 | Unification subscore pseudocode underspecified; no fix levers |
| Size Constancy and Size Illusions | 2 | 2 | 1 | 5 | Illusion magnitudes given; no per-image evaluation metric |
| Stroboscopic Motion | 2 | 2 | 1 | 5 | Edit-distance threshold heuristic but unquantified metric |
| Style as Rule-System | 1 | 2 | 2 | 5 | 5-axis adherence score present; mechanism thin |
| The Munsell and CIELAB Color Systems | 2 | 2 | 1 | 5 | Eval table points elsewhere; no own metric+fix for an artifact |
| The Uncanny Valley | 2 | 2 | 1 | 5 | Rich mitigations/libs; no detector score for "in valley" |
| Vectorizing Aesthetic Concepts | 1 | 2 | 2 | 5 | Mechanism is meta; concrete metrics + CV-eval pipeline strong |
| Visual Weight | 2 | 2 | 1 | 5 | Full weight code; no artifact-level score or fixes |
| Birkhoff's Aesthetic Measure | 2 | 1 | 2 | 5 | Formula needs operationalized extraction code/params |
| Contrapposto and Pose Canons | 2 | 2 | 2 | 6 | Strong; eval depends on unbuilt Pose Extraction Pipeline |
| Depth by Overlapping | 2 | 2 | 2 | 6 | Strong; metric slightly informal |
| Dynamics of Obliqueness | 2 | 2 | 2 | 6 | Strong; obliqueness fix not auto-derived |
| FACS - Facial Action Coding System | 2 | 2 | 2 | 6 | Strong; eval relies on imperfect external AU detectors |
| Fractal Dimension | 2 | 2 | 2 | 6 | Strong; could add OKLCH/non-binary preprocessing detail |
| LLM-as-Judge for Visual Quality | 2 | 2 | 2 | 6 | Strong eval primitive; could add concrete rubric thresholds |
| Perceptual Gradients | 2 | 2 | 2 | 6 | Strong; 0–1 knobs + count-and-consistency metric |
| Tenebrism | 2 | 2 | 2 | 6 | Strongest light page; minor pigment-black recipe gap |
| The Gestalt Principles of Visual Perception | 2 | 2 | 2 | 6 | Strong; CoM metric + per-principle algorithms/prompt |
| The Structural Skeleton | 2 | 2 | 2 | 6 | Stability code given; no improvement-suggestion step |
| Universal Body Language Dimensions | 2 | 2 | 2 | 6 | Eval depends on unbuilt Pose Extraction Pipeline |
| Visual Balance | 2 | 2 | 2 | 6 | Bias coefficients uncalibrated; no auto fix-generation |
| Visual Entropy | 2 | 2 | 2 | 6 | Strong; metric+code+formulas; no agreed optimum band |

### Priority 2 — Branding

| page | P | B | E | total | gap_note |
|---|---|---|---|---|---|
| Color Psychology | 1 | 1 | 0 | 2 | Field overview; no code/prompt levers, no artifact-eval metric |
| Postdigital Aesthetics | 1 | 1 | 0 | 2 | Theory-heavy; glitch handles vague, no params/metric |
| Cross-Cultural Color Variation | 1 | 1 | 1 | 3 | No code/metric to flag culturally-risky colors in an artifact |
| Cultural Variability in Body Language | 1 | 1 | 1 | 3 | Emblem audit is checklist, no automated detection/score |
| Cultural and Symbolic Iconography | 1 | 1 | 1 | 3 | Stub; no metric, levers deferred to depth-dive |
| Jungian Archetypes and Brand Archetypes | 1 | 1 | 1 | 3 | No metric; no concrete generative levers or fixes |
| Materiality in Graphic Design | 1 | 2 | 0 | 3 | No metric to assess perceived premium/materiality |
| Non-Western Iconographic Systems | 1 | 1 | 1 | 3 | No metric; levers are caveats not generative rules |
| Western Iconographic Systems | 1 | 1 | 1 | 3 | No metric; generative levers thin, no improvement recipe |
| Brand Style Guides as Rule-Systems | 1 | 2 | 1 | 4 | No consistency-scoring metric; eval is qualitative only |
| Ecological Valence Theory | 2 | 1 | 1 | 4 | WAVE formula present but no lookup data/code to score liking |
| Negative Space Techniques | 1 | 2 | 1 | 4 | Metrics listed without thresholds tying score to fixes |
| Type as Voice | 1 | 2 | 1 | 4 | Voice-match eval is qualitative LLM prompt only |
| PAD Emotion Model | 2 | 2 | 1 | 5 | Has coordinate anchors+layout levers; no scoring metric |

### Priority 3 — Graphic design

| page | P | B | E | total | gap_note |
|---|---|---|---|---|---|
| Variable Fonts and Web Typography | 0 | 2 | 0 | 2 | No perceptual mechanism; no artifact evaluation |
| Visual Hierarchy and Typography | 1 | 1 | 1 | 3 | Stub; numbers/code deferred to depth-dive |
| McCloud's Panel Transitions and the Infinite Canvas | 2 | 1 | 1 | 4 | No numbers/code; closure-test unquantified |
| Multilingual Typography | 1 | 2 | 1 | 4 | No metric to assess multilingual layout correctness |
| Panofsky's Three-Level Iconology | 2 | 1 | 1 | 4 | No metric; prompt levers thin, no fix recipes |
| Processing Fluency Theory | 2 | 1 | 1 | 4 | Lists fluency drivers but no numeric ranges/code/score |
| Swiss Grid System | 1 | 2 | 1 | 4 | No metric to score grid adherence of an artifact |
| Typographic Principles | 1 | 2 | 1 | 4 | No metric scoring text-setting quality of an artifact |
| Wölfflin's Five Axes | 1 | 2 | 2 | 5 | 5-axis [-1,1] scoring present; mechanism descriptive only |
| Ma and Yohaku no Bi | 2 | 2 | 2 | 6 | Strong; blank-region metric thin but present |
| WCAG Contrast Ratios | 2 | 2 | 2 | 6 | Fully operational; formula + libs + pass/fail thresholds |

### Priority 4 — Music-reactive visualizers

| page | P | B | E | total | gap_note |
|---|---|---|---|---|---|
| Kinetic and Generative Typography | 1 | 2 | 0 | 3 | No evaluation metric or critique loop for output |
| Time-based Composition | 1 | 1 | 1 | 3 | Stub; concrete scorers/metrics deferred to depth-dive |
| Frame of Reference for Motion | 2 | 1 | 1 | 4 | Frame-candidacy scoring sketched, no formula/numbers/code |
| Live Coding and Algorave | 1 | 2 | 1 | 4 | No metric for visualizer quality; latency lever but no score |
| Music-reactive Visualizers | 1 | 2 | 1 | 4 | Hub page; eval is latency-budget only, no aesthetic metric |
| Cross-Modal Emotion Mapping | 2 | 2 | 1 | 5 | No quantitative metric to score a music-visual mapping |
| Eisenstein's Montage Theory | 2 | 2 | 1 | 5 | No scoring metric for montage-type quality |
| Murch's Six Editing Rules | 1 | 2 | 2 | 5 | Per-cut weighted scoring present; mechanism asserted |
| Negative Space in Motion | 2 | 2 | 1 | 5 | Rich levers; no single artifact-quality score |
| Phenomenal Causality | 2 | 2 | 1 | 5 | 70ms latency budget concrete; no artifact-scoring metric |

### Excluded (meta / non-concept)

| page | reason |
|---|---|
| DragonScale Memory | Memory-system page, not a visual concept |
| Library Evaluation Rubric | Meta rubric, not a visual concept |

## How to use this registry

1. **Build-and-fill** against the Priority fill queue: re-deepen top-of-queue pages via targeted autoresearch, each fill closing the specific named gap.
2. **Re-score in place** after a page is deepened (edit its row; bump `updated`).
3. **Seed `wiki_assessReadiness`**: this table is the training/eval set for a future MCP tool that scores any concept on P/B/E and emits the autoresearch program to close the gap. Connects the standalone eval pages — [[Multimodal Evaluation Loops]], [[LLM-as-Judge for Visual Quality]], [[Photo Aesthetic Features]] — into per-concept evaluation hooks.

Related: [[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]]
