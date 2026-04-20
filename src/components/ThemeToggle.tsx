import { useEffect, useState } from 'react';

/**
 * ThemeToggle — minimal dot/half-moon switch.
 * - Tiny circle that fills/empties on theme change.
 * - No label, no chrome. Lives quietly in the nav.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme !== 'light');
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    html.classList.add('switching');
    const nextDark = html.dataset.theme === 'light';
    html.dataset.theme = nextDark ? 'dark' : 'light';
    setIsDark(nextDark);
    try {
      localStorage.setItem('vorvn-theme', nextDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
    setTimeout(() => html.classList.remove('switching'), 420);
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="group relative w-[14px] h-[14px] rounded-full border border-mid hover:border-foreground transition-colors duration-200"
    >
      {/* Half-fill that flips on theme */}
      <span
        className="absolute inset-[2px] rounded-full bg-foreground transition-transform duration-300"
        style={{
          transformOrigin: 'center',
          transform: isDark ? 'scale(0.35)' : 'scale(1)',
        }}
      />
    </button>
  );
}
