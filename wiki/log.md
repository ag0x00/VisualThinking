---
title: Activity Log
tags: [meta, log]
status: living
---

# Activity Log

Chronological wiki activity. Newest first.

## 2026-05-23 ingest | Application-Based Principles of IGPs (Azari et al. 2023)
- Source: `~/Downloads/s40494-022-00852-w.pdf` — *Heritage Science* 11:22 (2023), open access CC-BY.
- Summary: [[Application-Based Principles of Islamic Geometric Patterns (Azari et al. 2023)]] (c-000231)
- Pages created: [[Application-Based Principles of Islamic Geometric Patterns (Azari et al. 2023)]], [[The Variation Principle in Islamic Geometric Patterns]] (c-000232)
- Pages updated: [[Islamic Geometric Patterns and the Polygonal Technique]] (added the radial/polygon-in-contact/symmetry-group generation trichotomy + a variation cross-ref; removed a verbatim-duplicated Implementation-landscape section), `wiki/index.md`
- Key insight: one IGP transforms into another by sweeping the **contact angle** (acute/median/obtuse; *Tond/Shol/Tond-o-Shol*); varied continuously — spatially or over time — patterns **flow into each other**. Maps directly onto the toolkit's strapwork θ knob (temporal morph + spatial gradient + per-cell re-decoration animation models).

## 2026-05-18 — Build phase begins; toolkit-screensaver brainstorm + IGP library audit

- **Subsystem A (MCP) shipped**: PR #1 merged. `@visualthinking/wiki-mcp@0.1.0`. Registered at `.mcp.json` for project-local consumption. Known gap (logged to `mcp/tasks/lessons.md`): `wiki_orient` under-surfaces named-tradition terms.
- **Auto-memory relocated**: moved from `~/.claude/projects/-Users-ag-Lab-VisualThinking/memory/` into `.claude/memory/` (committed; symlinked from harness location for compatibility). Future sessions see project state inline.
- **Branch `toolkit-screensaver` opened**: brainstorm for Subsystem B-via-C (toolkit + macOS screensaver). Visual genre: Samarkand IGPs (Timurid blue-tile aesthetic, 9 user-provided reference images).
- **Mid-brainstorm reframing**: user redirected — "the goal of this exercise is NOT to build a screensaver, actually. it's to figure out what works and what doesn't in our wiki+mcp+toolkit approach." Captured as memory entries `feedback_test-artifact-vs-workflow.md` and `feedback_npm-audit-before-design.md`.
- **IGP library audit (4 parallel subagents)**: synthesis in [[Research - IGP Library Landscape 2026-05-18]] (c-000226). New tool pages: [[tactile-js]] (c-000227), [[wallpaper-groups]] (c-000228), [[PlotBoilerplate]] (c-000229). Augmented [[Islamic Geometric Patterns and the Polygonal Technique]] (c-000191) with Implementation Landscape section. Augmented [[Symmetry-Group Pattern Generator]] (c-000221) with Build vs Borrow table.
- **Workflow lessons surfaced**:
  1. The wiki had concept-depth on IGPs but no tool-depth — corrected
  2. `wiki_orient` weighting under-surfaces named-tradition terms — logged for MCP refinement
  3. npm-search audit applies to build phases too, not just catalog phases — new convention memory
  4. Test artifact ≠ goal; workflow is the product — new convention memory
- **Addresses reserved**: c-000226 through c-000229 (4 used; c-000230 reserved unused). Counter at 230.

## 2026-05-17 — Wiki-lint cleanup pass
- Ran `claude-obsidian:wiki-lint` post-Sweep-7. Vault health strong; remaining items mostly convention drift.
- Applied 3 safe auto-fixes + 5 needs-review items in same session:
  1. Added `type: meta` to [[Wiki Methodology]] — silences address-required false positive.
  2. Stripped `[[Arnheim's]]` parse artifacts in 3 source pages.
  3. Fixed stale wikilink `[[Algorithmic Composition and Tools Sweep]]` → aliased form.
  4. Converted 5 memory-file wikilinks to backtick form (`feedback_implementation-in-sweeps`, `feedback_algo-comp-before-tools`, `feedback_catalog-stub-cross-check`, `feedback_clustered-sweeps`, `feedback_language-preference`) across 7 files — clearer convention separation between wiki-page links and memory citations.
  5. Created 2 stub pages: [[Music-reactive Visualizers]] (c-000224, priority-4 hub linking concepts + tools + techniques) and [[culori]] (c-000225, the default color library promoted by Sweep 7).
  6. Backfilled `type:` frontmatter on 28 concept pages (mostly pre-rollout 2026-05-15 + early-Sweep batches that omitted the field).
  7. Linked [[Discovery Methodology Plan]] from [[Wiki Methodology]] sweep-status table (process tracker discoverable).
  8. Fixed case mismatch `[[Music-reactive visualizers]]` → `[[Music-reactive Visualizers]]` in 6 pages; unlinked `[[Processing]]`, `[[ONNX Runtime]]`, `[[Magenta.js]]` (no separate pages warranted).
- Final state: **239 pages, 0 orphans, 0 actionable dead links**. The 5 remaining dead-link reports are all inside the symlinked [[DragonScale Memory]] page — informational only, not editable in our vault.
- Counter: 226; next free address c-000226.

