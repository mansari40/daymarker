"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarTask {
  id: string;
  title: string;
  category: string;
  weight: string;
  timeOfDay: string;
}

interface CalendarViewProps {
  onAddTask: (dueDate?: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDotColor(count: number): string {
  if (count >= 4) return "bg-[var(--calendar-dot-high)]";
  if (count >= 2) return "bg-[var(--calendar-dot-mid)]";
  return "bg-[var(--calendar-dot-low)]";
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startPad = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Date[] = [];

  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, 1 - (startPad - i));
    days.push(d);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function formatMonthLabel(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const categoryLabels: Record<string, string> = {
  WORK: "Work",
  PERSONAL: "Personal",
  HEALTH: "Health",
  ERRAND: "Errand",
  OTHER: "Other",
};

const timeLabels: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  ANYTIME: "Anytime",
};

export function CalendarView({ onAddTask }: CalendarViewProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [taskMap, setTaskMap] = useState<Record<string, CalendarTask[]>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tasks/calendar?month=${monthKey}`)
      .then((res) => res.json())
      .then((data) => {
        setTaskMap(data);
        setLoading(false);
      })
      .catch(() => {
        setTaskMap({});
        setLoading(false);
      });
  }, [monthKey]);

  const goToPrevMonth = useCallback(() => {
    setHoveredDate(null);
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const goToNextMonth = useCallback(() => {
    setHoveredDate(null);
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const goToToday = useCallback(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setHoveredDate(null);
  }, []);

  const handleMouseEnter = useCallback((dateKey: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredDate(dateKey);
    }, 200);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredDate(null);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hoveredDate) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setHoveredDate(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hoveredDate]);

  const days = getDaysInMonth(year, month);

  return (
    <div className="mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h2 font-bold text-text-primary">
          {formatMonthLabel(year, month)}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-small font-medium text-text-secondary rounded-full border border-border-subtle hover:bg-bg-panel-hover hover:text-text-primary transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={goToPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-tertiary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-tertiary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-label font-semibold uppercase tracking-widest text-text-tertiary py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {loading ? (
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-[--radius-sm] animate-pulse bg-bg-panel-hover"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-px">
            {days.map((day, idx) => {
              const dateKey = formatDateKey(day);
              const tasks = taskMap[dateKey] || [];
              const count = tasks.length;
              const inMonth = day.getMonth() === month;
              const today = isToday(day);

              return (
                <div
                  key={idx}
                  className={`relative aspect-square flex flex-col items-center justify-start pt-2 rounded-[--radius-sm] transition-colors ${
                    inMonth
                      ? "cursor-default"
                      : "opacity-25 cursor-default"
                  } ${today ? "ring-1 ring-accent-400" : ""} ${
                    hoveredDate === dateKey ? "bg-bg-panel-hover" : ""
                  }`}
                  onMouseEnter={() => inMonth && count > 0 && handleMouseEnter(dateKey)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span
                    className={`text-body ${
                      today
                        ? "font-bold text-accent-400"
                        : inMonth
                        ? "text-text-primary"
                        : "text-text-tertiary"
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  {count > 0 && inMonth && (
                    <div className={`mt-1 h-2 w-2 rounded-full ${getDotColor(count)}`} />
                  )}

                  {/* Hover Popover */}
                  {hoveredDate === dateKey && count > 0 && (
                    <div
                      ref={popoverRef}
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                      }}
                      onMouseLeave={handleMouseLeave}
                      className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 w-56 rounded-[--radius-md] bg-bg-panel border border-border-strong shadow-[var(--shadow-lifted)] p-3"
                    >
                      <div className="text-label font-semibold uppercase tracking-widest text-text-tertiary mb-2">
                        {count} task{count !== 1 ? "s" : ""}
                      </div>
                      <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex flex-col gap-0.5 rounded-[--radius-sm] px-2 py-1.5 hover:bg-bg-panel-hover transition-colors"
                          >
                            <span className="text-small font-medium text-text-primary truncate">
                              {task.title}
                            </span>
                            <span className="text-[11px] text-text-tertiary">
                              {categoryLabels[task.category] || task.category} · {timeLabels[task.timeOfDay] || task.timeOfDay}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => onAddTask(dateKey)}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-small font-medium text-accent-400 hover:bg-accent-muted transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                        Add a task
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-[12px] text-text-tertiary">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[var(--calendar-dot-low)]" />
          <span>1 task</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[var(--calendar-dot-mid)]" />
          <span>2–3 tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[var(--calendar-dot-high)]" />
          <span>4+ tasks</span>
        </div>
      </div>
    </div>
  );
}
