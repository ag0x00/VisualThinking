import type { Section } from "../types/shared.js";

const HEADING_RE = /^(#{2,4})\s+(.+?)\s*$/gm;

export function extractSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const matches: { level: 2 | 3 | 4; heading: string; index: number; endOfHeading: number }[] = [];

  let m: RegExpExecArray | null;
  HEADING_RE.lastIndex = 0;
  while ((m = HEADING_RE.exec(markdown)) !== null) {
    const hashes = m[1];
    const level = hashes.length as 2 | 3 | 4;
    matches.push({
      level,
      heading: m[2].trim(),
      index: m.index,
      endOfHeading: m.index + m[0].length,
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].endOfHeading;
    const end = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const body = markdown.slice(start, end);
    sections.push({
      heading: matches[i].heading,
      level: matches[i].level,
      markdown: body.trim().length === 0 ? "" : body.replace(/^\n+/, "").replace(/\n+$/, ""),
    });
  }

  return sections;
}
