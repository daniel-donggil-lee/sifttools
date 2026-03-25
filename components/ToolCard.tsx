import Link from "next/link";
import RatingBadge from "./RatingBadge";
import type { ToolReview } from "@/lib/types";

export default function ToolCard({ tool }: { tool: ToolReview }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{tool.title}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {tool.description}
          </p>
        </div>
        <RatingBadge rating={tool.rating} />
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
        <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
          {tool.category}
        </span>
        <span>{tool.price}</span>
      </div>
    </Link>
  );
}
