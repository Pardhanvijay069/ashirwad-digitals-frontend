import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '@/hooks/useDarkMode';
import { cn } from '@/utils/cn';

interface DarkModeToggleProps {
  className?: string;
}

export function DarkModeToggle({ className }: DarkModeToggleProps) {
  const { darkMode, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        'text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
        className
      )}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </button>
  );
}
