import { DOMAINS, type Domain } from "../types/shared.js";

const DESCRIPTIONS: Record<Domain, string> = {
  color: "Color theory, perceptual color spaces, harmony, contrast, cross-cultural palette variation.",
  composition: "Spatial composition: hierarchy, balance, negative space, tension, grids.",
  body: "Body language, pose semantics, gesture, emblems, dimensional emotion-from-body reading.",
  "time-based": "Time-based composition: montage, editing, animation principles, panel transitions.",
  "motion-symmetry": "Movement, rhythm, repetition, symmetry groups, tessellation, aperiodic tilings.",
  style: "Style as rule-system: art-historical schools, brand design systems, style transfer.",
  iconography: "Symbolic and cultural iconography, archetypes, semiotic conventions.",
  "light-materials": "Light vocabulary, three-point lighting, PBR materials, texture perception.",
  affect: "Emotion psychology, valence-arousal, appraisal theory, constructed emotion.",
  perception: "Perceptual substrate: gestalt, constancies, illusions, Bayesian predictive processing.",
  aesthetics: "Empirical aesthetics, computational measures (Birkhoff, entropy, fractal D, Datta).",
  "algorithmic-framings": "Theoretical framings of generative/computational/AI art.",
  "llm-techniques": "Prompt patterns, structured outputs, VLM evaluation, multimodal loops.",
  "audio-visual": "Cross-modal mapping: audio features to visual primitives; music-reactive visuals.",
};

export function listDomains(): { domains: { domain: Domain; description: string }[] } {
  return {
    domains: DOMAINS.map((d) => ({ domain: d, description: DESCRIPTIONS[d] })),
  };
}
