"use client";

import { Check, Archive, CircleCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const EMPTY_STATES: Record<
  string,
  { heading: string; body: string; icon: React.ReactNode; showAdd?: boolean }
> = {
  today: {
    heading: "A clean page.",
    body: "Put one clear intention here, then let the rest of the day follow.",
    icon: <Check size={24} className="text-text-tertiary" />,
    showAdd: true,
  },
  upcoming: {
    heading: "Nothing upcoming.",
    body: "All caught up — nothing on the horizon yet.",
    icon: <Clock size={24} className="text-text-tertiary" />,
    showAdd: true,
  },
  missed: {
    heading: "Nothing missed.",
    body: "You're on top of things. No tasks have slipped through.",
    icon: <Clock size={24} className="text-text-tertiary" />,
    showAdd: false,
  },
  completed: {
    heading: "Nothing completed yet.",
    body: "Check off a task to see it appear here.",
    icon: <CircleCheck size={24} className="text-text-tertiary" />,
    showAdd: false,
  },
  archive: {
    heading: "Nothing archived.",
    body: "Tasks you're done with can be archived here for reference.",
    icon: <Archive size={24} className="text-text-tertiary" />,
    showAdd: false,
  },
};

export function EmptyState({
  onAddTask,
  tab = "today",
}: {
  onAddTask: () => void;
  tab?: string;
}) {
  const state = EMPTY_STATES[tab] ?? EMPTY_STATES.today;

  return (
    <div className="flex flex-col items-center justify-center rounded-[--radius-lg] border border-dashed border-border-strong bg-bg-panel/50 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-bg-panel">
        {state.icon}
      </div>
      <h3 className="mt-4 text-h2 font-bold text-text-primary">{state.heading}</h3>
      <p className="mt-2 max-w-sm text-body text-text-secondary">{state.body}</p>
      {state.showAdd && (
        <Button onClick={onAddTask} trailing className="mt-6">
          + Add your first task
        </Button>
      )}
    </div>
  );
}
