---
title: Wiki Methodology
type: meta
aliases: [editorial policy, vault methodology, sweep strategy]
tags: [meta, methodology, policy]
status: living
created: 2026-05-17
updated: 2026-05-17
---

# Wiki Methodology

> The authoritative page on **what this wiki is for, what earns a page, and how research sweeps are prioritized**. Living document — update as the policy evolves.

This page exists because the wiki is an **expert-system deliverable**, not a code-snippet collection. Without a written methodology, sweep decisions drift toward whatever's intellectually closest rather than what serves the user's applications.

## The wiki's purpose

A knowledge base translating intuitive visual beauty into **logical, programmable structure** — so an LLM (and code) can reason about images. The end state is an expert system that can:

- *Generate* visuals that meet specified emotional / aesthetic / functional criteria.
- *Evaluate* generated and existing visuals against the same criteria, with interpretable reasoning.
- *Translate* fuzzy aesthetic vocabulary (art-speak) into structured directives (coordinates, metrics, JSON schemas, programmable constraints).

## Project priorities (in order)

The wiki supports four user-stated applications, ranked 2026-05-17:

1. **Programmatically generated art** — static and dynamic. Top priority.
2. **Branding** — identity systems, logos, brand-system design.
3. **Graphic design** — personal and corporate websites, posters, marketing assets.
4. **Real-time generative visuals responding to music/sound** — Apple Music Visualizer–style.

Every sweep prioritization decision must be checked against these four. Sweeps that serve project 1 outrank sweeps that serve only project 4 unless the user redirects.

## Editorial principles

### Programmability principle

A page earns its place only if it translates into a **prompt constraint, a metric, a generative rule, or a source pointer**. That means:

- **In scope:** concepts, techniques, measurable phenomena, computational frameworks, aesthetic measures, color spaces, libraries/tools, sources, research syntheses, meta/methodology pages.
- **Out of scope:** biographies of artists, scientists, or writers. Their names appear as plain-text attribution inside concept pages, not as dedicated entity nodes. (We tested entity pages for Caravaggio, Leonardo da Vinci, and Rembrandt on 2026-05-16 and removed them; addresses `c-000002`, `c-000003`, `c-000004` are burned in the DragonScale counter.)
- **Works/paintings** get a page only if the page contains specific analyzable data (e.g., layer measurements, histogram analysis) used by other pages. Otherwise they're cited in concept/source pages.

> [!important] Before creating any page, ask: "Does this page exist to be a rule, metric, constraint, or pointer?" If no, fold the relevant facts into an existing concept page as plain-text attribution.

### Page-title conventions

Natural-language capitalization (`The Munsell and CIELAB Color Systems`), not kebab-case. Math uses `$...$` / `$$...$$`. Citations as numbered footnotes with full URLs, matching the seed's style.

### Address policy (DragonScale)

Post-rollout non-meta pages must carry `address: c-NNNNNN` in frontmatter. Run `./scripts/allocate-address.sh` to reserve the next one. **Meta pages (in `wiki/meta/`) are exempt** — including this one. Rollout baseline: **2026-05-16**.

## Sweep strategy: **strategic catalog → prioritized depth**

NOT pure depth-first. The first five sweeps (May 2026) were breadth-first within the seed's 4 conceptual branches — that was correct for getting the scaffold in place. The mistake was framing the next step as "depth-first" without first cataloging what was missing relative to the user's actual applications.

The correct sequence going forward:

1. **Finish in-progress depth-dive sources.** Momentum matters; primary-source reads are expensive to re-spin once dropped. *Currently in progress: Arnheim Chapters 3–10 over Sweeps 2 and 3.*
2. **Catalog sweep.** Enumerate the major fields we haven't named (~15 stub-with-substance pages + 1 Field Map synthesis). Each stub names the field, lists 2–3 canonical figures, lists 2–3 key concepts, and marks "depth-dive queued."
3. **Prioritized depth-dives.** Follow the 15-gap queue below in the order the user has specified.

Re-check periodically: every ~5 sweeps, re-survey what's missing relative to the application goals. Depth-investment in one area must not mask blind spots in adjacent ones.

