import type { VaultIndex } from "../parser/vault-loader.js";
import type { Domain, Layer, PageRef } from "../types/shared.js";

export interface GetDomainResult {
  domain: Domain;
  summary: string;
  byLayer: Record<Layer, PageRef[]>;
  concepts: PageRef[];
  techniques: PageRef[];
  tools: PageRef[];
  sources: PageRef[];
}

function toRef(p: { id: string; title: string; type: PageRef["type"]; slug?: string }): PageRef {
  return { id: p.id, title: p.title, type: p.type, ...(p.slug ? { slug: p.slug } : {}) };
}

export function getDomain(vault: VaultIndex, args: { domain: Domain }): GetDomainResult {
  const concepts: PageRef[] = [];
  const techniques: PageRef[] = [];
  const tools: PageRef[] = [];
  const sources: PageRef[] = [];
  const byLayer: Record<Layer, PageRef[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  for (const p of vault.pages) {
    if (p.type === "concept" && p.domains.includes(args.domain)) {
      const ref = toRef(p);
      concepts.push(ref);
      byLayer[p.layer].push(ref);
    } else if (p.type === "technique") {
      const matches = p.implementsConcepts.some((ref) => {
        const target = vault.byAddress.get(ref.id);
        return target?.type === "concept" && target.domains.includes(args.domain);
      });
      if (matches) techniques.push(toRef(p));
    }
  }

  const summary = `${concepts.length} concepts, ${techniques.length} techniques, ${tools.length} tools in domain "${args.domain}".`;
  return { domain: args.domain, summary, byLayer, concepts, techniques, tools, sources };
}
