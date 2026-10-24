import Smile from '@/components/Smile';

interface Props {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** 'light' for headings sitting on the dark purple panels */
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
  /** Optional content shown on the right (desktop) or below (mobile) */
  aside?: React.ReactNode;
  as?: 'h2' | 'h3';
  className?: string;
}

// One heading style for the whole site: Luckiest Guy title + the logo smile.
export default function SectionHeading({
  title, subtitle, tone = 'dark', align = 'left', aside, as: Tag = 'h2', className = '',
}: Props) {
  const light = tone === 'light';
  const centered = align === 'center';

  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${centered ? 'items-center text-center sm:flex-col sm:items-center' : ''} ${className}`}>
      <div className={centered ? 'flex flex-col items-center' : ''}>
        <Tag className={`font-luckiest leading-[1.05] tracking-[0.02em] ${light ? 'text-white' : 'text-[#433075]'}`}
          style={{ fontSize: Tag === 'h2' ? 'clamp(1.9rem,4vw,2.9rem)' : 'clamp(1.5rem,3vw,2.1rem)' }}>
          {title}
        </Tag>
        <Smile className={`w-[76px] h-auto mt-2.5 ${light ? 'text-[#E2BBFA]' : 'text-[#433075]'}`}
          tongue={light ? '#A58CF4' : '#E2BBFA'}/>
        {subtitle && (
          <p className={`mt-3 text-[0.92rem] leading-relaxed max-w-xl ${light ? 'text-white/75' : 'text-[#5E5A7C]'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
