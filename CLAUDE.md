# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An **Obsidian vault**, not a software project. There is no build, test, or lint. The vault is a personal knowledge base on **visual thinking**: art-school fundamentals, computational aesthetics, color theory, composition, and how to teach those concepts to an LLM for programmatic art generation.

The founding document is `wiki/sources/Wiki Seed.md` (a Gemini conversation establishing scope). The 4-branch spine is in `wiki/index.md`. **The authoritative methodology page** is `wiki/meta/Wiki Methodology.md` — read it before planning sweeps.

## Project priorities (user-stated 2026-05-17)

The wiki exists to support these four applications, in order:

1. **Programmatically generated art** — static and dynamic (top priority).
2. **Branding** — identity systems, logos.
3. **Graphic design** — websites, posters, marketing assets.
4. **Real-time generative visuals responding to music/sound** — Apple Music Visualizer–style.

Every sweep prioritization decision should be checked against these four. See `wiki/meta/Wiki Methodology.md` for the full 15-gap depth-dive queue.

## Sweep strategy: strategic catalog → prioritized depth

**NOT pure depth-first.** The correct order is:

1. **Finish in-progress depth-dive sources** (currently: Arnheim Chapters 3–10 over Sweeps 2 and 3) — momentum matters, primary-source reads are expensive to re-spin.
2. **Catalog sweep** — enumerate the major fields we haven't named (~15 stubs + Field Map synthesis) so we have the map before the territory.
3. **Prioritized deep-dives** following the user's 15-gap queue in `wiki/meta/Wiki Methodology.md` (Emotion psychology → Color psychology → Empirical aesthetics → Algorithmic composition → …).

The first five sweeps (May 2026) were breadth-first within the seed's 4 branches — that was correct for getting the scaffold in place. The mistake was framing the next step as "depth-first" without first cataloging what was missing relative to the user's actual applications. The user (correctly) caught this.

## Language preference (when we eventually build)

JS/TS first. Python only when JS equivalent is meaningfully weak (advanced CV beyond OpenCV.js, scientific colour-science work, ML training). Rust/Go only with a specific 2026 reason (native binary, GPU portability, cold-start performance). Default stack: WebGPU + three.js + Anthropic TS SDK + culori/chroma.js.

## Vault layout

```
wiki/                  ← all knowledge pages
  concepts/            ← atomic ideas (Chiaroscuro, Gestalt, Birkhoff, …)
  entities/            ← named people, works, places
  sources/             ← canonical archive of ingested material (Wiki Seed lives here)
  techniques/          ← LLM-applicable patterns
  tools/               ← software/libraries (p5.js, OpenCV, …)
  folds/               ← rollups of wiki/log.md (DragonScale Mech 1)
  meta/                ← vault-meta pages
  index.md · hot.md · log.md
inbox/                 ← drop zone for incoming files; archived to wiki/sources/ after ingest
.raw/                  ← source archive (ingest reads here); manifest at .raw/.manifest.json
.vault-meta/           ← DragonScale runtime state (address-counter, legacy-pages, tiling-thresholds)
scripts/               ← symlinked DragonScale scripts (allocate-address, tiling-check, boundary-score)
skills/wiki-fold/      ← symlinked fold-operator skill
_templates/            ← Obsidian templates
```

**Path conventions matter.** The `claude-obsidian:*` skills target `wiki/log.md`, `wiki/concepts/`, etc. — do not put knowledge pages outside `wiki/`. The Obsidian graph view is filtered to `path:wiki`.

## DragonScale Memory (enabled 2026-05-16)

This vault has the opt-in DragonScale extension active. Four mechanisms:

1. **Fold operator** (`skills/wiki-fold/`) — extractive rollups of `wiki/log.md` to `wiki/folds/`. Idempotent fold IDs.
2. **Deterministic addresses** — new pages get `address: c-NNNNNN` frontmatter via `scripts/allocate-address.sh`. Counter in `.vault-meta/address-counter.txt`.
3. **Semantic tiling lint** — **currently no-ops.** Needs `ollama` + `nomic-embed-text`. Install later when duplicate-page lint becomes valuable.
4. **Boundary-first autoresearch** — `scripts/boundary-score.py` ranks frontier pages by surprise/distance. `claude-obsidian:autoresearch` will use this when picking topics.

**Rollout baseline: 2026-05-16.** Pages with `created:` before this are legacy and exempt from address requirements. Post-rollout pages must have an address (wiki-lint enforces).

