import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-1 transition-colors duration-200 ${
            i18n.language === lang.code
              ? 'text-foreground'
              : 'text-mid hover:text-foreground'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
