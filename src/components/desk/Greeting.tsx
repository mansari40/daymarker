"use client";

import { useSession } from "next-auth/react";
import { Calendar, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Greeting({ onAddTask }: { onAddTask: () => void }) {
  const { data: session } = useSession();
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-2 text-label font-semibold uppercase tracking-widest text-accent-400">
          <Calendar size={12} />
          <span>{dateStr}</span>
        </div>
        <h1 className="mt-2 text-h1 font-bold tracking-tight text-text-primary">
          {greeting}, {firstName}.
        </h1>
        <p className="mt-1 text-body text-text-secondary">
          What would make today feel complete?
        </p>
      </div>
      <Button onClick={onAddTask} trailing>
        + Add a task
      </Button>
    </div>
  );
}
