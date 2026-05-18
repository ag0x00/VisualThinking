# mcp/ — CLAUDE.md

This is the wiki MCP server project. See `../docs/superpowers/specs/2026-05-17-wiki-mcp-server-design.md` for the design spec and `../docs/superpowers/plans/2026-05-17-wiki-mcp-server.md` for the implementation plan.

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, STOP and re-plan immediately — don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern.
- Write rules for yourself that prevent the same mistake.
- Iterate on these lessons until the mistake rate drops.
- Review `tasks/lessons.md` at session start.

### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask: "would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness.

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "knowing everything I know now, implement the elegant solution."
- Skip for simple obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching from the user.

## Task Management

1. Write plan to `tasks/todo.md` with checkable items.
2. Verify plan before starting implementation.
3. Mark items complete as you go.
4. High-level summary at each step.
5. Add review section to `tasks/todo.md` when done.
6. Update `tasks/lessons.md` after corrections.

## Core Principles

- **Simplicity First**: minimal-code changes; impact minimal surface.
- **No Laziness**: find root causes; no temporary fixes; senior-developer standard.
- **Minimal Impact**: only touch what's necessary; avoid introducing bugs.

---

## Project-specific conventions

### Module conventions

- **Parser is pure.** All functions in `src/parser/` are pure: input → output, no I/O. The single I/O edge is `src/parser/load-page.ts` which reads a file path. Vault walking lives in `src/parser/vault-loader.ts`.
- **Handlers are stateless.** Handlers in `src/handlers/` receive a `VaultIndex` (typed object with all parsed pages + indices) and return typed responses. They don't reach into the filesystem.
- **No LLM calls inside the MCP.** The server is a local knowledge surface. `wiki.orient`, `wiki.suggestDirections`, `wiki.getEvaluationGuide` are heuristic-over-structured-data — no Anthropic API key required to use the MCP.
- **Embeddings via local ollama only.** No remote embedding APIs.

### Test conventions

- **vitest** (`npm test`). Fixtures in `tests/fixtures/vault/` are a synthetic mini-vault designed for deterministic parser tests.
- **Schema-conformance test** (`tests/schema-conformance.test.ts`) runs the parser over the real wiki at `../wiki/`. Acts as a permanent lint pass. Zero hard errors expected; warnings (unknown frontmatter fields, etc.) are reported but don't fail.
- **TDD:** write the failing test first, run it to confirm failure, write minimum code to make it pass, commit.

### Build / run commands

- `npm run dev` — runs the server in watch mode (`tsx watch src/index.ts`).
- `npm test` — run vitest in CI mode.
- `npm run test:watch` — vitest watch mode.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run build` — `tsc` → `dist/`.
- `npm run start` — `node dist/index.js`.

### Vault path resolution

- Highest priority: `--vault <path>` CLI flag.
- Middle: `WIKI_MCP_VAULT_PATH` env var.
- Lowest: auto-detect by walking upward from `process.cwd()` looking for a directory containing both `wiki/` and `.vault-meta/`.

### Operating principles for this project

- Read-only MCP: never write to the vault.
- Public API exposes 4 types (Concept | Tool | Technique | Source). ResearchSweep/FieldStub/Meta are internal-only.
- Identity = page address (`c-NNNNNN`). Filenames never appear in API output.
- `primarySources` field on Concept/Tool/Technique must surface external URLs directly — "one click away" to the original source.

## Dependency rationale

**Audit date: 2026-05-17.** All dependencies are at their latest major versions:
- `@modelcontextprotocol/sdk@^1.0.0` — latest stable.
- `zod@^4.4.3` — upgraded from 3.x (safe; scaffold phase has no schema usage yet; migration path documented if needed).
- `typescript@^6.0.3` — upgraded from 5.7.2 (no deprecated options like `target=es5` or `moduleResolution=classic` in tsconfig.json; requires `types: ["node"]` in tsconfig).
- `vitest@^4.1.6` — upgraded from 2.1.8 (latest test framework major).
- `@types/node@^25.8.0` — upgraded from 22.x (Node.js type definitions).
- Other deps (gray-matter, mdast-util-from-markdown, remark-parse, unified, unist-util-visit) are at their latest.
