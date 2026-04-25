import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LANGUAGES } from '@/i18n';
import LanguageSplash from './LanguageSplash';

const SUPPORTED = LANGUAGES.map((l) => l.code);
const STORAGE_KEY = 'i18nextLng';

function getStoredLanguage(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const base = stored.toLowerCase().split('-')[0];
    return SUPPORTED.includes(base) ? base : null;
  } catch {
    return null;
  }
}

export default function LanguageRedirect() {
  // Only the user's explicit prior choice triggers an automatic redirect.
  // First-time visitors see the splash picker — no silent browser-language redirect.
  const [stored] = useState<string | null>(() => getStoredLanguage());

  if (stored) {
    return <Navigate to={`/${stored}`} replace />;
  }

  return <LanguageSplash />;
}
