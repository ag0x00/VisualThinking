import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveVaultPath } from "../src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "fixtures", "vault");

describe("resolveVaultPath", () => {
  it("uses --vault CLI flag when provided", async () => {
    const result = await resolveVaultPath({ cliArg: FIXTURES, env: {}, cwd: "/tmp" });
    expect(path.resolve(result)).toBe(path.resolve(FIXTURES));
  });

  it("uses WIKI_MCP_VAULT_PATH env var when no flag", async () => {
    const result = await resolveVaultPath({ cliArg: undefined, env: { WIKI_MCP_VAULT_PATH: FIXTURES }, cwd: "/tmp" });
    expect(path.resolve(result)).toBe(path.resolve(FIXTURES));
  });

  it("auto-detects by walking upward from cwd looking for wiki/ + .vault-meta/", async () => {
    const result = await resolveVaultPath({
      cliArg: undefined,
      env: {},
      cwd: path.join(FIXTURES, "wiki", "concepts"),
    });
    expect(path.resolve(result)).toBe(path.resolve(FIXTURES));
  });

  it("throws when no source resolves to a valid vault", async () => {
    await expect(
      resolveVaultPath({ cliArg: undefined, env: {}, cwd: "/tmp" }),
    ).rejects.toThrow(/vault/i);
  });
});
