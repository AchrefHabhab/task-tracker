'use client';

import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { Task, Status, Priority } from '@/types/task';
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from '@/app/_actions/task-actions';
import { TaskList } from './task-list';
import { AddTaskDialog } from './add-task-dialog';
import { ThemeToggle } from './theme-toggle';
import { TaskFilters } from './task-filters';
import { SearchBar } from './search-bar';
import { ProgressBar } from './progress-bar';

interface TaskDashboardProps {
  tasks: Task[];
}

const nextStatus: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
};

const statusLabels: Record<Status, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export function TaskDashboard({ tasks }: TaskDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();
    return tasks.filter((task) => {
      const matchesSearch = !query || task.title.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      byStatus: {
        todo: tasks.filter((t) => t.status === 'todo').length,
        'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
        done: tasks.filter((t) => t.status === 'done').length,
      },
      byPriority: {
        low: tasks.filter((t) => t.priority === 'low').length,
        medium: tasks.filter((t) => t.priority === 'medium').length,
        high: tasks.filter((t) => t.priority === 'high').length,
      },
    };
  }, [tasks]);

  const handleAddTask = (title: string, priority: Priority) => {
    startTransition(async () => {
      await createTask(title, priority);
      toast.success(`Task "${title}" created`);
    });
  };

  const handleDeleteTask = (id: string) => {
    const taskTitle = tasks.find((t) => t.id === id)?.title;
    startTransition(async () => {
      await deleteTask(id);
      toast.info(`Task "${taskTitle}" deleted`);
    });
  };

  const handleToggleStatus = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = nextStatus[task.status];
    startTransition(async () => {
      await updateTaskStatus(id, newStatus);
      toast.success(`"${task.title}" → ${statusLabels[newStatus]}`);
    });
  };

  const handleEditTask = (updated: Task) => {
    startTransition(async () => {
      await updateTask(updated.id, {
        title: updated.title,
        status: updated.status,
        priority: updated.priority,
      });
      toast.success(`Task "${updated.title}" updated`);
    });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Tracker</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tasks.length === 0
                ? 'No tasks yet — add one to get started'
                : `${taskCounts.byStatus.done} of ${tasks.length} tasks completed`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AddTaskDialog onAdd={handleAddTask} isPending={isPending} />
          </div>
        </div>
      </header>
      <ProgressBar
        completed={taskCounts.byStatus.done}
        total={tasks.length}
      />
      <SearchBar value={search} onChange={setSearch} />
      <TaskFilters
        activeStatus={statusFilter}
        activePriority={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        taskCounts={taskCounts}
      />
      <TaskList
        tasks={filteredTasks}
        onDelete={handleDeleteTask}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEditTask}
      />
    </div>
  );
}
