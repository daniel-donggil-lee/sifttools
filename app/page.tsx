import Hero from "@/components/Hero";
import ToolCard from "@/components/ToolCard";
import { getAllTools, getAllComparisons } from "@/lib/mdx";
import Link from "next/link";

export default function Home() {
  const tools = getAllTools();
  const comparisons = getAllComparisons();

  return (
    <>
      <Hero />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Reviews
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Honest, hands-on reviews of popular AI tools
            </p>
          </div>
        </div>

        {tools.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {comparisons.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Head-to-Head Comparisons
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Side-by-side breakdowns to help you choose
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group block border border-gray-200/80 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 bg-white hover:-translate-y-0.5"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {comp.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {comp.description}
                </p>
                {comp.winner && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <span>Winner:</span> {comp.winner}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-slate-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Why Trust SiftTools?</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔍
              </div>
              <h3 className="font-semibold text-gray-900">Hands-On Testing</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Every tool is tested with real workflows before we write a single word.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                ⚖️
              </div>
              <h3 className="font-semibold text-gray-900">No Pay-to-Play</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Rankings are never influenced by sponsorships. We call it like we see it.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="font-semibold text-gray-900">Data-Driven</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Concrete metrics, pricing breakdowns, and feature comparisons — not just opinions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
