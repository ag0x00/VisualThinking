import { describe, expect, it, vi } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { searchSemantic } from "../../src/search/semantic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("searchSemantic", () => {
  it("returns ranked PageRefs when ollama is mocked to return a vector", async () => {
    const vault = await loadVault(FIXTURES);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ embedding: [0.11, 0.21, 0.31, 0.41, 0.51] }),
    });
    const results = await searchSemantic(vault, "body-language dimensions", {
      ollamaUrl: "http://127.0.0.1:11434",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(results.degraded).toBe(false);
    expect(results.refs.length).toBeGreaterThan(0);
    expect(results.refs[0].score).toBeGreaterThan(0);
  });

  it("returns degraded result when ollama is unreachable", async () => {
    const vault = await loadVault(FIXTURES);
    const fetchMock = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
    const results = await searchSemantic(vault, "anything", {
      ollamaUrl: "http://127.0.0.1:11434",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(results.degraded).toBe(true);
    expect(results.error).toBe("ollama_unavailable");
    expect(results.refs).toEqual([]);
  });

  it("returns degraded result when embeddings cache is missing", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ embedding: [0, 0, 0, 0, 0] }) });
    const results = await searchSemantic(
      { pages: [], byAddress: new Map(), bySlug: new Map(), byTitle: new Map(), byDomain: new Map(), provenance: new Map(), diagnostics: [], vaultRoot: "/nope" },
      "x",
      { ollamaUrl: "http://127.0.0.1:11434", fetchImpl: fetchMock as unknown as typeof fetch },
    );
    expect(results.degraded).toBe(true);
    expect(results.error).toBe("embeddings_cache_missing");
  });
});
