import { EVALUATION_GUIDE_MAP, GLOBAL_CAVEATS } from "./evaluation-guide-map.js";
import type { VaultIndex } from "../parser/vault-loader.js";
import type { Caution, PageRef, Section } from "../types/shared.js";
import type { Technique } from "../types/public.js";

export interface EvaluationStep {
  id: string;
  technique: PageRef;
  measures: string;
  rangeMin: number;
  rangeMax: number;
  healthyRange: { min: number; max: number };
  interpretation: {
    belowHealthy: string;
    inHealthy: string;
    aboveHealthy: string;
  };
  calibrationReferences: string[];
  whenToApply: string;
  cautions: Caution[];
}

export interface EvaluationGuide {
  artifactType: string;
  steps: EvaluationStep[];
  globalCaveats: Caution[];
}

const RANGE_RE = /(\d*\.?\d+)\s*(?:to|–|-|—)\s*(\d*\.?\d+)/;

function findSection(sections: Section[], headingPattern: RegExp): Section | undefined {
  return sections.find((s) => headingPattern.test(s.heading));
}

function extractHealthyRange(sections: Section[]): { min: number; max: number } | null {
  const candidate = findSection(sections, /Validation|Calibration|Interpretation|Healthy/i);
  if (!candidate) return null;
  const match =
    candidate.markdown.match(/healthy[^0-9]*(\d*\.?\d+)\s*(?:to|–|-|—)\s*(\d*\.?\d+)/i) ??
    candidate.markdown.match(RANGE_RE);
  if (!match) return null;
  return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
}

function extractInterpretation(sections: Section[]): {
  belowHealthy: string;
  inHealthy: string;
  aboveHealthy: string;
} {
  const candidate = findSection(sections, /Validation|Calibration|Interpretation/i);
  const body = candidate?.markdown ?? "";
  const below = body.match(/[Bb]elow[^.]*\.[^.]*\./)?.[0] ?? "";
  const above = body.match(/[Aa]bove[^.]*\.[^.]*\./)?.[0] ?? "";
  const inRange = body.match(/[Ii]n[ -]?range[^.]*\./)?.[0] ?? "Within healthy range.";
  return {
    belowHealthy:
      below.trim() ||
      "Score is below the healthy range; tune parameters to introduce more of the measured property.",
    inHealthy: inRange.trim(),
    aboveHealthy:
      above.trim() ||
      "Score is above the healthy range; tune parameters to reduce the measured property.",
  };
}

function extractCalibrationReferences(sections: Section[]): string[] {
  const candidate = findSection(sections, /Calibration|Validation|Reference/i);
  if (!candidate) return [];
  return candidate.markdown
    .split("\n")
    .filter((line: string) => /≈|reference|calibrat/i.test(line))
    .map((line: string) => line.replace(/^[-*•]\s*/, "").trim())
    .filter((line: string) => line.length > 0)
    .slice(0, 5);
}

function buildStep(idx: number, technique: Technique): EvaluationStep {
  const sections = technique.body.sections;
  const healthy = extractHealthyRange(sections) ?? { min: 0.4, max: 0.7 };
  const summary = technique.summary || `${technique.title} score`;

  return {
    id: `step-${idx + 1}`,
    technique: {
      id: technique.id,
      title: technique.title,
      type: "technique",
      ...(technique.slug ? { slug: technique.slug } : {}),
    },
    measures: summary,
    rangeMin: 0,
    rangeMax: 1,
    healthyRange: healthy,
    interpretation: extractInterpretation(sections),
    calibrationReferences: extractCalibrationReferences(sections),
    whenToApply: `Apply ${technique.title} to score the artifact's ${
      technique.applications.length > 0
        ? `priority-${technique.applications.join("/")} `
        : ""
    }characteristics.`,
    cautions: [],
  };
}

export function getEvaluationGuide(
  vault: VaultIndex,
  args: { artifactType: string; priority?: number; domain?: string },
): EvaluationGuide {
  const titles = EVALUATION_GUIDE_MAP[args.artifactType] ?? [];
  const steps: EvaluationStep[] = [];
  let idx = 0;
  for (const title of titles) {
    const page = vault.byTitle.get(title.toLowerCase());
    if (!page || page.type !== "technique") continue;
    steps.push(buildStep(idx++, page));
  }
  return {
    artifactType: args.artifactType,
    steps,
    globalCaveats: GLOBAL_CAVEATS,
  };
}
