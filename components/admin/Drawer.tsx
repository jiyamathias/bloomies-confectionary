'use client';
import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Right-hand side panel used for forms and order details in the admin. */
export default function Drawer({ open, onClose, title, children, footer, wide = false }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div role="dialog" aria-modal="true" aria-label={title}
        className={`absolute top-0 right-0 bottom-0 w-full ${wide ? 'sm:w-[720px]' : 'sm:w-[480px]'} bg-[#F6F4FB] flex flex-col shadow-2xl`}>
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#E6E0F3]">
          <h2 className="text-[1.05rem] font-semibold text-[#2B2147]">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#5E5A7C] hover:text-[#433075] hover:bg-[#F3F0FA]"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-4 bg-white border-t border-[#E6E0F3]">{footer}</div>}
      </div>
    </div>
  );
}

export const field = `w-full px-3 py-2.5 rounded-xl border border-[#D5D0E4] bg-white text-[0.88rem] text-[#2B2147]
  placeholder:text-[#8A86A6] focus:border-[#433075] focus:outline-none`;

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-[0.8rem] font-medium text-[#2B2147] mb-1">{label}</span>
      {children}
      {hint && <span className="block text-[0.72rem] text-[#5E5A7C] mt-1">{hint}</span>}
    </label>
  );
}
