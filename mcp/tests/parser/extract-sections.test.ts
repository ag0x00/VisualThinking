import { describe, expect, it } from "vitest";
import { extractSections } from "../../src/parser/extract-sections.js";

describe("extractSections", () => {
  it("splits a body on ## headings", () => {
    const body = `# Page Title

Lead paragraph.

## First Section

Content of first.

## Second Section

Content of second.
`;
    const sections = extractSections(body);
    expect(sections).toHaveLength(2);
    expect(sections[0].heading).toBe("First Section");
    expect(sections[0].level).toBe(2);
    expect(sections[0].markdown.trim()).toBe("Content of first.");
    expect(sections[1].heading).toBe("Second Section");
  });

  it("captures ### subsections as separate Section entries with level 3", () => {
    const body = `## Top

Top text.

### Subsection

Sub text.

## Next Top

More.
`;
    const sections = extractSections(body);
    expect(sections).toHaveLength(3);
    expect(sections[0].heading).toBe("Top");
    expect(sections[0].level).toBe(2);
    expect(sections[1].heading).toBe("Subsection");
    expect(sections[1].level).toBe(3);
    expect(sections[2].heading).toBe("Next Top");
    expect(sections[2].level).toBe(2);
  });

  it("returns empty array when body has no headings", () => {
    const sections = extractSections("Just a paragraph.");
    expect(sections).toEqual([]);
  });

  it("captures #### sections as level 4", () => {
    const body = `## Top\n\n#### Deep\n\nDeep text.\n`;
    const sections = extractSections(body);
    expect(sections.find((s) => s.heading === "Deep")?.level).toBe(4);
  });

  it("does not capture # (level 1) headings — those are page titles", () => {
    const body = `# Page Title\n\nIntro.\n\n## Real Section\n\nReal.\n`;
    const sections = extractSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].heading).toBe("Real Section");
  });
});
