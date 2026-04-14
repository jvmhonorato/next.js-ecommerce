import { useEffect, useState } from 'react';
import { FaMoon } from 'react-icons/fa';
import { useTheme } from 'next-themes'
import { BsSunFill } from 'react-icons/bs';

const ThemeToogle = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <div className="h-8 w-16 rounded-full border border-slate-300 bg-slate-200" />
    );
  }

  return (
    <button
      type="button"
      aria-label="Alternar tema"
      onClick={toggleTheme}
      className="relative flex h-8 w-16 items-center rounded-full border border-slate-300 bg-slate-200 px-1 transition dark:border-slate-600 dark:bg-slate-700"
    >
      <FaMoon className="text-slate-700 dark:text-slate-200" size={14} />
      <BsSunFill className="ml-auto text-amber-500" size={14} />
      <span
        className={`absolute h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-slate-900 ${
          isDark ? 'translate-x-0' : 'translate-x-8'
        }`}
      />
    </button>
  );
};

export default ThemeToogle;
