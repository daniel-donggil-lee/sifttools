export default function AffiliateButton({
  url,
  label = "Try It Free",
}: {
  url: string;
  label?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
    >
      {label}
      <svg
        className="w-4 h-4 transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </a>
  );
}
