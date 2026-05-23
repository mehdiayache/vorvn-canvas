// Newsroom — file-based content loader.
// Each article is a single JSON file under src/content/newsroom/ holding all
// 6 languages. Vite bundles them at build time via import.meta.glob (eager).

export type ArticleType = 'essay' | 'news' | 'collaboration';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] };

export interface ArticleTranslation {
  title: string;
  excerpt: string;
  body: Block[];
}

export interface Article {
  slug: string;
  date: string; // YYYY-MM-DD
  type: ArticleType;
  author?: string;
  translations: Record<string, ArticleTranslation>;
}

const modules = import.meta.glob<{ default: Article }>(
  '../content/newsroom/*.json',
  { eager: true },
);

const ALL: Article[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllArticles(): Article[] {
  return ALL;
}

export function getArticle(slug: string): Article | undefined {
  return ALL.find((a) => a.slug === slug);
}

export function translate(article: Article, lang: string): ArticleTranslation {
  return article.translations[lang] || article.translations.en;
}

export function getAdjacent(slug: string): { prev?: Article; next?: Article } {
  const i = ALL.findIndex((a) => a.slug === slug);
  if (i === -1) return {};
  return { next: ALL[i - 1], prev: ALL[i + 1] };
}

export function formatDate(iso: string): string {
  // YYYY.MM.DD — monospace-friendly, locale-neutral
  return iso.replace(/-/g, '.');
}
