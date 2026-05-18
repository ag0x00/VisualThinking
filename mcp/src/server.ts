import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { VaultIndex } from "./parser/vault-loader.js";
import { getConcept, getSource, getTechnique, getTool } from "./handlers/get-page.js";
import { listDomains } from "./handlers/list-domains.js";
import { getDomain } from "./handlers/get-domain.js";
import { getRelated } from "./handlers/get-related.js";
import { getCautions } from "./handlers/get-cautions.js";
import { getProvenance } from "./handlers/get-provenance.js";
import { getEvaluationGuide } from "./handlers/get-evaluation-guide.js";
import { suggestDirections } from "./handlers/suggest-directions.js";
import { orient } from "./handlers/orient.js";
import { search } from "./search/search.js";
import { DOMAINS } from "./types/shared.js";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";

const idArg = { id: z.string().describe("Page address (c-NNNNNN) or slug.") };

const TOOL_DEFINITIONS = [
  {
    name: "wiki.orient",
    description:
      "Given an artist intent in plain English, returns a structured starter kit (concepts, techniques, tools, sources, reading order, adjacent considerations, cautions).",
    schema: z.object({
      intent: z
        .string()
        .min(1)
        .describe("Plain-English description of what the artist is building."),
    }),
    run: async (vault: VaultIndex, args: { intent: string }) =>
      orient(vault, args, { ollamaUrl: OLLAMA_URL }),
  },
  {
    name: "wiki.listDomains",
    description: "Returns the 14-domain controlled vocabulary with descriptions.",
    schema: z.object({}),
    run: async (_vault: VaultIndex, _args: Record<string, never>) => listDomains(),
  },
  {
    name: "wiki.getDomain",
    description: "Returns all pages in a domain, organized by layer.",
    schema: z.object({ domain: z.enum(DOMAINS) }),
    run: async (vault: VaultIndex, args: { domain: (typeof DOMAINS)[number] }) =>
      getDomain(vault, args),
  },
  {
    name: "wiki.getConcept",
    description: "Fetch a typed Concept page by id (address or slug).",
    schema: z.object(idArg),
    run: async (vault: VaultIndex, args: { id: string }) => getConcept(vault, args),
  },
  {
    name: "wiki.getTool",
    description: "Fetch a typed Tool page by id.",
    schema: z.object(idArg),
    run: async (vault: VaultIndex, args: { id: string }) => getTool(vault, args),
  },
  {
    name: "wiki.getTechnique",
    description: "Fetch a typed Technique page by id.",
    schema: z.object(idArg),
    run: async (vault: VaultIndex, args: { id: string }) => getTechnique(vault, args),
  },
  {
    name: "wiki.getSource",
    description: "Fetch a typed Source page by id.",
    schema: z.object(idArg),
    run: async (vault: VaultIndex, args: { id: string }) => getSource(vault, args),
  },
  {
    name: "wiki.search",
    description:
      "Unified search across the vault. Mode: semantic (default), keyword, or structured.",
    schema: z.object({
      query: z.string().optional(),
      mode: z.enum(["semantic", "keyword", "structured"]).optional(),
      filters: z
        .object({
          type: z.union([z.string(), z.array(z.string())]).optional(),
          domains: z.array(z.enum(DOMAINS)).optional(),
          layers: z.array(z.number()).optional(),
          priority: z.number().optional(),
          verdict: z.string().optional(),
        })
        .optional(),
      limit: z.number().optional(),
    }),
    run: async (vault: VaultIndex, args: Record<string, unknown>) =>
      search(vault, { ...args, ollamaUrl: OLLAMA_URL } as Parameters<typeof search>[1]),
  },
  {
    name: "wiki.getRelated",
    description:
      "Returns backlinks + outgoing references for a page, deduplicated.",
    schema: z.object({
      id: z.string(),
      kinds: z
        .array(z.enum(["backlinks", "outgoing", "embedding-similar"]))
        .optional(),
    }),
    run: async (
      vault: VaultIndex,
      args: {
        id: string;
        kinds?: ("backlinks" | "outgoing" | "embedding-similar")[];
      },
    ) => getRelated(vault, args),
  },
  {
    name: "wiki.getEvaluationGuide",
    description:
      "Returns an ordered evaluation guide for an artifactType (e.g., static-pattern-image, figurative-image, realtime-visualizer).",
    schema: z.object({
      artifactType: z.string(),
      domain: z.enum(DOMAINS).optional(),
      priority: z.number().optional(),
    }),
    run: async (
      vault: VaultIndex,
      args: {
        artifactType: string;
        domain?: (typeof DOMAINS)[number];
        priority?: number;
      },
    ) => getEvaluationGuide(vault, args),
  },
  {
    name: "wiki.suggestDirections",
    description:
      "Returns ranked improvement directions given the artist's current intent, techniques, and (optionally) current scores.",
    schema: z.object({
      intent: z.string(),
      currentTechniques: z
        .array(z.object({ id: z.string(), title: z.string(), type: z.string() }))
        .optional(),
      currentScores: z.record(z.string(), z.number()).optional(),
      excludeKinds: z.array(z.string()).optional(),
    }),
    run: async (
      vault: VaultIndex,
      args: Parameters<typeof suggestDirections>[1],
    ) => suggestDirections(vault, args),
  },
  {
    name: "wiki.getCautions",
    description: "Returns just the cautions for a page (lightweight).",
    schema: z.object(idArg),
    run: async (vault: VaultIndex, args: { id: string }) => getCautions(vault, args),
  },
  {
    name: "wiki.getProvenance",
    description:
      "Opt-in producer-side metadata: createdBySweep, priorityRank, depthDiveComplete, legacy, address.",
    schema: z.object(idArg),
    run: async (vault: VaultIndex, args: { id: string }) => getProvenance(vault, args),
  },
] as const;

