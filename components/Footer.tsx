import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-black">S</span>
              Sift<span className="text-emerald-400">Tools</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed max-w-sm">
              We test AI tools hands-on and write honest reviews. No sponsored
              rankings, no pay-to-play. Every recommendation is based on real
              evaluation.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Independent Reviews
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                No Sponsored Rankings
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm hover:text-emerald-400 transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} SiftTools. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Some links are affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
