import { NextResponse } from 'next/server';
import { paymentsEnabled, readTxRef, verifyTransaction } from '@/lib/flutterwave';

export const dynamic = 'force-dynamic';

// Called by /checkout/complete after Flutterwave redirects back. The redirect itself can be faked,
// so we only trust what Flutterwave's API tells us about the transaction.
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
      // Money moved but not for this order as expected: the customer needs to talk to us, not retry.
      console.warn('[checkout] payment mismatch', { txRef, transactionId, got: tx.tx_ref, amount: tx.amount });
      return NextResponse.json({ paid: false, orderNumber: ref.orderNumber, error: 'Payment did not match the order.' });
    }
    return NextResponse.json({ paid, orderNumber: ref.orderNumber, amount: ref.amount, status: tx.status });
  } catch (err) {
    console.error('[checkout] verify failed', err);
    return NextResponse.json({ paid: false, orderNumber: ref.orderNumber, error: "We couldn't confirm the payment yet." }, { status: 502 });
  }
}
