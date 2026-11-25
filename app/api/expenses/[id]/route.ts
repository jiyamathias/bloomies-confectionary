// PATCH  /api/expenses/[id]
// DELETE /api/expenses/[id]
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { expenses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const db = getDb();
  const allowed = ['date','category','description','amount','paymentMethod'];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.update(expenses).set(update as any).where(eq(expenses.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ expense: row });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const db = getDb();
  await db.delete(expenses).where(eq(expenses.id, params.id));
  return NextResponse.json({ ok: true });
}
