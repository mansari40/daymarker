"use client";

import { useState, type FormEvent } from "react";
import { Calendar } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const categoryOptions = [
  { value: "WORK", label: "Work" },
  { value: "PERSONAL", label: "Personal" },
  { value: "HEALTH", label: "Health" },
  { value: "ERRAND", label: "Errand" },
  { value: "OTHER", label: "Other" },
];

const weightOptions = [
  { value: "LIGHT", label: "Light" },
  { value: "STEADY", label: "Steady" },
  { value: "MEDIUM_FOCUS", label: "Medium Focus" },
  { value: "HEAVY", label: "Heavy" },
];

const timeOfDayOptions = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
  { value: "EVENING", label: "Evening" },
  { value: "ANYTIME", label: "Anytime" },
];

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  editTask?: {
    id: string;
    title: string;
    category: string;
    weight: string;
    timeOfDay: string;
    dueDate: string | null;
  };
}

export function AddTaskModal({ open, onClose, onCreated, editTask }: AddTaskModalProps) {
  const [title, setTitle] = useState(editTask?.title || "");
  const [category, setCategory] = useState(editTask?.category || "OTHER");
  const [weight, setWeight] = useState(editTask?.weight || "STEADY");
  const [timeOfDay, setTimeOfDay] = useState(editTask?.timeOfDay || "ANYTIME");
  const [dueDate, setDueDate] = useState(editTask?.dueDate || new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const isEdit = !!editTask;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(undefined);

    try {
      const url = isEdit ? `/api/tasks/${editTask.id}` : "/api/tasks";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          weight,
          timeOfDay,
          dueDate: dueDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      // Reset form
      setTitle("");
      setCategory("OTHER");
      setWeight("STEADY");
      setTimeOfDay("ANYTIME");
      setDueDate(new Date().toISOString().split("T")[0]);
      onClose();
      onCreated();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-2 text-label font-semibold uppercase tracking-widest text-accent-400">
        New mark
      </div>
      <h2 className="text-h2 font-bold text-text-primary">What matters today?</h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <Input
          label="Task"
          placeholder="Name the next right thing"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Weight"
            options={weightOptions}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Select
            label="Time of day"
            options={timeOfDayOptions}
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          />
        </div>

        <div>
          <label className="text-label font-semibold uppercase tracking-widest text-accent-400">
            Date <span className="text-text-tertiary normal-case">(optional)</span>
          </label>
          <div className="relative mt-1.5">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-12 w-full rounded-[--radius-md] bg-bg-input pl-9 pr-4 text-text-primary border border-border-subtle focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-border-accent transition-colors"
            />
          </div>
        </div>

        {error && <p className="text-small text-red-400">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Not now
          </Button>
          <Button type="submit" trailing disabled={loading}>
            {isEdit ? "Save changes" : "Add to today"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
