---
address: c-000156
title: Tone.js
type: tool
status: developing
tags: [tools, audio, web-audio, music, dsp]
created: 2026-05-17
updated: 2026-05-17
verdict: first-class
---

# Tone.js

**One-line purpose:** A high-level Web Audio framework for making interactive music in the browser. The most-used JS audio library (321K weekly), used heavily for in-browser instruments, sequencers, effect-chains, and music-reactive applications.

> [!important] Phase 2 discovery (2026-05-17)
> Previously folded into [[Web Audio API and AudioWorklet]]; the previous tools sweep treated Tone.js as "Web Audio infrastructure" rather than a first-class tool. With 321,821 weekly downloads, Tone.js is comparable in adoption to three.js and warrants its own evaluation page. Tone.js is *the* recommended audio layer for any browser-based music-reactive work that isn't using [[Strudel]].

## What it does

Tone.js abstracts the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) into:

- **Instruments** — `Synth`, `PolySynth`, `MetalSynth`, `MembraneSynth`, `FMSynth`, `AMSynth`, `Sampler` (sample-based)
- **Effects** — `Reverb`, `Delay`, `Chorus`, `Distortion`, `BitCrusher`, `EQ3`, `Compressor`, `Limiter`, `Filter`, `AutoFilter`, `Phaser`, `Tremolo`, `Vibrato`, `Freeverb`, `JCReverb`, `PitchShift`, `Frequency Shifter`
- **Sources** — `Oscillator` (sine/triangle/square/sawtooth/PWM/FAT), `Noise` (white/pink/brown), `Player` (audio file playback)
- **Transport** — global clock, `Transport.bpm`, scheduling primitives, `Pattern`, `Sequence`, `Loop`, `Part`
- **Signal-rate primitives** — multipliers, adders, scale-mappers, gates, envelope-generators
- **Analyzers** — `Meter`, `Analyser` (FFT and waveform), `FFT`, `Waveform`

The architecture sits cleanly on Web Audio's node-graph and AudioWorklet, exposing both **musical concepts** (notes, BPM, beats) and **DSP primitives** (envelopes, modulation) in one consistent API.

## Why this matters for the wiki

For the user's priority 4 (music-reactive visualizers), Tone.js is the **audio half of the priority-4 stack**. Two viable approaches:

1. **[[Strudel]] + [[Hydra]]** — pattern-DSL + visual-DSL; live-coding tradition; small surface area; best for time-based composition + visuals.
2. **Tone.js + [[three.js]]** — imperative-JS audio library + general 3D renderer; best for traditional-software music apps with rich 3D worlds.

Strudel is more discipline-correct for live-coding work; Tone.js is more standard for software-engineering apps. Both are first-class.

The wiki's prior Web Audio page treated Tone.js as one of many Web Audio wrappers. With 321K weekly downloads it's clearly **the** wrapper and deserves its own page.

## Install footprint

- `npm install tone` — ~150KB minified (small)
- CDN: `<script src="https://cdn.jsdelivr.net/npm/tone@15/build/Tone.js"></script>`
- TypeScript types built-in

## LLM-codegen friendliness

**High.** Tone.js's API uses everyday musical terms (`new Synth().toDestination()`, `osc.frequency.rampTo(440, 0.5)`, `Transport.scheduleRepeat(time => ..., '4n')`). LLMs generate working Tone.js code reliably from natural-language descriptions. The synth/effect/transport vocabulary is well-represented in training corpora.

## Maintenance

- v15.1.22 published 2025-04-27 — mature, slowly-iterating
- Original author: Yotam Mann (yotam) — has maintained since 2014
- Active issue tracker, regular minor releases
- GitHub: https://github.com/Tonejs/Tone.js — 14k+ stars

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | Medium | Useful for sound-art and audio-visual generative work; less central for purely visual |
| 2. Branding | Low | Generative audio branding exists but is niche; brand sonification might use Tone.js |
| 3. Graphic design | Low | Audio is out-of-scope for static design |
| 4. **Music-reactive visualizers** | **★ Highest (paired with three.js or shader renderer)** | Standard imperative-JS audio layer. Pairs with `Tone.FFT` and `Tone.Analyser` for frequency-domain visualization driving Three.js / WebGPU scenes. |

## Music-reactive pipeline pattern

```javascript
// Tone.js + visualization (illustrative)
const player = new Tone.Player('audio.mp3').toDestination();
const fft = new Tone.FFT(64);
player.connect(fft);
// In render loop:
function frame() {
  const bins = fft.getValue(); // 64 frequency bins in dB
  // map bins to three.js scene parameters
  // ...
  requestAnimationFrame(frame);
}
```

Pair with [[Meyda]] for higher-level audio features (MFCC, RMS, onset detection, spectral centroid) that Tone's `Analyser` doesn't directly compute. Meyda + Tone is a common idiom.

## What Tone.js doesn't do

- **No built-in visual layer** — output → analyzer → app code → renderer.
- **No pattern-combinator DSL** — for that, use [[Strudel]] (or use Tone.js's `Pattern` / `Sequence` for simple cases).
- **No MIDI keyboard / hardware integration out of the box** — pair with WebMIDI API or a dedicated MIDI library.
- **No audio-file authoring** — for production music, use a DAW; Tone.js is for *runtime* synthesis.
- **Not a low-level signal-processing library** — for custom DSP write AudioWorklets directly.

## Verdict

**First-class.** Promoted from "covered in Web Audio page" to standalone evaluation. Added to recommended stack for priority 4:

> **For software-engineering music-reactive apps in 2026: Tone.js + [[three.js]] + [[Meyda]] (for richer audio features).**

[[Strudel]] is the recommended alternative if you want the live-coding paradigm; otherwise Tone.js.

## Related

- [[Web Audio API and AudioWorklet]] — the substrate
- [[Strudel]] — live-coding alternative paradigm
- [[Meyda]] — audio feature extraction (pairs naturally with Tone.js)
- [[Hydra]] — visual partner; can take Tone.js FFT output as input
- [[three.js]] — the most-common 3D pairing
- [[Tools Map]]

## Sources

- npm registry, 2026-05-17 (321,821 weekly downloads)
- Tone.js docs: https://tonejs.github.io/
- GitHub: https://github.com/Tonejs/Tone.js
