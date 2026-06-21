---
title: Hot Cache
tags: [meta, hot]
status: living
updated: 2026-05-20
---

> **Status: 🛠️ BUILD PHASE ACTIVE 2026-05-18.** Wiki layer LOCKED (sweep sequence complete 2026-05-17 — see Build state below for current activity). Sweep 7 (Implementation-notes pass, final) ✅ done. 12 technique pages + 1 synthesis ([[Research - Implementation-notes Pass]]) translate the reading layer into operational recipes: [[OKLCH Pair-Relation Classifier]] · [[Contrast Checking Pipeline]] · [[Directed Tension Score]] · [[Visual Hierarchy and Negative Space Scoring]] · [[Aesthetic Measure Stack]] · [[Pose-Emotion Dimension Scorer]] · [[Contrapposto Scorer]] · [[Cultural Emblem Detector]] · [[Audio-to-Visual Cross-Modal Mapping]] · [[Realtime Pose-to-Visualizer Loop]] · [[Symmetry-Group Pattern Generator]] · [[Style Transfer Pipeline]]. **The 15-gap queue is now covered at both reading AND technique layers.** Default stack consolidated: **culori + MediaPipe Tasks + TFJS WebGPU + three.js + meyda + AudioWorklet + Anthropic SDK**.

## Build state (2026-05-20, active)

- **Subsystem A — Wiki MCP (`mcp/`)** ✅ shipped. PR #1 merged. `@visualthinking/wiki-mcp@0.1.0`. Registered at `.mcp.json`. Known gap: `orient` under-surfaces tradition-specific terms; pair with `search` keyword.
- **Subsystem B — Toolkit (`toolkit/`)** 🛠️ first slice shipped, **PR #2 open** on branch `toolkit-screensaver`. The toolkit IS the operator library: pure functions over a `RenderPlan`, **operators measure / profiles set targets**, a composer returns composite + ranked fixes. Key reframe: **evaluate self-generated render-plans, not bitmaps** (removes CV risk; deterministic generate→score loop). **7 operators**: symmetry · complexity · colorChord · constructionGrammar · lineContinuity · cuerdaSeca · tileComplexity. **2 generators** (igp lines, tiling cells) + **2 profiles** (timurid-igp strapwork, timurid-tiling cells). Scorecard gallery (`npm run gallery`) shows good vs 8 deliberate failures, each isolating its axis. 53 tests pass. See `toolkit/README.md` + `docs/superpowers/specs/2026-05-20-operator-composition-slice-design.md`.
- **Operational readiness** — every concept page must equip Perceive/Build/Evaluate OR compose Evaluate from general operators (cross-domain composition). Triage registry at [[Operational Readiness Registry]] (141 pages scored; Evaluate is the systemic gap). IGP (c-000191) re-scored 3→4 (Evaluate now composes from toolkit operators).
- **Auto-memory** ✅ in `.claude/memory/` (committed; symlinked for harness). Future sessions see project state inline.

**Next session (2026-05-21): close the loop.** Wire the composer's `fixes` back into the generators — an `improve(plan, profile)` step that nudges params toward targets, turning evaluation into generate→score→**fix→regenerate**. This is the "optimize" capability the architecture was built for. (Deferred: external-image CV/VLM front-end; the O4 organized-complexity composite — not triggered, weighted sum hasn't mis-ranked; full wiki write-back binding all 7 operators to their concept pages.)

Lessons (toolkit build):
1. **Test artifact ≠ goal** — the screensaver/IGP is a test case for the wiki+MCP+toolkit *workflow*; the workflow is the product.
2. **npm-search audit before designing**, not just cataloging.
3. **Cross-domain composition over per-page completeness** — medium pages bind to general operators with weights+targets; don't duplicate machinery per medium.
4. **Aesthetic target is OPEN** — user likes the geometric direction but it may not be IGP; the operators/composer are medium-agnostic, so retargeting = swap generator + profile only.
5. **Visual companion / scorecard gallery is load-bearing** — seeing scored failures surfaced a real legibility bug (score vs measured).

# Hot Cache

Pages most recently touched or most relevant to current work. Read this first when answering queries from the vault.

## Standing principles

