# Wiki MCP server — design plan

## Context

The VisualThinking wiki has grown to 239 typed pages across 7 research sweeps covering composition, color, body language, style, symmetry, audio-visual, and 12 implemented techniques + ~30 tool evaluations. The user wants to build artist-facing tooling (generative art, branding, graphic design, music-reactive visualizers) that draws from this wiki without polluting it with project-specific state.

The wiki and projects have **different purposes**: the wiki is a stable knowledge surface, projects are short-lived deliverables. They should talk via a thin protocol so the wiki stays clean and any number of projects can consume it. **MCP is that protocol.**

This plan covers the **wiki MCP server only**. The downstream toolkit and concrete projects are out of scope here and get their own design cycles later.

## Decisions locked during brainstorm

| # | Decision | Rationale |
|---|---|---|
| 1 | **Wiki MCP server** is the first thing to build (before toolkit, before projects). | It's the load-bearing interface; toolkit and project shapes follow what's actually accessible. |
| 2 | **L2 abstraction**: structured typed objects, not raw page CRUD. | The generic `obsidian-vault` MCP already covers raw access. New MCP earns its keep only by encoding the wiki's domain structure. |
| 3 | **Read-only**. Writes happen through the generic `obsidian-vault` MCP or direct file edits. | Clean separation; no validation/conflict logic; no risk of corrupting the vault. |
| 4 | **Semantic + keyword + structured** search, with graceful degradation if ollama is unreachable. | Embeddings cache already exists at `.vault-meta/tiling-cache.json`. |
| 5 | **stdio transport only** initially. Designed for eventual open-source release as `@visualthinking/wiki-mcp`; HTTP can be added later without re-architecting. | User's stated trajectory: experiments first, open-source the wiki + tooling if it works. |
| 6 | **Domain-typed schemas** (Approach 2): `Concept | Tool | Technique | Source` as a discriminated union. `ResearchSweep`, `FieldStub`, `Meta` are demoted to internal model objects, not public API types. | The artist consumer doesn't care which sweep produced a page; producer-side concerns shouldn't leak. |

## Design

### Consumer-purpose framing (the orient flow)

The MCP is designed around a **single load-bearing operation**: `wiki.orient(intent)`. An artist describes what they're building in plain English (in their own project's Claude Code session) and gets back a structured starter kit — recommended concepts, techniques, tools, reading order, and cautions. All other operations support drill-down from that orientation.

This avoids the "RPC mirror of vault structure" anti-pattern. Artists don't navigate the vault; they describe intent and the MCP maps it to the right starting cluster.

**Concrete walkthrough — "I want to build interactive wallpapers":**

1. Artist opens Claude Code in `~/Projects/interactive-wallpapers/` (project has `.mcp.json` declaring the wiki MCP).
2. Artist prompts: "I'm building interactive wallpapers — generative patterns that respond to mouse hover and time-of-day drift. Pull me the relevant stuff."
3. Claude calls `wiki.orient({ intent: "..." })` → MCP infers priorities `[1, 4]`, domains `[motion-symmetry, color, composition, audio-visual, perception]`, layers `[3, 4]`, returns starter kit with ~5 concepts, ~3 techniques, ~5 tools, suggested reading order, adjacent considerations, cautions.
4. Claude drills in: `wiki.getConcept("c-000190")` for Hat monotile, `wiki.getTechnique("c-000221")` for Symmetry-Group Pattern Generator, `wiki.getEvaluationStrategies({ priority: 1, domain: "composition" })` for scoring.
5. After producing first output, asks "how do I judge it?" → Claude calls `wiki.getEvaluationGuide({ artifactType: "static-pattern-image", priority: 1 })` → MCP returns an ordered `EvaluationStep[]` with healthy ranges, interpretation by-bucket, calibration references, and technique-specific cautions. Not just "use these scorers" — concrete numeric interpretation.
6. After scoring, asks "what should I try next to improve it?" → Claude calls `wiki.suggestDirections({ intent, currentTechniques, currentScores })` → MCP returns ranked `ImprovementDirection[]` — parameter adjustments (when scores fall outside healthy range), structural substitutions (p4m → p6m → Hat monotile), palette evolutions (add completion pair), modality additions (mouse-X → hue drift), all backed by specific wiki pages.
7. (Optional) Iteratively narrows via `wiki.getRelated(id)` and `wiki.search(query, { mode: "semantic" })` for adjacent reading.

