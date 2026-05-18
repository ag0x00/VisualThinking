import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { listDomains } from "../../src/handlers/list-domains.js";
import { getDomain } from "../../src/handlers/get-domain.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("listDomains", () => {
  it("returns all 14 domains with descriptions", () => {
    const result = listDomains();
    expect(result.domains.length).toBe(14);
    expect(result.domains[0]).toHaveProperty("domain");
    expect(result.domains[0]).toHaveProperty("description");
  });
});

describe("getDomain", () => {
  it("returns pages grouped by layer for a given domain", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getDomain(vault, { domain: "body" });
    expect(result.summary).toBeTruthy();
    expect(result.concepts.length).toBeGreaterThanOrEqual(1);
    expect(result.concepts[0].title).toBe("Test Concept Full");
  });

  it("returns empty domain result without throwing for a domain with no pages", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getDomain(vault, { domain: "iconography" });
    expect(result.concepts).toEqual([]);
    expect(result.techniques).toEqual([]);
    expect(result.tools).toEqual([]);
  });
});
