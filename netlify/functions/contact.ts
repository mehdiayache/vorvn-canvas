import type { Handler, HandlerEvent } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// ---------- Validation ----------
const TOPICS = ['investor', 'brand', 'press', 'careers', 'other'] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  topic: z.enum(TOPICS),
  message: z.string().trim().min(10).max(5000),
  // Honeypot — must be empty / absent
  website: z.string().max(0).optional().or(z.literal('')),
});

// ---------- Rate limit (in-memory, per cold-start instance) ----------
const RATE_LIMIT_MAX = 5;
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

// ---------- HTML escaping ----------
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

  // Rate limit by IP
  const ip =
    (event.headers['x-nf-client-connection-ip'] as string | undefined) ??
    (event.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
    'unknown';
  if (rateLimited(ip)) return json(429, { error: 'rate_limited' });

  // Parse + validate
  let payload: unknown;
  try {
    payload = JSON.parse(event.body ?? '{}');
  } catch {
    return json(400, { error: 'validation' });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return json(400, { error: 'validation' });

  // Honeypot: if non-empty, return 200 silently (don't send)
  if (parsed.data.website && parsed.data.website.length > 0) {
    return json(200, { ok: true });
  }

  const { name, email, company, topic, message } = parsed.data;

  // Env
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_TO_EMAIL) {
    console.error('[contact] missing env');
    return json(500, { error: 'server' });
  }

  // Build email
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : '—';
  const safeTopic = escapeHtml(topic);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  const subject = `[VORVN Contact · ${topic}] ${name}${company ? ' — ' + company : ''}`;

  const text =
    `New contact form submission\n\n` +
    `Topic:   ${topic}\n` +
    `Name:    ${name}\n` +
    `Email:   ${email}\n` +
    `Company: ${company || '—'}\n\n` +
    `Message:\n${message}\n`;

  const html = `<!doctype html><html><body style="font-family: -apple-system, Segoe UI, Inter, sans-serif; color:#111; line-height:1.55;">
  <h2 style="margin:0 0 16px;font-weight:600;">New contact form submission</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:4px 12px 4px 0;color:#666;">Topic</td><td>${safeTopic}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666;">Name</td><td>${safeName}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td>${safeEmail}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666;">Company</td><td>${safeCompany}</td></tr>
  </table>
  <h3 style="margin:24px 0 8px;font-weight:600;">Message</h3>
  <div style="white-space:normal;">${safeMessage}</div>
</body></html>`;

  // Send
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from: `"VORVN Contact" <${GMAIL_USER}>`,
      to: CONTACT_TO_EMAIL, // comma-separated supported
      replyTo: `${name} <${email}>`,
      subject,
      text,
      html,
    });

    return json(200, { ok: true });
  } catch (err) {
    console.error('[contact] send failed', err);
    return json(500, { error: 'server' });
  }
};
