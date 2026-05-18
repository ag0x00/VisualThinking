import type { VaultIndex } from "../parser/vault-loader.js";
import type { Concept, Page, Source, Technique, Tool } from "../types/public.js";
import type { PageRef, PageType } from "../types/shared.js";
import { searchKeyword } from "../search/keyword.js";

export interface GetPageResult<T> {
  page: T | null;
  error?: "not_found" | "type_mismatch";
  suggestions?: PageRef[];
}

function lookup(vault: VaultIndex, id: string): Page | null {
  return vault.byAddress.get(id)
    ?? vault.bySlug.get(id)
    ?? vault.bySlug.get(id.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
    ?? null;
}

function suggestions(vault: VaultIndex, id: string): PageRef[] {
  return searchKeyword(vault, id.replace(/[-_]/g, " "), 5);
}

function generic<T extends { type: PageType }>(
  vault: VaultIndex,
  id: string,
  expectedType: T["type"],
): GetPageResult<T> {
  const page = lookup(vault, id);
  if (!page) {
    return { page: null, error: "not_found", suggestions: suggestions(vault, id) };
  }
  if (page.type !== expectedType) {
    return { page: null, error: "type_mismatch", suggestions: suggestions(vault, id) };
  }
  return { page: page as unknown as T };
}

export function getConcept(vault: VaultIndex, args: { id: string }): GetPageResult<Concept> {
  return generic<Concept>(vault, args.id, "concept");
}
export function getTool(vault: VaultIndex, args: { id: string }): GetPageResult<Tool> {
  return generic<Tool>(vault, args.id, "tool");
}
export function getTechnique(vault: VaultIndex, args: { id: string }): GetPageResult<Technique> {
  return generic<Technique>(vault, args.id, "technique");
}
export function getSource(vault: VaultIndex, args: { id: string }): GetPageResult<Source> {
  return generic<Source>(vault, args.id, "source");
}
