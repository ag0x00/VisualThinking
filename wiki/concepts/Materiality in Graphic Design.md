---
address: c-000183
title: Materiality in Graphic Design
type: concept
status: developing
tags: [concepts, material, graphic-design, print, branding, skeuomorphism]
created: 2026-05-17
updated: 2026-05-17
---

# Materiality in Graphic Design

The application of **material perception** (per [[Material Perception]]) to **2D design contexts**: paperstock, foil stamping, deboss/emboss, letterpress, varnish, and their digital simulations (skeuomorphism, glassmorphism, neumorphism, Material Design). The wiki's bridge from 3D PBR materials to brand and editorial design (priorities 2 + 3).

## Print materiality

Print typography and graphic design carry **physical material weight** in ways screen design cannot match directly:

| Technique | Description | Cost | Signal |
|---|---|---|---|
| **Paper-stock weight** | Heavier paper (200gsm+) reads as premium | Moderate | Quality |
| **Paper-stock texture** | Uncoated / textured / cotton / mould-made paper | High | Craft / luxury |
| **Foil stamping** | Metallic foil pressed via heated die | High | Luxury / formal |
| **Hot-stamp embossing** | Raised letterforms via heated die | High | Tactile premium |
| **Blind deboss** | Indented design without ink | High | Subtle premium |
| **Letterpress** | Type-impression printing (originally industrial; now boutique craft) | Very high | Craft / artisanal |
| **Spot UV / spot varnish** | Glossy varnish on matte stock for selective shine | Moderate | Contemporary premium |
| **Die-cutting** | Custom shape cutting beyond rectangles | Moderate | Editorial / packaging |
| **Soft-touch lamination** | Velvet-feel coating | Moderate | Luxury packaging |
| **Edge-painting / edge-gilding** | Color or gold on book/card edges | High | Editorial luxury |
| **Risograph / screen-print** | Tactile, slightly-mis-registered, vintage ink | Low-moderate | Indie craft |

Each technique carries cultural signaling that screen design cannot directly emulate. Apple's product packaging, premium magazines (*Apartamento*, *Cereal*, *Real Review*), and luxury brand collateral lean heavily on these.

## Digital simulations of materiality

Print materiality is **physical**; screen design has spent 20 years cycling between **simulating** it and **rejecting** it.

### Skeuomorphism (2007-2013, then revived)

iOS 6 (2007-2013) and Mac OS X heavily used **skeuomorphic** UI:

- Leather-textured notes app
- Wood-grain bookshelves
- Linen background on Game Center
- Felt-texture poker tables
- Embossed buttons with light/shadow gradients

The aim: digital interfaces *signal-via-texture* that they're like physical objects, helping new computer users navigate. Visually rich; tactile-feeling.

### Flat-design backlash (2013-2018)

iOS 7 (2013) and Material Design 1 (2014) initiated the **flat-design** counterswing:

- Pure-color rectangles, no texture
- No gradient, no shadow, no skeuomorphic cue
- Typography-led hierarchy
- Faster to load, easier to develop, cleaner-feeling

Pure flat-design over-corrected — users couldn't tell what was tappable. Subsequent "**material design**" (Google 2014+) re-introduced limited shadow + elevation cues.

### Glassmorphism (2020-2024+)

A specific re-introduction of materiality: **frosted-glass background** for cards / modal overlays:

```css
backdrop-filter: blur(20px) saturate(180%);
background: rgba(255, 255, 255, 0.6);
```

Visually: looks like translucent frosted glass over the underlying content. Implemented via CSS `backdrop-filter` (broadly supported 2022+). Apple's macOS Big Sur (2020) and iOS 16 mainstreamed it.

### Neumorphism (briefly 2020-2021)

Soft-extruded UI elements emerging from the background (low-contrast shadows + highlights). Visually distinctive; widely criticized for accessibility (insufficient contrast); largely abandoned.

### Contemporary post-flat (2024+)

Current practice: **selective materiality**. Most UI is flat or near-flat; specific moments (modal overlays, hero cards, brand-mark areas) get heavy materiality (glass, gradient, glow, neumorphic-light). The shift is *contextual* rather than systemwide.

## Tactile materiality without texture

