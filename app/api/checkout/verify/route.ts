import { NextResponse } from 'next/server';
import { paymentsEnabled, readTxRef, verifyTransaction } from '@/lib/flutterwave';
import { getDb, hasDatabase } from '@/lib/db';
import { orders, payments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const txRef = url.searchParams.get('tx_ref') ?? '';
  const transactionId = url.searchParams.get('transaction_id') ?? '';

  if (!paymentsEnabled()) return NextResponse.json({ paid: false, error: 'Payments are not set up.' }, { status: 503 });

  const ref = readTxRef(txRef);
  if (!ref) return NextResponse.json({ paid: false, error: 'Unknown payment reference.' }, { status: 400 });
  if (!/^\d{1,20}$/.test(transactionId)) {
    return NextResponse.json({ paid: false, orderNumber: ref.orderNumber, status: 'not_completed' });
  }

  try {
    const tx = await verifyTransaction(transactionId);
    const matches = tx.tx_ref === txRef && tx.currency === 'NGN' && Number(tx.amount) >= ref.amount;
    const paid = tx.status === 'successful' && matches;

    if (tx.status === 'successful' && !matches) {
      console.warn('[checkout] payment mismatch', { txRef, transactionId, got: tx.tx_ref, amount: tx.amount });
      return NextResponse.json({ paid: false, orderNumber: ref.orderNumber, error: 'Payment did not match the order.' });
    }

    // Persist confirmed payment idempotently
    if (paid && hasDatabase()) {
      try {
        const db = getDb();
        const orderRows = await db.select({ id: orders.id, paidAt: orders.paidAt })
          .from(orders).where(eq(orders.txRef, txRef)).limit(1);
        const order = orderRows[0];

        if (order && !order.paidAt) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await db.update(orders).set({
            status:           'confirmed',
            flwTransactionId: transactionId,
            paidAt:           new Date(),
            amountPaid:       ref.amount,
            updatedAt:        new Date(),
          } as any).where(eq(orders.id, order.id));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await db.insert(payments).values({
            orderId:    order.id,
            amount:     ref.amount,
            method:     'online',
            reference:  transactionId,
            receivedAt: new Date(),
          } as any).onConflictDoNothing();
        }
      } catch (err) {
        console.error('[verify] DB update failed:', err);
        // Don't surface DB errors to the customer — payment already confirmed by FLW
      }
    }

    return NextResponse.json({ paid, orderNumber: ref.orderNumber, amount: ref.amount, status: tx.status });
  } catch (err) {
    console.error('[checkout] verify failed', err);
    return NextResponse.json({ paid: false, orderNumber: ref.orderNumber, error: "We couldn't confirm the payment yet." }, { status: 502 });
  }
}