### Architecture and module layout

- **Stack**: Node 22+, TypeScript, `@modelcontextprotocol/sdk`, `gray-matter` (frontmatter), `mdast-util-from-markdown` (markdown AST), `zod` (runtime validation).
- **Project location**: new `mcp/` directory in this repo. Eventually published as standalone `@visualthinking/wiki-mcp` npm package.

```
mcp/
  package.json                # @visualthinking/wiki-mcp, bin: "wiki-mcp"
  tsconfig.json
  src/
    index.ts                  # stdio entrypoint
    config.ts                 # vault path resolution (CLI > env > auto-detect)
    types/
      public.ts               # Concept | Tool | Technique | Source + shared
      internal.ts             # ResearchSweep, FieldStub, Meta (producer-side)
      domain.ts               # Domain controlled vocabulary + Layer
    parser/
      load-page.ts            # file → raw page
      parse-page.ts           # raw → typed via discriminator
      extract-wikilinks.ts
      extract-sections.ts
      extract-cautions.ts     # parses framing-canonicity / cross-cultural / successor callouts
      backlink-index.ts
      domain-classifier.ts    # assigns Domain[] + Layer per page (tag-based + override)
    search/
      keyword.ts
      structured.ts
      semantic.ts             # ollama client; graceful degrade
      embeddings-cache.ts     # reads .vault-meta/tiling-cache.json
    handlers/
      orient.ts               # THE entry point; intent → starter kit
      get-page.ts
      get-domain.ts
      list-domains.ts
      get-related.ts
      get-evaluation-guide.ts       # artifactType → ordered EvaluationStep[]
      suggest-directions.ts         # score-driven + substrate + palette + modality + caution generators
      evaluation-guide-map.ts       # hand-maintained artifactType → step-set table
      get-cautions.ts
      get-provenance.ts       # opt-in producer-side metadata
      search.ts
    server.ts                 # MCP tool registration
  tests/
    fixtures/                 # mini-vault
    parser/
    search/
    handlers/
    schema-conformance.ts     # runs every real wiki page through the parser; loud on drift
  README.md
```

**Three layers** (top → bottom): handler → domain (parser/types/search) → infrastructure (file I/O, ollama client).

**Startup**: walk vault once, parse every page, build backlink + domain + address indices in memory (~240 pages, sub-second cold start, ~10 MB RAM). Embeddings cache reused from existing `.vault-meta/tiling-cache.json`.

**Vault path**: `--vault <path>` flag > `WIKI_MCP_VAULT_PATH` env > auto-detect upward for `wiki/` + `.vault-meta/`. No hard-coded paths.

**Ollama**: lazy. Server starts without it. Semantic-search calls probe on first use; if unreachable, return structured `ollama_unavailable` error and keyword/structured tools continue working.

### Public types

