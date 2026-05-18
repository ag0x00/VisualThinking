import { readdir } from "node:fs/promises";
import path from "node:path";
import { loadPage } from "./load-page.js";
import { parsePage } from "./parse-page.js";
import { extractWikilinks } from "./extract-wikilinks.js";
import type { ParseDiagnostic, Provenance } from "../types/internal.js";
import type { Domain, ExternalSourceRef, PageRef, PageType } from "../types/shared.js";
import type { Concept, Page, Source, Technique, Tool } from "../types/public.js";

const ROLLOUT_DATE = "2026-05-16";

const EXCLUDED_FILENAMES = new Set([
  "_index.md", "index.md", "log.md", "hot.md", "overview.md",
  "dashboard.md", "Wiki Map.md", "getting-started.md",
  "Welcome.md", "WIKI.md", "README.md",
]);

export interface VaultIndex {
  pages: Page[];
  byAddress: Map<string, Page>;
  bySlug: Map<string, Page>;
  byTitle: Map<string, Page>;
  byDomain: Map<Domain, Page[]>;
  provenance: Map<string, Provenance>;
  diagnostics: ParseDiagnostic[];
  vaultRoot: string;
}

async function walkMarkdownFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.name === "folds") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkMarkdownFiles(full)));
    } else if (e.isFile() && e.name.endsWith(".md") && !EXCLUDED_FILENAMES.has(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function toPageRef(page: Page): PageRef {
  return {
    id: page.id,
    title: page.title,
    type: page.type as PageType,
    ...(page.slug ? { slug: page.slug } : {}),
  };
}

function resolveOutgoing(
  refs: PageRef[],
  byTitle: Map<string, Page>,
  bySlug: Map<string, Page>,
): PageRef[] {
  return refs.flatMap((ref) => {
    if (!ref.id.startsWith("unresolved:")) return [ref];
    const target = ref.id.slice("unresolved:".length);
    const found =
      byTitle.get(target.toLowerCase()) ??
      bySlug.get(target.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    if (!found) return [];
    return [toPageRef(found)];
  });
}

function buildBacklinks(pages: Page[]): Map<string, PageRef[]> {
  const back = new Map<string, PageRef[]>();
  for (const src of pages) {
    if (src.type === "source") continue;
    const outgoing =
      src.type === "concept"
        ? src.relatedConcepts
        : src.type === "technique"
          ? src.implementsConcepts
          : [];
    for (const ref of outgoing) {
      if (!back.has(ref.id)) back.set(ref.id, []);
      back.get(ref.id)!.push(toPageRef(src));
    }
  }
  return back;
}

function mergePrimarySources(
  existing: ExternalSourceRef[],
  citedBy: PageRef[],
  byAddress: Map<string, Page>,
): ExternalSourceRef[] {
  const seen = new Set(existing.map((s) => s.url));
  const merged: ExternalSourceRef[] = [...existing];
  for (const ref of citedBy) {
    const src = byAddress.get(ref.id);
    if (!src || src.type !== "source" || !src.url || seen.has(src.url)) continue;
    seen.add(src.url);
    merged.push({
      title: src.title,
      url: src.url,
      kind:
        src.url.includes("arxiv.org") || src.url.includes("doi.org")
          ? "paper"
          : "article",
      ...(src.authors ? { authors: src.authors } : {}),
      ...(src.year !== undefined ? { year: src.year } : {}),
    });
  }
  return merged
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title))
    .slice(0, 10);
}

function collectCitedBy(page: Page, byTitle: Map<string, Page>): PageRef[] {
  if (page.type === "source") return [];
  const outgoing = extractWikilinks(page.body.markdown);
  const refs: PageRef[] = [];
  for (const link of outgoing) {
    const target = byTitle.get(link.target.toLowerCase());
    if (target && target.type === "source") {
      refs.push(toPageRef(target));
    }
  }
  return refs;
}

export async function loadVault(vaultRoot: string): Promise<VaultIndex> {
  const wikiDir = path.join(vaultRoot, "wiki");
  const files = await walkMarkdownFiles(wikiDir);

  const allPages: Page[] = [];
  const diagnostics: ParseDiagnostic[] = [];
  const provenance = new Map<string, Provenance>();

  for (const file of files) {
    const raw = await loadPage(file, vaultRoot);
    const { page, diagnostics: pd } = parsePage(raw);
    diagnostics.push(...pd);
    if (page) {
      allPages.push(page);
      const fm = raw.frontmatter;
      provenance.set(page.id, {
        legacy: typeof fm.created === "string" && fm.created < ROLLOUT_DATE,
        ...(typeof fm.sweep === "string" ? { createdBySweep: fm.sweep } : {}),
        ...(typeof fm.priority_rank === "number" ? { priorityRank: fm.priority_rank } : {}),
        ...(typeof fm.depth_dive_complete === "string"
          ? { depthDiveComplete: fm.depth_dive_complete }
          : {}),
        ...(typeof fm.address === "string" ? { address: fm.address } : {}),
      });
    }
  }

  // Build initial indices for cross-reference resolution.
  let byAddress = new Map<string, Page>();
  let bySlug = new Map<string, Page>();
  let byTitle = new Map<string, Page>();
  for (const p of allPages) {
    byAddress.set(p.id, p);
    if (p.slug) bySlug.set(p.slug, p);
    byTitle.set(p.title.toLowerCase(), p);
  }

  // Resolve outgoing wikilinks to real PageRefs.
  const resolvedPages: Page[] = allPages.map((p) => {
    if (p.type === "concept") {
      return { ...p, relatedConcepts: resolveOutgoing(p.relatedConcepts, byTitle, bySlug) };
    }
    if (p.type === "technique") {
      return { ...p, implementsConcepts: resolveOutgoing(p.implementsConcepts, byTitle, bySlug) };
    }
    return p;
  });

  // Re-index after resolution.
  byAddress = new Map<string, Page>();
  bySlug = new Map<string, Page>();
  byTitle = new Map<string, Page>();
  for (const p of resolvedPages) {
    byAddress.set(p.id, p);
    if (p.slug) bySlug.set(p.slug, p);
    byTitle.set(p.title.toLowerCase(), p);
  }

  // Compute backlinks from resolved outgoing references.
  const backlinks = buildBacklinks(resolvedPages);

  // Apply backlinks, citedBy, and merge primarySources.
  const finalPages: Page[] = resolvedPages.map((p) => {
    if (p.type === "concept") {
      const implementedBy = (backlinks.get(p.id) ?? []).filter((r) => r.type === "technique");
      const citedBy = collectCitedBy(p, byTitle);
      const primarySources = mergePrimarySources(p.primarySources, citedBy, byAddress);
      const merged: Concept = { ...p, implementedBy, citedBy, primarySources };
      return merged;
    }
    if (p.type === "technique") {
      const citedBy = collectCitedBy(p, byTitle);
      const primarySources = mergePrimarySources(p.primarySources, citedBy, byAddress);
      const merged: Technique = { ...p, primarySources };
      return merged;
    }
    if (p.type === "tool") {
      const usedBy = (backlinks.get(p.id) ?? []).filter((r) => r.type === "technique");
      const citedBy = collectCitedBy(p, byTitle);
      const primarySources = mergePrimarySources(p.primarySources, citedBy, byAddress);
      const merged: Tool = { ...p, usedBy, primarySources };
      return merged;
    }
    if (p.type === "source") {
      const cites = backlinks.get(p.id) ?? [];
      const merged: Source = { ...p, cites };
      return merged;
    }
    return p;
  });

  // Final indices.
  const finalByAddress = new Map<string, Page>();
  const finalBySlug = new Map<string, Page>();
  const finalByTitle = new Map<string, Page>();
  const byDomain = new Map<Domain, Page[]>();
  for (const p of finalPages) {
    finalByAddress.set(p.id, p);
    if (p.slug) finalBySlug.set(p.slug, p);
    finalByTitle.set(p.title.toLowerCase(), p);
    if (p.type === "concept") {
      for (const d of p.domains) {
        if (!byDomain.has(d)) byDomain.set(d, []);
        byDomain.get(d)!.push(p);
      }
    }
  }

  return {
    pages: finalPages,
    byAddress: finalByAddress,
    bySlug: finalBySlug,
    byTitle: finalByTitle,
    byDomain,
    provenance,
    diagnostics,
    vaultRoot,
  };
}
