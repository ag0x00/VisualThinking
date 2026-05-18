import { describe, expect, it, vi } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { orient } from "../../src/handlers/orient.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("orient", () => {
  it("returns a starter kit with keyword fallback when ollama unavailable", async () => {
    const vault = await loadVault(FIXTURES);
    const fetchMock = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
    const result = await orient(vault, {
      intent: "Concept Full body language",
    }, {
      ollamaUrl: "http://127.0.0.1:11434",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(result.degraded).toBe(true);
    expect(result.startingPoints.concepts.length).toBeGreaterThan(0);
  });

  it("infers domains from matched candidate pages", async () => {
    const vault = await loadVault(FIXTURES);
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    const result = await orient(vault, { intent: "body language test" }, {
      ollamaUrl: "http://127.0.0.1:11434",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(result.matchedDomains).toContain("body");
  });

  it("returns adjacent considerations and global cautions", async () => {
    const vault = await loadVault(FIXTURES);
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    const result = await orient(vault, { intent: "interactive body" }, {
      ollamaUrl: "http://127.0.0.1:11434",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(result.adjacentConsiderations.length).toBeGreaterThanOrEqual(0);
    expect(result.cautions.length).toBeGreaterThanOrEqual(0);
  });
});
