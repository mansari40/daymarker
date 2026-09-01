"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  isSupported,
  getPermission,
  requestPermission,
  hasOptedIn,
  setOptedIn,
  registerServiceWorker,
} from "@/lib/notifications";
import { getTodaysQuote } from "@/lib/quotes";

export function Greeting({ onAddTask }: { onAddTask: () => void }) {
  const { data: session } = useSession();
  const now = new Date();
  const hour = now.getHours();
  const quote = getTodaysQuote?.() ?? null;
  const quoteText = quote
    ? `\u201C${quote.content}\u201D${quote.author ? ` \u2014 ${quote.author}` : ""}`
    : "";
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (!quoteText) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleChars(quoteText.length);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleChars(i);
      if (i >= quoteText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [quoteText]);

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const [notifStatus, setNotifStatus] = useState<"default" | "granted" | "denied">("default");

  useEffect(() => {
    if (!isSupported()) return;
    const perm = getPermission();
    if (perm === "granted" || perm === "denied") {
      setNotifStatus(perm);
      setShowNotifBanner(false);
    } else if (!hasOptedIn()) {
      setShowNotifBanner(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const perm = await requestPermission();
    setNotifStatus(perm);
    if (perm === "granted") {
      setOptedIn(true);
      registerServiceWorker();
    }
    setShowNotifBanner(false);
  };

  return (
    <div>
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
            {hour < 12
              ? "What would make today feel complete?"
              : hour < 18
              ? "How's the day shaping up?"
              : "Any marks left to make?"}
          </p>
          {quote && (
            <p className="mt-1 text-small text-text-tertiary italic">
              {quoteText.slice(0, visibleChars)}
              {visibleChars < quoteText.length && (
                <span className="inline-block w-px h-[1em] bg-text-tertiary animate-pulse ml-px align-text-bottom" />
              )}
            </p>
          )}
        </div>
        <Button onClick={onAddTask} trailing>
          + Add a task
        </Button>
      </div>

      {showNotifBanner && (
        <div className="mt-4 flex items-center gap-3 rounded-[--radius-md] border border-accent-500/20 bg-accent-muted/50 px-4 py-3">
          <Bell size={14} className="flex-shrink-0 text-accent-400" />
          <p className="flex-1 text-small text-text-secondary">
            Get a gentle reminder each morning to set your intention.
          </p>
          <button
            onClick={handleEnableNotifications}
            className="flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-small font-medium text-white hover:bg-accent-400 transition-colors cursor-pointer"
          >
            <Bell size={12} />
            Enable
          </button>
          <button
            onClick={() => setShowNotifBanner(false)}
            className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
          >
            <BellOff size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
