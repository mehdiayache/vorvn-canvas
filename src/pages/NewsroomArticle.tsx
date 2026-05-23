import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Nav from '@/components/Nav';
import SeoHead from '@/components/SeoHead';
import VorvnFooter from '@/components/sections/VorvnFooter';
import VorvnNewsroomBlock from '@/components/sections/VorvnNewsroomBlock';
import NotFound from '@/pages/NotFound';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getArticle, getAdjacent, translate, formatDate } from '@/lib/newsroom';

export default function NewsroomArticle() {
  const { t, i18n } = useTranslation();
  const { lang, slug } = useParams();
  const scrollRef = useScrollReveal();
  const currentLang = lang || i18n.language || 'en';

  const article = slug ? getArticle(slug) : undefined;
  if (!article) return <NotFound />;

  const tr = translate(article, currentLang);
  const { prev, next } = getAdjacent(article.slug);

  return (
    <div ref={scrollRef} className="min-h-screen flex flex-col bg-background">
      <SeoHead page="newsroom" pathSuffix={`/newsroom/${article.slug}`} />
      <Nav />

      <main
        className="flex-1 pt-32 pb-24"
        style={{ padding: '128px var(--gutter) 96px' }}
      >
        <div className="max-w-[68ch] mx-auto">
          <Link
            to={`/${currentLang}/newsroom`}
            className="inline-block font-mono text-[10px] tracking-[0.18em] uppercase text-mid hover:text-foreground transition-colors mb-10"
          >
            ← {t('newsroom.back')}
          </Link>

          <header className="mb-12 border-b border-rule pb-10">
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.18em] uppercase text-mid">
              <span>{t(`newsroom.types.${article.type}`)}</span>
              <span aria-hidden>·</span>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </div>
            <h1 className="font-sans text-[34px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-foreground">
              {tr.title}
            </h1>
            {article.author && (
              <div className="mt-6 font-mono text-[11px] tracking-[0.1em] uppercase text-mid">
                {t('newsroom.by')} {article.author}
              </div>
            )}
          </header>

          <article>
            <VorvnNewsroomBlock blocks={tr.body} />
          </article>

          {(prev || next) && (
            <nav
              aria-label={t('newsroom.adjacent')}
              className="mt-20 pt-10 border-t border-rule grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {prev ? (
                <Link
                  to={`/${currentLang}/newsroom/${prev.slug}`}
                  className="group block"
                >
                  <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-mid mb-2">
                    ← {t('newsroom.prev')}
                  </div>
                  <div className="font-sans text-[16px] text-foreground group-hover:text-mid transition-colors">
                    {translate(prev, currentLang).title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  to={`/${currentLang}/newsroom/${next.slug}`}
                  className="group block md:text-right"
                >
                  <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-mid mb-2">
                    {t('newsroom.next')} →
                  </div>
                  <div className="font-sans text-[16px] text-foreground group-hover:text-mid transition-colors">
                    {translate(next, currentLang).title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </main>

      <VorvnFooter />
    </div>
  );
}
