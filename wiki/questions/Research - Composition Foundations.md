---
type: synthesis
title: "Research: Composition Foundations"
tags: [research, composition, art-fundamentals]
status: developing
address: c-000011
created: 2026-05-16
updated: 2026-05-16
related:
  - "[[The Gestalt Principles of Visual Perception]]"
  - "[[Dynamic Symmetry]]"
  - "[[Compositional Grids]]"
  - "[[Rule of Thirds]]"
  - "[[Golden Spiral]]"
  - "[[Public Seminar - Dynamic Symmetry]]"
  - "[[Wikipedia - Rule of Thirds]]"
  - "[[PetaPixel - True Photographic History]]"
sources:
  - "[[Public Seminar - Dynamic Symmetry]]"
  - "[[Wikipedia - Rule of Thirds]]"
  - "[[PetaPixel - True Photographic History]]"
---

# Research: Composition Foundations

## Overview

Composition has two layers in the literature, and any programmable system needs both. The **psychological layer** is the Gestalt principles — Wertheimer, Köhler, Koffka (Berlin, c. 1910–1930s) — which describe how the visual system groups elements into wholes. The **geometric layer** is the family of compositional grids — rule-of-thirds, dynamic-symmetry armatures, golden-spiral curves, diagonal methods — which give the *coordinates* where focal elements go. The grids work to the extent that they place elements where the Gestalt substrate wants them; they fail when they're applied without that grounding.

## Key Findings

- **Gestalt is the substrate; grids are the surface.** The grids in popular composition (rule-of-thirds, golden-section, dynamic-symmetry, diagonal) all give coordinate-level guidance, but their effectiveness depends on the underlying Gestalt principles (proximity, similarity, continuity, closure, figure/ground). Arnheim's *Art and Visual Perception* (1954) is the canonical bridge between the two layers, treating an image as a field of perceptual forces with a computable centre of mass (Source: synthesis from concept pages).
- **The rule of thirds is mostly a 20th-century artifact.** The popular "place on a 3×3 grid intersection" form is a 1950s–1980s reconstruction. The original 1797 coinage (John Thomas Smith) was about light/dark proportions, not geometry. The conflation with the Golden Mean — distinct concepts — began with Carleton Wallace's books in the late 1950s/early 1960s and was cemented by US Army training materials in 1979 (Source: [[PetaPixel - True Photographic History]]).
- **Dynamic Symmetry has rigorous math and weak history.** Jay Hambidge's 1920 system (root rectangles, reciprocal-rectangle construction, whirling-rectangles spiral) is geometrically exact and programmable, but contemporary critics in the *American Journal of Archaeology* (1921) and *Art Bulletin* (1921) showed his claim that Greek vase painters consciously used these proportions does not hold up to evidence (Source: [[Public Seminar - Dynamic Symmetry]]). Useful as a generative template; suspect as a critical lens.
- **Golden-spiral overlays on classical paintings are mostly retrofitted.** Cartier-Bresson explicitly argued against schema-based composition in *The Decisive Moment* (1952), yet his photographs are routinely shown with golden-spiral overlays as if he had composed by them. The math is exact; the empirical case for intentional φ-composition is weak (Source: [[PetaPixel - True Photographic History]]).
- **Composition is programmable, but in a layered way.** A generative system can compute focal coordinates from grids cheaply; an evaluation system can compute saliency-mass overlap against multiple candidate grids and pick the best fit. But "is this image well-composed?" reduces ultimately to Gestalt — does the figure separate from the ground, do the force lines close, is the centre of mass near where the image asks the eye to look — not to whether a specific grid happens to fit.

## Named practitioners (attribution only, no dedicated pages)

Per the wiki's programmability principle (see `CLAUDE.md` at vault root and the `feedback_programmability-principle.md` memory), artists and theorists appear as attribution in concept pages, not as their own nodes:

