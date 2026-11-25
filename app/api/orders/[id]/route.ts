// GET    /api/orders/[id]  — admin: returns order + items + payments
// PATCH  /api/orders/[id]  — admin: update status/note etc.
// DELETE /api/orders/[id]  — admin
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, orderItems, payments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const db = getDb();
  const orderRows = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);
  const order = orderRows[0];
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, params.id));
  const pmts  = await db.select().from(payments).where(eq(payments.orderId, params.id));

  return NextResponse.json({ order, items, payments: pmts });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const db = getDb();
  const allowed = [
    'status','note','paymentMethod','amountPaid','deliveryAddress',
    'fulfilment','dueAt','txRef','flwTransactionId','paidAt',
  ];
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.update(orders).set(update as any).where(eq(orders.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order: row });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const db = getDb();
  await db.delete(orders).where(eq(orders.id, params.id));
  return NextResponse.json({ ok: true });
}
