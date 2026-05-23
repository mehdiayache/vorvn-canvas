import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Nav from '@/components/Nav';
import SeoHead from '@/components/SeoHead';
import VorvnFooter from '@/components/sections/VorvnFooter';
import VorvnNewsroomBlock from '@/components/sections/VorvnNewsroomBlock';
import VorvnNewsroomSidebar from '@/components/sections/VorvnNewsroomSidebar';
import VorvnShareRow from '@/components/VorvnShareRow';
import NotFound from '@/pages/NotFound';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  getArticle,
  getAdjacent,
  getAvailableLangs,
  formatDate,
  resolveAuthor,
} from '@/lib/newsroom';

const BASE_URL = 'https://www.vorvn.com';

export default function NewsroomArticle() {
  const { t, i18n } = useTranslation();
  const { lang, slug } = useParams();
  const scrollRef = useScrollReveal();
  const currentLang = lang || i18n.language || 'en';

  const article = slug ? getArticle(slug, currentLang) : undefined;
  if (!article || !slug) return <NotFound />;

  const { prev, next } = getAdjacent(article.slug, currentLang);
  const author = resolveAuthor(article);
  const shareUrl = `${BASE_URL}/${currentLang}/newsroom/${article.slug}`;
  const availableLangs = getAvailableLangs(slug);

  return (
    <div ref={scrollRef} className="min-h-screen flex flex-col bg-background">
      <SeoHead
        page="newsroom"
        pathSuffix={`/newsroom/${article.slug}`}
        titleOverride={`${article.title} | VORVN`}
        descriptionOverride={article.excerpt}
        hreflangLangs={availableLangs}
        articleMeta={{
          publishedTime: article.date,
          modifiedTime: article.updated || article.date,
          authorName: author.name,
          section: article.type,
          servedLang: article.lang,
        }}
      />
      <Nav />

      <main
        className="flex-1 pt-32 pb-24"
        style={{ padding: '128px var(--gutter) 96px' }}
      >
        <div className="mx-auto max-w-[68ch] lg:max-w-[1080px] lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20 xl:max-w-[1180px] xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-24">
         <div className="min-w-0">
          <Link
            to={`/${currentLang}/newsroom`}
            className="inline-block font-mono text-[10px] tracking-[0.18em] uppercase text-mid hover:text-foreground transition-colors mb-10"
          >
            ← {t('newsroom.back')}
          </Link>

          <article>
            <header className="mb-12 border-b border-rule pb-10">
              <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.18em] uppercase text-mid">
                <span>{t(`newsroom.types.${article.type}`)}</span>
                <span aria-hidden>·</span>
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                {article.updated && article.updated !== article.date && (
                  <>
                    <span aria-hidden>·</span>
                    <span>
                      {t('newsroom.updated')}{' '}
                      <time dateTime={article.updated}>{formatDate(article.updated)}</time>
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-sans text-[34px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-foreground">
                {article.title}
              </h1>
              <p className="mt-6 font-mono text-[11px] tracking-[0.1em] uppercase text-mid">
                <span rel="author">
                  {t('newsroom.by')} {author.name}
                </span>
                <span aria-hidden> · </span>
                <span>{author.title}</span>
              </p>
            </header>

            <VorvnNewsroomBlock blocks={article.body} />

            <VorvnShareRow url={shareUrl} title={article.title} />
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
                    {prev.title}
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
                    {next.title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
         </div>
         <VorvnNewsroomSidebar lang={currentLang} />
        </div>
      </main>

      <VorvnFooter />
    </div>
  );
}
