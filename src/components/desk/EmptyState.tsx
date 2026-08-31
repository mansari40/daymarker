"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({ onAddTask }: { onAddTask: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[--radius-lg] border border-dashed border-border-strong bg-bg-panel/50 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-bg-panel">
        <Check size={24} className="text-text-tertiary" />
      </div>
      <h3 className="mt-4 text-h2 font-bold text-text-primary">A clean page.</h3>
      <p className="mt-2 max-w-sm text-body text-text-secondary">
        Put one clear intention here, then let the rest of the day follow.
      </p>
      <Button onClick={onAddTask} trailing className="mt-6">
        + Add your first task
      </Button>
    </div>
  );
}
