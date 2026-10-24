import { Zap } from 'lucide-react';

// One "same-day" badge for the whole site.
export default function SameDayTag({ children, small = false }: { children: React.ReactNode; small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 bg-white text-[#1F6B2E] font-semibold rounded-full
      border border-[rgba(31,107,46,0.25)]
      ${small ? 'px-3 py-1 text-[0.72rem]' : 'px-4 py-2 text-[0.78rem]'}`}>
      <Zap size={small ? 11 : 13} fill="currentColor"/> {children}
    </span>
  );
}
