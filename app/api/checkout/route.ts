import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products';
import { onlineUnitPrice, quoteReason, formatNaira, MAX_CANDLES } from '@/lib/pricing';
import { createPaymentLink, createTxRef, paymentsEnabled } from '@/lib/flutterwave';
import type { CakeOptions } from '@/types';

export const dynamic = 'force-dynamic';

const MAX_ITEMS = 30;
const MAX_QTY = 50;

/** Lets the cart know whether to show "Pay now". */
export function GET() {
  return NextResponse.json({ enabled: paymentsEnabled() });
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function parseOptions(v: unknown): CakeOptions {
  if (!v || typeof v !== 'object') return {};
  const o = v as Record<string, unknown>;
  return {
    size: typeof o.size === 'string' ? o.size.slice(0, 60) : undefined,
    icing: o.icing === 'whipped-cream' ? 'whipped-cream' : 'buttercream',
    flavours: Array.isArray(o.flavours) ? o.flavours.filter(f => typeof f === 'string').slice(0, 10) as string[] : [],
    card: o.card === true,
    chamdor: o.chamdor === true,
    candles: Number.isInteger(o.candles) ? Math.min(Math.max(o.candles as number, 0), MAX_CANDLES) : 0,
  };
}

export async function POST(req: Request) {
  if (!paymentsEnabled()) {
    return NextResponse.json({ error: "Online payment isn't available right now. Please order on WhatsApp." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return bad('Invalid request.'); }

  // Customer
  const c = (body.customer ?? {}) as Record<string, unknown>;
  const name = str(c.name, 80);
  const email = str(c.email, 120);
  const phone = str(c.phone, 30);
  const method = c.method === 'delivery' ? 'delivery' : 'pickup';
  const address = str(c.address, 300);
  if (!name) return bad('Please enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Please enter a valid email address.');
  if (phone.replace(/\D/g, '').length < 10) return bad('Please enter a valid phone number.');
  if (method === 'delivery' && !address) return bad('Please enter a delivery address.');

  // Items: the price always comes from our catalogue, never from the browser.
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS + 1) : [];
  if (!rawItems.length) return bad('Your cart is empty.');
  if (rawItems.length > MAX_ITEMS) return bad('That order is too large for online payment. Please order on WhatsApp.');

  const lines: string[] = [];
  let total = 0;
  for (const raw of rawItems as Record<string, unknown>[]) {
    const productId = str(raw?.productId, 60);
    const qty = Number.isInteger(raw?.qty) ? (raw.qty as number) : 0;
    if (qty < 1 || qty > MAX_QTY) return bad('Please check the quantities in your cart.');
    const options = parseOptions(raw?.options);
    const product = PRODUCTS.find(p => p.id === productId);
    const unit = onlineUnitPrice(productId, options);
    if (unit === null) return bad(quoteReason(product, options) ?? 'An item in your cart needs a quote. Please order on WhatsApp.');
    total += unit * qty;
    const details = str(raw?.details, 600).replace(/\s*\n\s*/g, '; ');
    lines.push(`${product!.name} x${qty} = ${formatNaira(unit * qty)}${details ? ` (${details})` : ''}`);
  }

  const txRef = createTxRef(total);
  const origin = process.env.SITE_URL || new URL(req.url).origin;
  const order = lines.join(' | ');

  try {
    const link = await createPaymentLink({
      txRef,
      amount: total,
      redirectUrl: `${origin}/checkout/complete`,
      customer: { name, email, phone },
      description: `${lines.length} item${lines.length > 1 ? 's' : ''} from Bloomies`,
      logoUrl: `${origin}/images/bloomies-logo.jpg`,
      // Shows on the transaction in the Flutterwave dashboard, so the bakery can see what was ordered.
      meta: {
        customer_phone: phone,
        fulfilment: method === 'delivery' ? `Delivery: ${address}` : 'Pickup at Mgbuoba',
        order: order.slice(0, 1800),
      },
    });
    return NextResponse.json({ link, txRef, amount: total });
  } catch (err) {
    console.error('[checkout] could not create Flutterwave payment', err);
    return NextResponse.json({ error: "We couldn't start the payment. Please try again, or order on WhatsApp." }, { status: 502 });
  }
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
