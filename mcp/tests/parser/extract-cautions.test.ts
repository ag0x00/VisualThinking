import { describe, expect, it } from "vitest";
import { extractCautions } from "../../src/parser/extract-cautions.js";

describe("extractCautions", () => {
  it("detects a contested-framing caution from a warning callout", () => {
    const body = `> [!warning] Empirical caveat\n> The universal-inverted-U has been **contested** since 2015.\n`;
    const cautions = extractCautions(body);
    expect(cautions).toHaveLength(1);
    expect(cautions[0].kind).toBe("contested-framing");
    expect(cautions[0].text).toContain("contested");
  });

  it("detects a cross-cultural-limit caution from a note callout", () => {
    const body = `> [!note] Cross-cultural validity\n> Validated primarily on WEIRD samples.\n`;
    const cautions = extractCautions(body);
    expect(cautions).toHaveLength(1);
    expect(cautions[0].kind).toBe("cross-cultural-limit");
  });

  it("detects an outdated-successor caution from a Successor heading section", () => {
    const body = `## Successor theory\n\nThe 1970s framing has been **superseded** by ...\n`;
    const cautions = extractCautions(body);
    expect(cautions.some((c) => c.kind === "outdated-successor")).toBe(true);
  });

  it("returns empty array for body with no callouts or successor sections", () => {
    expect(extractCautions("Plain text. No callouts.")).toEqual([]);
  });

  it("captures multi-line callout body", () => {
    const body = `> [!warning] Multi-line\n> First line\n> Second line is also part of the caution.\n\nNot part.`;
    const cautions = extractCautions(body);
    expect(cautions[0].text).toContain("First line");
    expect(cautions[0].text).toContain("Second line");
    expect(cautions[0].text).not.toContain("Not part");
  });
});
