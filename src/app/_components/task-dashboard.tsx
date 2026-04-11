'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { Task, Status, Priority } from '@/types/task';
import {
  createTask,
  deleteTask,
  restoreTask,
  updateTask,
  updateTaskStatus,
} from '@/app/_actions/task-actions';
import { fireConfetti } from '@/lib/confetti';
import { KanbanBoard } from './kanban-board';
import { StatsPanel } from './stats-panel';
import { AddTaskDialog } from './add-task-dialog';
import { ThemeToggle } from './theme-toggle';
import { SearchBar } from './search-bar';
import { ProgressBar } from './progress-bar';

interface TaskDashboardProps {
  tasks: Task[];
}

const statusLabels: Record<Status, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export function TaskDashboard({ tasks }: TaskDashboardProps) {
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // ⌘K — focus search
      if (mod && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }

      // ⌘N — new task
      if (mod && e.key === 'n') {
        e.preventDefault();
        setAddDialogOpen(true);
      }

      // Escape — blur search
      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
        setSearch('');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(query)
    );
  }, [tasks, search]);

  const doneCount = useMemo(
    () => tasks.filter((t) => t.status === 'done').length,
    [tasks]
  );

  const handleAddTask = (title: string, priority: Priority) => {
    startTransition(async () => {
      await createTask(title, priority);
      toast.success(`Task "${title}" created`);
    });
  };

  // ── Undo-able delete ──────────────────────────────────────
  const handleDeleteTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      startTransition(async () => {
        await deleteTask(id);

        toast('🗑️ Task deleted', {
          description: `"${task.title}" was removed`,
          action: {
            label: '↩️ Undo',
            onClick: () => {
              startTransition(async () => {
                await restoreTask(task.title, task.priority, task.status);
                toast.success(`"${task.title}" restored`);
              });
            },
          },
          duration: 6000,
        });
      });
    },
    [tasks, startTransition]
  );

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

  const handleMoveTask = (taskId: string, newStatus: Status) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    startTransition(async () => {
      await updateTaskStatus(taskId, newStatus);
      toast.success(`"${task.title}" → ${statusLabels[newStatus]}`);
      if (newStatus === 'done') {
        fireConfetti();
      }
    });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="mr-2">🚀</span>Task Tracker
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {tasks.length === 0
                ? '📝 No tasks yet — add one to get started'
                : `✨ ${doneCount} of ${tasks.length} tasks completed`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AddTaskDialog
              onAdd={handleAddTask}
              isPending={isPending}
              open={addDialogOpen}
              onOpenChange={setAddDialogOpen}
            />
          </div>
        </div>

        {/* Keyboard shortcut hints */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground/60">
          <span><kbd className="rounded border border-muted px-1 py-0.5 font-mono text-[10px]">⌘K</kbd> Search</span>
          <span><kbd className="rounded border border-muted px-1 py-0.5 font-mono text-[10px]">⌘N</kbd> New task</span>
          <span><kbd className="rounded border border-muted px-1 py-0.5 font-mono text-[10px]">Esc</kbd> Clear</span>
        </div>
      </header>

      <ProgressBar completed={doneCount} total={tasks.length} />
      <StatsPanel tasks={tasks} />
      <SearchBar ref={searchRef} value={search} onChange={setSearch} />

      <KanbanBoard
        tasks={filteredTasks}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        onMoveTask={handleMoveTask}
      />
    </div>
  );
}
