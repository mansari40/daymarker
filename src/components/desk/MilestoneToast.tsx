"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";

const MILESTONES = [3, 7, 14, 30, 60, 100];

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "Three days strong — the habit is forming.",
  7: "A full week. You're building something real.",
  14: "Two weeks in. This is who you are now.",
  30: "Thirty days. A month of clear intention.",
  60: "Sixty days. Quiet discipline, loud results.",
  100: "One hundred marks. Extraordinary consistency.",
};

export function MilestoneToast({ streak }: { streak: number }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (streak < 3) return;

    const milestone = [...MILESTONES].reverse().find((m) => streak >= m);
    if (!milestone) return;

    const key = `daymarker-milestone-${milestone}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    setMessage(MILESTONE_MESSAGES[milestone] || `${milestone} day streak!`);
    setVisible(true);

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setVisible(false), 400);
    }, 3500);

    return () => clearTimeout(timer);
  }, [streak]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-1/2 top-6 z-[60] -translate-x-1/2"
      style={{ animation: exiting ? "toast-out 0.4s forwards" : "toast-in 0.4s forwards" }}
    >
      <div className="flex items-center gap-3 rounded-full border border-accent-500/30 bg-bg-panel px-5 py-3 shadow-lg">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-muted">
          <Award size={16} className="text-accent-400" />
        </div>
        <span className="text-small font-medium text-text-primary">{message}</span>
      </div>
    </div>
  );
}
