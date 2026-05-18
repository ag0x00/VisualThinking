import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPage } from "../../src/parser/load-page.js";
import { parsePage } from "../../src/parser/parse-page.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("parsePage", () => {
  it("parses a Concept page with cautions + primary sources", async () => {
    const raw = await loadPage(path.join(FIXTURES, "wiki/concepts/Test Concept Full.md"), FIXTURES);
    const result = parsePage(raw);
    expect(result.diagnostics.filter((d) => d.level === "error")).toHaveLength(0);
    expect(result.page).not.toBeNull();
    const page = result.page!;
    expect(page.type).toBe("concept");
    expect(page.id).toBe("c-900001");
    expect(page.title).toBe("Test Concept Full");
    if (page.type !== "concept") throw new Error("type narrowing");
    expect(page.domains).toContain("body");
    expect(page.layer).toBe(3);
    expect(page.cautions.length).toBeGreaterThan(0);
    expect(page.primarySources.length).toBeGreaterThan(0);
    expect(page.primarySources[0].url).toMatch(/^https?:\/\//);
  });

  it("parses a Tool page with verdict + packageRefs", async () => {
    const raw = await loadPage(path.join(FIXTURES, "wiki/tools/Test Tool First Class.md"), FIXTURES);
    const result = parsePage(raw);
    const page = result.page!;
    if (page.type !== "tool") throw new Error("type narrowing");
    expect(page.verdict).toBe("first-class");
    expect(page.applications["1"]).toBe(5);
  });

  it("parses a Technique page with implementsConcepts + performanceBudget", async () => {
    const raw = await loadPage(path.join(FIXTURES, "wiki/techniques/Test Technique Full.md"), FIXTURES);
    const result = parsePage(raw);
    const page = result.page!;
    if (page.type !== "technique") throw new Error("type narrowing");
    expect(page.language).toBe("typescript");
    expect(page.implementsConcepts.length).toBeGreaterThan(0);
    expect(page.implementsConcepts[0].title).toBe("Test Concept Full");
  });

  it("parses a Source page with URL + authors + year", async () => {
    const raw = await loadPage(path.join(FIXTURES, "wiki/sources/Test Source With URL.md"), FIXTURES);
    const result = parsePage(raw);
    const page = result.page!;
    if (page.type !== "source") throw new Error("type narrowing");
    expect(page.url).toBe("https://arxiv.org/abs/1801.04486");
    expect(page.year).toBe(2018);
    expect(page.authors).toEqual(["Aaron Hertzmann"]);
  });

  it("returns an error diagnostic when type field is missing", () => {
    const raw = {
      sourcePath: "/fake/path.md",
      relPath: "wiki/concepts/Untyped.md",
      filename: "Untyped",
      frontmatter: { title: "Untyped" } as Record<string, unknown>,
      body: "Body without type field.",
    };
    const result = parsePage(raw);
    expect(result.page).toBeNull();
    expect(result.diagnostics.some((d) => d.level === "error" && /type/i.test(d.message))).toBe(true);
  });

  it("returns a warning (not error) for unknown frontmatter fields", async () => {
    const raw = await loadPage(path.join(FIXTURES, "wiki/concepts/Test Concept Full.md"), FIXTURES);
    raw.frontmatter.exotic_field = "hello";
    const result = parsePage(raw);
    expect(result.page).not.toBeNull();
    expect(result.diagnostics.some((d) => d.level === "warn" && d.message.includes("exotic_field"))).toBe(true);
  });

  it("uses filename-derived slug for pages without addresses", () => {
    const raw = {
      sourcePath: "/fake/Some Concept.md",
      relPath: "wiki/concepts/Some Concept.md",
      filename: "Some Concept",
      frontmatter: { title: "Some Concept", type: "concept", tags: ["test"], status: "stub" } as Record<string, unknown>,
      body: "Body.",
    };
    const result = parsePage(raw);
    expect(result.page).not.toBeNull();
    expect(result.page!.id).toMatch(/^slug:/);
    expect(result.page!.slug).toBe("some-concept");
  });
});
