import { describe, expect, it } from "vitest";
import { classifyDomains } from "../../src/parser/domain-classifier.js";

describe("classifyDomains", () => {
  it("assigns body domain from tags", () => {
    const result = classifyDomains({ tags: ["body-language", "pose", "test"] }, "concept");
    expect(result.domains).toContain("body");
    expect(result.layer).toBe(3); // L3 design layer
  });

  it("assigns color domain", () => {
    const result = classifyDomains({ tags: ["color", "oklch"] }, "concept");
    expect(result.domains).toContain("color");
  });

  it("assigns motion-symmetry domain from symmetry/tessellation tags", () => {
    const result = classifyDomains({ tags: ["symmetry", "tessellation", "pattern"] }, "concept");
    expect(result.domains).toContain("motion-symmetry");
  });

  it("respects explicit domain: frontmatter override", () => {
    const result = classifyDomains({ tags: ["misc"], domain: ["affect", "perception"] }, "concept");
    expect(result.domains).toEqual(["affect", "perception"]);
  });

  it("accepts a single-string domain override", () => {
    const result = classifyDomains({ tags: [], domain: "aesthetics" }, "concept");
    expect(result.domains).toEqual(["aesthetics"]);
  });

  it("falls back to perception domain + L1 for un-tagged concept pages", () => {
    const result = classifyDomains({ tags: [] }, "concept");
    expect(result.domains).toEqual(["perception"]);
    expect(result.layer).toBe(1);
  });

  it("assigns L4 for technique pages", () => {
    const result = classifyDomains({ tags: ["color"] }, "technique");
    expect(result.layer).toBe(4);
  });

  it("assigns L4 for tool pages", () => {
    const result = classifyDomains({ tags: ["color"] }, "tool");
    expect(result.layer).toBe(4);
  });

  it("allows multiple domains when multiple tag families match", () => {
    const result = classifyDomains({ tags: ["color", "body-language"] }, "concept");
    expect(result.domains).toEqual(expect.arrayContaining(["color", "body"]));
  });
});
