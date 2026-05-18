# @visualthinking/wiki-mcp

Read-only MCP server that exposes the [VisualThinking](https://github.com/) wiki as typed, queryable knowledge for Claude Code (and any other MCP client). Designed for artists building generative art, branding, graphic design, or music-reactive visualizers who want to draw on the wiki's accumulated concepts, techniques, and tools without leaving their project.

## Status

Pre-1.0 — under active development. Public API is subject to breaking changes until 1.0.

## Install

```bash
npm install -g @visualthinking/wiki-mcp
```

Or run via `npx` (no install):

```jsonc
// .mcp.json in your project
{
  "mcpServers": {
    "visualthinking-wiki": {
      "command": "npx",
      "args": ["-y", "@visualthinking/wiki-mcp", "--vault", "/path/to/VisualThinking"]
    }
  }
}
```

## Vault path resolution

In priority order: `--vault <path>` CLI flag → `WIKI_MCP_VAULT_PATH` env var → auto-detect (walks upward from cwd looking for `wiki/` + `.vault-meta/`).

## Public operations

See [the design spec](https://github.com/anton-goncharov/VisualThinking/blob/main/docs/superpowers/specs/2026-05-17-wiki-mcp-server-design.md) in the source repo for the full spec.

Core operations: `wiki.orient`, `wiki.listDomains`, `wiki.getDomain`, `wiki.getConcept` / `getTool` / `getTechnique` / `getSource`, `wiki.search`, `wiki.getRelated`, `wiki.getEvaluationGuide`, `wiki.suggestDirections`, `wiki.getCautions`, `wiki.getProvenance`.

## Development

```bash
npm install
npm run dev          # tsx watch src/index.ts
npm test             # vitest run
npm run typecheck    # tsc --noEmit
```

## License

MIT
