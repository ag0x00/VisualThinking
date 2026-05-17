---
address: c-000145
title: AI Art and Latent Space
type: concept
status: developing
tags: [concepts, generative-art, ai-art, latent-space, framings]
created: 2026-05-17
updated: 2026-05-17
---

# AI Art and Latent Space

A framing within [[Framings of Generative Art|generative art]] in which the *generative system is a trained neural model* — GAN, VAE, diffusion, autoregressive transformer — and the artist's work is to direct, prompt, traverse, and curate the model's *latent space*. The framing's theoretical anchor is Aaron Hertzmann's *Can Computers Create Art?* (2018), which argues that even with latent-space exploration, art is created by *social agents* using computers — the model is a tool, not an author.¹

> [!note] This is one of nine framings in [[Framings of Generative Art]]
> AI-art is the youngest and most volatile framing; the field has shifted from GAN-era (2014–2020) to diffusion-era (2021–) to multimodal foundation models (2024–) within a decade. The theoretical literature lags the practice substantially.

## Essence

The artist works with a *learned* generative system rather than a *handcrafted* one. The model has internalized a distribution over images (or other media) from training data; the artist explores that distribution by:

1. **Prompting** — natural-language or visual conditioning.
2. **Latent walks** — interpolating between points in the model's compressed representation space; the most distinctive aesthetic move of the framing.
3. **Fine-tuning / LoRA / textual inversion** — adjusting the model's distribution toward the artist's data.
4. **Composition with control signals** — ControlNet, depth maps, sketches, segmentation masks; constraints layered over generation.
5. **Curation** — generating many candidates, filtering by taste. Curation work dominates this framing.

