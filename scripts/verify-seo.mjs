// Post-prerender verification.
// Asserts every prerendered HTML file has correct title, canonical, hreflang,
// and <html lang> for its language. Exits non-zero on failure so CI can catch
// regressions before deploy.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const BASE_URL = 'https://www.vorvn.com';
const LANGS = ['en', 'fr', 'es', 'zh', 'id', 'ar'];

let failed = 0;
const results = [];

function check(label, cond, detail = '') {
  if (cond) results.push({ ok: true, label });
  else {
    failed++;
    results.push({ ok: false, label, detail });
  }
}

function readOrFail(p) {
  if (!fs.existsSync(p)) {
    failed++;
    results.push({ ok: false, label: `file exists: ${p}` });
    return null;
  }
  return fs.readFileSync(p, 'utf8');
}

function checkPage({ file, lang, expectCanonical, dir, requireHreflang = true }) {
  const html = readOrFail(file);
  if (!html) return;
  const tag = `${path.relative(distDir, file)}`;

  check(`[${tag}] <html lang="${lang}">`, new RegExp(`<html[^>]*lang=["']${lang}["']`).test(html));
  check(`[${tag}] <html dir="${dir}">`, new RegExp(`<html[^>]*dir=["']${dir}["']`).test(html));
  check(`[${tag}] has <title>`, /<title>[^<]{5,}<\/title>/.test(html));
  check(`[${tag}] has description`, /<meta\s+name=["']description["']\s+content=["'][^"']{20,}["']/.test(html));
  check(
    `[${tag}] canonical = ${expectCanonical}`,
    new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${expectCanonical.replace(/[/.]/g, '\\$&')}["']`).test(html),
  );
  if (requireHreflang) {
    for (const l of LANGS) {
      check(`[${tag}] hreflang=${l}`, new RegExp(`hreflang=["']${l}["']`).test(html));
    }
    check(`[${tag}] hreflang=x-default`, /hreflang=["']x-default["']/.test(html));
  }
}

const langDirMap = { en: 'ltr', fr: 'ltr', es: 'ltr', zh: 'ltr', id: 'ltr', ar: 'rtl' };

for (const l of LANGS) {
  checkPage({
    file: path.join(distDir, l, 'index.html'),
    lang: l,
    dir: langDirMap[l],
    expectCanonical: `${BASE_URL}/${l}`,
  });
  checkPage({
    file: path.join(distDir, l, 'contact', 'index.html'),
    lang: l,
    dir: langDirMap[l],
    expectCanonical: `${BASE_URL}/${l}/contact`,
  });
}

// Legal pages: English only, no hreflang requirement
for (const slug of ['privacy', 'notice']) {
  checkPage({
    file: path.join(distDir, 'legal', slug, 'index.html'),
    lang: 'en',
    dir: 'ltr',
    expectCanonical: `${BASE_URL}/legal/${slug}`,
    requireHreflang: false,
  });
}

// Root index.html should also have full hreflang block
checkPage({
  file: path.join(distDir, 'index.html'),
  lang: 'en',
  dir: 'ltr',
  expectCanonical: `${BASE_URL}/en`,
});

const okCount = results.filter((r) => r.ok).length;
const failCount = results.filter((r) => !r.ok).length;

if (failCount === 0) {
  console.log(`[verify-seo] ✓ ${okCount} checks passed.`);
  process.exit(0);
} else {
  console.error(`[verify-seo] ✗ ${failCount} of ${results.length} checks failed:`);
  for (const r of results.filter((x) => !x.ok)) {
    console.error(`  - ${r.label}${r.detail ? ' — ' + r.detail : ''}`);
  }
  process.exit(1);
}
