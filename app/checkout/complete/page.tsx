'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Smile from '@/components/Smile';
import { WAIcon } from '@/components/WhatsAppBtn';
import { PENDING_ORDER_KEY } from '@/components/CartDrawer';
import { useCart, buildWhatsAppMessage, whatsappLink, type OrderContact } from '@/lib/cart';
import { formatNaira } from '@/lib/pricing';
import type { CartItem } from '@/types';

type Pending = { txRef: string; amount: number; items: CartItem[]; contact: OrderContact };
type State =
  | { kind: 'checking' }
  | { kind: 'paid'; orderNumber: string; amount: number }
  | { kind: 'not-paid'; orderNumber?: string }
  | { kind: 'unknown'; orderNumber?: string };

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<Shell><Checking/></Shell>}>
      <Complete/>
    </Suspense>
  );
}

function Complete() {
  const params = useSearchParams();
  const { clear } = useCart();
  const [state, setState] = useState<State>({ kind: 'checking' });
  const [pending, setPending] = useState<Pending | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const txRef = params.get('tx_ref') ?? '';
    const transactionId = params.get('transaction_id') ?? '';
    const status = params.get('status') ?? '';

    let saved: Pending | null = null;
    try { saved = JSON.parse(sessionStorage.getItem(PENDING_ORDER_KEY) || 'null'); } catch { /* ignore */ }
    if (saved?.txRef === txRef) setPending(saved);

    if (!txRef || status === 'cancelled' || status === 'failed' || !transactionId) {
      setState({ kind: 'not-paid' });
      return;
    }

    fetch(`/api/checkout/verify?tx_ref=${encodeURIComponent(txRef)}&transaction_id=${encodeURIComponent(transactionId)}`)
      .then(r => r.json())
      .then(d => {
        if (d.paid) {
          setState({ kind: 'paid', orderNumber: d.orderNumber, amount: d.amount });
          clear();
          try { sessionStorage.removeItem(PENDING_ORDER_KEY); } catch { /* ignore */ }
        } else if (d.error) {
          setState({ kind: 'unknown', orderNumber: d.orderNumber });
        } else {
          setState({ kind: 'not-paid', orderNumber: d.orderNumber });
        }
      })
      .catch(() => setState({ kind: 'unknown' }));
  }, [params, clear]);

  if (state.kind === 'checking') return <Shell><Checking/></Shell>;

  if (state.kind === 'paid') {
    const message = pending
      ? buildWhatsAppMessage(pending.items, pending.contact, state.orderNumber)
      : `Hi Bloomies, I just paid online. My order number is ${state.orderNumber}.`;
    return (
      <Shell>
        <CheckCircle2 size={44} className="text-[#1F6B2E] mx-auto mb-4"/>
        <h1 className="font-luckiest tracking-[0.02em] text-[#433075] text-[2.1rem] leading-tight">Payment received</h1>
        <Smile className="w-[84px] h-auto mx-auto mt-2 text-[#433075]" tongue="#A58CF4"/>
        <p className="text-[#433075] mt-4">
          Order number <strong>{state.orderNumber}</strong> · {formatNaira(state.amount)}
        </p>
        <p className="text-[0.92rem] text-[#5E5A7C] mt-3 max-w-md mx-auto leading-relaxed">
          Thank you! Tap below to send us your order details on WhatsApp so we can confirm the date
          {pending?.contact.method === 'delivery' ? ' and delivery fee' : ''}. Your receipt is on its way to your email.
        </p>

        {pending && (
          <ul className="text-left bg-white border border-[rgba(165,140,244,0.2)] rounded-xl p-4 mt-6 space-y-1.5 text-[0.88rem] text-[#433075]">
            {pending.items.map(i => (
              <li key={i.id} className="flex justify-between gap-3">
                <span>{i.name} ×{i.qty}</span>
                {typeof i.unitPrice === 'number' && <span className="font-semibold">{formatNaira(i.unitPrice * i.qty)}</span>}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-full font-semibold text-[0.9rem] hover:bg-[#1BBE5C] transition-colors">
            <WAIcon/> Send order details
          </a>
          <Link href="/" className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-[0.9rem] border border-[rgba(67,48,117,0.25)] text-[#433075] hover:bg-[#F3F0FA] transition-colors">
            Back to home
          </Link>
        </div>
      </Shell>
    );
  }

  const unknown = state.kind === 'unknown';
  return (
    <Shell>
      <XCircle size={44} className="text-[#B42318] mx-auto mb-4"/>
      <h1 className="font-luckiest tracking-[0.02em] text-[#433075] text-[2.1rem] leading-tight">
        {unknown ? "We couldn't confirm your payment" : 'Payment not completed'}
      </h1>
      <p className="text-[0.92rem] text-[#5E5A7C] mt-4 max-w-md mx-auto leading-relaxed">
        {unknown
          ? `If money left your account, don't pay again. Message us on WhatsApp${state.orderNumber ? ` with order number ${state.orderNumber}` : ''} and we'll check it for you.`
          : 'No money was taken. Your cart is still saved, so you can try again or order on WhatsApp instead.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
        <a href={whatsappLink(`Hi Bloomies, I need help with my online payment${state.orderNumber ? ` (order ${state.orderNumber})` : ''}.`)}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-full font-semibold text-[0.9rem] hover:bg-[#1BBE5C] transition-colors">
          <WAIcon/> Chat with us
        </a>
        <Link href="/" className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-[0.9rem] border border-[rgba(67,48,117,0.25)] text-[#433075] hover:bg-[#F3F0FA] transition-colors">
          Back to home
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-[#F3F0FA] min-h-[70vh] flex items-center">
      <div className="max-w-xl mx-auto px-5 pt-32 pb-16 text-center w-full">{children}</div>
    </section>
  );
}

function Checking() {
  return (
    <div className="text-[#433075]">
      <Loader2 size={36} className="animate-spin mx-auto mb-4"/>
      <p className="font-semibold">Confirming your payment…</p>
      <p className="text-[0.85rem] text-[#5E5A7C] mt-1">This takes a few seconds. Please don&apos;t close this page.</p>
    </div>
  );
}
