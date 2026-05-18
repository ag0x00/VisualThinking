import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { searchStructured } from "../../src/search/structured.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("searchStructured", () => {
  it("filters by type", async () => {
    const vault = await loadVault(FIXTURES);
    const tools = searchStructured(vault, { type: "tool" });
    expect(tools.length).toBe(2);
    expect(tools.every((r) => r.type === "tool")).toBe(true);
  });

  it("filters by verdict (for tools)", async () => {
    const vault = await loadVault(FIXTURES);
    const firstClass = searchStructured(vault, { type: "tool", verdict: "first-class" });
    expect(firstClass.length).toBe(1);
    expect(firstClass[0].title).toBe("Test Tool First Class");
  });

  it("filters by domain", async () => {
    const vault = await loadVault(FIXTURES);
    const body = searchStructured(vault, { domains: ["body"] });
    expect(body.some((r) => r.title === "Test Concept Full")).toBe(true);
  });

  it("filters by application priority (for concepts/techniques)", async () => {
    const vault = await loadVault(FIXTURES);
    const p1 = searchStructured(vault, { priority: 1 });
    expect(p1.some((r) => r.title === "Test Concept Full")).toBe(true);
    expect(p1.some((r) => r.title === "Test Technique Full")).toBe(true);
  });

  it("combines multiple filters with AND", async () => {
    const vault = await loadVault(FIXTURES);
    const result = searchStructured(vault, { type: "technique", priority: 1 });
    expect(result.every((r) => r.type === "technique")).toBe(true);
  });
});
