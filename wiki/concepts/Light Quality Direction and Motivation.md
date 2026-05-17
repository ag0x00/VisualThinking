---
address: c-000177
title: Light Quality Direction and Motivation
type: concept
status: developing
tags: [concepts, light, cinematography, photography, quality, direction]
created: 2026-05-17
updated: 2026-05-17
---

# Light Quality, Direction, and Motivation

The **three orthogonal axes** of lighting design beyond the three-point template: **quality** (hard ↔ soft), **direction** (front, side, back, top, bottom, 3/4), and **motivation** (motivated, practical, unmotivated). Any lit scene combines a (quality, direction, motivation) triple per light source; the combination determines the mood and read.

## Axis 1: Light quality (hard ↔ soft)

**Quality** is a function of the light source's **apparent angular size relative to the subject**:

- **Small angular size** (sun, single bare bulb, hard spot) → **hard light**. Sharp shadow edges, high contrast, texture-revealing.
- **Large angular size** (overcast sky, large softbox, bounced light) → **soft light**. Diffuse shadows, low contrast, texture-hiding.

Same intensity, same direction — completely different read. The variable that controls quality is **the diffuser** (softbox, scrim, white-card bounce, light-tent).

| Quality | Examples | Mood |
|---|---|---|
| Hard | Direct sun, single bulb, hard spot | Dramatic, harsh, "noir," "documentary," reveals texture |
| Medium | Indirect sun, small softbox | Standard portrait |
| Soft | Overcast sky, large softbox, bounced from white wall | Beauty, glamour, fashion, "gentle" |
| Ultra-soft | Multi-bounce, light tent, full overcast | Product / catalog / "no character" |

**Specular vs diffuse** depends on the *surface*, not the light:

- **Specular**: angle-of-incidence = angle-of-reflection (mirror-like). Polished metals, water surface, glass, wet skin.
- **Diffuse**: scattered (Lambertian). Matte paint, paper, dry skin.

Hard light makes specular highlights *sharp and small*; soft light makes them *broad and diffuse*. A glossy black sphere under hard light = pinpoint highlight; under soft light = broad highlight wrapping the sphere. The combination of light quality + surface specularity controls the *material read* (see [[PBR Material Parameters]]).

## Axis 2: Light direction

Per [[Light Vocabulary|the stub]] (more nuanced here):

| Direction | Reading | Use |
|---|---|---|
| **Front (camera-axis)** | Flat, idol-like, low-information | Glamour beauty, ID photo, news |
| **Side (90° / "Rembrandt")** | High-information, sculptural, dramatic | Portrait, narrative, "the standard" |
| **3/4 front** (~30° off-axis) | Sculptural-but-flattering | Default for cinematic portraiture |
| **3/4 back** (~120-150° from camera) | Edge-lit, rim, mystery | Beauty rim, action drama, "epic" |
| **Direct back** (180°) | Silhouette | Mystery, spiritual, identity-concealing |
| **Top (overhead)** | Foreboding, interrogation, hard shadow under brow | *The Godfather II* Vito; thriller |
| **Bottom (uplighting)** | Horror, uncanny, unnatural | Campfire-tale, monster reveal |
| **High side (Rembrandt-ish)** | Classical "triangle on cheek" lighting | Portraiture canon since Rembrandt |
| **Loop / butterfly / split** | Beauty / fashion conventions | See classical-portraiture references |

Direction is the **single most-emotionally-loaded** variable in cinematography. Bottom lighting reads horror cross-culturally — possibly the most-universal lighting-emotion mapping the wiki has encountered, though [[Cross-Cultural Color Variation|cross-cultural validity]] caveats apply.

## Axis 3: Motivation

The **diegetic justification** for the light source:

- **Motivated**: source visible or implied in scene (window, lamp, screen, sky, fire). Reads as *realistic*.
- **Practical**: a **physical fixture visible in-shot** (lamp, candle, computer screen, neon sign). A subset of motivated. Often dual-purpose (visible source + actual lighting contribution).
- **Unmotivated**: light from "nowhere" — no diegetic source. Reads as *theatrical*, *stylized*, *expressionist*.