## Current sweep sequence (as of 2026-05-17)

Foundation phase is complete. Sweeps executed:

1. ✅ **Arnheim Sweep 2** — Chapters 5–7 (Space, Light, Color). [[Research - Arnheim Sweep 2]].
2. ✅ **Arnheim Sweep 3** — Chapters 8–10 (Movement, Tension, Expression). [[Research - Arnheim Sweep 3]]. Arnheim closed as primary reference.
3. ✅ **Catalog sweep** — 15 field stubs + [[Field Map - Visual Thinking Knowledge Domains]]. Territory mapped.

## Discovery and audit conventions (Phase 4 lock-in 2026-05-17)

Five conventions consolidated from the three-phase Discovery Methodology Fix (Option C). All five emerged from real failure modes caught during May 2026 sweeps. They are **the canonical anti-overclaim conventions** for this wiki and apply to every future sweep.

> [!important] Why these conventions exist
> The original sweeps (May 2026, first five) systematically over-relied on training-data recall and produced canonicity overclaims across multiple framings. Phase 1 caught the Galanter overclaim; Phase 2 the tools-discovery gap; Phase 3 found 75% of audited canonical claims needed revision. These conventions are designed so that the same failure modes are caught **before** publication, not by user audit afterward.

### 1. Catalog-stub cross-check

When a clustered depth-dive runs, the synthesis page **must explicitly account for scope items named in the catalog stubs** the cluster covers. If the sweep intentionally narrows scope, the synthesis must say so explicitly with justification.

*Failure mode caught:* Algorithmic Composition + Tools sweep silently dropped p5.js plugin galaxy and three.js addon ecosystem; user audit caught the gap.

*How to apply:* At sweep start, re-read each catalog stub and produce an explicit coverage list. In the synthesis page, include a "Coverage vs catalog stub" section confirming every named scope item was addressed or explicitly deferred. Memorialized in `feedback_catalog-stub-cross-check.md`.

### 2. Framing-canonicity audit

When a depth-dive anchors on a theoretical framework, **survey alternative framings explicitly before settling on one**. Do not claim canonicity for the first framework recalled. In the synthesis page, position the chosen framing as *one defensible framing*, not THE framing. Pay particular attention to claims of unification — they are seductive but often overstate consensus.

*Failure mode caught:* Algorithmic Composition sweep anchored on Galanter 2003 and presented Galanter's effective-complexity = Berlyne's arousal-potential as "the wiki's central theoretical pillar." Phase 1 audit revealed 8 alternative framings; Phase 3 audit revealed Berlyne is substantially abandoned in mainstream literature.

*How to apply:* At depth-dive start, explicitly list alternative framings (autoresearch is appropriate here). Empirical claims should be **flagged as contested** if they are. Unification claims ("X = Y = the spine of the framework") trigger automatic audit. Memorialized in `feedback_framing-canonicity.md`.

### 3. npm-search + GitHub-search audit for library / tools sweeps

Pure-from-memory listing of "important libraries" reliably misses heavily-used production tools. **At depth-dive completion** for any sweep that evaluates libraries:

1. Search npm registry by relevant keywords (`registry.npmjs.org/-/v1/search?text=keywords:...`). Multiple keywords required — single-keyword sweeps miss multi-tag ecosystems.
2. For categories where npm is thin (PCG, ecological-psychology tooling, postdigital), search GitHub by topic (`topic:wave-function-collapse language:javascript`).
3. Read at least one awesome-list per category.
4. Scan results against the sweep output; fill gaps explicitly.
5. **Deprecation check**: flag any package without a release in 18+ months. Wiki should not present deprecated tools as current.

*Failure mode caught:* Tools sweep missed Strudel (23-package ecosystem), Transformers.js (1.12M weekly), Tone.js / Meyda standalone evaluations, and the entire WebGPU DX stack (typegpu, vite-plugin-glsl, wgsl_reflect). Magenta.js was treated as current despite no real updates since 2021.

*How to apply:* Build the npm-search + GitHub-search audit into every tools-sweep workflow. Cross-keyword search is required. Memorialized in `feedback_catalog-stub-cross-check.md` (npm-audit rule).

