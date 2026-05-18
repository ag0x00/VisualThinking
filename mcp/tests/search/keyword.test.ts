import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { searchKeyword } from "../../src/search/keyword.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("searchKeyword", () => {
  it("matches on title substring", async () => {
    const vault = await loadVault(FIXTURES);
    const results = searchKeyword(vault, "Concept Full");
    expect(results.some((r) => r.title === "Test Concept Full")).toBe(true);
  });

  it("matches on tag", async () => {
    const vault = await loadVault(FIXTURES);
    const results = searchKeyword(vault, "body-language");
    expect(results.some((r) => r.title === "Test Concept Full")).toBe(true);
  });

  it("ranks title matches above body matches", async () => {
    const vault = await loadVault(FIXTURES);
    const results = searchKeyword(vault, "first class");
    expect(results[0]?.title).toBe("Test Tool First Class");
  });

  it("returns empty array for no matches", async () => {
    const vault = await loadVault(FIXTURES);
    const results = searchKeyword(vault, "zzzz-no-match-zzzz");
    expect(results).toEqual([]);
  });
});
