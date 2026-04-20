import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import VorvnFooter from '@/components/sections/VorvnFooter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionLink {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  description: string;
  slug: string;
  sections: SectionLink[];
  children: ReactNode;
}

/**
 * Shared layout for English-only legal pages. Mirrors the contact-page section
 * system (border-rule separators, gutter, dark theme) so legal pages feel native
 * to the brand instead of bolted-on.
 */
export default function LegalLayout({
  title,
  lastUpdated,
  description,
  slug,
  sections,
  children,
}: LegalLayoutProps) {
  const scrollRef = useScrollReveal();

  // Manual SEO head — legal pages are outside i18n, so SeoHead doesn't apply.
  useEffect(() => {
    const fullTitle = `${title} — VORVN`;
    document.title = fullTitle;
    document.documentElement.lang = 'en';

    const setMeta = (selector: string, attr: string, key: string, value: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!el) {
        el = document.createElement(selector.startsWith('link') ? 'link' : 'meta') as
          | HTMLMetaElement
          | HTMLLinkElement;
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      if (el instanceof HTMLLinkElement) el.href = value;
      else el.content = value;
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', `https://www.vorvn.com/legal/${slug}`);
    setMeta('link[rel="canonical"]', 'rel', 'canonical', `https://www.vorvn.com/legal/${slug}`);
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow');

    return () => {
      // Reset to default site title when navigating away.
      document.title = 'VORVN — Autonomous IP & Brand Holdings | Hong Kong · Bali';
    };
  }, [title, description, slug]);

  return (
    <div ref={scrollRef} className="min-h-screen bg-[hsl(var(--bg))]">
      <Nav />

      <main style={{ paddingTop: '88px' }}>
        {/* HEADER */}
        <section
          className="border-t border-rule"
          style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
            <div className="reveal">
              <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
                Legal
              </h2>
              <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mt-3">
                English only · Authoritative
              </div>
            </div>
            <div>
              <h1
                className="font-sans font-medium text-foreground reveal d1 m-0"
                style={{ fontSize: 'clamp(28px, 3.4vw, 56px)', lineHeight: 1.25 }}
              >
                {title}
              </h1>
              <p className="mt-6 font-mono text-[11px] tracking-[0.06em] text-mid reveal d2">
                Last updated: {lastUpdated}
              </p>
              <p
                className="mt-6 font-sans font-normal text-mid reveal d2 max-w-[640px]"
                style={{ fontSize: 'clamp(15px, 1.15vw, 18px)', lineHeight: 1.7 }}
              >
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section
          className="border-t border-rule"
          style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
            {/* TOC */}
            <aside className="reveal">
              <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-4">
                Contents
              </div>
              <nav className="space-y-2 lg:sticky lg:top-[120px]">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block font-sans text-[13px] text-mid hover:text-foreground transition-colors duration-200"
                  >
                    {s.label}
                  </a>
                ))}
                <div className="pt-6 mt-6 border-t border-rule space-y-2">
                  <Link
                    to="/legal/privacy"
                    className="block font-mono text-[10px] tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/legal/notice"
                    className="block font-mono text-[10px] tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200"
                  >
                    Legal Notice
                  </Link>
                </div>
              </nav>
            </aside>

            {/* Body */}
            <article className="legal-prose reveal d1 max-w-[760px]">{children}</article>
          </div>
        </section>
      </main>

      <VorvnFooter />
    </div>
  );
}
