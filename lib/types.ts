export interface ToolReview {
  slug: string;
  title: string;
  description: string;
  rating: number;
  price: string;
  affiliateUrl: string;
  category: string;
  publishedAt: string;
  image?: string;
  pros?: string[];
  cons?: string[];
  verdict?: string;
}

export interface Comparison {
  slug: string;
  title: string;
  description: string;
  tools: string[];
  category: string;
  publishedAt: string;
  winner?: string;
}

export const CATEGORIES = [
  { slug: "writing", name: "AI Writing" },
  { slug: "image", name: "AI Image" },
  { slug: "video", name: "AI Video" },
  { slug: "audio", name: "AI Audio" },
  { slug: "coding", name: "AI Coding" },
  { slug: "productivity", name: "Productivity" },
  { slug: "marketing", name: "Marketing" },
  { slug: "chatbot", name: "Chatbots" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
