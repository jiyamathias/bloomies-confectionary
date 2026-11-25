// GET  /api/settings?key=X  — public
// PUT  /api/settings?key=X  — set (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { getDb, hasDatabase } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });
  if (!hasDatabase()) return NextResponse.json({ value: null });
  const db = getDb();
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return NextResponse.json({ value: rows[0]?.value ?? null });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (body === null || !('value' in body)) {
    return NextResponse.json({ error: 'body must have a value field' }, { status: 400 });
  }

  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.insert(settings).values({ key, value: body.value } as any)
    .onConflictDoUpdate({ target: settings.key, set: { value: body.value, updatedAt: new Date() } as any });

  revalidateTag('settings');
  return NextResponse.json({ ok: true });
}