### 4. Source-fetch fallback ladder

When `WebFetch` fails on a primary-source URL (binary corruption, 403, paywall), use this fallback ladder **before** substituting secondary sources:

1. Try Firecrawl (`mcp__firecrawl__firecrawl_scrape`) — often succeeds where WebFetch fails on PDFs and JS-heavy pages.
2. Try Playwright (`mcp__playwright__*`) — for sites needing a real browser.
3. **Log the URL with a `> [!gap]` callout** on the page that depends on the source. Pin the canonical URL and mark the relevant claims as **secondary-source confidence** until the primary text is verified. The user has agreed to fetch manually when this happens.

Substituting secondary sources without flagging it silently degrades wiki claim-confidence. Source pages depending on a secondary fallback must carry `confidence: medium` (not `high`) and a `> [!gap]` callout.

*Failure mode caught:* Phase 1 attempted WebFetch on Cramer 2014 (lab404.com PDF returned binary), proceeded with secondary summaries. The actual Cramer paper turned out to have **four substantive strands** absent from the secondary summaries (anti-universal-machine, DIY-vs-corporate, semiotic-shift-to-indexical, systems-crisis self-critique). Primary source mattered.

*How to apply:* Run the ladder for every primary-source fetch. Memorialized in `feedback_source-fetch-fallback.md`.

### 5. Cross-cultural validity flag (Phase 3 finding)

Any psychology / perception / aesthetics claim should explicitly state its **cultural-validity scope**. WEIRD (Western, Educated, Industrialized, Rich, Democratic) sample-only validation should be flagged by default. Cross-cultural variation is **the most-reliable falsifier** of canonical claims in perception-psychology — every Phase 3 anchor that had cross-cultural data showed substantial variation.

*Failure mode caught:* Russell's Affect Circumplex was presented as universal; cross-cultural studies show the V-shape geometry varies between Western and East Asian samples (Hong Kong sample showed valence-arousal independence, not orthogonality). Same pattern recurs across face universality (Crivelli/Gendron Himba and Trobriand studies), color symbolism (extensively documented in Phase 1), perceptual constants.

*How to apply:* When citing an empirical psychology / perception / aesthetics claim, ask: "What population was this validated on?" If WEIRD-only, mark it. The pattern that holds across multiple Phase 3 findings: *universal substrate + cultural overlay*. Prefer dimensional / structural specifications over categorical universal claims. Memorialized in `feedback_cross-cultural-validity.md`.

### 6. Successor-theory tracking (Phase 3 finding)

When a framework dominated a field historically, the wiki should track **what replaced it and why** — not just the framework itself. Many historical frameworks remain pedagogically useful but have been substantially superseded by named successor theories. The wiki must distinguish "useful historical anchor" from "live contemporary framework."

*Failure mode caught:* Berlyne's arousal-potential was presented as the wiki's contemporary theoretical workhorse. Phase 3 revealed it has been "mostly abandoned" by current empirical aesthetics; the successor theories ([[Processing Fluency Theory|processing fluency]], neuroaesthetics, predictive-processing) carry the contemporary load. The wiki had the successor pages but presented them as Berlyne's *continuation* rather than its *replacement*.

*How to apply:* When relying on a framework cited primarily from work pre-2010, search for "X replaced", "X successor", "X abandoned", "post-X". If a successor literature exists, name it and explicitly position the original as historical infrastructure. Memorialized in `feedback_successor-theory-tracking.md`.

## Unification-claim red flag

A meta-convention bundling the others: **any time the wiki uses language like "X = Y = the central theoretical pillar"** or **"unified spine of the framework"**, that claim should be treated as a suspect overclaim and audited explicitly. The wiki has retired three such unification claims since May 2026:

- "Galanter's effective-complexity = Berlyne's arousal-potential = the wiki's central theoretical pillar" (Phase 1 + Phase 3 retired)
- "Russell circumplex = the canonical dimensional emotion model" (Phase 3 downgraded to "one defensible representation")
- "Helmholtz-Gibson-Bayesian = the modern resolution" (Phase 3 downgraded to "one defensible reading")

