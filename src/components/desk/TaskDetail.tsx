"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Pencil, Archive, Trash2, Check, Clock, Tag, Weight, Calendar } from "lucide-react";

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
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TaskDetail({
  task,
  onClose,
  onEdit,
  onRefresh,
  onMutated,
}: {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
  onMutated: () => void;
}) {
  const handleToggleComplete = async () => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    onRefresh();
    onMutated();
    onClose();
  };

  const handleArchive = async () => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    onRefresh();
    onMutated();
    onClose();
  };

  const handleDelete = async () => {
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    onRefresh();
    onMutated();
    onClose();
  };

  const rows = [
    { icon: Tag, label: "Category", value: categoryLabels[task.category] || task.category },
    { icon: Weight, label: "Weight", value: weightLabels[task.weight] || task.weight },
    { icon: Clock, label: "Time of day", value: timeOfDayLabels[task.timeOfDay] || task.timeOfDay },
    { icon: Calendar, label: "Due date", value: task.dueDate ? formatDate(task.dueDate) : "No date set" },
    { icon: Calendar, label: "Created", value: formatDate(task.createdAt) },
    ...(task.completedAt
      ? [{ icon: Check, label: "Completed", value: formatDate(task.completedAt) }]
      : []),
  ];

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border-subtle bg-bg-base"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <h2 className="text-h2 font-bold text-text-primary">Task details</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h3 className={`text-h1 font-bold ${task.completed ? "text-text-tertiary line-through" : "text-text-primary"}`}>
              {task.title}
            </h3>

            <div className="mt-8 space-y-4">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <row.icon size={14} className="flex-shrink-0 text-text-tertiary" />
                  <div className="flex-1">
                    <span className="text-label font-semibold uppercase tracking-widest text-text-tertiary">
                      {row.label}
                    </span>
                    <p className="mt-0.5 text-body text-text-primary">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-border-subtle px-6 py-4">
            <button
              onClick={handleToggleComplete}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-accent-500 text-white font-medium text-small transition-colors hover:bg-accent-400 cursor-pointer"
            >
              <Check size={16} />
              {task.completed ? "Mark incomplete" : "Mark complete"}
            </button>
            <button
              onClick={() => { onEdit(); onClose(); }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-tertiary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleArchive}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-tertiary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
            >
              <Archive size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