A counter-intuitive insight: materiality can be **signaled** without literal texture:

- **Generous negative space** ([[Negative Space Techniques|see negative-space techniques]]) → premium reading
- **Restrained color** → expensive reading
- **Detailed typography** ([[Typographic Principles|optical adjustments]]) → craft reading
- **Consistent baseline rhythm** → designed reading
- **Asymmetric / dynamic composition** → editorial reading

Apple's product pages signal premium not via leather textures but via vast negative space + restrained palette + perfectly-cropped photography. The materiality is *implied through quality* rather than *shown through texture*.

## Brand-material strategy

Working brand strategy treats material as part of the identity stack:

| Brand-material element | Examples |
|---|---|
| Primary material (signature) | Apple = brushed aluminum; Tiffany = robin's-egg-blue paperstock; Hermès = orange box / leather |
| Secondary materials | Apple: glass, fabric (HomePod), wood (Watch packaging) |
| Material vocabulary | Allowed / forbidden materials across brand assets |
| Material in retail | Store fixtures echo brand material (Apple wood + glass + slate) |
| Material in packaging | Premium unboxing experience |
| Material in print | Brand letterhead paperstock, business-card weight |

For brand work, **material selection is an explicit early decision** — alongside typography, color, photographic style.

## Cross-cultural caveats

Per convention #5, material signaling is culture-bound:

- **Premium leather** reads differently in vegan-aware vs traditional markets
- **Marble** signals classical-European premium; some markets prefer wood / stone alternatives
- **Gold foil** is universal premium but is too-strong in some markets (Northern Europe), expected in others (Middle East, India for traditional contexts)
- **Risograph** is "indie-craft" in design-aware markets; "low-end print" in markets without the riso-revival context

For global brands: maintain regional material guides; the global single-spec is rare.

## Computable handles

For an LLM-driven design system:

- **Material vocabulary as named tokens**: `--material-primary: aluminum-brushed`; brand-asset rendering picks from constrained vocabulary
- **Glassmorphism CSS recipes**: parametrize `backdrop-filter` blur amount, background alpha, border-color subtlety
- **Skeuomorphic flag**: per-component, opt-in for moments needing materiality
- **Print-spec metadata**: editorial layouts annotate intended paperstock / foil-color / treatment so a print-spec PDF can be generated
- **Material-grading for screen renders**: when 3D rendering for brand work, drive PBR materials ([[PBR Material Parameters]]) from brand-vocabulary token names

## What's missing from the literature

- **Empirical studies** of glassmorphism / skeuomorphism's effect on user comprehension and brand perception are thin
- **Cross-cultural material signaling** is under-researched (much like type-as-voice; see [[Type as Voice]])
- **Hapticity in audio-driven visualizers** (priority 4) — material choice changes "feel" of a visualizer but no empirical literature

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| 1. Generative art | Selective materiality in 2D generative work; 3D inherits from [[PBR Material Parameters]] |
| **2. Branding** ★ | Material is brand signature; primary and secondary material choices are early-stage decisions |
| **3. Graphic design** ★ | Print materiality is the discipline's premium-signaling vocabulary |
| 4. Music-reactive | Material choice changes visualizer feel substantially |

## Related

- [[Materials and Texture]] · [[Material Perception]] · [[PBR Material Parameters]] · [[Procedural and Neural Texture Synthesis]] · [[Negative Space Techniques]] · [[Typographic Principles]] · [[Type as Voice]] · [[Cross-Cultural Color Variation]]

## Sources

1. *Material Design* (Google 2014+). https://m3.material.io/
2. *iOS Human Interface Guidelines* (Apple, various editions). The skeuomorphic→flat→post-flat trajectory.
3. *Glassmorphism* explored in design-publication writing (UX Collective, Smashing, A List Apart) 2020-2024.
4. *The Materiality of Letterpress* — Friedl, Ott, Stein. *Typography: An Encyclopedic Survey of Type Design and Techniques throughout History* (Köln 1998).
5. Practitioner references: Apartamento magazine; Cereal magazine; Real Review for editorial-print materiality.
6. Tiffany blue, Hermès orange — brand-material case studies in *Brand New* (UnderConsideration).
