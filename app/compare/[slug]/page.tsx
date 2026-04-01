import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getComparisonBySlug, getAllComparisons } from "@/lib/mdx";
import VersusCard from "@/components/VersusCard";
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <VersusCard meta={meta} />

      <article className="prose max-w-none">
        <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>
    </div>
  );
}
