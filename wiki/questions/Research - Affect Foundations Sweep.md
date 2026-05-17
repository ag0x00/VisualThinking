---
title: "Research – Affect Foundations Sweep (Emotion + Color Psychology + Empirical Aesthetics)"
type: research-synthesis
status: developing
tags: [research, synthesis, emotion, color, aesthetics, cross-modal]
created: 2026-05-17
address: c-000102
sources: ["[[Emotion Psychology]]", "[[Color Psychology]]", "[[Empirical Aesthetics]]"]
confidence: high
---

# Research – Affect Foundations Sweep (Emotion + Color Psychology + Empirical Aesthetics)

The **first clustered depth-dive sweep** after the catalog. Per [[Wiki Methodology]] and the user's three locked policy decisions (clustered sweeps; reading-only on concept pages; algorithmic-composition before tools), this sweep collapses **queue items 1, 2, 3** into a single coherent body of theory.

The rationale: Russell's affect circumplex and Berlyne's arousal-potential turn out to be shared substrate underlying all three fields. Emotion psychology supplies the **dimensions** (valence, arousal, dominance). Color psychology supplies one of the **realizations** (which colors map to which dimensional regions). Empirical aesthetics supplies the **complexity-preference law** that interacts with everything.

## What's new from this sweep

**12 new concept pages + 1 synthesis** (c-000090 … c-000102):

### Emotion psychology (queue item 1)

