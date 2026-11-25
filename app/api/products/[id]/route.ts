// GET    /api/products/[id]  — public
// PATCH  /api/products/[id]  — update (admin only)
// DELETE /api/products/[id]  — delete (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { getDb, hasDatabase } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!hasDatabase()) return NextResponse.json({ error: 'No database' }, { status: 503 });
  const db = getDb();
  const rows = await db.select().from(products).where(eq(products.id, params.id)).limit(1);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const db = getDb();
  const allowed = [
    'name','description','category','priceLabel','basePrice','unitPrice',
    'image','images','badge','badgeColor','inStock','featured','sortOrder','moq',
    'customizationOptions','designStyle','cakeColors','cakeSizes',
  ];

  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.update(products).set(update as any).where(eq(products.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  revalidateTag('products');
  return NextResponse.json({ product: row });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const db = getDb();
  await db.delete(products).where(eq(products.id, params.id));
  revalidateTag('products');
  return NextResponse.json({ ok: true });
}
