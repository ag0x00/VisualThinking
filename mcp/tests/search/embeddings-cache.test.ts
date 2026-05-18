import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEmbeddingsCache } from "../../src/search/embeddings-cache.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("loadEmbeddingsCache", () => {
  it("loads the cache file and returns path → vector map", async () => {
    const cache = await loadEmbeddingsCache(FIXTURES);
    expect(cache?.model).toBe("nomic-embed-text");
    expect(cache?.byPath.size).toBeGreaterThan(0);
    expect(cache?.byPath.get("wiki/concepts/Test Concept Full.md")).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
  });

  it("returns null when cache file does not exist", async () => {
    const cache = await loadEmbeddingsCache("/nonexistent/vault");
    expect(cache).toBeNull();
  });
});
