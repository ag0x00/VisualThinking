---
title: Realtime Pose-to-Visualizer Loop
type: technique
status: developing
tags: [technique, realtime, pose, movenet, webgpu, music-reactive, implementation]
address: c-000220
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Pose Extraction Pipeline]]", "[[Pose-Emotion Dimension Scorer]]", "[[Audio-to-Visual Cross-Modal Mapping]]", "[[Universal Body Language Dimensions]]"]
language: typescript
---

# Realtime Pose-to-Visualizer Loop

Real-time pipeline that combines a **camera-fed pose skeleton** with **audio features** to drive a music-reactive visualizer. The dancer/performer is the input; the visualizer is the output. Targets the user's **priority 4**.

This is the integration page binding [[Pose Extraction Pipeline]] + [[Pose-Emotion Dimension Scorer]] + [[Audio-to-Visual Cross-Modal Mapping]] into a single 60 FPS browser loop.

## Architecture

```
Webcam ──→ MoveNet (TFJS WebGPU) ──→ Pose skeleton ──→ Dimension scorer ──→┐
                                                                            ├─→ Combined params ──→ Renderer (three.js + WebGPU)
Mic ────→ AudioWorklet (Meyda) ───────→ Audio features ──→ Audio→visual ──→┘
```

Two analysis pipelines feeding one renderer. The renderer combines the parameter streams with smoothing and priority logic (e.g., pose-energy multiplies music-energy when both are present).

## Setup

```typescript
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgpu";
import Meyda from "meyda";
import * as THREE from "three";

await tf.setBackend("webgpu");
await tf.ready();

const detector = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet,
  { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
);

const video = document.getElementById("webcam") as HTMLVideoElement;
video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
await video.play();

// Audio
const audioCtx = new AudioContext();
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const source = audioCtx.createMediaStreamSource(stream);
await audioCtx.audioWorklet.addModule("audio-worklet.js");  // see Web Audio API page
const audioNode = new AudioWorkletNode(audioCtx, "audio-features", {
  processorOptions: { bufferSize: 512 }
});
source.connect(audioNode);
```

## MoveNet uses 17 COCO landmarks (not MediaPipe 33)

```typescript
// MoveNet COCO-17 indices
const ML = {
  NOSE: 0,
  L_EYE: 1, R_EYE: 2, L_EAR: 3, R_EAR: 4,
  L_SHOULDER: 5, R_SHOULDER: 6,
  L_ELBOW: 7, R_ELBOW: 8,
  L_WRIST: 9, R_WRIST: 10,
  L_HIP: 11, R_HIP: 12,
  L_KNEE: 13, R_KNEE: 14,
  L_ANKLE: 15, R_ANKLE: 16,
} as const;

// Re-implement dimension scorer for 17-landmark schema — most features carry over directly
function scoreMoveNetDimensions(keypoints: { x: number; y: number; score: number }[]): PoseDimensions {
  // Same algorithm as Pose-Emotion Dimension Scorer; substitute landmark indices
  // Note: MoveNet doesn't supply z; approach/avoidance from z is unavailable
  // Use torso-rotation (shoulder-width / hip-width ratio) as approach proxy instead
  // ...
}
```

If you need the full 33-landmark accuracy of MediaPipe, swap MoveNet for `@mediapipe/tasks-vision` PoseLandmarker — but expect ~2x latency.

## Main loop

```typescript
const visualParams = {
  pose: defaultPoseDimensions(),
  audio: defaultVisualParameters(),
  combined: defaultCombinedParameters(),
};

async function frame(): Promise<void> {
  const t0 = performance.now();

  // 1. Pose
  const poses = await detector.estimatePoses(video, { maxPoses: 1 });
  if (poses.length > 0 && poses[0].score! > 0.3) {
    const skeleton = poses[0].keypoints;
    visualParams.pose = scoreMoveNetDimensions(skeleton);
  }

  // 2. Audio features arrive via AudioWorklet → port message
  // (Handled in onAudioMessage; latest features in `latestAudio`)

  // 3. Combine
  visualParams.combined = combineParameters(visualParams.pose, latestAudio, visualParams.combined);

  // 4. Render
  updateScene(scene, visualParams.combined);
  renderer.render(scene, camera);

  const t1 = performance.now();
  if (t1 - t0 > 33) console.warn(`Frame budget exceeded: ${(t1 - t0).toFixed(1)}ms`);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

## Parameter combiner

```typescript
interface CombinedParameters extends VisualParameters {
  poseDimensions: PoseDimensions;
  // Combined fields that fuse pose + audio
  energy: number;          // multiplicative pose-energy × audio-energy
  expansion: number;       // max of pose-expansion × audio-spread
}

