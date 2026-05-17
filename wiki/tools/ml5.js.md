---
address: c-000155
title: ml5.js
type: tool
status: developing
tags: [tools, ai, ml, browser, p5, processing]
created: 2026-05-17
updated: 2026-05-17
verdict: second-class
---

# ml5.js

**One-line purpose:** "Friendly machine learning for the web" — a Processing/p5.js-tradition wrapper over [[TensorFlow.js]] (and increasingly [[Transformers.js]]) that exposes ML capabilities through a small, beginner-accessible API.

## What it does

ml5.js sits above TF.js and provides one-call access to:

- **Image classification** — MobileNet (and friends)
- **Pose estimation** — wraps TF.js's MoveNet / PoseNet
- **Hand pose / face mesh** — MediaPipe wrappers
- **Object detection** — COCO-SSD, YOLO variants
- **Sound classification** — Teachable Machine sound models
- **Word embeddings** — Word2Vec via JS
- **Style transfer** — neural style transfer (the 2015-era kind)
- **Image generation** — DCGAN sample-from-model, pix2pix
- **Custom model training** — small models on user data, lightweight transfer-learning

Recent (v1.x) updates added some Transformers.js-backed pipelines, gradually modernizing the stack.

## Why this matters for the wiki

ml5.js is the **bridge between the [[Practice-led Studio Research|Processing-school]] tradition and the [[AI Art and Latent Space|AI-art framing]]**. It's the standard ML library used in:

- NYU ITP / Tisch — Daniel Shiffman's *Coding Train* curriculum
- Art-school creative-coding courses internationally
- Workshop / hackathon contexts where Processing-style ergonomics matter

The 8-maintainer team includes NYU and p5.js community members; the library is deliberately *pedagogical-first*. For the user's priorities, ml5.js is best understood as **the on-ramp for ML in the practice-led tradition**, not the production tool.

## Install footprint

- `npm install ml5` — ~2-5MB depending on which models are loaded
- CDN: `<script src="https://unpkg.com/ml5@1/dist/ml5.min.js"></script>`
- Loads TF.js (and increasingly Transformers.js) lazily as needed

## LLM-codegen friendliness

**High** for the basics — the API is minimal:

```javascript
const classifier = ml5.imageClassifier('MobileNet', modelReady);
classifier.classify(img, gotResult);
```

The simplicity comes at a cost: opinionated, narrow defaults. For anything beyond the curated set of models, drop down to TF.js or Transformers.js directly.

## Maintenance

- v1.3.1, last published 2025-11-24 — active
- 8 maintainers from NYU + p5.js community
- Steady update cadence
- GitHub: https://github.com/ml5js/ml5-next-gen (v1 is a substantial rewrite)
- 2,599 weekly downloads (small but consistent)

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | Medium | Pedagogical / workshop tier; for production use Transformers.js |
| 2. Branding | Low | Production work needs lower-level ML control |
| 3. Graphic design | Low-medium | Useful for prototyping/experimentation in the Processing tradition |
| 4. Music-reactive | Medium | PoseNet wrapper makes ml5 a clean choice for body-tracking music-reactive installations |

## Where ml5.js shines

- **Workshops, education, prototyping** — beginner-friendly, low boilerplate
- **Coding Train compatibility** — students arriving from Shiffman's tutorials know ml5
- **Body / pose / hand tracking** — the MediaPipe wrapper is one-line; better than calling TF.js directly
- **Practice-led / studio research context** — fits naturally into [[p5.js]] sketches

## Where to drop to lower-level libraries

- For state-of-the-art diffusion / large transformer models → [[Transformers.js]]
- For custom training, non-transformer architectures → [[TensorFlow.js]]
- For production deployment with tight bundle-size requirements → drop ml5

## Verdict

**Second-class** — useful in education, workshops, and Processing-tradition projects; not the right primary tool for ambitious AI-art work. Pair with [[p5.js]] or [[q5.js]] for the canonical Processing-school setup.

If you're already in the [[Practice-led Studio Research]] / Processing tradition and want ML capabilities without leaving the sketch metaphor, ml5 is the right tool. Otherwise prefer [[Transformers.js]] directly.

## Related

- [[Transformers.js]] — the more-capable lower-level alternative
- [[TensorFlow.js]] — the substrate ml5 builds on
- [[p5.js]] — the natural Processing-school pairing
- [[Practice-led Studio Research]] — the framing this tool serves
- [[Tools Map]] · [[AI Art Toolkit Map]]

## Sources

- ml5.js docs: https://ml5js.org/
- GitHub: https://github.com/ml5js/ml5-next-gen
- npm registry, 2026-05-17 (2,599 weekly downloads, v1.3.1)
