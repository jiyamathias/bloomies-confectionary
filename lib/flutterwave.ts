// Server-only: imported by API routes. Never import this from a client component.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// Flutterwave Standard (v3 hosted checkout). Server-only: uses the secret key.
const API_BASE = process.env.FLW_API_BASE || 'https://api.flutterwave.com/v3';

export function paymentsEnabled() {
  return Boolean(process.env.FLW_SECRET_KEY);
}

function secret() {
  const key = process.env.FLW_SECRET_KEY;
  if (!key) throw new Error('FLW_SECRET_KEY is not set');
  return key;
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('hex').slice(0, 16);
}

/**
 * Payment reference that carries the expected amount and a signature,
 * e.g. BLM-K7P2QX-24500-3f9a…  so we can verify a payment without a database.
 */
export function createTxRef(amount: number) {
  const code = (Date.now().toString(36).slice(-3) + randomBytes(3).toString('hex').slice(0, 3)).toUpperCase();
  const base = `BLM-${code}-${amount}`;
  return `${base}-${sign(base)}`;
}

export function readTxRef(txRef: string): { orderNumber: string; amount: number } | null {
  const m = /^(BLM-([A-Z0-9]{6})-(\d{1,9}))-([a-f0-9]{16})$/.exec(txRef);
  if (!m) return null;
  const expected = Buffer.from(sign(m[1]));
  const given = Buffer.from(m[4]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return { orderNumber: `BLM-${m[2]}`, amount: Number(m[3]) };
}

async function flw<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secret()}`, 'Content-Type': 'application/json', ...init?.headers },
    cache: 'no-store',
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status !== 'success') {
    throw new Error(`Flutterwave ${path} failed (${res.status}): ${body.message ?? 'no message'}`);
  }
  return body as T;
}

export interface CreatePaymentInput {
  txRef: string;
  amount: number;
  redirectUrl: string;
  customer: { name: string; email: string; phone: string };
  description: string;
  logoUrl?: string;
  meta: Record<string, string>;
}

export async function createPaymentLink(i: CreatePaymentInput): Promise<string> {
  const body = await flw<{ data: { link: string } }>('/payments', {
    method: 'POST',
    body: JSON.stringify({
      tx_ref: i.txRef,
      amount: i.amount,
      currency: 'NGN',
      redirect_url: i.redirectUrl,
      payment_options: 'card, banktransfer, ussd',
      customer: { email: i.customer.email, name: i.customer.name, phonenumber: i.customer.phone },
      customizations: { title: 'Bloomies Confectioneries', description: i.description, logo: i.logoUrl },
      meta: i.meta,
    }),
  });
  return body.data.link;
}

export interface VerifiedTransaction {
  status: string;
  tx_ref: string;
  amount: number;
  currency: string;
  customer?: { name?: string; email?: string };
}

export async function verifyTransaction(transactionId: string): Promise<VerifiedTransaction> {
  const body = await flw<{ data: VerifiedTransaction }>(`/transactions/${encodeURIComponent(transactionId)}/verify`);
  return body.data;
}
