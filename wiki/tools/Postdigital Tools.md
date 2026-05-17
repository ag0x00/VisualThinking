---
address: c-000163
title: Postdigital Tools
type: tool
status: developing
tags: [tools, postdigital, ascii, glitch, palette, lo-fi]
created: 2026-05-17
updated: 2026-05-17
verdict: first-class-as-survey
---

# Postdigital Tools

**One-line purpose:** Survey of **JS / TS tools for the postdigital aesthetic** — ASCII art, glitch effects, palette restriction, indexical-trace rendering. Anchored on the [[Postdigital Aesthetics]] framing and Cramer's symbolic-vs-indexical distinction.

> [!important] Phase 2 discovery (2026-05-17)
> Postdigital aesthetics is *more about techniques than packaged libraries*. npm-search for `keywords:glitch` returns mostly text-glitch / React-effect packages; the deeper datamoshing / pixel-sorting / palette-restriction work is typically done from scratch in p5.js / three.js shaders. This page covers the few real libraries plus the *technique catalog* needed to fill the gap.

## Why this page is mostly a techniques catalog

[[Postdigital Aesthetics]] (Phase 1 framing, anchored on [[Cramer - What Is Post-Digital|Cramer 2014]]) values:

- **Indexical over symbolic** — material trace over encoded symbol
- **Glitch / error / artifact** — beauty in failure modes
- **Restriction-as-aesthetic** — lo-fi palettes, low resolution, intentional quantization
- **DIY over corporate / shrink-wrapped** — handmade, repurposed, hacker-ethic

The tools that serve these values are **either tiny utility libraries or hand-coded techniques**. This page surveys both.

## The mature libraries

### ASCII rendering

**`asciify-engine`** — 4,153 weekly downloads, last published 2026-05-11. Framework-agnostic ASCII art engine for images, videos, GIFs on canvas. Production-ready.

**`textmode.js`** — actively maintained, last published 2026-05-15. "Lightweight creative coding library for creating real-time ASCII art on the web."

Both serve Cramer's *indexical-over-symbolic* axis: the rendered output is *literally text*, foregrounding the symbolic substrate of digital images. Paradoxically, ASCII rendering is *deeply postdigital* in that it makes the medium (text) literally the message.

### CSS-driven generative

**`css-doodle`** — 2,667 weekly downloads, web component for visual art via CSS. The most-DIY entry on this list — generates art entirely in declarative CSS, no JS art library required. Excellent fit for the [[Postdigital Aesthetics|DIY-vs-shrink-wrapped]] axis.

### Palette restriction

**`poline`** — color palette generator using "curves within the HSL color model." Useful for *intentional* palette restriction — generate small, harmonious palettes rather than arbitrary RGB. ~3,477 monthly.

**`rampensau`** — color ramp generator. Similar role. ~449 weekly.

For lo-fi-specific palettes (NES, Game Boy, CGA, Pico-8), there's no dominant npm package — the palettes are short enough to copy inline. Reference [LoSpec](https://lospec.com/palette-list) for curated lo-fi palettes.

### Text glitch

**`glitched-writer`** — 1,005 weekly downloads. Animated text-corruption effect. Niche but the highest-quality option in this category.

### Image-domain glitch / pixel-sort / datamosh

**No dominant npm package.** Most pixel-sorting / glitch work is hand-coded in p5.js / WebGL shaders. Pattern: write a fragment shader that does the corruption; ship as a 50-200-line file.

Recommended approach for the wiki:
- For **pixel-sorting**: implement in a fragment shader (the standard algorithm is small)
- For **datamoshing**: requires real video codec corruption; usually done via FFmpeg pre-processing rather than in-browser
- For **channel splitting / RGB glitch**: trivial shader (one line per channel offset)

This is exactly Cramer's *DIY-hacker* point — the technique is more important than the library, and the library would over-abstract it anyway.

## Hand-coded techniques (the bulk of the framing)

### Indexical-rendering (Cramer's preferred axis)

