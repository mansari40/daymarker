"use client";

interface ProgressRingProps {
  done: number;
  total: number;
  size?: number;
}

export function ProgressRing({ done, total, size = 120 }: ProgressRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? done / total : 0;
  const offset = circumference - progress * circumference;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={8}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent-400)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
          style={{ filter: "drop-shadow(0 0 6px rgba(74,222,128,0.5))" }}
        />
      </svg>
      <span className="absolute text-h2 font-bold text-text-primary">
        {percentage}%
      </span>
    </div>
  );
}