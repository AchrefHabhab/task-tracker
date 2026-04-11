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
  {
    label: string;
    color: string;
    bg: string;
    icon: string;
    accentBorder: string;
    dropBg: string;
  }
> = {
  todo: {
    label: 'To Do',
    color: 'text-slate-700 dark:text-slate-200',
    bg: 'bg-slate-50/80 dark:bg-slate-800/40',
    icon: '📋',
    accentBorder: 'border-t-slate-400 dark:border-t-slate-500',
    dropBg: 'bg-slate-200/40 dark:bg-slate-700/30',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-700 dark:text-blue-200',
    bg: 'bg-blue-50/80 dark:bg-blue-950/30',
    icon: '⚡',
    accentBorder: 'border-t-blue-500 dark:border-t-blue-400',
    dropBg: 'bg-blue-100/40 dark:bg-blue-900/30',
  },
  done: {
    label: 'Done',
    color: 'text-green-700 dark:text-green-200',
    bg: 'bg-green-50/80 dark:bg-green-950/30',
    icon: '🎉',
    accentBorder: 'border-t-green-500 dark:border-t-green-400',
    dropBg: 'bg-green-100/40 dark:bg-green-900/30',
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 22,
      delay: i * 0.08,
    },
  }),
};

interface KanbanColumnProps {
  status: Task['status'];
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (updated: Task) => void;
  index: number;
}

export function KanbanColumn({
  status,
  tasks,
  onDelete,
  onEdit,
  index,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];
  const taskIds = tasks.map((t) => t.id);

  return (
    <motion.div
      custom={index}
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col rounded-2xl border border-t-[3px] p-3 transition-all duration-300',
        config.bg,
        config.accentBorder,
        isOver && `ring-2 ring-primary/40 ${config.dropBg} scale-[1.01]`
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: index * 0.08 + 0.15 }}
          >
            {config.icon}
          </motion.span>
          <h3 className={cn('text-sm font-bold tracking-tight', config.color)}>
            {config.label}
          </h3>
        </div>
        <motion.span
          layout
          className={cn(
            'flex size-6 items-center justify-center rounded-full text-xs font-bold',
            config.color,
            'bg-white/70 dark:bg-white/10'
          )}
        >
          {tasks.length}
        </motion.span>
      </div>

      <div
        ref={setNodeRef}
        className="kanban-scroll flex min-h-[140px] max-h-[60vh] flex-1 flex-col gap-2 overflow-y-auto"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-muted-foreground/15 py-10 text-muted-foreground"
          >
            <span className="text-2xl">📭</span>
            <span className="text-xs font-medium">Drop tasks here</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
