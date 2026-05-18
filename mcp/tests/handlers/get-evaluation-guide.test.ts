import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { getEvaluationGuide } from "../../src/handlers/get-evaluation-guide.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("getEvaluationGuide", () => {
  it("returns a guide with at least one step for fixture-pattern-image", async () => {
    const vault = await loadVault(FIXTURES);
    const guide = getEvaluationGuide(vault, { artifactType: "fixture-pattern-image" });
    expect(guide.steps.length).toBeGreaterThan(0);
  });

  it("each step has interpretation buckets", async () => {
    const vault = await loadVault(FIXTURES);
    const guide = getEvaluationGuide(vault, { artifactType: "fixture-pattern-image" });
    const step = guide.steps[0];
    expect(step.interpretation).toHaveProperty("belowHealthy");
    expect(step.interpretation).toHaveProperty("inHealthy");
    expect(step.interpretation).toHaveProperty("aboveHealthy");
  });

  it("includes globalCaveats", async () => {
    const vault = await loadVault(FIXTURES);
    const guide = getEvaluationGuide(vault, { artifactType: "fixture-pattern-image" });
    expect(Array.isArray(guide.globalCaveats)).toBe(true);
    expect(guide.globalCaveats.length).toBeGreaterThan(0);
  });

  it("returns empty steps for unknown artifactType", async () => {
    const vault = await loadVault(FIXTURES);
    const guide = getEvaluationGuide(vault, { artifactType: "unknown-artifact" });
    expect(guide.steps).toEqual([]);
  });
});
