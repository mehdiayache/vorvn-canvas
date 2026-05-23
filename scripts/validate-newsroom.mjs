// Validates every JSON file in src/content/newsroom/ before build.
// Fails the build with clear messages if any article is malformed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'src', 'content', 'newsroom');

const LANGS = ['en', 'fr', 'es', 'zh', 'id', 'ar'];
const TYPES = new Set(['essay', 'news', 'collaboration']);
const BLOCK_TYPES = new Set(['p', 'h2', 'h3', 'quote', 'list']);

if (!fs.existsSync(dir)) {
  console.log('[validate-newsroom] no newsroom dir, skipping.');
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const errors = [];

for (const file of files) {
  const fp = path.join(dir, file);
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${e.message}`);
    continue;
  }

  const { slug, date, type, translations } = doc;

  if (!slug || typeof slug !== 'string') errors.push(`${file}: missing "slug"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) errors.push(`${file}: "date" must be YYYY-MM-DD`);
  if (!TYPES.has(type)) errors.push(`${file}: "type" must be one of ${[...TYPES].join(', ')}`);

  // Filename must start with date and contain slug
  const expectedPrefix = `${date}-${slug}.json`;
  if (file !== expectedPrefix) {
    errors.push(`${file}: filename should be "${expectedPrefix}"`);
  }

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
