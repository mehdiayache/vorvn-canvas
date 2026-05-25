## Newsletter Opt-in (Newsroom Sidebar)

Add a secure double opt-in newsletter block under the existing sidebar text. Frontend posts to a Netlify Function, which forwards to your n8n webhook (server-side only — webhook URL never exposed). Later you wire n8n → self-hosted Listmonk.

### Architecture

```
Sidebar form → POST /.netlify/functions/newsletter → n8n webhook → Listmonk
```

Reuses the exact security pattern from `netlify/functions/contact.ts`: Zod validation, honeypot, in-memory IP rate limit, CORS, sanitized error responses.

### New files

1. **`netlify/functions/newsletter.ts`**
   - Zod schema: `name` (2–100), `email` (valid, ≤255), `consent` (must be `true`), `lang` (enum of 6 locales), `website` honeypot (empty).
   - Rate limit: 3 submissions / 15 min per IP (stricter than contact).
   - Forwards JSON to `process.env.N8N_NEWSLETTER_WEBHOOK_URL` with optional `Authorization: Bearer ${N8N_WEBHOOK_SECRET}` header (shared secret you set in n8n).
   - Adds metadata: `source: "newsroom-sidebar"`, `ip`, `userAgent`, `submittedAt` ISO.
   - Returns `{ ok: true }` on 2xx from n8n; never leaks webhook URL or upstream errors.

2. **`src/components/sections/VorvnNewsletterOptin.tsx`**
   - Inline form: Name, Email, consent checkbox, submit button.
   - Honeypot `website` field (visually hidden).
   - Zod validation client-side (mirrors server), localized error messages.
   - States: `idle` → `submitting` → `sent` (success card, same minimal style as contact form).
   - Checkbox label: "I agree to receive emails from VORVN and have read the [Privacy Policy](/legal/privacy)." — link to existing English-only legal page.
   - Mentions double opt-in: "You'll receive a confirmation email to activate your subscription." (Listmonk handles the actual confirmation send.)

### Modified files

3. **`src/components/sections/VorvnNewsroomSidebar.tsx`**
   - Render `<VorvnNewsletterOptin lang={lang} />` below the existing paragraph, separated by a thin `1px` rule and small icon (Mail from lucide-react).

4. **`src/i18n/locales/{en,fr,es,ar,id,zh}.json`**
   - Add `newsroom.sidebar.newsletter.*` keys: eyebrow, intro, name placeholder, email placeholder, consent label (with `{{privacyLink}}` token), submit button, success title, success body, error messages.

### Secrets (you add later via Netlify env vars)

- `N8N_NEWSLETTER_WEBHOOK_URL` — full https URL of your n8n webhook node
- `N8N_WEBHOOK_SECRET` — random string you also set in n8n to validate the `Authorization` header

### Security checklist

- Webhook URL & secret server-side only (never bundled into frontend)
- Zod validation on both client and server
- Honeypot to block dumb bots
- IP rate limit (3 / 15 min)
- Mandatory consent checkbox (server rejects if `consent !== true`)
- Double opt-in enforced by Listmonk (n8n just forwards; Listmonk sends confirmation email)
- No PII logged on success path
- Generic error responses (no upstream leakage)

### Out of scope (for now)

- n8n workflow setup (you'll do that)
- Listmonk API call (n8n handles it later)
- Confirmation/landing page after Listmonk opt-in click (Listmonk has built-in templates)
