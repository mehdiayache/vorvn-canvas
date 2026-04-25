import { useNavigate } from 'react-router-dom';
import { LANGUAGES, RTL_LANGUAGES } from '@/i18n';

const STORAGE_KEY = 'i18nextLng';

const NATIVE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  zh: '中文',
  es: 'Español',
  id: 'Bahasa',
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
      <div className="w-full max-w-[640px] flex flex-col items-center text-center">
        <p className="font-display text-[clamp(40px,6vw,72px)] leading-none text-foreground mb-12 tracking-tight">
          VORVN
        </p>

        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground mb-10">
          Select language
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => choose(lang.code)}
                className="font-sans text-[15px] text-foreground hover:opacity-60 transition-opacity duration-200"
                dir={RTL_LANGUAGES.includes(lang.code) ? 'rtl' : 'ltr'}
              >
                {NATIVE_NAMES[lang.code] ?? lang.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
