'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Task } from '@/types/task';

interface StatsPanelProps {
  tasks: Task[];
}

const STATUS_COLORS: Record<string, string> = {
  'To Do': '#94a3b8',
  'In Progress': '#3b82f6',
  Done: '#22c55e',
};

const PRIORITY_COLORS: Record<string, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#94a3b8',
};

export function StatsPanel({ tasks }: StatsPanelProps) {
  const statusData = useMemo(
    () => [
      { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length },
      {
        name: 'In Progress',
        value: tasks.filter((t) => t.status === 'in-progress').length,
      },
      { name: 'Done', value: tasks.filter((t) => t.status === 'done').length },
    ],
    [tasks]
  );

  const priorityData = useMemo(
    () => [
      { name: 'High', value: tasks.filter((t) => t.priority === 'high').length },
      {
        name: 'Medium',
        value: tasks.filter((t) => t.priority === 'medium').length,
      },
      { name: 'Low', value: tasks.filter((t) => t.priority === 'low').length },
    ],
    [tasks]
  );

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round(
      (tasks.filter((t) => t.status === 'done').length / tasks.length) * 100
    );
  }, [tasks]);

  if (tasks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
      className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {/* Completion Ring */}
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Completion
        </p>
        <div className="relative size-24">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-muted"
              strokeWidth="3"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${15.5 * 2 * Math.PI}`}
              initial={{ strokeDashoffset: 15.5 * 2 * Math.PI }}
              animate={{
                strokeDashoffset:
                  15.5 * 2 * Math.PI * (1 - completionRate / 100),
              }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {completionRate}%
            </motion.span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {tasks.filter((t) => t.status === 'done').length} of {tasks.length}{' '}
          tasks
        </p>
      </div>

      {/* Status Distribution */}
      <div className="flex flex-col items-center rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          By Status
        </p>
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie
              data={statusData.filter((d) => d.value > 0)}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={40}
              paddingAngle={4}
              dataKey="value"
              animationBegin={200}
              animationDuration={800}
            >
              {statusData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                fontSize: '12px',
                padding: '4px 8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-1 flex gap-3 text-[10px] text-muted-foreground">
          {statusData.map((d) => (
            <span key={d.name} className="flex items-center gap-1">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[d.name] }}
              />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="flex flex-col items-center rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          By Priority
        </p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={priorityData}
            margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                fontSize: '12px',
                padding: '4px 8px',
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={800}>
              {priorityData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={PRIORITY_COLORS[entry.name]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
