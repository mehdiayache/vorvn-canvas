// Validates every JSON file in src/content/newsroom/ before build.
// v3: one file per language. Filename: YYYY-MM-DD-{lang}-{id}.json
// Requires an `en` file for every article group. Other languages optional.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'src', 'content', 'newsroom');
const publicDir = path.resolve(__dirname, '..', 'public');

const LANGS = new Set(['en', 'fr', 'es', 'zh', 'id', 'ar']);
const TYPES = new Set(['essay', 'news', 'collaboration', 'analysis']);
const BLOCK_TYPES = new Set(['p', 'h2', 'h3', 'quote', 'list', 'image']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const FILENAME_RE = /^(\d{4}-\d{2}-\d{2})-([a-z]{2})-([a-z0-9-]+)\.json$/;

if (!fs.existsSync(dir)) {
  console.log('[validate-newsroom] no newsroom dir, skipping.');
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const errors = [];
const warnings = [];
const groups = new Map(); // key: `${date}__${slug}` -> { langs: Set, canonical: doc }

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
  const m = FILENAME_RE.exec(file);
  if (!m) {
    errors.push(`${file}: filename must match YYYY-MM-DD-{lang}-{id}.json (lowercase, kebab id)`);
    continue;
  }
  const [, fnDate, fnLang, fnId] = m;
  if (!LANGS.has(fnLang)) {
    errors.push(`${file}: filename lang "${fnLang}" not in ${[...LANGS].join(', ')}`);
    continue;
  }

  const fp = path.join(dir, file);
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${e.message}`);
    continue;
  }

  const { slug, lang, date, updated, type, author, title, excerpt, body } = doc;

  if (slug !== fnId) errors.push(`${file}: "slug" must equal filename id "${fnId}" (got ${JSON.stringify(slug)})`);
  if (lang !== fnLang) errors.push(`${file}: "lang" must equal filename lang "${fnLang}" (got ${JSON.stringify(lang)})`);
  if (date !== fnDate) errors.push(`${file}: "date" must equal filename date "${fnDate}" (got ${JSON.stringify(date)})`);
  if (!DATE_RE.test(date || '')) errors.push(`${file}: "date" must be YYYY-MM-DD`);
  if (updated !== undefined && !DATE_RE.test(updated)) {
    errors.push(`${file}: "updated" must be YYYY-MM-DD when present`);
  }
  if (!TYPES.has(type)) errors.push(`${file}: "type" must be one of ${[...TYPES].join(', ')}`);

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

  if (!title || typeof title !== 'string') errors.push(`${file}: missing "title"`);
  if (!excerpt || typeof excerpt !== 'string') errors.push(`${file}: missing "excerpt"`);
  if (typeof title === 'string' && title.length > 60) warnings.push(`${file}: "title" is ${title.length} chars (>60 — Google may truncate)`);
  if (typeof excerpt === 'string' && excerpt.length > 160) warnings.push(`${file}: "excerpt" is ${excerpt.length} chars (>160 — meta description may truncate)`);

  if (!Array.isArray(body) || body.length === 0) {
    errors.push(`${file}: "body" must be non-empty array`);
  } else {
    body.forEach((b, i) => {
      if (!b || !BLOCK_TYPES.has(b.type)) {
        errors.push(`${file}.body[${i}]: invalid block type "${b?.type}"`);
        return;
      }
      if (b.type === 'list') {
        if (!Array.isArray(b.items) || b.items.length === 0) {
          errors.push(`${file}.body[${i}]: list needs "items"`);
        }
      } else if (b.type === 'image') {
        checkPublicPath(b.src, `${file}.body[${i}].src`);
        if (!b.alt || typeof b.alt !== 'string') {
          errors.push(`${file}.body[${i}]: image needs "alt"`);
        }
        if (b.caption !== undefined && typeof b.caption !== 'string') {
          errors.push(`${file}.body[${i}]: image "caption" must be a string`);
        }
      } else if (b.type === 'quote') {
        if (!b.text || typeof b.text !== 'string') {
          errors.push(`${file}.body[${i}]: missing "text"`);
        }
        if (b.attribution !== undefined && typeof b.attribution !== 'string') {
          errors.push(`${file}.body[${i}]: quote "attribution" must be a string`);
        }
      } else if (!b.text || typeof b.text !== 'string') {
        errors.push(`${file}.body[${i}]: missing "text"`);
      }
    });
  }

  // Group tracking
  const key = `${fnDate}__${fnId}`;
  if (!groups.has(key)) groups.set(key, { langs: new Map(), canonical: null });
  const g = groups.get(key);
  g.langs.set(fnLang, doc);
  if (fnLang === 'en') g.canonical = doc;
}

// Cross-file checks: every group must have an `en` file; shared fields must agree.
for (const [key, g] of groups) {
  if (!g.langs.has('en')) {
    errors.push(`group "${key}": missing required English file (YYYY-MM-DD-en-{id}.json)`);
    continue;
  }
  const en = g.canonical;
  for (const [lang, doc] of g.langs) {
    if (lang === 'en') continue;
    for (const field of ['date', 'type', 'updated']) {
      if (JSON.stringify(doc[field]) !== JSON.stringify(en[field])) {
        errors.push(`group "${key}" [${lang}]: "${field}" must match en file`);
      }
    }
    const aName = doc.author?.name ?? null;
    const eName = en.author?.name ?? null;
    if (aName !== eName) {
      errors.push(`group "${key}" [${lang}]: "author.name" must match en file`);
    }
  }
}

if (warnings.length > 0) {
  console.warn('[validate-newsroom] warnings:');
  for (const w of warnings) console.warn('  •', w);
}

if (errors.length > 0) {
  console.error('[validate-newsroom] FAILED:');
  for (const e of errors) console.error('  •', e);
  process.exit(1);
}

console.log(`[validate-newsroom] OK — ${files.length} file(s), ${groups.size} article(s) validated.`);
