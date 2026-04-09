'use client';

import type { Status, Priority } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statuses: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorities: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

interface TaskFiltersProps {
  activeStatus: Status | 'all';
  activePriority: Priority | 'all';
  onStatusChange: (status: Status | 'all') => void;
  onPriorityChange: (priority: Priority | 'all') => void;
  taskCounts: {
    byStatus: Record<Status, number>;
    byPriority: Record<Priority, number>;
    total: number;
  };
}

export function TaskFilters({
  activeStatus,
  activePriority,
  onStatusChange,
  onPriorityChange,
  taskCounts,
}: TaskFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Status:
        </span>
        <Badge
          variant={activeStatus === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onStatusChange('all')}
        >
          All ({taskCounts.total})
        </Badge>
        {statuses.map((s) => (
          <Badge
            key={s.value}
            variant={activeStatus === s.value ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer',
              activeStatus === s.value && 'ring-1 ring-ring'
            )}
            onClick={() =>
              onStatusChange(activeStatus === s.value ? 'all' : s.value)
            }
          >
            {s.label} ({taskCounts.byStatus[s.value]})
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Priority:
        </span>
        <Badge
          variant={activePriority === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onPriorityChange('all')}
        >
          All ({taskCounts.total})
        </Badge>
        {priorities.map((p) => (
          <Badge
            key={p.value}
            variant={activePriority === p.value ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer',
              activePriority === p.value && 'ring-1 ring-ring'
            )}
            onClick={() =>
              onPriorityChange(activePriority === p.value ? 'all' : p.value)
            }
          >
            {p.label} ({taskCounts.byPriority[p.value]})
          </Badge>
        ))}
      </div>
    </div>
  );
}
