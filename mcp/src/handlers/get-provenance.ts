import type { VaultIndex } from "../parser/vault-loader.js";
import type { Provenance } from "../types/internal.js";

export interface GetProvenanceResult extends Partial<Provenance> {
  error?: "not_found";
}

export function getProvenance(vault: VaultIndex, args: { id: string }): GetProvenanceResult {
  const page = vault.byAddress.get(args.id) ?? vault.bySlug.get(args.id);
  if (!page) return { error: "not_found", legacy: false };
  const meta = vault.provenance.get(page.id);
  if (meta) return { ...meta };
  return { legacy: false, ...(page.id.startsWith("c-") ? { address: page.id } : {}) };
}
