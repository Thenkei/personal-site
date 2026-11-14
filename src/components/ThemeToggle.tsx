import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function explicitTheme(): Theme | null {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' ? t : null;
}

function effectiveTheme(): Theme {
  return explicitTheme() ?? (media().matches ? 'dark' : 'light');
}

/**
 * Follows the OS until the visitor picks a side; the choice is then persisted.
 * The pre-paint script in index.html applies a stored choice before React boots,
 * so there is no flash of the wrong theme.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(effectiveTheme);

  useEffect(() => {
    const mq = media();
    const sync = () => {
      if (!explicitTheme()) setTheme(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage: the choice just won't survive a reload.
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  );
}
