import { describe, expect, it } from "vitest";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const MCP_DIST = path.join(REPO_ROOT, "mcp", "dist", "index.js");

async function callMcp(
  toolName: string,
  args: Record<string, unknown>,
  timeoutMs = 20_000,
): Promise<unknown> {
  const child = spawn("node", [MCP_DIST, "--vault", REPO_ROOT], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  // Wait for server to boot
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("server boot timeout")), 10_000);
    child.stderr.on("data", (chunk: Buffer) => {
      if (chunk.toString().includes("ready on stdio")) {
        clearTimeout(t);
        resolve();
      }
    });
    child.on("error", reject);
  });

  // MCP requires an initialize handshake before tool calls
  const initRequest = {
    jsonrpc: "2.0",
    id: 0,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "e2e-test", version: "0.0.1" },
    },
  };
  child.stdin.write(JSON.stringify(initRequest) + "\n");

  // Drain the initialize response before sending the tool call
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("initialize response timeout")), 5_000);
    let buf = "";
    const onData = (chunk: Buffer) => {
      buf += chunk.toString();
      const nl = buf.indexOf("\n");
      if (nl >= 0) {
        clearTimeout(t);
        child.stdout.removeListener("data", onData);
        resolve();
      }
    };
    child.stdout.on("data", onData);
  });

  // Send the actual tool call
  const requestId = 1;
  const request = {
    jsonrpc: "2.0",
    id: requestId,
    method: "tools/call",
    params: { name: toolName, arguments: args },
  };
  child.stdin.write(JSON.stringify(request) + "\n");

  const response = await new Promise<unknown>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("response timeout")), timeoutMs);
    let buf = "";
    child.stdout.on("data", (chunk: Buffer) => {
      buf += chunk.toString();
      const newlineIdx = buf.indexOf("\n");
      if (newlineIdx >= 0) {
        const line = buf.slice(0, newlineIdx);
        clearTimeout(t);
        try {
          resolve(JSON.parse(line));
        } catch (err) {
          reject(err);
        }
      }
    });
  });

  child.kill("SIGTERM");
  return response;
}

describe("e2e via stdio against the real vault", () => {
  it("wiki.orient returns a starter kit for interactive-wallpapers intent", async () => {
    const res = (await callMcp("wiki.orient", {
      intent: "interactive generative wallpapers, mouse-reactive, time-of-day drift",
    })) as { result: { content: { text: string }[] } };
    const payload = JSON.parse(res.result.content[0].text) as {
      startingPoints: { concepts: unknown[]; techniques: unknown[]; tools: unknown[] };
    };
    expect(payload.startingPoints.concepts.length).toBeGreaterThan(0);
  }, 30_000);

  it("wiki.getTechnique returns the Symmetry-Group Pattern Generator", async () => {
    const res = (await callMcp("wiki.getTechnique", { id: "c-000221" })) as {
      result: { content: { text: string }[] };
    };
    const payload = JSON.parse(res.result.content[0].text) as {
      page: { title: string; type: string; primarySources: unknown[] } | null;
    };
    expect(payload.page).not.toBeNull();
    expect(payload.page!.title).toBe("Symmetry-Group Pattern Generator");
    expect(payload.page!.type).toBe("technique");
    // primarySources field must exist (may be empty if page lacks external URLs in ## Sources)
    expect(Array.isArray(payload.page!.primarySources)).toBe(true);
  }, 30_000);

  it("wiki.getEvaluationGuide returns ordered steps for static-pattern-image", async () => {
    const res = (await callMcp("wiki.getEvaluationGuide", {
      artifactType: "static-pattern-image",
    })) as { result: { content: { text: string }[] } };
    const payload = JSON.parse(res.result.content[0].text) as { steps: unknown[] };
    expect(payload.steps.length).toBeGreaterThan(0);
  }, 30_000);

  it("wiki.suggestDirections returns at least one direction when score is underscored", async () => {
    const res = (await callMcp("wiki.suggestDirections", {
      intent: "interactive wallpaper",
      currentTechniques: [
        { id: "c-000221", title: "Symmetry-Group Pattern Generator", type: "technique" },
      ],
      currentScores: { "c-000213": 0.1 },
    })) as { result: { content: { text: string }[] } };
    const payload = JSON.parse(res.result.content[0].text) as {
      directions: { kind: string }[];
    };
    expect(payload.directions.length).toBeGreaterThan(0);
  }, 30_000);

  it("wiki.listDomains returns 14 domains", async () => {
    const res = (await callMcp("wiki.listDomains", {})) as {
      result: { content: { text: string }[] };
    };
    const payload = JSON.parse(res.result.content[0].text) as {
      domains: { domain: string }[];
    };
    expect(payload.domains.length).toBe(14);
  }, 30_000);
});
