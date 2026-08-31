"use client";

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
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRefresh: () => void;
  onMutated: () => void;
}

export function TaskList({ tasks, onEdit, onRefresh, onMutated }: TaskListProps) {
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onRefresh={onRefresh}
          onMutated={onMutated}
        />
      ))}
    </div>
  );
}