// Minimal zod → JSON Schema converter (sufficient for the declared shapes).
// Zod 4 retains instanceof, isOptional(), unwrap(), and .options on enums/unions.
function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  if (schema instanceof z.ZodObject) {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [key, value] of Object.entries(
      schema.shape as Record<string, z.ZodTypeAny>,
    )) {
      properties[key] = zodToJsonSchema(value);
      if (!value.isOptional()) required.push(key);
    }
    return {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
    };
  }
  if (schema instanceof z.ZodString) return { type: "string" };
  if (schema instanceof z.ZodNumber) return { type: "number" };
  if (schema instanceof z.ZodBoolean) return { type: "boolean" };
  if (schema instanceof z.ZodArray) {
    return {
      type: "array",
      items: zodToJsonSchema((schema as z.ZodArray<z.ZodTypeAny>).element),
    };
  }
  if (schema instanceof z.ZodOptional) {
    return zodToJsonSchema((schema as z.ZodOptional<z.ZodTypeAny>).unwrap());
  }
  if (schema instanceof z.ZodEnum) {
    // zod 4: ZodEnum<T extends EnumLike>; .options is Array<T[keyof T]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { type: "string", enum: (schema as z.ZodEnum<any>).options };
  }
  if (schema instanceof z.ZodRecord) return { type: "object" };
  if (schema instanceof z.ZodUnion) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { anyOf: (schema as z.ZodUnion<any>).options.map(zodToJsonSchema) };
  }
  return {};
}

export async function startServer(vault: VaultIndex): Promise<void> {
  const server = new Server(
    { name: "wiki-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS.map((def) => ({
      name: def.name,
      description: def.description,
      inputSchema: zodToJsonSchema(def.schema),
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const def = TOOL_DEFINITIONS.find((t) => t.name === req.params.name);
    if (!def) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              error: "unknown_tool",
              tool: req.params.name,
            }),
          },
        ],
        isError: true,
      };
    }
    const parsed = def.schema.safeParse(req.params.arguments ?? {});
    if (!parsed.success) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              error: "invalid_arguments",
              details: parsed.error.message,
            }),
          },
        ],
        isError: true,
      };
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (def.run as (vault: VaultIndex, args: any) => Promise<unknown>)(
        vault,
        parsed.data,
      );
      return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              error: "handler_error",
              message: err instanceof Error ? err.message : String(err),
            }),
          },
        ],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
