import { describe, expect, it, vi } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { search } from "../../src/search/search.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("search (unified)", () => {
  it("uses keyword mode when explicitly requested", async () => {
    const vault = await loadVault(FIXTURES);
    const result = await search(vault, { query: "Concept Full", mode: "keyword" });
    expect(result.mode).toBe("keyword");
    expect(result.refs.some((r) => r.title === "Test Concept Full")).toBe(true);
  });

  it("uses structured mode when filters provided and no query", async () => {
    const vault = await loadVault(FIXTURES);
    const result = await search(vault, { mode: "structured", filters: { type: "tool" } });
    expect(result.mode).toBe("structured");
    expect(result.refs.every((r) => r.type === "tool")).toBe(true);
  });

  it("falls back from semantic to keyword when ollama unavailable", async () => {
    const vault = await loadVault(FIXTURES);
    const fetchMock = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
    const result = await search(vault, {
      query: "Concept Full",
      mode: "semantic",
      ollamaUrl: "http://127.0.0.1:11434",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(result.degraded).toBe(true);
    expect(result.mode).toBe("keyword");
    expect(result.refs.some((r) => r.title === "Test Concept Full")).toBe(true);
  });
});
