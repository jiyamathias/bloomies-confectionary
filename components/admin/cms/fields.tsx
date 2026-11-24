'use client';
// Form controls for the Website content editor. Each takes a value and an onChange; the page
// decides where the value is stored.
import { useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, ImagePlus, Link2, Plus, Trash2, Images, X, ArrowUp, ArrowDown } from 'lucide-react';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';
import type { Field } from '@/lib/content/schema';

type Value = unknown;
type Obj = Record<string, Value>;

const input = `w-full px-3.5 py-2.5 rounded-xl border border-[#D5D0E4] bg-white text-[0.9rem] text-[#2B2147]
  placeholder:text-[#8A86A6] focus:border-[#433075] focus:outline-none focus:ring-4 focus:ring-[#433075]/10 transition-shadow`;

function Label({ label, count, max, help, htmlFor }: { label: string; count?: number; max?: number; help?: string; htmlFor?: string }) {
  const near = max && count !== undefined && count > max * 0.9;
  return (
    <div className="mb-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[0.82rem] font-semibold text-[#2B2147]">{label}</label>
        {max !== undefined && count !== undefined && (
          <span className={`text-[0.7rem] tabular-nums ${near ? 'text-[#B45309]' : 'text-[#8A86A6]'}`}>{count}/{max}</span>
        )}
      </div>
      {help && <p className="text-[0.75rem] text-[#5E5A7C] mt-0.5 leading-snug">{help}</p>}
    </div>
  );
}

export function FieldEditor({ field, value, onChange }: { field: Field; value: Value; onChange: (v: Value) => void }) {
  switch (field.type) {
    case 'text':
    case 'url':
      return <TextField field={field} value={String(value ?? '')} onChange={onChange}/>;
    case 'textarea':
      return <AreaField field={field} value={String(value ?? '')} onChange={onChange}/>;
    case 'image':
      return <ImageField label={field.label} help={field.help} value={String(value ?? '')} onChange={onChange}/>;
    case 'group':
      return <GroupField field={field} value={(value ?? {}) as Obj} onChange={onChange}/>;
    case 'list':
      return <ListField field={field} value={(Array.isArray(value) ? value : []) as Obj[]} onChange={onChange}/>;
  }
}

