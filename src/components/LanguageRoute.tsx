import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, RTL_LANGUAGES } from '@/i18n';

const validCodes = LANGUAGES.map((l) => l.code);

export default function LanguageRoute({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  // Redirect invalid lang codes to /en
  if (!lang || !validCodes.includes(lang)) {
    return <Navigate to="/en" replace />;
  }

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
  }, [lang, i18n]);

  return <>{children}</>;
}
