'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Task, Status, Priority } from '@/types/task';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { TaskList } from './_components/task-list';
import { AddTaskDialog } from './_components/add-task-dialog';
import { ThemeToggle } from './_components/theme-toggle';
import { TaskFilters } from './_components/task-filters';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Learn Next.js App Router',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2026-03-29'),
  },
  {
    id: '2',
    title: 'Build Task Tracker UI',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2026-03-30'),
  },
  {
    id: '3',
    title: 'Set up project structure',
    status: 'done',
    priority: 'high',
    createdAt: new Date('2026-03-28'),
  },
];

export default function Home() {
  const [rawTasks, setTasks] = useLocalStorage<Task[]>(
    'task-tracker-tasks',
    initialTasks
  );

  const tasks = useMemo(
    () =>
      rawTasks.map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
      })),
    [rawTasks]
  );
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

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

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    toast.success(`Task "${newTask.title}" created`);
  };

  const handleDeleteTask = (id: string) => {
    const taskTitle = tasks.find((t) => t.id === id)?.title;
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.info(`Task "${taskTitle}" deleted`);
  };

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

  const handleToggleStatus = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = nextStatus[task.status];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      )
    );
    toast.success(`"${task.title}" → ${statusLabels[newStatus]}`);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Task Tracker</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AddTaskDialog onAdd={handleAddTask} />
        </div>
      </div>
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
      />
    </div>
  );
}
