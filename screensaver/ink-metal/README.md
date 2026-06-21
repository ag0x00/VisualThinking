# Ink-on-paper (Metal)

Two self-running ink simulations on macOS, in Metal compute shaders. Screensaver-shaped
(no input). The `.metal` source is a Swift string compiled at runtime — no Xcode project,
no `.metallib`.

| File | Look | Model |
|---|---|---|
| **`main.swift`** (default build) | **slow black Chinese ink percolating across dry & wet paper** | **Lattice Boltzmann / MoXi** (Chu & Tai 2005) |
| `inkwater.swift` (reference) | swirling coloured ink in water | Stable Fluids (Stam 1999) |

See wiki: [[Lattice Boltzmann Method for Ink Dispersion]], [[Stable Fluids and GPU Ink Advection]],
[[Programmatic Stroke Rendering]], [[Chinese Brushwork Principles]],
[[Research - Ink and Watercolor Simulation on Paper]].

## Run

```bash
./build.sh                              # builds main.swift (LBM ink-on-paper)
./inkspike                              # 800×800 window — 工筆 gongbi (default)
./inkspike --xieyi                      # 寫意 xieyi register: spontaneous, splashed, strong flying-white
./inkspike --headless 700 out.png       # render N steps offscreen → PNG (+ scorecard)

# Window hotkeys:  Esc/q quit · Space pause/unpause · s save a PNG snapshot to ~/Downloads/

# the ink-in-water reference build:
swiftc -O inkwater.swift -o inkwater -framework Cocoa -framework Metal -framework MetalKit
```

**Two registers** (see [[Chinese Brushwork Principles]]): **工筆 gongbi** (default — controlled,
even, clean spine, minimal bleed, almost no flying-white, smooth paper) vs **寫意 xieyi**
(spontaneous, heavy bleed, strong 飛白, high-contrast paper grain). Each tunes
water/ink/depletion/flying-white/nib-width/paper-grain.

**Controls window** (windowed mode only): a second "Ink controls" window exposes the dials we tune
most — register, red accent on/off, wet-paper %, clear-water strokes, strokes-before-red, avg stroke
speed, **Vigor** (speed + flying-white + curvature + splatter for the dynamic strokes), **Splatter**
(潑墨 droplet amount), stroke length, hold seconds. Edits write to a shared `Settings` and are
**snapshotted at each painting reset**, so they never disturb the painting in progress — they take
effect on the next one.

**Wet vs dry paper.** The paper starts fully **dry**, and an ink stroke deposits **zero** water of its
own, so on dry paper it stays **crisp**. (Injecting a per-frame self-water pulse at the brush tip
modulates the wet-gated pigment into per-frame "rung" bands — the trap documented in
[[Programmatic Stroke Rendering]]; so wetness is kept a *stable* field.) Wetness comes only from
**clear-water strokes** laid first (count 0–5 and size are both dials), which settle into a steady wet
zone. A black stroke that crosses that zone bleeds (wet-on-wet); elsewhere it stays crisp. Where two
*wet* inks meet, a wetness-gated **diffusion** term lets them blend/merge instead of one's water
shoving the other (a harsh backrun). With `waterN = 0` the whole painting is crisp/dry; raise it (or
the wet size) for more bleed. (淡 gray washes keep a touch of self-water so they can still soften.)

Each launch starts a **different** painting (the RNG is seeded from entropy per run). Pass
`--seed=N` for a reproducible run (same N → same painting), e.g. to re-inspect or report one.

For headless tuning: `--waterN=N`, `--wet=X`, `--speed=X`, `--vigor=X`, `--splatter=X`, `--count=N`,
`--seed=N` override the defaults.

Requires Apple Silicon + Xcode command-line tools (`swiftc`, Metal).

`--headless` also prints an **eval scorecard** (the generate→score loop): negative-space ratio
(target 30–70%), largest contiguous void, center-of-mass offset (Ma), and directed-tension
magnitude — mirroring the wiki's `Negative Space` / `Directed Tension` technique pages. The
negative-space metric feeds back into stroke placement.

Flying-white (飛白) reads as **continuous parallel hairs running along the stroke** (like a real dry
brush dragging until the ink runs out), not beaded "railroad tracks". The streak pattern is keyed to
the **local-segment perpendicular** (signed distance across the stroke), so the hairs follow the
stroke even where it curves and stay continuous across overlapping deposits. It needs **width** to
read as *parallel* hairs (a one-hair-wide line can only bead), so it is width-gated to the broad
side-tip 枯 *dry-drag* archetype; thin "bone" lines stay solid.

