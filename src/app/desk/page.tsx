"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, ArrowUpDown, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Greeting } from "@/components/desk/Greeting";
import { EmptyState } from "@/components/desk/EmptyState";
import { TaskList } from "@/components/desk/TaskList";
import { AddTaskModal } from "@/components/desk/AddTaskModal";
import { StatsRow } from "@/components/desk/StatsRow";
import { BottomBanner } from "@/components/desk/BottomBanner";
import { Tabs } from "@/components/ui/Tabs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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

export default function DeskPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("today");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setLoading(true);
  };

  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setShowAddModal(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  }, []);

  const filteredTasks = tasks.filter((t) =>
    searchQuery ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const todayCount = tasks.length;

  const tabs = [
    { id: "today", label: "Today", count: todayCount || undefined },
    { id: "upcoming", label: "Upcoming" },
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
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Top meta row */}
        <div className="mb-8 flex items-center justify-between">
          <span className="text-label font-semibold uppercase tracking-widest text-text-tertiary">
            Daymarker / Personal desk
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => {
                if (confirm("Sign out of Daymarker?")) {
                  signOut({ callbackUrl: "/" });
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Greeting */}
        <Greeting onAddTask={handleAddTask} />

        {/* List panel header */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
              Your list
            </span>
            <h2 className="mt-1 text-h2 font-bold text-text-primary">
              The next right things.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Find a task"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 rounded-[--radius-md] bg-bg-input pl-9 pr-3 text-small text-text-primary border border-border-subtle placeholder:text-text-tertiary focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-border-accent transition-colors"
              />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-[--radius-md] border border-border-subtle text-text-tertiary hover:text-text-primary transition-colors cursor-pointer">
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        </div>

        {/* Content area */}
        <div className="mt-6">
          {loading ? (
            <p className="py-12 text-center text-text-tertiary">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <EmptyState onAddTask={handleAddTask} tab={activeTab} />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onRefresh={fetchTasks}
              onMutated={bumpStats}
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
        }}
        onCreated={() => {
          fetchTasks();
          bumpStats();
        }}
        editTask={editingTask || undefined}
      />
    </div>
  );
}
