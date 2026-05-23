---
address: c-000191
title: Islamic Geometric Patterns and the Polygonal Technique
type: concept
status: developing
tags: [concepts, islamic-geometry, girih, pattern, bonner, polygonal-technique]
created: 2026-05-17
updated: 2026-05-20
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
- **Color is secondary** *in line-pattern design* — the geometry carries the work; color was added in tile and ceramic but not generally in the underlying pattern-design. **This does not hold for ceramic tilework** (see invariants below), where color is rigidly governed.

## Ceramic tilework: hard invariants (color + coverage)

These are **laws of the executed ceramic medium**, distinct from the looser conventions of line-pattern design. They are the kind of craft-rule a generator must honour to read as authentic — and the kind that, if absent, makes output look subtly wrong to anyone who knows the tradition. (Added 2026-05-23 after a girih12 generator violated both.)

- **Coverage is total — there are no empty gaps.** Every region of the plane is a glazed tile; the cuerda-seca channel/grout *separates* tiles but never surrounds an *unfilled* hole. "Background showing through" between motifs is illogical in fired tilework. → operationalised by `constructionGrammar` (cells partition the region, no gaps/overlap). A region modelled as `background` rather than as a tile **defeats this check** — model interstitial triangles as tiles, not ground.
- **Color is bound to shape-class, and any within-class variation is symmetric.** A shape class (star / kite / petal / triangle) is either a single constant color, **or** its tiles are colored by an assignment that *respects the pattern's symmetry group* — e.g. alternating kites around a 12-star (a symmetric 2-coloring), never individually/randomly recolored tiles. Random single-tile recoloring reads as a defect, not as an accent. → the principled enforcement is a **color-symmetry-equivariance** check (colors commute with the symmetry group); this is a transferable property (any rosette/wallpaper pattern), so it is a candidate *core* operator, not IGP-specific. **Currently unbuilt — todo.**
- **Accents follow the same symmetry law.** A warm-accent tier (proportion is taste — historically ≲5% of frame, see the Samarkand 7-color chord) is still placed *symmetrically* — a coherent symmetric subset of a shape class, never scattered singletons. Proportion = taste (profile); symmetric placement = law (operator).

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

## Implementation landscape (added 2026-05-18)

Per [[Research - IGP Library Landscape 2026-05-18]] — a 4-parallel-subagent build-phase audit triggered when the toolkit-screensaver brainstorm exposed that the wiki had concept-depth but no tool-depth for IGP generation.

**Top candidates for porting / depending**:

- **[[tactile-js]]** (Craig Kaplan, BSD-3, ~240 stars) — canonical academic library. Covers 81 of 93 isohedral tiling types with edge-shape (J/U/S/I) parameterization. Port the math into the toolkit.
- **[[wallpaper-groups]]** (npm, MIT) — 15 of 17 wallpaper-group affine transform tables. Pragmatic foundation for the repetition layer.
- **[[Alhambra]]** (pierrebai, C++/Qt, GPL-2.0) — niche for integration (wrong language, viral license), first-class for math borrowing: port `infer.h` (Hankin/Kaplan polygon-in-contact), `rosette.h` (Lee 1995 rosette for 8/12-fold local motifs), `inflation_tiling.h` (Lu-Steinhardt-style substitution) from Kaplan's Bridges 2000 paper (algorithms predate the GPL code; legally clean route).
- **[[Alzulejo]]** (npm, MIT) — niche; lift two algorithms verbatim: `polygon.svelte.ts` (Hankin contact-angle, ~64 LOC) and `rosette.svelte.ts` (PlanarGraph class for "discard underlay, keep line network", ~384 LOC).
- **[[PlotBoilerplate]]** (IkarosKappler, npm, MIT, TS, active 2026) — modern geometry substrate; pending follow-up evaluation as a renderer base.
- **Michael Fares — SVG IGP tessellation app (d3.js + React)** (user-surfaced 2026-05-20) — a step-by-step *how-to with working code* for SVG tessellation **generation mechanics** (not aesthetics). Post: https://michael-fares.medium.com/how-i-made-an-svg-islamic-tessellation-coloring-app-with-d3-js-and-react-d0cd2155d3ab · code: https://github.com/Michael-Fares/tiles . *Stashed / unvetted* — evaluate license, d3-dependency fit against the "depend on nothing" recommendation, and polygonal-technique fidelity before adopting; confirm the production medium is actually IGP first (the eventual aesthetic target may differ). See [[Research - IGP Library Landscape 2026-05-18]] §Later additions.

