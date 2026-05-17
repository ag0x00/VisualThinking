---
address: c-000189
title: Symmetry Groups and Tessellation
type: concept
status: developing
tags: [concepts, symmetry, tessellation, wallpaper-groups, math, pattern]
created: 2026-05-17
updated: 2026-05-17
---

# Symmetry Groups and Tessellation

The **mathematical exhaustive enumeration** of 2D periodic patterns: the **17 wallpaper groups**, **7 frieze groups**, and **5 Bravais lattices** classify *every possible* repeating pattern in the plane. Founded by **Evgraf Fedorov (1891)** and developed across crystallography. The deepest mathematical anchor for [[Movement Rhythm and Repetition|repeated-pattern design]]. Aperiodic alternatives (Penrose, Hat) are covered in [[Aperiodic Tiling and the Hat Monotile]].

## The four symmetry operations

Every 2D pattern's symmetry is composed of four primitive operations:

1. **Translation** — shift by a constant vector
2. **Rotation** — by a fixed angle around a fixed point (in periodic patterns: 2, 3, 4, or 6-fold only — the "crystallographic restriction")
3. **Reflection** — across a fixed line (mirror axis)
4. **Glide reflection** — reflection across a line + translation parallel to that line

**Crystallographic restriction theorem**: 2D periodic patterns can have *only* 2-, 3-, 4-, or 6-fold rotational symmetry. 5-fold (pentagonal) cannot tile the plane periodically — this is why Penrose tilings are *aperiodic* (and why quasicrystals were thought impossible until 1984).

## The 7 frieze groups (1D periodic patterns)

Patterns that repeat along **one** axis. There are exactly **7** equivalence classes:

| Frieze group | Crystallographic | Description |
|---|---|---|
| p1 | hop | Pure translation; no symmetry beyond repeat |
| p11g | step | Translation + glide reflection |
| p1m1 | sidle | Translation + vertical mirror axes |
| p2 | spinning hop | Translation + 2-fold rotation |
| p2mg | spinning sidle | Combination |
| p2mm | spinning jump | Translation + vertical + horizontal mirrors |
| p11m | jump | Translation + horizontal mirror axis |

The "hop / step / sidle / spin / jump" mnemonic names (Conway et al.) describe the *generated motion* of repeated copies — useful for design intuition.

## The 17 wallpaper groups (2D periodic patterns)

Patterns that repeat along **two independent** axes. There are exactly **17** equivalence classes — Fedorov 1891 (independently rediscovered by Pólya 1924 and others).¹

The standard notation uses International (Hermann-Mauguin) symbols:

```
p1, p2, pm, pg, cm, pmm, pmg, pgg, cmm,
p4, p4m, p4g,
p3, p3m1, p31m,
p6, p6m
```

Distribution by rotational symmetry:

| Rotation order | Group count | Examples |
|---|---|---|
| 1 (none) | 5 | p1 (pure translation); p2 (180° rotation); etc. |
| 2 | (included above) | |
| 3 (3-fold) | 3 | p3, p3m1, p31m |
| 4 (4-fold) | 3 | p4, p4m, p4g |
| 6 (6-fold) | 2 | p6, p6m |

**The 17 are exhaustive.** Any periodic 2D pattern *must* fit one of them. This is a *deep* mathematical fact, not a survey result.

## The 5 Bravais lattices

The underlying *translation-only* lattices (forgetting rotation/reflection/glide) come in **5** types:

1. **Oblique** (parallelogram with no constraints)
2. **Rectangular** (right angles, unequal sides)
3. **Centered rectangular / rhombic** (rectangular with body-centered point)
4. **Square** (equal sides at right angles)
5. **Hexagonal** (60-120 angles, equal sides)

Every wallpaper group sits on one of these. The 5-lattice × symmetry-operation count gives the 17 groups (after de-duplication).

## Historical and cultural context

