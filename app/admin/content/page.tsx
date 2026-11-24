'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown, ExternalLink, Monitor, Smartphone, RotateCcw, CheckCircle2, Eye, X, Info, ArrowUpRight, RefreshCw,
  Globe, Home, Cake, Croissant, UtensilsCrossed, Cookie, PartyPopper, Images, BookHeart, ScrollText,
} from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';
import { PAGES, type PageDef, type SectionDef } from '@/lib/content/schema';
import {
  discardDraft, publishDraft, readDraft, readPublished, saveDraft, type Overrides,
} from '@/lib/content/store';
import { FieldEditor, Switch } from '@/components/admin/cms/fields';

const PAGE_ICONS: Record<string, typeof Home> = {
  site: Globe, home: Home, cakes: Cake, pastries: Croissant, smallChops: UtensilsCrossed, dailyTreats: Cookie,
  events: PartyPopper, gallery: Images, about: BookHeart, policy: ScrollText,
};

type Obj = Record<string, unknown>;
const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const defaultsOf = (page: string, section: string) =>
  ((DEFAULT_CONTENT as unknown as Record<string, Record<string, Obj>>)[page]?.[section] ?? {}) as Obj;

function changedIds(a: Overrides, b: Overrides) {
  const ids = new Set<string>();
  for (const src of [a, b]) for (const p of Object.keys(src)) for (const s of Object.keys(src[p] ?? {})) ids.add(`${p}.${s}`);
  return Array.from(ids).filter(id => { const [p, s] = id.split('.'); return !same(a[p]?.[s], b[p]?.[s]); });
}

