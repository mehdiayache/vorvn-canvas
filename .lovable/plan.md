

## What you're asking for vs. what this project is

Your spec assumes Next.js / Express / Netlify Functions. **This project is none of those.** It's a pure client-side React + Vite SPA deployed to Netlify as static files (`netlify.toml` → `publish = "dist"`, no `functions` directory, no Next.js, no Express). There is **zero** backend running today.

So "just add a Node endpoint" is not a one-line change — we have to introduce a backend. There are exactly two realistic ways to do that, and you've already declined one of them twice (Lovable Cloud / Supabase Edge Functions). Let me lay out the honest options so you can pick.

## The 3 real options

### Option A — Netlify Functions (matches your spec almost exactly)
Add `netlify/functions/contact.ts` with Nodemailer. Netlify auto-detects it on deploy, endpoint becomes `/.netlify/functions/contact`. Env vars (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CONTACT_TO_EMAIL`) are set in the Netlify dashboard by you.

- Pros: exactly your spec, Gmail SMTP + Nodemailer, no extra service, free tier covers this easily.
- Cons: **only runs on the deployed Netlify site.** It will NOT work in the Lovable preview (the preview is not Netlify). You'd test it after pushing to your Netlify deploy.
- Secret handling: you add the app password directly in Netlify dashboard. Lovable never sees it.

### Option B — Lovable Cloud Edge Function (works in preview AND production)
One Supabase Edge Function calling Gmail SMTP. You've declined this twice. The blocker isn't technical — it's that you don't want to enable Lovable Cloud. If you change your mind, this is the smoothest path because it works inside the Lovable preview too.

### Option C — A browser-safe form service (no backend, no app password)
Web3Forms / Formspree / Formspark. Drop-in `fetch` from the existing form, free tier, emails land in `hi@vorvn.com` and `m@mehdiayache.com`. Takes ~10 minutes. **Throws away your Gmail app password entirely** — which is actually a feature, since you already leaked it.

## My honest recommendation

Given (a) you've leaked the app password in chat, (b) you don't want Lovable Cloud, and (c) the project is static on Netlify — **Option A (Netlify Functions)** is the right fit for your spec. But understand: the form will appear non-functional inside the Lovable preview. Real testing happens on your live Netlify URL.

## Plan for Option A (if you confirm)

**Files added/changed**
- `netlify/functions/contact.ts` — new. Nodemailer + Gmail SMTP, Zod validation, honeypot, simple in-memory rate limit (per cold-start instance — good enough for low traffic), HTML escaping, proper status codes, no input echoed back.
- `netlify.toml` — add `[functions] node_bundler = "esbuild"` and a redirect `/api/contact → /.netlify/functions/contact` so the frontend can call a clean URL.
- `package.json` — add `nodemailer`, `zod`, `@types/nodemailer` (dev).
- `src/pages/Contact.tsx` — replace the placeholder `setTimeout` in `onSubmit` with a `fetch('/api/contact', { method: 'POST', body: JSON.stringify(values) })`. Add the hidden `website` honeypot input. Use existing success/error UI states.
- `src/i18n/locales/{en,fr,es,zh,id,ar}.json` — one new key `contact.errors.send` for the inline failure message.

**Endpoint contract**
- POST `/api/contact` with `{ name, email, company, topic, message, website }`
- Validates: required fields, email regex, name ≤ 200, message ≤ 5000, honeypot empty
- Rate limit: 5 req / 15 min per IP (in-memory, per-instance)
- Sends via `smtp.gmail.com:465` as `"VORVN Contact" <hi@vorvn.com>` to `hi@vorvn.com, m@mehdiayache.com`, `Reply-To` = visitor
- Returns `{ ok: true }` (200) or `{ error: "validation" | "rate_limited" | "server" }` (400/429/500) — never leaks SMTP details

**What you do**
1. **Revoke the leaked app password in Google Workspace right now** and generate a new one.
2. After I push the code, go to Netlify → Site settings → Environment variables and add:
   - `GMAIL_USER=hi@vorvn.com`
   - `GMAIL_APP_PASSWORD=<new 16-char password, no spaces>`
   - `CONTACT_TO_EMAIL=hi@vorvn.com,m@mehdiayache.com`
3. Trigger a Netlify deploy. Test on the live URL (not the Lovable preview).

**What stays untouched**
Design, fonts, layout, gutter, dark theme, i18n, routing, SEO, all section components.

## Confirm one of these to proceed

1. **Option A — Netlify Functions** (matches your spec, Gmail SMTP, only works on live Netlify deploy)
2. **Option B — Lovable Cloud Edge Function** (works in preview too, but requires enabling Lovable Cloud)
3. **Option C — Web3Forms / Formspree** (no backend, no app password, fastest)

