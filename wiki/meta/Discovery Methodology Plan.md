---
title: Discovery Methodology Plan
type: meta
status: complete
tags: [meta, methodology, planning, option-c, closed]
created: 2026-05-17
updated: 2026-05-17
---

# Discovery Methodology Plan

> **Status: ✅ COMPLETE 2026-05-17.** All four phases done. Six discovery-and-audit conventions consolidated into [[Wiki Methodology]]. Four feedback memories saved. Closing synthesis: [[Research - Phase 4 Methodology Lock-in]]. Practical Design sweep unblocked; executes next under post-Option-C methodology.
>
> **Locked decisions:**
> - Full Option C, all 4 phases.
> - **Revise** path for Algorithmic Composition framing (rewrite the 8 framework pages to honestly position Galanter as one framing among several).
> - **Practical Design timing**: after the methodology fix completes.
> - **Phase 3 audit scope**: conservative — load-bearing canonical claims only.

## The problem (what we learned 2026-05-17)

User audits flagged that the Tools sweep and the Algorithmic Composition framework were built from **training-data recall**, not from systematic discovery. Three layered failures:

1. **Library catalog incomplete.** npm-search audit of `keywords:p5` (page 1) revealed q5.js, @p5-wrapper/react, p5.brush, and others I missed. Subsequent `keywords:three` audit (pages 1–3) revealed three-stdlib, camera-controls, detect-gpu, gainmap-js, the vasturiano data-viz ecosystem, threlte (Svelte), TresJS (Vue), aframe, expo-three, ecctrl, gaussian-splats-3d, geo-three, @takram/three-geospatial+atmosphere, and many more. There are 47 more pages of three-keyword results I haven't seen.
2. **Frameworks claimed canonical without survey.** The Algorithmic Composition sweep anchored on Galanter (2003) and claimed it was "the canonical theoretical anchor of contemporary generative art." This is **overstated**. Alternative framings I should have surveyed: Boden's computational creativity (mentioned as sub-concept, should have been root); Whitelaw's artificial-life / emergence framing; practice-led / studio-research lineage (Reas, Hobbs, Hoff, Sagmeister); procedural-generation (game-dev); postdigital aesthetics (Cramer, Manovich); live-coding (McLean, Jack); AI-art / latent-space (Hertzmann, Klingemann); on-chain generative (Hobbs, Cherniak, Snowfro). For the wiki's four priorities, **different framings foreground different things** — e.g., parametric-identity studio-research framing fits branding better than Galanter's complexity-aesthetic theory.
3. **Pattern is systemic.** Same risk applies to Affect Foundations, L1 Cleanup, and any prior sweep that surveys an external knowledge corpus. Memory-only listing is biased toward training-data-era popularity, not current state.

## The Galanter overclaim specifically

The "effective complexity = Berlyne's arousal-potential, the wiki's central theoretical pillar" framing presents one defensible unification as if it were settled consensus. Critiques the wiki currently doesn't represent:

- Aaron Hertzmann 2018 ("Can computers create art?") argues against universal-complexity theories.
- HCI / personalization research argues for user-driven targets over universal preferences.
- Empirical complexity-preference literature is **mixed** — not the clean inverted-U I described. Effect varies by stimulus type, viewer expertise, measurement framework.
- Galanter's definition of generative art has been criticized as over-inclusive and under-specific.

The wiki's current presentation of Galanter is pedagogically useful but theoretically over-claimed.

## Proposed Option C plan

Four phases, executed in order:

### Phase 1 — Framework survey
- **Tool: autoresearch + manual reading.**
- Goal: enumerate the intellectual framings used in contemporary generative / computational / creative-coding art. Identify which framings best serve each of the four priorities.
- Deliverable: a "Framings Map" alongside existing Tools Map. Scope-clarification revisions (or replacement) for the Algorithmic Composition pages.
- Estimated output: 8–15 new pages + revisions to ~5–8 existing pages.

### Phase 2 — Tools survey (proper discovery)
- **Tool: programmatic WebFetch on npm-search URLs (paginated) + awesome-list reads + autoresearch for context.**
- Goal: enumerate the actual library universe per the new methodology. Apply the rubric. Produce expanded Tools Map covering all major ecosystems.
- Deliverable: expanded `wiki/tools/`. Should include systematic coverage of (at minimum): three.js, p5.js, WebGPU, WebGL, Pixi, Babylon, Hydra, Tone.js, Web Audio API, drawing/vector (paper, two, svg.js, Pts), creative-coding-utility (noise, GUI, animation, geometry, recording, color, ML/CV).
- Estimated output: 15–25 new pages + significant Tools Map expansion.

