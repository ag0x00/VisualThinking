import { describe, expect, it } from "vitest";
import { extractPrimarySourcesFromBody } from "../../src/parser/extract-primary-sources.js";

describe("extractPrimarySourcesFromBody", () => {
  it("extracts a single citation with URL", () => {
    const body = `## Sources\n\n- de Gelder, B. (2016). *Emotions and the Body*. Oxford UP. https://global.oup.com/academic/product/emotions-and-the-body-9780195374346\n`;
    const sources = extractPrimarySourcesFromBody(body);
    expect(sources).toHaveLength(1);
    expect(sources[0].title).toContain("Emotions and the Body");
    expect(sources[0].url).toBe("https://global.oup.com/academic/product/emotions-and-the-body-9780195374346");
    expect(sources[0].authors).toEqual(["de Gelder, B."]);
    expect(sources[0].year).toBe(2016);
  });

  it("extracts a doi.org URL and detects it", () => {
    const body = `## References\n\n- Tracy, J. L., & Robins, R. W. (2008). The nonverbal expression of pride. *JPSP* 94, 516–530. https://doi.org/10.1037/0022-3514.94.3.516\n`;
    const sources = extractPrimarySourcesFromBody(body);
    expect(sources).toHaveLength(1);
    expect(sources[0].doi).toBe("10.1037/0022-3514.94.3.516");
    expect(sources[0].year).toBe(2008);
  });

  it("accepts a bare URL on its own line", () => {
    const body = `## Sources\n\n- https://example.com/spec\n`;
    const sources = extractPrimarySourcesFromBody(body);
    expect(sources).toHaveLength(1);
    expect(sources[0].url).toBe("https://example.com/spec");
  });

  it("dedupes by URL", () => {
    const body = `## Sources\n\n- A. https://example.com/a\n- B. https://example.com/a\n`;
    const sources = extractPrimarySourcesFromBody(body);
    expect(sources).toHaveLength(1);
  });

  it("returns empty when there is no Sources section", () => {
    expect(extractPrimarySourcesFromBody("Some body text without a Sources heading.")).toEqual([]);
  });

  it("accepts ## References and ## Citations as alternate headings", () => {
    const body = `## References\n\n- https://example.com/ref\n\n## Citations\n\n- https://example.com/cite\n`;
    const sources = extractPrimarySourcesFromBody(body);
    expect(sources).toHaveLength(2);
  });
});
