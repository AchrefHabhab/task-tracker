'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBarInner(
  { value, onChange }: SearchBarProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-4">
      <motion.div
        animate={{
          scale: focused ? 1.01 : 1,
          boxShadow: focused
            ? '0 0 0 2px oklch(0.6 0.15 250 / 0.3)'
            : '0 0 0 0px oklch(0.6 0.15 250 / 0)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative rounded-xl"
      >
        <Search
          className={cn(
            'absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors duration-200',
            focused ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <input
          ref={ref}
          type="text"
          placeholder="🔍  Search tasks...  ⌘K"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex h-10 w-full rounded-xl border border-input bg-background pl-9 pr-9 text-sm transition-colors duration-200 placeholder:text-muted-foreground focus:outline-none"
        />
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onChange('')}
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export const SearchBar = forwardRef(SearchBarInner);
