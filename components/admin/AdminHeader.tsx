'use client';
import type { ReactNode } from 'react';
import { RANGE_LABEL, type RangeKey } from '@/lib/admin/analytics';

export default function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-luckiest tracking-[0.02em] text-[2.1rem] text-[#433075] leading-none">{title}</h1>
        {subtitle && <p className="text-[0.88rem] text-[#5E5A7C] mt-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** One row of filters above everything they control. */
export function FilterRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 mb-5">{children}</div>;
}

export function RangePicker({ value, onChange }: { value: RangeKey; onChange: (v: RangeKey) => void }) {
  return (
    <div role="radiogroup" aria-label="Date range" className="inline-flex flex-wrap bg-white border border-[#E6E0F3] rounded-xl p-1">
      {(Object.keys(RANGE_LABEL) as RangeKey[]).map(k => (
        <button key={k} type="button" role="radio" aria-checked={value === k} onClick={() => onChange(k)}
          className={`px-3 py-1.5 rounded-lg text-[0.8rem] transition-colors
            ${value === k ? 'bg-[#433075] text-white font-semibold' : 'text-[#5E5A7C] hover:bg-[#F3F0FA]'}`}>
          {k === 'today' ? 'Today' : k === '12m' ? '12 months' : k.replace('d', ' days')}
        </button>
      ))}
    </div>
  );
}

export function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <label className="inline-flex items-center gap-2 bg-white border border-[#E6E0F3] rounded-xl pl-3 pr-1 py-1 text-[0.8rem] text-[#5E5A7C]">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="bg-transparent text-[#2B2147] font-medium py-1 pr-1 focus:outline-none">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

export const btn = {
  primary: 'inline-flex items-center gap-2 bg-[#433075] text-white px-4 py-2.5 rounded-xl text-[0.85rem] font-semibold hover:bg-[#5B3E8A] transition-colors',
  secondary: 'inline-flex items-center gap-2 bg-white border border-[#D5D0E4] text-[#433075] px-4 py-2.5 rounded-xl text-[0.85rem] font-semibold hover:bg-[#F3F0FA] transition-colors',
};
