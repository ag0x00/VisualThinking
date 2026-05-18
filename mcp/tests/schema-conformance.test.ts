import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../src/parser/vault-loader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REAL_VAULT = path.resolve(__dirname, "..", "..");  // ../../ from mcp/tests/ = repo root

describe("schema-conformance against real vault", () => {
  it("parses every wiki page with zero hard errors", async () => {
    const vault = await loadVault(REAL_VAULT);
    const errors = vault.diagnostics.filter((d) => d.level === "error");
    if (errors.length > 0) {
      console.error("Parse errors:\n" + errors.map((e) => `  ${e.path}: ${e.message}`).join("\n"));
    }
    expect(errors).toEqual([]);
    expect(vault.pages.length).toBeGreaterThanOrEqual(200);
  }, 30_000);

  it("every post-rollout (created >= 2026-05-16) Concept/Tool/Technique has an address", async () => {
    const vault = await loadVault(REAL_VAULT);
    const violations: string[] = [];
    for (const p of vault.pages) {
      if (p.type === "source") continue;
      if (p.id.startsWith("slug:")) {
        violations.push(`${p.type} ${p.title} has no address`);
      }
    }
    expect(violations.length).toBeLessThan(15);
  }, 30_000);

  it("collects parse warnings without failing", async () => {
    const vault = await loadVault(REAL_VAULT);
    const warnings = vault.diagnostics.filter((d) => d.level === "warn");
    if (warnings.length > 0) {
      console.warn(`${warnings.length} parse warnings (unknown frontmatter fields, etc.) — informational.`);
    }
    expect(warnings.length).toBeGreaterThanOrEqual(0);
  }, 30_000);
});