**Significant gaps — no library covers**:

- Cuerda-seca line rendering (cream channel between glaze cells with double-stroke compositing)
- Procedural glaze imperfections (per-cell noise gradient, edge bleed, micro-rotation jitter, soft Lambertian shading)
- OKLCH palette tuned to historical chord (e.g., Samarkand cobalt-turquoise-saffron — see [[OKLCH Pair-Relation Classifier]] c-000211)
- Animation timeline on symmetry-group orbits
- Bonner's 5 girih tiles as first-class primitives with semantic decoration overlays — no maintained JS implementation exists
- Quasi-crystalline self-similar inflation (Lu-Steinhardt Fig. 3 D/E)

**Recommendation**: port the math, depend on nothing. Specifically — extract `tactile-js`'s isohedral classification (BSD-3), `wallpaper-groups`'s transform tables (MIT), Alzulejo's polygon-in-contact + planar-graph (MIT), Lee 1995 rosette and Lu-Steinhardt inflation from the Kaplan / Lu-Steinhardt papers. Use Alhambra's `.tiling` data files (reverse-engineered to JSON) as visual-regression test oracle.

**Workflow lessons surfaced by this audit** (see [[Research - IGP Library Landscape 2026-05-18]] for the full retrospective): `wiki_orient` under-surfaces named-tradition terms (workaround: pair with `wiki_search` keyword); the IGP page was research-depth not implementation-depth (this section addresses that); npm-search audit must run before designing, not just before cataloging.

## Aesthetic profile (operator binding)

Added 2026-05-20. This page does **not** carry a bespoke "is this pattern good?" metric. Per the [[Wiki Methodology]] operational-readiness standard (cross-domain composition), its **Evaluate** capability is *composed* from general operators in `toolkit/`, parameterised for this medium by a profile. Operators measure (target-free); the profile sets the targets.

Two media, two profiles. **Strapwork** (the lines as visible art) → `toolkit/src/profiles/timurid-igp.ts`; **Tilework** (the filled glaze cells) → `toolkit/src/profiles/timurid-tiling.ts`. 7 operators total; each binds to the general wiki concept it operationalises:

| Operator | binds concept | medium | what it captures |
|---|---|---|---|
| `symmetry` | [[Symmetry Groups and Tessellation]] | both | continuous group fidelity (imperfection scores as a tradeoff) |
| `complexity` | [[Visual Entropy]] · [[Fractal Dimension]] · [[Berlyne's Arousal-Potential Theory]] | strapwork | organized richness of the line network (inverted-U band) |
| `lineContinuity` | [[The Gestalt Principles of Visual Perception]] (good continuation) | strapwork | lines connect end-to-end + pass through junctions |
| `constructionGrammar` | [[Aperiodic Tiling and the Hat Monotile]] · [[Symmetry Groups and Tessellation]] | tilework | cells partition the region (no gaps/overlap) |
| `tileComplexity` | [[Berlyne's Arousal-Potential Theory]] | tilework | cell density × glaze-colour-usage variety |
| `cuerdaSeca` | [[Material Perception]] · [[Materiality in Graphic Design]] | tilework | the cream channels are complete + uniform width |
| `colorChord` | [[OKLCH]] · [[Arnheim's Color Syntax]] | both | the Samarkand turquoise→cobalt blue chord |

The composer (`toolkit/src/compose.ts`) runs a profile's operators against a render-plan → composite score + ranked fixes (axis + direction + detail). Validated by deterministic acceptance tests: a good pattern outranks **8 deliberate failures** (broken-symmetry, over/under-dense, disconnected lines, wrong-chord; overlapping/gappy cells, uneven channels, monotone), each isolating its axis. The scorecard gallery (`npm run gallery`) renders all of them with scores. Spec: `docs/superpowers/specs/2026-05-20-operator-composition-slice-design.md`.

**Still open:** Perceive remains thin (the *why* of IGP's appeal — infinite/divine connotation, fine detail reading as organic — is not yet operationalised). And the loop is open-ended: the `fixes` are not yet wired back into the generators (the `improve()` step is the next build).

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
