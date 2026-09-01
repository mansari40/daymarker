"use client";

interface WeekChartProps {
  week: { day: string; done: number }[];
  currentDay?: number;
}

export function WeekChart({ week, currentDay }: WeekChartProps) {
  const todayIndex = currentDay ?? new Date().getDay();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {week.map((entry, i) => {
          const filled = entry.done > 0;
          const isToday = i === todayIndex;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`relative h-3 w-3 rounded-full transition-all duration-300 ${
                  filled
                    ? "bg-accent-400"
                    : "border border-border-strong bg-transparent"
                }`}
                style={
                  isToday
                    ? { animation: "streak-pulse 2s ease-in-out infinite" }
                    : undefined
                }
              >
                {isToday && !filled && (
                  <div className="absolute inset-0 rounded-full border border-accent-400/50" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        {week.map((entry, i) => (
          <span
            key={i}
            className="w-3 text-center text-[9px] font-medium text-text-tertiary"
          >
            {entry.day}
          </span>
        ))}
      </div>
    </div>
  );
}
