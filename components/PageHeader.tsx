import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  titleEm?: string;
  subtitle: string;
  tag?: React.ReactNode;
}

export default function PageHeader({ title, titleEm, subtitle, tag }: Props) {
  return (
    <section className="border-b border-[rgba(232,96,154,0.15)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.12em] uppercase
            text-[#7B5EA7] hover:text-[#E8609A] transition-colors mb-6"
        >
          <ArrowLeft size={13} /> Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-cormorant text-[clamp(2.6rem,5vw,4.2rem)] font-normal text-[#5B2D8E] leading-[1.05]">
              {title}{' '}
              {titleEm && <em className="italic text-[#E8609A]">{titleEm}</em>}
            </h1>
            <p className="text-[0.9rem] text-[#7B5EA7] mt-3 leading-relaxed max-w-lg">{subtitle}</p>
          </div>
          {tag && <div className="shrink-0">{tag}</div>}
        </div>
      </div>
    </section>
  );
}
