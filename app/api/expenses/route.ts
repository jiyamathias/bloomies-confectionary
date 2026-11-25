// GET  /api/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD  — admin
// POST /api/expenses                                 — create (admin)
import { NextRequest, NextResponse } from 'next/server';
import { getDb, hasDatabase } from '@/lib/db';
import { expenses } from '@/lib/db/schema';
import { and, gte, lte, desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const unauth = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();
  if (!hasDatabase()) return NextResponse.json({ expenses: [] });

  const sp   = req.nextUrl.searchParams;
  const from = sp.get('from');
  const to   = sp.get('to');

  const db = getDb();
  const wheres = [];
  if (from) wheres.push(gte(expenses.date, from));
  if (to)   wheres.push(lte(expenses.date, to));

  const rows = await db
    .select()
    .from(expenses)
    .where(wheres.length ? and(...wheres) : undefined)
    .orderBy(desc(expenses.date));

  return NextResponse.json({ expenses: rows });
}

const CreateSchema = z.object({
  date:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category:      z.string().min(1),
  description:   z.string().min(1),
  amount:        z.number().int().positive(),
  paymentMethod: z.string().default('transfer'),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return unauth();

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.insert(expenses).values({
    ...parsed.data,
    createdBy: auth.userId,
  } as any).returning();

  return NextResponse.json({ expense: row }, { status: 201 });
}