```ts
// shared
type ApplicationPriority = 1 | 2 | 3 | 4;
type Layer = 1 | 2 | 3 | 4 | 5;
type Domain =
  | "color" | "composition" | "body" | "time-based"
  | "motion-symmetry" | "style" | "iconography"
  | "light-materials" | "affect" | "perception"
  | "aesthetics" | "algorithmic-framings"
  | "llm-techniques" | "audio-visual";
type Language = "typescript" | "python" | "wgsl" | "glsl" | "rust" | "go" | "other";

interface PageRef { id: string; title: string; type: PageType; slug?: string; }

interface Section { heading: string; level: 2 | 3 | 4; markdown: string; }

interface Caution {
  kind: "contested-framing" | "cross-cultural-limit"
      | "outdated-successor" | "empirical-mixed";
  text: string;
  affects?: string;
}

interface PackageRef {
  ecosystem: "npm" | "pypi" | "cargo" | "go" | "other";
  name: string;
  weeklyDownloads?: number;
}

interface ExternalSourceRef {
  title: string;
  url: string;
  kind: "paper" | "book" | "documentation" | "article" | "spec" | "video" | "code";
  authors?: string[];
  year?: number;
  doi?: string;
}

// 4 public types
interface Concept {
  id: string; slug?: string; title: string; type: "concept";
  summary: string;                       // first paragraph
  layer: Layer;
  domains: Domain[];
  body: { markdown: string; sections: Section[] };
  relatedConcepts: PageRef[];
  implementedBy: PageRef[];              // techniques
  citedBy: PageRef[];                    // wiki Source pages (graph traversal)
  primarySources: ExternalSourceRef[];   // external URLs, "one click away" to original source
  cautions: Caution[];
  applications: ApplicationPriority[];
}

interface Tool {
  id: string; slug?: string; title: string; type: "tool";
  summary: string;
  category: "color" | "render" | "audio" | "ml" | "geometry"
          | "live-coding" | "framework" | "cloud-api";
  language: Language[];
  packageRefs: PackageRef[];
  verdict: "first-class" | "second-class" | "deprecated" | "experimental";
  applications: Partial<Record<ApplicationPriority, number>>;  // 0-5 fit
  alternatives: PageRef[];
  usedBy: PageRef[];
  primarySources: ExternalSourceRef[];   // official docs, npm/GitHub homepages, spec links
  body: { markdown: string; sections: Section[] };
}

interface Technique {
  id: string; slug?: string; title: string; type: "technique";
  summary: string;
  implementsConcepts: PageRef[];
  dependencies: {
    libraries: PageRef[];
    services?: ("ollama" | "claude-api" | "replicate" | "cloud-inference" | "local-gpu")[];
  };
  language: Language;
  performanceBudget?: { ms: number; conditions: string };
  applications: ApplicationPriority[];
  primarySources: ExternalSourceRef[];   // papers backing the method (e.g., IP-Adapter arXiv, Gatys 2015)
  body: { markdown: string; sections: Section[] };
}

interface Source {
  id: string; slug?: string; title: string; type: "source";
  citation: string;
  url?: string;
  authors?: string[];
  year?: number;
  cites: PageRef[];
  body: { markdown: string };
}

type Page = Concept | Tool | Technique | Source;
type PageType = Page["type"];
```

**Producer-side internal types** (not exposed in API responses by default; accessible via `getProvenance`):

```ts
interface Provenance {
  createdBySweep?: string;          // e.g., "body-language-depth"
  priorityRank?: number;            // 1-15 from the depth-dive queue
  depthDiveComplete?: string;       // ISO date for field-stubs
  legacy: boolean;                  // pre-rollout
  address?: string;
}
```

### Operations (~10)

