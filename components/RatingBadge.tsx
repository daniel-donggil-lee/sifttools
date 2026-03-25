export default function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 4.5
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : rating >= 4
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : rating >= 3
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-red-50 text-red-700 border-red-200";

  const stars = Math.round(rating);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold border ${color}`}
    >
      <span className="text-xs">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
      {rating.toFixed(1)}
    </span>
  );
}
