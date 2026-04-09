'use client';

import { useState } from 'react';
import type { Task, Status } from '@/types/task';
import { TaskList } from './_components/task-list';
import { AddTaskDialog } from './_components/add-task-dialog';

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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const nextStatus: Record<Status, Status> = {
    todo: 'in-progress',
    'in-progress': 'done',
    done: 'todo',
  };

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: nextStatus[task.status] } : task
      )
    );
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Task Tracker</h1>
        <AddTaskDialog onAdd={handleAddTask} />
      </div>
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
