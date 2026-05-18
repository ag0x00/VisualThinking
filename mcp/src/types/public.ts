import { z } from "zod";
import { DOMAINS } from "./shared.js";

// ---------- shared zod primitives ----------

const LayerSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
const ApplicationPrioritySchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
const LanguageSchema = z.enum(["typescript", "python", "wgsl", "glsl", "rust", "go", "other"]);
const DomainSchema = z.enum(DOMAINS);

const PageTypeSchema = z.enum(["concept", "tool", "technique", "source"]);

const PageRefSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: PageTypeSchema,
  slug: z.string().optional(),
});

const SectionSchema = z.object({
  heading: z.string(),
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  markdown: z.string(),
});

const CautionSchema = z.object({
  kind: z.enum([
    "contested-framing",
    "cross-cultural-limit",
    "outdated-successor",
    "empirical-mixed",
  ]),
  text: z.string(),
  affects: z.string().optional(),
});

const PackageRefSchema = z.object({
  ecosystem: z.enum(["npm", "pypi", "cargo", "go", "other"]),
  name: z.string(),
  weeklyDownloads: z.number().optional(),
});

const ExternalSourceRefSchema = z.object({
  title: z.string(),
  url: z.url(),                                 // zod 4: was z.string().url() in zod 3
  kind: z.enum(["paper", "book", "documentation", "article", "spec", "video", "code"]),
  authors: z.array(z.string()).optional(),
  year: z.number().int().optional(),
  doi: z.string().optional(),
});

const BodySchema = z.object({
  markdown: z.string(),
  sections: z.array(SectionSchema),
});

// ---------- Concept ----------

export const ConceptSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  type: z.literal("concept"),
  summary: z.string(),
  layer: LayerSchema,
  domains: z.array(DomainSchema),
  body: BodySchema,
  relatedConcepts: z.array(PageRefSchema),
  implementedBy: z.array(PageRefSchema),
  citedBy: z.array(PageRefSchema),
  primarySources: z.array(ExternalSourceRefSchema),
  cautions: z.array(CautionSchema),
  applications: z.array(ApplicationPrioritySchema),
});
export type Concept = z.infer<typeof ConceptSchema>;

// ---------- Tool ----------

const ToolCategorySchema = z.enum([
  "color", "render", "audio", "ml", "geometry",
  "live-coding", "framework", "cloud-api",
]);
// Verdict is a free-form string in the real wiki (e.g., "first-class-pedagogical-second-class-production").
// We keep it as z.string() rather than a strict enum to preserve the rich nuance from sweep authors.
const ToolVerdictSchema = z.string();

export const ToolSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  type: z.literal("tool"),
  summary: z.string(),
  category: ToolCategorySchema,
  language: z.array(LanguageSchema),
  packageRefs: z.array(PackageRefSchema),
  verdict: ToolVerdictSchema,
  applications: z.record(z.string(), z.number()),  // priority "1".."4" → 0-5 fit
  alternatives: z.array(PageRefSchema),
  usedBy: z.array(PageRefSchema),
  primarySources: z.array(ExternalSourceRefSchema),
  body: BodySchema,
});
export type Tool = z.infer<typeof ToolSchema>;

// ---------- Technique ----------

const ServiceSchema = z.enum([
  "ollama", "claude-api", "replicate", "cloud-inference", "local-gpu",
]);

export const TechniqueSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  type: z.literal("technique"),
  summary: z.string(),
  implementsConcepts: z.array(PageRefSchema),
  dependencies: z.object({
    libraries: z.array(PageRefSchema),
    services: z.array(ServiceSchema).optional(),
  }),
  language: LanguageSchema,
  performanceBudget: z
    .object({
      ms: z.number(),
      conditions: z.string(),
    })
    .optional(),
  applications: z.array(ApplicationPrioritySchema),
  primarySources: z.array(ExternalSourceRefSchema),
  body: BodySchema,
});
export type Technique = z.infer<typeof TechniqueSchema>;

// ---------- Source ----------

export const SourceSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  type: z.literal("source"),
  citation: z.string(),
  url: z.url().optional(),                       // zod 4: was z.string().url() in zod 3
  authors: z.array(z.string()).optional(),
  year: z.number().int().optional(),
  cites: z.array(PageRefSchema),
  body: z.object({ markdown: z.string() }),
});
export type Source = z.infer<typeof SourceSchema>;

// ---------- Discriminated union ----------

export const PageSchema = z.discriminatedUnion("type", [
  ConceptSchema,
  ToolSchema,
  TechniqueSchema,
  SourceSchema,
]);
export type Page = z.infer<typeof PageSchema>;

// Re-export shared types
export type { Domain, Language } from "./shared.js";
