import { describe, expect, it } from "vitest";
import { ConceptSchema, TechniqueSchema, ToolSchema, SourceSchema, PageSchema } from "../../src/types/public.js";

describe("public type schemas", () => {
  it("validates a minimal Concept", () => {
    const valid = {
      id: "c-000203",
      title: "Universal Body Language Dimensions",
      type: "concept",
      summary: "5 dimensions of body-emotion reading.",
      layer: 3,
      domains: ["body"],
      body: { markdown: "## Overview\n\nText.", sections: [] },
      relatedConcepts: [],
      implementedBy: [],
      citedBy: [],
      primarySources: [],
      cautions: [],
      applications: [1, 2],
    };
    const result = ConceptSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects a Concept with unknown domain", () => {
    const invalid = {
      id: "c-000203",
      title: "X",
      type: "concept",
      summary: "",
      layer: 3,
      domains: ["not-a-real-domain"],
      body: { markdown: "", sections: [] },
      relatedConcepts: [],
      implementedBy: [],
      citedBy: [],
      primarySources: [],
      cautions: [],
      applications: [],
    };
    const result = ConceptSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("validates a Tool with packageRefs and applications scoring", () => {
    const valid = {
      id: "c-000225",
      title: "culori",
      type: "tool",
      summary: "Modern color library for JavaScript.",
      category: "color",
      language: ["typescript"],
      packageRefs: [{ ecosystem: "npm", name: "culori", weeklyDownloads: 320_000 }],
      verdict: "first-class",
      applications: { 1: 5, 2: 5, 3: 5, 4: 4 },
      alternatives: [],
      usedBy: [],
      primarySources: [],
      body: { markdown: "", sections: [] },
    };
    const result = ToolSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("validates a Technique with dependencies + performance budget", () => {
    const valid = {
      id: "c-000220",
      title: "Realtime Pose-to-Visualizer Loop",
      type: "technique",
      summary: "MoveNet + audio + WebGPU under 70ms Michotte threshold.",
      implementsConcepts: [{ id: "c-000203", title: "Universal Body Language Dimensions", type: "concept" as const }],
      dependencies: {
        libraries: [{ id: "c-000154", title: "TensorFlow.js", type: "tool" as const }],
        services: ["ollama"],
      },
      language: "typescript",
      performanceBudget: { ms: 50, conditions: "60 FPS on mid-laptop with WebGPU backend" },
      applications: [4],
      primarySources: [],
      body: { markdown: "", sections: [] },
    };
    const result = TechniqueSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("validates a Source with citation + url", () => {
    const valid = {
      id: "c-000148",
      title: "Hertzmann - Can Computers Create Art",
      type: "source",
      citation: "Hertzmann, A. (2018). Can computers create art? Arts 7(2), 18.",
      url: "https://arxiv.org/abs/1801.04486",
      authors: ["Aaron Hertzmann"],
      year: 2018,
      cites: [],
      body: { markdown: "" },
    };
    const result = SourceSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("PageSchema discriminates on type", () => {
    const conceptInput = {
      id: "c-1", title: "X", type: "concept",
      summary: "", layer: 1, domains: [],
      body: { markdown: "", sections: [] },
      relatedConcepts: [], implementedBy: [], citedBy: [],
      primarySources: [], cautions: [], applications: [],
    };
    const sourceInput = {
      id: "c-2", title: "Y", type: "source",
      citation: "x", cites: [], body: { markdown: "" },
    };
    expect(PageSchema.safeParse(conceptInput).success).toBe(true);
    expect(PageSchema.safeParse(sourceInput).success).toBe(true);
  });
});
