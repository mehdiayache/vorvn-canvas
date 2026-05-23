import { Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { parseInline } from '@/lib/parseInline';

interface Props {
  lang: string;
}

export default function VorvnNewsroomSidebar({ lang }: Props) {
  const { t } = useTranslation();
  const title = t('newsroom.sidebar.title');
  const body = t('newsroom.sidebar.body').replace(/\/LANG\//g, `/${lang}/`);

  return (
    <aside
      aria-label={title}
      className="mt-16 md:mt-0 md:sticky md:top-32 md:self-start"
    >
      <Newspaper className="w-5 h-5 text-mid mb-5" strokeWidth={1.25} aria-hidden />
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-mid mb-4">
        {title}
      </div>
      <p className="font-sans text-[15px] leading-[1.55] text-foreground/85">
        {parseInline(body)}
      </p>
    </aside>
  );
}