- **Programmability principle:** Pages exist for concepts, techniques, measurable phenomena, computational frameworks, and source pointers — things that translate into prompt constraints, metrics, or generative rules. People and biographies don't get pages.
- **Strategic catalog → prioritized depth:** Sweep strategy is (1) catalog the territory of relevant fields, (2) deep-dive by user-set application priority. Pure depth-first was wrong; primary sources matter but only after the map is in place. (See `feedback_depth-first-wiki.md` memory.)
- **Language preference (when we build):** JS/TS first; Python only when JS equivalent is weak; Rust/Go only with a 2026-specific reason. WebGPU + three.js + Anthropic TS SDK is the default stack.

## User's application priorities (anchors all sweep planning)

In order:

1. **Programmatically generated art** — static + dynamic
2. **Branding** — identity systems, logos
3. **Graphic design** — websites, posters, marketing assets
4. **Real-time generative visuals responding to music/sound** — Apple Music Visualizer–style

See `project_application-priorities.md` memory.

## Where we are (snapshot)

- **239 pages** in the vault (152 pre-Option-C → 180 post-Option-C → 198 post-Practical-Design → 215 post-Movement-Rhythm-Style-Symbolism → 224 post-Body-Language-Depth → 237 post-Implementation-Pass → 239 post-lint-cleanup); all wikilinks resolve. **0 orphans, 0 actionable dead links** after lint cleanup.
- **225 DragonScale addresses** reserved (c-000001 through c-000225); 3 burned by deleted entity pages; next free = c-000226.
- 5 conceptual-branch syntheses + 12 sweep syntheses + 1 Field Map + 1 Framings Map + 1 Tools Map + 1 AI-Art Toolkit Map = 21 synthesis / map pages.
- `wiki/tools/` now: **29 pages** (covers 7 of 9 generative-art framings).
- `wiki/techniques/` now populated: **12 pages** (all from Sweep 7) — the operational layer.
- `wiki/concepts/` grew by 17 in Practical Design + 17 in Movement-Rhythm-Style-Symbolism + 6 in Body Language Depth = 40 new concept pages across 3 sweeps. 9 catalog stubs converted from `status: stub` to `status: developed`.
- 4 Phase 3 audit critique sections on anchor pages: [[Berlyne's Arousal-Potential Theory|Berlyne]] · [[Russell's Affect Circumplex|Russell]] · [[Helmholtz Gibson and Bayesian Perception|Helmholtz-Gibson-Bayesian]] · [[Face Recognition Universality Debate|Face universality]].
- [[Wiki Methodology]] carries the six discovery+audit conventions (Phase 4 lock-in).
- 4 new feedback memories across Option C: `framing-canonicity`, `source-fetch-fallback`, `cross-cultural-validity`, `successor-theory-tracking`.
- **3 Arnheim depth-dive syntheses complete**: Sweeps 1, 2, 3. **Arnheim closed.**
- **Catalog sweep complete**: 15 field stubs + Field Map.
- **3 clustered depth-dive sweeps complete** (in order):
  - **Affect Foundations** (items 1+2+3, 13 pages) — L2 theory layer.
  - **L1 Cleanup** (items 5+12, 11 pages) — L1 perception substrate complete (30+ pages total covering perception).
  - **Algorithmic Composition + Tools** (item 4 + tools, 20 pages) — L4 generation layer complete.
- **Three structural theoretical unifications now in place**:
  - **Berlyne's arousal-potential** subsumes 5 computational aesthetic measures (Birkhoff, Visual Entropy, Fractal D, Datta, NIMA). L2 unification.
  - **Bayesian / predictive-processing** synthesizes Helmholtz vs Gibson; explains constancies, illusions, uncanny valley, cross-cultural variation. L1 unification.
  - **Effective complexity** (Galanter) = arousal-potential (Berlyne) — the wiki's central theoretical pillar; the generation side and evaluation side meet explicitly. L2↔L4 unification.
- Recurring pattern across 4 domains: **universal substrate + cultural overlay** (color, emotion, perception, face-emotion). Justifies the policy of preferring dimensional / structural specifications over categorical ones for cross-cultural work.
- `wiki/tools/` is now populated with **15 pages**: 10 core-library evaluations + [[q5.js]] sibling + [[react-three-fiber]] paradigm + 3 ecosystem surveys ([[p5.js Plugin Ecosystem]], [[three.js Addon Ecosystem]], [[Creative Coding Utilities]]) + [[Tools Map]] comparative summary.
- `wiki/techniques/` now populated with **12 pages from Sweep 7**: see Sweep 7 row above. Default stack consolidated: culori + MediaPipe Tasks + TFJS WebGPU + three.js + meyda + AudioWorklet + Anthropic SDK.
- Burned-but-decided gaps (intentional): no entity pages for people; no role pages for paintings unless the page contains analyzable data.

