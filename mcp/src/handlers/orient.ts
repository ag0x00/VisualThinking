import { search } from "../search/search.js";
import { adjacentFor } from "./adjacent-considerations.js";
import { GLOBAL_CAVEATS } from "./evaluation-guide-map.js";
import type { VaultIndex } from "../parser/vault-loader.js";
import type { ApplicationPriority, Caution, Domain, Layer, PageRef } from "../types/shared.js";
import type { Page } from "../types/public.js";

export interface OrientArgs {
  intent: string;
}

export interface OrientOptions {
  ollamaUrl?: string;
  fetchImpl?: typeof fetch;
  caps?: { concepts: number; techniques: number; tools: number; sources: number };
}

export interface OrientResult {
  matchedPriorities: ApplicationPriority[];
  matchedDomains: Domain[];
  matchedLayers: Layer[];
  startingPoints: {
    concepts: PageRef[];
    techniques: PageRef[];
    tools: PageRef[];
    sources: PageRef[];
  };
  suggestedReadingOrder: PageRef[];
  adjacentConsiderations: string[];
  cautions: Caution[];
  degraded: boolean;
}

const DEFAULT_CAPS = { concepts: 5, techniques: 3, tools: 5, sources: 3 };

function pageRef(p: Page): PageRef {
  return { id: p.id, title: p.title, type: p.type, ...(p.slug ? { slug: p.slug } : {}) };
}

function aggregateMeta(candidates: Page[]): { priorities: ApplicationPriority[]; domains: Domain[]; layers: Layer[] } {
  const prioTally = new Map<ApplicationPriority, number>();
  const domainTally = new Map<Domain, number>();
  const layerSet = new Set<Layer>();
  for (const p of candidates) {
    if (p.type === "concept") {
      for (const d of p.domains) domainTally.set(d, (domainTally.get(d) ?? 0) + 1);
      layerSet.add(p.layer);
      for (const pr of p.applications) prioTally.set(pr, (prioTally.get(pr) ?? 0) + 1);
    } else if (p.type === "technique") {
      layerSet.add(4 as Layer);
      for (const pr of p.applications) prioTally.set(pr, (prioTally.get(pr) ?? 0) + 1);
    } else if (p.type === "tool") {
      layerSet.add(4 as Layer);
      for (const [k, v] of Object.entries(p.applications)) {
        if (v >= 3) prioTally.set(Number(k) as ApplicationPriority, (prioTally.get(Number(k) as ApplicationPriority) ?? 0) + 1);
      }
    }
  }
  const sortedDomains = [...domainTally.entries()].sort((a, b) => b[1] - a[1]).map(([d]) => d).slice(0, 5);
  const sortedPriorities = [...prioTally.entries()].sort((a, b) => b[1] - a[1]).map(([p]) => p).slice(0, 4);
  return { priorities: sortedPriorities, domains: sortedDomains, layers: [...layerSet].sort() };
}

export async function orient(
  vault: VaultIndex,
  args: OrientArgs,
  opts: OrientOptions = {},
): Promise<OrientResult> {
  const caps = opts.caps ?? DEFAULT_CAPS;
  const searchResult = await search(vault, {
    query: args.intent,
    mode: opts.ollamaUrl ? "semantic" : "keyword",
    ollamaUrl: opts.ollamaUrl,
    fetchImpl: opts.fetchImpl,
    limit: 30,
  });

  const candidates: Page[] = [];
  for (const ref of searchResult.refs) {
    const p = vault.byAddress.get(ref.id) ?? vault.bySlug.get(ref.id);
    if (p) candidates.push(p);
  }

  const meta = aggregateMeta(candidates);

  const seen = new Set<string>();
  const collect = (type: Page["type"], cap: number): PageRef[] => {
    const out: PageRef[] = [];
    for (const p of candidates) {
      if (p.type !== type) continue;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(pageRef(p));
      if (out.length >= cap) break;
    }
    return out;
  };

  const concepts = collect("concept", caps.concepts);
  const techniques = collect("technique", caps.techniques);
  const tools = collect("tool", caps.tools);
  const sources = collect("source", caps.sources);

  const suggestedReadingOrder = [...concepts, ...tools, ...techniques, ...sources];

  const cautionsByKey = new Map<string, Caution>();
  for (const p of candidates) {
    if (p.type !== "concept") continue;
    for (const c of p.cautions) {
      cautionsByKey.set(`${c.kind}:${c.text}`, c);
    }
  }
  const cautions = [...cautionsByKey.values()].slice(0, 5);
  cautions.push(...GLOBAL_CAVEATS);

  return {
    matchedPriorities: meta.priorities,
    matchedDomains: meta.domains,
    matchedLayers: meta.layers,
    startingPoints: { concepts, techniques, tools, sources },
    suggestedReadingOrder,
    adjacentConsiderations: adjacentFor(args.intent),
    cautions,
    degraded: searchResult.degraded,
  };
}
