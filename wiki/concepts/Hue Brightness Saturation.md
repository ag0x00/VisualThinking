---
title: Hue, Brightness, Saturation
type: concept
status: developing
tags: [concept, color, fundamentals, programmability]
created: 2026-05-17
address: c-000059
sources: ["[[Arnheim - Art and Visual Perception]]"]
confidence: high
---

# Hue, Brightness, Saturation

The three perceptual dimensions of color. Any color experience can be located by three independent quantities — what Arnheim (Chapter VII) and the entire perceptual-color tradition call **hue**, **brightness**, and **saturation**. Modern color spaces (HSL, HSB, OKLCH, HCT, Munsell) are all instances of this three-axis decomposition.

## The three axes

### Hue
The location around the color circle: red, yellow, green, blue, etc. Hue is the dimension on which physical wavelength most directly maps (~575 nm = yellow, ~475 nm = blue), although the **perceived** hue depends on context.

Number of distinguishable hues in the visible spectrum: ~**160** (Chandler's figure, cited by Arnheim). With pigments and mixtures: ~150.

Arnheim treats hue as built from **three or four fundamentals**:
- **Three-fundamental view** (Young-Helmholtz, RYB pigment, RGB displays): all hues mixable from red, yellow, blue (or red, green, blue for additive light).
- **Four-fundamental view** (Hering's opponent process, Goethe): yellow, blue, red, green — with red↔green and yellow↔blue as opponent pairs. *Modern color science (CIELAB, OKLCH) uses opponent-process axes.* See [[OKLCH]].

The question of whether **green** is a fundamental or a mix (yellow + blue) is genuinely unresolved perceptually; Arnheim ducks the answer and uses both 3- and 4-fundamental formulations as convenient.

### Brightness (Value, Lightness)
The light-to-dark axis. Independent of hue: a "dark blue" and a "light yellow" share their hue identity but differ in this dimension.

Number of distinguishable grays: ~**200** (Chandler).

Different color spaces use different metrics:
- **HSL/HSV** "Lightness/Value" — not perceptually uniform.
- **CIELAB** $L^*$ — better; based on cube-root of luminance ratio.
- **OKLCH** $L$ — best as of 2026; calibrated against human perception.

Arnheim notes the **studio term "value"** (from French *valeur*) is often used for brightness, but in his book "value" is reserved for the **general perceptual property** (any of the three dimensions can have "values"), not narrowly brightness.

### Saturation (Chroma, Purity)
How "pure" or "intense" a color is, vs how mixed with gray. A spectral red is high-saturation; a brick brown is the same hue at lower saturation.

A color is **maximally saturated** when produced by a single wavelength (a "completely pure tone" by analogy to music). Mixing wavelengths reduces saturation. **Complementaries** mixed equally cancel to **achromatic gray** (zero saturation).

Number of distinguishable saturation steps at the most favorable brightness: ~**20** (Chandler).

The **achievable saturation depends on brightness** — saturation peaks at *medium* brightness; pure white and pure black admit only zero saturation. This is why color solids (Munsell tree, OKLCH gamut) are not cubes but irregular volumes.

## Total distinguishable colors

Chandler's estimate (cited in Arnheim): ~150 hues × ~200 brightness × up to ~20 saturation per cell ≈ **a few hundred thousand to a few million** distinguishable colors. The whole 24-bit sRGB gamut (~16M) thus exceeds the eye's discrimination, but only in regions of high brightness × high saturation × high hue resolution. Most "useful" color tokens are far fewer.

## The expressive coupling

Arnheim makes a point often missed in color-theory pedagogy:

> "The expression of color in general and its temperature in particular are influenced not only by hue but also by brightness and saturation. The expressive values of hues can be compared only when the two other factors are kept constant."

This means: comparing "red is warm" vs "blue is cold" is **only meaningful at equal brightness and saturation**. A pure red and a pure yellow differ greatly in saturation *and* brightness in the spectrum — yellow is much brighter, far less saturated than red in available pigment. To know whether red is "warmer" than yellow you need to equalize the other two axes.

Practical consequence: Goethe's and Kandinsky's color-emotion claims are *valid only within the brightness/saturation envelope they observed*, and don't generalize.

## Programmable implications

1. **Always work in a perceptual space.** OKLCH (2020+) is the modern default. HSL/HSV are **not** perceptually uniform — equal moves in $H$ don't produce equally-perceived hue shifts.
2. **Decouple the axes.** When generating a palette: pick a hue distribution first, then assign $L$ values that establish reading order, then assign $C$ values that establish dominance. Mixing all three at once produces accidental clashes.
3. **Equal-X axis for comparison.** When asking "is this warmer?", fix $L$ and $C$. When asking "is this more readable?", fix $C$ and $H$ and vary $L$. When asking "is this more saturated?", fix $L$ and $H$.
4. **For real-time visualizers** (priority 4): mapping audio amplitude to $L$ (brightness) gives a *strong, direct* response without changing the color identity. Mapping to $H$ produces hue cycling. Mapping to $C$ pulses saturation. All three are useful at different audio bands.
5. **For branding** (priority 2): a brand's "primary color" should be specified as a 3-tuple in a perceptual space (e.g., `oklch(0.55 0.18 245)`), not as a hex code. Hex hides the perceptual move; OKLCH makes derivative tints/shades/accents formulaic.

## Caveats and limits

- **Saturation is not the same as chroma** in CIE terminology (chroma is fixed; saturation is chroma normalized by lightness). For practical purposes in OKLCH/Munsell terms they're interchangeable; for technical color-science work consult primary sources.
- The **3-axis decomposition is not the full story.** Display gamut limits cause "unreachable" colors (high-saturation cyans in print). Adaptation, surround, and metameric matches break naive axis interpretations. For high-stakes work (color management, accessibility), use full color-management pipelines (ICC profiles, [[CIEDE2000]]).
- **For accessibility** ([[WCAG Contrast Ratios]]), brightness/contrast is the *only* axis that matters — hue and saturation differences do not satisfy contrast requirements.

## Related pages

[[OKLCH]] · [[The Munsell and CIELAB Color Systems]] · [[CIEDE2000]] · [[Color Harmony]] · [[Arnheim's Color Syntax]] · [[Complementary Colors]] · [[Warm and Cool Colors]] · [[WCAG Contrast Ratios]]

## Source

Arnheim, *Art and Visual Perception* (1954/1974), Chapter VII "Color," pp. 339–342. Estimates from Albert C. Chandler, *Beauty and Human Nature* (1934).
