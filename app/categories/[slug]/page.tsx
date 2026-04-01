import { notFound } from "next/navigation";
import { getToolsByCategory, getAllComparisons } from "@/lib/mdx";
import { CATEGORIES } from "@/lib/types";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import type { Metadata } from "next";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  writing: "AI writing tools help you create blog posts, marketing copy, emails, and more in a fraction of the time. From grammar checkers to full-length article generators, these tools are transforming how we write.",
  image: "AI image tools generate, edit, and enhance visuals using artificial intelligence. Whether you need product photos, social media graphics, or artistic illustrations, these tools deliver professional results.",
  video: "AI video tools handle everything from generation to editing. Create talking-head videos, animate images, edit footage by editing text, and produce professional video content without a studio.",
  audio: "AI audio tools generate speech, clone voices, transcribe recordings, and produce music. From text-to-speech to podcast editing, these tools are reshaping audio production.",
  coding: "AI coding tools help developers write, debug, and understand code faster. From intelligent autocomplete to full-featured AI pair programmers, these tools boost developer productivity.",
  productivity: "AI productivity tools automate note-taking, create presentations, manage projects, and streamline workflows. They handle the busywork so you can focus on what matters.",
  marketing: "AI marketing tools optimize SEO, analyze competitors, generate ad copy, and automate campaigns. They give marketers data-driven insights and help scale content production.",
  chatbot: "AI chatbots and assistants answer questions, write code, research topics, and help with complex reasoning. The latest models are remarkably capable across diverse tasks.",
};

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
  const comparisons = getAllComparisons().filter(
    (c) => c.category === slug
  );
  const description = CATEGORY_DESCRIPTIONS[slug] || "";

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Best {category.name} Tools
        </h1>
        {description && (
          <p className="mt-3 text-gray-500 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {tools.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 font-medium mb-4">
            Reviews for this category are coming soon.
          </p>
          <Link
            href="/finder"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-xl text-sm hover:bg-gray-800 transition-colors"
          >
            Try our Tool Finder instead →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}

      {/* Related Comparisons */}
      {comparisons.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
            Head-to-Head Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                  {comp.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {comp.description}
                </p>
                {comp.winner && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                    Winner: {comp.winner}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
