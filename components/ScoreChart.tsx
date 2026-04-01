export default function ScoreChart({
  score,
  size = 96,
}: {
  score: number;
  size?: number;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 5) * circumference;
  const color =
    score >= 4.5
      ? "#059669"
      : score >= 4
        ? "#10b981"
        : score >= 3
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
          {score.toFixed(1)}
        </span>
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
          / 5.0
        </span>
      </div>
    </div>
  );
}
