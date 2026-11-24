'use client';
import { useEffect } from 'react';
import { isPreview } from '@/lib/content/store';

// Only active inside the admin's live preview (?cms-preview=1). Lets the editor scroll the page
// to the section being edited and briefly highlight it.
export default function CmsPreviewBridge() {
  useEffect(() => {
    if (!isPreview()) return;
    try { sessionStorage.setItem('bloomies_cms_preview', '1'); } catch { /* ignore */ }

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'cms:focus') return;
      const el = document.querySelector<HTMLElement>(`[data-cms="${CSS.escape(String(e.data.id))}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
      el.style.transition = 'box-shadow 0.3s ease';
      el.style.boxShadow = '0 0 0 3px #A58CF4, 0 0 0 8px rgba(165,140,244,0.25)';
      window.setTimeout(() => { el.style.boxShadow = ''; }, 1400);
    };
    window.addEventListener('message', onMessage);
    window.parent?.postMessage({ type: 'cms:ready' }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  return null;
}
