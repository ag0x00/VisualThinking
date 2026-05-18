import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { RawPage, RawFrontmatter } from "../types/internal.js";

export async function loadPage(absolutePath: string, vaultRoot: string): Promise<RawPage> {
  const text = await readFile(absolutePath, "utf-8");
  const parsed = matter(text);
  const filename = path.basename(absolutePath, ".md");
  const relPath = path.relative(vaultRoot, absolutePath);

  return {
    sourcePath: absolutePath,
    relPath,
    filename,
    frontmatter: parsed.data as RawFrontmatter,
    body: parsed.content,
  };
}
