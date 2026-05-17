---
title: Visual Entropy
type: concept
aliases: [Shannon entropy, image entropy, visual information content]
tags: [concept, computational-aesthetics, math, metrics]
status: developing
address: c-000010
created: 2026-05-16
updated: 2026-05-16
---

# Visual Entropy

> Shannon entropy applied to an image. A scalar measure of pixel-level unpredictability.

For a digital image with a pixel-value (or color-bin) probability distribution $\{p_i\}$:

$$H = -\sum_i p_i \log_2 p_i \text{ (bits)}$$

- **Low** $H$ → flat, predictable regions (a solid color = 0).
- **High** $H$ → noise-like, no structure (uniform random pixels approach maximum).
- **Mid-range** $H$ → structured but rich. Most aesthetically engaging images live here. (Source: [[Wiki Seed]])

For an 8-bit per-channel image, the per-channel maximum entropy is 8 bits; the joint maximum over RGB is 24 bits.

## The Rigau-Feixas-Sbert reformulation

Visual entropy gains real power when combined with [[Birkhoff's Aesthetic Measure]]. Rigau, Feixas, and Sbert (2007) proposed three information-theoretic aesthetic measures (Source: [[Rigau Feixas Sbert - Birkhoff Shannon Kolmogorov]]):

**$M_H$ — Shannon-perspective measure** (relative redundancy):
$$M_H = \frac{H - H_p}{H}$$
where $H$ is the maximum entropy of the palette and $H_p$ is the entropy of the actual color distribution. This is the *coding gain* from using an optimal code for the image — i.e., the reduction in uncertainty that the chosen palette imposes.

**$M_K$ — Kolmogorov-perspective measure**:
$$M_K = \frac{N H_{\text{rgb}} - K}{N H_{\text{rgb}}}$$
where $K$ is the Kolmogorov complexity of the image (approximated by a real-world compressor like PNG or JPG). This is the order *captured by compression*.

**$M_S$ — Zurek's physical-entropy measure**:
$$M_S = \frac{N H_p - K}{N H_p}$$
The degree of order created from a given palette.

### Empirical results

Applied to 9 paintings (3 Mondrian, 3 Pollock, 3 van Gogh), all three measures rank **Mondrian highest and Pollock lowest** in order — matching expert judgment. The Pollock paintings have $M_K$ near 0.02, indicating almost no compressible structure beyond the palette. (Source: [[Rigau Feixas Sbert - Birkhoff Shannon Kolmogorov]])

## Why it matters for this vault

Visual entropy is one of the small set of *single-scalar* aesthetic measures that map cleanly to code:

- A 256-bin grayscale histogram + the Shannon formula is ~3 lines of NumPy.
- The same can be computed per channel (R, G, B) or in perceptual spaces ([[The Munsell and CIELAB Color Systems]], [[OKLCH]]).
- It pairs naturally with [[Birkhoff's Aesthetic Measure]] — Birkhoff's $C$ (complexity) can be operationalized as a function of visual entropy.
- The PNG vs JPG compression ratio is a *cheap proxy* for $K$ (Kolmogorov complexity) — usable in production systems where actual Kolmogorov estimation is infeasible.

The "engaging at mid-entropy" claim is consistent with the broader Birkhoff-style **order/complexity** tradeoff: too low and the image is boring; too high and it reads as noise.

## How it ties to the tonal foundations

- [[Tenebrism]] paintings concentrate most pixels into two clusters (bright spotlight + near-black ambient), which *reduces* entropy relative to a continuous-tone scene of equal subject complexity.
- [[Chiaroscuro]] preserves mid-tones, distributing pixels more evenly across the luminance range — higher entropy.
- [[Sfumato]] adds frequency-dependent diffusion, which tends to *redistribute* probability mass from concentrated highlights/shadows toward mid-tones — also higher entropy.

So entropy can be a discriminator between the three tonal idioms.

## Beyond zeroth-order entropy

Pure Shannon entropy is a **zeroth-order** measure — it looks only at the marginal probability distribution of pixel values, not at spatial structure. Two images with identical histograms but different spatial arrangements give the *same* $H$. Higher-order measures fix this:

- **Entropy rate** — entropy of consecutive pixels, capturing local correlation.
- **Excess entropy** — total information minus entropy rate; measures global structure.
- **Mutual information** between image regions — Rigau-Feixas-Sbert use this in their compositional measure $M_I$ via a binary space partition (BSP) algorithm that recursively splits the image to maximize mutual information at each step.

For most practical applications, zeroth-order entropy + PNG/JPG compression ratio is enough. Higher-order measures matter when comparing images with similar histograms but different structure.

## Related
[[Birkhoff's Aesthetic Measure]] · [[Fractal Dimension]] · [[Computational Aesthetics]] · [[Photo Aesthetic Features]] · [[The Munsell and CIELAB Color Systems]] · [[Chiaroscuro]] · [[Tenebrism]] · [[Sfumato]] · [[Rigau Feixas Sbert - Birkhoff Shannon Kolmogorov]]
