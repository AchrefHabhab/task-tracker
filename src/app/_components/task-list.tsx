'use client';

import type { Task } from '@/types/task';
import { ClipboardList } from 'lucide-react';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function TaskList({ tasks, onDelete, onToggleStatus }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <ClipboardList className="mb-3 size-10 opacity-50" />
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm">
          Add a new task or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
