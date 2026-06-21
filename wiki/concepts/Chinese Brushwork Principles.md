---
title: Chinese Brushwork Principles
type: concept
status: developing
tags: [concept, generative-art, ink, brushwork, sumi-e, calligraphy, gesture]
address: c-000243
created: 2026-06-21
sources: ["[[Research - Ink and Watercolor Simulation on Paper]]"]
confidence: medium
---

# Chinese Brushwork Principles

**One-line:** The craft invariants of Chinese ink brushwork (筆法) — what makes a mark read as a
*confident brushstroke* rather than a blob or a blur. Filed 2026-06-21 to close a gap: the wiki had
the **composition** ([[Ma and Yohaku no Bi]]) and **gesture** ([[Organic vs Mechanical Motion]],
[[Directed Tension]]) layers but nothing on the brush itself, so the ink screensaver improvised it.

> [!note] Where this composes from
> This page is the **domain binding**; the transferable operators live elsewhere. Gesture =
> [[Organic vs Mechanical Motion]] + [[Directed Tension]]; composition = [[Ma and Yohaku no Bi]] /
> [[Negative Space Techniques]]; the paper medium = [[Lattice Boltzmann Method for Ink Dispersion]].
> This page sets the *targets*; those set the *measures*. (Per the toolkit boundary in CLAUDE.md.)

## The five load-bearing invariants

1. **Three-phase stroke — 起笔 / 行笔 / 收笔** (enter → move → exit). A complete stroke is not a
   swept dot: it has a deliberate **entry** (often 藏锋 *hidden-tip*: a brief reverse-press that
   buries the tip, giving a rounded, weighted start), a **modulated body** (pressure rises/falls as
   the brush travels), and a deliberate **exit** — either a **taper to a point** (lift-off) or a
   pressed **hook** (收笔). The exit must *lift fast*, or the tail blunts.
2. **Bone method — 骨法用笔** (Xie He's second of the [[Six Principles of Chinese Painting|Six
   Principles]], 谢赫六法). The stroke has a structural **spine** — drawn with confident, continuous
   pressure; brushwork is read as *character/personality*, the link to calligraphy. Timid, uniform,
   wandering lines fail the bone method.
3. **Centre-tip vs side-tip — 中锋 / 侧锋.** Centre-tip (brush vertical, tip in the middle of the
   stroke) → a **round, even, boned line**. Side-tip (brush angled, tip at one edge) → a **broad,
   flat, textured sweep**. A painting alternates them.
4. **Dry-brush / flying-white — 飛白.** At speed or low ink-load the bristles split and the paper
   tooth shows through as streaks *parallel to travel*. The signature of energy and depletion.
5. **Five ink tones — 墨分五色** ("ink divides into five colours": 焦/濃/重/淡/清, burnt → thick →
   heavy → light → clear). Tonal range *within pure black* is the depth of the medium; a sumi
   painting ranges from saturated black to the palest dilute wash, often within one breath.

## Two registers (the steering axis)
- **工筆 gongbi** — controlled, fine, even outline. Clean spines, minimal bleed.
- **寫意 xieyi** — spontaneous, expressive, "idea-writing"; splashed ink (cf. Sesshū's *Haboku*).
  Wild bleed, strong flying-white, dramatic tone. *The screensaver currently sits here.*

## Build → how to generate it (used by `screensaver/ink-metal/`)
| Invariant | Concrete knob |
|---|---|
| three-phase | pressure profile with an entry accent + modulated body + fast-lift exit (taper or hook); **ease-in** draw-speed so the brush dwells at the start and lifts cleanly |
| bone method | a confident centerline (cubic Bézier) drawn with continuous pressure; sharp nib falloff for a clean spine |
| centre/side tip | per-stroke nib **aspect ratio** + orientation to travel |
| flying-white | direction-aligned bristle texture that opens into gaps as ink-load depletes |
| five tones | per-stroke ink **concentration** sampled across the five-tone set |

## Evaluate
- Composition: [[Ma and Yohaku no Bi|Ma]] handles — 30–70% blank-region budget, *contiguous* void,
  off-centre weight. (Implemented as a frame scorecard in the ink demo.)
- Gesture: [[Directed Tension|directed-tension]] magnitude (resolved, not scattered) and
  [[Organic vs Mechanical Motion|organic]] draw-speed (not constant-velocity = "dead").

## Related
- [[Lattice Boltzmann Method for Ink Dispersion]] — the paper-percolation medium the strokes feed.
- [[Ma and Yohaku no Bi]] · [[Negative Space Techniques]] · [[Directed Tension]] · [[Organic vs Mechanical Motion]]
- [[Research - Ink and Watercolor Simulation on Paper]] · [[Build Working Loop]]

## Sources
1. *Brushstrokes* — Asian Art Museum education PDF. https://education.asianart.org/wp-content/uploads/sites/6/2019/09/Brushstrokes.pdf
2. *A Guide to Chinese Painting* — Jackson's Art (bone method / 骨法). https://www.jacksonsart.com/a-guide-to-chinese-painting
3. *Chinese Ink Painting Techniques* — Art of the Brush (three-step stroke). https://www.artofthebrush.ie/chinese-ink-painting-techniques
4. Jean Long, *Chinese Ink Painting Techniques in Shades of Black* (five ink tones).

> [!gap] Confidence: medium — compiled from museum/practitioner secondary sources, not a primary
> treatise (e.g. *The Mustard Seed Garden Manual* 芥子園畫傳). A deeper autoresearch pass could
> add the canonical stroke taxonomy (the 18 描 figure-outline strokes, the 皴 cun texture-strokes).
