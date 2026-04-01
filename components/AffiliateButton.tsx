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
      className="group inline-flex w-full items-center justify-center gap-2.5 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 text-[0.9375rem]"
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
          strokeWidth={2.5}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </a>
  );
}
