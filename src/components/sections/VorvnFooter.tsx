import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail, Newspaper } from 'lucide-react';


export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  return (
    <footer
      className="border-t border-rule grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start gap-8 lg:gap-6"
      style={{ padding: '44px var(--gutter) 52px' }}
    >
      {/* 1 — Brand */}
      <div>
        <div className="font-brand text-[14px] tracking-[0.04em] text-foreground">VORVN</div>
        <div className="font-mono text-[9px] tracking-[0.06em] text-mid mt-[10px] leading-[1.65]">
          {t('footer.legal', { year: new Date().getFullYear() }).split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>

      {/* 2 — Social */}
      <div>
        <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-3">
          Social
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="https://instagram.com/vorvn.company"
            target="_blank"
            rel="noopener"
            className="text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
          >
            {t('footer.instagram')}
          </a>
          <a
            href="https://linkedin.com/company/vorvn"
            target="_blank"
            rel="noopener"
            className="text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
          >
            {t('footer.linkedin')}
          </a>
        </div>
      </div>

      {/* 3 — Legal (English only) */}
      <div>
        <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-3">
          Legal
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to="/legal/privacy"
            className="text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            to="/legal/notice"
            className="text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
          >
            Legal Notice
          </Link>
        </div>
      </div>

      {/* 4 — Contact */}
      <div className="lg:text-right">
        <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-3">
          {t('nav.contact')}
        </div>
        <div className="flex flex-col gap-2 lg:items-end mb-4">
          <Link
            to={`/${lang}/contact`}
            className="inline-flex items-center gap-2 lg:flex-row-reverse text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
          >
            <Mail size={12} strokeWidth={1.5} aria-hidden />
            <span>{t('contact.writeUs')}</span>
          </Link>
          <Link
            to={`/${lang}/newsroom`}
            className="inline-flex items-center gap-2 lg:flex-row-reverse text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
          >
            <Newspaper size={12} strokeWidth={1.5} aria-hidden />
            <span>{t('nav.newsroom')}</span>
          </Link>
        </div>
        <div className="font-mono text-[9px] tracking-[0.14em] text-mid">{t('footer.geo')}</div>
      </div>

    </footer>
  );
}
