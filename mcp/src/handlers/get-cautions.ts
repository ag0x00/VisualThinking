import type { VaultIndex } from "../parser/vault-loader.js";
import type { Caution } from "../types/shared.js";

export function getCautions(vault: VaultIndex, args: { id: string }): { cautions: Caution[] } {
  const page = vault.byAddress.get(args.id) ?? vault.bySlug.get(args.id);
  if (!page || page.type !== "concept") return { cautions: [] };
  return { cautions: page.cautions };
}
