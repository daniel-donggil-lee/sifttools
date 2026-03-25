import { notFound } from "next/navigation";
import { getToolsByCategory } from "@/lib/mdx";
import { CATEGORIES } from "@/lib/types";
import ToolCard from "@/components/ToolCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `Best ${cat.name} Tools — Reviews & Comparisons`,
    description: `Find the best ${cat.name.toLowerCase()} tools. Honest reviews, pricing, and head-to-head comparisons.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const tools = getToolsByCategory(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Best {category.name} Tools
      </h1>
      <p className="text-gray-500 mb-8">
        Honest reviews and comparisons to help you pick the right{" "}
        {category.name.toLowerCase()} tool.
      </p>

      {tools.length === 0 ? (
        <p className="text-gray-400">
          No reviews in this category yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
