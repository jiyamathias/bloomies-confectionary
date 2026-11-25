// GET  /api/gallery   — public
// POST /api/gallery   — create (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { getDb, hasDatabase } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';
import { GALLERY } from '@/lib/products';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET() {
  if (!hasDatabase()) return NextResponse.json({ gallery: GALLERY });
  const db = getDb();
  const rows = await db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder));
  return NextResponse.json({ gallery: rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.image || !body?.category) {
    return NextResponse.json({ error: 'title, image and category are required' }, { status: 400 });
  }

  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.insert(galleryItems).values({
    title:     body.title,
    image:     body.image,
    category:  body.category,
    sortOrder: body.sortOrder ?? 0,
  } as any).returning();

  revalidateTag('gallery');
  return NextResponse.json({ item: row }, { status: 201 });
}
