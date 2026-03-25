import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ToolReview, Comparison } from "./types";

const TOOLS_DIR = path.join(process.cwd(), "content/tools");
const COMPARISONS_DIR = path.join(process.cwd(), "content/comparisons");

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

export function getAllTools(): ToolReview[] {
  return getMdxFiles(TOOLS_DIR)
    .map((file) => {
      const raw = fs.readFileSync(path.join(TOOLS_DIR, file), "utf-8");
      const { data } = matter(raw);
      return { slug: file.replace(".mdx", ""), ...data } as ToolReview;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getToolBySlug(
  slug: string
): { meta: ToolReview; content: string } | null {
  const filePath = path.join(TOOLS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: { slug, ...data } as ToolReview, content };
}

export function getToolsByCategory(category: string): ToolReview[] {
  return getAllTools().filter((t) => t.category === category);
}

export function getAllComparisons(): Comparison[] {
  return getMdxFiles(COMPARISONS_DIR)
    .map((file) => {
      const raw = fs.readFileSync(path.join(COMPARISONS_DIR, file), "utf-8");
      const { data } = matter(raw);
      return { slug: file.replace(".mdx", ""), ...data } as Comparison;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getComparisonBySlug(
  slug: string
): { meta: Comparison; content: string } | null {
  const filePath = path.join(COMPARISONS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: { slug, ...data } as Comparison, content };
}
