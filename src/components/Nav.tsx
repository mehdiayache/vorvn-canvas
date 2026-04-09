import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Nav() {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] flex justify-between items-center py-5 bg-[hsl(var(--bg))] border-b border-rule" style={{ padding: '20px var(--gutter)' }}>
      <span className="font-brand text-[15px] tracking-[0.03em] text-foreground">VORVN</span>
      <div className="flex items-center gap-4 md:gap-8">
        <LanguageSwitcher />
        <span className="hidden md:inline font-mono text-[9px] tracking-[0.16em] uppercase text-mid">
          {t('nav.tag')}
        </span>
        <ThemeToggle />
        <a href="mailto:contact@vorvn.com" className="font-sans text-[11px] font-medium tracking-[0.1em] uppercase text-foreground hover:text-mid transition-colors duration-200">
          {t('nav.contact')}
        </a>
      </div>
    </nav>
  );
}
