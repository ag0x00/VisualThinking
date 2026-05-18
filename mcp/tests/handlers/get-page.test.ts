import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { getConcept, getTechnique, getTool, getSource } from "../../src/handlers/get-page.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("get-page handlers", () => {
  it("getConcept returns a typed Concept by address", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getConcept(vault, { id: "c-900001" });
    expect(result.error).toBeUndefined();
    expect(result.page?.type).toBe("concept");
    expect(result.page?.title).toBe("Test Concept Full");
  });

  it("getConcept returns a not_found error with suggestions on miss", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getConcept(vault, { id: "c-999999" });
    expect(result.error).toBe("not_found");
    expect(result.page).toBeNull();
    expect(result.suggestions).toBeDefined();
  });

  it("getConcept refuses a non-concept id", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getConcept(vault, { id: "c-900005" }); // technique address
    expect(result.error).toBe("type_mismatch");
  });

  it("getTechnique returns the technique by address", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getTechnique(vault, { id: "c-900005" });
    expect(result.page?.type).toBe("technique");
  });

  it("getTool returns the tool by address", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getTool(vault, { id: "c-900003" });
    expect(result.page?.type).toBe("tool");
  });

  it("getSource returns the source by address", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getSource(vault, { id: "c-900007" });
    expect(result.page?.type).toBe("source");
  });

  it("accepts slug lookup", async () => {
    const vault = await loadVault(FIXTURES);
    const result = getConcept(vault, { id: "test-concept-full" });
    expect(result.page?.title).toBe("Test Concept Full");
  });
});
