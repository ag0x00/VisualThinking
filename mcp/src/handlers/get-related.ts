import type { VaultIndex } from "../parser/vault-loader.js";
import type { PageRef } from "../types/shared.js";

type Kind = "backlinks" | "outgoing" | "embedding-similar";

export function getRelated(
  vault: VaultIndex,
  args: { id: string; kinds?: Kind[] },
): { refs: PageRef[] } {
  const page = vault.byAddress.get(args.id) ?? vault.bySlug.get(args.id);
  if (!page) return { refs: [] };
  const kinds = new Set(args.kinds ?? ["backlinks", "outgoing"]);
  const refs = new Map<string, PageRef>();

  if (kinds.has("outgoing")) {
    if (page.type === "concept") for (const r of page.relatedConcepts) refs.set(r.id, r);
    if (page.type === "technique") for (const r of page.implementsConcepts) refs.set(r.id, r);
  }
  if (kinds.has("backlinks")) {
    if (page.type === "concept") for (const r of page.implementedBy) refs.set(r.id, r);
    if (page.type === "tool") for (const r of page.usedBy) refs.set(r.id, r);
    if (page.type === "source") for (const r of page.cites) refs.set(r.id, r);
  }

  refs.delete(args.id);
  return { refs: Array.from(refs.values()) };
}
