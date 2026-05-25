// Newsroom — file-based content loader (v3).
// One JSON file per language per article. Filename: YYYY-MM-DD-{lang}-{id}.json
// English is the canonical fallback when a requested language is not present.

export type ArticleType = 'announcement' | 'deep-insight' | 'perspective';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface ArticleAuthor {
  name?: string;
  title?: string;
}

export interface Article {
  slug: string;
  lang: string;
  date: string;       // YYYY-MM-DD
  updated?: string;   // YYYY-MM-DD
  type: ArticleType;
  author?: ArticleAuthor;
  title: string;
  excerpt: string;
  body: Block[];
}

export const AUTHOR_FALLBACK = {
  name: 'Mehdi Ayache',
  title: 'CEO & Founder',
} as const;

export function resolveAuthor(article: Article): { name: string; title: string } {
  return {
    name: article.author?.name ?? AUTHOR_FALLBACK.name,
    title: article.author?.title ?? AUTHOR_FALLBACK.title,
  };
}

// Filename parser: YYYY-MM-DD-{lang}-{id}.json
const FILENAME_RE = /^(\d{4}-\d{2}-\d{2})-([a-z]{2})-([a-z0-9-]+)\.json$/;

const modules = import.meta.glob<{ default: Article }>(
  '../content/newsroom/*.json',
  { eager: true },
);

interface ArticleGroup {
  slug: string;
  date: string;
  byLang: Record<string, Article>;
}

const GROUPS: ArticleGroup[] = (() => {
  const map = new Map<string, ArticleGroup>();
  for (const [filePath, mod] of Object.entries(modules)) {
    const filename = filePath.split('/').pop() || '';
    const m = FILENAME_RE.exec(filename);
    if (!m) {
      // eslint-disable-next-line no-console
      console.warn(`[newsroom] ignoring file with bad name: ${filename}`);
      continue;
    }
    const article = mod.default;
    const key = `${article.date}__${article.slug}`;
    if (!map.has(key)) {
      map.set(key, { slug: article.slug, date: article.date, byLang: {} });
    }
    map.get(key)!.byLang[article.lang] = article;
  }
  return Array.from(map.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
})();

function pickArticle(group: ArticleGroup, lang: string): Article | undefined {
  return group.byLang[lang] || group.byLang.en;
}

/** All articles for a given language (one per slug), preferring requested lang else en. */
export function getAllArticles(lang: string = 'en'): Article[] {
  const out: Article[] = [];
  for (const g of GROUPS) {
    const a = pickArticle(g, lang);
    if (a) out.push(a);
  }
  return out;
}

/** Resolve one article. Returns the served article (in requested lang, else en). */
export function getArticle(slug: string, lang: string = 'en'): Article | undefined {
  const g = GROUPS.find((x) => x.slug === slug);
  if (!g) return undefined;
  return pickArticle(g, lang);
}

/** Languages that actually have a file for this slug. */
export function getAvailableLangs(slug: string): string[] {
  const g = GROUPS.find((x) => x.slug === slug);
  return g ? Object.keys(g.byLang) : [];
}

/** Previous/next within the global timeline, served in requested lang else en. */
export function getAdjacent(slug: string, lang: string = 'en'): { prev?: Article; next?: Article } {
  const i = GROUPS.findIndex((g) => g.slug === slug);
  if (i === -1) return {};
  return {
    next: GROUPS[i - 1] ? pickArticle(GROUPS[i - 1], lang) : undefined,
    prev: GROUPS[i + 1] ? pickArticle(GROUPS[i + 1], lang) : undefined,
  };
}

export function formatDate(iso: string): string {
  return iso.replace(/-/g, '.');
}

export function lastModified(article: Article): string {
  return article.updated || article.date;
}
