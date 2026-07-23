import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sun, Moon, Check, ChevronDown } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { LANGS, type Lang } from '@/i18n/dictionaries';
import { cn } from '@/components/ui';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-white/10 no-tap"
      >
        <Globe className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl glass-strong shadow-card z-50"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code as Lang);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/10',
                  lang === l.code && 'text-brand-600 dark:text-brand-400 font-semibold',
                )}
              >
                <span>{l.native}</span>
                {lang === l.code && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useApp();
  return (
    <button
      onClick={toggleTheme}
      className="grid place-items-center rounded-2xl p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 no-tap"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon className="h-5 w-5 text-slate-600" />
          </motion.div>
        ) : (
          <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun className="h-5 w-5 text-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
