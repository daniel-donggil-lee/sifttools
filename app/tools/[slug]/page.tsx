import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getToolBySlug, getAllTools } from "@/lib/mdx";
import ToolHero from "@/components/ToolHero";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.meta.title,
    description: tool.meta.description,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const { meta, content } = tool;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <ToolHero meta={meta} />

      <article className="prose max-w-none">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
