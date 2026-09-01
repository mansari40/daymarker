"use client";

import { useState } from "react";
import { Check, MoreHorizontal, Pencil, Trash2, Archive } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  weight: string;
  timeOfDay: string;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
  archived: boolean;
  createdAt: string;
}

const weightLabels: Record<string, string> = {
  LIGHT: "Light",
  STEADY: "Steady",
  MEDIUM_FOCUS: "Medium Focus",
  HEAVY: "Heavy",
};

const categoryLabels: Record<string, string> = {
  WORK: "Work",
  PERSONAL: "Personal",
  HEALTH: "Health",
  ERRAND: "Errand",
  OTHER: "Other",
};

const timeOfDayLabels: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  ANYTIME: "Anytime",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TaskItem({
  task,
  onEdit,
  onRefresh,
  onMutated,
}: {
  task: Task;
  onEdit: () => void;
  onRefresh: () => void;
  onMutated: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      onRefresh();
      onMutated();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      onRefresh();
      onMutated();
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      });
      onRefresh();
      onMutated();
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div
      className={`panel-elevated group relative flex items-start gap-4 rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-4 hover:bg-bg-panel-hover ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        disabled={loading}
        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer"
        style={{
          borderColor: task.completed
            ? "var(--accent-500)"
            : "var(--border-strong)",
          backgroundColor: task.completed
            ? "var(--accent-500)"
            : "transparent",
        }}
      >
        {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-body font-medium ${
            task.completed
              ? "text-text-tertiary line-through"
              : "text-text-primary"
          }`}
        >
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-small text-text-tertiary">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                task.weight === "HEAVY"
                  ? "#ef4444"
                  : task.weight === "MEDIUM_FOCUS"
                  ? "#f59e0b"
                  : task.weight === "STEADY"
                  ? "var(--accent-400)"
                  : "var(--text-tertiary)",
            }}
          />
          <span>{weightLabels[task.weight] || task.weight}</span>
          <span>·</span>
          <span>{categoryLabels[task.category] || task.category}</span>
          <span>·</span>
          <span>{timeOfDayLabels[task.timeOfDay] || task.timeOfDay}</span>
          {task.dueDate && (
            <>
              <span>·</span>
              <span>{formatDate(task.dueDate)}</span>
            </>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-8 w-8 items-center justify-center rounded-[--radius-md] text-text-tertiary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={16} />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-[--radius-md] bg-bg-panel border border-border-subtle py-1 shadow-lg">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-small text-text-secondary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={handleArchive}
                className="flex w-full items-center gap-2 px-3 py-2 text-small text-text-secondary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
              >
                <Archive size={14} />
                Archive
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-small text-red-400 hover:bg-bg-panel-hover transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}