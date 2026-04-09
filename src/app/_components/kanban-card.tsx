'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditTaskDialog } from './edit-task-dialog';

const priorityColors: Record<Task['priority'], string> = {
  low: 'bg-muted text-muted-foreground',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const priorityDots: Record<Task['priority'], string> = {
  low: 'bg-slate-400',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={cn(
        'group cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing',
        isDragging && 'z-50 rotate-2 scale-105 shadow-xl opacity-90'
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            className="cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-3.5" />
          </button>
          <span
            className={cn(
              'text-sm font-medium leading-snug',
              task.status === 'done' && 'text-muted-foreground line-through'
            )}
          >
            {task.title}
          </span>
        </div>
        <div className={cn('mt-0.5 size-2 shrink-0 rounded-full', priorityDots[task.priority])} />
      </div>

      <div className="flex items-center justify-between">
        <Badge className={cn('text-[10px] px-1.5 py-0', priorityColors[task.priority])}>
          {task.priority}
        </Badge>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <EditTaskDialog task={task} onEdit={onEdit} />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(task.id)}
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
