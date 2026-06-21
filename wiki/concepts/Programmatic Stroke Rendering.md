---
title: Programmatic Stroke Rendering
type: concept
status: developing
tags: [concept, generative-art, ink, brushwork, rendering, npr, sdf, metal]
address: c-000245
created: 2026-06-21
sources: ["[[Research - Ink and Watercolor Simulation on Paper]]"]
confidence: high
---

# Programmatic Stroke Rendering

**One-line:** How to turn a *path* (a centerline / skeleton) into a rendered *stroke* — a shape with
width, taper, and texture. This is the geometry layer **between** the craft of brushwork
([[Chinese Brushwork Principles]]) and the physics of ink-in-paper ([[Lattice Boltzmann Method for Ink Dispersion]]).
Filed 2026-06-21 to close a vault gap surfaced while building the ink screensaver: the wiki had the
*aesthetic* and *fluid-simulation* layers but nothing on **how a stroke is actually laid down**.

> [!note] The one distinction that explains everything
> Every method below is either **accumulation** (sum per-sample contributions → *double-counts where
> samples overlap*) or **union / field-evaluation** (each pixel asks "am I covered / how far am I?"
> and is shaded **once** → overlap is *idempotent*). Joint over-darkening, "rung" banding on thin
> strokes, and oversaturated corners are **all** the accumulation failure mode. The fix is to move to
> a union/field formulation, not to tune the accumulation.

## The six technique families

| Family | Core idea | Double-counts at joints? | Taper | Flying-white 飛白 | GPU |
|---|---|---|---|---|---|
| **1. Stamp / "dab" spacing** (Photoshop/GIMP/Krita/MyPaint) | composite a texture stamp repeatedly along the path at `spacing × radius` | **Yes — this is the bug.** Overlap piles up; additive over-darkens, even alpha-over over-builds. Mitigate with a **per-stroke buffer taking the max/union**, composited once | free (radius←pressure) | free (textured dab) | serial loop |
| **2. Skeletal strokes** (Hsu & Lee 1994) | deform a *reference picture* so its drawn-in skeleton follows the backbone path | n/a (one picture maps once); failure mode is geometric **folding** on tight bends | yes | only if painted into the reference | pre-GPU |
| **3. Centerline + width-profile** (offset-curve / swept-disk ribbon) | stroke = union of disks along path, **or** the two offset curves tessellated into a variable-width ribbon | **No, by construction** (a single filled region, nonzero-fill); watch **inner-offset self-intersection** at cusps (curvature = half-width) | native | no (pure geometry) | yes (Levien–Uguray; Kilgard polar stroking) |
| **4. SDF / coverage strokes** | per pixel, `d = min` distance to the continuous centerline; `coverage = f(d, halfWidth)`, written **once** | **No, by construction.** `min`/union returns the *nearest* edge, never a sum — overlaps **cannot** over-composite | trivial (vary `halfWidth(t)`) | **must be added** (noise/texture modulation — edges are too clean) | GPU-native, exact AA |
| **5. NPR painterly synthesis** (Hertzmann 1998; DAB/IMPaSTo) | render as a *list* of discrete spline strokes | **Partly** — opaque alpha-over (newer covers older); DAB/IMPaSTo transfer a *conserved* paint quantity so overlaps build physically | per-layer / pressure | drag-out in physical models | Hertzmann offline; IMPaSTo real-time |
| **6. Chinese ink / calligraphy models** (MoXi; virtual brush) | split a **brush model** (hairy bundle splitting under pressure) from a **paper model** (deposited ink percolates) | **No, by construction** — ink is a **deposition/absorption field** that *saturates*, not stacked stamps | yes (brush footprint) | **yes** — bristles **split** + ink **depletes** along the stroke (high moisture at first control point, decaying with distance/speed) | MoXi flow runs fully on GPU |