- **Max Wertheimer, Wolfgang Köhler, Kurt Koffka** — Berlin Gestalt school, ~1910–1930s. Founding figures of the principles.
- **Rudolf Arnheim** (1904–2007) — *Art and Visual Perception* (1954). Bridge from Gestalt psychology to art theory.
- **Jay Hambidge** (1867–1924) — *Dynamic Symmetry: The Greek Vase* (1920). Inventor of Dynamic Symmetry as a system.
- **John Thomas Smith** (1766–1833) — first written use of "rule of thirds" (1797), about light/dark proportions.
- **Sir Joshua Reynolds** (1723–1792) — quoted by Smith; the 2:1-ratio observation Smith was expanding.
- **Henri Cartier-Bresson** (1908–2004) — *The Decisive Moment* (1952); the strongest argument against schema-based composition.
- **Le Corbusier** (Charles-Édouard Jeanneret, 1887–1965) — *Modulor* system, the late-modernist heir to golden-ratio composition.
- **Mario Livio** — *The Golden Ratio: The Story of Phi* (2002), the modern skeptical canon on φ-in-art claims.

## Key Concepts

- [[The Gestalt Principles of Visual Perception]] — the psychological substrate; proximity, similarity, continuity, closure, figure/ground, common fate, symmetry, uniform density.
- [[Compositional Grids]] — the family of overlay systems organizing the picture plane.
- [[Rule of Thirds]] — the simplest grid; popular but mostly mid-20th-century in its modern form.
- [[Dynamic Symmetry]] — Hambidge's root-rectangle system; exact math, suspect history.
- [[Golden Spiral]] — logarithmic spiral with $\phi$ growth; mathematically rigorous but mostly retrofitted in art-historical claims.

## Contradictions and uncertainty

- **Rule of thirds vs. Golden Mean.** Popular sources treat them as essentially the same. They aren't: $1/3 \approx 0.333$ vs. $1/\phi \approx 0.382$, and the histories are independent until conflated in the 1950s–60s. We adopt the "distinct techniques" framing (Source: [[PetaPixel - True Photographic History]]; [[Wikipedia - Rule of Thirds]]).
- **Did Greek vase painters consciously use Dynamic Symmetry?** Hambidge claimed yes; *American Journal of Archaeology* (1921) and *Art Bulletin* (1921) argued no, and the modern consensus sides with the critics (Source: [[Public Seminar - Dynamic Symmetry]]). The math is unaffected; the historical claim is the contested part.
- **Does the golden ratio meaningfully appear in art?** Mario Livio's skeptical reading is that most claimed appearances are cherry-picked or post-hoc; intentional uses (Le Corbusier, Hambidge, a handful of others) are well-documented but the broader sample is overstated. We side with the skeptical reading.

## Open Questions

- Direct read of **Wagemans et al. (2012)** *Psychological Bulletin* paper for the modern Gestalt principle list and computational implementations. PMC fetch hit the token budget; need to chunk-read or pull from the published PDF.
- Direct read of **Arnheim's *Art and Visual Perception*** (1954) for primary-source content on perceptual forces and visual balance. The book is in the public domain (archive.org version available).
- **Locher, Krupinski et al.** on eye-tracking validations or refutations of Gestalt-predicted groupings.
- Empirical study: score a large corpus of classical paintings against multiple grids (rule-of-thirds, golden-section, dynamic-symmetry, diagonal) and report per-grid recall and overlap. Would clarify which grids are "real" descriptive languages and which are largely retrofits.
- **Cartier-Bresson's actual compositional practice** if not schema-based: trained painter, frequently illustrated paint-vs-photo differences. What did he do instead? "Decisive moment" plus what geometric intuition?
- The **Diagonal Method** as a fourth canonical grid alongside rule-of-thirds, golden-section, and dynamic-symmetry. Cited in Wikipedia but not yet covered here.

## What this sweep did NOT cover

- **Color systems** — [[The Munsell and CIELAB Color Systems]], CIEDE2000, HCT, OKLCH. Queued for the next sweep.
- **Aesthetic measures** — [[Birkhoff's Aesthetic Measure]], fractal dimension, [[Visual Entropy]] (page exists; deeper coverage pending).
- **LLM techniques** — vectorizing aesthetic concepts, JSON archetypes, multimodal eval loops.
- **Tools** — p5.js ecosystem, OpenCV, etc. Deferred until the conceptual scaffold is solid.
- Wagemans 2012 PMC paper — fetched but exceeded token budget.
- Arnheim's *Art and Visual Perception* — primary read deferred.
- PMC3485801 (Arnheim's visual balance) — reCAPTCHA-blocked.

## Sources

- [[Public Seminar - Dynamic Symmetry]] — Wilson, Public Seminar / The New School (2019).
- [[Wikipedia - Rule of Thirds]] — Wikipedia contributors.
- [[PetaPixel - True Photographic History]] — Rubin & Talley, PetaPixel (2024).
