import type { WikilinkRef } from "../types/shared.js";

const WIKILINK_RE = /\[\[([^\]|#]+)(#[^\]|]+)?(\|[^\]]+)?\]\]/g;

export function extractWikilinks(markdown: string): WikilinkRef[] {
  // Strip fenced code blocks (```...```) and inline code (`...`) to avoid false hits.
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");

  const seen = new Set<string>();
  const links: WikilinkRef[] = [];
  let match: RegExpExecArray | null;
  while ((match = WIKILINK_RE.exec(cleaned)) !== null) {
    const target = match[1].trim();
    const aliasGroup = match[3];
    const alias = aliasGroup ? aliasGroup.slice(1).trim() : undefined;
    const key = `${target} ${alias ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({
      target,
      ...(alias ? { alias } : {}),
      resolved: false,
    });
  }
  return links;
}
