'use client';

import type { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<Task['status'], string> = {
  todo: 'bg-muted text-muted-foreground',
  'in-progress':
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const priorityColors: Record<Task['priority'], string> = {
  low: 'bg-muted text-muted-foreground',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusLabels: Record<Task['status'], string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function TaskCard({ task, onDelete, onToggleStatus }: TaskCardProps) {
  const isDone = task.status === 'done';

  return (
    <Card className={cn('transition-opacity', isDone && 'opacity-60')}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn(
              'text-base font-medium transition-all',
              isDone && 'text-muted-foreground line-through'
            )}
          >
            {isDone && (
              <CheckCircle2 className="mr-1.5 inline-block size-4 text-green-600 dark:text-green-400" />
            )}
            {task.title}
          </CardTitle>
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge className={statusColors[task.status]}>
            {statusLabels[task.status]}
          </Badge>
          <div className="flex items-center gap-1">
            <span className="mr-2 text-xs text-muted-foreground">
              {task.createdAt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onToggleStatus(task.id)}
              aria-label="Toggle status"
            >
              <ArrowRightCircle className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
