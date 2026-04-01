import Link from "next/link";
import { getAllTools, getAllComparisons } from "@/lib/mdx";

export default function Hero() {
  const toolCount = getAllTools().length;
  const compCount = getAllComparisons().length;

  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(5,150,105,0.08),transparent)]" />

      <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36 text-center">
        <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] text-gray-900 leading-[1.08]">
          AI tool reviews,
          <br />
          <span className="text-gray-400">
            without the noise.
          </span>
        </h1>

        <p className="mt-6 text-[clamp(1rem,2vw,1.25rem)] text-gray-500 max-w-xl mx-auto leading-relaxed font-medium">
          Side-by-side comparisons, pricing breakdowns, and honest analysis
          to help you pick the right AI tool.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/finder"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 text-[0.9375rem]"
          >
            Find My Tool
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <Link
            href="#reviews"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all duration-200 text-[0.9375rem]"
          >
            Browse Reviews
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 md:gap-12">
          {[
            { num: `${toolCount}`, label: "Tools Reviewed" },
            { num: `${compCount}`, label: "Comparisons" },
            { num: "8", label: "Categories" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{stat.num}</div>
              <div className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
