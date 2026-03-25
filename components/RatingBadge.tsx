export default function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 4.5
      ? "bg-emerald-100 text-emerald-800"
      : rating >= 4
        ? "bg-blue-100 text-blue-800"
        : rating >= 3
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${color}`}
    >
      {rating.toFixed(1)}
    </span>
  );
}
