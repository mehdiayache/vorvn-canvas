import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import id from './locales/id.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  zh: { translation: zh },
  es: { translation: es },
  id: { translation: id },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      // localStorage intentionally excluded from both `order` and `caches`:
      // the LanguageSplash component is the single source of truth for the
      // user's chosen language. It writes `i18nextLng` itself, and
      // LanguageRoute calls i18n.changeLanguage(lang) based on the URL.
      order: ['querystring', 'navigator'],
      lookupQuerystring: 'lang',
      caches: [],
    },
  });

export default i18n;

export const RTL_LANGUAGES = ['ar'];

export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'ES' },
  { code: 'id', label: 'ID' },
  { code: 'ar', label: 'عربي' },
];
