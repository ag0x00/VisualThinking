# Plan: vigorous, varied sumi strokes → a small abstract image (one painter)

## ⟢ Resume state (for after context compaction)
- **Status:** plan written, **NOT yet approved/implemented**. Next action: get user approval, then implement steps 1–7 below. Working tree clean.
- **Repo:** `/Users/ag/Lab/VisualThinking`, branch `research-ink-animation`. Latest commit `f3e45cd` (wetness fix + clear-water-stroke count dial).
- **The artifact:** `screensaver/ink-metal/main.swift` — a native macOS **Metal** (Swift, runtime-compiled shaders) sumi ink-on-paper screensaver. Build `./build.sh`; run `./inkspike` (GUI controls window) or `./inkspike --headless N out.png [--waterN=N --wet=X --speed=X]` (renders a PNG + prints a composition scorecard). Verify by reading the PNG.
- **What already works (committed):** LBM/MoXi ink-on-paper; calligraphic Bézier strokes (three-phase pressure, centre/side-tip, five-tone ink, organic flying-white); painting **lifecycle** paint→wait→dry(freeze)→red accent→hold→fade→reset; **dry paper = crisp** (ink self-water tiny, bleed only from clear-water strokes); wetness-gated pigment **diffusion** (ink-merge); two registers (工筆 gongbi default / 寫意 xieyi via `--xieyi`); a **ControlPanel** GUI (register, red on/off, wet-area size, clear-water strokes 0–5, avg speed, stroke length, hold s) snapshotted at each reset.
- **Process:** follow [[Build Working Loop]] (`wiki/meta/Build Working Loop.md`); memory `feedback_build-working-loop`, `feedback_commit-after-big-updates`, `project_ink-water-spike`. Wiki page to update: `wiki/concepts/Chinese Brushwork Principles.md` (c-000243).
- This plan was produced by consulting the wiki + researching brush dynamics (findings below).

## Context
The ink screensaver works but reads too uniform, too watery, and not vigorous enough; strokes also
overlap in time. The user reframed the **goal**: *one painter* lays a **small number of VARIED
strokes** (hard thin black lines, gray background tones, vigorous dry strokes, a red accent) that
compose a **vaguely abstract image** — "write the meaning" (xieyi), solid vs. void. This is a build
task; per the Build Working Loop I consulted the wiki and researched brush dynamics first.

## What the wiki + research gave (step 2–3)
- Wiki: `Chinese Brushwork Principles` (three-phase 起笔/行笔/收笔, bone method, centre/side tip,
  五色, flying-white), `Directed Tension`, `Organic vs Mechanical Motion`, `Ma and Yohaku no Bi`.
- Research + user's notes (Asian Art Museum "Vocabulary of Dots"; fei bai = *fast + low moisture*):
  - **Speed↔moisture↔value are coupled** — the engine of vigor. Slow+saturated → dark/wet/bleeding;
    fast+dry → flying-white/light.
  - **Five shades = five stroke TYPES**: 焦 charred (dense, shiny, sharp thin emphasis) · 浓 dark
    (solid structure) · 淡 light (soft gray wash) · 湿 wet (saturated, bleeding) · 枯/dry (crusty,
    flying-white).
  - **Side-ink / edge-loading** → tonal gradation within one stroke (already approximated by depletion).
  - **Splatter / 潑墨 pomo** — droplets flicked off a loaded/vigorous brush, esp. at landing & fast turns.
  - **Brush landing + drag (起笔)** — a press/splat that then drags (heavy head → taper).
- Step 6 deliverable: expand `Chinese Brushwork Principles` with this *physical-dynamics* layer
  (speed↔moisture coupling, five shades as archetypes, edge-loading, splatter/pomo, brush-landing).

## Implementation — all in `screensaver/ink-metal/main.swift` (+ deposit shader)

### 1. One painter (sequential strokes)
Replace the burst scheduler in `spawnStrokes()` (`.painting` case): spawn the next black stroke only
when `strokes.isEmpty` (current one finished) **and** a short "breath" pause has elapsed. Drop
`burstLeft`. One stroke draws at a time, start-to-finish, like a single hand.

### 2. Stroke archetypes (五色 → types) + a varied per-painting palette
Add `enum Kind { thinLine, dark, grayWash, vigorousDry }` to `Stroke`; `spawnOneStroke` builds a
*plan* of kinds at painting start (in `resetPainting`) — e.g. compose `[grayWash?, thinLine, dark,
vigorousDry?]` shuffled, sized to `strokeCount` — and pops one per spawn. Per-kind params:
| Kind (shade) | character |
|---|---|
| `thinLine` (焦 charred) | thin, very dark, even, crisp, **fast**, centre-tip, no bleed — the "bone" |
| `dark` (浓) | medium, solid black, confident, slight flying-white |
| `grayWash` (淡) | **broad, pale gray**, low pressure, side-tip, soft — a background tone; drawn FIRST (under the blacks) |
| `vigorousDry` (枯) | **fast, low-moisture, strong flying-white + splatter**, strong entry, high curvature |
Draw order: grays first (background), blacks over, red last → layered abstract image.

### 3. Less watery / solid blacks
Default `diff` (pigment diffusion) down (0.14→~0.06) and keep it wet-gated; blacks deposit ~0 water
(already 0.004) so they stay crisp/solid. `grayWash` keeps a little softness. Net: blacks read solid
and dark, not watery; softness reserved for grays and wet areas.

### 4. Vigor
Higher default speed for `dark`/`vigorousDry`; more flying-white (raise `fw` for dry); stronger
curvature (`reg.curve`) and a pressure "snap" (sharper entry accent + faster exit) for vigorous
kinds; keep `thinLine` clean. Add a **Vigor** dial scaling speed + flying-white + curvature + splatter.

### 5. Splatter (+ basic brush-landing splat & drag)
New per-stroke `splatter` amount (high for `vigorousDry`, a burst at the **landing**). In the deposit
loop, when `splatter>0`, stamp a few **tiny specks** (radius ~1–2px, dark, no water, channel 0) at
jittered offsets biased along the flick/perp direction, with extra at age≈0 (the 起笔 landing splat)
and at fast turns. The landing also uses a **heavier entry press** (a splat head that drags) for
vigorous kinds — the "initial brush splat dragging ink across paper." (Full edge-loaded splat-drag
is a follow-up; this is the first cut.)

### 6. GUI dials (extend `ControlPanel`)
Add **Splatter** and **Vigor** sliders (0–1). Keep existing dials. All snapshot at reset (unchanged).

### 7. Wiki (step 6)
Expand `wiki/concepts/Chinese Brushwork Principles.md` with a **Physical dynamics** section
(speed↔moisture↔value, five shades as stroke archetypes, edge-loading, splatter/pomo, brush-landing)
+ sources; update `wiki/log.md`. (Closes the research loop.)

## Verification
- `./build.sh`; headless renders at a few frame counts + `--waterN`/`--speed` overrides → eyeball:
  strokes are **sequential**, **varied** (thin black lines + gray tone + vigorous dry), blacks
  **solid not watery**, visible **splatter** near vigorous strokes, composition restrained (lots of
  void), red accent intact. Scorecard negative-space still 30–70%.
- Launch live; try the new Splatter/Vigor dials; confirm one-painter pacing.
- Commit (commit-after-big-updates).

## Files
- `screensaver/ink-metal/main.swift` (+ deposit kernel) — scheduler, archetypes, vigor, splatter, GUI
- `wiki/concepts/Chinese Brushwork Principles.md` + `wiki/log.md`
- `screensaver/ink-metal/README.md`
