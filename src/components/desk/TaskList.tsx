"use client";

import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Clock } from "lucide-react";
import { TaskItem } from "./TaskItem";

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

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRefresh: () => void;
  onMutated: () => void;
  onDetail: (task: Task) => void;
  onReorder?: (items: { id: string; sortOrder: number }[]) => void;
  groupByTimeOfDay?: boolean;
  draggable?: boolean;
}

const TIME_ORDER = ["MORNING", "AFTERNOON", "EVENING", "ANYTIME"];
const TIME_LABELS: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  ANYTIME: "Anytime",
};

export function TaskList({
  tasks,
  onEdit,
  onRefresh,
  onMutated,
  onDetail,
  onReorder,
  groupByTimeOfDay = false,
  draggable = false,
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!onReorder) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...tasks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder(
      reordered.map((t, i) => ({ id: t.id, sortOrder: i }))
    );
  };

  const groupedTasks = useMemo(() => {
    if (!groupByTimeOfDay) return null;

    const groups: Record<string, Task[]> = {};
    for (const task of tasks) {
      const key = task.timeOfDay || "ANYTIME";
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    }

    return TIME_ORDER.filter((k) => groups[k]?.length).map((k) => ({
      timeOfDay: k,
      label: TIME_LABELS[k],
      tasks: groups[k],
    }));
  }, [tasks, groupByTimeOfDay]);

  const taskIds = tasks.map((t) => t.id);

  const content = groupByTimeOfDay && groupedTasks ? (
    <div className="space-y-6">
      {groupedTasks.map((group) => (
        <div key={group.timeOfDay}>
          <div className="mb-3 flex items-center gap-2">
            <Clock size={12} className="text-text-tertiary" />
            <span className="text-label font-semibold uppercase tracking-widest text-text-tertiary">
              {group.label}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {group.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => onEdit(task)}
                onRefresh={onRefresh}
                onMutated={onMutated}
                onDetail={onDetail}
                draggable={draggable}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onRefresh={onRefresh}
          onMutated={onMutated}
          onDetail={onDetail}
          draggable={draggable}
        />
      ))}
    </div>
  );

  if (draggable) {
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {content}
        </SortableContext>
      </DndContext>
    );
  }

  return content;
}
