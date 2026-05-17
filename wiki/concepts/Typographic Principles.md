---
address: c-000168
title: Typographic Principles
type: concept
status: developing
tags: [concepts, typography, bringhurst, principles, design]
created: 2026-05-17
updated: 2026-05-17
---

# Typographic Principles

The **classical-to-contemporary corpus of typographic conventions** for setting text: measure (line length), leading (line spacing), tracking, kerning, hyphenation, optical adjustments, modular scale. The most-cited reference is **Robert Bringhurst's *The Elements of Typographic Style*** (1992, 4th ed. 2012), but the principles themselves predate Bringhurst by centuries (Bodoni, Updike, Goudy, Morison, Tschichold) and have non-trivial contemporary critiques.

> [!note] One canonical reference among several
> Bringhurst's *Elements* is often called "the typographer's bible" but is **not uncontested**. Sam Potts's *A Refutation of The Elements of Typographic Style* (2014) argues ETS glosses over the actual font-selection process and erases the editorial labor (copyediting, proofreading) that production typography requires.¹ Bringhurst's framing is **Latin-script-classical-anchored**; the principles need explicit adjustment for [[Multilingual Typography|CJK / RTL / non-Latin]] work.

## Core principles (Bringhurst lineage)

### Measure (line length)

Optimal line length: **60-75 characters per line** for body text in Latin scripts; **45 characters** as the minimum readable; **90 characters** as the maximum. Eye scans at ~250 wpm in this range; faster/slower outside.

In CSS: `max-width: 65ch;` is the cleanest contemporary expression.

### Leading (line height)

Body text: **leading = 1.2–1.45× the font size** for most Latin sans-serifs and serifs. Body text below 1.2× cramps the eye; above 1.6× breaks the column's reading rhythm. Headings can leading-tighter (1.0–1.15×).

In CSS: `line-height: 1.5;` is a near-universal sensible default.

### The modular scale

A **musical-interval-derived ratio** applied to the type scale, producing harmonious size relationships across hierarchy levels:

| Ratio | Name | Use case |
|---|---|---|
| 1.067 | Minor second | Very subtle hierarchy |
| 1.125 | Major second | Dense editorial |
| 1.2 | Minor third | Standard UI |
| 1.25 | Major third | Web body / display split |
| 1.333 | Perfect fourth | Pronounced hierarchy |
| 1.414 | Augmented fourth (√2) | Print paper-size derived |
| 1.5 | Perfect fifth | Punchy poster work |
| 1.618 | Golden ratio (φ) | Classical proportions |

Tim Brown's *Modular Scale* tool (2010+) is the contemporary anchor; the principle is in Tschichold (1928) and Bringhurst (1992). For CSS, the modern pattern is `clamp(min, fluid, max)` for responsive type scales.

### Optical adjustments

- **O is drawn taller than H** by ~3-5% — equal-height geometry reads as O-shorter.
- **Hanging punctuation**: quotation marks and commas project slightly into margins for optical alignment.
- **First-line indent** in continuous prose: ~1em; in typeset prose, smaller than naïve geometry suggests.
- **Optical kerning** vs metric kerning: optical adjusts inter-letter spacing by *visual* not *programmed* metrics — increasingly automated in OpenType.

### Type pairing

Bringhurst's classical recommendation: **one serif + one sans-serif, contrasting in personality** (humanist sans + transitional serif, e.g.). Avoid same-but-slightly-different pairings. Modern web practice often runs **single-typeface variable-font systems** instead (one family covers display + body + UI).

### Vertical rhythm

Body text aligns to a **baseline grid** with line-height matching grid increments. In CSS: combination of `line-height` and consistent `margin-bottom` for paragraphs/headings. Strict baseline rhythm is contested in web practice (CSS Layout Lapse problems), but the **principle** of consistent vertical spacing is universal.

## What's contested

1. **Sam Potts critique** (2014): ETS gives surface-level prescription but skips the *actual decision-making process* of typography. Bringhurst describes typography as if font-selection is a self-evident reflection of content, but it's an iterative craft involving brand voice, target audience, production constraints, and budget. Editors, copyeditors, proofreaders — entirely absent from ETS — are 50%+ of real typographic labor.¹
2. **Latin-script bias**: Bringhurst's principles assume Latin script throughout. Optical adjustments differ in Arabic (which has connected letterforms), Hindi (with the *shirorekha* line), CJK (with character-grid placement). See [[Multilingual Typography]].
3. **Print-anchored conventions**: measure of 60-75 chars derives from print column widths; the web's flexibility makes this a softer guideline. Mobile-first design routinely violates the measure rule out of necessity.
4. **Variable fonts changed the type-pairing game**. Bringhurst's "two contrasting fonts" assumed static typeface families. A variable-font family with weight + width + slant + grade axes can do the job of 6-10 traditional typefaces, eliminating the pairing problem. See [[Variable Fonts and Web Typography]].

## Successor / contemporary additions

- **Variable fonts (2016+)**: weight, width, slant, optical-size, grade axes packed into single files. See [[Variable Fonts and Web Typography]].
- **OpenType features at scale**: ligatures, alternates, stylistic sets — addressable via CSS `font-feature-settings` and `font-variant-*`.
- **Fluid type scales** (clamp-based): `font-size: clamp(1rem, 1.5vw + 0.5rem, 1.5rem);` — responsive sizing that respects modular-scale ratios across viewports.
- **Design-token type systems**: encode typography decisions (family, scale, leading, tracking) as named constants. See [[Swiss Grid System]] discussion of design tokens.

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **2. Branding** | Body-typography decisions are brand-defining (Apple's San Francisco, Stripe's custom). |
| **3. Graphic design** ★ | Direct application — this is *the* working corpus. |
| 1. Generative art | Generators that output typography need these principles for legible reads. |
| 4. Music-reactive | Less direct; kinetic-typography pages may use modular-scale animations. |

## Related

- [[Visual Hierarchy and Typography]] · [[Swiss Grid System]] · [[Variable Fonts and Web Typography]] · [[Multilingual Typography]] · [[Type as Voice]] · [[Kinetic and Generative Typography]]

## Sources

1. Potts, Sam. *A Refutation of The Elements of Typographic Style* (2014). https://medium.com/re-form/a-refutation-of-the-elements-of-typographic-style-3b18c07977f3
2. Bringhurst, Robert. *The Elements of Typographic Style*, 4th ed. Hartley & Marks, 2012.
3. Brown, Tim. *Modular Scale* — https://www.modularscale.com/
4. Lupton, Ellen. *Thinking with Type*, 2nd ed. Princeton Architectural Press, 2010.
5. Tschichold, Jan. *Die neue Typographie* (1928).
