import { Navigate } from 'react-router-dom';
import { LANGUAGES } from '@/i18n';

const SUPPORTED = LANGUAGES.map((l) => l.code);
const FALLBACK = 'en';

function detectLanguage(): string {
  // 1. Explicit prior choice from the language switcher
  try {
    const stored = localStorage.getItem('i18nextLng');
    if (stored) {
      const base = stored.toLowerCase().split('-')[0];
      if (SUPPORTED.includes(base)) return base;
    }
  } catch {
    // localStorage may be unavailable (SSR, privacy mode) — ignore
  }

  // 2. Browser preference list (ranked)
  const candidates =
    typeof navigator !== 'undefined'
      ? navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language]
      : [];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const base = candidate.toLowerCase().split('-')[0];
    if (SUPPORTED.includes(base)) return base;
  }

  // 3. Ultimate fallback
  return FALLBACK;
}

export default function LanguageRedirect() {
  const lang = detectLanguage();
  return <Navigate to={`/${lang}`} replace />;
}
