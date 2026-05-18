import { extractCautions } from "./extract-cautions.js";
import { extractPrimarySourcesFromBody } from "./extract-primary-sources.js";
import { extractSections } from "./extract-sections.js";
import { extractWikilinks } from "./extract-wikilinks.js";
import { classifyDomains } from "./domain-classifier.js";
import {
  ConceptSchema,
  type Concept,
  type Page,
  SourceSchema,
  type Source,
  TechniqueSchema,
  type Technique,
  ToolSchema,
  type Tool,
} from "../types/public.js";
import type {
  ParseDiagnostic,
  RawFrontmatter,
  RawPage,
} from "../types/internal.js";
import type { Language, PageType } from "../types/shared.js";

// Types that exist in the wiki but are internal-only and not exposed via the public MCP API.
// Per the design spec: ResearchSweep, FieldStub, Meta are internal model objects, not public API types.
const INTERNAL_ONLY_TYPES = new Set([
  "synthesis", "research-synthesis", "field-overview", "tool-overview",
  "meta", "research", "field-stub", "fold",
]);

const KNOWN_FRONTMATTER_FIELDS = new Set([
  "title", "type", "status", "tags", "address", "created", "updated",
  "aliases", "sweep", "priority_rank", "depth_dive_complete",
  "substantially_covered_by", "domain", "domains", "verdict", "language",
  "implements", "covers_items", "citation", "url", "authors", "year",
  "applications", "category", "sources", "confidence",
]);

const VALID_LANGUAGES: Language[] = ["typescript", "python", "wgsl", "glsl", "rust", "go", "other"];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function firstParagraph(body: string): string {
  const lines = body.split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].startsWith("#") || lines[i].trim() === "")) i++;
  let para = "";
  while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith(">") && !lines[i].startsWith("#")) {
    para += (para ? " " : "") + lines[i].trim();
    i++;
  }
  return para;
}

function checkUnknownFields(frontmatter: RawFrontmatter, path: string, diagnostics: ParseDiagnostic[]): void {
  for (const key of Object.keys(frontmatter)) {
    if (!KNOWN_FRONTMATTER_FIELDS.has(key)) {
      diagnostics.push({ level: "warn", path, message: `Unknown frontmatter field: ${key}` });
    }
  }
}

function wikilinksAsPageRefs(body: string): { id: string; title: string; type: PageType; slug: string }[] {
  return extractWikilinks(body).map((link) => ({
    id: `unresolved:${link.target}`,
    title: link.alias ?? link.target,
    type: "concept" as PageType,
    slug: slugify(link.target),
  }));
}

export interface ParseResult {
  page: Page | null;
  diagnostics: ParseDiagnostic[];
}

export function parsePage(raw: RawPage): ParseResult {
  const diagnostics: ParseDiagnostic[] = [];
  const fm = raw.frontmatter;

  if (!fm.type) {
    // Pages without a type are internal (e.g., auto-generated reports).
    // Silently exclude from the public API.
    return { page: null, diagnostics: [] };
  }

  // Internal-only types are silently excluded from the public Page set.
  // They exist in the wiki but are not part of the MCP public API.
  if (INTERNAL_ONLY_TYPES.has(fm.type as string)) {
    return { page: null, diagnostics: [] };
  }

  checkUnknownFields(fm, raw.relPath, diagnostics);

  const pageType = fm.type as PageType;
  if (!["concept", "tool", "technique", "source"].includes(pageType)) {
    diagnostics.push({ level: "error", path: raw.relPath, message: `Unknown page type: ${fm.type}` });
    return { page: null, diagnostics };
  }

  const id = typeof fm.address === "string" && fm.address.length > 0
    ? fm.address
    : `slug:${slugify(raw.filename)}`;
  const slug = slugify(raw.filename);
  const title = typeof fm.title === "string" ? fm.title : raw.filename;
  const sections = extractSections(raw.body);

  switch (pageType) {
    case "concept":
      return buildConcept(raw, id, slug, title, sections, diagnostics);
    case "tool":
      return buildTool(raw, id, slug, title, sections, diagnostics);
    case "technique":
      return buildTechnique(raw, id, slug, title, sections, diagnostics);
    case "source":
      return buildSource(raw, id, slug, title, diagnostics);
    default:
      diagnostics.push({ level: "error", path: raw.relPath, message: `Unhandled type: ${pageType}` });
      return { page: null, diagnostics };
  }
}

