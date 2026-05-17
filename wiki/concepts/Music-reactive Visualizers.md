---
title: Music-reactive Visualizers
type: concept
status: developing
tags: [concept, hub, music-reactive, priority-4, application]
address: c-000224
created: 2026-05-17
updated: 2026-05-17
---

# Music-reactive Visualizers

The user's **priority 4** application area: real-time generative visuals responding to music or sound, in the lineage of Apple Music Visualizer, Winamp Milkdrop, Fukowski projections, and live-coded performance visuals (TouchDesigner, Hydra, Resolume).

This is a **hub page**. The wiki has accumulated concepts, tools, and techniques across multiple sweeps that all serve music-reactive work; this page maps them.

## The stack

### Theoretical foundations

- [[Cross-Modal Emotion Mapping]] — how audio features bind to visual primitives via Arnheim-style expressive primitives. The systematic map from sound to image.
- [[Op-Art and Cross-Modal Rhythm]] — visual-rhythm theory; audio-visual binding within the **70 ms** [[Phenomenal Causality|Michotte causality threshold]].
- [[Phenomenal Causality]] — the 70 ms cross-modal binding window that bounds the latency budget.
- [[Universal Body Language Dimensions]] — when the visualizer includes a performer/dancer, the 5 dimensions parameterize the figural channel.
- [[Expression as Configuration of Forces]] — Arnheim's expressive primitives (expansion/contraction, rising/falling, approach/withdrawal, tension/relaxation).

### Tools layer

- [[Web Audio API and AudioWorklet]] — low-latency audio processing in the browser.
- [[Meyda]] — real-time audio feature extraction (RMS, spectral centroid, chroma, onset, MFCC).
- [[Tone.js]] — synthesis + scheduling + audio-graph DSL; can wrap Meyda.
- [[Strudel]] — JS port of TidalCycles; live-coding music + visuals.
- [[Hydra]] — live-coded visual synthesizer; canonical music-reactive renderer.
- [[WebGPU]] — high-throughput GPU rendering target.
- [[three.js]] / [[react-three-fiber]] — 3D scene-graph rendering.
- [[TensorFlow.js]] / [[Pose Extraction Pipeline]] — if the visualizer reads a performer.
- [[WGSL Tooling]] — for hand-authored WebGPU shaders.

### Technique layer (operational recipes)

- [[Audio-to-Visual Cross-Modal Mapping]] — the canonical mapping from audio features to visual parameters, with 70 ms latency budget breakdown.
- [[Realtime Pose-to-Visualizer Loop]] — full performer + audio pipeline (MoveNet + AudioWorklet + WebGPU).
- [[Pose-Emotion Dimension Scorer]] — performer-emotion readout that feeds the renderer.
- [[Symmetry-Group Pattern Generator]] — kaleidoscope-style symmetry-driven generative visuals.

## Recommended default stack

For a 2026 browser-based music-reactive visualizer with priority 4 alignment:

```
@mediapipe/tasks-vision (optional, if performer-driven)
@tensorflow/tfjs-core + tfjs-backend-webgpu (optional, for MoveNet)
meyda + AudioWorklet (audio features)
three.js with WebGPURenderer  OR  raw WebGPU + WGSL  OR  Hydra (for live-coded)
@anthropic-ai/sdk (optional, for VLM-rate feedback in development)
```

Latency budget per frame (60 FPS target):
- AudioWorklet feature extraction: ~5-15 ms
- Pose extraction (if used): ~5-15 ms
- Mapping math: ~1-2 ms
- Renderer: ~5-15 ms
- **Total**: ~17-50 ms — comfortably inside Michotte 70 ms.

## Established design patterns

| Pattern | Reference page |
|---|---|
| Audio features → visual parameters | [[Audio-to-Visual Cross-Modal Mapping]] |
| Pitch height → vertical position | Universal cross-modal correspondence |
| Loudness → visual energy | Universal |
| Major/minor → warm/cool color | **Western only** (per [[Cross-Modal Emotion Mapping]] cross-cultural section) |
| Onset → impulse / flash | Standard since Milkdrop |
| Beat → pulse / periodic motion | Genre-dependent prominence |
| Pose-energy × music-energy combiner | [[Realtime Pose-to-Visualizer Loop]] |

## Cultural-validity flag

> [!note] Per `feedback_cross-cultural-validity`
> Cross-modal mappings have **universal substrate + cultural overlay**:
> - Universal: pitch/loudness/tempo → visual energy/position/velocity
> - Western-specific: major-minor → warm-cool, common-time pulse expectations
> - Non-Western music traditions may need mode-specific palettes and rhythm-cycle handling

## Open research

- **Verify 70 ms latency** on real hardware: AudioWorklet event → WebGPU rendered frame timing (open thread from Arnheim Sweep 3).
- **Genre-adaptive mapping**: different mapping weights for house / ambient / classical / experimental.
- **Cross-modal expressive-vocabulary calibration** against a music-album-cover dataset.
- **Pose-energy × music-energy combiner**: calibration across dance corpora; how does pose-energy weight against music-energy?
- **Live-coding workflow with Strudel + Hydra**: pure-JS pipeline that runs in browser tabs without native installs.

## Sample references (genre survey)

- **Winamp Milkdrop** (2001+) — the canonical 2D shader-driven music visualizer. Source of many enduring tropes (radial pulse, audio-modulated displacement).
- **Apple Music Visualizer** — minimalist branding-aware visualizer; flow-field aesthetics.
- **Resolume / TouchDesigner / VDMX** — node-based live VJ tools; not browser but informative for graph-based approaches.
- **Hydra (live-coded)** — Olivia Jack 2017+; JS browser-native live coding for music visuals.
- **Pussy Riot Riot Days, Holly Herndon's PROTO live shows** — AI-aware music visualizers.

## Related pages

[[Audio-to-Visual Cross-Modal Mapping]] · [[Realtime Pose-to-Visualizer Loop]] · [[Cross-Modal Emotion Mapping]] · [[Op-Art and Cross-Modal Rhythm]] · [[Phenomenal Causality]] · [[Meyda]] · [[Web Audio API and AudioWorklet]] · [[Tone.js]] · [[Strudel]] · [[Hydra]] · [[WebGPU]] · [[three.js]] · [[Pose Extraction Pipeline]] · [[Universal Body Language Dimensions]] · [[Expression as Configuration of Forces]]

## Sources

- See referenced pages for primary sources. Olivia Jack, *Hydra*: hydra.ojack.xyz. Strudel: strudel.cc.
