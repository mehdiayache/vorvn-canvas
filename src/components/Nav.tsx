import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, X, Sun, Moon, Globe } from 'lucide-react';
import { LANGUAGES } from '@/i18n';

const SECTIONS = [
  { id: 'entity', key: 'entity.label' },
  { id: 'presence', key: 'presence.label' },
  { id: 'portfolio', key: 'portfolio.label' },
  { id: 'principles', key: 'principles.label' },
  { id: 'founder', key: 'founder.label' },
];

export default function Nav() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const switchLang = (code: string) => {
    i18n.changeLanguage(code);
    navigate(`/${code}`, { replace: true });
    setLangOpen(false);
    setMobileOpen(false);
  };

  const isDark = typeof document !== 'undefined'
    ? document.documentElement.dataset.theme !== 'light'
    : true;

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.add('switching');
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    setTimeout(() => html.classList.remove('switching'), 420);
  };

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[100] flex justify-between items-center py-5 bg-[hsl(var(--bg))] border-b border-rule" style={{ padding: '20px var(--gutter)' }}>
        <span className="font-brand text-[18px] tracking-[0.03em] text-foreground">VORVN</span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 md:gap-8">
          {/* Desktop language switcher */}
          <div className="flex items-center gap-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLang(l.code)}
                className={`font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-1 transition-colors duration-200 ${
                  i18n.language === l.code ? 'text-foreground' : 'text-mid hover:text-foreground'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid">
            {t('nav.tag')}
          </span>
          {/* Desktop theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 border border-dim rounded-[20px] py-[5px] px-3 ps-2 text-mid font-mono text-[8.5px] tracking-[0.14em] uppercase hover:border-mid hover:text-foreground transition-colors duration-200"
            aria-label="Toggle colour mode"
          >
            <div className="w-6 h-[14px] border border-dim rounded-[7px] relative">
              <div
                className="absolute w-2 h-2 rounded-full bg-mid top-1/2 start-[2px] -translate-y-1/2 transition-transform duration-300 [html[data-theme='light']_&]:translate-x-[10px] [html[data-theme='light']_&]:bg-foreground"
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
            </div>
            <span>{isDark ? t('nav.light') : t('nav.dark')}</span>
          </button>
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
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-[280px] bg-[hsl(var(--bg))] border-l border-rule flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-rule">
              <span className="font-brand text-[15px] tracking-[0.03em] text-foreground">VORVN</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="bg-transparent border-none p-0 text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable menu content */}
            <div className="flex-1 overflow-y-auto">
              {/* Primary actions */}
              <div className="px-5 pt-5 pb-3">
                <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-mid">
                  {t('nav.tag')}
                </span>
              </div>

              <a
                href="mailto:contact@vorvn.com"
                className="block px-5 py-3 font-sans text-[15px] font-semibold tracking-[0.01em] text-foreground hover:text-mid transition-colors duration-200"
              >
                {t('nav.contact')}
              </a>

              {/* Divider */}
              <div className="mx-5 my-2 border-t border-rule" />

              {/* Section links */}
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="w-full bg-transparent border-none text-left px-5 py-3 font-sans text-[14px] font-medium tracking-[0.01em] text-foreground hover:text-mid transition-colors duration-200"
                >
                  {t(s.key)}
                </button>
              ))}

              {/* Divider */}
              <div className="mx-5 my-2 border-t border-rule" />

              {/* Theme toggle as menu item */}
              <button
                onClick={toggleTheme}
                className="w-full bg-transparent border-none text-left px-5 py-3 flex items-center gap-3 font-sans text-[14px] font-medium text-foreground hover:text-mid transition-colors duration-200"
              >
                {isDark ? <Sun className="w-4 h-4 text-mid" /> : <Moon className="w-4 h-4 text-mid" />}
                {isDark ? t('nav.light') : t('nav.dark')}
              </button>

              {/* Language as expandable menu item */}
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-full bg-transparent border-none text-left px-5 py-3 flex items-center gap-3 font-sans text-[14px] font-medium text-foreground hover:text-mid transition-colors duration-200"
              >
                <Globe className="w-4 h-4 text-mid" />
                {currentLang?.label || 'EN'}
                <ChevronRight className={`w-3 h-3 ms-auto text-mid transition-transform duration-200 ${langOpen ? 'rotate-90' : ''}`} />
              </button>

              {langOpen && (
                <div className="ps-12 pe-5 pb-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => switchLang(l.code)}
                      className={`block w-full text-left py-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors duration-200 ${
                        i18n.language === l.code
                          ? 'text-foreground font-semibold'
                          : 'text-mid hover:text-foreground'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
