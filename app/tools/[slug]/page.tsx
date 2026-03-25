import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getToolBySlug, getAllTools } from "@/lib/mdx";
import RatingBadge from "@/components/RatingBadge";
import AffiliateButton from "@/components/AffiliateButton";
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <article className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {meta.category}
            </span>
            <RatingBadge rating={meta.rating} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {meta.title}
          </h1>
          <div className="prose max-w-none">
            <MDXRemote source={content} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {meta.rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 mt-1">out of 5</div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="font-medium text-gray-900">{meta.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-900 capitalize">
                  {meta.category}
                </span>
              </div>
            </div>

            {meta.pros && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Pros
                </h3>
                <ul className="space-y-1">
                  {meta.pros.map((pro) => (
                    <li
                      key={pro}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-emerald-500 mt-0.5">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {meta.cons && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Cons
                </h3>
                <ul className="space-y-1">
                  {meta.cons.map((con) => (
                    <li
                      key={con}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-red-400 mt-0.5">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {meta.verdict && (
              <div className="mt-6 p-3 bg-gray-50 rounded text-sm text-gray-700">
                <strong>Verdict:</strong> {meta.verdict}
              </div>
            )}

            <div className="mt-6">
              <AffiliateButton url={meta.affiliateUrl} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
