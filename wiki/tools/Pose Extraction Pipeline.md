---
title: Pose Extraction Pipeline
type: tool
status: developing
tags: [tools, pose-estimation, mediapipe, ml, body-language, computer-vision]
address: c-000209
created: 2026-05-17
updated: 2026-05-17
sweep: body-language-depth
---

# Pose Extraction Pipeline

The toolchain for extracting human pose skeletons from images / video. This is the **input layer** for body-language evaluation pipelines — feeding the dimensional / contrapposto / cultural-emblem scoring described in [[Universal Body Language Dimensions]], [[Contrapposto and Pose Canons]], and [[Cultural Variability in Body Language]].

This page surveys the **2026 state** of pose-estimation models with explicit JS/TS-first orientation per `feedback_language-preference`. Comparison table at top, deep notes per tool below.

## Comparison

| Tool | Landmarks | JS/TS access | Latency (browser) | Strengths | Weaknesses |
|---|---|---|---|---|---|
| **MediaPipe Tasks** (Google) | 33 (Pose), 21 hand, 478 face | First-class JS API (`@mediapipe/tasks-vision`); WebGL/WebGPU acceleration | ~15–30 ms / frame on mid laptop | Mature, multi-platform, well-documented, includes hand + face landmarkers | Single-person default; multi-person via separate detection |
| **MoveNet Lightning / Thunder** (Google) | 17 (COCO) | Via [[TensorFlow.js]] (`@tensorflow-models/pose-detection`) | Lightning: ~5–10 ms; Thunder: ~20–40 ms | Fastest in-browser option (Lightning); good for music-reactive realtime | Fewer landmarks; less accurate than MediaPipe Holistic |
| **BlazePose GHUM 3D** (via MediaPipe) | 33 with 3D coords + visibility | Via MediaPipe Tasks | ~30–60 ms | Includes **z-depth** estimate per landmark; better for contrapposto z-axis | 3D is monocular-estimated — accurate-relative, not metric |
| **RTMPose** (OpenMMLab, 2023) | Configurable (17, 26, 133) | Python primary; ONNX export usable via [[Transformers.js]] / `onnxruntime-web` | ~30–80 ms via onnxruntime-web | Top accuracy class as of 2026; supports whole-body (133 landmarks incl. face + hands) | More setup; bigger model |
| **Sapiens** (Meta, 2024) | 308 (whole-body high-density) | Python primary; partial web via ONNX | Heavy — desktop GPU class | State-of-the-art accuracy on dense pose; foundation-model approach | Too heavy for realtime browser; cloud-inference territory |
| **YOLO-NAS Pose / YOLOv8-pose** | 17 (COCO) | Via [[Transformers.js]] / `onnxruntime-web` | ~20–50 ms | Multi-person out of the box; integrated detection + pose | Box-then-pose pipeline; less accurate on close interactions |
| **OpenPose** (CMU, 2017) | 25 body, 21 hand, 70 face | C++ primary; web port via ONNX possible | Heavy; legacy | Historical reference; widely cited | Superseded by MediaPipe / RTMPose for production. **Historical / not recommended for new 2026 projects** unless you need exact reproducibility of a 2017–2020 paper. |
| **PoseNet** (Google, 2018) | 17 (COCO) | TensorFlow.js | ~30 ms | Original in-browser pose; well-known | **Effectively deprecated** by MoveNet. Use MoveNet instead. |

## Recommended stacks

### For browser-realtime music-reactive visualizers (priority 4)

**MoveNet Lightning + TensorFlow.js**. Lowest latency, 17 landmarks sufficient for limb-driven visualizer mapping. Pair with [[Web Audio API and AudioWorklet]] for audio side. See [[Meyda]] for audio features.

```
@tensorflow/tfjs-core + @tensorflow/tfjs-backend-webgpu + @tensorflow-models/pose-detection (MoveNet variant)
```

### For browser-realtime body-emotion classification (research-grade)

**MediaPipe Tasks PoseLandmarker (full / heavy variant)** with the 33-landmark GHUM 3D output. Higher accuracy than MoveNet, includes z-coordinate for contrapposto reading, includes visibility per landmark.

```
@mediapipe/tasks-vision (PoseLandmarker, HandLandmarker, FaceLandmarker)
```

The three landmarkers together cover the full body-emotion + gesture + face channel — for figurative scoring against [[Universal Body Language Dimensions]] + [[Configural Face Processing]].

### For generative-art evaluation pipelines (offline)

**RTMPose 26 or 133** via Python (or ONNX → onnxruntime-web for browser-batch processing). Higher accuracy; useful for scoring a generated-image batch against pose-feature targets.

Or escalate to **Sapiens** when accuracy matters more than cost.

### For multi-person scenes

**YOLOv8-pose** or **MediaPipe Tasks Pose Detector + per-person PoseLandmarker** pipeline.

## Implementation notes (queued)

> [!note] Reading-only sweep convention (per `feedback_implementation-in-sweeps`)
> Per the queued **Implementation-notes pass** (Sweep 7), code-level integration recipes live in `wiki/techniques/`. This page documents *what to use* and *why*; the *how* belongs in techniques pages spun up in the implementation-notes pass.

What the implementation pass will need to produce, in order:

