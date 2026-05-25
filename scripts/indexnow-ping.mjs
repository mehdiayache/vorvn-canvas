// Pings IndexNow with every URL listed in public/sitemap.xml.
// Runs after the production build. Bing, Yandex, Seznam, Naver consume IndexNow.
// Google does NOT consume IndexNow today, but participating engines share signals.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HOST = 'vorvn.com';
const KEY = 'bdee05f035be42638aa336fd200fef04';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const sitemapPath = resolve('public/sitemap.xml');
  const xml = readFileSync(sitemapPath, 'utf8');
  const urlList = extractUrls(xml).filter((u) => u.includes(HOST));

  if (urlList.length === 0) {
    console.log('[indexnow] no URLs found in sitemap, skipping');
    return;
  }

  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    // 200 = ok, 202 = accepted/pending, 204 = ok no content
    console.log(`[indexnow] ${res.status} ${res.statusText} — submitted ${urlList.length} URLs`);
    if (res.status >= 400) {
      const text = await res.text();
      console.warn('[indexnow] response body:', text);
    }
  } catch (err) {
    // Never fail the build because of a third-party ping
    console.warn('[indexnow] ping failed (non-fatal):', err?.message || err);
  }
}

main();
