---
address: c-000188
title: Disney Animation Principles
type: concept
status: developing
tags: [concepts, animation, disney, thomas, johnston, lasseter, motion]
created: 2026-05-17
updated: 2026-05-17
---

# Disney Animation Principles

**The 12 principles of animation** introduced by **Disney animators Frank Thomas and Ollie Johnston** in *The Illusion of Life: Disney Animation* (1981), distilled from Disney studio practice 1930s–60s. The single most-cited animator's toolkit. Extended to 3D computer animation by **John Lasseter (Pixar)** in *Principles of Traditional Animation Applied to 3D Computer Animation* (SIGGRAPH 1987).¹ Foundational for any moving-image work in priorities 1 (dynamic generative art) and 4 (music-reactive visualizers).

> [!note] Pedagogical canon; widely-adopted across media
> The 12 principles are uncontested as pedagogy and have been **explicitly adapted** for stop-motion, CGI, motion graphics, UI motion design (Material Design motion guidelines reference them), and game animation. Thesen 2020 reviews and updates them for contemporary practice with no fundamental revisions.² Pairs with [[Eisenstein's Montage Theory|Eisenstein]] (sequence-level) and [[Murch's Six Editing Rules|Murch]] (cut-level): the 12 principles operate at the **per-motion** level.

## The 12 principles

| # | Principle | What it means |
|---|---|---|
| 1 | **Squash and stretch** | Volume preservation under deformation; gives weight and elasticity |
| 2 | **Anticipation** | Preparatory motion before the main action; cues the viewer |
| 3 | **Staging** | Clear presentation of the action; one idea at a time; eye-targeting |
| 4 | **Straight-ahead vs pose-to-pose** | Two animation strategies: improvise frame-by-frame vs. plan keyframes |
| 5 | **Follow-through and overlapping action** | Different parts of a body settle at different times; tertiary motion |
| 6 | **Slow in and slow out** (ease) | Acceleration / deceleration curves; natural motion non-linear in time |
| 7 | **Arcs** | Most natural motion follows curves, not straight lines |
| 8 | **Secondary action** | Supporting motions that emphasize the primary (a hair-flip during a head-turn) |
| 9 | **Timing** | Number of frames per action; controls perceived weight and emotion |
| 10 | **Exaggeration** | Push the action beyond reality for clarity / impact |
| 11 | **Solid drawing** | Three-dimensional structure even in 2D; sculptural understanding |
| 12 | **Appeal** | The character / motion is interesting to watch; gravitational presence |

## The four most-load-bearing for generative work

### Anticipation (#2)

Before any action, the *opposite* motion. Before a jump, a crouch; before a punch, a draw-back. Anticipation cues the viewer to attend; without it, the action *surprises* but doesn't *land*.

For [[Music-reactive Visualizers|priority 4]]: visualizers that respond to a beat with no anticipation feel reactive-not-musical. Anticipation = visualizer building tension in the bars *before* a drop. The most-felt "the visualizer knows the music" cue.

### Slow in and slow out (#6 / ease)

Animation timing is *non-linear*. Linear interpolation reads as mechanical (cf. [[Organic vs Mechanical Motion]]). Ease-in-and-ease-out — sigmoid timing curves — reads as natural.

Modern web animation: CSS `transition-timing-function: cubic-bezier(...)` directly implements ease. The default `ease`, `ease-in-out`, `ease-in`, `ease-out` provide standard sigmoid curves. Material Design / Apple HIG provide specific timing-curve presets.

### Arcs (#7)

Limbs swing in arcs; thrown objects follow parabolic paths; eyes move in saccadic arcs. **Straight-line motion is the giveaway of bad animation.** Arc-following is mandatory.

For generative work: when parameter-modulating a value, traverse an arc-in-parameter-space, not a straight line.

### Timing (#9)

The *number of frames* allocated to an action controls perceived **weight**, **strength**, and **emotion**. A 3-frame head-turn reads as light/quick; a 12-frame head-turn reads as deliberate/heavy. Same motion, different content.

For [[Music-reactive Visualizers|priority 4]]: timing must respect musical tempo. Generative-art frame-allocation should be musically-driven, not uniform.

