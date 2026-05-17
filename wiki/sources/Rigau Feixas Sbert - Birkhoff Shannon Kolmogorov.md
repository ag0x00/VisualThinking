---
title: "Rigau, Feixas, Sbert - Conceptualizing Birkhoff's Aesthetic Measure Using Shannon Entropy and Kolmogorov Complexity"
type: source
source_type: peer-reviewed-paper
authors: [Jaume Rigau, Miquel Feixas, Mateu Sbert]
publisher: "Eurographics Workshop on Computational Aesthetics in Graphics, Visualization and Imaging (Computational Aesthetics '07)"
date_published: 2007
date_retrieved: 2026-05-16
url: https://imae.udg.edu/~rigau/Publications/Rigau07B.pdf
companion_paper: "Rigau, Feixas, Sbert. 'Informational Aesthetics Measures.' IEEE Computer Graphics and Applications 28, no. 2 (2008): 24–34. DOI: 10.1109/MCG.2008.34 (~200 citations)"
confidence: high
status: developing
tags: [source, computational-aesthetics, birkhoff, information-theory, primary-research]
address: c-000028
created: 2026-05-16
---

# Rigau, Feixas, Sbert — Conceptualizing Birkhoff's Aesthetic Measure Using Shannon Entropy and Kolmogorov Complexity

## Summary

Primary research paper from the Eurographics Computational Aesthetics 2007 workshop. **Reformulates [[Birkhoff's Aesthetic Measure]] using Shannon entropy and Kolmogorov complexity**, presenting the creative process as a transformation from initial uncertainty (Shannon entropy of the palette) to final algorithmic information content (Kolmogorov complexity of the image). Defines three new informational-aesthetics measures ($M_H$, $M_K$, $M_S$) and a compositional measure ($M_I$). Validates by applying to a curated set of paintings by Mondrian, Pollock, and van Gogh — and shows the measures rank these artists in the order matching critical judgment.

## What it contributes

- The **Zurek physical-entropy** framing of $M = O/C$: $S_d = H(X_d) + K(d)$ — Shannon entropy plus Kolmogorov complexity.
- Three concrete **global aesthetic measures**:
  - $M_H = (H - H_p) / H$ — relative redundancy / coding-gain interpretation.
  - $M_K = (NH_{\text{rgb}} - K) / NH_{\text{rgb}}$ — Kolmogorov-complexity-based order.
  - $M_S = (NH_p - K) / NH_p$ — order created from a given palette (Zurek perspective).
- A **compositional measure** $M_I$ based on a recursive BSP / quad-tree partitioning that maximizes mutual information at each split.
- The **NCD** (Normalized Compression Distance) framework for using real-world compressors (PNG, JPG) as approximators of Kolmogorov complexity.
- **Empirical validation** on 9 paintings: Mondrian (3), Pollock (3), van Gogh (3). All three measures yield Mondrian highest, Pollock lowest, van Gogh in between — matching expert judgment.
- A clean **table of compression ratios** for each painting (Table 1) showing the dramatic difference between Mondrian's compressibility (PNG ratio 0.295–0.746) and Pollock's (0.903–0.980).

## Key claims

- **high** Birkhoff's $M = O/C$ can be reframed in information-theoretic terms: $O$ as algorithmic-information gain, $C$ as Shannon entropy of the palette.
- **high** The creative process can be modeled as a Maxwell's-demon-like transformation: initial uncertainty (Shannon entropy of palette colors) is converted to algorithmic information (Kolmogorov complexity of the painted image).
- **high** For images, PNG and JPG compression ratios are tractable approximations of Kolmogorov complexity.
- **high** Applied to 9 paintings, all three measures ($M_H$, $M_K$, $M_S$) consistently rank Mondrian highest in order, Pollock lowest, van Gogh in between.
- **high** The compositional measure $M_I$ recursively maximizes mutual information between an image partition and color histogram bins, yielding a programmable way to score the *decomposability* of an image into homogeneous regions.
- **medium** "Mondrian's and Pollock's paintings correspond to the highest and lowest values" in the PNG case for $M_S$ — supports the qualitative claim that Mondrian is most "ordered" and Pollock most "random."
- **medium** The use of JPG vs PNG (lossy vs lossless compression) sometimes reorders paintings — JPG is better at finding regular patterns and gives different absolute values; the *ranking* between artists is preserved.

## Confidence notes

**High confidence.** Peer-reviewed primary research, presented at the Eurographics Computational Aesthetics workshop (the field's main venue). Companion paper in *IEEE Computer Graphics and Applications* (2008, ~200 citations). The mathematics is standard information theory (Shannon entropy, Kolmogorov complexity, NCD) applied carefully. The empirical results are reproducible — the paintings used are named, the compression ratios are tabulated.

The Kolmogorov complexity is non-computable in principle; the paper acknowledges this and uses real-world compressors as proxies. Treat the absolute numerical values as approximate; the *rankings* across paintings are robust.

## Why we cite it

The single best primary source for the **information-theoretic reformulation of Birkhoff's measure**. Cited from [[Birkhoff's Aesthetic Measure]] for the information-aesthetics line; from [[Visual Entropy]] for the $M_H$, $M_K$, $M_S$ formulas; from [[Computational Aesthetics]] as a foundational paper in the field's middle (post-Birkhoff, pre-deep-learning) era.

## Related pages

[[Birkhoff's Aesthetic Measure]] · [[Visual Entropy]] · [[Computational Aesthetics]] · [[Douchová - Birkhoff's Aesthetic Measure]]
