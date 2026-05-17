---
address: c-000148
title: "Hertzmann — Can Computers Create Art?"
type: source
source_type: paper
author: "Aaron Hertzmann"
date_published: 2018-05-09
url: https://arxiv.org/abs/1801.04486
venue: "Arts 7(2), MDPI; arXiv:1801.04486; DOI: 10.3390/arts7020018"
local_pdf: "~/Downloads/arts-07-00018-v3.pdf (full text, 25pp, ingested 2026-05-17)"
confidence: high
status: archived
tags: [sources, ai-art, generative-art, theory]
created: 2026-05-17
updated: 2026-05-17
---

# Hertzmann — Can Computers Create Art?

> Hertzmann, Aaron. *Can Computers Create Art?* **Arts 7:2**, MDPI, May 2018. arXiv:1801.04486. DOI 10.3390/arts7020018. Adobe Research; the author is a senior research scientist there. Open-access: https://www.mdpi.com/2076-0752/7/2/18 — arXiv mirror: https://arxiv.org/abs/1801.04486
>
> Full PDF ingested 2026-05-17 from `~/Downloads/arts-07-00018-v3.pdf`. All quotes below are verbatim from this primary source, with page numbers from the published Arts version.

## Why this source is canonical for the wiki

This paper is the theoretical anchor for the [[AI Art and Latent Space]] framing and the **central external critique** of system-internal aesthetic theories — including [[Galanter's Generative Art Framework|Galanter's]] complexity-axis claim, [[Computational Creativity|Boden's]] creativity criteria, and the [[Artificial Life Art|a-life]] tradition's "emergent autonomy" rhetoric. Hertzmann argues no property of the *system* (complexity, autonomy, surprise, intent, creativity, growth, responsiveness) is sufficient to ground artistic authorship. Art is **constitutively social**, and authorship attribution follows social-agent attribution.

Hertzmann is unusually credible as critic: he is himself a researcher in computer-generated imagery (NPR, painterly rendering, Image Analogies, BAM dataset). His critique is internal to the field, not from outside.

## Hertzmann's thesis (verbatim)

The paper's central position is stated three times in italics — pp.2, 13, 17 — each a slightly different formulation of the same argument:

> *"Computers do not create art, people using computers create art."* (p.2)

> *"In short, in our present understanding, all art algorithms, including methods based on machine learning, are tools for artists; they are not themselves artists."* (p.13)

> *"art is an interaction between social agents"* (p.17)

The full social-agent definition (p.17):
> "I generalize this theory beyond humans to hypothesize: *art is an interaction between social agents*. A 'social agent' is anything that has a status akin to personhood; someone worthy of empathy and ethical consideration. Many of our other behaviors are interactions between social agents, such as gifts, conversation, and social relationships like friendship, competition, and romance."

And the negative side (p.17):
> "Possessions can participate only in shallow versions of these interactions... We do not live in a social hierarchy with our possessions: we do not compete with them for status, or try to impress them. We care about what other people have to say because we care about other people; we care about what computers have to say only insofar as it is useful to us."

## Key arguments structure

### Section 2: Historical analogies (photography, animation, procedural art, neural-style-transfer)
Pattern: every new technology that automated some aspect of art-making was initially feared as a replacement for artists, then accepted as a new tool that *expanded* artistic possibility. AI follows the same pattern. Hertzmann (p.6):
> "It seems likely, in fact, that photography was one of the major catalysts of the Modern Art movement: its influence led to decades of vitality in the world of painting."

### Section 2.4: Procedural artwork specifically (LeWitt, Cage, Cohen's AARON, Karl Sims, Scott Draves)
Hertzmann's stance (p.8): "In each of these cases, despite the presence of procedural, emergent, and/or crowdsourced elements, **the human behind it is credited as the author of the artwork, and it would seem perverse to suggest otherwise.** The human has done all of the creative decision-making around the visual style, of designing a framework and process, of testing and evaluating alternative algorithms, and so on."

This directly contests the a-life ([[Artificial Life Art]]) and effective-autonomy ([[Galanter's Generative Art Framework]]) framings that treat the *system* as the source of artistic value.

### Section 2.6: "Artificial Intelligence is Not Intelligent"
Hertzmann (p.12) on contemporary ML systems: "the most-successful AI and machine learning algorithms are best thought of as *glorified data-fitting procedures*. That is, these algorithms are basically like fitting a curve to a set of datapoints, except with very sophisticated ways to fit high-dimensional curves to millions of datapoints."

> "There is no plausible sense in which current systems reflect 'true' artificial intelligence: there is always a human behind the artwork." (p.13)

### Section 4: The social-agent argument
The paper's theoretical core. Subsections 4.1–4.7 systematically rule out alternative theories of what could make a system count as an artist:

- **4.1 Art Is Social** — Darwin/Dutton evolutionary argument: art evolved as social-bonding, fitness-signal, sexual-selection, status-display. All these functions are intrinsically social.
- **4.2 Non-Human Authors** — natural processes (Grand Canyon, honeycombs, coral) are not considered art *despite* being complex and beautiful. Hertzmann (p.17): "simply creating complex and beautiful outputs is not itself sufficient for art, since there is no creative social communication in these cases." **This is the strongest single-sentence refutation of complexity-pillar aesthetic theories in the paper.**
- **4.3 Judging the Work Instead** — Hertzmann (p.18): "when we look at a computer's output and ask 'is this work good enough to call the computer an artist?', we are not actually judging the quality of the work *per se*. Instead, we are really looking for evidence that the system itself is intelligent, conscious, and feeling: traits that we associate with social agents."
- **4.4 An Intent Machine** — thought experiment: a system that supplies "intent" + commissions humans to execute. Even with intent + good output, "in general, the consensus would be that the system-builder is the real artist here." Refutes "artist = intent-supplier" theories.
- **4.5 Creativity, Growth, Responsiveness** — refutes "artist = creative-system" theories. Hertzmann (p.19): "The Mandelbrot set is very surprising and produces beautiful, unprecedented images, but we do not call its iteration equation creative, or an artist." **This is a direct falsifier of any theory that grounds artistic value in effective-complexity-from-simple-rules — the Mandelbrot is the paradigm case Galanter himself cites.**
- **4.6, 4.7 Definitions of art, attribute theories** — Hertzmann (p.20): "Any human can make art, even if it is not very original or surprising; the artist need not grow noticeably or respond to culture or feedback. We do judge the work by these attributes, but there is no minimum requirement for humans to make art. In contrast, the social theory makes a much more concrete statement. Art is fundamentally a social interaction, and thus can only be made by social agents."

### Section 5: Will an AI ever be an artist?
Two scenarios under which the answer changes. Critical formulation (p.20, italicized):
> *"AI can be granted authorship when we view the AI as a social agent, and it is performing some communication or sharing through art."*

This is the only condition. Three sub-cases:
- **Human-level AI**: by definition, would count — but is science-fiction.
- **Shallow social AI**: agents *perceived* as social (Eliza, Tamagotchi, Hanson Robotics' Sophia — "chatbot with a face"). Hertzmann is **skeptical and explicitly ethically worried** about this path (p.21): "calling such AIs 'artists' is unethical. It leads to all sorts of dangers, including overselling the competence and abilities of the AI, to misleading people about the nature of art."
- **Non-social AI promoted as artist by curators**: possible but Hertzmann is skeptical anyone will accept it without underlying social/conscious attributes.

### Section 6: Conclusion
> "I do not believe that any software system in our current understanding could be called an 'artist'. Art is a social activity. I mean this as a warning against misleading oneself and others about the nature of art." (p.22)

The closing tone is optimistic about AI-as-tool (p.22): "Today, we are seeing many intriguing and beguiling experiments with AI techniques, and, as artists' tools, they will surely transform the way we think about art in thrilling and unpredictable ways."

## Implications for the wiki — specific page-by-page

| Wiki page | What Hertzmann's argument requires | Applied in Phase 1 revision |
|---|---|---|
| [[Galanter's Generative Art Framework]] | The "effective-complexity = aesthetic pillar" claim must be flagged as system-internal, contested by Hertzmann's natural-processes argument and the Mandelbrot falsifier | ✅ Critique section added |
| [[AI Art and Latent Space]] | The social-agent argument must be the page's theoretical anchor, not the secondary "awe-and-spectacle" rhetoric | ✅ Done — Hertzmann positioned as the framing's anchor |
| [[Computational Creativity]] | Boden's creativity criteria must be flagged as *one* attribute-theory ruled out by Hertzmann §4.5 + §4.7 | Caveat applied; Hertzmann §4.5 critique now linked |
| [[Artificial Life Art]] | The "emergence as artwork" rhetoric must be positioned against Hertzmann's §2.4 procedural-art stance | Critique section already notes practitioner-pushback |
| [[Long-form On-Chain Generative Art]] | Hobbs's "the artist has nowhere to hide" framing is *compatible* with Hertzmann — both insist on the human as the locus of artistic responsibility | Already aligned |

## What this source does *not* address

- **Complexity measures specifically.** The paper does not engage with [[Birkhoff's Aesthetic Measure|Birkhoff]] or the [[Berlyne's Arousal-Potential Theory|Berlyne]] tradition by name. Its argument is at the *philosophical authorship* layer, not at the empirical *aesthetic-measure* layer. The empirical critique of inverted-U is separate (see [[Framings of Generative Art]] footnotes for Marin et al. 2021 and the IEP "mostly abandoned" claim).
- **Specific generative architectures.** The paper predates diffusion-era AI-art and discusses GANs (Goodfellow 2014 lineage) as the leading technology of the period. Style Transfer (Gatys et al. 2016) is the canonical computational-art example.
- **What "social agent" means precisely.** Hertzmann uses the term broadly; the philosophical literature on personhood (Dennett, Frankfurt, Korsgaard) is not engaged.

## Reception and critique

- Hertzmann's argument has been widely cited but is not uncontested. Defenders of computer creativity (Boden lineage; Colton; Wiggins; Jordanous) push back on the social-agent premise.
- The argument is strongest when applied to **authorship in commercial/legal contexts** (NFTs, copyright, attribution).
- Hertzmann's TED talk version (2019) is more popular; the paper is the rigorous version.

## Related

- [[AI Art and Latent Space]] · [[Galanter's Generative Art Framework]] · [[Computational Creativity]] · [[Framings of Generative Art]] · [[Artificial Life Art]] · [[Long-form On-Chain Generative Art]] · [[MLLM-as-a-Judge]]
