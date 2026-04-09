'use client';

import { useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { Task, Status } from '@/types/task';
import { KanbanColumn } from './kanban-column';

const statuses: Status[] = ['todo', 'in-progress', 'done'];

interface KanbanBoardProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (updated: Task) => void;
  onMoveTask: (taskId: string, newStatus: Status) => void;
}

export function KanbanBoard({
  tasks,
  onDelete,
  onEdit,
  onMoveTask,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const getTasksByStatus = useCallback(
    (status: Status) => tasks.filter((t) => t.status === status),
    [tasks]
  );

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Visual feedback handled by useDroppable isOver state
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Determine the target status
    let targetStatus: Status | null = null;

    // Dropped on a column directly
    if (statuses.includes(over.id as Status)) {
      targetStatus = over.id as Status;
    } else {
      // Dropped on another card — find which column that card is in
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus && targetStatus !== task.status) {
      onMoveTask(taskId, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 rounded-lg border bg-card p-3 shadow-2xl opacity-90">
            <p className="text-sm font-medium">{activeTask.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