| Motivation | When used |
|---|---|
| Motivated | Naturalistic narrative cinema, documentary, contemporary realism |
| Practical (heavy) | Deakins-school (Blade Runner 2049, Skyfall Shanghai); the most-flattering naturalism |
| Unmotivated | Music videos, fashion editorial, theater, opera, classical Hollywood glamour |

**Deakins's approach**¹: "If there's a window, that's your key. If there's a lamp, that's your key. Let darkness do the work." Heavy practical / motivated lighting is the [[Three-Point Lighting and Key-Fill Ratio|New Naturalism]] default.

**Unmotivated approach**: Tom Stern (Eastwood DP), classical-Hollywood DPs, music-video DPs. Light becomes its own theatrical material; no need to justify the source.

## Three additional dimensions (sub-axes)

### Color temperature

- **Tungsten** ~3200K (warm yellow-orange)
- **Daylight** ~5600K (neutral)
- **Overcast** ~7000K (cool blue)
- **Candle/firelight** ~1800K (very warm orange)
- **Sodium-vapor street** ~2000K (orange-pink)
- **Fluorescent** ~4000-6500K (green-tinged)
- **LED** variable

**Mixed temperatures** (warm tungsten interior + cool daylight exterior visible through window) is a deeply-effective cinematographic move. The eye reads the mismatch as *atmospheric depth* + *time-of-day cue*. See [[Warm and Cool Colors]] for the perception side.

### Atmospheric haze

Hard light + visible haze (smoke, fog, dust) = **light shafts** / **god rays**. The shafts *visualize* light direction; powerful narrative tool. Used heavily in contemporary cinema (Lubezki's *Tree of Life*; Deakins's *1917*) and music videos.

### Practicals as composition

When practicals are visible in shot, they become *composition elements* themselves — bright points the eye fixates on, "anchor" elements per [[Visual Weight]]. Deakins's *Blade Runner 2049* Las Vegas sequence uses giant ocher floodlights as composition anchors AND key sources simultaneously.

## Computable handles

For a generative / 3D scene:

- **Light-quality slider**: parameterize lights by `apparent_angular_size` (0 = point-source hard; 90° = full-overcast soft). Map to softbox-size or area-light-extent.
- **Direction triple**: spherical coordinates (azimuth, elevation, twist) per light.
- **Motivation flag**: each light tagged motivated / practical / unmotivated. Practicals automatically get a visible-in-scene fixture mesh.
- **Color-temperature**: per-light Kelvin value; convert to RGB via blackbody radiation curve or LUT.
- **Atmospheric haze**: scattering parameters (volumetric fog) per scene; height-fall-off + density.

## Connection to the wiki's priorities

| Priority | Application |
|---|---|
| **1. Generative art** ★ | 3D / PBR scenes; light-mood templates per priority/aesthetic |
| **2. Branding** | Product photography lighting language |
| **3. Graphic design** | Editorial / fashion lighting reference |
| 4. Music-reactive | Concert / live-light vocabulary; haze + practicals are visualizer staples |

## Related

- [[Light Vocabulary]] (parent stub) · [[Three-Point Lighting and Key-Fill Ratio]] · [[Cinematic Lighting Traditions]] · [[PBR Lighting and ACES Tone Mapping]] · [[Warm and Cool Colors]] · [[PBR Material Parameters]] · [[Chiaroscuro]] · [[Tenebrism]] · [[Aerial Perspective]] · [[Shading and Volume]]

## Sources

1. *Deakins on Mixing Lights, Lighting Faces*, StudioBinder. https://www.studiobinder.com/blog/film-lighting-techniques/
2. *5 Lighting Concepts Every DP Should Know*, No Film School. https://nofilmschool.com/lighting-concepts-every-dp-should-know
3. Storaro, *Writing with Light* (2000); Alton, *Painting with Light* (1949).
4. Brown, *Cinematography: Theory and Practice* (3rd ed. 2016).
5. Calahan, *Storytelling Through Lighting* (Pixar SIGGRAPH 1996).
