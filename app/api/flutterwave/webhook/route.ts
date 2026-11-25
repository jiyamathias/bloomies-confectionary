// Flutterwave webhook — receives payment events server-to-server.
// Configure in your Flutterwave dashboard: Webhook URL = https://yourdomain/api/flutterwave/webhook
// Set FLW_SECRET_HASH in .env.local to match the "Secret Hash" in the dashboard.
import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/flutterwave';
import { getDb, hasDatabase } from '@/lib/db';
import { orders, payments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const hash = req.headers.get('verif-hash');
  const expectedHash = process.env.FLW_SECRET_HASH;

  if (!expectedHash || hash !== expectedHash) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try { event = await req.json(); }
  catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }

  if (event.event !== 'charge.completed') {
    return NextResponse.json({ ok: true }); // ignore other events
  }

  const data = event.data as Record<string, unknown> | undefined;
  if (!data) return NextResponse.json({ ok: true });

  const txRef        = String(data.tx_ref ?? '');
  const transactionId = String(data.id ?? '');
  const status       = String(data.status ?? '');
  const currency     = String(data.currency ?? '');
  const amount       = Number(data.amount ?? 0);

  if (status !== 'successful' || currency !== 'NGN') {
    return NextResponse.json({ ok: true });
  }

  if (!hasDatabase()) return NextResponse.json({ ok: true });

  try {
    // Always re-verify via API — never trust webhook body alone
    const tx = await verifyTransaction(transactionId);
    if (tx.status !== 'successful' || tx.tx_ref !== txRef || tx.currency !== 'NGN') {
      return NextResponse.json({ ok: true });
    }

    const db = getDb();
    const orderRows = await db.select({ id: orders.id, paidAt: orders.paidAt, total: orders.total })
      .from(orders).where(eq(orders.txRef, txRef)).limit(1);
    const order = orderRows[0];

    if (order && !order.paidAt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.update(orders).set({
        status:           'confirmed',
        flwTransactionId: transactionId,
        paidAt:           new Date(),
        amountPaid:       order.total,
        updatedAt:        new Date(),
      } as any).where(eq(orders.id, order.id));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.insert(payments).values({
        orderId:    order.id,
        amount:     order.total,
        method:     'online',
        reference:  transactionId,
        receivedAt: new Date(),
      } as any).onConflictDoNothing();
    }
  } catch (err) {
    console.error('[webhook] processing error:', err);
    // Return 200 so Flutterwave doesn't retry endlessly
  }

  return NextResponse.json({ ok: true });
}
