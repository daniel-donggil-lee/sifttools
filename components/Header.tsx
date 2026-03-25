import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Sift<span className="text-emerald-600">Tools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/categories/writing"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            More...
          </Link>
        </nav>

        <Link
          href="/about"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          About
        </Link>
      </div>
    </header>
  );
}