## The LBM ink-on-paper model (`main.swift`)

Faithful reduction of MoXi. Per frame:

1. **deposit (brush dynamics)** — autonomous calligraphic *strokes* grounded in
   [[Chinese Brushwork Principles]]: a **cubic Bézier** centerline laid as **SDF coverage capsules**
   (solid core + ~1.4px AA rim) **unioned with `max`** — not additive stamps — so overlapping deposits
   never double-count and thin lines anti-alias cleanly (see [[Programmatic Stroke Rendering]]); with
   **three-phase pressure** 起笔/行笔/收笔 (entry accent → modulated body → taper or
   hook), **ease-in draw-speed** (dwell at start, fast clean lift), **centre vs side-tip** nib
   中锋/侧锋 (round even line vs broad textured sweep), **five ink tones** 墨分五色 (burnt→clear
   per stroke), and direction-aligned **dry-brush flying-white** 飛白. Occasional **water wash**
   wets a region (→ wet paper).

   *One painter, varied strokes:* the next stroke begins only after the current one has lifted —
   a single hand, never two strokes at once. Each painting draws a small **recipe of 五色
   archetypes** (see [[Chinese Brushwork Principles]] → Physical dynamics): broad **pale washes**
   (淡) laid first as background tone, then crisp dark **thin-line "bones"** (焦), solid **darks**
   (濃), and fast **dry strokes** (枯) with strong flying-white + **潑墨 splatter** specks — ending
   with the red accent. **Speed↔moisture↔value are coupled** (fast→thin/dry/light); a **Vigor** dial
   pushes the dynamic archetypes (speed, flying-white, curvature, entry-snap, splatter). Pigment is laid as
   **distance-field coverage unioned with `max`**, so darkness comes from the brush load (not from how
   many stamps overlap), thin lines stay crisp, and there is no "rung" banding. *Composition (Ma):* placement is **anti-clustering** — strokes
   spread apart with a gentle off-centre bias (occupancy grid), for contiguous blank space.

   *Painting lifecycle:* the canvas is **not** an endless accumulation. A painting builds to a few
   well-placed strokes (or until the composition fills) that are free to **cross and interact**
   (ink over ink). When done it **waits ~2 s** (the wet ink settles), then the **paper dries** —
   pigment freezes, so the black marks stop growing — and a single very-thin, very-long **red
   accent** (朱) is swept across the canvas (endpoints kept *inside* the frame, no bleed). The
   finished image **holds** ~5 s (temporal *ma*), **fades** to clean paper (~2 s), and a **new
   painting** begins on fresh paper. Pigment is two-channel (black `x`, red `y`); the red composites
   on top. (Wiki: [[Ma and Yohaku no Bi]], [[Negative Space in Motion]], [[Organic vs Mechanical Motion]].)
2. **LBE** — D2Q9 lattice-Boltzmann water percolation with MoXi's modifications:
   - **variable permeability** via half-way partial **bounce-back** (paper-grain texture → feathery/branching fronts),
   - **advection modulation** `psi = smoothstep(0,α,ρ)` to keep the free wet/dry boundary stable,
   - **uneven evaporation** (extra loss at the wet/dry edge → edge darkening).
3. **pigment** — advected by the water velocity (method of characteristics) with **flow-speed
   hindrance**: slow ⇒ pinned, fast ⇒ moves. Water leads, pigment lags → the feathery fringe.
4. **display** — black sumi ink over warm paper with tooth; damp paper reads slightly cooler.

**Dry vs wet paper:** a low-frequency `zone` field pre-dampens regions and raises their
permeability. Strokes on dry paper stay crisp; strokes crossing wet paper bloom into
bristle-like fingers. A slow pigment fade keeps the canvas evolving (screensaver loop) — not
physical; it's the one non-MoXi knob.

## Deliberate simplifications (`ponytail:`)

| Skipped | Effect | Add when |
|---|---|---|
| Dynamic σ-pinning + pinning texture | edge roughening comes only from static permeability | want stronger toe/branch control |
| Pigment fixture layer | ink "fixes" implicitly (doesn't evaporate) | want rewettable dried marks |
| Kubelka–Munk compositing | flat `mix()` to black | want coloured/layered ink → [[Kubelka-Munk Optical Compositing]] |
| Fixed 600² square grid | stretches on non-square windows; upscaled to the window | wrap into a `.saver` (match screen aspect) |

## Path to a real screensaver

`Renderer.encode(target:cb:)` writes any texture, so it drops into a `ScreenSaverView`
hosting an `MTKView`/`CAMetalLayer` unchanged — then bundle as `.saver`.
