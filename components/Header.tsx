import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-black">S</span>
          Sift<span className="text-emerald-600">Tools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-150"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-150"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