These unifications were seductive because each *was* defensible. But each over-stated the consensus. The base rate of overclaim across audited unifications was 100%. Treat unification language as load-bearing-by-default: it carries the weight of multiple downstream claims, and if it falls, those fall too.

### Three policy decisions locked in 2026-05-17 (from Field Map's open meta-questions):

1. **Clustered depth-dives, not single-field.** The Field Map's 6-cluster proposal is now the canonical sequence. Clusters with shared substrate (Russell circumplex underlying items 1-2-3; Wölfflin / Eisenstein / Panofsky for items 8-9-14-15) are done in one sweep to exploit cross-leverage.
2. **Reading-only on concept-page depth-dives.** No JS/TS implementation code on concept pages during the depth-dive sweeps. Pseudocode for algorithm clarity is fine (e.g., a math formula); library-specific code or "use X" prescriptions are deferred. Reason: implementation choices made before the Algorithmic Composition + tools sweep would lock in stacks we haven't yet evaluated. Implementation work happens *after* the tools sweep, by revisiting concept pages to add notes informed by the evaluated stack.
3. **Algorithmic Composition before tools.** Tools sweep evaluates libraries against the rubric the Algorithmic Composition depth-dive produces (effective complexity, autonomy/control gradient, primitive vocabulary, idiomaticity, LLM-codegen friendliness). Do not start the tools sweep before queue item #4 closes.

### Locked sweep sequence (6 clustered sweeps to close the queue)

| # | Sweep | Items | Status |
|---|---|---|---|
| 1 | **Affect Foundations** | 1, 2, 3 | ✅ Done 2026-05-17. See [[Research - Affect Foundations Sweep]]. Anchor pages revised in Phase 3 audit. |
| 2 | **L1 Cleanup** | 5, 12 | ✅ Done 2026-05-17. See [[Research - L1 Cleanup Sweep]]. Anchor pages revised in Phase 3 audit. |
| 3 | **Algorithmic Composition + Tools** | 4 + tools | ✅ Done 2026-05-17. See [[Research - Algorithmic Composition and Tools Sweep]]. Anchor pages revised in Phase 1; tools expanded in Phase 2. |
| 3.5 | **Discovery Methodology Fix (Option C)** | All 4 phases | ✅ **Done 2026-05-17.** Phase 1 (framings survey + 8 page revisions); Phase 2 (tools survey + 13 new tool pages); Phase 3 (canonicity audit + 4 anchor page revisions); Phase 4 (methodology lock-in — this section). Process tracker: [[Discovery Methodology Plan]]. See also [[Research - Generative Art Framings Sweep]], [[Research - Generative Art Tools Survey]], [[Research - Phase 3 Canonicity Audit]], [[Research - Phase 4 Methodology Lock-in]]. |
| 4 | **Practical Design** | 6, 7, 10, 13 | ✅ Done 2026-05-17. See [[Research - Practical Design Sweep]]. 17 new pages + 1 synthesis. |
| 5 | **Movement-Rhythm-Style-Symbolism** | 8, 9, 14, 15 | ✅ Done 2026-05-17. See [[Research - Movement-Rhythm-Style-Symbolism Sweep]]. 17 new pages + 1 synthesis. Conventions #2/#5/#6 heavy. |
| 6 | **Body Language Depth** | 11 | ✅ Done 2026-05-17. See [[Research - Body Language Depth Sweep]]. 7 new pages + 1 synthesis. 5 of 7 frameworks had named contestation (Birdwhistell superseded; Mehrabian myth; Hall proxemics non-generalizing; power-pose causal claim dead; contrapposto Western-specific). |
| 7 | **Implementation-notes pass** | All revisited | ✅ **Done 2026-05-17.** See [[Research - Implementation-notes Pass]]. 12 technique pages + 1 synthesis. Default stack consolidated (culori + MediaPipe Tasks + TFJS WebGPU + three.js + meyda + AudioWorklet + Anthropic SDK). Wiki transitions from knowledge base to operational reference. **Locked sweep sequence complete.** |

