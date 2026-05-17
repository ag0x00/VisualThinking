---
address: c-000191
title: Islamic Geometric Patterns and the Polygonal Technique
type: concept
status: developing
tags: [concepts, islamic-geometry, girih, pattern, bonner, polygonal-technique]
created: 2026-05-17
updated: 2026-05-17
---

# Islamic Geometric Patterns and the Polygonal Technique

The **most-developed surface-pattern tradition** in human history: the corpus of **Islamic geometric patterns (IGPs)** spanning ~1,200 years across the Middle East, North Africa, Iberia, Central Asia, and South Asia. Codified in **Jay Bonner's *Islamic Geometric Patterns: Their Historical Development and Traditional Methods of Construction*** (Springer 2017, ~595 pages with a chapter on computer algorithms by Craig Kaplan).¹ Bonner identifies five construction methods, with the **polygonal technique** as the primary historical method.

> [!warning] Cross-cultural validity flag (convention #5)
> This is one of the few non-Western canonical traditions the wiki references explicitly. Most Western design literature treats IGPs as decoration or as a source for Western abstraction (Riley, Escher); the *internal* tradition is mathematically and methodologically distinct from Western tessellation theory ([[Symmetry Groups and Tessellation]]) and was practiced *centuries before* the European mathematical classification. The wiki cites Bonner as the **insider-and-rigorous-scholarly** anchor — Bonner is both architectural-ornamentalist (al-Masjid al-Haram in Mecca expansion design contributions) and unaffiliated scholar.

## Why IGPs matter for the wiki

The Islamic geometric tradition is **the deepest historical case study** of disciplined pattern generation:

- **Long historical record** (8th century to present)
- **Systematic construction methodologies** (not random or intuitive — Bonner: five methods)
- **Mathematical sophistication** that anticipated Western mathematical results (5-fold local symmetry; aperiodicity-like-structure in girih tiles — centuries before Penrose)
- **Operative** at multiple scales (single tile to entire dome interior)
- **Cross-medium**: tile, wood, plaster, stone, metal, manuscript illumination, textile, ceramic

For [[Algorithmic Composition|generative art]] specifically, IGPs are an extraordinarily rich case: rule-systems that produce visually compelling output through controlled combinatorial logic.

## Bonner's five construction methods

Per *Islamic Geometric Patterns* (2017):¹

1. **The polygonal technique** — *the primary historical method*. Behind-the-scenes polygonal tessellations guide the line-design; the polygons are discarded; only the final pattern survives. Most diverse and complex IGPs use this.
2. **The point-joining technique** — strategically-placed points connected by lines.
3. **The grid method** — square or triangular grid underlying simpler patterns.
4. **The extended parallel radii** — radiating lines from a central point.
5. **The compass work** — direct compass-and-straightedge construction.

Bonner's central thesis: **the polygonal technique is the only method capable of explaining the high level of design complexity** — including multi-level patterns and self-similar (fractal) patterns — found in historical IGPs.¹

## The polygonal technique in detail

The polygonal technique works in three stages:

1. **Polygonal tessellation construction**: Lay down a regular or semi-regular tessellation of polygons (often hexagons, squares, triangles, dodecagons, or combinations). This is the *underlay*.
2. **Pattern-line application**: For each polygon, apply a *pattern-line rule* — typically lines drawn from designated points on the polygon's edges, crossing the polygon's interior at specific angles.
3. **Discard the underlay**: Remove the polygon edges; the pattern lines remain. These line-segments connect into the final pattern.

The *same underlay* can produce *very different* patterns depending on the pattern-line rule. Different rules produce different "varieties" of IGP — Bonner catalogs dozens of named varieties.

This is **deeply parameterizable**: (underlay tessellation, pattern-line rule) → pattern. For a generative system, both axes are tractable.

## Famous examples

- **Alhambra (Granada, 14th century)**: extensive tile decoration covering most of the 17 wallpaper groups in addition to IGP-specific designs.
- **Topkapı scroll (15th century Persian)**: manuscript collection of IGP designs with construction lines preserved — major historical source for understanding the method.
- **Darb-e Imam shrine (Isfahan, 1453)**: contains girih-tile patterns with quasiperiodic 10-fold symmetry locally — Lu & Steinhardt 2007 argued this anticipates Penrose tilings by ~500 years (claim is contested but widely-cited).²
- **al-Masjid al-Haram (Mecca, contemporary expansion)** and **al-Masjid an-Nawabi (Medina)** — modern projects to which Bonner contributed ornamental designs.

## Girih tiles (Lu & Steinhardt 2007)

A specific claim about IGPs: **Peter Lu and Paul Steinhardt** (2007 *Science*) argued that Islamic architects developed a **5-tile "girih" system** around 1200 CE that produces *quasiperiodic* patterns — Penrose-like, but in IGP form, centuries before Penrose's 1974 discovery.²

The five girih tiles (per the Lu-Steinhardt reconstruction):
- Regular decagon
- Elongated hexagon (bowtie)
- Rhombus
- Pentagon
- Concave hexagon (bowtie-like)

These five interlock to produce patterns with **10-fold rotational symmetry** locally — which is forbidden in periodic tessellations.

> [!note] Contestation
> The Lu-Steinhardt thesis is **contested**: critics argue that historical IGPs use 5-fold *local* symmetry without being strictly quasiperiodic in the modern mathematical sense, and that the Lu-Steinhardt 5-tile system is *reconstructed* by modern mathematicians rather than directly evidenced in historical texts. The wiki notes this is a *defensible reading* of the historical tradition, not a settled fact.

## Operational logic of IGPs

What makes Islamic patterns *work* aesthetically (per Bonner and other scholars):

- **Star patterns**: 6, 8, 10, 12-fold stars are the most-common motifs; their symmetry organizes the pattern
- **Interlacing strapwork**: lines pass over and under each other, creating woven appearance
- **Multi-level / self-similar patterns**: smaller pattern-figures fit inside larger ones at the same symmetry; some patterns have multiple recursive levels
- **Color is secondary** in most classical IGPs — the geometry carries the work; color was added in tile and ceramic but not generally in the underlying pattern-design

## Computable handles

For a generative system implementing IGPs:

- **Encode the polygonal-underlay as a tessellation**: vertices, edges, dual graph
- **Encode pattern-line rules per polygon-type**: angle + entry-points
- **Apply rule across underlay → composed pattern**
- **Symmetry enforcement**: respect the underlying wallpaper group ([[Symmetry Groups and Tessellation]])
- **Strapwork rendering**: over/under interleaving at line crossings
- **Color application**: optional; can be by tile-region, by line-color, or by both

Craig Kaplan's chapter in Bonner 2017¹ provides direct computer algorithms. Kaplan also has open-source IGP-generation tools at https://cs.uwaterloo.ca/~csk/

This is **one of the categories where a few mature implementations exist** beyond bare npm — kaplan-codebox tools, plus Eric Broug's *Islamic Geometric Patterns* (Thames & Hudson 2008) educational illustrations.

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art** ★ | Rich rule-system tradition; directly transferable to procedural pattern-design |
| **2. Branding** | Brand-pattern systems in Middle Eastern / South Asian / North African markets; growing Western adoption |
| **3. Graphic design** ★ | Editorial, packaging, textile pattern — IGP-derived patterns are mainstream in contemporary design |
| 4. Music-reactive | Less direct; pattern generation as background |

## What working in this tradition requires

For wiki users producing IGP-style work:

- **Don't generate-and-rename** as "Arabic-influenced" without reference; the tradition has internal disciplines worth respecting
- **Cite specific construction methods** (polygonal-technique-based vs naive star-grid) — significant difference
- **Be aware of religious-cultural context**: certain patterns appear in religious architecture; using them in unrelated contexts may misread

## Related

- [[Movement Rhythm and Repetition]] (parent stub) · [[Symmetry Groups and Tessellation]] · [[Aperiodic Tiling and the Hat Monotile]] · [[Op-Art and Cross-Modal Rhythm]] · [[Cultural and Symbolic Iconography]] · [[Non-Western Iconographic Systems]] · [[Multilingual Typography]]

## Sources

1. Bonner, Jay. *Islamic Geometric Patterns: Their Historical Development and Traditional Methods of Construction* (with a chapter on computer algorithms by Craig Kaplan). Springer Nature 2017. https://link.springer.com/book/10.1007/978-1-4419-0217-7
2. Lu, Peter J. and Steinhardt, Paul J. *Decagonal and Quasi-crystalline Tilings in Medieval Islamic Architecture*. Science 315 (5815): 1106-1110, 2007. https://www.science.org/doi/10.1126/science.1135491
3. Broug, Eric. *Islamic Geometric Patterns* (Thames & Hudson 2008) — accessible introduction with construction guides.
4. Topkapı Scroll: Necipoğlu, Gülru. *The Topkapı Scroll: Geometry and Ornament in Islamic Architecture* (Getty Publications 1995).
5. Craig Kaplan's IGP page: https://cs.uwaterloo.ca/~csk/
