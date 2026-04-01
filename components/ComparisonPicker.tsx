"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ToolInfo {
  id: string;
  name: string;
  category: string;
  url: string;
}

interface ComparisonInfo {
  slug: string;
  tools: string[];
}

export default function ComparisonPicker({
  tools,
  comparisons,
}: {
  tools: ToolInfo[];
  comparisons: ComparisonInfo[];
}) {
  const [toolA, setToolA] = useState("");
  const [toolB, setToolB] = useState("");
  const router = useRouter();

  const findComparison = () => {
    if (!toolA || !toolB || toolA === toolB) return;

    const nameA = tools.find((t) => t.id === toolA)?.name || "";
    const nameB = tools.find((t) => t.id === toolB)?.name || "";

    // Check if comparison exists
    const match = comparisons.find(
      (c) =>
        (c.tools.includes(nameA) && c.tools.includes(nameB)) ||
        c.slug === `compare-${toolA}-vs-${toolB}` ||
        c.slug === `compare-${toolB}-vs-${toolA}`
    );

    if (match) {
      router.push(`/compare/${match.slug}`);
    }
  };

  const hasComparison = (() => {
    if (!toolA || !toolB || toolA === toolB) return false;
    const nameA = tools.find((t) => t.id === toolA)?.name || "";
    const nameB = tools.find((t) => t.id === toolB)?.name || "";
    return comparisons.some(
      (c) =>
        (c.tools.includes(nameA) && c.tools.includes(nameB)) ||
        c.slug === `compare-${toolA}-vs-${toolB}` ||
        c.slug === `compare-${toolB}-vs-${toolA}`
    );
  })();

  return (
    <div className="bg-gray-900 rounded-2xl p-8 text-center">
      <h3 className="text-white font-extrabold text-xl mb-2">
        Compare Any Two Tools
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Pick two tools and see our head-to-head analysis
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <select
          value={toolA}
          onChange={(e) => setToolA(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="">Select tool...</option>
          {tools.map((t) => (
            <option key={t.id} value={t.id} disabled={t.id === toolB}>
              {t.name}
            </option>
          ))}
        </select>

        <span className="text-gray-500 font-bold text-sm">VS</span>

        <select
          value={toolB}
          onChange={(e) => setToolB(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="">Select tool...</option>
          {tools.map((t) => (
            <option key={t.id} value={t.id} disabled={t.id === toolA}>
              {t.name}
            </option>
          ))}
        </select>

        <button
          onClick={findComparison}
          disabled={!hasComparison}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            hasComparison
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Compare
        </button>
      </div>

      {toolA && toolB && toolA !== toolB && !hasComparison && (
        <p className="mt-4 text-gray-500 text-xs">
          This comparison isn&apos;t available yet. Check back soon!
        </p>
      )}
    </div>
  );
}
