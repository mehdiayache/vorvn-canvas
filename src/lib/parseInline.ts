import React from 'react';

/**
 * Parses inline markdown-style links [label](url) within plain text.
 * External links open in a new tab automatically. Returns React nodes.
 */
export function parseInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, url] = m;
    const external = /^https?:\/\//i.test(url);
    out.push(
      React.createElement(
        'a',
        {
          key: `lnk-${key++}`,
          href: url,
          className: 'underline underline-offset-4 hover:text-mid transition-colors',
          ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        },
        label,
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Plain-text version (for SEO/prerender, no links rendered). */
export function stripInline(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}
