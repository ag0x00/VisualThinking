import { describe, expect, it } from "vitest";
import { extractWikilinks } from "../../src/parser/extract-wikilinks.js";

describe("extractWikilinks", () => {
  it("extracts simple [[Target]] links", () => {
    const links = extractWikilinks("See [[Universal Body Language Dimensions]] for the substrate.");
    expect(links).toEqual([{ target: "Universal Body Language Dimensions", resolved: false }]);
  });

  it("extracts aliased [[Target|alias]] links", () => {
    const links = extractWikilinks("Refer to [[Research - Body Language Depth Sweep|the depth-dive synthesis]].");
    expect(links).toEqual([
      { target: "Research - Body Language Depth Sweep", alias: "the depth-dive synthesis", resolved: false },
    ]);
  });

  it("ignores wikilinks inside code blocks", () => {
    const text = "```\n[[Not A Link]]\n```\nBut [[This Is]] is.";
    const links = extractWikilinks(text);
    expect(links).toHaveLength(1);
    expect(links[0].target).toBe("This Is");
  });

  it("ignores wikilinks inside inline code", () => {
    const links = extractWikilinks("Use `[[Inline Code]]` syntax. But [[Real Link]] counts.");
    expect(links).toHaveLength(1);
    expect(links[0].target).toBe("Real Link");
  });

  it("strips section anchors from targets", () => {
    const links = extractWikilinks("See [[Page#Section]] for details.");
    expect(links).toEqual([{ target: "Page", resolved: false }]);
  });

  it("deduplicates repeated links", () => {
    const links = extractWikilinks("[[A]] and [[A]] and [[B]].");
    expect(links).toHaveLength(2);
    expect(links.map((l) => l.target)).toEqual(["A", "B"]);
  });
});