The DragonScale scripts and `skills/wiki-fold/` are **copied** (not symlinked) from `~/.claude/plugins/marketplaces/claude-obsidian-marketplace/`. Symlinking doesn't work for these because they compute `VAULT_ROOT` via `Path(__file__).resolve().parent.parent`, and `.resolve()` follows the symlink back to the plugin's own vault. The only symlinked asset is `wiki/concepts/DragonScale Memory.md` (single file, no path resolution).

**On plugin upgrade**, re-copy with:
```bash
PLUGIN=~/.claude/plugins/marketplaces/claude-obsidian-marketplace
cp -R "$PLUGIN/scripts" scripts
cp -R "$PLUGIN/skills/wiki-fold" skills/wiki-fold
chmod +x scripts/*.sh scripts/*.py
```
`.vault-meta/` is untouched by re-copy; runtime state (counters, manifests) is preserved.

## How to work in this vault

- **Use the `claude-obsidian:*` skills** for vault operations. Do not hand-roll equivalents.
  - `claude-obsidian:wiki` — bootstrap / setup
  - `claude-obsidian:wiki-ingest` — file → wiki pages
  - `claude-obsidian:wiki-query` — answer from the vault (hot → index → pages)
  - `claude-obsidian:autoresearch` — autonomous research loop; uses Mech 4 for topic selection
  - `claude-obsidian:save` — capture this conversation into the vault
  - `claude-obsidian:wiki-lint` — orphans, dead links, missing addresses
  - `claude-obsidian:wiki-fold` — log rollups (Mech 1). Always **dry-run first**, then commit if it looks right.
  - `claude-obsidian:canvas` — `.canvas` visual layouts
  - `claude-obsidian:obsidian-markdown` — Obsidian-flavored markdown (wikilinks, callouts, embeds, math)
  - `claude-obsidian:obsidian-bases` — `.base` dynamic views
  - `claude-obsidian:defuddle` — strip web-page clutter before ingest
- **Prefer `mcp__obsidian-vault__*` tools** over raw filesystem reads/writes for notes. The MCP server is configured project-locally to point at this vault.
- New ingestion sources land in `inbox/`. After processing, the raw source moves to `wiki/sources/`; cross-referenced pages are created under the right branch. URLs are fetched directly — don't park them in `inbox/`.

## Content conventions

- **Programmability principle.** Pages exist only for content that translates into a prompt constraint, a metric, a generative rule, or a source pointer. That means:
  - **In scope**: concepts, techniques, measurable phenomena, computational frameworks, aesthetic measures, color spaces, libraries/tools, sources, research syntheses.
  - **Out of scope**: biographies of artists, scientists, or writers. Their names belong as plain-text attribution inside concept pages, not as dedicated entity nodes. (We tried entity pages for Caravaggio, Leonardo, Rembrandt on 2026-05-16 and removed them; addresses c-000002–c-000004 are burned. See log.)
  - Works/paintings get a page **only** if the page contains specific analyzable data (e.g., layer measurements, histogram analysis) used by other pages. Otherwise they're cited in concept/source pages.
- Outgoing wikilinks in `wiki/sources/Wiki Seed.md` (e.g. `[[Chiaroscuro]]`, `[[The Gestalt Principles of Visual Perception]]`, `[[Birkhoff's Aesthetic Measure]]`) are intentional stubs. Creating those pages is the primary ingest backlog.
- The wiki's spine is the 4-part framework from the seed: (1) Art-school fundamentals, (2) Computational aesthetics, (3) LLM/prompting techniques for visual reasoning, (4) Technical tooling (p5.js, Py5, colormath, chroma.js, OpenCV). New pages should fit one of these branches.
- Math uses `$...$` / `$$...$$`. Citations as numbered footnotes with full URLs, matching the seed's style.
- Page titles use natural-language capitalization (`The Munsell and CIELAB Color Systems`), not kebab-case.
- Post-rollout pages must carry `address: c-NNNNNN` in frontmatter (run `./scripts/allocate-address.sh` to reserve the next one).

## Obsidian setup

- Core plugins enabled: `bases`, `canvas`, `sync`, `properties`, `backlink`, `outgoing-link`, `tag-pane`. Community plugins: none yet.
- Graph view is filtered to `path:wiki`, color-coded by branch (concepts/entities/sources/meta). See `.obsidian/graph.json`.
- `.obsidian/workspace.json` is local UI state — do not edit by hand.
- `.obsidian/app.json` excludes `agents/`, `commands/`, `hooks/`, `skills/`, `_templates/`, `README.md`, `CLAUDE.md`, `WIKI.md`, `Welcome.md` from Obsidian's view — these are agent-facing, not user-facing.
