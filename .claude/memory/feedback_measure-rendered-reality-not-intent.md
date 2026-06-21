---
name: feedback_measure-rendered-reality-not-intent
description: "Operators must measure the RENDER, not the plan's declared intent; the plan-vs-pixels gap is where every wrong metric lives. Calibrate against pixels + an adversarial \"ugliest render that still scores 100%\" test"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4298e67e-a7f5-41be-b43f-ad794da3ad6f
---

A metric must measure **what the renderer actually draws**, not the RenderPlan's declared intent. The toolkit's founding choice — "score the plan, not the bitmap" (determinism, no CV) — is still right, but it obliges every plan-based operator to model the *same transformations the renderer applies*. When the operator's idea of "what's visible" diverges from `svg.ts`, it measures fiction at 100% confidence.

**Why (3 bugs, one root, found 2026-05-23 on girih12 groutGap=0.15):**
- `constructionGrammar` summed full declared polygon areas → renderer clips at the frame → off-canvas overhang read coverage 1.25.
- `cuerdaSeca` read the `channel` *width* I set → renderer draws a stroke that didn't cover the inset gap → dark "bowtie" background bleed scored 100%.
- `colorChord` read palette *membership* → renderer filled 35% of frame with cream → unbalanced palette scored fine (area-blind).

In each, the operator trusted a *symbol in the plan* and never modeled the pixels. **The plan→pixels gap is where wrong measurements live.** Compounding own-goal: a fooled coverage metric (overhang) *drove* me to over-grout, which caused the other two visual defects — and the metrics that should have caught the result were measuring the wrong thing.

**How to apply — checklist for any new/edited operator:**
1. **Measure the rendered output, not a generator knob.** Reading back a param (`channel`) is tautological — it measures what you told it, not what happened.
2. **Account for every renderer transform that changes what's seen:** clip-to-frame, stroke-over-fill, inset gaps, overlap / z-order.
3. **Area/salience-weight anything about proportion or balance.** Membership ≠ perception (colorChord's flaw twice over — accents AND cream).
4. **Calibrate against a rendered reference image + a perceptual oracle (VLM), not just probed numbers.** We tuned groutGap by a coverage number and never looked at the render. The external-image VLM front-end is the calibration oracle, not a "nice to have."
5. **Write the adversarial test (the missing test class): the ugliest plan that still maxes this score.** If a good answer exists, the metric measures the wrong thing. The dual of our "deliberate-failure" variants.

**Structural fix:** one shared "what's visible" resolver consumed by BOTH `svg.ts` and the area operators, so they can't drift. See [[feedback_extract-rules-before-generating]] (same family: the machine should catch what the user catches by eye) and [[project_subsystem-trajectory]].
