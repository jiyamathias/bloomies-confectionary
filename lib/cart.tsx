'use client';
import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import type { CartItem } from '@/types';
import { formatNaira } from '@/lib/pricing';

export const WHATSAPP_NUMBER = '2348181154270';
const STORAGE_KEY = 'bloomies_cart_v1';

interface CartCtx {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, 'qty'>) => void;
  remove: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

function readStored(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(i => i && typeof i.id === 'string' && i.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const loaded = useRef(false);

  // Keep the cart across reloads and the trip to the payment page and back.
  useEffect(() => {
    setItems(readStored());
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  }, [items]);

  const add = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, add, remove, changeQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}

/** Total in naira if every item can be paid online, otherwise null. */
export function payableTotal(items: CartItem[]): number | null {
  if (!items.length || items.some(i => typeof i.unitPrice !== 'number')) return null;
  return items.reduce((s, i) => s + (i.unitPrice as number) * i.qty, 0);
}

export interface OrderContact {
  name: string;
  phone: string;
  method: 'pickup' | 'delivery';
  address?: string;
}

export function buildWhatsAppMessage(items: CartItem[], c: OrderContact, paidRef?: string): string {
  const lines = items.map(i => {
    const price = typeof i.unitPrice === 'number' ? formatNaira(i.unitPrice * i.qty) : i.price;
    const extra = i.details ? `\n${i.details.split('\n').map(l => `   ${l}`).join('\n')}` : '';
    return `• ${i.name} ×${i.qty} (${price})${extra}`;
  }).join('\n');
  const total = payableTotal(items);
  const fulfilment = c.method === 'delivery' ? `Delivery to: ${c.address || 'TBD'}` : 'Pickup at Mgbuoba';

  return (paidRef ? `🌸 *Paid Order ${paidRef} — Bloomies Website*\n\n` : `🌸 *New Order — Bloomies Website*\n\n`) +
    `👤 Name: ${c.name || 'Customer'}\n📱 Phone: ${c.phone || '—'}\n🚚 ${fulfilment}\n\n` +
    `🛒 *Order:*\n${lines}\n\n` +
    (total !== null ? `💰 Items total: ${formatNaira(total)}\n\n` : '') +
    (paidRef
      ? `I've paid online. Payment reference: ${paidRef}. Please confirm the delivery fee if any. Thank you!`
      : `Kindly confirm availability and total. Thank you!`);
}

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
