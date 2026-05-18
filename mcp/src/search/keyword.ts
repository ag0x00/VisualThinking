import type { VaultIndex } from "../parser/vault-loader.js";
import type { PageRef } from "../types/shared.js";
import type { Page } from "../types/public.js";

function toRef(p: Page): PageRef {
  return { id: p.id, title: p.title, type: p.type, ...(p.slug ? { slug: p.slug } : {}) };
}

interface Scored { page: Page; score: number; }

export function searchKeyword(vault: VaultIndex, query: string, limit = 30): PageRef[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored: Scored[] = [];
  for (const p of vault.pages) {
    let score = 0;
    const title = p.title.toLowerCase();
    const summary = "summary" in p ? p.summary.toLowerCase() : "";
    const body = "body" in p ? (p as Page).body.markdown.toLowerCase() : "";
    for (const t of tokens) {
      if (title.includes(t)) score += 10;
      if (summary.includes(t)) score += 3;
      if (body.includes(t)) score += 1;
    }
    if (score > 0) scored.push({ page: p, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => toRef(s.page));
}
