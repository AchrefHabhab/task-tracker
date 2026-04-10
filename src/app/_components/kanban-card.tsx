'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditTaskDialog } from './edit-task-dialog';

const priorityConfig: Record<
  Task['priority'],
  { emoji: string; label: string; color: string }
> = {
  high: {
    emoji: '🔴',
    label: 'High',
    color: 'text-red-600 dark:text-red-400',
  },
  medium: {
    emoji: '🟡',
    label: 'Medium',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  low: {
    emoji: '🟢',
    label: 'Low',
    color: 'text-slate-500 dark:text-slate-400',
  },
};

interface KanbanCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (updated: Task) => void;
}

export function KanbanCard({ task, onDelete, onEdit }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        'group touch-none cursor-grab rounded-xl border bg-card p-3 shadow-sm transition-shadow duration-200 hover:shadow-md active:cursor-grabbing',
        isDragging && 'z-50 rotate-[3deg] scale-105 shadow-2xl opacity-80 ring-2 ring-primary/30'
      )}
      {...attributes}
      {...listeners}
    >
      {/* Title */}
      <p
        className={cn(
          'mb-2 text-[13px] font-semibold leading-snug tracking-tight',
          task.status === 'done' && 'text-muted-foreground line-through'
        )}
      >
        {task.status === 'done' && <span className="mr-1">✅</span>}
        {task.title}
      </p>

      {/* Footer: priority + actions */}
      <div className="flex items-center justify-between">
        <span className={cn('flex items-center gap-1 text-[11px] font-medium', priority.color)}>
          <span>{priority.emoji}</span>
          {priority.label}
        </span>

        <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <EditTaskDialog task={task} onEdit={onEdit} />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Delete task"
            className="size-6"
          >
            <Trash2 className="size-3 text-destructive" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
