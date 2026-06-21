---
name: feedback_commit-after-big-updates
description: Always git-commit after a substantial update without being asked each time
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0923fda0-593d-4150-956a-da5282eec127
---

Always **commit after a big update** — a completed feature, a working build/spike, a finished research sweep — without waiting to be asked each time.

**Why:** user stated it as a standing preference (2026-06-21) after the ink-on-paper brush build. Overrides the default "commit only when asked" for substantial milestones.

**How to apply:** when a coherent chunk of work is done and verified, commit it. Split into logical commits when the work spans separable concerns (e.g. wiki research vs. code). Stage only files I created/changed — do NOT sweep in pre-existing untracked items (`.claude/settings.json`, `_inbox/`, etc.). Keep using the required commit-message trailers. Branch first if on the default branch; small WIP-but-coherent commits are fine on a feature branch.