export default function WebsiteContentPage() {
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Overrides>({});
  const [published, setPublished] = useState<Overrides>({});
  const [pageId, setPageId] = useState<string>('home');
  const [openSection, setOpenSection] = useState<string | null>('hero');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState<'discard' | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);

  useEffect(() => {
    setDraft(readDraft()); setPublished(readPublished());
    try { const last = localStorage.getItem('bloomies_cms_page'); if (last && PAGES.some(p => p.id === last)) { setPageId(last); setOpenSection(PAGES.find(p => p.id === last)!.sections[0]?.id ?? null); } } catch { /* ignore */ }
    setReady(true);
  }, []);

  const page = PAGES.find(p => p.id === pageId) ?? PAGES[0];
  const unpublished = useMemo(() => changedIds(draft, published), [draft, published]);
  const pagesWithChanges = useMemo(() => new Set(unpublished.map(id => id.split('.')[0])), [unpublished]);

  function choosePage(id: string) {
    setPageId(id);
    setOpenSection(PAGES.find(p => p.id === id)?.sections[0]?.id ?? null);
    try { localStorage.setItem('bloomies_cms_page', id); } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const commit = useCallback((next: Overrides) => {
    setDraft(next);
    setError(saveDraft(next) ?? '');
  }, []);

  function sectionValue(section: SectionDef): Obj {
    return { ...defaultsOf(page.id, section.id), ...(draft[page.id]?.[section.id] ?? {}) };
  }

  function setField(section: SectionDef, key: string, value: unknown) {
    const def = defaultsOf(page.id, section.id)[key];
    const cur: Obj = { ...(draft[page.id]?.[section.id] ?? {}) };
    if (same(value, def)) delete cur[key]; else cur[key] = value;
    const pageOverrides = { ...(draft[page.id] ?? {}) };
    if (Object.keys(cur).length) pageOverrides[section.id] = cur; else delete pageOverrides[section.id];
    const next = { ...draft };
    if (Object.keys(pageOverrides).length) next[page.id] = pageOverrides; else delete next[page.id];
    commit(next);
  }

  function resetSection(section: SectionDef) {
    const pageOverrides = { ...(draft[page.id] ?? {}) };
    delete pageOverrides[section.id];
    const next = { ...draft };
    if (Object.keys(pageOverrides).length) next[page.id] = pageOverrides; else delete next[page.id];
    commit(next);
  }

  function publish() {
    const err = publishDraft();
    if (err) { setError(err); return; }
    setPublished(readPublished());
    flash('Published. Your changes are now live on the website.');
  }

  function discard() {
    discardDraft();
    setDraft(readDraft());
    setConfirm(null);
    flash('Unpublished changes discarded.');
  }

  function flash(msg: string) { setToast(msg); window.setTimeout(() => setToast(''), 3200); }

  if (!ready) return null;
  const focusId = openSection ? `${page.id}.${openSection}` : null;

  return (
    <div className="p-5 lg:p-8 max-w-[1560px] mx-auto">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="font-luckiest tracking-[0.02em] text-[1.8rem] sm:text-[2.1rem] text-[#433075] leading-none">Website content</h1>
          <p className="text-[0.88rem] text-[#5E5A7C] mt-2 max-w-2xl">
            Edit the headings, text and photos on every page. Changes are saved as a draft and only go live when you publish.
          </p>
        </div>
        <Link href="/" target="_blank"
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-[#D5D0E4] text-[#433075] px-4 py-2.5 rounded-xl text-[0.85rem] font-semibold hover:bg-[#F3F0FA]">
          View live site <ArrowUpRight size={15}/>
        </Link>
      </div>

      {/* Status bar */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-5 lg:-mx-8 px-5 lg:px-8 py-3 mb-5 bg-[#F6F4FB]/90 backdrop-blur border-b border-[#E6E0F3]">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-[0.85rem]">
            {unpublished.length ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E9A23B] shadow-[0_0_0_4px_rgba(233,162,59,0.18)]"/>
                <span className="text-[#2B2147] font-semibold">{unpublished.length} unpublished {unpublished.length === 1 ? 'change' : 'changes'}</span>
                <span className="text-[#5E5A7C] hidden md:inline">· saved as a draft</span>
              </>
            ) : (
              <><CheckCircle2 size={17} className="text-[#1F6B2E]"/><span className="text-[#2B2147] font-semibold">The live site is up to date</span></>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMobilePreview(true)}
              className="xl:hidden inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#D5D0E4] bg-white text-[#433075] text-[0.85rem] font-semibold">
              <Eye size={15}/> Preview
            </button>
            {confirm === 'discard' ? (
              <span className="inline-flex items-center gap-2 text-[0.82rem]">
                <span className="text-[#5E5A7C] hidden sm:inline">Throw away all unpublished changes?</span>
                <button onClick={discard} className="px-3 py-2.5 rounded-xl bg-[#B42318] text-white font-semibold">Discard</button>
                <button onClick={() => setConfirm(null)} className="px-3 py-2.5 rounded-xl text-[#5E5A7C] hover:bg-white">Keep</button>
              </span>
            ) : (
              <button onClick={() => setConfirm('discard')} disabled={!unpublished.length}
                className="px-3.5 py-2.5 rounded-xl text-[#5E5A7C] text-[0.85rem] font-semibold hover:bg-white disabled:opacity-40 disabled:pointer-events-none">
                Discard
              </button>
            )}
            <button onClick={publish} disabled={!unpublished.length}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#433075] text-white text-[0.85rem] font-semibold
                hover:bg-[#5B3E8A] disabled:opacity-40 disabled:pointer-events-none shadow-[0_6px_18px_rgba(67,48,117,0.25)]">
              Publish changes
            </button>
          </div>
        </div>
        {error && <p role="alert" className="mt-2 text-[0.82rem] text-[#B42318]">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_minmax(380px,0.85fr)] gap-5 items-start">
        {/* Pages */}
        <nav aria-label="Pages" className="lg:sticky lg:top-24">
          <label className="lg:hidden block">
            <span className="sr-only">Page</span>
            <select value={pageId} onChange={e => choosePage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#D5D0E4] bg-white text-[0.95rem] font-semibold text-[#2B2147]">
              {PAGES.map(p => <option key={p.id} value={p.id}>{p.label}{pagesWithChanges.has(p.id) ? ' •' : ''}</option>)}
            </select>
          </label>
          <ul className="hidden lg:block space-y-1">
            {PAGES.map(p => {
              const Icon = PAGE_ICONS[p.id] ?? Globe;
              const active = p.id === pageId;
              return (
                <li key={p.id}>
                  <button onClick={() => choosePage(p.id)} aria-current={active ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                      ${active ? 'bg-[#433075] text-white shadow-[0_6px_18px_rgba(67,48,117,0.25)]' : 'text-[#2B2147] hover:bg-white'}`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-white/15' : 'bg-white border border-[#E6E0F3]'}`}>
                      <Icon size={16} className={active ? 'text-white' : 'text-[#433075]'}/>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[0.88rem] font-semibold truncate">{p.label}</span>
                      <span className={`block text-[0.7rem] truncate ${active ? 'text-white/70' : 'text-[#8A86A6]'}`}>{p.id === 'site' ? 'Every page' : p.path}</span>
                    </span>
                    {pagesWithChanges.has(p.id) && <span className="w-2 h-2 rounded-full bg-[#E9A23B]" aria-label="Unpublished changes"/>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Editor */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-[1.15rem] font-semibold text-[#2B2147]">{page.label}</h2>
              <p className="text-[0.8rem] text-[#5E5A7C]">{page.description}</p>
            </div>
            {page.id !== 'site' && (
              <Link href={page.path} target="_blank" className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#433075] py-2 hover:underline shrink-0">
                Open page <ExternalLink size={13}/>
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {page.sections.map(section => (
              <SectionCard key={section.id} page={page} section={section}
                value={sectionValue(section)}
                open={openSection === section.id}
                onToggleOpen={() => setOpenSection(openSection === section.id ? null : section.id)}
                edited={!!draft[page.id]?.[section.id]}
                unpublished={unpublished.includes(`${page.id}.${section.id}`)}
                onField={(k, v) => setField(section, k, v)}
                onReset={() => resetSection(section)}/>
            ))}
          </div>
        </div>

        {/* Live preview (wide screens) */}
        <aside className="hidden xl:block sticky top-24">
          <PreviewPane path={page.path} focusId={focusId}/>
        </aside>
      </div>

      {/* Full-screen preview (phones and tablets) */}
      {mobilePreview && (
        <div className="xl:hidden fixed inset-0 z-[80] bg-[#2B2147]/60 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-4 h-14 bg-white border-b border-[#E6E0F3]">
            <p className="text-[0.9rem] font-semibold text-[#2B2147]">Preview · {page.label} <span className="text-[#8A86A6] font-normal">(draft)</span></p>
            <button onClick={() => setMobilePreview(false)} aria-label="Close preview" className="w-10 h-10 rounded-full flex items-center justify-center text-[#5E5A7C] hover:bg-[#F3F0FA]"><X size={20}/></button>
          </div>
          <iframe title="Preview" src={`${page.path}?cms-preview=1`} className="flex-1 w-full bg-white"/>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-[#2B2147] text-white px-5 py-3 rounded-full text-[0.85rem] shadow-xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#7EE08A]"/> {toast}
        </div>
      )}
    </div>
  );
}

function SectionCard({ page, section, value, open, onToggleOpen, edited, unpublished, onField, onReset }: {
  page: PageDef; section: SectionDef; value: Obj; open: boolean; onToggleOpen: () => void;
  edited: boolean; unpublished: boolean; onField: (key: string, v: unknown) => void; onReset: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const visible = value.visible !== false;
  return (
    <section className={`rounded-2xl bg-white border transition-shadow ${open ? 'border-[#C9BEEA] shadow-[0_14px_40px_rgba(67,48,117,0.10)]' : 'border-[#E6E0F3]'}`}>
      <div className="flex items-center gap-3 pl-5 pr-3 py-3">
        <button onClick={onToggleOpen} aria-expanded={open} className="flex-1 min-w-0 text-left py-1">
          <span className="flex items-center gap-2 flex-wrap">
            <span className="text-[0.98rem] font-semibold text-[#2B2147]">{section.label}</span>
            {unpublished && <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full bg-[#FFF3DC] text-[#8A5300]">Unpublished</span>}
            {!unpublished && edited && <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full bg-[#F3F0FA] text-[#433075]">Edited</span>}
            {section.toggle && !visible && <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full bg-[#F1EEF8] text-[#5E5A7C]">Hidden</span>}
          </span>
          {section.description && <span className="block text-[0.78rem] text-[#5E5A7C] mt-0.5">{section.description}</span>}
        </button>
        {section.toggle && <Switch checked={visible} label={`Show ${section.label}`} onChange={v => onField('visible', v)}/>}
        <button onClick={onToggleOpen} aria-label={open ? 'Collapse' : 'Expand'}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#5E5A7C] hover:bg-[#F3F0FA]">
          <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`}/>
        </button>
      </div>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-[#F1EEF8]">
          {section.note && (
            <p className="flex items-start gap-2 text-[0.8rem] text-[#433075] bg-[#F3F0FA] rounded-xl px-3.5 py-2.5 mt-4">
              <Info size={15} className="shrink-0 mt-0.5"/>
              <span>{section.note.text}{' '}
                {section.note.href && <Link href={section.note.href} className="font-semibold underline underline-offset-2">{section.note.linkLabel}</Link>}
              </span>
            </p>
          )}
          <div className={`space-y-5 mt-4 ${section.toggle && !visible ? 'opacity-60' : ''}`}>
            {section.fields.map(f => (
              <FieldEditor key={f.key} field={f} value={value[f.key]} onChange={v => onField(f.key, v)}/>
            ))}
          </div>
          {edited && (
            <div className="mt-5 pt-4 border-t border-[#F1EEF8] flex items-center gap-2 text-[0.8rem]">
              {confirmReset ? (
                <>
                  <span className="text-[#5E5A7C]">Put this section back to the original text and photos?</span>
                  <button onClick={() => { onReset(); setConfirmReset(false); }} className="px-3 py-2 rounded-lg bg-[#433075] text-white font-semibold">Reset</button>
                  <button onClick={() => setConfirmReset(false)} className="px-3 py-2 rounded-lg text-[#5E5A7C] hover:bg-[#F3F0FA]">Cancel</button>
                </>
              ) : (
                <button onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1.5 py-2 text-[#5E5A7C] hover:text-[#433075] font-semibold">
                  <RotateCcw size={14}/> Reset to original
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function PreviewPane({ path, focusId }: { path: string; focusId: string | null }) {
  const [device, setDevice] = useState<'phone' | 'desktop'>('phone');
  const [reloadKey, setReloadKey] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [box, setBox] = useState({ w: 400, h: 700 });

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const focus = useCallback(() => {
    if (focusId) frameRef.current?.contentWindow?.postMessage({ type: 'cms:focus', id: focusId }, window.location.origin);
  }, [focusId]);

  // Scroll the preview to the section being edited (now, and whenever the page finishes loading).
  useEffect(() => { focus(); }, [focus]);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === 'cms:ready' && e.source === frameRef.current?.contentWindow) focus();
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [focus]);

  const frameW = device === 'phone' ? 390 : 1280;
  const scale = Math.min(1, (box.w - (device === 'phone' ? 32 : 0)) / frameW);
  const frameH = device === 'phone' ? Math.min(844, (box.h - 32) / scale) : box.h / scale;

  return (
    <div className="rounded-2xl bg-white border border-[#E6E0F3] overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[#F1EEF8]">
        <p className="text-[0.8rem] font-semibold text-[#2B2147] pl-1">Live preview <span className="font-normal text-[#8A86A6]">· draft</span></p>
        <div className="flex items-center gap-1">
          <div role="radiogroup" aria-label="Device" className="flex bg-[#F3F0FA] rounded-lg p-0.5">
            {([['phone', Smartphone], ['desktop', Monitor]] as const).map(([d, Icon]) => (
              <button key={d} role="radio" aria-checked={device === d} aria-label={d === 'phone' ? 'Phone' : 'Desktop'} onClick={() => setDevice(d)}
                className={`w-9 h-8 rounded-md flex items-center justify-center ${device === d ? 'bg-white text-[#433075] shadow-sm' : 'text-[#8A86A6]'}`}>
                <Icon size={15}/>
              </button>
            ))}
          </div>
          <button onClick={() => setReloadKey(k => k + 1)} aria-label="Reload preview" className="w-9 h-8 rounded-md flex items-center justify-center text-[#5E5A7C] hover:bg-[#F3F0FA]"><RefreshCw size={14}/></button>
        </div>
      </div>
      <div ref={wrapRef} className="h-[calc(100vh-190px)] min-h-[520px] bg-[#EEEAF7] flex items-start justify-center overflow-hidden">
        <div style={{ width: frameW * scale, height: frameH * scale }}
          className={`relative shrink-0 ${device === 'phone' ? 'mt-4 rounded-[28px] ring-[6px] ring-[#2B2147] shadow-2xl overflow-hidden' : ''}`}>
          <iframe key={`${path}-${reloadKey}`} ref={frameRef} title="Live preview" src={`${path}?cms-preview=1`}
            style={{ width: frameW, height: frameH, transform: `scale(${scale})`, transformOrigin: 'top left' }}
            className="absolute top-0 left-0 bg-white border-0"/>
        </div>
      </div>
    </div>
  );
}
