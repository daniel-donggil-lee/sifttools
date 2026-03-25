export default function RatingBadge({ rating }: { rating: number }) {
  const percentage = (rating / 5) * 100;
  const barColor =
    rating >= 4.5
      ? "bg-emerald-500"
      : rating >= 4
        ? "bg-emerald-400"
        : rating >= 3
          ? "bg-amber-400"
          : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
