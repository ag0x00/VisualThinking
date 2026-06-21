---
address: c-000232
title: The Variation Principle in Islamic Geometric Patterns
type: concept
status: developing
tags: [concepts, islamic-geometry, igp, variation, contact-angle, girih, generative, animation]
created: 2026-05-23
updated: 2026-05-23
---

# The Variation Principle in Islamic Geometric Patterns

How **one IGP transforms into another** while the underlying polygon tiling (the "major grid") stays fixed. The single most expressive control is the **contact angle** at which pattern lines leave the edge contact points; sweeping it carries a design through a family of distinct patterns. This is the mechanism behind patterns that visibly *flow into each other*. Extracted from [[Application-Based Principles of Islamic Geometric Patterns (Azari et al. 2023)]]; it operationalises the "different pattern-line rule → different variety" observation on [[Islamic Geometric Patterns and the Polygonal Technique]].

## Contact-angle families

The same tiling, decorated at different contact angles, yields the traditionally-named families:

| Family | Persian | Character |
|---|---|---|
| **Acute** | *Tond* | sharp, many-pointed, spiky stars |
| **Median** | (middle) | balanced star-and-rosette |
| **Obtuse** | *Shol* | blunt, fewer-pointed, open |
| **Two-point** | *Tond-o-Shol* | lines from two symmetric points per edge → short looping strands |

Two orthogonal levers (plus the two-point split δ):

1. **Contact angle θ** — primary. Sweeps acute → median → obtuse on a *fixed* tiling.
2. **The tiling** — a different polygon network gives a different pattern family at the same θ.
3. **δ (two-point split)** — replaces the single edge-midpoint contact point with two symmetric points; the two-point family.

> [!warning] Angle-convention caution
> Family angles are quoted in the literature as **acute 36° / median 72° / obtuse 108°** — but that is the angle *between the two crossing lines*. Kaplan's polygon-in-contact convention measures the contact angle *from the edge* (θ→90° = along the inward normal). These differ; the toolkit fixes on Kaplan's edge convention (`inferStrapwork(tile, contactAngle)`), and the "right" θ for a recognisable acute/median/obtuse look is found per-polygon by eye, not by porting a degree value across conventions.

## Continuous variation — the "flow"

Variation need not be discrete. Bonner/Izadi **continuously vary the contact angle by the spatial position** of the ray's starting point, so a single surface transitions smoothly between pattern families — the exterior of the **Saveh Friday Mosque dome** shows girih tiling flowing between zones, with curvature changing the **number of star points** as it goes (more curvature → more points). Two continuous regimes:

- **Spatial gradient** — θ (or star order) is a function of position → the pattern *flows across* the canvas.
- **Temporal morph** — θ animated over time → the whole pattern *breathes* between acute, median, and obtuse.

## Computable handles

The continuity invariant of the [[Islamic Geometric Patterns and the Polygonal Technique|polygon-in-contact method]] makes variation safe: contact points live on the *shared edge*, so neighbours stay joined as long as they agree on `{contact points, θ, δ}` for that edge. Therefore:

- **θ is a single scalar knob** on the strapwork inference (`toolkit/src/generators/strapwork.ts`) — sweep it for the acute/median/obtuse family.
- **Temporal morph** = animate θ globally over time (one animation idea for the screensaver).
- **Spatial gradient** = θ as a function of position → flow across the surface.
- **Per-cell re-decoration** = hold each shared edge's `{contact points, θ, δ}` fixed and re-route *interior* pairings independently — swap one cell's motif at a time without breaking the lines that cross its boundary. (The major grid stays static; tile clusters change — the user's stated animation model.)
- **Curvature ↔ star order** — in 2D this maps to *which tiling / polygon order* is decorated; ramp it for a flow between fold-symmetries.

## Relation to intricacy

The variation principle changes the *family* of a single-level pattern; **depth** (the dense, multi-scale look) is a separate lever — the **multi-level / two-level girih** construction (underline + main pattern, often self-similar). See [[Application-Based Principles of Islamic Geometric Patterns (Azari et al. 2023)]] §multi-level. Variation and multi-level compose: morph the family *and* add levels.

## Related

[[Islamic Geometric Patterns and the Polygonal Technique]] · [[Application-Based Principles of Islamic Geometric Patterns (Azari et al. 2023)]] · [[Symmetry-Group Pattern Generator]] · [[Symmetry Groups and Tessellation]] · [[tactile-js]] · [[Movement Rhythm and Repetition]]
