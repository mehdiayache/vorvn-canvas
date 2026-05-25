import type { Handler, HandlerEvent } from '@netlify/functions';
import { z } from 'zod';

// ---------- Validation ----------
const LANGS = ['en', 'fr', 'es', 'ar', 'id', 'zh'] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  consent: z.literal(true),
  lang: z.enum(LANGS).optional(),
  source: z.string().trim().max(80).optional(),
  // Honeypot, must be empty / absent
  website: z.string().max(0).optional().or(z.literal('')),
});

// ---------- Rate limit (in-memory, per cold-start instance) ----------
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const ipHits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (ipHits.get(ip) ?? []).filter((t) => t > cutoff);
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

// ---------- CORS ----------
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function json(status: number, body: Record<string, unknown>) {
  return { statusCode: status, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'method_not_allowed' });
  }

  const ip =
    (event.headers['x-nf-client-connection-ip'] as string | undefined) ??
    (event.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
    'unknown';
  if (rateLimited(ip)) return json(429, { error: 'rate_limited' });

  let payload: unknown;
  try {
    payload = JSON.parse(event.body ?? '{}');
  } catch {
    return json(400, { error: 'validation' });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return json(400, { error: 'validation' });

  // Honeypot: pretend success
  if (parsed.data.website && parsed.data.website.length > 0) {
    return json(200, { ok: true });
  }

  const N8N_NEWSLETTER_WEBHOOK_URL = process.env.N8N_NEWSLETTER_WEBHOOK_URL;
  const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;
  if (!N8N_NEWSLETTER_WEBHOOK_URL) {
    console.error('[newsletter] missing N8N_NEWSLETTER_WEBHOOK_URL');
    return json(500, { error: 'server' });
  }

  const { name, email, lang, source } = parsed.data;
  const userAgent = (event.headers['user-agent'] as string | undefined) ?? '';

  const forwardBody = {
    name,
    email,
    consent: true,
    lang: lang ?? 'en',
    source: source ?? 'newsroom-sidebar',
    submittedAt: new Date().toISOString(),
    ip,
    userAgent,
  };

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (N8N_WEBHOOK_SECRET) headers['Authorization'] = `Bearer ${N8N_WEBHOOK_SECRET}`;

    const res = await fetch(N8N_NEWSLETTER_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(forwardBody),
    });

    if (!res.ok) {
      console.error('[newsletter] webhook non-2xx', res.status);
      return json(502, { error: 'upstream' });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error('[newsletter] forward failed', err);
    return json(500, { error: 'server' });
  }
};