Render with visible **material traces**:
- **Brush-stroke imitation**: pressure-varied, broken edges, paint-bleed
- **Paper grain overlay**: noise-textured underlay or pre-rendered paper-texture image multiply-blended
- **Pen-tip wobble**: small per-vertex perturbation
- **Watercolor edges**: see `@watercolorizer/watercolorizer` (349 weekly), one of the few packages that targets this directly

Most studio-research practitioners (Hobbs, Asendorf, Gamboa Naon) hand-code these effects. Reference: Tyler Hobbs's *Flow Fields and Noise Algorithms* essay.

### Resolution restriction

- Render at low resolution (e.g., 64×64 to 256×256), then upsample with `image-rendering: pixelated` CSS
- Restrict to fixed pixel grids (cellular layout, not anti-aliased curves)
- For the [Bauhaus / lo-fi indie magazine](https://lospec.com/palette-list) aesthetic

### Palette quantization

- Sample colors via [[The Color Stack|culori]] in OKLCH, quantize to nearest-N from a curated palette
- Combine with dithering (Bayer / Floyd-Steinberg) for the Mac Paint look
- Avoid arbitrary RGB — that gives the "design-software" look the framing pushes against

### Glitch synthesis (shader-based)

Standard fragment-shader techniques:

```glsl
// illustrative — RGB channel offset
vec2 r_off = uv + vec2(0.01, 0);
vec2 b_off = uv - vec2(0.01, 0);
vec3 col = vec3(texture(tex, r_off).r,
                texture(tex, uv).g,
                texture(tex, b_off).b);
```

Plus: pixel-sorting (sort pixels per scanline by brightness above a threshold), block-shuffling (datamosh-like), scanline noise, dropout.

## Recommended stack

For postdigital work in JS:

```
asciify-engine OR textmode.js  # if doing text-mode rendering
css-doodle                      # if doing browser-native generative
poline                          # for restricted palettes
@watercolorizer/watercolorizer  # for indexical / watercolor-trace renders
```

Plus hand-coded shaders for image-domain glitch / pixel-sort. No external library needed for those.

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | **High** — glitch and lo-fi are real generative-art subgenres | Combine with [[three.js]] / [[WebGPU]] for shader-based work |
| 2. Branding | **High** — anti-clean branding (NTS, Bandcamp, indie labels) | Restricted palettes + ASCII / glitch can define identity systems |
| 3. Graphic design | **High** — editorial / poster / zine work | Print-aesthetic-via-degradation is mainstream contemporary design |
| 4. Music-reactive | Medium | Glitch-driven by audio events is a viable pattern; less directly served than priority 3 |

## Discovery methodology note

The Phase 2 discovery confirmed: **postdigital is the framing where pure npm-search audit misses the most**. The framing is more about *technique* than *library*. Future sweeps should treat postdigital differently:

- Read **practitioner blogs** (Hobbs, Asendorf, Mike Bostock essays)
- Survey **shader collections** on Shadertoy
- Reference **LoSpec** for palette curation
- Track **fragment-shader gists** rather than npm packages

## Verdict

**First-class as a hybrid survey/technique-catalog page.** A few real libraries surveyed; the bulk of the framing's value is in hand-coded technique, which this page also covers.

## Related

- [[Postdigital Aesthetics]] — theoretical framing
- [[Cramer - What Is Post-Digital]] — primary source
- [[Symbolic Pattern in Composition]] — Arnheim resonances with Cramer's symbolic-vs-indexical distinction
- [[The Color Stack]] — culori for palette quantization
- [[Practice-led Studio Research]] — hand-coded technique tradition
- [[Tools Map]]

## Sources

- npm registry, 2026-05-17 (keywords: glitch, ascii, palette)
- Cramer 2014 indexical-symbolic distinction: [[Cramer - What Is Post-Digital]] p.19
- LoSpec palette database: https://lospec.com/palette-list
- Tyler Hobbs essays: https://www.tylerxhobbs.com/words/
