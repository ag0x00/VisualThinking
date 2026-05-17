---
title: Web Audio API and AudioWorklet
type: tool
status: developing
tags: [tool, library, audio, visualizer, javascript, web-platform]
address: c-000130
created: 2026-05-17
url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
license: W3C standard (browser implementations vary)
last_release: stable (2014+); AudioWorklet 2018+
verdict: first-class-for-music-visualizers
---

# Web Audio API and AudioWorklet

The **browser's native audio infrastructure** — a graph-based audio-processing API with **AnalyserNode** for spectral analysis (the visualizer's core input) and **AudioWorklet** for custom low-latency audio processing in a dedicated thread.

**Verdict: first-class for music-reactive visualizers** (priority 4 — the canonical audio-input layer). Critical infrastructure rather than an optional tool.

## Purpose (one line)

Browser-native graph-based audio processing API with built-in FFT analysis, time-domain inspection, custom DSP via AudioWorklet, and low-latency real-time capability for visualizer + DAW + game-audio applications.

## Rubric scores

### Purpose-fit per priority

| Priority | Score | Why |
|---|---|---|
| 1. Generative art (static + dynamic) | **2 / 5** | Audio-input rarely relevant for non-dynamic art |
| 2. Branding | **1 / 5** | Audio-branding is rare; web-platform audio is rarely the right tool |
| 3. Graphic design | **1 / 5** | Not applicable |
| 4. Music-reactive visualizers | **5 / 5** | **The audio-input layer.** Required infrastructure |

### Paradigm coverage

- ✅ **Rule-based / deterministic**: graph-based audio processing is declarative and predictable.
- ✅ **Iterative / dynamical-systems**: AudioWorklet provides sample-accurate processing each render quantum (128 samples).
- ⚠️ **Stochastic** etc.: not directly relevant — Web Audio is infrastructure, not a generative paradigm itself.

### Autonomy-control fit

**Score: N/A** — Web Audio is infrastructure, applicable at every regime.

### Primitive vocabulary

- ✅ **AudioContext**: the root object; manages the audio graph and timing.
- ✅ **AudioNodes**: oscillators, gain, biquad filter, convolution (reverb), waveshaper (distortion), compressor, panner, delay, channel-splitter / merger.
- ✅ **AnalyserNode**: **the visualizer's core input.** Provides `getByteFrequencyData()` (FFT magnitude in bytes 0–255), `getByteTimeDomainData()` (waveform), `getFloatFrequencyData()` (FFT in dB), with configurable FFT size (32 to 32768).
- ✅ **AudioWorklet**: custom DSP in a dedicated audio thread. Processes per-render-quantum (128 samples at the sample rate). Critical for low-latency processing.
- ✅ **MediaElementAudioSourceNode**: audio from `<audio>` / `<video>` element.
- ✅ **MediaStreamAudioSourceNode**: audio from microphone / WebRTC.
- ✅ **AudioBufferSourceNode**: pre-loaded audio buffer playback (with start/stop scheduling).
- ✅ **OscillatorNode**: built-in oscillators (sine, square, sawtooth, triangle, custom periodic).

### Idiomaticity and LLM-codegen friendliness

**Score: 4 / 5** — solid:

- **Comprehensive documentation** on MDN.
- **Long-established API** (since 2014) — substantial training-data presence.
- **AudioWorklet is newer (2018+)** — slightly less LLM coverage but well-documented.
- **The graph-based mental model** can be unfamiliar; LLMs sometimes miss subtle node-connection patterns.
- **Browser autoplay policy gotchas** (AudioContext must be created/resumed in response to user gesture) — common stumbling block.

### Production-readiness

**Score: 5 / 5** — industry-standard:

- W3C standard since 2014; AudioWorklet 2018.
- Universal browser support (Chrome, Firefox, Safari, Edge).
- Low latency on modern hardware (~5–20 ms depending on browser + OS).
- Used in production: Spotify Web, SoundCloud, BandLab, Splice, hundreds of DAW-style web apps.

## The FFT pipeline for visualizers (the canonical pattern)

The standard music-reactive visualizer audio pipeline:

1. **Get audio source** — `<audio>` element, microphone, or generated audio.
2. **Wrap in source node**: `audioContext.createMediaElementSource(audio)`.
3. **Connect to AnalyserNode**: `source.connect(analyser).connect(audioContext.destination)`.
4. **Configure FFT**: `analyser.fftSize = 2048;` (or 4096, 8192 — power of 2; tradeoff: more bins, more latency).
5. **Read each frame** (in `requestAnimationFrame` loop): `analyser.getByteFrequencyData(buffer);`. Result: `Uint8Array` of FFT magnitudes (0–255), length `analyser.frequencyBinCount` (half the FFT size).
6. **Map to visual parameters**: bass = average of bins 0–10; mids = bins 10–60; treble = bins 60–200; spectral centroid = weighted average position.

This is **the foundational audio→visual pipeline**. Hydra exposes essentially this same API; three.js + shaders can take the FFT array as a texture or uniform; p5.js + p5.sound wraps this.

## Beyond FFT: musical-feature extraction

Raw FFT bins are the floor; better visualizers extract **higher-level features**:

