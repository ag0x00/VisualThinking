---
name: feedback_plans-in-project
description: "Save plan docs inside the repo (docs/superpowers/plans/), not user-global ~/.claude/plans/"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0923fda0-593d-4150-956a-da5282eec127
---

Plan documents belong **in the project**, at `docs/superpowers/plans/YYYY-MM-DD-<topic>.md` (the convention already in CLAUDE.md). Do NOT leave them in the harness's user-global plan-mode scratch file (`~/.claude/plans/<name>.md`).

**Why:** user flagged it 2026-06-21 — "why are you saving this to user plans? it should stay within the project." Plans are project artifacts and should be committed with the repo so they survive across sessions/compaction and are visible to collaborators.

**How to apply:** when plan mode auto-creates a scratch plan in `~/.claude/plans/`, copy/write the final plan to `docs/superpowers/plans/` and commit it. Specs likewise go to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`. Same idea for anything durable: keep it in-repo, not user-global.