## The 15-gap depth-dive priority queue

User-set 2026-05-17. Execute in this order after Arnheim is complete and the catalog is in place:

| # | Gap | Why it serves the project priorities |
|---|---|---|
| 1 | **Emotion psychology** — Plutchik's wheel, Russell's affect circumplex (valence/arousal), James-Lange, Ekman's basic emotions, FACS | Category system for "emotional triggers" we want to map to visuals. Serves all 4 projects. |
| 2 | **Color psychology** — color-emotion associations, cultural variation, Goethe's *Theory of Colours* | Distinct from the colorimetry pages. Serves branding + graphic design + generative art especially. |
| 3 | **Empirical aesthetics** — Fechner (1876), Berlyne (1971 arousal-potential), Palmer & Schloss (Berkeley), Vessel (neuroaesthetics) | The field-level framework around our existing measures. Anchors evaluation. |
| 4 | **Algorithmic composition** — Nake, Mohr, Cohen's AARON, Galanter's generative-art theory | Directly serves project 1. |
| 5 | **Perceptual constants** — size/shape/color constancy; Müller-Lyer, Ebbinghaus illusions | Arnheim touches some of this; deserves its own treatment. |
| 6 | **Visual hierarchy / typography** — scale, weight, contrast, position; type as voice | Foundational for projects 2 (branding) and 3 (graphic design). |
| 7 | **Negative space** as first-class compositional tool | Beyond Gestalt's figure/ground. |
| 8 | **Time-based composition** — Eisenstein's montage theory, McCloud's comics theory, animation pacing, frame rhythm | Directly serves projects 1 (dynamic art) and 4 (visualizers). |
| 9 | **Movement, rhythm, repetition with variation** | Arnheim Ch 8–9 partly covers; expand with primary work. |
| 10 | **Light vocabulary beyond chiaroscuro** — key/fill/back, rim, three-point, motivated practical, atmospheric perspective | Film + photo + theater convention; useful for static + dynamic art. |
| 11 | **Body language / pose semantics** — confident vs. defeated vs. threatening; contrapposto; status cues | Emotional triggers via figural content. |
| 12 | **Face perception** — face-specialness in vision, FACS (overlap with #1), micro-expressions, uncanny valley | Strongest single emotional-trigger class. |
| 13 | **Materials and texture** — perceived weight, warmth, "thingness" | |
| 14 | **Style as system** — Impressionism, Cubism, Bauhaus as rule-sets; style transfer | Lets us classify "what tradition is this image speaking from?" |
| 15 | **Cultural / symbolic / iconographic** | Religious, archetypal (Jungian), brand-semiotic. |

## Language preference (when we eventually build)

JS/TS first. Python only when JS equivalent is meaningfully weak (advanced CV beyond OpenCV.js, scientific colour-science work, ML training). Rust/Go only with a specific 2026 reason. Default stack:

- **Generation:** WebGPU + three.js / p5.js
- **Color:** culori (OKLCH-native) or chroma.js
- **CV:** OpenCV.js + saliency models in browser
- **LLM:** Anthropic TypeScript SDK with structured outputs
- **Logging:** `logger.` (not `console.`) in TS

## Memory-and-vault integration

Three persistent stores are in play:

1. **The wiki itself** (`/Users/ag/Lab/VisualThinking/wiki/`) — durable, version-controllable, primary reference.
2. **Per-project memory** (`~/.claude/projects/-Users-ag-Lab-VisualThinking/memory/`) — durable across sessions, loads automatically. Currently holds: programmability principle, language preference, strategic-catalog-then-depth strategy, application priorities.
3. **DragonScale runtime state** (`.vault-meta/`) — address counter, legacy-page baseline, tiling thresholds.

This Methodology page is the **single visible-in-vault source of truth** for principles + priorities + queue. The memory files duplicate the policy for cross-session loading; the canonical text lives here. When the methodology changes, update both.

## Related
[[index]] · [[hot]] · [[log]] · [[Research - Arnheim Sweep 1]] · [[Wiki Seed]] · [[DragonScale Memory]]
