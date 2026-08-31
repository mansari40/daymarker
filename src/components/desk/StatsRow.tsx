"use client";

import { useEffect, useState } from "react";
import { Activity, Flame } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { WeekChart } from "./WeekChart";

interface Stats {
  todayDone: number;
  todayTotal: number;
  streak: number;
  week: { day: string; done: number }[];
}

function getCaption(done: number, total: number): string {
  if (total === 0) return "Your day is open. Add a small intention.";
  if (done === total) return "You made it through your list.";
  const remaining = total - done;
  return `${remaining} thing${remaining === 1 ? "" : "s"} still asking for you.`;
}

function getStreakCaption(streak: number): string {
  if (streak === 0) return "Your week starts here";
  return `${streak} day streak`;
}

export function StatsRow({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, [refreshTrigger]);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-[--radius-lg] bg-bg-panel border border-border-subtle animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Today's Mark */}
      <div className="flex flex-col justify-between rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-5">
        <div>
          <span className="text-label font-semibold uppercase tracking-widest text-text-tertiary">
            Today&apos;s mark
          </span>
          <p className="mt-2 text-body font-bold text-text-primary">
            {stats.todayDone} of {stats.todayTotal} finished
          </p>
          <p className="mt-1 text-small text-text-secondary">
            {getCaption(stats.todayDone, stats.todayTotal)}
          </p>
        </div>
        <p className="mt-4 text-small text-text-tertiary">Keep the thread</p>
      </div>

      {/* Progress Ring */}
      <div className="flex flex-col items-center justify-center rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-5">
        <ProgressRing done={stats.todayDone} total={stats.todayTotal} />
        <p className="mt-3 text-small text-text-secondary">
          {stats.streak === 0
            ? "Start your streak today"
            : `${stats.streak} day${stats.streak === 1 ? "" : "s"} in a row`}
        </p>
      </div>

      {/* This Week */}
      <div className="flex flex-col rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-5">
        <div className="flex items-center justify-between">
          <span className="text-label font-semibold uppercase tracking-widest text-text-tertiary">
            This week
          </span>
          <Activity size={14} className="text-text-tertiary" />
        </div>
        <div className="mt-4 flex-1">
          <WeekChart week={stats.week} />
        </div>
        <div className="mt-3 border-t border-border-subtle pt-3">
          <div className="flex items-center gap-2 text-small text-text-secondary">
            <Flame size={14} className="text-accent-400" />
            <span>{getStreakCaption(stats.streak)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