1. `wiki/techniques/Computing-Body-Language-Dimensions.md` — pseudocode pseudocode for the 5 dimensions from a 33-landmark skeleton.
2. `wiki/techniques/Contrapposto-Score.md` — pseudocode for the 6-feature contrapposto score from [[Contrapposto and Pose Canons]].
3. `wiki/techniques/Cultural-Emblem-Detector.md` — pose + hand landmark patterns for high-risk emblems (thumbs-up, OK-sign, V-back-of-hand).
4. `wiki/techniques/Realtime-Pose-To-Visualizer.md` — MoveNet → audio-feature-modulated rendering loop.

## npm/GitHub audit (per `feedback_catalog-stub-cross-check`)

Top npm packages keyed `pose`, `mediapipe`, `pose-estimation` as of 2026-05:

| Package | Weekly downloads | Verdict |
|---|---|---|
| `@mediapipe/tasks-vision` | ~95k | First-class. Already in the stack. |
| `@tensorflow-models/pose-detection` | ~28k | First-class. MoveNet entry point. |
| `@tensorflow/tfjs` | ~315k | Underlying. See [[TensorFlow.js]]. |
| `@mediapipe/pose` | ~80k | **Legacy** (pre-Tasks API). Use `tasks-vision` instead. |
| `onnxruntime-web` | ~120k | Required for RTMPose / YOLO-pose via ONNX. |
| `@xenova/transformers` / `@huggingface/transformers` | ~1.1M | For Sapiens / RTMPose if exported. See [[Transformers.js]]. |
| `kalidokit` | ~3k | Mocap-to-VRM helper — converts MediaPipe / TFJS landmarks into VRM/Live2D rig parameters. Useful for figurative avatar pipelines. |

GitHub repos worth knowing about (not on npm but production-relevant):
- `google-ai-edge/mediapipe` — upstream MediaPipe.
- `tensorflow/tfjs-models` — pose-detection model implementations.
- `open-mmlab/mmpose` — RTMPose home (Python primary).
- `facebookresearch/sapiens` — Sapiens (Python primary, partial export tools).

No major mid-2025 / early-2026 surprises in npm-package ecosystem; MediaPipe Tasks and TFJS pose-detection are the dominant two for JS/TS workflows. The substantive frontier is RTMPose / Sapiens accuracy via ONNX export rather than new JS-native libraries.

## Pose-data formats and interop

| Format | Source | Use |
|---|---|---|
| **MediaPipe 33-landmark** | MediaPipe Tasks | The wiki's default. Includes visibility per landmark. |
| **COCO 17-keypoint** | MoveNet, OpenPose body, YOLO-pose | Smaller, faster, ecosystem-standard. |
| **Halpe 26 / 136** | RTMPose Halpe models | Body + hands + face in one. |
| **SMPL / SMPL-X** | Body-mesh models (Sapiens etc.) | Full 3D body mesh, not just landmarks; for rendering and physics. |
| **BVH** | Mocap files | Animation-pipeline standard. |
| **VRM** | VRM Consortium | Avatar standard; well-supported by Kalidokit. |

For the wiki's purposes (body-language scoring on generated-figure imagery), **33-landmark MediaPipe** is the most useful default — enough landmarks for dimensional + contrapposto scoring, with visibility scores to handle occlusion in stylized imagery.

## Verdict and priority for the four applications

| Priority | Stack |
|---|---|
| **1. Generative art** | MediaPipe Tasks for figure-evaluation in pipelines; RTMPose-via-ONNX for higher-accuracy offline batch scoring. |
| **2. Branding** | MediaPipe Tasks Pose + Hand + Face for executive-photo / brand-photo emblem-and-pose audit. |
| **3. Graphic design** | Optional; only when evaluating editorial / fashion imagery against pose-feature targets. |
| **4. Music-reactive visualizers** | MoveNet Lightning if user-camera-driven avatars are part of the design; otherwise not needed. |

## Cross-cultural validity flag

> [!warning] Pose-estimation model training bias
> All major pose-estimation models are trained on **WEIRD-dominant datasets** (COCO, MPII, Halpe). Performance degrades for:
> - Clothing-heavy poses (saris, hijabs, long traditional dress) — occlusion handling suffers
> - Non-standard standing postures common in some indigenous and Asian sitting / kneeling traditions
> - Group photos with high-density occlusion
> - Stylized figures (anime, comics, classical sculpture imagery) — landmark hallucination is common
>
> Validate any pose-extraction pipeline on the target-domain imagery before relying on dimension scores. Generated figurative imagery in particular often produces malformed skeletons (extra limbs, impossible angles) that propagate as noise to downstream scores.

## Related pages

[[Universal Body Language Dimensions]] · [[Contrapposto and Pose Canons]] · [[Cultural Variability in Body Language]] · [[de Gelder's Whole-Body Emotion Perception]] · [[Body Language and Pose Semantics]] · [[TensorFlow.js]] · [[Transformers.js]] · [[Web Audio API and AudioWorklet]] · [[Tools Map]] · [[ml5.js]]

## Sources

- MediaPipe documentation: developers.google.com/mediapipe/solutions/vision
- TensorFlow.js pose-detection: github.com/tensorflow/tfjs-models/tree/master/pose-detection
- Bazarevsky et al. (2020). BlazePose: On-device real-time body pose tracking. arXiv:2006.10204.
- Jiang et al. (2023). RTMPose: Real-Time Multi-Person Pose Estimation based on MMPose. arXiv:2303.07399.
- Khirodkar et al. (2024). Sapiens: Foundation for Human Vision Models. Meta AI. arXiv:2408.12569.
- Cao et al. (2019). OpenPose: Realtime Multi-Person 2D Pose Estimation. *IEEE TPAMI*. (Historical reference.)
