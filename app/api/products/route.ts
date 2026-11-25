// GET  /api/products?category=X  — public
// POST /api/products              — create product (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { getDb, hasDatabase } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';
import { PRODUCTS } from '@/lib/products';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') ?? undefined;

  if (!hasDatabase()) {
    const data = category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;
    return NextResponse.json({ products: data });
  }

  const db = getDb();
  const rows = category
    ? await db.select().from(products).where(eq(products.category, category)).orderBy(asc(products.sortOrder))
    : await db.select().from(products).orderBy(asc(products.sortOrder));

  return NextResponse.json({ products: rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.name || !body?.category) {
    return NextResponse.json({ error: 'id, name and category are required' }, { status: 400 });
  }

  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.insert(products).values({
    id:          body.id,
    name:        body.name,
    description: body.description ?? '',
    category:    body.category,
    priceLabel:  body.priceLabel ?? '',
    basePrice:   body.basePrice ?? null,
    unitPrice:   body.unitPrice ?? null,
    image:       body.image ?? '',
    images:      body.images ?? [],
    badge:       body.badge ?? null,
    badgeColor:  body.badgeColor ?? 'rose',
    inStock:     body.inStock ?? true,
    featured:    body.featured ?? false,
    sortOrder:   body.sortOrder ?? 0,
    moq:         body.moq ?? null,
  } as any).returning();

  revalidateTag('products');
  return NextResponse.json({ product: row }, { status: 201 });
}
