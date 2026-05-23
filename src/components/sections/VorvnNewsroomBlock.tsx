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
              <blockquote
                key={i}
                className="border-s border-foreground ps-5 py-1 font-sans text-[18px] md:text-[20px] leading-[1.55] text-foreground"
              >
                {parseInline(b.text)}
              </blockquote>
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
