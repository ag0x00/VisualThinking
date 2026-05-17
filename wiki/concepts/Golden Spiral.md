---
title: Golden Spiral
type: concept
aliases: [golden ratio, phi spiral, Fibonacci spiral, whirling rectangles]
tags: [concept, composition, geometry, math]
status: developing
created: 2026-05-15
updated: 2026-05-16
---

# Golden Spiral

> A logarithmic spiral whose growth factor per quarter-turn is the golden ratio $\phi = (1 + \sqrt{5})/2 \approx 1.618\ldots$. Constructed by inscribing quarter-circle arcs in the squares of nested golden rectangles (the "whirling rectangles" construction of [[Dynamic Symmetry]]) (Source: [[Public Seminar - Dynamic Symmetry]]).

## The math

A golden rectangle with sides $\phi : 1$ has a reciprocal — also golden — that is the largest similar rectangle that fits in the original after a square is removed. Iterate, and the diagonals of successive reciprocals form a logarithmic spiral with polar equation
$$r(\theta) = a \cdot e^{b\theta}, \quad b = \frac{\ln \phi}{\pi/2}$$
i.e., the radius grows by a factor of $\phi$ for every quarter-turn.

The **Fibonacci spiral** is the visually-similar but mathematically-distinct construction using squares of Fibonacci-sequence side lengths $(1, 1, 2, 3, 5, 8, 13, \ldots)$. The two converge as the sequence progresses because $F_{n+1}/F_n \to \phi$, but only the limit is the golden spiral.

## The retrofit problem

The seed of this wiki (`Wiki Seed.md`) notes that "how often classical paintings *actually* follow the golden spiral vs. how often it's been retrofitted by post-hoc analysis" is an open empirical question. The honest answer from current scholarship is: **mostly retrofitted, with very few documented intentional uses.** (Sources: [[PetaPixel - True Photographic History]]; Mario Livio, *The Golden Ratio: The Story of Phi*, 2002)

The PetaPixel investigation reproduced a particularly damning illustration: a Cartier-Bresson photograph (*Hyères, France*, 1932) overlaid with a Golden Spiral as if HCB had composed by it — and a more egregious overlay on his *Calle Cuauhtémoctzin, Mexico City* (1934). Cartier-Bresson explicitly **argued against** any schema-based composition in *The Decisive Moment* (1952):

> "Any geometrical analysis, any reducing of the picture to a schema, can be done only … *after* the photograph has been taken, developed, and printed — and then it can be used only for a post-mortem examination of the picture. I hope we will never see the day when photo shops sell little schema grills to clamp onto our viewfinders; and the Golden Rule will never be found etched on our ground glass." (Source: [[PetaPixel - True Photographic History]])

This is the kind of cherry-picking that gives the golden spiral its inflated reputation. **The math is real. The empirical case for it in art is mostly wishful.**

## Where it legitimately appears

A short list of *intentional* uses:

- **Jay Hambidge's Dynamic Symmetry curriculum** (1920s), where the whirling-rectangles construction was explicitly taught at Parsons and the New School (Source: [[Public Seminar - Dynamic Symmetry]]).
- **Le Corbusier's Modulor** (1948, 1955), a body-proportions-based architectural scale built on golden-ratio progressions.
- Logo design and typography of a few deliberate practitioners (graphic-design adoption is widespread but not always intentional in the strong sense).

It also appears in **biology** (sunflower spirals, nautilus shells, growth patterns described by D'Arcy Wentworth Thompson). Whether biological prevalence justifies aesthetic prevalence is a separate philosophical claim.

## Programmable form

```
golden_spiral(w, h, origin, orientation) → {
  pole:   (x, y),                  # the spiral's eye / focal point
  curve:  parametric_function(θ),  # r = a·e^(bθ)
  boxes:  [rectangle, ...]         # the nested whirling rectangles
}
```

For a generative system: use the pole as a focal coordinate, use the curve as a *suggested* eye path. For an evaluation system: it's worth caution — *fitting* a spiral to almost any image is so flexible that significant fit doesn't prove intent. Use sparingly.

## Why it matters for this vault

The Golden Spiral is **a useful generative template and a misleading evaluation template**. It deserves a wiki page because:

1. The construction is mathematically exact and trivial to encode.
2. Its history is a case study in **how aesthetic claims get retrofitted into apparent rigor** — directly relevant to anyone training an LLM to evaluate art, who must distinguish real composition signal from after-the-fact pattern-matching.
3. It's *the* canonical example of [[Compositional Grids]] mis-applied as critique rather than as design.

## To research

- Mario Livio's *The Golden Ratio: The Story of Phi, the World's Most Astonishing Number* (Broadway Books, 2002) — directly. The book is the modern skeptical canon on $\phi$-in-art claims.
- Direct empirical study: take 100 random classical compositions, score golden-spiral fit, and compare against 100 random *modern* compositions. If the rate is similar, the rule is meaningless.
- Le Corbusier's *Modulor* as a legitimately intentional φ-based system in architecture.

## Related
[[Dynamic Symmetry]] · [[Compositional Grids]] · [[Rule of Thirds]] · [[The Gestalt Principles of Visual Perception]] · [[Public Seminar - Dynamic Symmetry]] · [[PetaPixel - True Photographic History]]
