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
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <article className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">
              {meta.category}
            </span>
            <RatingBadge rating={meta.rating} />
          </div>
          <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            {meta.title}
          </h1>
          <div className="prose max-w-none">
            <MDXRemote source={content} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
            {/* Score */}
            <div className="text-center pb-6 border-b border-gray-100">
              <div className="text-5xl font-extrabold text-gray-900 tracking-tight">
                {meta.rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400 mt-1 font-medium">out of 5.0</div>
              <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(meta.rating / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="py-5 border-b border-gray-100 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Price</span>
                <span className="font-bold text-gray-900">{meta.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Category</span>
                <span className="font-bold text-gray-900 capitalize">{meta.category}</span>
              </div>
            </div>

            {/* Pros */}
            {meta.pros && (
              <div className="py-5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Pros
                </h3>
                <ul className="space-y-2">
                  {meta.pros.map((pro) => (
                    <li key={pro} className="text-sm text-gray-700 flex items-start gap-2.5">
                      <span className="shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center text-xs font-bold mt-0.5">+</span>
                      <span className="leading-snug">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {meta.cons && (
              <div className="py-5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Cons
                </h3>
                <ul className="space-y-2">
                  {meta.cons.map((con) => (
                    <li key={con} className="text-sm text-gray-700 flex items-start gap-2.5">
                      <span className="shrink-0 w-5 h-5 bg-red-50 text-red-500 rounded-md flex items-center justify-center text-xs font-bold mt-0.5">&minus;</span>
                      <span className="leading-snug">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verdict */}
            {meta.verdict && (
              <div className="py-5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Verdict
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  &ldquo;{meta.verdict}&rdquo;
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="pt-5">
              <AffiliateButton url={meta.affiliateUrl} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
