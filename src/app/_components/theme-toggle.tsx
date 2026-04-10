'use client';

import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="relative flex h-8 w-16 items-center rounded-full bg-gradient-to-r from-sky-100 to-amber-100 p-1 shadow-inner transition-colors duration-500 dark:from-indigo-950 dark:to-slate-900"
      suppressHydrationWarning
    >
      {/* Track decorations */}
      <AnimatePresence mode="wait">
        {mounted && isDark ? (
          <motion.span
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-start gap-1 pl-2.5"
          >
            <span className="size-0.5 rounded-full bg-white/60" />
            <span className="size-1 rounded-full bg-white/40" />
            <span className="size-0.5 rounded-full bg-white/50" />
          </motion.span>
        ) : mounted ? (
          <motion.span
            key="clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-end gap-0.5 pr-2.5"
          >
            <span className="size-1.5 rounded-full bg-white/70" />
            <span className="size-1 rounded-full bg-white/50" />
          </motion.span>
        ) : null}
      </AnimatePresence>

      {/* Sliding knob */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="relative z-10 flex size-6 items-center justify-center rounded-full bg-white shadow-md dark:bg-slate-800"
        style={{ marginLeft: mounted && isDark ? 'auto' : '0px' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mounted && isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-sm"
            >
              🌙
            </motion.span>
          ) : mounted ? (
            <motion.span
              key="sun"
              initial={{ rotate: 90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-sm"
            >
              ☀️
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
