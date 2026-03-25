import type { MetadataRoute } from "next";
import { getAllTools, getAllComparisons } from "@/lib/mdx";
import { CATEGORIES } from "@/lib/types";

const BASE_URL = "https://sifttools.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools().map((t) => ({
    url: `${BASE_URL}/tools/${t.slug}`,
    lastModified: new Date(t.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const comparisons = getAllComparisons().map((c) => ({
    url: `${BASE_URL}/compare/${c.slug}`,
    lastModified: new Date(c.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categories = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...tools,
    ...comparisons,
    ...categories,
  ];
}
