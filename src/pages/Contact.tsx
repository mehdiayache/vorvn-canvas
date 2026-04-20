import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import Nav from '@/components/Nav';
import SeoHead from '@/components/SeoHead';
import VorvnFooter from '@/components/sections/VorvnFooter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const TOPIC_KEYS = ['investor', 'brand', 'press', 'careers', 'other'] as const;
type TopicKey = (typeof TOPIC_KEYS)[number];

const OFFICES = [
  {
    badge: 'Holding Entity',
    city: 'Hong Kong',
    entity: 'VORVN LIMITED',
    address: 'RM4 16/F, Ho King Commercial Centre\n2–16 Fa Yuen Street, Mongkok\nKowloon, Hong Kong',
  },
  {
    badge: 'Incubator Studio',
    city: 'Bali, Indonesia',
    entity: 'ADUH (LAGI) STUDIO',
    address: 'Jl. Seroja No.28, Tonja\nKec. Denpasar Utara, Bali 80235',
  },
];

const PHONES = [
  { value: '+852 9290 0981', href: 'tel:+85292900981' },
  { value: '+1 218 417 4846', href: 'tel:+12184174846' },
];

export default function Contact() {
  const { t } = useTranslation();
  const scrollRef = useScrollReveal();

  const schema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(2, { message: t('contact.errors.name') })
          .max(100, { message: t('contact.errors.nameMax') }),
        email: z
          .string()
          .trim()
          .email({ message: t('contact.errors.email') })
          .max(255, { message: t('contact.errors.emailMax') }),
        company: z.string().trim().max(120).optional().or(z.literal('')),
        topic: z.enum(TOPIC_KEYS, {
          errorMap: () => ({ message: t('contact.errors.topic') }),
        }),
        message: z
          .string()
          .trim()
          .min(10, { message: t('contact.errors.messageMin') })
          .max(2000, { message: t('contact.errors.messageMax') }),
      }),
    [t],
  );

  const [values, setValues] = useState({
    name: '',
    email: '',
    company: '',
    topic: '' as TopicKey | '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');

  const update = (key: keyof typeof values, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setStatus('submitting');
    // SMTP wiring will be added once credentials are provided.
    await new Promise((r) => setTimeout(r, 600));
    setStatus('sent');
    setValues({ name: '', email: '', company: '', topic: '', message: '' });
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-[hsl(var(--bg))]">
      <SeoHead />
      <Nav />

      <main style={{ paddingTop: '120px' }}>
        {/* Header */}
        <section
          className="border-b border-rule grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12"
          style={{ padding: '40px var(--gutter) 64px' }}
        >
          <div className="lg:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-mid">
              {t('contact.label')}
            </span>
          </div>
          <div className="lg:col-span-8">
            <h1 className="font-sans font-medium text-[clamp(32px,4.6vw,56px)] leading-[1.05] tracking-[-0.015em] text-foreground whitespace-pre-line">
              {t('contact.headline')}
            </h1>
            <p className="font-sans text-[18px] leading-[1.55] text-mid mt-6 max-w-[60ch]">
              {t('contact.body')}
            </p>
          </div>
        </section>

        {/* Form + Offices */}
        <section
          className="border-b border-rule grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
          style={{ padding: '64px var(--gutter)' }}
        >
          {/* Left: Offices */}
          <aside className="lg:col-span-4 space-y-10">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-mid">
                {t('contact.offices')}
              </span>
            </div>
            {OFFICES.map((o) => (
              <div key={o.entity} className="space-y-3">
                <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-dim">
                  {o.badge}
                </div>
                <div className="font-sans font-semibold text-[18px] tracking-[-0.005em] text-foreground">
                  {o.city}
                </div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-mid">
                  {o.entity}
                </div>
                <address className="not-italic font-sans text-[15px] leading-[1.6] text-foreground/80 whitespace-pre-line">
                  {o.address}
                </address>
              </div>
            ))}

            {/* Phones — independent of offices */}
            <div className="pt-6 border-t border-rule space-y-3">
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-dim mb-2">
                {t('contact.phones')}
              </div>
              {PHONES.map((p) => (
                <a
                  key={p.value}
                  href={p.href}
                  className="block font-mono text-[13px] tracking-[0.04em] text-foreground hover:text-mid transition-colors duration-200"
                >
                  {p.value}
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-rule">
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-dim mb-2">
                {t('contact.directEmail')}
              </div>
              <a
                href="mailto:contact@vorvn.com"
                className="font-mono text-[13px] tracking-[0.04em] text-foreground hover:text-mid transition-colors duration-200"
              >
                contact@vorvn.com
              </a>
            </div>
          </aside>

          {/* Right: Form */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-mid">
                {t('contact.formLabel')}
              </span>
              <h2 className="font-sans font-semibold text-[clamp(22px,2.4vw,30px)] leading-[1.15] tracking-[-0.01em] text-foreground mt-3">
                {t('contact.formHeadline')}
              </h2>
            </div>

            {status === 'sent' ? (
              <div className="border border-rule p-10">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-mid mb-3">
                  {t('contact.success.tag')}
                </div>
                <div className="font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.01em] text-foreground mb-4">
                  {t('contact.success.title')}
                </div>
                <p className="font-sans text-[16px] leading-[1.55] text-mid max-w-[50ch]">
                  {t('contact.success.body')}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-8 inline-block font-mono text-[11px] tracking-[0.16em] uppercase text-foreground border-b border-foreground pb-[3px] hover:text-mid hover:border-mid transition-colors duration-200 bg-transparent"
                >
                  {t('contact.success.again')}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-8">
                {/* Topic — clearly a required selection */}
                <fieldset>
                  <legend className="block font-sans text-[14px] font-medium text-foreground mb-1">
                    {t('contact.fields.topic')} <span className="text-foreground">*</span>
                  </legend>
                  <p className="font-sans text-[13px] text-mid mb-4">
                    {t('contact.fields.topicHelp')}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2" role="radiogroup">
                    {TOPIC_KEYS.map((key) => {
                      const active = values.topic === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => update('topic', key)}
                          className={`flex items-center gap-3 text-left px-4 py-3 border font-sans text-[14px] tracking-[0.01em] transition-colors duration-200 ${
                            active
                              ? 'border-foreground text-foreground bg-foreground/5'
                              : 'border-rule text-mid hover:text-foreground hover:border-foreground/40'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`inline-block w-3 h-3 border ${
                              active ? 'border-foreground bg-foreground' : 'border-mid'
                            }`}
                          />
                          {t(`contact.topics.${key}`)}
                        </button>
                      );
                    })}
                  </div>
                  {errors.topic && (
                    <p className="font-sans text-[13px] text-destructive mt-3">
                      {errors.topic}
                    </p>
                  )}
                </fieldset>

                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field
                    id="name"
                    label={`${t('contact.fields.name')} *`}
                    value={values.name}
                    onChange={(v) => update('name', v)}
                    error={errors.name}
                    autoComplete="name"
                    placeholder={t('contact.fields.namePlaceholder')}
                  />
                  <Field
                    id="email"
                    type="email"
                    label={`${t('contact.fields.email')} *`}
                    value={values.email}
                    onChange={(v) => update('email', v)}
                    error={errors.email}
                    autoComplete="email"
                    placeholder={t('contact.fields.emailPlaceholder')}
                  />
                </div>

                {/* Company */}
                <Field
                  id="company"
                  label={t('contact.fields.company')}
                  value={values.company}
                  onChange={(v) => update('company', v)}
                  error={errors.company}
                  autoComplete="organization"
                  placeholder={t('contact.fields.companyPlaceholder')}
                />

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-sans text-[14px] font-medium text-foreground mb-3"
                  >
                    {t('contact.fields.message')} <span className="text-foreground">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder={t('contact.fields.messagePlaceholder')}
                    className={`w-full bg-transparent border px-4 py-3 font-sans text-[16px] leading-[1.55] text-foreground placeholder:text-dim focus:outline-none transition-colors duration-200 ${
                      errors.message
                        ? 'border-destructive focus:border-destructive'
                        : 'border-rule focus:border-foreground'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message ? (
                      <p className="font-mono text-[11px] tracking-[0.04em] text-destructive">
                        {errors.message}
                      </p>
                    ) : (
                      <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-dim">
                        {t('contact.fields.messageHint')}
                      </span>
                    )}
                    <span className="font-mono text-[10px] tracking-[0.1em] text-dim">
                      {values.message.length}/2000
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4 border-t border-rule">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="font-mono text-[12px] tracking-[0.18em] uppercase text-bg bg-foreground px-8 py-4 hover:bg-foreground/90 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ color: 'hsl(var(--bg))' }}
                  >
                    {status === 'submitting'
                      ? t('contact.submitting')
                      : t('contact.submit')}
                  </button>
                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-dim">
                    {t('contact.privacy')}
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <VorvnFooter />
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-sans text-[14px] font-medium text-foreground mb-3"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full bg-transparent border px-4 py-3 font-sans text-[16px] text-foreground placeholder:text-dim focus:outline-none transition-colors duration-200 ${
          error
            ? 'border-destructive focus:border-destructive'
            : 'border-rule focus:border-foreground'
        }`}
      />
      {error && (
        <p className="font-mono text-[11px] tracking-[0.04em] text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