### Phase 3 — Prior-sweep audit (targeted)
- **Tool: autoresearch.**
- Goal: audit Affect Foundations and L1 Cleanup sweeps for canonical-overclaim and missed competing frameworks. *Targeted*, not comprehensive — focus on the most-cited "canonical" claims that might be one-of-several.
- Specific candidates to audit: Russell-circumplex canonicity (vs PAD vs Plutchik vs constructionist alternatives); Berlyne's arousal-potential canonicity (vs fluency, vs predictive-processing); Helmholtz-Gibson Bayesian synthesis canonicity (vs pure Gibsonians); Ekman vs Barrett state-of-play. Each: confirm or revise.
- Estimated output: 5–10 page revisions.

### Phase 4 — Methodology lock-in
- Update [[Wiki Methodology]] with explicit discovery conventions:
  - **npm-search audit** at depth-dive completion for any library / tools sweep.
  - **awesome-list scan** for any ecosystem-claiming sweep.
  - **Framework survey** step at the start of any depth-dive that anchors on a theoretical framework — actively look for competing framings before settling on one.
  - **autoresearch-first** for any sweep touching external knowledge corpus (libraries, theories, methods, practitioners).
- Save corresponding feedback memories.
- Estimated output: methodology edits + 1–2 new memory files.

## Locked sub-decisions (2026-05-17)

1. **Revise** for Algorithmic Composition framing. Rewrite the 8 framework pages to position Galanter as one framing among several, with explicit scope limits and competing-framework cross-references. The unification claim ("effective complexity = arousal-potential, the wiki's central theoretical pillar") gets explicitly downgraded to "one defensible synthesis among contested options."
2. **Practical Design timing**: methodology fix first. Avoids re-do under new methodology.
3. **Phase 3 audit scope**: conservative. Audit only the load-bearing canonical claims (Russell circumplex, Berlyne arousal-potential, Helmholtz-Gibson-Bayesian synthesis, Ekman-Barrett). Skip exhaustive re-validation.

## What's already saved across compaction

- All 152 wiki pages and their cross-references.
- Memory files: `clustered-sweeps`, `implementation-in-sweeps` (reading-only), `algo-comp-before-tools`, `catalog-stub-cross-check` (with npm-audit rule added), `language-preference`, `depth-first-wiki`, `application-priorities`, `programmability-principle`.
- [[Wiki Methodology]] page with the three locked policy decisions and the catalog-stub cross-check convention.
- This plan page.

## What is NOT yet saved (capturing here for compaction)

- The Galanter-canonicity overclaim hasn't been flagged on the [[Algorithmic Composition]] or [[Galanter's Generative Art Framework]] pages themselves yet. (Doing this is part of Phase 1 in either revise or keep-and-add path.)
- The discovery-methodology gap hasn't been added to [[Wiki Methodology]] as a permanent convention yet (Phase 4).

## Execution log

