# Ink-on-paper (Metal)

Two self-running ink simulations on macOS, in Metal compute shaders. Screensaver-shaped
(no input). The `.metal` source is a Swift string compiled at runtime — no Xcode project,
no `.metallib`.

| File | Look | Model |
|---|---|---|
| **`main.swift`** (default build) | **slow black Chinese ink percolating across dry & wet paper** | **Lattice Boltzmann / MoXi** (Chu & Tai 2005) |
| `inkwater.swift` (reference) | swirling coloured ink in water | Stable Fluids (Stam 1999) |

See wiki: [[Lattice Boltzmann Method for Ink Dispersion]], [[Stable Fluids and GPU Ink Advection]],
[[Research - Ink and Watercolor Simulation on Paper]].

## Run

```bash
./build.sh                              # builds main.swift (LBM ink-on-paper)
./inkspike                              # 800×800 window; Esc or q to quit — 工筆 gongbi (default)
./inkspike --xieyi                      # 寫意 xieyi register: spontaneous, splashed, strong flying-white
./inkspike --headless 700 out.png       # render N steps offscreen → PNG (+ scorecard)

# the ink-in-water reference build:
swiftc -O inkwater.swift -o inkwater -framework Cocoa -framework Metal -framework MetalKit
```

**Two registers** (see [[Chinese Brushwork Principles]]) selected by `--xieyi`, set in the
`Register` block near the top: **工筆 gongbi** (default — controlled, even, clean spine, minimal
bleed, almost no flying-white, smooth paper) vs **寫意 xieyi** (spontaneous, heavy bleed, strong
飛白, high-contrast paper grain). Each tunes water/ink/depletion/flying-white/nib-width/paper-grain.

Requires Apple Silicon + Xcode command-line tools (`swiftc`, Metal).

`--headless` also prints an **eval scorecard** (the generate→score loop): negative-space ratio
(target 30–70%), largest contiguous void, center-of-mass offset (Ma), and directed-tension
magnitude — mirroring the wiki's `Negative Space` / `Directed Tension` technique pages. The
negative-space metric feeds back into stroke placement.

Flying-white (飛白) is **organic and broken** (two irregular noise octaves across the stroke +
breakup along its length, only at the dry tail) — deliberately *not* a regular comb, which read as
mechanical "tire tracks".

## The LBM ink-on-paper model (`main.swift`)

Faithful reduction of MoXi. Per frame:

1. **deposit (brush dynamics)** — autonomous calligraphic *strokes* grounded in
   [[Chinese Brushwork Principles]]: a **cubic Bézier** centerline, sub-stamped for a continuous
   ribbon, with **three-phase pressure** 起笔/行笔/收笔 (entry accent → modulated body → taper or
   hook), **ease-in draw-speed** (dwell at start, fast clean lift), **centre vs side-tip** nib
   中锋/侧锋 (round even line vs broad textured sweep), **five ink tones** 墨分五色 (burnt→clear
   per stroke), and direction-aligned **dry-brush flying-white** 飛白. Occasional **water wash**
   wets a region (→ wet paper).

   *Composition (Ma):* stroke placement is **Ma-aware** — an occupancy grid steers strokes
   off-centre and preserves a 30–70% blank-region budget (not uniform scatter). *Pacing (temporal
   ma):* strokes come in **bursts then rests**, not a fixed metronome. (Wiki: [[Ma and Yohaku no
   Bi]], [[Organic vs Mechanical Motion]], [[Directed Tension]].)
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
| Fixed 384² square grid | stretches on non-square windows | wrap into a `.saver` (match screen aspect) |

## Path to a real screensaver

`Renderer.encode(target:cb:)` writes any texture, so it drops into a `ScreenSaverView`
hosting an `MTKView`/`CAMetalLayer` unchanged — then bundle as `.saver`.
