import { readFile } from "node:fs/promises";
import path from "node:path";

export interface EmbeddingsCache {
  model: string;
  byPath: Map<string, number[]>;
}

interface RawCache {
  version?: number;
  model?: string;
  embeddings?: Record<string, { path?: string; vector?: number[] } | number[]>;
}

export async function loadEmbeddingsCache(vaultRoot: string): Promise<EmbeddingsCache | null> {
  const cachePath = path.join(vaultRoot, ".vault-meta", "tiling-cache.json");
  try {
    const text = await readFile(cachePath, "utf-8");
    const data = JSON.parse(text) as RawCache;
    const model = data.model ?? "unknown";
    const byPath = new Map<string, number[]>();
    for (const entry of Object.values(data.embeddings ?? {})) {
      if (Array.isArray(entry)) continue;
      if (entry.path && Array.isArray(entry.vector)) {
        byPath.set(entry.path, entry.vector);
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
