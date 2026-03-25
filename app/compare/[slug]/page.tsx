import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getComparisonBySlug, getAllComparisons } from "@/lib/mdx";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) return {};
  return {
    title: comp.meta.title,
    description: comp.meta.description,
  };
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) notFound();

  const { meta, content } = comp;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <span className="text-xs text-gray-400 uppercase tracking-wide">
        Comparison
      </span>
      <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-6">
        {meta.title}
      </h1>
      <div className="prose max-w-none">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