## What's queued (next session)

**Sweep sequence locked 2026-05-17** — see [[Wiki Methodology]] + [[Field Map - Visual Thinking Knowledge Domains]].

Three policy decisions:
1. **Clustered sweeps** (not single-field).
2. **Reading-only** on concept-page depth-dives. No JS/TS code on concept pages until after the tools sweep — avoids locking in choices before tools are evaluated. Pseudocode for math/algorithm clarity is fine.
3. **Algorithmic Composition before tools sweep** (framework supplies the library-evaluation rubric).

Locked sequence (6 clustered sweeps):

| # | Sweep | Items | Status |
|---|---|---|---|
| 1 | Affect Foundations | 1 emotion + 2 color + 3 empirical aesthetics | ✅ Done 2026-05-17 (pending Phase 3 audit) |
| 2 | L1 Cleanup | 5 constancies + 12 face | ✅ Done 2026-05-17 (pending Phase 3 audit) |
| 3 | Algorithmic Composition + Tools | 4 + tools | ✅ Done 2026-05-17 (canonicity overclaim flagged; pending Phase 1 revisit) |
| 3.5 | **Discovery Methodology Fix (Option C)** | All 4 phases | ✅ **DONE 2026-05-17** (Phases 1, 2, 3, 4). Closing synthesis: [[Research - Phase 4 Methodology Lock-in]]. |
| 4 | **Practical Design** | 6 typography + 7 negative space + 10 light + 13 materials | ✅ **Done 2026-05-17** — 17 new pages + synthesis. See [[Research - Practical Design Sweep]]. |
| 5 | **Movement-Rhythm-Style-Symbolism** | 8 + 9 + 14 + 15 | ✅ **Done 2026-05-17** — 17 new pages + synthesis. Conventions #2/#5/#6 heavy. See [[Research - Movement-Rhythm-Style-Symbolism Sweep]]. |
| 6 | **Body Language Depth** | 11 | ✅ **Done 2026-05-17** — 7 new pages + synthesis. de Gelder + Birdwhistell + pose-extraction. See [[Research - Body Language Depth Sweep]]. |
| 7 | **Implementation-notes pass** | All revisited | ✅ **Done 2026-05-17** — 12 technique pages + synthesis. See [[Research - Implementation-notes Pass]]. Wiki transitions from knowledge base to operational reference. |

## The 15-gap depth-dive priority queue (user-set 2026-05-17)

1. Emotion psychology — Plutchik, Russell's affect circumplex, James-Lange, Ekman, FACS
2. Color psychology — color-emotion associations, cultural variation, Goethe
3. Empirical aesthetics — Fechner (1876), Berlyne (1971 arousal-potential), Palmer & Schloss, Vessel
4. Algorithmic composition — Nake, Mohr, Cohen's AARON, Galanter generative-art theory
5. Perceptual constants — size/shape/color constancy; Müller-Lyer, Ebbinghaus illusions
6. Visual hierarchy / typography
7. Negative space (first-class)
8. Time-based composition — Eisenstein, McCloud
9. Movement, rhythm, repetition with variation (Arnheim Ch 8–9 partly covers)
10. Light vocabulary beyond chiaroscuro — key/fill/back, three-point, motivated practical
11. Body language / pose semantics
12. Face perception — FACS, micro-expressions, uncanny valley
13. Materials and texture
14. Style as system — Impressionism / Cubism / Bauhaus as rule-sets; style transfer
15. Cultural / symbolic / iconographic