function combineParameters(pose: PoseDimensions, audio: VisualParameters, prev: CombinedParameters): CombinedParameters {
  // Smooth pose dimensions (60 fps → 10 Hz effective sample rate)
  const smoothedPose = {
    approach: lerp(prev.poseDimensions.approach, pose.approach, 0.15),
    expansion: lerp(prev.poseDimensions.expansion, pose.expansion, 0.15),
    upward: lerp(prev.poseDimensions.upward, pose.upward, 0.15),
    stability: lerp(prev.poseDimensions.stability, pose.stability, 0.15),
    energy: lerp(prev.poseDimensions.energy, pose.energy, 0.25),  // energy responds faster
    confidence: pose.confidence,
  };

  return {
    ...audio,
    poseDimensions: smoothedPose,
    energy: clamp(smoothedPose.energy * 0.5 + audio.energy * 0.7 + smoothedPose.energy * audio.energy * 0.3, 0, 1),
    expansion: Math.max((smoothedPose.expansion + 1) / 2, audio.expansion),
    yPosition: smoothedPose.upward * 0.5 + audio.yPosition * 0.5,
    panX: smoothedPose.approach * 0.4 + audio.panX * 0.6,
  };
}
```

## Frame budget for 60 FPS (Michotte 70 ms)

| Stage | Budget |
|---|---|
| MoveNet Lightning inference | ~5-15 ms (with WebGPU backend) |
| Pose dimensions scoring | ~0.5 ms |
| Audio features (via AudioWorklet) | ~5 ms latency, async |
| Audio→visual mapping | ~1 ms |
| Parameter combine | ~0.5 ms |
| Renderer | ~5-15 ms |
| **Total** | **~17-37 ms per frame** |

Headroom: 60 FPS = 16.6 ms/frame, 30 FPS = 33.3 ms/frame. With WebGPU MoveNet + a simple renderer, you can hit 60 FPS; with MediaPipe Holistic + complex renderer, 30 FPS is realistic.

## Performance optimizations

1. **MoveNet Lightning over Thunder**: 3-4x faster, marginally less accurate. For body-language reading, Lightning is fine.
2. **Skip alternate frames for pose**: pose updates at 30 Hz; audio updates at 60 Hz. Pose changes are smooth; this is fine.
3. **WebGPU backend mandatory**: WebGL backend for TFJS is 3-5x slower than WebGPU for pose models in 2026.
4. **AudioWorklet (not ScriptProcessorNode)**: avoid the deprecated ScriptProcessor; it adds 50+ ms latency.
5. **Pre-compile shaders**: use `material.precompile(renderer)` on initialization.
6. **OffscreenCanvas for the visualizer**: optional; offloads renderer from main thread.

## Camera position considerations

- **Full-body framing**: ankles + nose both visible for stability/upward scoring. Hard at standing-distance with phone camera; better with wide-angle.
- **Top-down view** (overhead camera): different skeleton geometry — z-coordinate (depth) becomes height, and approach/avoidance loses meaning. Re-map dimensions.
- **Side view**: contrapposto features mostly invisible; expansion comes from arm-elevation only.

The default assumption is **frontal/three-quarter standing-figure framing**, ~2-4 m from camera.

## Multi-figure handling

For dance-troupe or audience-participation visualizers:

```typescript
const detector = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet,
  { modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING }
);

async function frameMulti(): Promise<void> {
  const poses = await detector.estimatePoses(video, { maxPoses: 6 });
  const dimensionsPerPerson = poses.map(p => scoreMoveNetDimensions(p.keypoints));
  
  // Aggregate: average dimensions, with stability = min (one unstable figure makes the group unstable)
  const agg = aggregateDimensions(dimensionsPerPerson);
  // ... use agg as `visualParams.pose`
}
```

## Edge cases

- **No person detected**: fall back to audio-only mapping. Visualizer continues but loses pose channel.
- **Partial occlusion**: low-visibility landmarks make dimensions noisy. Use `confidence` threshold; below 0.5, weight pose less in combiner.
- **Person walks out of frame**: smooth-decay pose dimensions to neutral over ~1 second; don't snap.
- **Camera not granted**: graceful degradation to audio-only.

## Library recommendations

- **@tensorflow-models/pose-detection** + **@tensorflow/tfjs-backend-webgpu** — primary stack
- **meyda** + AudioWorklet — audio
- **three.js** + WebGPURenderer (Three.js r160+ has stable WebGPURenderer) — primary renderer

## Open research

- **Latency measurement**: verify total camera→render latency under 70 ms on real hardware. Use a strobe LED + microphone tap for objective measurement.
- **Pose dimension validation** on dance video corpora (e.g., AIST++ dance dataset). Do trained dancers' poses score predictably on expansion / energy / upward dimensions vs. amateurs?
- **Genre-specific calibration**: techno (high beat sensitivity) vs. ambient (low) need different `combineParameters` weights.

## Related pages

[[Pose Extraction Pipeline]] · [[Pose-Emotion Dimension Scorer]] · [[Audio-to-Visual Cross-Modal Mapping]] · [[Universal Body Language Dimensions]] · [[Cross-Modal Emotion Mapping]] · [[Web Audio API and AudioWorklet]] · [[Meyda]] · [[TensorFlow.js]] · [[three.js]] · [[WebGPU]] · [[Phenomenal Causality]]

## Sources

- TensorFlow.js pose-detection docs: github.com/tensorflow/tfjs-models/tree/master/pose-detection
- Three.js WebGPURenderer docs: threejs.org
- Meyda real-time audio feature extraction: meyda.js.org
