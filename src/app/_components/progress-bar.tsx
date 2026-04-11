'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isComplete = percentage === 100;

  return (
    <div className="mb-6">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          {isComplete ? '🎉' : '📈'} {percentage}% complete
        </span>
        <span>
          {completed}/{total} done
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
        {percentage > 0 && (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-white/20 blur-sm"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.1 }}
          />
        )}
      </div>
    </div>
  );
}
