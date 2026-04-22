import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { toast } from 'sonner';
import Nav from '@/components/Nav';
import SeoHead from '@/components/SeoHead';
import VorvnFooter from '@/components/sections/VorvnFooter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const TOPIC_KEYS = ['investor', 'brand', 'press', 'careers', 'other'] as const;
type TopicKey = (typeof TOPIC_KEYS)[number];

const OFFICES = [
  {
    region: 'Holding Entity',
    city: 'Hong Kong',
    entity: 'VORVN LIMITED',
    address: 'RM4 16/F, Ho King Commercial Centre\n2–16 Fa Yuen Street, Mongkok\nKowloon, Hong Kong',
    badge: 'Headquarters',
  },
  {
    region: 'Incubator Studio',
    city: 'Bali, Indonesia',
    entity: 'ADUH (LAGI) STUDIO',
    address: 'Jl. Seroja No.28, Tonja\nKec. Denpasar Utara, Bali 80235',
    badge: 'Operations',
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
  const [sendError, setSendError] = useState<string>('');
  const [website, setWebsite] = useState(''); // honeypot
  const [sentAt, setSentAt] = useState<Date | null>(null);

  const formatReceipt = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
  };

  const update = (key: keyof typeof values, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');
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
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, website }),
      });
      if (!res.ok) {
        setStatus('idle');
        setSendError(t('contact.errors.send'));
        return;
      }
      const receiptTime = new Date();
      setSentAt(receiptTime);
      setStatus('sent');
      setValues({ name: '', email: '', company: '', topic: '', message: '' });
      setWebsite('');
      toast(t('contact.success.title'), {
        description: t('contact.success.body'),
        duration: 6000,
      });
    } catch {
      setStatus('idle');
      setSendError(t('contact.errors.send'));
    }
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-[hsl(var(--bg))]">
      <SeoHead page="contact" pathSuffix="/contact" />
      <Nav />

      <main style={{ paddingTop: '88px' }}>
        {/* HEADER — no top border; the fixed Nav's bottom border already provides the rule */}
        <section
          style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
            <div className="reveal">
              <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
                {t('contact.label')}
              </h2>
            </div>
            <div>
              <h1
                className="font-sans font-medium text-foreground reveal d1 whitespace-pre-line m-0"
                style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.35 }}
              >
                {t('contact.headline')}
              </h1>
              <p
                className="mt-8 font-sans font-normal text-mid reveal d2 max-w-[640px]"
                style={{ fontSize: 'clamp(15px, 1.15vw, 18px)', lineHeight: 1.7 }}
              >
                {t('contact.body')}
              </p>
            </div>
          </div>
        </section>

        {/* OFFICES */}
        <section
          className="border-t border-rule"
          style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
            <div className="reveal">
              <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
                {t('contact.offices')}
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {OFFICES.map((o, i) => (
                  <div key={o.entity} className={`reveal d${i + 1}`}>
                    <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-4">
                      {o.region}
                    </div>
                    <h3
                      className="font-sans font-medium tracking-[-0.02em] mb-[10px] m-0"
                      style={{ fontSize: 'clamp(18px, 1.9vw, 26px)' }}
                    >
                      {o.city}
                    </h3>
                    <div className="font-mono text-[9px] tracking-[0.1em] text-mid mb-[18px]">
                      {o.entity}
                    </div>
                    <address className="not-italic font-sans text-[13px] font-normal leading-[1.78] text-mid">
                      {o.address.split('\n').map((line, j) => (
                        <span key={j}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </address>
                    <span className="r-pill inline-block mt-6 font-mono text-[8px] tracking-[0.16em] uppercase text-mid border border-rule py-[5px] px-[11px]">
                      {o.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Phones + Email */}
              <div className="mt-16 pt-10 border-t border-rule grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 reveal d3">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-4">
                    {t('contact.phones')}
                  </div>
                  <div className="space-y-2">
                    {PHONES.map((p) => (
                      <a
                        key={p.value}
                        href={p.href}
                        className="block font-sans text-[18px] font-medium text-foreground hover:text-mid transition-colors duration-200"
                      >
                        {p.value}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-4">
                    {t('contact.directLabel')}
                  </div>
                  <a
                    href="#form"
                    className="font-sans text-[18px] font-medium text-foreground hover:text-mid transition-colors duration-200"
                  >
                    {t('contact.writeUs')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section
          id="form"
          className="border-t border-rule"
          style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)', scrollMarginTop: '88px' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
            <div className="reveal">
              <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
                {t('contact.formLabel')}
              </h2>
            </div>
            <div>
              <h3
                className="font-sans font-medium text-foreground reveal d1 m-0"
                style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.35 }}
              >
                {t('contact.formHeadline')}
              </h3>

              {status === 'sent' ? (
                <div
                  className="r-card mt-12 border border-foreground p-10 md:p-12 relative"
                  style={{ animation: 'fadeUpIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <span
                      className="r-pill inline-block w-[8px] h-[8px] bg-foreground"
                      style={{ animation: 'dotPulse 2s ease-in-out infinite' }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground">
                      {t('contact.success.tag')}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-mid">
                      · {sentAt ? formatReceipt(sentAt) : ''}
                    </span>
                  </div>
                  <p
                    className="font-sans font-medium text-foreground tracking-[-0.01em] m-0"
                    style={{ fontSize: 'clamp(26px, 3vw, 40px)', lineHeight: 1.2 }}
                  >
                    {t('contact.success.title')}
                  </p>
                  <p
                    className="mt-6 font-sans font-normal text-mid max-w-[560px]"
                    style={{ fontSize: 'clamp(15px, 1.15vw, 18px)', lineHeight: 1.7 }}
                  >
                    {t('contact.success.body')}
                  </p>
                  <div className="mt-10 pt-8 border-t border-foreground flex flex-col sm:flex-row sm:items-center gap-6">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setSentAt(null);
                      }}
                      className="arrow-link text-[15px]"
                    >
                      {t('contact.success.again')}
                    </button>
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground">
                      {t('contact.success.tag')} · Reply window 48h
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="mt-12 space-y-10 reveal d2">
                  {/* Honeypot — hidden from users, bots fill it */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  {/* Topic */}
                  <fieldset>
                    <legend className="font-sans text-[15px] font-medium text-foreground">
                      {t('contact.fields.topic')} <span className="text-foreground">*</span>
                    </legend>
                    <p
                      className="font-sans font-normal text-mid mt-2 mb-5"
                      style={{ fontSize: '15px', lineHeight: 1.6 }}
                    >
                      {t('contact.fields.topicHelp')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" role="radiogroup">
                      {TOPIC_KEYS.map((key) => {
                        const active = values.topic === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => update('topic', key)}
                            className={`r-pill flex items-center gap-3 text-left px-5 py-3 border border-foreground font-sans text-[14px] transition-all duration-200 ${
                              active
                                ? 'bg-foreground text-background'
                                : 'bg-transparent text-foreground hover:bg-foreground hover:text-background'
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`r-pill inline-block w-2.5 h-2.5 border shrink-0 ${
                                active
                                  ? 'border-background bg-background'
                                  : 'border-foreground bg-transparent group-hover:border-background'
                              }`}
                            />
                            {t(`contact.topics.${key}`)}
                          </button>
                        );
                      })}
                    </div>
                    {errors.topic && (
                      <p className="font-mono text-[12px] tracking-[0.06em] text-foreground mt-3">
                        <span className="text-mid">ERR ·</span> {errors.topic}
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
                      className="block font-sans text-[15px] font-medium text-foreground mb-3"
                    >
                      {t('contact.fields.message')} <span className="text-foreground">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={values.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder={t('contact.fields.messagePlaceholder')}
                      className={`r-input w-full bg-transparent border px-5 py-4 font-sans text-[16px] leading-[1.6] text-foreground placeholder:text-foreground placeholder:opacity-40 focus:outline-none transition-colors duration-200 ${
                        errors.message
                          ? 'border-foreground focus:border-foreground'
                          : 'border-rule focus:border-foreground'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.message ? (
                        <p className="font-mono text-[12px] tracking-[0.06em] text-foreground">
                          <span className="text-mid">ERR ·</span> {errors.message}
                        </p>
                      ) : (
                        <span className="font-sans text-[13px] text-mid">
                          {t('contact.fields.messageHint')}
                        </span>
                      )}
                      <span className="font-mono text-[11px] tracking-[0.06em] text-dim">
                        {values.message.length}/2000
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-8 border-t border-foreground flex flex-col sm:flex-row sm:items-center gap-8">
                    <div className="relative inline-flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="arrow-link text-[17px]"
                      >
                        {status === 'submitting'
                          ? t('contact.submitting')
                          : t('contact.submit')}
                      </button>
                      {status === 'submitting' && (
                        <span
                          aria-hidden
                          className="r-pill inline-block w-[8px] h-[8px] bg-foreground"
                          style={{ animation: 'dotPulse 1.1s ease-in-out infinite' }}
                        />
                      )}
                    </div>
                    <p className="font-sans text-[13px] text-foreground opacity-70">{t('contact.privacy')}</p>
                  </div>
                  {sendError && (
                    <p className="r-card font-mono text-[12px] tracking-[0.06em] text-foreground border border-foreground px-5 py-4" role="alert">
                      <span className="text-mid">ERR ·</span> {sendError}
                    </p>
                  )}
                </form>
              )}
            </div>
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
        className="block font-sans text-[15px] font-medium text-foreground mb-3"
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
        className={`r-input w-full bg-transparent border px-5 py-4 font-sans text-[16px] text-foreground placeholder:text-foreground placeholder:opacity-40 focus:outline-none transition-colors duration-200 ${
          error
            ? 'border-foreground focus:border-foreground'
            : 'border-rule focus:border-foreground'
        }`}
      />
      {error && (
        <p className="font-mono text-[12px] tracking-[0.06em] text-foreground mt-2">
          <span className="text-mid">ERR ·</span> {error}
        </p>
      )}
    </div>
  );
}
