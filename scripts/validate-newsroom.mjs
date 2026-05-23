// Validates every JSON file in src/content/newsroom/ before build.
// Fails the build with clear messages if any article is malformed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'src', 'content', 'newsroom');
const publicDir = path.resolve(__dirname, '..', 'public');

const LANGS = ['en', 'fr', 'es', 'zh', 'id', 'ar'];
const TYPES = new Set(['essay', 'news', 'collaboration']);
const BLOCK_TYPES = new Set(['p', 'h2', 'h3', 'quote', 'list', 'image']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

if (!fs.existsSync(dir)) {
  console.log('[validate-newsroom] no newsroom dir, skipping.');
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const errors = [];

function checkPublicPath(p, label) {
  if (typeof p !== 'string' || !p.startsWith('/')) {
    errors.push(`${label}: path must start with "/" (got ${JSON.stringify(p)})`);
    return;
  }
  const fp = path.join(publicDir, p.replace(/^\//, ''));
  if (!fs.existsSync(fp)) {
    errors.push(`${label}: file not found in /public — expected ${fp}`);
  }
}

for (const file of files) {
  const fp = path.join(dir, file);
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${e.message}`);
    continue;
  }

  const { slug, date, updated, type, translations, author, cover } = doc;

  if (!slug || typeof slug !== 'string') errors.push(`${file}: missing "slug"`);
  if (!DATE_RE.test(date || '')) errors.push(`${file}: "date" must be YYYY-MM-DD`);
  if (updated !== undefined && !DATE_RE.test(updated)) {
    errors.push(`${file}: "updated" must be YYYY-MM-DD when present`);
  }
  if (!TYPES.has(type)) errors.push(`${file}: "type" must be one of ${[...TYPES].join(', ')}`);

  const expectedPrefix = `${date}-${slug}.json`;
  if (file !== expectedPrefix) {
    errors.push(`${file}: filename should be "${expectedPrefix}"`);
  }

  if (author !== undefined) {
    if (typeof author !== 'object' || author === null || Array.isArray(author)) {
      errors.push(`${file}: "author" must be an object { name?, title? }`);
    } else {
      if (author.name !== undefined && typeof author.name !== 'string') {
        errors.push(`${file}: "author.name" must be a string`);
      }
      if (author.title !== undefined && typeof author.title !== 'string') {
        errors.push(`${file}: "author.title" must be a string`);
      }
    }
  }

  if (cover !== undefined) checkPublicPath(cover, `${file}.cover`);

  if (!translations || typeof translations !== 'object') {
    errors.push(`${file}: missing "translations"`);
    continue;
  }

  for (const lang of LANGS) {
    const tr = translations[lang];
    if (!tr) {
      errors.push(`${file}: missing language "${lang}"`);
      continue;
    }
    if (!tr.title || typeof tr.title !== 'string') errors.push(`${file}[${lang}]: missing "title"`);
    if (!tr.excerpt || typeof tr.excerpt !== 'string') errors.push(`${file}[${lang}]: missing "excerpt"`);
    if (cover && (!tr.coverAlt || typeof tr.coverAlt !== 'string')) {
      errors.push(`${file}[${lang}]: "coverAlt" required when "cover" is set`);
    }
    if (!Array.isArray(tr.body) || tr.body.length === 0) {
      errors.push(`${file}[${lang}]: "body" must be non-empty array`);
      continue;
    }
    tr.body.forEach((b, i) => {
      if (!b || !BLOCK_TYPES.has(b.type)) {
        errors.push(`${file}[${lang}].body[${i}]: invalid block type "${b?.type}"`);
        return;
      }
      if (b.type === 'list') {
        if (!Array.isArray(b.items) || b.items.length === 0) {
          errors.push(`${file}[${lang}].body[${i}]: list needs "items"`);
        }
      } else if (b.type === 'image') {
        checkPublicPath(b.src, `${file}[${lang}].body[${i}].src`);
        if (!b.alt || typeof b.alt !== 'string') {
          errors.push(`${file}[${lang}].body[${i}]: image needs "alt"`);
        }
        if (b.caption !== undefined && typeof b.caption !== 'string') {
          errors.push(`${file}[${lang}].body[${i}]: image "caption" must be a string`);
        }
      } else if (b.type === 'quote') {
        if (!b.text || typeof b.text !== 'string') {
          errors.push(`${file}[${lang}].body[${i}]: missing "text"`);
        }
        if (b.attribution !== undefined && typeof b.attribution !== 'string') {
          errors.push(`${file}[${lang}].body[${i}]: quote "attribution" must be a string`);
        }
      } else if (!b.text || typeof b.text !== 'string') {
        errors.push(`${file}[${lang}].body[${i}]: missing "text"`);
      }
    });
  }
}

if (errors.length > 0) {
  console.error('[validate-newsroom] FAILED:');
  for (const e of errors) console.error('  •', e);
  process.exit(1);
}

console.log(`[validate-newsroom] OK — ${files.length} article(s) validated.`);