function buildConcept(
  raw: RawPage,
  id: string,
  slug: string,
  title: string,
  sections: ReturnType<typeof extractSections>,
  diagnostics: ParseDiagnostic[],
): ParseResult {
  const { domains, layer } = classifyDomains(raw.frontmatter, "concept");
  const applications = Array.isArray(raw.frontmatter.applications)
    ? (raw.frontmatter.applications as number[]).filter((n): n is 1 | 2 | 3 | 4 => [1, 2, 3, 4].includes(n))
    : [];
  const outgoing = wikilinksAsPageRefs(raw.body);

  const concept: Concept = {
    id,
    slug,
    title,
    type: "concept",
    summary: firstParagraph(raw.body),
    layer,
    domains,
    body: { markdown: raw.body, sections },
    relatedConcepts: outgoing,
    implementedBy: [],
    citedBy: [],
    primarySources: extractPrimarySourcesFromBody(raw.body),
    cautions: extractCautions(raw.body),
    applications,
  };

  const parsed = ConceptSchema.safeParse(concept);
  if (!parsed.success) {
    diagnostics.push({ level: "error", path: raw.relPath, message: `Concept schema validation failed: ${parsed.error.message}` });
    return { page: null, diagnostics };
  }
  return { page: parsed.data, diagnostics };
}

