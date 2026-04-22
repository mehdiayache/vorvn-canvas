import { useEffect, useState } from 'react';

const STORAGE_KEY = 'vorvn:cookie-consent';

type Consent = 'granted' | 'denied' | null;

export function getStoredConsent(): Consent {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'granted' || v === 'denied' ? v : null;
}

/**
 * Lightweight cookie/consent banner.
 *
 * Today the site sets ZERO non-essential cookies, so the banner stays hidden by
 * default. As soon as a tracker (Meta Pixel, GA, etc.) is added, set the prop
 * `enabled` to true and gate the tracker init on `getStoredConsent() === 'granted'`.
 */
export default function CookieBanner({ enabled = false }: { enabled?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (getStoredConsent() === null) setVisible(true);
  }, [enabled]);

  if (!enabled || !visible) return null;

  const decide = (choice: Exclude<Consent, null>) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-rule bg-[hsl(var(--bg))]"
      style={{ padding: '20px var(--gutter)' }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <p className="font-sans text-[13px] leading-[1.6] text-foreground flex-1">
          We use essential cookies to operate this site. We'd like your consent to load Meta
          Pixel for measuring marketing performance. See our{' '}
          <a
            href="/legal/privacy"
            className="text-foreground border-b border-foreground hover:opacity-70 transition-opacity duration-200"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex gap-6 shrink-0">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="arrow-link text-[13px]"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="arrow-link text-[13px]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
