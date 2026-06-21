---
name: operational-page-standard
description: "Every concept page must equip Perceive + Build + Evaluate operations, not just define a concept. Breadth-coverage produced superficial pages; the new bar is operational depth-for-use. The wiki must also recognize its own gaps and autoresearch to fill them."
metadata:
  node_type: memory
  type: feedback
---

The wiki's quality bar is **operational readiness**, not coverage. User's concern (2026-05-19): "we collect superficial data points about a comprehensive amount of knowledge domains, but we fail the core objective of this wiki to facilitate actual creation and evaluation of visual projects or art. Every concept page [should] unlock ability to wield this concept in implementation."

**Every concept page must equip three operations** (weighted by the concept's role — a perceptual concept leans Perceive/Evaluate; a generative concept leans Build):

1. **Perceive** — the perceptual/cognitive mechanism: *why* a viewer experiences the effect. (For tension: the psychology of obliqueness, asymmetry, truncation that makes the eye read "force.")
2. **Build** — generative rules, parameter ranges, code patterns, library pointers, AND LLM prompt formulations. Both programmatic levers and prompt levers.
3. **Evaluate** — assess an artifact **(including an external image we did NOT create)** for the property and propose concrete improvements: metric scores AND code/prompt-level fixes. Not just "scores 0.4 on tension" but "raise obliqueness of the dominant diagonal — here's the code, here's the prompt."

Plus the meta-capability:

4. **Gap recognition.** A page that can't support all three declares the gap explicitly (a "Gaps" callout) and, when prioritized against the four applications, gets autoresearched **with the specific purpose of closing the operational gap** — not generic "learn more about X." The wiki will never have complete coverage; it must know what it's missing and how to fill it.

**Why:** The 15-gap breadth sweeps (May 2026) optimized for coverage over operational depth. The IGP page (c-000191) was the proof case — it satisfied the programmability principle (translated into a rule) but couldn't help anyone *build* an IGP until the 2026-05-18 library audit added an Implementation Landscape section. The user generalized: systematic failure mode, not a one-off.

**How to apply:**
- Before marking any concept page "developed", run the Perceive/Build/Evaluate test against the four application priorities (gen art / branding / graphic design / music-reactive).
- When a page fails, add a "Gaps" callout + autoresearch-queued marker rather than leaving it silently shallow.
- Autoresearch prompts for re-deepening must target the operational gap *specifically* (use the program-style autoresearch prompt pattern — objectives + constraints + output files + stopping criteria; see [[npm-audit-before-design]]).
- The **"Evaluate external images"** capability connects to existing wiki content that must now be operationalized per-concept: [[Multimodal Evaluation Loops]], [[LLM-as-Judge for Visual Quality]], [[Photo Aesthetic Features]]. The workflow target: "here's an image — score its [tension/balance/harmony/...], explain why, propose code + prompt improvements."

This **strengthens** [[programmability-principle]]: not merely "translates to a rule/metric/pointer" but "actually equips perceive + build + evaluate, or declares the gap."

**Rollout — the operational-readiness audit.** The next sweep type is operational depth, not breadth: walk concept pages in application-priority order, score each on Perceive/Build/Evaluate, queue targeted autoresearch for the gaps. Replaces "what fields are we missing?" with "which fields we have can actually be wielded?"

**Connection to the build loop:** building a concrete artifact (the toolkit-screensaver) is itself a gap-surfacing mechanism — it revealed the IGP gap. So build-and-fill-gaps and audit-then-re-deepen are complementary; the artifact exercises the wiki and exposes operational shallowness. See [[test-artifact-vs-workflow]].

Related: [[programmability-principle]] (the principle this strengthens), [[test-artifact-vs-workflow]], [[npm-audit-before-design]], [[design-for-consumer]], [[application-priorities]].
