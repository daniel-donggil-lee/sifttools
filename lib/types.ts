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
  { slug: "writing", name: "AI Writing", icon: "pencil" },
  { slug: "image", name: "AI Image", icon: "image" },
  { slug: "video", name: "AI Video", icon: "video" },
  { slug: "audio", name: "AI Audio", icon: "audio" },
  { slug: "coding", name: "AI Coding", icon: "code" },
  { slug: "productivity", name: "Productivity", icon: "zap" },
  { slug: "marketing", name: "Marketing", icon: "megaphone" },
  { slug: "chatbot", name: "Chatbots", icon: "chat" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
