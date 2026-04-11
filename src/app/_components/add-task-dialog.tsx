'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const priorities: { value: Priority; emoji: string; label: string; color: string }[] = [
  { value: 'low', emoji: '🟢', label: 'Low', color: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30' },
  { value: 'medium', emoji: '🟡', label: 'Medium', color: 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30' },
  { value: 'high', emoji: '🔴', label: 'High', color: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30' },
];

interface AddTaskDialogProps {
  onAdd: (title: string, priority: Priority) => void;
  isPending?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTaskDialog({ onAdd, isPending, open: controlledOpen, onOpenChange }: AddTaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAdd(title.trim(), priority);
    setTitle('');
    setPriority('medium');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-1.5 rounded-xl font-semibold shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95" />
        }
      >
        <Plus className="size-4" />
        Add Task
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">
            ✨ New Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5 pt-2">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-semibold">
              📝 Title
            </label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl text-sm"
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold">
              🏷️ Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              <AnimatePresence>
                {priorities.map((p) => (
                  <motion.button
                    key={p.value}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setPriority(p.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-medium transition-all duration-200',
                      priority === p.value
                        ? `${p.color} ring-2 ring-primary/30 shadow-sm`
                        : 'border-muted bg-muted/30 opacity-60 hover:opacity-90'
                    )}
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <span className="text-xs font-semibold">{p.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <Button
            type="submit"
            className="mt-1 rounded-xl font-semibold transition-transform duration-150 active:scale-95"
            disabled={isPending || !title.trim()}
          >
            {isPending ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>{' '}
                Creating...
              </>
            ) : (
              '🚀 Create Task'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
