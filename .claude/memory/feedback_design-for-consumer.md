---
name: design-for-consumer
description: "Design APIs from the consumer's turn-by-turn workflow, not by mirroring the producer's data structure"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

When designing an API surface (MCP, library, service), walk through the consumer's actual turn-by-turn workflow concretely and check that each response gives them something genuinely useful at that exact moment. Don't reflect the producer's internal structure into the API.

**Why:** The user caught this pattern three separate times during the wiki-MCP design brainstorm 2026-05-17:

1. I initially proposed seven public types (Concept, Tool, Technique, Source, ResearchSweep, FieldStub, Meta) mirroring the wiki's frontmatter taxonomy. The user pointed out that ResearchSweep and FieldStub are producer-side concerns — the artist consumer doesn't care which sweep produced a page. They got demoted to internal-only.
2. For "how do I judge if my output is good?" I had the MCP return `Technique[]` — a raw list of scorer pages. The user pointed out this gives the artist numbers like `0.42` with no idea what "good" looks like. I redesigned to `getEvaluationGuide` returning a structured guide with healthy ranges, by-bucket interpretation, calibration references, and actions per outcome.
3. For "what should I try next?" I had `searchSemantic(adjacent topic)` — which jumps to tangentially-related material instead of actionable iteration directions. I redesigned to `suggestDirections` returning ranked `ImprovementDirection[]` with parameter adjustments, substrate substitutions, palette evolutions, etc.

The underlying error each time: I was schema-driven, not workflow-driven.

**How to apply:** Before locking any API surface, write out a concrete consumer scenario (e.g., "user prompts X, calls A, gets response, what do they do with it?"). For each response, ask: "is this what the user needs at this exact step, or just what's easy to expose from the data model?" If the answer is the latter, redesign — the API's job is to make the consumer's life concretely easier at each turn, not to expose the producer's structure.

Also: when the user gives feedback that names specific gaps ("Turn 4 doesn't tell me what the values mean"), address them concretely rather than apologetically. Show the revised data flow, not just the apology.

Related: [[one-click-primary-sources]] is a specific instance of this pattern — the user wanted external URLs surfaced directly, not buried behind a graph-traversal step.