The signature aesthetic of the GAN era was *latent-walk video*: smooth interpolation through high-dimensional space producing morphing imagery (Anadol's *Machine Hallucinations*; Klingemann's *Memories of Passersby*; Robbie Barrat's portraits). Diffusion-era work is more diverse — photoreal, painterly, photo-real-impossible — and increasingly hybrid with practice-led tools (artists run diffusion outputs through their own [[Practice-led Studio Research|Processing-era tooling]]).

## Key practitioners

- **Aaron Hertzmann** (theorist + practitioner, *Can Computers Create Art?* 2018, Adobe Research).¹
- **Refik Anadol** (*Machine Hallucinations*, *Unsupervised*) — large-scale data-painting and latent-space sculpture. NVIDIA AI Art Gallery feature.²
- **Mario Klingemann** (*Memories of Passersby I*, *Botto*) — GAN-era pioneer; one of the earliest artist sales of AI-generated work.³
- **Helena Sarin** — practitioner-essayist on GAN-aesthetics from 2018+.
- **Holly Herndon & Mat Dryhurst** — AI-art and audio crossover; Holly+ project on consensual model training.
- **Robbie Barrat & Obvious** — *Portrait of Edmond de Belamy* (2018), the first major AI-art auction sale.
- **Sougwen Chung** — human-AI collaborative drawing.
- **Anna Ridler** — *Mosaic Virus* and other artist-trained-dataset GANs; explicit critique of training-data politics.
- **Katherine Crowson** — CLIP-guided diffusion that opened the diffusion-era of AI-art practice.

## What it foregrounds that other framings don't

- **Authorship attribution.** When the generation is by a pretrained model, *who is the artist*? The dataset curators, the model architects, the prompt engineer, or the curator? Hertzmann argues it's whoever has social-agent status doing creative work.¹
- **Data as material.** The choice of training data is an artistic choice (Anna Ridler's tulip dataset).
- **Latent space.** A learned, high-dimensional continuum where smooth movement produces meaningful interpolation. This is the framing's most signature concept — no other framing has it.
- **Black-box generators.** The artist often does not fully understand what the model will produce. Practice-led work is opaque-to-the-artist in a way Galanter-style explicit systems are not.
- **Curation-at-scale.** Generate hundreds, pick few. This is more pronounced than even long-form Hobbs-style curation because individual outputs cost milliseconds.

## What it contests

- **Galanter:** Galanter's "system with autonomy" definition applies, but the *autonomy* is now the autonomy of a learned distribution, not a designed algorithm.
- **Practice-led:** the artist no longer fully designs the generator. Hertzmann argues this is still tool-use; some practitioners (Anadol) embrace the "model as collaborator" rhetoric Hertzmann critiques.
- **A-life:** a-life systems are hand-designed for emergent behavior. AI-art systems are *trained* and exhibit *learned* behavior. Different epistemology.
- **Live-coding:** AI generation is too slow for performance (multi-second diffusion); the latent-walk video aesthetic is offline-rendered.

## Computable handles

- **Diffusion models.** Stable Diffusion, SDXL, FLUX, Imagen, DALL-E. Open-weight diffusion (SD/SDXL/FLUX) underpins most production-grade AI-art tooling.
- **ControlNet, T2I-Adapter, IP-Adapter** — conditioning signals that turn diffusion from blind sampling into directable rendering.
- **LoRA / textual inversion** — light-fine-tuning techniques to personalize models on small datasets.
- **CLIP-guided generation** — original mechanism behind the diffusion-era opening; mostly superseded by integrated text-to-image but still used for niche pipelines.
- **Multimodal foundation models (2024+).** Claude 4.X / GPT-5 / Gemini 2.5+ vision capabilities open *new* AI-art framings (visual feedback loops, LLM-as-aesthetic-judge — see [[MLLM-as-a-Judge]]).

## Fit with the four user priorities

- **1. Generative art (high).** AI-art is the dominant contemporary form by economic activity and public visibility.
- **2. Branding (medium).** Brand identity systems increasingly use AI-generation for asset variants; Adobe Firefly / Midjourney / SDXL are in production. Risk: model-output uniformity makes identity work hard.
- **3. Graphic design (medium).** Image/mood-board generation; rapid asset variants; client iteration. Already integrated into Figma/Adobe workflows.
- **4. Music-reactive (medium / low).** Diffusion is too slow for real-time. Niche: latent-space interpolation can be *prerendered* and triggered by music. True real-time diffusion exists (LCM, SDXL-Lightning) but quality is still a step below offline.

## Programmability handle

- **For an LLM-driven art system:** the LLM can be the *prompt engineer and curator* over a diffusion model. This is the framing where LLMs natively fit, because the LLM understands the model's conditioning interface (prompts) and can evaluate outputs (multimodal LLM-as-judge — see [[MLLM-as-a-Judge]]).
- **For real-time:** use LCM / SDXL-Lightning / Turbo variants; <50ms generation enables (just barely) music-reactive but at quality cost. Most production music-reactive uses *prerendered latent walks* triggered live, not true real-time diffusion.
- **For branding:** ControlNet + LoRA on brand assets gives consistent style across a generation, partly solving the brand-consistency problem.
- **Authorship and rights remain unresolved** — training-data politics affect commercial use.

## Critique

- **Hertzmann's social-agent argument (anchored in primary source 2026-05-17):** Three italicized formulations across [[Hertzmann - Can Computers Create Art|the paper]]:
  - *"Computers do not create art, people using computers create art."* (p.2)
  - *"all art algorithms, including methods based on machine learning, are tools for artists; they are not themselves artists."* (p.13)
  - *"art is an interaction between social agents"* (p.17)

  Hertzmann's positive condition for AI artistry (p.20, italicized): *"AI can be granted authorship when we view the AI as a social agent, and it is performing some communication or sharing through art."* The condition is **perceived social-agency**, not any property of the model — but Hertzmann is explicitly ethically worried about "shallow" social-AI (Sophia-style "chatbot with a face") being marketed as artists: "calling such AIs 'artists' is unethical. It leads to all sorts of dangers, including overselling the competence and abilities of the AI, to misleading people about the nature of art." Under this reading, even the most autonomous-seeming AI-art is human-authored through prompt-engineering, dataset curation, and selection. Anadol, Klingemann, Crowson, Sarin — all artists, working with neural models *as tools*.
- **Awe-and-spectacle critique:** AI-art (especially Anadol) has been criticized as visually spectacular but theoretically thin, optimized for institutional contexts (museums, NVIDIA partnerships) and treating "scale" as aesthetic value.⁴
- **Training-data politics:** consent and attribution issues. Holly+ and Anna Ridler are the artists most engaged with this critique.
- **Aesthetic-uniformity drift:** large-base-model outputs tend toward house-style aesthetics that are increasingly recognizable; this works against artistic differentiation.

## Related

- [[Framings of Generative Art]] · [[MLLM-as-a-Judge]] · [[Hertzmann - Can Computers Create Art]] · [[Computational Creativity]] · [[Practice-led Studio Research]] · [[Postdigital Aesthetics]]

## Footnotes

1. Hertzmann, Aaron. *Can Computers Create Art?* arXiv:1801.04486 (2018), published in Arts 7:2. https://arxiv.org/abs/1801.04486 — "art is something created by social agents, and so computers cannot be credited with authorship."
2. Anadol, Refik. NVIDIA AI Art Gallery profile. https://www.nvidia.com/en-us/research/ai-art-gallery/artists/refik-anadol/
3. Klingemann, Mario. *Memories of Passersby I* (2018). Sotheby's auction context: first GAN piece by an artist at a major auction.
4. *Ideologies of Awe & AI Art at the MoMA*, Cybernetic Forests. https://cyberneticforests.substack.com/p/ideologies-of-awe-and-ai-art-at-the
