import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Nav from '@/components/Nav';
import SeoHead from '@/components/SeoHead';
import VorvnFooter from '@/components/sections/VorvnFooter';
import VorvnNewsroomSidebar from '@/components/sections/VorvnNewsroomSidebar';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getAllArticles, formatDate, resolveAuthor } from '@/lib/newsroom';

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-x-16 xl:gap-x-24 gap-y-16">
          {/* Article list */}
          <section>
            {articles.length === 0 ? (
              <p className="py-10 font-sans text-[15px] text-mid border-t border-rule">
                {t('newsroom.empty')}
              </p>
            ) : (
              <ul className="border-t border-rule">
                {articles.map((a) => {
                  const author = resolveAuthor(a);
                  return (
                    <li key={a.slug} className="border-b border-rule">
                      <Link
                        to={`/${currentLang}/newsroom/${a.slug}`}
                        className="group block py-8 md:py-12 px-2 -mx-2 hover:bg-foreground/[0.02] transition-colors"
                      >
                        <div className="md:grid md:grid-cols-[180px_1fr] md:gap-x-10 lg:gap-x-14">
                          {/* Meta column */}
                          <div className="md:border-r md:border-rule md:pr-10 lg:pr-14 mb-4 md:mb-0 flex md:block items-center gap-3">
                            <div className="font-mono text-[11px] md:text-[12px] tracking-[0.08em] text-mid">
                              {formatDate(a.date)}
                            </div>
                            <span aria-hidden className="md:hidden text-mid">·</span>
                            <div className="font-mono text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-mid md:mt-2">
                              {t(`newsroom.types.${a.type}`)}
                            </div>
                          </div>

                          {/* Title + author */}
                          <div>
                            <h2 className="font-sans text-[22px] md:text-[28px] lg:text-[32px] leading-[1.2] font-medium tracking-[-0.015em] text-foreground group-hover:text-mid transition-colors">
                              {a.title}
                            </h2>
                            <div className="mt-4 font-mono text-[12px] tracking-[0.04em] text-mid">
                              {author.name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Sidebar */}
          <VorvnNewsroomSidebar lang={currentLang} />
        </div>
      </main>

      <VorvnFooter />
    </div>
  );
}
