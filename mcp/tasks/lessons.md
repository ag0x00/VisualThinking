# mcp/ — Lessons

Accumulating record of corrections received from the user. Each entry: the pattern, why it happened, how to avoid repeating.

## Entries

(none yet)

## 2026-05-18 — orient handler missed IGP for a Bonner/Samarkand intent

**Symptom:** `wiki_orient({intent: "macOS screensaver in Samarkand/Timurid blue-tile aesthetic, Bonner's polygonal-technique..."})` returned color/composition/perception starting points but failed to surface `c-000191 Islamic Geometric Patterns and the Polygonal Technique` or `c-000221 Symmetry-Group Pattern Generator`, both directly named in the intent. Direct `wiki_search` (keyword) found them immediately.

**Root-cause hypothesis:** `orient` weights broad-domain keywords ("composition", "color") above tradition-specific named-entity terms ("Bonner", "Islamic-geometric"). matchedDomains returned perception/light-materials/composition/color/motion-symmetry — but the IGP page lives under motion-symmetry yet still didn't surface.

**Fix direction (queued):** when an intent contains a distinctive named term (proper noun, named technique, named tradition), the matcher should boost direct-title-match candidates above general-domain candidates. Add a test case using this exact intent.

**Workaround for now:** when consuming `orient` for tradition-specific intents, also run `wiki_search` keyword mode on the distinctive terms; merge results.

## 2026-05-18 — Test artifact ≠ goal (workflow-level lesson)

**Symptom:** During the toolkit-screensaver brainstorm, three rounds of wrong-direction design (rhomb-merges → tile-vocabulary → lines-first) before the user reframed: "the goal of this exercise is NOT to build a screensaver, actually. it's to figure out what works and what doesn't in our wiki+mcp+toolkit approach."

**Root-cause:** I optimized for the visible artifact (the screensaver design) at the expense of the workflow learnings. The wiki had concept-depth on IGPs but no tool-depth; `wiki_orient` missed obvious anchors; no npm-search audit was done before designing. All of these gaps were the *real* deliverables; the screensaver design was just one output among many.

**Fix direction (process):**
- When the user proposes "let's build X" where X is a concrete artifact, audit the workflow underneath as a first-class deliverable alongside X
- Run an npm-search audit (3-5 parallel subagents) at session start for any domain with significant prior art
- Augment concept pages with Implementation Landscape sections when build-phase audits reveal gaps
- Capture workflow lessons in `.claude/memory/feedback_*` files immediately upon discovery

**Memory entries created from this incident:**
- `.claude/memory/feedback_test-artifact-vs-workflow.md`
- `.claude/memory/feedback_npm-audit-before-design.md`

See also: `../wiki/questions/Research - IGP Library Landscape 2026-05-18.md` for the full audit results that this incident triggered.
