import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { getRelated } from "../../src/handlers/get-related.js";
import { getCautions } from "../../src/handlers/get-cautions.js";
import { getProvenance } from "../../src/handlers/get-provenance.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("getRelated", () => {
  it("merges backlinks + outgoing", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getRelated(vault, { id: "c-900001" });
    expect(result.refs.some((r) => r.title === "Test Technique Full")).toBe(true);
  });

  it("deduplicates and excludes self", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getRelated(vault, { id: "c-900001" });
    const titles = result.refs.map((r) => r.title);
    expect(new Set(titles).size).toBe(titles.length);
    expect(titles).not.toContain("Test Concept Full");
  });
});

describe("getCautions", () => {
  it("returns cautions for a Concept page", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getCautions(vault, { id: "c-900001" });
    expect(result.cautions.length).toBeGreaterThan(0);
  });

  it("returns empty for a page without cautions", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getCautions(vault, { id: "c-900002" });
    expect(result.cautions).toEqual([]);
  });
});

describe("getProvenance", () => {
  it("returns sweep + priorityRank from internal frontmatter", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getProvenance(vault, { id: "c-900001" });
    expect(result.createdBySweep).toBe("test-fixture-sweep");
    expect(result.priorityRank).toBe(11);
    expect(result.legacy).toBe(false);
  });

  it("returns error for not_found id", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getProvenance(vault, { id: "c-999999" });
    expect(result.error).toBe("not_found");
  });
});
