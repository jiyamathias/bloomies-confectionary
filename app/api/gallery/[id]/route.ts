// PATCH  /api/gallery/[id]
// DELETE /api/gallery/[id]
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const db = getDb();
  const update: Record<string, unknown> = {};
  if ('title'     in body) update.title     = body.title;
  if ('image'     in body) update.image     = body.image;
  if ('category'  in body) update.category  = body.category;
  if ('sortOrder' in body) update.sortOrder = body.sortOrder;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.update(galleryItems).set(update as any).where(eq(galleryItems.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  revalidateTag('gallery');
  return NextResponse.json({ item: row });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const db = getDb();
  await db.delete(galleryItems).where(eq(galleryItems.id, params.id));
  revalidateTag('gallery');
  return NextResponse.json({ ok: true });
}