Wallpaper-group patterns appear in essentially every culture's ornamental tradition. **Owen Jones's *Grammar of Ornament* (1856)** documents wallpaper-group patterns across Egyptian, Greek, Moorish, Celtic, Chinese, Indian, Polynesian, Mesoamerican, and Northern European decorative traditions — *centuries before* the mathematical classification.²

The **Alhambra in Granada** (14th century) contains examples of all 17 wallpaper groups in its decoration. Coxeter and others have used the Alhambra as the canonical pedagogical site.

The **Islamic geometric tradition** ([[Islamic Geometric Patterns and the Polygonal Technique|see page]]) is the most-developed historical practice; many Islamic patterns are *aperiodic* in addition to the 17 groups.

## What the 17 groups don't classify

- **Aperiodic patterns**: no translation symmetry by definition. Penrose tilings, Hat monotile. See [[Aperiodic Tiling and the Hat Monotile]].
- **3D periodic patterns**: the analogue is the **230 space groups** (crystallography).
- **Non-Euclidean symmetries**: hyperbolic-plane symmetries are richer; Escher's *Circle Limit* series explored these.
- **Quasiperiodic**: long-range order without translation — see Penrose / quasicrystal pages.
- **Stochastic patterns**: random with statistical regularity — see [[Procedural and Neural Texture Synthesis]].

## Computable handles

For [[three.js]] / [[WebGPU]] / [[p5.js]] generators:

- **Encode wallpaper group as a parameter**: 17 discrete choices. Each constrains how a tile-unit repeats.
- **Tile-unit + replication rule**: define a single fundamental-domain tile; replicate per the group's operations. This is the **fundamental-domain pattern** — operationally cheap.
- **Symmetry detection**: given an image, classify which group it belongs to. Useful for [[Style as Rule-System|style recognition]] of pattern-based work.

Existing libraries:

- **`p5.geometry`** plugins for symmetry-based drawing (small ecosystem)
- **WebGPU**: implement symmetry-aware fragment shaders that apply the group operations
- **`isometric` family** of npm libraries (limited coverage of full 17 groups)
- For full mathematical implementation, **Sage / Mathematica** have built-in wallpaper-group machinery

Most production work hand-codes the specific group needed rather than using a general library — same pattern as [[PCG Toolkit|PCG]] (npm coverage is thin).

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art** ★ | Most tile-based / pattern-based generative art uses one of these groups |
| **2. Branding** ★ | Pattern-as-identity (Marimekko, Liberty, Burberry tartan, Louis Vuitton monogram) — almost always one of the 17 |
| **3. Graphic design** ★ | Wallpaper, textile, packaging, editorial backgrounds |
| 4. Music-reactive | Less direct; tile-generation as visualizer element |

## Related

- [[Movement Rhythm and Repetition]] (parent stub) · [[Aperiodic Tiling and the Hat Monotile]] · [[Islamic Geometric Patterns and the Polygonal Technique]] · [[Op-Art and Cross-Modal Rhythm]] · [[Compositional Grids]] · [[Dynamic Symmetry]] · [[Cellular Automata and Reaction-Diffusion]]

## Sources

1. Fedorov, Evgraf S. *Symmetry of regular systems of figures* (1891). Independent rediscoveries: Pólya 1924, Niggli 1924.
2. Jones, Owen. *The Grammar of Ornament* (1856). https://archive.org/details/grammarofornamen00jone
3. Conway, John H. and Burgiel, Heidi and Goodman-Strauss, Chaim. *The Symmetries of Things* (A K Peters 2008) — modern reference; orbifold notation alternative to Hermann-Mauguin.
4. Coxeter, H. S. M. *Introduction to Geometry*, 2nd ed. (Wiley 1969).
5. Schattschneider, Doris. *The Plane Symmetry Groups: Their Recognition and Notation*. American Mathematical Monthly 85, 1978 — the standard reference for recognizing wallpaper groups.
6. Alhambra wallpaper-group survey: Grünbaum & Shephard, *Tilings and Patterns* (Freeman 1987).
