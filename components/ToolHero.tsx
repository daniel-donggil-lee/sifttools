import ScoreChart from "./ScoreChart";
import AffiliateButton from "./AffiliateButton";
import type { ToolReview } from "@/lib/types";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default function ToolHero({ meta }: { meta: ToolReview }) {
  const domain = getDomain(meta.affiliateUrl);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-8 mb-10 shadow-sm">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Left: Logo + Info */}
        <div className="flex items-start gap-5 flex-1 min-w-0">
          {domain && (
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                alt={meta.title}
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                {meta.category}
              </span>
              <span className="text-xs text-gray-400 font-medium">{meta.price}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {meta.title}
            </h1>
            <p className="mt-2 text-gray-500 leading-relaxed text-[0.9375rem]">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Right: Score + CTA */}
        <div className="shrink-0 flex flex-col items-center gap-4">
          <ScoreChart score={meta.rating} />
          <div className="w-48">
            <AffiliateButton url={meta.affiliateUrl} />
          </div>
        </div>
      </div>

      {/* Pros / Cons row */}
      {(meta.pros || meta.cons) && (
        <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          {meta.pros && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                What we like
              </h3>
              <ul className="space-y-2">
                {meta.pros.map((pro) => (
                  <li key={pro} className="text-sm text-gray-700 flex items-start gap-2.5">
                    <span className="shrink-0 w-5 h-5 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center text-xs font-bold mt-0.5">+</span>
                    <span className="leading-snug">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {meta.cons && (
            <div>
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">
                What could improve
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
        </div>
      )}
    </div>
  );
}
