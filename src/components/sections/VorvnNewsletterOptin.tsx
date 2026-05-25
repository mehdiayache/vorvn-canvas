import { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { z } from 'zod';
import { Mail } from 'lucide-react';

interface Props {
  lang: string;
}

export default function VorvnNewsletterOptin({ lang }: Props) {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(2, { message: t('newsroom.sidebar.newsletter.errors.name') })
          .max(100, { message: t('newsroom.sidebar.newsletter.errors.name') }),
        email: z
          .string()
          .trim()
          .email({ message: t('newsroom.sidebar.newsletter.errors.email') })
          .max(255, { message: t('newsroom.sidebar.newsletter.errors.email') }),
        consent: z.literal(true, {
          errorMap: () => ({ message: t('newsroom.sidebar.newsletter.errors.consent') }),
        }),
      }),
    [t],
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [sendError, setSendError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSendError('');
    const result = schema.safeParse({ name, email, consent });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('submitting');
    try {
      const res = await fetch('/.netlify/functions/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          consent: true,
          lang,
          source: 'newsroom-sidebar',
          website,
        }),
      });
      if (!res.ok) {
        if (res.status === 429) setSendError(t('newsroom.sidebar.newsletter.errors.rate'));
        else setSendError(t('newsroom.sidebar.newsletter.errors.server'));
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setSendError(t('newsroom.sidebar.newsletter.errors.server'));
      setStatus('idle');
    }
  }

  const eyebrow = t('newsroom.sidebar.newsletter.eyebrow');

  return (
    <div className="mt-10 pt-10 border-t border-rule">
      <Mail className="w-5 h-5 text-mid mb-5" strokeWidth={1.25} aria-hidden />
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-mid mb-4">
        {eyebrow}
      </div>

      {status === 'sent' ? (
        <div role="status" aria-live="polite">
          <p className="font-sans text-[15px] leading-[1.55] text-foreground m-0">
            {t('newsroom.sidebar.newsletter.success.title')}
          </p>
          <p className="font-sans text-[13px] leading-[1.6] text-mid mt-3 m-0">
            {t('newsroom.sidebar.newsletter.success.body')}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <p className="font-sans text-[14px] leading-[1.6] text-foreground/85 m-0 mb-2">
            {t('newsroom.sidebar.newsletter.intro')}
          </p>

          {/* Honeypot */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            <label htmlFor="nl-website">Website</label>
            <input
              id="nl-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="nl-name" className="sr-only">
              {t('newsroom.sidebar.newsletter.name')}
            </label>
            <input
              id="nl-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('newsroom.sidebar.newsletter.name')}
              className="w-full bg-transparent border-0 border-b border-rule px-0 py-2 text-[14px] text-foreground placeholder:text-mid focus:outline-none focus:border-foreground"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/80">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="nl-email" className="sr-only">
              {t('newsroom.sidebar.newsletter.email')}
            </label>
            <input
              id="nl-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsroom.sidebar.newsletter.email')}
              className="w-full bg-transparent border-0 border-b border-rule px-0 py-2 text-[14px] text-foreground placeholder:text-mid focus:outline-none focus:border-foreground"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/80">
                {errors.email}
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none pt-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-[3px] w-[14px] h-[14px] accent-foreground shrink-0"
              aria-invalid={!!errors.consent}
            />
            <span className="font-sans text-[12px] leading-[1.55] text-mid">
              <Trans
                i18nKey="newsroom.sidebar.newsletter.consent"
                components={{
                  privacy: (
                    <a
                      href="/legal/privacy"
                      className="underline underline-offset-2 text-foreground/85 hover:text-foreground"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              />
            </span>
          </label>
          {errors.consent && (
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/80">
              {errors.consent}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-3 inline-flex items-center gap-2 border border-foreground px-5 py-2 font-mono text-[10px] tracking-[0.18em] uppercase text-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting'
              ? t('newsroom.sidebar.newsletter.submitting')
              : t('newsroom.sidebar.newsletter.submit')}
          </button>

          {sendError && (
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/80">
              {sendError}
            </p>
          )}

          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-mid pt-2">
            {t('newsroom.sidebar.newsletter.doubleOptin')}
          </p>
        </form>
      )}
    </div>
  );
}
