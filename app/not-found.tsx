import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <div className="text-8xl font-extrabold text-gray-200 tracking-tighter">404</div>
      <p className="mt-4 text-lg text-gray-400 font-medium">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}
