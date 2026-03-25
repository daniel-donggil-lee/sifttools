import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-lg font-bold text-gray-900">
              Sift<span className="text-emerald-600">Tools</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Honest, in-depth reviews of the best AI tools. We help you find
              the right tool for your workflow.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Categories
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SiftTools. All rights reserved.
          <span className="block mt-1 text-xs">
            Some links on this site are affiliate links. We may earn a
            commission at no extra cost to you.
          </span>
        </div>
      </div>
    </footer>
  );
}