| Feature | What it captures | How to compute |
|---|---|---|
| **Spectral centroid** | "Brightness" of the sound | Weighted mean of FFT bin frequencies |
| **Spectral flatness** | Noise-vs-tonal (white noise = 1; pure tone = 0) | Geometric mean / arithmetic mean of bins |
| **Spectral rolloff** | Frequency below which 85% of energy sits | Cumulative bin energy threshold |
| **Onset detection** | Where new notes begin | Spectral flux: $\sum_i \max(0, \|X_t[i]\| - \|X_{t-1}[i]\|)$ |
| **Beat / tempo** | Rhythmic timing | Onset autocorrelation; libraries: `web-audio-beat-detector`, `meyda` |
| **MFCCs** | Timbral fingerprint | Mel-scale log + DCT; libraries: `meyda`, `essentia.js` |
| **Pitch / fundamental frequency** | Note being played | Autocorrelation; `pitchy` library |

The **meyda** library (Hugh Rawlinson 2014+) is the canonical web-audio feature-extraction layer; it wraps Web Audio API to expose these higher-level features at audio rate.

## AudioWorklet — when raw Web Audio isn't enough

The standard Web Audio nodes run on the **main thread** with `requestAnimationFrame`-resolution timing. For:

- Custom DSP not available as a standard node.
- Sample-accurate timing (DAW-style).
- Low-latency live processing.

Use **AudioWorklet**: register a custom `AudioWorkletProcessor` class; it runs in the dedicated audio thread; processes 128-sample render quanta. This is the modern replacement for the deprecated `ScriptProcessorNode`.

For visualizer purposes, the main use of AudioWorklet is **custom feature extractors** or **audio-rate effects** (granular synthesis, custom filters) whose output drives visualization parameters.

## Compared to direct alternatives

| Alternative | When to prefer it |
|---|---|
| **p5.sound** | If you're in p5.js anyway; wraps Web Audio API with simpler ergonomics. |
| **Tone.js** | DAW-style framework on top of Web Audio. Higher-level scheduling and synthesis. |
| **Howler.js** | Audio playback library for games — focused on play/stop/loop, not analysis. |
| **meyda** | Wrapped Web Audio + feature extraction. Use it on top of Web Audio for visualizers. |
| **essentia.js** | Heavier-weight music-information-retrieval library; more features at higher cost. |
| **Tonal.js** | Music-theory operations (chord recognition, scale generation) on top of analysis. |

For visualizers, the typical stack is: **Web Audio API (raw or via meyda) → feature extraction → three.js/Hydra/p5.js visualization**.

## Use-cases Web Audio excels at

- **Real-time music visualization** (priority 4 — the canonical use case).
- **Live-performance visualizers** (with Hydra or three.js).
- **DAW-style web apps** with sample-accurate processing.
- **Voice-driven interactive art** (with microphone input).
- **Game audio**.

## Use-cases Web Audio is wrong for

- **Pre-rendered animation** (priority 1 static, dynamic-but-not-live): use offline audio analysis (FFmpeg + Python librosa) instead.
- **Non-audio work**: obviously, but worth stating — don't pull Web Audio into a pipeline that doesn't need it.

## Connection to the wiki's framework

Web Audio API is the **audio-input infrastructure** for the [[Cross-Modal Emotion Mapping]] pipeline (music → emotion → visual). Specifically:

1. **Web Audio AnalyserNode** extracts spectral features.
2. **Higher-level features** (centroid, flux, MFCCs, tempo) are derived via meyda or custom code.
3. **Features map to (V, A) coordinates** (Russell-circumplex) via the cross-modal correspondences in [[Cross-Modal Emotion Mapping]].
4. **(V, A) maps to visual structural primitives** ([[Expression as Configuration of Forces]]) via the cross-modal vocabulary table.
5. **Visual primitives render** via three.js / WebGPU / Hydra.

The whole priority-4 pipeline is Web Audio at the input layer.

## Caveats

- **Browser autoplay policies** require AudioContext to be created or resumed in response to user gesture. A common production bug.
- **Sample-rate variation** across devices (44.1kHz vs 48kHz) affects FFT bin frequencies. Always compute bin → Hz from `audioContext.sampleRate`.
- **Mobile performance** is significantly worse than desktop. AnalyserNode + 60fps visualization is fine; AudioWorklet at sample rate can struggle on low-end mobile.
- **Latency** varies by browser and OS — Safari has historically had higher latency than Chrome.

## Related pages

[[Algorithmic Composition]] · [[Library Evaluation Rubric]] · [[Hydra]] · [[three.js]] · [[WebGPU]] · [[p5.js]] · [[Cross-Modal Emotion Mapping]] · [[Russell's Affect Circumplex]] · [[Tools Map]]

## Source

- W3C Web Audio API spec: https://www.w3.org/TR/webaudio/
- MDN Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- MDN AudioWorklet: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
- meyda: https://meyda.js.org/
- Tone.js: https://tonejs.github.io/
- essentia.js: https://mtg.github.io/essentia.js/
- Smus 2013 *Web Audio API*. O'Reilly. (Foundational textbook; still relevant.)
