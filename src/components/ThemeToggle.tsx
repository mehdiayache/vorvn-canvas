import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
  const { t } = useTranslation();

  const toggle = useCallback(() => {
    const html = document.documentElement;
    html.classList.add('switching');
    const toLight = html.dataset.theme !== 'light';
    html.dataset.theme = toLight ? 'light' : 'dark';
    setTimeout(() => html.classList.remove('switching'), 420);
  }, []);

  const isDark = typeof document !== 'undefined' 
    ? document.documentElement.dataset.theme !== 'light' 
    : true;

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 border border-dim rounded-[20px] py-[5px] px-3 ps-2 text-mid font-mono text-[8.5px] tracking-[0.14em] uppercase hover:border-mid hover:text-foreground transition-colors duration-200"
      aria-label="Toggle colour mode"
    >
      <div className="w-6 h-[14px] border border-dim rounded-[7px] relative">
        <div className="absolute w-2 h-2 rounded-full bg-mid top-1/2 start-[2px] -translate-y-1/2 transition-transform duration-300 [html[data-theme='light']_&]:translate-x-[10px] [html[data-theme='light']_&]:bg-foreground"
          style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </div>
      <span>{isDark ? t('nav.light') : t('nav.dark')}</span>
    </button>
  );
}
