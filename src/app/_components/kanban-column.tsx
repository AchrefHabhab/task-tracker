'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { KanbanCard } from './kanban-card';

const columnConfig: Record<
  Task['status'],
  { label: string; color: string; bg: string; icon: string }
> = {
  todo: {
    label: 'To Do',
    color: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800/50',
    icon: '📋',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-600 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: '🔄',
  },
  done: {
    label: 'Done',
    color: 'text-green-600 dark:text-green-300',
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: '✅',
  },
};

interface KanbanColumnProps {
  status: Task['status'];
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (updated: Task) => void;
}

export function KanbanColumn({
  status,
  tasks,
  onDelete,
  onEdit,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];
  const taskIds = tasks.map((t) => t.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'flex flex-col rounded-xl border p-3 transition-colors duration-200',
        config.bg,
        isOver && 'ring-2 ring-primary/50 bg-primary/5'
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{config.icon}</span>
          <h3 className={cn('text-sm font-semibold', config.color)}>
            {config.label}
          </h3>
        </div>
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded-full text-[11px] font-bold',
            config.color,
            'bg-white/60 dark:bg-white/10'
          )}
        >
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex min-h-[120px] flex-1 flex-col gap-2"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 py-8 text-xs text-muted-foreground"
          >
            Drop tasks here
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
