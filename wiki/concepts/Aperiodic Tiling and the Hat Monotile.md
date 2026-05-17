---
address: c-000190
title: Aperiodic Tiling and the Hat Monotile
type: concept
status: developing
tags: [concepts, aperiodic, penrose, hat-monotile, tessellation, quasicrystal]
created: 2026-05-17
updated: 2026-05-17
---

# Aperiodic Tiling and the Hat Monotile

The **mathematical and aesthetic** alternative to periodic tessellation ([[Symmetry Groups and Tessellation]]): tilings that cover the plane **without translational symmetry**. The two foundational sets — **Penrose tilings (1974)**, requiring 2 tile-shapes — and the **March 2023 breakthrough: the Hat monotile**, a single tile that aperiodically tiles the plane.¹ The wiki updates the [[Movement Rhythm and Repetition|movement-rhythm catalog]] with the 2023 discovery as a named successor to Penrose.

> [!important] Successor-theory tracking (convention #6)
> The wiki's [[Movement Rhythm and Repetition|catalog stub]] referenced "Penrose tiles" as the aperiodic anchor. **The 2023 Hat monotile discovery (Smith, Myers, Kaplan, Goodman-Strauss) is the named successor**: a single shape that does what Penrose required two for. Plus the **Spectres family** (chiral monotiles, May/June 2023). This is the *biggest mathematics-of-tessellation event since Penrose 1974*.¹

## Periodic vs aperiodic

**Periodic** tilings (the 17 wallpaper groups; [[Symmetry Groups and Tessellation]]) have **translational symmetry**: you can shift the tiling by a fixed vector and superpose it onto itself.

**Aperiodic** tilings cover the plane but have **no translational symmetry**: no shift by any non-zero vector superposes the tiling onto itself. They may have *long-range order* (correlations across the plane) but not periodic repeat.

The intuition: a periodic tiling has a fundamental unit that repeats. An aperiodic tiling has no such unit; every region is locally varied.

## Penrose tilings (1974)

**Roger Penrose** discovered aperiodic tilings using:

- **P1**: a 5-tile set (1974)
- **P2 (kite-and-dart)**: a 2-tile set (1974)
- **P3 (rhomb / thick-and-thin rhombus)**: a 2-tile set (1977) — the most-recognizable form

Penrose tilings have **5-fold rotational symmetry** locally — which is *forbidden* in periodic patterns by the crystallographic restriction theorem. This was their immediate mathematical interest.

In 1984, **Daniel Shechtman** discovered **quasicrystals** — physical materials with Penrose-like aperiodic atomic arrangements. Shechtman was awarded the 2011 Nobel Prize in Chemistry for the discovery (originally controversial, eventually accepted).

Penrose tilings show:

- Local 5-fold symmetry (impossible in periodic patterns)
- Self-similarity under deflation/inflation (substitution rules)
- The "golden ratio" appears in tile-frequency ratios (φ: 1)
- Used heavily in mathematical-art tradition (Escher, Penrose's own work)

## The aperiodic monotile question (~50 year open problem)

After Penrose, the open question: **does a single shape exist that tiles the plane only aperiodically?** Penrose required 2 tiles; was 1 possible? The question was called the **einstein problem** ("ein Stein" = "one stone" in German, double-pun on Albert Einstein).

For ~50 years, no single-tile aperiodic tile was known. Many mathematicians suspected none existed.

## March 2023: The Hat

**David Smith** (a retired print technician and amateur tiling enthusiast in Yorkshire) discovered the Hat tile in November 2022 by hand-experimentation with cut paper.¹ He contacted **Joseph Samuel Myers**, **Craig S. Kaplan**, and **Chaim Goodman-Strauss** to verify. The paper *An aperiodic monotile* appeared on arXiv 20 March 2023.²

**The Hat is**:
- A single 13-sided polygonal shape made by combining 8 kites (where a kite is a hexagon cut along midpoints of edges)
- Tiles the plane *only* aperiodically — no periodic tiling using only the Hat exists
- Requires *both* the Hat and its mirror image (reflected version) to tile

This last point — the Hat needs its mirror — led to follow-up work:

## May-June 2023: The Spectres (chiral monotiles)

The same team (Smith et al.) published a chiral monotile family: tiles that don't need their mirror reflection. *A chiral aperiodic monotile* (May 2023):³

**The Spectres**:
- A family of single shapes (parameterized by a real number)
- Each Spectre tiles the plane aperiodically *without using its mirror*
- True einsteins — no mirror, no second shape

This *completed* the original einstein question: aperiodic monotiles exist, and chiral ones (no mirror needed) also exist.

## Why this matters

For mathematics: the Hat/Spectre discovery closed a major open problem and opened new directions in tile theory, quasicrystal physics, and pattern recognition.

For art and design: a **single-shape aperiodic generator** is operationally simpler than Penrose. You can build a procedural pattern generator that uses only one shape and still produces non-repeating, locally-varied, infinite output.

## Where aperiodic tilings differ aesthetically

Compared to periodic patterns ([[Symmetry Groups and Tessellation]]):

| Property | Periodic | Aperiodic |
|---|---|---|
| Translation symmetry | Yes | No |
| Locally repetitive | Yes | No |
| Long-range order | Yes (predictable) | Yes (statistical) |
| Locally varied | No | Yes |
| 5-fold rotation allowed | No | Yes (Penrose) |
| Single tile possible | Yes (trivially) | Yes (Hat/Spectre — 2023) |
| Aesthetic register | Regular, "designed" | Organic, "natural" |

For [[Music-reactive Visualizers|priority 4]] and [[Algorithmic Composition|generative art]], aperiodic patterns produce **infinite non-repeating** visuals from finite generative rules — exactly what generative art often wants.

## Computable handles

For a generative system using Penrose / Hat tiles:

- **Substitution / inflation rules**: a tile decomposes into smaller tiles by fixed rule; iterate
- **Matching rules**: tiles can be placed only where edges match — enforces aperiodicity
- **Kaplan's algorithms**: Craig Kaplan (one of the Hat-discovery authors) has published extensive computational-tessellation algorithms; see https://cs.uwaterloo.ca/~csk/hat/

Specific implementations:

- **WebGPU compute shader** for Hat-tile placement
- **p5.js / paper.js**: hand-coded substitution rules; ~200 lines for Penrose; similar for Hat
- **`hat-tiling` / community npm packages**: emerging (post-March-2023)

## Generative-art applications

- **Tyler Hobbs** has used Penrose tilings in long-form work
- **Jared Tarbell** uses substitution-based tilings extensively
- **Robert Hodgin** explored Penrose tilings in *Solar* (2018)
- Post-Hat-2023: numerous practitioners published Hat-tile sketches; expect mainstream adoption in 2026-2027

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art** ★ | Single-tile aperiodic generators are an operationally-clean primitive |
| 2. Branding | Some experimental brand work uses Penrose (Quaternio); Hat is too new for established use |
| 3. Graphic design | Pattern design where "non-repeating" aesthetic is the goal |
| 4. Music-reactive | Could drive parametric Hat-tile placement from audio features |

## Related

- [[Movement Rhythm and Repetition]] (parent stub) · [[Symmetry Groups and Tessellation]] · [[Islamic Geometric Patterns and the Polygonal Technique]] · [[Op-Art and Cross-Modal Rhythm]] · [[Algorithmic Composition]] · [[Galanter's Generative Art Framework]]

## Sources

1. *An aperiodic monotile* — Smith, Myers, Kaplan, Goodman-Strauss (March 2023). https://arxiv.org/abs/2303.10798 — and the project page: https://cs.uwaterloo.ca/~csk/hat/
2. *A tip of the hat: celebrating the aperiodic monotile discovery*, Cambridge Faculty of Mathematics. https://www.maths.cam.ac.uk/features/tip-hat-celebrating-aperiodic-monotile
3. *A chiral aperiodic monotile* — Smith, Myers, Kaplan, Goodman-Strauss (May 2023). https://arxiv.org/abs/2305.17743 — Spectres family.
4. *An aperiodic monotile exists!*, The Aperiodical, 2023-03-20. https://aperiodical.com/2023/03/an-aperiodic-monotile-exists/
5. *The Hat and the Spectre*, National Museum of Mathematics. https://momath.org/the-hat/
6. Penrose tilings: Penrose, Roger. *Pentaplexity* (Eureka 1978; reprinted Mathematical Intelligencer 1979).
7. Shechtman quasicrystals: Shechtman et al., Physical Review Letters 1984 (Nobel 2011).
