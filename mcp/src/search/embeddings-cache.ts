import { readFile } from "node:fs/promises";
import path from "node:path";

export interface EmbeddingsCache {
  model: string;
  byPath: Map<string, number[]>;
}

interface RawCacheEntryV1 {
  path?: string;
  vector?: number[];
}

interface RawCacheEntryV2 {
  hash?: string;
  embedding?: number[];
  computed_at?: string;
}

type RawCacheEntry = RawCacheEntryV1 | RawCacheEntryV2 | number[];

interface RawCache {
  version?: number;
  model?: string;
  embeddings?: Record<string, RawCacheEntry>;
}

export async function loadEmbeddingsCache(vaultRoot: string): Promise<EmbeddingsCache | null> {
  const cachePath = path.join(vaultRoot, ".vault-meta", "tiling-cache.json");
  try {
    const text = await readFile(cachePath, "utf-8");
    const data = JSON.parse(text) as RawCache;
    const model = data.model ?? "unknown";
    const byPath = new Map<string, number[]>();
    for (const [key, entry] of Object.entries(data.embeddings ?? {})) {
      if (Array.isArray(entry)) continue;
      // V1 format: key is a hash, entry has { path, vector }
      if ("path" in entry && "vector" in entry && entry.path && Array.isArray(entry.vector)) {
        byPath.set(entry.path, entry.vector);
        continue;
      }
      // V2 format: key is the relative path, entry has { hash, embedding, computed_at }
      if ("embedding" in entry && Array.isArray(entry.embedding)) {
        byPath.set(key, entry.embedding);
      }
    }
    return { model, byPath };
  } catch (err: unknown) {
    if (err instanceof Error && /ENOENT/.test(err.message)) return null;
    throw err;
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}
