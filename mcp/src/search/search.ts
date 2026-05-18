import { searchKeyword } from "./keyword.js";
import { searchSemantic } from "./semantic.js";
import { searchStructured, type StructuredFilter } from "./structured.js";
import type { VaultIndex } from "../parser/vault-loader.js";
import type { PageRef } from "../types/shared.js";

export type SearchMode = "semantic" | "keyword" | "structured";

export interface SearchOptions {
  query?: string;
  mode?: SearchMode;
  filters?: StructuredFilter;
  ollamaUrl?: string;
  fetchImpl?: typeof fetch;
  limit?: number;
}

export interface SearchResult {
  refs: PageRef[];
  mode: SearchMode;
  degraded: boolean;
  error?: string;
}

async function applyFilterToRefs(vault: VaultIndex, refs: PageRef[], filters?: StructuredFilter): Promise<PageRef[]> {
  if (!filters) return refs;
  const allowed = new Set(searchStructured(vault, filters, 1000).map((r) => r.id));
  return refs.filter((r) => allowed.has(r.id));
}

export async function search(vault: VaultIndex, opts: SearchOptions): Promise<SearchResult> {
  const mode: SearchMode = opts.mode ?? (opts.query ? "semantic" : "structured");

  if (mode === "structured") {
    return {
      refs: searchStructured(vault, opts.filters ?? {}, opts.limit),
      mode: "structured",
      degraded: false,
    };
  }

  if (mode === "keyword") {
    if (!opts.query) return { refs: [], mode: "keyword", degraded: false };
    const refs = await applyFilterToRefs(vault, searchKeyword(vault, opts.query, opts.limit), opts.filters);
    return { refs, mode: "keyword", degraded: false };
  }

  // semantic with fallback
  if (!opts.query) return { refs: [], mode: "semantic", degraded: false };
  if (!opts.ollamaUrl) {
    return {
      refs: await applyFilterToRefs(vault, searchKeyword(vault, opts.query, opts.limit), opts.filters),
      mode: "keyword",
      degraded: true,
      error: "no_ollama_url",
    };
  }
  const sem = await searchSemantic(vault, opts.query, {
    ollamaUrl: opts.ollamaUrl,
    fetchImpl: opts.fetchImpl,
    limit: opts.limit,
  });
  if (sem.degraded) {
    return {
      refs: await applyFilterToRefs(vault, searchKeyword(vault, opts.query, opts.limit), opts.filters),
      mode: "keyword",
      degraded: true,
      error: sem.error,
    };
  }
  const refs = await applyFilterToRefs(vault, sem.refs, opts.filters);
  return { refs, mode: "semantic", degraded: false };
}