const NPM_INSTALL_RE = /npm\s+(?:install|i)\s+((?:@[\w-]+\/[\w-]+|[\w-]+))/g;
const BACKTICK_PKG_RE = /`(@[\w-]+\/[\w-]+|[\w][\w-]*\/[\w-]+|[\w][\w.-]*)(?:@[\d^~*][\w.-]*)?\`/g;

function deriveCategory(tags: unknown): Tool["category"] {
  const tagList = Array.isArray(tags) ? (tags as string[]).map((t) => String(t).toLowerCase()) : [];
  if (tagList.some((t) => t === "color")) return "color";
  if (tagList.some((t) => ["render", "3d", "webgpu", "webgl"].includes(t))) return "render";
  if (tagList.some((t) => ["audio", "sound", "music"].includes(t))) return "audio";
  if (tagList.some((t) => ["ml", "tensorflow", "transformers", "mediapipe"].includes(t))) return "ml";
  if (tagList.some((t) => ["geometry", "tessellation", "symmetry", "paper"].includes(t))) return "geometry";
  if (tagList.some((t) => ["live-coding", "strudel", "hydra", "tidal"].includes(t))) return "live-coding";
  if (tagList.some((t) => ["cloud", "api", "anthropic", "replicate"].includes(t))) return "cloud-api";
  return "framework";
}

function extractPackageRefs(body: string): Tool["packageRefs"] {
  const seen = new Set<string>();
  const refs: Tool["packageRefs"] = [];

  // npm install <pkg> pattern
  let m: RegExpExecArray | null;
  const installRe = new RegExp(NPM_INSTALL_RE.source, "g");
  while ((m = installRe.exec(body)) !== null && refs.length < 5) {
    const name = m[1].trim();
    if (!seen.has(name)) {
      seen.add(name);
      refs.push({ ecosystem: "npm", name });
    }
  }

  if (refs.length >= 5) return refs;

  // Backtick package refs — only scoped (@scope/pkg) or slash-form (pkg/sub)
  // to avoid capturing prose words. Single-word bare package names are skipped
  // here to reduce false positives (they're covered by npm install).
  const btRe = new RegExp(BACKTICK_PKG_RE.source, "g");
  while ((m = btRe.exec(body)) !== null && refs.length < 5) {
    const name = m[1].trim();
    // Only take scoped packages (@...) or slash-form to reduce false positives
    if ((name.startsWith("@") || name.includes("/")) && !seen.has(name)) {
      seen.add(name);
      refs.push({ ecosystem: "npm", name });
    }
  }

  return refs;
}

function buildTool(
  raw: RawPage,
  id: string,
  slug: string,
  title: string,
  sections: ReturnType<typeof extractSections>,
  diagnostics: ParseDiagnostic[],
): ParseResult {
  const verdict = (raw.frontmatter.verdict as Tool["verdict"]) ?? "experimental";
  const language = Array.isArray(raw.frontmatter.language)
    ? (raw.frontmatter.language as string[]).filter((l): l is Language => VALID_LANGUAGES.includes(l as Language))
    : (typeof raw.frontmatter.language === "string" && VALID_LANGUAGES.includes(raw.frontmatter.language as Language)
        ? [raw.frontmatter.language as Language]
        : ["other"] satisfies Language[]);
  const applicationsRaw = (raw.frontmatter.applications ?? {}) as Record<string, number>;
  const applications: Record<string, number> = {};
  for (const [k, v] of Object.entries(applicationsRaw)) {
    if (typeof v === "number" && ["1", "2", "3", "4"].includes(k)) applications[k] = v;
  }

  const tool: Tool = {
    id,
    slug,
    title,
    type: "tool",
    summary: firstParagraph(raw.body),
    category: deriveCategory(raw.frontmatter.tags),
    language,
    packageRefs: extractPackageRefs(raw.body),
    verdict,
    applications,
    alternatives: [],
    usedBy: [],
    primarySources: extractPrimarySourcesFromBody(raw.body),
    body: { markdown: raw.body, sections },
  };

  const parsed = ToolSchema.safeParse(tool);
  if (!parsed.success) {
    diagnostics.push({ level: "error", path: raw.relPath, message: `Tool schema validation failed: ${parsed.error.message}` });
    return { page: null, diagnostics };
  }
  return { page: parsed.data, diagnostics };
}

function buildTechnique(
  raw: RawPage,
  id: string,
  slug: string,
  title: string,
  sections: ReturnType<typeof extractSections>,
  diagnostics: ParseDiagnostic[],
): ParseResult {
  const language: Language =
    typeof raw.frontmatter.language === "string" && VALID_LANGUAGES.includes(raw.frontmatter.language as Language)
      ? (raw.frontmatter.language as Language)
      : "other";
  const applications = Array.isArray(raw.frontmatter.applications)
    ? (raw.frontmatter.applications as number[]).filter((n): n is 1 | 2 | 3 | 4 => [1, 2, 3, 4].includes(n))
    : [];
  const implementsRaw = Array.isArray(raw.frontmatter.implements) ? raw.frontmatter.implements : [];
  const implementsConcepts = implementsRaw.flatMap((s) => {
    if (typeof s !== "string") return [];
    const match = s.match(/^\[\[(.+?)(\|.+?)?\]\]$/);
    const target = match ? match[1] : s;
    return [{ id: `unresolved:${target}`, title: target, type: "concept" as PageType, slug: slugify(target) }];
  });

  const technique: Technique = {
    id,
    slug,
    title,
    type: "technique",
    summary: firstParagraph(raw.body),
    implementsConcepts,
    dependencies: { libraries: [] },
    language,
    applications,
    primarySources: extractPrimarySourcesFromBody(raw.body),
    body: { markdown: raw.body, sections },
  };

  const parsed = TechniqueSchema.safeParse(technique);
  if (!parsed.success) {
    diagnostics.push({ level: "error", path: raw.relPath, message: `Technique schema validation failed: ${parsed.error.message}` });
    return { page: null, diagnostics };
  }
  return { page: parsed.data, diagnostics };
}

function buildSource(
  raw: RawPage,
  id: string,
  slug: string,
  title: string,
  diagnostics: ParseDiagnostic[],
): ParseResult {
  const citation = typeof raw.frontmatter.citation === "string" ? raw.frontmatter.citation : title;
  const source: Source = {
    id,
    slug,
    title,
    type: "source",
    citation,
    ...(typeof raw.frontmatter.url === "string" ? { url: raw.frontmatter.url } : {}),
    ...(Array.isArray(raw.frontmatter.authors) ? { authors: raw.frontmatter.authors as string[] } : {}),
    ...(typeof raw.frontmatter.year === "number" ? { year: raw.frontmatter.year } : {}),
    cites: [],
    body: { markdown: raw.body },
  };

  const parsed = SourceSchema.safeParse(source);
  if (!parsed.success) {
    diagnostics.push({ level: "error", path: raw.relPath, message: `Source schema validation failed: ${parsed.error.message}` });
    return { page: null, diagnostics };
  }
  return { page: parsed.data, diagnostics };
}
