import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
