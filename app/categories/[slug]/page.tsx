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
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="text-4xl mb-3 block">{category.icon}</span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Best {category.name} Tools
        </h1>
        <p className="mt-2 text-gray-400 font-medium">
          Honest reviews and comparisons to help you pick the right{" "}
          {category.name.toLowerCase()} tool.
        </p>
      </div>

      {tools.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 font-medium">
            No reviews in this category yet. Check back soon!
          </p>
        </div>
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
