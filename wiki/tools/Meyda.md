---
address: c-000157
title: Meyda
type: tool
status: developing
tags: [tools, audio, dsp, music-information-retrieval, feature-extraction]
created: 2026-05-17
updated: 2026-05-17
verdict: first-class
---

# Meyda

**One-line purpose:** Real-time **audio feature extraction** for the Web Audio API — MFCCs, spectral centroid, RMS, ZCR, onset detection, chroma, perceptual sharpness, and a dozen more standard MIR (Music Information Retrieval) features computed live on AudioBuffer frames.

> [!important] Phase 2 discovery (2026-05-17)
> The prior Web Audio page mentioned audio analysis abstractly; Meyda is the standard library in this niche (13,144 weekly downloads, active maintenance) and warrants standalone evaluation. Critical for priority 4 (music-reactive visualizers) because Tone's built-in `Analyser` only does raw FFT bins / waveform — Meyda computes the *features that map well to visual parameters*.

## Why feature extraction (not raw FFT) for music-reactive

Music-reactive visuals work best when driven by **semantic audio features**, not raw frequency bins:

- **RMS** → visual brightness / amplitude
- **Spectral centroid** → "perceived brightness" — color temperature, saturation
- **Spectral flatness** → noisy-vs-tonal → granularity / dither density
- **Spectral rolloff** → "highness" of timbre → vertical position
- **Onset detection** → trigger events on beats, attacks
- **MFCCs** → timbre fingerprint → consistent color/shape mappings per instrument
- **Chroma** → pitch-class (C, C#, D...) → discrete palette swaps on harmonic changes
- **Loudness (Bark scale)** → perceptual amplitude across critical bands

These are the features the audio-perception literature uses; raw 1024-bin FFT requires you to design these features yourself. Meyda exposes them as a single API call.

## Features Meyda computes

Per Meyda's documentation, all returned in one `meyda.get([...])` call:

- `rms`, `energy`, `zcr` (zero-crossing rate)
- `amplitudeSpectrum`, `powerSpectrum`
- `spectralCentroid`, `spectralFlatness`, `spectralRolloff`, `spectralSpread`, `spectralSkewness`, `spectralKurtosis`, `spectralSlope`
- `mfcc` (Mel-frequency cepstral coefficients, configurable count)
- `chroma` (12-element pitch-class)
- `loudness` (specific loudness per Bark band + total)
- `perceptualSharpness`, `perceptualSpread`
- `melBands`, `barkBands`
- `complexSpectrum` (real + imaginary parts)

## Install footprint

- `npm install meyda` — ~30KB minified
- CDN ES-module via jsdelivr / esm.sh
- Browser and Node.js (Node mode uses dummy AudioContext for offline analysis of audio files)

## LLM-codegen friendliness

**Medium-high.** The API is straightforward (`Meyda.createMeydaAnalyzer({ ... })`) but the **semantics of each feature require domain knowledge**. An LLM can generate Meyda code that compiles but may map features to visual parameters in unprincipled ways. A few example mappings (rms → brightness, centroid → hue, onsets → particle bursts) cover most cases.

## Maintenance

- v5.6.3, last published 2024-04-21 — mature, slow-iterating
- Active maintainers: Hugh Rawlinson (primary, MIR research background), Nevo Segal, Jakub Fiala, 2xaa
- GitHub: https://github.com/meyda/meyda
- 13k+ weekly downloads — niche but solidly established

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | Medium | Audio-driven generative; otherwise low relevance |
| 2. Branding | Low | Brand-sonification niche |
| 3. Graphic design | Low | Out of scope |
| 4. **Music-reactive visualizers** | **★ Highest (paired with Tone.js or Strudel)** | The standard feature-extraction layer. Pair with [[Tone.js]] (for source/effects) or [[Strudel]] (for pattern-driven audio). Meyda's features → Three.js / WebGPU visual parameters. |

## Pipeline pattern

```javascript
// Audio source (Tone.js Player) → Meyda analyzer → visual parameter map
import Meyda from 'meyda';
const player = new Tone.Player('track.mp3').toDestination();
const ctx = Tone.getContext().rawContext;
const analyzer = Meyda.createMeydaAnalyzer({
  audioContext: ctx,
  source: player.input,
  bufferSize: 1024,
  featureExtractors: ['rms', 'spectralCentroid', 'chroma'],
  callback: features => {
    // map to scene parameters
    scene.background = oklch(0.6, 0.15, features.spectralCentroid * 360);
    particleEmitter.rate = features.rms * 1000;
  }
});
analyzer.start();
```

## What Meyda doesn't do

- **No melody / chord tracking** — chroma is raw; for chord detection, post-process.
- **No tempo / beat tracking** — separate libraries (BeatNet, BPMAnalyzer) handle this; Meyda is per-frame.
- **No music structure** (verse/chorus segmentation) — research-level work.
- **No source separation** (drums vs vocals) — heavy ML; out of Meyda's scope.

For richer MIR work, [Essentia.js](https://essentia.upf.edu/essentiajs.html) (UPF's WASM-compiled Essentia C++ library) offers deeper analysis but is much heavier (~2MB+ WASM, slower startup). Meyda is the right choice for *real-time* feature extraction; Essentia.js for *offline* deep analysis.

## Verdict

**First-class for priority 4.** Added to recommended stack:

> **Audio feature extraction for music-reactive visualizers: Meyda.** Pairs with [[Tone.js]] or [[Strudel]] for the source layer.

## Related

- [[Tone.js]] — typical audio source
- [[Strudel]] — alternative pattern-driven source
- [[Web Audio API and AudioWorklet]] — substrate
- [[Hydra]] — visual partner; consume Meyda features via `a.fft` substitution
- [[Cross-Modal Emotion Mapping]] — feature→visual mapping theory
- [[Phenomenal Causality]] — feature-event latency budget
- [[Tools Map]]

## Sources

- npm registry, 2026-05-17 (13,144 weekly downloads)
- Meyda docs: https://meyda.js.org/
- GitHub: https://github.com/meyda/meyda
