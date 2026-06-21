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
  Wild bleed, strong flying-white, dramatic tone.

## Physical dynamics — the act of putting brush to paper

The invariants above describe *what a stroke is*; this layer is *how the hand makes it*, and it's
where **vigor** comes from. Filed 2026-06-21 after the ink screensaver read too uniform/watery.

- **Speed ↔ moisture ↔ value are one coupled axis** — the engine of vigor. A brush has a finite ink
  load; how it reads depends on how fast it travels over how-wet paper:
  - *slow + saturated* → dark, broad, **bleeding** (wet-on-wet);
  - *fast + low-moisture* → light, thin, **flying-white** (枯/飛白).
  You don't set value, wetness, and speed independently — pick a point on this axis and the rest
  follow. This is the single most useful generative rule on the page.
- **The five shades are five stroke *archetypes*, not just tints** (墨分五色 as types):
  | Shade | Stroke character |
  |---|---|
  | 焦 charred | thin, very dark, crisp, fast — the structural **bone** line |
  | 濃 dark | medium, solid black, confident body |
  | 淡 light | broad, **pale**, low-pressure side-tip **wash** — a background tone, laid *first* |
  | 濕 wet | saturated, slow, **bleeding** into damp paper |
  | 枯 dry | fast, crusty, **flying-white + splatter** |
  A composed image draws them in tonal layers: pale washes under, solid blacks over, accents last.
- **Side-ink / edge-loading** — loading one edge of the nib gives **tonal gradation across a single
  stroke** (dark edge → pale edge). Approximated by ink-depletion along the stroke + side-tip aspect.
- **潑墨 pomo / splatter** — droplets flicked off a vigorously-loaded brush, heaviest at the
  **landing** (起笔) and at fast direction changes. Reads as *energy*; pure pigment, hard dots, no bleed.
- **Brush landing & drag (起笔)** — the start is a *press that then drags*: a firmer contact at touch-down
  pulling into the body. Overdone it becomes a "lollipop" head — a calligraphic start is **firm, not bulbous**.
- **Deposit is proportional to motion, not dwell.** Pigment density comes from how many times the
  sweeping nib *overlaps* a point as it moves — not from how long the brush sat there. A model that
  deposits per-frame oversaturates slow/short strokes into blobs; dose by **distance travelled**.

> The two registers + four of these archetypes (focusing on 焦/濃/淡/枯) drive
> `screensaver/ink-metal/`'s per-painting stroke recipe ("one painter" lays a few varied strokes).

## Build → how to generate it (used by `screensaver/ink-metal/`)
| Invariant | Concrete knob |
|---|---|
| three-phase | pressure profile with an entry accent + modulated body + fast-lift exit (taper or hook); **ease-in** draw-speed so the brush dwells at the start and lifts cleanly |
| bone method | a confident centerline (cubic Bézier) drawn with continuous pressure; sharp nib falloff for a clean spine |
| centre/side tip | per-stroke nib **aspect ratio** + orientation to travel |
| flying-white | direction-aligned bristle texture that opens into gaps as ink-load depletes |
| five tones | per-stroke **archetype** (焦/濃/淡/枯) → its own speed, width, ink-conc, moisture, flying-white, splatter |
| speed↔moisture↔value | one **speed** parameter drives width (fast→thin), draw-rate, dryness/flying-white, and depletion together |
| splatter / 潑墨 | per-stroke speck count, biased forward + at the landing; pure pigment, no water |
| motion-dosing | deposit ink ∝ **distance the nib moved**, not per-frame, so slow/short strokes don't oversaturate into blobs |
| vigor | one dial scaling speed + flying-white + curvature + splatter for the dynamic archetypes |

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
5. *Vocabulary of Dots / Brushstrokes* — Asian Art Museum (fei bai = *fast + low moisture*; speed↔moisture coupling).
6. 潑墨 *pomo* (splashed/spilled ink) and side-ink edge-loading — practitioner accounts of vigorous xieyi technique.

> [!gap] Confidence: medium — compiled from museum/practitioner secondary sources, not a primary
> treatise (e.g. *The Mustard Seed Garden Manual* 芥子園畫傳). A deeper autoresearch pass could
> add the canonical stroke taxonomy (the 18 描 figure-outline strokes, the 皴 cun texture-strokes).
