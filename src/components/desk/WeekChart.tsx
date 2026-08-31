"use client";

interface WeekChartProps {
  week: { day: string; done: number }[];
}

export function WeekChart({ week }: WeekChartProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end gap-1.5" style={{ height: 48 }}>
        {week.map((entry, i) => {
          const filled = entry.done > 0;
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end gap-1"
            >
              <div
                className={`w-2.5 rounded-sm transition-colors ${
                  filled ? "bg-accent-400" : "bg-border-subtle"
                }`}
                style={{ height: filled ? 48 : 12 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5">
        {week.map((entry, i) => (
          <span
            key={i}
            className="w-2.5 text-center text-[8px] text-text-tertiary"
          >
            {entry.day.charAt(0)}
          </span>
        ))}
      </div>
    </div>
  );
}