| Tool | Args | Returns | Notes |
|---|---|---|---|
| `wiki.orient` | `{ intent: string }` | `OrientResult` (priorities, domains, layers, startingPoints, suggestedReadingOrder, adjacentConsiderations, cautions) | The entry point. See "orient algorithm" below. |
| `wiki.listDomains` | `{}` | `Domain[]` with descriptions | The 14-domain controlled vocabulary. |
| `wiki.getDomain` | `{ domain: Domain }` | `{ concepts, techniques, tools, sources, summary }`, organized by layer | Drill-down from a domain. |
| `wiki.getConcept` / `getTechnique` / `getTool` / `getSource` | `{ id }` | Typed `Page` | Fetch by address. |
| `wiki.search` | `{ query: string, mode?: "semantic" \| "keyword" \| "structured", filters?: { type?, domains?, layers?, priority?, verdict? } }` | `PageRef[]` with similarity scores when semantic | Unified search; default mode = `semantic` with fallback. |
| `wiki.getRelated` | `{ id, kinds?: ("backlinks" \| "outgoing" \| "embedding-similar")[] }` | `PageRef[]` deduplicated | Graph traversal. |
| `wiki.getEvaluationGuide` | `{ artifactType: string, domain?: Domain, priority?: ApplicationPriority }` | `EvaluationGuide` with ordered `EvaluationStep[]` + globalCaveats | "How do I judge output?" Returns interpretation, healthy ranges, calibration references, by-outcome actions — not just technique names. |
| `wiki.suggestDirections` | `{ intent: string, currentTechniques?: PageRef[], currentScores?: Record<string, number>, excludeKinds?: ImprovementDirection["kind"][] }` | `ImprovementDirection[]` ranked | "What should I try next?" Score-driven, substrate-variation, palette-evolution, modality-addition, caution-driven suggestions. Each backed by `drawnFrom: PageRef[]`. |
| `wiki.getCautions` | `{ id }` | `Caution[]` | Lightweight pull of just the caveats. |
| `wiki.getProvenance` | `{ id }` | `Provenance` | Opt-in producer-side metadata. |

### Evaluation guide construction

`wiki.getEvaluationGuide` returns a structured walkthrough, not a list of techniques. Each `EvaluationStep` has:

```ts
interface EvaluationGuide {
  artifactType: string;
  steps: EvaluationStep[];
  globalCaveats: Caution[];        // e.g., "use scorers comparatively, not as universal predictor"
}

interface EvaluationStep {
  id: string;
  technique: PageRef;              // links to e.g. [[Directed Tension Score]]
  measures: string;                // "composition dynamism via 5-generator structural sum"
  rangeMin: number; rangeMax: number;
  healthyRange: { min: number; max: number };
  interpretation: {
    belowHealthy: string;          // "feels static; introduce convergent lines or obliqueness"
    inHealthy: string;
    aboveHealthy: string;          // "chaotic; remove one tension generator"
  };
  calibrationReferences?: string[];   // "Mondrian ≈ 0.4; Pollock ≈ 0.85"
  whenToApply: string;
  cautions: Caution[];             // technique-specific (e.g., Birkhoff mixed-empirical)
}
```

Fields are parsed from each Technique page's structured sections (Validation, Calibration, Interpretation, Performance budget). The parser requires Sweep-7-pattern sections to be present; for techniques missing some sections, those fields are `null` and consumers fall back to body text.

The artifactType → step-set mapping is a small hand-maintained table in `src/handlers/evaluation-guide-map.ts`. Initial mapping:

| artifactType | Steps (ordered) |
|---|---|
| `static-pattern-image` | Directed Tension → OKLCH Pair-Relation → Visual Hierarchy/Negative-Space → Aesthetic Measure Stack |
| `figurative-image` | Directed Tension → Pose-Emotion Dimensions → Contrapposto → Cultural Emblem Detector → Aesthetic Measure Stack |
| `realtime-visualizer` | Audio-to-Visual Mapping → Phenomenal Causality (latency check) → Directed Tension (per-frame) |
| `brand-photography` | Pose-Emotion → Contrapposto → Cultural Emblem → Contrast Checking → OKLCH Pair-Relation |
| `typography-layout` | Visual Hierarchy/Negative-Space → Contrast Checking → OKLCH Pair-Relation |

### suggestDirections algorithm

`wiki.suggestDirections` is heuristic, not LLM-driven. Five direction-generators run in parallel and their outputs merge into a ranked list:

