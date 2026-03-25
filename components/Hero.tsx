import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Find the <span className="text-emerald-400">Best AI Tools</span> for
          Your Workflow
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
          Honest reviews, head-to-head comparisons, and expert guides. Stop
          wasting time on the wrong tools.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