## 2026-05-17 — Implementation-notes Pass (Sweep 7, all-revisited)
- **7th and FINAL clustered sweep** in the locked sequence. Translates the reading layer (concept + tool pages from Sweeps 1-6) into the technique layer (`wiki/techniques/`).
- 12 technique pages created (c-000211..c-000222) + 1 synthesis (c-000223). All JS/TS first per `feedback_language-preference`. All include calibration procedure, library recommendations with weekly-download justification, performance budget, validation reference cases.
- Pages organized by domain:
  - **Color & contrast (2)**: [[OKLCH Pair-Relation Classifier]] (Arnheim's 4 hue-pair classes; top research project from Sweep 2), [[Contrast Checking Pipeline]] (WCAG 2 + APCA hybrid)
  - **Composition scoring (3)**: [[Directed Tension Score]] (5-generator sum; top research project from Sweep 3), [[Visual Hierarchy and Negative Space Scoring]], [[Aesthetic Measure Stack]] (Birkhoff + entropy + fractal D + Datta 56)
  - **Body language (3)**: [[Pose-Emotion Dimension Scorer]] (5-axis from MediaPipe 33), [[Contrapposto Scorer]] (6-feature), [[Cultural Emblem Detector]] (hand-landmark patterns for thumbs-up/OK-sign/V-back-of-hand/crossed-fingers/beckoning/pointing)
  - **Real-time / cross-modal (2)**: [[Audio-to-Visual Cross-Modal Mapping]] (Meyda features → Arnheim primitives; 70 ms Michotte budget), [[Realtime Pose-to-Visualizer Loop]] (MoveNet + WebGPU + AudioWorklet)
  - **Generative (2)**: [[Symmetry-Group Pattern Generator]] (17 wallpaper groups + Hat monotile + Islamic-IGP Bonner polygonal), [[Style Transfer Pipeline]] (IP-Adapter + ControlNet + ICAS)
  - **Synthesis**: [[Research - Implementation-notes Pass]] (c-000223)
- All 6 conventions applied:
  - **#1 catalog-stub cross-check**: each technique page maps explicitly via `implements:` frontmatter; subset deferred (PBR/light/iconography databases) explicitly noted in synthesis
  - **#2 framing-canonicity**: Style transfer page documents Gatys 2015 (historical) → IP-Adapter+ControlNet (2026) succession; Aesthetic Measure Stack flags Birkhoff/Berlyne mixed empirical support
  - **#3 npm/GitHub audit**: every technique cites specific packages with download counts; default stack consolidated (culori, MediaPipe Tasks, TFJS WebGPU, OpenCV.js, three.js, meyda, AudioWorklet, Anthropic SDK)
  - **#4 source-fetch fallback**: not exercised (no fetch failures)
  - **#5 cross-cultural validity**: explicit flag on pose dimensions, emblem detector, style transfer, audio-to-visual, symmetry — all 5 cross-culturally-variable techniques
  - **#6 successor-theory**: Gatys → IP-Adapter+ControlNet documented; aesthetic-measure caveats; power-pose dead-claim noted
- Key findings:
  1. **The wiki's evaluation primitives compose** — a generative-art pipeline can stack OKLCH classifier + Directed Tension + Hierarchy/Neg-Space + Aesthetic Measure Stack + Pose-Emotion + Contrapposto + Cultural Emblem Detector into a single multi-axis evaluator. The wiki has accumulated a meaningful evaluation pipeline.
  2. **Realtime budget is achievable**: 20-50 ms total for AudioWorklet + MoveNet Lightning + mapping + WebGPU renderer; well inside Michotte 70 ms threshold.
  3. **Cloud inference is right default for diffusion**; local for audio+pose loops.
  4. **VLM scoring** (Claude Opus 4.7 / GPT-5 / Gemini 2.5) is reliable for style-preservation + composition-quality + pose-emotion validation as final-arbiter.
  5. **Top research projects unblocked**: Directed Tension scorer (Sweep 3 top project), OKLCH Pair-Relation Classifier (Sweep 2 top), Pose-Emotion + Contrapposto scorers (Sweep 6) all operationally specified.
- Default tech stack consolidated across pages: **culori + @mediapipe/tasks-vision + @tensorflow/tfjs (WebGPU backend) + @xenova/transformers + OpenCV.js + three.js / r3f + meyda + AudioWorklet + @anthropic-ai/sdk**. Confirms 2026 JS/TS-first default per `feedback_language-preference`.
- **LOCKED SWEEP SEQUENCE COMPLETE**: 7 sweeps done. 15-gap priority queue fully covered at reading AND technique layers.
- Vault state at end of sweep: **237 pages**; next free address c-000224. **Sweep 7 = final. Wiki transitions from "knowledge base" to "operational reference."** Next phase: build something — generative art system, brand tooling, graphic-design tools, or music-reactive visualizer using the now-operational stack.

## 2026-05-17 — Body Language Depth Sweep (item 11)
- **6th clustered depth-dive** in the locked sequence. Lightest sweep — single-item, Arnheim-leveraged, [[Face Perception]]-adjacent. Third sweep under post-Option-C methodology.
- Discovery: targeted survey of Darwin → Birdwhistell → Mehrabian → de Gelder lineage; tools-side audit of pose-estimation ecosystem (MediaPipe, MoveNet, RTMPose, Sapiens).
- All 6 conventions applied:
  - **Convention #1 catalog-stub cross-check**: every stub item resolved (Darwin, Birdwhistell, Mehrabian, de Gelder, Muybridge, Polykleitos, Donatello, Michelangelo, universal dimensions, contrapposto, gesture/proxemics, power-pose, pose extraction, animation overlap)
  - **Convention #2 framing-canonicity**: 5 of 7 frameworks had named contestation — Birdwhistell kinesics largely superseded; Mehrabian 55-38-7 popular form is a myth; Hall proxemics distances don't generalize; Carney-Cuddy-Yap power-pose causal claim failed replication; contrapposto is Western-art-historical not cross-cultural
  - **Convention #3 npm audit**: surveyed `@mediapipe/tasks-vision`, `@tensorflow-models/pose-detection`, `onnxruntime-web`, `@xenova/transformers`, `kalidokit`; no major missed packages
  - **Convention #4 source-fetch fallback**: no fetch failures; all primary sources accessible via citations
  - **Convention #5 cross-cultural validity**: dedicated [[Cultural Variability in Body Language]] page; explicit cultural-validity statements on every page
  - **Convention #6 successor-theory tracking**: applied to every pre-2000 anchor (Darwin → de Gelder; Birdwhistell → McNeill/Kendon/de Gelder; Mehrabian → Hall 2006/Patterson 2011; Hall → Sorokowska 2017; Ekman emblems → Matsumoto-Hwang 2013; Polykleitos → Hogarth/IK-rigging; Carney-Cuddy-Yap → Ranehill 2015)
- 7 new pages created (c-000203..c-000209), plus 1 synthesis (c-000210):
  - [[Universal Body Language Dimensions]] (c-000203) — 5-axis structural anchor
  - [[Birdwhistell's Kinesics]] (c-000204) — historical, mostly superseded
  - [[Mehrabian's 55-38-7 Misinterpretation]] (c-000205) — myth correction + narrow legitimate finding
  - [[de Gelder's Whole-Body Emotion Perception]] (c-000206) — contemporary empirical anchor (EBA/FBA, BEAST)
  - [[Cultural Variability in Body Language]] (c-000207) — emblem catalog, proxemics, gesture conventions
  - [[Contrapposto and Pose Canons]] (c-000208) — Polykleitos → 3D rigging; 6-feature computable contrapposto score
  - [[Pose Extraction Pipeline]] (c-000209) — MediaPipe / MoveNet / RTMPose / Sapiens comparison
  - **Synthesis**: [[Research - Body Language Depth Sweep]] (c-000210)
- Catalog stub [[Body Language and Pose Semantics]] updated to `status: developed`.
- Key findings:
  1. **5-dimension framework is the working model** — approach/avoidance, expansion/contraction, up/down, stability, energy. Empirically anchored in de Gelder; consistent with Arnheim's [[Expression as Configuration of Forces]]. Programmable surface: specify dimensions, not labels.
  2. **EBA + FBA establish body-channel-independence** from face channel (Downing 2001; Peelen-Downing 2005). For generation: specify body and face emotions separately and verify alignment.
  3. **Birdwhistell's structural-linguistic framing failed** — phoneme-analog kinemes did not pan out; McNeill / Kendon / embodied-cognition replaced it. Cultural-specificity claim was partly right (emblems) and partly wrong (dimensions).
  4. **Mehrabian 55-38-7 popular form is a myth** — applies only to single-word inconsistent-channel attitude judgments. Narrow legitimate finding (channels-in-conflict-favor-nonverbal) is useful for figurative work.
  5. **Cultural emblems are high-stakes for global work** — thumbs-up, OK-sign, V-back-of-hand, head-shake direction, beckoning all carry cross-cultural inversion risk.
  6. **Contrapposto reduces to 6 computable features** — hip-shoulder counter-rotation, weight asymmetry, free-leg flex, spinal S-curve, head-tilt, CoM-over-base. Discriminates alive-figurative from wooden-frontal poses.
  7. **2026 tools stack is clear**: MediaPipe Tasks (accuracy + JS-first), MoveNet Lightning (realtime browser), RTMPose / Sapiens via ONNX (offline batch).
  8. **Tribhanga (Indian classical) is the cross-cultural sibling to contrapposto** — three-bend pose; open thread for future depth.
- Vault state at end of sweep: **224 pages**; next free address c-000211. **Sweep 6 complete. Only Sweep 7 (Implementation-notes pass) remains in the locked sequence.** 15-gap priority queue now fully covered as a reading layer.

## 2026-05-17 — Movement-Rhythm-Style-Symbolism Sweep (items 8 + 9 + 14 + 15)
- **5th clustered depth-dive** in the locked sequence. Theoretically densest sweep yet — covers montage theory, formal art history, iconology, symmetry math, style transfer, archetype theory. Second sweep under post-Option-C methodology.
- Discovery: 2 rounds, 14 parallel WebSearches across contestation literature for each canonical anchor.
- All 6 conventions applied; **conventions #2, #5, #6 got the heaviest workout** of any sweep so far:
  - **Convention #2 framing-canonicity**: Eisenstein, Wölfflin, Panofsky, Jung, Mark-Pearson all surveyed for contestation; substantial named successor literature for each
  - **Convention #5 cross-cultural validity**: dedicated [[Non-Western Iconographic Systems]] page; cross-cultural caveats throughout Wölfflin, Panofsky, Jung, Bonner-IGP pages
  - **Convention #6 successor-theory tracking**: heavy — Bordwell as Eisenstein-successor, new art history as Wölfflin-successor, visual culture as Panofsky-successor, constructionism as Jung-successor, Hat monotile (2023) as Penrose-successor, IP-Adapter+ControlNet+ICAS as Gatys-successor, design systems as PDF-brand-guideline successor
- 17 new pages created (c-000185..c-000201), plus 1 synthesis (c-000201):
  - **Time-based composition (4)**: [[Eisenstein's Montage Theory]] · [[Murch's Six Editing Rules]] · [[McCloud's Panel Transitions and the Infinite Canvas]] · [[Disney Animation Principles]]
  - **Movement, rhythm, repetition (4)**: [[Symmetry Groups and Tessellation]] · [[Aperiodic Tiling and the Hat Monotile]] · [[Islamic Geometric Patterns and the Polygonal Technique]] · [[Op-Art and Cross-Modal Rhythm]]
  - **Style as system (4)**: [[Wölfflin's Five Axes]] · [[Style as Rule-System]] · [[Diffusion-Era Style Transfer]] · [[Brand Style Guides as Rule-Systems]]
  - **Cultural and symbolic iconography (4)**: [[Panofsky's Three-Level Iconology]] · [[Western Iconographic Systems]] · [[Non-Western Iconographic Systems]] · [[Jungian Archetypes and Brand Archetypes]]
  - **Synthesis**: [[Research - Movement-Rhythm-Style-Symbolism Sweep]] (c-000201)
- 4 parent catalog stubs updated from `status: stub` to `status: developed`: [[Time-based Composition]] · [[Movement Rhythm and Repetition]] · [[Style as System]] · [[Cultural and Symbolic Iconography]].
- Key findings:
  1. **The Hat monotile (March 2023)** is the named successor to Penrose; closes 50-year einstein problem. Smith, Myers, Kaplan, Goodman-Strauss. Spectres family (May 2023) extended to chiral monotiles. Most significant tessellation-mathematics event since Penrose 1974.
  2. **Jung's archetype theory is not accepted in mainstream psychology** — "more psychological mythos than testable hypothesis." Mark-Pearson 12 brand archetypes inherit empirical issues; wiki treats as team-vocabulary not science.
  3. **Eisenstein, Wölfflin, Panofsky all have substantial named successor critiques** — Bordwell, Bryson/Bal/new-art-history, Belting/Mitchell/visual-culture respectively. Phase 3 pattern (75% canonicity overclaim in pre-2000 anchors) replicates.
  4. **IP-Adapter + ControlNet (2023) + ICAS (2025)** substantially supersede Gatys for style transfer.
  5. **Bonner's polygonal technique** is the canonical IGP construction method; Lu-Steinhardt 2007 girih-quasiperiodic claim is contested but widely-cited.
  6. **Disney 12 animation principles are the most-validated framework in this sweep** — 40+ years across medium shifts without fundamental revision. Thesen 2020 confirmed.
  7. **Design systems are the named successor to PDF brand guidelines** (~2010-2020 transition).
  8. **Non-Western iconography is under-served in default LLM behavior**; explicit redirection required.
  9. **Aspect-to-aspect transitions in manga** vs Western comics confirmed as cross-cultural finding.
  10. **70ms causality threshold** ([[Phenomenal Causality]]) consistent with audio-visual cross-modal binding window — independent confirmation of Arnheim Sweep 3 finding.
- Vault state at end of sweep: **215 pages**; next free address c-000203. Movement-Rhythm-Style-Symbolism sweep complete. **Body Language Depth (item 11)** ← NEXT — lightest sweep; Arnheim-leveraged.

## 2026-05-17 — Practical Design Sweep (items 6 + 7 + 10 + 13) — first sweep under post-Option-C methodology
- **4th clustered depth-dive** in the locked sequence. Covers typography (#6), negative space (#7), light vocabulary (#10), materials & texture (#13). **First sweep run under post-Option-C six discovery+audit conventions.**
- Discovery: 2 rounds, 16 parallel WebSearches across typography / negative-space / light / materials contestation literature + 1 npm-registry font-tooling audit.
- All 6 conventions applied throughout:
  1. **Catalog-stub cross-check**: all 4 parent stubs re-read at start; coverage plan recorded; synthesis carries the cross-check table; **every depth-dive plan item explicitly addressed**
  2. **Framing-canonicity audit**: Müller-Brockmann, Bringhurst, Tufte, Storaro, Heeger-Simoncelli flagged as *one defensible framing*; Sam Potts critique, Tufte data-ink critique, New Naturalism, Gatys neural successor all surfaced
  3. **npm + GitHub audit**: font tooling found thin (service-driven not package-driven); flagged in [[Variable Fonts and Web Typography]]
  4. **Source-fetch fallback**: not triggered this sweep; secondary sources adequate
  5. **Cross-cultural validity**: **[[Multilingual Typography]] is the dedicated load-bearing page**; convention applied across [[Swiss Grid System]], [[Type as Voice]], [[Ma and Yohaku no Bi]], [[Materiality in Graphic Design]], [[Cinematic Lighting Traditions]]
  6. **Successor-theory tracking**: heavily applied — variable fonts succeed static typefaces; CSS Grid + design tokens succeed Swiss-grid pure-paper-asset; New Naturalism succeeds three-point lighting; ACES 2.0 succeeds ACES 1.0; Gatys neural texture synthesis succeeds Heeger-Simoncelli statistics
- 17 new pages created (c-000167..c-000183), plus 1 synthesis (c-000184):
  - **Typography (6)**: [[Swiss Grid System]] · [[Typographic Principles]] · [[Type as Voice]] · [[Variable Fonts and Web Typography]] · [[Multilingual Typography]] · [[Kinetic and Generative Typography]]
  - **Negative space (3)**: [[Ma and Yohaku no Bi]] · [[Negative Space Techniques]] · [[Negative Space in Motion]]
  - **Light (4)**: [[Three-Point Lighting and Key-Fill Ratio]] · [[Light Quality Direction and Motivation]] · [[Cinematic Lighting Traditions]] · [[PBR Lighting and ACES Tone Mapping]]
  - **Materials (4)**: [[PBR Material Parameters]] · [[Material Perception]] · [[Procedural and Neural Texture Synthesis]] · [[Materiality in Graphic Design]]
  - **Synthesis (1)**: [[Research - Practical Design Sweep]]
- 4 parent catalog stubs updated from `status: stub` to `status: developed` with success callouts pointing to depth-dive pages: [[Visual Hierarchy and Typography]] · [[Negative Space]] · [[Light Vocabulary]] · [[Materials and Texture]].
- Key findings:
  1. **Variable fonts at 98% browser support 2026** — Bringhurst-era type-pairing rules partially obsolete; single-family variable systems replace 6-10-typeface bundles. Largest typography shift since print→web.
  2. **New Naturalism is the contemporary cinematography mainstream**. Three-point remains pedagogically canonical but production practice favors motivated-source-only. *The Revenant* (2015) shot entirely natural light.
  3. **ACES 2.0 (2024) supersedes ACES 1.0** for HDR/SDR tone-mapping; less aggressive scale, better hue preservation.
  4. **Gatys 2015 neural texture synthesis** partly displaces Heeger-Simoncelli statistical features operationally; both lineages coexist.
  5. **Tufte data-ink ratio empirically contested** — same pattern as Berlyne (Phase 3): 1980s 1-author canonical principle with mixed empirical support.
  6. **Multilingual typography** is the wiki's single most-under-acknowledged cultural-anchoring case. F-pattern reverses for RTL (top-right primary not top-left); CJK has its own grid traditions (*genkō yōshi*); weight-matching across Latin + CJK is nontrivial.
  7. **Ma (間) ≠ negative space** in the simple Western sense. Temporal + spatial + relational; Isozaki's 1978 Paris exhibition is canonical anchor.
  8. **Font tooling on npm is thin** — service-driven (Google Fonts, Adobe Fonts) not package-driven; same pattern as PCG and postdigital tools.
- Vault state at end of sweep: **198 pages**; next free address c-000185. Practical Design sweep complete. **Movement-Rhythm-Style-Symbolism sweep (items 8+9+14+15)** ← NEXT.

## 2026-05-17 — Phase 4 of Option C: Methodology Lock-in (Option C closed)
- **Discovery Methodology Fix, Phase 4** — the closing phase. Consolidation, not new research. Updated [[Wiki Methodology]] with a new section "Discovery and audit conventions (Phase 4 lock-in 2026-05-17)" gathering the six conventions surfaced across Phases 1–3:
  1. Catalog-stub cross-check (Phase 0 finding)
  2. Framing-canonicity audit (Phase 1)
  3. npm-search + GitHub-search audit for tools sweeps (Phase 2)
  4. Source-fetch fallback ladder (Phase 1 follow-up)
  5. Cross-cultural validity flag (Phase 3 — new)
  6. Successor-theory tracking (Phase 3 — new)
  + the **unification-claim red flag** as a meta-convention (any "X = Y = central pillar" language triggers audit; base rate of overclaim across audited unifications: 100%).
- Two new feedback memories saved: `feedback_cross-cultural-validity.md`, `feedback_successor-theory-tracking.md`. MEMORY.md index updated.
- Wiki Methodology sweep-status table updated: Sweep 3.5 (Option C) marked ✅ Done across all four phases. Practical Design sweep is unblocked and is the next sweep in the locked sequence — it executes under post-Option-C methodology.
- Discovery Methodology Plan (`wiki/meta/Discovery Methodology Plan.md`) marked status: complete.
- Closing synthesis: **[[Research - Phase 4 Methodology Lock-in]]** (c-000166). Cumulative Option C totals: **27 new pages + 13 page revisions + Methodology expansion + Tools Map v2 + 4 new memories + 2 primary PDFs ingested**. Vault grew **152 → 180 pages**.
- Vault state at end of Phase 4: **180 pages**; next free address c-000167. Phase 4 complete. **Option C closed.** Practical Design sweep ← next, under post-Option-C methodology.

## 2026-05-17 — Phase 3 of Option C: Canonicity Audit
- **Discovery Methodology Fix, Phase 3** (per `wiki/meta/Discovery Methodology Plan.md`). Conservative scope per locked decision: audit only the load-bearing canonical claims in the Affect Foundations and L1 Cleanup sweeps for the same overclaim pattern Phase 1 caught in Algorithmic Composition.
- Discovery: 8 parallel WebSearches (2 per anchor) covering contestation literature for each canonical claim.
- 4 page revisions applied:
  - **[[Berlyne's Arousal-Potential Theory]]** — **MAJOR revision**. Confirmed "mostly abandoned" claim with specific reasons: arousal can't account for emotion diversity in art perception; neurophysiologically under-supported; experiments failed to confirm predictions; semantic factors dominate over collative properties. Successor theories now properly named: [[Processing Fluency Theory|processing fluency]] (Reber 2004), neuroaesthetics, predictive-processing. Empirical record on inverted-U is mixed across stimulus types (replicates for skeletal-complexity; "scant evidence" in product design). Top-of-page audit callout + new Critique section + downgrade throughout.
  - **[[Russell's Affect Circumplex]]** — **MAJOR revision**. Cross-cultural variation: V-shape steeper in Western (Canadian, Spanish) than East Asian (Korean, Japanese); Hong Kong sample fits straight line (independence). Personality (extraverts vs introverts) shifts geometry. Ellipse-rather-than-circumplex finding (Klimek-Trochim et al. 2021). [[Constructed Emotion Theory|Barrett's constructionist alternative]] reframes circumplex as representational not causal. Top-of-page audit callout + new Critique section + downgrade.
  - **[[Helmholtz Gibson and Bayesian Perception]]** — **MODERATE revision**. Synthesis is widely-adopted but contested. Pure-ecological camp (Turvey, Chemero) rejects inferentialist framing entirely. Predictive-processing has unfalsifiability concerns (Williams 2022, Synthese). "The myth of the Bayesian brain" PMC review documents empirical and conceptual challenges. Orlandi's compatibility-not-victory reading offered as alternative. Top-of-page note + Critique section + softened "modern resolution" language.
  - **[[Face Recognition Universality Debate]]** — **MINOR revision** (page was already well-balanced). Added the **third framing**: Crivelli & Fridlund 2018 Behavioral Ecology View — facial displays as *functional signals* in social interaction, not emotion-readouts (contra Ekman) and not primarily constructed-categorizations (contra Barrett). Re-frames face-emotion AI design question.
- 1 new synthesis page: **[[Research - Phase 3 Canonicity Audit]]** (c-000165).
- Key findings:
  1. The wiki's "central theoretical pillar" framing (Galanter ↔ Berlyne ↔ Russell as unified spine) is now fully retired. All three pages carry critique sections.
  2. Base rate of canonicity overclaim across audited anchors: 75% (3 of 4 needed revision; only Face Universality was already balanced).
  3. **Berlyne is the largest single downgrade**: substantially abandoned, not just contested.
  4. **Cross-cultural variation is the most-reliable falsifier of canonical claims** in perception-psychology. WEIRD-only validation should carry explicit cultural caveats by default.
  5. Behavioral Ecology View deserves naming — Ekman-vs-Barrett is a two-way framing of what's actually a three-way debate.
- Conservative-scope discipline maintained: secondary pages depending on the four anchors (Constructed Emotion, Plutchik, PAD, Appraisal, Five Constancies, etc.) were NOT directly revised — they read accurately as long as the audited anchors carry their critique sections.
- Vault state at end of sweep: **179 pages**; next free address c-000166. Phase 3 complete. **Phase 4 (methodology lock-in)** ← **NEXT**. Items already queued: framing-canonicity audit convention, npm+GitHub-search convention, source-fetch fallback ladder, cross-cultural validity flag, successor-theory tracking.

## 2026-05-17 — Phase 2 of Option C: Generative Art Tools Survey
- **Discovery Methodology Fix, Phase 2** (per `wiki/meta/Discovery Methodology Plan.md`). Goal: systematic tool discovery via npm-search pagination + awesome-list reads + framings-anchored scope, closing gaps from the original Tools sweep.
- Discovery batch: 18 parallel npm-registry searches (`keywords:generative-art`, `creative-coding`, `livecoding`, `procedural-generation`, `webgpu`, `diffusion`, `glitch`, `procgen` + 10 targeted package lookups: @huggingface/transformers, ml5, @magenta/music, tracery, tone, meyda, aframe, wave-function-collapse) + 2 awesome-list fetches.
- 13 new pages created (addresses c-000151..c-000164):
  - **Standalone tool pages (8)**: [[Strudel]] (major new entrant; 23-package ecosystem) · [[Transformers.js]] (1.12M weekly; AI-art primary) · [[TensorFlow.js]] · [[ml5.js]] · [[Tone.js]] (promoted from Web Audio folding) · [[Meyda]] · [[A-Frame]] · [[WGSL Tooling]] (typegpu + wgsl_reflect + vite-plugin-glsl + shaders survey)
  - **Survey / map pages (4)**: [[Live Coding Tools Survey]] · [[PCG Toolkit]] · [[Cloud Inference APIs]] · [[AI Art Toolkit Map]] · [[Postdigital Tools]]
  - **Sweep synthesis (1)**: [[Research - Generative Art Tools Survey]]
- **[[Tools Map]] substantially updated** (Phase 2 expansion): new "Phase 2 additions" verdict table; priority-4 stack now has *two* recommended options (Strudel + Hydra for live-coding paradigm; Tone.js + three.js + Meyda for imperative-JS paradigm); priorities 1-3 expanded with Transformers.js, Cloud Inference APIs, Postdigital Tools; Magenta.js flagged as deprecated.
- Key findings:
  1. **Strudel is the single largest missed entrant** — 23 @strudel/* packages, browser-native TidalCycles port; reframes priority 4 toward live-coding paradigm
  2. **Transformers.js at 1.12M weekly** — completely absent from prior tools sweep; primary client-side AI-art layer
  3. **Tone.js (321K) + Meyda (13K) deserve standalone evaluation** (were folded into Web Audio in prior sweep)
  4. **WebGPU has a 2026 DX stack** (typegpu + vite-plugin-glsl + wgsl_reflect + shaders) the prior sweep missed entirely
  5. **Magenta.js is deprecated** — no real updates since 2021-11; prior sweep treated as current
  6. **PCG-on-npm is sparse** — canonical PCG (WFC, ROT.js) lives primarily on GitHub; methodology finding for Phase 4
  7. **Postdigital is mostly hand-coded technique**, not packaged libraries; the page is hybrid library-survey + technique-catalog
  8. **Priority-4 stack changed**: from "Web Audio + Three.js + Hydra" to **Strudel + Hydra** (primary, live-coding paradigm) or **Tone.js + three.js + Meyda** (alternative, imperative paradigm)
- Catalog-stub cross-check applied: 7 of 9 [[Framings of Generative Art|framings]] now have explicit tool coverage; remaining gaps (A-Life standalone tools, on-chain platform SDKs) flagged as acceptable / deferred in the synthesis page.
- Vault state at end of sweep: **178 pages**; next free address c-000165. Phase 2 complete. Phase 3 (prior-sweep canonicity audit of Berlyne / Russell circumplex / Helmholtz-Gibson-Bayesian / Ekman-Barrett) ← **NEXT**, conservative scope per locked decision.

## 2026-05-17 — Phase 1 follow-up 2: Cramer 2014 primary-source ingested
- User provided `~/Downloads/Florian Cramer WHAT IS POST-DIGITAL.pdf` after the previous gap callout was logged. Paper is 24 pages (incl. notes + works cited).
- **Discovery: Cramer's argument is substantively richer than secondary summaries suggested.** Five strands beyond glitch-aesthetics, four of which were absent from the wiki's prior Postdigital page:
  1. Post-disenchantment (Snowden 2013 as cultural hinge)
  2. Post-colonial mutation (not post-historical termination; reads "post-" as in post-punk, post-feminism)
  3. **Anti-universal-machine** (p.16) — strongest analytical strand; rejects "the computer as universal machine, and digital computational devices as all-purpose media"
  4. **DIY vs corporate, not old vs new** (p.19) — Cramer's own preferred reframing
  5. **Semiotic shift from symbolic to indexical** (p.19) — material trace over encoded symbol; the wiki's first computable handle anchored in Cramer's actual prose
- **New source page**: [[Cramer - What Is Post-Digital]] (c-000150). Section-by-section verbatim quotes; clarifies digital-≠-binary, analog-≠-non-computational, and Cramer's self-critique (post-digital DIY rests on the same "fiction of agency" as Silicon-Valley utopias — closing systems-crisis argument).
- **[[Postdigital Aesthetics]] page substantially rewritten:**
  - "Essence" section now lists Cramer's five strands with primary-source quotes and page numbers
  - "What it foregrounds" expanded with anti-universal-machine, DIY-vs-corporate, indexical-shift, medium-pragmatic-choice (Hermlin case study)
  - "What it contests" sharpened — Galanter critique now includes the anti-universal-machine angle; framing-self-contests itself per Cramer p.22
  - Computable handles upgraded with indexical-over-symbolic axis as the framing's actionable specification
  - Gap callout replaced with success callout pointing to source page
  - Footnotes upgraded with full citation including ISSN, license, and 2021 Cramer-Jandrić self-revisit
- **Surprising finding**: Cramer's anti-universal-machine argument (p.16) is a *deeper* critique of Galanter than Hertzmann's social-agent argument — Hertzmann contests system-as-author, Cramer contests system-as-universal-substrate. Both critiques now anchor the Galanter Critique section as complementary external pushbacks. The wiki's Galanter framing should ideally absorb a sentence from Cramer p.16; updating now.
- Vault state: **164 pages**; next free address c-000151. Phase 1 of Option C now has all three primary-source PDFs ingested at high confidence (Hertzmann 2018, Galanter 2003 cited via secondary fallback, Cramer 2014 fully primary).

## 2026-05-17 — Phase 1 follow-up: Hertzmann primary-source ingest + Cramer gap logged
- User provided two PDFs the Phase 1 sweep could not fetch via WebFetch: `~/Downloads/arts-07-00018-v3.pdf` (Hertzmann 2018, 25pp) and `~/Downloads/Post-digital aesthetics - Monoskop.pdf` (5pp).
- **Hertzmann 2018 fully ingested.** [[Hertzmann - Can Computers Create Art]] source page rewritten to anchor on verbatim quotes (three italicized thesis statements; §4.2 natural-processes argument; §4.5 Mandelbrot-set falsifier; §4.7 attribute-theory critique; §5 social-agent condition; §6 conclusion). Added page-by-page implication table noting which wiki pages need which Hertzmann argument.
- **Galanter critique section upgraded** ([[Galanter's Generative Art Framework]]): replaced the secondary-source paraphrase with the two strongest Hertzmann-anchored falsifiers — the natural-processes argument (the Grand Canyon and honeycombs are not art *despite* complexity/autonomy/emergence) and the Mandelbrot-set falsifier (the paradigm case of effective-complexity-from-simple-rules is not creative or an artist per Hertzmann). Both quoted verbatim.
- **AI-Art critique section upgraded** ([[AI Art and Latent Space]]): three verbatim italicized formulations from the paper, including the positive social-agent condition and Hertzmann's explicit ethical worry about shallow-social-AI marketing.
- **Computational Creativity caveats upgraded** ([[Computational Creativity]]): Hertzmann §4.5 Mandelbrot falsifier and §4.7 attribute-theory critique applied to Boden-lineage creativity attribution.
- **Postdigital page reference apparatus upgraded** ([[Postdigital Aesthetics]]): the Monoskop bibliography page (which is an *index*, not Cramer's actual paper) gave robust citation data — full Cramer body-of-work timeline (2012, 2013, 2014, 2015, 2016, 2021), the Centre for Postdigital Cultures founding 2018-02-07, anthology venues, Demian Conrad et al. *Graphic Design in the Post-Digital Age* 2021 (the framing's most direct contribution to priority 3 / graphic design). All references upgraded with precise dates, page counts, venues.
- **Open gap logged**: Cramer 2014 *What Is 'Post-Digital'?* primary text still not at primary-source confidence. WebFetch on https://lab404.com/142/cramer.pdf returns binary corruption. Postdigital page now carries a `> [!gap]` callout that flags the issue and pins the canonical APRJA landing (https://aprja.net/) for manual fetch. Per user guidance ("if all else fails, log the URL and I'll fetch them manually"), the URL is now logged. Once the actual Cramer text is in hand, the Postdigital page's claims about Cramer's specific definitions can be promoted from secondary to primary confidence.
- Methodology note: the user's "try browser-use or log the URL" guidance applied. Two-tier fallback for unreachable primary sources (try browser/Playwright; if that fails, log URL with a gap callout) is the cleanest pattern; worth memorializing in Phase 4 methodology lock-in.

## 2026-05-17 — Phase 1 of Option C: Framings of Generative Art sweep
- **Discovery Methodology Fix, Phase 1** (per `wiki/meta/Discovery Methodology Plan.md`). Decisions locked at start of sweep: full Option C, **revise** path for Algorithmic Composition framework, methodology-fix-before-Practical-Design, conservative Phase 3 audit scope.
- Autoresearch loop: 3 rounds of WebSearch / WebFetch across 9 framings of generative / computational / creative-coding art. Surfaced empirical-aesthetics contestation: Berlyne's arousal theory is "mostly abandoned" per the Internet Encyclopedia of Philosophy; inverted-U is replicated in *some* stimulus regimes but not others; complexity metrics disagree.
- 11 new pages created (addresses c-000139..c-000149):
  - **Framings Map**: [[Framings of Generative Art]] (c-000139) — synthesis hub, nine-framings comparison table, priorities-fit table, what-each-contests section, empirical-contestation section.
  - **Per-framing concept pages** (8): [[Artificial Life Art]] (c-000140) · [[Practice-led Studio Research]] (c-000141) · [[Procedural Content Generation]] (c-000142) · [[Postdigital Aesthetics]] (c-000143) · [[Live Coding and Algorave]] (c-000144) · [[AI Art and Latent Space]] (c-000145) · [[Long-form On-Chain Generative Art]] (c-000146).
  - **Source pages** (2): [[Hertzmann - Can Computers Create Art]] (c-000148) — external critique anchor · [[Galanter - What is Generative Art]] (c-000149) — restored original-claims source.
  - **Synthesis question page**: [[Research - Generative Art Framings Sweep]] (c-000147).
- 8 existing framework pages **revised** per the revise path: top-of-page framing-canonicity caveat, downgrade of "central theoretical pillar" language, cross-links to alternative framings, honest treatment of empirical contestation. [[Galanter's Generative Art Framework]] got the largest revision — new full Critique section with four empirical/theoretical pushbacks plus footnoted sources. [[Computational Creativity]] elevated from sub-concept to root-level framing.
- Key new findings: (a) Berlyne's arousal theory is empirically contested, not settled; (b) Hertzmann's social-agent argument is the strongest external critique of system-internal aesthetic theories and was missing from the wiki; (c) [[Live Coding and Algorave|live-coding / Hydra]] is the wiki's strongest match for priority 4 (music-reactive); (d) [[Practice-led Studio Research|practice-led]] (parametric identity) is the strongest match for priority 2 (branding). Both pull weight in the framings map but were under-represented in the prior sweep.
- Methodology gaps acknowledged in the synthesis: two primary sources (Cramer 2014, Galanter 2003) returned binary/403 errors via WebFetch; relied on secondary summaries. Whitelaw 2004 primary read deferred.
- Vault state at end of sweep: 163 pages; address counter at c-000150 (next free); Phase 1 complete; Phase 2 (Tools survey via programmatic npm/awesome-list autoresearch) and Phase 3 (prior-sweep audit of Berlyne/Russell/Helmholtz-Gibson canonicity) queued before Practical Design.

## 2026-05-17 — Tools sweep addendum 2: three.js npm-page-1 audit
- User-provided npm-search export for `keywords:three` (page 1 of 50). Audit found I had the major libraries (three.js core, r3f, drei, postprocessing) but missed several high-download production libraries.
- No new pages — edits to existing pages were the right shape.
- Edits to [[three.js Addon Ecosystem]]:
  - **three-stdlib** (~12M weekly dl) — pmndrs-maintained version of three.js's examples/jsm; decouples addon ecosystem from three.js core. New section added.
  - **camera-controls** (yomotsu, ~12M weekly dl) — production alternative to OrbitControls with smooth damped transitions, programmatic camera moves, better mobile. Added to controls section.
  - **detect-gpu** (~11M weekly dl) — GPU benchmark classification for adaptive quality. New "Adaptive quality / performance budgeting" section.
  - **@monogrid/gainmap-js** (~11M weekly dl) — Adobe Gainmap HDR storage; modern HDR-shipping standard. New "HDR workflows" section.
  - **The vasturiano ecosystem** — globe.gl, 3d-force-graph, react-globe.gl, three-conic-polygon-geometry, etc. New "Information visualization on three.js" section. A coherent specialized data-viz-in-3D stack used widely for globe / network / GeoJSON projects.
- Edit to [[Creative Coding Utilities]]: clarified that `motion` (50M weekly dl) is the rebranded successor to motion-one + framer-motion (merged 2024+); now the dominant default for both vanilla and React animation work, replacing the previous motion-one entry.
- Edit to [[Tools Map]]: expanded the canonical default stack to include three-stdlib + camera-controls + detect-gpu. Added notes about the gainmap HDR workflow and the vasturiano stack for information-viz work.
- Methodology note: the catalog-stub-cross-check convention (`feedback_catalog-stub-cross-check` in memory) caught the p5.js plugin gap; this audit caught a similar gap in the three.js ecosystem coverage despite the previous addendum. Pattern noted: **ecosystem coverage benefits from npm-search audits at depth-dive completion** — purely-from-memory listing of "important libraries" reliably misses heavily-used production tools.

## 2026-05-17 — Tools sweep addendum: plugin ecosystems and sibling libraries
- User audit (via npm search "keywords:p5" page-1 export) flagged that the previous Tools sweep evaluated 10 core libraries but missed (a) sibling libraries scoped in the catalog stub and (b) plugin / addon ecosystems entirely. Honest miss; the catalog stub for [[Algorithmic Composition]] explicitly named p5.brush, p5.sound, p5.play, p5.particle, etc. — these were dropped in the depth-dive.
- Pages created (5 new, post-rollout, addresses c-000134..c-000138):
  - Sibling libraries: [[q5.js]] (c-000134) — WebGPU-powered drop-in for p5.js; significant find. [[react-three-fiber]] (c-000135) — React paradigm for three.js; major standalone evaluation.
  - Ecosystem surveys: [[p5.js Plugin Ecosystem]] (c-000136), [[three.js Addon Ecosystem]] (c-000137), [[Creative Coding Utilities]] (c-000138).
- Existing pages updated: [[p5.js]] (cross-reference q5.js + plugin ecosystem); [[three.js]] (cross-reference r3f + addon ecosystem); [[Tools Map]] (addendum section with sibling-libraries table + ecosystem-survey row, updated recommended stack including drei + postprocessing + leva + simplex-noise + GSAP + ccapture.js).
- Key new findings:
  - **q5.js** is a serious sibling-library miss. WebGPU-powered, p5.js-API-compatible, 3.5k weekly npm downloads despite being young, multiple releases per week as of 2026-05-17. For priority-4 visualizers where performance matters, q5.js is a better fit than p5.js's Canvas2D backend.
  - **react-three-fiber** deserves its own page rather than a footnote on the three.js page — it's a distinct paradigm (JSX-declarative vs imperative) with its own massive ecosystem (drei, postprocessing, rapier, leva, theatre.js — the pmndrs collective).
  - **p5.brush** elevates p5.js's verdict for natural-brush painterly generative art (a common priority-1 niche). The combination `@p5-wrapper/react + p5.js + p5.brush + p5.capture + culori` is a legitimate priority-1 production stack.
  - **drei** is the productivity multiplier for three.js / r3f work. Not optional for production-quality React 3D — 200+ helpers cover essentially every common need.
  - **The utility layer** (noise / GUI / animation / geometry / recording) is cross-cutting and was missing from the original Tools sweep. The recommended new stack now explicitly includes simplex-noise + TweakPane/leva + GSAP/motion-one + ccapture.js.
- Updated recommended-default stack (CLAUDE.md-aligned): WebGPU + three.js (WebGPU renderer) + r3f + drei + postprocessing + leva + Anthropic SDK + culori + Web Audio API + simplex-noise + GSAP + ccapture.js. Augment with paper.js / d3 modules / p5.js+brush / q5.js / Hydra / Tone.js / rapier / troika as priorities call for.
- Process lesson absorbed: catalog stubs should be cross-checked against the depth-dive output. The plugin / ecosystem material was in the stub but dropped without explicit decision. Filing this as a methodology note: depth-dives should explicitly *justify* any catalog-stub scope they don't cover.

## 2026-05-17 — Algorithmic Composition + Tools sweep (clustered: item 4 + tools)
- Third clustered depth-dive sweep, executing the paired framework + tools sequence per the locked `feedback_algo-comp-before-tools` policy. Framework first; rubric derived from framework; tools evaluated against rubric; verdicts produced in [[Tools Map]].
- Reading-only per policy. No implementation code on framework or tool pages. Implementation-notes pass queued for after Practical Design sweep.
- Pages created (20 new, post-rollout, addresses c-000114..c-000133):
  - Framework (8): [[Galanter's Generative Art Framework]] (c-000114), [[Algorithmic Art History]] (c-000115), [[Procedural Paradigms]] (c-000116), [[L-Systems and Grammars]] (c-000117), [[Cellular Automata and Reaction-Diffusion]] (c-000118), [[Computational Creativity]] (c-000119), [[The Autonomy-Control Gradient]] (c-000120), [[Library Evaluation Rubric]] (c-000121)
  - Tools (10, in new `wiki/tools/` directory): [[p5.js]] (c-000122), [[paper.js]] (c-000123), [[three.js]] (c-000124), [[WebGPU]] (c-000125), [[Pts.js]] (c-000126), [[Hydra]] (c-000127), [[d3.js]] (c-000128), [[The Color Stack]] (c-000129), [[Web Audio API and AudioWorklet]] (c-000130), [[Anthropic TypeScript SDK]] (c-000131)
  - Synthesis (2): [[Tools Map]] (c-000132), [[Research - Algorithmic Composition and Tools Sweep]] (c-000133)
- Five cross-cutting themes:
  1. **The L4 generation layer is now operational.** With L1 (perception), L2 (theory), and L4 (generation) all densified, the wiki has three vertical paths through its five-layer stratification.
  2. **The "effective complexity" unification spans the wiki.** Galanter's effective-complexity (generation side) = Berlyne's arousal-potential (evaluation side). Same underlying construct, two vantages. The wiki's central theoretical pillar.
  3. **The autonomy-control gradient maps to the procedural-paradigms taxonomy.** Direct manipulation → parametric → rule-based → stochastic-rule → iterative → evolutionary → learning-based. The middle is the collaborative regime.
  4. **The tools split cleanly into infrastructure + paradigm-specialists + general-purpose.** Recommended stack pattern: infrastructure + general-purpose + paradigm-specialist for the specific work.
  5. **The wiki's policy decisions are now consistent across the framework.** Clustered, reading-only, framework-first — all three policies operationalized concretely in this sweep.
- Notable theoretical milestone: **the two ends of the central unification meet**. Berlyne's arousal-potential (evaluation side, from Affect Foundations sweep) and Galanter's effective complexity (generation side, this sweep) are now both explicit pages with the connection made plain.
- Tools Map verdicts: three.js + culori + Anthropic SDK = first-class infrastructure across all priorities. paper.js first-class for priority 2 (branding). Hydra + Web Audio API first-class for priority 4 (visualizers). d3.js first-class for priority 3 (graphic design). p5.js first-class pedagogical / second-class production.
- The Anthropic TypeScript SDK is now an explicit infrastructure component for LLM-as-judge, persona-based aesthetic evaluation, and iterative refinement loops.
- One catalog stub updated: [[Algorithmic Composition]] moved from `stub` to `stable`; depth-dive marked complete.
- Open threads: implement Directed-Tension Score (queued for implementation-notes pass after Practical Design sweep); implement Cross-Modal Vocabulary mapper; build hello-world examples for each tool. Primary sources still untouched: Galanter 2003 (full paper), Boden 2004, Whitelaw 2004, Wolfram 2002, Prusinkiewicz & Lindenmayer 1990.
- Next sweep per locked sequence: **Practical Design** (items 6 typography + 7 negative space + 10 light vocabulary + 13 materials). Working-designer literature (Müller-Brockmann, Bringhurst, Tufte, cinematography, PBR).

## 2026-05-17 — L1 Cleanup sweep (clustered: items 5 + 12)
- Second clustered depth-dive sweep, completing the L1 (perception substrate) layer of the wiki. Queue items 5 (Perceptual Constants) and 12 (Face Perception) — the only remaining L1 fields after Arnheim's three sweeps closed Ch. I–II, V–X.
- Reading-only per policy. Pseudocode and math (Emmert's law, AU combinations) included where it serves clarity; no library-specific implementation code per `feedback_implementation-in-sweeps`.
- Pages created (11 new, post-rollout, addresses c-000103..c-000113):
  - Perceptual Constants (5): [[The Five Visual Constancies]] (c-000103), [[Size Constancy and Size Illusions]] (c-000104), [[Lightness and Color Constancy]] (c-000105), [[Helmholtz Gibson and Bayesian Perception]] (c-000106), [[Cross-Cultural Perceptual Variation]] (c-000107)
  - Face Perception (5): [[The Face-Specific Pathway]] (c-000108), [[Configural Face Processing]] (c-000109), [[FACS - Facial Action Coding System]] (c-000110), [[The Uncanny Valley]] (c-000111), [[Face Recognition Universality Debate]] (c-000112)
  - Synthesis: [[Research - L1 Cleanup Sweep]] (c-000113)
- Four cross-cutting themes:
  1. **Constancies are achievements, not gifts.** All five (size, shape, lightness, color, position) are inferred from cues; the inference is fast/automatic/cognitively-impenetrable and tuned to environmental statistics. This is Arnheim's "world is brain-constructed" thesis at the L1 level.
  2. **The Bayesian / predictive-processing synthesis closes both topic areas.** Helmholtz vs Gibson resolves into a Bayesian-predictive view where the brain does inference *implemented* via invariant-pickup. Cross-cultural variation is differences in priors, not architecture. Uncanny valley is high-precision prediction error in the face-specific pathway. This is now the wiki's dominant L1 theoretical commitment.
  3. **The "universal substrate / cultural overlay" pattern recurs across four wiki domains** (color, emotion, perception, face emotion). Substrate travels; specifics don't. Justifies the policy of preferring dimensional / structural specifications over categorical / symbolic ones for cross-cultural work.
  4. **Faces are extreme attention-attractors with composition-hijacking consequences.** Any face dominates its composition's hierarchy regardless of size. Implications: avoid accidental pareidolia; commit to cartoon or photorealism (never the uncanny middle); LLM-as-judge must be face-aware.
- Notable theoretical milestone: the **L1 perception substrate layer is now complete**. The wiki has 30+ pages covering perception (Arnheim + constancies + face); 12+ pages covering L2 theory (affect foundations); catalog stubs scaffolding L3 design (queued for Practical Design sweep); LLM-techniques content in L4 generation (queued for Algorithmic Composition + Tools sweep). The strategic-catalog → prioritized-depth strategy is now visibly paying off — sweeps are increasingly cross-leveraging existing material.
- Specific empirical claims absorbed: Müller-Lyer 10–25% length bias; Adelson checker-shadow demonstrates lightness-constancy as inference; the dress 2015 splits viewers ~50/50 on assumed illuminant; Müller-Lyer susceptibility ~5× lower in non-carpentered-world populations (Segall 1966); FFA activates 2-3× more for faces than objects; face detection at ~100 ms post-stimulus; N170 ERP is face-specific and inversion-sensitive; face-emotion expression-experience correlation < 30% (Barrett 2019); free-labeling cross-cultural face-emotion recognition near chance for non-Western-media-exposed populations (Gendron 2014, Crivelli 2017).
- Two catalog stubs updated: [[Perceptual Constants]] and [[Face Perception]] moved from `stub` to `stable`; depth-dive marked complete; linked to child concept pages.
- Open threads filed: Bayesian-predictive accounts in depth (possible standalone depth-dive later); visual-attention models (adjacent topic); FFA neural-architecture deeper than needed for our purposes. Primary sources still untouched: Helmholtz 1867, Gibson 1979, Knill & Richards 1996, Clark 2016, Ekman-Friesen 1978 FACS manual.
- Next sweep per locked sequence: **Algorithmic Composition + Tools** (item 4 + tools sweep). Per `feedback_algo-comp-before-tools` memory, framework precedes library evaluation. This is the generation-layer sweep that produces the library-evaluation rubric the tools sweep will apply.

## 2026-05-17 — Affect Foundations sweep (clustered: items 1+2+3)
- First clustered depth-dive sweep, per the three policy decisions locked earlier today: clustered sweeps; reading-only on concept pages (no implementation code); Algorithmic Composition before tools.
- Combined queue items 1 (Emotion Psychology), 2 (Color Psychology), 3 (Empirical Aesthetics) into one sweep because Russell's affect circumplex and Berlyne's arousal-potential are shared substrate.
- Pages created (13 new, post-rollout, addresses c-000090..c-000102):
  - Emotion (5): [[Russell's Affect Circumplex]] (c-000090), [[Plutchik's Wheel of Emotions]] (c-000091), [[PAD Emotion Model]] (c-000092), [[Constructed Emotion Theory]] (c-000093), [[Appraisal Theories of Emotion]] (c-000094)
  - Color (3): [[Ecological Valence Theory]] (c-000095), [[Goethe and Kandinsky on Color]] (c-000096), [[Cross-Cultural Color Variation]] (c-000097)
  - Empirical aesthetics (3): [[Berlyne's Arousal-Potential Theory]] (c-000098), [[Processing Fluency Theory]] (c-000099), [[Neuroaesthetics and Individual Variation]] (c-000100)
  - Cross-cluster bridge: [[Cross-Modal Emotion Mapping]] (c-000101)
  - Synthesis: [[Research - Affect Foundations Sweep]] (c-000102)
- Five cross-cutting themes identified:
  1. **(V, A) is the wiki's emotional lingua franca.** Russell-circumplex coordinates travel across cultures, modalities, and time better than categorical labels.
  2. **Dimensional > categorical for cross-cultural / programmable work.** Cross-cultural color and Barrett's constructionism both endorse using (V, A) over named-emotions.
  3. **Berlyne's arousal-potential unifies five complexity-based aesthetic measures** (Birkhoff, Visual Entropy, Fractal Dimension, Datta features, NIMA) — they all proxy the same underlying construct.
  4. **Fluency vs Berlyne = liking vs interest, snap vs sustained.** Different design goals need different optimization targets: logos optimize fluency; album covers optimize Berlyne; galleries optimize Leder stages 3+.
  5. **The cross-modal vocabulary table** (in [[Cross-Modal Emotion Mapping]]) is the universal-design substrate: music → emotion → visual, via Arnheim's structural primitives. Closes an open thread from [[Research - Arnheim Sweep 3]].
- Notable theoretical unification: five different computational lineages for aesthetic measurement (Birkhoff, entropy, fractal D, Datta, NIMA) all turn out to be operationalizations of Berlyne's arousal-potential. This is the wiki's central theoretical synthesis at the L2 (theory) layer.
- Notable anti-empathy / anti-projection theme: across Arnheim's structural account, Barrett's constructionism, and the cross-modal correspondence literature, the wiki now has a **strong, multi-grounded account** of *why* emotion can be specified structurally without relying on iconographic or learned-association vocabulary.
- Empirical claims absorbed (sample): Palmer-Schloss WAVE correlates with color preference at $r \approx 0.89$; blue most-preferred and yellow-green least-preferred cross-culturally; Berlyne inverted-U for mid-complexity preference; Vessel & Rubin 2010 finding that faces/scenes show high inter-rater preference agreement but art shows low; Barrett et al. 2019 facial-expression / emotion correlation under 30%; aesthetic emotions (being moved, awe, nostalgia) distinct from basic emotions.
- Open threads: implement the directed-tension score (carried from Sweep 3, now better-specified — magnitude → arousal axis, valence → harmony+direction); build cross-modal vocabulary mapper (deferred to after tools sweep per policy); build physiognomic-features extractor; primary-source reads still pending for Russell 1980, Berlyne 1971, Barrett 2017, Palmer-Schloss 2010, Mehrabian 1996, Vessel 2012.
- Three catalog stubs ([[Emotion Psychology]], [[Color Psychology]], [[Empirical Aesthetics]]) updated: status moved from `stub` to `stable`; depth-dive marked complete; linked to the new concept pages.
- Next sweep per locked sequence: **L1 Cleanup** (items 5 + 12: Perceptual Constants + Face Perception). Short, well-bounded.

## 2026-05-17 — Catalog sweep: 15 field stubs + Field Map
- Per [[Wiki Methodology]] strategic-catalog policy: after Arnheim closed, enumerate the major fields the wiki has not named so future depth-dives have the map of the territory.
- Pages created (16 new, post-rollout, addresses c-000074..c-000089):
  - Field stubs (queue order): [[Emotion Psychology]] (c-000074, #1), [[Color Psychology]] (c-000075, #2), [[Empirical Aesthetics]] (c-000076, #3), [[Algorithmic Composition]] (c-000077, #4), [[Perceptual Constants]] (c-000078, #5), [[Visual Hierarchy and Typography]] (c-000079, #6), [[Negative Space]] (c-000080, #7), [[Time-based Composition]] (c-000081, #8), [[Movement Rhythm and Repetition]] (c-000082, #9), [[Light Vocabulary]] (c-000083, #10), [[Body Language and Pose Semantics]] (c-000084, #11), [[Face Perception]] (c-000085, #12), [[Materials and Texture]] (c-000086, #13), [[Style as System]] (c-000087, #14), [[Cultural and Symbolic Iconography]] (c-000088, #15)
  - Synthesis: [[Field Map - Visual Thinking Knowledge Domains]] (c-000089) — five-layer wiki stratification (perception → theory → design → generation → application), connection-density map, cross-cutting research projects, revised sweep-sequence proposal.
- Each stub follows the catalog template: 2–5 canonical figures, 3–10 key concepts, "why this matters for the four priorities" table, connections to existing wiki pages, "what's missing," depth-dive plan, source-reading list. Stubs are scaffolds, not depth-dives.
- Key surprises from the Field Map:
  - **Arnheim Sweep 3 substantially pre-covers queue items 8, 9, 11, 14, 15** — those depth-dives are now lighter and faster (catalog extensions on the Arnheim structural framework, not foundational reads).
  - **Items 1, 2, 3 (emotion / color / empirical aesthetics) form a tight cluster** that should depth-dive together via the Russell-circumplex / Berlyne-arousal-potential shared substrate. Combine into one "Affect Foundations" sweep.
  - **Item 4 (Algorithmic Composition) is the natural pair to the eventual tools sweep**. Logically these belong together.
  - **Items 5 + 12 are the only remaining L1 perception fields** (constancies + face). Short L1-cleanup sweep.
  - **Items 6, 7, 10, 13 form the practical-design cluster** (typography, negative space, cinematic light, materials/PBR). One fast practical sweep.
- Revised sweep sequence (proposal, in Field Map): 6 sweeps to close the queue instead of ~12, by exploiting Arnheim pre-coverage and identified clusters.
- Three cross-cutting research projects identified as highest-leverage single-effort work: (1) Directed-Tension Score implementation; (2) Cross-Modal Expressive Vocabulary mapper for visualizers; (3) Physiognomic-Features Extractor as Datta-features complement.
- Three open meta-questions filed for the user: single-field vs clustered sweeps; reading-only vs reading+implementation sweeps; when to start the tools sweep (immediately in parallel or after Algorithmic Composition depth-dive).
- Field Map identifies **load-bearing pages** (highest connection density): [[The Structural Skeleton]], [[Perceptual Forces]], [[Simplicity (Arnheim)]], [[Directed Tension]], [[Expression as Configuration of Forces]], [[Symbolic Pattern in Composition]], [[Physiognomic Perception]]. These are the pages whose changes propagate widely.

## 2026-05-17 — Arnheim Sweep 3: Movement + Tension + Expression (chapters VIII–X)
- Per user directive ("let's finish Arnheim Sweep 3 before catalog"), the Sweep-3 depth-dive was pulled forward from its deprioritized position. The book is now closed as a primary reference.
- Source: Rudolf Arnheim, *Art and Visual Perception* (1956 Faber edition; PDF at `~/Downloads/2015.198045.Art-And-Visual-Perception_text.pdf`). Read in 20-page chunks. Chapters VIII (Movement, pp.372–393), IX (Tension, pp.394–423), X (Expression, pp.425–443).
- Pages created (10 new, post-rollout, addresses c-000064..c-000073):
  - Movement: [[Stroboscopic Motion]] (c-000064), [[Frame of Reference for Motion]] (c-000065), [[Phenomenal Causality]] (c-000066), [[Organic vs Mechanical Motion]] (c-000067)
  - Tension: [[Directed Tension]] (c-000068), [[Dynamics of Obliqueness]] (c-000069)
  - Expression: [[Expression as Configuration of Forces]] (c-000070), [[Physiognomic Perception]] (c-000071), [[Symbolic Pattern in Composition]] (c-000072)
  - Synthesis: [[Research - Arnheim Sweep 3]] (c-000073)
- Source page updated: [[Arnheim - Art and Visual Perception]] now lists **23 derived concept pages** (6 + 8 + 9 across three sweeps) and absorbs 9 new high-confidence claims. Status moved to `stable`.
- Key cross-cutting finding: **the forces ontology runs end-to-end through Arnheim's framework**. The same perceptual forces that organize the visual field (Sweeps 1–2) produce directed tension when unresolved (Ch IX), expression through isomorphism with felt-experience force patterns (Ch X), and symbolism through universal-pattern resonance with physical/mental events (Ch X). No new ontology is introduced for "meaning" or "expression" — they fall out of the original perceptual-forces substrate.
- Notable programmable contributions: [[Directed Tension]] specifies a 5-generator scoring scheme (obliqueness + asymmetry + truncation + gradient + convergence) directly computable from images — a composition metric absent from Birkhoff/Datta/NIMA. [[Dynamics of Obliqueness]] includes a closed-form angular-tension formula (peak at 45°). [[Phenomenal Causality]] sets the **70 ms hard latency budget** for any beat-driven visualizer (priority 4). [[Organic vs Mechanical Motion]] provides a recipe (multi-joint, phase variation, minimum-jerk, micro-variability) for procedural motion that reads as alive.
- Cross-modal vocabulary established: the structural primitives (rising/falling, expansion/contraction, harmony/discord, struggle/conformance) parameterize both visual AND auditory expression. This is the principled basis for music-reactive visualizers that read as *expressive* rather than merely amplitude-reactive.
- Anti-empathy thesis absorbed: expression is intrinsic to the pattern, not projected by the viewer. A "happy" logo doesn't need a smile; it needs an upward, open, balanced, rapid force configuration. Validates pure-abstract generators for emotion-driven work.
- Empirical claims absorbed: Wertheimer's stroboscopic ISI thresholds (30–200 ms); Duncker's frame-of-reference enclosure rule; Michotte's launching/triggering thresholds; Wertheimer's Binney sad-dance experiment (formal vocabulary of sadness invented spontaneously by dancers).
- Open threads: implement and test the directed-tension score; verify Michotte's 70 ms threshold on browser audio-render pipelines; integrate Arnheim's anti-projection expression vocabulary with affect models (Plutchik, Russell circumplex) and color psychology (Goethe, cultural-variation literature) which Arnheim does **not** cover. Wertheimer 1912, Duncker 1929, Michotte 1946, Werner 1948, Kandinsky 1926 all remain primary sources untouched.
- Sweep 3 contributes to **queue items 1, 2, 3, 4, 8, 9, 11, 14, 15** — the largest leverage of any single sweep. After Sweep 3 the **catalog sweep** is unblocked and runs next, followed by emotion-psychology + color-psychology depth-dives.

## 2026-05-17 — Arnheim Sweep 2: Space + Light + Color (chapters V–VII)
- Continuation of the depth-dive directive. Skipped Chapters III (Form) and IV (Growth) — child-development psychology of visual representation, orthogonal to programmatic art priorities.
- Source: Rudolf Arnheim, *Art and Visual Perception* (1956 Faber edition; read directly from user's local PDF at `~/Downloads/2015.198045.Art-And-Visual-Perception_text.pdf`). Used the `Read pages:` tool in 20-page chunks. Chapters V (Space, pp.213–290), VI (Light, pp.292–322), VII (Color, pp.323–359).
- Pages created (13 new, post-rollout, addresses c-000051..c-000063):
  - Space concepts: [[Figure and Ground]] (c-000051), [[Depth by Overlapping]] (c-000052), [[Perceptual Gradients]] (c-000053), [[Pyramidal Space]] (c-000054), [[Aerial Perspective]] (c-000055), [[Central Perspective]] (c-000056)
  - Light concepts: [[Illumination as a Perceptual Layer]] (c-000057), [[Shading and Volume]] (c-000058)
  - Color concepts: [[Hue Brightness Saturation]] (c-000059), [[Arnheim's Color Syntax]] (c-000060), [[Complementary Colors]] (c-000061), [[Warm and Cool Colors]] (c-000062)
  - Synthesis: [[Research - Arnheim Sweep 2]] (c-000063)
- Source page updated: [[Arnheim - Art and Visual Perception]] now lists 14 derived concept pages (6 from Sweep 1 + 8 from Sweep 2) and absorbs 7 new high-confidence claims.
- Key cross-cutting finding: **the simplicity-economy principle is the unifying mechanism** across all three chapters. 3D depth, figure/ground, illumination splits, color harmony, and Birkhoff-Visual-Entropy aesthetic measures are *all instances* of the same drive: the eye picks the configuration that yields the simplest total. Arnheim provides the perceptual-mechanism account; computational aesthetics provides the measurement account.
- Notable programmable contributions: [[Perceptual Gradients]] gives 6 independently tunable depth-cue parameters; [[Arnheim's Color Syntax]] is one of the few directly-implementable structural color-harmony frameworks (4-class hue-pair decomposition); [[Warm and Cool Colors]] proposes a deviation-from-pure-hue theory that contradicts standard "warm half / cool half" pedagogy.
- Empirical claims absorbed: ~160 distinguishable hues × ~200 brightness × up to ~20 saturation (Chandler 1934); Helmholtz-Ratoosh local rule for overlap depth (unbroken contour = front); Gehrcke-Lau cone experiment (no shading → no volume); Goldstein's cerebellar-patient color-deviation data.
- Open threads filed: Implement and test [[Arnheim's Color Syntax]] empirically (highest-leverage research project); validate warm/cool deviation theory; build a depth-cue-counting metric. Primary sources still unread: Gibson 1950 (gradient theory), Katz 1935 (film color), Köhler/Wertheimer originals.
- Sweep 3 (Movement + Tension + Expression, Ch. VIII–X) remains queued but **deprioritized** per the strategic-catalog policy: better to catalog the 15 gaps and start depth-dives on emotion psychology + color psychology before returning to Arnheim.

## 2026-05-17 — Arnheim Sweep 1: Balance + Shape (depth-first primary-source read)
- First sweep under the depth-first directive ("the wiki is the expert system, not code snippets"; primary sources over secondary).
- Source: Rudolf Arnheim, *Art and Visual Perception: A Psychology of the Creative Eye* (Faber 1956 ed., facsimile via Internet Archive). Chapters 1 (Balance) and 2 (Shape) read in chunks via OCR'd PDF.
- Pages created (8 new, post-rollout, addresses c-000043..c-000050):
  - Concepts: [[Perceptual Forces]] (c-000043), [[The Structural Skeleton]] (c-000044), [[Visual Balance]] (c-000045), [[Visual Weight]] (c-000046), [[Perceptual Concepts]] (c-000047), [[Simplicity (Arnheim)]] (c-000048)
  - Source: [[Arnheim - Art and Visual Perception]] (c-000049)
  - Synthesis: [[Research - Arnheim Sweep 1]] (c-000050)
- Key finding: Arnheim provides **theoretical depth** that the wiki's existing composition/Gestalt/aesthetic-measures pages were summarizing without grounding. The field-of-forces framework, structural skeleton, visual weight factor list, perceptual concepts (≠ intellectual abstraction), and structural simplicity (≠ quantitative simplicity) all extend or anchor existing content.
- Direct connections updated: Birkhoff $M = O/C$ ↔ Arnheim's structural simplicity; Visual Entropy / Fractal Dimension mid-range preference ↔ structural-simplicity-unifying-complexity; Datta's 56 photo features ↔ CV-extractable proxies for visual-weight factors; Vectorizing Aesthetic Concepts ↔ Arnheim's "perceptual concepts" theory.
- Specific empirical claims absorbed: Top/Bottom asymmetry (Langfeld bisection effect — observers mark vertical bisection too high); Right/Left asymmetry (Wölfflin/Gaffron — right side heavier, left side carries importance, tied to reading direction).
- Open threads filed: 8 chapters remaining (Form, Growth, Space, Light, Color, Movement, Tension, Expression) — queued as Arnheim Sweep 2 (Space + Light + Color) and Sweep 3 (Movement + Dynamics + Expression). Also: Köhler primary source on cortical-field-of-forces; Wertheimer 1923 *Prägnanz* primary; Locher/Stappers/Overbeeke computational implementations.
- Process notes: OCR'd PDF from Internet Archive had fragmented words across line breaks; required preprocessing (paragraph reflow + camelCase splitting) for efficient reading. The 1956 Faber edition pagination differs from later editions; for citation purposes verify against the 1974 or 2004 New Version.

## 2026-05-16 autoresearch | LLM Techniques for Visual Reasoning
- Rounds: 1
- Searches: 5 angles, 5 sources fetched (clean 5/5)
- Pages created (10 new, addresses c-000033..c-000042):
  - Concepts: [[Vectorizing Aesthetic Concepts]], [[JSON Archetypes for Visual Tasks]], [[Multimodal Evaluation Loops]], [[LLM-as-Judge for Visual Quality]]
  - Sources: [[MLLM-as-a-Judge]], [[Anthropic - Structured Outputs]], [[Visual Prompting Iterative Refinement]], [[Self-Refine - Iterative Refinement]], [[Mind the Gap - VLM Spatial Reasoning]]
  - Synthesis: [[Research - LLM Techniques]]
- Key finding: four composable techniques. Critical caveat — SOTA VLMs at random chance on native spatial reasoning (Stogiannidis et al., March 2025); offload measurables to CV.

## 2026-05-16 autoresearch | Aesthetic Measures
- Pages created (9 new, addresses c-000024..c-000032):
  - Concepts: [[Fractal Dimension]], [[Computational Aesthetics]], [[Photo Aesthetic Features]]
  - Sources: [[Douchová - Birkhoff's Aesthetic Measure]], [[Rigau Feixas Sbert - Birkhoff Shannon Kolmogorov]], [[Spehar Taylor - Universal Aesthetic of Fractals]], [[Datta - Studying Aesthetics in Photographic Images]], [[NIMA - Neural Image Assessment]]
  - Synthesis: [[Research - Aesthetic Measures]]
- Pages rewritten: [[Birkhoff's Aesthetic Measure]], [[Visual Entropy]]
- Key finding: order/complexity tradeoff is the field's unifying axis; $D \in [1.3, 1.5]$ is the strongest empirical result.

## 2026-05-16 autoresearch | Color Systems
- Pages created (9 new, addresses c-000015..c-000023):
  - Concepts: [[CIEDE2000]], [[OKLCH]], [[Color Harmony]], [[WCAG Contrast Ratios]]
  - Sources: [[Wikipedia - Munsell color system]], [[Techkon - CIE Delta E 2000 Formula]], [[Bottosson - Oklab Color Space]], [[W3C WCAG 22 - Contrast Minimum]]
  - Synthesis: [[Research - Color Systems]]
- Pages rewritten: [[The Munsell and CIELAB Color Systems]]
- Key finding: programmable color belongs in a perceptual space. OKLCH is the current best default for digital work.

## 2026-05-16 autoresearch | Composition Foundations
- Pages created (4 new, addresses c-000011..c-000014):
  - Synthesis: [[Research - Composition Foundations]]
  - Sources: [[Public Seminar - Dynamic Symmetry]], [[Wikipedia - Rule of Thirds]], [[PetaPixel - True Photographic History]]
- Pages rewritten: [[The Gestalt Principles of Visual Perception]] · [[Dynamic Symmetry]] · [[Compositional Grids]] · [[Rule of Thirds]] · [[Golden Spiral]]
- Key finding: composition has two layers — Gestalt (psychological substrate) and grids (geometric surface). The rule-of-thirds is a 1950s–80s reconstruction conflated with the Golden Mean.

## 2026-05-16 — Scope principle codified; 3 entity pages removed
- Programmability principle: a page earns its place only if it translates into a prompt constraint, metric, or generative rule.
- Deleted entity pages c-000002 / c-000003 / c-000004 (Caravaggio, Leonardo, Rembrandt). Addresses burned.
- Created [[Visual Entropy]] (c-000010).

## 2026-05-16 autoresearch | Tonal Foundations in Classical Painting
- Pages created (9 new, addresses c-000001..c-000009): [[Sfumato]] (concept); 3 entity pages (later deleted); [[The Art Story - Chiaroscuro Tenebrism Sfumato]], [[DailyArt - Tenebrism 101]], [[ESRF - New light on Leonardo's faces]], [[Wikipedia - The Calling of Saint Matthew]]; synthesis [[Research - Tonal Foundations in Classical Painting]]
- Pages rewritten: [[Chiaroscuro]] · [[Tenebrism]]
- Key finding: chiaroscuro / sfumato / tenebrism are three *functionally distinct* uses of the same tonal vocabulary.

## 2026-05-16 — DragonScale Memory enabled; canonical layout adopted
- Ran `bin/setup-vault.sh`. Initial symlinks broke (`Path(__file__).resolve()` followed symlinks); fixed by replacing with copies.
- Ran `bin/setup-dragonscale.sh`. Mechs 1, 2, 4 live; Mech 3 deferred.
- Rollout baseline: 2026-05-16.

## 2026-05-15 — Wiki seeded
- Vault purpose: visual-thinking knowledge base from `Wiki Seed.md`.
- Initial scaffold + 9 stub concept pages for seed wikilinks.
