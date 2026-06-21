---
address: c-000231
title: Application-Based Principles of Islamic Geometric Patterns (Azari et al. 2023)
type: source
source_type: review-article
author: Mohammadreza Ranjazmay Azari, Mohammadreza Bemanian, Mohammadjavad Mahdavinejad, Axel Körner, Jan Knippers
date_published: 2023
created: 2026-05-23
status: stable
confidence: high
tags: [source, islamic-geometry, igp, generation, variation, review]
---

# Application-Based Principles of Islamic Geometric Patterns (Azari et al. 2023)

State-of-the-art **review** of Islamic geometric patterns (IGPs) through an *application-based* lens, mapping the design principles onto contemporary computer-science methods. *Heritage Science* 11:22 (2023), open access (CC-BY 4.0).¹ Source PDF: `~/Downloads/s40494-022-00852-w.pdf`. Surfaced by the user as a strong source for **how one pattern flows/transforms into another**.

Complements [[Islamic Geometric Patterns and the Polygonal Technique]] (Bonner's construction-method view) with a *principles × technologies* survey, and motivates the new [[The Variation Principle in Islamic Geometric Patterns]] page.

## Application taxonomy

The review classifies all uses of IGPs into three application objectives, and weights the literature by each (≈67% / 25% / 8%):

- **Aesthetic-based** — proportion, generation methods, variation, dimension, multi-level, interlacing. *The branch relevant to this wiki.*
- **Sustainable-based** — *orosi*/*mashrabiya* screens for daylight, heat, humidity, airflow control.
- **Structure-based** — *karbandi* ribbed vaults, self-load-bearing *muqarnas*; force distribution / lattice features.

## Aesthetic principles (the programmable core)

- **Proportion & adaptability** — the circle divided into 4-/5-/6-fold (Broug); ratio systems shared with natural form.
- **Generation methods** — three historically/computationally dominant strategies: the **radial girih approach** (compass-and-straightedge; a star polygon in a circle, rays drawn from the centre, interstitial space filled), the **polygon-in-contact (tiling-based) method** (Hankin — called out as the natural *starting point for an algorithmic approach*), and **symmetry-group methods**.
- **Variation / transformation** — *the principle the user flagged.* See [[The Variation Principle in Islamic Geometric Patterns]]. One pattern becomes another by changing the **contact angle** (acute/median/obtuse families + two-point tilings; Persian *Tond / Shol / Tond-o-Shol*), and curvature changes the number of star points. Variation can be **continuous** — varied by spatial position (Bonner/Izadi) or, by extension, over time — which is how patterns visibly *flow into each other* (the Saveh dome smoothly transitions between girih zones).
- **Dimension (2D→3D)** — *muqarnas*, domes, *karbandi*: a 2D star pattern lifted into vaulting. (Out of scope for the flat screensaver.)
- **Multi-level / dual-level** — *one-level* (triangles/hexagons/squares repeated) vs *two-level girih* (an underline pattern + a main pattern at a finer scale, often self-similar; Bonner's three self-similarity types; Lu-Steinhardt 5/10 & 7/14 quasiperiodic inflation). **This is the intricacy layer** for dense, "Al-Sharabeya"-class patterns.
- **Interwoven** — strands cross over/under; enhances the sense of movement.
- **Periodic vs aperiodic** — periodic 2/3/4/6-fold (the 17 plane groups); aperiodic 5/7-fold (quasicrystalline).

## Computer-science methods landscape

The review tallies the technologies applied to IGPs (their Fig. 18): digital visualisation ≈55%, digital surveying ≈15%, **formal grammar ≈11%** (shape grammar / Lalvani's *shape code + morph code* for generating variations), digital fabrication ≈9%, optimisation ≈7%, software tools ≈4%, **graph theory ≈2%** (Zahri — connected/closed graphs), and machine learning (genetic algorithms for rosette feature extraction; ML restoration of damaged patterns). Named computational lines of work include Kaplan & Salesin (tiling + parameterised inflation), Khamjane & Benslimane (symmetry-group computational generation), and Bonner & Pelletier (aperiodic self-similar inflation at 5/10 and 7/14).

## Why this matters for our build

- Validates the toolkit's choice — **polygon-in-contact** (Hankin) as the algorithmic substrate, **symmetry/tiling** as the repetition layer (see [[tactile-js]]).
- Names the **variation knob** (contact angle) as the primary expressive + *transformational* control → directly maps to the strapwork inference's `contactAngle`, and to **morph-based animation** (temporal θ) and **spatial θ gradients** (patterns flowing across the canvas).
- Confirms **multi-level / two-level girih** as the route to intricacy.

> [!note] Angle-convention caution
> This source states the family angles as acute 36° / median 72° / obtuse 108° — the angle *between the two crossing lines*. Kaplan's polygon-in-contact convention measures the contact angle *from the edge*. Different conventions; keep the toolkit internally consistent (see [[The Variation Principle in Islamic Geometric Patterns]]) and don't transfer degree values across sources without checking which angle is meant.

## Sources

1. Ranjazmay Azari, M., Bemanian, M., Mahdavinejad, M., Körner, A., Knippers, J. *Application-based principles of Islamic geometric patterns; state-of-the-art, and future trends in computer science/technologies: a review.* Heritage Science 11:22 (2023). https://doi.org/10.1186/s40494-022-00852-w

## Related

[[Islamic Geometric Patterns and the Polygonal Technique]] · [[The Variation Principle in Islamic Geometric Patterns]] · [[Symmetry-Group Pattern Generator]] · [[Symmetry Groups and Tessellation]] · [[Aperiodic Tiling and the Hat Monotile]] · [[tactile-js]]
