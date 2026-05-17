---
address: c-000186
title: Murch's Six Editing Rules
type: concept
status: developing
tags: [concepts, editing, murch, film, time-based]
created: 2026-05-17
updated: 2026-05-17
---

# Murch's Six Editing Rules

**Walter Murch's working-editor's hierarchy** of cut-decision priorities, codified in *In the Blink of an Eye: A Perspective on Film Editing* (1995). The six rules (in *strict priority order*) are: **Emotion**, **Story**, **Rhythm**, **Eye-trace**, **Two-dimensional plane**, **Three-dimensional continuity**. Where [[Eisenstein's Montage Theory|Eisenstein]] is theoretical, Murch is *pragmatic*: an editor decides each cut by walking down this list and serving whichever rule is most-affected.

> [!note] Working-editor's wisdom, not academic theory
> Murch is the editor of *Apocalypse Now*, *The Godfather Part II*, *The English Patient*, *The Conversation*. The six rules emerge from decades of practice, not from formal theory. Pairs with [[Eisenstein's Montage Theory|Eisenstein's]] theoretical taxonomy: Eisenstein names what *kinds* of montage exist; Murch names what an editor *chooses between* in any given cut.

## The hierarchy

| Priority | Rule | Weight (Murch's rough number) | What it means |
|---|---|---|---|
| 1 | **Emotion** | 51% | Does the cut produce the right emotional response? |
| 2 | **Story** | 23% | Does it advance the story? |
| 3 | **Rhythm** | 10% | Does the timing feel right? |
| 4 | **Eye-trace** | 7% | Does the viewer's eye land where it should in the new shot? |
| 5 | **Two-dimensional plane** | 5% | Does the composition across the cut work? |
| 6 | **Three-dimensional continuity** | 4% | Does the spatial geometry / 180-degree rule survive? |

The percentages add to 100% — Murch's expression of relative weight. The point isn't the exact numbers; it's that **emotion eats > half** the decision weight, and **physical continuity is the lowest priority**.

## The hierarchy's central insight

The classical Hollywood editing-bible (Reisz & Millar 1953) emphasized continuity — preserve screen direction, eye-line matches, 180-degree rule, spatial coherence. Murch inverts this: **violate continuity if necessary to serve emotion**. If a continuity-correct cut feels emotionally wrong, take the emotional cut.

This is **physiognomic perception applied to editing**: the viewer feels-the-cut before they intellectualize it. The eye does perceive 180-degree violations; but if the emotional truth lands, the viewer forgives.

The Coppola / Murch *Apocalypse Now* edit is full of continuity violations that serve emotional truth (the famous Marlon Brando reveal sequence, the helicopter assault).

## Rule-by-rule

### 1. Emotion (51%)

"What does the audience feel at this moment?" If the cut produces the intended emotional response — sadness, dread, triumph, ambiguity — it's the right cut, even at the cost of every other rule.

This is the **single most-important Murch claim**. Modern narrative cinema universally subscribes to it.

### 2. Story (23%)

"Does the cut advance the narrative / character / theme?" Subordinate to emotion (the *feeling* of progress matters more than the *fact* of progress) but central.

### 3. Rhythm (10%)

The cut-timing pattern — Eisenstein's rhythmic montage applied. Cuts can come too early, too late, or "just right." The "just right" is felt, not measured.

### 4. Eye-trace (7%)

Where the viewer's eye is *just before* the cut should match where it lands *just after*. If the viewer is watching the actor's face in shot A and the cut goes to a wide-shot where the face is in a different position, the viewer disorients. Editors stage cuts so the eye lands smoothly.

This is the **gestalt-continuation** ([[The Gestalt Principles of Visual Perception|Gestalt principle]]) of editing — visual continuity across the gap.

### 5. Two-dimensional plane (5%)

Compositional balance across the cut. If shot A is left-weighted and shot B is right-weighted, the cut creates visual jolt. Sometimes desired (for emphasis); usually not.

### 6. Three-dimensional continuity (4%)

The 180-degree rule, spatial geometry, set-direction continuity. Murch's lowest priority — useful but routinely violated for higher-priority reasons.

## Why the order matters

Editors and theorists who *don't* prioritize emotion first produce:
- **Mechanically-correct editing** that feels lifeless (the early film-school-grad failure mode)
- **Continuity-obsessed editing** that misses the emotional beat
- **Rhythm-only editing** (music-video-coded) that lacks narrative drive

Murch's order embeds a craft hierarchy that produces emotionally-true editing even at the cost of formal correctness.

## Application to non-narrative work

For [[Music-reactive Visualizers]] (priority 4) and generative-art sequences (priority 1), the hierarchy adapts:

- **Emotion** → does the visual response match the audio's emotional valence?
- **Story** → does the visual sequence have arc / development / resolution?
- **Rhythm** → does the cut-timing match the music's rhythm?
- **Eye-trace** → does the viewer's attention land smoothly across cuts?
- **2D plane** → composition continuity across cuts
- **3D continuity** → spatial coherence

For visualizers, **emotion and rhythm dominate**; story is often vestigial or musical-form-driven; spatial continuity rarely matters.

## Computable handles

For an LLM-driven editing system:

- **Per-cut scoring**: rate candidate cuts on each of the 6 dimensions; weight by Murch's percentages; pick the highest-scoring cut
- **Emotion classifier**: multimodal LLM rates emotional valence + arousal of each shot ([[Russell's Affect Circumplex]] coordinates)
- **Eye-trace prediction**: object/face detection + saliency models predict eye-landing-point per shot; minimize landing-point distance across cuts
- **Rhythm scoring**: audio-driven beat-grid (via [[Strudel]] or [[Meyda]]) + cut-distance-from-beat
- **2D-plane scoring**: bounding-box overlap of composition's "subject" across cuts

Production AI-editing systems (Adobe Sensei, Runway) implement weakly-Murch-influenced heuristics; full-Murch implementation is a research frontier.

## Limits and critique

- Murch's framing is **narrative-cinema-centric**. Documentary, experimental, and music-video editing weight the rules differently.
- The specific percentages are **practitioner intuition**, not empirical findings. Different editors at different studios would order differently.
- **Genre dependence**: action editing weights rhythm higher; horror weights anticipation/withholding higher.
- **Per-project**: same editor on different projects uses different weights.

The hierarchy is a *defensible default*; intelligent editors deviate when content demands.

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| 1. Generative art (dynamic) | Sequence-level structuring of generated outputs |
| 2. Branding | Brand-video editing pragmatics |
| 3. Graphic design | Less direct; scrollytelling cut-decisions |
| **4. Music-reactive** ★ | Murch's emotion-first rule is the right framing for cut decisions; rhythm secondary |

## Related

- [[Eisenstein's Montage Theory]] · [[McCloud's Panel Transitions and the Infinite Canvas]] · [[Disney Animation Principles]] · [[Time-based Composition]] · [[Negative Space in Motion]] · [[Physiognomic Perception]] · [[Russell's Affect Circumplex]] · [[The Gestalt Principles of Visual Perception]]

## Sources

1. Murch, Walter. *In the Blink of an Eye: A Perspective on Film Editing*, 2nd ed. Silman-James Press, 2001 (first ed. 1995).
2. Murch interviews and lectures (widely available online).
3. Ondaatje, Michael. *The Conversations: Walter Murch and the Art of Editing Film* (2002).
4. Bordwell & Thompson. *Film Art: An Introduction* (textbook integrating Murch into broader stylistics).
