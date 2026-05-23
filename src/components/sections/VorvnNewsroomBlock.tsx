import type { Block } from '@/lib/newsroom';
import { parseInline } from '@/lib/parseInline';

interface Props {
  blocks: Block[];
}

export default function VorvnNewsroomBlock({ blocks }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <h2
                key={i}
                className="font-sans text-[22px] md:text-[26px] font-medium tracking-[-0.01em] text-foreground mt-6"
              >
                {parseInline(b.text)}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={i}
                className="font-sans text-[17px] md:text-[19px] font-medium tracking-[-0.005em] text-foreground mt-4"
              >
                {parseInline(b.text)}
              </h3>
            );
          case 'quote':
            return (
              <figure key={i} className="relative my-10 ps-6 border-s border-foreground">
                <span
                  aria-hidden
                  className="absolute -top-4 start-2 font-sans text-[56px] leading-none text-foreground/15 select-none"
                >
                  &ldquo;
                </span>
                <blockquote className="font-sans text-[22px] md:text-[26px] leading-[1.35] tracking-[-0.01em] text-foreground">
                  {parseInline(b.text)}
                </blockquote>
                {b.attribution && (
                  <figcaption className="mt-4 font-mono text-[11px] tracking-[0.18em] uppercase text-mid">
                    — <cite className="not-italic">{b.attribution}</cite>
                  </figcaption>
                )}
              </figure>
            );
          case 'list':
            return (
              <ul key={i} className="list-disc ps-6 flex flex-col gap-2 text-mid">
                {b.items.map((it, j) => (
                  <li key={j} className="text-[17px] leading-[1.6]">
                    {parseInline(it)}
                  </li>
                ))}
              </ul>
            );
          case 'image':
            return (
              <figure key={i} className="my-6">
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block border border-rule"
                />
                {b.caption && (
                  <figcaption className="mt-3 font-mono text-[11px] tracking-[0.12em] uppercase text-mid">
                    {b.caption}
                  </figcaption>
                )}
              </figure>
            );
          case 'p':
          default:
            return (
              <p
                key={i}
                className="font-sans text-[17px] leading-[1.6] text-mid"
              >
                {parseInline(b.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