**Arnheim is closed** as a primary reference (2026-05-17). All perceptually-relevant chapters (I–II, V–X) ingested. Chapters III/IV (Form, Growth — developmental psychology of children's drawings) intentionally skipped per the programmability principle. Reopen only for specific citations.

## Open threads — Arnheim sweep
- Remaining chapters: III (Form), IV (Growth). Intentionally skipped; reopen only if LLM-as-developmental-stage-simulator becomes a research direction.
- **Implement and test [[Arnheim's Color Syntax]] empirically** — highest-leverage research project from Sweep 2. Build an OKLCH classifier for the 4 pair-relation classes; generate labeled palettes; have VLMs or humans rate harmony.
- **Validate the warm/cool deviation theory** ([[Warm and Cool Colors]]) — same experimental setup at equal-brightness equal-saturation.
- **Build a depth-cue-counting metric** — score images by how many of Arnheim's ~10 cues are engaged and whether they agree.
- **Implement and test the [[Directed Tension]] score** (Sweep 3) — 5-generator sum (obliqueness + asymmetry + truncation + gradient + convergence). Score the AVA dataset; validate against human "dynamism" ratings. Highest-leverage research project from Sweep 3.
- **Verify Michotte's 70 ms causality threshold on browser audio→render pipelines** — measure `AudioWorklet`-event-to-WebGPU-frame latency. If it exceeds 70 ms, causal music-reactive visualizers need event prediction.
- **Build a cross-modal expressive-vocabulary mapping** (rising/falling, expansion/contraction, harmony/discord) from audio features to visual features, derived from Arnheim's primitives. Test on music-album-cover dataset.
- **Build a physiognomic-features extractor** to complement Datta's 56 geometric features ([[Photo Aesthetic Features]]) — energy, temperature, openness/closure, ascent/descent, hardness/softness of contours.
- Köhler primary source on cortical-field-of-forces (1929/1947 *Gestalt Psychology*).
- Wertheimer 1923 primary on *Prägnanz*.
- Gibson 1950 *The Perception of the Visual World* — the gradient theory Arnheim adopts (cited extensively in Sweep 2).
- Katz 1935 *The World of Colour* — film-color / glow distinctions.
- Locher, Stappers, Overbeeke computational implementations.
- PMC3485801 "Arnheim's Gestalt Theory of Visual Balance" — retry through alternate channel.
- Cross-cultural validation of top/bottom and right/left asymmetries.
- "Minimum complexity" threshold — connection to Berlyne's arousal-potential.

## Open threads — earlier sweeps (carried forward)
- **Color:** Itten *The Elements of Color* (priority 2 of queue); Somers APCA + WCAG 3; HCT (Material 3); empirical harmony-preference studies.
- **Composition:** Wagemans 2012; Mario Livio *The Golden Ratio*; Cartier-Bresson's actual practice; Diagonal Method.
- **Tonal foundations:** Viguerie 2010 *Angewandte Chemie* paper; tenebrist pigment chemistry; sfumato vs Raphael's *unione*.
- **Aesthetic measures:** Birkhoff 1933 direct read; AVA dataset deep dive; Galanter 2012; OKLCH ΔE production thresholds.
- **LLM techniques:** VLM spatial-reasoning re-test on Claude Opus 4.7 / GPT-5 / Gemini 2.5+; domain transfer to fine art; MLLM judge calibration per domain; production "satisfied" predicates.

## Infrastructure
- 152 pages; install ollama + `nomic-embed-text` to enable DragonScale Mech 3 (semantic tiling lint) — at this scale duplicate-page detection is meaningfully valuable.
- Consider running `claude-obsidian:wiki-fold` once the log reaches ~16 entries (currently 14). A `claude-obsidian:wiki-lint` pass is increasingly worthwhile — 75 pages added today across six sweeps; orphan / dead-link risk is non-trivial.

## Process note (2026-05-17)
Two related process gaps caught by user audit on the same day:
1. The Tools sweep addendum surfaced **catalog-stub-vs-sweep mismatch**: the p5.js plugin galaxy was scoped in the [[Algorithmic Composition]] catalog stub but dropped without explicit decision during the sweep. Fix: depth-dives that intentionally narrow their stub's scope must say so explicitly in the synthesis. Memorialized as `feedback_catalog-stub-cross-check` in memory and as a "catalog-stub cross-check" convention in [[Wiki Methodology]].
2. The three.js npm-page-1 audit surfaced an additional gap: **purely-from-memory listing of "important libraries" reliably misses heavily-used production tools**. Three-stdlib (12M weekly dl), camera-controls (12M), detect-gpu (11M), gainmap-js (11M), and the vasturiano data-viz ecosystem were all missed despite being among the top-15 most-downloaded packages keyed `three`. Fix: **npm-search audits at depth-dive completion** for any sweep that evaluates libraries — search by relevant keywords, scan top-page hits against the sweep output, fill gaps.
- Arnheim PDF source remains at `~/Downloads/2015.198045.Art-And-Visual-Perception_text.pdf`. Book is closed as a primary reference; specific citation lookups only.
