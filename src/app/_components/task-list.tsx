'use client';

import type { Task } from '@/types/task';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function TaskList({ tasks, onDelete, onToggleStatus }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No tasks yet</p>
        <p className="text-sm">Add your first task to get started.</p>
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
