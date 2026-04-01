import Hero from "@/components/Hero";
import ToolCard from "@/components/ToolCard";
import ComparisonPicker from "@/components/ComparisonPicker";
import { getAllTools, getAllComparisons } from "@/lib/mdx";
import { CATEGORIES } from "@/lib/types";
import Link from "next/link";
import fs from "fs";
import path from "path";

function getToolsDb() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data/tools_db.json"),
    "utf-8"
  );
  return JSON.parse(raw).tools;
}

export default function Home() {
  const tools = getAllTools();
  const comparisons = getAllComparisons();
  const toolsDb = getToolsDb();

  // Count reviews per category
  const categoryCount: Record<string, number> = {};
  tools.forEach((t) => {
    const cat = t.category.toLowerCase();
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  return (
    <>
      <Hero />

      {/* Tool Finder CTA */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link
            href="/finder"
            className="group block bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/60 p-8 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔍</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    Interactive
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Not sure which tool to pick?
                </h2>
                <p className="mt-1 text-gray-500 text-sm font-medium">
                  Answer 4 quick questions and get a personalized recommendation.
                </p>
              </div>
              <div className="shrink-0 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl text-sm group-hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
                Find My Tool →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => {
              const count = categoryCount[cat.slug] || 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200/60 transition-all duration-200"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-emerald-700 transition-colors text-center">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-medium text-gray-300">
                    {count > 0 ? `${count} reviewed` : "coming soon"}
                  </span>
                </Link>
              );
            })}
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

      {/* Comparison Picker */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <ComparisonPicker
          tools={toolsDb.map((t: { id: string; name: string; category: string; url: string }) => ({
            id: t.id,
            name: t.name,
            category: t.category,
            url: t.url,
          }))}
          comparisons={comparisons.map((c) => ({
            slug: c.slug,
            tools: c.tools,
          }))}
        />
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
