// Server-only: fetch published/draft CMS content from the DB (or return empty).
// Use `unstable_cache` so public pages are cached between requests.
import { unstable_cache } from 'next/cache';
import { getDb, hasDatabase } from '@/lib/db';
import { siteContent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Overrides } from '@/lib/content/store';

async function _fetchContent(id: 'published' | 'draft'): Promise<Overrides> {
  if (!hasDatabase()) return {};
  try {
    const db = getDb();
    const rows = await db.select({ data: siteContent.data }).from(siteContent).where(eq(siteContent.id, id)).limit(1);
    return (rows[0]?.data as Overrides) ?? {};
  } catch {
    return {};
  }
}

export const fetchPublishedContent = unstable_cache(
  () => _fetchContent('published'),
  ['site-content-published'],
  { tags: ['site-content'], revalidate: 60 }
);

export const fetchDraftContent = unstable_cache(
  () => _fetchContent('draft'),
  ['site-content-draft'],
  { tags: ['site-content-draft'], revalidate: false }
);
