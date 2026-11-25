// GET  /api/orders  — admin only, paginated + filtered
// POST /api/orders  — create (website checkout or admin)
import { NextRequest, NextResponse } from 'next/server';
import { getDb, hasDatabase } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { and, eq, desc, gte, lte } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();
  if (!hasDatabase()) return NextResponse.json({ orders: [] });

  const sp      = req.nextUrl.searchParams;
  const from    = sp.get('from');
  const to      = sp.get('to');
  const status  = sp.get('status');
  const channel = sp.get('channel');
  const limit   = Math.min(Number(sp.get('limit') ?? 200), 500);

  const db = getDb();
  const wheres = [];
  if (from)    wheres.push(gte(orders.createdAt, new Date(from)));
  if (to)      wheres.push(lte(orders.createdAt, new Date(to + 'T23:59:59Z')));
  if (status)  wheres.push(eq(orders.status, status));
  if (channel) wheres.push(eq(orders.channel, channel));

  const rows = await db
    .select()
    .from(orders)
    .where(wheres.length ? and(...wheres) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(limit);

  return NextResponse.json({ orders: rows });
}

const CreateOrderSchema = z.object({
  customerName:    z.string().default(''),
  customerPhone:   z.string().default(''),
  customerEmail:   z.string().optional(),
  channel:         z.string().default('website'),
  fulfilment:      z.string().default('pickup'),
  deliveryAddress: z.string().optional(),
  subtotal:        z.number().int().default(0),
  deliveryFee:     z.number().int().default(0),
  discount:        z.number().int().default(0),
  total:           z.number().int().default(0),
  paymentMethod:   z.string().default('online'),
  note:            z.string().optional(),
  source:          z.string().default('website'),
  txRef:           z.string().optional(),
  dueAt:           z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    name:      z.string(),
    category:  z.string().default('other'),
    qty:       z.number().int().min(1),
    unitPrice: z.number().int(),
    details:   z.string().optional(),
    options:   z.record(z.unknown()).optional(),
  })).default([]),
});

export async function POST(req: NextRequest) {
  if (!hasDatabase()) return NextResponse.json({ error: 'No database' }, { status: 503 });
  const body = await req.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const db = getDb();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order] = await db.insert(orders).values({
    customerName:    d.customerName,
    customerPhone:   d.customerPhone,
    customerEmail:   d.customerEmail,
    channel:         d.channel,
    fulfilment:      d.fulfilment,
    deliveryAddress: d.deliveryAddress,
    subtotal:        d.subtotal,
    deliveryFee:     d.deliveryFee,
    discount:        d.discount,
    total:           d.total,
    paymentMethod:   d.paymentMethod,
    note:            d.note,
    source:          d.source,
    txRef:           d.txRef,
    dueAt:           d.dueAt ? new Date(d.dueAt) : new Date(),
  } as any).returning();

  if (d.items.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(orderItems).values(d.items.map(it => ({
      orderId:   order.id,
      productId: it.productId,
      name:      it.name,
      category:  it.category,
      qty:       it.qty,
      unitPrice: it.unitPrice,
      details:   it.details,
      options:   it.options ?? null,
    })) as any);
  }

  return NextResponse.json({ order }, { status: 201 });
}