- **2026-05-17** — Decisions locked. Beginning Phase 1: framework survey via autoresearch.
- **2026-05-17** — **Phase 1 complete.** 11 new pages created (addresses c-000139..c-000149): [[Framings of Generative Art]] (map) + 7 per-framing concept pages ([[Artificial Life Art]], [[Practice-led Studio Research]], [[Procedural Content Generation]], [[Postdigital Aesthetics]], [[Live Coding and Algorave]], [[AI Art and Latent Space]], [[Long-form On-Chain Generative Art]]) + 2 source pages ([[Hertzmann - Can Computers Create Art]], [[Galanter - What is Generative Art]]) + 1 sweep synthesis ([[Research - Generative Art Framings Sweep]]). 8 prior framework pages revised with framing-canonicity caveats. [[Galanter's Generative Art Framework]] got a full Critique section. [[Computational Creativity]] elevated from sub-concept to root-level framing. Key external finding: Berlyne's arousal-potential theory has been "mostly abandoned" by mainstream empirical aesthetics — propagates directly to Phase 3 audit of [[Berlyne's Arousal-Potential Theory]] page.
- **2026-05-17 (follow-up)** — Hertzmann 2018 primary text ingested via user-provided local PDF after WebFetch failures. [[Hertzmann - Can Computers Create Art]] rewritten with verbatim quotes; Galanter critique section ([[Galanter's Generative Art Framework]]) upgraded with the natural-processes argument and the Mandelbrot-set falsifier (both verbatim); [[AI Art and Latent Space]] and [[Computational Creativity]] also upgraded with primary-source quotes. Cramer 2014 PDF still unfetchable; [[Postdigital Aesthetics]] now carries a `> [!gap]` callout pinning the canonical APRJA URL for manual fetch — primary-source verification deferred. New memory `feedback_source-fetch-fallback.md` records the two-tier fallback pattern (try Firecrawl/Playwright, else log URL with gap callout) so future sweeps avoid silently substituting secondary sources. The pattern should be folded into Phase 4 methodology lock-in.
- **2026-05-17 (follow-up 2)** — Cramer 2014 primary text ingested via user-provided local PDF. New source page [[Cramer - What Is Post-Digital]] (c-000150) with section-by-section verbatim quotes. **Surprising finding**: Cramer's argument has four strands beyond the glitch-aesthetics summary captured in the wiki — post-disenchantment, anti-universal-machine, DIY-vs-corporate, semiotic-shift-to-indexical. [[Postdigital Aesthetics]] rewritten with all five strands. Galanter Critique section ([[Galanter's Generative Art Framework]]) gained a 5th point: Cramer contests the *substrate*, where Hertzmann contests the *authorship* — complementary external critiques. Phase 1 now has all three primary sources (Hertzmann, Galanter via secondary, Cramer) settled at appropriate confidence levels.
- **2026-05-17 — Phase 2 complete.** 13 new tool pages (c-000151..c-000164) + Tools Map v2 update. Methodology used: 18 parallel npm-registry searches + 2 awesome-list reads + framings-anchored scope. Major reframings: [[Strudel]] reshapes priority 4 toward live-coding paradigm (Strudel + Hydra now primary, Tone+three+Meyda secondary); [[Transformers.js]] reshapes AI-art toolchain with full [[AI Art Toolkit Map]]; [[WGSL Tooling]] surfaces 2026 WebGPU DX stack; [[Tone.js]] + [[Meyda]] promoted from Web Audio folding; Magenta.js flagged as deprecated. Catalog-stub cross-check: 7 of 9 framings now have explicit tool coverage. Methodology findings for Phase 4: (a) PCG-on-npm is sparse — must look beyond npm to GitHub topic-search; (b) cross-keyword search required — single-keyword sweeps miss multi-tag ecosystems; (c) deprecation flagging needed — auto-flag any package without a release in 18+ months; (d) tool surveys benefit from framing-anchoring (prevents endless tangential discovery).
- **2026-05-17 — Phase 3 complete.** Conservative-scope canonicity audit of 4 anchor pages, 1 new synthesis page ([[Research - Phase 3 Canonicity Audit]], c-000165). Findings: **Berlyne mostly abandoned** (major revision; successor = processing fluency); **Russell circumplex cross-culturally variable** (major revision; geometry varies Western vs East Asian); **Bayesian-Helmholtz-Gibson synthesis defensible not settled** (moderate revision; pure-ecological camp rejects inferentialism; predictive-processing has unfalsifiability concerns); **Face Universality already well-balanced** — added Behavioral Ecology View as third framing. Wiki's "central theoretical pillar" framing now fully retired across Galanter ↔ Berlyne ↔ Russell. Base rate of canonicity overclaim across audited anchors: 75%. Methodology findings for Phase 4: (a) framings presented as "*the* canonical theory of X" deserve audit by default; (b) "central theoretical pillar" / "unification" language is a red flag; (c) cross-cultural variation is the most-reliable falsifier in perception-psychology; (d) successor-theory tracking matters as much as current-theory tracking.
- **2026-05-17 — Phase 4 complete. Option C closed.** Six discovery-and-audit conventions consolidated into [[Wiki Methodology]] under a new "Discovery and audit conventions (Phase 4 lock-in 2026-05-17)" section: catalog-stub cross-check, framing-canonicity audit, npm+GitHub-search audit, source-fetch fallback ladder, cross-cultural validity flag, successor-theory tracking. Plus the **unification-claim red flag** as a meta-convention (base rate of overclaim across audited unifications: 100%). Two new feedback memories saved (`feedback_cross-cultural-validity.md`, `feedback_successor-theory-tracking.md`); MEMORY.md index updated. [[Wiki Methodology]] sweep-status table marks Sweep 3.5 as ✅ Done across all four phases. Practical Design sweep unblocked; executes next under post-Option-C methodology. Closing synthesis: [[Research - Phase 4 Methodology Lock-in]] (c-000166). Cumulative totals: 27 new pages + 13 page revisions + Methodology expansion + Tools Map v2 + 4 new memories + 2 primary PDFs ingested. Vault grew 152 → 180 pages.

## Related pages

[[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]] · [[Research - Algorithmic Composition and Tools Sweep]] · [[Algorithmic Composition]] · [[Galanter's Generative Art Framework]] · [[Tools Map]]
