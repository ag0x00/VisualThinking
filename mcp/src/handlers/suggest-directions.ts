import type { VaultIndex } from "../parser/vault-loader.js";
import type { PageRef } from "../types/shared.js";

export type DirectionKind =
  | "parameter-adjustment"
  | "compositional-shift"
  | "palette-evolution"
  | "structural-substitution"
  | "modality-addition"
  | "scope-expansion";

export interface ImprovementDirection {
  kind: DirectionKind;
  title: string;
  rationale: string;
  drawnFrom: PageRef[];
  hookPoint?: string;
  effort: "trivial" | "moderate" | "significant";
  reversibility: "easy-A/B" | "needs-rework" | "irreversible";
  confidence: number;
}

export interface SuggestDirectionsArgs {
  intent: string;
  currentTechniques?: PageRef[];
  currentScores?: Record<string, number>;
  excludeKinds?: DirectionKind[];
}

const INTERACTIVE_KEYWORDS = /\b(interactive|reactive|mouse|hover|touch|gesture|click|drag|input)\b/i;

function findByTitle(vault: VaultIndex, title: string): PageRef | undefined {
  const page = vault.byTitle.get(title.toLowerCase());
  if (!page) return undefined;
  return { id: page.id, title: page.title, type: page.type, ...(page.slug ? { slug: page.slug } : {}) };
}

function scoreDriven(vault: VaultIndex, args: SuggestDirectionsArgs): ImprovementDirection[] {
  if (!args.currentScores) return [];
  const directions: ImprovementDirection[] = [];
  for (const [techId, score] of Object.entries(args.currentScores)) {
    const tech = vault.byAddress.get(techId);
    if (!tech || tech.type !== "technique") continue;
    const healthy = { min: 0.4, max: 0.7 };
    if (score < healthy.min) {
      directions.push({
        kind: "parameter-adjustment",
        title: `Boost ${tech.title} score (currently below healthy)`,
        rationale: `${tech.title} scored ${score.toFixed(2)} (below healthy ${healthy.min}). Tune parameters to introduce more of the measured property.`,
        drawnFrom: [{ id: tech.id, title: tech.title, type: "technique" }],
        effort: "trivial",
        reversibility: "easy-A/B",
        confidence: 0.9,
      });
    } else if (score > healthy.max) {
      directions.push({
        kind: "parameter-adjustment",
        title: `Calm ${tech.title} (currently above healthy)`,
        rationale: `${tech.title} scored ${score.toFixed(2)} (above healthy ${healthy.max}). Reduce intensity to settle within range.`,
        drawnFrom: [{ id: tech.id, title: tech.title, type: "technique" }],
        effort: "trivial",
        reversibility: "easy-A/B",
        confidence: 0.85,
      });
    }
  }
  return directions;
}

function modalityAddition(vault: VaultIndex, args: SuggestDirectionsArgs): ImprovementDirection[] {
  const directions: ImprovementDirection[] = [];
  const hasInteractiveIntent = INTERACTIVE_KEYWORDS.test(args.intent);
  const hasInputModality = (args.currentTechniques ?? []).some((t) =>
    /pose|audio|cross-modal|input|gesture/i.test(t.title),
  );
  if (hasInteractiveIntent && !hasInputModality) {
    const audioTechRef = findByTitle(vault, "Audio-to-Visual Cross-Modal Mapping");
    directions.push({
      kind: "modality-addition",
      title: "Add an input-modality channel (mouse / pose / audio)",
      rationale:
        "Intent mentions interactivity but no input-modality technique is in the current stack. Cross-modal mapping treats any input (mouse-X, pose-energy, audio-spectral) as a parameter source.",
      drawnFrom: audioTechRef ? [audioTechRef] : [],
      hookPoint: "renderer parameter modulator",
      effort: "moderate",
      reversibility: "needs-rework",
      confidence: 0.6,
    });
  }
  return directions;
}

function cautionDriven(vault: VaultIndex, args: SuggestDirectionsArgs): ImprovementDirection[] {
  const directions: ImprovementDirection[] = [];
  for (const ref of args.currentTechniques ?? []) {
    const page = vault.byAddress.get(ref.id);
    if (!page) continue;
    if (page.type === "concept" && page.cautions.length > 0) {
      for (const c of page.cautions.slice(0, 1)) {
        directions.push({
          kind: "scope-expansion",
          title: `Validate against caution: ${c.kind.replace(/-/g, " ")}`,
          rationale: c.text.slice(0, 240),
          drawnFrom: [{ id: page.id, title: page.title, type: page.type }],
          effort: "significant",
          reversibility: "needs-rework",
          confidence: 0.8,
        });
      }
    }
  }
  return directions;
}

const RANK_WEIGHT: Record<ImprovementDirection["effort"], number> = {
  trivial: 1.0,
  moderate: 0.85,
  significant: 0.7,
};

export function suggestDirections(
  vault: VaultIndex,
  args: SuggestDirectionsArgs,
): { directions: ImprovementDirection[] } {
  const all = [
    ...scoreDriven(vault, args),
    ...modalityAddition(vault, args),
    ...cautionDriven(vault, args),
  ];
  const excluded = new Set(args.excludeKinds ?? []);
  const filtered = all.filter((d) => !excluded.has(d.kind));
  filtered.sort(
    (a, b) => b.confidence * RANK_WEIGHT[b.effort] - a.confidence * RANK_WEIGHT[a.effort],
  );
  return { directions: filtered };
}
