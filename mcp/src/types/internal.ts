// Producer-side types. Not exposed in public API responses except via getProvenance.

export interface RawFrontmatter {
  title?: string;
  type?: string;
  status?: string;
  tags?: string[];
  address?: string;
  created?: string;
  updated?: string;
  aliases?: string[];
  sweep?: string;
  priority_rank?: number;
  depth_dive_complete?: string;
  substantially_covered_by?: string[];
  domain?: string | string[];   // optional override for domain-classifier
  verdict?: string;
  language?: string;
  implements?: string[];
  covers_items?: number[];
  citation?: string;
  url?: string;
  authors?: string[];
  year?: number;
  [key: string]: unknown;        // permissive: unknown fields warn, not error
}

export interface RawPage {
  sourcePath: string;            // absolute file path
  relPath: string;               // relative to vault root (used as stable identifier source)
  filename: string;              // basename without .md (used to disambiguate legacy pages)
  frontmatter: RawFrontmatter;
  body: string;                  // markdown body (frontmatter stripped)
}

export interface Provenance {
  createdBySweep?: string;
  priorityRank?: number;
  depthDiveComplete?: string;
  legacy: boolean;               // created < 2026-05-16
  address?: string;
}

export interface ParseWarning {
  level: "warn";
  path: string;
  message: string;
}

export interface ParseError {
  level: "error";
  path: string;
  message: string;
  field?: string;
}

export type ParseDiagnostic = ParseWarning | ParseError;
