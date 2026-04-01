import Link from "next/link";
import RatingBadge from "./RatingBadge";
import type { ToolReview } from "@/lib/types";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default function ToolCard({ tool }: { tool: ToolReview }) {
  const domain = getDomain(tool.affiliateUrl);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        {domain && (
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden group-hover:border-gray-200 transition-colors">
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt={tool.title}
              width={36}
              height={36}
              className="w-9 h-9"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors text-[0.9375rem] leading-snug">
            {tool.title}
          </h3>
          <p className="mt-1.5 text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold capitalize">
            {tool.category}
          </span>
          <span className="text-xs text-gray-400 font-medium">{tool.price}</span>
        </div>
        <RatingBadge rating={tool.rating} />
      </div>
    </Link>
  );
}