## Lasseter's 3D extension

Lasseter's 1987 SIGGRAPH paper applied the 12 principles to 3D CGI:¹

- Squash-and-stretch in 3D requires *non-uniform scaling* + *volume preservation* (compress on one axis, expand on others)
- Anticipation operates the same way in 3D
- Arcs become 3D curves; spline-based motion respects this naturally
- Timing controlled per-keyframe; ease curves are the same

Lasseter's adaptation made the 12 principles operative in CGI, which is why Pixar films feel animator-crafted despite being technically rendered.

## Modern web/UI motion design

The 12 principles have been substantially **adopted into UI motion design**:

- **Material Design Motion** (Google) explicitly references ease curves + anticipation + follow-through
- **Apple HIG Motion** uses the same principles for iOS / macOS transitions
- **Lottie animation files** (After Effects → JSON → web) encode 12-principle-respecting motion natively
- **CSS `animation-timing-function` / `transition-timing-function`** implement ease-in-and-ease-out at the language level

The principles transferred *intact* from cel animation (1930s) to 3D CGI (1987) to web/UI (2010s+) — rare longevity for any framework.

## Contemporary updates (Thesen 2020)

Thesen 2020² reviews and updates the 12 principles for contemporary practice. Key points:

- The 12 remain *essentially correct* — no fundamental revisions needed
- Application to motion graphics / UI / VR / game animation requires *adaptation* not *replacement*
- Some principles (squash-and-stretch) are less-applied in realistic 3D / VR contexts
- Some additions worth tracking: **screen-direction continuity** (cf. [[Murch's Six Editing Rules|Murch's eye-trace]]), **affordance signaling** (UI-specific), **state-transition smoothness** (UI-specific)

The 12 principles are the *most-validated* framework in this sweep — they have survived 40+ years of medium shifts without fundamental revision.

## Computable handles

For a generative system implementing motion:

- **Default to ease curves**: every parameter transition uses `easeInOut` not linear
- **Add anticipation**: when planning a major change, insert a small *opposite* motion 100-200ms beforehand
- **Use arcs**: rotate values through 3D spline curves, not straight interpolation
- **Variable timing per motion type**: heavy/important motions get longer frame budgets; light/quick motions get shorter
- **Secondary motion**: when a primary parameter changes, attached secondary parameters lag and recover (overlapping action)
- **Stagger**: when N elements animate, offset their start times by 30-100ms (the "stagger" pattern; standard in Material Design / Framer Motion)

Production tools that implement these: GSAP, motion (formerly Framer Motion), Lottie, three.js TWEEN/Theatre.js. See [[Creative Coding Utilities]].

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art (dynamic)** ★ | Every moving generative output must respect ease + arcs + anticipation |
| 2. Branding | Brand motion guidelines reference these principles |
| 3. Graphic design | Web/UI motion design; scrollytelling transitions |
| **4. Music-reactive** ★ | Anticipation = building tension before beats; ease curves = musicality |

## Related

- [[Time-based Composition]] (parent stub) · [[Eisenstein's Montage Theory]] · [[Murch's Six Editing Rules]] · [[McCloud's Panel Transitions and the Infinite Canvas]] · [[Stroboscopic Motion]] · [[Phenomenal Causality]] · [[Organic vs Mechanical Motion]] · [[Directed Tension]] · [[Creative Coding Utilities]]

## Sources

1. Lasseter, John. *Principles of Traditional Animation Applied to 3D Computer Animation*. ACM SIGGRAPH Computer Graphics 21(4): 35-44, 1987.
2. Thesen, Thomas P. *Reviewing and Updating the 12 Principles of Animation*. Animation: An Interdisciplinary Journal, 2020. https://journals.sagepub.com/doi/10.1177/1746847720969919
3. Thomas, Frank and Johnston, Ollie. *The Illusion of Life: Disney Animation* (Abbeville Press, 1981).
4. *Twelve basic principles of animation*, Wikipedia. https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation
5. Material Design 3 Motion guidelines: https://m3.material.io/styles/motion/
