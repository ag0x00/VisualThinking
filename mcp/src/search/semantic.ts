import { cosineSimilarity, loadEmbeddingsCache } from "./embeddings-cache.js";
import type { VaultIndex } from "../parser/vault-loader.js";
import type { PageRef } from "../types/shared.js";
import type { Page } from "../types/public.js";

export interface SemanticSearchOptions {
  ollamaUrl: string;
  model?: string;
  fetchImpl?: typeof fetch;
  limit?: number;
}

export interface ScoredRef extends PageRef { score: number; }

export interface SemanticSearchResult {
  refs: ScoredRef[];
  degraded: boolean;
  error?: "ollama_unavailable" | "embeddings_cache_missing";
}

async function embedQuery(
  query: string,
  url: string,
  model: string,
  fetchImpl: typeof fetch,
): Promise<number[] | null> {
  try {
    const res = await fetchImpl(`${url.replace(/\/$/, "")}/api/embeddings`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, prompt: query }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { embedding?: number[] };
    return data.embedding ?? null;
  } catch {
    return null;
  }
}

export async function searchSemantic(
  vault: VaultIndex,
  query: string,
  opts: SemanticSearchOptions,
): Promise<SemanticSearchResult> {
  const cache = await loadEmbeddingsCache(vault.vaultRoot);
  if (!cache) {
    return { refs: [], degraded: true, error: "embeddings_cache_missing" };
  }
  const fetchImpl = opts.fetchImpl ?? fetch;
  const model = opts.model ?? cache.model;
  const queryVec = await embedQuery(query, opts.ollamaUrl, model, fetchImpl);
  if (!queryVec) {
    return { refs: [], degraded: true, error: "ollama_unavailable" };
  }
  const limit = opts.limit ?? 30;

  // Build relPath → Page map for joining cache entries to pages.
  // The fixture and real-vault page paths follow `wiki/<type+s>/<title>.md` convention.
  const byRelPath = new Map<string, Page>();
  for (const p of vault.pages) {
    const folder = p.type === "concept" ? "concepts" : `${p.type}s`;
    const rel = `wiki/${folder}/${p.title}.md`;
    byRelPath.set(rel, p);
  }

  const scored: ScoredRef[] = [];
  for (const [relPath, vec] of cache.byPath) {
    const sim = cosineSimilarity(queryVec, vec);
    const page = byRelPath.get(relPath);
    if (!page) continue;
    scored.push({
      id: page.id,
      title: page.title,
      type: page.type,
      ...(page.slug ? { slug: page.slug } : {}),
      score: sim,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return { refs: scored.slice(0, limit), degraded: false };
}
