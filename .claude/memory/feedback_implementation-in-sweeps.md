---
name: implementation-in-sweeps
description: Concept-page depth-dives stay reading-only — defer implementation code until after Algorithmic Composition + tools sweep
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bd3cfd4-5d18-4817-9003-0b7d5db2d68c
---

**Concept-page depth-dive sweeps stay reading-only.** Do NOT add `## Implementation notes` sections with JS/TS code to concept pages during depth-dives. Save implementation work for after the [[algo-comp-before-tools|Algorithmic Composition + tools]] sweep.

**Why:** User decided 2026-05-17 (reversing an earlier same-day decision to include implementation notes). Reasoning: implementation choices made *now* on concept pages — before we have a vetted view of which libraries / approaches / capabilities the tools sweep will recommend — would conflict with later guidance. We'd be writing code against tools we haven't yet evaluated. Premature commitment in writing is harder to reverse than in conversation. The right sequence:

1. Concept-page depth-dives = pure reading + synthesis + theory.
2. **Algorithmic Composition depth-dive** = framework + library-evaluation rubric (per [[algo-comp-before-tools]]).
3. **Tools sweep** = library evaluations using the rubric.
4. **Then and only then**: revisit earlier concept pages to add implementation notes informed by the evaluated stack.

**How to apply:**

- Concept pages get theory, citations, programmable *concepts* (parameter ranges, thresholds, formulas), and pointers to libraries — but **no JS/TS code blocks** and no library-specific advice.
- Pseudocode is OK for *algorithm clarity* (e.g., Arnheim's directed-tension scoring formula in [[Dynamics of Obliqueness]] uses a sin-of-double-angle formula — that's math, not implementation choice).
- Hard line: nothing that prescribes "use library X" or "do it this way in TS." Save that for after the tools sweep.
- The empty `wiki/techniques/` branch stays empty until the algo-comp+tools sweep runs.

Related: [[clustered-sweeps]], [[algo-comp-before-tools]], [[language-preference]], [[application-priorities]].