1. **Score-driven**: For each `currentScores[id]` outside its technique's `healthyRange`, look up the matching `interpretation.belowHealthy` / `aboveHealthy` text and emit a `parameter-adjustment` direction. Confidence: high. Effort: trivial.
2. **Substrate-variation**: For each `currentTechniques[*]` of category `geometry` or `pattern`, surface alternatives from `Tool.alternatives[]` and `Concept.relatedConcepts[]`. Tag as `structural-substitution`. Confidence: medium. Effort: moderate.
3. **Palette-evolution**: If current palette analysis (via OKLCH classifier metadata, if scored) lacks any `mutual-completion` pair, emit `palette-evolution` with rationale from [[Arnheim's Color Syntax]] body's "Mutual completion" section. Confidence: medium. Effort: trivial.
4. **Modality-addition**: Cross-reference `currentTechniques[*]` against expected-modalities for the `intent`. If the intent says "interactive" but no input-modality technique present, emit `modality-addition` directions sourced from [[Audio-to-Visual Cross-Modal Mapping]] (audio extends to any input). Confidence: medium-low. Effort: moderate.
5. **Caution-driven**: For each `Caution` on any current technique, emit a `scope-expansion` direction ("validate cross-culturally with N=5 non-WEIRD raters"). Confidence: high but contextual. Effort: significant.

Ranking: confidence-weighted, with `effort: trivial` boosted so the artist sees easy wins first.

This operation is the most domain-aware part of the MCP. It's also the part where the wiki's accumulated structure (typed cross-references, alternatives lists, caution metadata) pays off most concretely.

### Orient algorithm

`wiki.orient(intent)` runs entirely inside the MCP — no LLM API calls — so the server stays a pure local tool without requiring an Anthropic key on every consumer. Steps:

1. **Embed the intent string** via local ollama (same `nomic-embed-text` model as the page cache). If ollama is unreachable, fall back to keyword extraction (TF-IDF over intent → top tokens).
2. **Score candidate pages** by cosine similarity to the intent embedding. Top ~30 hits enter the candidate pool. Keyword-mode fallback ranks by token overlap with title + tags + summary.
3. **Aggregate by domain and priority** across the candidates: each page contributes its `domains[]`, `applications[]`, and `layer` to a weighted tally. Top-K domains and applications become the inferred `matchedDomains` and `matchedPriorities`. Layer set is the union.
4. **Curate the starter kit** by picking the highest-scoring page of each kind (`Concept`, `Technique`, `Tool`, `Source`) up to a configurable cap (default 5/3/5/3). Diversity penalty avoids returning 5 pages all on the same sub-topic.
5. **Order by dependency**: techniques that `implement` concepts come after the concepts they implement; sources come last. Output as `suggestedReadingOrder`.
6. **Propagate cautions**: union the `cautions[]` of all selected pages, dedupe by `kind + text`, surface the top-N most affecting.
7. **Adjacent considerations**: pulled from a curated `crossLinks` map (e.g., reactive input → Phenomenal Causality 70 ms threshold; Western color valence → cross-cultural-limit caution). Small hand-maintained file in `src/handlers/adjacent.ts`.

The algorithm is deterministic given the cache state. No external dependencies beyond local ollama (optional with degradation).

### Identity strategy

- **Canonical ID**: page's `address` field (e.g., `c-000211`). Stable across renames.
- **Slug**: kebab-case derived from title for nice URLs (`directed-tension-score`).
- **Title**: human display only; never used as ID.
- **Filename**: never exposed in API.
- **Legacy pages without addresses** (10 pre-rollout): get a generated slug; still searchable; opt out of address-based lookup with a structured error response.

### Domain classification

Maps each page to one or more domains via:

1. **Tag-based** primary signal (tags like `color`, `body-language`, `symmetry` map to domains).
2. **Frontmatter override** (`domain:` field can be added to pages where tag-based classification is wrong).
3. **Body-derived** secondary signal (does the page link heavily to a domain cluster?).

The 14 domains come from the wiki's own [[Field Map - Visual Thinking Knowledge Domains]] (`c-000089`). Layer assignment (L1–L5) similarly derives from Field Map's stratification.

### Primary-source extraction

`primarySources: ExternalSourceRef[]` is populated by the parser from two signals merged and deduped (by URL):

1. **Inline markdown citations** in the page's `## Sources` section (and similar: `## References`, `## Citations`). Pattern: `- Author (Year). Title. [Journal/Publisher]. URL`. Parser extracts URL, title, authors, year heuristically. Bare URLs are accepted with empty metadata.
2. **Linked wiki Source pages**: for every PageRef in `citedBy` that resolves to a `Source` page, pull its `url`, `authors`, `year`, `title` into an `ExternalSourceRef`. Source pages already aggregate this metadata.

Dedupe by URL. Sort by `year` descending (recent first), then by title alphabetical. Cap at 10 per page response (additional available via `wiki.getAllPrimarySources(id)` if ever needed).

For Tool pages, primary sources include: official documentation URL (parsed from "## Sources" if present), GitHub repo, npm package URL (auto-constructed from `packageRefs`), spec links (W3C, etc.).

The two-hop indirection (Concept → wiki Source page → URL) still exists via `citedBy` for graph traversal; `primarySources` is the flattened direct-URL view that the artist actually wants at the moment of "show me the original source."

### Caution extraction

The parser scans each page for three patterns from the wiki's six-convention methodology:

1. `> [!warning]` callouts mentioning "contested", "superseded", "empirically dead", "myth" → `contested-framing` caution.
2. `> [!note]` callouts mentioning "WEIRD", "cross-cultural", "Western-only" → `cross-cultural-limit` caution.
3. "Successor theory" / "Successor / adjacent theories" sections → `outdated-successor` if the page is the older anchor.

Results stored on `Concept.cautions[]` and propagated through `orient` and `getEvaluationStrategies` outputs.

### Error handling

- **Unknown frontmatter field** → warn, still index.
- **Required field missing** → exclude page, log with file path; bubble up to a `wiki.health` diagnostic call.
- **Address collision** (e.g., DragonScale Memory symlink) → first-wins, log warning, both pages still searchable by title.
- **Ollama unreachable** → semantic calls return structured `{ error: "ollama_unavailable", fallback: "keyword" }`; keyword/structured calls unaffected.
- **Page-not-found by id** → structured `{ error: "not_found", suggestions: PageRef[] }` from a quick search on the failed id.

### Project setup convention (applies to mcp/ and all future projects)

Per user directive 2026-05-17: every new software project in Claude Code starts with — or incorporates into its existing CLAUDE.md — Boris Cherny's CLAUDE.md template (source: gist `e29cb6386c539d795767e8c3fd2c959b`). For `mcp/`:

- Create `mcp/CLAUDE.md` at the package root that includes Boris Cherny's principles:
  - **Workflow**: plan-mode-default for non-trivial work; subagent strategy; self-improvement loop via `tasks/lessons.md`; verification before done; demand elegance (balanced) for non-trivial changes; autonomous bug fixing.
  - **Task management**: plan in `tasks/todo.md`; verify plan before starting; track progress with checkboxes; document review section; capture lessons after corrections.
  - **Core principles**: Simplicity First (minimal-code changes); No Laziness (root-cause fixes, senior-developer standard); Minimal Impact (only touch what's necessary).
- Layered on top of those, add project-specific sections:
  - Module conventions specific to the MCP server (parser purity, handler stateless-ness, no LLM calls inside the MCP).
  - Test conventions (vitest, fixture-based parser tests, schema-conformance suite against the real vault).
  - Build / run commands (`npm run dev`, `npm test`, `npm run build`).
  - The vault path resolution rules (CLI > env > auto-detect).
- Create `tasks/` directory with empty `todo.md` and `lessons.md` ready to use.

This is a recurring convention from this session forward, not just for the MCP package. Worth saving to memory after exiting plan mode.

### Open-source readiness checklist

- Configurable vault path (no hard-codes).
- MIT or Apache 2.0 license.
- README with: install, configure (`.mcp.json` snippet), example queries, schema reference.
- Schema reference auto-generated from zod schemas.
- CI: type-check + parser tests + schema-conformance test against a fixture vault.
- Published as `@visualthinking/wiki-mcp` on npm; binary `wiki-mcp`.
- Wiki content licensed separately (CC-BY-SA candidate) — out of scope for this MCP plan but worth deciding before open-source.

## Critical files

- New: everything under `mcp/` (described above).
- Read-only references (the MCP consumes these without modifying):
  - `wiki/**/*.md` — all wiki pages.
  - `.vault-meta/tiling-cache.json` — existing nomic-embed-text embeddings.
  - `.vault-meta/address-counter.txt` — for the optional provenance health-check.
  - `.vault-meta/legacy-pages.txt` — for the legacy-page handling.
  - `wiki/questions/Field Map - Visual Thinking Knowledge Domains.md` — the source of truth for the 14 domains + 5 layers.

## Reused existing tooling

- **Embeddings**: `.vault-meta/tiling-cache.json` (nomic-embed-text via local ollama, already populated for ~128 pages). Same model so cache hits work.
- **Address scheme**: existing `c-NNNNNN` from DragonScale Mechanism 2; counter at 226.
- **Frontmatter conventions**: existing wiki conventions documented in CLAUDE.md and Wiki Methodology (`c-000089` Field Map). The MCP is a typed projection of these.

## Verification

End-to-end smoke test once implemented:

1. **Boot**: `wiki-mcp --vault /Users/ag/Lab/VisualThinking` should print parser warnings (if any), then announce ready on stdio.
2. **Health**: a one-shot `wiki.health` call should report `{ pagesParsed: 239, indexedDomains: 14, embeddingsAvailable: true|false, parseErrors: N }`.
3. **Orient**: `wiki.orient({ intent: "interactive generative wallpapers, mouse-reactive, time-of-day drift" })` should return Hat monotile, Symmetry-Group Pattern Generator, culori, Audio-to-Visual mapping in its top picks.
4. **Drill**: `wiki.getTechnique("c-000221")` returns the Symmetry-Group Pattern Generator with `dependencies.libraries` resolved to PageRefs (three.js, paper.js, etc.) AND `primarySources` includes the Smith/Myers/Kaplan/Goodman-Strauss 2023 Hat-monotile arXiv URL and the Kaplan reference implementation URL — "one click away" from the recipe.
5. **Evaluation guide**: `wiki.getEvaluationGuide({ artifactType: "static-pattern-image", priority: 1 })` returns 4 ordered steps (Directed Tension → OKLCH → Hierarchy/NS → Aesthetic Stack) each with healthy range, by-bucket interpretation, calibration references, and per-step cautions.
6. **Suggest directions**: `wiki.suggestDirections({ intent: "...", currentTechniques: [SymmetryGroupGen, OKLCHClassifier], currentScores: { "c-000213": 0.22 } })` returns at least one `parameter-adjustment` direction sourced from Directed Tension Score (since 0.22 is below healthy), plus a `structural-substitution` direction toward Hat monotile.
7. **Cautions**: `wiki.getCautions("c-000215")` returns the Berlyne/Birkhoff empirical-mixed caution from Aesthetic Measure Stack.
8. **Graceful degrade**: stop ollama, re-run `orient` and `suggestDirections` → both still work (keyword fallback for orient; suggestDirections is heuristic over structured data so unaffected), with a `degraded: true` flag where relevant.
9. **Schema conformance**: `npm test` runs every real wiki page through the parser; zero hard errors expected (this also acts as a permanent wiki-lint pass).

After verification passes, the MCP is the surface that the downstream toolkit (subsystem B) and concrete projects (subsystem C) will consume. Their designs get separate spec → plan → implementation cycles.

## Out of scope (explicitly)

- Write operations (defer until concrete need; use `obsidian-vault` MCP).
- HTTP transport (defer until cross-device requirement).
- Toolkit/library wrapping wiki + ML services (subsystem B; separate plan).
- Concrete artist project (subsystem C; separate plan).
- VLM-based scoring through the MCP (belongs in the toolkit, not the wiki MCP).
- Generation pipelines (style transfer, diffusion routing) — also belong in the toolkit.
