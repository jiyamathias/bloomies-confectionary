import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Smile from '@/components/Smile';

interface Props {
  title: string;
  /** Kept for existing callers; shown as part of the same title. */
  titleEm?: string;
  subtitle: string;
  tag?: React.ReactNode;
}

// Top banner for inner pages. Uses the logo's lilac so every page opens on-brand.
export default function PageHeader({ title, titleEm, subtitle, tag }: Props) {
  return (
    <section className="bg-[#E2BBFA]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-28 sm:pt-32 pb-10 sm:pb-12">
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium
            text-[#433075]/75 hover:text-[#433075] transition-colors mb-6 group">
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform"/>
          Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <h1 className="font-luckiest text-[#433075] leading-[1.02] tracking-[0.02em]"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
              {title}{titleEm ? ` ${titleEm}` : ''}
            </h1>
            <Smile className="w-[92px] h-auto mt-3 text-[#433075]" tongue="#A58CF4"/>
            <p className="text-[0.95rem] text-[#433075]/85 mt-3 leading-relaxed max-w-lg">{subtitle}</p>
          </div>
          {tag && <div className="shrink-0">{tag}</div>}
        </div>
      </div>
    </section>
  );
}