function TextField({ field, value, onChange }: { field: Extract<Field, { type: 'text' | 'url' }>; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const max = field.type === 'text' ? field.max : undefined;
  return (
    <div>
      <Label htmlFor={id} label={field.label} help={field.help} max={max} count={value.length}/>
      <input id={id} className={input} value={value} maxLength={max} type={field.type === 'url' ? 'url' : 'text'}
        placeholder={field.placeholder} onChange={e => onChange(e.target.value)}/>
    </div>
  );
}

function AreaField({ field, value, onChange }: { field: Extract<Field, { type: 'textarea' }>; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={field.label} help={field.help} max={field.max} count={value.length}/>
      <textarea id={id} className={`${input} resize-y leading-relaxed`} rows={field.rows ?? 3} maxLength={field.max}
        value={value} onChange={e => onChange(e.target.value)}/>
    </div>
  );
}

function GroupField({ field, value, onChange }: { field: Extract<Field, { type: 'group' }>; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <fieldset className="rounded-2xl border border-[#E6E0F3] bg-[#FBFAFE] p-4">
      <legend className="px-2 -ml-2 text-[0.78rem] font-semibold tracking-[0.06em] uppercase text-[#5E5A7C]">{field.label}</legend>
      <div className="space-y-4">
        {field.fields.map(f => (
          <FieldEditor key={f.key} field={f} value={value[f.key]} onChange={v => onChange({ ...value, [f.key]: v })}/>
        ))}
      </div>
    </fieldset>
  );
}

function ListField({ field, value, onChange }: { field: Extract<Field, { type: 'list' }>; value: Obj[]; onChange: (v: Obj[]) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<number | null>(null);
  const min = field.min ?? 0, max = field.max ?? 50;

  function move(i: number, d: -1 | 1) {
    const j = i + d; if (j < 0 || j >= value.length) return;
    const next = [...value]; [next[i], next[j]] = [next[j], next[i]];
    onChange(next); setOpen(open === i ? j : open === j ? i : open);
  }
  function remove(i: number) { onChange(value.filter((_, k) => k !== i)); setConfirm(null); setOpen(null); }
  function add() { onChange([...value, { ...field.newItem }]); setOpen(value.length); }

  return (
    <div>
      <Label label={field.label} help={field.help}/>
      <ol className="space-y-2">
        {value.map((item, i) => {
          const title = (field.titleKey && String(item[field.titleKey] ?? '').trim()) || `${field.itemLabel} ${i + 1}`;
          const thumb = field.fields.find(f => f.type === 'image');
          const isOpen = open === i;
          return (
            <li key={i} className={`rounded-2xl border bg-white transition-shadow ${isOpen ? 'border-[#B8A9E8] shadow-[0_8px_24px_rgba(67,48,117,0.08)]' : 'border-[#E6E0F3]'}`}>
              <div className="flex items-center gap-2 pl-3 pr-1.5 py-1.5">
                <span className="w-6 h-6 rounded-full bg-[#F3F0FA] text-[#433075] text-[0.72rem] font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                {thumb && typeof item[thumb.key] === 'string' && item[thumb.key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(item[thumb.key])} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0"/>
                ) : null}
                <button type="button" onClick={() => setOpen(isOpen ? null : i)}
                  className="flex-1 min-w-0 text-left py-2 text-[0.88rem] font-medium text-[#2B2147] truncate" aria-expanded={isOpen}>
                  {title}
                </button>
                {confirm === i ? (
                  <span className="flex items-center gap-1 text-[0.78rem]">
                    <button type="button" onClick={() => remove(i)} className="px-2.5 py-1.5 rounded-lg bg-[#B42318] text-white font-semibold">Delete</button>
                    <button type="button" onClick={() => setConfirm(null)} className="px-2.5 py-1.5 rounded-lg text-[#5E5A7C] hover:bg-[#F3F0FA]">Keep</button>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <IconBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={15}/></IconBtn>
                    <IconBtn label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)}><ArrowDown size={15}/></IconBtn>
                    <IconBtn label={`Delete ${title}`} disabled={value.length <= min} danger onClick={() => setConfirm(i)}><Trash2 size={15}/></IconBtn>
                    <IconBtn label={isOpen ? 'Collapse' : 'Expand'} onClick={() => setOpen(isOpen ? null : i)}>
                      {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </IconBtn>
                  </span>
                )}
              </div>
              {isOpen && (
                <div className="px-4 pb-4 pt-2 space-y-4 border-t border-[#F1EEF8]">
                  {field.fields.map(f => (
                    <FieldEditor key={f.key} field={f} value={item[f.key]}
                      onChange={v => onChange(value.map((it, k) => (k === i ? { ...it, [f.key]: v } : it)))}/>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {value.length < max && (
        <button type="button" onClick={add}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#C9BEEA]
            py-3 text-[0.85rem] font-semibold text-[#433075] hover:bg-[#F7F4FD] transition-colors">
          <Plus size={15}/> Add {field.itemLabel.toLowerCase()}
        </button>
      )}
    </div>
  );
}

function IconBtn({ children, label, onClick, disabled, danger }: { children: ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none
        ${danger ? 'text-[#8A86A6] hover:text-[#B42318] hover:bg-[#FDECEC]' : 'text-[#5E5A7C] hover:text-[#433075] hover:bg-[#F3F0FA]'}`}>
      {children}
    </button>
  );
}

// ── Photos ──────────────────────────────────────────────────────────────────────────────────

/** Every photo already used on the site, offered as a quick library. */
const LIBRARY = (() => {
  const found = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string' && v.startsWith('/images/')) found.add(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(DEFAULT_CONTENT);
  ['/images/hero-real.jpg', '/images/hero-enhanced.jpg', '/images/bloomies-logo.jpg'].forEach(p => found.add(p));
  return Array.from(found);
})();

/** Shrinks an uploaded photo so it fits in preview storage (max 1600px, JPEG). */
async function resizeImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url;
    });
    for (const [maxDim, q] of [[1600, 0.82], [1280, 0.75], [1024, 0.7]] as const) {
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      const data = c.toDataURL('image/jpeg', q);
      if (data.length < 700_000 || maxDim === 1024) return data;
    }
    throw new Error('unreachable');
  } finally { URL.revokeObjectURL(url); }
}

function ImageField({ label, help, value, onChange }: { label: string; help?: string; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'none' | 'library' | 'link'>('none');
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const uploaded = value.startsWith('data:');

  async function onFile(f?: File) {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setErr('Please choose a photo (JPG, PNG or WebP).'); return; }
    setErr(''); setBusy(true);
    try { onChange(await resizeImage(f)); setMode('none'); }
    catch { setErr('That photo could not be read. Try another one.'); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  }

  return (
    <div>
      <Label label={label} help={help}/>
      <div className="flex gap-3 items-start">
        <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-[#F3F0FA] border border-[#E6E0F3] shrink-0">
          {value
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={value} alt="" className="w-full h-full object-cover"/>
            : <span className="absolute inset-0 flex items-center justify-center text-[0.72rem] text-[#8A86A6]">No photo</span>}
          {busy && <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-[0.75rem] text-[#433075] font-semibold">Resizing…</span>}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#433075] text-white text-[0.8rem] font-semibold hover:bg-[#5B3E8A]">
              <ImagePlus size={15}/> {value ? 'Replace' : 'Upload'}
            </button>
            <button type="button" onClick={() => setMode(mode === 'library' ? 'none' : 'library')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[0.8rem] font-semibold
                ${mode === 'library' ? 'border-[#433075] text-[#433075] bg-[#F3F0FA]' : 'border-[#D5D0E4] text-[#433075] hover:bg-[#F3F0FA]'}`}>
              <Images size={15}/> Site photos
            </button>
            <button type="button" onClick={() => setMode(mode === 'link' ? 'none' : 'link')} aria-label="Use a link"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[0.8rem] font-semibold
                ${mode === 'link' ? 'border-[#433075] text-[#433075] bg-[#F3F0FA]' : 'border-[#D5D0E4] text-[#433075] hover:bg-[#F3F0FA]'}`}>
              <Link2 size={15}/>
            </button>
          </div>
          <p className="text-[0.72rem] text-[#5E5A7C] leading-snug">
            {uploaded ? 'Uploaded photo (resized for the web).' : value ? value.replace(/^.*\//, '') : ''}
          </p>
          {err && <p className="text-[0.75rem] text-[#B42318]">{err}</p>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={e => onFile(e.target.files?.[0])}/>
      </div>

      {mode === 'library' && (
        <div className="mt-3 rounded-2xl border border-[#E6E0F3] bg-[#FBFAFE] p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[0.78rem] font-semibold text-[#2B2147]">Choose a photo already on the site</p>
            <button type="button" onClick={() => setMode('none')} aria-label="Close" className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5E5A7C] hover:bg-[#F3F0FA]"><X size={15}/></button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto">
            {LIBRARY.map(src => (
              <button key={src} type="button" onClick={() => { onChange(src); setMode('none'); }}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 ${src === value ? 'border-[#433075]' : 'border-transparent hover:border-[#B8A9E8]'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>
      )}
      {mode === 'link' && (
        <form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); if (/^https?:\/\//.test(link.trim())) { onChange(link.trim()); setLink(''); setMode('none'); } }}>
          <input className={input} type="url" placeholder="https://… link to a photo" value={link} onChange={e => setLink(e.target.value)}/>
          <button type="submit" className="px-4 rounded-xl bg-[#433075] text-white text-[0.82rem] font-semibold shrink-0">Use</button>
        </form>
      )}
    </div>
  );
}

// ── Switch ───────────────────────────────────────────────────────────────────────────────────

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-[#5E5A7C] py-1.5">
      <span className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#433075]' : 'bg-[#D5D0E4]'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`}/>
      </span>
      <span className="hidden sm:inline">{checked ? 'Shown' : 'Hidden'}</span>
    </button>
  );
}

