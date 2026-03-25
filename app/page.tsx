import Hero from "@/components/Hero";
import ToolCard from "@/components/ToolCard";
import { getAllTools, getAllComparisons } from "@/lib/mdx";
import { CATEGORIES } from "@/lib/types";
import Link from "next/link";

export default function Home() {
  const tools = getAllTools();
  const comparisons = getAllComparisons();

  return (
    <>
      <Hero />

      {/* Categories */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200/60 transition-all duration-200"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-emerald-700 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reviews */}
      <section id="reviews" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Latest Reviews
          </h2>
          <p className="mt-2 text-gray-400 font-medium">
            Honest, hands-on reviews of popular AI tools
          </p>
        </div>

        {tools.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Comparisons */}
      {comparisons.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Head-to-Head
            </h2>
            <p className="mt-2 text-gray-400 font-medium">
              Side-by-side comparisons to help you decide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {comp.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {comp.description}
                </p>
                {comp.winner && (
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/50">
                    Winner: {comp.winner}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Why Trust SiftTools?
            </h2>
            <p className="mt-3 text-gray-400 font-medium max-w-lg mx-auto">
              We believe in radical transparency. Here&apos;s how we operate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔬",
                title: "Hands-On Testing",
                desc: "Every tool is tested with real workflows. We spend days, not minutes, before publishing a review.",
              },
              {
                icon: "🚫",
                title: "No Pay-to-Play",
                desc: "Rankings are never influenced by sponsorships. Tools cannot buy a higher score or better placement.",
              },
              {
                icon: "📐",
                title: "Data-Driven",
                desc: "Concrete metrics, pricing breakdowns, and feature matrices. Opinions backed by evidence.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50/80 rounded-2xl p-8 border border-gray-100"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 font-bold text-gray-900 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
