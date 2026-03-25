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
      className="group block border border-gray-200/80 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 bg-white hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        {domain && (
          <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=48`}
              alt={tool.title}
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
              {tool.title}
            </h3>
            <RatingBadge rating={tool.rating} />
          </div>
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
          {tool.category}
        </span>
        <span className="text-xs text-gray-400">{tool.price}</span>
      </div>
    </Link>
  );
}
