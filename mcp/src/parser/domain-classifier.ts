import { isDomain, type Domain, type Layer, type PageType } from "../types/shared.js";

// Tag → domain mapping. Derived from the wiki Field Map's 14 clusters.
const TAG_TO_DOMAIN: Array<{ pattern: RegExp; domain: Domain }> = [
  { pattern: /\b(color|colour|oklch|hue|palette)\b/i, domain: "color" },
  { pattern: /\b(composition|hierarchy|negative-?space|grid|balance|tension)\b/i, domain: "composition" },
  { pattern: /\b(body|body-language|pose|gesture|emblem|contrapposto)\b/i, domain: "body" },
  { pattern: /\b(time|temporal|montage|animation|cinema|editing)\b/i, domain: "time-based" },
  { pattern: /\b(symmetry|tessellation|pattern|wallpaper|monotile|rhythm|movement)\b/i, domain: "motion-symmetry" },
  { pattern: /\b(style|stylistic|wolfflin|wölfflin)\b/i, domain: "style" },
  { pattern: /\b(iconography|symbol|panofsky|archetype|cultural-?symbol)\b/i, domain: "iconography" },
  { pattern: /\b(light|lighting|material|pbr|texture|chiaroscuro)\b/i, domain: "light-materials" },
  { pattern: /\b(affect|emotion|valence|arousal|plutchik|circumplex)\b/i, domain: "affect" },
  { pattern: /\b(perception|gestalt|constancy|illusion|configural)\b/i, domain: "perception" },
  { pattern: /\b(aesthetic|birkhoff|entropy|fractal|empirical-aesthetics)\b/i, domain: "aesthetics" },
  { pattern: /\b(generative|algorithmic|framing|cellular-?automata|l-?systems|computational-?creativity)\b/i, domain: "algorithmic-framings" },
  { pattern: /\b(llm|prompt|vlm|multimodal|llm-?as-?judge|json-?archetype)\b/i, domain: "llm-techniques" },
  { pattern: /\b(audio|sound|music|cross-?modal|visualizer|spectral)\b/i, domain: "audio-visual" },
];

// Domain → primary layer (from Field Map stratification).
const DOMAIN_TO_LAYER: Record<Domain, Layer> = {
  perception: 1,
  affect: 2,
  aesthetics: 2,
  color: 2,
  composition: 3,
  body: 3,
  "time-based": 3,
  "motion-symmetry": 3,
  style: 3,
  iconography: 3,
  "light-materials": 3,
  "algorithmic-framings": 4,
  "llm-techniques": 4,
  "audio-visual": 4,
};

function layerForType(type: PageType, dominantDomain: Domain): Layer {
  if (type === "technique" || type === "tool") return 4;
  return DOMAIN_TO_LAYER[dominantDomain];
}

interface ClassifierInput {
  tags?: string[];
  domain?: string | string[];
}

export function classifyDomains(
  input: ClassifierInput,
  pageType: PageType,
): { domains: Domain[]; layer: Layer } {
  // 1. Explicit override
  if (input.domain !== undefined) {
    const candidates = Array.isArray(input.domain) ? input.domain : [input.domain];
    const filtered = candidates.filter(isDomain);
    if (filtered.length > 0) {
      return {
        domains: filtered as Domain[],
        layer: layerForType(pageType, filtered[0] as Domain),
      };
    }
  }

  // 2. Tag-based inference
  const tags = input.tags ?? [];
  const matched = new Set<Domain>();
  for (const tag of tags) {
    for (const { pattern, domain } of TAG_TO_DOMAIN) {
      if (pattern.test(tag)) matched.add(domain);
    }
  }

  if (matched.size > 0) {
    const domains = Array.from(matched);
    return { domains, layer: layerForType(pageType, domains[0]) };
  }

  // 3. Fallback
  const fallbackDomain: Domain = pageType === "tool" ? "algorithmic-framings" : "perception";
  return { domains: [fallbackDomain], layer: layerForType(pageType, fallbackDomain) };
}
