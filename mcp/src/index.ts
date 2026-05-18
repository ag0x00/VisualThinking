#!/usr/bin/env node
import { parseCliArgs, resolveVaultPath } from "./config.js";
import { loadVault } from "./parser/vault-loader.js";
import { startServer } from "./server.js";

async function main(): Promise<void> {
  const { cliArg } = parseCliArgs(process.argv.slice(2));
  const vaultRoot = await resolveVaultPath({
    cliArg,
    env: process.env,
    cwd: process.cwd(),
  });
  process.stderr.write(`wiki-mcp: loading vault from ${vaultRoot}\n`);

  const vault = await loadVault(vaultRoot);
  const errors = vault.diagnostics.filter((d) => d.level === "error");
  const warnings = vault.diagnostics.filter((d) => d.level === "warn");
  process.stderr.write(
    `wiki-mcp: parsed ${vault.pages.length} pages, ${errors.length} errors, ${warnings.length} warnings\n`,
  );
  for (const e of errors) {
    process.stderr.write(`  error ${e.path}: ${e.message}\n`);
  }
  if (errors.length > 0) {
    process.stderr.write(
      `wiki-mcp: hard parse errors in vault; server may serve incomplete data\n`,
    );
  }

  await startServer(vault);
  process.stderr.write(`wiki-mcp: ready on stdio\n`);
}

main().catch((err) => {
  process.stderr.write(
    `wiki-mcp: fatal: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
