'use client';
// Content store: merges server-fetched DB overrides with localStorage preview edits.
// Published content is fetched server-side and injected via ContentProvider.
// Draft edits (CMS editor preview) still use localStorage for instant feedback.
import { useSyncExternalStore } from 'react';
import { DEFAULT_CONTENT, type Content, type PageKey } from '@/lib/content/defaults';
import { useServerContent } from '@/lib/content/provider';

export type Overrides = { [page: string]: { [section: string]: Record<string, unknown> } };

const PUBLISHED_KEY = 'bloomies_cms_published_v1';
const DRAFT_KEY = 'bloomies_cms_draft_v1';
const CHANGE_EVENT = 'bloomies:cms';
const EMPTY: Overrides = {};

/** The live preview inside the admin loads pages with ?cms-preview=1 and shows the draft. */
export function isPreview() {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('cms-preview') === '1') return true;
  // Stay in preview while clicking around inside the admin's preview frame.
  try { return window.self !== window.top && sessionStorage.getItem('bloomies_cms_preview') === '1'; } catch { return false; }
}

// Parse once per stored string so useSyncExternalStore gets a stable object.
const cache = new Map<string, { raw: string | null; value: Overrides }>();
function readKey(key: string): Overrides {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { /* storage blocked */ }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value: Overrides = EMPTY;
  try { value = raw ? JSON.parse(raw) : EMPTY; } catch { value = EMPTY; }
  cache.set(key, { raw, value });
  return value;
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === PUBLISHED_KEY || e.key === DRAFT_KEY || e.key === null) onChange();
  };
  window.addEventListener('storage', onStorage);   // other tabs and the preview iframe
  window.addEventListener(CHANGE_EVENT, onChange); // this tab
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Overrides the current visitor should see (draft inside the admin preview, published otherwise). */
function useOverrides(): Overrides {
  const serverContent = useServerContent();
  const lsOverrides = useSyncExternalStore(
    subscribe,
    () => readKey(isPreview() ? DRAFT_KEY : PUBLISHED_KEY),
    () => EMPTY,
  );
  // In preview mode, localStorage draft wins (live editing feedback).
  // On public pages, server-fetched published content is base; localStorage only
  // adds anything if someone manually wrote to it (legacy fallback).
  const serverBase = isPreview() ? serverContent.draft : serverContent.published;
  if (Object.keys(lsOverrides).length === 0) return serverBase;
  // Deep-merge: server provides the floor, localStorage adds on top
  const merged: Overrides = { ...serverBase };
  for (const page of Object.keys(lsOverrides)) {
    merged[page] = { ...(serverBase[page] ?? {}), ...lsOverrides[page] };
  }
  return merged;
}

export function mergeSection<T extends object>(defaults: T, override?: Record<string, unknown>): T {
  return override ? ({ ...defaults, ...override } as T) : defaults;
}

/** One section of one page, with the admin's changes applied. */
export function useSection<P extends PageKey, S extends keyof Content[P]>(page: P, section: S): Content[P][S] {
  const overrides = useOverrides();
  const defaults = DEFAULT_CONTENT[page][section] as unknown as object;
  return mergeSection(defaults, overrides[page]?.[section as string]) as Content[P][S];
}

/** Site-wide contact details (WhatsApp number, phone, hours…). */
export function useContact() {
  return useSection('site', 'contact');
}

/** Builds a wa.me link for the business number with an optional pre-filled message. */
export function waLink(number: string, text?: string) {
  const n = number.replace(/\D/g, '');
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** For code that runs outside React render (click handlers): the published WhatsApp number. */
export function currentWhatsApp(): string {
  if (typeof window === 'undefined') return DEFAULT_CONTENT.site.contact.whatsapp;
  const o = readKey(isPreview() ? DRAFT_KEY : PUBLISHED_KEY);
  return (o.site?.contact?.whatsapp as string) || DEFAULT_CONTENT.site.contact.whatsapp;
}

// ── Admin side ────────────────────────────────────────────────────────────────────────────────

export function readPublished(): Overrides { return readKey(PUBLISHED_KEY); }

export function readDraft(): Overrides {
  try {
    if (localStorage.getItem(DRAFT_KEY) === null) return readKey(PUBLISHED_KEY);
  } catch { /* ignore */ }
  return readKey(DRAFT_KEY);
}

function write(key: string, value: Overrides) {
  localStorage.setItem(key, JSON.stringify(value)); // may throw QuotaExceededError (large photos)
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Saves the draft. Returns an error message if the browser refused (usually storage is full). */
export function saveDraft(value: Overrides): string | null {
  try { write(DRAFT_KEY, value); return null; }
  catch { return 'This browser’s preview storage is full. Try a smaller photo, or remove one you uploaded.'; }
}

export function publishDraft(): string | null {
  try { write(PUBLISHED_KEY, readDraft()); return null; }
  catch { return 'Could not publish: this browser’s preview storage is full.'; }
}

export function discardDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Sections whose draft differs from what's published, as "page.section" ids. */
export function unpublishedSections(): string[] {
  const draft = readDraft(), pub = readPublished();
  const ids = new Set<string>();
  for (const src of [draft, pub]) for (const p of Object.keys(src)) for (const s of Object.keys(src[p] ?? {})) ids.add(`${p}.${s}`);
  return Array.from(ids).filter(id => {
    const [p, s] = id.split('.');
    return JSON.stringify(draft[p]?.[s] ?? null) !== JSON.stringify(pub[p]?.[s] ?? null);
  });
}

/** Lets admin screens re-render when the draft or published copy changes. */
export function useStoreVersion(): string {
  return useSyncExternalStore(
    subscribe,
    () => {
      try { return `${localStorage.getItem(DRAFT_KEY) ?? ''}\u0000${localStorage.getItem(PUBLISHED_KEY) ?? ''}`; }
      catch { return 'x'; }
    },
    () => 'server',
  );
}
