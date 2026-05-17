---
address: c-000158
title: A-Frame
type: tool
status: developing
tags: [tools, webxr, vr, ar, three, declarative]
created: 2026-05-17
updated: 2026-05-17
verdict: second-class
---

# A-Frame

**One-line purpose:** Mozilla's declarative HTML-based framework for WebXR (VR / AR / mixed-reality) experiences, built on top of [[three.js]]. Lets you write 3D scenes as `<a-scene>` / `<a-entity>` HTML elements with a component-system extension model.

## Why this matters for the wiki

A-Frame is the dominant entry point for **WebXR development** — VR and AR in the browser. With Apple Vision Pro, Meta Quest browser, and improving WebXR support across mobile browsers, immersive web art is increasingly tractable. For the user's priorities, A-Frame is a **second-class** but real option:

- **Priority 1** (generative art): immersive generative art is a real subgenre (Marshmallow Laser Feast, Refik Anadol's immersive rooms). A-Frame is the JS entry point.
- **Priority 4** (music-reactive): immersive music visualizers in VR are a niche but growing application; A-Frame handles WebXR rendering, audio→visual pipeline still requires [[Tone.js]] / [[Meyda]] / [[Strudel]].

## What it does

- Wraps three.js in declarative HTML: `<a-box position="0 1 -3" color="red">`
- Entity-component-system (ECS) architecture for custom behaviors
- Built-in components: `geometry`, `material`, `light`, `camera`, `cursor`, `controls`, `look-controls`, `wasd-controls`, `raycaster`, `text`, `sound`
- WebXR session management: enters/exits VR/AR sessions, manages controllers, hand tracking
- Inspector tool (Cmd-Alt-I in scene) for visual editing

## Install footprint

- `npm install aframe` — ~800KB minified (includes three.js)
- CDN: `<script src="https://aframe.io/releases/1.7.0/aframe.min.js"></script>`
- TypeScript types via `@types/aframe`

## LLM-codegen friendliness

**Medium-high.** The HTML-first API is easy to read and generate. Custom components require JS-class authoring which is more involved but well-documented.

## Maintenance

- v1.7.1 last published 2025-04-01 — active
- 52,026 weekly downloads — solid adoption
- Backed by Mozilla / Meta / Supermedium maintainers
- GitHub: https://github.com/aframevr/aframe — 17k+ stars

## Fit with the four priorities

| Priority | Fit | Notes |
|---|---|---|
| 1. Generative art | Medium | Immersive generative art is a real niche |
| 2. Branding | Low | Some immersive-brand projects exist; mostly bespoke |
| 3. Graphic design | Low | Static deliverables don't apply |
| 4. Music-reactive | Medium | VR music visualizers are a growing subgenre |

## When to choose A-Frame vs alternatives

- **For WebXR specifically:** A-Frame is the standard entry point.
- **For declarative-style 3D without WebXR:** prefer [[react-three-fiber]] (React idiom, larger ecosystem) or three.js directly.
- **For game-engine ergonomics:** Babylon.js or PlayCanvas may suit better.

A-Frame's declarative HTML model is **uniquely good for educational / workshop contexts** because the entry-level code is HTML, not JS. For production WebXR work, many teams write components in JS anyway and the HTML wrapper becomes mostly ergonomic surface.

## What A-Frame doesn't do

- **Not a general 3D framework outside WebXR** — for non-VR 3D, three.js or r3f are usually a better fit.
- **No physics built in** — pair with `aframe-physics-system` or use cannon-es / rapier directly via three.js.
- **No native AI integration** — pair with [[Transformers.js]] for in-browser inference.

## Verdict

**Second-class.** A real category (WebXR) the wiki should cover, but not in the canonical priority-1 stack. Add an entry to [[Tools Map]] noting "use for WebXR; otherwise three.js / r3f."

## Related

- [[three.js]] — the substrate
- [[react-three-fiber]] — declarative alternative for non-XR work
- [[three.js Addon Ecosystem]] — many three.js addons work in A-Frame contexts
- [[Tools Map]]

## Sources

- A-Frame docs: https://aframe.io/
- GitHub: https://github.com/aframevr/aframe
- npm registry, 2026-05-17 (52,026 weekly downloads, v1.7.1)
