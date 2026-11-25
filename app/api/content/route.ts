// GET  /api/content?v=draft|published
// PUT  /api/content                        — save draft (admin)
// POST /api/content?action=publish|discard — (admin)
import { NextRequest, NextResponse } from 'next/server';
import { getDb, hasDatabase } from '@/lib/db';
import { siteContent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!hasDatabase()) return NextResponse.json({ data: {} });
  const v = req.nextUrl.searchParams.get('v') === 'draft' ? 'draft' : 'published';
  const db = getDb();
  const rows = await db.select().from(siteContent).where(eq(siteContent.id, v)).limit(1);
  return NextResponse.json({ data: rows[0]?.data ?? {} });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  if (!body || typeof body.data !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.insert(siteContent).values({ id: 'draft', data: body.data, updatedBy: auth.userId } as any)
    .onConflictDoUpdate({ target: siteContent.id, set: { data: body.data, updatedBy: auth.userId, updatedAt: new Date() } as any });

  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const action = req.nextUrl.searchParams.get('action');
  const db = getDb();

  if (action === 'publish') {
    const draft = await db.select().from(siteContent).where(eq(siteContent.id, 'draft')).limit(1);
    const data = draft[0]?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(siteContent).values({ id: 'published', data, updatedBy: auth.userId } as any)
      .onConflictDoUpdate({ target: siteContent.id, set: { data, updatedBy: auth.userId, updatedAt: new Date() } as any });
    revalidateTag('site-content');
    return NextResponse.json({ ok: true });
  }

  if (action === 'discard') {
    const published = await db.select().from(siteContent).where(eq(siteContent.id, 'published')).limit(1);
    const data = published[0]?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(siteContent).values({ id: 'draft', data, updatedBy: auth.userId } as any)
      .onConflictDoUpdate({ target: siteContent.id, set: { data, updatedBy: auth.userId, updatedAt: new Date() } as any });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
