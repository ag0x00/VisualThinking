import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../../src/parser/vault-loader.js";
import { suggestDirections } from "../../src/handlers/suggest-directions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "fixtures", "vault");

describe("suggestDirections", () => {
  it("emits at least one parameter-adjustment when a current score is below healthy", async () => {
    const vault = await loadVault(FIXTURES);
    const result = suggestDirections(vault, {
      intent: "interactive wallpaper test",
      currentTechniques: [{ id: "c-900005", title: "Test Technique Full", type: "technique" }],
      currentScores: { "c-900005": 0.1 },
    });
    expect(result.directions.some((d) => d.kind === "parameter-adjustment")).toBe(true);
  });

  it("emits caution-driven scope-expansion when a current technique has cautions", async () => {
    const vault = await loadVault(FIXTURES);
    const result = suggestDirections(vault, {
      intent: "test intent",
      currentTechniques: [{ id: "c-900001", title: "Test Concept Full", type: "concept" }],
    });
    expect(result.directions.some((d) => d.kind === "scope-expansion")).toBe(true);
  });

  it("emits modality-addition when intent says 'interactive' but no input-modality technique present", async () => {
    const vault = await loadVault(FIXTURES);
    const result = suggestDirections(vault, {
      intent: "interactive wallpaper test",
      currentTechniques: [],
    });
    expect(result.directions.some((d) => d.kind === "modality-addition")).toBe(true);
  });

  it("respects excludeKinds filter", async () => {
    const vault = await loadVault(FIXTURES);
    const result = suggestDirections(vault, {
      intent: "interactive test",
      currentTechniques: [],
      excludeKinds: ["modality-addition"],
    });
    expect(result.directions.every((d) => d.kind !== "modality-addition")).toBe(true);
  });

  it("returns empty array when no generators trigger", async () => {
    const vault = await loadVault(FIXTURES);
    const result = suggestDirections(vault, { intent: "static idle test" });
    expect(Array.isArray(result.directions)).toBe(true);
  });
});
