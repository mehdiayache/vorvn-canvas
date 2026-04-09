import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const SECTIONS = [
  { id: 'entity', key: 'entity.label' },
  { id: 'presence', key: 'presence.label' },
  { id: 'portfolio', key: 'portfolio.label' },
  { id: 'principles', key: 'principles.label' },
  { id: 'founder', key: 'founder.label' },
];

export default function Nav() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[100] flex justify-between items-center py-5 bg-[hsl(var(--bg))] border-b border-rule" style={{ padding: '20px var(--gutter)' }}>
        <span className="font-brand text-[15px] tracking-[0.03em] text-foreground">VORVN</span>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 md:gap-8">
          <LanguageSwitcher />
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid">
            {t('nav.tag')}
          </span>
          <ThemeToggle />
          <a href="mailto:contact@vorvn.com" className="font-sans text-[11px] font-medium tracking-[0.1em] uppercase text-foreground hover:text-mid transition-colors duration-200">
            {t('nav.contact')}
          </a>
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex md:hidden items-center gap-1 bg-transparent border-none p-0 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground"
        >
          Menu <ChevronRight className="w-3 h-3" />
        </button>
      </nav>

      {/* Mobile side panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div
            className="absolute top-0 right-0 bottom-0 w-[280px] bg-[hsl(var(--bg))] border-l border-rule flex flex-col animate-slide-in-right"
          >
            {/* Close */}
            <div className="flex items-center justify-between p-5 border-b border-rule">
              <span className="font-brand text-[13px] tracking-[0.03em] text-foreground">VORVN</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="bg-transparent border-none p-0 text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section links */}
            <div className="flex-1 flex flex-col gap-0 py-4">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="bg-transparent border-none text-left px-5 py-3 font-sans text-[14px] font-medium tracking-[0.01em] text-foreground hover:text-mid transition-colors duration-200"
                >
                  {t(s.key)}
                </button>
              ))}
            </div>

            {/* Bottom controls */}
            <div className="border-t border-rule p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <a
                href="mailto:contact@vorvn.com"
                className="font-sans text-[11px] font-medium tracking-[0.1em] uppercase text-foreground hover:text-mid transition-colors duration-200"
              >
                {t('nav.contact')}
              </a>
              <span className="font-mono text-[8px] tracking-[0.16em] uppercase text-mid">
                {t('nav.tag')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
