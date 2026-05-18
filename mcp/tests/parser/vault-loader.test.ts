import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("loadVault", () => {
  it("loads all fixture pages with zero errors", async () => {
    const vault = await loadVault(FIXTURES);
    const errors = vault.diagnostics.filter((d) => d.level === "error");
    expect(errors).toEqual([]);
    expect(vault.pages.length).toBe(8);
  });

  it("indexes pages by address", async () => {
    const vault = await loadVault(FIXTURES);
    const page = vault.byAddress.get("c-900001");
    expect(page).toBeDefined();
    expect(page?.title).toBe("Test Concept Full");
  });

  it("indexes pages by slug", async () => {
    const vault = await loadVault(FIXTURES);
    const page = vault.bySlug.get("test-concept-full");
    expect(page).toBeDefined();
  });

  it("indexes pages by title (case-insensitive)", async () => {
    const vault = await loadVault(FIXTURES);
    const page = vault.byTitle.get("test concept full");
    expect(page).toBeDefined();
    expect(page?.id).toBe("c-900001");
  });

  it("resolves outgoing wikilinks to PageRefs", async () => {
    const vault = await loadVault(FIXTURES);
    const concept = vault.byAddress.get("c-900001");
    if (!concept || concept.type !== "concept") throw new Error("setup");
    const ref = concept.relatedConcepts.find((r) => r.title === "Test Technique Full");
    expect(ref).toBeDefined();
    expect(ref?.id).toBe("c-900005");
  });

  it("populates implementedBy backlinks on concepts from technique 'implements' field", async () => {
    const vault = await loadVault(FIXTURES);
    const concept = vault.byAddress.get("c-900001");
    if (!concept || concept.type !== "concept") throw new Error("setup");
    const back = concept.implementedBy.find((r) => r.title === "Test Technique Full");
    expect(back).toBeDefined();
  });

  it("merges primarySources from linked Source pages into concept response", async () => {
    const vault = await loadVault(FIXTURES);
    const concept = vault.byAddress.get("c-900001");
    if (!concept || concept.type !== "concept") throw new Error("setup");
    const fromSourcePage = concept.primarySources.find((s) =>
      s.url === "https://arxiv.org/abs/1801.04486",
    );
    expect(fromSourcePage).toBeDefined();
  });

  it("indexes pages by domain", async () => {
    const vault = await loadVault(FIXTURES);
    const bodyPages = vault.byDomain.get("body") ?? [];
    expect(bodyPages.length).toBeGreaterThanOrEqual(1);
    expect(bodyPages.some((p) => p.title === "Test Concept Full")).toBe(true);
  });
});
