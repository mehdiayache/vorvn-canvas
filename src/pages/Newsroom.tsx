import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Nav from '@/components/Nav';
import SeoHead from '@/components/SeoHead';
import VorvnFooter from '@/components/sections/VorvnFooter';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getAllArticles, formatDate } from '@/lib/newsroom';

export default function Newsroom() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const scrollRef = useScrollReveal();
  const currentLang = lang || i18n.language || 'en';
  const articles = getAllArticles(currentLang);

  return (
    <div ref={scrollRef} className="min-h-screen flex flex-col bg-background">
      <SeoHead page="newsroom" pathSuffix="/newsroom" />
      <Nav />

      <main
        className="flex-1 pt-32 pb-24"
        style={{ padding: '128px var(--gutter) 96px' }}
      >
        <header className="mb-16 md:mb-24">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-mid mb-4">
            {t('newsroom.tag')}
          </div>
          <h1 className="font-sans text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-foreground max-w-[18ch]">
            {t('newsroom.headline')}
          </h1>
          <p className="font-sans text-[17px] leading-[1.6] text-mid mt-6 max-w-[60ch]">
            {t('newsroom.intro')}
          </p>
        </header>

        <ul className="border-t border-rule">
          {articles.length === 0 && (
            <li className="py-10 font-sans text-[15px] text-mid">
              {t('newsroom.empty')}
            </li>
          )}
          {articles.map((a) => (
            <li key={a.slug} className="border-b border-rule">
              <Link
                to={`/${currentLang}/newsroom/${a.slug}`}
                className="group grid grid-cols-[110px_110px_1fr] md:grid-cols-[140px_160px_1fr] gap-4 md:gap-8 items-baseline py-6 md:py-8 hover:bg-foreground/[0.02] transition-colors px-2 -mx-2"
              >
                <span className="font-mono text-[11px] md:text-[12px] tracking-[0.08em] text-mid">
                  {formatDate(a.date)}
                </span>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-mid">
                  {t(`newsroom.types.${a.type}`)}
                </span>
                <span className="font-sans text-[17px] md:text-[22px] font-medium tracking-[-0.005em] text-foreground group-hover:text-mid transition-colors">
                  {a.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <VorvnFooter />
    </div>
  );
}