## Perceive — name the artifact
A periodic dark **rung** (perpendicular band) at the stamp/sub-step spacing, strongest on **thin or
tapering** strokes (no perpendicular averaging) and at **corners/slow passes** (samples bunch). If it
survives disabling every texture pass, it is **deposit accumulation**, not the dry-brush texture.
(Diagnosed exactly this way for the ink screensaver — logged in repo issue #4.)

## Build — recommended approach (for a Metal compute-shader ink renderer)
**Render the stroke as an SDF coverage field (Family 4) and modulate it for flying-white — do not
accumulate stamps.** Concretely:
1. **Coverage = SDF, written once.** Flatten the cubic Bézier to a polyline (or evaluate per-segment
   SDF directly); per pixel `d = min over segments of distance-to-segment` (Quilez `sdSegment`);
   `coverage = smoothstep(halfWidth+aa, halfWidth−aa, d)` with `halfWidth(t)` from the pressure
   profile along arc length. The `min`/union **structurally eliminates the joint double-counting** —
   the rung banding cannot occur. This is the *correct* fix; a per-stroke max-buffer (Family 1) only
   masks an accumulation paradigm you don't want.
2. **Flying-white as coverage modulation.** SDF edges are "too clean", so multiply coverage by a
   **dry-brush mask**: paper-grain / bristle-streak noise in **stroke-local (u = arc length, v =
   across-width)** coordinates, gated by a **depletion** term rising with arc length and speed —
   MoXi's brush-side ink-depletion. Parallel low-coverage streaks emerge where split bristles leave
   them. (See [[Chinese Brushwork Principles]] → Physical dynamics for the speed↔moisture↔value rule.)
3. **Composite into the paper sim as deposition, not paint-over.** Feed `coverage × depletion` as ink
   **deposited into the surface reservoir** of [[Lattice Boltzmann Method for Ink Dispersion]] (MoXi
   supply→advection→fixture). Deposition is a *saturating* field, so overlapping strokes saturate
   rather than double — consistent with the SDF's own union semantics; the two stages agree.
4. **Lean on prior art for the geometry** (per CLAUDE.md): lift segment-SDF coverage from Quilez's
   MIT snippets; for full vector-path fidelity (caps/joins/miter), **MetalNanoVG** (MIT, Metal-native)
   is the cleanest permissive drop-in. Avoid GPL engines (Krita/Inkscape) for code reuse.

> [!caution] Depositing into a wet sim — the per-frame pulse trap
> When the stroke feeds a fluid/percolation sim (step 3), do **not** also inject the stroke's own
> **water** incrementally at the brush tip each frame: that lays a *per-frame wetness pulse* which, via
> any wetness-gated pigment term, modulates the ink into **per-frame bands** — a "rung" artifact that
> looks identical to the deposit-geometry one but survives every geometry fix. (Cost us a long hunt on
> the ink screensaver, issue #4.) Keep the wet field **stable**: pre-lay wetness (separate water
> strokes) and let ink strokes self-wet ~zero. Diagnose by toggling water off — if the bands vanish
> with dry paper, the cause is the sim interaction, not the stroke renderer.

## Evaluate
- **Adversarial test:** the "rung" check above — render a *thin, slow, curved* stroke (the worst case)
  and confirm uniform density along its length. A correct union/SDF deposit is flat there by construction.
- **Flying-white realism:** streaks run **parallel to travel** and **increase toward the depleted
  tail** (not perpendicular dashes — that is the accumulation artifact masquerading as texture).

## Ready-made implementations
- **SDF / shader line snippets:** Inigo Quilez 2D SDFs (`sdSegment`, `sdUnevenCapsule`) — MIT;
  Rougier antialiased line/dash shaders (JCGT) — BSD.
- **GPU path renderers:** Skia (`SkStroke`, Metal Graphite backend) — BSD; Pathfinder (Metal+Rust) —
  Apache/MIT; NV_path_rendering — NVIDIA-only; Spinel (Vulkan compute) — BSD.
- **Metal/Swift-native:** **MetalNanoVG** (ollix) — MIT, macOS 10.11+; nanovg (Mononen) — zlib;
  MetalPetal (filter pipeline reference) — MIT.
- **Raster brush engines (reference, mostly GPL/ISC):** libmypaint (ISC — friendliest), Krita brush
  engines (GPL), Inkscape Power Stroke / Pattern-Along-Path = skeletal strokes (GPL).

> [!caution] Swept-disk vs offset-curve
> The **swept-disk / Minkowski** ("capsule chain") model is *not* standard stroking semantics — Kilgard
> rejects it; Skia/FreeType/Nehab/Levien–Uguray all use **offset curves**. Swept-disk survives mainly
> in **brush/SDF** rendering, which is the form relevant to an ink renderer.

## Related
- [[Chinese Brushwork Principles]] — the craft layer this serves (three-phase stroke, 五色, flying-white).
- [[Lattice Boltzmann Method for Ink Dispersion]] — the paper-percolation sim the deposition feeds.
- [[Stable Fluids and GPU Ink Advection]] · [[Kubelka-Munk Optical Compositing]] — adjacent ink layers.
- [[Organic vs Mechanical Motion]] · [[Ma and Yohaku no Bi]] — why the *path* and *spacing* must read organic.

## Sources
1. Hsu & Lee, "Drawing and Animation Using Skeletal Strokes," SIGGRAPH '94. https://dl.acm.org/doi/10.1145/192161.192186
2. Green (Valve), "Improved Alpha-Tested Magnification for Vector Textures," SIGGRAPH 2007 Courses. https://dl.acm.org/doi/10.1145/1281500.1281665
3. Rougier, "Shader-Based Antialiased, Dashed, Stroked Polylines," JCGT 2(2), 2013. https://jcgt.org/published/0002/02/08/paper.pdf
4. Nehab & Hoppe, "Random-Access Rendering of General Vector Graphics," SIGGRAPH Asia 2008. https://hhoppe.com/proj/ravg/
5. Quilez, "2D Distance Functions." https://iquilezles.org/articles/distfunctions2d/
6. Kilgard & Bolz, "GPU-accelerated Path Rendering," SIGGRAPH Asia 2012. https://dl.acm.org/doi/10.1145/2366145.2366191
7. Kilgard, "Polar Stroking," SIGGRAPH 2020. https://arxiv.org/abs/2007.00308
8. Levien & Uguray, "GPU-friendly Stroke Expansion," 2024. https://arxiv.org/html/2405.00127v1
9. Nehab, "Converting Stroked Primitives to Filled Primitives," SIGGRAPH 2020. https://github.com/diegonehab/stroke-to-fill
10. Hertzmann, "Painterly Rendering with Curved Brush Strokes of Multiple Sizes," SIGGRAPH '98. https://mrl.cs.nyu.edu/publications/painterly98/
11. Chu & Tai, "MoXi: Real-Time Ink Dispersion in Absorbent Paper," SIGGRAPH 2005. http://visgraph.cse.ust.hk/MoXi/moxi.pdf
12. Baxter et al., "DAB: Interactive Haptic Painting with 3D Virtual Brushes," SIGGRAPH 2001. https://www.cs.unc.edu/~geom/DAB/
13. Baxter, Wendt & Lin, "IMPaSTo: A Realistic, Interactive Model for Paint," NPAR 2004. https://www.billbaxter.com/
14. Chu & Tai, "Real-Time Painting with an Expressive Virtual Chinese Brush," IEEE CG&A 24(5), 2004. https://ieeexplore.ieee.org/document/1333630/
15. Xu, Lau et al., "An Intelligent System for Chinese Calligraphy," AAAI 2007. https://i.cs.hku.hk/~songhua/ca/EcmlTechReport.pdf
16. MetalNanoVG (ollix, MIT). https://github.com/ollix/MetalNanoVG · nanovg (zlib). https://github.com/memononen/nanovg

> [!gap] Confidence: high on the technique taxonomy and the union-vs-accumulation principle (verified
> against ACM/JCGT/arXiv metadata). Hertzmann and IMPaSTo full texts were not read end-to-end (PDF
> fetch failures) — their summaries rest on abstracts/archive pages.
