import type { ExternalSourceRef } from "../types/shared.js";

const SOURCES_HEADING_RE = /^##\s+(Sources|References|Citations)\s*\n([\s\S]*?)(?=\n## |\n$|$)/gm;
const URL_RE = /(https?:\/\/[^\s)]+)/;
const YEAR_RE = /\((\d{4})\)/;
const DOI_RE = /doi\.org\/([^\s)]+)/i;

function inferKind(url: string): ExternalSourceRef["kind"] {
  if (/arxiv\.org/i.test(url)) return "paper";
  if (/doi\.org/i.test(url)) return "paper";
  if (/github\.com/i.test(url)) return "code";
  if (/w3\.org\/|spec\b/i.test(url)) return "spec";
  if (/youtube\.com|vimeo\.com/i.test(url)) return "video";
  if (/docs?\.|developer\./i.test(url)) return "documentation";
  return "article";
}

function extractAuthors(line: string): string[] | undefined {
  // Heuristic: text before "(YYYY)" split on author separators.
  // APA style: "Surname, I. N., & Surname2, J." — authors separated by ", & " or " & ".
  // Single-author: "Surname, I." — comma is part of name, not a separator.
  const yearMatch = line.match(YEAR_RE);
  if (!yearMatch) return undefined;
  const before = line.slice(0, line.indexOf(yearMatch[0])).trim();
  // Strip list markers and trailing commas/spaces (but preserve trailing period — it's part of initials)
  const cleaned = before.replace(/^[-*•]\s*/, "").replace(/[,\s]+$/, "").trim();
  if (!cleaned) return undefined;
  // Split on " & ", " and ", or ", & " (multi-author separators in APA style)
  const parts = cleaned
    .split(/,\s*&\s*|\s+&\s+|\s+and\s+/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts;
}

function extractTitle(line: string, url: string): string {
  // Strip the URL
  let title = line.replace(url, "").trim();
  // Strip leading dash / bullet
  title = title.replace(/^[-*•]\s*/, "");
  // Strip authors + year prefix (everything up to and including the closing paren of (YYYY))
  const yearMatch = title.match(YEAR_RE);
  if (yearMatch) {
    const idx = title.indexOf(yearMatch[0]) + yearMatch[0].length;
    title = title.slice(idx).trim();
  }
  // Strip markdown emphasis
  title = title.replace(/^[*_]+|[*_]+$/g, "");
  // Strip leading period or dot
  title = title.replace(/^[.\s]+/, "");
  // Take everything up to the first period followed by space (end of title in citation style)
  const firstPeriod = title.indexOf(". ");
  if (firstPeriod > 0) title = title.slice(0, firstPeriod);
  return title.trim() || url;
}

export function extractPrimarySourcesFromBody(markdown: string): ExternalSourceRef[] {
  const sources: ExternalSourceRef[] = [];
  const seen = new Set<string>();

  let m: RegExpExecArray | null;
  SOURCES_HEADING_RE.lastIndex = 0;
  while ((m = SOURCES_HEADING_RE.exec(markdown)) !== null) {
    const section = m[2];
    for (const line of section.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const urlMatch = trimmed.match(URL_RE);
      if (!urlMatch) continue;
      const url = urlMatch[1].replace(/[.,;)]+$/, ""); // strip trailing punctuation
      if (seen.has(url)) continue;
      seen.add(url);

      const authors = extractAuthors(trimmed);
      const yearMatch = trimmed.match(YEAR_RE);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined;
      const doiMatch = url.match(DOI_RE) ?? trimmed.match(DOI_RE);
      const doi = doiMatch ? doiMatch[1] : undefined;
      const title = extractTitle(trimmed, url);

      sources.push({
        title,
        url,
        kind: inferKind(url),
        ...(authors ? { authors } : {}),
        ...(year ? { year } : {}),
        ...(doi ? { doi } : {}),
      });
    }
  }

  return sources;
}