- **[[Russell's Affect Circumplex]]** — the 2D valence-arousal substrate; the most-empirically-validated dimensional model.
- **[[Plutchik's Wheel of Emotions]]** — 8 primary emotions + dyadic compounds; the categorical-evolutionary counterpart.
- **[[PAD Emotion Model]]** — adds the dominance axis. Critical for branding and figural work.
- **[[Constructed Emotion Theory]]** — Barrett's contemporary alternative to basic-emotions. Categorical labels are constructed; core affect is shared.
- **[[Appraisal Theories of Emotion]]** — Scherer / Lazarus: emotions arise from cognitive evaluations along ~7 dimensions (novelty, pleasantness, goal-congruence, agency, coping, norms).

### Color psychology (queue item 2)

- **[[Ecological Valence Theory]]** — Palmer & Schloss 2010. Color preference is the weighted average of associated-object valences. The single best-validated theory of color preference.
- **[[Goethe and Kandinsky on Color]]** — historical phenomenological vocabulary (warm/cool, expansive/contractive, active/passive). Physically wrong about light; experientially valuable as observation.
- **[[Cross-Cultural Color Variation]]** — Berlin-Kay universals; cultural-specific symbolic overlays. Dimensional ratings travel; categorical labels don't.

### Empirical aesthetics (queue item 3)

- **[[Berlyne's Arousal-Potential Theory]]** — the inverted-U law: mid-complexity is preferred. Unifies Birkhoff / entropy / fractal-D measures.
- **[[Processing Fluency Theory]]** — Reber et al. 2004. Beauty = ease of processing. The competitor / complement to Berlyne, reconciled in dual-process models.
- **[[Neuroaesthetics and Individual Variation]]** — Vessel & Rubin 2010, 2012. Aesthetic experience engages the Default Mode Network; agreement is high for faces/scenes but low for art.

### Cross-cluster bridge

- **[[Cross-Modal Emotion Mapping]]** — Russell-circumplex as the universal bridge between music, color, and form. The cross-modal vocabulary table closes an open thread from Sweep 3 ([[Research - Arnheim Sweep 3]]).

## Five cross-cutting themes

### 1. The (V, A) substrate is the wiki's emotional lingua franca.

Across all three fields and into [[Cross-Modal Emotion Mapping]], the **(valence, arousal)** plane is the most-portable unit of emotional specification:

- Russell circumplex IS the (V, A) plane.
- Plutchik's 8 primaries embed as 8 anchor points in the plane.
- PAD extends to (V, A, D) but the projection to (V, A) is the cross-cultural-stable part.
- Constructed emotion theory endorses (V, A) as the core-affect substrate beneath constructed categories.
- Music has well-validated (V, A) coordinates that match listeners' ratings.
- Color has (V, A) coordinates (saturated-warm = high-V high-A; pale-cool = high-V low-A).
- Berlyne's *arousal-potential* is a property of stimuli that produces high-A *states* in viewers.

**Implication for the wiki and any pipeline built from it**: specify emotion as (V, A) coordinates wherever possible. Reach for categorical labels (joy, fear, anger) only when in-culture and high-context, with awareness that the label is constructed.

### 2. Dimensional > categorical for cross-cultural / programmable work.

Per [[Cross-Cultural Color Variation]] and [[Constructed Emotion Theory]], the dimensional substrate **travels** across cultures and modalities; specific category labels do not.

Operational rule:
- **Inside one culture, one modality**: categorical labels are fine and natural.
- **Cross-culture or cross-modality**: use (V, A) coordinates.

This justifies the Russell-circumplex centrality and downgrades the Plutchik / Ekman / Goethe / Kandinsky category vocabularies to *in-culture working vocabulary*.

### 3. Berlyne's arousal-potential unifies the wiki's complexity-based aesthetic measures.

Birkhoff, Visual Entropy, Fractal Dimension, Datta features, NIMA — all five operationalize different proxies for **the same underlying construct**: Berlyne's stimulus arousal-potential. The inverted-U law explains why all of them find a preferred mid-range:

- Birkhoff $O/C$ peaks at moderate complexity.
- Entropy preference is mid-range.
- Fractal $D \in [1.3, 1.5]$ is the empirical preference range.
- Datta's pleasing-vs-unpleasing features cluster mid-complexity.
- NIMA-learned features land mid-range.

This is **the wiki's main theoretical unification** at the L2 (theory) layer. Five separate computational lineages, one psychological substrate.

### 4. Fluency vs Berlyne: liking vs interest, snap vs sustained.

[[Processing Fluency Theory]] and [[Berlyne's Arousal-Potential Theory]] are not contradictory; they describe **different judgments** at **different time scales**:

| Judgment | Theory | Mechanism |
|---|---|---|
| Snap "do I like this?" (< 1 sec) | Fluency-dominant | Easy-to-process = pleasant |
| Sustained "is this interesting?" (5–30 sec) | Berlyne-dominant | Moderate arousal-potential = engaging |
| Reflective "is this meaningful?" (minutes+) | Leder stages 3–4 / Neuroaesthetic | Cognitive mastering / DMN engagement |

This is the most-actionable empirical-aesthetics finding. **Different design goals require different optimization targets**:
- Logos optimize fluency (snap judgment).
- Album covers and hero compositions optimize Berlyne (interest, browse engagement).
- Galleries / paintings / portfolio pieces optimize Leder-stage-3+ (sustained, reflective).

### 5. The cross-modal vocabulary is the universal-design substrate.

Combining Arnheim Sweep 3's structural primitives (rising/falling, expansion/contraction, harmony/discord, struggle/conformance) with the Russell-circumplex bridge produces the **cross-modal vocabulary table** in [[Cross-Modal Emotion Mapping]]. This is:

- The most-actionable single artifact this sweep produces.
- A **direct music → visual translation interface** for priority-4 visualizers.
- A **direct brief → visual translation interface** for generative art and branding.

The table is theoretical; implementing it as a working module is deferred to after the Algorithmic Composition + Tools sweep, per the locked policy.

## Specific empirical claims absorbed

| Claim | Source | Programmability implication |
|---|---|---|
| Russell circumplex 2D structure cross-culturally robust | Russell 1991; Yik et al. 2011 | Use (V, A) as the portable emotion coordinate |
| Palmer-Schloss WAVE correlates with color preference at $r \approx 0.89$ | Palmer & Schloss 2010 | Color-preference is *associative*; brand-conditioning is the design lever |
| Blue is most-preferred, yellow-green least, across cultures | Palmer-Schloss + replications | Universal-substrate defaults exist; respect them or violate deliberately |
| Berlyne inverted-U: mid-complexity is liked | Berlyne 1971 + meta-analyses | Aim for mid-range entropy / fractal-D / Datta scores |
| Mere-exposure effect raises liking | Zajonc 1968 | Brand-mark repetition is a fluency / liking lever |
| DMN engages for personally-resonant aesthetic | Vessel et al. 2012 | Aesthetic experience is introspective; universal-target generators undershoot |
| Faces/scenes high inter-rater agreement; art low | Vessel & Rubin 2010 | "Universal art beauty" is a category error; personalize or target audience |
| Aesthetic emotions distinct from basic emotions | Menninghaus et al. 2019 | Awe / being-moved / nostalgia need their own design targets |
| 70 ms Michotte threshold + Berlyne arousal-potential | Sweep 3 + this sweep | Latency budget + complexity sweet spot together determine visualizer feel |
| Facial expression and emotion correlate < 30% | Barrett et al. 2019 | The "face = emotion" pipeline is unreliable; use multiple channels |

## Cross-references and updates to existing pages

Several existing pages should be updated to cite the new theory. Queued for a quick pass next session:

- **[[Emotion Psychology]] stub** — downgrade from `status: stub` to `status: stable`; mark depth-dive complete; link the 5 emotion pages.
- **[[Color Psychology]] stub** — same; link the 3 color pages.
- **[[Empirical Aesthetics]] stub** — same; link the 3 empirical-aesthetics pages.
- **[[Birkhoff's Aesthetic Measure]]** — note Berlyne as the contemporary framework that subsumes Birkhoff's $O/C$.
- **[[Visual Entropy]]** / **[[Fractal Dimension]]** — note that the mid-range preference is the Berlyne arousal-potential law.
- **[[Photo Aesthetic Features]]** — note that Datta's features are arousal-potential proxies.
- **[[Color Harmony]]** — note that harmony preferences interact with EVT (ugly-individual colors don't become liked through harmony alone).
- **[[Warm and Cool Colors]]** — note that Arnheim's structural deviation theory complements Goethe's associative vocabulary.
- **[[LLM-as-Judge for Visual Quality]]** — add the Vessel finding about individual variation; argue for persona-targeted prompts.
- **[[Multimodal Evaluation Loops]]** — add cross-modal-vocabulary mapping as one of the eval channels.

## Three cross-cutting research projects (carried forward from Field Map)

This sweep makes all three more concrete:

1. **The Directed-Tension Score** — Arnheim Sweep 3's 5-generator composition metric. The Affect-Foundations work specifies that this score maps to **arousal magnitude** in (V, A) space; valence comes from harmony / color / direction-of-tension.
2. **The Cross-Modal Expressive Vocabulary** — now specified theoretically in [[Cross-Modal Emotion Mapping]]'s table. Implementation deferred to after tools sweep.
3. **The Physiognomic-Features Extractor** — connects to [[Neuroaesthetics and Individual Variation]] and [[Physiognomic Perception]]: extract perception-grounded features (energy, temperature, openness, ascent, contour hardness) that complement Datta's pixel-level features.

## What's missing and queued

### Items not deeply covered (deferred to other sweeps)

- **FACS and face-specific emotion** — defer to the L1 Cleanup sweep (queue item 12).
- **Body language and pose-emotion** — defer to the Body Language sweep (queue item 11).
- **Music-emotion** beyond the cross-modal substrate — could become its own deep-dive if priority 4 takes off, but the current treatment is sufficient for the wiki's purposes.
- **Bayesian / predictive-processing accounts of aesthetics** — touched in [[Berlyne's Arousal-Potential Theory]] (Van de Cruys 2017) but not deepened. May matter later if the wiki integrates with active-inference frameworks.

### Primary sources still untouched

- Russell 1980 (full text of the original paper).
- Berlyne 1971 (full text of *Aesthetics and Psychobiology*).
- Barrett 2017 *How Emotions Are Made* (full book).
- Palmer & Schloss 2010 (full PNAS paper).
- Mehrabian 1996 (full PAD validation paper).
- Vessel et al. 2012 (the DMN paper).

All of these are book / journal-paper deep reads; consult specifically if a claim is contested or extended.

## Connection to the four user priorities (updated)

| Priority | What this sweep delivers |
|---|---|
| 1. Generative art | (V, A, D) coordinate as the most-portable emotion specification; Berlyne mid-complexity targeting; awareness of fluency-vs-interest tradeoff; cross-cultural caution on color symbolism. |
| 2. Branding | PAD-dominance axis is the brand-personality engine; EVT + brand-conditioning as the color-equity mechanism; cross-cultural color audits for global brands; fluency-optimization for logos vs Berlyne-optimization for brand systems. |
| 3. Graphic design | Same as priority 2 plus: editorial use of aesthetic emotions (being moved, nostalgia, awe); negative-space + typography are fluency tools. |
| 4. Music-reactive visualizers | **The deepest priority-4 contribution to date.** Cross-modal vocabulary table; Russell-circumplex as the music-to-visual bridge; Juslin-Västfjäll mechanisms as the visualizer-design checklist; latency-and-complexity dual constraint (Michotte's 70 ms + Berlyne's mid-range). |

## What changes about how we judge generative work after this sweep

A practical checklist a generator's output can be judged on, derived from this sweep:

1. **What's its (V, A) coordinate, and is it the intended one?** (Russell-circumplex test.)
2. **Is its complexity in the Berlyne mid-range** for the intended viewing context?
3. **Is its first-impression fluent?** (Snap-judgment test, for use-cases needing it.)
4. **Are its color choices high-WAVE for the target culture?** (EVT cultural-audit test.)
5. **Does its structural pattern match its intended emotional brief?** ([[Symbolic Pattern in Composition]] + [[Directed Tension]] test.)
6. **Is the categorical label avoidable in favor of the dimensional coordinate?** (Cross-cultural robustness test.)
7. **For dynamic / music output: does it engage multiple Juslin-Västfjäll mechanisms or just one?**

This is the [[LLM-as-Judge for Visual Quality]] checklist refined by the affect-foundation depth-dive.

## Closing thought

This is the **first sweep at the theory (L2) layer** of the wiki, after L1 (perception) was densified by the Arnheim sweeps. The Affect Foundations are now well enough developed that the **emotion-coordinate-to-visual-parameter pipeline** has a clear theoretical specification. What remains is to implement it — which waits, per the locked policy, for the Algorithmic Composition + Tools sweep to supply the right library and language choices.

Next sweep, per the locked sequence: **L1 Cleanup** (items 5 + 12: Perceptual Constants + Face Perception). Short, well-bounded. Should be fast.

## Related pages

[[Wiki Methodology]] · [[Field Map - Visual Thinking Knowledge Domains]] · [[Research - Arnheim Sweep 1]] · [[Research - Arnheim Sweep 2]] · [[Research - Arnheim Sweep 3]] · [[Russell's Affect Circumplex]] · [[Plutchik's Wheel of Emotions]] · [[PAD Emotion Model]] · [[Constructed Emotion Theory]] · [[Appraisal Theories of Emotion]] · [[Ecological Valence Theory]] · [[Goethe and Kandinsky on Color]] · [[Cross-Cultural Color Variation]] · [[Berlyne's Arousal-Potential Theory]] · [[Processing Fluency Theory]] · [[Neuroaesthetics and Individual Variation]] · [[Cross-Modal Emotion Mapping]] · [[Emotion Psychology]] · [[Color Psychology]] · [[Empirical Aesthetics]] · [[Expression as Configuration of Forces]] · [[Symbolic Pattern in Composition]] · [[LLM-as-Judge for Visual Quality]]
