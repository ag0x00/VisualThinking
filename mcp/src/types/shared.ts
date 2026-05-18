// Controlled vocabularies and shared structural types.
// Used by both public (Concept/Tool/Technique/Source) and internal types.

export type ApplicationPriority = 1 | 2 | 3 | 4;

export type Layer = 1 | 2 | 3 | 4 | 5;

export const DOMAINS = [
  "color",
  "composition",
  "body",
  "time-based",
  "motion-symmetry",
  "style",
  "iconography",
  "light-materials",
  "affect",
  "perception",
  "aesthetics",
  "algorithmic-framings",
  "llm-techniques",
  "audio-visual",
] as const;
export type Domain = (typeof DOMAINS)[number];

export type Language =
  | "typescript"
  | "python"
  | "wgsl"
  | "glsl"
  | "rust"
  | "go"
  | "other";

export type PageType = "concept" | "tool" | "technique" | "source";

export interface PageRef {
  id: string;          // address (c-NNNNNN) or generated slug for legacy pages
  title: string;
  type: PageType;
  slug?: string;
}

export interface Section {
  heading: string;
  level: 2 | 3 | 4;
  markdown: string;
}

export interface WikilinkRef {
  target: string;      // raw [[Target]] string
  alias?: string;      // [[Target|alias]]
  resolved: boolean;
  resolvedRef?: PageRef;
}

export interface Caution {
  kind:
    | "contested-framing"
    | "cross-cultural-limit"
    | "outdated-successor"
    | "empirical-mixed";
  text: string;
  affects?: string;
}

export interface PackageRef {
  ecosystem: "npm" | "pypi" | "cargo" | "go" | "other";
  name: string;
  weeklyDownloads?: number;
}

export interface ExternalSourceRef {
  title: string;
  url: string;
  kind: "paper" | "book" | "documentation" | "article" | "spec" | "video" | "code";
  authors?: string[];
  year?: number;
  doi?: string;
}

// Type guards
export function isDomain(value: unknown): value is Domain {
  return typeof value === "string" && (DOMAINS as readonly string[]).includes(value);
}
