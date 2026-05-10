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
    <section className="relative overflow-hidden border-b border-[rgba(165,140,244,0.12)]"
      style={{ background: 'linear-gradient(135deg, #F3F0FA 0%, #EDE8F7 60%, #F8F5FF 100%)' }}>

      {/* Subtle decorative circle */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #A58CF4, transparent)' }}/>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-10 sm:pb-12 relative z-10">
        <Link href="/"
          className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.14em] uppercase
            text-[#6E6A8C] hover:text-[#433075] transition-colors mb-7 group">
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform"/>
          Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            {/* Decorative line */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-[#A58CF4]"/>
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#A58CF4] font-medium">
                Bloomies
              </span>
            </div>
            <h1 className="font-cormorant font-normal text-[#433075] leading-[1.05]"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)' }}>
              {title}{' '}
              {titleEm && <em className="italic font-light text-[#A58CF4]">{titleEm}</em>}
            </h1>
            <p className="text-[0.9rem] text-[#6E6A8C] mt-3 leading-relaxed max-w-lg">{subtitle}</p>
          </div>
          {tag && <div className="shrink-0">{tag}</div>}
        </div>
      </div>
    </section>
  );
}
