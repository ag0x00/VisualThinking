---
title: Audio-to-Visual Cross-Modal Mapping
type: technique
status: developing
tags: [technique, cross-modal, audio, music-reactive, arnheim, expression, implementation]
address: c-000219
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Cross-Modal Emotion Mapping]]", "[[Expression as Configuration of Forces]]", "[[Meyda]]", "[[Web Audio API and AudioWorklet]]"]
language: typescript
---

# Audio-to-Visual Cross-Modal Mapping

The canonical mapping for music-reactive visualizers (the user's **priority 4**): from real-time audio features ([[Meyda]] / [[Web Audio API and AudioWorklet]]) to visual primitives grounded in [[Expression as Configuration of Forces|Arnheim's expressive primitives]] and [[Universal Body Language Dimensions]]. The mapping is designed for the **70 ms cross-modal binding window** (Michotte's causality threshold) so that visual changes feel **caused-by** rather than **correlated-with** the sound.

**Use cases**: Apple Music Visualizer–style real-time visuals, music-driven typography, generative-art live shows, sound-reactive branding installations.

## Mapping table

The core mapping derived from [[Cross-Modal Emotion Mapping]] (Sweep 3) and [[Universal Body Language Dimensions]] (Sweep 6):

| Audio feature | Visual primitive | Arnheim / body-dim correspondence |
|---|---|---|
| **Pitch height** (spectral centroid) | Vertical position / scale-height | Rising / falling (Arnheim); upward (dim 3) |
| **Loudness** (RMS) | Visual energy: amplitude, brightness, motion-velocity | Tension (Arnheim); energy (dim 5) |
| **Spectral spread** | Visual spread: figure-scale, light-radius | Expansion / contraction (Arnheim); expansion (dim 2) |
| **Spectral flatness** | Visual texture: noise vs. clarity | Discord / harmony |
| **Onset / transient** | Visual impulse: flash, scale-burst, shape-emit | Sharp accent (Arnheim) |
| **Beat / tempo** | Pulse: regular motion, color cycle, repetition | Movement, rhythm |
| **Stereo image (L/R balance)** | Horizontal position / camera-pan | Approach / avoidance proxy |
| **Harmonic stability** (key consonance) | Color stability vs. shift | Harmony / dissonance |
| **Chord quality** (major/minor) | Color valence | Warm vs. cool, joy vs. sadness |

## Implementation

```typescript
import Meyda from "meyda";

interface AudioFeatures {
  rms: number;
  spectralCentroid: number;     // Hz
  spectralSpread: number;
  spectralFlatness: number;
  spectralRolloff: number;
  chroma: number[];             // 12 pitch-classes
  energy: number;
  onsetStrength: number;
  bpm?: number;
}

interface VisualParameters {
  yPosition: number;           // -1 (bottom) to 1 (top)
  energy: number;              // 0..1 controls velocity, brightness, motion-amplitude
  expansion: number;           // 0..1 controls scale, radius, openness
  texture: number;             // 0 (smooth) .. 1 (noisy/granular)
  impulse: number;             // 0..1 spike on onset
  beatPhase: number;           // 0..1 within current beat
  panX: number;                // -1 (left) .. 1 (right)
  harmonyValence: number;      // -1 (dissonant) .. 1 (consonant)
  colorValence: number;        // -1 (minor/cool) .. 1 (major/warm)
}

function mapAudioToVisual(audio: AudioFeatures, prev: VisualParameters): VisualParameters {
  return {
    yPosition:       mapPitchToY(audio.spectralCentroid),
    energy:          mapLoudnessToEnergy(audio.rms),
    expansion:       mapSpreadToExpansion(audio.spectralSpread, audio.spectralRolloff),
    texture:         clamp(audio.spectralFlatness * 2, 0, 1),
    impulse:         envelopeFollower(audio.onsetStrength, prev.impulse, 0.05),
    beatPhase:       (prev.beatPhase + (audio.bpm ?? 120) / 60 / 60) % 1,  // assumes 60 fps
    panX:            stereoImageToPan(audio),
    harmonyValence:  chromaToHarmony(audio.chroma),
    colorValence:    chromaToColorValence(audio.chroma),
  };
}
```

### Pitch-to-y

Spectral centroid in Hz → log-scaled y position. Human pitch perception is logarithmic.

```typescript
function mapPitchToY(centroidHz: number): number {
  // 80 Hz → -1 (bottom), 4000 Hz → 1 (top)
  const logHz = Math.log2(Math.max(centroidHz, 80));
  const minLog = Math.log2(80);   // ~6.32
  const maxLog = Math.log2(4000); // ~11.97
  return clamp((logHz - minLog) / (maxLog - minLog) * 2 - 1, -1, 1);
}
```

### Loudness-to-energy

RMS dB → energy. Apply A-weighting or simple log if needed.

```typescript
function mapLoudnessToEnergy(rms: number): number {
  // RMS 0..1 → energy 0..1, with sensitivity to typical music range
  const db = 20 * Math.log10(Math.max(rms, 1e-6));
  // -60 dB → 0; -10 dB → 1
  return clamp((db + 60) / 50, 0, 1);
}
```

### Spread-to-expansion

Spectral spread + rolloff combine into the "expansion" reading.

```typescript
function mapSpreadToExpansion(spread: number, rolloff: number): number {
  // High spread = energy distributed across many frequencies = "expanded"
  // Rolloff (high-freq edge) supports the reading
  const spreadNorm = clamp(spread / 5000, 0, 1);
  const rolloffNorm = clamp(rolloff / 12000, 0, 1);
  return 0.6 * spreadNorm + 0.4 * rolloffNorm;
}
```

### Harmony / valence from chroma

12-bin chroma vector → consonance score (sum of energy in major-triad positions vs. minor / dissonant).

```typescript
function chromaToHarmony(chroma: number[]): number {
  // Major triads: root + maj3 + fifth. Sum these vs. their inversions.
  let major = 0, minor = 0;
  for (let root = 0; root < 12; root++) {
    const maj3 = (root + 4) % 12;
    const min3 = (root + 3) % 12;
    const fifth = (root + 7) % 12;
    major += chroma[root] * chroma[maj3] * chroma[fifth];
    minor += chroma[root] * chroma[min3] * chroma[fifth];
  }
  const total = major + minor + 0.001;
  return (major - minor) / total;
}

function chromaToColorValence(chroma: number[]): number {
  // Simpler: just major-minor balance for color warm/cool
  return chromaToHarmony(chroma);   // same proxy, separate dimension for downstream mapping
}
```

### Onset envelope follower

Onset detection produces spiky signal; smooth into a decay envelope for usable visual impulse:

```typescript
function envelopeFollower(onsetStrength: number, prev: number, decayRate: number): number {
  return Math.max(onsetStrength, prev * (1 - decayRate));
}
```

## Driving the renderer

These parameters drive whatever the visual layer is. Three concrete mappings:

### Mapping 1: Particle system

```typescript
function updateParticles(particles: Particle[], v: VisualParameters): void {
  for (const p of particles) {
    p.velocity.y += -v.energy * 0.5;                       // rising motion with loudness
    p.scale = lerp(p.scale, 1 + v.expansion * 2, 0.1);     // scale with expansion
    p.color = mixColor(palette.cool, palette.warm, (v.colorValence + 1) / 2);
    p.opacity *= 0.95 + v.impulse * 0.05;                   // flash on impulse
    p.noise = v.texture;                                    // displacement noise
  }
}
```

### Mapping 2: Typography on grid

```typescript
function updateKineticType(letters: Letter[], v: VisualParameters): void {
  for (const l of letters) {
    l.weight = lerp(l.weight, 300 + v.energy * 600, 0.2);   // variable-font weight axis 300-900
    l.optical = lerp(l.optical, v.expansion * 1, 0.2);      // optical-size axis
    l.y = lerp(l.y, v.yPosition * 100, 0.3);
    l.color = hslColor(v.colorValence * 60 + 30, 0.7, 0.5);
  }
}
```

### Mapping 3: Three.js scene

```typescript
function updateScene(scene: THREE.Scene, v: VisualParameters): void {
  scene.fog.near = lerp(scene.fog.near, 1 + v.expansion * 20, 0.2);
  ambientLight.intensity = v.energy * 2;
  camera.position.x = lerp(camera.position.x, v.panX * 5, 0.2);
  camera.position.y = lerp(camera.position.y, v.yPosition * 3, 0.2);
  shaderUniforms.uTexture.value = v.texture;
  shaderUniforms.uPulse.value = v.impulse;
}
```

## Latency budget (Michotte 70 ms)

> [!warning] Real-time visualizers must respect the 70 ms cross-modal binding window
> Per [[Phenomenal Causality]] and Arnheim Sweep 3 findings, audio→visual latency above ~70 ms breaks the perceptual causal binding — the visual stops feeling caused-by the sound and starts feeling correlated-with. Budget breakdown:
>
> - **AudioWorklet** processing: ~5-15 ms (block size + analysis)
> - **Cross-modal mapping**: ~1 ms (pure math)
> - **Renderer frame budget**: <50 ms (~30 FPS minimum, ~16 ms preferred)
> - **Display latency**: ~5-20 ms (browser compositor + monitor)
>
> **Total typically 30-80 ms** — within budget if the renderer keeps frame time low. If close to budget, use [[Web Audio API and AudioWorklet|AudioWorklet]] (not ScriptProcessor) for audio analysis; the difference is 10-20 ms.

## Library stack

- **[[Meyda]]** — audio feature extraction. ~150 KB; can run in AudioWorklet.
- **[[Web Audio API and AudioWorklet|AudioWorklet]]** — audio processing on dedicated thread.
- **[[Tone.js]]** — alternative or wrapper; ~280 KB; includes feature extraction.
- **[[WebGPU]]** + **[[three.js]]** or **[[react-three-fiber]]** — recommended renderer stack for priority 4.
- For typography: **fontkit** for variable-font axis access; CSS `font-variation-settings` for browser-native.

## Calibration

The mapping is opinionated but every parameter range is calibrate-against-music. Calibration pass:

1. Play a varied playlist (10 tracks across genres) through the visualizer.
2. Record the value distribution of each `VisualParameters` field.
3. Adjust input scaling so each output spans most of its 0..1 (or -1..1) range across the playlist.
4. Verify edge cases: silence → low everything; pure tone → tight chroma; noise → high spread and texture.

## Cross-cultural validity

> [!note] Cross-modal mappings have universal substrate + cultural overlay
> Per [[Cross-Modal Emotion Mapping]] and the recurring [[Cultural Variability in Body Language|universal substrate + cultural overlay]] pattern:
> - **Pitch-height** mapping is universal (high-pitch → up, low-pitch → down).
> - **Major/minor → warm/cool color** is **culturally Western**. Many non-Western tonal systems don't have major/minor as primary affective categories. For non-Western music, use **mode-specific palettes** rather than major/minor.
> - **Tempo → energy** is universal.
> - **Loudness → visual intensity** is universal.

## Open research

- **Per-genre adaptive mapping**: house/techno emphasize beat-pulse; ambient music emphasizes spread/texture; classical emphasizes pitch-height variation. A genre classifier ahead of the mapping would let it adapt.
- **Inverse mapping**: visual-features → audio-synthesis for cross-modal-driven music generation. Probably not the user's priority 4 use case but related.
- **70 ms validation**: measure actual AudioWorklet → WebGPU frame latency on real hardware. Open thread from Arnheim Sweep 3.

## Related pages

[[Cross-Modal Emotion Mapping]] · [[Expression as Configuration of Forces]] · [[Phenomenal Causality]] · [[Meyda]] · [[Web Audio API and AudioWorklet]] · [[Tone.js]] · [[WebGPU]] · [[three.js]] · [[Realtime Pose-to-Visualizer Loop]] · [[Op-Art and Cross-Modal Rhythm]] · [[Universal Body Language Dimensions]]

## Sources

- Spence, C. (2011). Crossmodal correspondences: A tutorial review. *Attention, Perception, & Psychophysics* 73, 971–995.
- Michotte, A. (1963). *The Perception of Causality*. Basic Books.
- Meyda documentation: meyda.js.org
- Arnheim, R. (1974). *Art and Visual Perception*.
