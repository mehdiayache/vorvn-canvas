import { useNavigate } from 'react-router-dom';
import { LANGUAGES, RTL_LANGUAGES } from '@/i18n';

const STORAGE_KEY = 'i18nextLng';

const FULL_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  zh: '中文',
  es: 'Español',
  id: 'Bahasa Indonesia',
  ar: 'العربية',
};

interface LanguageSplashProps {
  onChoose?: (lang: string) => void;
}

export default function LanguageSplash({ onChoose }: LanguageSplashProps) {
  const navigate = useNavigate();

  const choose = (code: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore (private mode)
    }
    document.documentElement.lang = code;
    document.documentElement.dir = RTL_LANGUAGES.includes(code) ? 'rtl' : 'ltr';
    onChoose?.(code);
    navigate(`/${code}`, { replace: true });
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-[clamp(40px,8vw,140px)]"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your language"
    >
      <div className="w-full max-w-[720px] flex flex-col items-center text-center">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-mid mb-10">
          VORVN
        </p>

        <h1 className="font-display text-[clamp(28px,4vw,44px)] leading-[1.1] text-foreground mb-4">
          Choose your language
        </h1>

        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-mid mb-16">
          Sélectionnez · 选择 · Seleccionar · Pilih · اختر
        </p>

        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
          {LANGUAGES.map((lang) => (
            <li key={lang.code} className="bg-background">
              <button
                type="button"
                onClick={() => choose(lang.code)}
                className="w-full px-8 py-6 flex items-baseline justify-between gap-4 text-foreground hover:bg-mid/10 transition-colors duration-200 group"
                dir={RTL_LANGUAGES.includes(lang.code) ? 'rtl' : 'ltr'}
              >
                <span className="font-sans text-[17px] leading-[1.4]">
                  {FULL_NAMES[lang.code] ?? lang.label}
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-mid group-hover:text-foreground transition-colors duration-200">
                  {lang.code}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-mid mt-10">
          You can change this anytime from the header.
        </p>
      </div>
    </div>
  );
}
