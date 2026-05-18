import type { VaultIndex } from "../parser/vault-loader.js";
import type { ApplicationPriority, Domain, Layer, PageRef, PageType } from "../types/shared.js";
import type { Page } from "../types/public.js";

export interface StructuredFilter {
  type?: PageType | PageType[];
  domains?: Domain[];
  layers?: Layer[];
  priority?: ApplicationPriority;
  verdict?: string;
}

function toRef(p: Page): PageRef {
  return { id: p.id, title: p.title, type: p.type, ...(p.slug ? { slug: p.slug } : {}) };
}

function pagePriorities(p: Page): number[] {
  if (p.type === "concept" || p.type === "technique") return p.applications;
  if (p.type === "tool") {
    return Object.entries(p.applications)
      .filter(([, v]) => v >= 3)
      .map(([k]) => Number(k));
  }
  return [];
}

function pageDomains(p: Page): Domain[] {
  if (p.type === "concept") return p.domains;
  return [];
}

function pageLayer(p: Page): Layer | null {
  if (p.type === "concept") return p.layer;
  if (p.type === "technique" || p.type === "tool") return 4;
  return null;
}

export function searchStructured(vault: VaultIndex, filter: StructuredFilter, limit = 100): PageRef[] {
  const types = filter.type ? (Array.isArray(filter.type) ? filter.type : [filter.type]) : null;
  const results: Page[] = [];
  for (const p of vault.pages) {
    if (types && !types.includes(p.type)) continue;
    if (filter.verdict !== undefined) {
      if (p.type !== "tool") continue;
      // Allow substring match since real-vault verdicts can be multi-word like "first-class-pedagogical-second-class-production"
      if (!p.verdict.includes(filter.verdict)) continue;
    }
    if (filter.domains && filter.domains.length > 0) {
      const ds = pageDomains(p);
      if (!filter.domains.some((d) => ds.includes(d))) continue;
    }
    if (filter.layers && filter.layers.length > 0) {
      const l = pageLayer(p);
      if (l == null || !filter.layers.includes(l)) continue;
    }
    if (filter.priority !== undefined) {
      const prios = pagePriorities(p);
      if (!prios.includes(filter.priority)) continue;
    }
    results.push(p);
    if (results.length >= limit) break;
  }
  return results.map(toRef);
}
