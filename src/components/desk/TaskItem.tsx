"use client";

import { useState, useCallback, useRef } from "react";
import { Check, Pencil, Trash2, Archive, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function ConfettiParticle({ index }: { index: number }) {
  const angle = (index / 8) * 360;
  const distance = 20 + Math.random() * 16;
  const tx = Math.cos((angle * Math.PI) / 180) * distance;
  const ty = Math.sin((angle * Math.PI) / 180) * distance;
  const colors = ["#22c55e", "#4ade80", "#86efac", "#f4f5f1", "#34d399"];
  const color = colors[index % colors.length];
  const size = 3 + Math.random() * 3;

  return (
    <span
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
        ["--tx" as string]: `${tx}px`,
        ["--ty" as string]: `${ty}px`,
        animation: "confetti-burst 0.6s ease-out forwards",
        animationDelay: `${index * 15}ms`,
      }}
    />
  );
}

export function TaskItem({
  task,
  onEdit,
  onRefresh,
  onMutated,
  onDetail,
  draggable = false,
}: {
  task: Task;
  onEdit: () => void;
  onRefresh: () => void;
  onMutated: () => void;
  onDetail: (task: Task) => void;
  draggable?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const checkboxRef = useRef<HTMLButtonElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !draggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleComplete = useCallback(async () => {
    setLoading(true);
    const wasCompleted = task.completed;

    if (!wasCompleted) {
      setShowConfetti(true);
      setJustCompleted(true);
      setTimeout(() => setShowConfetti(false), 700);
      setTimeout(() => setJustCompleted(false), 1200);
    } else {
      setJustCompleted(false);
    }

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !wasCompleted }),
      });
      onRefresh();
      onMutated();
    } finally {
      setLoading(false);
    }
  }, [task.id, task.completed, onRefresh, onMutated]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      onRefresh();
      onMutated();
    } finally {
      setLoading(false);
    }
  }, [task.id, onRefresh, onMutated]);

  const handleArchive = useCallback(async () => {
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
    }
  }, [task.id, onRefresh, onMutated]);

  const showStrikethrough = task.completed || justCompleted;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-3 rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-4 transition-colors ${
        task.completed ? "opacity-60" : ""
      } ${isDragging ? "z-50 shadow-lg" : ""}`}
    >
      {/* Drag handle */}
      {draggable && (
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center text-text-tertiary hover:text-text-secondary cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={14} />
        </button>
      )}

      {/* Checkbox */}
      <div className="relative mt-0.5 flex-shrink-0">
        <button
          ref={checkboxRef}
          onClick={handleToggleComplete}
          disabled={loading}
          className="flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer"
          aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
          style={{
            borderColor: task.completed
              ? "var(--accent-500)"
              : "var(--border-strong)",
            backgroundColor: task.completed
              ? "var(--accent-500)"
              : "transparent",
          }}
        >
          {task.completed && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-white"
            >
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24"
                style={{ animation: "check-draw 0.3s ease forwards" }}
              />
            </svg>
          )}
        </button>
        {/* Confetti */}
        {showConfetti && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <button
        onClick={() => onDetail(task)}
        className="flex-1 min-w-0 text-left cursor-pointer"
      >
        <p
          className={`text-body font-medium transition-all duration-300 ${
            showStrikethrough
              ? "text-text-tertiary"
              : "text-text-primary"
          }`}
          style={{ position: "relative" }}
        >
          {task.title}
          {showStrikethrough && (
            <span
              className="absolute left-0 top-1/2 h-[1.5px] bg-text-tertiary"
              style={{
                width: "100%",
                animation: "strikethrough 0.3s ease forwards",
                transformOrigin: "left",
              }}
            />
          )}
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
      </button>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-[--radius-sm] text-text-tertiary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
          aria-label={`Edit ${task.title}`}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleArchive();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-[--radius-sm] text-text-tertiary hover:text-text-primary hover:bg-bg-panel-hover transition-colors cursor-pointer"
          aria-label={`Archive ${task.title}`}
        >
          <Archive size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-[--radius-sm] text-text-tertiary hover:text-red-400 hover:bg-bg-panel-hover transition-colors cursor-pointer"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
