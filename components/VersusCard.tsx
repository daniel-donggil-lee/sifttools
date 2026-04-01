import type { Comparison } from "@/lib/types";
import { getToolBySlug } from "@/lib/mdx";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default function VersusCard({ meta }: { meta: Comparison }) {
  const toolA = meta.tools[0];
  const toolB = meta.tools[1];

  // Try to get tool data for favicon
  const slugA = toolA.toLowerCase().replace(/[.\s]+/g, "-");
  const slugB = toolB.toLowerCase().replace(/[.\s]+/g, "-");
  const dataA = getToolBySlug(slugA);
  const dataB = getToolBySlug(slugB);
  const domainA = dataA ? getDomain(dataA.meta.affiliateUrl) : "";
  const domainB = dataB ? getDomain(dataB.meta.affiliateUrl) : "";

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-8 mb-10 shadow-sm">
      <div className="flex items-center justify-center gap-6 md:gap-12">
        {/* Tool A */}
        <div className="flex flex-col items-center gap-3 flex-1">
          {domainA && (
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={`https://www.google.com/s2/favicons?domain=${domainA}&sz=128`}
                alt={toolA}
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
          )}
          <span className="font-bold text-gray-900 text-lg text-center">{toolA}</span>
          {dataA && (
            <span className="text-xs text-gray-400 font-medium">{dataA.meta.price}</span>
          )}
          {meta.winner === toolA && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
              Winner
            </span>
          )}
        </div>

        {/* VS badge */}
        <div className="shrink-0 w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center shadow-xl shadow-gray-900/20">
          <span className="text-white font-extrabold text-sm tracking-wider">VS</span>
        </div>

        {/* Tool B */}
        <div className="flex flex-col items-center gap-3 flex-1">
          {domainB && (
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={`https://www.google.com/s2/favicons?domain=${domainB}&sz=128`}
                alt={toolB}
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
          )}
          <span className="font-bold text-gray-900 text-lg text-center">{toolB}</span>
          {dataB && (
            <span className="text-xs text-gray-400 font-medium">{dataB.meta.price}</span>
          )}
          {meta.winner === toolB && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
              Winner
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
