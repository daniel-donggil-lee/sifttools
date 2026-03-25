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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Latest Reviews
        </h2>

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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="block border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
              >
                <h3 className="font-semibold text-gray-900">{comp.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {comp.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
