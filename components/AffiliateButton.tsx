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
      className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
    >
      {label}
      <svg
        className="ml-2 w-4 h-4"
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
