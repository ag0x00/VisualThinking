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
./inkspike                              # 800×800 window; Esc or q to quit
./inkspike --headless 700 out.png       # render N steps offscreen → PNG

# the ink-in-water reference build:
swiftc -O inkwater.swift -o inkwater -framework Cocoa -framework Metal -framework MetalKit
```

Requires Apple Silicon + Xcode command-line tools (`swiftc`, Metal).

## The LBM ink-on-paper model (`main.swift`)

Faithful reduction of MoXi. Per frame:

1. **deposit (brush dynamics)** — autonomous calligraphic *strokes*: a **cubic Bézier**
   centerline drawn over its lifetime, sub-stamped for a continuous ribbon, with a **pressure
   profile** (soft entry taper → dark body → tapered point), **ink-load depletion** (wet dark
   head → dry tail), and a direction-aligned **bristle texture** that opens into **dry-brush
   flying-white (飛白)** as the load runs out. Footprints are masked by paper receptivity.
   Occasional broad **water wash** wets a region (→ wet paper).
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
