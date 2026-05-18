import { stat } from "node:fs/promises";
import path from "node:path";

export interface ResolveOpts {
  cliArg?: string;
  env: NodeJS.ProcessEnv;
  cwd: string;
}

async function isVaultDir(dir: string): Promise<boolean> {
  try {
    const wikiStat = await stat(path.join(dir, "wiki"));
    const metaStat = await stat(path.join(dir, ".vault-meta"));
    return wikiStat.isDirectory() && metaStat.isDirectory();
  } catch {
    return false;
  }
}

async function autoDetect(startDir: string): Promise<string | null> {
  let current = path.resolve(startDir);
  for (let depth = 0; depth < 32; depth++) {
    if (await isVaultDir(current)) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

export async function resolveVaultPath(opts: ResolveOpts): Promise<string> {
  if (opts.cliArg) {
    const abs = path.resolve(opts.cliArg);
    if (await isVaultDir(abs)) return abs;
    throw new Error(`--vault path is not a valid vault (no wiki/ + .vault-meta/): ${abs}`);
  }
  if (opts.env.WIKI_MCP_VAULT_PATH) {
    const abs = path.resolve(opts.env.WIKI_MCP_VAULT_PATH);
    if (await isVaultDir(abs)) return abs;
    throw new Error(`WIKI_MCP_VAULT_PATH is not a valid vault: ${abs}`);
  }
  const auto = await autoDetect(opts.cwd);
  if (auto) return auto;
  throw new Error(
    "Could not resolve vault path. Pass --vault <path>, set WIKI_MCP_VAULT_PATH, or run from inside a vault directory.",
  );
}

export function parseCliArgs(argv: string[]): { cliArg?: string } {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--vault" && i + 1 < argv.length) return { cliArg: argv[i + 1] };
    if (argv[i].startsWith("--vault=")) return { cliArg: argv[i].slice("--vault=".length) };
  }
  return {};
}
