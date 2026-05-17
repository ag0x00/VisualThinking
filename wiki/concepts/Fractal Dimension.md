---
title: Fractal Dimension
type: concept
aliases: [box-counting dimension, fractal D, Hausdorff dimension]
tags: [concept, computational-aesthetics, math, metrics]
status: developing
address: c-000024
created: 2026-05-16
updated: 2026-05-16
---

# Fractal Dimension

> A scalar $D$ that quantifies how a fractal pattern's detail scales with magnification. For fractal *curves* in a plane, $D$ lies between **1** (smooth line, no fractal structure) and **2** (a curve so detailed it fills an area). The single most-studied aesthetic parameter outside of the [[Birkhoff's Aesthetic Measure|Birkhoff measure]] family. (Source: [[Spehar Taylor - Universal Aesthetic of Fractals]])

For self-similar patterns: the number of pieces at scale $r$ is $N(r) \propto r^{-D}$. Take logs: $\log N(r) = -D \log r + c$, so $D$ is the **negative slope of a log-log scaling plot**.

## The box-counting algorithm

For a binarized image $I$:

1. Cover $I$ with a grid of squares (boxes) of side $L$.
2. Count $N(L)$ = number of boxes that intersect the pattern.
3. Repeat for a range of $L$ values.
4. Plot $\log N(L)$ vs $\log L$; the slope is $-D$.

For a fractal pattern, the data fall on a straight line — fractal behavior detected. If the data don't lie on a line, the pattern is not fractal. For Pollock's drip paintings, the analysis extends over scales from ~0.8 mm up to ~1 m, with the pattern remaining fractal across the entire range (Source: [[Spehar Taylor - Universal Aesthetic of Fractals]]; Taylor, Micolich, Jonas 1999).

## Natural fractal dimensions (reference table)

(From Spehar, Clifford, Newell, Taylor 2003; abbreviated.)

| Natural form | $D$ |
|---|---|
| Coastlines (South Africa, Australia, Britain) | 1.05–1.25 |
| Coastlines (Norway) | 1.52 |
| Cracks in ductile materials | 1.25 |
| Clouds | 1.30–1.33 |
| Waves | 1.3 |
| Geothermal rock patterns | 1.25–1.55 |
| Woody plants and trees | 1.28–1.90 |
| Sea anemone | 1.6 |
| Snowflakes | 1.7 |
| Retinal blood vessels | 1.7 |
| Bacterial growth | 1.7 |
| Cracks in non-ductile materials | 1.68 |
| Mineral patterns | 1.78 |

The empirical range for natural fractals is roughly $D \in [1.05, 1.9]$.

## The aesthetic-preference peak: $D \in [1.3, 1.5]$

The seed claims that "a fractal dimension between 1.3 and 1.5 is statistically proven to lower human stress and maximize visual engagement." **This is well-supported, with caveats.** Spehar, Clifford, Newell, and Taylor (2003) presented three different sets of fractal images to 220 undergraduates:

1. **Natural** scenes (cauliflower, mountain, river, clouds, lightning, mud cracks, tree branches) — $D$ values 1.1 to 1.9.
2. **Mathematical** (computer-generated simulated coastlines) — $D \in \{1.33, 1.50, 1.66\}$.
3. **Human-made** (cropped sections of Jackson Pollock paintings) — $D \in \{1.12, 1.50, 1.66, 1.89\}$.

**Across all three origins, preference peaked at $D \in [1.3, 1.5]$.** The result holds independently of whether the image was natural, mathematical, or human (Source: [[Spehar Taylor - Universal Aesthetic of Fractals]]).

This is a robust finding. It is the closest the computational-aesthetics field has come to an empirically-grounded *universal* preference parameter.

Earlier studies are consistent:
- **Sprott** (1993) — strange attractors, 8 observers, average preference $D = 1.30$.
- **Aks & Sprott** (1996) — fractal images, 24 observers, preference $D \approx 1.3$.

## Caveats and known limits

- **Physical fractals are scale-limited.** Most natural fractals only show fractal scaling over a magnification range where the smallest pattern is ~25× smaller than the largest. For consistency, Spehar et al. presented all stimuli over this 25× range.
- **Multiple parameters matter.** $D$ alone doesn't capture everything. Lacunarity (spatial distribution at a given magnification), Lyapunov exponents (dynamical properties), and symmetry all also affect preference. Pickover (1995) reported preferences near $D = 1.8$ for images with strong symmetry — symmetry confounds the $D$ effect.
- **Density is not dimension.** A control study by Spehar et al. on random-dot patterns matched for density (but with no fractal scaling) showed no systematic preference — confirming that the 1.3–1.5 preference is *fractal-specific*, not just a function of how much pattern fills the canvas.
- **Pollock's late paintings exceed the preference range.** Many of Pollock's mature works have $D \approx 1.7$–$1.9$, well above 1.3–1.5. Spehar et al. note this "may account for early negative critical and public reactions" — the dimension of his work outpaced viewer preference.

## Programmable form

```python
def box_counting_dimension(binary_image, box_sizes):
    counts = []
    for L in box_sizes:
        h, w = binary_image.shape
        boxes = 0
        for i in range(0, h, L):
            for j in range(0, w, L):
                if binary_image[i:i+L, j:j+L].any():
                    boxes += 1
        counts.append(boxes)
    # Linear regression on log-log
    log_L = np.log(box_sizes)
    log_N = np.log(counts)
    slope, _ = np.polyfit(log_L, log_N, 1)
    return -slope
```

Libraries: `scikit-image` provides higher-level fractal-dimension utilities; `pylsd` for line-segment detection (used for preprocessing); `boxcount` is a focused Python implementation.

For an LLM critic asked "is this image aesthetically engaging?", computing $D$ via box-counting and checking against the 1.3–1.5 band is a **cheap, empirically-grounded filter**. Pair with [[Visual Entropy]] and [[Birkhoff's Aesthetic Measure]] for an ensemble signal.

## Why it matters for this vault

Fractal dimension is the **strongest empirically-validated single-scalar aesthetic metric** in the wiki. Unlike Birkhoff's measure (largely psychometrically disconfirmed) or visual entropy (no agreed-on optimum), the 1.3–1.5 preference for $D$ is reproducible across studies and stimulus origins.

For generative art, $D$ is a directly-controllable parameter — choose your noise process and tune it to land in the preference range. For an LLM critic, $D$ is a single number with a meaningful threshold.

## Related
[[Birkhoff's Aesthetic Measure]] · [[Visual Entropy]] · [[Computational Aesthetics]] · [[Photo Aesthetic Features]] · [[Spehar Taylor - Universal Aesthetic of Fractals]]
