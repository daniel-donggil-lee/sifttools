import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <span className="text-white text-base font-black tracking-tight">S</span>
          </div>
          <span className="text-[1.375rem] font-extrabold tracking-tight text-gray-900">
            Sift<span className="text-emerald-600">Tools</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="relative px-3.5 py-2 text-[0.8125rem] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              {cat.name}
            </Link>
          ))}
          <div className="w-px h-5 bg-gray-200 mx-2" />
          <Link
            href="/about"
            className="px-3.5 py-2 text-[0.8125rem] font-medium text-gray-400 hover:text-gray-900 transition-colors duration-200"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
