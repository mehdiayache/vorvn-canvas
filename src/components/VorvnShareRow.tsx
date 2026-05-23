import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  url: string;
  title: string;
}

export default function VorvnShareRow({ url, title }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const x = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const linkClass =
    'font-mono text-[10px] tracking-[0.18em] uppercase text-mid hover:text-foreground transition-colors';

  return (
    <div className="mt-16 pt-8 border-t border-rule flex flex-wrap items-center gap-x-5 gap-y-3">
      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-mid/70">
        {t('newsroom.share.label')}
      </span>
      <button type="button" onClick={onCopy} className={linkClass} aria-live="polite">
        {copied ? t('newsroom.share.copied') : t('newsroom.share.copy')}
      </button>
      <span aria-hidden className="text-mid/40">·</span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {t('newsroom.share.whatsapp')}
      </a>
      <span aria-hidden className="text-mid/40">·</span>
      <a href={x} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {t('newsroom.share.x')}
      </a>
      <span aria-hidden className="text-mid/40">·</span>
      <a href={li} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {t('newsroom.share.linkedin')}
      </a>
    </div>
  );
}
