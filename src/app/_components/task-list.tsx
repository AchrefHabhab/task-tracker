'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Task } from '@/types/task';
import { ClipboardList } from 'lucide-react';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (updated: Task) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
      delay: i * 0.05,
    },
  }),
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

export function TaskList({ tasks, onDelete, onToggleStatus, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <ClipboardList className="mb-3 size-12" />
        </motion.div>
        <p className="text-lg font-semibold">No tasks found</p>
        <p className="text-sm">Add a new task or adjust your filters.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            layout
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
          >
            <TaskCard
              task={task}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
