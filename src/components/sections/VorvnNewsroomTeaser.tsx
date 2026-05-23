import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllArticles, formatDate } from '@/lib/newsroom';

export default function VorvnNewsroomTeaser() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const articles = getAllArticles(lang).slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="newsroom-teaser-title"
      className="border-t border-rule"
      style={{ padding: 'clamp(56px, 9vw, 96px) var(--gutter)' }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 mb-10 md:mb-14">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-mid mb-3">
            {t('newsroom.tag')}
          </div>
          <h2
            id="newsroom-teaser-title"
            className="font-sans text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.015em] text-foreground max-w-[18ch]"
          >
            {t('newsroom.headline')}
          </h2>
        </div>
        <Link
          to={`/${lang}/newsroom`}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-foreground hover:text-mid transition-colors self-start md:self-end"
        >
          {t('newsroom.viewAll')}
          <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
        </Link>
      </div>

      <ul className="border-t border-rule">
        {articles.map((a) => (
          <li key={a.slug} className="border-b border-rule">
            <Link
              to={`/${lang}/newsroom/${a.slug}`}
              className="group block py-5 md:py-6 px-2 -mx-2 hover:bg-foreground/[0.02] transition-colors md:grid md:grid-cols-[140px_160px_1fr_auto] md:gap-8 md:items-baseline"
            >
              <div className="flex items-center gap-3 mb-2 md:mb-0 md:contents">
                <span className="font-mono text-[11px] md:text-[12px] tracking-[0.08em] text-mid">
                  {formatDate(a.date)}
                </span>
                <span aria-hidden className="md:hidden text-mid">·</span>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-mid">
                  {t(`newsroom.types.${a.type}`)}
                </span>
              </div>
              <h3 className="font-sans text-[18px] md:text-[20px] leading-[1.3] font-medium tracking-[-0.005em] text-foreground group-hover:text-mid transition-colors">
                {a.title}
              </h3>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                aria-hidden
                className="hidden md:block text-mid group-hover:text-foreground transition-colors justify-self-end"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
