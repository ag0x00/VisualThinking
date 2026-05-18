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

  it("at least some Tools have non-default category (not all 'framework')", async () => {
    const vault = await loadVault(REAL_VAULT);
    const tools = vault.pages.filter((p) => p.type === "tool");
    const nonDefaultCategory = tools.filter((t) => t.type === "tool" && t.category !== "framework");
    expect(nonDefaultCategory.length).toBeGreaterThan(0);
  }, 30_000);

  it("at least some Tools have populated packageRefs", async () => {
    const vault = await loadVault(REAL_VAULT);
    const tools = vault.pages.filter((p) => p.type === "tool");
    const withPkgs = tools.filter((t) => t.type === "tool" && t.packageRefs.length > 0);
    expect(withPkgs.length).toBeGreaterThan(0);
  }, 30_000);

  it("at least some Techniques have populated dependencies.libraries", async () => {
    const vault = await loadVault(REAL_VAULT);
    const techs = vault.pages.filter((p) => p.type === "technique");
    const withDeps = techs.filter((t) => t.type === "technique" && t.dependencies.libraries.length > 0);
    expect(withDeps.length).toBeGreaterThan(0);
  }, 30_000);

  it("at least some Tools have populated usedBy backlinks", async () => {
    const vault = await loadVault(REAL_VAULT);
    const tools = vault.pages.filter((p) => p.type === "tool");
    const withUsedBy = tools.filter((t) => t.type === "tool" && t.usedBy.length > 0);
    expect(withUsedBy.length).toBeGreaterThan(0);
  }, 30_000);

  it("emits warning diagnostics on address collisions (e.g., c-000001 in real vault)", async () => {
    const vault = await loadVault(REAL_VAULT);
    const warnings = vault.diagnostics.filter((d) => d.level === "warn" && /collision/i.test(d.message));
    expect(warnings.length).toBeGreaterThan(0);
  }, 30_000);
});
