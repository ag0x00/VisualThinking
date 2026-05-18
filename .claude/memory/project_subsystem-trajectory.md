---
name: subsystem-trajectory
description: "Current state of the multi-subsystem build trajectory (MCP done, toolkit + concrete project decision pending)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

## Current state (2026-05-17, end of build session)

**Subsystem A — Wiki MCP server: ✅ shipped.**

- Lives at `mcp/` in the VisualThinking repo, branch `tooling-design`.
- Open PR: https://github.com/ag0x00/VisualThinking/pull/1 (`Add wiki MCP server (read-only, typed, 13 operations)`).
- Publishable as `@visualthinking/wiki-mcp@0.1.0` (modulo the 12 Important + 10 Minor follow-up items documented in the PR body and in the final-code-review subagent output from this session).
- 117 tests passing, parses real 239-page vault with 0 hard errors, registers 13 MCP tools, boots successfully over stdio.

**Why:** The wiki was a 239-page knowledge base with no way for consuming code to query it as typed data. The MCP server is the load-bearing interface — toolkit and projects consume it without polluting the wiki with project state.

**How to apply:** When the user resumes work on this project, the natural next step is choosing between:

- **Subsystem B — Toolkit/library** that wraps the wiki + ML services for artist projects. Brainstormed shape: pure-functions (scorers, generators, pipelines) — `directedTensionScore`, `oklchPairRelation`, `symmetryGroupPattern`, `audioToVisualMapping`, etc. The MCP describes the recipe; the toolkit cooks. User has signalled wanting to scope it minimal-viable around a single test artifact (e.g., a macOS screensaver) rather than building it standalone.
- **Subsystem C — A concrete project** (generative art, brand tooling, graphic-design tools, music-reactive visualizer). The user's 4 stated priorities in order are: (1) generative art, (2) branding, (3) graphic design, (4) real-time music-reactive visualizers.

Most recent thinking (late in the session): scope toolkit *to one test case* (a macOS screensaver) so toolkit and first concrete project effectively build together, KISS-style, with modular folder layout so audio / pose / scoring can be added later without restructuring. Recommended tech: WebView-based `.saver` bundle (WebViewScreenSaver-style prior art) hosting a JS/WebGPU/three.js app that imports the toolkit. Conceptual default for the visual: Hat-monotile or symmetry-group pattern with OKLCH palette anchored at a completion pair, time-of-day-driven drift. No mouse, no audio — screensaver minimum.

**Reference points:**

- Spec: `docs/superpowers/specs/2026-05-17-wiki-mcp-server-design.md`
- Plan: `docs/superpowers/plans/2026-05-17-wiki-mcp-server.md`
- Final review (subagent output) lists Critical fixes already landed (C1 collision, C2 usedBy, C3 stub fields), plus deferred Important + Minor items.
- Last commit on `tooling-design`: `992bd5a` ("mcp: fix critical review issues (C1 + C2 + C3 + I11) + tighten conformance").

**Decisions locked in earlier conversation:**

- Pure-code workflow is NOT in scope yet — Claude Code (incl. **Claude Code in the Desktop app** with visual diff review + parallel sessions) is the de-facto interface for consuming the toolkit during experimentation. Don't bother making the toolkit a polished standalone npm package.
- Toolkit and screensaver are separate projects but built together (shortest path).
- Maintain modular folder layout (`patterns/`, `color/`, etc.) so audio/pose/scoring slot in later.
- "KISS and DRY and reuse as much prior art as possible." (User's exact phrasing.)

**Note on Claude Code surfaces (verified via Context7 2026-05-17):** Claude Code runs as terminal CLI, Desktop app (local or cloud-VM sessions, visual diff review, parallel sessions — particularly good for visuals work), web at claude.ai/code (cloud-VM, persistent), VS Code + JetBrains extensions, mobile (iOS/Android — task init/monitor), plus GitHub Actions / GitLab CI/CD. For visual iteration on a screensaver, Desktop app is the preferred interface — its visual diff review is genuinely useful for tweaking generative output. Do NOT carry forward the outdated framing that "Claude Desktop = chat-only multimodal."

**Don't restart from scratch.** The MCP exists, the wiki content is rich, the spec and plan are committed. Pick up at "B vs C, or B-via-C" and run with it.

Related: [[boris-cherny-claude-md]] for project conventions, [[design-for-consumer]] for the API-design lesson the user taught me when designing the MCP, [[language-preference]] for JS/TS default.
