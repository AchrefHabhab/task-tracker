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
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.92 }}
      className="relative flex h-9 w-[4.5rem] items-center rounded-full p-1.5 shadow-inner transition-[background] duration-700 ease-in-out"
      style={{
        background: mounted && isDark
          ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #e0f2fe 0%, #fef3c7 100%)',
      }}
      suppressHydrationWarning
    >
      {/* Track decorations — stars or clouds */}
      <AnimatePresence mode="wait">
        {mounted && isDark ? (
          <motion.span
            key="stars"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 flex items-center justify-start gap-1.5 pl-3"
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="size-[3px] rounded-full bg-white/80"
            />
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
              className="size-[5px] rounded-full bg-white/60"
            />
            <motion.span
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
              className="size-[3px] rounded-full bg-white/50"
            />
          </motion.span>
        ) : mounted ? (
          <motion.span
            key="clouds"
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 flex items-center justify-end gap-1 pr-3"
          >
            <span className="size-2 rounded-full bg-white/60" />
            <span className="size-1.5 rounded-full bg-white/40" />
          </motion.span>
        ) : null}
      </AnimatePresence>

      {/* Sliding knob */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 170,
          damping: 22,
          mass: 1,
        }}
        className="relative z-10 flex size-6 items-center justify-center rounded-full shadow-lg"
        style={{
          marginLeft: mounted && isDark ? 'auto' : '0px',
          background: mounted && isDark ? '#1e293b' : '#ffffff',
          boxShadow: mounted && isDark
            ? '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mounted && isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -120, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 120, scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-sm leading-none"
            >
              🌙
            </motion.span>
          ) : mounted ? (
            <motion.span
              key="sun"
              initial={{ rotate: 120, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -120, scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-sm leading-none"
            >
              ☀️
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
