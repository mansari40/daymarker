"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LogOut, Calendar, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Greeting } from "@/components/desk/Greeting";
import { EmptyState } from "@/components/desk/EmptyState";
import { TaskList } from "@/components/desk/TaskList";
import { AddTaskModal } from "@/components/desk/AddTaskModal";
import { StatsRow } from "@/components/desk/StatsRow";
import { BottomBanner } from "@/components/desk/BottomBanner";
import { MilestoneToast } from "@/components/desk/MilestoneToast";
import { TaskDetail } from "@/components/desk/TaskDetail";
import { SkeletonTask, SkeletonGreeting, SkeletonStats } from "@/components/desk/SkeletonTask";
import { Tabs } from "@/components/ui/Tabs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CalendarView } from "@/components/desk/CalendarView";
import { AccountView } from "@/components/desk/AccountView";
import { Popover } from "@/components/ui/Popover";

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
  sortOrder?: number;
}

export default function DeskPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("today");
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  const [streak, setStreak] = useState(0);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [calendarDueDate, setCalendarDueDate] = useState<string | undefined>(undefined);
  const [missedCount, setMissedCount] = useState(0);

  // Popover state
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);
  const accountBtnRef = useRef<HTMLButtonElement>(null);

  const bumpStats = useCallback(() => {
    setStatsRefreshTrigger((n) => n + 1);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks?status=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (status === "authenticated") {
      const doFetch = async () => {
        try {
          const res = await fetch(`/api/tasks?status=${activeTab}`);
          if (res.ok) {
            const data = await res.json();
            setTasks(data);
          }
        } catch {
          // silently fail
        } finally {
          setLoading(false);
        }
      };
      void doFetch();
    }
  }, [status, activeTab]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data?.streak !== undefined) setStreak(data.streak);
      })
      .catch(() => {});
    fetch("/api/tasks?status=missed")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMissedCount(data.length);
      })
      .catch(() => {});
  }, [statsRefreshTrigger]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "n" && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setEditingTask(null);
        setCalendarDueDate(undefined);
        setShowAddModal(true);
      }

      if (e.key === "Escape") {
        if (detailTask) {
          setDetailTask(null);
        } else if (showAddModal) {
          setShowAddModal(false);
          setEditingTask(null);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [detailTask, showAddModal]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setLoading(true);
  };

  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setCalendarDueDate(undefined);
    setShowAddModal(true);
  }, []);

  const handleCalendarAddTask = useCallback((dueDate?: string) => {
    setEditingTask(null);
    setCalendarDueDate(dueDate);
    setShowAddModal(true);
    setCalendarOpen(false);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  }, []);

  const handleDetail = useCallback((task: Task) => {
    setDetailTask(task);
  }, []);

  const handleReorder = useCallback(
    async (items: { id: string; sortOrder: number }[]) => {
      // Optimistic update
      setTasks((prev) => {
        const updated = [...prev];
        for (const item of items) {
          const task = updated.find((t) => t.id === item.id);
          if (task) task.sortOrder = item.sortOrder;
        }
        return updated.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      });

      try {
        await fetch("/api/tasks/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
      } catch {
        fetchTasks();
      }
    },
    [fetchTasks]
  );

  const todayCount = tasks.length;

  const tabs = [
    { id: "today", label: "Today", count: todayCount || undefined },
    { id: "upcoming", label: "Upcoming" },
    { id: "missed", label: "Missed", count: missedCount || undefined },
    { id: "completed", label: "Completed" },
    { id: "archive", label: "Archive" },
  ];

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-base">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <MilestoneToast streak={streak} />

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Top meta row */}
        <div className="mb-8 flex items-center justify-between">
          <span className="text-label font-semibold uppercase tracking-widest text-text-tertiary">
            Daymarker / Personal desk
          </span>
          <div className="flex items-center gap-2 relative">
            {/* Calendar button + popover */}
            <button
              ref={calendarBtnRef}
              onClick={() => {
                setCalendarOpen(!calendarOpen);
                setAccountOpen(false);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                calendarOpen
                  ? "border-border-accent text-accent-400 bg-accent-muted"
                  : "border-border-subtle text-text-tertiary hover:text-text-primary"
              }`}
              aria-label="Calendar"
              title="Calendar"
            >
              <Calendar size={16} />
            </button>
            <Popover
              open={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              anchorRef={calendarBtnRef}
              align="right"
              className="w-[360px]"
            >
              <div className="p-3 max-h-[80vh] overflow-y-auto">
                <CalendarView onAddTask={handleCalendarAddTask} compact />
              </div>
            </Popover>

            {/* Account button + popover */}
            <button
              ref={accountBtnRef}
              onClick={() => {
                setAccountOpen(!accountOpen);
                setCalendarOpen(false);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                accountOpen
                  ? "border-border-accent text-accent-400 bg-accent-muted"
                  : "border-border-subtle text-text-tertiary hover:text-text-primary"
              }`}
              aria-label="My account"
              title="My account"
            >
              <User size={16} />
            </button>
            <Popover
              open={accountOpen}
              onClose={() => setAccountOpen(false)}
              anchorRef={accountBtnRef}
              align="right"
              className="w-[340px]"
            >
              <div className="p-3 max-h-[80vh] overflow-y-auto">
                <AccountView compact />
              </div>
            </Popover>

            <ThemeToggle />
            <button
              onClick={() => {
                if (confirm("Sign out of Daymarker?")) {
                  signOut({ callbackUrl: "/" });
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Greeting */}
        {loading ? <SkeletonGreeting /> : <Greeting onAddTask={handleAddTask} />}

        {/* List panel header */}
        <div className="mt-12">
          <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
            Your list
          </span>
          <h2 className="mt-1 text-h2 font-bold text-text-primary">
            The next right things.
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        </div>

        {/* Content area */}
        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonTask key={i} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState onAddTask={handleAddTask} tab={activeTab} />
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onRefresh={fetchTasks}
              onMutated={bumpStats}
              onDetail={handleDetail}
              onReorder={handleReorder}
              groupByTimeOfDay={activeTab === "today" || activeTab === "missed"}
              draggable={activeTab === "today" || activeTab === "upcoming"}
            />
          )}
        </div>

        {/* Stats footer */}
        <div className="mt-12">
          <StatsRow refreshTrigger={statsRefreshTrigger} />
        </div>
      </div>

      {/* Bottom banner */}
      <BottomBanner />

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTask(null);
          setCalendarDueDate(undefined);
        }}
        onCreated={() => {
          fetchTasks();
          bumpStats();
        }}
        editTask={editingTask || undefined}
        defaultDueDate={calendarDueDate}
      />

      {/* Task Detail Slide-Out */}
      {detailTask && (
        <TaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={() => {
            setEditingTask(detailTask);
            setShowAddModal(true);
            setDetailTask(null);
          }}
          onRefresh={fetchTasks}
          onMutated={bumpStats}
        />
      )}
    </div>
  );
}
