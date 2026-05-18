import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPage } from "../../src/parser/load-page.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("loadPage", () => {
  it("loads a page and parses frontmatter", async () => {
    const file = path.join(FIXTURES, "wiki/concepts/Test Concept Full.md");
    const raw = await loadPage(file, FIXTURES);
    expect(raw.frontmatter.title).toBe("Test Concept Full");
    expect(raw.frontmatter.type).toBe("concept");
    expect(raw.frontmatter.address).toBe("c-900001");
    expect(raw.frontmatter.tags).toEqual(["test", "concept", "body-language", "programmable"]);
    expect(raw.body).toContain("The first paragraph functions as the summary");
    expect(raw.filename).toBe("Test Concept Full");
    expect(raw.relPath).toBe("wiki/concepts/Test Concept Full.md");
  });

  it("strips the frontmatter from body", async () => {
    const file = path.join(FIXTURES, "wiki/concepts/Test Concept Full.md");
    const raw = await loadPage(file, FIXTURES);
    expect(raw.body.startsWith("---")).toBe(false);
    expect(raw.body).not.toContain("address: c-900001");
  });

  it("handles a page with minimal frontmatter", async () => {
    const file = path.join(FIXTURES, "wiki/sources/Test Source Bare.md");
    const raw = await loadPage(file, FIXTURES);
    expect(raw.frontmatter.url).toBeUndefined();
    expect(raw.frontmatter.year).toBeUndefined();
    expect(raw.frontmatter.citation).toBe("Unknown author. Bare citation without URL.");
  });
});
