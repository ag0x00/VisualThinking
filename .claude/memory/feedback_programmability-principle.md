---
name: programmability-principle
description: "For the VisualThinking Obsidian vault, only create pages for content that translates into a prompt constraint, metric, generative rule, or source pointer. People/biographies don't get pages."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

**Rule.** In the VisualThinking vault (`/Users/ag/Lab/VisualThinking`), a page earns its place only if it translates into a prompt constraint, a metric, a generative rule, or a source pointer. Concepts, techniques, measurable phenomena, computational frameworks, color spaces, libraries, sources, and research syntheses are in scope. People and biographies are not — their names appear as plain-text attribution inside concept pages, not as dedicated entity nodes. Works/paintings get a page only if the page contains specific analyzable data (layer measurements, histogram analysis, etc.) referenced by other pages.

**Why:** The vault's stated purpose is translating intuitive visual beauty into logical, programmable structure so an LLM (and code) can reason about images. On 2026-05-16 I created entity pages for Caravaggio, Leonardo, and Rembrandt during a tonal-foundations autoresearch sweep; the user pointed out that "a dedicated page on Leonardo da Vinci doesn't help with understanding and translating foundations of visual aesthetics." The pages were duplicative of concept-page attribution and didn't add programmable substance. They were removed; addresses c-000002–c-000004 are burned per DragonScale's append-only address counter.

**How to apply:** Before creating any wiki page, ask: "Does this page exist to be a *rule, metric, constraint, or pointer*?" If no, don't create it — fold the relevant facts into an existing concept page as plain-text attribution. Applies to artists, scientists, mathematicians, and authors as a category. Promote a person/work to its own page only when the page would contain analyzable data (e.g., a canonical test image with measured features) — and even then, prefer naming it after the analyzable thing, not the person.

Related: see CLAUDE.md "Content conventions" section in the vault.
