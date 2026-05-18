import type { Caution } from "../types/shared.js";

const CALLOUT_RE = /^>\s*\[!(\w+)\][^\n]*\n((?:>[^\n]*\n?)+)/gm;

const CONTESTED_KEYWORDS = /\b(contested|superseded|empirically dead|empirical[- ]?dead|myth|mostly[ -]abandoned)\b/i;
const CROSS_CULTURAL_KEYWORDS = /\b(WEIRD|cross-cultural|Western-only|culturally specific|culturally variable)\b/i;
const EMPIRICAL_MIXED_KEYWORDS = /\b(mixed empirical|empirically mixed|weak empirical|replication[- ]failure|failed to replicate)\b/i;

// Callout types that are inherently caution-bearing even without specific keywords
const WARNING_CALLOUT_TYPES = /^(warning|danger|caution)$/i;

function classify(calloutType: string, text: string): Caution["kind"] | null {
  if (CONTESTED_KEYWORDS.test(text)) return "contested-framing";
  if (CROSS_CULTURAL_KEYWORDS.test(text)) return "cross-cultural-limit";
  if (EMPIRICAL_MIXED_KEYWORDS.test(text)) return "empirical-mixed";
  // warning/danger/caution callouts are inherently contested-framing even without explicit keywords
  if (WARNING_CALLOUT_TYPES.test(calloutType)) return "contested-framing";
  return null;
}

function stripCalloutMarkers(raw: string): string {
  return raw
    .split("\n")
    .map((line) => line.replace(/^>\s?/, ""))
    .join("\n")
    .trim();
}

export function extractCautions(markdown: string): Caution[] {
  const cautions: Caution[] = [];

  // 1. Callouts: > [!warning] / > [!note] / etc.
  let m: RegExpExecArray | null;
  CALLOUT_RE.lastIndex = 0;
  while ((m = CALLOUT_RE.exec(markdown)) !== null) {
    const calloutType = m[1];
    const body = stripCalloutMarkers(m[2]);
    const kind = classify(calloutType, body);
    if (kind) {
      cautions.push({ kind, text: body });
    }
  }

  // 2. Successor sections: ## Successor theory / Successor / adjacent theories
  // Split on ## headings and find Successor sections
  const sections = markdown.split(/(?=^##\s)/m);
  for (const section of sections) {
    if (/^##\s+Successor/m.test(section)) {
      const body = section.replace(/^##[^\n]*\n/, "").trim();
      if (CONTESTED_KEYWORDS.test(body)) {
        cautions.push({ kind: "outdated-successor", text: body.slice(0, 400) });
      }
    }
  }

  return cautions;
}
