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
  { slug: "writing", name: "AI Writing", icon: "\u270D\uFE0F" },
  { slug: "image", name: "AI Image", icon: "\uD83C\uDFA8" },
  { slug: "video", name: "AI Video", icon: "\uD83C\uDFAC" },
  { slug: "audio", name: "AI Audio", icon: "\uD83C\uDF99\uFE0F" },
  { slug: "coding", name: "AI Coding", icon: "\uD83D\uDCBB" },
  { slug: "productivity", name: "Productivity", icon: "\u26A1" },
  { slug: "marketing", name: "Marketing", icon: "\uD83D\uDCE3" },
  { slug: "chatbot", name: "Chatbots", icon: "\uD83E\uDD16" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
